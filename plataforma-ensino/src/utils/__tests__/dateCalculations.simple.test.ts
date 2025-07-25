/**
 * Simplified Date Calculation Tests
 * Testing core functionality with correct dates
 */

import {
  isWeekend,
  formatDateISO,
  parseDateISO,
  calculateCourseEndDate,
  isBusinessDay
} from '../dateCalculations'

describe('Date Calculations - Basic Tests', () => {
  
  test('isWeekend should work correctly', () => {
    // Check specific known dates
    const saturday = new Date('2025-08-09T00:00:00.000Z') // Saturday
    const sunday = new Date('2025-08-10T00:00:00.000Z') // Sunday  
    const monday = new Date('2025-08-11T00:00:00.000Z') // Monday
    
    expect(isWeekend(saturday)).toBe(true)
    expect(isWeekend(sunday)).toBe(true)
    expect(isWeekend(monday)).toBe(false)
  })

  test('formatDateISO should format correctly', () => {
    const date = new Date('2025-08-01T12:34:56.789Z')
    expect(formatDateISO(date)).toBe('2025-08-01')
  })

  test('parseDateISO should parse correctly', () => {
    const date = parseDateISO('2025-08-01')
    expect(date.getUTCFullYear()).toBe(2025)
    expect(date.getUTCMonth()).toBe(7) // August
    expect(date.getUTCDate()).toBe(1)
  })

  test('calculateCourseEndDate basic functionality', () => {
    const start = new Date('2025-08-11T00:00:00.000Z') // Monday
    const duration = 5 // 5 working days
    const endDate = calculateCourseEndDate(start, duration, [])
    
    // Monday + 5 working days = Friday
    expect(formatDateISO(endDate)).toBe('2025-08-15')
  })

  test('isBusinessDay should work correctly', () => {
    const monday = new Date('2025-08-11T00:00:00.000Z') // Monday
    const saturday = new Date('2025-08-09T00:00:00.000Z') // Saturday
    
    expect(isBusinessDay(monday, [])).toBe(true)
    expect(isBusinessDay(saturday, [])).toBe(false)
  })
})