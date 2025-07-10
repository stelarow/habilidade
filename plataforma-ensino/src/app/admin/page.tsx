import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { DashboardStats } from '@/types'

export default async function AdminPage() {
  const supabase = createClient()

  // Get dashboard statistics
  const [
    { count: totalStudents },
    { count: totalCourses },
    { count: totalEnrollments },
    { data: recentEnrollments }
  ] = await Promise.all([
    supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student'),
    supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),
    supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true }),
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

  return (
    <AdminDashboard 
      stats={stats}
      recentEnrollments={recentEnrollments || []}
    />
  )
}