import { requireAdmin } from '@/lib/auth/session'
import { AdminProfile } from '@/components/admin/AdminProfile'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const { user: currentUser, profile } = await requireAdmin()
  console.log(`[ADMIN-PROFILE] Access authorized for admin: ${profile.email}`)

  return <AdminProfile currentUser={profile} />
}