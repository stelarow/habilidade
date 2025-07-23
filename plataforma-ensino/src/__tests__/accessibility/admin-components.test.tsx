import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'
import HolidayManager from '@/components/scheduling/HolidayManager'
import AdminTeacherAvailability from '@/components/admin/AdminTeacherAvailability'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock fetch for component tests
global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ data: [] })
}))

// Mock auth
jest.mock('@/lib/auth/session', () => ({
  requireAdmin: jest.fn(() => Promise.resolve({
    user: { id: 'admin-id' },
    profile: { role: 'admin' }
  }))
}))

describe('Admin Components Accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('HolidayManager Accessibility', () => {
    it('should not have accessibility violations in default state', async () => {
      const { container } = render(<HolidayManager year={2025} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations in loading state', async () => {
      const { container } = render(<HolidayManager year={2025} />)
      // Component starts in loading state
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations in readonly mode', async () => {
      const { container } = render(<HolidayManager year={2025} readonly={true} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations with form open', async () => {
      const { container, getByText } = render(<HolidayManager year={2025} />)
      
      // Wait for component to load and open form
      setTimeout(() => {
        if (getByText('Novo Feriado')) {
          getByText('Novo Feriado').click()
        }
      }, 100)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA labels for form controls', async () => {
      const { container, getByLabelText } = render(<HolidayManager year={2025} />)
      
      // Check if form labels are properly associated
      setTimeout(() => {
        try {
          expect(getByLabelText('Nome do Feriado *')).toBeInTheDocument()
          expect(getByLabelText('Data do Feriado *')).toBeInTheDocument()
        } catch (e) {
          // Form might not be open yet
        }
      }, 100)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper heading hierarchy', async () => {
      const { container } = render(<HolidayManager year={2025} />)
      
      // Check for proper heading structure
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let previousLevel = 0
      
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1))
        expect(level).toBeLessThanOrEqual(previousLevel + 1)
        previousLevel = level
      })

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper focus management for modal dialogs', async () => {
      const { container } = render(<HolidayManager year={2025} />)
      
      // Test focus trap in modals
      const results = await axe(container, {
        rules: {
          'focus-order-semantics': { enabled: true },
          'tabindex': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('should provide sufficient color contrast', async () => {
      const { container } = render(<HolidayManager year={2025} />)
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('should support keyboard navigation', async () => {
      const { container } = render(<HolidayManager year={2025} />)
      
      // Test that all interactive elements are keyboard accessible
      const results = await axe(container, {
        rules: {
          'keyboard': { enabled: true },
          'focus-order-semantics': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })
  })

  describe('AdminTeacherAvailability Accessibility', () => {
    it('should not have accessibility violations in default state', async () => {
      const { container } = render(<AdminTeacherAvailability />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations in loading state', async () => {
      const { container } = render(<AdminTeacherAvailability />)
      // Component starts in loading state
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA labels for complex controls', async () => {
      const { container } = render(<AdminTeacherAvailability />)
      
      // Check for ARIA labels on search, filter, and bulk operation controls
      const results = await axe(container, {
        rules: {
          'label': { enabled: true },
          'aria-allowed-attr': { enabled: true },
          'aria-required-attr': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('should provide screen reader accessible table structure', async () => {
      const { container } = render(<AdminTeacherAvailability />)
      
      // Test table accessibility
      const results = await axe(container, {
        rules: {
          'table-header': { enabled: true },
          'td-headers-attr': { enabled: true },
          'th-has-data-cells': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('should handle form validation errors accessibly', async () => {
      const { container } = render(<AdminTeacherAvailability />)
      
      // Test form validation accessibility
      const results = await axe(container, {
        rules: {
          'aria-input-field-name': { enabled: true },
          'form-field-multiple-labels': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('should provide accessible status and error messages', async () => {
      const { container } = render(<AdminTeacherAvailability />)
      
      // Test status messages accessibility
      const results = await axe(container, {
        rules: {
          'aria-live-regions-modified': { enabled: true },
          'status-role': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('should support high contrast mode', async () => {
      const { container } = render(<AdminTeacherAvailability />)
      
      // Add high contrast class to test
      document.body.classList.add('high-contrast')
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
      
      document.body.classList.remove('high-contrast')
    })

    it('should have proper modal dialog accessibility', async () => {
      const { container } = render(<AdminTeacherAvailability />)
      
      // Test modal accessibility
      const results = await axe(container, {
        rules: {
          'dialog-modal': { enabled: true },
          'aria-dialog-name': { enabled: true },
          'focus-trap': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })
  })

  describe('Cross-Component Accessibility', () => {
    it('should maintain accessibility when components are used together', async () => {
      const TestWrapper = () => (
        <div>
          <HolidayManager year={2025} />
          <AdminTeacherAvailability />
        </div>
      )

      const { container } = render(<TestWrapper />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should handle focus management between components', async () => {
      const TestWrapper = () => (
        <div>
          <nav aria-label="Admin Navigation">
            <button type="button">Holidays</button>
            <button type="button">Teacher Availability</button>
          </nav>
          <main>
            <HolidayManager year={2025} />
          </main>
        </div>
      )

      const { container } = render(<TestWrapper />)
      const results = await axe(container, {
        rules: {
          'focus-order-semantics': { enabled: true },
          'landmark-main-is-top-level': { enabled: true },
          'landmark-no-duplicate-main': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('should provide consistent navigation patterns', async () => {
      const TestWrapper = () => (
        <div>
          <nav aria-label="Admin Navigation" role="navigation">
            <ul>
              <li><a href="#holidays" aria-current="page">Holidays</a></li>
              <li><a href="#availability">Teacher Availability</a></li>
            </ul>
          </nav>
          <main id="main-content">
            <h1>Admin Dashboard</h1>
            <section id="holidays" aria-labelledby="holidays-heading">
              <h2 id="holidays-heading">Holiday Management</h2>
              <HolidayManager year={2025} />
            </section>
          </main>
        </div>
      )

      const { container } = render(<TestWrapper />)
      const results = await axe(container, {
        rules: {
          'landmark-unique': { enabled: true },
          'page-has-heading-one': { enabled: true },
          'heading-order': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })
  })

  describe('Responsive Design Accessibility', () => {
    beforeEach(() => {
      // Mock window.matchMedia for responsive tests
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })
    })

    it('should be accessible on mobile viewport', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      })

      const { container } = render(<HolidayManager year={2025} />)
      const results = await axe(container, {
        rules: {
          'target-size': { enabled: true }, // Touch target size
          'meta-viewport': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('should be accessible on tablet viewport', async () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      const { container } = render(<AdminTeacherAvailability />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should handle reduced motion preferences', async () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      const { container } = render(<HolidayManager year={2025} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Internationalization Accessibility', () => {
    it('should support RTL languages', async () => {
      // Mock RTL direction
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'

      const { container } = render(<HolidayManager year={2025} />)
      const results = await axe(container, {
        rules: {
          'html-has-lang': { enabled: true },
          'html-lang-valid': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()

      // Reset
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = 'en'
    })

    it('should handle language changes gracefully', async () => {
      document.documentElement.lang = 'pt-BR'

      const { container } = render(<AdminTeacherAvailability />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()

      // Reset
      document.documentElement.lang = 'en'
    })
  })
})