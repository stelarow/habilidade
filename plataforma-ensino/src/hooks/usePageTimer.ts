'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface PageTimerState {
  timeSpent: number // in seconds
  isActive: boolean
  hasReachedMinimum: boolean
  minimumTimeMinutes: number
  percentage: number
  remainingTime: number
  formattedTime: string
  formattedRemainingTime: string
}

interface UsePageTimerOptions {
  minimumTimeMinutes?: number
  onMinimumReached?: () => void
  onTimeUpdate?: (timeSpent: number) => void
  storageKey?: string
  updateInterval?: number // in milliseconds
  lessonId?: string // for unique storage per lesson
}

/**
 * usePageTimer - Hook specifically for tracking 25-minute minimum time on lesson page
 * 
 * Features:
 * - Tracks active time on page (pauses when page is hidden)
 * - Persists time in localStorage with lesson-specific key
 * - Provides formatted time display
 * - Calculates progress percentage towards minimum time
 * - Calls callback when minimum time is reached
 * - Handles page visibility changes
 * 
 * Usage:
 * const { timeSpent, hasReachedMinimum, percentage, formattedTime } = usePageTimer({
 *   minimumTimeMinutes: 25,
 *   onMinimumReached: () => console.log('Minimum time reached!'),
 *   lessonId: 'lesson-123'
 * })
 */
export function usePageTimer({
  minimumTimeMinutes = 25,
  onMinimumReached,
  onTimeUpdate,
  storageKey = 'lesson-page-timer',
  updateInterval = 1000,
  lessonId = 'default'
}: UsePageTimerOptions = {}): PageTimerState & {
  resetTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
} {
  const [timeState, setTimeState] = useState<PageTimerState>({
    timeSpent: 0,
    isActive: true,
    hasReachedMinimum: false,
    minimumTimeMinutes,
    percentage: 0,
    remainingTime: minimumTimeMinutes * 60,
    formattedTime: '0:00',
    formattedRemainingTime: `${minimumTimeMinutes}:00`
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const accumulatedTimeRef = useRef<number>(0)
  const hasCalledMinimumRef = useRef<boolean>(false)
  const fullStorageKey = `${storageKey}-${lessonId}`

  // Format time helper
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  // Calculate state values
  const calculateStateValues = useCallback((timeSpent: number): Partial<PageTimerState> => {
    const minimumSeconds = minimumTimeMinutes * 60
    const hasReachedMinimum = timeSpent >= minimumSeconds
    const percentage = Math.min((timeSpent / minimumSeconds) * 100, 100)
    const remainingTime = Math.max(minimumSeconds - timeSpent, 0)

    return {
      timeSpent,
      hasReachedMinimum,
      percentage,
      remainingTime,
      formattedTime: formatTime(timeSpent),
      formattedRemainingTime: formatTime(remainingTime)
    }
  }, [minimumTimeMinutes, formatTime])

  // Load saved time from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(fullStorageKey)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        const savedTime = parsed.timeSpent || 0
        accumulatedTimeRef.current = savedTime
        
        const calculatedValues = calculateStateValues(savedTime)
        setTimeState(prev => ({
          ...prev,
          ...calculatedValues
        }))

        // Set hasCalledMinimumRef if minimum was already reached
        if (calculatedValues.hasReachedMinimum) {
          hasCalledMinimumRef.current = true
        }
      } catch (error) {
        console.error('Failed to parse saved timer data:', error)
      }
    }
  }, [fullStorageKey, calculateStateValues])

  // Save time to localStorage
  const saveTime = useCallback((timeSpent: number) => {
    const dataToSave = {
      timeSpent,
      lastSaved: Date.now(),
      minimumTimeMinutes,
      lessonId
    }
    localStorage.setItem(fullStorageKey, JSON.stringify(dataToSave))
  }, [fullStorageKey, minimumTimeMinutes, lessonId])

  // Update time spent
  const updateTimeSpent = useCallback(() => {
    if (!timeState.isActive) return

    const now = Date.now()
    const sessionTime = Math.floor((now - startTimeRef.current) / 1000)
    const totalTime = accumulatedTimeRef.current + sessionTime
    
    const calculatedValues = calculateStateValues(totalTime)
    
    setTimeState(prev => ({
      ...prev,
      ...calculatedValues
    }))

    // Call minimum reached callback only once
    if (calculatedValues.hasReachedMinimum && !hasCalledMinimumRef.current && onMinimumReached) {
      hasCalledMinimumRef.current = true
      onMinimumReached()
    }

    // Call time update callback
    if (onTimeUpdate) {
      onTimeUpdate(totalTime)
    }

    // Save every 30 seconds
    if (totalTime % 30 === 0) {
      saveTime(totalTime)
    }
  }, [timeState.isActive, calculateStateValues, onMinimumReached, onTimeUpdate, saveTime])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden
      
      if (isVisible && !timeState.isActive) {
        // Page became visible - resume tracking
        startTimeRef.current = Date.now()
        setTimeState(prev => ({ ...prev, isActive: true }))
      } else if (!isVisible && timeState.isActive) {
        // Page became hidden - pause and save
        const now = Date.now()
        const sessionTime = Math.floor((now - startTimeRef.current) / 1000)
        const totalTime = accumulatedTimeRef.current + sessionTime
        
        accumulatedTimeRef.current = totalTime
        saveTime(totalTime)
        setTimeState(prev => ({ ...prev, isActive: false }))
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [timeState.isActive, saveTime])

  // Start/stop interval based on active state
  useEffect(() => {
    if (timeState.isActive) {
      intervalRef.current = setInterval(updateTimeSpent, updateInterval)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timeState.isActive, updateTimeSpent, updateInterval])

  // Save on unmount
  useEffect(() => {
    return () => {
      if (timeState.isActive) {
        const now = Date.now()
        const sessionTime = Math.floor((now - startTimeRef.current) / 1000)
        const totalTime = accumulatedTimeRef.current + sessionTime
        saveTime(totalTime)
      }
    }
  }, [timeState.isActive, saveTime])

  // Reset timer
  const resetTimer = useCallback(() => {
    accumulatedTimeRef.current = 0
    startTimeRef.current = Date.now()
    hasCalledMinimumRef.current = false
    localStorage.removeItem(fullStorageKey)
    
    const calculatedValues = calculateStateValues(0)
    setTimeState(prev => ({
      ...prev,
      ...calculatedValues,
      isActive: true
    }))
  }, [fullStorageKey, calculateStateValues])

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (timeState.isActive) {
      const now = Date.now()
      const sessionTime = Math.floor((now - startTimeRef.current) / 1000)
      const totalTime = accumulatedTimeRef.current + sessionTime
      
      accumulatedTimeRef.current = totalTime
      saveTime(totalTime)
      setTimeState(prev => ({ ...prev, isActive: false }))
    }
  }, [timeState.isActive, saveTime])

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (!timeState.isActive) {
      startTimeRef.current = Date.now()
      setTimeState(prev => ({ ...prev, isActive: true }))
    }
  }, [timeState.isActive])

  return {
    ...timeState,
    resetTimer,
    pauseTimer,
    resumeTimer
  }
}