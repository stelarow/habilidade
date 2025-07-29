import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/availability-approvals
 * Admin endpoint to get pending availability change requests
 */
export async function GET(_request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdmin()
    const supabase = createClient()

    // Get pending approval requests from the view
    const { data: pendingRequests, error } = await supabase
      .from('admin_pending_availability_requests')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Database error fetching pending requests:', error)
      return NextResponse.json({
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to fetch pending requests'
        }
      }, { status: 500 })
    }

    return NextResponse.json({
      data: pendingRequests || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Approval requests GET error:', error)
    
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