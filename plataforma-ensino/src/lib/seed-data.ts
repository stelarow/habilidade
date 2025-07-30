import { createClient } from '@/lib/supabase/client'

export async function seedSampleCourses() {
  const supabase = createClient()

  // First, create sample instructors
  await seedSampleInstructors()

  // Sample categories
  const categories = [
    { id: '1', name: 'InteligÃªncia Artificial', color_theme: 'ia', icon: 'ð¤', status: 'active' },
    { id: '2', name: 'Design GrÃ¡fico', color_theme: 'design', icon: 'ð¨', status: 'active' },
    { id: '3', name: 'ProgramaÃ§Ã£o', color_theme: 'programacao', icon: 'ð»', status: 'active' },
    { id: '4', name: 'Marketing Digital', color_theme: 'marketing', icon: 'ð', status: 'active' },
    { id: '5', name: 'EdiÃ§Ã£o de VÃ­deo', color_theme: 'video', icon: 'ð¬', status: 'active' }
  ]

  // Sample courses
  const courses = [
    {
      id: '1',
      title: 'InteligÃªncia Artificial: Fundamentos e AplicaÃ§Ãµes',
      slug: 'ia-fundamentos',
      description: 'Aprenda os conceitos fundamentais de IA e suas aplicaÃ§Ãµes prÃ¡ticas no mercado de trabalho.',
      short_description: 'Fundamentos de IA com aplicaÃ§Ãµes prÃ¡ticas',
      category_id: '1',
      duration_minutes: 1200,
      level: 'beginner',
      price: 0,
      is_published: true,
      background_theme: 'ia',
      status: 'published'
    },
    {
      id: '2',
      title: 'Design GrÃ¡fico Profissional',
      slug: 'design-grafico',
      description: 'Domine as ferramentas e tÃ©cnicas do design grÃ¡fico profissional.',
      short_description: 'Design grÃ¡fico do bÃ¡sico ao avanÃ§ado',
      category_id: '2',
      duration_minutes: 900,
      level: 'intermediate',
      price: 0,
      is_published: true,
      background_theme: 'design',
      status: 'published'
    },
    {
      id: '3',
      title: 'ProgramaÃ§Ã£o Web Moderna',
      slug: 'programacao-web',
      description: 'Desenvolva aplicaÃ§Ãµes web modernas com as tecnologias mais atuais.',
      short_description: 'Desenvolvimento web com tecnologias modernas',
      category_id: '3',
      duration_minutes: 1500,
      level: 'intermediate',
      price: 0,
      is_published: true,
      background_theme: 'programacao',
      status: 'published'
    },
    {
      id: '4',
      title: 'Marketing Digital EstratÃ©gico',
      slug: 'marketing-digital',
      description: 'EstratÃ©gias completas de marketing digital para o mundo atual.',
      short_description: 'Marketing digital estratÃ©gico e prÃ¡tico',
      category_id: '4',
      duration_minutes: 800,
      level: 'beginner',
      price: 0,
      is_published: true,
      background_theme: 'marketing',
      status: 'published'
    },
    {
      id: '5',
      title: 'EdiÃ§Ã£o de VÃ­deo Profissional',
      slug: 'edicao-video',
      description: 'TÃ©cnicas avanÃ§adas de ediÃ§Ã£o de vÃ­deo para criaÃ§Ã£o de conteÃºdo profissional.',
      short_description: 'EdiÃ§Ã£o de vÃ­deo do bÃ¡sico ao profissional',
      category_id: '5',
      duration_minutes: 1000,
      level: 'intermediate',
      price: 0,
      is_published: true,
      background_theme: 'video',
      status: 'published'
    }
  ]

  try {
    // Insert categories
    const { error: categoryError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'id' })

    if (categoryError) {
      console.error('Error inserting categories:', categoryError)
      return { success: false, error: categoryError }
    }

    // Insert courses
    const { error: courseError } = await supabase
      .from('courses')
      .upsert(courses, { onConflict: 'id' })

    if (courseError) {
      console.error('Error inserting courses:', courseError)
      return { success: false, error: courseError }
    }

    // Create sample lessons for each course
    const lessons: any[] = []
    courses.forEach((course, courseIndex) => {
      const lessonCount = Math.floor(course.duration_minutes / 60) // 1 lesson per hour
      for (let i = 1; i <= lessonCount; i++) {
        lessons.push({
          id: `${course.id}-${i}`,
          course_id: course.id,
          title: `Aula ${i}: TÃ³pico ${i}`,
          slug: `aula-${i}`,
          description: `DescriÃ§Ã£o da aula ${i} do curso ${course.title}`,
          content_url: 'https://example.com/video',
          duration_minutes: 60,
          order_index: i,
          is_preview: i === 1, // First lesson is preview
          status: 'published'
        })
      }
    })

    const { error: lessonError } = await supabase
      .from('lessons')
      .upsert(lessons, { onConflict: 'id' })

    if (lessonError) {
      console.error('Error inserting lessons:', lessonError)
      return { success: false, error: lessonError }
    }

    console.log('Sample data seeded successfully!')
    return { 
      success: true, 
      data: { 
        categories: categories.length, 
        courses: courses.length, 
        lessons: lessons.length 
      } 
    }

  } catch (error) {
    console.error('Error seeding data:', error)
    return { success: false, error }
  }
}

