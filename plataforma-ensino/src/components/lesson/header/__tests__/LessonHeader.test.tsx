import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { LessonHeader } from '../LessonHeader'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    header: ({ children, animate, transition, initial, ...props }) => <header {...props}>{children}</header>,
    button: ({ children, onClick, whileHover, whileTap, animate, transition, initial, ...props }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    div: ({ children, animate, transition, initial, ...props }) => <div {...props}>{children}</div>,
    circle: ({ children, animate, transition, initial, ...props }) => <circle {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
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
  ProgressIndicator: ({ label, progress, isCompleted }) => (
    <div data-testid={`progress-${label.toLowerCase()}`}>
      {label}: {progress}% {isCompleted && '✓'}
    </div>
  ),
}))

const mockRouter = {
  push: jest.fn(),
}

const mockProgressData = {
  videoProgress: {
    currentTime: 1200,
    duration: 1500,
    percentageWatched: 80,
    watchTime: 1200,
    lastPosition: 1200,
    playbackRate: 1,
    completedSegments: [],
  },
  pdfProgress: {
    currentPage: 8,
    totalPages: 10,
    percentageRead: 80,
    bookmarks: [],
    readingTime: 600,
    lastPageViewed: 8,
  },
  quizProgress: {
    currentQuestion: 5,
    totalQuestions: 5,
    answeredQuestions: [1, 2, 3, 4, 5],
    score: 85,
    attempts: 1,
    timeSpent: 300,
    isCompleted: true,
    isPassed: true,
  },
  exerciseProgress: {
    completedExercises: ['ex1', 'ex2'],
    submittedFiles: [],
    pendingReviews: [],
    totalExercises: 3,
    completionPercentage: 67,
  },
  contentProgress: {
    scrollPercentage: 90,
    readingTime: 800,
    sectionsRead: ['intro', 'main'],
    estimatedCompletionTime: 200,
  },
  overallProgress: {
    percentageComplete: 75,
    estimatedTimeRemaining: 300,
    lastActivity: '2024-01-01T10:00:00Z',
    isCompleted: false,
    componentProgress: [],
  },
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

describe('LessonHeader', () => {
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

  it('renders the logo and school name', () => {
    render(<LessonHeader {...mockProps} />)
    
    expect(screen.getByText('H')).toBeInTheDocument()
    expect(screen.getByText('Escola Habilidade')).toBeInTheDocument()
  })

  it('renders the exit button', () => {
    render(<LessonHeader {...mockProps} />)
    
    const exitButton = screen.getByLabelText(/Voltar ao curso/)
    expect(exitButton).toBeInTheDocument()
  })

  it('calls onExit and navigates when exit button is clicked', () => {
    render(<LessonHeader {...mockProps} />)
    
    const exitButton = screen.getByLabelText(/Voltar ao curso/)
    fireEvent.click(exitButton)
    
    expect(mockProps.onExit).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/course/curso-react')
  })

  it('renders progress indicators for all criteria', () => {
    render(<LessonHeader {...mockProps} />)
    
    // Check that progress indicators are rendered using our mocked component
    // Use getAllByTestId since there are multiple responsive layouts
    expect(screen.getAllByTestId('progress-tempo')).toHaveLength(3) // Mobile, tablet, desktop
    expect(screen.getAllByTestId('progress-pdf')).toHaveLength(3)
    expect(screen.getAllByTestId('progress-quiz')).toHaveLength(3) // Mobile, tablet, desktop (ultra-mobile uses 'Q')
    
    // Check for exercícios in desktop layout
    expect(screen.getByTestId('progress-exercícios')).toBeInTheDocument()
    
    // Check for ultra-mobile abbreviated indicators
    expect(screen.getByTestId('progress-q')).toBeInTheDocument() // Ultra-mobile quiz
    expect(screen.getByTestId('progress-t')).toBeInTheDocument() // Ultra-mobile time
  })

  it('shows complete button when canComplete is true', () => {
    // Update the mock to show completion button
    const mockEnhancedProgressWithComplete = {
      ...mockEnhancedProgress,
      overallProgress: {
        ...mockEnhancedProgress.overallProgress,
        canComplete: true,
      },
      visualStates: {
        ...mockEnhancedProgress.visualStates,
        showCompletionButton: true,
      },
    }
    
    const { useEnhancedProgressCalculation } = require('@/hooks/useEnhancedProgressCalculation')
    ;(useEnhancedProgressCalculation as jest.Mock).mockReturnValue(mockEnhancedProgressWithComplete)
    
    render(<LessonHeader {...mockProps} />)
    
    const completeButton = screen.getByText('Concluir')
    expect(completeButton).toBeInTheDocument()
  })

  it('calls onComplete when complete button is clicked', () => {
    // Update the mock to show completion button
    const mockEnhancedProgressWithComplete = {
      ...mockEnhancedProgress,
      overallProgress: {
        ...mockEnhancedProgress.overallProgress,
        canComplete: true,
      },
      visualStates: {
        ...mockEnhancedProgress.visualStates,
        showCompletionButton: true,
      },
    }
    
    const { useEnhancedProgressCalculation } = require('@/hooks/useEnhancedProgressCalculation')
    ;(useEnhancedProgressCalculation as jest.Mock).mockReturnValue(mockEnhancedProgressWithComplete)
    
    render(<LessonHeader {...mockProps} />)
    
    const completeButton = screen.getByText('Concluir')
    fireEvent.click(completeButton)
    
    expect(mockProps.onComplete).toHaveBeenCalled()
  })

  it('does not show complete button when canComplete is false', () => {
    render(<LessonHeader {...mockProps} />)
    
    expect(screen.queryByText('Concluir')).not.toBeInTheDocument()
  })

  it('displays overall progress percentage', () => {
    render(<LessonHeader {...mockProps} />)
    
    // Check for the overall progress percentage in the desktop view
    const progressElements = screen.getAllByText('75%')
    expect(progressElements.length).toBeGreaterThan(0)
    
    // Verify the "Geral" label is present (indicating overall progress section)
    expect(screen.getByText('Geral')).toBeInTheDocument()
  })
})