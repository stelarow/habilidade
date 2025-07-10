import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'
import { CategoriesManagement } from '@/components/admin/CategoriesManagement'

export default async function CategoriesPage() {
  const supabase = createClient()
  const currentUser = await getCurrentUser()
  
  requirePermission(currentUser, 'admin.view')

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

  return <CategoriesManagement categories={categories || []} currentUser={currentUser} />
}