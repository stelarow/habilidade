import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'

// Force dynamic rendering for admin routes that require authentication
export const dynamic = 'force-dynamic'

// Validation schema for enrollment creation
const enrollmentSchema = z.object({
  user_id: z.string().uuid('ID do usuário inválido'),
  course_id: z.string().uuid('ID do curso inválido'),
  teacher_id: z.string().uuid('ID do professor inválido'),
  access_until: z.string().optional(),
  status: z.enum(['active', 'completed', 'cancelled', 'expired']).default('active'),
  is_in_person: z.boolean().default(false),
  has_two_classes_per_week: z.boolean().default(false),
  schedule_slot_1: z.string().uuid().optional(),
  schedule_slot_2: z.string().uuid().optional()
}).refine((data) => {
  // If in-person, first schedule slot is required
  if (data.is_in_person && !data.schedule_slot_1) {
    return false
  }
  // If two classes per week, second schedule slot is required and must be different
  if (data.has_two_classes_per_week && (!data.schedule_slot_2 || data.schedule_slot_1 === data.schedule_slot_2)) {
    return false
  }
  return true
}, {
  message: "Dados de agendamento inválidos"
})

// GET /api/admin/enrollments - List enrollments for admin use
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const supabase = createClient()
    const url = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')
    const courseId = url.searchParams.get('course_id')
    const userId = url.searchParams.get('user_id')
    
    const offset = (page - 1) * limit
    
    let query = supabase
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
          )
        )
      `)
      .order('enrolled_at', { ascending: false })
    
    // Apply filters
    if (search) {
      query = query.or(`user.full_name.ilike.%${search}%,user.email.ilike.%${search}%,course.title.ilike.%${search}%`)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (courseId) {
      query = query.eq('course_id', courseId)
    }
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    // Get total count for pagination
    const { count } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    const { data: enrollments, error } = await query
    
    if (error) {
      console.error('Error fetching enrollments:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar matrículas' },
        { status: 500 }
      )
    }
    
    const totalPages = Math.ceil((count || 0) / limit)
    
    return NextResponse.json({
      data: enrollments,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasMore: page < totalPages
      }
    })
    
  } catch (error) {
    console.error('Enrollments API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/enrollments - Create new enrollment
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const body = await request.json()
    
    // Validate request body
    const validatedData = enrollmentSchema.parse(body)
    
    const supabase = createClient()
    
    // Check if enrollment already exists
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', validatedData.user_id)
      .eq('course_id', validatedData.course_id)
      .single()
    
    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Usuário já está matriculado neste curso' },
        { status: 400 }
      )
    }
    
    // Verify user exists
    const { data: userExists } = await supabase
      .from('users')
      .select('id')
      .eq('id', validatedData.user_id)
      .single()
    
    if (!userExists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 400 }
      )
    }
    
    // Verify course exists
    const { data: courseExists } = await supabase
      .from('courses')
      .select('id')
      .eq('id', validatedData.course_id)
      .single()
    
    if (!courseExists) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 400 }
      )
    }
    
    // Verify teacher exists
    const { data: teacherExists } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', validatedData.teacher_id)
      .single()
    
    if (!teacherExists || !['admin', 'instructor'].includes(teacherExists.role)) {
      return NextResponse.json(
        { error: 'Professor não encontrado ou sem permissão para lecionar' },
        { status: 400 }
      )
    }
    
    // Create enrollment
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert([validatedData])
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
      console.error('Error creating enrollment:', error)
      return NextResponse.json(
        { error: 'Erro ao criar matrícula' },
        { status: 500 }
      )
    }
    
    // Create class schedules if in-person
    if (validatedData.is_in_person && enrollment) {
      const schedulePromises = []
      
      // First schedule slot
      if (validatedData.schedule_slot_1) {
        schedulePromises.push(
          supabase
            .from('class_schedules')
            .insert({
              enrollment_id: enrollment.id,
              teacher_id: validatedData.teacher_id,
              schedule_slot_id: validatedData.schedule_slot_1
            })
        )
      }
      
      // Second schedule slot if two classes per week
      if (validatedData.has_two_classes_per_week && validatedData.schedule_slot_2) {
        schedulePromises.push(
          supabase
            .from('class_schedules')
            .insert({
              enrollment_id: enrollment.id,
              teacher_id: validatedData.teacher_id,
              schedule_slot_id: validatedData.schedule_slot_2
            })
        )
      }
      
      // Execute schedule creation
      const scheduleResults = await Promise.all(schedulePromises)
      
      // Check for schedule errors
      const scheduleErrors = scheduleResults.filter(result => result.error)
      if (scheduleErrors.length > 0) {
        console.error('Error creating class schedules:', scheduleErrors)
        
        // Rollback enrollment if schedule creation failed
        await supabase.from('enrollments').delete().eq('id', enrollment.id)
        
        return NextResponse.json(
          { error: 'Erro ao agendar horários das aulas' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({
      data: enrollment,
      message: 'Matrícula criada com sucesso'
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Enrollment creation error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}