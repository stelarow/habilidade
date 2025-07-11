import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'
import { CoursesManagement } from '@/components/admin/CoursesManagement'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  const supabase = createClient()
  const currentUser = await getCurrentUser()
  
  requirePermission(currentUser, 'admin.courses.view')

  // Get all courses with basic data first
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      *,
      category:categories(name, color_theme),
      instructor:instructors(
        id,
        user:users(full_name, email)
      )
    `)
    .order('created_at', { ascending: false })

  // Get categories for course creation
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Get instructors for course assignment
  const { data: instructors } = await supabase
    .from('instructors')
    .select(`
      *,
      user:users(full_name, email)
    `)
    .order('created_at')

  if (error) {
    console.error('Error fetching courses:', error)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar cursos</p>
      </div>
    )
  }

  return (
    <CoursesManagement 
      courses={courses || []} 
      categories={categories || []}
      instructors={instructors || []}
      currentUser={currentUser} 
    />
  )
}