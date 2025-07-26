/**
 * Holiday Validation Utilities
 * Centralized validation logic for holidays API endpoints
 */

import { z } from 'zod'

// Shared validation schemas
export const holidayDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

export const holidayNameSchema = z
  .string()
  .min(1, 'Holiday name is required')
  .max(255, 'Holiday name must be less than 255 characters')

export const uuidSchema = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, 'Invalid UUID format')

// Query parameter validation
export const holidaysQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2050).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  startDate: holidayDateSchema.optional(),
  endDate: holidayDateSchema.optional(),
  isNational: z.enum(['true', 'false']).transform(val => val === 'true').optional()
}).refine(data => {
  // If month is provided, year must also be provided
  if (data.month && !data.year) {
    return false
  }
  // If date range is provided, startDate must be before endDate
  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    return false
  }
  return true
}, {
  message: 'Invalid query parameter combination'
})

// Create holiday validation
export const createHolidaySchema = z.object({
  date: holidayDateSchema,
  name: holidayNameSchema,
  is_national: z.boolean().default(false)
})

// Update holiday validation
export const updateHolidaySchema = z.object({
  date: holidayDateSchema.optional(),
  name: holidayNameSchema.optional(),
  is_national: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
})

// Utility functions
export function extractYearFromDate(date: string): number {
  return parseInt(date.substring(0, 4))
}

export function validateUuid(id: string): boolean {
  return uuidSchema.safeParse(id).success
}