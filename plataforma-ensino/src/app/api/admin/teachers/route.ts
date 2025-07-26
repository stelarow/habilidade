import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/teachers
 * Lista todos os professores com informações de disponibilidade
 */
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verificar autenticação e permissão de admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Verificar se é admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem acessar este recurso.' },
        { status: 403 }
      );
    }

    // Buscar todos os professores com informações de disponibilidade
    const { data: teachers, error: teachersError } = await supabase
      .from('instructors')
      .select(`
        id,
        user_id,
        bio,
        expertise,
        rating,
        total_reviews,
        created_at,
        users!inner(
          full_name,
          email,
          avatar_url,
          role
        )
      `)
      .order('users(full_name)');

    if (teachersError) {
      console.error('Erro ao buscar professores:', teachersError);
      return NextResponse.json(
        { error: 'Erro ao buscar professores' },
        { status: 500 }
      );
    }

    // Para cada professor, buscar estatísticas de disponibilidade
    const teachersWithAvailability = await Promise.all(
      teachers.map(async (teacher) => {
        // Contar slots de disponibilidade
        const { data: availabilitySlots, error: availabilityError } = await supabase
          .from('teacher_availability')
          .select('id, day_of_week, start_time, end_time, max_students, is_active')
          .eq('teacher_id', teacher.id);

        if (availabilityError) {
          console.error(`Erro ao buscar disponibilidade do professor ${teacher.id}:`, availabilityError);
        }

        // Contar agendamentos ativos
        const { data: activeSchedules, error: schedulesError } = await supabase
          .from('student_schedules')
          .select('id')
          .eq('instructor_id', teacher.user_id);

        if (schedulesError) {
          console.error(`Erro ao buscar agendamentos do professor ${teacher.id}:`, schedulesError);
        }

        const totalSlots = availabilitySlots?.length || 0;
        const activeSlots = availabilitySlots?.filter(slot => slot.is_active).length || 0;
        const totalCapacity = availabilitySlots?.reduce((sum, slot) => sum + (slot.max_students || 0), 0) || 0;
        const currentBookings = activeSchedules?.length || 0;

        return {
          id: teacher.id,
          userId: teacher.user_id,
          name: teacher.users.full_name,
          email: teacher.users.email,
          avatarUrl: teacher.users.avatar_url,
          bio: teacher.bio,
          expertise: teacher.expertise,
          rating: teacher.rating,
          totalReviews: teacher.total_reviews,
          createdAt: teacher.created_at,
          availability: {
            totalSlots,
            activeSlots,
            inactiveSlots: totalSlots - activeSlots,
            totalCapacity,
            currentBookings,
            availableSpots: totalCapacity - currentBookings,
            utilizationRate: totalCapacity > 0 ? Math.round((currentBookings / totalCapacity) * 100) : 0,
            hasScheduleConfigured: totalSlots > 0,
            daysConfigured: availabilitySlots ? 
              [...new Set(availabilitySlots.map(slot => slot.day_of_week))].length : 0
          }
        };
      })
    );

    // Calcular estatísticas gerais
    const stats = {
      totalTeachers: teachersWithAvailability.length,
      teachersWithSchedule: teachersWithAvailability.filter(t => t.availability.hasScheduleConfigured).length,
      teachersWithoutSchedule: teachersWithAvailability.filter(t => !t.availability.hasScheduleConfigured).length,
      totalAvailableSlots: teachersWithAvailability.reduce((sum, t) => sum + t.availability.activeSlots, 0),
      totalCapacity: teachersWithAvailability.reduce((sum, t) => sum + t.availability.totalCapacity, 0),
      totalBookings: teachersWithAvailability.reduce((sum, t) => sum + t.availability.currentBookings, 0),
      overallUtilization: 0
    };

    if (stats.totalCapacity > 0) {
      stats.overallUtilization = Math.round((stats.totalBookings / stats.totalCapacity) * 100);
    }

    const response = {
      teachers: teachersWithAvailability,
      statistics: stats,
      metadata: {
        fetched_at: new Date().toISOString(),
        total_count: teachersWithAvailability.length
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erro ao buscar professores:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}