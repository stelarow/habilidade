/**
 * Calculate End Date API Tests
 * Story 2.1: Core Business Logic - Task 3
 * 
 * Comprehensive test suite for course end date calculation API
 * including authentication, validation, and business logic scenarios
 */

import { jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { POST, GET, OPTIONS } from '@/app/api/calculate-end-date/route'
import { CalculateEndDateRequest, Holiday, TeacherAvailability } from '@/types/api'

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  }))
}))

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn()
  }
}

const mockQuery = {
  select: jest.fn(),
  eq: jest.fn(),
  gte: jest.fn(),
  lte: jest.fn(),
  order: jest.fn(),
  single: jest.fn()
}

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: () => mockSupabaseClient
}))

// Mock authentication middleware
jest.mock('@/lib/middleware/api-auth', () => ({
  authMiddleware: jest.fn()
}))

// Mock utilities
jest.mock('@/utils/dateCalculations', () => ({
  calculateCourseEndDate: jest.fn(),
  getHolidaysInRange: jest.fn(),
  toISODateString: jest.fn(),
  parseISODate: jest.fn()
}))

jest.mock('@/utils/teacherAvailabilityLogic', () => ({
  calculateAvailableSlots: jest.fn(),
  validateTeacherAvailability: jest.fn()
}))

jest.mock('@/lib/utils/api-error-handler', () => ({
  handleApiError: jest.fn(),
  ApiError: class ApiError extends Error {
    constructor(public code: string, message: string, public details?: any) {
      super(message)
    }
  }
}))

// Import mocked modules
import { authMiddleware } from '@/lib/middleware/api-auth'
import { calculateCourseEndDate, toISODateString, parseISODate } from '@/utils/dateCalculations'
import { calculateAvailableSlots, validateTeacherAvailability } from '@/utils/teacherAvailabilityLogic'
import { handleApiError } from '@/lib/utils/api-error-handler'

const mockAuthMiddleware = authMiddleware as jest.MockedFunction<typeof authMiddleware>
const mockCalculateCourseEndDate = calculateCourseEndDate as jest.MockedFunction<typeof calculateCourseEndDate>
const mockToISODateString = toISODateString as jest.MockedFunction<typeof toISODateString>
const mockParseISODate = parseISODate as jest.MockedFunction<typeof parseISODate>
const mockCalculateAvailableSlots = calculateAvailableSlots as jest.MockedFunction<typeof calculateAvailableSlots>
const mockValidateTeacherAvailability = validateTeacherAvailability as jest.MockedFunction<typeof validateTeacherAvailability>
const mockHandleApiError = handleApiError as jest.MockedFunction<typeof handleApiError>

// Test data
const validRequest: CalculateEndDateRequest = {
  startDate: '2025-01-06',
  courseHours: 40,
  weeklyClasses: 2,
  teacherId: '123e4567-e89b-12d3-a456-426614174000',
  excludeHolidays: true
}

const mockTeacher = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  max_students_per_class: 10,
  calendar_settings: {}
}

const mockHolidays: Holiday[] = [
  {
    id: '1',
    date: '2025-01-01',
    name: 'New Year\'s Day',
    year: 2025,
    is_national: true,
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z'
  }
]

const mockCourseSchedule = {
  endDate: new Date('2025-03-15'),
  totalWeeks: 10,
  holidaysExcluded: [new Date('2025-01-01')],
  actualClassDays: 20,
  schedule: [
    {
      date: new Date('2025-01-06'),
      startTime: '09:00',
      endTime: '11:00',
      duration: 120
    }
  ]
}

const mockAvailabilitySlots = [
  {
    id: '1',
    teacherId: '123e4567-e89b-12d3-a456-426614174000',
    date: '2025-01-06',
    startTime: '09:00',
    endTime: '11:00',
    maxStudents: 10,
    availableSpots: 8,
    conflictsWithHoliday: false,
    nextOccurrence: new Date('2025-01-06'),
    isRecurring: true,
    dayOfWeekName: 'Monday'
  }
]

