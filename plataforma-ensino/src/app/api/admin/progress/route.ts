import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'

// Force dynamic rendering for admin routes that require authentication
export const dynamic = 'force-dynamic'

// Validation schema for progress creation/update
const progressSchema = z.object({
  user_id: z.string().uuid('ID do usuário inválido'),
  lesson_id: z.string().uuid('ID da aula inválido'),
  enrollment_id: z.string().uuid('ID da matrícula inválido'),
  completed: z.boolean().default(false),
  last_position: z.number().min(0).default(0),
  watch_time: z.number().min(0).default(0)
})

// Validation schema for bulk progress update
const bulkProgressSchema = z.object({
  enrollment_id: z.string().uuid('ID da matrícula inválido'),
  progress_updates: z.array(z.object({
    lesson_id: z.string().uuid('ID da aula inválido'),
    completed: z.boolean(),
    last_position: z.number().min(0).optional(),
    watch_time: z.number().min(0).optional()
  }))
})

// GET /api/admin/progress - List progress records
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const { user: _user, profile: _profile } = await requireAdmin()
    
    const supabase = createClient()
    const url = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const enrollmentId = url.searchParams.get('enrollment_id')
    const userId = url.searchParams.get('user_id')
    const courseId = url.searchParams.get('course_id')
    const lessonId = url.searchParams.get('lesson_id')
    const completed = url.searchParams.get('completed')
    
    const offset = (page - 1) * limit
    
    let query = supabase
      .from('progress')
      .select(`
        *,
        user:users(id, full_name, email, avatar_url),
        lesson:lessons(
          id, 
          title, 
          order_index, 
          video_duration,
          course:courses(id, title, slug)
        ),
        enrollment:enrollments(id, status, enrolled_at)
      `)
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (enrollmentId) {
      query = query.eq('enrollment_id', enrollmentId)
    }
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }
    
    if (completed !== null) {
      query = query.eq('completed', completed === 'true')
    }
    
    // Filter by course if provided
    if (courseId) {
      query = query.eq('lesson.course_id', courseId)
    }
    
    // Get total count for pagination
    const { count } = await supabase
      .from('progress')
      .select('*', { count: 'exact', head: true })
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    const { data: progress, error } = await query
    
    if (error) {
      console.error('Error fetching progress:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar progresso' },
        { status: 500 }
      )
    }
    
    const totalPages = Math.ceil((count || 0) / limit)
    
    return NextResponse.json({
      data: progress,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasMore: page < totalPages
      }
    })
    
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/progress - Create or update progress record
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const { user: _user, profile: _profile } = await requireAdmin()
    
    const body = await request.json()
    const supabase = createClient()
    
    // Check if this is a bulk update
    if (body.progress_updates && Array.isArray(body.progress_updates)) {
      // Handle bulk progress update
      const validatedData = bulkProgressSchema.parse(body)
      
      // Verify enrollment exists
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, user_id, course_id')
        .eq('id', validatedData.enrollment_id)
        .single()
      
      if (!enrollment) {
        return NextResponse.json(
          { error: 'Matrícula não encontrada' },
          { status: 400 }
        )
      }
      
      // Process each progress update
      const results = []
      const errors = []
      
      for (const update of validatedData.progress_updates) {
        try {
          // Check if progress record exists
          const { data: existingProgress } = await supabase
            .from('progress')
            .select('id')
            .eq('user_id', enrollment.user_id)
            .eq('lesson_id', update.lesson_id)
            .eq('enrollment_id', validatedData.enrollment_id)
            .single()
          
          const progressData = {
            user_id: enrollment.user_id,
            lesson_id: update.lesson_id,
            enrollment_id: validatedData.enrollment_id,
            completed: update.completed,
            last_position: update.last_position || 0,
            watch_time: update.watch_time || 0,
            ...(update.completed && { completed_at: new Date().toISOString() })
          }
          
          if (existingProgress) {
            // Update existing progress
            const { data: updatedProgress, error } = await supabase
              .from('progress')
              .update(progressData)
              .eq('id', existingProgress.id)
              .select(`
                *,
                lesson:lessons(id, title, order_index)
              `)
              .single()
            
            if (error) throw error
            results.push(updatedProgress)
          } else {
            // Create new progress record
            const { data: newProgress, error } = await supabase
              .from('progress')
              .insert([progressData])
              .select(`
                *,
                lesson:lessons(id, title, order_index)
              `)
              .single()
            
            if (error) throw error
            results.push(newProgress)
          }
        } catch (error) {
          console.error(`Error updating progress for lesson ${update.lesson_id}:`, error)
          errors.push({
            lesson_id: update.lesson_id,
            error: error instanceof Error ? error.message : 'Erro ao atualizar progresso'
          })
        }
      }
      
      // Update enrollment progress percentage
      await supabase.rpc('update_enrollment_progress', {
        enrollment_uuid: validatedData.enrollment_id
      })
      
      return NextResponse.json({
        data: results,
        errors: errors.length > 0 ? errors : undefined,
        message: `${results.length} registros de progresso atualizados${errors.length > 0 ? ` (${errors.length} erros)` : ''}`
      })
    } else {
      // Handle single progress update
      const validatedData = progressSchema.parse(body)
      
      // Verify enrollment exists and belongs to user
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, user_id')
        .eq('id', validatedData.enrollment_id)
        .eq('user_id', validatedData.user_id)
        .single()
      
      if (!enrollment) {
        return NextResponse.json(
          { error: 'Matrícula não encontrada ou não pertence ao usuário' },
          { status: 400 }
        )
      }
      
      // Verify lesson exists
      const { data: lesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('id', validatedData.lesson_id)
        .single()
      
      if (!lesson) {
        return NextResponse.json(
          { error: 'Aula não encontrada' },
          { status: 400 }
        )
      }
      
      // Check if progress record already exists
      const { data: existingProgress } = await supabase
        .from('progress')
        .select('id')
        .eq('user_id', validatedData.user_id)
        .eq('lesson_id', validatedData.lesson_id)
        .eq('enrollment_id', validatedData.enrollment_id)
        .single()
      
      const progressData = {
        ...validatedData,
        ...(validatedData.completed && { completed_at: new Date().toISOString() })
      }
      
      if (existingProgress) {
        // Update existing progress
        const { data: progress, error } = await supabase
          .from('progress')
          .update(progressData)
          .eq('id', existingProgress.id)
          .select(`
            *,
            user:users(id, full_name, email),
            lesson:lessons(id, title, order_index, video_duration),
            enrollment:enrollments(id, status)
          `)
          .single()
        
        if (error) {
          console.error('Error updating progress:', error)
          return NextResponse.json(
            { error: 'Erro ao atualizar progresso' },
            { status: 500 }
          )
        }
        
        // Update enrollment progress percentage
        await supabase.rpc('update_enrollment_progress', {
          enrollment_uuid: validatedData.enrollment_id
        })
        
        return NextResponse.json({
          data: progress,
          message: 'Progresso atualizado com sucesso'
        })
      } else {
        // Create new progress record
        const { data: progress, error } = await supabase
          .from('progress')
          .insert([progressData])
          .select(`
            *,
            user:users(id, full_name, email),
            lesson:lessons(id, title, order_index, video_duration),
            enrollment:enrollments(id, status)
          `)
          .single()
        
        if (error) {
          console.error('Error creating progress:', error)
          return NextResponse.json(
            { error: 'Erro ao criar progresso' },
            { status: 500 }
          )
        }
        
        // Update enrollment progress percentage
        await supabase.rpc('update_enrollment_progress', {
          enrollment_uuid: validatedData.enrollment_id
        })
        
        return NextResponse.json({
          data: progress,
          message: 'Progresso criado com sucesso'
        }, { status: 201 })
      }
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Progress creation/update error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}