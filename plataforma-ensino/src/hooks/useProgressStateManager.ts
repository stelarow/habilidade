'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { LessonProgressData, ProgressEvent } from '@/types/lesson'
import { useEnhancedProgressCalculation } from './useEnhancedProgressCalculation'
import type { EnhancedProgressData } from './useEnhancedProgressCalculation'

interface ProgressStateManagerConfig {
  autosaveInterval: number
  smoothTransitions: boolean
  enableAnimations: boolean
  celebrationDuration: number
}

const DEFAULT_CONFIG: ProgressStateManagerConfig = {
  autosaveInterval: 30000, // 30 seconds
  smoothTransitions: true,
  enableAnimations: true,
  celebrationDuration: 3000 // 3 seconds
}

interface ProgressStateManager {
  // Current progress data
  progressData: LessonProgressData | null
  enhancedProgress: EnhancedProgressData
  
  // State management
  isLoading: boolean
  isSaving: boolean
  error: string | null
  
  // Animation states
  isAnimating: boolean
  showCelebration: boolean
  
  // Actions
  updateVideoProgress: (currentTime: number, duration: number) => void
  updatePDFProgress: (currentPage: number, totalPages: number) => void
  updateQuizProgress: (score: number, isCompleted: boolean, isPassed: boolean) => void
  updateExerciseProgress: (completedExercises: string[], totalExercises: number) => void
  markCriterionComplete: (criterion: 'time' | 'pdf' | 'exercises' | 'quiz') => void
  saveProgress: () => Promise<void>
  resetProgress: () => void
  
  // Event tracking
  trackEvent: (event: ProgressEvent) => void
  getProgressHistory: () => ProgressEvent[]
}

/**
 * Enhanced progress state manager hook
 * Provides comprehensive progress state management with smooth updates and animations
 */
