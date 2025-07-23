/**
 * TeacherSelector Component Unit Tests
 * Story 3.1: Teacher Enrollment Integration - Task 1
 * 
 * Comprehensive test suite for TeacherSelector component covering:
 * - Component rendering and UI elements
 * - Teacher data loading and display
 * - Teacher selection functionality
 * - Filter and search functionality
 * - Error handling and loading states
 * - Accessibility compliance
 * - Real-time updates
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { createBrowserClient } from '@supabase/ssr'
import { TeacherSelector, Teacher } from '@/components/enrollment/TeacherSelector'
import { aggregateAvailabilityForCalendar, subscribeToAvailabilityUpdates } from '@/utils/teacherAvailabilityLogic'

// Mock dependencies
jest.mock('@supabase/ssr')
jest.mock('@/utils/teacherAvailabilityLogic')
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
}))

const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => ({
          order: jest.fn(() => ({
            // Mock successful response
            data: mockTeachersData,
            error: null
          }))
        }))
      }))
    }))
  }))
}

const mockTeachersData = [
  {
    id: 'teacher-1',
    name: 'Professor João Silva',
    bio: 'Especialista em programação web com 10 anos de experiência.',
    profile_image: '/images/teachers/joao.jpg',
    rating: 4.8,
    specialties: ['JavaScript', 'React', 'Node.js'],
    max_students_per_class: 15,
    is_active: true,
    email: 'joao@escola.com',
    phone: '(48) 99999-1111',
    experience_years: 10,
    qualifications: ['Bacharel em Ciência da Computação', 'Especialização em Web Development'],
    teacher_availability: [
      {
        id: 'avail-1',
        teacher_id: 'teacher-1',
        day_of_week: 1,
        start_time: '09:00',
        end_time: '11:00',
        max_students: 15,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: 'teacher-2',
    name: 'Professora Maria Santos',
    bio: 'Designer gráfica com foco em UX/UI e branding.',
    profile_image: null,
    rating: 4.9,
    specialties: ['Design Gráfico', 'UX/UI', 'Photoshop'],
    max_students_per_class: 12,
    is_active: true,
    email: 'maria@escola.com',
    phone: '(48) 99999-2222',
    experience_years: 8,
    qualifications: ['Bacharel em Design', 'Especialização em UX'],
    teacher_availability: [
      {
        id: 'avail-2',
        teacher_id: 'teacher-2',
        day_of_week: 2,
        start_time: '14:00',
        end_time: '16:00',
        max_students: 12,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: 'teacher-3',
    name: 'Professor Pedro Oliveira',
    bio: 'Especialista em marketing digital e redes sociais.',
    profile_image: '/images/teachers/pedro.jpg',
    rating: 4.6,
    specialties: ['Marketing Digital', 'Google Ads', 'SEO'],
    max_students_per_class: 20,
    is_active: false, // Inactive teacher
    email: 'pedro@escola.com',
    phone: '(48) 99999-3333',
    experience_years: 6,
    qualifications: ['Bacharel em Marketing'],
    teacher_availability: []
  }
]

const mockCourse = {
  id: 'course-1',
  title: 'Curso de Programação Web',
  category: 'Programação',
  duration_hours: 40,
  max_students: 15
}

// Mock implementations
beforeEach(() => {
  jest.clearAllMocks()
  ;(createBrowserClient as jest.Mock).mockReturnValue(mockSupabase)
  ;(aggregateAvailabilityForCalendar as jest.Mock).mockResolvedValue({
    '2025-01-27': {
      availableSlots: 5,
      capacity: { maxStudents: 15, currentEnrollments: 10 }
    }
  })
  ;(subscribeToAvailabilityUpdates as jest.Mock).mockImplementation(() => jest.fn())
})

describe('TeacherSelector Component', () => {
  const defaultProps = {
    onTeacherSelect: jest.fn(),
    selectedCourse: mockCourse,
    availabilityFilter: {
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31')
    }
  }

  describe('Component Rendering', () => {
    test('renders component with title and description', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      expect(screen.getByText('Selecione seu Professor')).toBeInTheDocument()
      expect(screen.getByText(/Escolha o professor ideal para o curso/)).toBeInTheDocument()
      expect(screen.getByText('Curso de Programação Web')).toBeInTheDocument()
    })

    test('shows loading state initially', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })

    test('renders filter controls', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByLabelText('Buscar professor')).toBeInTheDocument()
        expect(screen.getByLabelText('Especialidade')).toBeInTheDocument()
        expect(screen.getByLabelText('Avaliação mínima')).toBeInTheDocument()
      })
    })
  })

  describe('Teacher Data Loading', () => {
    test('loads and displays teacher data', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
        expect(screen.getByText('Professora Maria Santos')).toBeInTheDocument()
      })

      // Should not show inactive teacher
      expect(screen.queryByText('Professor Pedro Oliveira')).not.toBeInTheDocument()
    })

    test('displays teacher information correctly', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        const joaoCard = screen.getByText('Professor João Silva').closest('[role="button"]')
        expect(joaoCard).toBeInTheDocument()
        
        if (joaoCard) {
          expect(within(joaoCard).getByText('4.8')).toBeInTheDocument()
          expect(within(joaoCard).getByText('JavaScript')).toBeInTheDocument()
          expect(within(joaoCard).getByText('React')).toBeInTheDocument()
          expect(within(joaoCard).getByText('10 anos de experiência')).toBeInTheDocument()
        }
      })
    })

    test('shows teacher count', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('2 professores encontrados')).toBeInTheDocument()
      })
    })
  })

  describe('Teacher Selection', () => {
    test('calls onTeacherSelect when teacher is clicked', async () => {
      const onTeacherSelect = jest.fn()
      render(<TeacherSelector {...defaultProps} onTeacherSelect={onTeacherSelect} />)
      
      await waitFor(() => {
        const teacherCard = screen.getByText('Professor João Silva').closest('[role="button"]')
        expect(teacherCard).toBeInTheDocument()
      })

      const teacherCard = screen.getByText('Professor João Silva').closest('[role="button"]')!
      fireEvent.click(teacherCard)
      
      expect(onTeacherSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'teacher-1',
          name: 'Professor João Silva',
          email: 'joao@escola.com'
        })
      )
    })

    test('shows selected teacher state', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        const teacherCard = screen.getByText('Professor João Silva').closest('[role="button"]')
        fireEvent.click(teacherCard!)
      })

      await waitFor(() => {
        expect(screen.getByText('✓ Professor João Silva selecionado')).toBeInTheDocument()
      })
    })

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        const teacherCard = screen.getByText('Professor João Silva').closest('[role="button"]')
        expect(teacherCard).toBeInTheDocument()
      })

      const teacherCard = screen.getByText('Professor João Silva').closest('[role="button"]')!
      teacherCard.focus()
      
      await user.keyboard('{Enter}')
      
      expect(defaultProps.onTeacherSelect).toHaveBeenCalled()
    })
  })

  describe('Search and Filter Functionality', () => {
    test('filters teachers by search term', async () => {
      const user = userEvent.setup()
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
        expect(screen.getByText('Professora Maria Santos')).toBeInTheDocument()
      })

      const searchInput = screen.getByLabelText('Buscar professor')
      await user.type(searchInput, 'João')
      
      await waitFor(() => {
        expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
        expect(screen.queryByText('Professora Maria Santos')).not.toBeInTheDocument()
        expect(screen.getByText('1 professor encontrado')).toBeInTheDocument()
      })
    })

    test('filters teachers by specialty', async () => {
      const user = userEvent.setup()
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        const specialtySelect = screen.getByLabelText('Especialidade')
        expect(specialtySelect).toBeInTheDocument()
      })

      const specialtySelect = screen.getByLabelText('Especialidade')
      await user.selectOptions(specialtySelect, 'JavaScript')
      
      await waitFor(() => {
        expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
        expect(screen.queryByText('Professora Maria Santos')).not.toBeInTheDocument()
      })
    })

    test('filters teachers by minimum rating', async () => {
      const user = userEvent.setup()
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        const ratingSelect = screen.getByLabelText('Avaliação mínima')
        expect(ratingSelect).toBeInTheDocument()
      })

      const ratingSelect = screen.getByLabelText('Avaliação mínima')
      await user.selectOptions(ratingSelect, '4.8')
      
      await waitFor(() => {
        expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
        expect(screen.getByText('Professora Maria Santos')).toBeInTheDocument()
      })
    })

    test('shows no results message when no teachers match filters', async () => {
      const user = userEvent.setup()
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        const searchInput = screen.getByLabelText('Buscar professor')
        expect(searchInput).toBeInTheDocument()
      })

      const searchInput = screen.getByLabelText('Buscar professor')
      await user.type(searchInput, 'Professor Inexistente')
      
      await waitFor(() => {
        expect(screen.getByText('🔍 Nenhum professor encontrado')).toBeInTheDocument()
        expect(screen.getByText('Limpar filtros')).toBeInTheDocument()
      })
    })

    test('clears filters when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<TeacherSelector {...defaultProps} />)
      
      // Apply search filter
      await waitFor(() => {
        const searchInput = screen.getByLabelText('Buscar professor')
        expect(searchInput).toBeInTheDocument()
      })

      const searchInput = screen.getByLabelText('Buscar professor')
      await user.type(searchInput, 'NonExistent')
      
      await waitFor(() => {
        expect(screen.getByText('Limpar filtros')).toBeInTheDocument()
      })

      // Click clear filters
      const clearButton = screen.getByText('Limpar filtros')
      await user.click(clearButton)
      
      await waitFor(() => {
        expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
        expect(screen.getByText('Professora Maria Santos')).toBeInTheDocument()
        expect(searchInput).toHaveValue('')
      })
    })
  })

  describe('Error Handling', () => {
    test('displays error state when data loading fails', async () => {
      const errorMockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(() => ({
                order: jest.fn(() => ({
                  data: null,
                  error: { message: 'Database connection failed' }
                }))
              }))
            }))
          }))
        }))
      }
      
      ;(createBrowserClient as jest.Mock).mockReturnValue(errorMockSupabase)
      
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('❌ Erro ao carregar professores')).toBeInTheDocument()
        expect(screen.getByText('Failed to fetch teachers: Database connection failed')).toBeInTheDocument()
        expect(screen.getByText('Tentar novamente')).toBeInTheDocument()
      })
    })

    test('retry button works on error state', async () => {
      const user = userEvent.setup()
      
      // First call fails
      const errorMockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(() => ({
                order: jest.fn(() => ({
                  data: null,
                  error: { message: 'Network error' }
                }))
              }))
            }))
          }))
        }))
      }
      
      ;(createBrowserClient as jest.Mock).mockReturnValueOnce(errorMockSupabase)
      
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('Tentar novamente')).toBeInTheDocument()
      })

      // Second call succeeds
      ;(createBrowserClient as jest.Mock).mockReturnValue(mockSupabase)
      
      const retryButton = screen.getByText('Tentar novamente')
      await user.click(retryButton)
      
      await waitFor(() => {
        expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        const teacherCards = screen.getAllByRole('button')
        expect(teacherCards).toHaveLength(2) // 2 active teachers
        
        teacherCards.forEach(card => {
          expect(card).toHaveAttribute('aria-label')
          expect(card).toHaveAttribute('aria-pressed')
        })
      })
    })

    test('search input has proper labeling', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        const searchInput = screen.getByLabelText('Buscar professor')
        expect(searchInput).toHaveAttribute('placeholder', 'Nome ou especialidade...')
      })
    })

    test('select elements have proper labeling', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByLabelText('Especialidade')).toBeInTheDocument()
        expect(screen.getByLabelText('Avaliação mínima')).toBeInTheDocument()
      })
    })
  })

  describe('Real-time Updates', () => {
    test('sets up real-time subscriptions for teachers', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
      })

      expect(subscribeToAvailabilityUpdates).toHaveBeenCalledWith(
        'teacher-1',
        expect.any(Function)
      )
      expect(subscribeToAvailabilityUpdates).toHaveBeenCalledWith(
        'teacher-2',
        expect.any(Function)
      )
    })
  })

  describe('Availability Integration', () => {
    test('calculates and displays availability information', async () => {
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        const joaoCard = screen.getByText('Professor João Silva').closest('[role="button"]')
        expect(joaoCard).toBeInTheDocument()
        
        if (joaoCard) {
          expect(within(joaoCard).getByText('5 slots disponíveis')).toBeInTheDocument()
          expect(within(joaoCard).getByText('67% ocupado')).toBeInTheDocument()
        }
      })

      expect(aggregateAvailabilityForCalendar).toHaveBeenCalledWith('teacher-1', 1, 2025)
    })

    test('handles availability calculation errors gracefully', async () => {
      ;(aggregateAvailabilityForCalendar as jest.Mock).mockRejectedValue(
        new Error('Availability service unavailable')
      )
      
      render(<TeacherSelector {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
      })

      // Should still render teachers even if availability calculation fails
      expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
      expect(screen.getByText('Professora Maria Santos')).toBeInTheDocument()
    })
  })

  describe('Props Variations', () => {
    test('works without selectedCourse prop', async () => {
      const propsWithoutCourse = { ...defaultProps, selectedCourse: undefined }
      render(<TeacherSelector {...propsWithoutCourse} />)
      
      expect(screen.getByText('Escolha o professor que melhor atende às suas necessidades')).toBeInTheDocument()
    })

    test('works without availabilityFilter prop', async () => {
      const propsWithoutFilter = { ...defaultProps, availabilityFilter: undefined }
      render(<TeacherSelector {...propsWithoutFilter} />)
      
      await waitFor(() => {
        expect(screen.getByText('Professor João Silva')).toBeInTheDocument()
      })

      // Should not call availability calculation without filter
      expect(aggregateAvailabilityForCalendar).not.toHaveBeenCalled()
    })

    test('applies custom className', async () => {
      const { container } = render(
        <TeacherSelector {...defaultProps} className="custom-teacher-selector" />
      )
      
      expect(container.firstChild).toHaveClass('teacher-selector', 'custom-teacher-selector')
    })
  })
})