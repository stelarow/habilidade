/**
 * Teacher Availability Business Logic
 * Story 2.1: Core Business Logic - Task 2
 * 
 * Comprehensive teacher availability management with capacity tracking,
 * conflict detection, and real-time updates via Supabase
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Holiday, TeacherAvailability, AvailableSlot } from '@/types/api'
import { isBusinessDay, toISODateString, parseISODate } from './dateCalculations'

export interface AvailabilitySlotWithOccurrence extends AvailableSlot {
  nextOccurrence: Date
  isRecurring: boolean
  dayOfWeekName: string
}

export interface CapacityInfo {
  maxStudents: number
  currentEnrollments: number
  availableSpots: number
  isAtCapacity: boolean
}

export interface ConflictInfo {
  hasConflict: boolean
  conflictType: 'holiday' | 'capacity' | 'overlap' | 'none'
  conflictDate?: string
  message: string
}

/**
 * Calculate available time slots for a teacher within a date range
 * @param teacherId - Teacher's UUID
 * @param dateRange - Start and end dates for availability search
 * @param holidays - Array of holidays to exclude
 * @returns Available slots with capacity and conflict information
 */
export async function calculateAvailableSlots(
  teacherId: string,
  dateRange: { start: Date; end: Date },
  holidays: Holiday[]
): Promise<AvailabilitySlotWithOccurrence[]> {
  if (!teacherId) {
    throw new Error('Teacher ID is required')
  }
  
  if (dateRange.start > dateRange.end) {
    throw new Error('Start date must be before or equal to end date')
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  // Fetch teacher availability patterns
  const { data: availabilityPatterns, error } = await supabase
    .from('teacher_availability')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('is_active', true)
    .order('day_of_week')

  if (error) {
    throw new Error(`Failed to fetch teacher availability: ${error.message}`)
  }

  if (!availabilityPatterns || availabilityPatterns.length === 0) {
    return []
  }

  const slots: AvailabilitySlotWithOccurrence[] = []
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // Generate slots for each availability pattern within the date range
  for (const pattern of availabilityPatterns) {
    const patternSlots = await generateSlotsForPattern(
      pattern,
      dateRange,
      holidays,
      dayNames[pattern.day_of_week]
    )
    slots.push(...patternSlots)
  }

  // Sort slots by date and time
  slots.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare === 0) {
      return a.startTime.localeCompare(b.startTime)
    }
    return dateCompare
  })

  return slots
}

/**
 * Generate availability slots for a specific pattern within date range
 */
