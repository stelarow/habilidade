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
    button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    circle: ({ children, ...props }) => <circle {...props}>{children}</circle>,
  },
}))

const mockRouter = {
  push: jest.fn(),
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
  progress: {
    overall: 75,
    time: {
      current: 1200, // 20 minutes
      required: 1500, // 25 minutes
      formatted: '20min',
    },
    pdf: {
      percentage: 80,
      isCompleted: false,
    },
    exercises: {
      completed: 2,
      total: 3,
      isCompleted: false,
    },
    quiz: {
      score: 85,
      isCompleted: true,
      isPassed: true,
    },
  },
  canComplete: false,
  onExit: jest.fn(),
  onComplete: jest.fn(),
}

describe('LessonHeader', () => {
  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    jest.clearAllMocks()
  })

  it('renders the logo and school name', () => {
    render(<LessonHeader {...mockProps} />)
    
    expect(screen.getByText('H')).toBeInTheDocument()
    expect(screen.getByText('Escola Habilidade')).toBeInTheDocument()
  })

  it('renders the exit button', () => {
    render(<LessonHeader {...mockProps} />)
    
    const exitButton = screen.getByLabelText('Voltar ao curso')
    expect(exitButton).toBeInTheDocument()
  })

  it('calls onExit and navigates when exit button is clicked', () => {
    render(<LessonHeader {...mockProps} />)
    
    const exitButton = screen.getByLabelText('Voltar ao curso')
    fireEvent.click(exitButton)
    
    expect(mockProps.onExit).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/course/curso-react')
  })

  it('renders progress indicators for all criteria', () => {
    render(<LessonHeader {...mockProps} />)
    
    // Check that progress indicators are rendered
    // Note: We can't easily test the ProgressIndicator component content 
    // without more complex mocking, but we can verify the structure exists
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('Concluído')).toBeInTheDocument()
  })

  it('shows complete button when canComplete is true', () => {
    const propsWithComplete = {
      ...mockProps,
      canComplete: true,
    }
    
    render(<LessonHeader {...propsWithComplete} />)
    
    const completeButton = screen.getByText('Concluir Aula')
    expect(completeButton).toBeInTheDocument()
  })

  it('calls onComplete when complete button is clicked', () => {
    const propsWithComplete = {
      ...mockProps,
      canComplete: true,
    }
    
    render(<LessonHeader {...propsWithComplete} />)
    
    const completeButton = screen.getByText('Concluir Aula')
    fireEvent.click(completeButton)
    
    expect(mockProps.onComplete).toHaveBeenCalled()
  })

  it('does not show complete button when canComplete is false', () => {
    render(<LessonHeader {...mockProps} />)
    
    expect(screen.queryByText('Concluir Aula')).not.toBeInTheDocument()
  })

  it('displays overall progress percentage', () => {
    render(<LessonHeader {...mockProps} />)
    
    expect(screen.getByText('75%')).toBeInTheDocument()
  })
})