import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'
import { CertificatesManagement } from '@/components/admin/CertificatesManagement'

export default async function CertificatesPage() {
  const supabase = createClient()
  const currentUser = await getCurrentUser()
  
  requirePermission(currentUser, 'admin.view')

  // Get certificates with user and course data
  const { data: certificates, error } = await supabase
    .from('certificates')
    .select(`
      *,
      user:users(id, name, email, avatar_url),
      course:courses(id, title, thumbnail_url)
    `)
    .order('issued_at', { ascending: false })

  if (error) {
    console.error('Error fetching certificates:', error)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar certificados</p>
      </div>
    )
  }

  return <CertificatesManagement certificates={certificates || []} currentUser={currentUser} />
}