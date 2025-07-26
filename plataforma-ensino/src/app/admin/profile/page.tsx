import { requireAdmin } from '@/lib/auth/session'
import { AdminProfile } from '@/components/admin/AdminProfile'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const { user: _currentUser, profile } = await requireAdmin()

  return <AdminProfile currentUser={profile} />
}