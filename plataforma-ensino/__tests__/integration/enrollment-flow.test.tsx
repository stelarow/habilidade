/**
 * Integration tests for complete enrollment flow
 * Story 3.1: Teacher Enrollment Integration - Task 3
 * 
 * Tests the complete enrollment flow including teacher selection,
 * schedule selection, and enrollment confirmation with backward
 * compatibility for courses without teacher requirements.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams } from 'next/navigation'
import '@testing-library/jest-dom'

import EnrollmentPage from '@/app/enrollment/page'
import { Teacher } from '@/components/enrollment/TeacherSelector'
import { TimeSlot } from '@/components/enrollment/ConditionalCalendar'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))

// Mock enrollment validation hook
const mockValidationHook = {
  validateTeacherSelection: jest.fn().mockResolvedValue({ isValid: true, errors: [] }),
  validateTimeSlots: jest.fn().mockResolvedValue({ isValid: true, errors: [] }),
  validateCompleteEnrollment: jest.fn().mockResolvedValue({ isValid: true, errors: [] }),
  allErrors: [],
  hasValidationErrors: false,
  isValidating: false,
  clearErrors: jest.fn()
}

jest.mock('@/hooks/useEnrollmentValidation', () => ({
  useEnrollmentValidation: jest.fn(() => mockValidationHook)
}))

// Mock components with simplified implementations
jest.mock('@/components/enrollment/TeacherSelector', () => ({
  TeacherSelector: ({ onTeacherSelect, selectedCourse }: any) => (
    <div data-testid="teacher-selector">
      <h3>Teacher Selection for {selectedCourse?.title}</h3>
      <button
        onClick={() => onTeacherSelect({
          id: 'teacher-1',
          name: 'Professor João',
          email: 'joao@escola.com',
          subject: 'Programação',
          availability: [],
          rating: 4.8,
          profile_picture: null,
          bio: 'Professor experiente',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        })}
        data-testid="select-teacher-btn"
      >
        Selecionar Professor João
      </button>
    </div>
  )
}))

jest.mock('@/components/enrollment/ConditionalCalendar', () => ({
  ConditionalCalendar: ({ onSlotSelect, selectedSlots, teacherId }: any) => (
    <div data-testid="conditional-calendar">
      <h3>Calendar for Teacher {teacherId}</h3>
      <p>Selected slots: {selectedSlots.length}</p>
      <button
        onClick={() => onSlotSelect({
          date: new Date('2025-07-24'),
          startTime: '09:00',
          endTime: '11:00',
          isAvailable: true,
          currentCapacity: 5,
          maxCapacity: 10,
          slotId: 'slot-1',
          teacherId: teacherId
        })}
        data-testid="select-slot-btn"
      >
        Selecionar Horário 09:00-11:00
      </button>
    </div>
  )
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

describe('Enrollment Flow Integration', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn()
  }

  const mockSearchParams = {
    get: jest.fn((key: string) => {
      if (key === 'courseId') return null
      return null
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    
    // Reset validation hook mocks
    Object.keys(mockValidationHook).forEach(key => {
      if (typeof mockValidationHook[key as keyof typeof mockValidationHook] === 'function') {
        (mockValidationHook[key as keyof typeof mockValidationHook] as jest.Mock).mockClear()
      }
    })
    mockValidationHook.allErrors = []
    mockValidationHook.hasValidationErrors = false
    mockValidationHook.isValidating = false
  })

  describe('Complete Enrollment Flow with Teacher Selection', () => {
    it('completes full enrollment flow for course requiring teacher', async () => {
      const user = userEvent.setup()
      render(<EnrollmentPage />)

      // Step 1: Course Selection
      expect(screen.getByText('Selecione um Curso')).toBeInTheDocument()
      
      // Select a course that requires teacher selection
      const courseCard = screen.getByText('Programação Web Completa').closest('div')
      expect(courseCard).toBeInTheDocument()
      
      await user.click(courseCard!)

      await waitFor(() => {
        expect(screen.getByText('Escolha seu Professor')).toBeInTheDocument()
      })

      // Step 2: Teacher Selection
      expect(screen.getByTestId('teacher-selector')).toBeInTheDocument()
      
      await user.click(screen.getByTestId('select-teacher-btn'))

      await waitFor(() => {
        expect(mockValidationHook.validateTeacherSelection).toHaveBeenCalled()
      })

      // Navigate to schedule selection
      await user.click(screen.getByText('Próximo'))

      await waitFor(() => {
        expect(screen.getByText('Selecione os Horários')).toBeInTheDocument()
      })

      // Step 3: Schedule Selection
      expect(screen.getByTestId('conditional-calendar')).toBeInTheDocument()
      
      await user.click(screen.getByTestId('select-slot-btn'))

      await waitFor(() => {
        expect(mockValidationHook.validateTimeSlots).toHaveBeenCalled()
      })

      // Navigate to confirmation
      await user.click(screen.getByText('Próximo'))

      await waitFor(() => {
        expect(screen.getByText('Confirmar Matrícula')).toBeInTheDocument()
      })

      // Step 4: Confirmation
      expect(screen.getByText('Programação Web Completa')).toBeInTheDocument()
      expect(screen.getByText('Professor João')).toBeInTheDocument()
      
      // Complete enrollment
      await user.click(screen.getByText('Confirmar Matrícula'))

      await waitFor(() => {
        expect(mockValidationHook.validateCompleteEnrollment).toHaveBeenCalled()
      })

      // Should eventually show completion
      await waitFor(() => {
        expect(screen.getByText('Matrícula Confirmada!')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('allows navigation between steps', async () => {
      const user = userEvent.setup()
      render(<EnrollmentPage />)

      // Select course
      await user.click(screen.getByText('Programação Web Completa').closest('div')!)

      await waitFor(() => {
        expect(screen.getByText('Escolha seu Professor')).toBeInTheDocument()
      })

      // Select teacher
      await user.click(screen.getByTestId('select-teacher-btn'))
      await user.click(screen.getByText('Próximo'))

      await waitFor(() => {
        expect(screen.getByText('Selecione os Horários')).toBeInTheDocument()
      })

      // Go back to teacher selection
      await user.click(screen.getByText('Anterior'))

      await waitFor(() => {
        expect(screen.getByText('Escolha seu Professor')).toBeInTheDocument()
      })

      // Navigate forward again
      await user.click(screen.getByText('Próximo'))

      await waitFor(() => {
        expect(screen.getByText('Selecione os Horários')).toBeInTheDocument()
      })
    })
  })

  describe('Backward Compatibility - Courses Without Teacher Selection', () => {
    it('skips teacher selection for self-paced courses', async () => {
      const user = userEvent.setup()
      render(<EnrollmentPage />)

      // Select self-paced course
      await user.click(screen.getByText('Curso Online Autodirigido').closest('div')!)

      // Should skip directly to confirmation
      await waitFor(() => {
        expect(screen.getByText('Confirmar Matrícula')).toBeInTheDocument()
      })

      // Should show self-paced course information
      expect(screen.getByText('Curso Online Autodirigido')).toBeInTheDocument()
      expect(screen.getByText('Autodirigido')).toBeInTheDocument()
      expect(screen.getByText('Informações do Curso')).toBeInTheDocument()
    })

    it('skips teacher selection for courses without scheduling', async () => {
      const user = userEvent.setup()
      render(<EnrollmentPage />)

      // Select workshop course (no teacher selection, no self-paced)
      await user.click(screen.getByText('Workshop Básico').closest('div')!)

      // Should skip directly to confirmation
      await waitFor(() => {
        expect(screen.getByText('Confirmar Matrícula')).toBeInTheDocument()
      })

      // Should show no-schedule information
      expect(screen.getByText('Workshop Básico')).toBeInTheDocument()
      expect(screen.getByText('Sem agendamento específico')).toBeInTheDocument()
    })

    it('completes enrollment for self-paced course', async () => {
      const user = userEvent.setup()
      render(<EnrollmentPage />)

      // Select and complete self-paced course
      await user.click(screen.getByText('Curso Online Autodirigido').closest('div')!)

      await waitFor(() => {
        expect(screen.getByText('Confirmar Matrícula')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Confirmar Matrícula'))

      await waitFor(() => {
        expect(mockValidationHook.validateCompleteEnrollment).toHaveBeenCalledWith(
          expect.objectContaining({
            courseType: 'self_paced',
            teacherId: null,
            selectedSlots: []
          })
        )
      })
    })
  })

  describe('Step Indicator Functionality', () => {
    it('shows appropriate steps based on course type', async () => {
      const user = userEvent.setup()
      render(<EnrollmentPage />)

      // Select course requiring teacher
      await user.click(screen.getByText('Programação Web Completa').closest('div')!)

      await waitFor(() => {
        // Should show all steps for teacher-required course
        expect(screen.getByText('Professor')).toBeInTheDocument()
        expect(screen.getByText('Horários')).toBeInTheDocument()
        expect(screen.getByText('Confirmação')).toBeInTheDocument()
      })
    })

    it('allows step navigation via step indicator', async () => {
      const user = userEvent.setup()
      render(<EnrollmentPage />)

      // Complete teacher selection first
      await user.click(screen.getByText('Programação Web Completa').closest('div')!)
      await waitFor(() => screen.getByTestId('teacher-selector'))
      await user.click(screen.getByTestId('select-teacher-btn'))

      // Now try clicking on confirmation step
      const confirmationStep = screen.getByText('Confirmação').closest('button')
      
      // Should be accessible after teacher selection
      expect(confirmationStep).not.toBeDisabled()
    })
  })

  describe('Form Validation Integration', () => {
    it('prevents progression with validation errors', async () => {
      const user = userEvent.setup()
      
      // Mock validation failure
      mockValidationHook.hasValidationErrors = true
      mockValidationHook.allErrors = [
        { field: 'teacher', message: 'Professor é obrigatório', code: 'REQUIRED' }
      ]

      render(<EnrollmentPage />)

      await user.click(screen.getByText('Programação Web Completa').closest('div')!)

      await waitFor(() => {
        expect(screen.getByText('Escolha seu Professor')).toBeInTheDocument()
      })

      // Try to proceed without selecting teacher
      const nextButton = screen.getByText('Próximo')
      expect(nextButton).toBeDisabled()
    })

    it('displays validation errors', async () => {
      const user = userEvent.setup()
      
      // Mock validation with errors
      mockValidationHook.hasValidationErrors = true
      mockValidationHook.allErrors = [
        { field: 'teacher', message: 'Professor é obrigatório', code: 'REQUIRED' },
        { field: 'timeSlots', message: 'Selecione pelo menos um horário', code: 'REQUIRED' }
      ]

      render(<EnrollmentPage />)

      await user.click(screen.getByText('Programação Web Completa').closest('div')!)

      await waitFor(() => {
        expect(screen.getByText('Erros de validação')).toBeInTheDocument()
        expect(screen.getByText('• Professor é obrigatório')).toBeInTheDocument()
        expect(screen.getByText('• Selecione pelo menos um horário')).toBeInTheDocument()
      })
    })
  })

  describe('Form Reset and Cleanup', () => {
    it('resets form state when changing courses', async () => {
      const user = userEvent.setup()
      render(<EnrollmentPage />)

      // Select first course and teacher
      await user.click(screen.getByText('Programação Web Completa').closest('div')!)
      await waitFor(() => screen.getByTestId('teacher-selector'))
      await user.click(screen.getByTestId('select-teacher-btn'))

      // Go back and select different course
      await user.click(screen.getByText('Voltar'))
      await waitFor(() => screen.getByText('Selecione um Curso'))
      
      await user.click(screen.getByText('Design Gráfico Digital').closest('div')!)

      // Should be back at teacher selection with new course
      await waitFor(() => {
        expect(screen.getByText('Teacher Selection for Design Gráfico Digital')).toBeInTheDocument()
      })

      // Clear errors should have been called
      expect(mockValidationHook.clearErrors).toHaveBeenCalled()
    })

    it('clears validation errors when changing steps', async () => {
      const user = userEvent.setup()
      render(<EnrollmentPage />)

      await user.click(screen.getByText('Programação Web Completa').closest('div')!)
      await waitFor(() => screen.getByTestId('teacher-selector'))

      // Step navigation should clear errors
      expect(mockValidationHook.clearErrors).toHaveBeenCalled()
    })
  })

  describe('Course Type Indicators', () => {
    it('displays course type badges correctly', () => {
      render(<EnrollmentPage />)

      // Check for self-paced badge
      expect(screen.getByText('Autodirigido')).toBeInTheDocument()
      
      // Check for no-scheduling badge  
      expect(screen.getByText('Sem agendamento')).toBeInTheDocument()
    })
  })

  describe('Direct Course Access via URL', () => {
    it('handles direct course access via courseId parameter', async () => {
      // Mock courseId in search params
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'courseId') return 'course-123'
        return null
      })

      render(<EnrollmentPage />)

      // Should skip course selection and go directly to teacher selection
      await waitFor(() => {
        expect(screen.getByText('Escolha seu Professor')).toBeInTheDocument()
      })

      // Should show mock course data
      expect(screen.getByText('Curso de Programação Web')).toBeInTheDocument()
    })
  })
})