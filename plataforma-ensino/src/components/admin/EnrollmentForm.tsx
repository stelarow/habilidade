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

interface ScheduleSlot {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  slot_label: string
  currentCount?: number
  available?: boolean
  availableSpots?: number
}

interface EnrollmentFormData {
  user_id: string
  course_id: string
  teacher_id: string
  access_until: string
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  is_in_person: boolean
  has_two_classes_per_week: boolean
  schedule_slot_1?: string
  schedule_slot_2?: string
}

const defaultFormData: EnrollmentFormData = {
  user_id: '',
  course_id: '',
  teacher_id: '',
  access_until: '',
  status: 'active',
  is_in_person: false,
  has_two_classes_per_week: false,
  schedule_slot_1: '',
  schedule_slot_2: ''
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
  const [teachers, setTeachers] = useState<User[]>([])
  const [searchUser, setSearchUser] = useState('')
  const [searchCourse, setSearchCourse] = useState('')
  const [searchTeacher, setSearchTeacher] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [loadingTeachers, setLoadingTeachers] = useState(false)
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (existingEnrollment) {
      setFormData({
        user_id: existingEnrollment.user_id,
        course_id: existingEnrollment.course_id,
        teacher_id: (existingEnrollment as any).teacher_id || '',
        access_until: existingEnrollment.access_until || '',
        status: existingEnrollment.status,
        is_in_person: false,
        has_two_classes_per_week: false,
        schedule_slot_1: '',
        schedule_slot_2: ''
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

  // Load schedule slots when in-person is selected
  useEffect(() => {
    const loadScheduleSlots = async () => {
      if (!formData.is_in_person) return
      
      setLoadingSlots(true)
      try {
        const response = await fetch('/api/schedule-slots?includeAvailability=true')
        if (!response.ok) throw new Error('Failed to fetch schedule slots')
        
        const result = await response.json()
        setScheduleSlots(result.data || [])
      } catch (error) {
        console.error('Error loading schedule slots:', error)
        setScheduleSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }

    loadScheduleSlots()
  }, [formData.is_in_person])

  // Load teachers
  useEffect(() => {
    const loadTeachers = async () => {
      setLoadingTeachers(true)
      try {
        let query = supabase
          .from('users')
          .select('id, full_name, email, avatar_url, role, created_at, updated_at')
          .in('role', ['instructor', 'admin'])
          .order('full_name')
          .limit(20)

        if (searchTeacher) {
          query = query.or(`full_name.ilike.%${searchTeacher}%,email.ilike.%${searchTeacher}%`)
        }

        const { data, error } = await query
        if (error) throw error
        setTeachers(data || [])
      } catch (error) {
        console.error('Error loading teachers:', error)
        setTeachers([])
      } finally {
        setLoadingTeachers(false)
      }
    }

    const timeoutId = setTimeout(loadTeachers, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchTeacher, supabase])

  const handleInputChange = (field: keyof EnrollmentFormData, value: string | boolean) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      
      // Reset schedule fields when switching to/from in-person
      if (field === 'is_in_person' && !value) {
        updated.has_two_classes_per_week = false
        updated.schedule_slot_1 = ''
        updated.schedule_slot_2 = ''
      }
      
      // Reset second schedule when switching to single class
      if (field === 'has_two_classes_per_week' && !value) {
        updated.schedule_slot_2 = ''
      }
      
      return updated
    })
    
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

    if (!formData.teacher_id) {
      newErrors.teacher_id = 'Professor é obrigatório'
    }

    if (formData.access_until && new Date(formData.access_until) <= new Date()) {
      newErrors.access_until = 'Data de acesso deve ser futura'
    }

    // Validate in-person scheduling
    if (formData.is_in_person) {
      if (!formData.schedule_slot_1) {
        newErrors.schedule_slot_1 = 'Primeiro horário é obrigatório para aulas presenciais'
      }
      
      if (formData.has_two_classes_per_week) {
        if (!formData.schedule_slot_2) {
          newErrors.schedule_slot_2 = 'Segundo horário é obrigatório quando selecionado duas aulas por semana'
        }
        
        if (formData.schedule_slot_1 === formData.schedule_slot_2) {
          newErrors.schedule_slot_2 = 'O segundo horário deve ser diferente do primeiro'
        }
      }
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

            {/* Teacher Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Professor/Instrutor *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar professor por nome ou email..."
                  value={searchTeacher}
                  onChange={(e) => setSearchTeacher(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {teachers.find(t => t.id === formData.teacher_id) && (
                <div className="mt-2 p-3 bg-purple-900/20 rounded-md border border-purple-500/30">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-purple-300">{teachers.find(t => t.id === formData.teacher_id)?.full_name}</p>
                      <p className="text-sm text-purple-400">{teachers.find(t => t.id === formData.teacher_id)?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {!teachers.find(t => t.id === formData.teacher_id) && teachers.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-600 rounded-md bg-gray-800">
                  {teachers.map((teacher) => (
                    <button
                      key={teacher.id}
                      type="button"
                      onClick={() => handleInputChange('teacher_id', teacher.id)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 border-b border-gray-600 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-white">{teacher.full_name}</p>
                          <p className="text-sm text-gray-300">{teacher.email}</p>
                          <p className="text-xs text-gray-400 capitalize">{teacher.role}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {errors.teacher_id && (
                <p className="mt-1 text-sm text-red-400">{errors.teacher_id}</p>
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

            {/* In-Person Class Options */}
            {mode === 'create' && (
              <div className="space-y-4">
                {/* In-Person Toggle */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_in_person"
                    checked={formData.is_in_person}
                    onChange={(e) => handleInputChange('is_in_person', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                  />
                  <label htmlFor="is_in_person" className="text-sm font-medium text-gray-300">
                    Aula Presencial
                  </label>
                </div>

                {formData.is_in_person && (
                  <>
                    {/* Two Classes Per Week Toggle */}
                    <div className="flex items-center space-x-3 ml-6">
                      <input
                        type="checkbox"
                        id="has_two_classes_per_week"
                        checked={formData.has_two_classes_per_week}
                        onChange={(e) => handleInputChange('has_two_classes_per_week', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                      />
                      <label htmlFor="has_two_classes_per_week" className="text-sm font-medium text-gray-300">
                        Duas aulas por semana
                      </label>
                    </div>

                    {/* First Schedule Slot */}
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {formData.has_two_classes_per_week ? 'Primeiro Horário *' : 'Horário *'}
                      </label>
                      {loadingSlots ? (
                        <div className="text-sm text-gray-400">Carregando horários...</div>
                      ) : (
                        <select
                          value={formData.schedule_slot_1}
                          onChange={(e) => handleInputChange('schedule_slot_1', e.target.value)}
                          className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione um horário</option>
                          {scheduleSlots
                            .filter(slot => slot.available)
                            .map((slot) => {
                              const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
                              return (
                                <option key={slot.id} value={slot.id}>
                                  {dayNames[slot.day_of_week]} - {slot.slot_label} ({slot.availableSpots} vagas)
                                </option>
                              )
                            })}
                        </select>
                      )}
                      {errors.schedule_slot_1 && (
                        <p className="mt-1 text-sm text-red-400">{errors.schedule_slot_1}</p>
                      )}
                    </div>

                    {/* Second Schedule Slot */}
                    {formData.has_two_classes_per_week && (
                      <div className="ml-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Segundo Horário *
                        </label>
                        {loadingSlots ? (
                          <div className="text-sm text-gray-400">Carregando horários...</div>
                        ) : (
                          <select
                            value={formData.schedule_slot_2}
                            onChange={(e) => handleInputChange('schedule_slot_2', e.target.value)}
                            className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Selecione um segundo horário</option>
                            {scheduleSlots
                              .filter(slot => slot.available && slot.id !== formData.schedule_slot_1)
                              .map((slot) => {
                                const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
                                return (
                                  <option key={slot.id} value={slot.id}>
                                    {dayNames[slot.day_of_week]} - {slot.slot_label} ({slot.availableSpots} vagas)
                                  </option>
                                )
                              })}
                          </select>
                        )}
                        {errors.schedule_slot_2 && (
                          <p className="mt-1 text-sm text-red-400">{errors.schedule_slot_2}</p>
                        )}
                      </div>
                    )}

                    {/* Schedule Instructions */}
                    <div className="ml-6 p-3 bg-blue-900/20 rounded-md border border-blue-500/30">
                      <p className="text-sm text-blue-300">
                        ℹ️ <strong>Informações sobre agendamento:</strong>
                      </p>
                      <ul className="mt-2 text-xs text-blue-400 space-y-1">
                        <li>• Máximo de 3 alunos por horário</li>
                        <li>• Para duas aulas por semana, selecione horários diferentes</li>
                        <li>• Pode ser mesmo horário em dias diferentes ou mesmo dia em horários diferentes</li>
                        <li>• O agendamento será permanente até que o admin faça alterações</li>
                      </ul>
                    </div>
                  </>
                )}
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
                disabled={loading || !selectedUser || !selectedCourse || !formData.teacher_id}
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