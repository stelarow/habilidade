/**
 * Business Logic Integration Tests
 * Story 2.1: Core Business Logic - Task 4
 * 
 * End-to-end integration tests for complete scheduling workflows
 * including complex scenarios, real-time updates, and performance validation
 */

import { jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/calculate-end-date/route'
import {
  calculateCourseEndDate,
  getHolidaysInRange,
  isBusinessDay,
  getBusinessDaysBetween
} from '@/utils/dateCalculations'
import {
  calculateAvailableSlots,
  checkCapacityConflicts,
  validateTeacherAvailability,
  subscribeToAvailabilityUpdates
} from '@/utils/teacherAvailabilityLogic'
import { Holiday, TeacherAvailability, CalculateEndDateRequest } from '@/types/api'

// Mock Supabase for integration testing
const mockSupabaseClient = {
  from: jest.fn(),
  channel: jest.fn(),
  removeChannel: jest.fn(),
  auth: {
    getUser: jest.fn()
  }
}

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: () => mockSupabaseClient,
  createClientComponentClient: () => mockSupabaseClient
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  }))
}))

jest.mock('@/lib/middleware/api-auth', () => ({
  authMiddleware: jest.fn().mockResolvedValue({ 
    success: true, 
    user: { id: 'test-user-id' } 
  })
}))

jest.mock('@/lib/utils/api-error-handler', () => ({
  handleApiError: jest.fn().mockImplementation((error, path) => ({
    json: () => Promise.resolve({
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message,
        details: error
      },
      timestamp: new Date().toISOString(),
      path
    }),
    status: 500
  })),
  ApiError: class ApiError extends Error {
    constructor(public code: string, message: string, public details?: any) {
      super(message)
    }
  }
}))

