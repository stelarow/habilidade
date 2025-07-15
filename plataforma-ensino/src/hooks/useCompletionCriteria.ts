'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { LessonProgressData } from '@/types/lesson'

interface CompletionCriterion {
  id: string
  name: string
  icon: string
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
  timeSpent?: number
  onCriteriaUpdated?: (state: CompletionCriteriaState) => void
}

/**
 * useCompletionCriteria - Hook for managing lesson completion criteria
 * 
 * Manages the four completion requirements:
 * 1. Time spent (25 minutes minimum)
 * 2. Quiz score (70% minimum)  
 * 3. Exercises completion (100%)
 * 4. PDF reading (100%)
 */
export function useCompletionCriteria({
  minimumTimeMinutes = 25,
  minimumQuizScore = 70,
  requireAllExercises = true,
  requireFullPDFRead = true,
  timeSpent = 0,
  onCriteriaUpdated
}: UseCompletionCriteriaOptions = {}) {
  
  const [progressData, setProgressData] = useState<LessonProgressData | null>(null)

  // Calculate criteria based on current progress
  const criteriaState = useMemo((): CompletionCriteriaState => {
    const minimumTimeSeconds = minimumTimeMinutes * 60
    
    const criteria: CompletionCriterion[] = [
      {
        id: 'time',
        name: 'Tempo na Aula',
        icon: '⏱️',
        description: `Permanecer pelo menos ${minimumTimeMinutes} minutos na aula`,
        isCompleted: timeSpent >= minimumTimeSeconds,
        progress: Math.min((timeSpent / minimumTimeSeconds) * 100, 100),
        weight: 25,
        color: timeSpent >= minimumTimeSeconds ? '#22c55e' : '#f59e0b'
      },
      {
        id: 'quiz',
        name: 'Quiz',
        icon: '🧩',
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
        icon: '📋',
        description: requireAllExercises ? 'Completar todos os exercícios' : 'Completar a maioria dos exercícios',
        isCompleted: progressData 
          ? progressData.exerciseProgress.completionPercentage >= (requireAllExercises ? 100 : 80)
          : false,
        progress: progressData?.exerciseProgress.completionPercentage || 0,
        weight: 25,
        color: progressData?.exerciseProgress.completionPercentage >= (requireAllExercises ? 100 : 80) 
          ? '#22c55e' : '#f59e0b'
      },
      {
        id: 'pdf',
        name: 'Material PDF',
        icon: '📄',
        description: requireFullPDFRead ? 'Ler 100% do material PDF' : 'Ler pelo menos 90% do material PDF',
        isCompleted: progressData 
          ? progressData.pdfProgress.percentageRead >= (requireFullPDFRead ? 100 : 90)
          : false,
        progress: progressData?.pdfProgress.percentageRead || 0,
        weight: 15,
        color: progressData?.pdfProgress.percentageRead >= (requireFullPDFRead ? 100 : 90) 
          ? '#22c55e' : '#00c4ff'
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
    timeSpent,
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