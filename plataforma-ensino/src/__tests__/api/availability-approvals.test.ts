import type { NextRequest } from 'next/server'
import type { GET } from '@/app/api/admin/availability-approvals/route'
import type { POST as APPROVE_POST } from '@/app/api/admin/availability-approvals/[id]/approve/route'
import type { POST as REJECT_POST } from '@/app/api/admin/availability-approvals/[id]/reject/route'
import { jest } from '@jest/globals'

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      order: jest.fn(() => Promise.resolve({
        data: mockPendingRequests,
        error: null
      })),
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({
          data: mockPendingRequests[0],
          error: null
        }))
      }))
    })),
    update: jest.fn(() => ({
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

const mockPendingRequests = [
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
  },
  {
    id: 'request-2',
    teacher_id: 'teacher-2',
    teacher_name: 'Professora Maria',
    teacher_email: 'maria@test.com',
    change_type: 'update',
    requested_changes: {
      max_students: 12
    },
    original_data: {
      max_students: 8
    },
    status: 'pending',
    requested_by_name: 'Professora Maria',
    requested_by_email: 'maria@test.com',
    created_at: '2025-01-01T11:00:00Z',
    change_summary: 'Modification'
  }
]

// Helper to create mock requests
function createMockRequest(url: string, options: RequestInit = {}) {
  return new NextRequest(url, options)
}

describe('/api/admin/availability-approvals', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/admin/availability-approvals', () => {
    it('should return pending approval requests for admin', async () => {
      const request = createMockRequest('http://localhost/api/admin/availability-approvals')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockPendingRequests)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('admin_pending_availability_requests')
    })

    it('should require admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/auth/session')
      ;(requireAdmin as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'))

      const request = createMockRequest('http://localhost/api/admin/availability-approvals')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.error.code).toBe('UNAUTHORIZED')
    })

    it('should handle database errors', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Database error' }
          }))
        }))
      })

      const request = createMockRequest('http://localhost/api/admin/availability-approvals')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error.code).toBe('DATABASE_ERROR')
    })

    it('should handle empty results', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({
            data: [],
            error: null
          }))
        }))
      })

      const request = createMockRequest('http://localhost/api/admin/availability-approvals')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data).toEqual([])
    })

    it('should order results by created_at ascending', async () => {
      const request = createMockRequest('http://localhost/api/admin/availability-approvals')
      
      await GET(request)
      
      expect(mockSupabaseClient.from().select().order).toHaveBeenCalledWith('created_at', { ascending: true })
    })
  })
})

describe('/api/admin/availability-approvals/[id]/approve', () => {
  describe('POST /api/admin/availability-approvals/[id]/approve', () => {
    it('should approve pending request with valid ID', async () => {
      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-1/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const response = await APPROVE_POST(request, { params: { id: 'request-1' } })
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data.id).toBe('request-1')
      expect(data.data.status).toBe('approved')
      expect(data.data.approved_by).toBe('admin-id')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('availability_change_requests')
    })

    it('should validate UUID format', async () => {
      const request = createMockRequest('http://localhost/api/admin/availability-approvals/invalid-id/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const response = await APPROVE_POST(request, { params: { id: 'invalid-id' } })
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
      expect(data.error.message).toContain('Invalid request ID format')
    })

    it('should handle non-existent request', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Not found' }
            }))
          }))
        }))
      })

      const request = createMockRequest('http://localhost/api/admin/availability-approvals/nonexistent/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const response = await APPROVE_POST(request, { params: { id: 'b0c1d2e3-4f56-7890-abcd-ef1234567890' } })
      const data = await response.json()
      
      expect(response.status).toBe(404)
      expect(data.error.code).toBe('REQUEST_NOT_FOUND')
    })

    it('should require admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/auth/session')
      ;(requireAdmin as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'))

      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-1/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const response = await APPROVE_POST(request, { params: { id: 'request-1' } })
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.error.code).toBe('UNAUTHORIZED')
    })

    it('should handle database update errors', async () => {
      // Mock successful fetch but failed update
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: mockPendingRequests[0],
              error: null
            }))
          }))
        }))
      }).mockReturnValueOnce({
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Update failed' }
          }))
        }))
      })

      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-1/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const response = await APPROVE_POST(request, { params: { id: 'request-1' } })
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error.code).toBe('DATABASE_ERROR')
    })

    it('should only approve pending requests', async () => {
      const approvedRequest = {
        ...mockPendingRequests[0],
        status: 'approved'
      }

      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: null, // No pending request found
              error: null
            }))
          }))
        }))
      })

      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-1/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const response = await APPROVE_POST(request, { params: { id: 'request-1' } })
      const data = await response.json()
      
      expect(response.status).toBe(404)
      expect(data.error.code).toBe('REQUEST_NOT_FOUND')
    })

    it('should set correct approval fields', async () => {
      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-1/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      await APPROVE_POST(request, { params: { id: 'request-1' } })
      
      expect(mockSupabaseClient.from().update).toHaveBeenCalledWith({
        status: 'approved',
        reviewed_by_admin_id: 'admin-id',
        reviewed_at: expect.any(String)
      })
    })
  })
})

