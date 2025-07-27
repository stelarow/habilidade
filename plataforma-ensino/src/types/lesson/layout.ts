// Layout System Types for Adaptive Lesson Pages
// Part of Fase 1: Arquitetura e Fundação

import type { LessonContent } from './content'

// Layout States as defined in the checklist
export type LayoutState = 
  | 'video-primary'    // Video + sidebar + exercises below
  | 'pdf-primary'      // PDF + sidebar + exercises lateral  
  | 'content-only'     // Text + quiz inline + exercises
  | 'minimal'          // Only text and materials

// Grid areas for CSS Grid Layout
export type GridArea = 
  | 'header'
  | 'main'
  | 'sidebar'
  | 'exercises'
  | 'footer'
  | 'secondary'

// Responsive breakpoints
export enum Breakpoint {
  MOBILE = 'mobile',     // 320px - 768px
  TABLET = 'tablet',     // 768px - 1024px
  DESKTOP = 'desktop',   // 1024px - 1440px
  LARGE = 'large'        // 1440px+
}

// Layout configuration for each state
export interface LayoutConfig {
  state: LayoutState
  gridTemplate: {
    areas: string[]
    columns: string
    rows: string
  }
  responsiveConfig: Record<Breakpoint, {
    areas: string[]
    columns: string
    rows: string
  }>
  spacing: {
    gap: string
    padding: string
  }
}

// Dynamic layout calculation result
export interface LayoutResult {
  state: LayoutState
  config: LayoutConfig
  components: {
    header: boolean
    main: ComponentInArea
    sidebar: ComponentInArea[]
    exercises: ComponentInArea
    footer: boolean
  }
  responsive: Record<Breakpoint, LayoutConfig>
}

export interface ComponentInArea {
  component: 'video' | 'pdf' | 'quiz' | 'exercises' | 'content' | 'materials' | 'transcript'
  priority: number
  size?: 'small' | 'medium' | 'large' | 'full'
  visible: boolean
}

// Layout provider state
export interface LayoutProviderState {
  currentLayout: LayoutResult
  isLoading: boolean
  error: string | null
  breakpoint: Breakpoint
  
  // Actions
  calculateLayout: (content: LessonContent) => void
  setBreakpoint: (breakpoint: Breakpoint) => void
  recalculateLayout: () => void
}

// Layout detection and calculation
export interface LayoutDetector {
  detectOptimalLayout: (content: LessonContent) => LayoutState
  calculateGridConfig: (state: LayoutState, breakpoint: Breakpoint) => LayoutConfig
  getComponentPriorities: (content: LessonContent) => ComponentInArea[]
}

// Transition states for smooth layout changes
export interface LayoutTransition {
  from: LayoutState
  to: LayoutState
  duration: number
  easing: string
  stages: TransitionStage[]
}

export interface TransitionStage {
  progress: number // 0-1
  gridConfig: Partial<LayoutConfig>
  componentStates: Record<string, {
    opacity: number
    transform: string
    visible: boolean
  }>
}

// Performance monitoring for layout changes
export interface LayoutPerformance {
  calculationTime: number
  renderTime: number
  transitionTime: number
  totalComponents: number
  visibleComponents: number
}

// Layout hooks and utilities
export interface LayoutHookResult {
  layout: LayoutResult
  isTransitioning: boolean
  performance: LayoutPerformance
  recalculate: () => void
  setBreakpoint: (bp: Breakpoint) => void
}

