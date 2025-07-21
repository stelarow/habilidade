import { createClient } from '@/lib/supabase/server';
import { verifySession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { QueryData } from '@supabase/supabase-js';

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

    // First, let's do a simple query to see what data we have
    console.log('Testing basic query first...');
    const { data: basicData, error: basicError } = await supabase
      .from('class_schedules')
      .select('*')
      .limit(5);
    
    if (basicError) {
      console.error('Basic query error:', basicError);
    } else {
      console.log('Basic class_schedules data:', JSON.stringify(basicData, null, 2));
    }

    // Query principal com tipos corretos - simplified joins
    const calendarQuery = supabase
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
          courses (
            title
          ),
          users (
            email,
            full_name
          )
        )
      `);

    // Usar QueryData para inferir tipos corretos
    type CalendarQueryResult = QueryData<typeof calendarQuery>;

    // Aplicar filtros se necessário
    let queryBuilder = calendarQuery;

    // Filtrar por professor se especificado
    if (query.teacherId) {
      queryBuilder = queryBuilder.eq('teacher_id', query.teacherId);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Debug: Log raw data
    console.log('=== Calendar API Debug ===');
    console.log('Raw data count:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('First raw item:', JSON.stringify(data[0], null, 2));
    }

    // Agora os tipos são corretamente inferidos como CalendarQueryResult
    const typedData: CalendarQueryResult = data;

    // Debug: Check data before transformation
    console.log('Before transformation - checking data structure:');
    const validSchedules = typedData.filter(schedule => 
      schedule.schedule_slots && schedule.enrollments
    );
    console.log(`Valid schedules (with slots and enrollments): ${validSchedules.length}/${typedData.length}`);
    
    // Debug invalid schedules
    const invalidSchedules = typedData.filter(schedule => 
      !schedule.schedule_slots || !schedule.enrollments
    );
    if (invalidSchedules.length > 0) {
      console.log('Invalid schedules:', invalidSchedules.map(s => ({
        id: s.id,
        hasSlots: !!s.schedule_slots,
        hasEnrollments: !!s.enrollments
      })));
    }

    // Transformar dados para formato simples - handle both array and object responses
    const formattedData = typedData
      .filter(schedule => 
        schedule.schedule_slots && schedule.enrollments
      )
      .map(schedule => {
        // Handle both array and single object responses from Supabase joins
        const slot = Array.isArray(schedule.schedule_slots) ? schedule.schedule_slots[0] : schedule.schedule_slots;
        const enrollment = Array.isArray(schedule.enrollments) ? schedule.enrollments[0] : schedule.enrollments;
        const user = Array.isArray(enrollment.users) ? enrollment.users[0] : enrollment.users;
        const course = Array.isArray(enrollment.courses) ? enrollment.courses[0] : enrollment.courses;
        
        if (!slot || !enrollment || !user || !course) {
          console.log('Skipping invalid record:', {
            scheduleId: schedule.id,
            hasSlot: !!slot,
            hasEnrollment: !!enrollment,
            hasUser: !!user,
            hasCourse: !!course
          });
          return null; // Skip invalid records
        }
        
        return {
          id: schedule.id,
          teacherId: schedule.teacher_id,
          studentEmail: user.email,
          studentName: user.full_name,
          courseName: course.title,
          dayOfWeek: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time,
          slotLabel: slot.slot_label,
          startDate: enrollment.start_date,
          endDate: enrollment.end_date,
          createdAt: schedule.created_at,
        };
      })
      .filter(item => item !== null); // Remove null items

    console.log(`Final formatted data count: ${formattedData.length}`);
    if (formattedData.length > 0) {
      console.log('Sample formatted item:', formattedData[0]);
    }

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
    const enrollmentQuery = supabase
      .from('enrollments')
      .select('teacher_id, courses!inner(instructor_id, instructors!inner(user_id))')
      .eq('id', enrollmentId)
      .single();

    type EnrollmentQueryResult = QueryData<typeof enrollmentQuery>;

    const { data: enrollment, error: enrollmentError } = await enrollmentQuery;

    if (enrollmentError || !enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Obter teacher_id: primeiro da matrícula, senão do curso
    let teacherId = enrollment.teacher_id;
    if (!teacherId && enrollment.courses[0].instructors[0].user_id) {
      teacherId = enrollment.courses[0].instructors[0].user_id;
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

    // Criar agendamento com tipos corretos
    const insertQuery = supabase
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
        enrollments!inner (
          courses!inner (title),
          users!inner (email, full_name)
        )
      `)
      .single();

    type InsertQueryResult = QueryData<typeof insertQuery>;

    const { data, error } = await insertQuery;

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