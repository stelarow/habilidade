'use client'

import { useMemo, useCallback } from 'react'
import { LessonProgressData, ComponentProgress, CompletionCriterion } from '@/types/lesson'

// Enhanced progress calculation configuration
interface ProgressCalculationConfig {
  minimumTimeMinutes: number
  pdfCompletionThreshold: number
  quizPassingScore: number
  componentWeights: {
    time: number
    pdf: number
    exercises: number
    quiz: number
  }
}

// Default configuration based on requirements
const DEFAULT_CONFIG: ProgressCalculationConfig = {
  minimumTimeMinutes: 25, // 25 minutes minimum as per requirements
  pdfCompletionThreshold: 100, // 100% PDF reading required
  quizPassingScore: 70, // 70% minimum quiz score as per requirements
  componentWeights: {
    time: 0.25,     // 25% weight for time spent
    pdf: 0.25,      // 25% weight for PDF reading
    exercises: 0.25, // 25% weight for exercises
    quiz: 0.25      // 25% weight for quiz
  }
}

// Enhanced progress states
export type ProgressState = 'not_started' | 'in_progress' | 'completed' | 'failed'

export interface EnhancedProgressData {
  // Individual component progress
  timeProgress: {
    currentMinutes: number
    requiredMinutes: number
    percentage: number
    isCompleted: boolean
    state: ProgressState
    formatted: string
  }
  pdfProgress: {
    currentPage: number
    totalPages: number
    percentage: number
    isCompleted: boolean
    state: ProgressState
  }
  exerciseProgress: {
    completed: number
    total: number
    percentage: number
    isCompleted: boolean
    state: ProgressState
  }
  quizProgress: {
    score: number
    attempts: number
    isCompleted: boolean
    isPassed: boolean
    state: ProgressState
  }
  
  // Overall progress
  overallProgress: {
    percentage: number
    isCompleted: boolean
    canComplete: boolean
    completedCriteria: number
    totalCriteria: number
  }
  
  // Completion criteria for UI display
  completionCriteria: CompletionCriterion[]
  
  // Visual states for animations
  visualStates: {
    showCelebration: boolean
    showCompletionButton: boolean
    progressColor: string
    completionMessage: string
  }
}

/**
 * Enhanced progress calculation hook
 * Provides comprehensive progress tracking with visual states and completion logic
 */