describe('Business Logic Integration Tests', () => {
  const mockTeacherId = '123e4567-e89b-12d3-a456-426614174000'
  const mockTeacher = {
    id: mockTeacherId,
    max_students_per_class: 15,
    calendar_settings: { preferred_start_time: '09:00' }
  }

  const complexHolidayScenario: Holiday[] = [
    {
      id: '1',
      date: '2025-01-01',
      name: 'New Year\'s Day',
      year: 2025,
      is_national: true,
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z'
    },
    {
      id: '2',
      date: '2025-01-02',
      name: 'New Year Holiday',
      year: 2025,
      is_national: false,
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z'
    },
    {
      id: '3',
      date: '2025-01-03',
      name: 'Extended Holiday',
      year: 2025,
      is_national: false,
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z'
    },
    {
      id: '4',
      date: '2025-07-04',
      name: 'Independence Day',
      year: 2025,
      is_national: true,
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z'
    },
    {
      id: '5',
      date: '2025-12-25',
      name: 'Christmas Day',
      year: 2025,
      is_national: true,
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z'
    }
  ]

  const complexAvailabilityScenario: TeacherAvailability[] = [
    {
      id: 'slot-1',
      teacher_id: mockTeacherId,
      day_of_week: 1, // Monday
      start_time: '09:00',
      end_time: '11:00',
      max_students: 12,
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'slot-2',
      teacher_id: mockTeacherId,
      day_of_week: 3, // Wednesday
      start_time: '14:00',
      end_time: '16:00',
      max_students: 10,
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'slot-3',
      teacher_id: mockTeacherId,
      day_of_week: 5, // Friday
      start_time: '10:00',
      end_time: '12:00',
      max_students: 8,
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    setupMockDatabase()
  })

  function setupMockDatabase() {
    mockSupabaseClient.from.mockImplementation((table: string) => {
      switch (table) {
        case 'teachers':
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: mockTeacher, error: null })
              })
            })
          }
        case 'holidays':
          return {
            select: () => ({
              gte: () => ({
                lte: () => ({
                  order: () => Promise.resolve({ data: complexHolidayScenario, error: null })
                })
              })
            })
          }
        case 'teacher_availability':
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  order: () => Promise.resolve({ data: complexAvailabilityScenario, error: null })
                })
              })
            })
          }
        case 'course_enrollments':
          return {
            select: () => ({
              eq: () => ({
                eq: () => Promise.resolve({ count: 0, error: null })
              })
            })
          }
        default:
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [], error: null })
            })
          }
      }
    })
  }

  describe('End-to-End Scheduling Workflows', () => {
    it('should handle complete course scheduling with complex holiday patterns', async () => {
      const startDate = new Date('2024-12-30') // Monday, close to New Year cluster
      const holidayDates = complexHolidayScenario.map(h => new Date(h.date))

      // Test date calculation utilities integration
      const courseSchedule = calculateCourseEndDate(
        startDate,
        80, // 40 classes of 2 hours each
        3,  // 3 classes per week
        holidayDates
      )

      expect(courseSchedule.endDate).toBeDefined()
      expect(courseSchedule.totalWeeks).toBeGreaterThan(13) // Should extend due to holidays
      expect(courseSchedule.holidaysExcluded.length).toBeGreaterThan(0)
      expect(courseSchedule.actualClassDays).toBe(40)

      // Verify holiday exclusion worked correctly
      const excludedDates = courseSchedule.holidaysExcluded.map(date => 
        date.toISOString().substring(0, 10)
      )
      expect(excludedDates).toContain('2025-01-01') // New Year's Day
      expect(excludedDates).toContain('2025-01-02') // New Year Holiday
      expect(excludedDates).toContain('2025-01-03') // Extended Holiday

      // Verify schedule integrity
      courseSchedule.schedule.forEach(scheduledClass => {
        expect(isBusinessDay(scheduledClass.date, holidayDates)).toBe(true)
        expect(scheduledClass.duration).toBe(120) // 2 hours
      })
    })

    it('should integrate teacher availability with course scheduling', async () => {
      const availableSlots = await calculateAvailableSlots(
        mockTeacherId,
        { start: new Date('2025-01-06'), end: new Date('2025-01-31') },
        complexHolidayScenario
      )

      expect(availableSlots.length).toBeGreaterThan(0)

      // Verify slots are on correct days of week
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      availableSlots.forEach(slot => {
        const slotDate = new Date(slot.date)
        const dayOfWeek = slotDate.getDay()
        const availabilityPattern = complexAvailabilityScenario.find(
          pattern => pattern.day_of_week === dayOfWeek
        )
        expect(availabilityPattern).toBeDefined()
        expect(slot.startTime).toBe(availabilityPattern!.start_time)
        expect(slot.endTime).toBe(availabilityPattern!.end_time)
      })

      // Verify holiday conflicts are detected
      const conflictedSlots = availableSlots.filter(slot => slot.conflictsWithHoliday)
      expect(conflictedSlots.length).toBe(0) // Should be filtered out
    })

    it('should handle capacity management across multiple slots', async () => {
      // Test capacity conflicts for different scenarios
      const scenarios = [
        { slotId: 'slot-1', requestedCapacity: 5, shouldConflict: false },
        { slotId: 'slot-1', requestedCapacity: 15, shouldConflict: true },
        { slotId: 'slot-3', requestedCapacity: 8, shouldConflict: false },
        { slotId: 'slot-3', requestedCapacity: 10, shouldConflict: true }
      ]

      for (const scenario of scenarios) {
        // Mock different enrollment counts for each scenario
        mockSupabaseClient.from.mockImplementation((table: string) => {
          if (table === 'teacher_availability') {
            const slot = complexAvailabilityScenario.find(s => s.id === scenario.slotId)
            return {
              select: () => ({
                eq: () => ({
                  single: () => Promise.resolve({ data: slot, error: null })
                })
              })
            }
          }
          if (table === 'course_enrollments') {
            const currentCount = scenario.shouldConflict ? 10 : 2
            return {
              select: () => ({
                eq: () => ({
                  eq: () => Promise.resolve({ count: currentCount, error: null })
                })
              })
            }
          }
          return { select: () => Promise.resolve({ data: [], error: null }) }
        })

        const hasConflict = await checkCapacityConflicts(
          scenario.slotId,
          scenario.requestedCapacity
        )

        expect(hasConflict).toBe(scenario.shouldConflict)
      }
    })

    it('should validate teacher availability configuration comprehensively', async () => {
      const validation = await validateTeacherAvailability(mockTeacherId)

      expect(validation.isValid).toBe(true)
      expect(validation.issues).toHaveLength(0)
      expect(validation.warnings).toBeDefined()

      // Test with overlapping availability slots
      const overlappingSlots = [
        ...complexAvailabilityScenario,
        {
          id: 'slot-4',
          teacher_id: mockTeacherId,
          day_of_week: 1, // Monday - conflicts with slot-1
          start_time: '10:00',
          end_time: '12:00',
          max_students: 10,
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        }
      ]

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'teacher_availability') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  order: () => Promise.resolve({ data: overlappingSlots, error: null })
                })
              })
            })
          }
        }
        return { select: () => Promise.resolve({ data: [], error: null }) }
      })

      const overlappingValidation = await validateTeacherAvailability(mockTeacherId)
      expect(overlappingValidation.isValid).toBe(false)
      expect(overlappingValidation.issues).toContain('Found 1 overlapping availability slots')
    })
  })

  describe('Complex Scenario Testing', () => {
    it('should handle courses spanning multiple holiday clusters', async () => {
      const longCourseRequest: CalculateEndDateRequest = {
        startDate: '2024-12-23', // Start before New Year cluster
        courseHours: 200, // Very long course
        weeklyClasses: 2,
        teacherId: mockTeacherId,
        excludeHolidays: true
      }

      const mockRequest = {
        json: jest.fn().mockResolvedValue(longCourseRequest),
        headers: new Headers(),
        ip: '127.0.0.1'
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.totalWeeks).toBeGreaterThan(50)
      expect(data.data.holidaysExcluded.length).toBeGreaterThan(3)
      
      // Verify multiple holiday exclusions
      const excludedHolidays = data.data.holidaysExcluded
      expect(excludedHolidays).toContain('2025-01-01')
      expect(excludedHolidays).toContain('2025-07-04')
      expect(excludedHolidays).toContain('2025-12-25')
    })

    it('should handle teacher unavailability during course period', async () => {
      // Simulate teacher becoming unavailable mid-course
      const partiallyAvailableSlots = complexAvailabilityScenario.map(slot => ({
        ...slot,
        is_active: slot.day_of_week === 1 ? false : true // Disable Monday slots
      }))

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'teacher_availability') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  order: () => Promise.resolve({ 
                    data: partiallyAvailableSlots, 
                    error: null 
                  })
                })
              })
            })
          }
        }
        return setupMockDatabase().from(table)
      })

      const availableSlots = await calculateAvailableSlots(
        mockTeacherId,
        { start: new Date('2025-01-06'), end: new Date('2025-01-31') },
        complexHolidayScenario
      )

      // Should only have Wednesday and Friday slots (Monday disabled)
      const uniqueDays = new Set(
        availableSlots.map(slot => new Date(slot.date).getDay())
      )
      expect(uniqueDays.has(1)).toBe(false) // No Monday slots
      expect(uniqueDays.has(3)).toBe(true)  // Wednesday slots
      expect(uniqueDays.has(5)).toBe(true)  // Friday slots
    })

    it('should handle high-capacity scenarios with multiple concurrent requests', async () => {
      // Simulate high load scenario
      const concurrentRequests = Array.from({ length: 5 }, (_, index) => ({
        startDate: `2025-01-${6 + index}`, // Different start dates
        courseHours: 40,
        weeklyClasses: 3,
        teacherId: mockTeacherId,
        excludeHolidays: true
      }))

      const responses = await Promise.all(
        concurrentRequests.map(request => {
          const mockRequest = {
            json: jest.fn().mockResolvedValue(request),
            headers: new Headers(),
            ip: `127.0.0.${index + 1}`
          } as any
          return POST(mockRequest)
        })
      )

      // All requests should succeed
      const results = await Promise.all(
        responses.map(response => response.json())
      )

      results.forEach((result, index) => {
        expect(responses[index].status).toBe(200)
        expect(result.data.endDate).toBeDefined()
        expect(result.data.schedule).toBeInstanceOf(Array)
        expect(result.data.totalWeeks).toBeGreaterThan(0)
      })

      // Verify results are different due to different start dates
      const endDates = results.map(result => result.data.endDate)
      const uniqueEndDates = new Set(endDates)
      expect(uniqueEndDates.size).toBeGreaterThan(1)
    })

    it('should handle edge case: course starting on holiday', async () => {
      const holidayStartRequest: CalculateEndDateRequest = {
        startDate: '2025-01-01', // New Year's Day
        courseHours: 20,
        weeklyClasses: 2,
        teacherId: mockTeacherId,
        excludeHolidays: true
      }

      const startDate = new Date('2025-01-01')
      const holidayDates = complexHolidayScenario.map(h => new Date(h.date))

      const courseSchedule = calculateCourseEndDate(
        startDate,
        20,
        2,
        holidayDates
      )

      // Should start scheduling from first available business day
      const firstScheduledClass = courseSchedule.schedule[0]
      expect(isBusinessDay(firstScheduledClass.date, holidayDates)).toBe(true)
      expect(firstScheduledClass.date.toISOString().substring(0, 10)).not.toBe('2025-01-01')
    })

    it('should handle leap year edge cases', async () => {
      const leapYearRequest: CalculateEndDateRequest = {
        startDate: '2024-02-28', // Day before leap day
        courseHours: 20,
        weeklyClasses: 1,
        teacherId: mockTeacherId,
        excludeHolidays: false
      }

      const startDate = new Date('2024-02-28')
      const courseSchedule = calculateCourseEndDate(startDate, 20, 1, [])

      // Should handle February 29th correctly in 2024 (leap year)
      const scheduleDates = courseSchedule.schedule.map(s => 
        s.date.toISOString().substring(0, 10)
      )
      
      // Course should span into March due to February 29th
      const marchDates = scheduleDates.filter(date => date.startsWith('2024-03'))
      expect(marchDates.length).toBeGreaterThan(0)
    })
  })

  describe('Real-time Updates and Concurrent Users', () => {
    it('should setup and teardown real-time subscriptions correctly', () => {
      const mockChannel = {
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      }

      mockSupabaseClient.channel.mockReturnValue(mockChannel)

      const updateCallback = jest.fn()
      const unsubscribe = subscribeToAvailabilityUpdates(mockTeacherId, updateCallback)

      // Verify subscription setup
      expect(mockSupabaseClient.channel).toHaveBeenCalledWith(
        `teacher-availability-${mockTeacherId}`
      )
      expect(mockChannel.on).toHaveBeenCalledTimes(2) // Two table subscriptions
      expect(mockChannel.subscribe).toHaveBeenCalled()

      // Verify unsubscribe works
      expect(typeof unsubscribe).toBe('function')
      unsubscribe()
      expect(mockSupabaseClient.removeChannel).toHaveBeenCalledWith(mockChannel)
    })

    it('should handle real-time availability updates', () => {
      const mockChannel = {
        on: jest.fn().mockImplementation((event, config, callback) => {
          // Simulate real-time update
          setTimeout(() => {
            callback({
              eventType: 'UPDATE',
              new: {
                id: 'slot-1',
                max_students: 20 // Capacity increased
              },
              old: {
                id: 'slot-1',
                max_students: 12
              }
            })
          }, 10)
          return mockChannel
        }),
        subscribe: jest.fn()
      }

      mockSupabaseClient.channel.mockReturnValue(mockChannel)

      const updateCallback = jest.fn()
      subscribeToAvailabilityUpdates(mockTeacherId, updateCallback)

      // Simulate waiting for real-time update
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(updateCallback).toHaveBeenCalled()
          const callArgs = updateCallback.mock.calls[0][0]
          expect(callArgs.new.max_students).toBe(20)
          resolve()
        }, 20)
      })
    })

    it('should handle concurrent capacity checking', async () => {
      // Simulate multiple users checking capacity simultaneously
      const capacityChecks = Array.from({ length: 10 }, (_, index) => 
        checkCapacityConflicts('slot-1', 1)
      )

      const results = await Promise.all(capacityChecks)

      // All should return the same result (no race conditions)
      const uniqueResults = new Set(results)
      expect(uniqueResults.size).toBe(1)
    })
  })

  describe('Performance and Error Recovery', () => {
    it('should handle performance-intensive calculations within time limits', async () => {
      const performanceRequest: CalculateEndDateRequest = {
        startDate: '2025-01-06',
        courseHours: 1000, // Very long course
        weeklyClasses: 7,   // Daily classes
        teacherId: mockTeacherId,
        excludeHolidays: true
      }

      const startTime = Date.now()
      
      const startDate = new Date(performanceRequest.startDate)
      const holidayDates = complexHolidayScenario.map(h => new Date(h.date))
      
      const result = calculateCourseEndDate(
        startDate,
        performanceRequest.courseHours,
        performanceRequest.weeklyClasses,
        holidayDates
      )

      const endTime = Date.now()
      const executionTime = endTime - startTime

      // Should complete within reasonable time (2 seconds for complex calculation)
      expect(executionTime).toBeLessThan(2000)
      expect(result.actualClassDays).toBe(500) // 1000 hours / 2 hours per class
    })

    it('should handle database connection failures gracefully', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const request: CalculateEndDateRequest = {
        startDate: '2025-01-06',
        courseHours: 40,
        weeklyClasses: 2,
        teacherId: mockTeacherId,
        excludeHolidays: true
      }

      const mockRequest = {
        json: jest.fn().mockResolvedValue(request),
        headers: new Headers(),
        ip: '127.0.0.1'
      } as any

      const response = await POST(mockRequest)

      // Should handle the error gracefully
      expect(response.status).toBe(500)
      
      const data = await response.json()
      expect(data.error).toBeDefined()
      expect(data.error.message).toContain('Database connection failed')
    })

    it('should handle invalid data recovery scenarios', async () => {
      // Test with corrupted holiday data
      const corruptedHolidays = [
        ...complexHolidayScenario,
        {
          id: 'corrupt',
          date: 'invalid-date',
          name: 'Corrupted Holiday',
          year: 2025,
          is_national: true,
          created_at: '2024-12-01T00:00:00Z',
          updated_at: '2024-12-01T00:00:00Z'
        } as Holiday
      ]

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'holidays') {
          return {
            select: () => ({
              gte: () => ({
                lte: () => ({
                  order: () => Promise.resolve({ data: corruptedHolidays, error: null })
                })
              })
            })
          }
        }
        return setupMockDatabase().from(table)
      })

      // Should handle corrupted data gracefully
      const availableSlots = await calculateAvailableSlots(
        mockTeacherId,
        { start: new Date('2025-01-06'), end: new Date('2025-01-31') },
        []
      )

      expect(availableSlots).toBeDefined()
      expect(Array.isArray(availableSlots)).toBe(true)
    })

    it('should validate business day calculations across different time zones', () => {
      const testDate = new Date('2025-01-06T00:00:00Z') // UTC Monday
      const holidays = [new Date('2025-01-06T00:00:00Z')]

      // Should consistently identify as not a business day due to holiday
      expect(isBusinessDay(testDate, holidays)).toBe(false)

      // Test without holiday
      expect(isBusinessDay(testDate, [])).toBe(true)

      // Test weekend detection
      const saturday = new Date('2025-01-04T00:00:00Z')
      const sunday = new Date('2025-01-05T00:00:00Z')
      
      expect(isBusinessDay(saturday, [])).toBe(false)
      expect(isBusinessDay(sunday, [])).toBe(false)
    })

    it('should handle business day counting edge cases', () => {
      const startDate = new Date('2025-01-01') // Wednesday (holiday)
      const endDate = new Date('2025-01-07')   // Tuesday
      const holidays = [new Date('2025-01-01')]

      const businessDays = getBusinessDaysBetween(startDate, endDate, holidays)

      // Should exclude Jan 1 (holiday), Jan 4-5 (weekend)
      // Include: Jan 2 (Thu), Jan 3 (Fri), Jan 6 (Mon), Jan 7 (Tue) = 4 days
      expect(businessDays).toBe(4)
    })

    it('should handle holiday range queries with edge dates', () => {
      const startDate = new Date('2024-12-31')
      const endDate = new Date('2025-01-01')

      const holidaysInRange = getHolidaysInRange(
        startDate,
        endDate,
        complexHolidayScenario
      )

      expect(holidaysInRange).toHaveLength(1)
      expect(holidaysInRange[0].date).toBe('2025-01-01')
    })
  })

  describe('Data Consistency and Validation', () => {
    it('should maintain data consistency across all business logic functions', async () => {
      const testDate = new Date('2025-01-06')
      const testHolidays = complexHolidayScenario.slice(0, 2) // First 2 holidays

      // Test date calculations
      const courseSchedule = calculateCourseEndDate(
        testDate,
        40,
        2,
        testHolidays.map(h => new Date(h.date))
      )

      // Test availability calculations
      const availableSlots = await calculateAvailableSlots(
        mockTeacherId,
        { start: testDate, end: courseSchedule.endDate },
        testHolidays
      )

      // Verify consistency between date calculations and availability
      const scheduleDates = new Set(
        courseSchedule.schedule.map(s => s.date.toISOString().substring(0, 10))
      )
      const availableDates = new Set(availableSlots.map(s => s.date))

      // Should have some overlap (available dates should include some scheduled dates)
      const intersection = new Set(
        [...scheduleDates].filter(date => availableDates.has(date))
      )
      expect(intersection.size).toBeGreaterThan(0)
    })

    it('should validate all API response schemas match expected formats', async () => {
      const validRequest: CalculateEndDateRequest = {
        startDate: '2025-01-06',
        courseHours: 40,
        weeklyClasses: 2,
        teacherId: mockTeacherId,
        excludeHolidays: true
      }

      const mockRequest = {
        json: jest.fn().mockResolvedValue(validRequest),
        headers: new Headers(),
        ip: '127.0.0.1'
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)

      // Validate response structure
      expect(data.data).toBeDefined()
      expect(data.timestamp).toBeDefined()
      expect(typeof data.data.endDate).toBe('string')
      expect(typeof data.data.totalWeeks).toBe('number')
      expect(Array.isArray(data.data.holidaysExcluded)).toBe(true)
      expect(typeof data.data.actualClassDays).toBe('number')
      expect(Array.isArray(data.data.schedule)).toBe(true)

      // Validate schedule item structure
      if (data.data.schedule.length > 0) {
        const scheduleItem = data.data.schedule[0]
        expect(typeof scheduleItem.date).toBe('string')
        expect(typeof scheduleItem.startTime).toBe('string')
        expect(typeof scheduleItem.endTime).toBe('string')
        expect(typeof scheduleItem.duration).toBe('number')
      }
    })
  })
})