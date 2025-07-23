import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const rejectRequestSchema = z.object({
  admin_notes: z.string().optional()
})

/**
 * POST /api/admin/availability-approvals/[id]/reject
 * Admin endpoint to reject an availability change request
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: requestId } = params
    
    // Verify admin authentication
    const session = await requireAdmin()
    const supabase = createClient()

    // Validate request ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(requestId)) {
      return NextResponse.json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request ID format'
        }
      }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()
    const validatedData = rejectRequestSchema.parse(body)

    // Check if request exists and is pending
    const { data: requestData, error: fetchError } = await supabase
      .from('availability_change_requests')
      .select('*')
      .eq('id', requestId)
      .eq('status', 'pending')
      .single()

    if (fetchError || !requestData) {
      return NextResponse.json({
        error: {
          code: 'REQUEST_NOT_FOUND',
          message: 'Pending request not found'
        }
      }, { status: 404 })
    }

    // Update request status to rejected
    const { error: updateError } = await supabase
      .from('availability_change_requests')
      .update({
        status: 'rejected',
        reviewed_by_admin_id: session.user.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: validatedData.admin_notes
      })
      .eq('id', requestId)

    if (updateError) {
      console.error('Database error rejecting request:', updateError)
      return NextResponse.json({
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to reject request'
        }
      }, { status: 500 })
    }

    // If the request was for updating an existing availability slot,
    // clear the pending change flags
    if (requestData.change_type === 'update' && requestData.target_availability_id) {
      await supabase
        .from('teacher_availability')
        .update({
          has_pending_changes: false,
          pending_change_request_id: null
        })
        .eq('id', requestData.target_availability_id)
    }

    return NextResponse.json({
      data: { 
        id: requestId,
        status: 'rejected',
        rejected_by: session.user.id,
        rejected_at: new Date().toISOString(),
        admin_notes: validatedData.admin_notes
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors
        }
      }, { status: 400 })
    }

    console.error('Rejection POST error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Admin access required'
        }
      }, { status: 401 })
    }

    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }, { status: 500 })
  }
}