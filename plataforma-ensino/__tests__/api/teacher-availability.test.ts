/**
 * Teacher Availability API Tests
 * 
 * Comprehensive test suite for teacher availability CRUD endpoints
 */

import { jest, describe, beforeEach, it, expect } from '@jest/globals'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/teachers/[id]/availability/route'
import { PUT, DELETE } from '@/app/api/teachers/[id]/availability/[slotId]/route'
import {
  setupApiMocks,
  resetAllMocks,
  setupSuccessfulAuth,
  setupFailedAuth,
  setupDatabaseSuccess,
  setupDatabaseError,
  createMockRequest,
  generateAvailabilityData,
  expectErrorResponse,
  expectSuccessResponse,
  mockSupabaseClient,
  mockTeacher,
  mockUser
} from './setup'

// Setup mocks before all tests
setupApiMocks()

describe('Teacher Availability API', () => {
  const teacherId = 'teacher-123'
  const slotId = 'availability-123'

  beforeEach(() => {
    resetAllMocks()
  })

  describe('GET /api/teachers/[id]/availability', () => {
    it('should return teacher availability slots', async () => {
      const availability = [
        generateAvailabilityData(),
        generateAvailabilityData({ 
          id: 'availability-456', 
          day_of_week: 2,
          start_time: '10:00',
          end_time: '18:00'
        })
      ]
      
      // Mock teacher exists
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      
      // Mock availability query
      queryMock.single.mockResolvedValueOnce({ data: availability, error: null })
      Object.assign(queryMock, { data: availability, error: null })
      
      const request = createMockRequest('GET', `/api/teachers/${teacherId}/availability`, null, {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      })
      
      const response = await GET(request, { params: { id: teacherId } })
      
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toBeDefined()
      expect(Array.isArray(body.data)).toBe(true)
      expect(body.timestamp).toBeDefined()
    })

    it('should return validation error for invalid teacher ID', async () => {
      const request = createMockRequest('GET', '/api/teachers/invalid-id/availability', null, {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      })
      
      const response = await GET(request, { params: { id: 'invalid-id' } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return validation error for missing required dates', async () => {
      const request = createMockRequest('GET', `/api/teachers/${teacherId}/availability`)
      
      const response = await GET(request, { params: { id: teacherId } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return validation error for invalid date range', async () => {
      const request = createMockRequest('GET', `/api/teachers/${teacherId}/availability`, null, {
        startDate: '2024-12-31',
        endDate: '2024-01-01' // End before start
      })
      
      const response = await GET(request, { params: { id: teacherId } })
      
      expectErrorResponse(response, 'INVALID_DATE_RANGE', 400)
    })

    it('should return not found for non-existent teacher', async () => {
      const queryMock = setupDatabaseSuccess(null)
      queryMock.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      
      const request = createMockRequest('GET', `/api/teachers/${teacherId}/availability`, null, {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      })
      
      const response = await GET(request, { params: { id: teacherId } })
      
      expectErrorResponse(response, 'TEACHER_NOT_FOUND', 404)
    })

    it('should return no availability when teacher has no slots', async () => {
      // Mock teacher exists
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      
      // Mock empty availability
      Object.assign(queryMock, { data: [], error: null })
      
      const request = createMockRequest('GET', `/api/teachers/${teacherId}/availability`, null, {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      })
      
      const response = await GET(request, { params: { id: teacherId } })
      
      expectErrorResponse(response, 'NO_AVAILABILITY', 404)
    })

    it('should filter by day of week', async () => {
      const availability = [generateAvailabilityData({ day_of_week: 1 })]
      
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      Object.assign(queryMock, { data: availability, error: null })
      
      const request = createMockRequest('GET', `/api/teachers/${teacherId}/availability`, null, {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        dayOfWeek: '1'
      })
      
      const response = await GET(request, { params: { id: teacherId } })
      
      expect(response.status).toBe(200)
      expect(queryMock.eq).toHaveBeenCalledWith('day_of_week', 1)
    })
  })

  describe('POST /api/teachers/[id]/availability', () => {
    beforeEach(() => {
      setupSuccessfulAuth('admin')
    })

    it('should create availability slot for admin', async () => {
      const newAvailability = {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        maxStudents: 5,
        isActive: true
      }
      
      const createdAvailability = generateAvailabilityData(newAvailability)
      
      // Mock teacher exists
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      
      // Mock no conflicts
      Object.assign(queryMock, { data: [], error: null })
      
      // Mock successful creation
      queryMock.single.mockResolvedValueOnce({ data: createdAvailability, error: null })
      
      const request = createMockRequest('POST', `/api/teachers/${teacherId}/availability`, newAvailability)
      const response = await POST(request, { params: { id: teacherId } })
      
      expect(response.status).toBe(201)
      const body = await response.json()
      expect(body.data).toEqual(createdAvailability)
    })

    it('should allow teacher to create own availability', async () => {
      // Setup auth for teacher (owns the resource)
      const teacherUser = { ...mockUser, id: mockTeacher.user_id, role: 'instructor' }
      const teacherProfile = { ...mockUser, role: 'instructor' as const }
      setupSuccessfulAuth('instructor')
      
      const newAvailability = {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        maxStudents: 5,
        isActive: true
      }
      
      const createdAvailability = generateAvailabilityData(newAvailability)
      
      // Mock teacher exists and matches current user
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      
      // Mock no conflicts
      Object.assign(queryMock, { data: [], error: null })
      
      // Mock successful creation
      queryMock.single.mockResolvedValueOnce({ data: createdAvailability, error: null })
      
      const request = createMockRequest('POST', `/api/teachers/${teacherId}/availability`, newAvailability)
      const response = await POST(request, { params: { id: teacherId } })
      
      expect(response.status).toBe(201)
    })

    it('should return validation error for invalid time format', async () => {
      const invalidAvailability = {
        dayOfWeek: 1,
        startTime: '9:00 AM', // Invalid format
        endTime: '17:00',
        maxStudents: 5
      }
      
      const request = createMockRequest('POST', `/api/teachers/${teacherId}/availability`, invalidAvailability)
      const response = await POST(request, { params: { id: teacherId } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return validation error for invalid day of week', async () => {
      const invalidAvailability = {
        dayOfWeek: 8, // Invalid day
        startTime: '09:00',
        endTime: '17:00',
        maxStudents: 5
      }
      
      const request = createMockRequest('POST', `/api/teachers/${teacherId}/availability`, invalidAvailability)
      const response = await POST(request, { params: { id: teacherId } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return validation error when start time is after end time', async () => {
      const invalidAvailability = {
        dayOfWeek: 1,
        startTime: '17:00',
        endTime: '09:00', // Before start time
        maxStudents: 5
      }
      
      const request = createMockRequest('POST', `/api/teachers/${teacherId}/availability`, invalidAvailability)
      const response = await POST(request, { params: { id: teacherId } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return conflict error for overlapping time slots', async () => {
      const newAvailability = {
        dayOfWeek: 1,
        startTime: '10:00',
        endTime: '14:00',
        maxStudents: 5
      }
      
      const existingSlot = generateAvailabilityData({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '13:00' // Overlaps with new slot
      })
      
      // Mock teacher exists
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      
      // Mock existing conflicting slot
      Object.assign(queryMock, { data: [existingSlot], error: null })
      
      const request = createMockRequest('POST', `/api/teachers/${teacherId}/availability`, newAvailability)
      const response = await POST(request, { params: { id: teacherId } })
      
      expectErrorResponse(response, 'TIME_SLOT_CONFLICT', 409)
    })

    it('should require authentication', async () => {
      setupFailedAuth()
      
      const newAvailability = {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        maxStudents: 5
      }
      
      const request = createMockRequest('POST', `/api/teachers/${teacherId}/availability`, newAvailability)
      const response = await POST(request, { params: { id: teacherId } })
      
      expectErrorResponse(response, 'UNAUTHORIZED', 401)
    })

    it('should return not found for non-existent teacher', async () => {
      const queryMock = setupDatabaseSuccess(null)
      queryMock.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      
      const newAvailability = {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        maxStudents: 5
      }
      
      const request = createMockRequest('POST', `/api/teachers/${teacherId}/availability`, newAvailability)
      const response = await POST(request, { params: { id: teacherId } })
      
      expectErrorResponse(response, 'TEACHER_NOT_FOUND', 404)
    })
  })

  describe('PUT /api/teachers/[id]/availability/[slotId]', () => {
    beforeEach(() => {
      setupSuccessfulAuth('admin')
    })

    it('should update availability slot', async () => {
      const updateData = { maxStudents: 10, isActive: false }
      const existingSlot = generateAvailabilityData({ id: slotId, teacher_id: teacherId })
      const updatedSlot = { ...existingSlot, max_students: 10, is_active: false }
      
      // Mock teacher exists
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      
      // Mock slot exists
      queryMock.single.mockResolvedValueOnce({ data: existingSlot, error: null })
      
      // Mock successful update
      queryMock.single.mockResolvedValueOnce({ data: updatedSlot, error: null })
      
      const request = createMockRequest('PUT', `/api/teachers/${teacherId}/availability/${slotId}`, updateData)
      const response = await PUT(request, { params: { id: teacherId, slotId } })
      
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toEqual(updatedSlot)
    })

    it('should return validation error for invalid IDs', async () => {
      const request = createMockRequest('PUT', '/api/teachers/invalid-id/availability/invalid-slot', {})
      const response = await PUT(request, { params: { id: 'invalid-id', slotId: 'invalid-slot' } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return not found for non-existent teacher', async () => {
      const queryMock = setupDatabaseSuccess(null)
      queryMock.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      
      const request = createMockRequest('PUT', `/api/teachers/${teacherId}/availability/${slotId}`, { isActive: false })
      const response = await PUT(request, { params: { id: teacherId, slotId } })
      
      expectErrorResponse(response, 'TEACHER_NOT_FOUND', 404)
    })

    it('should return not found for non-existent availability slot', async () => {
      // Mock teacher exists
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      
      // Mock slot doesn't exist
      queryMock.single.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })
      
      const request = createMockRequest('PUT', `/api/teachers/${teacherId}/availability/${slotId}`, { isActive: false })
      const response = await PUT(request, { params: { id: teacherId, slotId } })
      
      expectErrorResponse(response, 'AVAILABILITY_SLOT_NOT_FOUND', 404)
    })

    it('should validate time order when updating times', async () => {
      const invalidUpdate = {
        startTime: '17:00',
        endTime: '09:00' // End before start
      }
      
      const existingSlot = generateAvailabilityData({ id: slotId, teacher_id: teacherId })
      
      // Mock teacher exists
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      queryMock.single.mockResolvedValueOnce({ data: existingSlot, error: null })
      
      const request = createMockRequest('PUT', `/api/teachers/${teacherId}/availability/${slotId}`, invalidUpdate)
      const response = await PUT(request, { params: { id: teacherId, slotId } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should require authentication', async () => {
      setupFailedAuth()
      
      const request = createMockRequest('PUT', `/api/teachers/${teacherId}/availability/${slotId}`, { isActive: false })
      const response = await PUT(request, { params: { id: teacherId, slotId } })
      
      expectErrorResponse(response, 'UNAUTHORIZED', 401)
    })
  })

  describe('DELETE /api/teachers/[id]/availability/[slotId]', () => {
    beforeEach(() => {
      setupSuccessfulAuth('admin')
    })

    it('should delete availability slot', async () => {
      const existingSlot = generateAvailabilityData({ id: slotId, teacher_id: teacherId })
      
      // Mock teacher exists
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      
      // Mock slot exists
      queryMock.single.mockResolvedValueOnce({ data: existingSlot, error: null })
      
      // Mock successful delete
      
      const request = createMockRequest('DELETE', `/api/teachers/${teacherId}/availability/${slotId}`)
      const response = await DELETE(request, { params: { id: teacherId, slotId } })
      
      expect(response.status).toBe(204)
    })

    it('should return validation error for invalid IDs', async () => {
      const request = createMockRequest('DELETE', '/api/teachers/invalid-id/availability/invalid-slot')
      const response = await DELETE(request, { params: { id: 'invalid-id', slotId: 'invalid-slot' } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return not found for non-existent slot', async () => {
      // Mock teacher exists
      const queryMock = setupDatabaseSuccess(mockTeacher)
      queryMock.single.mockResolvedValueOnce({ data: mockTeacher, error: null })
      
      // Mock slot doesn't exist
      queryMock.single.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })
      
      const request = createMockRequest('DELETE', `/api/teachers/${teacherId}/availability/${slotId}`)
      const response = await DELETE(request, { params: { id: teacherId, slotId } })
      
      expectErrorResponse(response, 'AVAILABILITY_SLOT_NOT_FOUND', 404)
    })

    it('should require authentication', async () => {
      setupFailedAuth()
      
      const request = createMockRequest('DELETE', `/api/teachers/${teacherId}/availability/${slotId}`)
      const response = await DELETE(request, { params: { id: teacherId, slotId } })
      
      expectErrorResponse(response, 'UNAUTHORIZED', 401)
    })
  })
})