export function useProgressStateManager(
  initialProgress: LessonProgressData | null = null,
  config: Partial<ProgressStateManagerConfig> = {}
): ProgressStateManager {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Core state
  const [progressData, setProgressData] = useState<LessonProgressData | null>(initialProgress)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Animation states
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  
  // Event tracking
  const [progressHistory, setProgressHistory] = useState<ProgressEvent[]>([])
  
  // Refs for managing intervals and timeouts
  const autosaveIntervalRef = useRef<NodeJS.Timeout>()
  const animationTimeoutRef = useRef<NodeJS.Timeout>()
  const celebrationTimeoutRef = useRef<NodeJS.Timeout>()
  
  // Enhanced progress calculation
  const enhancedProgress = useEnhancedProgressCalculation(progressData)
  
  // Initialize default progress data if none provided
  const initializeProgressData = useCallback((): LessonProgressData => ({
    videoProgress: {
      currentTime: 0,
      duration: 0,
      percentageWatched: 0,
      watchTime: 0,
      lastPosition: 0,
      playbackRate: 1,
      completedSegments: []
    },
    pdfProgress: {
      currentPage: 0,
      totalPages: 0,
      percentageRead: 0,
      bookmarks: [],
      readingTime: 0,
      lastPageViewed: 0
    },
    quizProgress: {
      currentQuestion: 0,
      totalQuestions: 0,
      answeredQuestions: [],
      score: 0,
      attempts: 0,
      timeSpent: 0,
      isCompleted: false,
      isPassed: false
    },
    exerciseProgress: {
      completedExercises: [],
      submittedFiles: [],
      pendingReviews: [],
      totalExercises: 0,
      completionPercentage: 0
    },
    contentProgress: {
      scrollPercentage: 0,
      readingTime: 0,
      sectionsRead: [],
      estimatedCompletionTime: 0
    },
    overallProgress: {
      percentageComplete: 0,
      estimatedTimeRemaining: 0,
      lastActivity: new Date().toISOString(),
      isCompleted: false,
      completedAt: undefined,
      componentProgress: []
    }
  }), [])
  
  // Initialize progress data if not provided
  useEffect(() => {
    if (!progressData) {
      setProgressData(initializeProgressData())
    }
  }, [progressData, initializeProgressData])
  
  // Handle celebration animation
  useEffect(() => {
    if (enhancedProgress.visualStates.showCelebration && !showCelebration) {
      setShowCelebration(true)
      setIsAnimating(true)
      
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current)
      }
      
      celebrationTimeoutRef.current = setTimeout(() => {
        setShowCelebration(false)
        setIsAnimating(false)
      }, finalConfig.celebrationDuration)
    }
  }, [enhancedProgress.visualStates.showCelebration, showCelebration, finalConfig.celebrationDuration])
  
  // Track progress events
  const trackEvent = useCallback((event: ProgressEvent) => {
    setProgressHistory(prev => [...prev, event])
  }, [])

  // Smooth animation trigger
  const triggerAnimation = useCallback(() => {
    if (!finalConfig.enableAnimations) return
    
    setIsAnimating(true)
    
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 800)
  }, [finalConfig.enableAnimations])
  
  // Update video progress
  const updateVideoProgress = useCallback((currentTime: number, duration: number) => {
    if (!progressData) return
    
    const percentageWatched = duration > 0 ? (currentTime / duration) * 100 : 0
    const watchTime = Math.max(progressData.videoProgress.watchTime, currentTime)
    
    setProgressData(prev => prev ? {
      ...prev,
      videoProgress: {
        ...prev.videoProgress,
        currentTime,
        duration,
        percentageWatched,
        watchTime,
        lastPosition: currentTime
      },
      overallProgress: {
        ...prev.overallProgress,
        lastActivity: new Date().toISOString()
      }
    } : null)
    
    triggerAnimation()
    trackEvent({
      type: 'video_play',
      data: { currentTime, playbackRate: progressData.videoProgress.playbackRate }
    })
  }, [progressData, triggerAnimation, trackEvent])
  
  // Update PDF progress
  const updatePDFProgress = useCallback((currentPage: number, totalPages: number) => {
    if (!progressData) return
    
    const percentageRead = totalPages > 0 ? (currentPage / totalPages) * 100 : 0
    
    setProgressData(prev => prev ? {
      ...prev,
      pdfProgress: {
        ...prev.pdfProgress,
        currentPage,
        totalPages,
        percentageRead,
        lastPageViewed: currentPage
      },
      overallProgress: {
        ...prev.overallProgress,
        lastActivity: new Date().toISOString()
      }
    } : null)
    
    triggerAnimation()
    trackEvent({
      type: 'pdf_page_change',
      data: { from: progressData.pdfProgress.currentPage, to: currentPage, timeSpent: 0 }
    })
  }, [progressData, triggerAnimation, trackEvent])
  
  // Update quiz progress
  const updateQuizProgress = useCallback((score: number, isCompleted: boolean, isPassed: boolean) => {
    if (!progressData) return
    
    setProgressData(prev => prev ? {
      ...prev,
      quizProgress: {
        ...prev.quizProgress,
        score,
        isCompleted,
        isPassed,
        attempts: prev.quizProgress.attempts + (isCompleted ? 1 : 0)
      },
      overallProgress: {
        ...prev.overallProgress,
        lastActivity: new Date().toISOString()
      }
    } : null)
    
    triggerAnimation()
    trackEvent({
      type: 'quiz_answer',
      data: { questionId: 'quiz-complete', answer: score, timeSpent: 0 }
    })
  }, [progressData, triggerAnimation, trackEvent])
  
  // Update exercise progress
  const updateExerciseProgress = useCallback((completedExercises: string[], totalExercises: number) => {
    if (!progressData) return
    
    const completionPercentage = totalExercises > 0 ? (completedExercises.length / totalExercises) * 100 : 0
    
    setProgressData(prev => prev ? {
      ...prev,
      exerciseProgress: {
        ...prev.exerciseProgress,
        completedExercises,
        totalExercises,
        completionPercentage
      },
      overallProgress: {
        ...prev.overallProgress,
        lastActivity: new Date().toISOString()
      }
    } : null)
    
    triggerAnimation()
  }, [progressData, triggerAnimation])
  
  // Mark specific criterion as complete
  const markCriterionComplete = useCallback((criterion: 'time' | 'pdf' | 'exercises' | 'quiz') => {
    if (!progressData) return
    
    setProgressData(prev => {
      if (!prev) return null
      
      const updated = { ...prev }
      
      switch (criterion) {
        case 'time':
          updated.videoProgress.watchTime = Math.max(25 * 60, updated.videoProgress.watchTime) // 25 minutes minimum
          break
        case 'pdf':
          updated.pdfProgress.percentageRead = 100
          break
        case 'exercises':
          updated.exerciseProgress.completionPercentage = 100
          break
        case 'quiz':
          updated.quizProgress.score = Math.max(70, updated.quizProgress.score) // 70% minimum
          updated.quizProgress.isCompleted = true
          updated.quizProgress.isPassed = true
          break
      }
      
      updated.overallProgress.lastActivity = new Date().toISOString()
      return updated
    })
    
    triggerAnimation()
  }, [progressData, triggerAnimation])
  
  // Save progress (mock implementation)
  const saveProgress = useCallback(async () => {
    if (!progressData) return
    
    setIsSaving(true)
    setError(null)
    
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Progress saved:', progressData)
    } catch (err) {
      setError('Failed to save progress')
      console.error('Save progress error:', err)
    } finally {
      setIsSaving(false)
    }
  }, [progressData])
  
  // Reset progress
  const resetProgress = useCallback(() => {
    setProgressData(initializeProgressData())
    setProgressHistory([])
    setError(null)
    setShowCelebration(false)
    setIsAnimating(false)
  }, [initializeProgressData])
  
  // Get progress history
  const getProgressHistory = useCallback(() => progressHistory, [progressHistory])
  
  // Auto-save setup
  useEffect(() => {
    if (finalConfig.autosaveInterval > 0 && progressData) {
      autosaveIntervalRef.current = setInterval(() => {
        saveProgress()
      }, finalConfig.autosaveInterval)
      
      return () => {
        if (autosaveIntervalRef.current) {
          clearInterval(autosaveIntervalRef.current)
        }
      }
    }
    return undefined
  }, [finalConfig.autosaveInterval, progressData, saveProgress])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autosaveIntervalRef.current) clearInterval(autosaveIntervalRef.current)
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current)
      if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current)
    }
  }, [])
  
  return {
    progressData,
    enhancedProgress,
    isLoading,
    isSaving,
    error,
    isAnimating,
    showCelebration,
    updateVideoProgress,
    updatePDFProgress,
    updateQuizProgress,
    updateExerciseProgress,
    markCriterionComplete,
    saveProgress,
    resetProgress,
    trackEvent,
    getProgressHistory
  }
}