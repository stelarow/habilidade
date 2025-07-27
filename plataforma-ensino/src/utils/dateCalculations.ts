/**
 * Date Calculation Utilities
 * Story 2.1: Core Business Logic - Task 1
 * 
 * Comprehensive date calculation functions for course scheduling
 * with holiday exclusion and business day validation
 */

import type { Holiday, WorkingDaysCalculation } from '@/types/date-calculation';
import { getBrazilianHolidays2025 } from '@/data/holidays-2025';

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Check if a date is a holiday
 */
export function isHoliday(date: Date, holidays: Holiday[]): boolean {
  const dateString = formatDateISO(date);
  return holidays.some(holiday => holiday.date === dateString);
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse ISO date string to Date object with validation
 */
export function parseDateISO(dateString: string): Date {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    throw new Error(`Invalid date format: ${dateString}. Expected YYYY-MM-DD`);
  }

  // Validate the actual date by parsing components
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Check for obviously invalid dates
  if (month < 1 || month > 12) {
    throw new Error(`Invalid date: ${dateString}`);
  }
  
  if (day < 1 || day > 31) {
    throw new Error(`Invalid date: ${dateString}`);
  }
  
  // Create date and verify it matches input (handles edge cases like Feb 30)
  const date = new Date(dateString + 'T00:00:00.000Z');
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateString}`);
  }
  
  // Verify the date components match the input (prevents Feb 30 -> Mar 2)
  if (date.getUTCFullYear() !== year || 
      date.getUTCMonth() !== month - 1 || 
      date.getUTCDate() !== day) {
    throw new Error(`Invalid date: ${dateString}`);
  }

  return date;
}

/**
 * Calculate working days between two dates (excluding weekends and holidays)
 */
export function calculateWorkingDays(
  startDate: Date,
  endDate: Date,
  holidays: Holiday[] = getBrazilianHolidays2025()
): WorkingDaysCalculation {
  if (startDate > endDate) {
    throw new Error('Start date must be before or equal to end date');
  }

  let totalDays = 0;
  let workingDays = 0;
  let excludedWeekends = 0;
  let excludedHolidays = 0;

  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    totalDays++;
    
    const isWeekendDay = isWeekend(currentDate);
    const isHolidayDay = isHoliday(currentDate, holidays);
    
    if (isWeekendDay) {
      excludedWeekends++;
    } else if (isHolidayDay) {
      excludedHolidays++;
    } else {
      workingDays++;
    }
    
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return {
    totalDays,
    workingDays,
    excludedWeekends,
    excludedHolidays
  };
}

/**
 * Calculate course end date based on start date and duration in working days
 */
export function calculateCourseEndDate(
  startDate: Date,
  duration: number,
  holidays: Holiday[] = getBrazilianHolidays2025()
): Date {
  if (duration <= 0) {
    throw new Error('Duration must be a positive number');
  }

  const currentDate = new Date(startDate);
  let workingDaysCount = 0;

  // Start from the given date and count working days
  while (workingDaysCount < duration) {
    const isWeekendDay = isWeekend(currentDate);
    const isHolidayDay = isHoliday(currentDate, holidays);

    // If current day is a working day, count it
    if (!isWeekendDay && !isHolidayDay) {
      workingDaysCount++;
    }

    // If we haven't reached the duration yet, move to next day
    if (workingDaysCount < duration) {
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
  }

  return currentDate;
}

/**
 * Calculate course end date with detailed information
 */
export function calculateCourseEndDateDetailed(
  startDate: Date,
  duration: number,
  holidays: Holiday[] = getBrazilianHolidays2025()
): {
  startDate: Date;
  endDate: Date;
  workingDays: number;
  excludedDays: {
    weekends: number;
    holidays: number;
  };
} {
  const endDate = calculateCourseEndDate(startDate, duration, holidays);
  const calculation = calculateWorkingDays(startDate, endDate, holidays);

  return {
    startDate,
    endDate,
    workingDays: duration,
    excludedDays: {
      weekends: calculation.excludedWeekends,
      holidays: calculation.excludedHolidays
    }
  };
}

/**
 * Cache for holiday data to improve performance
 */
let cachedHolidays: Holiday[] | null = null;

/**
 * Get cached holiday data or load it
 */
export function getCachedHolidays(): Holiday[] {
  if (!cachedHolidays) {
    cachedHolidays = getBrazilianHolidays2025();
  }
  return cachedHolidays;
}

/**
 * Clear holiday cache (useful for testing)
 */
export function clearHolidayCache(): void {
  cachedHolidays = null;
}

/**
 * Check if a date is a business day (not weekend, not holiday)
 * @param date - Date to check
 * @param holidays - Array of holiday objects
 * @returns True if date is a business day
 */
export function isBusinessDay(date: Date, holidays: Holiday[] = getBrazilianHolidays2025()): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays);
}

/**
 * Calculate the number of business days between two dates
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @param holidays - Array of holiday objects to exclude
 * @returns Number of business days
 */
export function getBusinessDaysBetween(
  startDate: Date,
  endDate: Date,
  holidays: Holiday[] = getBrazilianHolidays2025()
): number {
  const calculation = calculateWorkingDays(startDate, endDate, holidays);
  return calculation.workingDays;
}

/**
 * Add business days to a date, skipping weekends and holidays
 * @param startDate - Starting date
 * @param businessDays - Number of business days to add
 * @param holidays - Array of holiday objects to skip
 * @returns New date after adding business days
 */
export function addBusinessDays(
  startDate: Date,
  businessDays: number,
  holidays: Holiday[] = getBrazilianHolidays2025()
): Date {
  if (businessDays <= 0) {
    throw new Error('Business days must be a positive number');
  }

  const currentDate = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < businessDays) {
    // Move to next day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    
    // Check if this day is a business day
    if (!isWeekend(currentDate) && !isHoliday(currentDate, holidays)) {
      daysAdded++;
    }
  }

  return currentDate;
}

/**
 * Get the next business day after a given date
 * @param date - Reference date
 * @param holidays - Array of holiday objects to skip
 * @returns Next business day
 */
export function getNextBusinessDay(date: Date, holidays: Holiday[] = getBrazilianHolidays2025()): Date {
  const nextDate = new Date(date);
  
  do {
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  } while (isWeekend(nextDate) || isHoliday(nextDate, holidays));
  
  return nextDate;
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
  try {
    parseDateISO(dateString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert a Date object to ISO date string (YYYY-MM-DD)
 * @param date - Date to convert
 * @returns ISO date string
 * @deprecated Use formatDateISO instead
 */
export function toISODateString(date: Date): string {
  return formatDateISO(date);
}

/**
 * Parse ISO date string to Date object
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Date object
 * @deprecated Use parseDateISO instead
 */
export function parseISODate(dateString: string): Date {
  return parseDateISO(dateString);
}