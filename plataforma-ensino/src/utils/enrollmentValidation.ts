// Enrollment validation utilities for Story 1.2: Form Submission and Validation Enhancement

import { z } from 'zod'
import type { EnhancedEnrollmentFormData, EnrollmentValidationErrors, ScheduleSlot } from '@/types/enrollment'

// Base validation schema for all enrollments
const baseEnrollmentSchema = z.object({
  user_id: z.string().min(1, { message: 'Usuário é obrigatório' }),
  course_id: z.string().min(1, { message: 'Curso é obrigatório' }),
  teacher_id: z.string().min(1, { message: 'Professor é obrigatório' }),
  access_until: z.string().optional()
    .refine((date) => {
      if (!date) return true
      return new Date(date) > new Date()
    }, { message: 'Data de acesso deve ser futura' }),
  status: z.enum(['active', 'completed', 'cancelled', 'expired']),
  is_in_person: z.boolean()
})

// Online enrollment schema (AC: 1) - No scheduling fields required
const onlineEnrollmentSchema = baseEnrollmentSchema.extend({
  is_in_person: z.literal(false),
  has_two_classes_per_week: z.boolean().optional(),
  schedule_slot_1: z.string().optional(),
  schedule_slot_2: z.string().optional()
})

// In-person enrollment schema (AC: 2) - Scheduling fields required
const inPersonEnrollmentSchema = baseEnrollmentSchema.extend({
  is_in_person: z.literal(true),
  has_two_classes_per_week: z.boolean(),
  schedule_slot_1: z.string().min(1, { 
    message: 'Primeiro horário é obrigatório para aulas presenciais' 
  }),
  schedule_slot_2: z.string().optional()
}).refine((data) => {
  // AC: 2.3 - For "Duas aulas por semana" checkbox checked: exactly two distinct time slots are required
  if (data.has_two_classes_per_week) {
    if (!data.schedule_slot_2) {
      return false
    }
    if (data.schedule_slot_1 === data.schedule_slot_2) {
      return false
    }
  }
  return true
}, {
  message: 'Para duas aulas por semana, é necessário selecionar dois horários distintos',
  path: ['schedule_slot_2']
})

// Conditional validation schema that switches based on is_in_person
export const enrollmentFormSchema = z.discriminatedUnion('is_in_person', [
  onlineEnrollmentSchema,
  inPersonEnrollmentSchema
])

// Validation function for form data
export function validateEnrollmentForm(
  formData: EnhancedEnrollmentFormData
): { isValid: boolean; errors: EnrollmentValidationErrors } {
  try {
    enrollmentFormSchema.parse(formData)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: EnrollmentValidationErrors = {}
      
      error.errors.forEach((err) => {
        const path = err.path[0] as keyof EnrollmentValidationErrors
        errors[path] = err.message
      })
      
      return { isValid: false, errors }
    }
    return { isValid: false, errors: { scheduling: 'Erro de validação desconhecido' } }
  }
}

// Helper function to parse schedule slot format (AC: 3)
export function parseScheduleSlot(slotString: string): ScheduleSlot | null {
  try {
    // Expected format: "teacherId:day:HH:MM-HH:MM"
    const parts = slotString.split(':')
    if (parts.length !== 4) return null
    
    const [teacherId, dayStr, timeRange] = parts
    const day = parseInt(dayStr)
    
    if (isNaN(day) || day < 1 || day > 7) return null
    
    return {
      day,
      time: timeRange,
      teacherId
    }
  } catch {
    return null
  }
}

// Transform form data to API payload format (AC: 3)
export function transformFormDataToApiPayload(
  formData: EnhancedEnrollmentFormData
): {
  student_id: string
  course_id: string
  start_date: string
  modality: 'online' | 'in-person'
  schedules?: {
    instructor_id: string
    day_of_week: number
    start_time: string
    end_time: string
  }[]
} {
  const payload = {
    student_id: formData.user_id,
    course_id: formData.course_id,
    start_date: new Date().toISOString().split('T')[0],
    modality: formData.is_in_person ? 'in-person' as const : 'online' as const
  }

  // Add schedules for in-person enrollments
  if (formData.is_in_person && formData.schedule_slot_1) {
    const schedules = []
    
    // Parse first schedule slot
    const slot1 = parseScheduleSlot(formData.schedule_slot_1)
    if (slot1) {
      const [startTime, endTime] = slot1.time.split('-')
      schedules.push({
        instructor_id: slot1.teacherId,
        day_of_week: slot1.day,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`
      })
    }
    
    // Parse second schedule slot if exists
    if (formData.schedule_slot_2) {
      const slot2 = parseScheduleSlot(formData.schedule_slot_2)
      if (slot2) {
        const [startTime, endTime] = slot2.time.split('-')
        schedules.push({
          instructor_id: slot2.teacherId,
          day_of_week: slot2.day,
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`
        })
      }
    }
    
    return { ...payload, schedules }
  }
  
  return payload
}

// Validation messages for UI display (AC: 4)
export const validationMessages = {
  teacher_required: 'Selecione um professor para aulas presenciais',
  schedule_required: 'Selecione pelo menos um horário para aulas presenciais',
  two_schedules_required: 'Para duas aulas por semana, selecione dois horários distintos',
  schedules_must_differ: 'Os horários selecionados devem ser diferentes',
  online_validation_passed: 'Matrícula online pode ser submetida sem agendamento'
}