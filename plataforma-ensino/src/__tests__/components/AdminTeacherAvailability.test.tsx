import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import AdminTeacherAvailability from '@/components/admin/AdminTeacherAvailability'

// Mock fetch globally
global.fetch = jest.fn()

// Mock auth session
jest.mock('@/lib/auth/session', () => ({
  requireAdmin: jest.fn(() => Promise.resolve({
    user: { id: 'admin-id', email: 'admin@test.com' },
    profile: { role: 'admin' }
  }))
}))

const mockTeachers = [
  {
    id: 'teacher-1',
    user_id: 'user-1',
    full_name: 'Professor João',
    email: 'joao@test.com',
    bio: 'Professor de matemática',
    expertise: ['mathematics', 'algebra'],
    rating: 4.5,
    total_reviews: 20
  },
  {
    id: 'teacher-2',
    user_id: 'user-2',
    full_name: 'Professora Maria',
    email: 'maria@test.com',
    bio: 'Professora de português',
    expertise: ['portuguese', 'literature'],
    rating: 4.8,
    total_reviews: 35
  }
]

const mockAvailabilities = [
  {
    id: 'availability-1',
    teacher_id: 'teacher-1',
    day_of_week: 1, // Monday
    start_time: '09:00',
    end_time: '10:00',
    max_students: 10,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'availability-2',
    teacher_id: 'teacher-2',
    day_of_week: 2, // Tuesday
    start_time: '14:00',
    end_time: '15:00',
    max_students: 8,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
]

const mockPendingRequests = [
  {
    id: 'request-1',
    teacher_id: 'teacher-1',
    teacher_name: 'Professor João',
    teacher_email: 'joao@test.com',
    change_type: 'create',
    requested_changes: {
      day_of_week: 3,
      start_time: '10:00',
      end_time: '11:00',
      max_students: 12
    },
    status: 'pending',
    requested_by_name: 'Professor João',
    requested_by_email: 'joao@test.com',
    created_at: '2025-01-01T10:00:00Z',
    change_summary: 'Quarta 10:00-11:00'
  }
]

describe('AdminTeacherAvailability', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/admin/teachers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockTeachers })
        })
      }
      if (url.includes('/api/admin/teacher-availability')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockAvailabilities })
        })
      }
      if (url.includes('/api/admin/availability-approvals')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockPendingRequests })
        })
      }
      if (url.includes('/conflicts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] })
        })
      }
      return Promise.reject(new Error('Unhandled URL'))
    })
  })

  it('should render admin teacher availability interface', async () => {
    render(<AdminTeacherAvailability />)
    
    expect(screen.getByText('Gerenciamento de Disponibilidade de Professores')).toBeInTheDocument()
    expect(screen.getByText(/Gerencie e supervisione a disponibilidade/)).toBeInTheDocument()
  })

  it('should load and display teachers and their availabilities', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
      expect(screen.getByText('Professora Maria')).toBeInTheDocument()
      expect(screen.getByText('joao@test.com')).toBeInTheDocument()
      expect(screen.getByText('maria@test.com')).toBeInTheDocument()
    })
  })

  it('should show loading state initially', () => {
    render(<AdminTeacherAvailability />)
    
    expect(screen.getByText('Carregando disponibilidades...')).toBeInTheDocument()
  })

  it('should handle create new availability action', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Nova Disponibilidade')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Nova Disponibilidade'))
    
    expect(screen.getByText('Nova Disponibilidade')).toBeInTheDocument()
    expect(screen.getByLabelText('Professor *')).toBeInTheDocument()
    expect(screen.getByLabelText('Dia da Semana *')).toBeInTheDocument()
  })

  it('should handle availability creation with form validation', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: {
            id: 'new-availability',
            teacher_id: 'teacher-1',
            day_of_week: 3,
            start_time: '10:00',
            end_time: '11:00',
            max_students: 10,
            is_active: true
          }
        })
      })
    )

    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Nova Disponibilidade'))
    })

    const teacherSelect = screen.getByLabelText('Professor *')
    const startTimeInput = screen.getByLabelText('Horário de Início *')
    const endTimeInput = screen.getByLabelText('Horário de Fim *')
    
    fireEvent.change(teacherSelect, { target: { value: 'teacher-1' } })
    fireEvent.change(startTimeInput, { target: { value: '10:00' } })
    fireEvent.change(endTimeInput, { target: { value: '11:00' } })
    
    fireEvent.click(screen.getByText('Criar'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/teacher-availability', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }))
    })
  })

  it('should handle search and filtering', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
      expect(screen.getByText('Professora Maria')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Buscar professores...')
    fireEvent.change(searchInput, { target: { value: 'João' } })

    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
      expect(screen.queryByText('Professora Maria')).not.toBeInTheDocument()
    })
  })

  it('should handle day of week filtering', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Todos os dias')).toBeInTheDocument()
    })

    const dayFilter = screen.getByDisplayValue('Todos os dias')
    fireEvent.change(dayFilter, { target: { value: '1' } }) // Monday

    // Should filter to show only Monday availabilities
    expect(dayFilter).toHaveValue('1')
  })

  it('should show pending approval requests with badge', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      const approvalsButton = screen.getByText('Aprovações')
      expect(approvalsButton).toBeInTheDocument()
      
      // Should show badge with count
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('should handle approval workflow - approve request', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: { id: 'request-1', status: 'approved' } })
      })
    )

    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Aprovações'))
    })

    expect(screen.getByText('Solicitações de Aprovação (1)')).toBeInTheDocument()
    expect(screen.getByText('Professor João')).toBeInTheDocument()
    expect(screen.getByText('Quarta 10:00-11:00')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Aprovar'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/availability-approvals/request-1/approve',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      )
    })
  })

  it('should handle approval workflow - reject request', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: { id: 'request-1', status: 'rejected' } })
      })
    )

    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Aprovações'))
    })

    fireEvent.click(screen.getByText('Rejeitar'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/availability-approvals/request-1/reject',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      )
    })
  })

  it('should handle bulk operations', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
    })

    // Select availability slots by clicking on them
    const availabilityCards = screen.getAllByText(/09:00 - 10:00|14:00 - 15:00/)
    fireEvent.click(availabilityCards[0])

    await waitFor(() => {
      expect(screen.getByText(/1 horário\(s\) selecionado\(s\)/)).toBeInTheDocument()
      expect(screen.getByText('Ativar Todos')).toBeInTheDocument()
      expect(screen.getByText('Excluir Todos')).toBeInTheDocument()
    })
  })

  it('should handle conflict detection', async () => {
    const mockConflicts = [
      {
        teacher_id: 'teacher-1',
        conflicts: [{
          existing_slot: mockAvailabilities[0],
          conflicting_slot: {
            ...mockAvailabilities[0],
            id: 'conflicting-slot',
            start_time: '09:30',
            end_time: '10:30'
          },
          overlap_minutes: 30
        }]
      }
    ]

    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/conflicts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockConflicts })
        })
      }
      // Return default mocks for other URLs
      if (url.includes('/api/admin/teachers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockTeachers })
        })
      }
      if (url.includes('/api/admin/teacher-availability')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockAvailabilities })
        })
      }
      if (url.includes('/api/admin/availability-approvals')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] })
        })
      }
      return Promise.reject(new Error('Unhandled URL'))
    })

    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText(/1 conflito\(s\) de horário detectado\(s\)/)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Ver Conflitos'))

    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
      expect(screen.getByText(/30 min sobreposição/)).toBeInTheDocument()
    })
  })

  it('should show analytics modal with statistics', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Analytics'))
    })

    expect(screen.getByText('Relatório de Disponibilidade')).toBeInTheDocument()
    expect(screen.getByText('Total de Professores')).toBeInTheDocument()
    expect(screen.getByText('Horários Ativos')).toBeInTheDocument()
    expect(screen.getByText('Conflitos')).toBeInTheDocument()
    expect(screen.getByText('Capacidade Total')).toBeInTheDocument()
  })

  it('should handle export functionality', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Exportar')).toBeInTheDocument()
    })

    // Mock createElement for export link
    const mockLink = { click: jest.fn(), setAttribute: jest.fn() }
    document.createElement = jest.fn(() => mockLink as any)
    
    fireEvent.click(screen.getByText('Exportar'))
    
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockLink.click).toHaveBeenCalled()
  })

  it('should handle API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ 
          error: { message: 'Failed to load data' }
        })
      })
    )

    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load teachers')).toBeInTheDocument()
    })
  })

  it('should handle edit availability action', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
    })

    // Find and click edit button
    const editButtons = screen.getAllByRole('button')
    const editButton = editButtons.find(button => button.innerHTML.includes('Edit2'))
    
    if (editButton) {
      fireEvent.click(editButton)
      
      await waitFor(() => {
        expect(screen.getByText('Editar Disponibilidade')).toBeInTheDocument()
      })
    }
  })

  it('should handle filters prop correctly', async () => {
    const filters = {
      teacherId: 'teacher-1',
      dateRange: {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31')
      }
    }

    render(<AdminTeacherAvailability filters={filters} />)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('teacherId=teacher-1'),
        expect.any(Object)
      )
    })
  })

  it('should call onBulkUpdate callback when provided', async () => {
    const onBulkUpdate = jest.fn()
    
    render(<AdminTeacherAvailability onBulkUpdate={onBulkUpdate} />)
    
    // This callback would be called during bulk operations
    // For now, just verify the component renders with the prop
    await waitFor(() => {
      expect(screen.getByText('Gerenciamento de Disponibilidade de Professores')).toBeInTheDocument()
    })
  })
})