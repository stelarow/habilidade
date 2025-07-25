'use client'

import { useState, useEffect } from 'react'
import type { User, Course as DBCourse, Enrollment } from '@/types'
import type { EnhancedEnrollmentFormData, EnrollmentValidationErrors } from '@/types/enrollment'
import type { Course as TeacherSelectorCourse } from '@/components/enrollment/TeacherSelector'
import { createClient } from '@/lib/supabase/client'
import { 
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  AcademicCapIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import SchedulingSection from '@/components/scheduling/SchedulingSection'
import { 
  validateEnrollmentForm, 
  transformFormDataToApiPayload,
  validationMessages 
} from '@/utils/enrollmentValidation'
import { useToast } from '@/hooks/useToast'

interface EnrollmentFormProps {
  onSubmit: (enrollmentData: any) => Promise<void>
  onCancel: () => void
  loading: boolean
  mode: 'create' | 'remove'
  existingEnrollment?: Enrollment | null
}


const defaultFormData: EnhancedEnrollmentFormData = {
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
  const [formData, setFormData] = useState<EnhancedEnrollmentFormData>(defaultFormData)
  const [errors, setErrors] = useState<EnrollmentValidationErrors>({})
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<DBCourse[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [searchUser, setSearchUser] = useState('')
  const [searchCourse, setSearchCourse] = useState('')
  const [searchTeacher, setSearchTeacher] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [loadingTeachers, setLoadingTeachers] = useState(false)
  
  // Toast hook for enhanced error handling (AC: 4)
  const { toastError, toastSuccess, toastWarning } = useToast()

  // Convert DB Course to TeacherSelector Course
  const convertToTeacherSelectorCourse = (course: DBCourse): TeacherSelectorCourse => ({
    id: course.id,
    title: course.title,
    category: course.category?.name || 'Uncategorized',
    duration_hours: Math.ceil(course.duration_minutes / 60),
    max_students: 20 // Default value, could be from course settings
  })

  const supabase = createClient()

  useEffect(() => {
    if (existingEnrollment) {
      // Handle pre-population for editing existing in-person enrollments (AC: 5)
      const enrollmentAny = existingEnrollment as any
      setFormData({
        user_id: existingEnrollment.user_id,
        course_id: existingEnrollment.course_id,
        teacher_id: enrollmentAny.teacher_id || '',
        access_until: existingEnrollment.access_until || '',
        status: existingEnrollment.status,
        is_in_person: enrollmentAny.is_in_person || false,
        has_two_classes_per_week: enrollmentAny.has_two_classes_per_week || false,
        schedule_slot_1: enrollmentAny.schedule_slot_1 || '',
        schedule_slot_2: enrollmentAny.schedule_slot_2 || ''
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

  const handleInputChange = (field: keyof EnhancedEnrollmentFormData, value: string | boolean) => {
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
    // Use enhanced validation with Zod (AC: 1, 2)
    const { isValid, errors: validationErrors } = validateEnrollmentForm(formData)
    
    setErrors(validationErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Enhanced validation with specific error messages (AC: 4)
    if (!validateForm()) {
      // Show specific error messages for common validation failures
      if (formData.is_in_person && !formData.teacher_id) {
        toastError(validationMessages.teacher_required, 'Erro de Validação')
      }
      if (formData.is_in_person && !formData.schedule_slot_1) {
        toastError(validationMessages.schedule_required, 'Erro de Validação')
      }
      if (formData.has_two_classes_per_week && (!formData.schedule_slot_2 || formData.schedule_slot_1 === formData.schedule_slot_2)) {
        toastError(validationMessages.two_schedules_required, 'Erro de Validação')
      }
      return
    }

    try {
      // Transform form data to API payload format (AC: 3)
      const apiPayload = transformFormDataToApiPayload(formData)
      await onSubmit(apiPayload)
      
      // Success notification (AC: 4)
      toastSuccess(
        mode === 'create' 
          ? 'Matrícula criada com sucesso!' 
          : 'Matrícula removida com sucesso!'
      )
    } catch (error: any) {
      console.error('Form submission error:', error)
      
      // Enhanced API error handling with Toast notifications (AC: 4)
      const errorMessage = error?.message || error?.error || 'Erro interno do servidor'
      
      if (errorMessage.includes('já está matriculado')) {
        toastWarning('Este usuário já está matriculado neste curso', 'Matrícula Duplicada')
      } else if (errorMessage.includes('não encontrado')) {
        toastError('Alguns dados não foram encontrados. Verifique as informações e tente novamente.', 'Dados Inválidos')
      } else if (errorMessage.includes('horário')) {
        toastError('Erro relacionado aos horários selecionados. Verifique a disponibilidade.', 'Erro de Agendamento')
      } else {
        toastError(errorMessage, 'Erro na Submissão')
      }
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

            {/* Teacher Selection - Conditional requirement based on modality (AC: 1, 2) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Professor/Instrutor {formData.is_in_person ? '*' : '(opcional)'}
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
              
              {/* Enhanced validation feedback for in-person enrollments (AC: 4) */}
              {formData.is_in_person && !formData.teacher_id && (
                <p className="mt-1 text-sm text-yellow-400">
                  ⚠️ {validationMessages.teacher_required}
                </p>
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

            {/* In-Person Class Options (AC: 1 - "Curso Presencial" checkbox, unchecked by default) */}
            {mode === 'create' && (
              <div className="space-y-6">
                {/* Curso Presencial Toggle */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_in_person"
                    checked={formData.is_in_person}
                    onChange={(e) => handleInputChange('is_in_person', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                  />
                  <label htmlFor="is_in_person" className="text-sm font-medium text-gray-300">
                    Curso Presencial
                  </label>
                </div>

                {/* Conditional SchedulingSection (AC: 2, 3, 4) */}
                <SchedulingSection
                  isVisible={formData.is_in_person}
                  selectedCourse={selectedCourse ? convertToTeacherSelectorCourse(selectedCourse) : undefined}
                  teacherId={formData.teacher_id}
                  hasTwoClassesPerWeek={formData.has_two_classes_per_week}
                  onTeacherChange={(teacherId) => handleInputChange('teacher_id', teacherId)}
                  onTwoClassesChange={(checked) => handleInputChange('has_two_classes_per_week', checked)}
                  onSlotSelect={(slot1, slot2) => {
                    handleInputChange('schedule_slot_1', slot1 || '')
                    handleInputChange('schedule_slot_2', slot2 || '')
                  }}
                />
                
                {/* Enhanced scheduling validation feedback (AC: 4) */}
                {formData.is_in_person && (
                  <div className="space-y-2">
                    {!formData.schedule_slot_1 && (
                      <p className="text-sm text-yellow-400">
                        ⚠️ {validationMessages.schedule_required}
                      </p>
                    )}
                    
                    {errors.schedule_slot_1 && (
                      <p className="text-sm text-red-400">{errors.schedule_slot_1}</p>
                    )}
                    
                    {formData.has_two_classes_per_week && (
                      <>
                        {!formData.schedule_slot_2 && (
                          <p className="text-sm text-yellow-400">
                            ⚠️ {validationMessages.two_schedules_required}
                          </p>
                        )}
                        
                        {formData.schedule_slot_1 === formData.schedule_slot_2 && formData.schedule_slot_2 && (
                          <p className="text-sm text-red-400">
                            ❌ {validationMessages.schedules_must_differ}
                          </p>
                        )}
                      </>
                    )}
                    
                    {errors.schedule_slot_2 && (
                      <p className="text-sm text-red-400">{errors.schedule_slot_2}</p>
                    )}
                  </div>
                )}
                
                {/* Success feedback for online enrollments (AC: 1) */}
                {!formData.is_in_person && (
                  <p className="text-sm text-green-400">
                    ✅ {validationMessages.online_validation_passed}
                  </p>
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
                disabled={loading || !selectedUser || !selectedCourse || (formData.is_in_person && !formData.teacher_id)}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading || !selectedUser || !selectedCourse || (formData.is_in_person && !formData.teacher_id)
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