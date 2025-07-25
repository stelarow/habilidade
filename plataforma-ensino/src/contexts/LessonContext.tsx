'use client'

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import type { LessonContent, LessonProgressData, ProgressActions, ProgressConfig } from '@/types/lesson'
import type { User, Lesson, Progress } from '@/types'

// Lesson Context State
interface LessonContextState {
  // Core lesson data
  lesson: Lesson | null
  content: LessonContent | null
  user: User | null
  
  // Progress tracking
  progress: LessonProgressData | null
  config: ProgressConfig
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Actions
  actions: LessonActions
}

interface LessonActions {
  loadLesson: (lessonId: string) => Promise<void>
  updateProgress: (progress: Partial<LessonProgressData>) => void
  saveProgress: () => Promise<void>
  setConfig: (config: Partial<ProgressConfig>) => void
  clearError: () => void
}

// Context
const LessonContext = createContext<LessonContextState | null>(null)

// Action types
type LessonAction = 
  | { type: 'SET_LESSON'; payload: Lesson }
  | { type: 'SET_CONTENT'; payload: LessonContent }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_PROGRESS'; payload: LessonProgressData }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<LessonProgressData> }
  | { type: 'SET_CONFIG'; payload: ProgressConfig }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

// Reducer
function lessonReducer(state: Omit<LessonContextState, 'actions'>, action: LessonAction): Omit<LessonContextState, 'actions'> {
  switch (action.type) {
    case 'SET_LESSON':
      return { ...state, lesson: action.payload }
    
    case 'SET_CONTENT':
      return { ...state, content: action.payload }
    
    case 'SET_USER':
      return { ...state, user: action.payload }
    
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload }
    
    case 'UPDATE_PROGRESS':
      return { 
        ...state, 
        progress: state.progress ? { ...state.progress, ...action.payload } : null 
      }
    
    case 'SET_CONFIG':
      return { ...state, config: action.payload }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    default:
      return state
  }
}

// Default configuration
const defaultConfig: ProgressConfig = {
  autosave: true,
  autosaveInterval: 30000, // 30 seconds
  trackDetailedAnalytics: true,
  enablePredictions: true,
  trackReadingTime: true,
  trackScrollDepth: true,
  videoProgressThreshold: 5, // 5 seconds minimum
  completionThreshold: 80 // 80% to mark as completed
}

// Initial state
const initialState: Omit<LessonContextState, 'actions'> = {
  lesson: null,
  content: null,
  user: null,
  progress: null,
  config: defaultConfig,
  isLoading: false,
  error: null
}

// Provider Props
interface LessonProviderProps {
  children: React.ReactNode
  initialLesson?: Lesson
  initialUser?: User
  config?: Partial<ProgressConfig>
}

/**
 * LessonProvider - Main context provider for lesson functionality
 * Part of Fase 1: Setup da Estrutura Base
 * 
 * Integrates:
 * - Lesson content management
 * - Progress tracking
 * - User state
 * - Configuration
 */
