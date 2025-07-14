'use client'

import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { LessonContent, LayoutState, Breakpoint, GRID_TEMPLATES } from '@/types/lesson'
import { useLessonLayout } from './LayoutProvider'

interface LessonContainerProps {
  content: LessonContent
  children: React.ReactNode
  className?: string
}

/**
 * LessonContainer - Main adaptive container for lesson pages
 * Part of Fase 1: Arquitetura e Fundação
 * 
 * This component:
 * - Automatically detects available content types
 * - Calculates optimal layout based on content
 * - Applies responsive grid system
 * - Handles smooth transitions between layout states
 */
export function LessonContainer({ content, children, className }: LessonContainerProps) {
  const { layout, isTransitioning, recalculate } = useLessonLayout()

  // Calculate optimal layout state based on content
  const layoutState = useMemo((): LayoutState => {
    // Video gets highest priority
    if (content.video) {
      return 'video-primary'
    }
    
    // PDF as fallback when no video
    if (content.pdf) {
      return 'pdf-primary'
    }
    
    // Content with quiz/exercises
    if (content.content && (content.quiz || content.exercises?.length)) {
      return 'content-only'
    }
    
    // Minimal layout for basic content
    return 'minimal'
  }, [content])

  // Get grid configuration for current layout
  const gridConfig = useMemo(() => {
    return GRID_TEMPLATES[layoutState]
  }, [layoutState])

  // Generate CSS custom properties for grid
  const gridStyles = useMemo(() => {
    const config = gridConfig.gridTemplate
    return {
      '--grid-template-areas': config.areas.join(' '),
      '--grid-template-columns': config.columns,
      '--grid-template-rows': config.rows,
      '--grid-gap': gridConfig.spacing.gap,
      '--grid-padding': gridConfig.spacing.padding,
    } as React.CSSProperties
  }, [gridConfig])

  // Recalculate layout when content changes
  React.useEffect(() => {
    recalculate()
  }, [content, recalculate])

  return (
    <div
      className={cn(
        'lesson-container',
        `layout-${layoutState}`,
        isTransitioning && 'layout-transitioning',
        className
      )}
      style={gridStyles}
      data-layout-state={layoutState}
      data-content-types={[
        content.video && 'video',
        content.pdf && 'pdf', 
        content.quiz && 'quiz',
        content.exercises?.length && 'exercises',
        content.content && 'content',
        content.materials?.length && 'materials'
      ].filter(Boolean).join(',')}
    >
      {children}
    </div>
  )
}

// Layout detection utilities
export function detectContentAvailability(content: LessonContent) {
  return {
    hasVideo: !!content.video,
    hasPDF: !!content.pdf,
    hasQuiz: !!content.quiz,
    hasExercises: !!(content.exercises && content.exercises.length > 0),
    hasContent: !!content.content,
    hasMaterials: !!(content.materials && content.materials.length > 0),
    hasTranscript: !!content.transcript
  }
}

export function calculateLayoutPriorities(content: LessonContent) {
  const availability = detectContentAvailability(content)
  const components = []

  // Video gets highest priority
  if (availability.hasVideo) {
    components.push({ component: 'video', priority: 10, area: 'main' })
  }

  // PDF as primary content when no video
  if (availability.hasPDF && !availability.hasVideo) {
    components.push({ component: 'pdf', priority: 9, area: 'main' })
  }

  // Text content when no media
  if (availability.hasContent && !availability.hasVideo && !availability.hasPDF) {
    components.push({ component: 'content', priority: 8, area: 'main' })
  }

  // Quiz in sidebar or inline
  if (availability.hasQuiz) {
    const area = availability.hasVideo || availability.hasPDF ? 'sidebar' : 'main'
    components.push({ component: 'quiz', priority: 7, area })
  }

  // Exercises below main content or in sidebar
  if (availability.hasExercises) {
    const area = availability.hasVideo ? 'exercises' : 'sidebar'
    components.push({ component: 'exercises', priority: 6, area })
  }

  // Materials in sidebar
  if (availability.hasMaterials) {
    components.push({ component: 'materials', priority: 5, area: 'sidebar' })
  }

  return components.sort((a, b) => b.priority - a.priority)
}