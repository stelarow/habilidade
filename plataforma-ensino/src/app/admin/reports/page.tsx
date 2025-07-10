import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'
import { AdminReports } from '@/components/admin/AdminReports'

export default async function ReportsPage() {
  const supabase = createClient()
  const currentUser = await getCurrentUser()
  
  requirePermission(currentUser, 'admin.reports.view')

  // Get reports data
  const { data: courseStats } = await supabase
    .from('course_stats')
    .select('*')
    .order('total_enrollments', { ascending: false })
    .limit(10)

  const { data: userStats } = await supabase
    .from('users')
    .select('role, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Relatórios</h1>
        <p className="text-gray-400">Análise de dados da plataforma</p>
      </div>

      <AdminReports 
        courseStats={courseStats || []}
        userStats={userStats || []}
      />
    </div>
  )
}