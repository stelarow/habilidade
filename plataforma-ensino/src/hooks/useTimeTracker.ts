'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface TimeTrackerState {
  timeSpent: number // in seconds
  isActive: boolean
  hasReachedMinimum: boolean
  minimumTimeMinutes: number
}

interface UseTimeTrackerOptions {
  minimumTimeMinutes?: number
  onMinimumReached?: () => void
  onTimeUpdate?: (timeSpent: number) => void
  storageKey?: string
  updateInterval?: number // in milliseconds
}

/**
 * useTimeTracker - Hook for tracking time spent on lesson page
 * 
 * Features:
 * - Tracks time from page entry
 * - Persists time in localStorage
 * - Pauses when page is not visible
 * - Calls callbacks for minimum time reached
 * - Returns formatted time and progress
 */
export function useTimeTracker({
  minimumTimeMinutes = 25,
  onMinimumReached,
  onTimeUpdate,
  storageKey = 'lesson-time-tracker',
  updateInterval = 1000
}: UseTimeTrackerOptions = {}) {
  const [timeState, setTimeState] = useState<TimeTrackerState>({
    timeSpent: 0,
    isActive: true,
    hasReachedMinimum: false,
    minimumTimeMinutes
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const accumulatedTimeRef = useRef<number>(0)
  const hasCalledMinimumRef = useRef<boolean>(false)

  // Load saved time from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(storageKey)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        accumulatedTimeRef.current = parsed.timeSpent || 0
        setTimeState(prev => ({
          ...prev,
          timeSpent: accumulatedTimeRef.current,
          hasReachedMinimum: accumulatedTimeRef.current >= minimumTimeMinutes * 60
        }))
      } catch (error) {
        console.error('Failed to parse saved time data:', error)
      }
    }
  }, [storageKey, minimumTimeMinutes])

  // Save time to localStorage
  const saveTime = useCallback((timeSpent: number) => {
    const dataToSave = {
      timeSpent,
      lastSaved: Date.now(),
      minimumTimeMinutes
    }
    localStorage.setItem(storageKey, JSON.stringify(dataToSave))
  }, [storageKey, minimumTimeMinutes])

  // Update time spent
  const updateTimeSpent = useCallback(() => {
    if (!timeState.isActive) return

    const now = Date.now()
    const sessionTime = Math.floor((now - startTimeRef.current) / 1000)
    const totalTime = accumulatedTimeRef.current + sessionTime
    
    setTimeState(prev => {
      const newHasReachedMinimum = totalTime >= minimumTimeMinutes * 60
      
      // Call minimum reached callback only once
      if (newHasReachedMinimum && !hasCalledMinimumRef.current && onMinimumReached) {
        hasCalledMinimumRef.current = true
        onMinimumReached()
      }

      return {
        ...prev,
        timeSpent: totalTime,
        hasReachedMinimum: newHasReachedMinimum
      }
    })

    // Call time update callback
    if (onTimeUpdate) {
      onTimeUpdate(totalTime)
    }

    // Save every 30 seconds
    if (totalTime % 30 === 0) {
      saveTime(totalTime)
    }
  }, [timeState.isActive, minimumTimeMinutes, onMinimumReached, onTimeUpdate, saveTime])

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

  // Helper functions
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = (): number => {
    const minimumSeconds = minimumTimeMinutes * 60
    return Math.min((timeState.timeSpent / minimumSeconds) * 100, 100)
  }

  const getRemainingTime = (): number => {
    const minimumSeconds = minimumTimeMinutes * 60
    return Math.max(minimumSeconds - timeState.timeSpent, 0)
  }

  const resetTimer = useCallback(() => {
    accumulatedTimeRef.current = 0
    startTimeRef.current = Date.now()
    hasCalledMinimumRef.current = false
    localStorage.removeItem(storageKey)
    
    setTimeState({
      timeSpent: 0,
      isActive: true,
      hasReachedMinimum: false,
      minimumTimeMinutes
    })
  }, [storageKey, minimumTimeMinutes])

  return {
    // State
    timeSpent: timeState.timeSpent,
    isActive: timeState.isActive,
    hasReachedMinimum: timeState.hasReachedMinimum,
    
    // Computed values
    formattedTime: formatTime(timeState.timeSpent),
    progressPercentage: getProgressPercentage(),
    remainingTime: getRemainingTime(),
    formattedRemainingTime: formatTime(getRemainingTime()),
    
    // Actions
    resetTimer
  }
}