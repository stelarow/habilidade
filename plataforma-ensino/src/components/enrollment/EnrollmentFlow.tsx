/**
 * EnrollmentFlow component for handling enrollment business logic and database operations
 * Story 2.2: UI Components Integration - Task 3
 * 
 * Manages enrollment data persistence, validation, and completion flow
 * with comprehensive MCP Supabase integration and error handling.
 */

'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Teacher } from './TeacherSelector'
import { TimeSlot, CourseRequirements } from './ConditionalCalendar'

export interface Course {
  id: string
  title: string
  category: string
  duration_hours: number
  max_students: number
  description?: string
  session_duration?: number
  weekly_frequency?: number
}

export interface EnrollmentData {
  id?: string
  student_id: string
  course_id: string
  teacher_id: string
  enrollment_date: string
  scheduled_slots: ScheduledSlot[]
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  total_hours: number
  payment_status?: 'pending' | 'paid' | 'cancelled'
  notes?: string
}

export interface ScheduledSlot {
  slot_id: string
  date: string
  start_time: string
  end_time: string
  duration_minutes: number
  teacher_availability_id: string
}

export interface EnrollmentValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  requirements: {
    minimumHours: boolean
    scheduleConflicts: boolean
    teacherAvailability: boolean
    paymentRequired: boolean
  }
}

export interface UseEnrollmentFlowOptions {
  enableValidation?: boolean
  enableEmailNotifications?: boolean
  enablePaymentIntegration?: boolean
  autoConfirmEnrollment?: boolean
}

export interface UseEnrollmentFlowReturn {
  // State
  isLoading: boolean
  error: string | null
  currentEnrollment: EnrollmentData | null
  
  // Actions
  createEnrollment: (data: Omit<EnrollmentData, 'id' | 'enrollment_date'>) => Promise<string>
  updateEnrollment: (id: string, updates: Partial<EnrollmentData>) => Promise<void>
  confirmEnrollment: (id: string) => Promise<void>
  cancelEnrollment: (id: string, reason?: string) => Promise<void>
  
  // Validation
  validateEnrollment: (data: Partial<EnrollmentData>) => Promise<EnrollmentValidation>
  checkSlotAvailability: (slots: TimeSlot[]) => Promise<boolean>
  calculateEnrollmentCost: (slots: TimeSlot[], course: Course) => Promise<number>
  
  // Data fetching
  getEnrollmentById: (id: string) => Promise<EnrollmentData | null>
  getUserEnrollments: (userId: string) => Promise<EnrollmentData[]>
  
  // Utilities
  formatScheduleSummary: (slots: ScheduledSlot[]) => string
  getEnrollmentProgress: (enrollment: EnrollmentData) => number
}

/**
 * Custom hook for enrollment flow management with MCP Supabase integration
 */
