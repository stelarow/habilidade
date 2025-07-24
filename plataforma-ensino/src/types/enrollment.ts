// Enhanced enrollment types for Story 1.2: Form Submission and Validation Enhancement

export interface StudentSchedule {
  enrollment_id: string
  instructor_id: string
  day_of_week: number // 1-7 for Monday-Sunday
  start_time: string // HH:MM:SS format
  end_time: string // HH:MM:SS format
}

// Enhanced enrollment interface with new modality field
export interface EnhancedEnrollment {
  id?: string
  user_id: string
  course_id: string
  enrolled_at?: string
  completed_at?: string
  access_until?: string
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  progress_percentage?: number
  created_at?: string
  updated_at?: string
  
  // New fields for Story 1.2
  modality: 'online' | 'in-person'
  schedules?: StudentSchedule[]
}

// Form data structure for enhanced enrollment form
export interface EnhancedEnrollmentFormData {
  user_id: string
  course_id: string
  teacher_id: string
  access_until: string
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  is_in_person: boolean
  has_two_classes_per_week: boolean
  schedule_slot_1?: string
  schedule_slot_2?: string
}

// API request payload structure
export interface EnrollmentApiPayload {
  student_id: string
  course_id: string
  start_date: string
  modality: 'online' | 'in-person'
  schedules?: {
    instructor_id: string
    day_of_week: number
    start_time: string
    end_time: string
  }[]
}

// Schedule slot format used by ConditionalCalendar
export interface ScheduleSlot {
  day: number // 1-7 for Monday-Sunday
  time: string // "HH:MM-HH:MM" format
  teacherId: string
}

// Validation error structure
export interface EnrollmentValidationErrors {
  user_id?: string
  course_id?: string
  teacher_id?: string
  access_until?: string
  schedule_slot_1?: string
  schedule_slot_2?: string
  scheduling?: string
}