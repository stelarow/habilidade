import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import { z } from 'zod'
import { logError } from '@/lib/utils/logger'
import type {
  UpdateAvailabilityRequest,
  TeacherAvailability,
  ApiErrorResponse,
  ApiSuccessResponse,
  SchedulingApiErrorCode
} from '@/types/api'

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'

// Validation schema for availability updates
const updateAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format').optional(),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format').optional(),
  maxStudents: z.number().int().min(1).max(50).optional(),
  isActive: z.boolean().optional()
}).refine(data => {
  // If both start and end time are provided, validate the order
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime
  }
  return true
}, {
  message: 'Start time must be before end time',
  path: ['endTime']
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
 * PUT /api/teachers/[id]/availability/[slotId]
 * Teacher/Admin-only endpoint to update availability slot
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; slotId: string } }
) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  try {
    const { id: teacherId, slotId } = params
    
    // Validate IDs format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(teacherId) || !uuidRegex.test(slotId)) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid ID format',
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
    
    // Check if availability slot exists and belongs to the teacher
    const { data: existingSlot, error: fetchError } = await supabase
      .from('teacher_availability')
      .select('*')
      .eq('id', slotId)
      .eq('teacher_id', teacherId)
      .single()
    
    if (fetchError || !existingSlot) {
      return createErrorResponse(
        'AVAILABILITY_SLOT_NOT_FOUND',
        'Availability slot not found',
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
    const validatedData = updateAvailabilitySchema.parse(body)
    
    // Build the update object
    const updateData: any = {}
    
    if (validatedData.dayOfWeek !== undefined) {
      updateData.day_of_week = validatedData.dayOfWeek
    }
    if (validatedData.startTime !== undefined) {
      updateData.start_time = validatedData.startTime
    }
    if (validatedData.endTime !== undefined) {
      updateData.end_time = validatedData.endTime
    }
    if (validatedData.maxStudents !== undefined) {
      updateData.max_students = validatedData.maxStudents
    }
    if (validatedData.isActive !== undefined) {
      updateData.is_active = validatedData.isActive
    }
    
    // Check for time conflicts if updating day or time
    if (updateData.day_of_week !== undefined || updateData.start_time !== undefined || updateData.end_time !== undefined) {
      const finalDayOfWeek = updateData.day_of_week ?? existingSlot.day_of_week
      const finalStartTime = updateData.start_time ?? existingSlot.start_time
      const finalEndTime = updateData.end_time ?? existingSlot.end_time
      
      // Validate final time order
      if (finalStartTime >= finalEndTime) {
        return createErrorResponse(
          'VALIDATION_ERROR',
          'Start time must be before end time',
          400,
          pathname
        )
      }
      
      // Check for conflicts with other slots
      const { data: otherSlots } = await supabase
        .from('teacher_availability')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('day_of_week', finalDayOfWeek)
        .eq('is_active', true)
        .neq('id', slotId) // Exclude current slot
      
      if (otherSlots) {
        const hasConflict = otherSlots.some(slot => {
          const existingStart = slot.start_time
          const existingEnd = slot.end_time
          
          // Check if time ranges overlap
          return (finalStartTime < existingEnd) && (finalEndTime > existingStart)
        })
        
        if (hasConflict) {
          return createErrorResponse(
            'TIME_SLOT_CONFLICT',
            'Updated time slot conflicts with existing availability',
            409,
            pathname
          )
        }
      }
    }
    
    // Update the availability slot
    const { data: updatedSlot, error } = await supabase
      .from('teacher_availability')
      .update(updateData)
      .eq('id', slotId)
      .select('*')
      .single()
    
    if (error) {
      logError('Database error updating availability:', error)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to update availability slot',
        500,
        pathname,
        error
      )
    }
    
    return createSuccessResponse(updatedSlot)
    
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
    
    logError('Availability PUT error:', error)
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Internal server error',
      500,
      pathname
    )
  }
}

/**
 * DELETE /api/teachers/[id]/availability/[slotId]
 * Teacher/Admin-only endpoint to delete availability slot
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; slotId: string } }
) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  try {
    const { id: teacherId, slotId } = params
    
    // Validate IDs format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(teacherId) || !uuidRegex.test(slotId)) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid ID format',
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
    
    // Check if availability slot exists and belongs to the teacher
    const { data: existingSlot, error: fetchError } = await supabase
      .from('teacher_availability')
      .select('id, teacher_id')
      .eq('id', slotId)
      .eq('teacher_id', teacherId)
      .single()
    
    if (fetchError || !existingSlot) {
      return createErrorResponse(
        'AVAILABILITY_SLOT_NOT_FOUND',
        'Availability slot not found',
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
    
    // TODO: In a real implementation, you should check if there are existing bookings
    // for this availability slot and handle them appropriately (e.g., prevent deletion
    // or move bookings to another slot)
    
    // Delete the availability slot
    const { error } = await supabase
      .from('teacher_availability')
      .delete()
      .eq('id', slotId)
    
    if (error) {
      logError('Database error deleting availability:', error)
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to delete availability slot',
        500,
        pathname,
        error
      )
    }
    
    // Return 204 No Content for successful deletion
    return new NextResponse(null, { status: 204 })
    
  } catch (error) {
    logError('Availability DELETE error:', error)
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Internal server error',
      500,
      pathname
    )
  }
}