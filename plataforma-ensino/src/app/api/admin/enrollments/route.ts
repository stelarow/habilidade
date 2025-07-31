import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'

// Force dynamic rendering for admin routes that require authentication
export const dynamic = 'force-dynamic'

// Enhanced validation schema for Story 1.2 API format
// 
// CRITICAL ID MAPPING REFERENCE:
// ================================
// Database Table Relationships:
// - instructors.id (UUID) -> unique instructor profile identifier  
// - instructors.user_id (UUID) -> references users.id (instructor's user account)
// - teacher_availability.teacher_id (UUID) -> references instructors.id
// - student_schedules.instructor_id (UUID) -> references users.id (NOT instructors.id!)
//
// API Request/Response Mapping:
// - schedules[].instructor_id in request body -> users.id (for student_schedules table)
// - Frontend TeacherSelector provides both instructor.id AND instructor.user_id
// - SimplifiedWeeklySchedule needs BOTH IDs for proper queries:
//   * teacherId (instructor.id) for teacher_availability queries
//   * teacherUserId (user.id) for student_schedules queries
//
// This mapping was corrected to fix enrollment validation errors with instructor 
// Maria Eduarda (instructor.id: 3834f9e6-2fd9-447f-9d74-757cdd6b6e44, 
//                user.id: 355f9ed5-c838-4c66-8671-2cfbf87121fa)
const enhancedEnrollmentSchema = z.object({
  student_id: z.string().uuid('ID do estudante inválido'),
  course_id: z.string().uuid('ID do curso inválido'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de início deve estar no formato YYYY-MM-DD'),
  modality: z.enum(['online', 'in-person'], { 
    errorMap: () => ({ message: 'Modalidade deve ser "online" ou "in-person"' })
  }),
  schedules: z.array(z.object({
    instructor_id: z.string().uuid('ID do instrutor inválido'), // Note: This is actually the user_id from users table
    day_of_week: z.number().int().min(1).max(7, 'Dia da semana deve ser entre 1-7 (1=Segunda, 7=Domingo)'),
    start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Horário de início deve estar no formato HH:MM:SS'),
    end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Horário de fim deve estar no formato HH:MM:SS')
  })).optional().default([])
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
  if (data.schedules && data.schedules.length > 0) {
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
    const { user: _user, profile: _profile } = await requireAdmin()
    
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
    const { user: _user, profile: _profile } = await requireAdmin()
    
    const body = await request.json()
    
    // Try enhanced schema first, then fall back to legacy
    let validatedData: any
    let isEnhancedFormat = false
    
    // Log the incoming data for debugging
    console.log('Enrollment API - Incoming data: ' + JSON.stringify(body, null, 2))
    
    try {
      validatedData = enhancedEnrollmentSchema.parse(body)
      isEnhancedFormat = true
      console.log('Enrollment API - Enhanced schema validation passed')
    } catch (enhancedError) {
      console.log('Enrollment API - Enhanced schema failed: ' + (enhancedError instanceof Error ? enhancedError.message : String(enhancedError)))
      // Fall back to legacy format
      try {
        validatedData = legacyEnrollmentSchema.parse(body)
        isEnhancedFormat = false
        console.log('Enrollment API - Legacy schema validation passed')
      } catch (legacyError) {
        console.log('Enrollment API - Legacy schema failed: ' + (legacyError instanceof Error ? legacyError.message : String(legacyError)))
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
    if (isEnhancedFormat && validatedData.schedules && validatedData.schedules.length > 0) {
      const instructorIds = validatedData.schedules.map((s: any) => s.instructor_id)
      console.log('Enrollment API - Validating instructor IDs (as user_ids): ' + JSON.stringify(instructorIds))
      
      // IMPORTANT: instructor_id in the request body actually refers to user_id in the users table
      // This is because student_schedules.instructor_id references users.id, not instructors.id
      
      // Step 1: Check if these users exist in the users table
      const { data: allUsers, error: usersQueryError } = await supabase
        .from('users')
        .select('id, role, full_name, email')
        .in('id', instructorIds)
      
      if (usersQueryError) {
        console.error('Enrollment API - Error querying users:', usersQueryError)
        return NextResponse.json(
          { 
            error: 'Erro ao validar usuários instrutores',
            details: usersQueryError.message
          },
          { status: 500 }
        )
      }
      
      console.log('Enrollment API - Found users: ' + JSON.stringify(allUsers))
      
      // Step 2: Check if these users have instructor profiles
      const { data: instructorProfiles, error: instructorProfilesError } = await supabase
        .from('instructors')
        .select('id, user_id, bio, rating')
        .in('user_id', instructorIds)
      
      if (instructorProfilesError) {
        console.error('Enrollment API - Error querying instructor profiles:', instructorProfilesError)
        return NextResponse.json(
          { 
            error: 'Erro ao validar perfis de instrutores',
            details: instructorProfilesError.message
          },
          { status: 500 }
        )
      }
      
      console.log('Enrollment API - Found instructor profiles: ' + JSON.stringify(instructorProfiles))
      
      // Step 3: Validate results and provide detailed error information
      const foundUserIds = allUsers?.map((u: any) => u.id) || []
      const foundInstructorUserIds = instructorProfiles?.map((i: any) => i.user_id) || []
      const missingUserIds = instructorIds.filter((id: string) => !foundUserIds.includes(id))
      const usersWithoutInstructorProfile = foundUserIds.filter((id: string) => !foundInstructorUserIds.includes(id))
      const instructorUsers = allUsers?.filter((u: any) => 
        ['admin', 'instructor'].includes(u.role) && foundInstructorUserIds.includes(u.id)
      ) || []
      
      console.log('Enrollment API - DETAILED VALIDATION DEBUG:', {
        'Instructor IDs provided': instructorIds,
        'Found users (all)': allUsers?.map((u: any) => ({ id: u.id, name: u.full_name, role: u.role })),
        'Found instructor profiles': instructorProfiles?.map((i: any) => ({ instructor_id: i.id, user_id: i.user_id })),
        'Expected count': instructorIds.length,
        'Found users count': foundUserIds.length,
        'Found instructor profiles count': foundInstructorUserIds.length,
        'Missing users': missingUserIds,
        'Users without instructor profiles': usersWithoutInstructorProfile,
        'Valid instructor users': instructorUsers.map((u: any) => ({ id: u.id, name: u.full_name, role: u.role })),
        'Valid instructors count': instructorUsers.length
      })
      
      // Check for missing users
      if (missingUserIds.length > 0) {
        return NextResponse.json(
          { 
            error: 'Um ou mais usuários não foram encontrados no sistema',
            details: {
              expected: instructorIds.length,
              found: foundUserIds.length,
              missing_user_ids: missingUserIds,
              message: 'Os seguintes IDs de usuário não existem no sistema: ' + missingUserIds.join(', ')
            }
          },
          { status: 400 }
        )
      }
      
      // Check for users without instructor profiles
      if (usersWithoutInstructorProfile.length > 0) {
        const usersInfo = allUsers?.filter((u: any) => usersWithoutInstructorProfile.includes(u.id)) || []
        return NextResponse.json(
          { 
            error: 'Um ou mais usuários não possuem perfil de instrutor',
            details: {
              users_without_instructor_profile: usersInfo.map((u: any) => ({
                id: u.id,
                name: u.full_name,
                email: u.email,
                role: u.role
              })),
              message: 'Os seguintes usuários não possuem perfil de instrutor cadastrado no sistema.'
            }
          },
          { status: 400 }
        )
      }
      
      // Check for invalid roles
      if (instructorUsers.length !== instructorIds.length) {
        const usersWithInvalidRoles = allUsers?.filter((u: any) => 
          foundInstructorUserIds.includes(u.id) && !['admin', 'instructor'].includes(u.role)
        ) || []
        
        return NextResponse.json(
          { 
            error: 'Um ou mais usuários não têm permissão para lecionar',
            details: {
              users_with_invalid_roles: usersWithInvalidRoles.map((u: any) => ({
                id: u.id,
                name: u.full_name,
                email: u.email,
                current_role: u.role,
                required_roles: ['admin', 'instructor']
              })),
              message: 'Os seguintes usuários não possuem função de instrutor ou admin.'
            }
          },
          { status: 400 }
        )
      }
      
      // All instructors are valid
      console.log('Enrollment API - All instructor users validated successfully')
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
      access_until: validatedData.access_until || null,
      status: validatedData.status,
      modality: validatedData.is_in_person ? 'in-person' : 'online'
    }
    
    console.log('Enrollment API - Enrollment data to insert: ' + JSON.stringify(enrollmentData))
    
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
      console.log('Enrollment API - Processing schedules for enrollment:', enrollment.id)
      
      if (isEnhancedFormat && validatedData.schedules && validatedData.schedules.length > 0 && validatedData.modality === 'in-person') {
        console.log('Enrollment API - Enhanced format schedules: ' + JSON.stringify(validatedData.schedules))
        // Enhanced format with schedules array
        schedulesToCreate = validatedData.schedules.map((schedule: any) => ({
          enrollment_id: enrollment.id,
          instructor_id: schedule.instructor_id,
          day_of_week: schedule.day_of_week,
          start_time: schedule.start_time,
          end_time: schedule.end_time
        }))
      } else if (!isEnhancedFormat && validatedData.is_in_person) {
        console.log('Enrollment API - Legacy format in-person, skipping schedule creation for now')
        // Legacy format - would need conversion from schedule slots to actual times
        // For now, we'll skip this as it requires additional data conversion
        // This would be handled by the form transformation in the frontend
      }
      
      console.log('Enrollment API - Schedules to create: ' + JSON.stringify(schedulesToCreate))
      
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
        console.log('Enrollment API - Schedules created successfully')
      } else {
        console.log('Enrollment API - No schedules to create (online enrollment or legacy format)')
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
      console.error('Zod validation error:', error.errors)
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: error.errors,
          message: 'Verifique os campos obrigatórios e formatos de dados'
        },
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