/**
 * Test Setup for API Routes
 * 
 * Provides utilities and mocks for testing API endpoints
 */

import { jest } from '@jest/globals'
import { NextRequest } from 'next/server'

// Mock Supabase client
export const mockSupabaseClient = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn()
  }
}

// Mock session data
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  role: 'admin'
}

export const mockProfile = {
  id: 'user-123',
  email: 'test@example.com',
  role: 'admin' as const,
  full_name: 'Test Admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export const mockSession = {
  user: mockUser,
  profile: mockProfile,
  isAuthenticated: true
}

export const mockInstructor = {
  id: 'instructor-123',
  user_id: 'user-123'
}

export const mockTeacher = {
  id: 'teacher-123',
  user_id: 'user-123'
}

// Mock holiday data
export const mockHoliday = {
  id: 'holiday-123',
  date: '2024-12-25',
  name: 'Christmas Day',
  year: 2024,
  is_national: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Mock availability data
export const mockAvailability = {
  id: 'availability-123',
  teacher_id: 'teacher-123',
  day_of_week: 1,
  start_time: '09:00',
  end_time: '17:00',
  max_students: 5,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Helper to create mock NextRequest
export function createMockRequest(
  method: string,
  url: string,
  body?: any,
  searchParams?: Record<string, string>
): NextRequest {
  const searchString = searchParams 
    ? '?' + new URLSearchParams(searchParams).toString()
    : ''
  
  const fullUrl = `http://localhost:3000${url}${searchString}`
  
  const mockRequest = {
    method,
    url: fullUrl,
    json: jest.fn().mockResolvedValue(body),
    headers: new Headers(),
    nextUrl: new URL(fullUrl)
  } as unknown as NextRequest

  return mockRequest
}

// Helper to create Supabase query builder mock
export function createSupabaseQueryMock(data: any, error: any = null) {
  const queryBuilder = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis()
  }

  // For queries that don't use single()
  Object.assign(queryBuilder, { data, error })

  return queryBuilder
}

// Mock auth functions
export const mockRequireAdmin = jest.fn().mockResolvedValue({
  user: mockUser,
  profile: mockProfile,
  isAuthenticated: true,
  hasRequiredRole: true
})

export const mockVerifySession = jest.fn().mockResolvedValue(mockSession)

// Setup common mocks
export function setupApiMocks() {
  // Mock Supabase client creation
  jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn(() => mockSupabaseClient)
  }))

  // Mock auth session functions
  jest.mock('@/lib/auth/session', () => ({
    requireAdmin: mockRequireAdmin,
    verifySession: mockVerifySession,
    requireInstructorOrAdmin: jest.fn().mockResolvedValue({
      user: mockUser,
      profile: mockProfile,
      isAuthenticated: true,
      hasRequiredRole: true
    })
  }))
}

// Helper to reset all mocks
export function resetAllMocks() {
  jest.clearAllMocks()
  
  // Reset Supabase client mocks
  mockSupabaseClient.from.mockReset()
  mockSupabaseClient.auth.getUser.mockReset()
  
  // Reset auth mocks
  mockRequireAdmin.mockReset()
  mockVerifySession.mockReset()
}

// Helper to setup successful auth
export function setupSuccessfulAuth(role: 'admin' | 'instructor' | 'student' = 'admin') {
  const user = { ...mockUser, role }
  const profile = { ...mockProfile, role }
  const session = { user, profile, isAuthenticated: true }

  mockVerifySession.mockResolvedValue(session)
  mockRequireAdmin.mockResolvedValue({
    ...session,
    hasRequiredRole: true
  })
}

// Helper to setup failed auth
export function setupFailedAuth(error: string = 'Authentication required') {
  mockVerifySession.mockRejectedValue(new Error(error))
  mockRequireAdmin.mockRejectedValue(new Error('Redirect to login'))
}

// Helper to setup database success
export function setupDatabaseSuccess(data: any) {
  const queryMock = createSupabaseQueryMock(data)
  mockSupabaseClient.from.mockReturnValue(queryMock)
  return queryMock
}

// Helper to setup database error
export function setupDatabaseError(error: any) {
  const queryMock = createSupabaseQueryMock(null, error)
  mockSupabaseClient.from.mockReturnValue(queryMock)
  return queryMock
}

// Test data generators
export function generateHolidayData(overrides?: Partial<typeof mockHoliday>) {
  return {
    ...mockHoliday,
    ...overrides
  }
}

export function generateAvailabilityData(overrides?: Partial<typeof mockAvailability>) {
  return {
    ...mockAvailability,
    ...overrides
  }
}

// Assertion helpers
export function expectErrorResponse(response: any, code: string, status: number) {
  expect(response.status).toBe(status)
  const body = response.json()
  expect(body.error).toBeDefined()
  expect(body.error.code).toBe(code)
  expect(body.timestamp).toBeDefined()
  expect(body.path).toBeDefined()
}

export function expectSuccessResponse(response: any, status: number = 200) {
  expect(response.status).toBe(status)
  const body = response.json()
  expect(body.data).toBeDefined()
  expect(body.timestamp).toBeDefined()
}