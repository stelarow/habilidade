import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TruncatedText } from '../TruncatedText'

// Mock Radix UI Tooltip for testing
jest.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-provider">{children}</div>,
  Root: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-root">{children}</div>,
  Trigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
    if (asChild) {
      // When asChild is true, we need to clone the child and add our test id
      return React.cloneElement(children as React.ReactElement, { 'data-testid': 'tooltip-trigger' })
    }
    return <div data-testid="tooltip-trigger">{children}</div>
  },
  Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-portal">{children}</div>,
  Content: ({ children, className }: { children: React.ReactNode; className?: string }) => 
    <div data-testid="tooltip-content" className={className}>{children}</div>,
  Arrow: ({ className }: { className?: string }) => <div data-testid="tooltip-arrow" className={className} />
}))

describe('TruncatedText', () => {
  const longText = 'This is a very long text that should be truncated when it exceeds the maximum length'
  const shortText = 'Short text'

  describe('Text Truncation Logic', () => {
    it('should display full text when text length is within maxLength', () => {
      render(<TruncatedText text={shortText} maxLength={20} />)
      
      expect(screen.getByText(shortText)).toBeInTheDocument()
      expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument()
    })

    it('should truncate text when it exceeds maxLength', () => {
      render(<TruncatedText text={longText} maxLength={20} />)
      
      const truncatedElement = screen.getByText('This is a very long ...')
      expect(truncatedElement).toBeInTheDocument()
      // Note: The original text appears in the tooltip, so we check that it's not in the main display
      expect(truncatedElement).not.toHaveTextContent(longText)
    })

    it('should truncate text at exact maxLength boundary', () => {
      const exactText = 'Exactly twenty chars'
      render(<TruncatedText text={exactText} maxLength={20} />)
      
      expect(screen.getByText(exactText)).toBeInTheDocument()
      expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument()
    })

    it('should truncate text at maxLength + 1', () => {
      const overLimitText = 'Exactly twenty char!!' // 21 characters (added one more !)
      render(<TruncatedText text={overLimitText} maxLength={20} />)
      
      // Since the text is 21 chars and maxLength is 20, it should be truncated
      expect(screen.getByText('Exactly twenty char!...')).toBeInTheDocument()
      // The original text appears in tooltip, so we check the truncated element doesn't contain full text
      const truncatedElement = screen.getByText('Exactly twenty char!...')
      expect(truncatedElement).not.toHaveTextContent(overLimitText)
    })
  })

  describe('Tooltip Functionality', () => {
    it('should render tooltip when text is truncated and showTooltip is true', () => {
      render(<TruncatedText text={longText} maxLength={20} showTooltip={true} />)
      
      expect(screen.getByTestId('tooltip-provider')).toBeInTheDocument()
      expect(screen.getByTestId('tooltip-root')).toBeInTheDocument()
      expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument()
    })

    it('should not render tooltip when text is not truncated', () => {
      render(<TruncatedText text={shortText} maxLength={20} showTooltip={true} />)
      
      expect(screen.queryByTestId('tooltip-provider')).not.toBeInTheDocument()
      expect(screen.queryByTestId('tooltip-root')).not.toBeInTheDocument()
    })

    it('should not render tooltip when showTooltip is false', () => {
      render(<TruncatedText text={longText} maxLength={20} showTooltip={false} />)
      
      expect(screen.queryByTestId('tooltip-provider')).not.toBeInTheDocument()
      expect(screen.queryByTestId('tooltip-root')).not.toBeInTheDocument()
    })

    it('should display custom tooltip content when provided', () => {
      const customTooltip = 'Custom tooltip content'
      render(
        <TruncatedText 
          text={longText} 
          maxLength={20} 
          tooltipContent={customTooltip}
        />
      )
      
      expect(screen.getByTestId('tooltip-content')).toHaveTextContent(customTooltip)
    })

    it('should display original text as tooltip when no custom tooltip provided', () => {
      render(<TruncatedText text={longText} maxLength={20} />)
      
      expect(screen.getByTestId('tooltip-content')).toHaveTextContent(longText)
    })
  })

  describe('HTML Element Rendering', () => {
    it('should render as span by default', () => {
      render(<TruncatedText text={shortText} maxLength={20} />)
      
      const element = screen.getByText(shortText)
      expect(element.tagName.toLowerCase()).toBe('span')
    })

    it('should render as specified HTML element', () => {
      render(<TruncatedText text={shortText} maxLength={20} as="div" />)
      
      const element = screen.getByText(shortText)
      expect(element.tagName.toLowerCase()).toBe('div')
    })

    it('should render as heading elements', () => {
      const headingElements = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
      
      headingElements.forEach((tag) => {
        const { unmount } = render(
          <TruncatedText text={`${tag} text`} maxLength={20} as={tag} />
        )
        
        const element = screen.getByText(`${tag} text`)
        expect(element.tagName.toLowerCase()).toBe(tag)
        
        unmount()
      })
    })

    it('should render as paragraph element', () => {
      render(<TruncatedText text={shortText} maxLength={20} as="p" />)
      
      const element = screen.getByText(shortText)
      expect(element.tagName.toLowerCase()).toBe('p')
    })
  })

  describe('CSS Classes and Styling', () => {
    it('should apply default classes', () => {
      render(<TruncatedText text={shortText} maxLength={20} />)
      
      const element = screen.getByText(shortText)
      expect(element).toHaveClass('inline-block')
    })

    it('should apply custom className', () => {
      const customClass = 'custom-text-class'
      render(<TruncatedText text={shortText} maxLength={20} className={customClass} />)
      
      const element = screen.getByText(shortText)
      expect(element).toHaveClass(customClass)
      expect(element).toHaveClass('inline-block')
    })

    it('should apply cursor-help class when text is truncated with tooltip', () => {
      render(<TruncatedText text={longText} maxLength={20} />)
      
      const truncatedElement = screen.getByText('This is a very long ...')
      expect(truncatedElement).toHaveClass('cursor-help')
    })

    it('should apply tooltip content classes', () => {
      render(<TruncatedText text={longText} maxLength={20} />)
      
      const tooltipContent = screen.getByTestId('tooltip-content')
      expect(tooltipContent).toHaveClass('z-50')
      expect(tooltipContent).toHaveClass('overflow-hidden')
      expect(tooltipContent).toHaveClass('rounded-md')
      expect(tooltipContent).toHaveClass('bg-gray-900')
      expect(tooltipContent).toHaveClass('text-white')
      expect(tooltipContent).toHaveClass('max-w-xs')
      expect(tooltipContent).toHaveClass('break-words')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const { container } = render(<TruncatedText text="" maxLength={20} />)
      
      const element = container.querySelector('span')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent('')
      expect(screen.queryByTestId('tooltip-provider')).not.toBeInTheDocument()
    })

    it('should handle maxLength of 0', () => {
      render(<TruncatedText text={shortText} maxLength={0} />)
      
      expect(screen.getByText('...')).toBeInTheDocument()
      // The original text appears in tooltip, so we check the truncated element doesn't contain full text
      const truncatedElement = screen.getByText('...')
      expect(truncatedElement).not.toHaveTextContent(shortText)
    })

    it('should handle negative maxLength', () => {
      render(<TruncatedText text={shortText} maxLength={-5} />)
      
      expect(screen.getByText('...')).toBeInTheDocument()
      // The original text appears in tooltip, so we check the truncated element doesn't contain full text
      const truncatedElement = screen.getByText('...')
      expect(truncatedElement).not.toHaveTextContent(shortText)
    })

    it('should handle very large maxLength', () => {
      render(<TruncatedText text={shortText} maxLength={1000} />)
      
      expect(screen.getByText(shortText)).toBeInTheDocument()
      expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument()
    })

    it('should handle special characters in text', () => {
      const specialText = 'Text with émojis 🚀 and spëcial chars!'
      render(<TruncatedText text={specialText} maxLength={15} />)
      
      expect(screen.getByText('Text with émoji...')).toBeInTheDocument()
    })

    it('should handle text with only spaces', () => {
      const spacesText = '     '
      const { container } = render(<TruncatedText text={spacesText} maxLength={3} />)
      
      // Find the span element and check its text content
      const spanElement = container.querySelector('span')
      expect(spanElement).toBeInTheDocument()
      expect(spanElement?.textContent).toBe('   ...')
    })
  })

  describe('Component Props Interface', () => {
    it('should accept all required props', () => {
      expect(() => {
        render(<TruncatedText text="test" maxLength={10} />)
      }).not.toThrow()
    })

    it('should accept all optional props', () => {
      expect(() => {
        render(
          <TruncatedText 
            text="test"
            maxLength={10}
            className="custom-class"
            showTooltip={false}
            tooltipContent="custom tooltip"
            as="div"
          />
        )
      }).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('should have proper cursor styling for interactive elements', () => {
      render(<TruncatedText text={longText} maxLength={20} />)
      
      const truncatedElement = screen.getByText('This is a very long ...')
      expect(truncatedElement).toHaveClass('cursor-help')
    })

    it('should maintain semantic HTML structure', () => {
      render(<TruncatedText text={longText} maxLength={20} as="h1" />)
      
      const element = screen.getByRole('heading', { level: 1 })
      expect(element).toBeInTheDocument()
    })
  })
})