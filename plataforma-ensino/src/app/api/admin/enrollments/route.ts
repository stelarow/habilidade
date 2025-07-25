import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'

// Force dynamic rendering for admin routes that require authentication
export const dynamic = 'force-dynamic'

// Enhanced validation schema for Story 1.2 API format
const enhancedEnrollmentSchema = z.object({
  student_id: z.string().uuid('ID do estudante inválido'),
  course_id: z.string().uuid('ID do curso inválido'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de início deve estar no formato YYYY-MM-DD'),
  modality: z.enum(['online', 'in-person'], { 
    errorMap: () => ({ message: 'Modalidade deve ser "online" ou "in-person"' })
  }),
  schedules: z.array(z.object({
    instructor_id: z.string().uuid('ID do instrutor inválido'),
    day_of_week: z.number().int().min(1).max(7, 'Dia da semana deve ser entre 1-7 (1=Segunda, 7=Domingo)'),
    start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Horário de início deve estar no formato HH:MM:SS'),
    end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Horário de fim deve estar no formato HH:MM:SS')
  })).optional()
}).refine((data) => {
  // If in-person, schedules array is required and must have at least one schedule
  if (data.modality === 'in-person') {
    return data.schedules && data.schedules.length > 0
  }
  return true
}, {
  message: 'Para modalidade presencial, é obrigatório fornecer pelo menos um horário',
  path: ['schedules']
}).refine((data) => {
  // Validate time order for each schedule
  if (data.schedules) {
    return data.schedules.every(schedule => schedule.start_time < schedule.end_time)
  }
  return true
}, {
  message: 'Horário de início deve ser anterior ao horário de fim',
  path: ['schedules']
})

// Legacy validation schema for backward compatibility (form submission)
const legacyEnrollmentSchema = z.object({
  user_id: z.string().uuid('ID do usuário inválido'),
  course_id: z.string().uuid('ID do curso inválido'),
  teacher_id: z.string().uuid('ID do professor inválido').optional(),
  access_until: z.string().optional(),
  status: z.enum(['active', 'completed', 'cancelled', 'expired']).default('active'),
  is_in_person: z.boolean().default(false),
  has_two_classes_per_week: z.boolean().default(false),
  schedule_slot_1: z.string().optional(),
  schedule_slot_2: z.string().optional()
}).refine((data) => {
  // If in-person, teacher is required
  if (data.is_in_person && !data.teacher_id) {
    return false
  }
  return true
}, {
  message: "Professor é obrigatório para aulas presenciais"
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

// POST /api/admin/enrollments - Create new enrollment (supports both enhanced and legacy formats)
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const body = await request.json()
    
    // Try enhanced schema first, then fall back to legacy
    let validatedData: any
    let isEnhancedFormat = false
    
    try {
      validatedData = enhancedEnrollmentSchema.parse(body)
      isEnhancedFormat = true
    } catch (enhancedError) {
      // Fall back to legacy format
      try {
        validatedData = legacyEnrollmentSchema.parse(body)
        isEnhancedFormat = false
      } catch (legacyError) {
        // Return enhanced format errors as they're more descriptive
        throw enhancedError
      }
    }
    
    const supabase = createClient()
    
    // Extract common fields based on format
    const userId = isEnhancedFormat ? validatedData.student_id : validatedData.user_id
    const courseId = validatedData.course_id
    
    // Check if enrollment already exists
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
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
      .eq('id', userId)
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
      .eq('id', courseId)
      .single()
    
    if (!courseExists) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 400 }
      )
    }
    
    // For enhanced format, verify all instructors exist
    if (isEnhancedFormat && validatedData.schedules) {
      const instructorIds = validatedData.schedules.map((s: any) => s.instructor_id)
      const { data: instructors } = await supabase
        .from('users')
        .select('id, role')
        .in('id', instructorIds)
      
      if (!instructors || instructors.length !== instructorIds.length) {
        return NextResponse.json(
          { error: 'Um ou mais instrutores não foram encontrados' },
          { status: 400 }
        )
      }
      
      const invalidInstructors = instructors.filter(i => !['admin', 'instructor'].includes(i.role))
      if (invalidInstructors.length > 0) {
        return NextResponse.json(
          { error: 'Um ou mais usuários não têm permissão para lecionar' },
          { status: 400 }
        )
      }
    }
    
    // For legacy format, verify teacher exists if provided
    if (!isEnhancedFormat && validatedData.teacher_id) {
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
    }
    
    // Prepare enrollment data based on format
    const enrollmentData = isEnhancedFormat ? {
      user_id: userId,
      course_id: courseId,
      enrolled_at: validatedData.start_date + 'T00:00:00Z',
      modality: validatedData.modality,
      status: 'active'
    } : {
      user_id: userId,
      course_id: courseId,
      access_until: validatedData.access_until,
      status: validatedData.status,
      modality: validatedData.is_in_person ? 'in-person' : 'online'
    }
    
    // Create enrollment
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert([enrollmentData])
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
    
    // Create student schedules based on format and modality
    let schedulesToCreate: any[] = []
    if (enrollment) {
      
      if (isEnhancedFormat && validatedData.schedules && validatedData.modality === 'in-person') {
        // Enhanced format with schedules array
        schedulesToCreate = validatedData.schedules.map((schedule: any) => ({
          enrollment_id: enrollment.id,
          instructor_id: schedule.instructor_id,
          day_of_week: schedule.day_of_week,
          start_time: schedule.start_time,
          end_time: schedule.end_time
        }))
      } else if (!isEnhancedFormat && validatedData.is_in_person) {
        // Legacy format - would need conversion from schedule slots to actual times
        // For now, we'll skip this as it requires additional data conversion
        // This would be handled by the form transformation in the frontend
      }
      
      // Insert student schedules if any
      if (schedulesToCreate.length > 0) {
        const { error: scheduleError } = await supabase
          .from('student_schedules')
          .insert(schedulesToCreate)
        
        if (scheduleError) {
          console.error('Error creating student schedules:', scheduleError)
          
          // Rollback enrollment if schedule creation failed
          await supabase.from('enrollments').delete().eq('id', enrollment.id)
          
          return NextResponse.json(
            { 
              error: 'Erro ao criar horários da matrícula',
              details: scheduleError.message
            },
            { status: 500 }
          )
        }
      }
    }
    
    // Fetch the created schedules to include in response
    let schedules: any[] = []
    if (enrollment && schedulesToCreate.length > 0) {
      const { data: createdSchedules } = await supabase
        .from('student_schedules')
        .select('*')
        .eq('enrollment_id', enrollment.id)
      
      schedules = createdSchedules || []
    }
    
    return NextResponse.json({
      data: {
        ...enrollment,
        schedules: schedules
      },
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