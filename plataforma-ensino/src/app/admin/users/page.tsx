import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server-side-protection'
import { UsersManagement } from '@/components/admin/UsersManagement'
import { User } from '@/types'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  // 🔥 CRITICAL: SERVER-SIDE PROTECTION - Execute BEFORE any other code
  const { user: currentUser, profile } = await requireAdmin()
  console.log(`[ADMIN-USERS] Access authorized for admin: ${profile.email}`)
  
  const supabase = createClient()

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

  return <UsersManagement users={users || []} currentUser={profile} />
}