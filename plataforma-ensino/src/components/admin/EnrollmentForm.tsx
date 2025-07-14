'use client'

import { useState, useEffect } from 'react'
import { User, Course, Enrollment } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { 
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  AcademicCapIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface EnrollmentFormProps {
  onSubmit: (enrollmentData: any) => Promise<void>
  onCancel: () => void
  loading: boolean
  mode: 'create' | 'remove'
  existingEnrollment?: Enrollment | null
}

interface EnrollmentFormData {
  user_id: string
  course_id: string
  access_until: string
  status: 'active' | 'completed' | 'cancelled' | 'expired'
}

const defaultFormData: EnrollmentFormData = {
  user_id: '',
  course_id: '',
  access_until: '',
  status: 'active'
}

export function EnrollmentForm({ 
  onSubmit, 
  onCancel, 
  loading,
  mode,
  existingEnrollment
}: EnrollmentFormProps) {
  const [formData, setFormData] = useState<EnrollmentFormData>(defaultFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [searchUser, setSearchUser] = useState('')
  const [searchCourse, setSearchCourse] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingCourses, setLoadingCourses] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (existingEnrollment) {
      setFormData({
        user_id: existingEnrollment.user_id,
        course_id: existingEnrollment.course_id,
        access_until: existingEnrollment.access_until || '',
        status: existingEnrollment.status
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [existingEnrollment])

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true)
      try {
        let query = supabase
          .from('users')
          .select('id, full_name, email, avatar_url, role, created_at, updated_at')
          .order('full_name')
          .limit(20)

        if (searchUser) {
          query = query.or(`full_name.ilike.%${searchUser}%,email.ilike.%${searchUser}%`)
        }

        const { data, error } = await query
        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error('Error loading users:', error)
        setUsers([])
      } finally {
        setLoadingUsers(false)
      }
    }

    const timeoutId = setTimeout(loadUsers, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchUser, supabase])

  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true)
      try {
        let query = supabase
          .from('courses')
          .select('id, title, slug, thumbnail_url, is_published, created_at, updated_at, description, short_description, category_id, instructor_id, price, duration_minutes, level, requirements, what_you_learn, background_theme')
          .eq('is_published', true)
          .order('title')
          .limit(20)

        if (searchCourse) {
          query = query.ilike('title', `%${searchCourse}%`)
        }

        const { data, error } = await query
        if (error) throw error
        setCourses(data || [])
      } catch (error) {
        console.error('Error loading courses:', error)
        setCourses([])
      } finally {
        setLoadingCourses(false)
      }
    }

    const timeoutId = setTimeout(loadCourses, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchCourse, supabase])

  const handleInputChange = (field: keyof EnrollmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.user_id) {
      newErrors.user_id = 'Usuário é obrigatório'
    }

    if (!formData.course_id) {
      newErrors.course_id = 'Curso é obrigatório'
    }

    if (formData.access_until && new Date(formData.access_until) <= new Date()) {
      newErrors.access_until = 'Data de acesso deve ser futura'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const selectedUser = users.find(u => u.id === formData.user_id)
  const selectedCourse = courses.find(c => c.id === formData.course_id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {mode === 'create' ? 'Adicionar Matrícula' : 'Remover Matrícula'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Usuário *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar usuário por nome ou email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {selectedUser && (
                <div className="mt-2 p-3 bg-blue-900/20 rounded-md border border-blue-500/30">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-blue-300">{selectedUser.full_name}</p>
                      <p className="text-sm text-blue-400">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {!selectedUser && users.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-600 rounded-md bg-gray-800">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleInputChange('user_id', user.id)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 border-b border-gray-600 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-white">{user.full_name}</p>
                          <p className="text-sm text-gray-300">{user.email}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {errors.user_id && (
                <p className="mt-1 text-sm text-red-400">{errors.user_id}</p>
              )}
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Curso *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar curso por título..."
                  value={searchCourse}
                  onChange={(e) => setSearchCourse(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {selectedCourse && (
                <div className="mt-2 p-3 bg-green-900/20 rounded-md border border-green-500/30">
                  <div className="flex items-center space-x-3">
                    <AcademicCapIcon className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="font-medium text-green-300">{selectedCourse.title}</p>
                      <p className="text-sm text-green-400">/{selectedCourse.slug}</p>
                    </div>
                  </div>
                </div>
              )}

              {!selectedCourse && courses.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-600 rounded-md bg-gray-800">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => handleInputChange('course_id', course.id)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 border-b border-gray-600 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-white">{course.title}</p>
                          <p className="text-sm text-gray-300">/{course.slug}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {errors.course_id && (
                <p className="mt-1 text-sm text-red-400">{errors.course_id}</p>
              )}
            </div>

            {/* Access Until */}
            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Acesso até (opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    value={formData.access_until}
                    onChange={(e) => handleInputChange('access_until', e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.access_until && (
                  <p className="mt-1 text-sm text-red-400">{errors.access_until}</p>
                )}
              </div>
            )}

            {/* Status */}
            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Ativo</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="expired">Expirado</option>
                </select>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !selectedUser || !selectedCourse}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading || !selectedUser || !selectedCourse
                    ? 'bg-gray-600 cursor-not-allowed'
                    : mode === 'create'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Processando...' : mode === 'create' ? 'Adicionar Matrícula' : 'Remover Matrícula'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}