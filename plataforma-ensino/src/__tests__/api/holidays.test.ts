import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/holidays/route'
import { GET as GET_ID, PUT, DELETE } from '@/app/api/holidays/[id]/route'
import { POST as BULK_POST } from '@/app/api/holidays/bulk/route'
import { jest } from '@jest/globals'

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({
          data: mockHolidays,
          error: null
        }))
      })),
      gte: jest.fn(() => ({
        lte: jest.fn(() => Promise.resolve({
          data: mockHolidays,
          error: null
        }))
      }))
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({
          data: {
            id: 'new-holiday',
            date: '2025-01-01',
            name: 'Ano Novo',
            year: 2025,
            is_national: true
          },
          error: null
        }))
      }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              id: '1',
              date: '2025-12-25',
              name: 'Natal Atualizado',
              year: 2025,
              is_national: true
            },
            error: null
          }))
        }))
      }))
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({
        data: null,
        error: null
      }))
    }))
  }))
}

// Mock auth session
const mockAdminSession = {
  user: { id: 'admin-id', email: 'admin@test.com' },
  profile: { role: 'admin' }
}

jest.mock('@/lib/supabase/server', () => ({
  createClient: () => mockSupabaseClient
}))

jest.mock('@/lib/auth/session', () => ({
  requireAdmin: jest.fn(() => Promise.resolve(mockAdminSession))
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

// Helper to create mock requests
function createMockRequest(url: string, options: RequestInit = {}) {
  return new NextRequest(url, options)
}

describe('/api/holidays', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/holidays', () => {
    it('should return holidays for specified year', async () => {
      const request = createMockRequest('http://localhost/api/holidays?year=2025')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockHolidays)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('holidays')
    })

    it('should handle missing year parameter', async () => {
      const request = createMockRequest('http://localhost/api/holidays')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
      expect(data.error.message).toContain('Year parameter is required')
    })

    it('should handle invalid year parameter', async () => {
      const request = createMockRequest('http://localhost/api/holidays?year=invalid')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })

    it('should handle database errors', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Database error' }
            }))
          }))
        }))
      })

      const request = createMockRequest('http://localhost/api/holidays?year=2025')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })

    it('should filter by month when provided', async () => {
      const request = createMockRequest('http://localhost/api/holidays?year=2025&month=12')
      
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('holidays')
    })
  })

  describe('POST /api/holidays', () => {
    it('should create new holiday with valid data', async () => {
      const holidayData = {
        date: '2025-01-01',
        name: 'Ano Novo',
        year: 2025,
        is_national: true
      }

      const request = createMockRequest('http://localhost/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(holidayData)
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.data.name).toBe('Ano Novo')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('holidays')
    })

    it('should validate required fields', async () => {
      const invalidData = {
        date: '2025-01-01'
        // Missing required name field
      }

      const request = createMockRequest('http://localhost/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })

    it('should validate date format', async () => {
      const invalidData = {
        date: 'invalid-date',
        name: 'Test Holiday',
        year: 2025,
        is_national: true
      }

      const request = createMockRequest('http://localhost/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })

    it('should require admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/auth/session')
      ;(requireAdmin as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'))

      const request = createMockRequest('http://localhost/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: '2025-01-01',
          name: 'Test',
          year: 2025
        })
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.error.code).toBe('UNAUTHORIZED')
    })
  })
})

describe('/api/holidays/[id]', () => {
  describe('GET /api/holidays/[id]', () => {
    it('should return specific holiday by ID', async () => {
      const request = createMockRequest('http://localhost/api/holidays/1')
      
      const response = await GET_ID(request, { params: { id: '1' } })
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockHolidays[0])
    })

    it('should handle invalid UUID format', async () => {
      const request = createMockRequest('http://localhost/api/holidays/invalid-id')
      
      const response = await GET_ID(request, { params: { id: 'invalid-id' } })
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('PUT /api/holidays/[id]', () => {
    it('should update holiday with valid data', async () => {
      const updateData = {
        name: 'Natal Atualizado',
        is_national: false
      }

      const request = createMockRequest('http://localhost/api/holidays/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      const response = await PUT(request, { params: { id: '1' } })
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data.name).toBe('Natal Atualizado')
    })

    it('should require admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/auth/session')
      ;(requireAdmin as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'))

      const request = createMockRequest('http://localhost/api/holidays/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated' })
      })
      
      const response = await PUT(request, { params: { id: '1' } })
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('DELETE /api/holidays/[id]', () => {
    it('should delete holiday by ID', async () => {
      const request = createMockRequest('http://localhost/api/holidays/1', {
        method: 'DELETE'
      })
      
      const response = await DELETE(request, { params: { id: '1' } })
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data.deleted).toBe(true)
    })

    it('should require admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/auth/session')
      ;(requireAdmin as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'))

      const request = createMockRequest('http://localhost/api/holidays/1', {
        method: 'DELETE'
      })
      
      const response = await DELETE(request, { params: { id: '1' } })
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.error.code).toBe('UNAUTHORIZED')
    })
  })
})

describe('/api/holidays/bulk', () => {
  describe('POST /api/holidays/bulk', () => {
    it('should import multiple holidays', async () => {
      const bulkData = {
        holidays: [
          {
            date: '2025-01-01',
            name: 'Ano Novo',
            year: 2025,
            is_national: true
          },
          {
            date: '2025-02-14',
            name: 'Dia dos Namorados',
            year: 2025,
            is_national: false
          }
        ]
      }

      // Mock successful bulk insert
      mockSupabaseClient.from.mockReturnValueOnce({
        insert: jest.fn(() => ({
          select: jest.fn(() => Promise.resolve({
            data: bulkData.holidays.map((h, i) => ({ ...h, id: `bulk-${i}` })),
            error: null
          }))
        }))
      })

      const request = createMockRequest('http://localhost/api/holidays/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData)
      })
      
      const response = await BULK_POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data.imported).toBe(2)
      expect(data.data.errors).toHaveLength(0)
    })

    it('should handle validation errors in bulk import', async () => {
      const bulkData = {
        holidays: [
          {
            date: 'invalid-date',
            name: 'Invalid Holiday',
            year: 2025,
            is_national: true
          },
          {
            date: '2025-01-01',
            name: 'Valid Holiday',
            year: 2025,
            is_national: true
          }
        ]
      }

      const request = createMockRequest('http://localhost/api/holidays/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData)
      })
      
      const response = await BULK_POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data.imported).toBe(1)
      expect(data.data.skipped).toBe(1)
      expect(data.data.errors).toHaveLength(1)
    })

    it('should require admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/auth/session')
      ;(requireAdmin as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'))

      const request = createMockRequest('http://localhost/api/holidays/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holidays: [] })
      })
      
      const response = await BULK_POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.error.code).toBe('UNAUTHORIZED')
    })

    it('should handle empty holidays array', async () => {
      const request = createMockRequest('http://localhost/api/holidays/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holidays: [] })
      })
      
      const response = await BULK_POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
      expect(data.error.message).toContain('At least one holiday is required')
    })

    it('should limit bulk import size', async () => {
      const holidays = Array.from({ length: 101 }, (_, i) => ({
        date: `2025-01-${String(i + 1).padStart(2, '0')}`,
        name: `Holiday ${i + 1}`,
        year: 2025,
        is_national: true
      }))

      const request = createMockRequest('http://localhost/api/holidays/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holidays })
      })
      
      const response = await BULK_POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
      expect(data.error.message).toContain('Maximum 100 holidays')
    })
  })
})