/**
 * Calendar Performance Optimization Hook
 * Story 3.1: Teacher Enrollment Integration - Task 4
 * 
 * Provides performance optimizations specifically for calendar rendering
 * including virtualization, lazy loading, and memoization strategies.
 */

'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
// Import useLessonPerformance hook with error handling
let useLessonPerformance: any
try {
  useLessonPerformance = require('./useLessonPerformance').useLessonPerformance
} catch (error) {
  // Fallback implementation if useLessonPerformance is not available
  useLessonPerformance = () => ({
    trackRender: () => {},
    trackInteraction: () => {},
    getMetrics: () => ({})
  })
}

interface CalendarPerformanceConfig {
  enableVirtualization?: boolean
  monthCacheSize?: number
  debounceMs?: number
  memoryThreshold?: number // MB
}

interface CalendarPerformanceMetrics {
  renderTime: number
  slotsRendered: number
  cachedMonths: number
  memoryUsage: number
  scrollPerformance: number
}

export function useCalendarPerformance(
  config: CalendarPerformanceConfig = {}
) {
  const {
    enableVirtualization = true,
    monthCacheSize = 3,
    debounceMs = 16, // 60fps
    memoryThreshold = 50 // 50MB
  } = config

  const performanceTracker = useLessonPerformance('ConditionalCalendar', {
    trackMemory: true,
    trackInteractions: true,
    reportThreshold: 100
  })

  const [metrics, setMetrics] = useState<CalendarPerformanceMetrics>({
    renderTime: 0,
    slotsRendered: 0,
    cachedMonths: 0,
    memoryUsage: 0,
    scrollPerformance: 0
  })

  // Month data cache for optimization
  const monthCache = useRef<Map<string, any>>(new Map())
  const virtualizedItems = useRef<Map<string, any>>(new Map())
  const scrollTracker = useRef<{ start: number; end: number }>({ start: 0, end: 0 })

  // Debounced slot selection for performance
  const debounceTimer = useRef<NodeJS.Timeout>()
  
  const debouncedSlotSelect = useCallback((
    callback: (slot: any) => void,
    slot: any
  ) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    debounceTimer.current = setTimeout(() => {
      const startTime = performance.now()
      callback(slot)
      
      setMetrics(prev => ({
        ...prev,
        renderTime: performance.now() - startTime
      }))
    }, debounceMs)
  }, [debounceMs])

  // Memory usage monitoring
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory
      const usedMB = memInfo.usedJSHeapSize / 1024 / 1024
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage: usedMB
      }))

      // Clear cache if memory usage is high
      if (usedMB > memoryThreshold) {
        monthCache.current.clear()
        virtualizedItems.current.clear()
      }
    }
  }, [memoryThreshold])

  // Month data caching
  const getCachedMonth = useCallback((monthKey: string) => {
    return monthCache.current.get(monthKey)
  }, [])

  const setCachedMonth = useCallback((monthKey: string, data: any) => {
    // Implement LRU cache
    if (monthCache.current.size >= monthCacheSize) {
      const firstKey = monthCache.current.keys().next().value
      monthCache.current.delete(firstKey)
    }
    
    monthCache.current.set(monthKey, data)
    
    setMetrics(prev => ({
      ...prev,
      cachedMonths: monthCache.current.size
    }))
  }, [monthCacheSize])

  // Virtualization helpers
  const getVisibleRange = useCallback((
    containerHeight: number,
    itemHeight: number,
    scrollTop: number
  ) => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + 1,
      Math.floor(scrollTop / itemHeight) + 10 // Buffer
    )
    
    scrollTracker.current = { start, end }
    return { start, end }
  }, [])

  // Virtual scroll optimization
  const virtualizeSlots = useCallback((
    slots: any[],
    visibleRange: { start: number; end: number }
  ) => {
    if (!enableVirtualization) return slots

    const startTime = performance.now()
    const visibleSlots = slots.slice(visibleRange.start, visibleRange.end)
    
    setMetrics(prev => ({
      ...prev,
      scrollPerformance: performance.now() - startTime,
      slotsRendered: visibleSlots.length
    }))

    return visibleSlots
  }, [enableVirtualization])

  // Optimized slot rendering with memoization
  const optimizeSlotRendering = useMemo(() => ({
    shouldRender: (slotIndex: number) => {
      if (!enableVirtualization) return true
      
      const { start, end } = scrollTracker.current
      return slotIndex >= start && slotIndex <= end
    },
    
    getSlotKey: (slot: any, index: number) => {
      return `${slot.date}-${slot.startTime}-${index}`
    },
    
    memoizeSlot: (slotKey: string, slotComponent: React.ReactNode) => {
      virtualizedItems.current.set(slotKey, slotComponent)
    }
  }), [enableVirtualization])

  // Performance monitoring effects
  useEffect(() => {
    const interval = setInterval(checkMemoryUsage, 5000) // Check every 5s
    return () => clearInterval(interval)
  }, [checkMemoryUsage])

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  // Cleanup cache on unmount
  useEffect(() => {
    return () => {
      monthCache.current.clear()
      virtualizedItems.current.clear()
    }
  }, [])

  return {
    metrics,
    debouncedSlotSelect,
    getCachedMonth,
    setCachedMonth,
    getVisibleRange,
    virtualizeSlots,
    optimizeSlotRendering,
    performanceTracker
  }
}

export type { CalendarPerformanceConfig, CalendarPerformanceMetrics }