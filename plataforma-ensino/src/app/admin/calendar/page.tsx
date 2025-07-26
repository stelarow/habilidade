import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { EnhancedAdminCalendarInterface } from '@/components/admin/EnhancedAdminCalendarInterface'
import { BlurFade } from '@/components/ui/blur-fade'
import { MagicCard } from '@/components/ui/magic-card'
import { Users, Calendar, Clock } from 'lucide-react'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

interface Teacher {
  id: string;
  email: string;
  full_name?: string;
}

export default async function AdminCalendarPage() {
  // 🔥 CRITICAL: SERVER-SIDE PROTECTION - Execute BEFORE any other code
  const { user: currentUser, profile } = await requireAdmin()
  console.log(`[ADMIN-CALENDAR] Access authorized for admin: ${profile.email}`)
  
  const supabase = createClient()

  // Fetch teachers from the system
  // First, try to get from profiles table if it exists
  let teachers: Teacher[] = []
  
  try {
    // Try to fetch from profiles first
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('role', 'instructor')
      .order('full_name')

    if (!profilesError && profilesData) {
      teachers = profilesData
    } else {
      // Fallback: Get instructors from instructors table
      const { data: instructorsData, error: instructorsError } = await supabase
        .from('instructors')
        .select(`
          user_id,
          users!inner (
            email,
            full_name
          )
        `)
        .order('users.full_name')

      if (!instructorsError && instructorsData) {
        teachers = instructorsData.map((instructor: any) => ({
          id: instructor.user_id,
          email: instructor.users[0]?.email || '',
          full_name: instructor.users[0]?.full_name || ''
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching teachers:', error)
  }

  // Get some basic statistics
  let totalClasses = 0
  let totalTeachers = teachers.length

  try {
    const { count } = await supabase
      .from('class_schedules')
      .select('*', { count: 'exact', head: true })
    
    totalClasses = count || 0
  } catch (error) {
    console.error('Error fetching class count:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <BlurFade delay={0.1}>
        <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Administração - Calendários
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Visualizar e gerenciar calendários de todos os professores
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    Admin Panel
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Enhanced Statistics Cards */}
        <BlurFade delay={0.2}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <MagicCard className="group">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800 rounded-lg p-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Professores
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {totalTeachers}
                    </div>
                  </div>
                </div>
              </div>
            </MagicCard>

            <MagicCard className="group">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-lg p-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/20">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Aulas Agendadas
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {totalClasses}
                    </div>
                  </div>
                </div>
              </div>
            </MagicCard>

            <MagicCard className="group">
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-yellow-500/20">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Slots Totais
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      36
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      6 slots × 6 dias
                    </div>
                  </div>
                </div>
              </div>
            </MagicCard>
          </div>
        </BlurFade>

        {/* Enhanced Calendar Interface */}
        <BlurFade delay={0.3}>
          <EnhancedAdminCalendarInterface teachers={teachers} />
        </BlurFade>
      </div>
    </div>
  )
}