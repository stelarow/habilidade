import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import type { DashboardStats } from '@/types'
import { requireAdmin } from '@/lib/auth/session'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

// Helper function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default async function AdminPage() {
  // 🔥 CRITICAL: SERVER-SIDE PROTECTION - Execute BEFORE any other code
  const { user: _user, profile: _profile } = await requireAdmin()
  
  const supabase = createClient()

  // Get dashboard statistics - Sequential queries with delays to prevent race conditions
  const { count: totalStudents, error: _studentsError } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('role', 'student')
    .limit(0)

  await delay(100) // Small delay to prevent concurrent requests

  const { count: totalCourses, error: _coursesError } = await supabase
    .from('courses')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .limit(0)

  await delay(100)

  const { count: totalEnrollments, error: _enrollmentsError } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact' })
    .limit(0)

  await delay(100)

  const { data: recentEnrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      user:users(full_name, email),
      course:courses(title, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(10)


  const stats: DashboardStats = {
    totalStudents: totalStudents ?? 0,
    totalCourses: totalCourses ?? 0,
    totalEnrollments: totalEnrollments ?? 0,
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