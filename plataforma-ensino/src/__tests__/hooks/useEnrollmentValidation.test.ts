/**
 * Enrollment Validation Hook Unit Tests
 * Story 3.1: Teacher Enrollment Integration - Task 1
 * 
 * Test suite for useEnrollmentValidation hook covering:
 * - Teacher selection validation
 * - Time slot validation
 * - Complete enrollment validation
 * - Form state management
 * - Error handling and reporting
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useEnrollmentValidation } from '@/hooks/useEnrollmentValidation'
import { Teacher } from '@/components/enrollment/TeacherSelector'
import { TimeSlot } from '@/components/enrollment/ConditionalCalendar'

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    trigger: jest.fn(),
    watch: jest.fn(() => ({})),
    clearErrors: jest.fn(),
    formState: { errors: {} }
  }))
}))

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn()
}))

describe('useEnrollmentValidation Hook', () => {
  const mockTeacher: Teacher = {
    id: 'teacher-1',
    name: 'Professor João Silva',
    bio: 'Especialista em programação',
    rating: 4.8,
    specialties: ['JavaScript', 'React'],
    availability: [
      {
        id: 'avail-1',
        teacher_id: 'teacher-1',
        day_of_week: 1,
        start_time: '09:00',
        end_time: '11:00',
        max_students: 15,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ],
    maxStudentsPerClass: 15,
    isActive: true,
    email: 'joao@escola.com',
    experience_years: 10,
    qualifications: ['Bacharel em Ciência da Computação']
  }

  const mockTimeSlots: TimeSlot[] = [
    {
      date: new Date('2025-02-01'),
      startTime: '09:00',
      endTime: '11:00',
      isAvailable: true,
      currentCapacity: 5,
      maxCapacity: 15,
      slotId: 'slot-1',
      teacherId: 'teacher-1'
    },
    {
      date: new Date('2025-02-03'),
      startTime: '09:00',
      endTime: '11:00',
      isAvailable: true,
      currentCapacity: 3,
      maxCapacity: 15,
      slotId: 'slot-2',
      teacherId: 'teacher-1'
    }
  ]

  const mockEnrollmentData = {
    courseId: 'course-1',
    teacherId: 'teacher-1',
    selectedSlots: [
      {
        slotId: 'slot-1',
        date: '2025-02-01',
        startTime: '09:00',
        endTime: '11:00'
      },
      {
        slotId: 'slot-2',
        date: '2025-02-03',
        startTime: '09:00',
        endTime: '11:00'
      }
    ],
    totalHours: 4,
    notes: 'Test enrollment'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Hook Initialization', () => {
    test('initializes with default options', () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      expect(result.current.isValidating).toBe(false)
      expect(result.current.allErrors).toEqual([])
      expect(result.current.hasValidationErrors).toBe(false)
      expect(result.current.isFormValid).toBe(true)
    })

    test('initializes with custom options', () => {
      const options = {
        enableRealtimeValidation: false,
        validateOnBlur: false,
        validateOnChange: true
      }
      
      const { result } = renderHook(() => useEnrollmentValidation(options))
      
      expect(result.current).toBeDefined()
      expect(typeof result.current.validateTeacherSelection).toBe('function')
      expect(typeof result.current.validateTimeSlots).toBe('function')
      expect(typeof result.current.validateCompleteEnrollment).toBe('function')
    })
  })

  describe('Teacher Selection Validation', () => {
    test('validates successful teacher selection', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTeacherSelection(mockTeacher)
      })
      
      expect(validationResult.isValid).toBe(true)
      expect(validationResult.errors).toEqual([])
    })

    test('validates teacher with missing ID', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      const invalidTeacher = { ...mockTeacher, id: '' }
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTeacherSelection(invalidTeacher)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toEqual([
        {
          field: 'teacherId',
          message: 'Professor deve ser selecionado'
        }
      ])
    })

    test('validates inactive teacher', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      const inactiveTeacher = { ...mockTeacher, isActive: false }
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTeacherSelection(inactiveTeacher)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toEqual([
        {
          field: 'teacherId',
          message: 'Professor selecionado não está ativo'
        }
      ])
    })

    test('validates teacher without availability', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      const teacherNoAvailability = { ...mockTeacher, availability: [] }
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTeacherSelection(teacherNoAvailability)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toEqual([
        {
          field: 'teacherId',
          message: 'Professor selecionado não possui horários disponíveis',
          code: 'NO_AVAILABILITY'
        }
      ])
    })

    test('handles validation errors gracefully', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      // Pass invalid teacher object to trigger error
      const invalidTeacher = null as any
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTeacherSelection(invalidTeacher)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toEqual([
        {
          field: 'general',
          message: 'Erro na validação do professor',
          code: 'VALIDATION_ERROR'
        }
      ])
    })
  })

  describe('Time Slots Validation', () => {
    const courseRequirements = {
      totalHours: 4,
      sessionDuration: 120
    }

    test('validates successful time slot selection', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTimeSlots(mockTimeSlots, courseRequirements)
      })
      
      expect(validationResult.isValid).toBe(true)
      expect(validationResult.errors).toEqual([])
    })

    test('validates empty slot selection', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTimeSlots([], courseRequirements)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toEqual([
        {
          field: 'selectedSlots',
          message: 'Pelo menos um horário deve ser selecionado'
        }
      ])
    })

    test('validates unavailable slots', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      const unavailableSlots = [
        { ...mockTimeSlots[0], isAvailable: false }
      ]
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTimeSlots(unavailableSlots, courseRequirements)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toContainEqual({
        field: 'selectedSlots[0]',
        message: 'Horário 09:00-11:00 não está disponível',
        code: 'SLOT_UNAVAILABLE'
      })
    })

    test('validates capacity exceeded', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      const fullSlots = [
        { ...mockTimeSlots[0], currentCapacity: 15, maxCapacity: 15 }
      ]
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTimeSlots(fullSlots, courseRequirements)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toContainEqual({
        field: 'selectedSlots[0]',
        message: 'Horário 09:00-11:00 está lotado',
        code: 'CAPACITY_EXCEEDED'
      })
    })

    test('validates slot conflicts', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      const conflictedSlots = [
        { ...mockTimeSlots[0], conflictReason: 'Holiday conflict' }
      ]
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTimeSlots(conflictedSlots, courseRequirements)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toContainEqual({
        field: 'selectedSlots[0]',
        message: 'Conflito: Holiday conflict',
        code: 'SLOT_CONFLICT'
      })
    })

    test('validates insufficient hours', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      const shortSlots = [mockTimeSlots[0]] // Only 2 hours, need 4
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTimeSlots(shortSlots, courseRequirements)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toContainEqual({
        field: 'selectedSlots',
        message: 'Selecione pelo menos 3.2h de aulas (2.0h/4h)',
        code: 'INSUFFICIENT_HOURS'
      })
    })

    test('validates time overlaps on same day', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      const overlappingSlots = [
        mockTimeSlots[0],
        {
          ...mockTimeSlots[0],
          slotId: 'slot-3',
          startTime: '10:00',
          endTime: '12:00'
        }
      ]
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateTimeSlots(overlappingSlots, courseRequirements)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toContainEqual(
        expect.objectContaining({
          field: 'selectedSlots',
          code: 'TIME_OVERLAP'
        })
      )
    })
  })

  describe('Complete Enrollment Validation', () => {
    test('validates successful complete enrollment', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      // Mock form trigger to return true
      result.current.enrollmentForm.trigger = jest.fn().mockResolvedValue(true)
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateCompleteEnrollment(mockEnrollmentData)
      })
      
      expect(validationResult.isValid).toBe(true)
      expect(validationResult.errors).toEqual([])
    })

    test('validates incomplete enrollment data', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      result.current.enrollmentForm.trigger = jest.fn().mockResolvedValue(true)
      
      const incompleteData = { ...mockEnrollmentData, courseId: '', teacherId: '' }
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateCompleteEnrollment(incompleteData)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toContainEqual({
        field: 'general',
        message: 'Dados de matrícula incompletos',
        code: 'INCOMPLETE_DATA'
      })
    })

    test('validates insufficient notice time', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      result.current.enrollmentForm.trigger = jest.fn().mockResolvedValue(true)
      
      // Set enrollment for tomorrow (less than 24 hours)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const shortNoticeData = {
        ...mockEnrollmentData,
        selectedSlots: [
          {
            slotId: 'slot-1',
            date: tomorrow.toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '11:00'
          }
        ]
      }
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateCompleteEnrollment(shortNoticeData)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toContainEqual({
        field: 'selectedSlots',
        message: 'Matrícula deve ser feita com pelo menos 24 horas de antecedência',
        code: 'INSUFFICIENT_NOTICE'
      })
    })

    test('handles form validation errors', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      // Mock form trigger to return false
      result.current.enrollmentForm.trigger = jest.fn().mockResolvedValue(false)
      result.current.enrollmentForm.formState = {
        errors: {
          courseId: { message: 'Course is required' },
          teacherId: { message: 'Teacher is required' }
        }
      }
      
      let validationResult: any
      await act(async () => {
        validationResult = await result.current.validateCompleteEnrollment(mockEnrollmentData)
      })
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors).toEqual([
        {
          field: 'courseId',
          message: 'Course is required',
          code: 'FORM_VALIDATION_ERROR'
        },
        {
          field: 'teacherId',
          message: 'Teacher is required',
          code: 'FORM_VALIDATION_ERROR'
        }
      ])
    })
  })

  describe('Error Management', () => {
    test('clears errors correctly', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      // First create some errors
      await act(async () => {
        await result.current.validateTeacherSelection({ ...mockTeacher, id: '' })
      })
      
      expect(result.current.allErrors.length).toBeGreaterThan(0)
      
      // Clear errors
      act(() => {
        result.current.clearErrors()
      })
      
      expect(result.current.allErrors).toEqual([])
      expect(result.current.hasValidationErrors).toBe(false)
    })

    test('aggregates all error types', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      // Mock form errors
      result.current.enrollmentForm.formState.errors = {
        courseId: { message: 'Course required' }
      }
      result.current.teacherForm.formState.errors = {
        teacherId: { message: 'Teacher required' }
      }
      
      // Create custom errors
      await act(async () => {
        await result.current.validateTeacherSelection({ ...mockTeacher, id: '' })
      })
      
      expect(result.current.allErrors.length).toBeGreaterThan(2)
      expect(result.current.hasValidationErrors).toBe(true)
      expect(result.current.isFormValid).toBe(false)
    })
  })

  describe('Validation States', () => {
    test('tracks validation in progress', async () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      // Start validation
      const validationPromise = act(async () => {
        return result.current.validateTeacherSelection(mockTeacher)
      })
      
      // Should be validating
      expect(result.current.isValidating).toBe(true)
      
      // Wait for completion
      await validationPromise
      
      // Should not be validating anymore
      expect(result.current.isValidating).toBe(false)
    })

    test('provides form data watchers', () => {
      const { result } = renderHook(() => useEnrollmentValidation())
      
      expect(result.current.enrollmentData).toBeDefined()
      expect(result.current.teacherData).toBeDefined()
    })
  })
})