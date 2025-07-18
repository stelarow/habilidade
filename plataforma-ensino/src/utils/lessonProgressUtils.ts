/**
 * Lesson Progress Tracking Utilities
 * Handles real progress calculation and persistence for video, PDF, exercises, and quiz
 */

export interface LessonProgressState {
  videoProgress: number
  pdfProgress: number
  exerciseProgress: number
  quizProgress: number
  quizScore: number
  overallProgress: number
}

export interface VideoProgressData {
  currentTime: number
  duration: number
  percentageWatched: number
  watchTime: number
}

export interface PDFProgressData {
  currentPage: number
  totalPages: number
  percentageRead: number
  pagesRead: number[]
}

export interface ExerciseProgressData {
  uploadedFiles: string[]
  totalExercises: number
  completionPercentage: number
}

export interface QuizProgressData {
  score: number
  totalQuestions: number
  answeredQuestions: number
  isCompleted: boolean
  isPassed: boolean
}

/**
 * Calculate video progress percentage based on watch time
 */
export const calculateVideoProgress = (currentTime: number, duration: number): number => {
  if (duration === 0) return 0
  return Math.min((currentTime / duration) * 100, 100)
}

/**
 * Calculate PDF progress based on pages read
 */
export const calculatePDFProgress = (pagesRead: number[], totalPages: number): number => {
  if (totalPages === 0) return 0
  const uniquePagesRead = new Set(pagesRead).size
  return Math.min((uniquePagesRead / totalPages) * 100, 100)
}

/**
 * Calculate exercise progress based on uploaded files
 */
export const calculateExerciseProgress = (uploadedFiles: string[], totalExercises: number): number => {
  if (totalExercises === 0) return 100 // No exercises means 100% complete
  return Math.min((uploadedFiles.length / totalExercises) * 100, 100)
}

/**
 * Calculate quiz progress based on completion and score
 */
export const calculateQuizProgress = (score: number, isCompleted: boolean): number => {
  return isCompleted ? score : 0
}

/**
 * Calculate overall lesson progress
 */
export const calculateOverallProgress = (
  videoProgress: number,
  pdfProgress: number,
  exerciseProgress: number,
  quizProgress: number,
  weights = { video: 0.3, pdf: 0.2, exercise: 0.2, quiz: 0.3 }
): number => {
  return (
    videoProgress * weights.video +
    pdfProgress * weights.pdf +
    exerciseProgress * weights.exercise +
    quizProgress * weights.quiz
  )
}

/**
 * Progress persistence utilities
 */
export class LessonProgressManager {
  private lessonId: string
  private storageKey: string

  constructor(lessonId: string) {
    this.lessonId = lessonId
    this.storageKey = `lesson_progress_${lessonId}`
  }

  /**
   * Save progress to localStorage
   */
  saveProgress(progress: Partial<LessonProgressState>): void {
    try {
      const existingProgress = this.getProgress()
      const updatedProgress = { ...existingProgress, ...progress }
      localStorage.setItem(this.storageKey, JSON.stringify(updatedProgress))
    } catch (error) {
      console.error('Error saving lesson progress:', error)
    }
  }

  /**
   * Get progress from localStorage
   */
  getProgress(): LessonProgressState {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading lesson progress:', error)
    }

    // Return default progress state
    return {
      videoProgress: 0,
      pdfProgress: 0,
      exerciseProgress: 0,
      quizProgress: 0,
      quizScore: 0,
      overallProgress: 0
    }
  }

  /**
   * Update video progress
   */
  updateVideoProgress(currentTime: number, duration: number): void {
    const percentageWatched = calculateVideoProgress(currentTime, duration)
    this.saveProgress({ videoProgress: percentageWatched })
  }

  /**
   * Update PDF progress
   */
  updatePDFProgress(pagesRead: number[], totalPages: number): void {
    const percentageRead = calculatePDFProgress(pagesRead, totalPages)
    this.saveProgress({ pdfProgress: percentageRead })
  }

  /**
   * Update exercise progress
   */
  updateExerciseProgress(uploadedFiles: string[], totalExercises: number): void {
    const completionPercentage = calculateExerciseProgress(uploadedFiles, totalExercises)
    this.saveProgress({ exerciseProgress: completionPercentage })
  }

  /**
   * Update quiz progress
   */
  updateQuizProgress(score: number, isCompleted: boolean): void {
    const quizProgress = calculateQuizProgress(score, isCompleted)
    this.saveProgress({ 
      quizProgress,
      quizScore: score
    })
  }

  /**
   * Update overall progress
   */
  updateOverallProgress(): void {
    const progress = this.getProgress()
    const overallProgress = calculateOverallProgress(
      progress.videoProgress,
      progress.pdfProgress,
      progress.exerciseProgress,
      progress.quizProgress
    )
    this.saveProgress({ overallProgress })
  }

  /**
   * Clear all progress
   */
  clearProgress(): void {
    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.error('Error clearing lesson progress:', error)
    }
  }
}

/**
 * Extract Vimeo video ID from various Vimeo URL formats
 */
export const extractVimeoId = (url: string): string | null => {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/manage\/videos\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}