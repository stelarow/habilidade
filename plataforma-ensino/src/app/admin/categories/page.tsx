import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { CategoriesManagement } from '@/components/admin/CategoriesManagement'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const { user: currentUser, profile } = await requireAdmin()
  console.log(`[ADMIN-CATEGORIES] Access authorized for admin: ${profile.email}`)

  const supabase = createClient()

  // Get categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar categorias</p>
      </div>
    )
  }

  return <CategoriesManagement categories={categories || []} currentUser={profile} />
}