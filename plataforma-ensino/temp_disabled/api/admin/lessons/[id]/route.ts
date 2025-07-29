import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'

// Force dynamic rendering for admin routes that require authentication
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: { id: string }
}

// GET /api/admin/lessons/[id] - Get a specific lesson with all relations
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify admin access
    const { user: _user, profile: _profile } = await requireAdmin()
    
    const supabase = createClient()
    const lessonId = params.id
    
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select(`
        *,
        course:courses(id, title, slug),
        exercises(*),
        quizzes(
          *,
          questions:quiz_questions(*)
        ),
        submissions:lesson_submissions(
          *,
          user:users(id, full_name, email)
        )
      `)
      .eq('id', lessonId)
      .single()
    
    if (error) {
      console.error('Error fetching lesson:', error)
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ data: lesson })
    
  } catch (error) {
    console.error('Get lesson API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/lessons/[id] - Update a lesson
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify admin access
    const { user: _user, profile: _profile } = await requireAdmin()
    
    const supabase = createClient()
    const lessonId = params.id
    const body = await request.json()
    
    const {
      title,
      description,
      video_url,
      content,
      allows_file_upload,
      materials,
      is_preview,
      is_published,
      exercises = [],
      quiz
    } = body
    
    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
    
    // Update lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .update({
        title,
        slug,
        description,
        video_url,
        content,
        allows_file_upload,
        materials,
        is_preview,
        is_published
      })
      .eq('id', lessonId)
      .select('*')
      .single()
    
    if (lessonError) {
      console.error('Error updating lesson:', lessonError)
      return NextResponse.json(
        { error: 'Failed to update lesson' },
        { status: 500 }
      )
    }
    
    // Handle exercises update (simple approach: delete all and recreate)
    if (exercises && exercises.length >= 0) {
      // Delete existing exercises
      const { error: deleteExercisesError } = await supabase
        .from('exercises')
        .delete()
        .eq('lesson_id', lessonId)
      
      if (deleteExercisesError) {
        console.error('Error deleting exercises:', deleteExercisesError)
      } else if (exercises.length > 0) {
        // Create new exercises
        const exercisesToInsert = exercises.map((exercise: any, index: number) => ({
          lesson_id: lessonId,
          title: exercise.title,
          description: exercise.description,
          download_url: exercise.download_url,
          order_index: index + 1
        }))
        
        const { error: exercisesError } = await supabase
          .from('exercises')
          .insert(exercisesToInsert)
        
        if (exercisesError) {
          console.error('Error creating exercises:', exercisesError)
        }
      }
    }
    
    // Handle quiz update
    if (quiz) {
      // Check if quiz already exists
      const { data: existingQuiz } = await supabase
        .from('quizzes')
        .select('id')
        .eq('lesson_id', lessonId)
        .single()
      
      if (existingQuiz) {
        // Update existing quiz
        const { data: _updatedQuiz, error: updateQuizError } = await supabase
          .from('quizzes')
          .update({
            title: quiz.title,
            description: quiz.description,
            instructions: quiz.instructions,
            time_limit_minutes: quiz.time_limit_minutes,
            attempts_allowed: quiz.attempts_allowed || 1,
            passing_score: quiz.passing_score || 70,
            is_published: quiz.is_published || false
          })
          .eq('id', existingQuiz.id)
          .select('*')
          .single()
        
        if (updateQuizError) {
          console.error('Error updating quiz:', updateQuizError)
        } else {
          // Update quiz questions (delete all and recreate)
          const { error: deleteQuestionsError } = await supabase
            .from('quiz_questions')
            .delete()
            .eq('quiz_id', existingQuiz.id)
          
          if (deleteQuestionsError) {
            console.error('Error deleting quiz questions:', deleteQuestionsError)
          } else if (quiz.questions && quiz.questions.length > 0) {
            const questionsToInsert = quiz.questions.map((question: any, index: number) => ({
              quiz_id: existingQuiz.id,
              question: question.question,
              options: question.options,
              correct_answer: question.correct_answer,
              explanation: question.explanation,
              points: question.points || 1,
              order_index: index + 1
            }))
            
            const { error: questionsError } = await supabase
              .from('quiz_questions')
              .insert(questionsToInsert)
            
            if (questionsError) {
              console.error('Error creating quiz questions:', questionsError)
            }
          }
        }
      } else {
        // Create new quiz
        const { data: createdQuiz, error: quizError } = await supabase
          .from('quizzes')
          .insert({
            lesson_id: lessonId,
            title: quiz.title,
            description: quiz.description,
            instructions: quiz.instructions,
            time_limit_minutes: quiz.time_limit_minutes,
            attempts_allowed: quiz.attempts_allowed || 1,
            passing_score: quiz.passing_score || 70,
            is_published: quiz.is_published || false
          })
          .select('*')
          .single()
        
        if (quizError) {
          console.error('Error creating quiz:', quizError)
        } else if (quiz.questions && quiz.questions.length > 0) {
          const questionsToInsert = quiz.questions.map((question: any, index: number) => ({
            quiz_id: createdQuiz.id,
            question: question.question,
            options: question.options,
            correct_answer: question.correct_answer,
            explanation: question.explanation,
            points: question.points || 1,
            order_index: index + 1
          }))
          
          const { error: questionsError } = await supabase
            .from('quiz_questions')
            .insert(questionsToInsert)
          
          if (questionsError) {
            console.error('Error creating quiz questions:', questionsError)
          }
        }
      }
    }
    
    // Fetch the complete updated lesson
    const { data: completeLesson, error: fetchError } = await supabase
      .from('lessons')
      .select(`
        *,
        course:courses(id, title, slug),
        exercises(*),
        quizzes(*, questions:quiz_questions(*))
      `)
      .eq('id', lessonId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching complete lesson:', fetchError)
      return NextResponse.json({ data: lesson })
    }
    
    return NextResponse.json({
      data: completeLesson,
      message: 'Lesson updated successfully'
    })
    
  } catch (error) {
    console.error('Update lesson API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/lessons/[id] - Delete a lesson
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify admin access
    const { user: _user, profile: _profile } = await requireAdmin()
    
    const supabase = createClient()
    const lessonId = params.id
    
    // Check if lesson exists
    const { data: existingLesson, error: checkError } = await supabase
      .from('lessons')
      .select('id, title, course_id')
      .eq('id', lessonId)
      .single()
    
    if (checkError || !existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }
    
    // Delete lesson (CASCADE will handle related records)
    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId)
    
    if (deleteError) {
      console.error('Error deleting lesson:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete lesson' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Lesson deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete lesson API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}