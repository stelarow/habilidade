import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { logError } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/availability-approvals/[id]/approve
 * Admin endpoint to approve an availability change request
 */
export async function POST(
  _request: NextRequest,
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

    // Check if request exists and is pending
    const { data: request, error: fetchError } = await supabase
      .from('availability_change_requests')
      .select('*')
      .eq('id', requestId)
      .eq('status', 'pending')
      .single()

    if (fetchError || !request) {
      return NextResponse.json({
        error: {
          code: 'REQUEST_NOT_FOUND',
          message: 'Pending request not found'
        }
      }, { status: 404 })
    }

    // Update request status to approved
    const { error: updateError } = await supabase
      .from('availability_change_requests')
      .update({
        status: 'approved',
        reviewed_by_admin_id: session.user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (updateError) {
      logError('Database error approving request:', updateError)
      return NextResponse.json({
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to approve request'
        }
      }, { status: 500 })
    }

    // The trigger apply_approved_availability_change_trigger will handle applying the changes

    return NextResponse.json({
      data: { 
        id: requestId,
        status: 'approved',
        approved_by: session.user.id,
        approved_at: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logError('Approval POST error:', error)
    
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