import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { DashboardStats } from '@/types'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  console.log('[ADMIN-DASHBOARD] 1. Iniciando AdminPage')
  
  const supabase = createClient()
  console.log('[ADMIN-DASHBOARD] 2. Cliente Supabase criado')

  console.log('[ADMIN-DASHBOARD] 3. Iniciando Promise.all para estatísticas...')
  
  // Get dashboard statistics - Fixed to avoid undici headers.split error
  const [
    { count: totalStudents },
    { count: totalCourses },
    { count: totalEnrollments },
    { data: recentEnrollments }
  ] = await Promise.all([
    supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'student')
      .limit(0),
    supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .limit(0),
    supabase
      .from('enrollments')
      .select('*', { count: 'exact' })
      .limit(0),
    supabase
      .from('enrollments')
      .select(`
        *,
        user:users(full_name, email),
        course:courses(title, slug)
      `)
      .order('created_at', { ascending: false })
      .limit(10)
  ])

  console.log('[ADMIN-DASHBOARD] 4. Promise.all completado com sucesso')
  console.log('[ADMIN-DASHBOARD] 5. Dados:', { totalStudents, totalCourses, totalEnrollments, enrollments: recentEnrollments?.length })

  const stats: DashboardStats = {
    totalStudents: totalStudents || 0,
    totalCourses: totalCourses || 0,
    totalEnrollments: totalEnrollments || 0,
    totalRevenue: 0, // TODO: Calculate from enrollments
    monthlyGrowth: {
      students: 0,
      courses: 0,
      enrollments: 0,
      revenue: 0
    }
  }

  console.log('[ADMIN-DASHBOARD] 6. Renderizando AdminDashboard component')
  
  return (
    <AdminDashboard 
      stats={stats}
      recentEnrollments={recentEnrollments || []}
    />
  )
}