describe('/api/admin/availability-approvals/[id]/reject', () => {
  describe('POST /api/admin/availability-approvals/[id]/reject', () => {
    it('should reject pending request with admin notes', async () => {
      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-1/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_notes: 'Request conflicts with existing schedule'
        })
      })
      
      const response = await REJECT_POST(request, { params: { id: 'request-1' } })
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data.id).toBe('request-1')
      expect(data.data.status).toBe('rejected')
      expect(data.data.rejected_by).toBe('admin-id')
      expect(data.data.admin_notes).toBe('Request conflicts with existing schedule')
    })

    it('should reject request without admin notes', async () => {
      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-1/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      const response = await REJECT_POST(request, { params: { id: 'request-1' } })
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data.status).toBe('rejected')
      expect(data.data.admin_notes).toBeUndefined()
    })

    it('should validate UUID format', async () => {
      const request = createMockRequest('http://localhost/api/admin/availability-approvals/invalid-id/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      const response = await REJECT_POST(request, { params: { id: 'invalid-id' } })
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })

    it('should require admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/auth/session')
      ;(requireAdmin as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'))

      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-1/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      const response = await REJECT_POST(request, { params: { id: 'request-1' } })
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.error.code).toBe('UNAUTHORIZED')
    })

    it('should handle validation errors in request body', async () => {
      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-1/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_notes: 123 // Invalid type - should be string
        })
      })
      
      const response = await REJECT_POST(request, { params: { id: 'request-1' } })
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })

    it('should clear pending change flags for update requests', async () => {
      const updateRequest = {
        ...mockPendingRequests[1], // This is an update request
        target_availability_id: 'availability-123'
      }

      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: updateRequest,
              error: null
            }))
          }))
        }))
      }).mockReturnValueOnce({
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            data: null,
            error: null
          }))
        }))
      }).mockReturnValueOnce({
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            data: null,
            error: null
          }))
        }))
      })

      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-2/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      const response = await REJECT_POST(request, { params: { id: 'request-2' } })
      
      expect(response.status).toBe(200)
      // Should have called update twice - once for the request, once for clearing flags
      expect(mockSupabaseClient.from().update).toHaveBeenCalledTimes(2)
    })

    it('should set correct rejection fields', async () => {
      const request = createMockRequest('http://localhost/api/admin/availability-approvals/request-1/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_notes: 'Test rejection'
        })
      })
      
      await REJECT_POST(request, { params: { id: 'request-1' } })
      
      expect(mockSupabaseClient.from().update).toHaveBeenCalledWith({
        status: 'rejected',
        reviewed_by_admin_id: 'admin-id',
        reviewed_at: expect.any(String),
        admin_notes: 'Test rejection'
      })
    })
  })
})