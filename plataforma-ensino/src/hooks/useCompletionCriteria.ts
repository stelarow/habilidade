'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { LessonProgressData } from '@/types/lesson'
import { usePageTimer } from './usePageTimer'
import { usePDFProgress } from './usePDFProgress'
import { getCompletionIcon } from '@/utils/completionIcons'

export interface CompletionCriterion {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  isCompleted: boolean
  progress: number
  weight: number
  color: string
}

interface CompletionCriteriaState {
  criteria: CompletionCriterion[]
  overallProgress: number
  canComplete: boolean
  completedCount: number
  totalCount: number
}

interface UseCompletionCriteriaOptions {
  minimumTimeMinutes?: number
  minimumQuizScore?: number
  requireAllExercises?: boolean
  requireFullPDFRead?: boolean
  lessonId?: string
  pdfTotalPages?: number
  onCriteriaUpdated?: (state: CompletionCriteriaState) => void
  onCompletionReady?: () => void
}

/**
 * useCompletionCriteria - Hook for managing lesson completion criteria
 * 
 * Manages the four completion requirements:
 * 1. Time spent (25 minutes minimum) - página deve estar aberta por 25 min
 * 2. Quiz score (70% minimum) - nota mínima de 70% no quiz
 * 3. Exercises completion (100%) - todos os exercícios devem ser concluídos
 * 4. PDF reading (100%) - 100% do material PDF deve ser lido
 * 
 * Note: Video progress is NOT included in completion criteria
 */
