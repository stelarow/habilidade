import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET /api/progress/[courseId] - Get detailed progress for a specific course
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const courseId = params.courseId

    // Get enrollment info
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, progress_percentage, status, enrolled_at')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    // Get detailed lesson progress
    const { data: lessonProgress, error: progressError } = await supabase
      .from('progress')
      .select(`
        *,
        lesson:lessons(
          id,
          title,
          slug,
          order_index,
          video_duration,
          is_preview
        )
      `)
      .eq('user_id', user.id)
      .eq('enrollment_id', enrollment.id)
      .order('lesson.order_index')

    if (progressError) {
      console.error('Error fetching lesson progress:', progressError)
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      )
    }

    // Get all lessons in the course to identify locked ones
    const { data: allLessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, slug, order_index, video_duration, is_preview')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('order_index')

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
      return NextResponse.json(
        { error: 'Failed to fetch lessons' },
        { status: 500 }
      )
    }

    // Get lesson analytics for engagement metrics
    const { data: analytics, error: analyticsError } = await supabase
      .from('lesson_analytics')
      .select('lesson_id, active_time_seconds, comprehension_score, completion_quality')
      .eq('user_id', user.id)
      .eq('enrollment_id', enrollment.id)

    const analyticsMap = analytics?.reduce((acc, item) => {
      acc[item.lesson_id] = item
      return acc
    }, {} as Record<string, any>) || {}

    // Build comprehensive progress data
    const progressMap = lessonProgress?.reduce((acc, item) => {
      acc[item.lesson_id] = item
      return acc
    }, {} as Record<string, any>) || {}

    const detailedProgress = allLessons?.map(lesson => {
      const progress = progressMap[lesson.id]
      const analytics = analyticsMap[lesson.id]
      
      return {
        lesson: lesson,
        progress: progress || {
          completed: false,
          is_unlocked: lesson.is_preview || lesson.order_index === 1,
          progress_percentage: 0,
          last_position: 0,
          watch_time: 0,
          time_spent_minutes: 0
        },
        analytics: analytics || null
      }
    }) || []

    // Calculate overall stats
    const completedLessons = detailedProgress.filter(p => p.progress.completed).length
    const totalLessons = allLessons?.length || 0
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('lesson_analytics')
      .select(`
        lesson_id,
        session_start,
        active_time_seconds,
        lesson:lessons(title, slug)
      `)
      .eq('user_id', user.id)
      .eq('enrollment_id', enrollment.id)
      .order('session_start', { ascending: false })
      .limit(10)

    return NextResponse.json({
      enrollment: {
        ...enrollment,
        calculated_progress: overallProgress
      },
      lessons: detailedProgress,
      stats: {
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        progress_percentage: overallProgress,
        total_study_time: detailedProgress.reduce((sum, p) => sum + (p.progress.time_spent_minutes || 0), 0),
        average_engagement: analytics && analytics.length > 0 
          ? analytics.reduce((sum, a) => sum + (a.comprehension_score || 0), 0) / analytics.length
          : 0
      },
      recent_activity: recentActivity || []
    })

  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}