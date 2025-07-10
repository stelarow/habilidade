import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'
import { EnrollmentsManagement } from '@/components/admin/EnrollmentsManagement'

export default async function EnrollmentsPage() {
  const supabase = createClient()
  const currentUser = await getCurrentUser()
  
  requirePermission(currentUser, 'admin.view')

  // Get enrollments with user and course data
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      user:users(id, name, email, avatar_url),
      course:courses(id, title, thumbnail_url)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching enrollments:', error)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar matrículas</p>
      </div>
    )
  }

  return <EnrollmentsManagement enrollments={enrollments || []} currentUser={currentUser} />
}