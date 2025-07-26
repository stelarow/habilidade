/**
 * Calculate End Date API Endpoint
 * Story 2.1: Core Business Logic - Task 2
 * 
 * Simple course end date calculation with holiday and weekend exclusion
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Force dynamic rendering for authentication and database queries
export const dynamic = 'force-dynamic'
import { 
  calculateCourseEndDateDetailed,
  parseDateISO,
  formatDateISO,
  getCachedHolidays
} from '@/utils/dateCalculations'
import type { 
  DateCalculationRequest,
  DateCalculationResponse
} from '@/types/date-calculation'

// Request validation schema
const calculateEndDateSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Expected YYYY-MM-DD'),
  duration: z.number().int().min(1).max(365, 'Duration must be between 1 and 365 working days')
})

/**
 * POST /api/calculate-end-date
 * Calculate course end date with holiday and weekend exclusion
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await request.json()
    let validatedData: DateCalculationRequest

    try {
      validatedData = calculateEndDateSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Invalid request data',
            details: error.errors,
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        )
      }
      throw error
    }

    // Validate and parse start date
    let startDate: Date
    try {
      startDate = parseDateISO(validatedData.start_date)
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Invalid start date format',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    // Check admin authorization
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Server component context - ignore
            }
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        {
          error: 'Admin access required',
          timestamp: new Date().toISOString()
        },
        { status: 403 }
      )
    }

    // Calculate course end date with holiday exclusion
    const holidays = getCachedHolidays()
    const calculation = calculateCourseEndDateDetailed(
      startDate,
      validatedData.duration,
      holidays
    )

    // Prepare response
    const responseData: DateCalculationResponse = {
      start_date: validatedData.start_date,
      end_date: formatDateISO(calculation.endDate),
      working_days: calculation.workingDays,
      excluded_days: calculation.excludedDays
    }

    return NextResponse.json(responseData, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    logError('Calculate end date error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}


/**
 * GET /api/calculate-end-date
 * API endpoint information
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    name: 'Calculate End Date API',
    description: 'Calculate course end dates with holiday and weekend exclusion',
    version: '1.0.0',
    methods: ['POST'],
    parameters: {
      start_date: 'string (YYYY-MM-DD format)',
      duration: 'number (working days, 1-365)'
    },
    authentication: 'Admin role required',
    timestamp: new Date().toISOString()
  })
}