async function generateSlotsForPattern(
  pattern: TeacherAvailability,
  dateRange: { start: Date; end: Date },
  holidays: Holiday[],
  dayName: string
): Promise<AvailabilitySlotWithOccurrence[]> {
  const slots: AvailabilitySlotWithOccurrence[] = []
  const currentDate = new Date(dateRange.start)
  
  // Find first occurrence of the pattern's day of week
  while (currentDate.getDay() !== pattern.day_of_week && currentDate <= dateRange.end) {
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Generate slots for each occurrence of this day within the range
  while (currentDate <= dateRange.end) {
    // Convert API Holiday format to date-calculation Holiday format
    const dateCalculationHolidays = holidays.map(h => ({
      date: h.date,
      name: h.name,
      type: h.is_national ? 'national' as const : 'regional' as const
    }));
    if (isBusinessDay(currentDate, dateCalculationHolidays)) {
      const capacityInfo = await getSlotCapacityInfo(pattern.id, toISODateString(currentDate))
      const conflictInfo = await checkSlotConflicts(pattern.id, currentDate, holidays)

      const slot: AvailabilitySlotWithOccurrence = {
        id: `${pattern.id}-${toISODateString(currentDate)}`,
        teacherId: pattern.teacher_id,
        date: toISODateString(currentDate),
        startTime: pattern.start_time,
        endTime: pattern.end_time,
        maxStudents: pattern.max_students,
        availableSpots: capacityInfo.availableSpots,
        conflictsWithHoliday: conflictInfo.conflictType === 'holiday',
        nextOccurrence: new Date(currentDate),
        isRecurring: true,
        dayOfWeekName: dayName
      }

      slots.push(slot)
    }

    // Move to next occurrence (next week)
    currentDate.setDate(currentDate.getDate() + 7)
  }

  return slots
}

/**
 * Check capacity conflicts for a specific time slot
 * @param slotId - Availability slot ID (pattern ID)
 * @param requestedCapacity - Number of students requesting this slot
 * @returns True if capacity would be exceeded
 */
export async function checkCapacityConflicts(
  slotId: string,
  requestedCapacity: number
): Promise<boolean> {
  if (requestedCapacity <= 0) {
    throw new Error('Requested capacity must be greater than 0')
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Get slot capacity information
  const { data: availability, error: availError } = await supabase
    .from('teacher_availability')
    .select('max_students')
    .eq('id', slotId)
    .single()

  if (availError || !availability) {
    throw new Error(`Availability slot not found: ${slotId}`)
  }

  // Count current enrollments for this slot
  const { count: currentEnrollments, error: countError } = await supabase
    .from('course_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('availability_slot_id', slotId)
    .eq('status', 'active')

  if (countError) {
    throw new Error(`Failed to count enrollments: ${countError.message}`)
  }

  const totalAfterRequest = (currentEnrollments || 0) + requestedCapacity
  return totalAfterRequest > availability.max_students
}

/**
 * Get capacity information for a specific slot on a specific date
 */
async function getSlotCapacityInfo(
  availabilityPatternId: string,
  date: string
): Promise<CapacityInfo> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Get max capacity from availability pattern
  const { data: pattern, error: patternError } = await supabase
    .from('teacher_availability')
    .select('max_students')
    .eq('id', availabilityPatternId)
    .single()

  if (patternError || !pattern) {
    throw new Error(`Availability pattern not found: ${availabilityPatternId}`)
  }

  // Count current enrollments for this specific date/slot
  const { count: currentEnrollments, error: countError } = await supabase
    .from('course_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('availability_slot_id', availabilityPatternId)
    .eq('class_date', date)
    .eq('status', 'active')

  if (countError) {
    throw new Error(`Failed to count enrollments: ${countError.message}`)
  }

  const maxStudents = pattern.max_students
  const current = currentEnrollments || 0
  const availableSpots = Math.max(0, maxStudents - current)

  return {
    maxStudents,
    currentEnrollments: current,
    availableSpots,
    isAtCapacity: availableSpots === 0
  }
}

/**
 * Check for various types of conflicts for a slot
 */
async function checkSlotConflicts(
  availabilityPatternId: string,
  date: Date,
  holidays: Holiday[]
): Promise<ConflictInfo> {
  // Check holiday conflicts
  const dateStr = toISODateString(date)
  const isHoliday = holidays.some(holiday => 
    holiday.date === dateStr
  )

  if (isHoliday) {
    return {
      hasConflict: true,
      conflictType: 'holiday',
      conflictDate: dateStr,
      message: `Conflicts with holiday on ${dateStr}`
    }
  }

  // Check capacity conflicts
  const capacityInfo = await getSlotCapacityInfo(availabilityPatternId, dateStr)
  if (capacityInfo.isAtCapacity) {
    return {
      hasConflict: true,
      conflictType: 'capacity',
      conflictDate: dateStr,
      message: `Slot is at maximum capacity (${capacityInfo.maxStudents} students)`
    }
  }

  return {
    hasConflict: false,
    conflictType: 'none',
    message: 'No conflicts detected'
  }
}

/**
 * Aggregate availability data for calendar display
 * @param teacherId - Teacher's UUID
 * @param month - Month (1-12)
 * @param year - Full year
 * @returns Aggregated availability data by date
 */
export async function aggregateAvailabilityForCalendar(
  teacherId: string,
  month: number,
  year: number
): Promise<Record<string, {
  totalSlots: number
  availableSlots: number
  conflictedSlots: number
  capacity: CapacityInfo
}>> {
  if (month < 1 || month > 12) {
    throw new Error('Month must be between 1 and 12')
  }
  
  if (year < 2020 || year > 2050) {
    throw new Error('Year must be between 2020 and 2050')
  }

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0) // Last day of month

  // Get holidays for the month
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: holidays, error: holidayError } = await supabase
    .from('holidays')
    .select('*')
    .gte('date', toISODateString(startDate))
    .lte('date', toISODateString(endDate))

  if (holidayError) {
    throw new Error(`Failed to fetch holidays: ${holidayError.message}`)
  }

  const availableSlots = await calculateAvailableSlots(
    teacherId,
    { start: startDate, end: endDate },
    holidays || []
  )

  // Aggregate by date
  const aggregated: Record<string, any> = {}

  for (const slot of availableSlots) {
    if (!aggregated[slot.date]) {
      aggregated[slot.date] = {
        totalSlots: 0,
        availableSlots: 0,
        conflictedSlots: 0,
        capacity: {
          maxStudents: 0,
          currentEnrollments: 0,
          availableSpots: 0,
          isAtCapacity: false
        }
      }
    }

    const dayData = aggregated[slot.date]
    dayData.totalSlots++
    
    if (slot.conflictsWithHoliday) {
      dayData.conflictedSlots++
    } else {
      dayData.availableSlots++
    }

    // Aggregate capacity info
    dayData.capacity.maxStudents += slot.maxStudents
    dayData.capacity.availableSpots += slot.availableSpots
    dayData.capacity.currentEnrollments += (slot.maxStudents - slot.availableSpots)
  }

  // Calculate capacity flags
  for (const date in aggregated) {
    const dayData = aggregated[date]
    dayData.capacity.isAtCapacity = dayData.capacity.availableSpots === 0
  }

  return aggregated
}

/**
 * Detect overlapping availability slots for a teacher
 * @param teacherId - Teacher's UUID
 * @returns Array of overlapping slot pairs
 */
export async function detectAvailabilityOverlaps(
  teacherId: string
): Promise<Array<{
  slot1: TeacherAvailability
  slot2: TeacherAvailability
  overlapMinutes: number
}>> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: availabilities, error } = await supabase
    .from('teacher_availability')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('is_active', true)
    .order('day_of_week, start_time')

  if (error) {
    throw new Error(`Failed to fetch availabilities: ${error.message}`)
  }

  if (!availabilities || availabilities.length < 2) {
    return []
  }

  const overlaps: Array<{
    slot1: TeacherAvailability
    slot2: TeacherAvailability
    overlapMinutes: number
  }> = []

  // Check for overlaps within the same day
  for (let i = 0; i < availabilities.length; i++) {
    for (let j = i + 1; j < availabilities.length; j++) {
      const slot1 = availabilities[i]
      const slot2 = availabilities[j]

      // Only check slots on the same day
      if (slot1.day_of_week === slot2.day_of_week) {
        const overlapMinutes = calculateTimeOverlap(
          slot1.start_time,
          slot1.end_time,
          slot2.start_time,
          slot2.end_time
        )

        if (overlapMinutes > 0) {
          overlaps.push({ slot1, slot2, overlapMinutes })
        }
      }
    }
  }

  return overlaps
}

