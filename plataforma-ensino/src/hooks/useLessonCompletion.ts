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
  pdfProgress?: number
  quizScore?: number
  exercisesCompleted?: number
  completionCriteria?: any[]
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

    return {
      pdfProgress: progressData.pdfProgress?.percentageRead || 0,
      quizScore: progressData.quizProgress?.score || 0,
      exercisesCompleted: progressData.exerciseProgress?.completionPercentage || 0,
      completionCriteria: [
        {
          type: 'pdf',
          isCompleted: (progressData.pdfProgress?.percentageRead || 0) >= 75,
          value: progressData.pdfProgress?.percentageRead || 0,
          required: 75
        },
        {
          type: 'exercises',
          isCompleted: (progressData.exerciseProgress?.completionPercentage || 0) >= 100,
          value: progressData.exerciseProgress?.completionPercentage || 0,
          required: 100
        },
        {
          type: 'quiz',
          isCompleted: (progressData.quizProgress?.score || 0) >= 70,
          value: progressData.quizProgress?.score || 0,
          required: 70
        }
      ]
    }
  }, [progressData])

  // Validate completion criteria
  const validateCompletion = useCallback((): { isValid: boolean; errors: string[] } => {
    const data = prepareCompletionData()
    const errors: string[] = []

    // Check PDF requirement (75% minimum)
    if ((data.pdfProgress || 0) < 75) {
      errors.push('PDF deve ser lido pelo menos 75%')
    }

    // Check exercises requirement (100% completion)
    if ((data.exercisesCompleted || 0) < 100) {
      errors.push('Todos os exercícios devem ser completados (100%)')
    }

    // Check quiz requirement (70% minimum score)
    if ((data.quizScore || 0) < 70) {
      errors.push('Nota do quiz deve ser pelo menos 70%')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }, [prepareCompletionData])

  // Complete lesson with comprehensive error handling
  const completeLesson = useCallback(async (): Promise<void> => {
    // Validate completion criteria first
    const validation = validateCompletion()
    if (!validation.isValid) {
      const error = new Error(`Critérios não atendidos: ${validation.errors.join(', ')}`)
      setState(prev => ({ ...prev, error: error.message }))
      onError?.(error)
      return
    }

    setState(prev => ({ 
      ...prev, 
      isCompleting: true, 
      error: null 
    }))

    try {
      const completionData = prepareCompletionData()

      // Call the lesson completion API
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completionData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      // Success - trigger celebration
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
    router.push(`/course/${courseSlug}`)
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