// Progress Tracking Types for Lesson System
// Part of Fase 1: Arquitetura e Fundação

import type { User } from '../index'

// Enhanced progress tracking beyond the existing Progress interface
export interface LessonProgressData {
  // Video progress
  videoProgress: {
    currentTime: number
    duration: number
    percentageWatched: number
    watchTime: number // total accumulated watch time
    lastPosition: number
    playbackRate: number
    completedSegments: TimeSegment[]
  }

  // PDF progress  
  pdfProgress: {
    currentPage: number
    totalPages: number
    percentageRead: number
    bookmarks: number[]
    readingTime: number
    lastPageViewed: number
  }

  // Quiz progress
  quizProgress: {
    currentQuestion: number
    totalQuestions: number
    answeredQuestions: number[]
    score: number
    attempts: number
    timeSpent: number
    isCompleted: boolean
    isPassed: boolean
  }

  // Exercise progress
  exerciseProgress: {
    completedExercises: string[] // exercise IDs
    submittedFiles: ExerciseSubmission[]
    pendingReviews: string[]
    totalExercises: number
    completionPercentage: number
  }

  // Content reading progress
  contentProgress: {
    scrollPercentage: number
    readingTime: number
    sectionsRead: string[]
    estimatedCompletionTime: number
  }

  // Overall lesson progress
  overallProgress: {
    percentageComplete: number
    estimatedTimeRemaining: number
    lastActivity: string
    isCompleted: boolean
    completedAt?: string
    componentProgress: ComponentProgress[]
  }
}

export interface TimeSegment {
  start: number
  end: number
  watchCount: number
}

export interface ExerciseSubmission {
  exerciseId: string
  fileName: string
  fileUrl: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  feedback?: string
}

export interface ComponentProgress {
  component: 'video' | 'pdf' | 'quiz' | 'exercises' | 'content' | 'materials'
  percentage: number
  timeSpent: number
  isCompleted: boolean
  weight: number // for calculating overall progress
  includeInOverall?: boolean // whether to include in overall progress calculation
}

// New interface for lesson completion tracking
export interface LessonCompletionData {
  timeSpentMinutes: number
  hasReachedMinimumTime: boolean
  minimumTimeMinutes: number
  canComplete: boolean
  completedAt?: string
  completionCriteria: CompletionCriterion[]
}

export interface CompletionCriterion {
  id: string
  name: string
  description: string
  isCompleted: boolean
  progress: number
  required: boolean
}

// Progress tracking actions
export interface ProgressActions {
  updateVideoProgress: (time: number, duration: number) => void
  updatePDFProgress: (page: number, totalPages: number) => void
  updateQuizProgress: (questionIndex: number, answer: number) => void
  markExerciseComplete: (exerciseId: string) => void
  updateContentProgress: (scrollPercentage: number) => void
  saveProgress: () => Promise<void>
  loadProgress: () => Promise<LessonProgressData>
}

// Progress persistence
export interface ProgressPersistence {
  autosaveInterval: number // milliseconds
  lastSaved: string
  isDirty: boolean
  isSaving: boolean
  saveError?: string
}

// Progress analytics
export interface ProgressAnalytics {
  engagementScore: number // 0-100 based on interaction patterns
  averageSessionTime: number
  completionPrediction: number // estimated percentage chance of completion
  strugglingComponents: string[] // components where user is spending too much time
  strongComponents: string[] // components user completes quickly
  recommendedActions: ProgressRecommendation[]
}

export interface ProgressRecommendation {
  type: 'review' | 'skip' | 'focus' | 'break'
  component: string
  reason: string
  actionText: string
}

// Progress provider state
export interface ProgressProviderState {
  lessonId: string
  userId: string
  progress: LessonProgressData
  persistence: ProgressPersistence
  analytics: ProgressAnalytics
  
  // Actions
  actions: ProgressActions
  
  // State management
  isLoading: boolean
  error: string | null
}

// Progress tracking configuration
export interface ProgressConfig {
  autosave: boolean
  autosaveInterval: number
  trackDetailedAnalytics: boolean
  enablePredictions: boolean
  trackReadingTime: boolean
  trackScrollDepth: boolean
  videoProgressThreshold: number // minimum seconds to count as progress
  completionThreshold: number // percentage to mark as completed
}

// Progress event types for analytics
export type ProgressEvent = 
  | { type: 'video_play'; data: { currentTime: number; playbackRate: number } }
  | { type: 'video_pause'; data: { currentTime: number; duration: number } }
  | { type: 'video_seek'; data: { from: number; to: number } }
  | { type: 'pdf_page_change'; data: { from: number; to: number; timeSpent: number } }
  | { type: 'quiz_answer'; data: { questionId: string; answer: number; timeSpent: number } }
  | { type: 'exercise_download'; data: { exerciseId: string } }
  | { type: 'exercise_submit'; data: { exerciseId: string; fileName: string } }
  | { type: 'content_scroll'; data: { percentage: number; direction: 'up' | 'down' } }
  | { type: 'lesson_complete'; data: { totalTime: number; finalScore?: number } }

// Progress event handler
export type ProgressEventHandler = (event: ProgressEvent) => void

// Integration with existing Progress type
export interface EnhancedProgress extends Omit<import('../index').Progress, 'last_position'> {
  detailedProgress: LessonProgressData
  config: ProgressConfig
  events: ProgressEvent[]
}