'use client'

import React, { useState, useEffect } from 'react'
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
  const [searchUser, setSearchUser] = useState('')
  const [searchCourse, setSearchCourse] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [localSelectedSlots, setLocalSelectedSlots] = useState<string[]>([])
  const [formattedSelectedSlots, setFormattedSelectedSlots] = useState<{ slot1: string; slot2: string }>({ slot1: '', slot2: '' })
  
  // Toast hook for enhanced error handling (AC: 4)
  const { toastError, toastSuccess, toastWarning } = useToast()

  // Convert DB Course to TeacherSelector Course with validation
  const convertToTeacherSelectorCourse = (course: DBCourse): TeacherSelectorCourse | null => {
    // Validate required fields to prevent React errors
    if (!course || !course.id || !course.title) {
      console.warn('Invalid course data for conversion:', course)
      return null
    }
    
    try {
      return {
        id: course.id,
        title: course.title,
        category: course.category?.name || 'Uncategorized',
        duration_hours: Math.ceil((course.duration_minutes || 60) / 60), // Default 60 minutes if not set
        max_students: 20 // Default value, could be from course settings
      }
    } catch (error) {
      console.error('Error converting course:', error)
      return null
    }
  }

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


  const handleInputChange = (field: keyof EnhancedEnrollmentFormData, value: string | boolean) => {
    // Validate field and value to prevent undefined/null errors
    if (!field) {
      console.warn('handleInputChange called with invalid field:', field)
      return
    }
    
    // Ensure value is not undefined (convert to empty string if needed)
    const safeValue = value === undefined || value === null ? '' : value
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: safeValue
      }
      
      // Reset schedule fields when switching to/from in-person
      if (field === 'is_in_person' && !safeValue) {
        updated.has_two_classes_per_week = false
        updated.schedule_slot_1 = ''
        updated.schedule_slot_2 = ''
        updated.teacher_id = '' // Clear teacher when switching to online
      }
      
      // Clear teacher when switching to in-person (will be handled by SchedulingSection)
      if (field === 'is_in_person' && safeValue) {
        updated.teacher_id = ''
      }
      
      // Reset second schedule when switching to single class
      if (field === 'has_two_classes_per_week' && !safeValue) {
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
    
    // Convert local slots to form data before validation if in preview mode
    let finalFormData = { ...formData }
    if (formData.is_in_person && localSelectedSlots.length > 0) {
      // Use the formatted slots that we've been tracking
      finalFormData = {
        ...formData,
        schedule_slot_1: formattedSelectedSlots.slot1,
        schedule_slot_2: formattedSelectedSlots.slot2
      }
    }
    
    // Enhanced validation with specific error messages (AC: 4)
    const { isValid, errors: validationErrors } = validateEnrollmentForm(finalFormData)
    setErrors(validationErrors)
    
    if (!isValid) {
      // Show specific error messages for common validation failures
      if (finalFormData.is_in_person && !finalFormData.teacher_id) {
        toastError(validationMessages.teacher_required, 'Erro de Validação')
      }
      if (finalFormData.is_in_person && localSelectedSlots.length === 0 && !finalFormData.schedule_slot_1) {
        toastError(validationMessages.schedule_required, 'Erro de Validação')
      }
      if (finalFormData.has_two_classes_per_week && localSelectedSlots.length < 2) {
        toastError(validationMessages.two_schedules_required, 'Erro de Validação')
      }
      return
    }

    try {
      // Transform form data to API payload format (AC: 3)
      const apiPayload = transformFormDataToApiPayload(finalFormData)
      await onSubmit(apiPayload)
      
      // Success notification (AC: 4)
      toastSuccess(
        mode === 'create' 
          ? 'Matrícula criada com sucesso!' 
          : 'Matrícula removida com sucesso!'
      )
    } catch (error: any) {
      console.error('Form submission error:', error)
      
      // Enhanced API error handling with detailed instructor validation (AC: 4)
      const errorMessage = error?.message || error?.error || (typeof error === 'string' ? error : 'Erro interno do servidor')
      
      // Handle detailed error responses from API
      let errorDetails = null
      try {
        // Try to parse additional error details from API response
        if (error?.details) {
          errorDetails = error.details
        }
      } catch (e) {
        console.warn('Could not parse error details:', e)
      }
      
      console.error('Form submission error details:', {
        error,
        errorMessage,
        errorDetails,
        formData: {
          ...formData,
          // Log relevant form data for debugging
          user_id: formData.user_id,
          course_id: formData.course_id,
          teacher_id: formData.teacher_id,
          is_in_person: formData.is_in_person,
          schedule_slot_1: formData.schedule_slot_1,
          schedule_slot_2: formData.schedule_slot_2
        }
      })
      
      // Specific error handling based on error type
      if (errorMessage.includes('já está matriculado')) {
        toastWarning('Este usuário já está matriculado neste curso', 'Matrícula Duplicada')
      } else if (errorMessage.includes('instrutores não foram encontrados')) {
        // Handle instructor not found errors with specific details
        if (errorDetails?.missing_instructor_ids) {
          toastError(
            `Professores não encontrados no sistema: ${errorDetails.missing_instructor_ids.join(', ')}. ` +
            'Verifique se os professores foram cadastrados corretamente.',
            'Professores Não Encontrados'
          )
        } else {
          toastError(
            'Um ou mais professores selecionados não foram encontrados no sistema. ' +
            'Verifique se os professores foram cadastrados corretamente.',
            'Professores Não Encontrados'
          )
        }
      } else if (errorMessage.includes('não têm permissão para lecionar')) {
        // Handle invalid instructor role errors
        if (errorDetails?.invalid_instructors) {
          const invalidNames = errorDetails.invalid_instructors.map((i: any) => i.name).join(', ')
          toastError(
            `Os seguintes usuários não têm permissão para lecionar: ${invalidNames}. ` +
            'Verifique as funções dos usuários selecionados.',
            'Permissões Insuficientes'
          )
        } else {
          toastError(
            'Um ou mais usuários selecionados não têm permissão para lecionar. ' +
            'Verifique as funções dos usuários.',
            'Permissões Insuficientes'
          )
        }
      } else if (errorMessage.includes('não encontrado')) {
        toastError('Alguns dados não foram encontrados. Verifique as informações e tente novamente.', 'Dados Inválidos')
      } else if (errorMessage.includes('horário')) {
        toastError('Erro relacionado aos horários selecionados. Verifique a disponibilidade.', 'Erro de Agendamento')
      } else if (errorMessage.includes('undefined') || errorMessage.includes('null')) {
        toastError('Dados inválidos detectados. Verifique se todos os campos obrigatórios foram preenchidos.', 'Erro de Validação')
      } else {
        toastError(errorMessage, 'Erro na Submissão')
      }
    }
  }

  const selectedUser = users.find((u: any) => u.id === formData.user_id)
  const selectedCourse = courses.find((c: any) => c.id === formData.course_id)

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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-blue-300">{selectedUser.full_name}</p>
                        <p className="text-sm text-blue-400">{selectedUser.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('user_id', '')}
                      className="text-gray-400 hover:text-gray-300 p-1"
                      title="Remover seleção"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AcademicCapIcon className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="font-medium text-green-300">{selectedCourse.title}</p>
                        <p className="text-sm text-green-400">/{selectedCourse.slug}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('course_id', '')}
                      className="text-gray-400 hover:text-gray-300 p-1"
                      title="Remover seleção"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
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
                  selectedCourse={selectedCourse ? convertToTeacherSelectorCourse(selectedCourse) || undefined : undefined}
                  teacherId={formData.teacher_id || ''}
                  hasTwoClassesPerWeek={formData.has_two_classes_per_week}
                  previewMode={true} // Enable preview mode to prevent automatic submission
                  onTeacherChange={(teacherUserId) => {
                    const safeTeacherUserId = teacherUserId || ''
                    console.log('Teacher changed - userId:', safeTeacherUserId)
                    handleInputChange('teacher_id', safeTeacherUserId)
                    // Clear local selection when teacher changes
                    setLocalSelectedSlots([])
                    setFormattedSelectedSlots({ slot1: '', slot2: '' })
                  }}
                  onTwoClassesChange={(checked) => {
                    handleInputChange('has_two_classes_per_week', checked)
                    // Clear local selection when changing number of classes
                    setLocalSelectedSlots([])
                    setFormattedSelectedSlots({ slot1: '', slot2: '' })
                  }}
                  onLocalSelectionChange={(selectedSlots, formattedSlots) => {
                    console.log('Local slots selection changed:', selectedSlots, 'Formatted:', formattedSlots)
                    setLocalSelectedSlots(selectedSlots)
                    setFormattedSelectedSlots(formattedSlots)
                  }}
                  onSlotSelect={(slot1, slot2) => {
                    // This will only be called in non-preview mode
                    const safeSlot1 = slot1 || ''
                    const safeSlot2 = slot2 || ''
                    console.log('Slots directly selected (non-preview):', { slot1: safeSlot1, slot2: safeSlot2 })
                    handleInputChange('schedule_slot_1', safeSlot1)
                    handleInputChange('schedule_slot_2', safeSlot2)
                  }}
                />
                
                {/* Enhanced scheduling validation feedback */}
                {formData.is_in_person && (
                  <div className="space-y-2">
                    {/* Teacher validation feedback */}
                    {!formData.teacher_id && (
                      <p className="text-sm text-yellow-400">
                        ⚠️ Selecione um professor para continuar
                      </p>
                    )}
                    
                    {/* Schedule slots validation feedback */}
                    {formData.teacher_id && localSelectedSlots.length === 0 && (
                      <p className="text-sm text-yellow-400">
                        ⚠️ Selecione pelo menos um horário para prosseguir
                      </p>
                    )}
                    
                    {/* Success feedback for single class */}
                    {formData.teacher_id && localSelectedSlots.length > 0 && !formData.has_two_classes_per_week && (
                      <p className="text-sm text-green-400">
                        ✅ Professor e horário selecionados. O botão "Adicionar Matrícula" está habilitado.
                      </p>
                    )}
                    
                    {/* Two classes per week validation */}
                    {formData.has_two_classes_per_week && (
                      <>
                        {localSelectedSlots.length < 2 && (
                          <p className="text-sm text-yellow-400">
                            ⚠️ Selecione 2 horários para aulas duas vezes por semana
                          </p>
                        )}
                        
                        {localSelectedSlots.length === 2 && (
                          <p className="text-sm text-green-400">
                            ✅ Dois horários selecionados. O botão "Adicionar Matrícula" está habilitado.
                          </p>
                        )}
                      </>
                    )}
                    
                    {/* Error messages */}
                    {errors.schedule_slot_1 && (
                      <p className="text-sm text-red-400">{errors.schedule_slot_1}</p>
                    )}
                    
                    {errors.schedule_slot_2 && (
                      <p className="text-sm text-red-400">{errors.schedule_slot_2}</p>
                    )}
                  </div>
                )}
                
                {/* Success feedback for online enrollments */}
                {!formData.is_in_person && selectedUser && selectedCourse && (
                  <p className="text-sm text-green-400">
                    ✅ Matrícula online configurada. O botão "Adicionar Matrícula" está habilitado.
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
                disabled={
                  loading || 
                  !selectedUser || 
                  !selectedCourse || 
                  (formData.is_in_person && (
                    !formData.teacher_id || 
                    localSelectedSlots.length === 0 || 
                    (formData.has_two_classes_per_week && localSelectedSlots.length < 2)
                  ))
                }
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading || 
                  !selectedUser || 
                  !selectedCourse || 
                  (formData.is_in_person && (
                    !formData.teacher_id || 
                    localSelectedSlots.length === 0 || 
                    (formData.has_two_classes_per_week && localSelectedSlots.length < 2)
                  ))
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