export function useEnhancedProgressCalculation(
  progressData: LessonProgressData | null,
  config: Partial<ProgressCalculationConfig> = {}
): EnhancedProgressData {
  const finalConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...config
  }), [config])

  // Calculate time progress
  const timeProgress = useMemo(() => {
    if (!progressData) {
      return {
        currentMinutes: 0,
        requiredMinutes: finalConfig.minimumTimeMinutes,
        percentage: 0,
        isCompleted: false,
        state: 'not_started' as ProgressState,
        formatted: '0 min'
      }
    }

    const currentMinutes = Math.floor(progressData.videoProgress.watchTime / 60)
    const percentage = Math.min((currentMinutes / finalConfig.minimumTimeMinutes) * 100, 100)
    const isCompleted = currentMinutes >= finalConfig.minimumTimeMinutes
    
    let state: ProgressState = 'not_started'
    if (currentMinutes > 0 && !isCompleted) state = 'in_progress'
    if (isCompleted) state = 'completed'

    return {
      currentMinutes,
      requiredMinutes: finalConfig.minimumTimeMinutes,
      percentage,
      isCompleted,
      state,
      formatted: `${currentMinutes} min`
    }
  }, [progressData, finalConfig.minimumTimeMinutes])

  // Calculate PDF progress
  const pdfProgress = useMemo(() => {
    if (!progressData) {
      return {
        currentPage: 0,
        totalPages: 0,
        percentage: 0,
        isCompleted: false,
        state: 'not_started' as ProgressState
      }
    }

    const percentage = progressData.pdfProgress.percentageRead
    const isCompleted = percentage >= finalConfig.pdfCompletionThreshold
    
    let state: ProgressState = 'not_started'
    if (percentage > 0 && !isCompleted) state = 'in_progress'
    if (isCompleted) state = 'completed'

    return {
      currentPage: progressData.pdfProgress.currentPage,
      totalPages: progressData.pdfProgress.totalPages,
      percentage,
      isCompleted,
      state
    }
  }, [progressData, finalConfig.pdfCompletionThreshold])

  // Calculate exercise progress
  const exerciseProgress = useMemo(() => {
    if (!progressData) {
      return {
        completed: 0,
        total: 0,
        percentage: 0,
        isCompleted: false,
        state: 'not_started' as ProgressState
      }
    }

    const completed = progressData.exerciseProgress.completedExercises.length
    const total = progressData.exerciseProgress.totalExercises
    const percentage = total > 0 ? (completed / total) * 100 : 0
    const isCompleted = total > 0 && completed === total
    
    let state: ProgressState = 'not_started'
    if (completed > 0 && !isCompleted) state = 'in_progress'
    if (isCompleted) state = 'completed'

    return {
      completed,
      total,
      percentage,
      isCompleted,
      state
    }
  }, [progressData])

  // Calculate quiz progress
  const quizProgress = useMemo(() => {
    if (!progressData) {
      return {
        score: 0,
        attempts: 0,
        isCompleted: false,
        isPassed: false,
        state: 'not_started' as ProgressState
      }
    }

    const score = progressData.quizProgress.score
    const attempts = progressData.quizProgress.attempts
    const isCompleted = progressData.quizProgress.isCompleted
    const isPassed = score >= finalConfig.quizPassingScore
    
    let state: ProgressState = 'not_started'
    if (attempts > 0 && !isCompleted) state = 'in_progress'
    if (isCompleted && isPassed) state = 'completed'
    if (isCompleted && !isPassed) state = 'failed'

    return {
      score,
      attempts,
      isCompleted,
      isPassed,
      state
    }
  }, [progressData, finalConfig.quizPassingScore])

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const weights = finalConfig.componentWeights
    
    // Calculate weighted progress
    const weightedProgress = 
      (timeProgress.percentage * weights.time) +
      (pdfProgress.percentage * weights.pdf) +
      (exerciseProgress.percentage * weights.exercises) +
      (quizProgress.score * weights.quiz)

    const percentage = Math.round(weightedProgress)
    
    // Count completed criteria
    const completedCriteria = [
      timeProgress.isCompleted,
      pdfProgress.isCompleted,
      exerciseProgress.isCompleted,
      quizProgress.isPassed
    ].filter(Boolean).length

    const totalCriteria = 4
    const isCompleted = completedCriteria === totalCriteria
    const canComplete = isCompleted

    return {
      percentage,
      isCompleted,
      canComplete,
      completedCriteria,
      totalCriteria
    }
  }, [timeProgress, pdfProgress, exerciseProgress, quizProgress, finalConfig.componentWeights])

  // Generate completion criteria for UI
  const completionCriteria = useMemo((): CompletionCriterion[] => [
    {
      id: 'time',
      name: 'Tempo de Estudo',
      description: `Assista por pelo menos ${finalConfig.minimumTimeMinutes} minutos`,
      isCompleted: timeProgress.isCompleted,
      progress: timeProgress.percentage,
      required: true
    },
    {
      id: 'pdf',
      name: 'Leitura do Material',
      description: 'Leia todo o material PDF disponível',
      isCompleted: pdfProgress.isCompleted,
      progress: pdfProgress.percentage,
      required: true
    },
    {
      id: 'exercises',
      name: 'Exercícios Práticos',
      description: 'Complete todos os exercícios propostos',
      isCompleted: exerciseProgress.isCompleted,
      progress: exerciseProgress.percentage,
      required: true
    },
    {
      id: 'quiz',
      name: 'Avaliação',
      description: `Obtenha pelo menos ${finalConfig.quizPassingScore}% no teste`,
      isCompleted: quizProgress.isPassed,
      progress: quizProgress.score,
      required: true
    }
  ], [timeProgress, pdfProgress, exerciseProgress, quizProgress, finalConfig])

  // Calculate visual states
  const visualStates = useMemo(() => {
    const showCelebration = overallProgress.isCompleted
    const showCompletionButton = overallProgress.canComplete
    
    let progressColor = '#d400ff' // Default brand color
    if (overallProgress.percentage >= 75) progressColor = '#22c55e' // Green when near completion
    else if (overallProgress.percentage >= 50) progressColor = '#f59e0b' // Amber for good progress
    else if (overallProgress.percentage >= 25) progressColor = '#00c4ff' // Cyan for some progress

    let completionMessage = 'Continue trabalhando nos critérios'
    if (overallProgress.isCompleted) completionMessage = '🎉 Parabéns! Aula concluída!'
    else if (overallProgress.percentage >= 75) completionMessage = 'Quase lá! Finalize os últimos critérios'
    else if (overallProgress.percentage >= 50) completionMessage = 'Bom progresso! Continue assim'

    return {
      showCelebration,
      showCompletionButton,
      progressColor,
      completionMessage
    }
  }, [overallProgress])

  return {
    timeProgress,
    pdfProgress,
    exerciseProgress,
    quizProgress,
    overallProgress,
    completionCriteria,
    visualStates
  }
}

/**
 * Hook for smooth progress updates with animation support
 */
export function useProgressAnimations(progressData: EnhancedProgressData) {
  const getProgressAnimation = useCallback((fromProgress: number, toProgress: number) => {
    return {
      initial: { strokeDashoffset: `${100 - fromProgress}%` },
      animate: { strokeDashoffset: `${100 - toProgress}%` },
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  }, [])

  const getCompletionAnimation = useCallback((isCompleted: boolean) => {
    if (isCompleted) {
      return {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.5, delay: 0.2 }
      }
    }
    return {}
  }, [])

  const getCelebrationAnimation = useCallback(() => {
    return {
      initial: { opacity: 0, scale: 0 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
      transition: { duration: 0.6, ease: "backOut" }
    }
  }, [])

  return {
    getProgressAnimation,
    getCompletionAnimation,
    getCelebrationAnimation
  }
}