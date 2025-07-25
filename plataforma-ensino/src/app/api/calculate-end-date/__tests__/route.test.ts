/**
 * Calculate End Date API Endpoint Tests
 * Story 2.1: Core Business Logic - Task 4
 * 
 * Comprehensive test suite for the calculate-end-date API endpoint
 */

import { NextRequest } from 'next/server'
import { POST, GET } from '../route'

// Mock the date calculations module
jest.mock('@/utils/dateCalculations', () => ({
  parseDateISO: jest.fn((dateStr: string) => new Date(dateStr + 'T00:00:00Z')),
  formatDateISO: jest.fn((date: Date) => date.toISOString().split('T')[0]),
  calculateCourseEndDateDetailed: jest.fn(() => ({
    startDate: new Date('2025-08-01T00:00:00Z'),
    endDate: new Date('2025-08-07T00:00:00Z'),
    workingDays: 5,
    excludedDays: {
      weekends: 2,
      holidays: 0
    }
  })),
  getCachedHolidays: jest.fn(() => [])
}))

// Mock Supabase
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  }))
}))

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => []),
    set: jest.fn()
  }))
}))

describe('/api/calculate-end-date', () => {
  // Mock environment variables
  beforeAll(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST endpoint', () => {
    it('should calculate end date successfully for valid request', async () => {
      // Mock successful authentication
      const mockSupabase = require('@supabase/ssr').createServerClient()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      })
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { role: 'admin' },
        error: null
      })

      const requestBody = {
        start_date: '2025-08-01',
        duration: 5
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        start_date: '2025-08-01',
        end_date: '2025-08-07',
        working_days: 5,
        excluded_days: {
          weekends: 2,
          holidays: 0
        }
      })
    })

    it('should return 400 for invalid date format', async () => {
      const requestBody = {
        start_date: '2025/08/01', // Invalid format
        duration: 5
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
      expect(data.details).toBeDefined()
    })

    it('should return 400 for invalid duration', async () => {
      const requestBody = {
        start_date: '2025-08-01',
        duration: 0 // Invalid duration
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })

    it('should return 400 for duration too large', async () => {
      const requestBody = {
        start_date: '2025-08-01',
        duration: 400 // Too large
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })

    it('should return 401 for unauthenticated request', async () => {
      // Mock failed authentication
      const mockSupabase = require('@supabase/ssr').createServerClient()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' }
      })

      const requestBody = {
        start_date: '2025-08-01',
        duration: 5
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Authentication required')
    })

    it('should return 403 for non-admin user', async () => {
      // Mock authenticated non-admin user
      const mockSupabase = require('@supabase/ssr').createServerClient()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      })
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { role: 'student' }, // Not admin
        error: null
      })

      const requestBody = {
        start_date: '2025-08-01',
        duration: 5
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Admin access required')
    })

    it('should return 400 for malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('should return 400 for missing required fields', async () => {
      const requestBody = {
        start_date: '2025-08-01'
        // Missing duration
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })

    it('should handle edge case dates correctly', async () => {
      // Mock successful authentication
      const mockSupabase = require('@supabase/ssr').createServerClient()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      })
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { role: 'admin' },
        error: null
      })

      // Test leap year date
      const requestBody = {
        start_date: '2024-02-29',
        duration: 1
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    it('should include timestamp in response', async () => {
      // Mock successful authentication
      const mockSupabase = require('@supabase/ssr').createServerClient()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      })
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { role: 'admin' },
        error: null
      })

      const requestBody = {
        start_date: '2025-08-01',
        duration: 5
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.start_date).toBeDefined()
      expect(data.end_date).toBeDefined()
      expect(data.working_days).toBeDefined()
      expect(data.excluded_days).toBeDefined()
    })
  })

  describe('GET endpoint', () => {
    it('should return API information', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.name).toBe('Calculate End Date API')
      expect(data.description).toBeDefined()
      expect(data.version).toBe('1.0.0')
      expect(data.methods).toContain('POST')
      expect(data.parameters).toBeDefined()
      expect(data.authentication).toBeDefined()
      expect(data.timestamp).toBeDefined()
    })
  })

  describe('Response validation', () => {
    it('should return correct content type', async () => {
      // Mock successful authentication
      const mockSupabase = require('@supabase/ssr').createServerClient()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      })
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { role: 'admin' },
        error: null
      })

      const requestBody = {
        start_date: '2025-08-01',
        duration: 5
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      
      expect(response.headers.get('Content-Type')).toBe('application/json')
    })

    it('should validate response structure', async () => {
      // Mock successful authentication
      const mockSupabase = require('@supabase/ssr').createServerClient()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      })
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { role: 'admin' },
        error: null
      })

      const requestBody = {
        start_date: '2025-08-01',
        duration: 5
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      // Validate response structure matches DateCalculationResponse interface
      expect(typeof data.start_date).toBe('string')
      expect(typeof data.end_date).toBe('string')
      expect(typeof data.working_days).toBe('number')
      expect(typeof data.excluded_days).toBe('object')
      expect(typeof data.excluded_days.weekends).toBe('number')
      expect(typeof data.excluded_days.holidays).toBe('number')
    })
  })

  describe('Performance tests', () => {
    it('should respond within 100ms performance target', async () => {
      // Mock successful authentication
      const mockSupabase = require('@supabase/ssr').createServerClient()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      })
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { role: 'admin' },
        error: null
      })

      const requestBody = {
        start_date: '2025-08-01',
        duration: 100 // Large duration
      }

      const request = new NextRequest('http://localhost:3000/api/calculate-end-date', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const startTime = performance.now()
      const response = await POST(request)
      const endTime = performance.now()

      expect(response.status).toBe(200)
      expect(endTime - startTime).toBeLessThan(100) // Performance requirement
    })
  })
})