import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifySession, requireAdmin, requireInstructorOrAdmin } from '@/lib/auth/session'
import { z } from 'zod'
import type {
  AvailabilityQuery,
  CreateAvailabilityRequest,
  TeacherAvailability,
  AvailabilitySlot,
  Holiday,
  ApiErrorResponse,
  ApiSuccessResponse,
  SchedulingApiErrorCode
} from '@/types/api'

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'

// Validation schemas
const availabilityQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
  dayOfWeek: z.coerce.number().int().min(0).max(6).optional(),
  includeHolidays: z.enum(['true', 'false']).transform(val => val === 'true').optional()
})

const createAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'),
  maxStudents: z.number().int().min(1).max(50),
  isActive: z.boolean().default(true)
}).refine(data => data.startTime < data.endTime, {
  message: 'Start time must be before end time',
  path: ['endTime']
})

// Helper function to create error response
function createErrorResponse(
  code: SchedulingApiErrorCode,
  message: string,
  status: number,
  path: string,
  details?: any
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({
    error: {
      code,
      message,
      details
    },
    timestamp: new Date().toISOString(),
    path
  }, { status })
}

// Helper function to create success response
function createSuccessResponse<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    data,
    timestamp: new Date().toISOString()
  })
}

// Helper function to check if a date falls on a holiday
async function getHolidaysInRange(
  supabase: ReturnType<typeof createClient>,
  startDate: string,
  endDate: string
): Promise<Holiday[]> {
  const { data: holidays } = await supabase
    .from('holidays')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
  
  return holidays || []
}

// Helper function to calculate next occurrence of a day of week within date range
function calculateNextOccurrence(dayOfWeek: number, startDate: string, endDate: string): string | null {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  // Find first occurrence of the day of week
  const current = new Date(start)
  while (current.getDay() !== dayOfWeek && current <= end) {
    current.setDate(current.getDate() + 1)
  }
  
  if (current > end) {
    return null
  }
  
  return current.toISOString().split('T')[0]
}

// Helper function to check if date conflicts with holidays
function dateConflictsWithHoliday(date: string, holidays: Holiday[]): boolean {
  return holidays.some((holiday: any) => holiday.date === date)
}

