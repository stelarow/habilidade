import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { CalendarView } from '@/components/calendar'
import { AdminCalendarInterface } from '@/components/admin/AdminCalendarInterface'

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
        teachers = instructorsData.map(instructor => ({
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Administração - Calendários
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Visualizar e gerenciar calendários de todos os professores
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Professores
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalTeachers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Aulas Agendadas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalClasses}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">S</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Slots Totais
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      36
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar interface with teacher selection */}
        <div className="bg-white rounded-lg shadow">
          <AdminCalendarInterface teachers={teachers} />
        </div>
      </div>
    </div>
  )
}