import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'

// Validation schema for progress update
const progressUpdateSchema = z.object({
  completed: z.boolean().optional(),
  last_position: z.number().min(0).optional(),
  watch_time: z.number().min(0).optional()
})

// GET /api/admin/progress/[id] - Get progress details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const supabase = createClient()
    const progressId = params.id
    
    // Validate UUID format
    if (!progressId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(progressId)) {
      return NextResponse.json(
        { error: 'ID do progresso inválido' },
        { status: 400 }
      )
    }
    
    const { data: progress, error } = await supabase
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
        enrollment:enrollments(
          id, 
          status, 
          enrolled_at, 
          progress_percentage,
          course:courses(id, title, slug)
        )
      `)
      .eq('id', progressId)
      .single()
    
    if (error) {
      console.error('Error fetching progress:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Progresso não encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Erro ao buscar progresso' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data: progress
    })
    
  } catch (error) {
    console.error('Progress detail API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/progress/[id] - Update progress
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const body = await request.json()
    const progressId = params.id
    
    // Validate UUID format
    if (!progressId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(progressId)) {
      return NextResponse.json(
        { error: 'ID do progresso inválido' },
        { status: 400 }
      )
    }
    
    // Validate request body
    const validatedData = progressUpdateSchema.parse(body)
    
    const supabase = createClient()
    
    // Check if progress exists
    const { data: existingProgress } = await supabase
      .from('progress')
      .select('id, completed, enrollment_id')
      .eq('id', progressId)
      .single()
    
    if (!existingProgress) {
      return NextResponse.json(
        { error: 'Progresso não encontrado' },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // Auto-set completed_at when marking as completed
    if (validatedData.completed === true && existingProgress.completed !== true) {
      updateData.completed_at = new Date().toISOString()
    }
    
    // Clear completed_at when marking as not completed
    if (validatedData.completed === false) {
      updateData.completed_at = null
    }
    
    // Update progress
    const { data: progress, error } = await supabase
      .from('progress')
      .update(updateData)
      .eq('id', progressId)
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
        enrollment:enrollments(id, status, enrolled_at, progress_percentage)
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
    if (existingProgress.enrollment_id) {
      await supabase.rpc('update_enrollment_progress', {
        enrollment_uuid: existingProgress.enrollment_id
      })
    }
    
    return NextResponse.json({
      data: progress,
      message: 'Progresso atualizado com sucesso'
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Progress update error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/progress/[id] - Delete progress (reset lesson progress)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const progressId = params.id
    
    // Validate UUID format
    if (!progressId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(progressId)) {
      return NextResponse.json(
        { error: 'ID do progresso inválido' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    // Check if progress exists and get enrollment_id
    const { data: existingProgress } = await supabase
      .from('progress')
      .select('id, enrollment_id, user_id, lesson_id')
      .eq('id', progressId)
      .single()
    
    if (!existingProgress) {
      return NextResponse.json(
        { error: 'Progresso não encontrado' },
        { status: 404 }
      )
    }
    
    // Delete progress record
    const { error } = await supabase
      .from('progress')
      .delete()
      .eq('id', progressId)
    
    if (error) {
      console.error('Error deleting progress:', error)
      return NextResponse.json(
        { error: 'Erro ao remover progresso' },
        { status: 500 }
      )
    }
    
    // Update enrollment progress percentage
    if (existingProgress.enrollment_id) {
      await supabase.rpc('update_enrollment_progress', {
        enrollment_uuid: existingProgress.enrollment_id
      })
    }
    
    return NextResponse.json({
      message: 'Progresso da aula resetado com sucesso'
    })
    
  } catch (error) {
    console.error('Progress deletion error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}