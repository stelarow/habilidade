'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { GridArea, LayoutState } from '@/types/lesson'
import { Breakpoint } from '@/types/lesson'

interface LessonGridProps {
  children: React.ReactNode
  layoutState: LayoutState
  breakpoint?: Breakpoint
  className?: string
}

interface GridAreaProps {
  area: GridArea
  children: React.ReactNode
  className?: string
  priority?: number
}

/**
 * LessonGrid - Responsive grid system for lesson layout
 * Part of Fase 1: Arquitetura de Layout Adaptativo
 */
export function LessonGrid({ children, layoutState, breakpoint = Breakpoint.DESKTOP, className }: LessonGridProps) {
  return (
    <div
      className={cn(
        'lesson-grid',
        `lesson-grid--${layoutState}`,
        `lesson-grid--${breakpoint}`,
        className
      )}
      data-layout={layoutState}
      data-breakpoint={breakpoint}
    >
      {children}
    </div>
  )
}

/**
 * GridArea - Individual grid area component
 */
export function GridArea({ area, children, className, priority = 0 }: GridAreaProps) {
  return (
    <div
      className={cn(
        'grid-area',
        `grid-area--${area}`,
        className
      )}
      style={{ 
        gridArea: area,
        zIndex: priority
      }}
      data-area={area}
      data-priority={priority}
    >
      {children}
    </div>
  )
}

/**
 * Layout detection hook for responsive behavior
 */
export function useResponsiveLayout() {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>(Breakpoint.DESKTOP)

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width < 768) {
        setBreakpoint(Breakpoint.MOBILE)
      } else if (width < 1024) {
        setBreakpoint(Breakpoint.TABLET)
      } else if (width < 1440) {
        setBreakpoint(Breakpoint.DESKTOP)
      } else {
        setBreakpoint(Breakpoint.LARGE)
      }
    }

    // Initial detection
    updateBreakpoint()

    // Listen for resize events
    window.addEventListener('resize', updateBreakpoint)
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

/**
 * Grid transition component for smooth layout changes
 */
interface GridTransitionProps {
  children: React.ReactNode
  isTransitioning: boolean
  duration?: number
}

export function GridTransition({ children, isTransitioning, duration = 300 }: GridTransitionProps) {
  return (
    <div
      className={cn(
        'grid-transition',
        isTransitioning && 'grid-transition--active'
      )}
      style={{
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        willChange: isTransitioning ? 'transform, opacity' : 'auto'
      }}
    >
      {children}
    </div>
  )
}

/**
 * Utility functions for grid calculations
 */
export const GridUtils = {
  /**
   * Calculate optimal column count based on content and breakpoint
   */
  getOptimalColumns: (contentCount: number, breakpoint: Breakpoint): string => {
    switch (breakpoint) {
      case Breakpoint.MOBILE:
        return '1fr'
      case Breakpoint.TABLET:
        return contentCount > 2 ? '1fr 1fr' : '1fr'
      case Breakpoint.DESKTOP:
        return contentCount > 2 ? '1fr 1fr 300px' : '1fr 1fr'
      case Breakpoint.LARGE:
        return contentCount > 2 ? '1fr 1fr 350px' : '1fr 1fr'
      default:
        return '1fr'
    }
  },

  /**
   * Generate grid areas based on layout state and breakpoint
   */
  generateGridAreas: (layoutState: LayoutState, breakpoint: Breakpoint): string[] => {
    const layouts = {
      'video-primary': {
        [Breakpoint.MOBILE]: ['"header"', '"main"', '"sidebar"', '"exercises"', '"footer"'],
        [Breakpoint.TABLET]: ['"header header"', '"main sidebar"', '"exercises exercises"', '"footer footer"'],
        [Breakpoint.DESKTOP]: ['"header header header"', '"main main sidebar"', '"exercises exercises sidebar"', '"footer footer footer"'],
        [Breakpoint.LARGE]: ['"header header header"', '"main main sidebar"', '"exercises exercises sidebar"', '"footer footer footer"']
      },
      'pdf-primary': {
        [Breakpoint.MOBILE]: ['"header"', '"main"', '"sidebar"', '"exercises"', '"footer"'],
        [Breakpoint.TABLET]: ['"header header"', '"main sidebar"', '"exercises exercises"', '"footer footer"'],
        [Breakpoint.DESKTOP]: ['"header header header"', '"main sidebar exercises"', '"footer footer footer"'],
        [Breakpoint.LARGE]: ['"header header header"', '"main sidebar exercises"', '"footer footer footer"']
      },
      'content-only': {
        [Breakpoint.MOBILE]: ['"header"', '"main"', '"sidebar"', '"footer"'],
        [Breakpoint.TABLET]: ['"header header"', '"main sidebar"', '"footer footer"'],
        [Breakpoint.DESKTOP]: ['"header header"', '"main sidebar"', '"footer footer"'],
        [Breakpoint.LARGE]: ['"header header"', '"main sidebar"', '"footer footer"']
      },
      'minimal': {
        [Breakpoint.MOBILE]: ['"header"', '"main"', '"footer"'],
        [Breakpoint.TABLET]: ['"header"', '"main"', '"footer"'],
        [Breakpoint.DESKTOP]: ['"header"', '"main"', '"footer"'],
        [Breakpoint.LARGE]: ['"header"', '"main"', '"footer"']
      }
    }

    return layouts[layoutState][breakpoint] || layouts[layoutState][Breakpoint.DESKTOP]
  },

  /**
   * Calculate component priorities for layout
   */
  calculatePriorities: (components: string[]): Record<string, number> => {
    const priorityMap = {
      video: 10,
      pdf: 9,
      quiz: 8,
      content: 7,
      exercises: 6,
      materials: 5,
      transcript: 4
    }

    return components.reduce((acc, component) => {
      acc[component] = priorityMap[component as keyof typeof priorityMap] || 0
      return acc
    }, {} as Record<string, number>)
  }
}