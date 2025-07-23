/**
 * Calculate End Date API Endpoint
 * Story 2.1: Core Business Logic - Task 3
 * 
 * Comprehensive course scheduling algorithm with authentication,
 * validation, and detailed class schedule generation
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { 
  CalculateEndDateRequestSchema,
  CalculateEndDateResponseSchema
} from '@/lib/validators/api-schemas'
import { 
  calculateCourseEndDate,
  getHolidaysInRange,
  toISODateString,
  parseISODate
} from '@/utils/dateCalculations'
import { 
  calculateAvailableSlots,
  validateTeacherAvailability
} from '@/utils/teacherAvailabilityLogic'
import { authMiddleware } from '@/lib/middleware/api-auth'
import { handleApiError, ApiError } from '@/lib/utils/api-error-handler'
import { 
  Holiday,
  CalculateEndDateRequest,
  CalculateEndDateResponse,
  ClassSchedule,
  ApiSuccessResponse,
  TeacherAvailability
} from '@/types/api'

// Rate limiting configuration
const RATE_LIMIT = {
  requests: 50,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (req: NextRequest) => {
    // Rate limit by user ID if authenticated, otherwise by IP
    const userId = req.headers.get('x-user-id')
    return userId || req.ip || 'anonymous'
  }
}

/**
 * POST /api/calculate-end-date
 * Calculate course end date with comprehensive scheduling
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authentication middleware
    const authResult = await authMiddleware(request)
    if (!authResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            details: authResult.error
          },
          timestamp: new Date().toISOString(),
          path: '/api/calculate-end-date'
        },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    let validatedData: CalculateEndDateRequest

    try {
      validatedData = CalculateEndDateRequestSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid request data',
              details: error.errors
            },
            timestamp: new Date().toISOString(),
            path: '/api/calculate-end-date'
          },
          { status: 400 }
        )
      }
      throw error
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Validate teacher exists and get teacher data
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id, max_students_per_class, calendar_settings')
      .eq('id', validatedData.teacherId)
      .single()

    if (teacherError || !teacher) {
      return NextResponse.json(
        {
          error: {
            code: 'TEACHER_NOT_FOUND',
            message: `Teacher with ID ${validatedData.teacherId} not found`,
            details: teacherError?.message
          },
          timestamp: new Date().toISOString(),
          path: '/api/calculate-end-date'
        },
        { status: 404 }
      )
    }

    // Validate teacher availability configuration
    const availabilityValidation = await validateTeacherAvailability(validatedData.teacherId)
    if (!availabilityValidation.isValid) {
      return NextResponse.json(
        {
          error: {
            code: 'NO_AVAILABILITY',
            message: 'Teacher has invalid availability configuration',
            details: {
              issues: availabilityValidation.issues,
              warnings: availabilityValidation.warnings
            }
          },
          timestamp: new Date().toISOString(),
          path: '/api/calculate-end-date'
        },
        { status: 409 }
      )
    }

    // Get holidays for the calculation period (estimate 2 years max)
    const startDate = parseISODate(validatedData.startDate)
    const estimatedEndDate = new Date(startDate)
    estimatedEndDate.setFullYear(startDate.getFullYear() + 2)

    let holidays: Holiday[] = []
    if (validatedData.excludeHolidays !== false) {
      const { data: holidayData, error: holidayError } = await supabase
        .from('holidays')
        .select('*')
        .gte('date', validatedData.startDate)
        .lte('date', toISODateString(estimatedEndDate))
        .order('date')

      if (holidayError) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Failed to fetch holiday data',
              details: holidayError.message
            },
            timestamp: new Date().toISOString(),
            path: '/api/calculate-end-date'
          },
          { status: 500 }
        )
      }

      holidays = holidayData || []
    }

    // Get teacher availability slots for validation
    const teacherAvailabilitySlots = await calculateAvailableSlots(
      validatedData.teacherId,
      { start: startDate, end: estimatedEndDate },
      holidays
    )

    if (teacherAvailabilitySlots.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'NO_AVAILABILITY',
            message: 'Teacher has no available time slots in the requested period',
            details: {
              startDate: validatedData.startDate,
              teacherId: validatedData.teacherId,
              periodChecked: `${validatedData.startDate} to ${toISODateString(estimatedEndDate)}`
            }
          },
          timestamp: new Date().toISOString(),
          path: '/api/calculate-end-date'
        },
        { status: 409 }
      )
    }

    // Calculate course end date and schedule
    const holidayDates = holidays.map(h => new Date(h.date))
    const courseSchedule = calculateCourseEndDate(
      startDate,
      validatedData.courseHours,
      validatedData.weeklyClasses,
      holidayDates
    )

    // Generate detailed class schedule with teacher availability integration
    const detailedSchedule = await generateDetailedClassSchedule(
      courseSchedule.schedule,
      validatedData.teacherId,
      teacherAvailabilitySlots
    )

    // Prepare response data
    const responseData: CalculateEndDateResponse = {
      endDate: toISODateString(courseSchedule.endDate),
      totalWeeks: courseSchedule.totalWeeks,
      holidaysExcluded: courseSchedule.holidaysExcluded.map(date => toISODateString(date)),
      actualClassDays: courseSchedule.actualClassDays,
      schedule: detailedSchedule
    }

    // Validate response against schema
    try {
      CalculateEndDateResponseSchema.parse(responseData)
    } catch (validationError) {
      throw new ApiError(
        'VALIDATION_ERROR',
        'Response validation failed',
        validationError instanceof z.ZodError ? validationError.errors : validationError
      )
    }

    // Generate holiday impact report for logging
    const holidayImpact = {
      totalHolidaysInPeriod: holidays.length,
      holidaysExcluded: courseSchedule.holidaysExcluded.length,
      additionalWeeksAdded: Math.max(0, courseSchedule.totalWeeks - Math.ceil(validatedData.courseHours / (validatedData.weeklyClasses * 2)))
    }

    // Success response
    const successResponse: ApiSuccessResponse<CalculateEndDateResponse> = {
      data: responseData,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(successResponse, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': RATE_LIMIT.requests.toString(),
        'X-RateLimit-Remaining': '49', // Would be calculated from actual rate limiter
        'X-RateLimit-Reset': (Date.now() + RATE_LIMIT.windowMs).toString()
      }
    })

  } catch (error) {
    return handleApiError(error, '/api/calculate-end-date')
  }
}

/**
 * Generate detailed class schedule with teacher availability integration
 */
async function generateDetailedClassSchedule(
  basicSchedule: Array<{
    date: Date
    startTime: string
    endTime: string
    duration: number
  }>,
  teacherId: string,
  availabilitySlots: Array<{
    date: string
    startTime: string
    endTime: string
    maxStudents: number
  }>
): Promise<ClassSchedule[]> {
  const detailedSchedule: ClassSchedule[] = []

  for (const scheduledClass of basicSchedule) {
    const classDateStr = toISODateString(scheduledClass.date)
    
    // Find matching availability slot for this date
    const matchingSlot = availabilitySlots.find(slot => 
      slot.date === classDateStr
    )

    // Use teacher availability times if available, otherwise use default times
    const startTime = matchingSlot?.startTime || scheduledClass.startTime
    const endTime = matchingSlot?.endTime || scheduledClass.endTime
    
    // Calculate duration from actual start/end times
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)
    const duration = endMinutes - startMinutes

    detailedSchedule.push({
      date: classDateStr,
      startTime,
      endTime,
      duration
    })
  }

  return detailedSchedule
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * GET /api/calculate-end-date
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/calculate-end-date',
    methods: ['POST'],
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
}

/**
 * OPTIONS /api/calculate-end-date
 * CORS preflight handler
 */
export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    }
  )
}