// Teste isolado da página admin dashboard
import { createClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/types'

export const dynamic = 'force-dynamic'

export default async function TestAdminDashboardPage() {
  console.log('[TEST-ADMIN-DASHBOARD] 1. Iniciando página dashboard')
  
  const supabase = createClient()
  console.log('[TEST-ADMIN-DASHBOARD] 2. Cliente Supabase criado')

  // Simulate the exact same logic as admin dashboard
  let stats: DashboardStats = {
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    monthlyGrowth: {
      students: 0,
      courses: 0,
      enrollments: 0,
      revenue: 0
    }
  }
  
  let recentEnrollments: any[] = []

  try {
    console.log('[TEST-ADMIN-DASHBOARD] 3. Fazendo queries do dashboard...')
    
    // Get dashboard statistics - SAME AS ORIGINAL
    const [
      { count: totalStudents },
      { count: totalCourses },
      { count: totalEnrollments },
      { data: enrollments }
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

    console.log('[TEST-ADMIN-DASHBOARD] 4. Queries completadas com sucesso')
    
    stats = {
      totalStudents: totalStudents || 0,
      totalCourses: totalCourses || 0,
      totalEnrollments: totalEnrollments || 0,
      totalRevenue: 0,
      monthlyGrowth: {
        students: 0,
        courses: 0,
        enrollments: 0,
        revenue: 0
      }
    }
    
    recentEnrollments = enrollments || []
    
  } catch (error) {
    console.error('[TEST-ADMIN-DASHBOARD] ERRO durante queries:', error)
  }

  console.log('[TEST-ADMIN-DASHBOARD] 5. Renderizando página')

  return (
    <div className="min-h-screen bg-blue-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📊 Teste Admin Dashboard</h1>
        
        <div className="bg-blue-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-700 p-4 rounded">
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <div className="text-blue-200">Estudantes</div>
            </div>
            <div className="bg-blue-700 p-4 rounded">
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <div className="text-blue-200">Cursos</div>
            </div>
            <div className="bg-blue-700 p-4 rounded">
              <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
              <div className="text-blue-200">Matrículas</div>
            </div>
            <div className="bg-blue-700 p-4 rounded">
              <div className="text-2xl font-bold">R$ {stats.totalRevenue}</div>
              <div className="text-blue-200">Receita</div>
            </div>
          </div>
        </div>

        <div className="bg-green-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">✅ Status do Teste</h2>
          <p className="text-green-200">
            Se você está vendo esta página, o AdminDashboard NÃO está causando o erro headers.split.
            Verifique os logs para confirmar que as queries do dashboard foram executadas com sucesso.
          </p>
          <div className="mt-4 text-sm text-green-300">
            <p>Recent enrollments loaded: {recentEnrollments.length}</p>
            <p>Dashboard statistics loaded successfully</p>
          </div>
        </div>
      </div>
    </div>
  )
}