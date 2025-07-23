/**
 * API Types for Scheduling System
 * Story 1.2: API Foundation
 */

// Holidays API Types
export interface Holiday {
  id: string
  date: string // ISO date
  name: string
  year: number
  is_national: boolean
  created_at: string
  updated_at: string
}

export interface HolidaysQuery {
  year?: number
  month?: number
  startDate?: string // ISO date
  endDate?: string   // ISO date
  isNational?: boolean
}

export interface CreateHolidayRequest {
  date: string // ISO date
  name: string
  is_national?: boolean
}

export interface UpdateHolidayRequest {
  date?: string // ISO date
  name?: string
  is_national?: boolean
}

// Teacher Availability API Types
export interface TeacherAvailability {
  id: string
  teacher_id: string
  day_of_week: number // 0-6 (Sunday-Saturday)
  start_time: string  // HH:MM format
  end_time: string    // HH:MM format
  max_students: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AvailabilityQuery {
  startDate: string // ISO date
  endDate: string   // ISO date
  dayOfWeek?: number // 0-6
  includeHolidays?: boolean
}

export interface CreateAvailabilityRequest {
  dayOfWeek: number // 0-6
  startTime: string // HH:MM
  endTime: string   // HH:MM
  maxStudents: number
  isActive?: boolean
}

export interface UpdateAvailabilityRequest {
  dayOfWeek?: number // 0-6
  startTime?: string // HH:MM
  endTime?: string   // HH:MM
  maxStudents?: number
  isActive?: boolean
}

// Extended availability response with computed data
export interface AvailabilitySlot extends TeacherAvailability {
  available_spots: number
  scheduled_count: number
  next_occurrence?: string // ISO datetime
  conflicts_with_holiday?: boolean
}

// Standard API Error Response
export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
  path: string
}

// Standard API Success Response
export interface ApiSuccessResponse<T = any> {
  data: T
  timestamp: string
}

// Pagination parameters for list endpoints
export interface PaginationQuery {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

// Paginated response wrapper
export interface PaginatedApiResponse<T> {
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

// Business Logic Types for Core Functionality (Story 2.1)

// Course End Date Calculation Types
export interface CalculateEndDateRequest {
  startDate: string // ISO date
  courseHours: number
  weeklyClasses: number
  teacherId: string
  excludeHolidays?: boolean
}

export interface CalculateEndDateResponse {
  endDate: string // ISO date
  totalWeeks: number
  holidaysExcluded: string[] // ISO dates
  actualClassDays: number
  schedule: ClassSchedule[]
}

export interface ClassSchedule {
  date: string // ISO date
  startTime: string // HH:MM
  endTime: string   // HH:MM
  duration: number // minutes
}

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

export interface AvailableSlot {
  id: string
  teacherId: string
  date: string // ISO date
  startTime: string // HH:MM
  endTime: string   // HH:MM
  maxStudents: number
  availableSpots: number
  conflictsWithHoliday: boolean
}

// Common error codes for the scheduling API
export type SchedulingApiErrorCode =
  | 'TEACHER_NOT_FOUND'
  | 'NO_AVAILABILITY'
  | 'HOLIDAY_CONFLICT'
  | 'INVALID_DATE_RANGE'
  | 'CAPACITY_EXCEEDED'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'VALIDATION_ERROR'
  | 'AVAILABILITY_SLOT_NOT_FOUND'
  | 'HOLIDAY_NOT_FOUND'
  | 'TIME_SLOT_CONFLICT'
  | 'INVALID_TIME_FORMAT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'

// Request validation schemas (for Zod integration)
export interface ApiRequestValidation {
  query?: any
  body?: any
  params?: any
}

// Response headers for API responses
export interface ApiResponseHeaders {
  'Content-Type': 'application/json'
  'X-RateLimit-Limit'?: string
  'X-RateLimit-Remaining'?: string
  'X-RateLimit-Reset'?: string
}