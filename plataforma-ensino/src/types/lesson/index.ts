// Lesson Types Export
// Part of Fase 1: Arquitetura e Fundação

// Content types
export type {
  VideoData,
  PDFData,
  ExerciseData,
  QuizData,
  MaterialData,
  LessonContent,
  ContentAvailability,
  ContentAvailabilityChecker,
  LayoutCalculation,
  LayoutCalculator
} from './content'

export {
  ContentPriority,
  type ContentPriorityMap
} from './content'

// Layout types
export type {
  LayoutState,
  GridArea,
  LayoutConfig,
  LayoutResult,
  ComponentInArea,
  LayoutProviderState,
  LayoutDetector,
  LayoutTransition,
  TransitionStage,
  LayoutPerformance,
  LayoutHookResult
} from './layout'

export {
  Breakpoint,
  GRID_TEMPLATES
} from './layout'

// Progress types
export type {
  LessonProgressData,
  TimeSegment,
  ExerciseSubmission,
  ComponentProgress,
  ProgressActions,
  ProgressPersistence,
  ProgressAnalytics,
  ProgressRecommendation,
  ProgressProviderState,
  ProgressConfig,
  ProgressEvent,
  ProgressEventHandler,
  EnhancedProgress
} from './progress'