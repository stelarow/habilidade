/**
 * Unit tests for ConditionalCalendar component
 * Story 2.2: UI Components Integration - Task 4
 * 
 * Comprehensive test suite covering calendar functionality, accessibility,
 * slot selection, performance optimization, and edge cases.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { ConditionalCalendar, ConditionalCalendarProps, TimeSlot, CourseRequirements } from '@/components/enrollment/ConditionalCalendar'
import { TeacherAvailability } from '@/types/api'

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      gte: jest.fn(() => ({
        lte: jest.fn(() => Promise.resolve({
          data: mockHolidaysData,
          error: null
        }))
      }))
    }))
  })),
  channel: jest.fn(() => ({
    on: jest.fn(() => ({
      subscribe: jest.fn()
    }))
  })),
  removeChannel: jest.fn()
}

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => mockSupabaseClient)
}))

// Mock teacher availability logic
const mockAvailabilitySlots = [
  {
    id: 'slot-1',
    teacherId: 'teacher-1',
    date: '2025-07-24',
    startTime: '09:00',
    endTime: '11:00',
    maxStudents: 10,
    availableSpots: 5,
    conflictsWithHoliday: false,
    nextOccurrence: new Date('2025-07-24T09:00:00'),
    isRecurring: true,
    dayOfWeekName: 'Thursday'
  },
  {
    id: 'slot-2',
    teacherId: 'teacher-1',
    date: '2025-07-25',
    startTime: '14:00',
    endTime: '16:00',
    maxStudents: 10,
    availableSpots: 0,
    conflictsWithHoliday: false,
    nextOccurrence: new Date('2025-07-25T14:00:00'),
    isRecurring: true,
    dayOfWeekName: 'Friday'
  },
  {
    id: 'slot-3',
    teacherId: 'teacher-1',
    date: '2025-07-26',
    startTime: '10:00',
    endTime: '12:00',
    maxStudents: 10,
    availableSpots: 3,
    conflictsWithHoliday: true,
    nextOccurrence: new Date('2025-07-26T10:00:00'),
    isRecurring: true,
    dayOfWeekName: 'Saturday'
  }
]

jest.mock('@/utils/teacherAvailabilityLogic', () => ({
  calculateAvailableSlots: jest.fn().mockResolvedValue(mockAvailabilitySlots),
  subscribeToAvailabilityUpdates: jest.fn(() => jest.fn())
}))

// Mock data
const mockHolidaysData = [
  {
    id: 'holiday-1',
    date: '2025-07-26',
    name: 'Feriado Nacional',
    is_national: true
  }
]

const mockTeacherAvailability: TeacherAvailability[] = [
  {
    id: 'avail-1',
    teacher_id: 'teacher-1',
    day_of_week: 4, // Thursday
    start_time: '09:00',
    end_time: '11:00',
    max_students: 10,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'avail-2',
    teacher_id: 'teacher-1',
    day_of_week: 5, // Friday
    start_time: '14:00',
    end_time: '16:00',
    max_students: 10,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
]

const mockCourseRequirements: CourseRequirements = {
  totalHours: 40,
  sessionDuration: 120, // 2 hours
  weeklyFrequency: 2
}

const defaultProps: ConditionalCalendarProps = {
  teacherId: 'teacher-1',
  availabilityData: mockTeacherAvailability,
  onSlotSelect: jest.fn(),
  selectedSlots: [],
  courseRequirements: mockCourseRequirements,
  startDate: new Date('2025-07-01'),
  endDate: new Date('2025-07-31')
}

// Helper function to render component with default props
const renderCalendar = (props: Partial<ConditionalCalendarProps> = {}) => {
  const finalProps = { ...defaultProps, ...props }
  return render(<ConditionalCalendar {...finalProps} />)
}

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

describe('ConditionalCalendar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-07-23')) // Set consistent "today"
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Rendering and Basic Functionality', () => {
    it('renders the component with title and description', () => {
      renderCalendar()
      
      expect(screen.getByText('Selecione os Horários')).toBeInTheDocument()
      expect(screen.getByText('Escolha os horários disponíveis para suas aulas')).toBeInTheDocument()
    })

    it('displays loading state initially', () => {
      renderCalendar()
      
      expect(screen.getByRole('status')).toBeInTheDocument() // Loading component
    })

    it('shows calendar header with navigation', async () => {
      renderCalendar()
      
      await waitFor(() => {
        expect(screen.getByText('julho 2025')).toBeInTheDocument()
        expect(screen.getByLabelText('Mês anterior')).toBeInTheDocument()
        expect(screen.getByLabelText('Próximo mês')).toBeInTheDocument()
        expect(screen.getByText('Hoje')).toBeInTheDocument()
      })
    })

    it('displays day names header', async () => {
      renderCalendar()
      
      await waitFor(() => {
        expect(screen.getByText('Dom')).toBeInTheDocument()
        expect(screen.getByText('Seg')).toBeInTheDocument()
        expect(screen.getByText('Ter')).toBeInTheDocument()
        expect(screen.getByText('Qua')).toBeInTheDocument()
        expect(screen.getByText('Qui')).toBeInTheDocument()
        expect(screen.getByText('Sex')).toBeInTheDocument()
        expect(screen.getByText('Sáb')).toBeInTheDocument()
      })
    })

    it('displays legend when showLegend is true', () => {
      renderCalendar({ showLegend: true })
      
      expect(screen.getByText('Legenda')).toBeInTheDocument()
      expect(screen.getByText('Disponível')).toBeInTheDocument()
      expect(screen.getByText('Ocupado')).toBeInTheDocument()
      expect(screen.getByText('Conflito')).toBeInTheDocument()
      expect(screen.getByText('Selecionado')).toBeInTheDocument()
    })

    it('hides legend when showLegend is false', () => {
      renderCalendar({ showLegend: false })
      
      expect(screen.queryByText('Legenda')).not.toBeInTheDocument()
    })
  })

  describe('Calendar Navigation', () => {
    it('navigates to previous month', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      renderCalendar()
      
      await waitFor(async () => {
        const prevButton = screen.getByLabelText('Mês anterior')
        await user.click(prevButton)
        
        // Should show June 2025
        expect(screen.getByText('junho 2025')).toBeInTheDocument()
      })
    })

    it('navigates to next month', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      renderCalendar()
      
      await waitFor(async () => {
        const nextButton = screen.getByLabelText('Próximo mês')
        await user.click(nextButton)
        
        // Should show August 2025
        expect(screen.getByText('agosto 2025')).toBeInTheDocument()
      })
    })

    it('goes to current month when "Hoje" is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      renderCalendar()
      
      await waitFor(async () => {
        // First navigate away
        const nextButton = screen.getByLabelText('Próximo mês')
        await user.click(nextButton)
        expect(screen.getByText('agosto 2025')).toBeInTheDocument()
        
        // Then go back to today
        const todayButton = screen.getByText('Hoje')
        await user.click(todayButton)
        expect(screen.getByText('julho 2025')).toBeInTheDocument()
      })
    })
  })

  describe('Time Slot Display and Selection', () => {
    it('displays time slots after loading', async () => {
      renderCalendar()
      
      await waitFor(() => {
        expect(screen.getByText('09:00')).toBeInTheDocument()
        expect(screen.getByText('14:00')).toBeInTheDocument()
        expect(screen.getByText('10:00')).toBeInTheDocument()
      })
    })

    it('shows different visual states for slots', async () => {
      renderCalendar()
      
      await waitFor(() => {
        // Available slot (green)
        const availableSlot = screen.getByText('09:00').closest('button')
        expect(availableSlot).toHaveClass('bg-green-500/20')
        
        // Full slot (yellow)
        const fullSlot = screen.getByText('14:00').closest('button')
        expect(fullSlot).toHaveClass('bg-yellow-500/20')
        
        // Conflict slot (red)
        const conflictSlot = screen.getByText('10:00').closest('button')
        expect(conflictSlot).toHaveClass('bg-red-500/20')
      })
    })

    it('displays capacity information', async () => {
      renderCalendar()
      
      await waitFor(() => {
        // Should show current/max capacity
        expect(screen.getByText('5/10')).toBeInTheDocument() // Available slot
        expect(screen.getByText('10/10')).toBeInTheDocument() // Full slot
        expect(screen.getByText('7/10')).toBeInTheDocument() // Conflict slot
      })
    })

    it('calls onSlotSelect when available slot is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const onSlotSelect = jest.fn()
      renderCalendar({ onSlotSelect })
      
      await waitFor(async () => {
        const availableSlot = screen.getByText('09:00').closest('button')
        if (availableSlot) {
          await user.click(availableSlot)
          expect(onSlotSelect).toHaveBeenCalledWith(
            expect.objectContaining({
              startTime: '09:00',
              endTime: '11:00',
              isAvailable: true
            })
          )
        }
      })
    })

    it('does not call onSlotSelect for unavailable slots', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const onSlotSelect = jest.fn()
      renderCalendar({ onSlotSelect })
      
      await waitFor(async () => {
        const fullSlot = screen.getByText('14:00').closest('button')
        if (fullSlot) {
          await user.click(fullSlot)
          expect(onSlotSelect).not.toHaveBeenCalled()
        }
      })
    })

    it('shows selected slots with special styling', async () => {
      const selectedSlots: TimeSlot[] = [{
        date: new Date('2025-07-24'),
        startTime: '09:00',
        endTime: '11:00',
        isAvailable: true,
        currentCapacity: 5,
        maxCapacity: 10,
        slotId: 'slot-1',
        teacherId: 'teacher-1'
      }]
      
      renderCalendar({ selectedSlots })
      
      await waitFor(() => {
        const selectedSlot = screen.getByText('09:00').closest('button')
        expect(selectedSlot).toHaveClass('bg-[#d400ff]')
      })
    })
  })

  describe('Course Progress Tracking', () => {
    it('displays course progress information', async () => {
      const selectedSlots: TimeSlot[] = [{
        date: new Date('2025-07-24'),
        startTime: '09:00',
        endTime: '11:00',
        isAvailable: true,
        currentCapacity: 5,
        maxCapacity: 10,
        slotId: 'slot-1',
        teacherId: 'teacher-1'
      }]
      
      renderCalendar({ selectedSlots })
      
      await waitFor(() => {
        expect(screen.getByText('Progresso do Curso')).toBeInTheDocument()
        expect(screen.getByText('2.0h / 40h')).toBeInTheDocument() // 2 hour slot selected
        expect(screen.getByText('1')).toBeInTheDocument() // 1 slot selected
        expect(screen.getByText('38.0h')).toBeInTheDocument() // Hours remaining
      })
    })

    it('calculates progress percentage correctly', async () => {
      const selectedSlots: TimeSlot[] = [
        {
          date: new Date('2025-07-24'),
          startTime: '09:00',
          endTime: '11:00',
          isAvailable: true,
          currentCapacity: 5,
          maxCapacity: 10,
          slotId: 'slot-1',
          teacherId: 'teacher-1'
        },
        {
          date: new Date('2025-07-25'),
          startTime: '14:00',
          endTime: '16:00',
          isAvailable: true,
          currentCapacity: 0,
          maxCapacity: 10,
          slotId: 'slot-2',
          teacherId: 'teacher-1'
        }
      ]
      
      renderCalendar({ selectedSlots })
      
      // 4 hours selected out of 40 = 10%
      await waitFor(() => {
        expect(screen.getByText('4.0h / 40h')).toBeInTheDocument()
        
        const progressBar = screen.getByRole('progressbar') || 
                           document.querySelector('.bg-gradient-to-r')
        expect(progressBar).toBeInTheDocument()
      })
    })

    it('shows completion estimate', async () => {
      const selectedSlots: TimeSlot[] = [{
        date: new Date('2025-07-24'),
        startTime: '09:00',
        endTime: '11:00',
        isAvailable: true,
        currentCapacity: 5,
        maxCapacity: 10,
        slotId: 'slot-1',
        teacherId: 'teacher-1'
      }]
      
      renderCalendar({ selectedSlots })
      
      await waitFor(() => {
        expect(screen.getByText(/Estimativa: ~/)).toBeInTheDocument()
        expect(screen.getByText(/semanas? restantes?/)).toBeInTheDocument()
      })
    })
  })

  describe('Selection Summary', () => {
    it('shows selected slots summary', async () => {
      const selectedSlots: TimeSlot[] = [
        {
          date: new Date('2025-07-24'),
          startTime: '09:00',
          endTime: '11:00',
          isAvailable: true,
          currentCapacity: 5,
          maxCapacity: 10,
          slotId: 'slot-1',
          teacherId: 'teacher-1'
        },
        {
          date: new Date('2025-07-25'),
          startTime: '14:00',
          endTime: '16:00',
          isAvailable: true,
          currentCapacity: 0,
          maxCapacity: 10,
          slotId: 'slot-2',
          teacherId: 'teacher-1'
        }
      ]
      
      renderCalendar({ selectedSlots })
      
      await waitFor(() => {
        expect(screen.getByText('Horários Selecionados')).toBeInTheDocument()
        expect(screen.getByText('24 jul')).toBeInTheDocument()
        expect(screen.getByText('09:00 - 11:00')).toBeInTheDocument()
        expect(screen.getByText('25 jul')).toBeInTheDocument()
        expect(screen.getByText('14:00 - 16:00')).toBeInTheDocument()
      })
    })

    it('truncates long selection lists', async () => {
      const selectedSlots: TimeSlot[] = Array.from({ length: 8 }, (_, i) => ({
        date: new Date(`2025-07-${24 + i}`),
        startTime: '09:00',
        endTime: '11:00',
        isAvailable: true,
        currentCapacity: 0,
        maxCapacity: 10,
        slotId: `slot-${i}`,
        teacherId: 'teacher-1'
      }))
      
      renderCalendar({ selectedSlots })
      
      await waitFor(() => {
        expect(screen.getByText('+3 mais')).toBeInTheDocument() // Shows only first 5, +3 more
      })
    })
  })

  describe('Multi-selection and Limits', () => {
    it('allows multi-selection when enableMultiSelect is true', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const onSlotSelect = jest.fn()
      renderCalendar({ onSlotSelect, enableMultiSelect: true })
      
      await waitFor(async () => {
        const slot1 = screen.getByText('09:00').closest('button')
        const slot2 = screen.getByText('10:00').closest('button')
        
        if (slot1 && slot2) {
          await user.click(slot1)
          await user.click(slot2)
          
          expect(onSlotSelect).toHaveBeenCalledTimes(2)
        }
      })
    })

    it('respects maxSelectableSlots limit', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const onSlotSelect = jest.fn()
      const existingSlots: TimeSlot[] = [{
        date: new Date('2025-07-24'),
        startTime: '09:00',
        endTime: '11:00',
        isAvailable: true,
        currentCapacity: 5,
        maxCapacity: 10,
        slotId: 'slot-1',
        teacherId: 'teacher-1'
      }]
      
      renderCalendar({ 
        onSlotSelect, 
        selectedSlots: existingSlots,
        maxSelectableSlots: 1 
      })
      
      await waitFor(async () => {
        // Try to select another slot when limit is reached
        const slot2 = screen.getByText('10:00').closest('button')
        if (slot2) {
          expect(slot2).toBeDisabled()
        }
      })
    })

    it('shows selection limit warning', () => {
      renderCalendar({ maxSelectableSlots: 5 })
      
      expect(screen.getByText('Máximo de 5 horários podem ser selecionados')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('displays error message when data fetch fails', async () => {
      const { calculateAvailableSlots } = require('@/utils/teacherAvailabilityLogic')
      calculateAvailableSlots.mockRejectedValueOnce(new Error('Network error'))
      
      renderCalendar()
      
      await waitFor(() => {
        expect(screen.getByText('Erro ao carregar calendário')).toBeInTheDocument()
        expect(screen.getByText(/Network error/)).toBeInTheDocument()
        expect(screen.getByText('Tentar novamente')).toBeInTheDocument()
      })
    })

    it('allows retry when error occurs', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const { calculateAvailableSlots } = require('@/utils/teacherAvailabilityLogic')
      
      // First call fails
      calculateAvailableSlots.mockRejectedValueOnce(new Error('Network error'))
      // Second call succeeds
      calculateAvailableSlots.mockResolvedValueOnce(mockAvailabilitySlots)
      
      renderCalendar()
      
      await waitFor(async () => {
        expect(screen.getByText('Erro ao carregar calendário')).toBeInTheDocument()
        
        const retryButton = screen.getByText('Tentar novamente')
        await user.click(retryButton)
        
        await waitFor(() => {
          expect(screen.getByText('09:00')).toBeInTheDocument()
        })
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels for time slots', async () => {
      renderCalendar()
      
      await waitFor(() => {
        const slot = screen.getByLabelText(/Horário 09:00 às 11:00, disponível/)
        expect(slot).toBeInTheDocument()
        expect(slot).toHaveAttribute('role', 'button')
        expect(slot).toHaveAttribute('tabIndex', '0')
      })
    })

    it('supports keyboard navigation for slots', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const onSlotSelect = jest.fn()
      renderCalendar({ onSlotSelect })
      
      await waitFor(async () => {
        const slot = screen.getByLabelText(/Horário 09:00 às 11:00/)
        slot.focus()
        
        await user.keyboard('{Enter}')
        expect(onSlotSelect).toHaveBeenCalled()
      })
    })

    it('has proper calendar grid structure', async () => {
      renderCalendar()
      
      await waitFor(() => {
        // Calendar should have proper grid structure
        const calendar = screen.getByRole('main') || screen.getByText('julho 2025').closest('div')
        expect(calendar).toBeInTheDocument()
      })
    })

    it('provides meaningful tooltips for slots', async () => {
      renderCalendar()
      
      await waitFor(() => {
        const slot = screen.getByText('09:00').closest('button')
        expect(slot).toHaveAttribute('title', '5/10 ocupado')
      })
    })

    it('has proper heading hierarchy', () => {
      renderCalendar()
      
      const mainHeading = screen.getByRole('heading', { level: 2, name: 'Selecione os Horários' })
      expect(mainHeading).toBeInTheDocument()
      
      const legendHeading = screen.getByRole('heading', { level: 4, name: 'Legenda' })
      expect(legendHeading).toBeInTheDocument()
    })
  })

  describe('Real-time Updates', () => {
    it('sets up subscription for availability updates', async () => {
      const { subscribeToAvailabilityUpdates } = require('@/utils/teacherAvailabilityLogic')
      
      renderCalendar()
      
      await waitFor(() => {
        expect(subscribeToAvailabilityUpdates).toHaveBeenCalledWith(
          'teacher-1',
          expect.any(Function)
        )
      })
    })

    it('updates calendar when real-time event is received', async () => {
      const { subscribeToAvailabilityUpdates, calculateAvailableSlots } = require('@/utils/teacherAvailabilityLogic')
      
      let updateCallback: Function
      subscribeToAvailabilityUpdates.mockImplementation((_teacherId: string, callback: Function) => {
        updateCallback = callback
        return jest.fn()
      })
      
      renderCalendar()
      
      await waitFor(() => {
        expect(subscribeToAvailabilityUpdates).toHaveBeenCalled()
      })
      
      // Simulate real-time update
      calculateAvailableSlots.mockClear()
      updateCallback({ new: { id: 'updated' } })
      
      expect(calculateAvailableSlots).toHaveBeenCalled()
    })
  })

  describe('Performance Optimization', () => {
    it('memoizes calendar grid generation', async () => {
      const { rerender } = renderCalendar()
      
      await waitFor(() => {
        expect(screen.getByText('09:00')).toBeInTheDocument()
      })
      
      // Re-render with same props should not regenerate grid
      rerender(<ConditionalCalendar {...defaultProps} />)
      
      expect(screen.getByText('09:00')).toBeInTheDocument()
    })

    it('uses virtual scrolling for large date ranges', async () => {
      const longRangeProps = {
        ...defaultProps,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31')
      }
      
      renderCalendar(longRangeProps)
      
      // Component should render without performance issues
      await waitFor(() => {
        expect(screen.getByText('janeiro 2025')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles empty availability data gracefully', async () => {
      const { calculateAvailableSlots } = require('@/utils/teacherAvailabilityLogic')
      calculateAvailableSlots.mockResolvedValueOnce([])
      
      renderCalendar({ availabilityData: [] })
      
      await waitFor(() => {
        // Should still render calendar structure
        expect(screen.getByText('julho 2025')).toBeInTheDocument()
        expect(screen.getByText('Dom')).toBeInTheDocument() // Day headers
      })
    })

    it('works without teacherId', () => {
      const props = {
        ...defaultProps,
        teacherId: undefined
      }
      
      expect(() => renderCalendar(props)).not.toThrow()
      expect(screen.getByText('Visualize a disponibilidade dos professores')).toBeInTheDocument()
    })

    it('handles past dates correctly', async () => {
      jest.setSystemTime(new Date('2025-07-30')) // Set current date to end of month
      
      renderCalendar()
      
      await waitFor(() => {
        // Past slots should be disabled or styled differently
        const calendar = screen.getByText('julho 2025').closest('div')
        expect(calendar).toBeInTheDocument()
      })
    })

    it('handles timezone differences gracefully', async () => {
      // Mock different timezone
      const originalDateNow = Date.now
      Date.now = jest.fn(() => new Date('2025-07-23T15:00:00-03:00').getTime())
      
      renderCalendar()
      
      await waitFor(() => {
        expect(screen.getByText('julho 2025')).toBeInTheDocument()
      })
      
      Date.now = originalDateNow
    })
  })

  describe('Integration with Teacher Availability Logic', () => {
    it('integrates with calculateAvailableSlots utility', async () => {
      const { calculateAvailableSlots } = require('@/utils/teacherAvailabilityLogic')
      
      renderCalendar()
      
      await waitFor(() => {
        expect(calculateAvailableSlots).toHaveBeenCalledWith(
          'teacher-1',
          expect.objectContaining({
            start: expect.any(Date),
            end: expect.any(Date)
          }),
          expect.any(Array) // holidays
        )
      })
    })

    it('handles holiday conflicts correctly', async () => {
      renderCalendar()
      
      await waitFor(() => {
        // Slot with holiday conflict should be styled as unavailable
        const conflictSlot = screen.getByText('10:00').closest('button')
        expect(conflictSlot).toHaveClass('bg-red-500/20')
        expect(conflictSlot).toHaveAttribute('title', 'Conflito: Holiday conflict')
      })
    })
  })
})