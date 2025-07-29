import { createClient } from '@/lib/supabase/server';
import { verifySession } from '@/lib/auth/session';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

const ScheduleSlotsQuerySchema = z.object({
  teacherId: z.string().uuid().optional(),
  includeAvailability: z.string().optional().transform(val => val === 'true'),
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
    const query = ScheduleSlotsQuerySchema.parse({
      teacherId: searchParams.get('teacherId') || undefined,
      includeAvailability: searchParams.get('includeAvailability'),
    });

    const supabase = createClient();

    // Buscar todos os schedule slots
    const { data: slots, error } = await supabase
      .from('schedule_slots')
      .select('*')
      .order('day_of_week')
      .order('start_time');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Se incluir disponibilidade, buscar contagem atual para cada slot
    if (query.includeAvailability) {
      const slotsWithAvailability = await Promise.all(
        slots.map(async (slot) => {
          let countQuery = supabase
            .from('class_schedules')
            .select('*', { count: 'exact', head: true })
            .eq('schedule_slot_id', slot.id);

          // Filtrar por professor se especificado
          if (query.teacherId) {
            countQuery = countQuery.eq('teacher_id', query.teacherId);
          }

          const { count } = await countQuery;

          return {
            ...slot,
            currentCount: count || 0,
            available: (count || 0) < 3,
            availableSpots: 3 - (count || 0),
          };
        })
      );

      return NextResponse.json({ data: slotsWithAvailability });
    }

    return NextResponse.json({ data: slots });

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