/**
 * Calculate overlap in minutes between two time ranges
 */
function calculateTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): number {
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const start1Min = timeToMinutes(start1)
  const end1Min = timeToMinutes(end1)
  const start2Min = timeToMinutes(start2)
  const end2Min = timeToMinutes(end2)

  const overlapStart = Math.max(start1Min, start2Min)
  const overlapEnd = Math.min(end1Min, end2Min)

  return Math.max(0, overlapEnd - overlapStart)
}

/**
 * Setup real-time subscription for availability updates
 * @param teacherId - Teacher's UUID to monitor
 * @param onUpdate - Callback function for updates
 * @returns Unsubscribe function
 */
export function subscribeToAvailabilityUpdates(
  teacherId: string,
  onUpdate: (payload: any) => void
): () => void {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const subscription = supabase
    .channel(`teacher-availability-${teacherId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'teacher_availability',
        filter: `teacher_id=eq.${teacherId}`
      },
      onUpdate
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'course_enrollments',
        filter: `teacher_id=eq.${teacherId}`
      },
      onUpdate
    )
    .subscribe()

  return () => {
    supabase.removeChannel(subscription)
  }
}

/**
 * Get teacher's next available slot after a given date
 * @param teacherId - Teacher's UUID
 * @param afterDate - Date to search after
 * @param holidays - Array of holidays to exclude
 * @returns Next available slot or null if none found in next 30 days
 */
export async function getNextAvailableSlot(
  teacherId: string,
  afterDate: Date,
  holidays: Holiday[] = []
): Promise<AvailabilitySlotWithOccurrence | null> {
  const searchEndDate = new Date(afterDate)
  searchEndDate.setDate(searchEndDate.getDate() + 30) // Search next 30 days

  const availableSlots = await calculateAvailableSlots(
    teacherId,
    { start: afterDate, end: searchEndDate },
    holidays
  )

  // Filter to slots with available capacity and no conflicts
  const viableSlots = availableSlots.filter(
    slot => slot.availableSpots > 0 && !slot.conflictsWithHoliday
  )

  return viableSlots.length > 0 ? viableSlots[0] : null
}

/**
 * Validate teacher availability data for consistency
 * @param teacherId - Teacher's UUID
 * @returns Validation results with any issues found
 */
export async function validateTeacherAvailability(
  teacherId: string
): Promise<{
  isValid: boolean
  issues: string[]
  warnings: string[]
}> {
  const issues: string[] = []
  const warnings: string[] = []

  try {
    // Check for overlapping slots
    const overlaps = await detectAvailabilityOverlaps(teacherId)
    if (overlaps.length > 0) {
      issues.push(`Found ${overlaps.length} overlapping availability slots`)
    }

    // Check for reasonable time ranges
    const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
    const { data: availabilities, error } = await supabase
      .from('teacher_availability')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('is_active', true)

    if (error) {
      issues.push(`Failed to fetch availability data: ${error.message}`)
      return { isValid: false, issues, warnings }
    }

    if (!availabilities || availabilities.length === 0) {
      warnings.push('No active availability slots configured')
    }

    for (const availability of availabilities || []) {
      // Check for reasonable time ranges (not too early/late)
      const startHour = parseInt(availability.start_time.split(':')[0])
      const endHour = parseInt(availability.end_time.split(':')[0])

      if (startHour < 6 || endHour > 22) {
        warnings.push(`Unusual hours: ${availability.start_time}-${availability.end_time} on ${getDayName(availability.day_of_week)}`)
      }

      // Check for reasonable capacity
      if (availability.max_students > 50) {
        warnings.push(`Very high capacity (${availability.max_students}) for ${getDayName(availability.day_of_week)} slot`)
      }

      if (availability.max_students < 1) {
        issues.push(`Invalid capacity (${availability.max_students}) for ${getDayName(availability.day_of_week)} slot`)
      }
    }

  } catch (error) {
    issues.push(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings
  }
}

/**
 * Helper function to get day name from day of week number
 */
function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayOfWeek] || 'Unknown'
}