// CSS Grid template definitions
export const GRID_TEMPLATES: Record<LayoutState, LayoutConfig> = {
  'video-primary': {
    state: 'video-primary',
    gridTemplate: {
      areas: [
        '"header header header"',
        '"main main sidebar"', 
        '"exercises exercises sidebar"',
        '"footer footer footer"'
      ],
      columns: '1fr 1fr 300px',
      rows: 'auto 1fr auto auto'
    },
    responsiveConfig: {
      [Breakpoint.MOBILE]: {
        areas: ['"header"', '"main"', '"sidebar"', '"exercises"', '"footer"'],
        columns: '1fr',
        rows: 'auto auto auto auto auto'
      },
      [Breakpoint.TABLET]: {
        areas: ['"header header"', '"main sidebar"', '"exercises exercises"', '"footer footer"'],
        columns: '2fr 1fr',
        rows: 'auto 1fr auto auto'
      },
      [Breakpoint.DESKTOP]: {
        areas: ['"header header header"', '"main main sidebar"', '"exercises exercises sidebar"', '"footer footer footer"'],
        columns: '1fr 1fr 300px',
        rows: 'auto 1fr auto auto'
      },
      [Breakpoint.LARGE]: {
        areas: ['"header header header"', '"main main sidebar"', '"exercises exercises sidebar"', '"footer footer footer"'],
        columns: '1fr 1fr 350px',
        rows: 'auto 1fr auto auto'
      }
    },
    spacing: {
      gap: '2rem',
      padding: '1rem'
    }
  },
  'pdf-primary': {
    state: 'pdf-primary',
    gridTemplate: {
      areas: [
        '"header header header"',
        '"main sidebar exercises"',
        '"footer footer footer"'
      ],
      columns: '2fr 300px 1fr',
      rows: 'auto 1fr auto'
    },
    responsiveConfig: {
      [Breakpoint.MOBILE]: {
        areas: ['"header"', '"main"', '"sidebar"', '"exercises"', '"footer"'],
        columns: '1fr',
        rows: 'auto 1fr auto auto auto'
      },
      [Breakpoint.TABLET]: {
        areas: ['"header header"', '"main sidebar"', '"exercises exercises"', '"footer footer"'],
        columns: '2fr 1fr',
        rows: 'auto 1fr auto auto'
      },
      [Breakpoint.DESKTOP]: {
        areas: ['"header header header"', '"main sidebar exercises"', '"footer footer footer"'],
        columns: '2fr 300px 1fr',
        rows: 'auto 1fr auto'
      },
      [Breakpoint.LARGE]: {
        areas: ['"header header header"', '"main sidebar exercises"', '"footer footer footer"'],
        columns: '2fr 350px 1fr',
        rows: 'auto 1fr auto'
      }
    },
    spacing: {
      gap: '2rem',
      padding: '1rem'
    }
  },
  'content-only': {
    state: 'content-only',
    gridTemplate: {
      areas: [
        '"header header"',
        '"main sidebar"',
        '"footer footer"'
      ],
      columns: '2fr 1fr',
      rows: 'auto 1fr auto'
    },
    responsiveConfig: {
      [Breakpoint.MOBILE]: {
        areas: ['"header"', '"main"', '"sidebar"', '"footer"'],
        columns: '1fr',
        rows: 'auto 1fr auto auto'
      },
      [Breakpoint.TABLET]: {
        areas: ['"header header"', '"main sidebar"', '"footer footer"'],
        columns: '2fr 1fr',
        rows: 'auto 1fr auto'
      },
      [Breakpoint.DESKTOP]: {
        areas: ['"header header"', '"main sidebar"', '"footer footer"'],
        columns: '2fr 1fr',
        rows: 'auto 1fr auto'
      },
      [Breakpoint.LARGE]: {
        areas: ['"header header"', '"main sidebar"', '"footer footer"'],
        columns: '2fr 1fr',
        rows: 'auto 1fr auto'
      }
    },
    spacing: {
      gap: '1.5rem',
      padding: '1rem'
    }
  },
  'minimal': {
    state: 'minimal',
    gridTemplate: {
      areas: [
        '"header"',
        '"main"',
        '"footer"'
      ],
      columns: '1fr',
      rows: 'auto 1fr auto'
    },
    responsiveConfig: {
      [Breakpoint.MOBILE]: {
        areas: ['"header"', '"main"', '"footer"'],
        columns: '1fr',
        rows: 'auto 1fr auto'
      },
      [Breakpoint.TABLET]: {
        areas: ['"header"', '"main"', '"footer"'],
        columns: '1fr',
        rows: 'auto 1fr auto'
      },
      [Breakpoint.DESKTOP]: {
        areas: ['"header"', '"main"', '"footer"'],
        columns: '1fr',
        rows: 'auto 1fr auto'
      },
      [Breakpoint.LARGE]: {
        areas: ['"header"', '"main"', '"footer"'],
        columns: '1fr',
        rows: 'auto 1fr auto'
      }
    },
    spacing: {
      gap: '1rem',
      padding: '1rem'
    }
  }
}