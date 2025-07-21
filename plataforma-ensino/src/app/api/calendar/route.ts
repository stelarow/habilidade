import { createClient } from '@/lib/supabase/server';
import { verifySession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

const CalendarQuerySchema = z.object({
  teacherId: z.string().uuid().optional(),
  weekStart: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await verifySession();
    if (!session.isAuthenticated || !session.user || !session.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validar query parameters
    const { searchParams } = new URL(request.url);
    const query = CalendarQuerySchema.parse({
      teacherId: searchParams.get('teacherId') || undefined,
      weekStart: searchParams.get('weekStart') || undefined,
    });

    const supabase = createClient();

    // Query principal - SIMPLES, sem view materializada
    let queryBuilder = supabase
      .from('class_schedules')
      .select(`
        id,
        enrollment_id,
        teacher_id,
        created_at,
        schedule_slots (
          day_of_week,
          start_time,
          end_time,
          slot_label
        ),
        enrollments (
          user_id,
          start_date,
          end_date,
          course:courses (
            title,
            duration_months
          ),
          user:users (
            email,
            full_name
          )
        )
      `);

    // Filtrar por professor se especificado
    if (query.teacherId) {
      queryBuilder = queryBuilder.eq('teacher_id', query.teacherId);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Transformar dados para formato simples
    const formattedData = data.map(schedule => ({
      id: schedule.id,
      teacherId: schedule.teacher_id,
      studentEmail: schedule.enrollments?.user?.email,
      studentName: schedule.enrollments?.user?.full_name,
      courseName: schedule.enrollments?.course?.title,
      dayOfWeek: schedule.schedule_slots?.day_of_week,
      startTime: schedule.schedule_slots?.start_time,
      endTime: schedule.schedule_slots?.end_time,
      slotLabel: schedule.schedule_slots?.slot_label,
      startDate: schedule.enrollments?.start_date,
      endDate: schedule.enrollments?.end_date,
      createdAt: schedule.created_at,
    }));

    return NextResponse.json({ data: formattedData });

  } catch (error) {
    console.error('API error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await verifySession();
    if (!session.isAuthenticated || !session.user || !session.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const CreateScheduleSchema = z.object({
      enrollmentId: z.string().uuid(),
      scheduleSlotId: z.string().uuid(),
    });

    const { enrollmentId, scheduleSlotId } = CreateScheduleSchema.parse(body);

    const supabase = createClient();

    // Buscar dados da matrícula para obter teacher_id
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('teacher_id, course:courses(instructor_id, instructor:instructors(user_id))')
      .eq('id', enrollmentId)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Obter teacher_id: primeiro da matrícula, senão do curso
    let teacherId = enrollment.teacher_id;
    if (!teacherId && enrollment.course?.instructor?.user_id) {
      teacherId = enrollment.course.instructor.user_id;
    }
    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher not found for this enrollment' }, { status: 400 });
    }

    // Verificar disponibilidade (limite de 3 alunos por slot e professor)
    const { count } = await supabase
      .from('class_schedules')
      .select('*', { count: 'exact', head: true })
      .eq('schedule_slot_id', scheduleSlotId)
      .eq('teacher_id', teacherId);

    if (count && count >= 3) {
      return NextResponse.json({ 
        error: 'Schedule slot full', 
        message: 'Este horário já está lotado (máximo 3 alunos)' 
      }, { status: 400 });
    }

    // Verificar se já existe agendamento para esta matrícula
    const { data: existingSchedule } = await supabase
      .from('class_schedules')
      .select('id')
      .eq('enrollment_id', enrollmentId)
      .eq('schedule_slot_id', scheduleSlotId)
      .single();

    if (existingSchedule) {
      return NextResponse.json({ 
        error: 'Schedule already exists',
        message: 'Já existe um agendamento para esta matrícula neste horário'
      }, { status: 409 });
    }

    // Criar agendamento
    const { data, error } = await supabase
      .from('class_schedules')
      .insert({
        enrollment_id: enrollmentId,
        teacher_id: teacherId,
        schedule_slot_id: scheduleSlotId,
      })
      .select(`
        id,
        enrollment_id,
        teacher_id,
        created_at,
        schedule_slots (
          day_of_week,
          start_time,
          end_time,
          slot_label
        ),
        enrollments (
          course:courses (title),
          user:users (email, full_name)
        )
      `)
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ 
        error: 'Failed to create schedule',
        message: 'Erro ao criar agendamento' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      data,
      message: 'Agendamento criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}