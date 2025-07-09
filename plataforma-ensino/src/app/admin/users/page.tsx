import { createClient } from '../../../../lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'
import { UsersManagement } from '@/components/admin/UsersManagement'
import { User } from '@/types'

export default async function UsersPage() {
  const supabase = createClient()
  const currentUser = await getCurrentUser()
  
  requirePermission(currentUser, 'admin.users.view')

  // Get all users with pagination
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar usuários</p>
      </div>
    )
  }

  return <UsersManagement users={users || []} currentUser={currentUser} />
}