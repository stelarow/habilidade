/**
 * Holidays API Tests
 * 
 * Comprehensive test suite for holidays CRUD endpoints
 */

import { jest, describe, beforeEach, it, expect } from '@jest/globals'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/holidays/route'
import { PUT, DELETE } from '@/app/api/holidays/[id]/route'
import {
  setupApiMocks,
  resetAllMocks,
  setupSuccessfulAuth,
  setupFailedAuth,
  setupDatabaseSuccess,
  setupDatabaseError,
  createMockRequest,
  generateHolidayData,
  expectErrorResponse,
  expectSuccessResponse,
  mockSupabaseClient
} from './setup'

// Setup mocks before all tests
setupApiMocks()

describe('Holidays API', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  describe('GET /api/holidays', () => {
    it('should return all holidays without filters', async () => {
      const holidays = [
        generateHolidayData(),
        generateHolidayData({ id: 'holiday-456', name: 'New Year' })
      ]
      
      setupDatabaseSuccess(holidays)
      
      const request = createMockRequest('GET', '/api/holidays')
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toEqual(holidays)
      expect(body.timestamp).toBeDefined()
    })

    it('should filter holidays by year', async () => {
      const holidays = [generateHolidayData({ year: 2024 })]
      setupDatabaseSuccess(holidays)
      
      const request = createMockRequest('GET', '/api/holidays', null, { year: '2024' })
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('holidays')
    })

    it('should filter holidays by month and year', async () => {
      const holidays = [generateHolidayData({ date: '2024-12-25' })]
      setupDatabaseSuccess(holidays)
      
      const request = createMockRequest('GET', '/api/holidays', null, { 
        year: '2024', 
        month: '12' 
      })
      const response = await GET(request)
      
      expect(response.status).toBe(200)
    })

    it('should filter holidays by date range', async () => {
      const holidays = [generateHolidayData()]
      setupDatabaseSuccess(holidays)
      
      const request = createMockRequest('GET', '/api/holidays', null, {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      })
      const response = await GET(request)
      
      expect(response.status).toBe(200)
    })

    it('should filter holidays by national flag', async () => {
      const holidays = [generateHolidayData({ is_national: true })]
      setupDatabaseSuccess(holidays)
      
      const request = createMockRequest('GET', '/api/holidays', null, {
        isNational: 'true'
      })
      const response = await GET(request)
      
      expect(response.status).toBe(200)
    })

    it('should return validation error for invalid year', async () => {
      const request = createMockRequest('GET', '/api/holidays', null, {
        year: '2019' // Below minimum
      })
      const response = await GET(request)
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return validation error for month without year', async () => {
      const request = createMockRequest('GET', '/api/holidays', null, {
        month: '12' // Without year
      })
      const response = await GET(request)
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return validation error for invalid date format', async () => {
      const request = createMockRequest('GET', '/api/holidays', null, {
        startDate: '2024/12/25' // Wrong format
      })
      const response = await GET(request)
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should handle database errors', async () => {
      setupDatabaseError({ message: 'Database connection failed' })
      
      const request = createMockRequest('GET', '/api/holidays')
      const response = await GET(request)
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 500)
    })
  })

  describe('POST /api/holidays', () => {
    beforeEach(() => {
      setupSuccessfulAuth('admin')
    })

    it('should create a new holiday', async () => {
      const newHoliday = {
        date: '2024-07-04',
        name: 'Independence Day',
        is_national: true
      }
      
      const createdHoliday = generateHolidayData(newHoliday)
      
      // Mock: no existing holiday
      const queryMock = setupDatabaseSuccess(null)
      queryMock.single.mockResolvedValueOnce({ data: null, error: null })
      queryMock.single.mockResolvedValueOnce({ data: createdHoliday, error: null })
      
      const request = createMockRequest('POST', '/api/holidays', newHoliday)
      const response = await POST(request)
      
      expect(response.status).toBe(201)
      const body = await response.json()
      expect(body.data).toEqual(createdHoliday)
    })

    it('should return validation error for invalid date format', async () => {
      const invalidHoliday = {
        date: '2024/07/04', // Wrong format
        name: 'Independence Day',
        is_national: true
      }
      
      const request = createMockRequest('POST', '/api/holidays', invalidHoliday)
      const response = await POST(request)
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return validation error for missing name', async () => {
      const invalidHoliday = {
        date: '2024-07-04',
        name: '', // Empty name
        is_national: true
      }
      
      const request = createMockRequest('POST', '/api/holidays', invalidHoliday)
      const response = await POST(request)
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return conflict error for existing holiday', async () => {
      const existingHoliday = generateHolidayData()
      const queryMock = setupDatabaseSuccess(existingHoliday)
      queryMock.single.mockResolvedValue({ data: existingHoliday, error: null })
      
      const newHoliday = {
        date: existingHoliday.date,
        name: 'Different Holiday',
        is_national: false
      }
      
      const request = createMockRequest('POST', '/api/holidays', newHoliday)
      const response = await POST(request)
      
      expectErrorResponse(response, 'HOLIDAY_CONFLICT', 409)
    })

    it('should require admin authentication', async () => {
      setupFailedAuth()
      
      const newHoliday = {
        date: '2024-07-04',
        name: 'Independence Day',
        is_national: true
      }
      
      const request = createMockRequest('POST', '/api/holidays', newHoliday)
      const response = await POST(request)
      
      expectErrorResponse(response, 'UNAUTHORIZED', 401)
    })

    it('should handle database errors during creation', async () => {
      const queryMock = setupDatabaseSuccess(null)
      queryMock.single.mockResolvedValueOnce({ data: null, error: null })
      queryMock.single.mockResolvedValueOnce({ 
        data: null, 
        error: { message: 'Insert failed' }
      })
      
      const newHoliday = {
        date: '2024-07-04',
        name: 'Independence Day',
        is_national: true
      }
      
      const request = createMockRequest('POST', '/api/holidays', newHoliday)
      const response = await POST(request)
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 500)
    })
  })

  describe('PUT /api/holidays/[id]', () => {
    const holidayId = 'holiday-123'

    beforeEach(() => {
      setupSuccessfulAuth('admin')
    })

    it('should update existing holiday', async () => {
      const existingHoliday = generateHolidayData({ id: holidayId })
      const updateData = { name: 'Updated Holiday Name' }
      const updatedHoliday = { ...existingHoliday, ...updateData }
      
      const queryMock = setupDatabaseSuccess(updatedHoliday)
      queryMock.single.mockResolvedValueOnce({ data: existingHoliday, error: null })
      queryMock.single.mockResolvedValueOnce({ data: updatedHoliday, error: null })
      
      const request = createMockRequest('PUT', `/api/holidays/${holidayId}`, updateData)
      const response = await PUT(request, { params: { id: holidayId } })
      
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toEqual(updatedHoliday)
    })

    it('should return validation error for invalid UUID', async () => {
      const request = createMockRequest('PUT', '/api/holidays/invalid-id', {})
      const response = await PUT(request, { params: { id: 'invalid-id' } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return not found for non-existent holiday', async () => {
      const queryMock = setupDatabaseSuccess(null)
      queryMock.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      
      const request = createMockRequest('PUT', `/api/holidays/${holidayId}`, { name: 'Updated' })
      const response = await PUT(request, { params: { id: holidayId } })
      
      expectErrorResponse(response, 'HOLIDAY_NOT_FOUND', 404)
    })

    it('should validate no empty updates', async () => {
      const request = createMockRequest('PUT', `/api/holidays/${holidayId}`, {})
      const response = await PUT(request, { params: { id: holidayId } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should check for date conflicts when updating date', async () => {
      const existingHoliday = generateHolidayData({ id: holidayId })
      const conflictingHoliday = generateHolidayData({ id: 'other-id' })
      
      const queryMock = setupDatabaseSuccess(existingHoliday)
      queryMock.single.mockResolvedValueOnce({ data: existingHoliday, error: null })
      queryMock.single.mockResolvedValueOnce({ data: conflictingHoliday, error: null })
      
      const updateData = { date: conflictingHoliday.date }
      
      const request = createMockRequest('PUT', `/api/holidays/${holidayId}`, updateData)
      const response = await PUT(request, { params: { id: holidayId } })
      
      expectErrorResponse(response, 'HOLIDAY_CONFLICT', 409)
    })

    it('should require admin authentication', async () => {
      setupFailedAuth()
      
      const request = createMockRequest('PUT', `/api/holidays/${holidayId}`, { name: 'Updated' })
      const response = await PUT(request, { params: { id: holidayId } })
      
      expectErrorResponse(response, 'UNAUTHORIZED', 401)
    })
  })

  describe('DELETE /api/holidays/[id]', () => {
    const holidayId = 'holiday-123'

    beforeEach(() => {
      setupSuccessfulAuth('admin')
    })

    it('should delete existing holiday', async () => {
      const existingHoliday = generateHolidayData({ id: holidayId })
      
      const queryMock = setupDatabaseSuccess(null)
      queryMock.single.mockResolvedValue({ data: existingHoliday, error: null })
      // Mock successful delete (no return data)
      
      const request = createMockRequest('DELETE', `/api/holidays/${holidayId}`)
      const response = await DELETE(request, { params: { id: holidayId } })
      
      expect(response.status).toBe(204)
    })

    it('should return validation error for invalid UUID', async () => {
      const request = createMockRequest('DELETE', '/api/holidays/invalid-id')
      const response = await DELETE(request, { params: { id: 'invalid-id' } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should return not found for non-existent holiday', async () => {
      const queryMock = setupDatabaseSuccess(null)
      queryMock.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      
      const request = createMockRequest('DELETE', `/api/holidays/${holidayId}`)
      const response = await DELETE(request, { params: { id: holidayId } })
      
      expectErrorResponse(response, 'HOLIDAY_NOT_FOUND', 404)
    })

    it('should require admin authentication', async () => {
      setupFailedAuth()
      
      const request = createMockRequest('DELETE', `/api/holidays/${holidayId}`)
      const response = await DELETE(request, { params: { id: holidayId } })
      
      expectErrorResponse(response, 'UNAUTHORIZED', 401)
    })

    it('should handle database errors during deletion', async () => {
      const existingHoliday = generateHolidayData({ id: holidayId })
      
      const queryMock = setupDatabaseError({ message: 'Delete failed' })
      queryMock.single.mockResolvedValue({ data: existingHoliday, error: null })
      
      const request = createMockRequest('DELETE', `/api/holidays/${holidayId}`)
      const response = await DELETE(request, { params: { id: holidayId } })
      
      expectErrorResponse(response, 'VALIDATION_ERROR', 500)
    })
  })
})