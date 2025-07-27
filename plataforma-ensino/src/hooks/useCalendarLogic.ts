/**
 * Custom hook for calendar state and logic management
 * Story 2.2: UI Components Integration - Task 2
 * 
 * Handles calendar navigation, slot selection, validation, and performance optimization
 * with comprehensive state management and business logic integration.
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { logWarn } from '@/lib/utils/logger'
import type { TimeSlot, CourseRequirements } from '@/components/enrollment/ConditionalCalendar'
import type { TeacherAvailability } from '@/types/api'

export interface CalendarState {
  currentDate: Date
  selectedSlots: TimeSlot[]
  viewMode: 'month' | 'week' | 'day'
  filterCriteria: CalendarFilterCriteria
}

export interface CalendarFilterCriteria {
  showAvailableOnly: boolean
  showConflictsOnly: boolean
  minCapacity?: number
  timeRange?: {
    start: string // HH:MM
    end: string   // HH:MM
  }
  weekdays?: number[] // 0-6, Sunday-Saturday
}

export interface CalendarValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export interface CalendarPerformanceMetrics {
  totalSlots: number
  availableSlots: number
  selectedSlots: number
  selectionProgress: number // 0-100
  estimatedCompletion: Date | null
  conflictCount: number
}

export interface UseCalendarLogicOptions {
  enableValidation?: boolean
  enablePerformanceTracking?: boolean
  maxSelectableSlots?: number
  minSelectableSlots?: number
  allowPastSlots?: boolean
  autoValidateSelection?: boolean
  persistState?: boolean
  storageKey?: string
}

export interface UseCalendarLogicReturn {
  // State
  calendarState: CalendarState
  
  // Navigation
  goToNextMonth: () => void
  goToPreviousMonth: () => void
  goToToday: () => void
  goToDate: (date: Date) => void
  setViewMode: (mode: 'month' | 'week' | 'day') => void
  
  // Selection management
  selectSlot: (slot: TimeSlot) => void
  deselectSlot: (slot: TimeSlot) => void
  toggleSlot: (slot: TimeSlot) => void
  clearSelection: () => void
  selectMultipleSlots: (slots: TimeSlot[]) => void
  
  // Filtering
  setFilter: (criteria: Partial<CalendarFilterCriteria>) => void
  clearFilters: () => void
  getFilteredSlots: (slots: TimeSlot[]) => TimeSlot[]
  
  // Validation
  validateSelection: () => CalendarValidation
  validateSlot: (slot: TimeSlot) => { isValid: boolean; reason?: string }
  canSelectSlot: (slot: TimeSlot) => boolean
  
  // Performance metrics
  getPerformanceMetrics: (allSlots: TimeSlot[]) => CalendarPerformanceMetrics
  calculateSelectionEfficiency: () => number
  getOptimizedSelectionSuggestions: (allSlots: TimeSlot[], courseReq: CourseRequirements) => TimeSlot[]
  
  // Utility functions
  isSlotSelected: (slot: TimeSlot) => boolean
  getSlotSelectionIndex: (slot: TimeSlot) => number
  getSelectedSlotsForDate: (date: Date) => TimeSlot[]
  getSelectionSummary: () => {
    totalHours: number
    averageSessionLength: number
    weeklyDistribution: Record<string, number>
    monthlyDistribution: Record<string, number>
  }
}

/**
 * Enhanced calendar logic hook with comprehensive state management and optimization
 */
