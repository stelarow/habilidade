/**
 * API Validation Schemas
 * 
 * Comprehensive Zod schemas for request/response validation
 * Story 1.2: API Foundation
 */

import { z } from 'zod'

// Common validation utilities
const UUIDSchema = z.string().uuid('Invalid UUID format')

const DateStringSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .refine(date => {
    const parsed = new Date(date)
    return parsed.toISOString().substring(0, 10) === date
  }, 'Invalid date')

const TimeStringSchema = z.string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format')

const DayOfWeekSchema = z.number()
  .int('Day of week must be an integer')
  .min(0, 'Day of week must be 0-6 (Sunday-Saturday)')
  .max(6, 'Day of week must be 0-6 (Sunday-Saturday)')

// Holidays API Schemas
export const HolidaysQuerySchema = z.object({
  year: z.coerce.number()
    .int('Year must be an integer')
    .min(2020, 'Year must be 2020 or later')
    .max(2050, 'Year must be 2050 or earlier')
    .optional(),
  month: z.coerce.number()
    .int('Month must be an integer')
    .min(1, 'Month must be 1-12')
    .max(12, 'Month must be 1-12')
    .optional(),
  startDate: DateStringSchema.optional(),
  endDate: DateStringSchema.optional(),
  isNational: z.enum(['true', 'false'])
    .transform(val => val === 'true')
    .optional()
}).refine(data => {
  // If both start and end dates are provided, validate the order
  if (data.startDate && data.endDate) {
    return data.startDate <= data.endDate
  }
  return true
}, {
  message: 'Start date must be before or equal to end date',
  path: ['endDate']
}).refine(data => {
  // If month is provided, year must also be provided
  if (data.month && !data.year) {
    return false
  }
  return true
}, {
  message: 'Year is required when month is specified',
  path: ['year']
})

export const CreateHolidaySchema = z.object({
  date: DateStringSchema,
  name: z.string()
    .min(1, 'Holiday name is required')
    .max(100, 'Holiday name must be 100 characters or less')
    .trim(),
  is_national: z.boolean()
    .default(false)
})

export const UpdateHolidaySchema = z.object({
  date: DateStringSchema.optional(),
  name: z.string()
    .min(1, 'Holiday name cannot be empty')
    .max(100, 'Holiday name must be 100 characters or less')
    .trim()
    .optional(),
  is_national: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
})

export const HolidayParamsSchema = z.object({
  id: UUIDSchema
})

// Teacher Availability API Schemas
export const AvailabilityQuerySchema = z.object({
  startDate: DateStringSchema,
  endDate: DateStringSchema,
  dayOfWeek: DayOfWeekSchema.optional(),
  includeHolidays: z.enum(['true', 'false'])
    .transform(val => val === 'true')
    .optional()
}).refine(data => data.startDate <= data.endDate, {
  message: 'Start date must be before or equal to end date',
  path: ['endDate']
})

export const CreateAvailabilitySchema = z.object({
  dayOfWeek: DayOfWeekSchema,
  startTime: TimeStringSchema,
  endTime: TimeStringSchema,
  maxStudents: z.number()
    .int('Maximum students must be an integer')
    .min(1, 'Maximum students must be at least 1')
    .max(50, 'Maximum students cannot exceed 50'),
  isActive: z.boolean().default(true)
}).refine(data => data.startTime < data.endTime, {
  message: 'Start time must be before end time',
  path: ['endTime']
})

export const UpdateAvailabilitySchema = z.object({
  dayOfWeek: DayOfWeekSchema.optional(),
  startTime: TimeStringSchema.optional(),
  endTime: TimeStringSchema.optional(),
  maxStudents: z.number()
    .int('Maximum students must be an integer')
    .min(1, 'Maximum students must be at least 1')
    .max(50, 'Maximum students cannot exceed 50')
    .optional(),
  isActive: z.boolean().optional()
}).refine(data => {
  // If both start and end time are provided, validate the order
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime
  }
  return true
}, {
  message: 'Start time must be before end time',
  path: ['endTime']
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
})

export const TeacherAvailabilityParamsSchema = z.object({
  id: UUIDSchema, // teacher ID
  slotId: UUIDSchema.optional() // availability slot ID (for individual slot operations)
})

// Response Schemas
export const HolidayResponseSchema = z.object({
  id: UUIDSchema,
  date: DateStringSchema,
  name: z.string(),
  year: z.number().int(),
  is_national: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

export const TeacherAvailabilityResponseSchema = z.object({
  id: UUIDSchema,
  teacher_id: UUIDSchema,
  day_of_week: DayOfWeekSchema,
  start_time: TimeStringSchema,
  end_time: TimeStringSchema,
  max_students: z.number().int().min(1),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

export const AvailabilitySlotResponseSchema = TeacherAvailabilityResponseSchema.extend({
  available_spots: z.number().int().min(0),
  scheduled_count: z.number().int().min(0),
  next_occurrence: z.string().datetime().optional(),
  conflicts_with_holiday: z.boolean().optional()
})

// Generic API Response Schemas
export const ApiSuccessResponseSchema = z.object({
  data: z.any(),
  timestamp: z.string().datetime()
})

export const ApiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  }),
  timestamp: z.string().datetime(),
  path: z.string()
})

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(100),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrevious: z.boolean()
  }),
  timestamp: z.string().datetime()
})

