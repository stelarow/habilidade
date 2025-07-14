import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'

// Validation schema for enrollment update
const enrollmentUpdateSchema = z.object({
  status: z.enum(['active', 'completed', 'cancelled', 'expired']).optional(),
  access_until: z.string().optional(),
  completed_at: z.string().optional()
})

// GET /api/admin/enrollments/[id] - Get enrollment details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const supabase = createClient()
    const enrollmentId = params.id
    
    // Validate UUID format
    if (!enrollmentId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(enrollmentId)) {
      return NextResponse.json(
        { error: 'ID da matrícula inválido' },
        { status: 400 }
      )
    }
    
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        user:users(id, full_name, email, avatar_url),
        course:courses(
          id, 
          title, 
          slug, 
          thumbnail_url, 
          duration_minutes,
          category:categories(name, color_theme),
          instructor:instructors(
            id,
            user:users(full_name)
          ),
          lessons(id, title, order_index, is_published)
        )
      `)
      .eq('id', enrollmentId)
      .single()
    
    if (error) {
      console.error('Error fetching enrollment:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Matrícula não encontrada' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Erro ao buscar matrícula' },
        { status: 500 }
      )
    }
    
    // Get progress details for this enrollment
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select(`
        *,
        lesson:lessons(id, title, order_index, video_duration)
      `)
      .eq('enrollment_id', enrollmentId)
      .order('lesson.order_index', { ascending: true })
    
    if (progressError) {
      console.error('Error fetching progress:', progressError)
    }
    
    return NextResponse.json({
      data: {
        ...enrollment,
        progress: progress || []
      }
    })
    
  } catch (error) {
    console.error('Enrollment detail API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/enrollments/[id] - Update enrollment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const body = await request.json()
    const enrollmentId = params.id
    
    // Validate UUID format
    if (!enrollmentId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(enrollmentId)) {
      return NextResponse.json(
        { error: 'ID da matrícula inválido' },
        { status: 400 }
      )
    }
    
    // Validate request body
    const validatedData = enrollmentUpdateSchema.parse(body)
    
    const supabase = createClient()
    
    // Check if enrollment exists
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id, status')
      .eq('id', enrollmentId)
      .single()
    
    if (!existingEnrollment) {
      return NextResponse.json(
        { error: 'Matrícula não encontrada' },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // Auto-set completed_at when status becomes completed
    if (validatedData.status === 'completed' && existingEnrollment.status !== 'completed') {
      updateData.completed_at = new Date().toISOString()
    }
    
    // Clear completed_at when status is not completed
    if (validatedData.status && validatedData.status !== 'completed') {
      updateData.completed_at = null
    }
    
    // Update enrollment
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .update(updateData)
      .eq('id', enrollmentId)
      .select(`
        *,
        user:users(id, full_name, email, avatar_url),
        course:courses(
          id, 
          title, 
          slug, 
          thumbnail_url, 
          duration_minutes,
          category:categories(name, color_theme),
          instructor:instructors(
            id,
            user:users(full_name)
          )
        )
      `)
      .single()
    
    if (error) {
      console.error('Error updating enrollment:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar matrícula' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data: enrollment,
      message: 'Matrícula atualizada com sucesso'
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Enrollment update error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/enrollments/[id] - Delete enrollment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const enrollmentId = params.id
    
    // Validate UUID format
    if (!enrollmentId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(enrollmentId)) {
      return NextResponse.json(
        { error: 'ID da matrícula inválido' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    // Check if enrollment exists
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id')
      .eq('id', enrollmentId)
      .single()
    
    if (!existingEnrollment) {
      return NextResponse.json(
        { error: 'Matrícula não encontrada' },
        { status: 404 }
      )
    }
    
    // Delete associated progress records first (cascade should handle this, but being explicit)
    const { error: progressError } = await supabase
      .from('progress')
      .delete()
      .eq('enrollment_id', enrollmentId)
    
    if (progressError) {
      console.error('Error deleting progress:', progressError)
      return NextResponse.json(
        { error: 'Erro ao remover progresso da matrícula' },
        { status: 500 }
      )
    }
    
    // Delete enrollment
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', enrollmentId)
    
    if (error) {
      console.error('Error deleting enrollment:', error)
      return NextResponse.json(
        { error: 'Erro ao remover matrícula' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Matrícula removida com sucesso'
    })
    
  } catch (error) {
    console.error('Enrollment deletion error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}