import React from 'react'
import { render, screen } from '@testing-library/react'
import { LessonHeader } from '../LessonHeader'
import type { LessonProgressData } from '@/types/lesson'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    circle: ({ children, ...props }: any) => <circle {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock hooks
jest.mock('@/hooks/useEnhancedProgressCalculation', () => ({
  useEnhancedProgressCalculation: () => ({
    timeProgress: {
      percentage: 75,
      isCompleted: false,
      formatted: '15:30',
      state: 'in_progress',
    },
    pdfProgress: {
      percentage: 50,
      isCompleted: false,
      state: 'in_progress',
    },
    exerciseProgress: {
      percentage: 25,
      isCompleted: false,
      completed: 1,
      total: 4,
      state: 'not_started',
    },
    quizProgress: {
      score: 85,
      isPassed: true,
      state: 'completed',
    },
    overallProgress: {
      percentage: 60,
      canComplete: false,
    },
    visualStates: {
      showCompletionButton: false,
      progressColor: '#f59e0b',
    },
  }),
}))

jest.mock('@/hooks/useScrollBehavior', () => ({
  useScrollBehavior: () => ({
    isScrolled: false,
    scrollDirection: 'up',
    isScrollingFast: false,
  }),
}))

const mockCourse = {
  title: 'Test Course',
  slug: 'test-course',
}

const mockLesson = {
  title: 'Test Lesson',
  slug: 'test-lesson',
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

describe('LessonHeader Responsive Progress Layout', () => {
  const defaultProps = {
    course: mockCourse,
    lesson: mockLesson,
    progressData: mockProgressData,
    onExit: jest.fn(),
    onComplete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders progress indicators with responsive layout classes', () => {
    render(<LessonHeader {...defaultProps} />)
    
    // Check that progress area exists
    const progressArea = document.querySelector('.header-progress-area')
    expect(progressArea).toBeInTheDocument()
  })

  it('renders all responsive layout containers', () => {
    render(<LessonHeader {...defaultProps} />)
    
    // Check for all layout classes
    expect(document.querySelector('.progress-layout-vertical')).toBeInTheDocument()
    expect(document.querySelector('.progress-layout-horizontal')).toBeInTheDocument()
    expect(document.querySelector('.progress-layout-tablet')).toBeInTheDocument()
    expect(document.querySelector('.progress-layout-desktop')).toBeInTheDocument()
  })

  it('displays progress percentages in mobile layout', () => {
    render(<LessonHeader {...defaultProps} />)
    
    // Check for total progress display in mobile
    expect(screen.getByText('60% total')).toBeInTheDocument()
  })

  it('maintains proper CSS classes for spacing', () => {
    render(<LessonHeader {...defaultProps} />)
    
    // Check that layout containers have proper CSS classes
    expect(document.querySelector('.progress-layout-vertical')).toHaveClass('progress-layout-vertical')
    expect(document.querySelector('.progress-layout-horizontal')).toHaveClass('progress-layout-horizontal')
    expect(document.querySelector('.progress-layout-tablet')).toHaveClass('progress-layout-tablet')
    expect(document.querySelector('.progress-layout-desktop')).toHaveClass('progress-layout-desktop')
  })

  it('ensures progress percentages are visible', () => {
    render(<LessonHeader {...defaultProps} />)
    
    // Check that progress percentages are displayed
    expect(screen.getByText('60% total')).toBeInTheDocument()
  })

  it('has proper container structure', () => {
    render(<LessonHeader {...defaultProps} />)
    
    // Check that progress area has the correct structure
    const progressArea = document.querySelector('.header-progress-area')
    expect(progressArea).toBeInTheDocument()
    expect(progressArea).toHaveClass('header-progress-area')
  })

  it('implements flexible progress indicators that adapt to available space', () => {
    render(<LessonHeader {...defaultProps} />)
    
    // Verify that different layouts exist
    const layouts = [
      '.progress-layout-vertical',
      '.progress-layout-horizontal', 
      '.progress-layout-tablet',
      '.progress-layout-desktop'
    ]

    layouts.forEach((selector) => {
      const layout = document.querySelector(selector)
      expect(layout).toBeInTheDocument()
    })
  })

  it('creates horizontal and vertical layout modes', () => {
    render(<LessonHeader {...defaultProps} />)
    
    // Verify vertical layout exists (ultra-mobile)
    const verticalLayout = document.querySelector('.progress-layout-vertical')
    expect(verticalLayout).toBeInTheDocument()
    
    // Verify horizontal layouts exist (mobile, tablet, desktop)
    expect(document.querySelector('.progress-layout-horizontal')).toBeInTheDocument()
    expect(document.querySelector('.progress-layout-tablet')).toBeInTheDocument()
    expect(document.querySelector('.progress-layout-desktop')).toBeInTheDocument()
  })

  it('ensures progress percentages remain readable', () => {
    render(<LessonHeader {...defaultProps} />)
    
    // Check that overall progress percentage is visible
    expect(screen.getByText('60% total')).toBeInTheDocument()
  })
})