export async function enrollUserInSampleCourses(userId: string) {
  const supabase = createClient()

  try {
    // Enroll user in first 3 courses
    const enrollments = [
      {
        user_id: userId,
        course_id: '1',
        status: 'active',
        enrolled_at: new Date().toISOString()
      },
      {
        user_id: userId,
        course_id: '2',
        status: 'active',
        enrolled_at: new Date().toISOString()
      },
      {
        user_id: userId,
        course_id: '3',
        status: 'active',
        enrolled_at: new Date().toISOString()
      }
    ]

    const { error } = await supabase
      .from('enrollments')
      .upsert(enrollments, { onConflict: 'user_id,course_id' })

    if (error) {
      console.error('Error creating enrollments:', error)
      return { success: false, error }
    }

    console.log('User enrolled in sample courses!')
    return { success: true, data: { enrollments: enrollments.length } }

  } catch (error) {
    console.error('Error enrolling user:', error)
    return { success: false, error }
  }
}

export async function seedSampleInstructors() {
  const supabase = createClient()

  try {
    // Sample instructor users (these need to be created in auth first)
    const instructorUsers = [
      {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        email: 'prof.silva@habilidade.com',
        full_name: 'Prof. JoÃ£o Silva',
        role: 'instructor'
      },
      {
        id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        email: 'prof.santos@habilidade.com',
        full_name: 'Prof. Maria Santos',
        role: 'instructor'
      },
      {
        id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        email: 'prof.costa@habilidade.com',
        full_name: 'Prof. Carlos Costa',
        role: 'instructor'
      }
    ]

    // Insert instructor users (only if they don't exist)
    for (const user of instructorUsers) {
      const { error: userError } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'id' })

      if (userError && !userError.message.includes('duplicate')) {
        console.error('Error creating instructor user:', userError)
      }
    }

    // Sample instructors
    const instructors = [
      {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        user_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        bio: 'Especialista em InteligÃªncia Artificial com 10 anos de experiÃªncia',
        expertise: ['InteligÃªncia Artificial', 'Machine Learning', 'Python'],
        rating: 4.8,
        total_reviews: 45
      },
      {
        id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        user_id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        bio: 'Designer grÃ¡fica profissional com foco em branding e identidade visual',
        expertise: ['Design GrÃ¡fico', 'Branding', 'Adobe Creative Suite'],
        rating: 4.9,
        total_reviews: 62
      },
      {
        id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        user_id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        bio: 'Desenvolvedor full-stack com expertise em tecnologias web modernas',
        expertise: ['ProgramaÃ§Ã£o Web', 'JavaScript', 'React', 'Node.js'],
        rating: 4.7,
        total_reviews: 38
      }
    ]

    const { error: instructorError } = await supabase
      .from('instructors')
      .upsert(instructors, { onConflict: 'id' })

    if (instructorError) {
      console.error('Error inserting instructors:', instructorError)
      return { success: false, error: instructorError }
    }

    // Create standard availability for all instructors
    // All instructors have the same standard schedule:
    // Monday to Friday: 08:00-10:00, 10:00-12:00, 13:30-15:30, 15:30-17:30, 18:00-20:00, 20:00-22:00
    // Saturday: 08:00-10:00, 10:00-12:00

    const availabilitySlots: any[] = []
    
    for (const instructor of instructors) {
      // Monday to Friday (day_of_week: 1-5)
      for (let day = 1; day <= 5; day++) {
        const dailySlots = [
          { start_time: '08:00:00', end_time: '10:00:00', max_students: 3 },
          { start_time: '10:00:00', end_time: '12:00:00', max_students: 3 },
          { start_time: '13:30:00', end_time: '15:30:00', max_students: 3 },
          { start_time: '15:30:00', end_time: '17:30:00', max_students: 3 },
          { start_time: '18:00:00', end_time: '20:00:00', max_students: 3 },
          { start_time: '20:00:00', end_time: '22:00:00', max_students: 3 }
        ]

        dailySlots.forEach((slot: any) => {
          availabilitySlots.push({
            teacher_id: instructor.id,
            day_of_week: day,
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_students: slot.max_students,
            is_active: true
          })
        })
      }

      // Saturday (day_of_week: 6)
      const saturdaySlots = [
        { start_time: '08:00:00', end_time: '10:00:00', max_students: 3 },
        { start_time: '10:00:00', end_time: '12:00:00', max_students: 3 }
      ]

      saturdaySlots.forEach((slot: any) => {
        availabilitySlots.push({
          teacher_id: instructor.id,
          day_of_week: 6,
          start_time: slot.start_time,
          end_time: slot.end_time,
          max_students: slot.max_students,
          is_active: true
        })
      })
    }

    const { error: availabilityError } = await supabase
      .from('teacher_availability')
      .upsert(availabilitySlots)

    if (availabilityError) {
      console.error('Error inserting teacher availability:', availabilityError)
      return { success: false, error: availabilityError }
    }

    console.log('Sample instructors and availability seeded successfully!')
    return { 
      success: true, 
      data: { 
        instructors: instructors.length,
        availability_slots: availabilitySlots.length 
      } 
    }

  } catch (error) {
    console.error('Error seeding instructors:', error)
    return { success: false, error }
  }
}