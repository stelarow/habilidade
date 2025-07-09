import { createClient } from '../../lib/supabase/client'

export async function seedSampleCourses() {
  const supabase = createClient()

  // Sample categories
  const categories = [
    { id: '1', name: 'Inteligência Artificial', color_theme: 'ia', icon: '🤖', status: 'active' },
    { id: '2', name: 'Design Gráfico', color_theme: 'design', icon: '🎨', status: 'active' },
    { id: '3', name: 'Programação', color_theme: 'programacao', icon: '💻', status: 'active' },
    { id: '4', name: 'Marketing Digital', color_theme: 'marketing', icon: '📈', status: 'active' },
    { id: '5', name: 'Edição de Vídeo', color_theme: 'video', icon: '🎬', status: 'active' }
  ]

  // Sample courses
  const courses = [
    {
      id: '1',
      title: 'Inteligência Artificial: Fundamentos e Aplicações',
      slug: 'ia-fundamentos',
      description: 'Aprenda os conceitos fundamentais de IA e suas aplicações práticas no mercado de trabalho.',
      short_description: 'Fundamentos de IA com aplicações práticas',
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
      title: 'Design Gráfico Profissional',
      slug: 'design-grafico',
      description: 'Domine as ferramentas e técnicas do design gráfico profissional.',
      short_description: 'Design gráfico do básico ao avançado',
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
      title: 'Programação Web Moderna',
      slug: 'programacao-web',
      description: 'Desenvolva aplicações web modernas com as tecnologias mais atuais.',
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
      title: 'Marketing Digital Estratégico',
      slug: 'marketing-digital',
      description: 'Estratégias completas de marketing digital para o mundo atual.',
      short_description: 'Marketing digital estratégico e prático',
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
      title: 'Edição de Vídeo Profissional',
      slug: 'edicao-video',
      description: 'Técnicas avançadas de edição de vídeo para criação de conteúdo profissional.',
      short_description: 'Edição de vídeo do básico ao profissional',
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
          title: `Aula ${i}: Tópico ${i}`,
          slug: `aula-${i}`,
          description: `Descrição da aula ${i} do curso ${course.title}`,
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