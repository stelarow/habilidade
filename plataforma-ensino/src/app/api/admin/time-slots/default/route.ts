import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Horários padrões definidos para todos os professores
const DEFAULT_TIME_SLOTS = [
  { startTime: '08:00', endTime: '10:00' },
  { startTime: '10:00', endTime: '12:00' },
  { startTime: '13:30', endTime: '15:30' },
  { startTime: '15:30', endTime: '17:30' },
  { startTime: '18:00', endTime: '20:00' },
  { startTime: '20:00', endTime: '22:00' }
];

// Schema de validação para criação de horários
const createTimeSlotsSchema = z.object({
  teacherId: z.string().uuid('ID do professor deve ser um UUID válido'),
  maxStudents: z.number().int().min(1).max(5).default(3)
});

/**
 * GET /api/admin/time-slots/default
 * Retorna os horários padrões configurados no sistema
 */
export async function GET() {
  try {
    const supabase = createClient();

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

    // Retornar horários padrões com dias da semana
    const timeSlots = DEFAULT_TIME_SLOTS.map((slot, index) => ({
      id: `default-${index}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      description: `${slot.startTime} às ${slot.endTime}`,
      isDefault: true
    }));

    const response = {
      timeSlots,
      daysOfWeek: [
        { value: 1, label: 'Segunda-feira', short: 'Seg' },
        { value: 2, label: 'Terça-feira', short: 'Ter' },
        { value: 3, label: 'Quarta-feira', short: 'Qua' },
        { value: 4, label: 'Quinta-feira', short: 'Qui' },
        { value: 5, label: 'Sexta-feira', short: 'Sex' },
        { value: 6, label: 'Sábado', short: 'Sáb' }
      ],
      defaultCapacity: 3,
      availableDays: 'Segunda a Sábado'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar horários padrões:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/time-slots/default
 * Aplica os horários padrões para um professor específico
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

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

    // Validar dados da requisição
    const body = await request.json();
    const validatedData = createTimeSlotsSchema.parse(body);

    // Verificar se o professor existe na tabela instructors
    const { data: instructor, error: instructorError } = await supabase
      .from('instructors')
      .select('id, user_id')
      .eq('id', validatedData.teacherId)
      .single();

    if (instructorError || !instructor) {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se já existem horários para este professor
    const { data: existingSlots, error: existingError } = await supabase
      .from('teacher_availability')
      .select('id')
      .eq('teacher_id', validatedData.teacherId);

    if (existingError) {
      return NextResponse.json(
        { error: 'Erro ao verificar horários existentes' },
        { status: 500 }
      );
    }

    // Se já existem horários, retornar erro informativo
    if (existingSlots && existingSlots.length > 0) {
      return NextResponse.json(
        { 
          error: 'Este professor já possui horários configurados',
          existingSlots: existingSlots.length,
          suggestion: 'Use a opção de edição individual ou remova os horários existentes primeiro'
        },
        { status: 409 }
      );
    }

    // Criar todos os horários padrões para segunda a sábado
    const slotsToCreate = [];
    
    // Para cada dia da semana (1=Segunda, 6=Sábado)
    for (let dayOfWeek = 1; dayOfWeek <= 6; dayOfWeek++) {
      // Para cada horário padrão
      for (const slot of DEFAULT_TIME_SLOTS) {
        slotsToCreate.push({
          teacher_id: validatedData.teacherId,
          day_of_week: dayOfWeek,
          start_time: slot.startTime,
          end_time: slot.endTime,
          max_students: validatedData.maxStudents,
          is_active: true
        });
      }
    }

    // Inserir todos os horários de uma vez
    const { data: createdSlots, error: insertError } = await supabase
      .from('teacher_availability')
      .insert(slotsToCreate)
      .select('*');

    if (insertError) {
      console.error('Erro ao criar horários:', insertError);
      return NextResponse.json(
        { error: 'Erro ao criar horários padrões' },
        { status: 500 }
      );
    }

    // Buscar dados do professor para resposta
    const { data: teacherInfo, error: teacherError } = await supabase
      .from('instructors')
      .select(`
        id,
        user_id,
        users!inner(
          full_name,
          email
        )
      `)
      .eq('id', validatedData.teacherId)
      .single();

    const response = {
      success: true,
      message: 'Horários padrões aplicados com sucesso',
      teacher: {
        id: teacherInfo?.id,
        name: teacherInfo?.users?.full_name,
        email: teacherInfo?.users?.email
      },
      created: {
        totalSlots: createdSlots?.length,
        slotsPerDay: DEFAULT_TIME_SLOTS.length,
        daysConfigured: 6,
        maxStudentsPerSlot: validatedData.maxStudents
      },
      summary: {
        timeSlots: DEFAULT_TIME_SLOTS,
        workingDays: 'Segunda a Sábado',
        totalCapacity: (DEFAULT_TIME_SLOTS.length * 6 * validatedData.maxStudents)
      }
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    console.error('Erro ao aplicar horários padrões:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}