// Pagination Query Schema
export const PaginationQuerySchema = z.object({
  page: z.coerce.number()
    .int('Page must be an integer')
    .min(1, 'Page must be 1 or greater')
    .default(1),
  limit: z.coerce.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
  sort: z.string()
    .min(1, 'Sort field cannot be empty')
    .optional(),
  order: z.enum(['asc', 'desc'])
    .default('asc')
})

// Validation helpers
export function validateUUID(id: string, fieldName: string = 'ID'): boolean {
  try {
    UUIDSchema.parse(id)
    return true
  } catch {
    return false
  }
}

export function validateDateString(date: string, fieldName: string = 'Date'): boolean {
  try {
    DateStringSchema.parse(date)
    return true
  } catch {
    return false
  }
}

export function validateTimeString(time: string, fieldName: string = 'Time'): boolean {
  try {
    TimeStringSchema.parse(time)
    return true
  } catch {
    return false
  }
}

export function validateDayOfWeek(day: number, fieldName: string = 'Day of week'): boolean {
  try {
    DayOfWeekSchema.parse(day)
    return true
  } catch {
    return false
  }
}

// Schema transformation utilities
export type HolidaysQuery = z.infer<typeof HolidaysQuerySchema>
export type CreateHolidayRequest = z.infer<typeof CreateHolidaySchema>
export type UpdateHolidayRequest = z.infer<typeof UpdateHolidaySchema>
export type HolidayParams = z.infer<typeof HolidayParamsSchema>

export type AvailabilityQuery = z.infer<typeof AvailabilityQuerySchema>
export type CreateAvailabilityRequest = z.infer<typeof CreateAvailabilitySchema>
export type UpdateAvailabilityRequest = z.infer<typeof UpdateAvailabilitySchema>
export type TeacherAvailabilityParams = z.infer<typeof TeacherAvailabilityParamsSchema>

export type HolidayResponse = z.infer<typeof HolidayResponseSchema>
export type TeacherAvailabilityResponse = z.infer<typeof TeacherAvailabilityResponseSchema>
export type AvailabilitySlotResponse = z.infer<typeof AvailabilitySlotResponseSchema>

export type ApiSuccessResponse<T = any> = {
  data: T
  timestamp: string
}

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>
export type PaginatedResponse<T = any> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
  timestamp: string
}

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>

// Business Logic Schemas (Story 2.1)

// Calculate End Date API Schemas
export const CalculateEndDateRequestSchema = z.object({
  startDate: DateStringSchema,
  courseHours: z.number()
    .int('Course hours must be an integer')
    .min(1, 'Course hours must be at least 1')
    .max(1000, 'Course hours cannot exceed 1000'),
  weeklyClasses: z.number()
    .int('Weekly classes must be an integer')
    .min(1, 'Must have at least 1 class per week')
    .max(7, 'Cannot have more than 7 classes per week'),
  teacherId: UUIDSchema,
  excludeHolidays: z.boolean().default(true)
}).refine(data => {
  // Validate that start date is not in the past (allow today)
  const today = new Date().toISOString().substring(0, 10)
  return data.startDate >= today
}, {
  message: 'Start date cannot be in the past',
  path: ['startDate']
})

export const ClassScheduleSchema = z.object({
  date: DateStringSchema,
  startTime: TimeStringSchema,
  endTime: TimeStringSchema,
  duration: z.number()
    .int('Duration must be an integer')
    .min(1, 'Duration must be at least 1 minute')
    .max(480, 'Duration cannot exceed 8 hours (480 minutes)')
}).refine(data => data.startTime < data.endTime, {
  message: 'Start time must be before end time',
  path: ['endTime']
})

export const CalculateEndDateResponseSchema = z.object({
  endDate: DateStringSchema,
  totalWeeks: z.number().int().min(1),
  holidaysExcluded: z.array(DateStringSchema),
  actualClassDays: z.number().int().min(1),
  schedule: z.array(ClassScheduleSchema)
})

// Available Slot Schema
export const AvailableSlotSchema = z.object({
  id: UUIDSchema,
  teacherId: UUIDSchema,
  date: DateStringSchema,
  startTime: TimeStringSchema,
  endTime: TimeStringSchema,
  maxStudents: z.number().int().min(1).max(50),
  availableSpots: z.number().int().min(0),
  conflictsWithHoliday: z.boolean()
}).refine(data => data.startTime < data.endTime, {
  message: 'Start time must be before end time',
  path: ['endTime']
}).refine(data => data.availableSpots <= data.maxStudents, {
  message: 'Available spots cannot exceed maximum students',
  path: ['availableSpots']
})

// Schema type exports
export type CalculateEndDateRequest = z.infer<typeof CalculateEndDateRequestSchema>
export type CalculateEndDateResponse = z.infer<typeof CalculateEndDateResponseSchema>
export type ClassSchedule = z.infer<typeof ClassScheduleSchema>
export type AvailableSlot = z.infer<typeof AvailableSlotSchema>