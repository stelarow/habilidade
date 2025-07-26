/**
 * Teacher Availability Logic Unit Tests
 * Story 2.1: Core Business Logic - Task 2
 * 
 * Comprehensive test suite for teacher availability business logic
 * including capacity management, conflict detection, and real-time updates
 */

import { jest } from '@jest/globals'
import { Holiday, TeacherAvailability } from '@/types/api'
import {
  calculateAvailableSlots,
  checkCapacityConflicts,
  aggregateAvailabilityForCalendar,
  detectAvailabilityOverlaps,
  getNextAvailableSlot,
  validateTeacherAvailability,
  subscribeToAvailabilityUpdates,
  AvailabilitySlotWithOccurrence,
  CapacityInfo,
  ConflictInfo
} from '@/utils/teacherAvailabilityLogic'

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(),
  channel: jest.fn(),
  removeChannel: jest.fn()
}

const mockQuery = {
  select: jest.fn(),
  eq: jest.fn(),
  gte: jest.fn(),
  lte: jest.fn(),
  order: jest.fn(),
  single: jest.fn()
}

// Mock data
const mockTeacherId = '123e4567-e89b-12d3-a456-426614174000'
const mockAvailabilityId = '987fcdeb-51d2-43a1-b789-123456789abc'

const mockTeacherAvailability: TeacherAvailability[] = [
  {
    id: mockAvailabilityId,
    teacher_id: mockTeacherId,
    day_of_week: 1, // Monday
    start_time: '09:00',
    end_time: '11:00',
    max_students: 10,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '456e789a-bc12-34d5-e678-901234567def',
    teacher_id: mockTeacherId,
    day_of_week: 3, // Wednesday
    start_time: '14:00',
    end_time: '16:00',
    max_students: 8,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
]

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

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabaseClient
}))

// Setup query chain mock
const setupMockQuery = (returnData: any, error: any = null) => {
  mockQuery.select.mockReturnThis()
  mockQuery.eq.mockReturnThis()
  mockQuery.gte.mockReturnThis()
  mockQuery.lte.mockReturnThis()
  mockQuery.order.mockReturnThis()
  mockQuery.single.mockResolvedValue({ data: returnData, error })
  
  mockSupabaseClient.from.mockReturnValue({
    ...mockQuery,
    select: jest.fn().mockReturnValue({
      ...mockQuery,
      eq: jest.fn().mockReturnValue({
        ...mockQuery,
        eq: jest.fn().mockReturnValue({
          ...mockQuery,
          order: jest.fn().mockResolvedValue({ data: returnData, error })
        })
      })
    })
  })
}

