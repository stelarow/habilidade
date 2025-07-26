/**
 * Scheduling System Type Definitions
 * Story 3.1: Database Foundation Setup
 * 
 * This file contains TypeScript interfaces and types for the scheduling system,
 * including holidays, teacher availability, and scheduling utilities.
 */

// Import core types from api.ts for use in this file
import type {
  Holiday,
  HolidaysQuery,
  CreateHolidayRequest,
  UpdateHolidayRequest,
  TeacherAvailability,
  AvailabilityQuery,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  AvailabilitySlot,
  CalculateEndDateRequest,
  CalculateEndDateResponse,
  ClassSchedule,
  CourseSchedule,
  ScheduledClass,
  AvailableSlot,
  SchedulingApiErrorCode
} from './api'

// Re-export core types from api.ts for centralized access
export type {
  Holiday,
  HolidaysQuery,
  CreateHolidayRequest,
  UpdateHolidayRequest,
  TeacherAvailability,
  AvailabilityQuery,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  AvailabilitySlot,
  CalculateEndDateRequest,
  CalculateEndDateResponse,
  ClassSchedule,
  CourseSchedule,
  ScheduledClass,
  AvailableSlot,
  SchedulingApiErrorCode
}

// Database result types for joined queries
export interface HolidayWithStats {
  id: string
  date: string
  name: string
  year: number
  is_national: boolean
  created_at: string
  updated_at: string
  affected_courses?: number // Count of courses affected by this holiday
  schedule_conflicts?: number // Count of schedule conflicts
}

export interface TeacherAvailabilityWithDetails extends TeacherAvailability {
  teacher_name?: string
  teacher_email?: string
  total_slots_count?: number
  active_slots_count?: number
  weekly_capacity?: number
}

export interface ScheduleConflict {
  type: 'holiday' | 'availability' | 'booking'
  date: string
  message: string
  affected_resource_id: string
  severity: 'low' | 'medium' | 'high'
}

// Utility types for scheduling calculations
export interface TimeSlot {
  start_time: string // HH:MM format
  end_time: string   // HH:MM format
  duration_minutes: number
}

export interface WeeklySchedulePattern {
  teacher_id: string
  monday?: TimeSlot[]
  tuesday?: TimeSlot[]
  wednesday?: TimeSlot[]
  thursday?: TimeSlot[]
  friday?: TimeSlot[]
  saturday?: TimeSlot[]
  sunday?: TimeSlot[]
}

export interface SchedulingConstraints {
  exclude_holidays: boolean
  min_class_duration: number // minutes
  max_class_duration: number // minutes
  buffer_time: number // minutes between classes
  working_days: number[] // 0-6 (Sunday-Saturday)
  working_hours: {
    start: string // HH:MM
    end: string   // HH:MM
  }
}

// Calendar integration types
export interface CalendarEvent {
  id: string
  title: string
  date: string // ISO date
  start_time?: string // HH:MM
  end_time?: string   // HH:MM
  type: 'holiday' | 'class' | 'availability' | 'blocked'
  teacher_id?: string
  student_count?: number
  max_students?: number
  is_recurring?: boolean
  recurrence_pattern?: 'weekly' | 'biweekly' | 'monthly'
}

export interface MonthlyCalendarData {
  year: number
  month: number // 1-12
  holidays: Holiday[]
  availability_slots: TeacherAvailability[]
  scheduled_classes: CalendarEvent[]
  conflicts: ScheduleConflict[]
}

// Form and UI state types
export interface HolidayFormData {
  date: string
  name: string
  is_national: boolean
}

export interface AvailabilityFormData {
  day_of_week: number
  start_time: string
  end_time: string
  max_students: number
  is_active: boolean
}

export interface SchedulingFilters {
  year?: number
  month?: number
  teacher_id?: string
  include_inactive?: boolean
  conflict_severity?: 'all' | 'medium' | 'high'
}

// Validation and business logic types
export interface ValidationResult {
  is_valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  field: string
  code: string
  message: string
  details?: any
}

export interface ValidationWarning {
  field: string
  code: string
  message: string
  details?: any
}

// Date utility types
export interface DateRange {
  start_date: string // ISO date
  end_date: string   // ISO date
}

export interface BusinessDateConfig {
  working_days: number[] // 0-6
  exclude_holidays: boolean
  holiday_buffer_days: number // Days before/after holiday to avoid
}

// Export utility constants
export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
  'Thursday', 'Friday', 'Saturday'
] as const

export const DAYS_OF_WEEK_PT = [
  'Domingo', 'Segunda', 'Terça', 'Quarta',
  'Quinta', 'Sexta', 'Sábado'
] as const

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

// Brazilian holidays configuration
export const BRAZILIAN_HOLIDAYS_2025: Readonly<Array<{
  date: string
  name: string
  is_national: boolean
}>> = [
  { date: '2025-01-01', name: 'Confraternização Universal', is_national: true },
  { date: '2025-04-21', name: 'Tiradentes', is_national: true },
  { date: '2025-05-01', name: 'Dia do Trabalhador', is_national: true },
  { date: '2025-09-07', name: 'Independência do Brasil', is_national: true },
  { date: '2025-10-12', name: 'Nossa Senhora Aparecida', is_national: true },
  { date: '2025-11-02', name: 'Finados', is_national: true },
  { date: '2025-11-15', name: 'Proclamação da República', is_national: true },
  { date: '2025-12-25', name: 'Natal', is_national: true }
] as const

// Time format validation patterns
export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i