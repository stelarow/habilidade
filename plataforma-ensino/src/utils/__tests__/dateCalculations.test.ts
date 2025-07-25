/**
 * Date Calculation Utilities Tests
 * Story 2.1: Core Business Logic - Task 4
 * 
 * Comprehensive test suite for date calculation functions
 */

import {
  isWeekend,
  isHoliday,
  formatDateISO,
  parseDateISO,
  calculateWorkingDays,
  calculateCourseEndDate,
  calculateCourseEndDateDetailed,
  isBusinessDay,
  getBusinessDaysBetween,
  addBusinessDays,
  getNextBusinessDay,
  getCachedHolidays,
  clearHolidayCache,
  isValidISODate,
  isLeapYear,
  getDaysInMonth
} from '../dateCalculations'

import { getBrazilianHolidays2025 } from '@/data/holidays-2025'
import type { Holiday } from '@/types/date-calculation'

describe('Date Calculation Utilities', () => {
  
  // Sample holidays for testing
  const testHolidays: Holiday[] = [
    { date: '2025-01-01', name: 'New Year', type: 'national' },
    { date: '2025-04-21', name: 'Tiradentes', type: 'national' },
    { date: '2025-12-25', name: 'Christmas', type: 'national' },
  ]

  beforeEach(() => {
    clearHolidayCache()
  })

  describe('isWeekend', () => {
    it('should identify Saturday as weekend', () => {
      const saturday = new Date('2025-08-09') // Saturday
      expect(isWeekend(saturday)).toBe(true)
    })

    it('should identify Sunday as weekend', () => {
      const sunday = new Date('2025-08-10') // Sunday
      expect(isWeekend(sunday)).toBe(true)
    })

    it('should identify Monday as not weekend', () => {
      const monday = new Date('2025-08-11') // Monday
      expect(isWeekend(monday)).toBe(false)
    })

    it('should identify Friday as not weekend', () => {
      const friday = new Date('2025-08-08') // Friday
      expect(isWeekend(friday)).toBe(false)
    })
  })

  describe('isHoliday', () => {
    it('should identify holiday correctly', () => {
      const newYear = new Date('2025-01-01')
      expect(isHoliday(newYear, testHolidays)).toBe(true)
    })

    it('should identify non-holiday correctly', () => {
      const regularDay = new Date('2025-08-01')
      expect(isHoliday(regularDay, testHolidays)).toBe(false)
    })

    it('should work with empty holiday array', () => {
      const someDay = new Date('2025-01-01')
      expect(isHoliday(someDay, [])).toBe(false)
    })
  })

  describe('formatDateISO', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-08-01T10:30:00Z')
      expect(formatDateISO(date)).toBe('2025-08-01')
    })

    it('should handle edge of year', () => {
      const date = new Date('2025-01-01T00:00:00Z')
      expect(formatDateISO(date)).toBe('2025-01-01')
    })
  })

  describe('parseDateISO', () => {
    it('should parse valid ISO date', () => {
      const date = parseDateISO('2025-08-01')
      expect(date.getUTCFullYear()).toBe(2025)
      expect(date.getUTCMonth()).toBe(7) // August is month 7 (0-indexed)
      expect(date.getUTCDate()).toBe(1)
    })

    it('should throw error for invalid format', () => {
      expect(() => parseDateISO('2025/08/01')).toThrow('Invalid date format')
      expect(() => parseDateISO('08-01-2025')).toThrow('Invalid date format')
      expect(() => parseDateISO('2025-8-1')).toThrow('Invalid date format')
    })

    it('should throw error for invalid date', () => {
      expect(() => parseDateISO('2025-02-30')).toThrow('Invalid date: 2025-02-30')
      expect(() => parseDateISO('2025-13-01')).toThrow('Invalid date: 2025-13-01')
    })
  })

  describe('calculateWorkingDays', () => {
    it('should calculate working days excluding weekends', () => {
      const start = new Date('2025-08-04') // Monday
      const end = new Date('2025-08-15') // Friday (next week)
      const result = calculateWorkingDays(start, end, [])
      
      expect(result.totalDays).toBe(12)
      expect(result.workingDays).toBe(10) // Mon-Fri + Mon-Fri
      expect(result.excludedWeekends).toBe(2)
      expect(result.excludedHolidays).toBe(0)
    })

    it('should calculate working days excluding holidays', () => {
      const start = new Date('2024-12-31') // Tuesday
      const end = new Date('2025-01-02') // Thursday
      const holidays = [{ date: '2025-01-01', name: 'New Year', type: 'national' as const }]
      const result = calculateWorkingDays(start, end, holidays)
      
      expect(result.totalDays).toBe(3)
      expect(result.workingDays).toBe(2) // Dec 31 and Jan 2
      expect(result.excludedWeekends).toBe(0)
      expect(result.excludedHolidays).toBe(1) // Jan 1
    })

    it('should handle same start and end date', () => {
      const date = new Date('2025-08-04') // Monday
      const result = calculateWorkingDays(date, date, [])
      
      expect(result.totalDays).toBe(1)
      expect(result.workingDays).toBe(1)
      expect(result.excludedWeekends).toBe(0)
      expect(result.excludedHolidays).toBe(0)
    })

    it('should throw error when start date is after end date', () => {
      const start = new Date('2025-08-02')
      const end = new Date('2025-08-01')
      
      expect(() => calculateWorkingDays(start, end, [])).toThrow('Start date must be before or equal to end date')
    })
  })

  describe('calculateCourseEndDate', () => {
    it('should calculate end date for simple case', () => {
      const start = new Date('2025-08-04') // Monday
      const duration = 5 // 5 working days
      const endDate = calculateCourseEndDate(start, duration, [])
      
      // Should end on Friday (Mon, Tue, Wed, Thu, Fri)
      expect(formatDateISO(endDate)).toBe('2025-08-08')
    })

    it('should skip weekends', () => {
      const start = new Date('2025-08-08') // Friday
      const duration = 2 // 2 working days
      const endDate = calculateCourseEndDate(start, duration, [])
      
      // Friday + Monday (skip weekend)
      expect(formatDateISO(endDate)).toBe('2025-08-11')
    })

    it('should skip holidays', () => {
      const start = new Date('2024-12-31') // Tuesday
      const duration = 2 // 2 working days
      const holidays = [{ date: '2025-01-01', name: 'New Year', type: 'national' as const }]
      const endDate = calculateCourseEndDate(start, duration, holidays)
      
      // Dec 31 + Jan 2 (skip Jan 1 holiday)
      expect(formatDateISO(endDate)).toBe('2025-01-02')
    })

    it('should handle start date on weekend', () => {
      const start = new Date('2025-08-09') // Saturday
      const duration = 1 // 1 working day
      const endDate = calculateCourseEndDate(start, duration, [])
      
      // Should start on Monday and end on Monday
      expect(formatDateISO(endDate)).toBe('2025-08-11')
    })

    it('should handle start date on holiday', () => {
      const start = new Date('2025-01-01') // New Year (holiday)
      const duration = 1 // 1 working day
      const holidays = [{ date: '2025-01-01', name: 'New Year', type: 'national' as const }]
      const endDate = calculateCourseEndDate(start, duration, holidays)
      
      // Should start on Jan 2 and end on Jan 2
      expect(formatDateISO(endDate)).toBe('2025-01-02')
    })

    it('should throw error for zero or negative duration', () => {
      const start = new Date('2025-08-01')
      
      expect(() => calculateCourseEndDate(start, 0, [])).toThrow('Duration must be a positive number')
      expect(() => calculateCourseEndDate(start, -1, [])).toThrow('Duration must be a positive number')
    })
  })

  describe('calculateCourseEndDateDetailed', () => {
    it('should return detailed calculation information', () => {
      const start = new Date('2025-08-01') // Friday
      const duration = 5 // 5 working days
      const result = calculateCourseEndDateDetailed(start, duration, [])
      
      expect(result.startDate).toEqual(start)
      expect(formatDateISO(result.endDate)).toBe('2025-08-07')
      expect(result.workingDays).toBe(5)
      expect(result.excludedDays.weekends).toBe(2) // Sat-Sun
      expect(result.excludedDays.holidays).toBe(0)
    })
  })

  describe('isBusinessDay', () => {
    it('should identify business day correctly', () => {
      const monday = new Date('2025-08-11') // Monday
      expect(isBusinessDay(monday, [])).toBe(true)
    })

    it('should identify weekend as not business day', () => {
      const saturday = new Date('2025-08-09') // Saturday
      expect(isBusinessDay(saturday, [])).toBe(false)
    })

    it('should identify holiday as not business day', () => {
      const newYear = new Date('2025-01-01')
      expect(isBusinessDay(newYear, testHolidays)).toBe(false)
    })
  })

  describe('getBusinessDaysBetween', () => {
    it('should calculate business days between dates', () => {
      const start = new Date('2025-08-04') // Monday
      const end = new Date('2025-08-15') // Friday
      const count = getBusinessDaysBetween(start, end, [])
      
      expect(count).toBe(10) // 2 full weeks
    })
  })

  describe('addBusinessDays', () => {
    it('should add business days correctly', () => {
      const start = new Date('2025-08-08') // Friday
      const result = addBusinessDays(start, 3, [])
      
      expect(formatDateISO(result)).toBe('2025-08-13') // Wed (skip weekend)
    })
  })

  describe('getNextBusinessDay', () => {
    it('should get next business day from Friday', () => {
      const friday = new Date('2025-08-08') // Friday
      const next = getNextBusinessDay(friday, [])
      
      expect(formatDateISO(next)).toBe('2025-08-11') // Monday
    })

    it('should skip holidays', () => {
      const thursday = new Date('2024-12-31') // Thursday before New Year
      const next = getNextBusinessDay(thursday, testHolidays)
      
      expect(formatDateISO(next)).toBe('2025-01-02') // Skip New Year
    })
  })

  describe('Holiday data integration', () => {
    it('should use Brazilian holidays 2025 data', () => {
      const holidays = getBrazilianHolidays2025()
      
      expect(holidays.length).toBeGreaterThan(10)
      expect(holidays.find(h => h.date === '2025-01-01')).toBeDefined()
      expect(holidays.find(h => h.date === '2025-12-25')).toBeDefined()
    })

    it('should cache holidays correctly', () => {
      clearHolidayCache()
      const holidays1 = getCachedHolidays()
      const holidays2 = getCachedHolidays()
      
      expect(holidays1).toBe(holidays2) // Same reference
    })
  })

  describe('isValidISODate', () => {
    it('should validate correct ISO dates', () => {
      expect(isValidISODate('2025-08-01')).toBe(true)
      expect(isValidISODate('2025-02-28')).toBe(true)
      expect(isValidISODate('2024-02-29')).toBe(true) // Leap year
    })

    it('should reject invalid ISO dates', () => {
      expect(isValidISODate('2025/08/01')).toBe(false)
      expect(isValidISODate('2025-8-1')).toBe(false)
      expect(isValidISODate('2025-02-30')).toBe(false) // Invalid date
      expect(isValidISODate('2025-13-01')).toBe(false)
    })
  })

  describe('isLeapYear', () => {
    it('should identify leap years correctly', () => {
      expect(isLeapYear(2024)).toBe(true)
      expect(isLeapYear(2000)).toBe(true)
      expect(isLeapYear(1900)).toBe(false)
      expect(isLeapYear(2025)).toBe(false)
    })
  })

  describe('getDaysInMonth', () => {
    it('should get correct days in month', () => {
      expect(getDaysInMonth(0, 2025)).toBe(31) // January
      expect(getDaysInMonth(1, 2025)).toBe(28) // February (non-leap)
      expect(getDaysInMonth(1, 2024)).toBe(29) // February (leap)
      expect(getDaysInMonth(11, 2025)).toBe(31) // December
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle year boundaries correctly', () => {
      const start = new Date('2024-12-30') // Monday
      const duration = 4 // 4 working days
      const endDate = calculateCourseEndDate(start, duration, [])
      
      // Should cross year boundary (Dec 30, 31, Jan 2, 3)
      expect(formatDateISO(endDate)).toBe('2025-01-03')
    })

    it('should handle month boundaries correctly', () => {
      const start = new Date('2025-07-30') // Wednesday
      const duration = 4 // 4 working days
      const endDate = calculateCourseEndDate(start, duration, [])
      
      // Should cross month boundary (Jul 30, 31, Aug 1, 4)
      expect(formatDateISO(endDate)).toBe('2025-08-04')
    })

    it('should handle complex holiday scenarios', () => {
      // Test with multiple consecutive holidays
      const complexHolidays: Holiday[] = [
        { date: '2025-03-03', name: 'Carnival Monday', type: 'national' },
        { date: '2025-03-04', name: 'Carnival Tuesday', type: 'national' },
      ]
      
      const start = new Date('2025-03-03') // Monday (holiday)
      const duration = 3
      const endDate = calculateCourseEndDate(start, duration, complexHolidays)
      
      // Should skip both carnival days and weekend
      expect(formatDateISO(endDate)).toBe('2025-03-07') // Friday
    })
  })

  describe('Performance requirements', () => {
    it('should calculate end date within performance target', () => {
      const start = new Date('2025-08-01')
      const duration = 100 // Large duration
      
      const startTime = performance.now()
      calculateCourseEndDate(start, duration, getBrazilianHolidays2025())
      const endTime = performance.now()
      
      // Should complete within 100ms as per story requirements
      expect(endTime - startTime).toBeLessThan(100)
    })
  })
})