export function useCompletionCriteria({
  minimumTimeMinutes = 25,
  minimumQuizScore = 70,
  requireAllExercises = true,
  requireFullPDFRead = true,
  lessonId = 'default',
  pdfTotalPages = 1,
  onCriteriaUpdated,
  onCompletionReady
}: UseCompletionCriteriaOptions = {}) {
  
  const [progressData, setProgressData] = useState<LessonProgressData | null>(null)
  
  // Use the new hooks
  const pageTimer = usePageTimer({
    minimumTimeMinutes,
    lessonId,
    onMinimumReached: () => {
      console.log('Minimum time reached!')
    }
  })
  
  const pdfProgress = usePDFProgress({
    totalPages: pdfTotalPages,
    lessonId,
    onFullyRead: () => {
      console.log('PDF fully read!')
    }
  })

  // Calculate criteria based on current progress
  const criteriaState = useMemo((): CompletionCriteriaState => {
    const criteria: CompletionCriterion[] = [
      {
        id: 'time',
        name: 'Tempo na Aula',
        icon: getCompletionIcon('time', pageTimer.hasReachedMinimum ? '#22c55e' : '#f59e0b'),
        description: `Permanecer pelo menos ${minimumTimeMinutes} minutos na aula`,
        isCompleted: pageTimer.hasReachedMinimum,
        progress: pageTimer.percentage,
        weight: 25,
        color: pageTimer.hasReachedMinimum ? '#22c55e' : '#f59e0b'
      },
      {
        id: 'quiz',
        name: 'Quiz',
        icon: getCompletionIcon('quiz', progressData?.quizProgress.isPassed ? '#22c55e' : '#ef4444'),
        description: `Obter pelo menos ${minimumQuizScore}% de acerto no quiz`,
        isCompleted: progressData 
          ? progressData.quizProgress.isPassed && progressData.quizProgress.score >= minimumQuizScore
          : false,
        progress: progressData?.quizProgress.score || 0,
        weight: 35,
        color: progressData?.quizProgress.isPassed ? '#22c55e' : '#ef4444'
      },
      {
        id: 'exercises',
        name: 'Exercícios',
        icon: getCompletionIcon('exercises', (progressData?.exerciseProgress.completionPercentage || 0) >= (requireAllExercises ? 100 : 80) ? '#22c55e' : '#f59e0b'),
        description: requireAllExercises ? 'Completar todos os exercícios' : 'Completar a maioria dos exercícios',
        isCompleted: progressData 
          ? (progressData.exerciseProgress?.completionPercentage || 0) >= (requireAllExercises ? 100 : 80)
          : false,
        progress: progressData?.exerciseProgress.completionPercentage || 0,
        weight: 25,
        color: (progressData?.exerciseProgress.completionPercentage || 0) >= (requireAllExercises ? 100 : 80) 
          ? '#22c55e' : '#f59e0b'
      },
      {
        id: 'pdf',
        name: 'Material PDF',
        icon: getCompletionIcon('pdf', pdfProgress.isCompleted ? '#22c55e' : '#00c4ff'),
        description: requireFullPDFRead ? 'Ler 100% do material PDF' : 'Ler pelo menos 90% do material PDF',
        isCompleted: pdfProgress.isCompleted,
        progress: pdfProgress.percentageRead,
        weight: 15,
        color: pdfProgress.isCompleted ? '#22c55e' : '#00c4ff'
      }
    ]

    const completedCount = criteria.filter(c => c.isCompleted).length
    const totalCount = criteria.length
    const canComplete = completedCount === totalCount

    // Calculate weighted overall progress
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)
    const weightedProgress = criteria.reduce((sum, c) => {
      return sum + (c.isCompleted ? c.weight : (c.progress / 100) * c.weight)
    }, 0)
    const overallProgress = totalWeight > 0 ? (weightedProgress / totalWeight) * 100 : 0

    return {
      criteria,
      overallProgress: Math.round(overallProgress),
      canComplete,
      completedCount,
      totalCount
    }
  }, [
    progressData,
    pageTimer.hasReachedMinimum,
    pageTimer.percentage,
    pdfProgress.isCompleted,
    pdfProgress.percentageRead,
    minimumTimeMinutes,
    minimumQuizScore,
    requireAllExercises,
    requireFullPDFRead
  ])

  // Update progress data
  const updateProgress = useCallback((newProgressData: LessonProgressData) => {
    setProgressData(newProgressData)
  }, [])

  // Call callback when criteria changes
  useEffect(() => {
    if (onCriteriaUpdated) {
      onCriteriaUpdated(criteriaState)
    }
  }, [criteriaState, onCriteriaUpdated])

  // Call callback when completion is ready
  useEffect(() => {
    if (criteriaState.canComplete && onCompletionReady) {
      onCompletionReady()
    }
  }, [criteriaState.canComplete, onCompletionReady])

  // Get specific criterion
  const getCriterion = useCallback((id: string): CompletionCriterion | undefined => {
    return criteriaState.criteria.find(c => c.id === id)
  }, [criteriaState.criteria])

  // Check if specific criterion is completed
  const isCriterionCompleted = useCallback((id: string): boolean => {
    const criterion = getCriterion(id)
    return criterion?.isCompleted || false
  }, [getCriterion])

  // Get completion summary
  const getCompletionSummary = useCallback(() => {
    const completed = criteriaState.criteria.filter(c => c.isCompleted)
    const pending = criteriaState.criteria.filter(c => !c.isCompleted)
    
    return {
      completed: completed.map(c => ({ id: c.id, name: c.name })),
      pending: pending.map(c => ({ 
        id: c.id, 
        name: c.name, 
        progress: c.progress,
        description: c.description 
      })),
      completionRate: `${completed.length}/${criteriaState.totalCount}`,
      overallProgress: criteriaState.overallProgress
    }
  }, [criteriaState])

  // Get next requirement to complete
  const getNextRequirement = useCallback((): CompletionCriterion | null => {
    const pending = criteriaState.criteria.filter(c => !c.isCompleted)
    if (pending.length === 0) return null
    
    // Return the one with highest progress (closest to completion)
    return pending.reduce((prev, current) => 
      current.progress > prev.progress ? current : prev
    )
  }, [criteriaState.criteria])

  // Reset all criteria
  const resetCriteria = useCallback(() => {
    setProgressData(null)
  }, [])

  return {
    // State
    criteria: criteriaState.criteria,
    overallProgress: criteriaState.overallProgress,
    canComplete: criteriaState.canComplete,
    completedCount: criteriaState.completedCount,
    totalCount: criteriaState.totalCount,
    
    // Timer state
    pageTimer,
    pdfProgress,
    
    // Actions
    updateProgress,
    resetCriteria,
    
    // Utilities
    getCriterion,
    isCriterionCompleted,
    getCompletionSummary,
    getNextRequirement
  }
}