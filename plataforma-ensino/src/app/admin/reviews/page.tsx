import { createClient } from '../../../../lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'
import { ReviewsManagement } from '@/components/admin/ReviewsManagement'

export default async function ReviewsPage() {
  const supabase = createClient()
  const currentUser = await getCurrentUser()
  
  requirePermission(currentUser, 'admin.view')

  // Get reviews with user and course data
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:users(id, name, email, avatar_url),
      course:courses(id, title, thumbnail_url)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar avaliações</p>
      </div>
    )
  }

  return <ReviewsManagement reviews={reviews || []} currentUser={currentUser} />
}