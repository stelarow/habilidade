import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'
import { AdminProfile } from '@/components/admin/AdminProfile'

export default async function ProfilePage() {
  const supabase = createClient()
  const currentUser = await getCurrentUser()
  
  requirePermission(currentUser, 'admin.view')

  return <AdminProfile currentUser={currentUser} />
}