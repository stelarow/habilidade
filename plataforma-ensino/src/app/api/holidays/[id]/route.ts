import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'
import type {
  UpdateHolidayRequest,
  Holiday,
  ApiErrorResponse,
  ApiSuccessResponse,
  SchedulingApiErrorCode
} from '@/types/api'

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'

// Validation schema for holiday updates
const updateHolidaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  name: z.string().min(1, 'Holiday name cannot be empty').optional(),
  is_national: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
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
 * PUT /api/holidays/[id]
 * Admin-only endpoint to update an existing holiday
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  try {
    // Verify admin access
    const session = await requireAdmin()
    
    const { id } = params
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid holiday ID format',
        400,
        pathname
      )
    }
    
    const body = await request.json()
    const validatedData = updateHolidaySchema.parse(body)
    
    const supabase = createClient()
    
    // Check if holiday exists
    const { data: existingHoliday, error: fetchError } = await supabase
      .from('holidays')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !existingHoliday) {
      return createErrorResponse(
        'HOLIDAY_NOT_FOUND',
        'Holiday not found',
        404,
        pathname
      )
    }
    
    // If updating date, check for conflicts
    if (validatedData.date && validatedData.date !== existingHoliday.date) {
      const { data: conflictingHoliday } = await supabase
        .from('holidays')
        .select('id')
        .eq('date', validatedData.date)
        .neq('id', id)
        .single()
      
      if (conflictingHoliday) {
        return createErrorResponse(
          'HOLIDAY_CONFLICT',
          'Another holiday already exists on this date',
          409,
          pathname
        )
      }
    }
    
    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // Extract year from date if date is being updated
    if (validatedData.date) {
      updateData.year = parseInt(validatedData.date.substring(0, 4))
    }
    
    // Update holiday
    const { data: holiday, error } = await supabase
      .from('holidays')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()
    
    if (error) {
      logError('Database error updating holiday:', error)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to update holiday',
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
          action: 'UPDATE',
          resource_type: 'holiday',
          resource_id: id,
          admin_id: session.user?.id,
          changes: {
            before: existingHoliday,
            after: updateData
          },
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
        })
    } catch (auditError) {
      logError('Failed to log audit event:', auditError)
      // Don't fail the request if audit logging fails
    }
    
    return createSuccessResponse(holiday)
    
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
    
    logError('Holiday PUT error:', error)
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Internal server error',
      500,
      pathname
    )
  }
}

/**
 * DELETE /api/holidays/[id]
 * Admin-only endpoint to delete a holiday
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  try {
    // Verify admin access
    const session = await requireAdmin()
    
    const { id } = params
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid holiday ID format',
        400,
        pathname
      )
    }
    
    const supabase = createClient()
    
    // Check if holiday exists before deletion
    const { data: existingHoliday, error: fetchError } = await supabase
      .from('holidays')
      .select('id, name, date')
      .eq('id', id)
      .single()
    
    if (fetchError || !existingHoliday) {
      return createErrorResponse(
        'HOLIDAY_NOT_FOUND',
        'Holiday not found',
        404,
        pathname
      )
    }
    
    // Delete holiday
    const { error } = await supabase
      .from('holidays')
      .delete()
      .eq('id', id)
    
    if (error) {
      logError('Database error deleting holiday:', error)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to delete holiday',
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
          action: 'DELETE',
          resource_type: 'holiday',
          resource_id: id,
          admin_id: session.user?.id,
          changes: {
            deleted: existingHoliday
          },
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
        })
    } catch (auditError) {
      logError('Failed to log audit event:', auditError)
      // Don't fail the request if audit logging fails
    }
    
    // Return 204 No Content for successful deletion
    return new NextResponse(null, { status: 204 })
    
  } catch (error) {
    // Handle authentication errors
    if (error instanceof Error && error.message.includes('Redirect')) {
      return createErrorResponse(
        'UNAUTHORIZED',
        'Authentication required',
        401,
        pathname
      )
    }
    
    logError('Holiday DELETE error:', error)
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Internal server error',
      500,
      pathname
    )
  }
}