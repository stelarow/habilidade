import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProgressIndicator } from '../ProgressIndicator'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, ...props }) => (
      <div onClick={onClick} {...props}>
        {children}
      </div>
    ),
    circle: ({ children, ...props }) => <circle {...props}>{children}</circle>,
  },
}))

describe('ProgressIndicator', () => {
  const defaultProps = {
    icon: 'time' as const,
    label: 'Tempo',
    progress: 75,
    isCompleted: false,
    color: '#f59e0b',
  }

  it('renders the label', () => {
    render(<ProgressIndicator {...defaultProps} />)
    
    expect(screen.getByText('Tempo')).toBeInTheDocument()
  })

  it('renders detail when provided', () => {
    render(<ProgressIndicator {...defaultProps} detail="20min" />)
    
    expect(screen.getByText('20min')).toBeInTheDocument()
  })

  it('shows checkmark when completed', () => {
    render(<ProgressIndicator {...defaultProps} isCompleted={true} />)
    
    // The CheckCircle icon should be rendered when completed
    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toBeInTheDocument()
  })

  it('calls onClick when clicked and onClick is provided', () => {
    const mockOnClick = jest.fn()
    render(<ProgressIndicator {...defaultProps} onClick={mockOnClick} />)
    
    const indicator = screen.getByText('Tempo').closest('div')
    fireEvent.click(indicator!)
    
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('renders different icons for different types', () => {
    const { rerender } = render(<ProgressIndicator {...defaultProps} icon="time" />)
    expect(screen.getByText('Tempo')).toBeInTheDocument()

    rerender(<ProgressIndicator {...defaultProps} icon="pdf" label="PDF" />)
    expect(screen.getByText('PDF')).toBeInTheDocument()

    rerender(<ProgressIndicator {...defaultProps} icon="exercises" label="Exercícios" />)
    expect(screen.getByText('Exercícios')).toBeInTheDocument()

    rerender(<ProgressIndicator {...defaultProps} icon="quiz" label="Quiz" />)
    expect(screen.getByText('Quiz')).toBeInTheDocument()
  })

  it('applies completed styling when isCompleted is true', () => {
    const { container } = render(<ProgressIndicator {...defaultProps} isCompleted={true} />)
    
    const indicator = container.firstChild as HTMLElement
    expect(indicator).toHaveClass('bg-green-500/10', 'border-green-500/20')
  })

  it('applies hover styling when onClick is provided', () => {
    const { container } = render(<ProgressIndicator {...defaultProps} onClick={() => {}} />)
    
    const indicator = container.firstChild as HTMLElement
    expect(indicator).toHaveClass('cursor-pointer', 'hover:bg-white/5')
  })
})