/**
 * Hook for managing real-time lesson progress updates
 */

import { useState, useEffect, useCallback } from 'react'
import { LessonProgressData } from '@/types/lesson'
import { LessonProgressManager } from '@/utils/lessonProgressUtils'

interface UseLessonProgressProps {
  lessonId: string
  initialProgressData?: LessonProgressData | null
}

export const useLessonProgress = ({ lessonId, initialProgressData }: UseLessonProgressProps) => {
  const [progressData, setProgressData] = useState<LessonProgressData | null>(initialProgressData || null)
  const [progressManager] = useState(() => new LessonProgressManager(lessonId))

  // Initialize progress data if not provided
  useEffect(() => {
    if (!progressData) {
      // Create default progress structure
      const defaultProgress: LessonProgressData = {
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
          totalExercises: 1, // Default to 1 exercise
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
      }
      setProgressData(defaultProgress)
    }
  }, [progressData])

  // Update video progress
  const updateVideoProgress = useCallback((progress: number, currentTime?: number, duration?: number) => {
    setProgressData(prev => {
      if (!prev) return null
      
      const updatedProgress = {
        ...prev,
        videoProgress: {
          ...prev.videoProgress,
          percentageWatched: progress,
          currentTime: currentTime || prev.videoProgress.currentTime,
          duration: duration || prev.videoProgress.duration
        }
      }
      
      // Save to localStorage
      progressManager.updateVideoProgress(
        updatedProgress.videoProgress.currentTime,
        updatedProgress.videoProgress.duration
      )
      
      return updatedProgress
    })
  }, [progressManager])

  // Update PDF progress
  const updatePDFProgress = useCallback((progress: number, currentPage?: number, totalPages?: number) => {
    setProgressData(prev => {
      if (!prev) return null
      
      const updatedProgress = {
        ...prev,
        pdfProgress: {
          ...prev.pdfProgress,
          percentageRead: progress,
          currentPage: currentPage || prev.pdfProgress.currentPage,
          totalPages: totalPages || prev.pdfProgress.totalPages
        }
      }
      
      return updatedProgress
    })
  }, [])

  // Update quiz progress
  const updateQuizProgress = useCallback((score: number, isCompleted: boolean, isPassed?: boolean) => {
    setProgressData(prev => {
      if (!prev) return null
      
      const updatedProgress = {
        ...prev,
        quizProgress: {
          ...prev.quizProgress,
          score,
          isCompleted,
          isPassed: isPassed !== undefined ? isPassed : score >= 70
        }
      }
      
      // Save to localStorage
      progressManager.updateQuizProgress(score, isCompleted)
      
      return updatedProgress
    })
  }, [progressManager])

  // Update exercise progress
  const updateExerciseProgress = useCallback((progress: number, uploadedFiles?: string[]) => {
    setProgressData(prev => {
      if (!prev) return null
      
      const updatedProgress = {
        ...prev,
        exerciseProgress: {
          ...prev.exerciseProgress,
          completionPercentage: progress,
          submittedFiles: uploadedFiles ? uploadedFiles.map(file => ({
            exerciseId: 'default',
            fileName: file,
            fileUrl: '',
            submittedAt: new Date().toISOString(),
            status: 'pending' as const,
            feedback: undefined
          })) : prev.exerciseProgress.submittedFiles
        }
      }
      
      // Save to localStorage
      if (uploadedFiles) {
        progressManager.updateExerciseProgress(uploadedFiles, prev.exerciseProgress.totalExercises)
      }
      
      return updatedProgress
    })
  }, [progressManager])

  // Calculate overall progress
  const updateOverallProgress = useCallback(() => {
    setProgressData(prev => {
      if (!prev) return null
      
      const videoProgress = prev.videoProgress.percentageWatched
      const pdfProgress = prev.pdfProgress.percentageRead
      const exerciseProgress = prev.exerciseProgress.completionPercentage
      const quizProgress = prev.quizProgress.isCompleted ? prev.quizProgress.score : 0
      
      const overallPercentage = (
        videoProgress * 0.3 +
        pdfProgress * 0.2 +
        exerciseProgress * 0.2 +
        quizProgress * 0.3
      )
      
      const updatedProgress = {
        ...prev,
        overallProgress: {
          ...prev.overallProgress,
          percentageComplete: overallPercentage,
          lastActivity: new Date().toISOString()
        }
      }
      
      // Save overall progress
      progressManager.updateOverallProgress()
      
      return updatedProgress
    })
  }, [progressManager])

  // Auto-update overall progress when individual components change
  useEffect(() => {
    if (progressData) {
      updateOverallProgress()
    }
  }, [
    progressData,
    progressData?.videoProgress.percentageWatched,
    progressData?.pdfProgress.percentageRead,
    progressData?.exerciseProgress.completionPercentage,
    progressData?.quizProgress.score,
    progressData?.quizProgress.isCompleted,
    updateOverallProgress
  ])

  return {
    progressData,
    updateVideoProgress,
    updatePDFProgress,
    updateQuizProgress,
    updateExerciseProgress,
    updateOverallProgress,
    progressManager
  }
}