import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { DashboardStats } from '@/types'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

// Helper function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default async function AdminPage() {
  console.log('[ADMIN-DASHBOARD] 1. Iniciando AdminPage')
  
  const supabase = createClient()
  console.log('[ADMIN-DASHBOARD] 2. Cliente Supabase criado')

  console.log('[ADMIN-DASHBOARD] 3. Iniciando consultas sequenciais para estatísticas...')
  
  // Get dashboard statistics - Sequential queries with delays to prevent race conditions
  console.log('[ADMIN-DASHBOARD] 3.1. Query students count...')
  const { count: totalStudents, error: studentsError } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('role', 'student')
    .limit(0)
  
  console.log('[ADMIN-DASHBOARD] Students result:', { count: totalStudents, error: studentsError })

  await delay(100) // Small delay to prevent concurrent requests

  console.log('[ADMIN-DASHBOARD] 3.2. Query courses count...')
  const { count: totalCourses, error: coursesError } = await supabase
    .from('courses')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .limit(0)
  
  console.log('[ADMIN-DASHBOARD] Courses result:', { count: totalCourses, error: coursesError })

  await delay(100)

  console.log('[ADMIN-DASHBOARD] 3.3. Query enrollments count...')
  const { count: totalEnrollments, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact' })
    .limit(0)
  
  console.log('[ADMIN-DASHBOARD] Enrollments result:', { count: totalEnrollments, error: enrollmentsError })

  await delay(100)

  console.log('[ADMIN-DASHBOARD] 3.4. Query recent enrollments...')
  const { data: recentEnrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      user:users(full_name, email),
      course:courses(title, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  console.log('[ADMIN-DASHBOARD] 4. Promise.all completado com sucesso')
  console.log('[ADMIN-DASHBOARD] 5. Dados:', { totalStudents, totalCourses, totalEnrollments, enrollments: recentEnrollments?.length })

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

  console.log('[ADMIN-DASHBOARD] 6. Renderizando AdminDashboard component')
  
  return (
    <AdminDashboard 
      stats={stats}
      recentEnrollments={recentEnrollments || []}
    />
  )
}