/**
 * GET /api/teachers/[id]/availability
 * Public endpoint to retrieve teacher availability with date range filtering
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  try {
    const { id: teacherId } = params
    
    // Validate teacher ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(teacherId)) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid teacher ID format',
        400,
        pathname
      )
    }
    
    // Parse and validate query parameters
    const queryParams = Object.fromEntries(url.searchParams.entries())
    const validatedQuery = availabilityQuerySchema.parse(queryParams)
    
    // Validate date range
    if (validatedQuery.startDate >= validatedQuery.endDate) {
      return createErrorResponse(
        'INVALID_DATE_RANGE',
        'Start date must be before end date',
        400,
        pathname
      )
    }
    
    const supabase = createClient()
    
    // Check if teacher exists
    const { data: teacher } = await supabase
      .from('instructors')
      .select('id, user_id')
      .eq('id', teacherId)
      .single()
    
    if (!teacher) {
      return createErrorResponse(
        'TEACHER_NOT_FOUND',
        'Teacher not found',
        404,
        pathname
      )
    }
    
    // Build availability query
    let availabilityQuery = supabase
      .from('teacher_availability')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })
    
    // Apply day of week filter if specified
    if (validatedQuery.dayOfWeek !== undefined) {
      availabilityQuery = availabilityQuery.eq('day_of_week', validatedQuery.dayOfWeek)
    }
    
    const { data: availabilitySlots, error } = await availabilityQuery
    
    if (error) {
      console.error('Database error fetching availability:', error)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to fetch availability',
        500,
        pathname,
        error
      )
    }
    
    if (!availabilitySlots || availabilitySlots.length === 0) {
      return createErrorResponse(
        'NO_AVAILABILITY',
        'Teacher has no available time slots',
        404,
        pathname
      )
    }
    
    // Get holidays in the date range (if not excluding them)
    let holidays: Holiday[] = []
    if (validatedQuery.includeHolidays !== false) {
      holidays = await getHolidaysInRange(supabase, validatedQuery.startDate, validatedQuery.endDate)
    }
    
    // TODO: In a real implementation, you would also query existing bookings/appointments
    // to calculate available_spots and scheduled_count. For now, we'll mock this data.
    
    // Enhance availability slots with computed data
    const enhancedSlots: AvailabilitySlot[] = availabilitySlots.map((slot: any) => {
      const nextOccurrence = calculateNextOccurrence(
        slot.day_of_week,
        validatedQuery.startDate,
        validatedQuery.endDate
      )
      
      const conflictsWithHoliday = nextOccurrence ? 
        dateConflictsWithHoliday(nextOccurrence, holidays) : false
      
      // Mock scheduled count (in real implementation, query actual bookings)
      const scheduledCount = Math.floor(Math.random() * slot.max_students)
      
      return {
        ...slot,
        available_spots: slot.max_students - scheduledCount,
        scheduled_count: scheduledCount,
        next_occurrence: nextOccurrence || undefined,
        conflicts_with_holiday: conflictsWithHoliday
      }
    })
    
    return createSuccessResponse(enhancedSlots)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid query parameters',
        400,
        pathname,
        error.errors
      )
    }
    
    console.error('Teacher availability GET error:', error)
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Internal server error',
      500,
      pathname
    )
  }
}

/**
 * POST /api/teachers/[id]/availability
 * Teacher/Admin-only endpoint to create availability slots
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  try {
    const { id: teacherId } = params
    
    // Validate teacher ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(teacherId)) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid teacher ID format',
        400,
        pathname
      )
    }
    
    // Verify authentication and authorization
    const session = await verifySession()
    
    if (!session.isAuthenticated || !session.user || !session.profile) {
      return createErrorResponse(
        'UNAUTHORIZED',
        'Authentication required',
        401,
        pathname
      )
    }
    
    const supabase = createClient()
    
    // Check if teacher exists
    const { data: teacher } = await supabase
      .from('instructors')
      .select('id, user_id')
      .eq('id', teacherId)
      .single()
    
    if (!teacher) {
      return createErrorResponse(
        'TEACHER_NOT_FOUND',
        'Teacher not found',
        404,
        pathname
      )
    }
    
    // Check authorization: teacher can manage own availability, admin can manage any
    const isOwnAvailability = teacher.user_id === session.user.id
    const isAdmin = session.profile.role === 'admin'
    
    if (!isOwnAvailability && !isAdmin) {
      return createErrorResponse(
        'INSUFFICIENT_PERMISSIONS',
        'You can only manage your own availability',
        403,
        pathname
      )
    }
    
    const body = await request.json()
    const validatedData = createAvailabilitySchema.parse(body)
    
    // Check for existing time slot conflicts
    const { data: existingSlots } = await supabase
      .from('teacher_availability')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('day_of_week', validatedData.dayOfWeek)
      .eq('is_active', true)
    
    if (existingSlots) {
      // Check for time overlap
      const hasConflict = existingSlots.some((slot: any) => {
        const existingStart = slot.start_time
        const existingEnd = slot.end_time
        const newStart = validatedData.startTime
        const newEnd = validatedData.endTime
        
        // Check if time ranges overlap
        return (newStart < existingEnd) && (newEnd > existingStart)
      })
      
      if (hasConflict) {
        return createErrorResponse(
          'TIME_SLOT_CONFLICT',
          'Time slot conflicts with existing availability',
          409,
          pathname
        )
      }
    }
    
    // Create availability slot
    const { data: availabilitySlot, error } = await supabase
      .from('teacher_availability')
      .insert([{
        teacher_id: teacherId,
        day_of_week: validatedData.dayOfWeek,
        start_time: validatedData.startTime,
        end_time: validatedData.endTime,
        max_students: validatedData.maxStudents,
        is_active: validatedData.isActive
      }])
      .select('*')
      .single()
    
    if (error) {
      console.error('Database error creating availability:', error)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to create availability slot',
        500,
        pathname,
        error
      )
    }
    
    return NextResponse.json({
      data: availabilitySlot,
      timestamp: new Date().toISOString()
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid request data',
        400,
        pathname,
        error.errors
      )
    }
    
    console.error('Teacher availability POST error:', error)
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Internal server error',
      500,
      pathname
    )
  }
}