export function LessonProvider({ children, initialLesson, initialUser, config }: LessonProviderProps) {
  const [state, dispatch] = useReducer(lessonReducer, {
    ...initialState,
    lesson: initialLesson || null,
    user: initialUser || null,
    config: { ...defaultConfig, ...config }
  })

  // Convert lesson to lesson content
  const convertLessonToContent = useCallback((lesson: Lesson): LessonContent => {
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      
      // Video data
      video: lesson.video_url ? {
        url: lesson.video_url,
        duration: lesson.video_duration,
        thumbnail: undefined, // TODO: Add thumbnail support
        aspectRatio: 16/9
      } : undefined,
      
      // PDF materials
      pdf: lesson.materials.find(m => m.type === 'pdf') ? {
        url: lesson.materials.find(m => m.type === 'pdf')!.url!,
        title: lesson.materials.find(m => m.type === 'pdf')!.title,
        filename: lesson.materials.find(m => m.type === 'pdf')!.title,
        size: lesson.materials.find(m => m.type === 'pdf')!.size || 0,
        downloadable: true
      } : undefined,
      
      // Exercises
      exercises: lesson.exercises?.map(exercise => ({
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
        downloadUrl: exercise.download_url,
        orderIndex: exercise.order_index,
        allowsUpload: lesson.allows_file_upload,
        status: 'not_started'
      })),
      
      // Quiz
      quiz: lesson.quizzes && lesson.quizzes.length > 0 ? {
        id: lesson.quizzes[0].id,
        title: lesson.quizzes[0].title,
        description: lesson.quizzes[0].description,
        timeLimit: lesson.quizzes[0].time_limit_minutes,
        attemptsAllowed: lesson.quizzes[0].attempts_allowed,
        passingScore: lesson.quizzes[0].passing_score,
        totalQuestions: lesson.quizzes[0].questions?.length || 0,
        status: 'not_started'
      } : undefined,
      
      // Rich content
      content: lesson.content,
      
      // Materials
      materials: lesson.materials.map(material => ({
        type: material.type,
        title: material.title,
        url: material.url,
        content: material.content,
        size: material.size,
        downloadable: material.type === 'pdf'
      })),
      
      // Transcript
      transcript: lesson.transcript,
      
      // Estimated duration
      estimatedDuration: lesson.video_duration
    }
  }, [])

  // Actions
  const actions = useMemo((): LessonActions => ({
    loadLesson: async (lessonId: string) => {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      try {
        // TODO: Implement actual API call
        // const lesson = await fetchLesson(lessonId)
        // const progress = await fetchLessonProgress(lessonId, state.user?.id)
        
        // For now, mock the functionality
        if (state.lesson) {
          const content = convertLessonToContent(state.lesson)
          dispatch({ type: 'SET_CONTENT', payload: content })
        }
        
        dispatch({ type: 'SET_LOADING', payload: false })
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load lesson' })
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },

    updateProgress: (progressUpdate: Partial<LessonProgressData>) => {
      dispatch({ type: 'UPDATE_PROGRESS', payload: progressUpdate })
    },

    saveProgress: async () => {
      if (!state.progress || !state.lesson || !state.user) return
      
      try {
        // TODO: Implement actual API call
        // await saveProgressToAPI(state.lesson.id, state.user.id, state.progress)
        console.log('Progress saved:', state.progress)
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save progress' })
      }
    },

    setConfig: (configUpdate: Partial<ProgressConfig>) => {
      dispatch({ type: 'SET_CONFIG', payload: { ...state.config, ...configUpdate } })
    },

    clearError: () => {
      dispatch({ type: 'SET_ERROR', payload: null })
    }
  }), [state.lesson, state.user, state.progress, state.config, convertLessonToContent])

  // Auto-save progress
  React.useEffect(() => {
    if (!state.config.autosave || !state.progress) return

    const interval = setInterval(() => {
      actions.saveProgress()
    }, state.config.autosaveInterval)

    return () => clearInterval(interval)
  }, [state.config.autosave, state.config.autosaveInterval, state.progress, actions])

  // Convert lesson to content when lesson changes
  React.useEffect(() => {
    if (state.lesson) {
      const content = convertLessonToContent(state.lesson)
      dispatch({ type: 'SET_CONTENT', payload: content })
    }
  }, [state.lesson, convertLessonToContent])

  // Context value
  const value: LessonContextState = {
    ...state,
    actions
  }

  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  )
}

/**
 * Hook to use lesson context
 */
export function useLessonContext() {
  const context = useContext(LessonContext)
  
  if (!context) {
    throw new Error('useLessonContext must be used within a LessonProvider')
  }
  
  return context
}

/**
 * Hook for lesson content only
 */
export function useLessonContent() {
  const { content, isLoading, error } = useLessonContext()
  return { content, isLoading, error }
}

/**
 * Hook for progress tracking only
 */
export function useLessonProgress() {
  const { progress, actions, config } = useLessonContext()
  
  return {
    progress,
    updateProgress: actions.updateProgress,
    saveProgress: actions.saveProgress,
    config
  }
}