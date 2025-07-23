import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'
import type {
  HolidaysQuery,
  CreateHolidayRequest,
  Holiday,
  ApiErrorResponse,
  ApiSuccessResponse,
  SchedulingApiErrorCode
} from '@/types/api'

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'

// Validation schemas
const holidaysQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2050).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isNational: z.enum(['true', 'false']).transform(val => val === 'true').optional()
})

const createHolidaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  name: z.string().min(1, 'Holiday name is required'),
  is_national: z.boolean().default(false)
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

/**
 * GET /api/holidays
 * Public endpoint to retrieve holidays with optional filtering
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  try {
    // Parse and validate query parameters
    const queryParams = Object.fromEntries(url.searchParams.entries())
    const validatedQuery = holidaysQuerySchema.parse(queryParams)
    
    const supabase = createClient()
    
    // Test database connectivity first
    const { error: connectionError } = await supabase
      .from('holidays')
      .select('count')
      .limit(1)
      
    if (connectionError) {
      console.error('Database connection error:', connectionError)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Database unavailable',
        503,
        pathname,
        { code: connectionError.code, message: connectionError.message }
      )
    }
    
    let query = supabase
      .from('holidays')
      .select('*')
      .order('date', { ascending: true })
    
    // Apply filters
    if (validatedQuery.year) {
      query = query.gte('date', `${validatedQuery.year}-01-01`)
                   .lt('date', `${validatedQuery.year + 1}-01-01`)
    }
    
    if (validatedQuery.month && validatedQuery.year) {
      const startOfMonth = `${validatedQuery.year}-${validatedQuery.month.toString().padStart(2, '0')}-01`
      const nextMonth = validatedQuery.month === 12 ? 1 : validatedQuery.month + 1
      const nextYear = validatedQuery.month === 12 ? validatedQuery.year + 1 : validatedQuery.year
      const startOfNextMonth = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`
      
      query = query.gte('date', startOfMonth)
                   .lt('date', startOfNextMonth)
    }
    
    if (validatedQuery.startDate) {
      query = query.gte('date', validatedQuery.startDate)
    }
    
    if (validatedQuery.endDate) {
      query = query.lte('date', validatedQuery.endDate)
    }
    
    if (validatedQuery.isNational !== undefined) {
      query = query.eq('is_national', validatedQuery.isNational)
    }
    
    const { data: holidays, error } = await query
    
    if (error) {
      console.error('Database error fetching holidays:', error)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to fetch holidays',
        500,
        pathname,
        error
      )
    }
    
    return createSuccessResponse(holidays || [])
    
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
    
    console.error('Holidays GET error:', error)
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Internal server error',
      500,
      pathname
    )
  }
}

/**
 * POST /api/holidays
 * Admin-only endpoint to create new holidays
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  try {
    // Verify admin access
    const session = await requireAdmin()
    
    const body = await request.json()
    const validatedData = createHolidaySchema.parse(body)
    
    const supabase = createClient()
    
    // Check if holiday already exists for this date
    const { data: existingHoliday } = await supabase
      .from('holidays')
      .select('id')
      .eq('date', validatedData.date)
      .single()
    
    if (existingHoliday) {
      return createErrorResponse(
        'HOLIDAY_CONFLICT',
        'A holiday already exists on this date',
        409,
        pathname
      )
    }
    
    // Extract year from date for the year field
    const year = parseInt(validatedData.date.substring(0, 4))
    
    // Create holiday
    const { data: holiday, error } = await supabase
      .from('holidays')
      .insert([{
        ...validatedData,
        year
      }])
      .select('*')
      .single()
    
    if (error) {
      console.error('Database error creating holiday:', error)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to create holiday',
        500,
        pathname,
        error
      )
    }
    
    // Log audit event
    try {
      await supabase
        .from('audit_logs')
        .insert({
          action: 'CREATE',
          resource_type: 'holiday',
          resource_id: holiday.id,
          admin_id: session.user?.id,
          changes: {
            created: validatedData
          },
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
        })
    } catch (auditError) {
      console.error('Failed to log audit event:', auditError)
      // Don't fail the request if audit logging fails
    }
    
    return NextResponse.json({
      data: holiday,
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
    
    // Handle authentication errors
    if (error instanceof Error && error.message.includes('Redirect')) {
      return createErrorResponse(
        'UNAUTHORIZED',
        'Authentication required',
        401,
        pathname
      )
    }
    
    console.error('Holiday POST error:', error)
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Internal server error',
      500,
      pathname
    )
  }
}