export function useCalendarLogic(
  courseRequirements: CourseRequirements,
  options: UseCalendarLogicOptions = {}
): UseCalendarLogicReturn {
  const {
    enableValidation = true,
    enablePerformanceTracking = true,
    maxSelectableSlots,
    minSelectableSlots = 1,
    allowPastSlots = false,
    autoValidateSelection = true,
    persistState = false,
    storageKey = 'calendar-state'
  } = options

  // Initialize state
  const [calendarState, setCalendarState] = useState<CalendarState>(() => {
    const defaultState: CalendarState = {
      currentDate: new Date(),
      selectedSlots: [],
      viewMode: 'month',
      filterCriteria: {
        showAvailableOnly: false,
        showConflictsOnly: false
      }
    }

    if (persistState && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return {
            ...defaultState,
            ...parsed,
            currentDate: new Date(parsed.currentDate),
            selectedSlots: parsed.selectedSlots.map((slot: any) => ({
              ...slot,
              date: new Date(slot.date)
            }))
          }
        } catch (error) {
          logWarn('Failed to restore calendar state:', error)
        }
      }
    }

    return defaultState
  })

  // Persist state changes
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      const stateToSave = {
        ...calendarState,
        currentDate: calendarState.currentDate.toISOString(),
        selectedSlots: calendarState.selectedSlots.map(slot => ({
          ...slot,
          date: slot.date.toISOString()
        }))
      }
      localStorage.setItem(storageKey, JSON.stringify(stateToSave))
    }
  }, [calendarState, persistState, storageKey])

  // Navigation functions
  const goToNextMonth = useCallback(() => {
    setCalendarState(prev => {
      const newDate = new Date(prev.currentDate)
      newDate.setMonth(newDate.getMonth() + 1)
      return { ...prev, currentDate: newDate }
    })
  }, [])

  const goToPreviousMonth = useCallback(() => {
    setCalendarState(prev => {
      const newDate = new Date(prev.currentDate)
      newDate.setMonth(newDate.getMonth() - 1)
      return { ...prev, currentDate: newDate }
    })
  }, [])

  const goToToday = useCallback(() => {
    setCalendarState(prev => ({
      ...prev,
      currentDate: new Date()
    }))
  }, [])

  const goToDate = useCallback((date: Date) => {
    setCalendarState(prev => ({
      ...prev,
      currentDate: new Date(date)
    }))
  }, [])

  const setViewMode = useCallback((mode: 'month' | 'week' | 'day') => {
    setCalendarState(prev => ({
      ...prev,
      viewMode: mode
    }))
  }, [])

  // Selection validation
  const validateSlot = useCallback((slot: TimeSlot): { isValid: boolean; reason?: string } => {
    if (!allowPastSlots && slot.date < new Date()) {
      return { isValid: false, reason: 'Cannot select past time slots' }
    }

    if (!slot.isAvailable) {
      return { isValid: false, reason: slot.conflictReason || 'Time slot is not available' }
    }

    if (maxSelectableSlots && calendarState.selectedSlots.length >= maxSelectableSlots) {
      const isAlreadySelected = calendarState.selectedSlots.some(s => 
        s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime()
      )
      if (!isAlreadySelected) {
        return { isValid: false, reason: `Maximum ${maxSelectableSlots} slots can be selected` }
      }
    }

    return { isValid: true }
  }, [allowPastSlots, maxSelectableSlots, calendarState.selectedSlots])

  const canSelectSlot = useCallback((slot: TimeSlot): boolean => {
    return validateSlot(slot).isValid
  }, [validateSlot])

  // Selection management
  const selectSlot = useCallback((slot: TimeSlot) => {
    const validation = validateSlot(slot)
    if (!validation.isValid) {
      logWarn('Cannot select slot:', validation.reason)
      return
    }

    setCalendarState(prev => {
      const isAlreadySelected = prev.selectedSlots.some(s => 
        s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime()
      )

      if (isAlreadySelected) {
        return prev // Already selected
      }

      return {
        ...prev,
        selectedSlots: [...prev.selectedSlots, slot]
      }
    })
  }, [validateSlot])

  const deselectSlot = useCallback((slot: TimeSlot) => {
    setCalendarState(prev => ({
      ...prev,
      selectedSlots: prev.selectedSlots.filter(s => 
        !(s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime())
      )
    }))
  }, [])

  const toggleSlot = useCallback((slot: TimeSlot) => {
    const isSelected = calendarState.selectedSlots.some(s => 
      s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime()
    )

    if (isSelected) {
      deselectSlot(slot)
    } else {
      selectSlot(slot)
    }
  }, [calendarState.selectedSlots, selectSlot, deselectSlot])

  const clearSelection = useCallback(() => {
    setCalendarState(prev => ({
      ...prev,
      selectedSlots: []
    }))
  }, [])

  const selectMultipleSlots = useCallback((slots: TimeSlot[]) => {
    const validSlots = slots.filter(slot => validateSlot(slot).isValid)
    
    if (maxSelectableSlots && validSlots.length > maxSelectableSlots) {
      logWarn(`Can only select ${maxSelectableSlots} slots, truncating selection`)
      validSlots.splice(maxSelectableSlots)
    }

    setCalendarState(prev => ({
      ...prev,
      selectedSlots: validSlots
    }))
  }, [validateSlot, maxSelectableSlots])

  // Filtering
  const setFilter = useCallback((criteria: Partial<CalendarFilterCriteria>) => {
    setCalendarState(prev => ({
      ...prev,
      filterCriteria: { ...prev.filterCriteria, ...criteria }
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setCalendarState(prev => ({
      ...prev,
      filterCriteria: {
        showAvailableOnly: false,
        showConflictsOnly: false
      }
    }))
  }, [])

  const getFilteredSlots = useCallback((slots: TimeSlot[]): TimeSlot[] => {
    const { filterCriteria } = calendarState

    return slots.filter(slot => {
      // Available only filter
      if (filterCriteria.showAvailableOnly && !slot.isAvailable) {
        return false
      }

      // Conflicts only filter
      if (filterCriteria.showConflictsOnly && !slot.conflictReason) {
        return false
      }

      // Minimum capacity filter
      if (filterCriteria.minCapacity && slot.maxCapacity < filterCriteria.minCapacity) {
        return false
      }

      // Time range filter
      if (filterCriteria.timeRange) {
        const slotStart = slot.startTime
        const slotEnd = slot.endTime
        const filterStart = filterCriteria.timeRange.start
        const filterEnd = filterCriteria.timeRange.end

        if (slotStart < filterStart || slotEnd > filterEnd) {
          return false
        }
      }

      // Weekdays filter
      if (filterCriteria.weekdays && filterCriteria.weekdays.length > 0) {
        const dayOfWeek = slot.date.getDay()
        if (!filterCriteria.weekdays.includes(dayOfWeek)) {
          return false
        }
      }

      return true
    })
  }, [calendarState])

  // Validation
  const validateSelection = useCallback((): CalendarValidation => {
    const { selectedSlots } = calendarState
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Check minimum selection
    if (selectedSlots.length < minSelectableSlots) {
      errors.push(`Please select at least ${minSelectableSlots} time slot${minSelectableSlots > 1 ? 's' : ''}`)
    }

    // Check maximum selection
    if (maxSelectableSlots && selectedSlots.length > maxSelectableSlots) {
      errors.push(`Cannot select more than ${maxSelectableSlots} time slots`)
    }

    // Calculate total hours
    const totalHours = selectedSlots.reduce((sum, slot) => {
      const start = new Date(`1970-01-01T${slot.startTime}:00`)
      const end = new Date(`1970-01-01T${slot.endTime}:00`)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0)

    // Check course requirements
    if (totalHours < courseRequirements.totalHours) {
      const remaining = courseRequirements.totalHours - totalHours
      warnings.push(`${remaining.toFixed(1)} hours remaining to meet course requirements`)
    }

    // Check for scheduling conflicts
    const dates = selectedSlots.map(slot => slot.date.toDateString())
    const uniqueDates = new Set(dates)
    if (dates.length !== uniqueDates.size) {
      warnings.push('Multiple slots selected for the same day')
    }

    // Provide optimization suggestions
    if (selectedSlots.length > 0) {
      const avgSessionLength = totalHours / selectedSlots.length
      const idealSessionLength = courseRequirements.sessionDuration / 60

      if (Math.abs(avgSessionLength - idealSessionLength) > 0.5) {
        suggestions.push(`Consider selecting slots closer to ${idealSessionLength} hours each for optimal learning`)
      }

      // Check distribution
      const weekDays = selectedSlots.map(slot => slot.date.getDay())
      const weekDistribution = weekDays.reduce((acc, day) => (acc[day] = (acc[day] || 0) + 1, acc), {} as Record<number, number>)
      
      if (Object.keys(weekDistribution).length < 2 && selectedSlots.length > 2) {
        suggestions.push('Consider spreading sessions across different days of the week')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    }
  }, [calendarState, minSelectableSlots, maxSelectableSlots, courseRequirements])

  // Performance metrics
  const getPerformanceMetrics = useCallback((allSlots: TimeSlot[]): CalendarPerformanceMetrics => {
    const availableSlots = allSlots.filter(slot => slot.isAvailable).length
    const conflictCount = allSlots.filter(slot => slot.conflictReason).length
    const selectedCount = calendarState.selectedSlots.length

    const totalSelectedHours = calendarState.selectedSlots.reduce((sum, slot) => {
      const start = new Date(`1970-01-01T${slot.startTime}:00`)
      const end = new Date(`1970-01-01T${slot.endTime}:00`)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0)

    const progress = Math.min((totalSelectedHours / courseRequirements.totalHours) * 100, 100)

    // Estimate completion date
    let estimatedCompletion: Date | null = null
    if (selectedCount > 0 && progress < 100) {
      const avgHoursPerSlot = totalSelectedHours / selectedCount
      const remainingHours = courseRequirements.totalHours - totalSelectedHours
      const remainingSlots = Math.ceil(remainingHours / avgHoursPerSlot)
      
      const lastSlotDate = Math.max(...calendarState.selectedSlots.map(slot => slot.date.getTime()))
      const estimatedDays = remainingSlots * 7 // Assume one slot per week
      
      estimatedCompletion = new Date(lastSlotDate + estimatedDays * 24 * 60 * 60 * 1000)
    }

    return {
      totalSlots: allSlots.length,
      availableSlots,
      selectedSlots: selectedCount,
      selectionProgress: progress,
      estimatedCompletion,
      conflictCount
    }
  }, [calendarState.selectedSlots, courseRequirements.totalHours])

  const calculateSelectionEfficiency = useCallback((): number => {
    if (calendarState.selectedSlots.length === 0) return 0

    const totalHours = calendarState.selectedSlots.reduce((sum, slot) => {
      const start = new Date(`1970-01-01T${slot.startTime}:00`)
      const end = new Date(`1970-01-01T${slot.endTime}:00`)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0)

    const efficiency = totalHours / (calendarState.selectedSlots.length * (courseRequirements.sessionDuration / 60))
    return Math.min(efficiency * 100, 100)
  }, [calendarState.selectedSlots, courseRequirements.sessionDuration])

  const getOptimizedSelectionSuggestions = useCallback((
    allSlots: TimeSlot[], 
    courseReq: CourseRequirements
  ): TimeSlot[] => {
    const availableSlots = allSlots.filter(slot => slot.isAvailable && !slot.conflictReason)
    const targetSessionHours = courseReq.sessionDuration / 60
    const sessionsNeeded = Math.ceil(courseReq.totalHours / targetSessionHours)

    // Filter slots that match target session duration
    const idealSlots = availableSlots.filter(slot => {
      const start = new Date(`1970-01-01T${slot.startTime}:00`)
      const end = new Date(`1970-01-01T${slot.endTime}:00`)
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      
      return Math.abs(hours - targetSessionHours) <= 0.5 // Within 30 minutes
    })

    // Sort by date and select evenly distributed slots
    const sortedSlots = idealSlots.sort((a, b) => a.date.getTime() - b.date.getTime())
    const suggestions: TimeSlot[] = []
    
    for (let i = 0; i < Math.min(sessionsNeeded, sortedSlots.length); i++) {
      const index = Math.floor((i * sortedSlots.length) / sessionsNeeded)
      suggestions.push(sortedSlots[index])
    }

    return suggestions
  }, [])

  // Utility functions
  const isSlotSelected = useCallback((slot: TimeSlot): boolean => {
    return calendarState.selectedSlots.some(s => 
      s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime()
    )
  }, [calendarState.selectedSlots])

  const getSlotSelectionIndex = useCallback((slot: TimeSlot): number => {
    return calendarState.selectedSlots.findIndex(s => 
      s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime()
    )
  }, [calendarState.selectedSlots])

  const getSelectedSlotsForDate = useCallback((date: Date): TimeSlot[] => {
    const targetDate = date.toDateString()
    return calendarState.selectedSlots.filter(slot => 
      slot.date.toDateString() === targetDate
    )
  }, [calendarState.selectedSlots])

  const getSelectionSummary = useCallback(() => {
    const { selectedSlots } = calendarState

    const totalHours = selectedSlots.reduce((sum, slot) => {
      const start = new Date(`1970-01-01T${slot.startTime}:00`)
      const end = new Date(`1970-01-01T${slot.endTime}:00`)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0)

    const averageSessionLength = selectedSlots.length > 0 ? totalHours / selectedSlots.length : 0

    const weeklyDistribution = selectedSlots.reduce((acc, slot) => {
      const dayName = slot.date.toLocaleDateString('pt-BR', { weekday: 'long' })
      acc[dayName] = (acc[dayName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const monthlyDistribution = selectedSlots.reduce((acc, slot) => {
      const monthName = slot.date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      acc[monthName] = (acc[monthName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalHours,
      averageSessionLength,
      weeklyDistribution,
      monthlyDistribution
    }
  }, [calendarState])

  return {
    calendarState,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    goToDate,
    setViewMode,
    selectSlot,
    deselectSlot,
    toggleSlot,
    clearSelection,
    selectMultipleSlots,
    setFilter,
    clearFilters,
    getFilteredSlots,
    validateSelection,
    validateSlot,
    canSelectSlot,
    getPerformanceMetrics,
    calculateSelectionEfficiency,
    getOptimizedSelectionSuggestions,
    isSlotSelected,
    getSlotSelectionIndex,
    getSelectedSlotsForDate,
    getSelectionSummary
  }
}