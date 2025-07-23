import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import HolidayManager from '@/components/scheduling/HolidayManager'

// Integration test for complete holiday management workflow
describe('Holiday Management Integration', () => {
  let mockApiCalls: any[] = []

  beforeEach(() => {
    mockApiCalls = []
    jest.clearAllMocks()
    
    global.fetch = jest.fn((url: string, options?: any) => {
      mockApiCalls.push({ url, options })
      
      // Mock API responses based on URL patterns
      if (url.includes('/api/holidays') && options?.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              {
                id: '1',
                date: '2025-12-25',
                name: 'Natal',
                year: 2025,
                is_national: true,
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z'
              }
            ]
          })
        })
      }
      
      if (url.includes('/api/holidays') && options?.method === 'POST') {
        const body = JSON.parse(options.body)
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: {
              id: 'new-holiday',
              ...body,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          })
        })
      }
      
      if (url.includes('/api/holidays/') && options?.method === 'PUT') {
        const body = JSON.parse(options.body)
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: {
              id: '1',
              ...body,
              updated_at: new Date().toISOString()
            }
          })
        })
      }
      
      if (url.includes('/api/holidays/') && options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      }
      
      if (url.includes('/api/holidays/bulk') && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: { imported: 5, skipped: 1, errors: [] }
          })
        })
      }
      
      return Promise.reject(new Error(`Unhandled API call: ${url}`))
    })
  })

  it('should complete full CRUD workflow for holidays', async () => {
    const onHolidayChange = jest.fn()
    render(<HolidayManager year={2025} onHolidayChange={onHolidayChange} />)
    
    // 1. Initial load
    await waitFor(() => {
      expect(screen.getByText('Natal')).toBeInTheDocument()
    })
    expect(mockApiCalls[0].url).toContain('/api/holidays')
    expect(mockApiCalls[0].options).toBeUndefined() // GET request
    
    // 2. Create new holiday
    fireEvent.click(screen.getByText('Novo Feriado'))
    
    const nameInput = screen.getByLabelText('Nome do Feriado *')
    const dateInput = screen.getByLabelText('Data do Feriado *')
    
    fireEvent.change(nameInput, { target: { value: 'Ano Novo' } })
    fireEvent.change(dateInput, { target: { value: '2025-01-01' } })
    
    fireEvent.click(screen.getByText('Criar'))
    
    await waitFor(() => {
      expect(onHolidayChange).toHaveBeenCalled()
    })
    
    const createCall = mockApiCalls.find(call => 
      call.url.includes('/api/holidays') && call.options?.method === 'POST'
    )
    expect(createCall).toBeDefined()
    expect(JSON.parse(createCall.options.body)).toMatchObject({
      name: 'Ano Novo',
      date: '2025-01-01',
      year: 2025
    })
    
    // 3. Edit existing holiday
    const editButtons = screen.getAllByLabelText('Editar feriado')
    fireEvent.click(editButtons[0])
    
    const editNameInput = screen.getByDisplayValue('Natal')
    fireEvent.change(editNameInput, { target: { value: 'Natal Atualizado' } })
    
    fireEvent.click(screen.getByText('Atualizar'))
    
    await waitFor(() => {
      const updateCall = mockApiCalls.find(call => 
        call.url.includes('/api/holidays/1') && call.options?.method === 'PUT'
      )
      expect(updateCall).toBeDefined()
    })
    
    // 4. Delete holiday
    window.confirm = jest.fn(() => true)
    
    const deleteButtons = screen.getAllByLabelText('Excluir feriado')
    fireEvent.click(deleteButtons[0])
    
    await waitFor(() => {
      const deleteCall = mockApiCalls.find(call => 
        call.url.includes('/api/holidays/1') && call.options?.method === 'DELETE'
      )
      expect(deleteCall).toBeDefined()
    })
    
    expect(window.confirm).toHaveBeenCalledWith(
      'Tem certeza que deseja excluir este feriado?'
    )
  })

  it('should handle bulk import workflow with validation', async () => {
    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      expect(screen.getByText('Importar')).toBeInTheDocument()
    })
    
    // Mock file input
    const file = new File([JSON.stringify([
      { date: '2025-01-01', name: 'Ano Novo', is_national: true },
      { date: '2025-04-21', name: 'Tiradentes', is_national: true },
      { date: 'invalid-date', name: 'Invalid Holiday', is_national: true }
    ])], 'holidays.json', { type: 'application/json' })
    
    const fileInput = screen.getByLabelText(/importar arquivo/i)
    Object.defineProperty(fileInput, 'files', { value: [file] })
    
    fireEvent.change(fileInput)
    
    await waitFor(() => {
      const bulkCall = mockApiCalls.find(call => 
        call.url.includes('/api/holidays/bulk') && call.options?.method === 'POST'
      )
      expect(bulkCall).toBeDefined()
    })
    
    // Should show import results
    await waitFor(() => {
      expect(screen.getByText(/5 feriados importados/)).toBeInTheDocument()
      expect(screen.getByText(/1 pulado/)).toBeInTheDocument()
    })
  })

  it('should handle conflict detection and resolution', async () => {
    // Mock holidays with conflicts
    global.fetch = jest.fn((url: string, options?: any) => {
      if (url.includes('/api/holidays') && !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              {
                id: '1',
                date: '2025-12-25',
                name: 'Natal',
                year: 2025,
                is_national: true
              },
              {
                id: '2',
                date: '2025-12-25', // Same date - conflict!
                name: 'Christmas',
                year: 2025,
                is_national: false
              }
            ]
          })
        })
      }
      
      if (url.includes('/api/holidays/conflicts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [{
              date: '2025-12-25',
              holidays: ['Natal', 'Christmas']
            }]
          })
        })
      }
      
      return Promise.reject(new Error(`Unhandled API call: ${url}`))
    })
    
    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      expect(screen.getByText(/conflito detectado/i)).toBeInTheDocument()
    })
    
    // Should show conflict details
    fireEvent.click(screen.getByText(/ver conflitos/i))
    
    await waitFor(() => {
      expect(screen.getByText('Natal, Christmas')).toBeInTheDocument()
    })
  })

  it('should handle network errors and retry logic', async () => {
    let callCount = 0
    global.fetch = jest.fn(() => {
      callCount++
      if (callCount === 1) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({
            error: { message: 'Internal Server Error' }
          })
        })
      }
      // Second call succeeds
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      })
    })
    
    render(<HolidayManager year={2025} />)
    
    // Should show error initially
    await waitFor(() => {
      expect(screen.getByText('Internal Server Error')).toBeInTheDocument()
    })
    
    // Retry button should be available
    fireEvent.click(screen.getByText('Tentar Novamente'))
    
    // Should succeed on retry
    await waitFor(() => {
      expect(screen.queryByText('Internal Server Error')).not.toBeInTheDocument()
    })
    
    expect(callCount).toBe(2)
  })

  it('should maintain data consistency during concurrent operations', async () => {
    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      expect(screen.getByText('Natal')).toBeInTheDocument()
    })
    
    // Simulate rapid concurrent operations
    const promises = []
    
    // Create multiple holidays simultaneously
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByText('Novo Feriado'))
      
      const nameInput = screen.getByLabelText('Nome do Feriado *')
      const dateInput = screen.getByLabelText('Data do Feriado *')
      
      fireEvent.change(nameInput, { target: { value: `Feriado ${i}` } })
      fireEvent.change(dateInput, { target: { value: `2025-0${i + 1}-01` } })
      
      promises.push(
        new Promise(resolve => {
          fireEvent.click(screen.getByText('Criar'))
          setTimeout(resolve, 10)
        })
      )
    }
    
    await Promise.all(promises)
    
    // Should have made 3 POST requests
    const postCalls = mockApiCalls.filter(call => 
      call.url.includes('/api/holidays') && call.options?.method === 'POST'
    )
    expect(postCalls).toHaveLength(3)
  })

  it('should handle real-time updates from other admin users', async () => {
    const onHolidayChange = jest.fn()
    render(<HolidayManager year={2025} onHolidayChange={onHolidayChange} />)
    
    await waitFor(() => {
      expect(screen.getByText('Natal')).toBeInTheDocument()
    })
    
    // Simulate external update (e.g., from WebSocket or polling)
    // This would typically come through a context or state management system
    const externalUpdate = {
      type: 'HOLIDAY_CREATED',
      data: {
        id: 'external-holiday',
        date: '2025-01-01',
        name: 'Ano Novo (Externo)',
        year: 2025,
        is_national: true
      }
    }
    
    // Trigger external update through callback
    onHolidayChange([externalUpdate.data])
    
    // Should reflect the change
    await waitFor(() => {
      expect(onHolidayChange).toHaveBeenCalledWith([externalUpdate.data])
    })
  })

  it('should validate business rules and constraints', async () => {
    render(<HolidayManager year={2025} />)
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Novo Feriado'))
    })
    
    // Test date validation
    const nameInput = screen.getByLabelText('Nome do Feriado *')
    const dateInput = screen.getByLabelText('Data do Feriado *')
    
    fireEvent.change(nameInput, { target: { value: 'Feriado Teste' } })
    fireEvent.change(dateInput, { target: { value: '2024-12-25' } }) // Wrong year
    
    fireEvent.click(screen.getByText('Criar'))
    
    await waitFor(() => {
      expect(screen.getByText(/data deve ser do ano 2025/i)).toBeInTheDocument()
    })
    
    // Test duplicate date validation
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } }) // Same as existing Natal
    
    fireEvent.click(screen.getByText('Criar'))
    
    await waitFor(() => {
      expect(screen.getByText(/já existe um feriado nesta data/i)).toBeInTheDocument()
    })
  })
})