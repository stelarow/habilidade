import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'

// Validation schema for course creation/update
const courseSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().optional(),
  short_description: z.string().optional(),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  video_preview_url: z.string().url().optional().or(z.literal('')),
  category_id: z.string().uuid('ID da categoria inválido'),
  instructor_id: z.string().uuid('ID do instrutor inválido').optional().or(z.literal('')),
  price: z.number().min(0, 'Preço deve ser positivo').default(0),
  duration_minutes: z.number().min(0, 'Duração deve ser positiva').default(0),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  requirements: z.array(z.string()).default([]),
  what_you_learn: z.array(z.string()).default([]),
  background_theme: z.string().default('default'),
  is_published: z.boolean().default(false)
})

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// GET /api/admin/courses - List courses for admin use (dropdown options, etc.)
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const supabase = createClient()
    const url = new URL(request.url)
    
    // Parse query parameters
    const onlyBasicInfo = url.searchParams.get('basic') === 'true'
    const search = url.searchParams.get('search')
    
    let query = supabase
      .from('courses')
      .select(onlyBasicInfo 
        ? 'id, title, slug, created_at'
        : `
          *,
          category:categories(id, name, color_theme),
          instructor:instructors(
            id,
            user:users(full_name, email)
          ),
          lessons_count:lessons(count)
        `
      )
      .order('created_at', { ascending: false })
    
    // Apply search filter if provided
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    const { data: courses, error } = await query
    
    if (error) {
      console.error('Error fetching courses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data: courses
    })
    
  } catch (error) {
    console.error('Courses API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/courses - Create new course
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const body = await request.json()
    
    // Generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title)
    }
    
    // Validate request body
    const validatedData = courseSchema.parse(body)
    
    const supabase = createClient()
    
    // Check if slug already exists
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', validatedData.slug)
      .single()
    
    if (existingCourse) {
      return NextResponse.json(
        { error: 'Já existe um curso com este slug' },
        { status: 400 }
      )
    }
    
    // Verify category exists
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
    
    // Verify instructor exists (if provided)
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
      // Set instructor_id to null if not provided
      (validatedData as any).instructor_id = null
    }
    
    // Create course
    const { data: course, error } = await supabase
      .from('courses')
      .insert([validatedData])
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
      console.error('Error creating course:', error)
      return NextResponse.json(
        { error: 'Erro ao criar curso' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data: course
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Course creation error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}