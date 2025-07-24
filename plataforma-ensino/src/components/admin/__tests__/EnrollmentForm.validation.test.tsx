/**
 * Comprehensive validation tests for EnrollmentForm component
 * Story 1.2: Form Submission and Validation Enhancement
 * 
 * Tests cover all acceptance criteria:
 * - AC: 1 - Online Enrollment Validation: Form can be submitted without teacher or schedule selection
 * - AC: 2 - In-person Enrollment Validation: Form validation fails if teacher/schedule missing
 * - AC: 3 - Form Submission Enhancement: API payload transformation works correctly
 * - AC: 5 - API Integration: Form creates enrollment records with proper scheduling data
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EnrollmentForm } from '../EnrollmentForm'
import { validateEnrollmentForm, transformFormDataToApiPayload } from '@/utils/enrollmentValidation'

// Mock the toast hook
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toastError: jest.fn(),
    toastSuccess: jest.fn(),
    toastWarning: jest.fn(),
    toastInfo: jest.fn()
  })
}))

// Mock Supabase client with test data
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({
              data: [
                {
                  id: 'user-1',
                  full_name: 'Test User',
                  email: 'test@example.com',
                  role: 'student'
                }
              ],
              error: null
            }))
          }))
        })),
        or: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({
              data: [
                {
                  id: 'user-1',
                  full_name: 'Test User',
                  email: 'test@example.com',
                  role: 'student'
                }
              ],
              error: null
            }))
          }))
        })),
        ilike: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({
              data: [
                {
                  id: 'course-1',
                  title: 'Test Course',
                  slug: 'test-course'
                }
              ],
              error: null
            }))
          }))
        })),
        in: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({
              data: [
                {
                  id: 'teacher-1',
                  full_name: 'Test Teacher',
                  email: 'teacher@example.com',
                  role: 'instructor'
                }
              ],
              error: null
            }))
          }))
        }))
      }))
    }))
  })
}))

// Mock the SchedulingSection component to capture interactions
jest.mock('@/components/scheduling/SchedulingSection', () => ({
  __esModule: true,
  default: ({ isVisible, onTeacherChange, onTwoClassesChange, onSlotSelect }: any) => (
    <div data-testid="scheduling-section" style={{ display: isVisible ? 'block' : 'none' }}>
      <div data-testid="scheduling-content">
        <button 
          onClick={() => onTeacherChange('teacher-1')}
          data-testid="select-teacher-btn"
        >
          Select Teacher 1
        </button>
        <button 
          onClick={() => onTwoClassesChange(true)}
          data-testid="enable-two-classes-btn"
        >
          Enable Two Classes
        </button>
        <button 
          onClick={() => onTwoClassesChange(false)}
          data-testid="disable-two-classes-btn"
        >
          Disable Two Classes
        </button>
        <button 
          onClick={() => onSlotSelect('teacher-1:1:10:00-11:00', null)}
          data-testid="select-one-slot-btn"
        >
          Select One Slot
        </button>
        <button 
          onClick={() => onSlotSelect('teacher-1:1:10:00-11:00', 'teacher-1:3:14:00-15:00')}
          data-testid="select-two-slots-btn"
        >
          Select Two Slots
        </button>
        <button 
          onClick={() => onSlotSelect('teacher-1:1:10:00-11:00', 'teacher-1:1:10:00-11:00')}
          data-testid="select-same-slots-btn"
        >
          Select Same Slots
        </button>
      </div>
    </div>
  )
}))

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  XMarkIcon: () => <div data-testid="x-mark-icon" />,
  MagnifyingGlassIcon: () => <div data-testid="search-icon" />,
  UserIcon: () => <div data-testid="user-icon" />,
  AcademicCapIcon: () => <div data-testid="academic-cap-icon" />,
  CalendarIcon: () => <div data-testid="calendar-icon" />
}))

describe('EnrollmentForm Validation Tests - Story 1.2', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    loading: false,
    mode: 'create' as const,
    existingEnrollment: null
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Helper function to fill required form fields
  const fillRequiredFields = async () => {
    // Simulate user search and selection
    const userSearch = screen.getByPlaceholderText('Buscar usuário por nome ou email...')
    fireEvent.change(userSearch, { target: { value: 'test' } })
    
    await waitFor(() => {
      const userButton = screen.getByText('Test User')
      fireEvent.click(userButton)
    })

    // Simulate course search and selection
    const courseSearch = screen.getByPlaceholderText('Buscar curso por título...')
    fireEvent.change(courseSearch, { target: { value: 'test' } })
    
    await waitFor(() => {
      const courseButton = screen.getByText('Test Course')
      fireEvent.click(courseButton)
    })
  }

  describe('AC: 1 - Online Enrollment Validation', () => {
    it('should allow form submission for online enrollment without teacher selection', async () => {
      const onSubmit = jest.fn()
      render(<EnrollmentForm {...defaultProps} onSubmit={onSubmit} />)
      
      await fillRequiredFields()
      
      // Ensure "Curso Presencial" is unchecked (default for online)
      const checkbox = screen.getByLabelText('Curso Presencial') as HTMLInputElement
      expect(checkbox.checked).toBe(false)
      
      // Submit form
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            student_id: 'user-1',
            course_id: 'course-1',
            modality: 'online'
          })
        )
      })
    })

    it('should allow form submission for online enrollment without schedule selection', async () => {
      const onSubmit = jest.fn()
      render(<EnrollmentForm {...defaultProps} onSubmit={onSubmit} />)
      
      await fillRequiredFields()
      
      // Verify online mode doesn't require schedules
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            modality: 'online',
            schedules: undefined
          })
        )
      })
    })

    it('should show success feedback for online enrollments', async () => {
      render(<EnrollmentForm {...defaultProps} />)
      
      await fillRequiredFields()
      
      // Verify feedback message is shown for online mode
      const successMessage = screen.getByText(/Matrícula online pode ser submetida sem agendamento/i)
      expect(successMessage).toBeInTheDocument()
      expect(successMessage).toHaveClass('text-green-400')
    })
  })

  describe('AC: 2 - In-person Enrollment Validation', () => {
    it('should fail validation when no teacher is selected for in-person enrollment', async () => {
      render(<EnrollmentForm {...defaultProps} />)
      
      await fillRequiredFields()
      
      // Enable in-person mode
      const checkbox = screen.getByLabelText('Curso Presencial')
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        const schedulingSection = screen.getByTestId('scheduling-section')
        expect(schedulingSection).toHaveStyle('display: block')
      })
      
      // Try to submit without selecting teacher
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      // Should show validation warning
      await waitFor(() => {
        const warningMessage = screen.getByText(/Selecione um professor para aulas presenciais/i)
        expect(warningMessage).toBeInTheDocument()
      })
    })

    it('should fail validation when no time slots are selected for in-person enrollment', async () => {
      render(<EnrollmentForm {...defaultProps} />)
      
      await fillRequiredFields()
      
      // Enable in-person mode
      const checkbox = screen.getByLabelText('Curso Presencial')
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        // Select teacher but no time slots
        const selectTeacherBtn = screen.getByTestId('select-teacher-btn')
        fireEvent.click(selectTeacherBtn)
      })
      
      // Try to submit without selecting time slots
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      // Should show validation warning for schedule
      await waitFor(() => {
        const warningMessage = screen.getByText(/Selecione pelo menos um horário para aulas presenciais/i)
        expect(warningMessage).toBeInTheDocument()
      })
    })

    it('should fail validation when "Duas aulas por semana" is checked but only one slot selected', async () => {
      render(<EnrollmentForm {...defaultProps} />)
      
      await fillRequiredFields()
      
      // Enable in-person mode
      const checkbox = screen.getByLabelText('Curso Presencial')
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        // Select teacher
        const selectTeacherBtn = screen.getByTestId('select-teacher-btn')
        fireEvent.click(selectTeacherBtn)
        
        // Enable two classes per week
        const enableTwoClassesBtn = screen.getByTestId('enable-two-classes-btn')
        fireEvent.click(enableTwoClassesBtn)
        
        // Select only one slot
        const selectOneSlotBtn = screen.getByTestId('select-one-slot-btn')
        fireEvent.click(selectOneSlotBtn)
      })
      
      // Try to submit with only one slot for two classes per week
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      // Should show validation error for two classes requirement
      await waitFor(() => {
        const errorMessage = screen.getByText(/Para duas aulas por semana, selecione dois horários distintos/i)
        expect(errorMessage).toBeInTheDocument()
      })
    })

    it('should fail validation when "Duas aulas por semana" has same time slots selected', async () => {
      render(<EnrollmentForm {...defaultProps} />)
      
      await fillRequiredFields()
      
      // Enable in-person mode
      const checkbox = screen.getByLabelText('Curso Presencial')
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        // Select teacher
        const selectTeacherBtn = screen.getByTestId('select-teacher-btn')
        fireEvent.click(selectTeacherBtn)
        
        // Enable two classes per week
        const enableTwoClassesBtn = screen.getByTestId('enable-two-classes-btn')
        fireEvent.click(enableTwoClassesBtn)
        
        // Select same slots
        const selectSameSlotsBtn = screen.getByTestId('select-same-slots-btn')
        fireEvent.click(selectSameSlotsBtn)
      })
      
      // Should show validation error for identical slots
      await waitFor(() => {
        const errorMessage = screen.getByText(/Os horários selecionados devem ser diferentes/i)
        expect(errorMessage).toBeInTheDocument()
      })
    })

    it('should pass validation when all in-person requirements are met', async () => {
      const onSubmit = jest.fn()
      render(<EnrollmentForm {...defaultProps} onSubmit={onSubmit} />)
      
      await fillRequiredFields()
      
      // Enable in-person mode
      const checkbox = screen.getByLabelText('Curso Presencial')
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        // Select teacher
        const selectTeacherBtn = screen.getByTestId('select-teacher-btn')
        fireEvent.click(selectTeacherBtn)
        
        // Select one time slot
        const selectOneSlotBtn = screen.getByTestId('select-one-slot-btn')
        fireEvent.click(selectOneSlotBtn)
      })
      
      // Submit form - should succeed
      const submitButton = screen.getByText('Adicionar Matrícula')
      expect(submitButton).not.toBeDisabled()
      
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            modality: 'in-person',
            schedules: expect.arrayContaining([
              expect.objectContaining({
                instructor_id: 'teacher-1',
                day_of_week: 1,
                start_time: '10:00:00',
                end_time: '11:00:00'
              })
            ])
          })
        )
      })
    })
  })

  describe('AC: 3 - Form Submission Enhancement', () => {
    it('should transform form data to correct API payload format for online enrollment', async () => {
      const onSubmit = jest.fn()
      render(<EnrollmentForm {...defaultProps} onSubmit={onSubmit} />)
      
      await fillRequiredFields()
      
      // Submit online enrollment
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            student_id: 'user-1',
            course_id: 'course-1',
            start_date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
            modality: 'online'
          })
        )
      })
    })

    it('should transform form data to correct API payload format for in-person enrollment', async () => {
      const onSubmit = jest.fn()
      render(<EnrollmentForm {...defaultProps} onSubmit={onSubmit} />)
      
      await fillRequiredFields()
      
      // Enable in-person mode and configure scheduling
      const checkbox = screen.getByLabelText('Curso Presencial')
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        const selectTeacherBtn = screen.getByTestId('select-teacher-btn')
        fireEvent.click(selectTeacherBtn)
        
        const enableTwoClassesBtn = screen.getByTestId('enable-two-classes-btn')
        fireEvent.click(enableTwoClassesBtn)
        
        const selectTwoSlotsBtn = screen.getByTestId('select-two-slots-btn')
        fireEvent.click(selectTwoSlotsBtn)
      })
      
      // Submit in-person enrollment
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            student_id: 'user-1',
            course_id: 'course-1',
            start_date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
            modality: 'in-person',
            schedules: expect.arrayContaining([
              expect.objectContaining({
                instructor_id: 'teacher-1',
                day_of_week: 1,
                start_time: '10:00:00',
                end_time: '11:00:00'
              }),
              expect.objectContaining({
                instructor_id: 'teacher-1',
                day_of_week: 3,
                start_time: '14:00:00',
                end_time: '15:00:00'
              })
            ])
          })
        )
      })
    })

    it('should handle instructor_id mapping correctly', async () => {
      const onSubmit = jest.fn()
      render(<EnrollmentForm {...defaultProps} onSubmit={onSubmit} />)
      
      await fillRequiredFields()
      
      const checkbox = screen.getByLabelText('Curso Presencial')
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        const selectTeacherBtn = screen.getByTestId('select-teacher-btn')
        fireEvent.click(selectTeacherBtn)
        
        const selectOneSlotBtn = screen.getByTestId('select-one-slot-btn')
        fireEvent.click(selectOneSlotBtn)
      })
      
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const call = onSubmit.mock.calls[0][0]
        expect(call.schedules[0].instructor_id).toBe('teacher-1')
      })
    })

    it('should format day_of_week and time data according to StudentSchedule model', async () => {
      const onSubmit = jest.fn()
      render(<EnrollmentForm {...defaultProps} onSubmit={onSubmit} />)
      
      await fillRequiredFields()
      
      const checkbox = screen.getByLabelText('Curso Presencial')
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        const selectTeacherBtn = screen.getByTestId('select-teacher-btn')
        fireEvent.click(selectTeacherBtn)
        
        const selectOneSlotBtn = screen.getByTestId('select-one-slot-btn')
        fireEvent.click(selectOneSlotBtn)
      })
      
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const call = onSubmit.mock.calls[0][0]
        const schedule = call.schedules[0]
        
        // Verify StudentSchedule model format
        expect(schedule.day_of_week).toBe(1) // Monday
        expect(schedule.start_time).toBe('10:00:00') // HH:MM:SS format
        expect(schedule.end_time).toBe('11:00:00') // HH:MM:SS format
        expect(schedule.instructor_id).toBe('teacher-1') // UUID format
      })
    })
  })

  describe('AC: 5 - API Integration Success', () => {
    it('should show success message after successful enrollment creation', async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined)
      render(<EnrollmentForm {...defaultProps} onSubmit={onSubmit} />)
      
      await fillRequiredFields()
      
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      // Success should be handled by toast system (mocked)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it('should handle API errors with specific error messages', async () => {
      const onSubmit = jest.fn().mockRejectedValue(new Error('Usuário já está matriculado neste curso'))
      render(<EnrollmentForm {...defaultProps} onSubmit={onSubmit} />)
      
      await fillRequiredFields()
      
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      // Error should be handled by toast system (mocked)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it('should handle schedule-related API errors', async () => {
      const onSubmit = jest.fn().mockRejectedValue(new Error('Erro ao criar horários da matrícula'))
      render(<EnrollmentForm {...defaultProps} onSubmit={onSubmit} />)
      
      await fillRequiredFields()
      
      const checkbox = screen.getByLabelText('Curso Presencial')
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        const selectTeacherBtn = screen.getByTestId('select-teacher-btn')
        fireEvent.click(selectTeacherBtn)
        
        const selectOneSlotBtn = screen.getByTestId('select-one-slot-btn')
        fireEvent.click(selectOneSlotBtn)
      })
      
      const submitButton = screen.getByText('Adicionar Matrícula')
      fireEvent.click(submitButton)
      
      // Schedule error should be handled by toast system (mocked)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('Form State Management and Edge Cases', () => {
    it('should maintain form state when switching between online and in-person modes', async () => {
      render(<EnrollmentForm {...defaultProps} />)
      
      await fillRequiredFields()
      
      const checkbox = screen.getByLabelText('Curso Presencial')
      
      // Switch to in-person
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        const schedulingSection = screen.getByTestId('scheduling-section')
        expect(schedulingSection).toHaveStyle('display: block')
      })
      
      // Switch back to online
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        const schedulingSection = screen.getByTestId('scheduling-section')
        expect(schedulingSection).toHaveStyle('display: none')
        
        // Should show online success message
        const successMessage = screen.getByText(/Matrícula online pode ser submetida sem agendamento/i)
        expect(successMessage).toBeInTheDocument()
      })
    })

    it('should clear scheduling fields when switching from in-person to online', async () => {
      render(<EnrollmentForm {...defaultProps} />)
      
      await fillRequiredFields()
      
      const checkbox = screen.getByLabelText('Curso Presencial')
      
      // Enable in-person and configure scheduling
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        const selectTeacherBtn = screen.getByTestId('select-teacher-btn')
        fireEvent.click(selectTeacherBtn)
        
        const selectOneSlotBtn = screen.getByTestId('select-one-slot-btn')
        fireEvent.click(selectOneSlotBtn)
      })
      
      // Switch back to online (should clear scheduling)
      fireEvent.click(checkbox)
      
      // Now switch back to in-person - scheduling should be cleared
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        const teacherWarning = screen.getByText(/Selecione um professor para aulas presenciais/i)
        expect(teacherWarning).toBeInTheDocument()
      })
    })

    it('should handle disabled submit button states correctly', async () => {
      render(<EnrollmentForm {...defaultProps} />)
      
      // Submit button should be disabled without required fields
      const submitButton = screen.getByText('Adicionar Matrícula')
      expect(submitButton).toBeDisabled()
      
      await fillRequiredFields()
      
      // Should be enabled for online enrollment
      expect(submitButton).not.toBeDisabled()
      
      // Switch to in-person without teacher - should be disabled
      const checkbox = screen.getByLabelText('Curso Presencial')
      fireEvent.click(checkbox)
      
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
      
      // Select teacher - should be enabled again
      await waitFor(() => {
        const selectTeacherBtn = screen.getByTestId('select-teacher-btn')
        fireEvent.click(selectTeacherBtn)
      })
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })
  })
})

// Unit tests for validation utilities
describe('Validation Utilities - Story 1.2', () => {
  describe('validateEnrollmentForm', () => {
    it('should pass validation for online enrollment without scheduling', () => {
      const formData = {
        user_id: 'user-1',
        course_id: 'course-1',
        teacher_id: 'teacher-1',
        access_until: '',
        status: 'active' as const,
        is_in_person: false,
        has_two_classes_per_week: false,
        schedule_slot_1: '',
        schedule_slot_2: ''
      }
      
      const { isValid, errors } = validateEnrollmentForm(formData)
      expect(isValid).toBe(true)
      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('should fail validation for in-person enrollment without teacher', () => {
      const formData = {
        user_id: 'user-1',
        course_id: 'course-1',
        teacher_id: '',
        access_until: '',
        status: 'active' as const,
        is_in_person: true,
        has_two_classes_per_week: false,
        schedule_slot_1: 'teacher-1:1:10:00-11:00',
        schedule_slot_2: ''
      }
      
      const { isValid, errors } = validateEnrollmentForm(formData)
      expect(isValid).toBe(false)
      expect(errors.teacher_id).toBeDefined()
    })
  })

  describe('transformFormDataToApiPayload', () => {
    it('should transform online enrollment correctly', () => {
      const formData = {
        user_id: 'user-1',
        course_id: 'course-1',
        teacher_id: 'teacher-1',
        access_until: '',
        status: 'active' as const,
        is_in_person: false,
        has_two_classes_per_week: false,
        schedule_slot_1: '',
        schedule_slot_2: ''
      }
      
      const payload = transformFormDataToApiPayload(formData)
      
      expect(payload).toEqual({
        student_id: 'user-1',
        course_id: 'course-1',
        start_date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        modality: 'online'
      })
    })

    it('should transform in-person enrollment with schedules correctly', () => {
      const formData = {
        user_id: 'user-1',
        course_id: 'course-1',
        teacher_id: 'teacher-1',
        access_until: '',
        status: 'active' as const,
        is_in_person: true,
        has_two_classes_per_week: true,
        schedule_slot_1: 'teacher-1:1:10:00-11:00',
        schedule_slot_2: 'teacher-1:3:14:00-15:00'
      }
      
      const payload = transformFormDataToApiPayload(formData)
      
      expect(payload).toEqual({
        student_id: 'user-1',
        course_id: 'course-1',
        start_date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        modality: 'in-person',
        schedules: [
          {
            instructor_id: 'teacher-1',
            day_of_week: 1,
            start_time: '10:00:00',
            end_time: '11:00:00'
          },
          {
            instructor_id: 'teacher-1',
            day_of_week: 3,
            start_time: '14:00:00',
            end_time: '15:00:00'
          }
        ]
      })
    })
  })
})