describe('Teacher Availability Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('calculateAvailableSlots', () => {
    it('should calculate available slots correctly', async () => {
      setupMockQuery(mockTeacherAvailability)
      
      // Mock capacity and enrollment queries
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'teacher_availability') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  order: () => Promise.resolve({ data: mockTeacherAvailability, error: null })
                })
              })
            })
          }
        }
        if (table === 'course_enrollments') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => Promise.resolve({ count: 5, error: null })
              })
            })
          }
        }
        return mockQuery
      })

      const startDate = new Date('2025-01-06') // Monday
      const endDate = new Date('2025-01-12')   // Sunday
      
      const result = await calculateAvailableSlots(
        mockTeacherId,
        { start: startDate, end: endDate },
        []
      )

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should throw error for invalid teacher ID', async () => {
      await expect(
        calculateAvailableSlots('', { start: new Date(), end: new Date() }, [])
      ).rejects.toThrow('Teacher ID is required')
    })

    it('should throw error for invalid date range', async () => {
      const startDate = new Date('2025-01-12')
      const endDate = new Date('2025-01-06')

      await expect(
        calculateAvailableSlots(mockTeacherId, { start: startDate, end: endDate }, [])
      ).rejects.toThrow('Start date must be before or equal to end date')
    })

    it('should return empty array when no availability patterns exist', async () => {
      setupMockQuery([])

      const result = await calculateAvailableSlots(
        mockTeacherId,
        { start: new Date('2025-01-06'), end: new Date('2025-01-12') },
        []
      )

      expect(result).toEqual([])
    })

    it('should exclude holiday dates from available slots', async () => {
      setupMockQuery(mockTeacherAvailability)
      
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'teacher_availability') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  order: () => Promise.resolve({ data: mockTeacherAvailability, error: null })
                })
              })
            })
          }
        }
        return {
          select: () => ({
            eq: () => ({
              eq: () => Promise.resolve({ count: 0, error: null })
            })
          })
        }
      })

      const startDate = new Date('2024-12-30') // Monday
      const endDate = new Date('2025-01-05')   // Sunday (includes New Year)
      
      const result = await calculateAvailableSlots(
        mockTeacherId,
        { start: startDate, end: endDate },
        mockHolidays
      )

      // Should exclude January 1st (New Year's Day)
      const newYearSlots = result.filter(slot => slot.date === '2025-01-01')
      expect(newYearSlots).toHaveLength(0)
    })
  })

  describe('checkCapacityConflicts', () => {
    it('should return false when capacity is available', async () => {
      // Mock availability with max 10 students
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'teacher_availability') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ 
                  data: { max_students: 10 }, 
                  error: null 
                })
              })
            })
          }
        }
        if (table === 'course_enrollments') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => Promise.resolve({ count: 5, error: null })
              })
            })
          }
        }
        return mockQuery
      })

      const result = await checkCapacityConflicts(mockAvailabilityId, 3)
      expect(result).toBe(false) // 5 current + 3 requested = 8 < 10 max
    })

    it('should return true when capacity would be exceeded', async () => {
      // Mock availability with max 10 students, 8 current enrollments
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'teacher_availability') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ 
                  data: { max_students: 10 }, 
                  error: null 
                })
              })
            })
          }
        }
        if (table === 'course_enrollments') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => Promise.resolve({ count: 8, error: null })
              })
            })
          }
        }
        return mockQuery
      })

      const result = await checkCapacityConflicts(mockAvailabilityId, 5)
      expect(result).toBe(true) // 8 current + 5 requested = 13 > 10 max
    })

    it('should throw error for invalid requested capacity', async () => {
      await expect(
        checkCapacityConflicts(mockAvailabilityId, 0)
      ).rejects.toThrow('Requested capacity must be greater than 0')

      await expect(
        checkCapacityConflicts(mockAvailabilityId, -1)
      ).rejects.toThrow('Requested capacity must be greater than 0')
    })

    it('should throw error for non-existent slot', async () => {
      mockSupabaseClient.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Not found' } })
          })
        })
      }))

      await expect(
        checkCapacityConflicts('invalid-slot-id', 1)
      ).rejects.toThrow('Availability slot not found')
    })
  })

  describe('aggregateAvailabilityForCalendar', () => {
    it('should aggregate availability data by date', async () => {
      setupMockQuery(mockTeacherAvailability)
      
      // Mock holiday query
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'holidays') {
          return {
            select: () => ({
              gte: () => ({
                lte: () => Promise.resolve({ data: [], error: null })
              })
            })
          }
        }
        if (table === 'teacher_availability') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  order: () => Promise.resolve({ data: mockTeacherAvailability, error: null })
                })
              })
            })
          }
        }
        return {
          select: () => ({
            eq: () => ({
              eq: () => Promise.resolve({ count: 0, error: null })
            })
          })
        }
      })

      const result = await aggregateAvailabilityForCalendar(mockTeacherId, 1, 2025)

      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })

    it('should throw error for invalid month', async () => {
      await expect(
        aggregateAvailabilityForCalendar(mockTeacherId, 0, 2025)
      ).rejects.toThrow('Month must be between 1 and 12')

      await expect(
        aggregateAvailabilityForCalendar(mockTeacherId, 13, 2025)
      ).rejects.toThrow('Month must be between 1 and 12')
    })

    it('should throw error for invalid year', async () => {
      await expect(
        aggregateAvailabilityForCalendar(mockTeacherId, 1, 2019)
      ).rejects.toThrow('Year must be between 2020 and 2050')

      await expect(
        aggregateAvailabilityForCalendar(mockTeacherId, 1, 2051)
      ).rejects.toThrow('Year must be between 2020 and 2050')
    })
  })

  describe('detectAvailabilityOverlaps', () => {
    it('should detect overlapping time slots', async () => {
      const overlappingAvailability = [
        {
          ...mockTeacherAvailability[0],
          start_time: '09:00',
          end_time: '11:00'
        },
        {
          ...mockTeacherAvailability[0],
          id: 'different-id',
          start_time: '10:00',
          end_time: '12:00'
        }
      ]

      mockSupabaseClient.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: overlappingAvailability, error: null })
            })
          })
        })
      }))

      const result = await detectAvailabilityOverlaps(mockTeacherId)

      expect(result).toHaveLength(1)
      expect(result[0].overlapMinutes).toBe(60) // 1 hour overlap
    })

    it('should return empty array when no overlaps exist', async () => {
      setupMockQuery(mockTeacherAvailability)

      mockSupabaseClient.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: mockTeacherAvailability, error: null })
            })
          })
        })
      }))

      const result = await detectAvailabilityOverlaps(mockTeacherId)

      expect(result).toHaveLength(0)
    })

    it('should return empty array when less than 2 slots exist', async () => {
      mockSupabaseClient.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: [mockTeacherAvailability[0]], error: null })
            })
          })
        })
      }))

      const result = await detectAvailabilityOverlaps(mockTeacherId)

      expect(result).toHaveLength(0)
    })
  })

  describe('getNextAvailableSlot', () => {
    it('should find next available slot with capacity', async () => {
      setupMockQuery(mockTeacherAvailability)
      
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'teacher_availability') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  order: () => Promise.resolve({ data: mockTeacherAvailability, error: null })
                })
              })
            })
          }
        }
        return {
          select: () => ({
            eq: () => ({
              eq: () => Promise.resolve({ count: 5, error: null })
            })
          })
        }
      })

      const afterDate = new Date('2025-01-06')
      const result = await getNextAvailableSlot(mockTeacherId, afterDate, [])

      expect(result).toBeDefined()
      if (result) {
        expect(result.availableSpots).toBeGreaterThan(0)
        expect(result.conflictsWithHoliday).toBe(false)
      }
    })

    it('should return null when no slots available in next 30 days', async () => {
      setupMockQuery([]) // No availability patterns

      const result = await getNextAvailableSlot(mockTeacherId, new Date(), [])

      expect(result).toBeNull()
    })
  })

  describe('validateTeacherAvailability', () => {
    it('should validate availability without issues', async () => {
      mockSupabaseClient.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            eq: () => Promise.resolve({ data: mockTeacherAvailability, error: null })
          })
        })
      }))

      const result = await validateTeacherAvailability(mockTeacherId)

      expect(result.isValid).toBe(true)
      expect(result.issues).toHaveLength(0)
    })

    it('should detect overlapping slots as issues', async () => {
      const overlappingAvailability = [
        {
          ...mockTeacherAvailability[0],
          start_time: '09:00',
          end_time: '11:00'
        },
        {
          ...mockTeacherAvailability[0],
          id: 'different-id',
          start_time: '10:00',
          end_time: '12:00'
        }
      ]

      mockSupabaseClient.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: overlappingAvailability, error: null })
            })
          })
        })
      }))

      const result = await validateTeacherAvailability(mockTeacherId)

      expect(result.isValid).toBe(false)
      expect(result.issues).toContain('Found 1 overlapping availability slots')
    })

    it('should warn about unusual hours', async () => {
      const unusualHoursAvailability = [{
        ...mockTeacherAvailability[0],
        start_time: '05:00', // Very early
        end_time: '07:00'
      }]

      mockSupabaseClient.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: unusualHoursAvailability, error: null })
            })
          })
        })
      }))

      const result = await validateTeacherAvailability(mockTeacherId)

      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some(w => w.includes('Unusual hours'))).toBe(true)
    })

    it('should detect invalid capacity as issue', async () => {
      const invalidCapacityAvailability = [{
        ...mockTeacherAvailability[0],
        max_students: 0 // Invalid capacity
      }]

      mockSupabaseClient.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: invalidCapacityAvailability, error: null })
            })
          })
        })
      }))

      const result = await validateTeacherAvailability(mockTeacherId)

      expect(result.isValid).toBe(false)
      expect(result.issues.some(i => i.includes('Invalid capacity'))).toBe(true)
    })
  })

  describe('subscribeToAvailabilityUpdates', () => {
    it('should setup real-time subscription', () => {
      const mockChannel = {
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      }

      mockSupabaseClient.channel.mockReturnValue(mockChannel)

      const onUpdate = jest.fn()
      const unsubscribe = subscribeToAvailabilityUpdates(mockTeacherId, onUpdate)

      expect(mockSupabaseClient.channel).toHaveBeenCalledWith(`teacher-availability-${mockTeacherId}`)
      expect(mockChannel.on).toHaveBeenCalledTimes(2) // Two table subscriptions
      expect(mockChannel.subscribe).toHaveBeenCalled()
      expect(typeof unsubscribe).toBe('function')
    })

    it('should provide unsubscribe function', () => {
      const mockChannel = {
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      }

      mockSupabaseClient.channel.mockReturnValue(mockChannel)

      const onUpdate = jest.fn()
      const unsubscribe = subscribeToAvailabilityUpdates(mockTeacherId, onUpdate)

      unsubscribe()

      expect(mockSupabaseClient.removeChannel).toHaveBeenCalledWith(mockChannel)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      mockSupabaseClient.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: null, error: { message: 'Connection failed' } })
            })
          })
        })
      }))

      await expect(
        calculateAvailableSlots(mockTeacherId, { start: new Date(), end: new Date() }, [])
      ).rejects.toThrow('Failed to fetch teacher availability: Connection failed')
    })

    it('should handle invalid UUID format', () => {
      const invalidUUID = 'invalid-uuid'
      
      expect(() => {
        subscribeToAvailabilityUpdates(invalidUUID, jest.fn())
      }).not.toThrow() // Should handle gracefully, UUID validation is at API level
    })

    it('should handle timezone edge cases in date calculations', async () => {
      setupMockQuery(mockTeacherAvailability)
      
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'teacher_availability') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  order: () => Promise.resolve({ data: mockTeacherAvailability, error: null })
                })
              })
            })
          }
        }
        return {
          select: () => ({
            eq: () => ({
              eq: () => Promise.resolve({ count: 0, error: null })
            })
          })
        }
      })

      // Test with dates that cross timezone boundaries
      const startDate = new Date('2025-01-05T23:00:00Z')
      const endDate = new Date('2025-01-06T01:00:00Z')
      
      const result = await calculateAvailableSlots(mockTeacherId, { start: startDate, end: endDate }, [])
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })
  })
})