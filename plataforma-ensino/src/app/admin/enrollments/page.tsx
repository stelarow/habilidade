import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import EnrollmentsManagementLazy from '@/components/admin/EnrollmentsManagementLazy'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function EnrollmentsPage() {
  const { user: currentUser, profile } = await requireAdmin()
  console.log(`[ADMIN-ENROLLMENTS] Access authorized for admin: ${profile.email}`)

  const supabase = createClient()

  // Get enrollments with user and course data
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      user:users(id, full_name, email, avatar_url),
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

  return <EnrollmentsManagementLazy enrollments={enrollments || []} currentUser={profile} />
}