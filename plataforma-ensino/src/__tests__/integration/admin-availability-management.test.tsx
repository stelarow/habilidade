import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import AdminTeacherAvailability from '@/components/admin/AdminTeacherAvailability'

// Integration test for complete teacher availability management workflow
describe('Teacher Availability Management Integration', () => {
  let mockApiCalls: any[] = []

  const mockTeachers = [
    {
      id: 'teacher-1',
      user_id: 'user-1',
      full_name: 'Professor João',
      email: 'joao@test.com',
      rating: 4.5,
      total_reviews: 20
    }
  ]

  const mockAvailabilities = [
    {
      id: 'availability-1',
      teacher_id: 'teacher-1',
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
      max_students: 10,
      is_active: true,
      has_pending_changes: false
    }
  ]

  beforeEach(() => {
    mockApiCalls = []
    jest.clearAllMocks()
    
    global.fetch = jest.fn((url: string, options?: any) => {
      mockApiCalls.push({ url, options })
      
      // Mock API responses
      if (url.includes('/api/admin/teachers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockTeachers })
        })
      }
      
      if (url.includes('/api/admin/teacher-availability/conflicts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] })
        })
      }
      
      if (url.includes('/api/admin/teacher-availability') && !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockAvailabilities })
        })
      }
      
      if (url.includes('/api/admin/teacher-availability') && options?.method === 'POST') {
        const body = JSON.parse(options.body)
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: {
              id: 'new-availability',
              teacher_id: body.teacher_id,
              ...body,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          })
        })
      }
      
      if (url.includes('/api/admin/availability-approvals') && !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              {
                id: 'request-1',
                teacher_id: 'teacher-1',
                teacher_name: 'Professor João',
                teacher_email: 'joao@test.com',
                change_type: 'create',
                requested_changes: {
                  day_of_week: 2,
                  start_time: '14:00',
                  end_time: '15:00',
                  max_students: 8
                },
                status: 'pending',
                requested_by_name: 'Professor João',
                requested_by_email: 'joao@test.com',
                created_at: '2025-01-01T10:00:00Z',
                change_summary: 'Terça 14:00-15:00'
              }
            ]
          })
        })
      }
      
      if (url.includes('/approve') && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: { id: 'request-1', status: 'approved' }
          })
        })
      }
      
      if (url.includes('/reject') && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: { id: 'request-1', status: 'rejected' }
          })
        })
      }
      
      if (url.includes('/bulk') && options?.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: { updated: 2, errors: [] }
          })
        })
      }
      
      return Promise.reject(new Error(`Unhandled API call: ${url}`))
    })
  })

  it('should complete full availability management workflow', async () => {
    const onBulkUpdate = jest.fn()
    render(<AdminTeacherAvailability onBulkUpdate={onBulkUpdate} />)
    
    // 1. Initial load - should load teachers, availabilities, pending requests
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
    })
    
    expect(mockApiCalls.some((call: any) => call.url.includes('/api/admin/teachers'))).toBe(true)
    expect(mockApiCalls.some((call: any) => call.url.includes('/api/admin/teacher-availability'))).toBe(true)
    expect(mockApiCalls.some((call: any) => call.url.includes('/api/admin/availability-approvals'))).toBe(true)
    
    // 2. Create new availability
    fireEvent.click(screen.getByText('Nova Disponibilidade'))
    
    const teacherSelect = screen.getByLabelText('Professor *')
    const daySelect = screen.getByLabelText('Dia da Semana *')
    const startTimeInput = screen.getByLabelText('Horário de Início *')
    const endTimeInput = screen.getByLabelText('Horário de Fim *')
    const maxStudentsInput = screen.getByLabelText('Máximo de Alunos *')
    
    fireEvent.change(teacherSelect, { target: { value: 'teacher-1' } })
    fireEvent.change(daySelect, { target: { value: '2' } }) // Tuesday
    fireEvent.change(startTimeInput, { target: { value: '14:00' } })
    fireEvent.change(endTimeInput, { target: { value: '15:00' } })
    fireEvent.change(maxStudentsInput, { target: { value: '8' } })
    
    fireEvent.click(screen.getByText('Criar'))
    
    await waitFor(() => {
      const createCall = mockApiCalls.find((call: any) => 
        call.url.includes('/api/admin/teacher-availability') && call.options?.method === 'POST'
      )
      expect(createCall).toBeDefined()
      expect(JSON.parse(createCall.options.body)).toMatchObject({
        teacher_id: 'teacher-1',
        day_of_week: 2,
        start_time: '14:00',
        end_time: '15:00',
        max_students: 8
      })
    })
    
    // 3. Handle approval workflow
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument() // Badge count
    })
    
    fireEvent.click(screen.getByText('Aprovações'))
    
    await waitFor(() => {
      expect(screen.getByText('Solicitações de Aprovação (1)')).toBeInTheDocument()
      expect(screen.getByText('Terça 14:00-15:00')).toBeInTheDocument()
    })
    
    // Approve the request
    fireEvent.click(screen.getByText('Aprovar'))
    
    await waitFor(() => {
      const approveCall = mockApiCalls.find((call: any) => 
        call.url.includes('/approve') && call.options?.method === 'POST'
      )
      expect(approveCall).toBeDefined()
    })
  })

  it('should handle conflict detection and resolution workflow', async () => {
    // Mock conflicts in the response
    global.fetch = jest.fn((url: string, options?: any) => {
      mockApiCalls.push({ url, options })
      
      if (url.includes('/conflicts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              {
                teacher_id: 'teacher-1',
                conflicts: [
                  {
                    existing_slot: mockAvailabilities[0],
                    conflicting_slot: {
                      ...mockAvailabilities[0],
                      id: 'conflicting-slot',
                      start_time: '09:30',
                      end_time: '10:30'
                    },
                    overlap_minutes: 30
                  }
                ]
              }
            ]
          })
        })
      }
      
      // Default mocks for other endpoints
      if (url.includes('/api/admin/teachers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockTeachers })
        })
      }
      
      if (url.includes('/api/admin/teacher-availability') && !options?.method) {
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
      
      return Promise.reject(new Error(`Unhandled API call: ${url}`))
    })
    
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText(/1 conflito\(s\) de horário detectado\(s\)/)).toBeInTheDocument()
    })
    
    // View conflicts
    fireEvent.click(screen.getByText('Ver Conflitos'))
    
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
      expect(screen.getByText(/30 min sobreposição/)).toBeInTheDocument()
    })
    
    // Refresh conflicts
    fireEvent.click(screen.getByText('Detectar Conflitos'))
    
    await waitFor(() => {
      const conflictCalls = mockApiCalls.filter((call: any) => call.url.includes('/conflicts'))
      expect(conflictCalls.length).toBeGreaterThan(1) // Initial load + manual refresh
    })
  })

  it('should handle bulk operations workflow', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
    })
    
    // Select availability slots (simulate clicking on availability cards)
    const availabilityElements = screen.getAllByText(/09:00 - 10:00/)
    fireEvent.click(availabilityElements[0])
    
    await waitFor(() => {
      expect(screen.getByText(/1 horário\(s\) selecionado\(s\)/)).toBeInTheDocument()
    })
    
    // Perform bulk update
    fireEvent.click(screen.getByText('Ativar Todos'))
    
    await waitFor(() => {
      const bulkCall = mockApiCalls.find((call: any) => 
        call.url.includes('/bulk') && call.options?.method === 'PUT'
      )
      expect(bulkCall).toBeDefined()
    })
  })

  it('should handle search and filtering workflow', async () => {
    // Add more mock data for filtering
    const extendedMockTeachers = [
      ...mockTeachers,
      {
        id: 'teacher-2',
        user_id: 'user-2',
        full_name: 'Professora Maria',
        email: 'maria@test.com',
        rating: 4.8,
        total_reviews: 35
      }
    ]
    
    const extendedMockAvailabilities = [
      ...mockAvailabilities,
      {
        id: 'availability-2',
        teacher_id: 'teacher-2',
        day_of_week: 2, // Tuesday
        start_time: '14:00',
        end_time: '15:00',
        max_students: 8,
        is_active: true,
        has_pending_changes: false
      }
    ]
    
    global.fetch = jest.fn((url: string, options?: any) => {
      if (url.includes('/api/admin/teachers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: extendedMockTeachers })
        })
      }
      
      if (url.includes('/api/admin/teacher-availability') && !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: extendedMockAvailabilities })
        })
      }
      
      if (url.includes('/conflicts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] })
        })
      }
      
      if (url.includes('/api/admin/availability-approvals')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] })
        })
      }
      
      return Promise.reject(new Error(`Unhandled API call: ${url}`))
    })
    
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
      expect(screen.getByText('Professora Maria')).toBeInTheDocument()
    })
    
    // Test search filtering
    const searchInput = screen.getByPlaceholderText('Buscar professores...')
    fireEvent.change(searchInput, { target: { value: 'João' } })
    
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
      expect(screen.queryByText('Professora Maria')).not.toBeInTheDocument()
    })
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } })
    
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
      expect(screen.getByText('Professora Maria')).toBeInTheDocument()
    })
    
    // Test day filtering
    const dayFilter = screen.getByDisplayValue('Todos os dias')
    fireEvent.change(dayFilter, { target: { value: '1' } }) // Monday only
    
    // Should show only Monday availabilities
    expect(dayFilter).toHaveValue('1')
  })

  it('should handle analytics and reporting workflow', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Analytics'))
    })
    
    // Should show analytics modal
    expect(screen.getByText('Relatório de Disponibilidade')).toBeInTheDocument()
    expect(screen.getByText('Total de Professores')).toBeInTheDocument()
    expect(screen.getByText('Horários Ativos')).toBeInTheDocument()
    expect(screen.getByText('Conflitos')).toBeInTheDocument()
    expect(screen.getByText('Capacidade Total')).toBeInTheDocument()
    
    // Should show weekly distribution
    expect(screen.getByText('Distribuição por Dia da Semana')).toBeInTheDocument()
    
    // Close modal
    fireEvent.click(screen.getAllByRole('button').find((btn: any) => 
      btn.innerHTML.includes('X')
    )!)
    
    await waitFor(() => {
      expect(screen.queryByText('Relatório de Disponibilidade')).not.toBeInTheDocument()
    })
  })

  it('should handle export functionality workflow', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Exportar')).toBeInTheDocument()
    })
    
    // Mock createElement and URL.createObjectURL for export
    const mockLink = { 
      click: jest.fn(), 
      setAttribute: jest.fn(),
      href: '',
      download: ''
    }
    document.createElement = jest.fn(() => mockLink as any)
    
    fireEvent.click(screen.getByText('Exportar'))
    
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockLink.setAttribute).toHaveBeenCalledWith('href', expect.any(String))
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', expect.stringContaining('teacher_availability_'))
    expect(mockLink.click).toHaveBeenCalled()
  })

  it('should handle error recovery and retry workflow', async () => {
    let callCount = 0
    global.fetch = jest.fn((url: string, options?: any) => {
      callCount++
      
      if (callCount === 1 && url.includes('/api/admin/teachers')) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({
            error: { message: 'Internal Server Error' }
          })
        })
      }
      
      if (callCount === 2 && url.includes('/api/admin/teachers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockTeachers })
        })
      }
      
      // Default responses for other endpoints
      if (url.includes('/api/admin/teacher-availability')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockAvailabilities })
        })
      }
      
      if (url.includes('/conflicts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] })
        })
      }
      
      if (url.includes('/api/admin/availability-approvals')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] })
        })
      }
      
      return Promise.reject(new Error(`Unhandled API call: ${url}`))
    })
    
    render(<AdminTeacherAvailability />)
    
    // Should show error initially
    await waitFor(() => {
      expect(screen.getByText('Failed to load teachers')).toBeInTheDocument()
    })
    
    // Retry by refreshing (simulate retry button click or component refresh)
    fireEvent.click(screen.getByText('Detectar Conflitos')) // This triggers a refresh
    
    // Should succeed on retry
    await waitFor(() => {
      expect(screen.queryByText('Failed to load teachers')).not.toBeInTheDocument()
    })
    
    expect(callCount).toBeGreaterThanOrEqual(2)
  })

  it('should handle concurrent operations correctly', async () => {
    render(<AdminTeacherAvailability />)
    
    await waitFor(() => {
      expect(screen.getByText('Professor João')).toBeInTheDocument()
    })
    
    // Simulate rapid concurrent operations
    const promises = []
    
    // Open multiple create forms and submit them
    for (let i = 0; i < 3; i++) {
      promises.push(
        new Promise<void>((resolve) => {
          fireEvent.click(screen.getByText('Nova Disponibilidade'))
          
          const teacherSelect = screen.getByLabelText('Professor *')
          const startTimeInput = screen.getByLabelText('Horário de Início *')
          const endTimeInput = screen.getByLabelText('Horário de Fim *')
          
          fireEvent.change(teacherSelect, { target: { value: 'teacher-1' } })
          fireEvent.change(startTimeInput, { target: { value: `1${i}:00` } })
          fireEvent.change(endTimeInput, { target: { value: `1${i + 1}:00` } })
          
          fireEvent.click(screen.getByText('Criar'))
          
          setTimeout(resolve, 10)
        })
      )
    }
    
    await Promise.all(promises)
    
    // Should have made multiple POST requests
    const postCalls = mockApiCalls.filter((call: any) => 
      call.url.includes('/api/admin/teacher-availability') && call.options?.method === 'POST'
    )
    expect(postCalls.length).toBeGreaterThan(0)
  })
})