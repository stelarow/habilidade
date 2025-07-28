/**
 * Unit tests for SchedulingSection component
 * 
 * Tests cover the acceptance criteria from Story 1.1:
 * - AC: 2 - Conditional rendering based on checkbox state
 * - AC: 3 - Component integration and functionality
 * - AC: 4 - Field clearing when section is hidden
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SchedulingSection } from '../SchedulingSection'
import type { Course } from '@/components/enrollment/TeacherSelector'

// Mock the external dependencies
jest.mock('@/components/enrollment/TeacherSelector', () => ({
  __esModule: true,
  default: ({ onTeacherSelect, className }: any) => (
    <div data-testid="teacher-selector" className={className}>
      <button 
        onClick={() => onTeacherSelect({
          id: 'teacher-1',
          name: 'Test Teacher',
          email: 'test@teacher.com',
          availability: []
        })}
      >
        Select Teacher
      </button>
    </div>
  )
}))

jest.mock('@/components/enrollment/ConditionalCalendar', () => ({
  __esModule: true,
  default: ({ onSlotSelect, teacherId, className }: any) => (
    <div data-testid="conditional-calendar" className={className}>
      {teacherId ? (
        <button 
          onClick={() => onSlotSelect({
            slotId: 'slot-1',
            date: new Date(),
            startTime: '09:00',
            endTime: '11:00'
          })}
        >
          Select Slot
        </button>
      ) : (
        <div>Calendar disabled - no teacher selected</div>
      )}
    </div>
  )
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  )
}))

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  CalendarDaysIcon: () => <div data-testid="calendar-icon" />,
  UserIcon: () => <div data-testid="user-icon" />,
  ClockIcon: () => <div data-testid="clock-icon" />
}))

describe('SchedulingSection', () => {
  const mockCourse: Course = {
    id: 'course-1',
    title: 'Test Course',
    category: 'Test',
    duration_hours: 40,
    max_students: 20
  }

  const defaultProps = {
    isVisible: true,
    selectedCourse: mockCourse,
    teacherId: '',
    hasTwoClassesPerWeek: false,
    onTeacherChange: jest.fn(),
    onTwoClassesChange: jest.fn(),
    onSlotSelect: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Conditional Rendering (AC: 2)', () => {
    it('should render nothing when isVisible is false', () => {
      const { container } = render(
        <SchedulingSection {...defaultProps} isVisible={false} />
      )
      
      expect(container.firstChild).toBeNull()
    })

    it('should render the scheduling section when isVisible is true', () => {
      render(<SchedulingSection {...defaultProps} />)
      
      expect(screen.getByText('Agendamento de Aulas')).toBeInTheDocument()
      expect(screen.getByText('Configure professor e horários para aulas presenciais')).toBeInTheDocument()
    })

    it('should show section header with proper title and description', () => {
      render(<SchedulingSection {...defaultProps} />)
      
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
      expect(screen.getByText('Agendamento de Aulas')).toBeInTheDocument()
      expect(screen.getByText('Configure professor e horários para aulas presenciais')).toBeInTheDocument()
    })
  })

  describe('Component Integration (AC: 3)', () => {
    it('should render TeacherSelector component with proper props', () => {
      render(<SchedulingSection {...defaultProps} />)
      
      const teacherSelector = screen.getByTestId('teacher-selector')
      expect(teacherSelector).toBeInTheDocument()
      expect(teacherSelector).toHaveClass('teacher-selection-section')
    })

    it('should render ConditionalCalendar component', () => {
      render(<SchedulingSection {...defaultProps} />)
      
      expect(screen.getByTestId('conditional-calendar')).toBeInTheDocument()
    })

    it('should render "Duas aulas por semana" checkbox', () => {
      render(<SchedulingSection {...defaultProps} />)
      
      const checkbox = screen.getByLabelText('Duas aulas por semana')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).toHaveAttribute('type', 'checkbox')
    })

    it('should call onTeacherChange when teacher is selected', async () => {
      const onTeacherChange = jest.fn()
      render(
        <SchedulingSection 
          {...defaultProps} 
          onTeacherChange={onTeacherChange}
        />
      )
      
      const selectButton = screen.getByText('Select Teacher')
      fireEvent.click(selectButton)
      
      await waitFor(() => {
        expect(onTeacherChange).toHaveBeenCalledWith('teacher-1')
      })
    })

    it('should call onTwoClassesChange when checkbox is toggled', () => {
      const onTwoClassesChange = jest.fn()
      render(
        <SchedulingSection 
          {...defaultProps} 
          onTwoClassesChange={onTwoClassesChange}
        />
      )
      
      const checkbox = screen.getByLabelText('Duas aulas por semana')
      fireEvent.click(checkbox)
      
      expect(onTwoClassesChange).toHaveBeenCalledWith(true)
    })

    it('should call onSlotSelect when calendar slot is selected', async () => {
      const onSlotSelect = jest.fn()
      render(
        <SchedulingSection 
          {...defaultProps} 
          teacherId="teacher-1"
          onSlotSelect={onSlotSelect}
        />
      )
      
      const selectSlotButton = screen.getByText('Select Slot')
      fireEvent.click(selectSlotButton)
      
      await waitFor(() => {
        expect(onSlotSelect).toHaveBeenCalled()
      })
    })
  })

  describe('Calendar Conditional Enabling', () => {
    it('should disable calendar when no teacher is selected', () => {
      render(<SchedulingSection {...defaultProps} teacherId="" />)
      
      expect(screen.getByText('Calendar disabled - no teacher selected')).toBeInTheDocument()
    })

    it('should enable calendar when teacher is selected', () => {
      render(<SchedulingSection {...defaultProps} teacherId="teacher-1" />)
      
      expect(screen.getByText('Select Slot')).toBeInTheDocument()
    })
  })

  describe('Two Classes Per Week Functionality', () => {
    it('should reflect hasTwoClassesPerWeek prop state', () => {
      render(<SchedulingSection {...defaultProps} hasTwoClassesPerWeek={true} />)
      
      const checkbox = screen.getByLabelText('Duas aulas por semana') as HTMLInputElement
      expect(checkbox.checked).toBe(true)
    })

    it('should be disabled when isVisible is false', () => {
      render(<SchedulingSection {...defaultProps} isVisible={false} />)
      
      // Component should not render at all when not visible
      expect(screen.queryByLabelText('Duas aulas por semana')).not.toBeInTheDocument()
    })
  })

  describe('Information Panel', () => {
    it('should render information panel with scheduling details', () => {
      render(<SchedulingSection {...defaultProps} />)
      
      expect(screen.getByText('Informações sobre Agendamento')).toBeInTheDocument()
      expect(screen.getByText(/Primeiro selecione o professor/)).toBeInTheDocument()
      expect(screen.getByText(/Para duas aulas por semana/)).toBeInTheDocument()
      expect(screen.getByText(/O calendário mostra a disponibilidade real/)).toBeInTheDocument()
    })
  })

  describe('Field Clearing Logic (AC: 4)', () => {
    it('should maintain component state when visible', () => {
      const { rerender } = render(
        <SchedulingSection 
          {...defaultProps} 
          isVisible={true}
          teacherId="teacher-1"
          hasTwoClassesPerWeek={true}
        />
      )
      
      // Verify components are rendered
      expect(screen.getByTestId('teacher-selector')).toBeInTheDocument()
      expect(screen.getByTestId('conditional-calendar')).toBeInTheDocument()
      
      const checkbox = screen.getByLabelText('Duas aulas por semana') as HTMLInputElement
      expect(checkbox.checked).toBe(true)
      
      // Re-render with same visibility
      rerender(
        <SchedulingSection 
          {...defaultProps} 
          isVisible={true}
          teacherId="teacher-1"
          hasTwoClassesPerWeek={true}
        />
      )
      
      // State should be maintained
      expect(screen.getByTestId('teacher-selector')).toBeInTheDocument()
      expect(screen.getByTestId('conditional-calendar')).toBeInTheDocument()
    })

    it('should not render when section becomes hidden', () => {
      const { rerender } = render(
        <SchedulingSection 
          {...defaultProps} 
          isVisible={true}
          teacherId="teacher-1"
        />
      )
      
      // Initially visible
      expect(screen.getByTestId('teacher-selector')).toBeInTheDocument()
      
      // Hide the section
      rerender(
        <SchedulingSection 
          {...defaultProps} 
          isVisible={false}
          teacherId="teacher-1"
        />
      )
      
      // Should not render anything
      expect(screen.queryByTestId('teacher-selector')).not.toBeInTheDocument()
      expect(screen.queryByTestId('conditional-calendar')).not.toBeInTheDocument()
    })
  })

  describe('Form Integration and State Management', () => {
    it('should handle teacher selection and notify parent', async () => {
      const onTeacherChange = jest.fn()
      render(
        <SchedulingSection 
          {...defaultProps} 
          onTeacherChange={onTeacherChange}
        />
      )
      
      fireEvent.click(screen.getByText('Select Teacher'))
      
      await waitFor(() => {
        expect(onTeacherChange).toHaveBeenCalledWith('teacher-1')
      })
    })

    it('should handle checkbox state changes', () => {
      const onTwoClassesChange = jest.fn()
      render(
        <SchedulingSection 
          {...defaultProps} 
          onTwoClassesChange={onTwoClassesChange}
        />
      )
      
      const checkbox = screen.getByLabelText('Duas aulas por semana')
      
      // Check the checkbox
      fireEvent.click(checkbox)
      expect(onTwoClassesChange).toHaveBeenCalledWith(true)
      
      // Uncheck the checkbox (simulate controlled component)
      fireEvent.click(checkbox)
      expect(onTwoClassesChange).toHaveBeenCalledWith(true) // Still true because it's controlled
    })

    it('should apply custom className when provided', () => {
      const customClass = 'custom-scheduling-section'
      render(<SchedulingSection {...defaultProps} className={customClass} />)
      
      const section = screen.getByText('Agendamento de Aulas').closest('div')
      expect(section).toHaveClass('scheduling-section')
      expect(section).toHaveClass(customClass)
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels and ARIA attributes', () => {
      render(<SchedulingSection {...defaultProps} />)
      
      const checkbox = screen.getByLabelText('Duas aulas por semana')
      expect(checkbox).toHaveAttribute('id', 'has_two_classes_per_week')
      
      const label = screen.getByText('Duas aulas por semana')
      expect(label).toHaveAttribute('for', 'has_two_classes_per_week')
    })

    it('should show required field indicators', () => {
      render(<SchedulingSection {...defaultProps} />)
      
      // Check for required field asterisks
      const requiredIndicators = screen.getAllByText('*')
      expect(requiredIndicators.length).toBeGreaterThan(0)
    })
  })
})