export function useEnrollmentFlow(options: UseEnrollmentFlowOptions = {}): UseEnrollmentFlowReturn {
  const {
    enableValidation = true,
    enableEmailNotifications = true,
    enablePaymentIntegration = false,
    autoConfirmEnrollment = false
  } = options

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentEnrollment, setCurrentEnrollment] = useState<EnrollmentData | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  /**
   * Create new enrollment with validation and database persistence
   */
  const createEnrollment = useCallback(async (
    data: Omit<EnrollmentData, 'id' | 'enrollment_date'>
  ): Promise<string> => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate enrollment data
      if (enableValidation) {
        const validation = await validateEnrollment(data)
        if (!validation.isValid) {
          throw new Error(`ENROLLMENT_VALIDATION_ERROR: ${validation.errors.join(', ')}`)
        }
      }

      // Check slot availability
      const slotsAsTimeSlots = data.scheduled_slots.map(slot => ({
        date: new Date(slot.date),
        startTime: slot.start_time,
        endTime: slot.end_time,
        isAvailable: true,
        currentCapacity: 0,
        maxCapacity: 10,
        slotId: slot.slot_id,
        teacherId: data.teacher_id
      }))

      const isAvailable = await checkSlotAvailability(slotsAsTimeSlots)
      if (!isAvailable) {
        throw new Error('CAPACITY_EXCEEDED: One or more selected time slots are no longer available')
      }

      // Create enrollment record
      const enrollmentData: Omit<EnrollmentData, 'id'> = {
        ...data,
        enrollment_date: new Date().toISOString(),
        status: autoConfirmEnrollment ? 'confirmed' : 'pending'
      }

      const { data: enrollment, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert({
          student_id: enrollmentData.student_id,
          course_id: enrollmentData.course_id,
          teacher_id: enrollmentData.teacher_id,
          enrollment_date: enrollmentData.enrollment_date,
          status: enrollmentData.status,
          total_hours: enrollmentData.total_hours,
          payment_status: enrollmentData.payment_status || 'pending',
          notes: enrollmentData.notes
        })
        .select()
        .single()

      if (enrollmentError || !enrollment) {
        throw new Error(`DATABASE_ERROR: ${enrollmentError?.message || 'Failed to create enrollment'}`)
      }

      // Create scheduled slots
      const slotsToInsert = data.scheduled_slots.map(slot => ({
        enrollment_id: enrollment.id,
        teacher_availability_id: slot.teacher_availability_id,
        scheduled_date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        duration_minutes: slot.duration_minutes,
        status: 'scheduled'
      }))

      const { error: slotsError } = await supabase
        .from('enrollment_slots')
        .insert(slotsToInsert)

      if (slotsError) {
        // Rollback enrollment if slots creation fails
        await supabase
          .from('course_enrollments')
          .delete()
          .eq('id', enrollment.id)
        
        throw new Error(`SLOT_CREATION_ERROR: ${slotsError.message}`)
      }

      // Update capacity for teacher availability slots
      for (const slot of data.scheduled_slots) {
        const { error: capacityError } = await supabase.rpc('update_availability_capacity', {
          availability_id: slot.teacher_availability_id,
          date_to_update: slot.date,
          capacity_change: 1
        })

        if (capacityError) {
          console.warn('Failed to update capacity for slot:', capacityError)
        }
      }

      // Send email notification if enabled
      if (enableEmailNotifications) {
        try {
          await sendEnrollmentNotification(enrollment.id, 'created')
        } catch (emailError) {
          console.warn('Failed to send enrollment notification:', emailError)
        }
      }

      setCurrentEnrollment({ ...enrollmentData, id: enrollment.id })
      return enrollment.id

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [supabase, enableValidation, enableEmailNotifications, autoConfirmEnrollment, checkSlotAvailability, validateEnrollment])

  /**
   * Update existing enrollment
   */
  const updateEnrollment = useCallback(async (
    id: string, 
    updates: Partial<EnrollmentData>
  ): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      const { error: updateError } = await supabase
        .from('course_enrollments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (updateError) {
        throw new Error(`UPDATE_ERROR: ${updateError.message}`)
      }

      // Update local state if this is the current enrollment
      if (currentEnrollment?.id === id) {
        setCurrentEnrollment(prev => prev ? { ...prev, ...updates } : null)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [supabase, currentEnrollment])

  /**
   * Confirm enrollment and finalize scheduling
   */
  const confirmEnrollment = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Update enrollment status
      const { error: confirmError } = await supabase
        .from('course_enrollments')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', id)

      if (confirmError) {
        throw new Error(`CONFIRMATION_ERROR: ${confirmError.message}`)
      }

      // Update scheduled slots status
      const { error: slotsError } = await supabase
        .from('enrollment_slots')
        .update({ status: 'confirmed' })
        .eq('enrollment_id', id)

      if (slotsError) {
        console.warn('Failed to confirm enrollment slots:', slotsError)
      }

      // Send confirmation notification
      if (enableEmailNotifications) {
        try {
          await sendEnrollmentNotification(id, 'confirmed')
        } catch (emailError) {
          console.warn('Failed to send confirmation notification:', emailError)
        }
      }

      // Update local state
      if (currentEnrollment?.id === id) {
        setCurrentEnrollment(prev => prev ? {
          ...prev,
          status: 'confirmed'
        } : null)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [supabase, enableEmailNotifications, currentEnrollment])

  /**
   * Cancel enrollment and free up slots
   */
  const cancelEnrollment = useCallback(async (
    id: string, 
    reason?: string
  ): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Get enrollment slots to free up capacity
      const { data: slots, error: slotsError } = await supabase
        .from('enrollment_slots')
        .select('teacher_availability_id, scheduled_date')
        .eq('enrollment_id', id)

      if (slotsError) {
        console.warn('Failed to fetch enrollment slots for cancellation:', slotsError)
      }

      // Update enrollment status
      const { error: cancelError } = await supabase
        .from('course_enrollments')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason
        })
        .eq('id', id)

      if (cancelError) {
        throw new Error(`CANCELLATION_ERROR: ${cancelError.message}`)
      }

      // Free up capacity for teacher availability slots
      if (slots) {
        for (const slot of slots) {
          const { error: capacityError } = await supabase.rpc('update_availability_capacity', {
            availability_id: slot.teacher_availability_id,
            date_to_update: slot.scheduled_date,
            capacity_change: -1 // Decrease capacity
          })

          if (capacityError) {
            console.warn('Failed to update capacity for cancelled slot:', capacityError)
          }
        }
      }

      // Update scheduled slots status
      const { error: updateSlotsError } = await supabase
        .from('enrollment_slots')
        .update({ status: 'cancelled' })
        .eq('enrollment_id', id)

      if (updateSlotsError) {
        console.warn('Failed to cancel enrollment slots:', updateSlotsError)
      }

      // Send cancellation notification
      if (enableEmailNotifications) {
        try {
          await sendEnrollmentNotification(id, 'cancelled')
        } catch (emailError) {
          console.warn('Failed to send cancellation notification:', emailError)
        }
      }

      // Update local state
      if (currentEnrollment?.id === id) {
        setCurrentEnrollment(prev => prev ? {
          ...prev,
          status: 'cancelled'
        } : null)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [supabase, enableEmailNotifications, currentEnrollment])

  /**
   * Validate enrollment data against business rules
   */
  const validateEnrollment = useCallback(async (
    data: Partial<EnrollmentData>
  ): Promise<EnrollmentValidation> => {
    const errors: string[] = []
    const warnings: string[] = []
    const requirements = {
      minimumHours: false,
      scheduleConflicts: false,
      teacherAvailability: false,
      paymentRequired: false
    }

    try {
      // Check required fields
      if (!data.student_id) errors.push('Student ID is required')
      if (!data.course_id) errors.push('Course ID is required')
      if (!data.teacher_id) errors.push('Teacher ID is required')
      if (!data.scheduled_slots || data.scheduled_slots.length === 0) {
        errors.push('At least one scheduled slot is required')
      }

      if (data.scheduled_slots && data.scheduled_slots.length > 0) {
        // Check minimum hours requirement
        const totalHours = data.total_hours || 0
        if (totalHours < 10) { // Minimum 10 hours for any course
          errors.push('Minimum 10 hours of classes required')
        } else {
          requirements.minimumHours = true
        }

        // Check for schedule conflicts
        const dates = data.scheduled_slots.map(slot => slot.date)
        const uniqueDates = new Set(dates)
        if (dates.length !== uniqueDates.size) {
          warnings.push('Multiple classes scheduled on the same day')
        } else {
          requirements.scheduleConflicts = true
        }

        // Check teacher availability
        for (const slot of data.scheduled_slots) {
          const { data: availability, error: availError } = await supabase
            .from('teacher_availability')
            .select('max_students, current_enrollments')
            .eq('id', slot.teacher_availability_id)
            .single()

          if (availError || !availability) {
            errors.push(`Teacher availability not found for slot ${slot.slot_id}`)
            continue
          }

          if (availability.current_enrollments >= availability.max_students) {
            errors.push(`Time slot ${slot.start_time}-${slot.end_time} on ${slot.date} is full`)
          }
        }

        if (errors.length === 0) {
          requirements.teacherAvailability = true
        }
      }

      // Check payment requirements
      if (enablePaymentIntegration) {
        if (!data.payment_status || data.payment_status === 'pending') {
          warnings.push('Payment is required to confirm enrollment')
        } else if (data.payment_status === 'paid') {
          requirements.paymentRequired = true
        }
      } else {
        requirements.paymentRequired = true // Not required
      }

    } catch (validationError) {
      errors.push(`Validation error: ${validationError instanceof Error ? validationError.message : 'Unknown error'}`)
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      requirements
    }
  }, [supabase, enablePaymentIntegration])

  /**
   * Check availability of selected time slots
   */
  const checkSlotAvailability = useCallback(async (slots: TimeSlot[]): Promise<boolean> => {
    try {
      for (const slot of slots) {
        const { data: availability, error } = await supabase
          .from('teacher_availability')
          .select('max_students')
          .eq('id', slot.slotId)
          .single()

        if (error || !availability) {
          return false
        }

        // Check current enrollments for this specific date and slot
        const { count, error: countError } = await supabase
          .from('enrollment_slots')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_availability_id', slot.slotId)
          .eq('scheduled_date', slot.date.toISOString().split('T')[0])
          .eq('status', 'confirmed')

        if (countError) {
          return false
        }

        if ((count || 0) >= availability.max_students) {
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error checking slot availability:', error)
      return false
    }
  }, [supabase])

  /**
   * Calculate enrollment cost based on slots and course
   */
  const calculateEnrollmentCost = useCallback(async (
    slots: TimeSlot[], 
    course: Course
  ): Promise<number> => {
    try {
      // Get course pricing
      const { data: pricing, error } = await supabase
        .from('course_pricing')
        .select('price_per_hour, fixed_price')
        .eq('course_id', course.id)
        .single()

      if (error || !pricing) {
        // Default pricing calculation
        const totalHours = slots.reduce((sum, slot) => {
          const start = new Date(`1970-01-01T${slot.startTime}:00`)
          const end = new Date(`1970-01-01T${slot.endTime}:00`)
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        }, 0)

        return totalHours * 50 // Default R$ 50 per hour
      }

      if (pricing.fixed_price) {
        return pricing.fixed_price
      }

      const totalHours = slots.reduce((sum, slot) => {
        const start = new Date(`1970-01-01T${slot.startTime}:00`)
        const end = new Date(`1970-01-01T${slot.endTime}:00`)
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      }, 0)

      return totalHours * pricing.price_per_hour

    } catch (error) {
      console.error('Error calculating enrollment cost:', error)
      return 0
    }
  }, [supabase])

  /**
   * Get enrollment by ID
   */
  const getEnrollmentById = useCallback(async (id: string): Promise<EnrollmentData | null> => {
    try {
      const { data: enrollment, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          enrollment_slots (
            teacher_availability_id,
            scheduled_date,
            start_time,
            end_time,
            duration_minutes,
            status
          )
        `)
        .eq('id', id)
        .single()

      if (error || !enrollment) {
        return null
      }

      const scheduledSlots: ScheduledSlot[] = enrollment.enrollment_slots.map((slot: any) => ({
        slot_id: slot.teacher_availability_id,
        date: slot.scheduled_date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        duration_minutes: slot.duration_minutes,
        teacher_availability_id: slot.teacher_availability_id
      }))

      return {
        id: enrollment.id,
        student_id: enrollment.student_id,
        course_id: enrollment.course_id,
        teacher_id: enrollment.teacher_id,
        enrollment_date: enrollment.enrollment_date,
        scheduled_slots: scheduledSlots,
        status: enrollment.status,
        total_hours: enrollment.total_hours,
        payment_status: enrollment.payment_status,
        notes: enrollment.notes
      }
    } catch (error) {
      console.error('Error fetching enrollment:', error)
      return null
    }
  }, [supabase])

  /**
   * Get user enrollments
   */
  const getUserEnrollments = useCallback(async (userId: string): Promise<EnrollmentData[]> => {
    try {
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (title, category),
          teachers (name, profile_image),
          enrollment_slots (
            teacher_availability_id,
            scheduled_date,
            start_time,
            end_time,
            duration_minutes,
            status
          )
        `)
        .eq('student_id', userId)
        .order('enrollment_date', { ascending: false })

      if (error || !enrollments) {
        return []
      }

      return enrollments.map((enrollment: any) => {
        const scheduledSlots: ScheduledSlot[] = enrollment.enrollment_slots.map((slot: any) => ({
          slot_id: slot.teacher_availability_id,
          date: slot.scheduled_date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          duration_minutes: slot.duration_minutes,
          teacher_availability_id: slot.teacher_availability_id
        }))

        return {
          id: enrollment.id,
          student_id: enrollment.student_id,
          course_id: enrollment.course_id,
          teacher_id: enrollment.teacher_id,
          enrollment_date: enrollment.enrollment_date,
          scheduled_slots: scheduledSlots,
          status: enrollment.status,
          total_hours: enrollment.total_hours,
          payment_status: enrollment.payment_status,
          notes: enrollment.notes
        }
      })
    } catch (error) {
      console.error('Error fetching user enrollments:', error)
      return []
    }
  }, [supabase])

  /**
   * Format schedule summary for display
   */
  const formatScheduleSummary = useCallback((slots: ScheduledSlot[]): string => {
    if (slots.length === 0) return 'No classes scheduled'

    const sortedSlots = slots.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const firstSlot = sortedSlots[0]
    const lastSlot = sortedSlots[sortedSlots.length - 1]

    const startDate = new Date(firstSlot.date).toLocaleDateString('pt-BR')
    const endDate = new Date(lastSlot.date).toLocaleDateString('pt-BR')

    if (slots.length === 1) {
      return `1 aula em ${startDate}`
    }

    return `${slots.length} aulas de ${startDate} até ${endDate}`
  }, [])

  /**
   * Get enrollment progress as percentage
   */
  const getEnrollmentProgress = useCallback((enrollment: EnrollmentData): number => {
    const completedSlots = enrollment.scheduled_slots.filter(
      slot => new Date(slot.date) < new Date()
    ).length

    return enrollment.scheduled_slots.length > 0 
      ? (completedSlots / enrollment.scheduled_slots.length) * 100 
      : 0
  }, [])

  // Utility function to send email notifications
  const sendEnrollmentNotification = async (enrollmentId: string, type: 'created' | 'confirmed' | 'cancelled') => {
    // In a real implementation, this would integrate with an email service
    console.log(`Sending ${type} notification for enrollment ${enrollmentId}`)
    
    try {
      await fetch('/api/notifications/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, type })
      })
    } catch (error) {
      console.warn('Failed to send email notification:', error)
    }
  }

  return {
    isLoading,
    error,
    currentEnrollment,
    createEnrollment,
    updateEnrollment,
    confirmEnrollment,
    cancelEnrollment,
    validateEnrollment,
    checkSlotAvailability,
    calculateEnrollmentCost,
    getEnrollmentById,
    getUserEnrollments,
    formatScheduleSummary,
    getEnrollmentProgress
  }
}

export default useEnrollmentFlow