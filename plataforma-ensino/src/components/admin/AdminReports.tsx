'use client'

import { ChartBarIcon, UsersIcon, BookOpenIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

interface CourseStats {
  id: string
  title: string
  total_enrollments: number
  completed_enrollments: number
  average_rating: number
  total_reviews: number
}

interface UserStats {
  role: string
  created_at: string
}

interface AdminReportsProps {
  courseStats: CourseStats[]
  userStats: UserStats[]
}

export function AdminReports({ courseStats, userStats }: AdminReportsProps) {
  const usersByRole = userStats.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCourses = courseStats.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Total de Estudantes</p>
              <p className="text-2xl font-bold text-white">{usersByRole.student || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Instrutores</p>
              <p className="text-2xl font-bold text-white">{usersByRole.instructor || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Cursos Populares</p>
              <p className="text-2xl font-bold text-white">{topCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Administradores</p>
              <p className="text-2xl font-bold text-white">{usersByRole.admin || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Cursos com Mais Matrículas</h3>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{course.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {course.total_enrollments} matrículas • {course.completed_enrollments} concluídas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">⭐ {course.average_rating?.toFixed(1) || '0.0'}</p>
                  <p className="text-gray-400 text-sm">{course.total_reviews} avaliações</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Distribuição de Usuários</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(usersByRole).map(([role, count]) => (
              <div key={role} className="text-center p-4 bg-gray-750 rounded-lg">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-gray-400 capitalize">{role === 'student' ? 'Estudantes' : role === 'instructor' ? 'Instrutores' : 'Administradores'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}