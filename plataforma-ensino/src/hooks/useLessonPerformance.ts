'use client'

import { useEffect, useRef, useState } from 'react'

interface PerformanceMetrics {
  renderTime: number
  interactionTime: number
  memoryUsage?: number
  componentMounts: number
  errorCount: number
}

interface PerformanceConfig {
  trackMemory?: boolean
  trackInteractions?: boolean
  reportThreshold?: number // milliseconds
}

export function useLessonPerformance(
  componentName: string,
  config: PerformanceConfig = {}
) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    interactionTime: 0,
    componentMounts: 0,
    errorCount: 0
  })

  const startTime = useRef<number>(Date.now())
  const interactionStart = useRef<number | null>(null)
  const mountCount = useRef<number>(0)

  // Track component mount/unmount
  useEffect(() => {
    mountCount.current += 1
    const mountTime = Date.now()
    const renderTime = mountTime - startTime.current

    setMetrics(prev => ({
      ...prev,
      renderTime,
      componentMounts: mountCount.current
    }))

    // Report performance if threshold exceeded
    if (config.reportThreshold && renderTime > config.reportThreshold) {
      console.warn(`${componentName} slow render: ${renderTime}ms`)
    }

    return () => {
      // Cleanup on unmount
      if (config.trackMemory && 'memory' in performance) {
        const memInfo = (performance as any).memory
        console.log(`${componentName} memory usage:`, {
          used: memInfo.usedJSHeapSize,
          total: memInfo.totalJSHeapSize,
          limit: memInfo.jsHeapSizeLimit
        })
      }
    }
  }, [componentName, config.reportThreshold, config.trackMemory])

  // Track memory usage
  useEffect(() => {
    if (!config.trackMemory || !('memory' in performance)) return

    const interval = setInterval(() => {
      const memInfo = (performance as any).memory
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memInfo.usedJSHeapSize
      }))
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [config.trackMemory])

  // Interaction tracking functions
  const startInteraction = () => {
    if (config.trackInteractions) {
      interactionStart.current = Date.now()
    }
  }

  const endInteraction = (interactionType?: string) => {
    if (config.trackInteractions && interactionStart.current) {
      const interactionTime = Date.now() - interactionStart.current
      setMetrics(prev => ({
        ...prev,
        interactionTime: Math.max(prev.interactionTime, interactionTime)
      }))

      if (interactionType && interactionTime > 100) {
        console.log(`${componentName} ${interactionType} interaction: ${interactionTime}ms`)
      }

      interactionStart.current = null
    }
  }

  // Error tracking
  const trackError = (error: Error, context?: string) => {
    setMetrics(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1
    }))

    console.error(`${componentName} error${context ? ` (${context})` : ''}:`, error)
  }

  // Performance report
  const getPerformanceReport = () => ({
    component: componentName,
    metrics,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  })

  return {
    metrics,
    startInteraction,
    endInteraction,
    trackError,
    getPerformanceReport
  }
}

// Hook for tracking specific lesson interactions
export function useLessonInteractionTracking() {
  const performance = useLessonPerformance('LessonPage', {
    trackInteractions: true,
    trackMemory: true,
    reportThreshold: 1000 // 1 second
  })

  const trackVideoInteraction = (action: 'play' | 'pause' | 'seek') => {
    performance.startInteraction()
    return () => performance.endInteraction(`video-${action}`)
  }

  const trackQuizInteraction = (action: 'answer' | 'submit') => {
    performance.startInteraction()
    return () => performance.endInteraction(`quiz-${action}`)
  }

  const trackFileUpload = () => {
    performance.startInteraction()
    return () => performance.endInteraction('file-upload')
  }

  const trackCompletion = () => {
    performance.startInteraction()
    return () => performance.endInteraction('lesson-completion')
  }

  return {
    ...performance,
    trackVideoInteraction,
    trackQuizInteraction,
    trackFileUpload,
    trackCompletion
  }
}