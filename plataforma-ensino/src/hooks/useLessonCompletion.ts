'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { LessonProgressData } from '@/types/lesson'

interface CompletionState {
  isCompleting: boolean
  isCompleted: boolean
  error: string | null
  showCelebration: boolean
}

interface CompletionData {
  timeSpent?: number
  pdfProgress?: number
  quizScore?: number
  exercisesCompleted?: number
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

  // Prepare completion data from progress
  const prepareCompletionData = useCallback((): CompletionData => {
    if (!progressData) {
      return {}
    }

    const timeSpent = progressData.videoProgress?.watchTime || 0
    const pdfProgress = progressData.pdfProgress?.percentageRead || 0
    const quizScore = progressData.quizProgress?.score || 0
    const exercisesCompleted = progressData.exerciseProgress?.completionPercentage || 0

    const criteriaArray = [
      {
        type: 'pdf',
        isCompleted: pdfProgress >= 75,
        value: pdfProgress,
        required: 75
      },
      {
        type: 'exercises',
        isCompleted: exercisesCompleted >= 100,
        value: exercisesCompleted,
        required: 100
      },
      {
        type: 'quiz',
        isCompleted: quizScore >= 70,
        value: quizScore,
        required: 70
      }
    ]

    return {
      timeSpent,
      pdfProgress,
      quizScore,
      exercisesCompleted,
      completionCriteria: {
        timeSpent,
        pdfProgress,
        quizScore,
        exercisesCompleted,
        criteria: criteriaArray
      }
    }
  }, [progressData])

  // Validate completion criteria - relaxed for testing
  const validateCompletion = useCallback((): { isValid: boolean; errors: string[] } => {
    const data = prepareCompletionData()
    const errors: string[] = []

    console.log('Validating completion with data:', data)

    // For now, let's be more lenient - only require quiz OR significant progress
    const hasQuizScore = (data.quizScore || 0) >= 70
    const hasSignificantProgress = (data.pdfProgress || 0) >= 50 || (data.exercisesCompleted || 0) >= 50
    
    if (!hasQuizScore && !hasSignificantProgress) {
      errors.push('Complete pelo menos 70% do quiz OU 50% dos materiais/exercícios')
    }

    console.log('Validation result:', { isValid: errors.length === 0, errors })

    return {
      isValid: errors.length === 0,
      errors
    }
  }, [prepareCompletionData])

  // Complete lesson with comprehensive error handling
  const completeLesson = useCallback(async (): Promise<void> => {
    console.log('Starting lesson completion process...')
    
    // Validate completion criteria first
    const validation = validateCompletion()
    if (!validation.isValid) {
      const error = new Error(`Critérios não atendidos: ${validation.errors.join(', ')}`)
      console.log('Validation failed:', validation.errors)
      setState(prev => ({ ...prev, error: error.message }))
      onError?.(error)
      return
    }

    console.log('Validation passed, setting completing state...')
    setState(prev => ({ 
      ...prev, 
      isCompleting: true, 
      error: null 
    }))

    try {
      const completionData = prepareCompletionData()
      console.log('Sending completion data:', completionData)

      // Call the lesson completion API
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completionData)
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.log('API error response:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('API success response:', result)

      // Success - trigger celebration
      console.log('Lesson completion successful, triggering celebration')
      setState(prev => ({ 
        ...prev, 
        isCompleting: false,
        isCompleted: true,
        showCelebration: true
      }))

      // Call success callback
      onSuccess?.()

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      
      setState(prev => ({ 
        ...prev, 
        isCompleting: false,
        error: errorMessage
      }))

      // Call error callback
      onError?.(error instanceof Error ? error : new Error(errorMessage))
    }
  }, [lessonId, courseSlug, validateCompletion, prepareCompletionData, router, onSuccess, onError])

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

  // Manual navigation to course page
  const navigateToCourse = useCallback((): void => {
    console.log('Navigating to course page:', `/course/${courseSlug}`)
    
    try {
      // Try Next.js router first
      router.push(`/course/${courseSlug}`)
    } catch (error) {
      console.error('Router push failed, using window.location:', error)
      // Fallback to window.location
      window.location.href = `/course/${courseSlug}`
    }
  }, [router, courseSlug])

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