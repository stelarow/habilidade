/**
 * Date Calculations Unit Tests
 * Story 2.1: Core Business Logic - Task 1
 * 
 * Comprehensive test suite for date calculation utilities
 * including edge cases, holiday handling, and business day logic
 */

import {
  calculateCourseEndDate,
  getHolidaysInRange,
  isBusinessDay,
  getBusinessDaysBetween,
  addBusinessDays,
  getNextBusinessDay,
  isLeapYear,
  getDaysInMonth,
  isValidISODate,
  toISODateString,
  parseISODate,
  CourseSchedule
} from '@/utils/dateCalculations'
import { Holiday } from '@/types/api'

describe('Date Calculations', () => {
  // Test data setup
  const sampleHolidays: Holiday[] = [
    {
      id: '1',
      date: '2025-01-01', // New Year's Day (Wednesday)
      name: 'New Year\'s Day',
      year: 2025,
      is_national: true,
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z'
    },
    {
      id: '2',
      date: '2025-12-25', // Christmas (Thursday)
      name: 'Christmas Day',
      year: 2025,
      is_national: true,
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z'
    },
    {
      id: '3',
      date: '2025-07-04', // Independence Day (Friday)
      name: 'Independence Day',
      year: 2025,
      is_national: true,
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z'
    }
  ]

  const holidayDates = sampleHolidays.map(h => new Date(h.date))

  describe('calculateCourseEndDate', () => {
    it('should calculate end date for simple course without holidays', () => {
      const startDate = new Date('2025-01-06') // Monday
      const courseHours = 8 // 4 classes of 2 hours each
      const weeklyClasses = 2

      const result = calculateCourseEndDate(startDate, courseHours, weeklyClasses, [])

      expect(result.actualClassDays).toBe(4)
      expect(result.totalWeeks).toBe(2)
      expect(result.schedule).toHaveLength(4)
      expect(result.holidaysExcluded).toHaveLength(0)
    })

    it('should exclude holidays from scheduling', () => {
      const startDate = new Date('2024-12-30') // Monday, close to New Year
      const courseHours = 8 // 4 classes
      const weeklyClasses = 5 // Daily classes

      const result = calculateCourseEndDate(startDate, courseHours, weeklyClasses, holidayDates)

      // Should exclude New Year's Day (Jan 1, 2025)
      expect(result.holidaysExcluded.length).toBeGreaterThan(0)
      expect(result.holidaysExcluded.some(h => 
        h.toISOString().substring(0, 10) === '2025-01-01'
      )).toBe(true)
    })

    it('should handle weekend exclusion correctly', () => {
      const startDate = new Date('2025-01-06') // Monday
      const courseHours = 4 // 2 classes
      const weeklyClasses = 1

      const result = calculateCourseEndDate(startDate, courseHours, weeklyClasses, [])

      // Should schedule only on business days (weekdays)
      result.schedule.forEach(scheduledClass => {
        const dayOfWeek = scheduledClass.date.getDay()
        expect(dayOfWeek).toBeGreaterThan(0) // Not Sunday
        expect(dayOfWeek).toBeLessThan(6)    // Not Saturday
      })
    })

    it('should throw error for invalid course hours', () => {
      const startDate = new Date('2025-01-06')
      
      expect(() => {
        calculateCourseEndDate(startDate, 0, 2, [])
      }).toThrow('Course hours must be greater than 0')

      expect(() => {
        calculateCourseEndDate(startDate, -5, 2, [])
      }).toThrow('Course hours must be greater than 0')
    })

    it('should throw error for invalid weekly classes', () => {
      const startDate = new Date('2025-01-06')
      
      expect(() => {
        calculateCourseEndDate(startDate, 10, 0, [])
      }).toThrow('Weekly classes must be between 1 and 7')

      expect(() => {
        calculateCourseEndDate(startDate, 10, 8, [])
      }).toThrow('Weekly classes must be between 1 and 7')
    })

    it('should handle leap year edge case', () => {
      const startDate = new Date('2024-02-28') // 2024 is a leap year
      const courseHours = 4
      const weeklyClasses = 1

      const result = calculateCourseEndDate(startDate, courseHours, weeklyClasses, [])

      expect(result.actualClassDays).toBe(2)
      expect(result.schedule).toHaveLength(2)
    })

    it('should prevent infinite loops with safety check', () => {
      const startDate = new Date('2025-01-06')
      const courseHours = 10000 // Extremely long course
      const weeklyClasses = 1

      expect(() => {
        calculateCourseEndDate(startDate, courseHours, weeklyClasses, [])
      }).toThrow('Course scheduling exceeded maximum duration (2 years)')
    })
  })

  describe('getHolidaysInRange', () => {
    it('should return holidays within date range', () => {
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-12-31')

      const result = getHolidaysInRange(startDate, endDate, sampleHolidays)

      expect(result).toHaveLength(3)
      expect(result.map(h => h.name)).toContain('New Year\'s Day')
      expect(result.map(h => h.name)).toContain('Christmas Day')
      expect(result.map(h => h.name)).toContain('Independence Day')
    })

    it('should return empty array when no holidays in range', () => {
      const startDate = new Date('2025-02-01')
      const endDate = new Date('2025-02-28')

      const result = getHolidaysInRange(startDate, endDate, sampleHolidays)

      expect(result).toHaveLength(0)
    })

    it('should handle partial range overlaps', () => {
      const startDate = new Date('2025-06-01')
      const endDate = new Date('2025-08-01')

      const result = getHolidaysInRange(startDate, endDate, sampleHolidays)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Independence Day')
    })

    it('should throw error for invalid date range', () => {
      const startDate = new Date('2025-12-31')
      const endDate = new Date('2025-01-01')

      expect(() => {
        getHolidaysInRange(startDate, endDate, sampleHolidays)
      }).toThrow('Start date must be before or equal to end date')
    })
  })

  describe('isBusinessDay', () => {
    it('should return true for weekdays without holidays', () => {
      const monday = new Date('2025-01-06')
      const tuesday = new Date('2025-01-07')
      const wednesday = new Date('2025-01-08')
      const thursday = new Date('2025-01-09')
      const friday = new Date('2025-01-10')

      expect(isBusinessDay(monday, [])).toBe(true)
      expect(isBusinessDay(tuesday, [])).toBe(true)
      expect(isBusinessDay(wednesday, [])).toBe(true)
      expect(isBusinessDay(thursday, [])).toBe(true)
      expect(isBusinessDay(friday, [])).toBe(true)
    })

    it('should return false for weekends', () => {
      const saturday = new Date('2025-01-04')
      const sunday = new Date('2025-01-05')

      expect(isBusinessDay(saturday, [])).toBe(false)
      expect(isBusinessDay(sunday, [])).toBe(false)
    })

    it('should return false for holidays', () => {
      const newYear = new Date('2025-01-01')
      const christmas = new Date('2025-12-25')

      expect(isBusinessDay(newYear, holidayDates)).toBe(false)
      expect(isBusinessDay(christmas, holidayDates)).toBe(false)
    })

    it('should return false for weekend holidays', () => {
      const saturdayHoliday = new Date('2025-01-04') // Saturday
      const sundayHoliday = new Date('2025-01-05')   // Sunday
      const weekendHolidays = [saturdayHoliday, sundayHoliday]

      expect(isBusinessDay(saturdayHoliday, weekendHolidays)).toBe(false)
      expect(isBusinessDay(sundayHoliday, weekendHolidays)).toBe(false)
    })
  })

  describe('getBusinessDaysBetween', () => {
    it('should count business days correctly', () => {
      const startDate = new Date('2025-01-06') // Monday
      const endDate = new Date('2025-01-10')   // Friday

      const result = getBusinessDaysBetween(startDate, endDate, [])

      expect(result).toBe(5) // Mon, Tue, Wed, Thu, Fri
    })

    it('should exclude weekends from count', () => {
      const startDate = new Date('2025-01-06') // Monday
      const endDate = new Date('2025-01-12')   // Sunday (next week)

      const result = getBusinessDaysBetween(startDate, endDate, [])

      expect(result).toBe(5) // Only weekdays counted
    })

    it('should exclude holidays from count', () => {
      const startDate = new Date('2024-12-30') // Monday
      const endDate = new Date('2025-01-03')   // Friday

      const result = getBusinessDaysBetween(startDate, endDate, holidayDates)

      // Dec 30, 31 are Mon-Tue, Jan 2-3 are Thu-Fri
      // Jan 1 (Wed) is New Year's Day holiday
      expect(result).toBe(4)
    })

    it('should return 0 for reversed date range', () => {
      const startDate = new Date('2025-01-10')
      const endDate = new Date('2025-01-06')

      const result = getBusinessDaysBetween(startDate, endDate, [])

      expect(result).toBe(0)
    })
  })

  describe('addBusinessDays', () => {
    it('should add business days correctly', () => {
      const startDate = new Date('2025-01-06') // Monday
      const result = addBusinessDays(startDate, 3, [])

      expect(result.toISOString().substring(0, 10)).toBe('2025-01-09') // Thursday
    })

    it('should skip weekends when adding business days', () => {
      const startDate = new Date('2025-01-08') // Wednesday
      const result = addBusinessDays(startDate, 5, [])

      expect(result.toISOString().substring(0, 10)).toBe('2025-01-15') // Next Wednesday
    })

    it('should skip holidays when adding business days', () => {
      const startDate = new Date('2024-12-31') // Tuesday
      const result = addBusinessDays(startDate, 1, holidayDates)

      expect(result.toISOString().substring(0, 10)).toBe('2025-01-02') // Thursday (skip New Year)
    })

    it('should throw error for negative business days', () => {
      const startDate = new Date('2025-01-06')

      expect(() => {
        addBusinessDays(startDate, -1, [])
      }).toThrow('Business days must be non-negative')
    })
  })

  describe('getNextBusinessDay', () => {
    it('should return next weekday', () => {
      const monday = new Date('2025-01-06')
      const result = getNextBusinessDay(monday, [])

      expect(result.toISOString().substring(0, 10)).toBe('2025-01-07') // Tuesday
    })

    it('should skip weekends', () => {
      const friday = new Date('2025-01-03')
      const result = getNextBusinessDay(friday, [])

      expect(result.toISOString().substring(0, 10)).toBe('2025-01-06') // Monday
    })

    it('should skip holidays', () => {
      const tuesday = new Date('2024-12-31') // Day before New Year
      const result = getNextBusinessDay(tuesday, holidayDates)

      expect(result.toISOString().substring(0, 10)).toBe('2025-01-02') // Thursday
    })
  })

  describe('isLeapYear', () => {
    it('should identify leap years correctly', () => {
      expect(isLeapYear(2024)).toBe(true)  // Divisible by 4
      expect(isLeapYear(2000)).toBe(true)  // Divisible by 400
      expect(isLeapYear(2100)).toBe(false) // Divisible by 100 but not 400
      expect(isLeapYear(2023)).toBe(false) // Not divisible by 4
    })
  })

  describe('getDaysInMonth', () => {
    it('should return correct days for regular months', () => {
      expect(getDaysInMonth(0, 2025)).toBe(31)  // January
      expect(getDaysInMonth(3, 2025)).toBe(30)  // April
      expect(getDaysInMonth(1, 2025)).toBe(28)  // February (non-leap year)
    })

    it('should handle leap year February', () => {
      expect(getDaysInMonth(1, 2024)).toBe(29)  // February in leap year
    })
  })

  describe('isValidISODate', () => {
    it('should validate correct ISO date formats', () => {
      expect(isValidISODate('2025-01-06')).toBe(true)
      expect(isValidISODate('2024-12-31')).toBe(true)
      expect(isValidISODate('2025-02-29')).toBe(false) // Invalid date
    })

    it('should reject invalid formats', () => {
      expect(isValidISODate('25-01-06')).toBe(false)    // Wrong year format
      expect(isValidISODate('2025-1-6')).toBe(false)    // Missing leading zeros
      expect(isValidISODate('2025/01/06')).toBe(false)  // Wrong separators
      expect(isValidISODate('invalid')).toBe(false)     // Not a date
    })
  })

  describe('toISODateString', () => {
    it('should convert Date to ISO string', () => {
      const date = new Date('2025-01-06T15:30:00Z')
      const result = toISODateString(date)

      expect(result).toBe('2025-01-06')
    })

    it('should handle timezone differences', () => {
      const date = new Date('2025-01-06T23:30:00-05:00')
      const result = toISODateString(date)

      expect(result).toMatch(/2025-01-0[67]/) // Could be 6th or 7th depending on timezone
    })
  })

  describe('parseISODate', () => {
    it('should parse valid ISO date string', () => {
      const result = parseISODate('2025-01-06')

      expect(result).toBeInstanceOf(Date)
      expect(result.toISOString().substring(0, 10)).toBe('2025-01-06')
    })

    it('should throw error for invalid ISO date format', () => {
      expect(() => {
        parseISODate('invalid-date')
      }).toThrow('Invalid ISO date format: invalid-date')
    })
  })

  describe('Edge Cases and Complex Scenarios', () => {
    it('should handle holiday clusters correctly', () => {
      // Create a cluster of holidays (Christmas week)
      const holidayCluster = [
        new Date('2025-12-24'), // Christmas Eve
        new Date('2025-12-25'), // Christmas Day
        new Date('2025-12-26'), // Boxing Day
      ]

      const startDate = new Date('2025-12-23') // Monday
      const courseHours = 8 // 4 classes
      const weeklyClasses = 5

      const result = calculateCourseEndDate(startDate, courseHours, weeklyClasses, holidayCluster)

      // Should skip the holiday cluster and extend into next week
      expect(result.holidaysExcluded.length).toBe(3)
      expect(result.totalWeeks).toBeGreaterThan(1)
    })

    it('should handle course starting on a Friday', () => {
      const startDate = new Date('2025-01-03') // Friday
      const courseHours = 8
      const weeklyClasses = 2

      const result = calculateCourseEndDate(startDate, courseHours, weeklyClasses, [])

      expect(result.actualClassDays).toBe(4)
      // Should extend into following weeks due to weekend breaks
      expect(result.totalWeeks).toBeGreaterThan(2)
    })

    it('should handle very short courses', () => {
      const startDate = new Date('2025-01-06') // Monday
      const courseHours = 2 // Just 1 class
      const weeklyClasses = 1

      const result = calculateCourseEndDate(startDate, courseHours, weeklyClasses, [])

      expect(result.actualClassDays).toBe(1)
      expect(result.totalWeeks).toBe(1)
      expect(result.schedule).toHaveLength(1)
    })

    it('should handle courses with daily classes', () => {
      const startDate = new Date('2025-01-06') // Monday
      const courseHours = 10 // 5 classes
      const weeklyClasses = 7 // Every day (but weekends will be filtered)

      const result = calculateCourseEndDate(startDate, courseHours, weeklyClasses, [])

      expect(result.actualClassDays).toBe(5)
      expect(result.totalWeeks).toBe(1) // Should fit in one week (Mon-Fri)
    })
  })
})