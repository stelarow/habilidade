import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import HolidayManager from '@/components/scheduling/HolidayManager'

// Mock fetch globally
global.fetch = jest.fn()

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({
            data: mockHolidays,
            error: null
          }))
        }))
      }))
    }))
  })
}))

// Mock auth session
jest.mock('@/lib/auth/session', () => ({
  requireAdmin: jest.fn(() => Promise.resolve({
    user: { id: 'admin-id', email: 'admin@test.com' },
    profile: { role: 'admin' }
  }))
}))

const mockHolidays = [
  {
    id: '1',
    date: '2025-12-25',
    name: 'Natal',
    year: 2025,
    is_national: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    date: '2025-04-21',
    name: 'Tiradentes',
    year: 2025,
    is_national: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
]

describe('HolidayManager', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/holidays')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockHolidays })
        })
      }
      return Promise.reject(new Error('Unhandled URL'))
    })
  })

  it('should render holiday manager with title and description', async () => {
    render(<HolidayManager year={2025} />)
    
    expect(screen.getByText('Gerenciamento de Feriados')).toBeInTheDocument()
    expect(screen.getByText(/Gerencie os feriados do ano/)).toBeInTheDocument()
  })

  it('should load and display holidays for current year', async () => {
    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      expect(screen.getByText('Natal')).toBeInTheDocument()
      expect(screen.getByText('Tiradentes')).toBeInTheDocument()
    })
  })

  it('should show loading state initially', () => {
    render(<HolidayManager year={2025} />)
    
    expect(screen.getByText('Carregando feriados...')).toBeInTheDocument()
  })

  it('should handle create new holiday action', async () => {
    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      expect(screen.getByText('Novo Feriado')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Novo Feriado'))
    
    expect(screen.getByText('Criar Feriado')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do Feriado *')).toBeInTheDocument()
    expect(screen.getByLabelText('Data do Feriado *')).toBeInTheDocument()
  })

  it('should handle holiday creation with form validation', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: {
            id: '3',
            date: '2025-01-01',
            name: 'Ano Novo',
            year: 2025,
            is_national: true
          }
        })
      })
    )

    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Novo Feriado'))
    })

    const nameInput = screen.getByLabelText('Nome do Feriado *')
    const dateInput = screen.getByLabelText('Data do Feriado *')
    
    fireEvent.change(nameInput, { target: { value: 'Ano Novo' } })
    fireEvent.change(dateInput, { target: { value: '2025-01-01' } })
    
    fireEvent.click(screen.getByText('Criar'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/holidays', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: '2025-01-01',
          name: 'Ano Novo',
          year: 2025,
          is_national: true
        })
      }))
    })
  })

  it('should handle form validation errors', async () => {
    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Novo Feriado'))
    })

    // Try to submit form without filling required fields
    fireEvent.click(screen.getByText('Criar'))

    await waitFor(() => {
      expect(screen.getByText(/Nome é obrigatório/)).toBeInTheDocument()
    })
  })

  it('should handle edit holiday action', async () => {
    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      expect(screen.getByText('Natal')).toBeInTheDocument()
    })

    // Find and click edit button for Natal
    const editButtons = screen.getAllByLabelText('Editar feriado')
    fireEvent.click(editButtons[0])

    expect(screen.getByText('Editar Feriado')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Natal')).toBeInTheDocument()
  })

  it('should handle delete holiday with confirmation', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    )

    // Mock window.confirm
    window.confirm = jest.fn(() => true)

    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      expect(screen.getByText('Natal')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByLabelText('Excluir feriado')
    fireEvent.click(deleteButtons[0])

    expect(window.confirm).toHaveBeenCalledWith(
      'Tem certeza que deseja excluir este feriado?'
    )

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/holidays/1', {
        method: 'DELETE'
      })
    })
  })

  it('should handle API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ 
          error: { message: 'Failed to load holidays' }
        })
      })
    )

    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load holidays')).toBeInTheDocument()
    })
  })

  it('should handle import/export functionality', async () => {
    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      expect(screen.getByText('Exportar')).toBeInTheDocument()
      expect(screen.getByText('Importar')).toBeInTheDocument()
    })

    // Test export
    const mockLink = { click: jest.fn(), setAttribute: jest.fn() }
    document.createElement = jest.fn(() => mockLink as any)
    
    fireEvent.click(screen.getByText('Exportar'))
    
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockLink.click).toHaveBeenCalled()
  })

  it('should handle readonly mode correctly', () => {
    render(<HolidayManager year={2025} readonly={true} />)
    
    // Should not show create/edit/delete buttons in readonly mode
    expect(screen.queryByText('Novo Feriado')).not.toBeInTheDocument()
  })

  it('should call onHolidayChange callback when holidays are modified', async () => {
    const onHolidayChange = jest.fn()
    
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: {
            id: '3',
            date: '2025-01-01',
            name: 'Ano Novo',
            year: 2025,
            is_national: true
          }
        })
      })
    )

    render(<HolidayManager year={2025} onHolidayChange={onHolidayChange} />)
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Novo Feriado'))
    })

    const nameInput = screen.getByLabelText('Nome do Feriado *')
    const dateInput = screen.getByLabelText('Data do Feriado *')
    
    fireEvent.change(nameInput, { target: { value: 'Ano Novo' } })
    fireEvent.change(dateInput, { target: { value: '2025-01-01' } })
    
    fireEvent.click(screen.getByText('Criar'))

    await waitFor(() => {
      expect(onHolidayChange).toHaveBeenCalled()
    })
  })

  it('should detect and display holiday conflicts', async () => {
    const conflictingHolidays = [
      ...mockHolidays,
      {
        id: '3',
        date: '2025-12-25', // Same date as Natal
        name: 'Christmas',
        year: 2025,
        is_national: false,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ]

    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/holidays')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: conflictingHolidays })
        })
      }
      return Promise.reject(new Error('Unhandled URL'))
    })

    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      expect(screen.getByText(/conflito detectado/i)).toBeInTheDocument()
    })
  })
})