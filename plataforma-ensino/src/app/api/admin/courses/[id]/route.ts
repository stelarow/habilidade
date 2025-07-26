import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'

// Force dynamic rendering for admin routes that require authentication
export const dynamic = 'force-dynamic'

// Validation schema for course updates (all fields optional)
const updateCourseSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').optional(),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens').optional(),
  description: z.string().optional().nullable(),
  short_description: z.string().optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable().or(z.literal('')),
  video_preview_url: z.string().url().optional().nullable().or(z.literal('')),
  category_id: z.string().uuid('ID da categoria inválido').optional(),
  instructor_id: z.string().uuid('ID do instrutor inválido').optional().or(z.literal('')),
  price: z.number().min(0, 'Preço deve ser positivo').optional(),
  duration_minutes: z.number().min(0, 'Duração deve ser positiva').optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  requirements: z.array(z.string()).optional(),
  what_you_learn: z.array(z.string()).optional(),
  background_theme: z.string().optional(),
  is_published: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização'
})

// GET /api/admin/courses/[id] - Get specific course
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, profile } = await requireAdmin()
    const courseId = params.id
    
    const supabase = createClient()
    
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(id, name, color_theme),
        instructor:instructors(
          id,
          user:users(full_name, email)
        ),
        lessons_count:lessons(count),
        stats:course_stats(*)
      `)
      .eq('id', courseId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Curso não encontrado' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching course:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar curso' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data: course
    })
    
  } catch (error) {
    console.error('Course fetch error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/courses/[id] - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, profile } = await requireAdmin()
    const courseId = params.id
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateCourseSchema.parse(body)
    
    const supabase = createClient()
    
    // Check if course exists
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id, slug')
      .eq('id', courseId)
      .single()
    
    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      )
    }
    
    // If updating slug, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingCourse.slug) {
      const { data: conflictCourse } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', validatedData.slug)
        .neq('id', courseId)
        .single()
      
      if (conflictCourse) {
        return NextResponse.json(
          { error: 'Já existe um curso com este slug' },
          { status: 400 }
        )
      }
    }
    
    // Verify category exists if updating
    if (validatedData.category_id) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('id', validatedData.category_id)
        .single()
      
      if (!category) {
        return NextResponse.json(
          { error: 'Categoria não encontrada' },
          { status: 400 }
        )
      }
    }
    
    // Verify instructor exists if updating (and if provided)
    if (validatedData.instructor_id !== undefined) {
      if (validatedData.instructor_id && validatedData.instructor_id.trim()) {
        const { data: instructor } = await supabase
          .from('instructors')
          .select('id')
          .eq('id', validatedData.instructor_id)
          .single()
        
        if (!instructor) {
          return NextResponse.json(
            { error: 'Instrutor não encontrado' },
            { status: 400 }
          )
        }
      } else {
        // Set instructor_id to null if empty string provided
        (validatedData as any).instructor_id = null
      }
    }
    
    // Update course
    const { data: course, error } = await supabase
      .from('courses')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .select(`
        *,
        category:categories(id, name, color_theme),
        instructor:instructors(
          id,
          user:users(full_name, email)
        )
      `)
      .single()
    
    if (error) {
      console.error('Error updating course:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar curso' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data: course
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Course update error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/courses/[id] - Delete course
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, profile } = await requireAdmin()
    const courseId = params.id
    
    const supabase = createClient()
    
    // Check if course exists and get enrollment count
    const { data: courseInfo } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        enrollments:enrollments(count)
      `)
      .eq('id', courseId)
      .single()
    
    if (!courseInfo) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      )
    }
    
    // Check if course has active enrollments
    const enrollmentCount = Array.isArray(courseInfo.enrollments) 
      ? courseInfo.enrollments.length 
      : (courseInfo.enrollments as any)?.count || 0
    
    if (enrollmentCount > 0) {
      return NextResponse.json(
        { 
          error: 'Não é possível excluir curso com matrículas ativas',
          details: `Este curso possui ${enrollmentCount} matrícula(s) ativa(s)`
        },
        { status: 400 }
      )
    }
    
    // Delete course (lessons will be deleted via CASCADE)
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
    
    if (error) {
      console.error('Error deleting course:', error)
      return NextResponse.json(
        { error: 'Erro ao excluir curso' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Curso excluído com sucesso'
    })
    
  } catch (error) {
    console.error('Course deletion error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}