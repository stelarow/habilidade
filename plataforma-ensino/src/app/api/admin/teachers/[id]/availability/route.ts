import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for authentication and database queries
export const dynamic = 'force-dynamic';

interface TimeSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxStudents: number;
  isActive: boolean;
  currentBookings: number;
  availableSpots: number;
}

interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  slots: TimeSlot[];
  totalCapacity: number;
  totalBooked: number;
  utilizationRate: number;
}

/**
 * GET /api/admin/teachers/[id]/availability
 * Retorna a disponibilidade detalhada de um professor específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const teacherId = params.id;

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

    // Buscar informações do professor
    const { data: instructor, error: instructorError } = await supabase
      .from('instructors')
      .select(`
        id,
        user_id,
        bio,
        expertise,
        rating,
        total_reviews,
        users!inner(
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('id', teacherId)
      .single();

    if (instructorError || !instructor) {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      );
    }

    // Buscar disponibilidade do professor
    const { data: availability, error: availabilityError } = await supabase
      .from('teacher_availability')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('day_of_week')
      .order('start_time');

    if (availabilityError) {
      console.error('Erro ao buscar disponibilidade:', availabilityError);
      return NextResponse.json(
        { error: 'Erro ao buscar disponibilidade' },
        { status: 500 }
      );
    }

    // Buscar agendamentos atuais para calcular ocupação
    const { data: schedules, error: schedulesError } = await supabase
      .from('student_schedules')
      .select(`
        id,
        day_of_week,
        start_time,
        end_time,
        enrollment_id,
        enrollments!inner(
          id,
          user_id,
          status,
          users!inner(
            full_name,
            email
          )
        )
      `)
      .eq('instructor_id', instructor.user_id);

    if (schedulesError) {
      console.error('Erro ao buscar agendamentos:', schedulesError);
    }

    // Processar dados por dia da semana
    const daysOfWeek = [
      { value: 0, name: 'Domingo', short: 'Dom' },
      { value: 1, name: 'Segunda-feira', short: 'Seg' },
      { value: 2, name: 'Terça-feira', short: 'Ter' },
      { value: 3, name: 'Quarta-feira', short: 'Qua' },
      { value: 4, name: 'Quinta-feira', short: 'Qui' },
      { value: 5, name: 'Sexta-feira', short: 'Sex' },
      { value: 6, name: 'Sábado', short: 'Sáb' }
    ];

    // Agrupar slots por dia e calcular ocupação
    const scheduleByDay: DaySchedule[] = daysOfWeek.map(day => {
      const daySlots = availability?.filter(slot => slot.day_of_week === day.value) || [];
      
      const processedSlots: TimeSlot[] = daySlots.map(slot => {
        // Contar quantos agendamentos existem para este slot
        const bookings = schedules?.filter(schedule => 
          schedule.day_of_week === slot.day_of_week &&
          schedule.start_time === slot.start_time &&
          schedule.end_time === slot.end_time &&
          schedule.enrollments?.status === 'active'
        ) || [];

        const currentBookings = bookings.length;
        const availableSpots = slot.max_students - currentBookings;

        return {
          id: slot.id,
          dayOfWeek: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time,
          maxStudents: slot.max_students,
          isActive: slot.is_active,
          currentBookings,
          availableSpots: Math.max(0, availableSpots)
        };
      });

      const totalCapacity = processedSlots.reduce((sum, slot) => sum + slot.maxStudents, 0);
      const totalBooked = processedSlots.reduce((sum, slot) => sum + slot.currentBookings, 0);
      const utilizationRate = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

      return {
        dayOfWeek: day.value,
        dayName: day.name,
        slots: processedSlots,
        totalCapacity,
        totalBooked,
        utilizationRate
      };
    });

    // Calcular estatísticas gerais
    const totalSlots = availability?.length || 0;
    const activeSlots = availability?.filter(slot => slot.is_active).length || 0;
    const totalCapacity = availability?.reduce((sum, slot) => sum + slot.max_students, 0) || 0;
    const totalBookings = schedules?.filter(s => s.enrollments?.status === 'active').length || 0;
    const overallUtilization = totalCapacity > 0 ? Math.round((totalBookings / totalCapacity) * 100) : 0;

    // Identificar horários mais e menos ocupados
    const allSlots = scheduleByDay.flatMap(day => day.slots);
    const slotOccupancy = allSlots.map(slot => ({
      time: `${slot.startTime} - ${slot.endTime}`,
      utilizationRate: slot.maxStudents > 0 ? Math.round((slot.currentBookings / slot.maxStudents) * 100) : 0
    }));

    const mostOccupied = slotOccupancy.sort((a, b) => b.utilizationRate - a.utilizationRate).slice(0, 3);
    const leastOccupied = slotOccupancy.sort((a, b) => a.utilizationRate - b.utilizationRate).slice(0, 3);

    const response = {
      teacher: {
        id: instructor.id,
        userId: instructor.user_id,
        name: instructor.users.full_name,
        email: instructor.users.email,
        avatarUrl: instructor.users.avatar_url,
        bio: instructor.bio,
        expertise: instructor.expertise,
        rating: instructor.rating,
        totalReviews: instructor.total_reviews
      },
      schedule: scheduleByDay,
      statistics: {
        totalSlots,
        activeSlots,
        inactiveSlots: totalSlots - activeSlots,
        totalCapacity,
        totalBookings,
        availableSpots: totalCapacity - totalBookings,
        overallUtilization,
        workingDays: [...new Set(availability?.map(slot => slot.day_of_week))].length,
        averageSlotsPerDay: totalSlots > 0 ? Math.round(totalSlots / 6) : 0
      },
      insights: {
        mostOccupiedSlots: mostOccupied,
        leastOccupiedSlots: leastOccupied,
        peakDays: scheduleByDay
          .filter(day => day.totalCapacity > 0)
          .sort((a, b) => b.utilizationRate - a.utilizationRate)
          .slice(0, 3)
          .map(day => ({
            dayName: day.dayName,
            utilizationRate: day.utilizationRate
          }))
      },
      metadata: {
        fetched_at: new Date().toISOString()
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erro ao buscar disponibilidade do professor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}