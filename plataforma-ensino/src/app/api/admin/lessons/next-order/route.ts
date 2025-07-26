import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'

// Force dynamic rendering for admin routes that require authentication
export const dynamic = 'force-dynamic'

// GET /api/admin/lessons/next-order?courseId=uuid - Get next order index for a course
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const { user: _user, profile: _profile } = await requireAdmin()
    
    const supabase = createClient()
    const url = new URL(request.url)
    const courseId = url.searchParams.get('courseId')
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }
    
    // Verify course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', courseId)
      .single()
    
    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }
    
    // Get next order index
    const { data: nextOrder, error: orderError } = await supabase
      .rpc('get_next_lesson_order', { course_uuid: courseId })
    
    if (orderError) {
      logError('Error getting next order:', orderError)
      return NextResponse.json(
        { error: 'Failed to get next order index' },
        { status: 500 }
      )
    }
    
    // Get current lessons count for context
    const { count: lessonsCount, error: countError } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', courseId)
    
    if (countError) {
      logError('Error counting lessons:', countError)
    }
    
    return NextResponse.json({
      data: {
        nextOrderIndex: nextOrder,
        currentLessonsCount: lessonsCount || 0,
        course: {
          id: course.id,
          title: course.title
        }
      }
    })
    
  } catch (error) {
    logError('Next order API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}