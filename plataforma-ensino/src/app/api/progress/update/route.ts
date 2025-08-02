import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const progressUpdateSchema = z.object({
  lesson_id: z.string().uuid(),
  enrollment_id: z.string().uuid(),
  progress_percentage: z.number().min(0).max(100).optional(),
  last_position: z.number().min(0).optional(),
  watch_time: z.number().min(0).optional(),
  time_spent_minutes: z.number().min(0).optional(),
  completed: z.boolean().optional(),
  difficulty_rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  bookmarked: z.boolean().optional(),
  
  // Analytics data
  session_data: z.object({
    active_time_seconds: z.number().min(0).optional(),
    total_time_seconds: z.number().min(0).optional(),
    pause_count: z.number().min(0).optional(),
    video_interactions: z.record(z.any()).optional(),
    content_interactions: z.record(z.any()).optional(),
    comprehension_score: z.number().min(0).max(100).optional(),
    completion_quality: z.enum(['skipped', 'rushed', 'normal', 'thorough']).optional()
  }).optional()
})

// POST /api/progress/update - Update lesson progress with analytics
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = progressUpdateSchema.parse(body)

    const { lesson_id, enrollment_id, session_data, ...progressData } = validatedData

    // Verify enrollment belongs to user
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id')
      .eq('id', enrollment_id)
      .eq('user_id', user.id)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found or unauthorized' },
        { status: 404 }
      )
    }

    // Start transaction-like operations
    const now = new Date().toISOString()

    // Update or insert progress record
    const { data: existingProgress, error: checkError } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson_id)
      .eq('enrollment_id', enrollment_id)
      .single()

    let progressResult
    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('progress')
        .update({
          ...progressData,
          updated_at: now,
          last_accessed_at: now
        })
        .eq('id', existingProgress.id)
        .select()
        .single()
      
      progressResult = { data, error }
    } else {
      // Insert new progress
      const { data, error } = await supabase
        .from('progress')
        .insert([{
          user_id: user.id,
          lesson_id,
          enrollment_id,
          ...progressData,
          created_at: now,
          updated_at: now,
          last_accessed_at: now
        }])
        .select()
        .single()
      
      progressResult = { data, error }
    }

    if (progressResult.error) {
      console.error('Error updating progress:', progressResult.error)
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      )
    }

    // Insert lesson analytics if provided
    if (session_data) {
      const { error: analyticsError } = await supabase
        .from('lesson_analytics')
        .insert([{
          user_id: user.id,
          lesson_id,
          enrollment_id,
          ...session_data,
          session_start: new Date(Date.now() - (session_data.total_time_seconds || 0) * 1000).toISOString(),
          session_end: now,
          created_at: now
        }])

      if (analyticsError) {
        console.error('Error inserting analytics:', analyticsError)
        // Don't fail the request if analytics fail
      }
    }

    // Update enrollment progress if lesson was completed
    if (progressData.completed) {
      // Get total and completed lessons count
      const { data: progressStats, error: statsError } = await supabase
        .rpc('calculate_enrollment_progress', { 
          enrollment_id_param: enrollment_id 
        })

      if (!statsError && progressStats) {
        await supabase
          .from('enrollments')
          .update({ 
            progress_percentage: progressStats.progress_percentage,
            updated_at: now 
          })
          .eq('id', enrollment_id)
      }

      // Check for achievement unlocks
      await checkAndUnlockAchievements(supabase, user.id, 'lesson_completed', {
        lesson_id,
        enrollment_id,
        course_id: enrollment.course_id
      })
    }

    // Unlock next lesson if current one is completed
    if (progressData.completed) {
      const { data: currentLesson } = await supabase
        .from('lessons')
        .select('order_index, course_id')
        .eq('id', lesson_id)
        .single()

      if (currentLesson) {
        const { data: nextLesson } = await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', currentLesson.course_id)
          .eq('order_index', currentLesson.order_index + 1)
          .single()

        if (nextLesson) {
          await supabase
            .from('progress')
            .upsert([{
              user_id: user.id,
              lesson_id: nextLesson.id,
              enrollment_id,
              is_unlocked: true,
              created_at: now,
              updated_at: now
            }], {
              onConflict: 'user_id,lesson_id,enrollment_id'
            })
        }
      }
    }

    return NextResponse.json({
      data: progressResult.data,
      message: 'Progress updated successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Progress update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to check and unlock achievements
async function checkAndUnlockAchievements(
  supabase: any, 
  userId: string, 
  eventType: string, 
  eventData: any
) {
  try {
    // This would contain logic to check achievement criteria
    // and unlock new achievements based on user progress
    
    // For now, we'll implement basic lesson completion achievements
    if (eventType === 'lesson_completed') {
      // Get user's total completed lessons
      const { data: stats } = await supabase
        .from('progress')
        .select('id')
        .eq('user_id', userId)
        .eq('completed', true)

      const completedCount = stats?.length || 0

      // Check for lesson completion achievements
      const achievementTargets = [1, 10, 50, 100]
      for (const target of achievementTargets) {
        if (completedCount === target) {
          const { data: achievement } = await supabase
            .from('achievements')
            .select('id')
            .eq('criteria->type', 'lessons_completed')
            .eq('criteria->target', target)
            .single()

          if (achievement) {
            await supabase
              .from('user_achievements')
              .insert([{
                user_id: userId,
                achievement_id: achievement.id,
                unlocked_at: new Date().toISOString()
              }])
              .on('conflict', () => {}) // Ignore if already exists
          }
        }
      }
    }
  } catch (error) {
    console.error('Achievement check error:', error)
    // Don't fail the main operation
  }
}