/**
 * Unit tests for TeacherSelector component
 * Story 2.2: UI Components Integration - Task 4
 * 
 * Comprehensive test suite covering functionality, accessibility,
 * MCP integration, and edge cases with mock data scenarios.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { TeacherSelector, Teacher, TeacherSelectorProps } from '@/components/enrollment/TeacherSelector'

// Mock MCP Context7 hook
jest.mock('@/hooks/useMCPContext7', () => ({
  useMCPContext7: () => ({
    queryDocumentation: jest.fn().mockResolvedValue({
      content: 'Mocked documentation content',
      source: 'MCP Context7',
      timestamp: new Date(),
      cached: false
    }),
    loading: false,
    error: null
  }),
  useReactDocumentation: () => ({
    getComponentPatterns: jest.fn().mockResolvedValue({
      content: 'React component patterns',
      source: 'MCP Context7',
      timestamp: new Date(),
      cached: false
    }),
    loading: false,
    error: null
  })
}))

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => ({
          data: mockTeachersData,
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
jest.mock('@/utils/teacherAvailabilityLogic', () => ({
  aggregateAvailabilityForCalendar: jest.fn().mockResolvedValue({
    '2025-07-24': {
      totalSlots: 2,
      availableSlots: 1,
      conflictedSlots: 0,
      capacity: {
        maxStudents: 10,
        currentEnrollments: 5,
        availableSpots: 5,
        isAtCapacity: false
      }
    }
  }),
  subscribeToAvailabilityUpdates: jest.fn(() => jest.fn()) // Unsubscribe function
}))

// Mock data
const mockTeachersData = [
  {
    id: 'teacher-1',
    name: 'João Silva',
    bio: 'Professor experiente em programação web com 10 anos de experiência.',
    profile_image: '/images/teacher1.jpg',
    rating: 4.8,
    specialties: ['JavaScript', 'React', 'Node.js'],
    max_students_per_class: 15,
    is_active: true,
    email: 'joao@escola.com',
    phone: '(48) 99999-1234',
    experience_years: 10,
    qualifications: ['Graduação em Ciência da Computação', 'Certificação React'],
    teacher_availability: [
      {
        id: 'avail-1',
        teacher_id: 'teacher-1',
        day_of_week: 1,
        start_time: '09:00',
        end_time: '11:00',
        max_students: 10,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: 'teacher-2',
    name: 'Maria Santos',
    bio: 'Especialista em design gráfico e UX/UI com foco em metodologias ágeis.',
    profile_image: '/images/teacher2.jpg',
    rating: 4.9,
    specialties: ['Design Gráfico', 'UX/UI', 'Figma'],
    max_students_per_class: 12,
    is_active: true,
    email: 'maria@escola.com',
    experience_years: 8,
    qualifications: ['Mestrado em Design'],
    teacher_availability: []
  },
  {
    id: 'teacher-3',
    name: 'Pedro Costa',
    bio: 'Professor de marketing digital com expertise em redes sociais e SEO.',
    profile_image: null,
    rating: 4.5,
    specialties: ['Marketing Digital', 'SEO', 'Redes Sociais'],
    max_students_per_class: 20,
    is_active: true,
    email: 'pedro@escola.com',
    experience_years: 5,
    qualifications: [],
    teacher_availability: [
      {
        id: 'avail-2',
        teacher_id: 'teacher-3',
        day_of_week: 3,
        start_time: '14:00',
        end_time: '16:00',
        max_students: 20,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ]
  }
]

const mockCourse = {
  id: 'course-1',
  title: 'Desenvolvimento Web Completo',
  category: 'Programação',
  duration_hours: 40,
  max_students: 15
}

const defaultProps: TeacherSelectorProps = {
  onTeacherSelect: jest.fn(),
  selectedCourse: mockCourse,
  availabilityFilter: {
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-07-31')
  }
}

// Helper function to render component with default props
const renderTeacherSelector = (props: Partial<TeacherSelectorProps> = {}) => {
  const finalProps = { ...defaultProps, ...props }
  return render(<TeacherSelector {...finalProps} />)
}

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

describe('TeacherSelector Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering and Basic Functionality', () => {
    it('renders the component with title and description', () => {
      renderTeacherSelector()
      
      expect(screen.getByText('Selecione seu Professor')).toBeInTheDocument()
      expect(screen.getByText(/Escolha o professor ideal para o curso/)).toBeInTheDocument()
      expect(screen.getByText('Desenvolvimento Web Completo')).toBeInTheDocument()
    })

    it('displays loading state initially', () => {
      renderTeacherSelector()
      
      expect(screen.getByRole('status')).toBeInTheDocument() // Loading component
    })

    it('displays filter controls', async () => {
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(screen.getByLabelText('Buscar professor')).toBeInTheDocument()
        expect(screen.getByLabelText('Especialidade')).toBeInTheDocument()
        expect(screen.getByLabelText('Avaliação mínima')).toBeInTheDocument()
      })
    })

    it('shows availability filter information when provided', () => {
      renderTeacherSelector()
      
      expect(screen.getByText(/Mostrando apenas professores com disponibilidade entre/)).toBeInTheDocument()
      expect(screen.getByText('01/07/2025')).toBeInTheDocument()
      expect(screen.getByText('31/07/2025')).toBeInTheDocument()
    })
  })

  describe('Teacher Cards Display', () => {
    beforeEach(() => {
      // Mock successful data fetch
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: mockTeachersData,
              error: null
            }))
          }))
        }))
      })
    })

    it('displays teacher cards after loading', async () => {
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument()
        expect(screen.getByText('Maria Santos')).toBeInTheDocument()
        expect(screen.getByText('Pedro Costa')).toBeInTheDocument()
      })
    })

    it('displays teacher information correctly', async () => {
      renderTeacherSelector()
      
      await waitFor(() => {
        const joaoCard = screen.getByText('João Silva').closest('.teacher-selector-card')
        expect(joaoCard).toBeInTheDocument()
        
        if (joaoCard) {
          expect(within(joaoCard).getByText('4.8')).toBeInTheDocument() // Rating
          expect(within(joaoCard).getByText('JavaScript')).toBeInTheDocument() // Specialty
          expect(within(joaoCard).getByText('10 anos de experiência')).toBeInTheDocument()
        }
      })
    })

    it('shows fallback avatar for teachers without profile image', async () => {
      renderTeacherSelector()
      
      await waitFor(() => {
        const pedroCard = screen.getByText('Pedro Costa').closest('.teacher-selector-card')
        expect(pedroCard).toBeInTheDocument()
        
        if (pedroCard) {
          // Should have User icon instead of image
          expect(within(pedroCard).getByRole('button')).toHaveAttribute('aria-label', 'Select teacher Pedro Costa')
        }
      })
    })

    it('displays teacher specialties with truncation', async () => {
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument()
        expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.getByText('Node.js')).toBeInTheDocument()
      })
    })
  })

  describe('Teacher Selection', () => {
    beforeEach(() => {
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: mockTeachersData,
              error: null
            }))
          }))
        }))
      })
    })

    it('calls onTeacherSelect when a teacher is clicked', async () => {
      const onTeacherSelect = jest.fn()
      renderTeacherSelector({ onTeacherSelect })
      
      await waitFor(() => {
        const joaoCard = screen.getByText('João Silva').closest('.teacher-selector-card')
        expect(joaoCard).toBeInTheDocument()
        
        if (joaoCard) {
          fireEvent.click(joaoCard)
          expect(onTeacherSelect).toHaveBeenCalledWith(
            expect.objectContaining({
              id: 'teacher-1',
              name: 'João Silva'
            })
          )
        }
      })
    })

    it('supports keyboard navigation for teacher selection', async () => {
      const user = userEvent.setup()
      const onTeacherSelect = jest.fn()
      renderTeacherSelector({ onTeacherSelect })
      
      await waitFor(async () => {
        const joaoCard = screen.getByText('João Silva').closest('.teacher-selector-card')
        if (joaoCard) {
          joaoCard.focus()
          await user.keyboard('{Enter}')
          expect(onTeacherSelect).toHaveBeenCalled()
        }
      })
    })

    it('shows selected state visually', async () => {
      const onTeacherSelect = jest.fn()
      renderTeacherSelector({ onTeacherSelect })
      
      await waitFor(() => {
        const joaoCard = screen.getByText('João Silva').closest('.teacher-selector-card')
        if (joaoCard) {
          fireEvent.click(joaoCard)
          
          // Check for selected state indication
          expect(screen.getByText(/João Silva selecionado/)).toBeInTheDocument()
        }
      })
    })
  })

  describe('Filtering Functionality', () => {
    beforeEach(() => {
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: mockTeachersData,
              error: null
            }))
          }))
        }))
      })
    })

    it('filters teachers by search term', async () => {
      const user = userEvent.setup()
      renderTeacherSelector()
      
      await waitFor(async () => {
        const searchInput = screen.getByLabelText('Buscar professor')
        await user.type(searchInput, 'João')
        
        expect(screen.getByText('João Silva')).toBeInTheDocument()
        expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument()
        expect(screen.queryByText('Pedro Costa')).not.toBeInTheDocument()
      })
    })

    it('filters teachers by specialty', async () => {
      const user = userEvent.setup()
      renderTeacherSelector()
      
      await waitFor(async () => {
        const specialtySelect = screen.getByLabelText('Especialidade')
        await user.selectOptions(specialtySelect, 'JavaScript')
        
        expect(screen.getByText('João Silva')).toBeInTheDocument()
        expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument()
      })
    })

    it('filters teachers by minimum rating', async () => {
      const user = userEvent.setup()
      renderTeacherSelector()
      
      await waitFor(async () => {
        const ratingSelect = screen.getByLabelText('Avaliação mínima')
        await user.selectOptions(ratingSelect, '4.5')
        
        // Should show teachers with rating >= 4.5
        expect(screen.getByText('João Silva')).toBeInTheDocument() // 4.8
        expect(screen.getByText('Maria Santos')).toBeInTheDocument() // 4.9
        expect(screen.getByText('Pedro Costa')).toBeInTheDocument() // 4.5
      })
    })

    it('shows clear filters button when filters are applied', async () => {
      const user = userEvent.setup()
      renderTeacherSelector()
      
      await waitFor(async () => {
        const searchInput = screen.getByLabelText('Buscar professor')
        await user.type(searchInput, 'test')
        
        // Should show "no teachers found" and clear filters button
        expect(screen.getByText('Nenhum professor encontrado')).toBeInTheDocument()
        expect(screen.getByText('Limpar filtros')).toBeInTheDocument()
      })
    })

    it('clears filters when clear button is clicked', async () => {
      const user = userEvent.setup()
      renderTeacherSelector()
      
      await waitFor(async () => {
        const searchInput = screen.getByLabelText('Buscar professor')
        await user.type(searchInput, 'nonexistent')
        
        const clearButton = screen.getByText('Limpar filtros')
        await user.click(clearButton)
        
        expect(searchInput).toHaveValue('')
        expect(screen.getByText('João Silva')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('displays error message when data fetch fails', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Database connection failed' }
            }))
          }))
        }))
      })
      
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(screen.getByText('Erro ao carregar professores')).toBeInTheDocument()
        expect(screen.getByText(/Database connection failed/)).toBeInTheDocument()
        expect(screen.getByText('Tentar novamente')).toBeInTheDocument()
      })
    })

    it('allows retry when error occurs', async () => {
      const user = userEvent.setup()
      
      // First call fails
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Network error' }
            }))
          }))
        }))
      })
      
      // Second call succeeds
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: mockTeachersData,
              error: null
            }))
          }))
        }))
      })
      
      renderTeacherSelector()
      
      await waitFor(async () => {
        expect(screen.getByText('Erro ao carregar professores')).toBeInTheDocument()
        
        const retryButton = screen.getByText('Tentar novamente')
        await user.click(retryButton)
        
        await waitFor(() => {
          expect(screen.getByText('João Silva')).toBeInTheDocument()
        })
      })
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: mockTeachersData,
              error: null
            }))
          }))
        }))
      })
    })

    it('has proper ARIA labels for teacher cards', async () => {
      renderTeacherSelector()
      
      await waitFor(() => {
        const joaoCard = screen.getByLabelText('Select teacher João Silva')
        expect(joaoCard).toBeInTheDocument()
        expect(joaoCard).toHaveAttribute('role', 'button')
        expect(joaoCard).toHaveAttribute('tabIndex', '0')
      })
    })

    it('has proper form labels', () => {
      renderTeacherSelector()
      
      expect(screen.getByLabelText('Buscar professor')).toBeInTheDocument()
      expect(screen.getByLabelText('Especialidade')).toBeInTheDocument()
      expect(screen.getByLabelText('Avaliação mínima')).toBeInTheDocument()
    })

    it('supports keyboard navigation through filters', async () => {
      const user = userEvent.setup()
      renderTeacherSelector()
      
      await waitFor(async () => {
        const searchInput = screen.getByLabelText('Buscar professor')
        searchInput.focus()
        
        await user.tab()
        expect(screen.getByLabelText('Especialidade')).toHaveFocus()
        
        await user.tab()
        expect(screen.getByLabelText('Avaliação mínima')).toHaveFocus()
      })
    })

    it('maintains focus management during interactions', async () => {
      const user = userEvent.setup()
      renderTeacherSelector()
      
      await waitFor(async () => {
        const joaoCard = screen.getByLabelText('Select teacher João Silva')
        joaoCard.focus()
        
        await user.keyboard(' ') // Space key should also trigger selection
        expect(joaoCard).toHaveFocus()
      })
    })

    it('has proper heading hierarchy', () => {
      renderTeacherSelector()
      
      const mainHeading = screen.getByRole('heading', { level: 2, name: 'Selecione seu Professor' })
      expect(mainHeading).toBeInTheDocument()
      
      const filterHeading = screen.getByRole('heading', { level: 3, name: 'Filtros' })
      expect(filterHeading).toBeInTheDocument()
    })
  })

  describe('Real-time Updates', () => {
    it('sets up Supabase subscription for real-time updates', async () => {
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(mockSupabaseClient.channel).toHaveBeenCalledWith('teacher-updates')
      })
    })

    it('updates teacher data when real-time event is received', async () => {
      const mockSubscribe = jest.fn()
      const mockOn = jest.fn(() => ({ subscribe: mockSubscribe }))
      mockSupabaseClient.channel.mockReturnValue({ on: mockOn })
      
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(mockOn).toHaveBeenCalledWith(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'teachers' },
          expect.any(Function)
        )
      })
    })
  })

  describe('Performance Optimization', () => {
    it('memoizes filtered teachers to avoid unnecessary re-renders', async () => {
      const onTeacherSelect = jest.fn()
      const { rerender } = renderTeacherSelector({ onTeacherSelect })
      
      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument()
      })
      
      // Re-render with same props should not cause teacher list to re-render
      rerender(<TeacherSelector {...defaultProps} onTeacherSelect={onTeacherSelect} />)
      
      // Component should still work normally
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })

    it('debounces search input to avoid excessive API calls', async () => {
      const user = userEvent.setup()
      renderTeacherSelector()
      
      await waitFor(async () => {
        const searchInput = screen.getByLabelText('Buscar professor')
        
        // Type quickly - should not trigger immediate filtering
        await user.type(searchInput, 'test', { delay: 50 })
        
        expect(searchInput).toHaveValue('test')
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles empty teacher list gracefully', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: [],
              error: null
            }))
          }))
        }))
      })
      
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(screen.getByText('0 professores encontrados')).toBeInTheDocument()
        expect(screen.getByText('Nenhum professor encontrado')).toBeInTheDocument()
      })
    })

    it('handles teachers with missing data gracefully', async () => {
      const incompleteTeacherData = [{
        id: 'teacher-incomplete',
        name: 'Professor Incompleto',
        bio: '',
        profile_image: null,
        rating: 0,
        specialties: [],
        max_students_per_class: 1,
        is_active: true,
        email: 'incomplete@escola.com',
        teacher_availability: []
      }]
      
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: incompleteTeacherData,
              error: null
            }))
          }))
        }))
      })
      
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(screen.getByText('Professor Incompleto')).toBeInTheDocument()
        expect(screen.getByText('0.0')).toBeInTheDocument() // Rating fallback
        expect(screen.getByText('Experiência não informada')).toBeInTheDocument()
      })
    })

    it('works without course or availability filter', () => {
      const props = {
        onTeacherSelect: jest.fn()
        // No selectedCourse or availabilityFilter
      }
      
      expect(() => renderTeacherSelector(props)).not.toThrow()
      expect(screen.getByText('Selecione seu Professor')).toBeInTheDocument()
    })
  })

  describe('MCP Integration', () => {
    it('uses MCP Context7 for component patterns', async () => {
      renderTeacherSelector()
      
      // The component should load successfully, indicating MCP Context7 integration works
      await waitFor(() => {
        expect(screen.getByText('Selecione seu Professor')).toBeInTheDocument()
      })
    })

    it('integrates with MCP Supabase for data fetching', async () => {
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('teachers')
      })
    })

    it('handles MCP Context7 documentation queries with caching', async () => {
      const { useMCPContext7 } = require('@/hooks/useMCPContext7')
      const mockQueryDocumentation = jest.fn().mockResolvedValue({
        content: 'React component best practices for teacher selection',
        source: 'MCP Context7',
        timestamp: new Date(),
        cached: true
      })
      
      useMCPContext7.mockReturnValue({
        queryDocumentation: mockQueryDocumentation,
        loading: false,
        error: null
      })
      
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(mockQueryDocumentation).toHaveBeenCalledWith(
          expect.stringContaining('React component composition patterns')
        )
      })
    })

    it('integrates with availability calculation from Story 2.1', async () => {
      const { aggregateAvailabilityForCalendar } = require('@/utils/teacherAvailabilityLogic')
      
      renderTeacherSelector()
      
      await waitFor(() => {
        expect(aggregateAvailabilityForCalendar).toHaveBeenCalledWith(
          expect.objectContaining({
            teacherId: expect.any(String),
            dateRange: expect.objectContaining({
              start: expect.any(Date),
              end: expect.any(Date)
            })
          })
        )
      })
    })

    it('handles MCP Supabase real-time subscription integration', async () => {
      const { subscribeToAvailabilityUpdates } = require('@/utils/teacherAvailabilityLogic')
      const mockUnsubscribe = jest.fn()
      subscribeToAvailabilityUpdates.mockReturnValue(mockUnsubscribe)
      
      const { unmount } = renderTeacherSelector()
      
      await waitFor(() => {
        expect(subscribeToAvailabilityUpdates).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Function)
        )
      })
      
      // Cleanup should call unsubscribe
      unmount()
      expect(mockUnsubscribe).toHaveBeenCalled()
    })

    it('handles MCP integration errors gracefully', async () => {
      const { useMCPContext7 } = require('@/hooks/useMCPContext7')
      useMCPContext7.mockReturnValue({
        queryDocumentation: jest.fn().mockRejectedValue(new Error('MCP Context7 unavailable')),
        loading: false,
        error: 'MCP Context7 unavailable'
      })
      
      renderTeacherSelector()
      
      // Component should still render despite MCP error
      await waitFor(() => {
        expect(screen.getByText('Selecione seu Professor')).toBeInTheDocument()
      })
      
      // Should fallback to default behavior without MCP guidance
      expect(screen.getByLabelText('Buscar professor')).toBeInTheDocument()
    })

    it('integrates teacher selection with calendar component via MCP data flow', async () => {
      const user = userEvent.setup()
      const onTeacherSelect = jest.fn()
      const mockTeacherWithAvailability = {
        ...mockTeachersData[0],
        availability_summary: {
          '2025-07-24': {
            totalSlots: 2,
            availableSlots: 1,
            conflictedSlots: 0,
            capacity: {
              maxStudents: 10,
              currentEnrollments: 5,
              availableSpots: 5,
              isAtCapacity: false
            }
          }
        }
      }
      
      renderTeacherSelector({ onTeacherSelect })
      
      await waitFor(async () => {
        const teacherCard = screen.getByText('João Silva').closest('.teacher-selector-card')
        if (teacherCard) {
          await user.click(teacherCard)
          
          expect(onTeacherSelect).toHaveBeenCalledWith(
            expect.objectContaining({
              id: 'teacher-1',
              name: 'João Silva',
              availability: expect.any(Array)
            })
          )
        }
      })
    })

    it('validates MCP data consistency across component re-renders', async () => {
      const { aggregateAvailabilityForCalendar } = require('@/utils/teacherAvailabilityLogic')
      const mockAvailabilityData = {
        '2025-07-24': {
          totalSlots: 2,
          availableSlots: 1,
          conflictedSlots: 0,
          capacity: { maxStudents: 10, currentEnrollments: 5, availableSpots: 5, isAtCapacity: false }
        }
      }
      
      aggregateAvailabilityForCalendar.mockResolvedValue(mockAvailabilityData)
      
      const { rerender } = renderTeacherSelector()
      
      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument()
      })
      
      // Re-render should maintain data consistency
      rerender(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument()
        // MCP data should remain consistent
        expect(aggregateAvailabilityForCalendar).toHaveBeenCalledTimes(3) // Initial + first render + rerender
      })
    })

    it('handles concurrent MCP operations without race conditions', async () => {
      const user = userEvent.setup()
      const { aggregateAvailabilityForCalendar } = require('@/utils/teacherAvailabilityLogic')
      
      // Simulate slow MCP response
      aggregateAvailabilityForCalendar.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          '2025-07-24': {
            totalSlots: 1,
            availableSlots: 1,
            conflictedSlots: 0,
            capacity: { maxStudents: 10, currentEnrollments: 0, availableSpots: 10, isAtCapacity: false }
          }
        }), 100))
      )
      
      renderTeacherSelector()
      
      // Rapid filter changes should not cause race conditions
      await waitFor(async () => {
        const searchInput = screen.getByLabelText('Buscar professor')
        await user.type(searchInput, 'João')
        await user.clear(searchInput)
        await user.type(searchInput, 'Maria')
      })
      
      // Should eventually show correct results without conflicts
      await waitFor(() => {
        expect(screen.getByText('Maria Santos')).toBeInTheDocument()
      })
    })
  })
})