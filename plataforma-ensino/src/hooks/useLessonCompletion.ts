'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { LessonProgressData } from '@/types/lesson'

interface CompletionState {
  isCompleting: boolean
  isCompleted: boolean
  error: string | null
  showCelebration: boolean
}

interface CompletionData {
  timeSpent?: number
  quizScore?: number
  hasQuiz?: boolean
  completionCriteria?: any
}

interface UseLessonCompletionProps {
  lessonId: string
  courseSlug: string
  progressData: LessonProgressData | null
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Enhanced hook for managing lesson completion flow
 * 
 * Features:
 * - Comprehensive error handling with retry logic
 * - State management for completion flow
 * - Integration with existing API
 * - Celebration animations trigger
 * - Automatic navigation after completion
 */
export const useLessonCompletion = ({
  lessonId,
  courseSlug,
  progressData,
  onSuccess,
  onError
}: UseLessonCompletionProps) => {
  const router = useRouter()
  const [state, setState] = useState<CompletionState>({
    isCompleting: false,
    isCompleted: false,
    error: null,
    showCelebration: false
  })

  // SIMPLIFIED completion data - only send essential info
  const prepareCompletionData = useCallback((): CompletionData => {
    if (!progressData) {
      return { quizScore: 0, hasQuiz: false }
    }

    const quizScore = progressData.quizProgress?.score || 0
    const hasQuiz = progressData.quizProgress?.totalQuestions > 0
    const timeSpent = progressData.videoProgress?.watchTime || 0

    return {
      timeSpent,
      quizScore,
      hasQuiz,
      // Simple criteria for API
      completionCriteria: {
        hasQuiz,
        quizScore,
        passesValidation: hasQuiz ? quizScore >= 70 : true
      }
    }
  }, [progressData])

  // SIMPLIFIED validation - only check quiz score if quiz exists (NO LOGS TO PREVENT LOOPS)
  const validateCompletion = useCallback((): { isValid: boolean; errors: string[] } => {
    if (!progressData) {
      return { isValid: true, errors: [] } // Allow completion if no progress data
    }

    const errors: string[] = []
    const quizScore = progressData.quizProgress?.score || 0
    const hasQuiz = progressData.quizProgress?.totalQuestions > 0
    
    // ULTRA SIMPLE RULE:
    // - If lesson has quiz: require 70% score
    // - If lesson has no quiz: always allow completion
    if (hasQuiz && quizScore < 70) {
      errors.push('Complete o quiz com pelo menos 70% de acerto para concluir a aula')
    }

    // NO CONSOLE.LOG HERE - causes infinite loops!

    return {
      isValid: errors.length === 0,
      errors
    }
  }, [progressData])

  // Complete lesson with DETAILED LOGGING
  const completeLesson = useCallback(async (): Promise<void> => {
    logDebug('🚀 LESSON COMPLETION STARTED')
    logDebug('📝 Lesson ID:', lessonId)
    logDebug('📚 Course Slug:', courseSlug)
    logDebug('🔄 Current state:', state)
    
    // Prevent multiple simultaneous executions
    if (state.isCompleting) {
      logDebug('⚠️ Already completing lesson, ignoring duplicate call')
      return
    }

    logDebug('✅ Starting lesson completion process...')
    
    // Validate completion criteria first
    const validation = validateCompletion()
    logDebug('🔍 Validation result:', validation)
    
    if (!validation.isValid) {
      const error = new Error(`Critérios não atendidos: ${validation.errors.join(', ')}`)
      logDebug('❌ Validation failed:', validation.errors)
      setState(prev => ({ ...prev, error: error.message }))
      onError?.(error)
      return
    }

    logDebug('✅ Validation passed, setting completing state...')
    setState(prev => ({ 
      ...prev, 
      isCompleting: true, 
      error: null 
    }))

    try {
      const completionData = prepareCompletionData()
      logDebug('📦 Sending completion data:', JSON.stringify(completionData, null, 2))

      // Call the lesson completion API
      logDebug('📡 Calling API: /api/lessons/' + lessonId + '/complete')
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completionData)
      })

      logDebug('📊 API response status:', response.status)
      logDebug('📋 API response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        logDebug('❌ API error response:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      logDebug('✅ API success response:', JSON.stringify(result, null, 2))

      // Success - trigger celebration
      logDebug('🎉 Lesson completion successful, triggering celebration')
      setState(prev => ({ 
        ...prev, 
        isCompleting: false,
        isCompleted: true,
        showCelebration: true
      }))
      logDebug('🎊 State updated with showCelebration: true')

      // Call success callback
      if (onSuccess) {
        logDebug('📞 Calling onSuccess callback...')
        onSuccess()
        logDebug('✅ onSuccess callback executed')
      } else {
        logDebug('ℹ️ No onSuccess callback provided')
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      logDebug('💥 Lesson completion error:', errorMessage)
      logDebug('🔍 Full error object:', error)
      
      setState(prev => ({ 
        ...prev, 
        isCompleting: false,
        error: errorMessage
      }))

      // Call error callback
      if (onError) {
        logDebug('📞 Calling onError callback...')
        onError(error instanceof Error ? error : new Error(errorMessage))
      }
    }
  }, [lessonId, courseSlug, validateCompletion, prepareCompletionData, onSuccess, onError, state.isCompleting])

  // Retry completion
  const retryCompletion = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, error: null }))
    await completeLesson()
  }, [completeLesson])

  // Reset completion state
  const resetCompletion = useCallback((): void => {
    setState({
      isCompleting: false,
      isCompleted: false,
      error: null,
      showCelebration: false
    })
  }, [])

  // Dismiss error
  const dismissError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // NAVIGATION WITH DETAILED LOGGING
  const navigateToCourse = useCallback((): void => {
    logDebug('🧭 NAVIGATION TO COURSE STARTED')
    logDebug('📚 Target course slug:', courseSlug)
    logDebug('📍 Current location before navigation:', window.location.href)
    logDebug('🔗 Target URL will be:', `/course/${courseSlug}`)
    
    // Use direct window.location for most reliable navigation
    try {
      logDebug('🚀 Using window.location.href for immediate navigation...')
      const targetUrl = `/course/${courseSlug}`
      logDebug('🎯 Navigating to:', targetUrl)
      
      // Log before navigation
      logDebug('⏰ Navigation starting at:', new Date().toISOString())
      window.location.href = targetUrl
      
      // This code might not execute due to navigation
      logDebug('✅ window.location.href called successfully')
      
    } catch (error) {
      logError('💥 Course navigation failed:', error)
      logDebug('🔍 Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
      logDebug('🏠 Using dashboard fallback...')
      
      try {
        window.location.href = '/dashboard'
        logDebug('✅ Dashboard navigation called')
      } catch (fallbackError) {
        logError('💥 Dashboard navigation also failed:', fallbackError)
        logDebug('🆘 This should never happen - window.location.href failed')
      }
    }
  }, [courseSlug])

  return {
    // State
    isCompleting: state.isCompleting,
    isCompleted: state.isCompleted,
    error: state.error,
    showCelebration: state.showCelebration,
    
    // Actions
    completeLesson,
    retryCompletion,
    resetCompletion,
    dismissError,
    navigateToCourse,
    
    // Validation
    validateCompletion,
    
    // Data
    completionData: prepareCompletionData()
  }
}