import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering for authentication and database queries
export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'

// POST /api/lessons/[id]/complete - Mark lesson as completed
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lessonId = params.id
    const supabase = createClient()

    // Get simplified completion data from request body
    const body = await request.json()
    const { 
      timeSpent, 
      quizScore, 
      completionCriteria 
    } = body

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify lesson exists and get course info
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        id,
        title,
        course_id,
        order_index
      `)
      .eq('id', lessonId)
      .single()
      
    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Get course info separately
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('id', lesson.course_id)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if user is enrolled in the course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('course_id', lesson.course_id)
      .single()

    if (enrollmentError || !enrollment || !['active', 'completed'].includes(enrollment.status)) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 403 }
      )
    }

    // Check if lesson is already completed
    const { data: existingProgress, error: progressError } = await supabase
      .from('progress')
      .select('id, is_completed, completed_at')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single()

    if (existingProgress?.is_completed) {
      return NextResponse.json({
        message: 'Lesson already completed',
        completedAt: existingProgress.completed_at,
        nextLessonUnlocked: true
      })
    }

    // SIMPLIFIED validation - only check quiz if exists
    logDebug('Received completion data:', { quizScore, completionCriteria })
    
    // Ultra simple validation
    const hasQuiz = completionCriteria?.hasQuiz || false
    const passesValidation = completionCriteria?.passesValidation || false
    
    if (hasQuiz && !passesValidation) {
      return NextResponse.json(
        { error: 'Quiz score of 70% required to complete lesson with quiz' },
        { status: 400 }
      )
    }
    
    logDebug('Simplified validation passed:', { hasQuiz, passesValidation })

    // Start transaction to mark lesson complete and unlock next lesson
    const completedAt = new Date().toISOString()

    // Update or create lesson progress
    const { error: updateError } = await supabase
      .from('progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        enrollment_id: enrollment.id,
        completed: true,
        is_completed: true,
        completed_at: completedAt,
        last_accessed_at: completedAt,
        updated_at: completedAt,
        // Simplified completion data
        time_spent_minutes: Math.floor((timeSpent || 0) / 60),
        watch_time: timeSpent || 0,
        quiz_score: quizScore || 0,
        completion_criteria: {
          hasQuiz: hasQuiz,
          quizScore: quizScore || 0,
          completedAt: completedAt,
          validationMethod: 'simplified'
        }
      }, {
        onConflict: 'user_id,lesson_id'
      })

    if (updateError) {
      logError('Error updating lesson progress:', updateError)
      return NextResponse.json(
        { error: 'Failed to mark lesson as completed' },
        { status: 500 }
      )
    }

    // Find and unlock next lesson in the course
    const { data: nextLesson, error: nextLessonError } = await supabase
      .from('lessons')
      .select('id, title, order_index')
      .eq('course_id', lesson.course_id)
      .gt('order_index', lesson.order_index)
      .order('order_index', { ascending: true })
      .limit(1)
      .single()

    let nextLessonUnlocked = false
    
    if (nextLesson && !nextLessonError) {
      // Create progress entry for next lesson to unlock it
      const { error: unlockError } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          lesson_id: nextLesson.id,
          enrollment_id: enrollment.id,
          is_unlocked: true,
          unlocked_at: completedAt,
          last_accessed_at: completedAt,
          updated_at: completedAt
        }, {
          onConflict: 'user_id,lesson_id'
        })

      if (!unlockError) {
        nextLessonUnlocked = true
      }
    }

    // Update course progress
    await updateCourseProgress(supabase, user.id, lesson.course_id)

    // Log completion event for analytics
    await supabase
      .from('user_activity_logs')
      .insert({
        user_id: user.id,
        activity_type: 'lesson_completed',
        resource_type: 'lesson',
        resource_id: lessonId,
        metadata: {
          course_id: lesson.course_id,
          lesson_order: lesson.order_index,
          completed_at: completedAt,
          next_lesson_unlocked: nextLessonUnlocked
        }
      })

    return NextResponse.json({
      message: 'Lesson completed successfully',
      completedAt,
      nextLessonUnlocked,
      nextLesson: nextLessonUnlocked ? {
        id: nextLesson?.id,
        title: nextLesson?.title
      } : null,
      courseSlug: course?.slug
    })

  } catch (error) {
    logError('Lesson completion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to update course progress
async function updateCourseProgress(supabase: any, userId: string, courseId: string) {
  try {
    // Get total lessons and completed lessons for the course
    const { data: lessonStats } = await supabase
      .rpc('get_course_progress_stats', {
        user_uuid: userId,
        course_uuid: courseId
      })

    if (lessonStats && lessonStats.length > 0) {
      const { total_lessons, completed_lessons } = lessonStats[0]
      const progressPercentage = total_lessons > 0 
        ? Math.round((completed_lessons / total_lessons) * 100) 
        : 0

      // Update course progress
      await supabase
        .from('course_progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          progress_percentage: progressPercentage,
          completed_lessons,
          total_lessons,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id'
        })
    }
  } catch (error) {
    logError('Error updating course progress:', error)
  }
}

// Helper function to validate completion criteria
function validateCompletionCriteria(criteria: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Default requirements
  const requirements = {
    minimumTimeMinutes: 25,
    minimumQuizScore: 70,
    requireFullPDFRead: true,
    requireAllExercises: true
  }
  
  // Validate time spent (if provided)
  if (criteria.timeSpent !== undefined) {
    const timeMinutes = Math.floor(criteria.timeSpent / 60)
    if (timeMinutes < requirements.minimumTimeMinutes) {
      errors.push(`Minimum time requirement not met (${timeMinutes}/${requirements.minimumTimeMinutes} minutes)`)
    }
  }
  
  // Validate quiz score (if provided)
  if (criteria.quizScore !== undefined) {
    if (criteria.quizScore < requirements.minimumQuizScore) {
      errors.push(`Quiz score requirement not met (${criteria.quizScore}/${requirements.minimumQuizScore}%)`)
    }
  }
  
  // Validate PDF reading (if provided)
  if (criteria.pdfProgress !== undefined && requirements.requireFullPDFRead) {
    if (criteria.pdfProgress < 100) {
      errors.push(`PDF reading requirement not met (${criteria.pdfProgress}/100%)`)
    }
  }
  
  // Validate exercises completion (if provided)
  if (criteria.exercisesCompleted !== undefined && requirements.requireAllExercises) {
    if (criteria.exercisesCompleted < 100) {
      errors.push(`Exercises completion requirement not met (${criteria.exercisesCompleted}/100%)`)
    }
  }
  
  // Check if all criteria are completed
  if (criteria.criteria && Array.isArray(criteria.criteria)) {
    const allCompleted = criteria.criteria.every((criterion: any) => criterion.isCompleted)
    if (!allCompleted) {
      errors.push('Not all completion criteria have been met')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}