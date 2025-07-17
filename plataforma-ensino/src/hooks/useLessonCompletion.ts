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
      timeSpent: progressData.timeSpent || 0,
      pdfProgress: progressData.pdfProgress || 0,
      quizScore: progressData.quizScore || 0,
      exercisesCompleted: progressData.exercisesCompleted || 0,
      completionCriteria: [
        {
          type: 'time',
          isCompleted: (progressData.timeSpent || 0) >= 1500, // 25 minutes
          value: progressData.timeSpent || 0,
          required: 1500
        },
        {
          type: 'pdf',
          isCompleted: (progressData.pdfProgress || 0) >= 100,
          value: progressData.pdfProgress || 0,
          required: 100
        },
        {
          type: 'exercises',
          isCompleted: (progressData.exercisesCompleted || 0) >= 100,
          value: progressData.exercisesCompleted || 0,
          required: 100
        },
        {
          type: 'quiz',
          isCompleted: (progressData.quizScore || 0) >= 70,
          value: progressData.quizScore || 0,
          required: 70
        }
      ]
    }
  }, [progressData])

  // Validate completion criteria
  const validateCompletion = useCallback((): { isValid: boolean; errors: string[] } => {
    const data = prepareCompletionData()
    const errors: string[] = []

    // Check time requirement
    if ((data.timeSpent || 0) < 1500) {
      errors.push('Tempo mínimo de 25 minutos não atingido')
    }

    // Check PDF requirement
    if ((data.pdfProgress || 0) < 100) {
      errors.push('PDF não foi lido completamente')
    }

    // Check exercises requirement
    if ((data.exercisesCompleted || 0) < 100) {
      errors.push('Nem todos os exercícios foram completados')
    }

    // Check quiz requirement
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

      // Wait for celebration animation then navigate
      setTimeout(() => {
        router.push(`/course/${courseSlug}`)
      }, 3000) // 3 seconds for celebration

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
    
    // Validation
    validateCompletion,
    
    // Data
    completionData: prepareCompletionData()
  }
}