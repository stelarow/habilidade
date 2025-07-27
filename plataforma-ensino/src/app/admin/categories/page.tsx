import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { CategoriesManagement } from '@/components/admin/CategoriesManagement'
import { logError } from '@/lib/utils/logger'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const { user: _currentUser, profile } = await requireAdmin()

  const supabase = createClient()

  // Get categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    logError('Error fetching categories:', error)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar categorias</p>
      </div>
    )
  }

  return <CategoriesManagement categories={categories || []} currentUser={profile} />
}