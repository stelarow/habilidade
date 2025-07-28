'use client'

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { type LessonContent, type LayoutResult, type LayoutState, Breakpoint, GRID_TEMPLATES, type LayoutProviderState } from '@/types/lesson'
import { useResponsiveLayout } from './LessonGrid'

// Layout Context
const LessonLayoutContext = createContext<LayoutProviderState | null>(null)

// Layout state and actions
type LayoutAction = 
  | { type: 'SET_CONTENT'; payload: LessonContent }
  | { type: 'SET_BREAKPOINT'; payload: Breakpoint }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CALCULATE_LAYOUT'; payload: LayoutResult }
  | { type: 'START_TRANSITION' }
  | { type: 'END_TRANSITION' }

interface LayoutInternalState {
  content: LessonContent | null
  currentLayout: LayoutResult | null
  breakpoint: Breakpoint
  isLoading: boolean
  isTransitioning: boolean
  error: string | null
}

// Layout reducer
function layoutReducer(state: LayoutInternalState, action: LayoutAction): LayoutInternalState {
  switch (action.type) {
    case 'SET_CONTENT':
      return { ...state, content: action.payload }
    
    case 'SET_BREAKPOINT':
      return { ...state, breakpoint: action.payload }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'CALCULATE_LAYOUT':
      return { 
        ...state, 
        currentLayout: action.payload,
        isLoading: false,
        error: null 
      }
    
    case 'START_TRANSITION':
      return { ...state, isTransitioning: true }
    
    case 'END_TRANSITION':
      return { ...state, isTransitioning: false }
    
    default:
      return state
  }
}

// Initial state
const initialState: LayoutInternalState = {
  content: null,
  currentLayout: null,
  breakpoint: Breakpoint.DESKTOP,
  isLoading: false,
  isTransitioning: false,
  error: null
}

// Layout Provider Props
interface LessonLayoutProviderProps {
  children: React.ReactNode
  initialContent?: LessonContent
}

/**
 * LessonLayoutProvider - Context provider for lesson layout management
 * Part of Fase 1: Setup da Estrutura Base
 */
export function LessonLayoutProvider({ children, initialContent }: LessonLayoutProviderProps) {
  const [state, dispatch] = useReducer(layoutReducer, {
    ...initialState,
    content: initialContent || null
  })
  
  const responsiveBreakpoint = useResponsiveLayout()

  // Update breakpoint when responsive breakpoint changes
  React.useEffect(() => {
    dispatch({ type: 'SET_BREAKPOINT', payload: responsiveBreakpoint })
  }, [responsiveBreakpoint])

  // Layout calculation function
  const calculateLayout = useCallback((content: LessonContent): LayoutResult => {
    const layoutState = detectOptimalLayoutState(content)
    const config = GRID_TEMPLATES[layoutState]
    
    // Calculate component layout
    const components = {
      header: true,
      main: determineMainComponent(content),
      sidebar: determineSidebarComponents(content),
      exercises: determineExercisesComponent(content),
      footer: true
    }

    // Generate responsive configuration
    const responsive = Object.entries(config.responsiveConfig).reduce((acc, [bp, cfg]) => {
      acc[bp as Breakpoint] = {
        ...config,
        gridTemplate: cfg
      }
      return acc
    }, {} as Record<Breakpoint, any>)

    return {
      state: layoutState,
      config,
      components,
      responsive
    }
  }, [])

  // Actions
  const actions = useMemo(() => ({
    calculateLayout: (content: LessonContent) => {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      try {
        const layout = calculateLayout(content)
        dispatch({ type: 'CALCULATE_LAYOUT', payload: layout })
        dispatch({ type: 'SET_CONTENT', payload: content })
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Layout calculation failed' })
      }
    },

    setBreakpoint: (breakpoint: Breakpoint) => {
      dispatch({ type: 'SET_BREAKPOINT', payload: breakpoint })
    },

    recalculateLayout: () => {
      if (state.content) {
        dispatch({ type: 'START_TRANSITION' })
        
        setTimeout(() => {
          const layout = calculateLayout(state.content!)
          dispatch({ type: 'CALCULATE_LAYOUT', payload: layout })
          dispatch({ type: 'END_TRANSITION' })
        }, 50) // Small delay for smooth transition
      }
    }
  }), [calculateLayout, state.content])

  // Recalculate layout when breakpoint changes
  React.useEffect(() => {
    if (state.content) {
      actions.recalculateLayout()
    }
  }, [state.breakpoint, state.content, actions])

  // Provider value
  const value: LayoutProviderState = {
    currentLayout: state.currentLayout!,
    isLoading: state.isLoading,
    error: state.error,
    breakpoint: state.breakpoint,
    ...actions
  }

  return (
    <LessonLayoutContext.Provider value={value}>
      {children}
    </LessonLayoutContext.Provider>
  )
}

/**
 * Hook to use lesson layout context
 */
export function useLessonLayout() {
  const context = useContext(LessonLayoutContext)
  
  if (!context) {
    throw new Error('useLessonLayout must be used within a LessonLayoutProvider')
  }
  
  return {
    layout: context.currentLayout,
    isLoading: context.isLoading,
    isTransitioning: false, // Will be implemented in layout component
    error: context.error,
    breakpoint: context.breakpoint,
    calculateLayout: context.calculateLayout,
    setBreakpoint: context.setBreakpoint,
    recalculate: context.recalculateLayout
  }
}

// Utility functions for layout detection
function detectOptimalLayoutState(content: LessonContent): LayoutState {
  // Video gets highest priority
  if (content.video) {
    return 'video-primary'
  }
  
  // PDF as fallback when no video
  if (content.pdf) {
    return 'pdf-primary'
  }
  
  // Content with interactive elements
  if (content.content && (content.quiz || content.exercises?.length)) {
    return 'content-only'
  }
  
  // Minimal layout for basic content
  return 'minimal'
}

function determineMainComponent(content: LessonContent) {
  if (content.video) {
    return { component: 'video' as const, priority: 10, size: 'large' as const, visible: true }
  }
  
  if (content.pdf) {
    return { component: 'pdf' as const, priority: 9, size: 'large' as const, visible: true }
  }
  
  if (content.content) {
    return { component: 'content' as const, priority: 8, size: 'full' as const, visible: true }
  }
  
  return { component: 'content' as const, priority: 1, size: 'full' as const, visible: false }
}

function determineSidebarComponents(content: LessonContent) {
  const components = []
  
  if (content.quiz) {
    components.push({
      component: 'quiz' as const,
      priority: 8,
      size: 'medium' as const,
      visible: true
    })
  }
  
  if (content.materials && content.materials.length > 0) {
    components.push({
      component: 'materials' as const,
      priority: 5,
      size: 'small' as const,
      visible: true
    })
  }
  
  return components
}

function determineExercisesComponent(content: LessonContent) {
  if (content.exercises && content.exercises.length > 0) {
    return {
      component: 'exercises' as const,
      priority: 6,
      size: 'medium' as const,
      visible: true
    }
  }
  
  return {
    component: 'exercises' as const,
    priority: 0,
    size: 'medium' as const,
    visible: false
  }
}