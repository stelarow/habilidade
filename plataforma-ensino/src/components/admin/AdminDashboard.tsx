'use client'

import { DashboardStats, Enrollment } from '@/types'
import { 
  UsersIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

interface AdminDashboardProps {
  stats: DashboardStats
  recentEnrollments: Enrollment[]
}

export function AdminDashboard({ stats, recentEnrollments }: AdminDashboardProps) {
  const statsCards = [
    {
      name: 'Total de Estudantes',
      value: stats.totalStudents,
      icon: UsersIcon,
      change: stats.monthlyGrowth.students,
      changeType: stats.monthlyGrowth.students >= 0 ? 'positive' : 'negative',
    },
    {
      name: 'Cursos Publicados',
      value: stats.totalCourses,
      icon: BookOpenIcon,
      change: stats.monthlyGrowth.courses,
      changeType: stats.monthlyGrowth.courses >= 0 ? 'positive' : 'negative',
    },
    {
      name: 'Matrículas Ativas',
      value: stats.totalEnrollments,
      icon: AcademicCapIcon,
      change: stats.monthlyGrowth.enrollments,
      changeType: stats.monthlyGrowth.enrollments >= 0 ? 'positive' : 'negative',
    },
    {
      name: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`,
      icon: CurrencyDollarIcon,
      change: stats.monthlyGrowth.revenue,
      changeType: stats.monthlyGrowth.revenue >= 0 ? 'positive' : 'negative',
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Administrativo</h1>
        <p className="text-gray-400">Visão geral da plataforma Habilidade</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-gray-800 overflow-hidden rounded-lg border border-gray-700"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-white">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-750 px-5 py-3">
              <div className="text-sm">
                <div className="flex items-center">
                  {stat.changeType === 'positive' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span
                    className={`font-medium ${
                      stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {stat.change}%
                  </span>
                  <span className="ml-2 text-gray-400">este mês</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Matrículas Recentes</h3>
            <div className="space-y-3">
              {recentEnrollments.length > 0 ? (
                recentEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-3 bg-gray-750 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {enrollment.user?.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {enrollment.user?.full_name || 'Usuário'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {enrollment.course?.title || 'Curso'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {formatDate(enrollment.enrolled_at)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        enrollment.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <AcademicCapIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhuma matrícula recente</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/courses/new"
                className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-center transition-colors"
              >
                <BookOpenIcon className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Novo Curso</p>
              </a>
              <a
                href="/admin/users"
                className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-center transition-colors"
              >
                <UsersIcon className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Gerenciar Usuários</p>
              </a>
              <a
                href="/admin/reports"
                className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-center transition-colors"
              >
                <ArrowTrendingUpIcon className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Relatórios</p>
              </a>
              <a
                href="/admin/settings"
                className="p-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-center transition-colors"
              >
                <CurrencyDollarIcon className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Configurações</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}