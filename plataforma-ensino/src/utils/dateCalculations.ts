/**
 * Date Calculation Utilities
 * Story 2.1: Core Business Logic - Task 1
 * 
 * Comprehensive date calculation functions for course scheduling
 * with holiday exclusion and business day validation
 */

import { Holiday } from '@/types/api'

export interface CourseSchedule {
  endDate: Date
  totalWeeks: number
  holidaysExcluded: Date[]
  actualClassDays: number
  schedule: ScheduledClass[]
}

export interface ScheduledClass {
  date: Date
  startTime: string // HH:MM
  endTime: string   // HH:MM
  duration: number // minutes
}

/**
 * Calculate course end date considering holidays and weekend exclusions
 * @param startDate - Course start date
 * @param courseHours - Total course hours needed
 * @param weeklyClasses - Number of classes per week
 * @param holidayDates - Array of holiday dates to exclude
 * @returns Complete course schedule with end date and class breakdown
 */
export function calculateCourseEndDate(
  startDate: Date,
  courseHours: number,
  weeklyClasses: number,
  holidayDates: Date[]
): CourseSchedule {
  if (courseHours <= 0) {
    throw new Error('Course hours must be greater than 0')
  }
  if (weeklyClasses <= 0 || weeklyClasses > 7) {
    throw new Error('Weekly classes must be between 1 and 7')
  }

  const holidays = new Set(holidayDates.map(date => date.toISOString().substring(0, 10)))
  const hoursPerClass = 2 // Standard 2-hour classes
  const totalClassesNeeded = Math.ceil(courseHours / hoursPerClass)
  
  let currentDate = new Date(startDate)
  let classesScheduled = 0
  let totalWeeks = 0
  const schedule: ScheduledClass[] = []
  const holidaysExcluded: Date[] = []
  
  // Continue until we have scheduled all required classes
  while (classesScheduled < totalClassesNeeded) {
    const weekStart = new Date(currentDate)
    let classesThisWeek = 0
    
    // Schedule classes for this week
    for (let dayOffset = 0; dayOffset < 7 && classesScheduled < totalClassesNeeded && classesThisWeek < weeklyClasses; dayOffset++) {
      const classDate = new Date(weekStart)
      classDate.setDate(weekStart.getDate() + dayOffset)
      
      if (isBusinessDay(classDate, holidayDates)) {
        // Schedule this class
        schedule.push({
          date: new Date(classDate),
          startTime: '09:00',
          endTime: '11:00',
          duration: 120
        })
        classesScheduled++
        classesThisWeek++
      } else if (holidays.has(classDate.toISOString().substring(0, 10))) {
        // Track excluded holidays
        const holidayDate = new Date(classDate)
        if (!holidaysExcluded.some(h => h.toISOString().substring(0, 10) === holidayDate.toISOString().substring(0, 10))) {
          holidaysExcluded.push(holidayDate)
        }
      }
    }
    
    totalWeeks++
    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7)
    
    // Safety check to prevent infinite loops
    if (totalWeeks > 104) { // 2 years maximum
      throw new Error('Course scheduling exceeded maximum duration (2 years)')
    }
  }
  
  // Calculate final end date from last scheduled class
  const endDate = schedule.length > 0 
    ? new Date(schedule[schedule.length - 1].date)
    : new Date(startDate)
  
  return {
    endDate,
    totalWeeks,
    holidaysExcluded,
    actualClassDays: schedule.length,
    schedule
  }
}

/**
 * Get holidays within a specific date range
 * @param startDate - Range start date
 * @param endDate - Range end date
 * @param holidays - Array of all holidays
 * @returns Holidays within the specified range
 */
export function getHolidaysInRange(
  startDate: Date,
  endDate: Date,
  holidays: Holiday[]
): Holiday[] {
  if (startDate > endDate) {
    throw new Error('Start date must be before or equal to end date')
  }

  const startDateStr = startDate.toISOString().substring(0, 10)
  const endDateStr = endDate.toISOString().substring(0, 10)
  
  return holidays.filter(holiday => {
    const holidayDate = holiday.date
    return holidayDate >= startDateStr && holidayDate <= endDateStr
  })
}

/**
 * Check if a date is a business day (not weekend, not holiday)
 * @param date - Date to check
 * @param holidays - Array of holiday dates
 * @returns True if date is a business day
 */
export function isBusinessDay(date: Date, holidays: Date[]): boolean {
  // Check if it's a weekend (Saturday = 6, Sunday = 0)
  const dayOfWeek = date.getDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false
  }
  
  // Check if it's a holiday
  const dateStr = date.toISOString().substring(0, 10)
  const isHoliday = holidays.some(holiday => 
    holiday.toISOString().substring(0, 10) === dateStr
  )
  
  return !isHoliday
}

/**
 * Calculate the number of business days between two dates
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @param holidays - Array of holiday dates to exclude
 * @returns Number of business days
 */
export function getBusinessDaysBetween(
  startDate: Date,
  endDate: Date,
  holidays: Date[] = []
): number {
  if (startDate > endDate) {
    return 0
  }

  let businessDays = 0
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    if (isBusinessDay(currentDate, holidays)) {
      businessDays++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return businessDays
}

/**
 * Add business days to a date, skipping weekends and holidays
 * @param startDate - Starting date
 * @param businessDays - Number of business days to add
 * @param holidays - Array of holiday dates to skip
 * @returns New date after adding business days
 */
export function addBusinessDays(
  startDate: Date,
  businessDays: number,
  holidays: Date[] = []
): Date {
  if (businessDays < 0) {
    throw new Error('Business days must be non-negative')
  }

  const result = new Date(startDate)
  let daysAdded = 0
  
  while (daysAdded < businessDays) {
    result.setDate(result.getDate() + 1)
    
    if (isBusinessDay(result, holidays)) {
      daysAdded++
    }
  }
  
  return result
}

/**
 * Get the next business day after a given date
 * @param date - Reference date
 * @param holidays - Array of holiday dates to skip
 * @returns Next business day
 */
export function getNextBusinessDay(date: Date, holidays: Date[] = []): Date {
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)
  
  while (!isBusinessDay(nextDay, holidays)) {
    nextDay.setDate(nextDay.getDate() + 1)
  }
  
  return nextDay
}

/**
 * Check if a year is a leap year
 * @param year - Year to check
 * @returns True if year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

/**
 * Get the number of days in a specific month and year
 * @param month - Month (0-11, JavaScript format)
 * @param year - Full year
 * @returns Number of days in the month
 */
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Validate that a date string is in valid ISO format (YYYY-MM-DD)
 * @param dateString - Date string to validate
 * @returns True if valid ISO date format
 */
export function isValidISODate(dateString: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!isoDateRegex.test(dateString)) {
    return false
  }
  
  const date = new Date(dateString)
  return date.toISOString().substring(0, 10) === dateString
}

/**
 * Convert a Date object to ISO date string (YYYY-MM-DD)
 * @param date - Date to convert
 * @returns ISO date string
 */
export function toISODateString(date: Date): string {
  return date.toISOString().substring(0, 10)
}

/**
 * Parse ISO date string to Date object
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Date object
 */
export function parseISODate(dateString: string): Date {
  if (!isValidISODate(dateString)) {
    throw new Error(`Invalid ISO date format: ${dateString}`)
  }
  return new Date(dateString)
}