/**
 * Enrollment Form Validation Hook
 * Story 3.1: Teacher Enrollment Integration - Task 1
 * 
 * Provides form validation for teacher selection and enrollment flow
 * using React Hook Form with Zod schema validation.
 */

import { useState, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { logDebug } from '@/lib/utils/logger'
import { 
  EnrollmentFormSchema, 
  TeacherSelectionSchema, 
  TimeSlotSelectionSchema,
  type EnrollmentForm,
  type TeacherSelection,
  type TimeSlotSelection
} from '@/lib/validators/api-schemas'
import type { Teacher } from '@/components/enrollment/TeacherSelector'
import type { TimeSlot } from '@/components/enrollment/ConditionalCalendar'

// Form state types
export interface EnrollmentFormData {
  courseId: string
  teacherId: string | null
  selectedSlots: {
    slotId: string
    date: string
    startTime: string
    endTime: string
  }[]
  totalHours: number
  courseType?: string
  notes?: string
}

export interface TeacherSelectionData {
  teacherId: string
  timeSlotId: string
  startDate: string
  startTime: string
}

// Validation error types
export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface UseEnrollmentValidationOptions {
  enableRealtimeValidation?: boolean
  validateOnBlur?: boolean
  validateOnChange?: boolean
}

/**
 * Main enrollment validation hook
 */
export function useEnrollmentValidation(options: UseEnrollmentValidationOptions = {}) {
  const {
    enableRealtimeValidation = true,
    validateOnBlur = true,
    validateOnChange = false
  } = options

  // Form instance for enrollment data
  const enrollmentForm = useForm<EnrollmentFormData>({
    resolver: zodResolver(EnrollmentFormSchema),
    mode: enableRealtimeValidation ? 'onChange' : 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      courseId: '',
      teacherId: '',
      selectedSlots: [],
      totalHours: 0,
      notes: ''
    }
  })

  // Form instance for teacher selection
  const teacherForm = useForm<TeacherSelectionData>({
    resolver: zodResolver(TeacherSelectionSchema),
    mode: enableRealtimeValidation ? 'onChange' : 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      teacherId: '',
      timeSlotId: '',
      startDate: '',
      startTime: ''
    }
  })

  const [customErrors, setCustomErrors] = useState<ValidationError[]>([])
  const [isValidating, setIsValidating] = useState(false)

  // Teacher selection validation
  const validateTeacherSelection = useCallback(async (
    teacher: Teacher,
    courseId?: string
  ): Promise<{ isValid: boolean; errors: ValidationError[] }> => {
    setIsValidating(true)
    const errors: ValidationError[] = []

    try {
      // Basic teacher validation
      if (!teacher.id) {
        errors.push({ field: 'teacherId', message: 'Professor deve ser selecionado' })
      }

      if (!teacher.isActive) {
        errors.push({ field: 'teacherId', message: 'Professor selecionado não está ativo' })
      }

      // Check if teacher has availability
      if (teacher.availability && teacher.availability.length === 0) {
        errors.push({ 
          field: 'teacherId', 
          message: 'Professor selecionado não possui horários disponíveis',
          code: 'NO_AVAILABILITY'
        })
      }

      // Course compatibility check (if courseId provided)
      if (courseId && teacher.specialties && teacher.specialties.length > 0) {
        // In a real implementation, this would check course-teacher compatibility
        logDebug('Course compatibility check for:', courseId, teacher.specialties)
      }

      setCustomErrors(errors)
      return { isValid: errors.length === 0, errors }
    } catch (error) {
      const validationError = { 
        field: 'general', 
        message: 'Erro na validação do professor',
        code: 'VALIDATION_ERROR'
      }
      setCustomErrors([validationError])
      return { isValid: false, errors: [validationError] }
    } finally {
      setIsValidating(false)
    }
  }, [])

  // Time slot validation
  const validateTimeSlots = useCallback(async (
    slots: TimeSlot[],
    courseRequirements: { totalHours: number; sessionDuration: number }
  ): Promise<{ isValid: boolean; errors: ValidationError[] }> => {
    setIsValidating(true)
    const errors: ValidationError[] = []

    try {
      // Check minimum slots
      if (slots.length === 0) {
        errors.push({ 
          field: 'selectedSlots', 
          message: 'Pelo menos um horário deve ser selecionado' 
        })
        setCustomErrors(errors)
        return { isValid: false, errors }
      }

      // Validate each slot
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i]
        const slotErrors: ValidationError[] = []

        // Validate slot data structure
        try {
          TimeSlotSelectionSchema.parse({
            slotId: slot.slotId,
            date: slot.date.toISOString().split('T')[0],
            startTime: slot.startTime,
            endTime: slot.endTime,
            teacherId: slot.teacherId,
            maxCapacity: slot.maxCapacity,
            currentCapacity: slot.currentCapacity
          })
        } catch (zodError) {
          if (zodError instanceof z.ZodError) {
            zodError.errors.forEach(err => {
              slotErrors.push({
                field: `selectedSlots[${i}].${err.path.join('.')}`,
                message: err.message,
                code: 'VALIDATION_ERROR'
              })
            })
          }
        }

        // Check availability
        if (!slot.isAvailable) {
          slotErrors.push({
            field: `selectedSlots[${i}]`,
            message: `Horário ${slot.startTime}-${slot.endTime} não está disponível`,
            code: 'SLOT_UNAVAILABLE'
          })
        }

        // Check capacity
        if (slot.currentCapacity >= slot.maxCapacity) {
          slotErrors.push({
            field: `selectedSlots[${i}]`,
            message: `Horário ${slot.startTime}-${slot.endTime} está lotado`,
            code: 'CAPACITY_EXCEEDED'
          })
        }

        // Check for conflicts
        if (slot.conflictReason) {
          slotErrors.push({
            field: `selectedSlots[${i}]`,
            message: `Conflito: ${slot.conflictReason}`,
            code: 'SLOT_CONFLICT'
          })
        }

        errors.push(...slotErrors)
      }

      // Check total hours
      const totalSelectedHours = slots.reduce((sum, slot) => {
        const start = new Date(`1970-01-01T${slot.startTime}:00`)
        const end = new Date(`1970-01-01T${slot.endTime}:00`)
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      }, 0)

      const minimumHours = courseRequirements.totalHours * 0.8 // 80% minimum
      if (totalSelectedHours < minimumHours) {
        errors.push({
          field: 'selectedSlots',
          message: `Selecione pelo menos ${minimumHours}h de aulas (${totalSelectedHours.toFixed(1)}h/${courseRequirements.totalHours}h)`,
          code: 'INSUFFICIENT_HOURS'
        })
      }

      // Check for overlapping dates
      const dateMap = new Map<string, TimeSlot[]>()
      slots.forEach(slot => {
        const dateStr = slot.date.toISOString().split('T')[0]
        if (!dateMap.has(dateStr)) {
          dateMap.set(dateStr, [])
        }
        dateMap.get(dateStr)!.push(slot)
      })

      dateMap.forEach((daySlots, date) => {
        if (daySlots.length > 1) {
          // Check for time overlaps
          for (let i = 0; i < daySlots.length - 1; i++) {
            for (let j = i + 1; j < daySlots.length; j++) {
              const slot1 = daySlots[i]
              const slot2 = daySlots[j]
              
              const start1 = slot1.startTime
              const end1 = slot1.endTime
              const start2 = slot2.startTime
              const end2 = slot2.endTime

              // Check for overlap
              if (start1 < end2 && start2 < end1) {
                errors.push({
                  field: 'selectedSlots',
                  message: `Conflito de horário em ${date}: ${start1}-${end1} e ${start2}-${end2}`,
                  code: 'TIME_OVERLAP'
                })
              }
            }
          }
        }
      })

      setCustomErrors(errors)
      return { isValid: errors.length === 0, errors }
    } catch (error) {
      const validationError = { 
        field: 'general', 
        message: 'Erro na validação dos horários',
        code: 'VALIDATION_ERROR'
      }
      setCustomErrors([validationError])
      return { isValid: false, errors: [validationError] }
    } finally {
      setIsValidating(false)
    }
  }, [])

  // Complete enrollment validation
  const validateCompleteEnrollment = useCallback(async (
    enrollmentData: EnrollmentFormData
  ): Promise<{ isValid: boolean; errors: ValidationError[] }> => {
    setIsValidating(true)
    
    try {
      // Use React Hook Form validation (no Promise.race to avoid SSR issues)
      const isFormValid = await enrollmentForm.trigger()
      
      if (!isFormValid) {
        const formErrors = Object.entries(enrollmentForm.formState.errors).map(([field, error]) => ({
          field,
          message: error.message || 'Campo inválido',
          code: 'FORM_VALIDATION_ERROR'
        }))
        
        setCustomErrors(formErrors)
        return { isValid: false, errors: formErrors }
      }

      // Additional business logic validation
      const errors: ValidationError[] = []

      // Check if enrollment data is complete
      if (!enrollmentData.courseId) {
        errors.push({
          field: 'general',
          message: 'Dados de matrícula incompletos',
          code: 'INCOMPLETE_DATA'
        })
      }

      // Only require teacherId for scheduled courses
      if (enrollmentData.courseType === 'scheduled' && !enrollmentData.teacherId) {
        errors.push({
          field: 'teacherId',
          message: 'Professor é obrigatório para cursos agendados',
          code: 'TEACHER_REQUIRED'
        })
      }

      // Validate enrollment timing
      const now = new Date()
      const enrollmentSlots = enrollmentData.selectedSlots.map(slot => new Date(slot.date))
      const nearestSlot = Math.min(...enrollmentSlots.map(date => date.getTime()))
      const nearestSlotDate = new Date(nearestSlot)

      // Must have at least 24 hours notice
      const timeDiff = nearestSlotDate.getTime() - now.getTime()
      const hoursUntilClass = timeDiff / (1000 * 60 * 60)

      if (hoursUntilClass < 24) {
        errors.push({
          field: 'selectedSlots',
          message: 'Matrícula deve ser feita com pelo menos 24 horas de antecedência',
          code: 'INSUFFICIENT_NOTICE'
        })
      }

      setCustomErrors(errors)
      return { isValid: errors.length === 0, errors }
    } catch (error) {
      const validationError = { 
        field: 'general', 
        message: 'Erro na validação da matrícula',
        code: 'VALIDATION_ERROR'
      }
      setCustomErrors([validationError])
      return { isValid: false, errors: [validationError] }
    } finally {
      setIsValidating(false)
    }
  }, [enrollmentForm])

  // Clear validation errors
  const clearErrors = useCallback(() => {
    setCustomErrors([])
    enrollmentForm.clearErrors()
    teacherForm.clearErrors()
  }, [enrollmentForm, teacherForm])

  // Get all validation errors (form + custom)
  const allErrors = useMemo(() => {
    const formErrors = Object.entries(enrollmentForm.formState.errors).map(([field, error]) => ({
      field,
      message: error.message || 'Campo inválido',
      code: 'FORM_ERROR'
    }))

    const teacherErrors = Object.entries(teacherForm.formState.errors).map(([field, error]) => ({
      field: `teacher.${field}`,
      message: error.message || 'Campo inválido',
      code: 'TEACHER_FORM_ERROR'
    }))

    return [...formErrors, ...teacherErrors, ...customErrors]
  }, [enrollmentForm.formState.errors, teacherForm.formState.errors, customErrors])

  // Check if any validation is in progress
  const hasValidationErrors = allErrors.length > 0
  const isFormValid = !hasValidationErrors && !isValidating

  return {
    // Form instances
    enrollmentForm,
    teacherForm,
    
    // Validation functions
    validateTeacherSelection,
    validateTimeSlots,
    validateCompleteEnrollment,
    
    // State
    isValidating,
    allErrors,
    customErrors,
    hasValidationErrors,
    isFormValid,
    
    // Actions
    clearErrors,
    
    // Convenience getters
    enrollmentData: enrollmentForm.watch(),
    teacherData: teacherForm.watch()
  }
}

export default useEnrollmentValidation