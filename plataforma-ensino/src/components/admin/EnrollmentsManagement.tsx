'use client'

import { useState } from 'react'
import { User } from '@/types'
import { createClient } from '../../../lib/supabase/client'
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Enrollment {
  id: string
  user_id: string
  course_id: string
  status: 'active' | 'completed' | 'cancelled'
  progress: number
  created_at: string
  completed_at?: string
  user: {
    id: string
    name: string
    email: string
    avatar_url?: string
  }
  course: {
    id: string
    title: string
    thumbnail_url?: string
  }
}

interface EnrollmentsManagementProps {
  enrollments: Enrollment[]
  currentUser: User | null
}

export function EnrollmentsManagement({ enrollments: initialEnrollments, currentUser }: EnrollmentsManagementProps) {
  const [enrollments, setEnrollments] = useState(initialEnrollments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = searchTerm === '' || 
      enrollment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-400" />
      default:
        return <ClockIcon className="h-5 w-5 text-blue-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Ativo'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600'
      case 'cancelled':
        return 'bg-red-600'
      default:
        return 'bg-blue-600'
    }
  }

  const handleStatusChange = async (enrollmentId: string, newStatus: string) => {
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ 
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', enrollmentId)

      if (error) throw error

      setEnrollments(enrollments.map(enrollment => 
        enrollment.id === enrollmentId 
          ? { ...enrollment, status: newStatus as any }
          : enrollment
      ))
    } catch (error) {
      console.error('Error updating enrollment status:', error)
      alert('Erro ao atualizar status da matrícula')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Gerenciamento de Matrículas</h1>
        <p className="text-gray-400">Gerencie todas as matrículas dos estudantes</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por estudante ou curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativo</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Total de Matrículas</p>
          <p className="text-2xl font-bold text-white">{enrollments.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Ativas</p>
          <p className="text-2xl font-bold text-blue-400">
            {enrollments.filter(e => e.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Concluídas</p>
          <p className="text-2xl font-bold text-green-400">
            {enrollments.filter(e => e.status === 'completed').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Canceladas</p>
          <p className="text-2xl font-bold text-red-400">
            {enrollments.filter(e => e.status === 'cancelled').length}
          </p>
        </div>
      </div>

      {/* Enrollments List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-750">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estudante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Data da Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover"
                          src={enrollment.user.avatar_url || '/api/placeholder/40/40'} 
                          alt={enrollment.user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{enrollment.user.name}</div>
                        <div className="text-sm text-gray-400">{enrollment.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded object-cover"
                          src={enrollment.course.thumbnail_url || '/api/placeholder/40/40'} 
                          alt={enrollment.course.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{enrollment.course.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(enrollment.status)}
                      <span className="ml-2 text-sm text-gray-300">{getStatusText(enrollment.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getStatusColor(enrollment.status)}`}
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-300">{enrollment.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(enrollment.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <select
                        value={enrollment.status}
                        onChange={(e) => handleStatusChange(enrollment.id, e.target.value)}
                        disabled={loading}
                        className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      >
                        <option value="active">Ativo</option>
                        <option value="completed">Concluído</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEnrollments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">Nenhuma matrícula encontrada</p>
        </div>
      )}
    </div>
  )
}