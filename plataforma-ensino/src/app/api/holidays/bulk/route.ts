import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  SchedulingApiErrorCode
} from '@/types/api'

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'

// Validation schema for bulk holiday operations
const bulkHolidaySchema = z.object({
  holidays: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    name: z.string().min(1, 'Holiday name is required').max(255, 'Name too long'),
    is_national: z.boolean().default(false)
  })).min(1, 'At least one holiday is required').max(100, 'Maximum 100 holidays allowed per batch')
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
 * POST /api/holidays/bulk
 * Admin-only endpoint to create multiple holidays at once
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  try {
    // Verify admin access
    const session = await requireAdmin()
    
    const body = await request.json()
    const validatedData = bulkHolidaySchema.parse(body)
    
    const supabase = createClient()
    
    // Check for existing holidays on the same dates
    const dates = validatedData.holidays.map(h => h.date)
    const { data: existingHolidays } = await supabase
      .from('holidays')
      .select('date')
      .in('date', dates)
    
    const existingDates = existingHolidays?.map(h => h.date) || []
    
    if (existingDates.length > 0) {
      return createErrorResponse(
        'HOLIDAY_CONFLICT',
        `Holidays already exist on the following dates: ${existingDates.join(', ')}`,
        409,
        pathname,
        { conflicting_dates: existingDates }
      )
    }
    
    // Prepare holidays with year field
    const holidaysToInsert = validatedData.holidays.map(holiday => ({
      ...holiday,
      year: parseInt(holiday.date.substring(0, 4))
    }))
    
    // Insert holidays in batch
    const { data: createdHolidays, error } = await supabase
      .from('holidays')
      .insert(holidaysToInsert)
      .select('*')
    
    if (error) {
      console.error('Database error creating holidays:', error)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to create holidays',
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
          action: 'BULK_CREATE',
          resource_type: 'holiday',
          resource_id: null,
          admin_id: session.user?.id,
          changes: {
            count: createdHolidays?.length || 0,
            holidays: holidaysToInsert
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
      data: {
        created: createdHolidays || [],
        count: createdHolidays?.length || 0
      },
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
    
    console.error('Bulk holidays POST error:', error)
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Internal server error',
      500,
      pathname
    )
  }
}

/**
 * DELETE /api/holidays/bulk
 * Admin-only endpoint to delete multiple holidays at once
 */
export async function DELETE(request: NextRequest) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  try {
    // Verify admin access
    const session = await requireAdmin()
    
    const body = await request.json()
    const { ids } = z.object({
      ids: z.array(z.string().uuid('Invalid UUID format')).min(1, 'At least one holiday ID is required').max(50, 'Maximum 50 holidays allowed per batch')
    }).parse(body)
    
    const supabase = createClient()
    
    // Get holiday details before deletion for audit log
    const { data: holidaysToDelete } = await supabase
      .from('holidays')
      .select('*')
      .in('id', ids)
    
    if (!holidaysToDelete || holidaysToDelete.length === 0) {
      return createErrorResponse(
        'HOLIDAY_NOT_FOUND',
        'No holidays found with the provided IDs',
        404,
        pathname
      )
    }
    
    // Delete holidays
    const { error } = await supabase
      .from('holidays')
      .delete()
      .in('id', ids)
    
    if (error) {
      console.error('Database error deleting holidays:', error)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to delete holidays',
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
          action: 'BULK_DELETE',
          resource_type: 'holiday',
          resource_id: null,
          admin_id: session.user?.id,
          changes: {
            count: holidaysToDelete.length,
            deleted_holidays: holidaysToDelete
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
      data: {
        deleted_count: holidaysToDelete.length,
        deleted_ids: ids
      },
      timestamp: new Date().toISOString()
    })
    
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
    
    console.error('Bulk holidays DELETE error:', error)
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Internal server error',
      500,
      pathname
    )
  }
}