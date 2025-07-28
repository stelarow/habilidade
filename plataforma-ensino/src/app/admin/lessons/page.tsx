import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { LessonManagement } from '@/components/admin/LessonManagement'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function LessonsPage() {
  // 🔥 CRITICAL: SERVER-SIDE PROTECTION - Execute BEFORE any other code
  const { user: _currentUser, profile } = await requireAdmin()
  
  const supabase = createClient()

  // Get all lessons with related data
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select(`
      *,
      course:courses(id, title, slug),
      exercises(id, title, order_index),
      quizzes(
        id, 
        title, 
        is_published,
        questions:quiz_questions(id)
      )
    `)
    .order('created_at', { ascending: false })

  // Get courses for dropdown
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select(`
      id, 
      title, 
      slug, 
      price, 
      duration_minutes, 
      level, 
      requirements, 
      what_you_learn, 
      background_theme, 
      is_published,
      created_at,
      updated_at
    `)
    .order('title')

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar aulas</p>
      </div>
    )
  }

  if (coursesError) {
    console.error('Error fetching courses:', coursesError)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar cursos</p>
      </div>
    )
  }

  return (
    <LessonManagement 
      lessons={lessons || []} 
      courses={courses || []}
      currentUser={profile} 
    />
  )
}