describe('Calculate End Date API', () => {
  let mockRequest: NextRequest

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mocks
    mockAuthMiddleware.mockResolvedValue({ success: true, user: { id: 'user-id' } })
    mockParseISODate.mockReturnValue(new Date('2025-01-06'))
    mockToISODateString.mockImplementation((date: Date) => date.toISOString().substring(0, 10))
    mockCalculateCourseEndDate.mockReturnValue(mockCourseSchedule)
    mockCalculateAvailableSlots.mockResolvedValue(mockAvailabilitySlots)
    mockValidateTeacherAvailability.mockResolvedValue({
      isValid: true,
      issues: [],
      warnings: []
    })

    // Setup Supabase mocks
    mockSupabaseClient.from.mockImplementation((table: string) => {
      if (table === 'teachers') {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: mockTeacher, error: null })
            })
          })
        }
      }
      if (table === 'holidays') {
        return {
          select: () => ({
            gte: () => ({
              lte: () => ({
                order: () => Promise.resolve({ data: mockHolidays, error: null })
              })
            })
          })
        }
      }
      return mockQuery
    })

    // Create mock request
    mockRequest = {
      json: jest.fn().mockResolvedValue(validRequest),
      headers: new Headers(),
      ip: '127.0.0.1'
    } as any
  })

  describe('POST /api/calculate-end-date', () => {
    it('should calculate course end date successfully', async () => {
      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toBeDefined()
      expect(data.data.endDate).toBeDefined()
      expect(data.data.totalWeeks).toBeDefined()
      expect(data.data.schedule).toBeInstanceOf(Array)
      expect(data.timestamp).toBeDefined()
    })

    it('should return 401 when authentication fails', async () => {
      mockAuthMiddleware.mockResolvedValue({ 
        success: false, 
        error: 'Invalid token'
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error.code).toBe('UNAUTHORIZED')
      expect(data.error.message).toBe('Authentication required')
    })

    it('should return 400 for invalid request data', async () => {
      const invalidRequest = { ...validRequest, courseHours: -10 }
      mockRequest.json = jest.fn().mockResolvedValue(invalidRequest)

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
      expect(data.error.message).toBe('Invalid request data')
      expect(data.error.details).toBeDefined()
    })

    it('should return 404 when teacher not found', async () => {
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'teachers') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'Not found' } })
              })
            })
          }
        }
        return mockQuery
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error.code).toBe('TEACHER_NOT_FOUND')
    })

    it('should return 409 when teacher has invalid availability', async () => {
      mockValidateTeacherAvailability.mockResolvedValue({
        isValid: false,
        issues: ['No availability configured'],
        warnings: []
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error.code).toBe('NO_AVAILABILITY')
      expect(data.error.message).toContain('invalid availability configuration')
    })

    it('should return 409 when teacher has no available slots', async () => {
      mockCalculateAvailableSlots.mockResolvedValue([])

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error.code).toBe('NO_AVAILABILITY')
      expect(data.error.message).toContain('no available time slots')
    })

    it('should handle holiday exclusion correctly', async () => {
      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.holidaysExcluded).toBeInstanceOf(Array)
      expect(mockCalculateCourseEndDate).toHaveBeenCalledWith(
        expect.any(Date),
        validRequest.courseHours,
        validRequest.weeklyClasses,
        expect.any(Array)
      )
    })

    it('should skip holiday exclusion when excludeHolidays is false', async () => {
      const requestWithoutHolidays = { ...validRequest, excludeHolidays: false }
      mockRequest.json = jest.fn().mockResolvedValue(requestWithoutHolidays)

      const response = await POST(mockRequest)

      expect(response.status).toBe(200)
      expect(mockCalculateCourseEndDate).toHaveBeenCalledWith(
        expect.any(Date),
        validRequest.courseHours,
        validRequest.weeklyClasses,
        [] // Empty holidays array
      )
    })

    it('should handle database connection errors', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const response = await POST(mockRequest)

      expect(mockHandleApiError).toHaveBeenCalledWith(
        expect.any(Error),
        '/api/calculate-end-date'
      )
    })

    it('should generate detailed class schedule with teacher availability', async () => {
      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.schedule).toBeInstanceOf(Array)
      expect(data.data.schedule[0]).toHaveProperty('date')
      expect(data.data.schedule[0]).toHaveProperty('startTime')
      expect(data.data.schedule[0]).toHaveProperty('endTime')
      expect(data.data.schedule[0]).toHaveProperty('duration')
    })

    it('should include rate limiting headers', async () => {
      const response = await POST(mockRequest)

      expect(response.headers.get('X-RateLimit-Limit')).toBe('50')
      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
    })

    it('should validate response schema', async () => {
      // Mock invalid response data that would fail schema validation
      mockCalculateCourseEndDate.mockReturnValue({
        ...mockCourseSchedule,
        totalWeeks: -1 // Invalid value
      })

      const response = await POST(mockRequest)

      expect(mockHandleApiError).toHaveBeenCalled()
    })

    it('should handle missing request body', async () => {
      mockRequest.json = jest.fn().mockRejectedValue(new Error('No JSON body'))

      const response = await POST(mockRequest)

      expect(mockHandleApiError).toHaveBeenCalledWith(
        expect.any(Error),
        '/api/calculate-end-date'
      )
    })

    it('should handle malformed JSON', async () => {
      mockRequest.json = jest.fn().mockRejectedValue(new SyntaxError('Unexpected token'))

      const response = await POST(mockRequest)

      expect(mockHandleApiError).toHaveBeenCalledWith(
        expect.any(Error),
        '/api/calculate-end-date'
      )
    })
  })

  describe('Edge Cases and Complex Scenarios', () => {
    it('should handle very long courses (near 2-year limit)', async () => {
      const longCourseRequest = {
        ...validRequest,
        courseHours: 2000 // Very long course
      }
      mockRequest.json = jest.fn().mockResolvedValue(longCourseRequest)

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.totalWeeks).toBeGreaterThan(50)
    })

    it('should handle courses with many weekly classes', async () => {
      const intensiveRequest = {
        ...validRequest,
        weeklyClasses: 7 // Daily classes
      }
      mockRequest.json = jest.fn().mockResolvedValue(intensiveRequest)

      const response = await POST(mockRequest)

      expect(response.status).toBe(200)
      expect(mockCalculateCourseEndDate).toHaveBeenCalledWith(
        expect.any(Date),
        validRequest.courseHours,
        7,
        expect.any(Array)
      )
    })

    it('should handle courses starting on weekends', async () => {
      const weekendStartRequest = {
        ...validRequest,
        startDate: '2025-01-04' // Saturday
      }
      mockRequest.json = jest.fn().mockResolvedValue(weekendStartRequest)

      const response = await POST(mockRequest)

      expect(response.status).toBe(200)
      // Should still calculate properly despite weekend start
    })

    it('should handle multiple overlapping holidays', async () => {
      const multipleHolidays = [
        ...mockHolidays,
        {
          id: '2',
          date: '2025-12-25',
          name: 'Christmas Day',
          year: 2025,
          is_national: true,
          created_at: '2024-12-01T00:00:00Z',
          updated_at: '2024-12-01T00:00:00Z'
        }
      ]

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'holidays') {
          return {
            select: () => ({
              gte: () => ({
                lte: () => ({
                  order: () => Promise.resolve({ data: multipleHolidays, error: null })
                })
              })
            })
          }
        }
        if (table === 'teachers') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: mockTeacher, error: null })
              })
            })
          }
        }
        return mockQuery
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.holidaysExcluded.length).toBeGreaterThanOrEqual(1)
    })

    it('should handle teacher with limited availability slots', async () => {
      const limitedAvailability = [mockAvailabilitySlots[0]] // Only one slot
      mockCalculateAvailableSlots.mockResolvedValue(limitedAvailability)

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.schedule).toBeDefined()
    })

    it('should handle timezone edge cases', async () => {
      // Mock date parsing for timezone edge case
      mockParseISODate.mockReturnValue(new Date('2025-01-01T00:00:00Z'))

      const response = await POST(mockRequest)

      expect(response.status).toBe(200)
      expect(mockParseISODate).toHaveBeenCalledWith(validRequest.startDate)
    })
  })

  describe('GET /api/calculate-end-date', () => {
    it('should return health check information', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('healthy')
      expect(data.endpoint).toBe('/api/calculate-end-date')
      expect(data.methods).toContain('POST')
      expect(data.version).toBeDefined()
      expect(data.timestamp).toBeDefined()
    })
  })

  describe('OPTIONS /api/calculate-end-date', () => {
    it('should return CORS headers', async () => {
      const response = await OPTIONS()

      expect(response.status).toBe(200)
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST')
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Content-Type')
      expect(response.headers.get('Access-Control-Max-Age')).toBe('86400')
    })
  })

  describe('Error Handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      mockCalculateCourseEndDate.mockImplementation(() => {
        throw new Error('Unexpected calculation error')
      })

      const response = await POST(mockRequest)

      expect(mockHandleApiError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Unexpected calculation error'
        }),
        '/api/calculate-end-date'
      )
    })

    it('should handle Supabase connection timeouts', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Connection timeout')
      })

      const response = await POST(mockRequest)

      expect(mockHandleApiError).toHaveBeenCalledWith(
        expect.any(Error),
        '/api/calculate-end-date'
      )
    })

    it('should handle invalid UUID format in teacher ID', async () => {
      const invalidUUIDRequest = {
        ...validRequest,
        teacherId: 'invalid-uuid'
      }
      mockRequest.json = jest.fn().mockResolvedValue(invalidUUIDRequest)

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })

    it('should handle date parsing errors', async () => {
      mockParseISODate.mockImplementation(() => {
        throw new Error('Invalid date format')
      })

      const response = await POST(mockRequest)

      expect(mockHandleApiError).toHaveBeenCalledWith(
        expect.any(Error),
        '/api/calculate-end-date'
      )
    })
  })

  describe('Rate Limiting and Performance', () => {
    it('should handle rate limiting configuration', async () => {
      // Test that rate limiting headers are included
      const response = await POST(mockRequest)

      expect(response.headers.get('X-RateLimit-Limit')).toBe('50')
      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
    })

    it('should handle requests from different users', async () => {
      // Mock different user IDs
      const userRequest = {
        ...mockRequest,
        headers: new Headers({ 'x-user-id': 'user-123' })
      }

      const response = await POST(userRequest as NextRequest)

      expect(response.status).toBe(200)
    })

    it('should handle anonymous requests (no user ID)', async () => {
      // Request without user ID should use IP for rate limiting
      const response = await POST(mockRequest)

      expect(response.status).toBe(200)
    })
  })
})