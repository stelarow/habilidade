import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProgressIndicator, { type ProgressIndicatorProps } from '../ProgressIndicator'

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')
}))

describe('ProgressIndicator', () => {
  const defaultProps: ProgressIndicatorProps = {
    label: 'Vídeo',
    shortLabel: 'V',
    progress: 75
  }

  it('renders with default props', () => {
    render(<ProgressIndicator {...defaultProps} />)
    
    // Should show progress percentage
    expect(screen.getByText('75%')).toBeInTheDocument()
    
    // Should show short label on medium screens
    expect(screen.getByText('V')).toBeInTheDocument()
  })

  it('displays full label for large screens', () => {
    render(<ProgressIndicator {...defaultProps} />)
    
    // Full label should be present but hidden on smaller screens
    expect(screen.getByText('Vídeo')).toBeInTheDocument()
  })

  it('handles progress clamping correctly', () => {
    // Test progress over 100%
    render(<ProgressIndicator {...defaultProps} progress={150} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    
    // Test negative progress
    const { rerender } = render(<ProgressIndicator {...defaultProps} progress={-10} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    
    // Test normal progress
    rerender(<ProgressIndicator {...defaultProps} progress={42.7} />)
    expect(screen.getByText('43%')).toBeInTheDocument()
  })

  it('applies correct variant colors', () => {
    const { container } = render(
      <ProgressIndicator {...defaultProps} variant="video" />
    )
    
    // Check if video variant classes are applied
    expect(container.querySelector('.text-primary-700')).toBeInTheDocument()
    expect(container.querySelector('.bg-primary-500')).toBeInTheDocument()
  })

  it('handles compact mode correctly', () => {
    render(<ProgressIndicator {...defaultProps} compact />)
    
    // In compact mode, should show short label
    const shortLabels = screen.getAllByText('V')
    expect(shortLabels.length).toBeGreaterThan(0)
  })

  it('applies custom className', () => {
    const { container } = render(
      <ProgressIndicator {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders different variants correctly', () => {
    const variants: Array<ProgressIndicatorProps['variant']> = [
      'video', 'material', 'exercise', 'default'
    ]
    
    variants.forEach((variant: any) => {
      const { container } = render(
        <ProgressIndicator {...defaultProps} variant={variant} />
      )
      
      // Each variant should render without errors
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('handles zero progress', () => {
    render(<ProgressIndicator {...defaultProps} progress={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('handles 100% progress', () => {
    render(<ProgressIndicator {...defaultProps} progress={100} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('renders progress bar with correct width', () => {
    const { container } = render(<ProgressIndicator {...defaultProps} progress={60} />)
    
    const progressBar = container.querySelector('[style*="width: 60%"]')
    expect(progressBar).toBeInTheDocument()
  })

  it('maintains accessibility with proper text content', () => {
    render(<ProgressIndicator {...defaultProps} progress={85} />)
    
    // Should have readable text for screen readers
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('V')).toBeInTheDocument()
  })
})