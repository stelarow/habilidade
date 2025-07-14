import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'

// GET /api/admin/lessons - List all lessons with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const supabase = createClient()
    const url = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const courseId = url.searchParams.get('courseId')
    const search = url.searchParams.get('search')
    const published = url.searchParams.get('published')
    
    const offset = (page - 1) * limit
    
    // Build query
    let query = supabase
      .from('lessons')
      .select(`
        *,
        course:courses(id, title, slug),
        exercises(id, title, order_index),
        quizzes(
          id, 
          title, 
          is_published,
          questions:quiz_questions(id)
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Apply filters
    if (courseId) {
      query = query.eq('course_id', courseId)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    if (published !== null && published !== '') {
      query = query.eq('is_published', published === 'true')
    }
    
    const { data: lessons, error } = await query
    
    if (error) {
      console.error('Error fetching lessons:', error)
      return NextResponse.json(
        { error: 'Failed to fetch lessons' },
        { status: 500 }
      )
    }
    
    // Get total count for pagination
    let countQuery = supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true })
    
    if (courseId) {
      countQuery = countQuery.eq('course_id', courseId)
    }
    
    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    if (published !== null && published !== '') {
      countQuery = countQuery.eq('is_published', published === 'true')
    }
    
    const { count, error: countError } = await countQuery
    
    if (countError) {
      console.error('Error counting lessons:', countError)
      return NextResponse.json(
        { error: 'Failed to count lessons' },
        { status: 500 }
      )
    }
    
    const totalPages = Math.ceil((count || 0) / limit)
    
    return NextResponse.json({
      data: lessons,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasMore: page < totalPages
      }
    })
    
  } catch (error) {
    console.error('Lessons API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/lessons - Create a new lesson
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const supabase = createClient()
    const body = await request.json()
    
    const {
      course_id,
      title,
      description,
      video_url,
      content,
      allows_file_upload = false,
      materials = [],
      is_preview = false,
      is_published = false,
      exercises = [],
      quiz
    } = body
    
    // Validate required fields
    if (!course_id || !title) {
      return NextResponse.json(
        { error: 'Course ID and title are required' },
        { status: 400 }
      )
    }
    
    // Get next order index for the course
    const { data: nextOrderData, error: orderError } = await supabase
      .rpc('get_next_lesson_order', { course_uuid: course_id })
    
    if (orderError) {
      console.error('Error getting next order:', orderError)
      return NextResponse.json(
        { error: 'Failed to determine lesson order' },
        { status: 500 }
      )
    }
    
    const order_index = nextOrderData
    
    // Generate unique slug from title
    const generateUniqueSlug = async (baseTitle: string, courseId: string): Promise<string> => {
      const baseSlug = baseTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
        .trim()

      let slug = baseSlug
      let counter = 1

      while (true) {
        // Check if slug exists for this course
        const { data: existingLesson } = await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', courseId)
          .eq('slug', slug)
          .single()

        if (!existingLesson) {
          return slug // Slug is unique
        }

        // Try next variation
        counter++
        slug = `${baseSlug}-${counter}`
      }
    }

    const slug = await generateUniqueSlug(title, course_id)
    
    // Start transaction
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .insert({
        course_id,
        title,
        slug,
        description,
        video_url,
        content,
        allows_file_upload,
        materials,
        order_index,
        is_preview,
        is_published
      })
      .select('*')
      .single()
    
    if (lessonError) {
      console.error('Error creating lesson:', lessonError)
      
      // Provide more specific error messages
      if (lessonError.code === '23505') { // Unique constraint violation
        if (lessonError.message.includes('course_id_slug')) {
          return NextResponse.json(
            { error: 'Uma aula com este título já existe neste curso' },
            { status: 400 }
          )
        }
        if (lessonError.message.includes('course_id_order_index')) {
          return NextResponse.json(
            { error: 'Erro na ordenação das aulas. Tente novamente.' },
            { status: 400 }
          )
        }
        return NextResponse.json(
          { error: 'Esta aula já existe. Verifique o título e tente novamente.' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Erro ao criar aula. Verifique os dados e tente novamente.' },
        { status: 500 }
      )
    }
    
    // Create exercises if provided
    if (exercises.length > 0) {
      const exercisesToInsert = exercises.map((exercise: any, index: number) => ({
        lesson_id: lesson.id,
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
        // Note: lesson was created, but exercises failed
        // In a real app, you might want to implement rollback
      }
    }
    
    // Create quiz if provided
    if (quiz) {
      const { data: createdQuiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          lesson_id: lesson.id,
          title: quiz.title,
          description: quiz.description,
          instructions: quiz.instructions,
          time_limit_minutes: quiz.time_limit_minutes,
          attempts_allowed: quiz.attempts_allowed || 1,
          passing_score: quiz.passing_score || 70,
          is_published: false // Always start as draft
        })
        .select('*')
        .single()
      
      if (quizError) {
        console.error('Error creating quiz:', quizError)
      } else if (quiz.questions && quiz.questions.length > 0) {
        // Create quiz questions
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
    
    // Fetch the complete lesson with all relations
    const { data: completeLesson, error: fetchError } = await supabase
      .from('lessons')
      .select(`
        *,
        course:courses(id, title, slug),
        exercises(*),
        quizzes(*, questions:quiz_questions(*))
      `)
      .eq('id', lesson.id)
      .single()
    
    if (fetchError) {
      console.error('Error fetching complete lesson:', fetchError)
      return NextResponse.json({ data: lesson })
    }
    
    return NextResponse.json(
      { 
        data: completeLesson,
        message: 'Lesson created successfully' 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Create lesson API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}