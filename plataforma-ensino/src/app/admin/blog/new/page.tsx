
import { requireAdmin } from '@/lib/auth/session'
import { NewPostClient } from '@/components/admin/NewPostClient'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  const { user: currentUser, profile } = await requireAdmin()
  console.log(`[ADMIN-BLOG-NEW] Access authorized for admin: ${profile.email}`)

  return <NewPostClient />
}
