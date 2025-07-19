import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { LessonHeader } from '../LessonHeader'
import { LessonProgressData } from '@/types/lesson'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    header: ({ children, animate, transition, initial, ...props }: any) => <header {...props}>{children}</header>,
    button: ({ children, onClick, onKeyDown, whileHover, whileTap, animate, transition, initial, ...props }: any) => (
      <button onClick={onClick} onKeyDown={onKeyDown} {...props}>
        {children}
      </button>
    ),
    div: ({ children, animate, transition, initial, ...props }: any) => <div {...props}>{children}</div>,
    circle: ({ children, animate, transition, initial, ...props }: any) => <circle {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock hooks
jest.mock('@/hooks/useEnhancedProgressCalculation', () => ({
  useEnhancedProgressCalculation: jest.fn(),
}))

jest.mock('@/hooks/useScrollBehavior', () => ({
  useScrollBehavior: jest.fn(),
}))

// Mock ProgressIndicator component
jest.mock('../ProgressIndicator', () => ({
  ProgressIndicator: ({ label, progress, isCompleted }: any) => (
    <div data-testid={`progress-${label.toLowerCase()}`} role="button">
      {label}: {progress}% {isCompleted && '✓'}
    </div>
  ),
}))

const mockRouter = {
  push: jest.fn(),
}

const mockProgressData: LessonProgressData = {
  timeSpent: 900,
  requiredTime: 1200,
  pdfProgress: 50,
  exercisesCompleted: 1,
  totalExercises: 4,
  quizScore: 85,
  quizPassed: true,
}

const mockEnhancedProgress = {
  timeProgress: {
    percentage: 80,
    isCompleted: false,
    formatted: '20min',
    state: 'in_progress' as const,
  },
  pdfProgress: {
    percentage: 80,
    isCompleted: false,
    state: 'in_progress' as const,
  },
  exerciseProgress: {
    percentage: 67,
    completed: 2,
    total: 3,
    isCompleted: false,
    state: 'in_progress' as const,
  },
  quizProgress: {
    score: 85,
    isPassed: true,
    state: 'completed' as const,
  },
  overallProgress: {
    percentage: 75,
    canComplete: false,
  },
  visualStates: {
    progressColor: '#f59e0b',
    showCompletionButton: false,
  },
}

const mockProps = {
  course: {
    title: 'Curso de React',
    slug: 'curso-react',
  },
  lesson: {
    title: 'Introdução ao React',
    slug: 'introducao-react',
  },
  progressData: mockProgressData,
  onExit: jest.fn(),
  onComplete: jest.fn(),
}

describe('LessonHeader Exit Button Responsive Positioning', () => {
  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    
    // Mock the enhanced progress calculation hook
    const { useEnhancedProgressCalculation } = require('@/hooks/useEnhancedProgressCalculation')
    ;(useEnhancedProgressCalculation as jest.Mock).mockReturnValue(mockEnhancedProgress)
    
    // Mock the scroll behavior hook
    const { useScrollBehavior } = require('@/hooks/useScrollBehavior')
    ;(useScrollBehavior as jest.Mock).mockReturnValue({
      isScrolled: false,
      scrollDirection: 'up',
      isScrollingFast: false,
    })
    
    jest.clearAllMocks()
  })

  describe('Exit Button Fixed Position and Size', () => {
    it('maintains fixed position and size across all breakpoints', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      expect(exitButton).toBeInTheDocument()
      
      // Check that button has the responsive class
      expect(exitButton).toHaveClass('header-exit-button')
      
      // Verify button has proper positioning styles
      expect(exitButton).toHaveStyle({
        position: 'relative',
        zIndex: '20',
      })
    })

    it('ensures exit button maintains minimum size requirements', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      // Check that button has minimum size CSS variables applied
      expect(exitButton).toHaveStyle({
        minWidth: 'var(--header-button-size-mobile)',
        minHeight: 'var(--header-button-size-mobile)',
      })
    })

    it('prevents button from shrinking with flex-shrink-0', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      expect(exitButton).toHaveClass('flex-shrink-0')
    })
  })

  describe('Z-Index and Overlap Prevention', () => {
    it('has proper z-index to prevent overlap', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      // Check z-index is applied via CSS class
      expect(exitButton).toHaveClass('z-20')
      
      // Check inline style z-index
      expect(exitButton).toHaveStyle({ zIndex: '20' })
    })

    it('maintains relative positioning to prevent layout issues', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      expect(exitButton).toHaveStyle({ position: 'relative' })
    })

    it('does not overlap with progress indicators', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      const progressIndicators = screen.getAllByRole('button').filter(button => 
        button.getAttribute('data-testid')?.includes('progress-')
      )
      
      // Ensure exit button and progress indicators are both present
      expect(exitButton).toBeInTheDocument()
      expect(progressIndicators.length).toBeGreaterThan(0)
      
      // Check that exit button has higher z-index class
      expect(exitButton).toHaveClass('z-20')
    })
  })

  describe('Touch-Friendly Sizing for Mobile', () => {
    it('implements touch-friendly sizing with proper touch-action', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      // Check touch manipulation class
      expect(exitButton).toHaveClass('touch-manipulation')
    })

    it('has appropriate button type and role attributes', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      expect(exitButton).toHaveAttribute('type', 'button')
      expect(exitButton).toHaveAttribute('role', 'button')
      expect(exitButton).toHaveAttribute('tabIndex', '0')
    })

    it('provides enhanced aria-label for screen readers', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso - Pressione Enter ou Espaço para ativar/)
      expect(exitButton).toBeInTheDocument()
    })
  })

  describe('Button Accessibility Across Responsive Breakpoints', () => {
    it('handles keyboard navigation with Enter key', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      // Simulate Enter key press
      fireEvent.keyDown(exitButton, { key: 'Enter', code: 'Enter' })
      
      expect(mockProps.onExit).toHaveBeenCalled()
      expect(mockRouter.push).toHaveBeenCalledWith('/course/curso-react')
    })

    it('handles keyboard navigation with Space key', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      // Simulate Space key press
      fireEvent.keyDown(exitButton, { key: ' ', code: 'Space' })
      
      expect(mockProps.onExit).toHaveBeenCalled()
      expect(mockRouter.push).toHaveBeenCalledWith('/course/curso-react')
    })

    it('ignores other key presses', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      // Simulate other key press
      fireEvent.keyDown(exitButton, { key: 'Tab', code: 'Tab' })
      
      expect(mockProps.onExit).not.toHaveBeenCalled()
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('handles mouse clicks properly', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      fireEvent.click(exitButton)
      
      expect(mockProps.onExit).toHaveBeenCalled()
      expect(mockRouter.push).toHaveBeenCalledWith('/course/curso-react')
    })

    it('has proper focus management classes', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      // Check focus-related classes
      expect(exitButton).toHaveClass('focus:outline-none')
      expect(exitButton).toHaveClass('focus:ring-2')
      expect(exitButton).toHaveClass('focus:ring-[#d400ff]')
      expect(exitButton).toHaveClass('focus:ring-offset-2')
    })
  })

  describe('Responsive Button Content', () => {
    it('shows "Sair" text on larger screens', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitText = screen.getByText('Sair')
      expect(exitText).toBeInTheDocument()
      expect(exitText).toHaveClass('header-hide-mobile')
    })

    it('includes arrow icon with proper sizing', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      const icon = exitButton.querySelector('svg')
      
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-3', 'h-3', 'sm:w-4', 'sm:h-4', 'flex-shrink-0')
    })

    it('prevents text wrapping with whitespace-nowrap', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitText = screen.getByText('Sair')
      expect(exitText).toHaveClass('whitespace-nowrap')
    })
  })

  describe('Button State Management', () => {
    it('maintains proper hover and active states', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      // Check hover classes
      expect(exitButton).toHaveClass('hover:bg-white/10')
      
      // Check active classes
      expect(exitButton).toHaveClass('active:bg-white/15')
    })

    it('has proper transition classes for smooth interactions', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      expect(exitButton).toHaveClass('transition-colors')
    })

    it('maintains consistent styling across different states', () => {
      render(<LessonHeader {...mockProps} />)
      
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      // Check base styling classes
      expect(exitButton).toHaveClass('bg-white/5')
      expect(exitButton).toHaveClass('rounded-md')
      expect(exitButton).toHaveClass('flex')
      expect(exitButton).toHaveClass('items-center')
      expect(exitButton).toHaveClass('justify-center')
    })
  })

  describe('Integration with Header Layout', () => {
    it('is properly positioned within the logo area', () => {
      render(<LessonHeader {...mockProps} />)
      
      const logoArea = document.querySelector('.header-logo-area')
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      expect(logoArea).toBeInTheDocument()
      expect(logoArea).toContainElement(exitButton)
    })

    it('maintains proper spacing with other logo elements', () => {
      render(<LessonHeader {...mockProps} />)
      
      const logoArea = document.querySelector('.header-logo-area')
      const exitButton = screen.getByLabelText(/Voltar ao curso/)
      
      // Check that logo area has proper flex layout
      expect(logoArea).toHaveClass('header-logo-area')
      
      // Check that the parent container has proper gap classes
      const parentContainer = exitButton.parentElement
      expect(parentContainer).toHaveClass('flex')
      
      // The gap classes should be on the parent flex container
      const gapContainer = logoArea?.querySelector('.flex')
      expect(gapContainer).toBeInTheDocument()
    })
  })
})