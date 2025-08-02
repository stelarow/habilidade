// UI Components
export { default as GradientButton } from './GradientButton';
export { default as Starfield } from './Starfield';
export { default as LogoH } from './LogoH';
export { default as Loading } from './Loading';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as VideoPlayer } from './VideoPlayer';
export { TruncatedText } from './TruncatedText';
export { default as ProgressIndicator } from './ProgressIndicator';

// React Video Player Components
export { ReactVideoPlayer } from './ReactVideoPlayer';
export { VideoPlayerWrapper } from './VideoPlayerWrapper';
export { LazyVideoPlayer } from './LazyVideoPlayer';
export { AccessibleVideoPlayer } from './AccessibleVideoPlayer';
export { SecureVideoPlayer } from './SecureVideoPlayer';

// Types
export type { VideoPlayerProps, VideoPlayerRef, VideoTrack } from './ReactVideoPlayer';
export type { VideoPlayerWrapperProps } from './VideoPlayerWrapper';
export type { LazyVideoPlayerProps } from './LazyVideoPlayer';
export type { AccessibleVideoPlayerProps } from './AccessibleVideoPlayer';
export type { TruncatedTextProps } from './TruncatedText';
export type { ProgressIndicatorProps } from './ProgressIndicator';

// Phase 1 Components - Violet Dark Theme
export { SidebarNavigation } from './sidebar-navigation'
export { EnhancedHeader } from './enhanced-header'
export { EnhancedContentArea } from './enhanced-content-area'
export { InteractiveQuiz } from './interactive-quiz'
export { 
  LinearProgress,
  CircularProgress,
  StepProgress,
  ModuleProgress,
  AchievementProgress,
  GamificationProgress
} from './enhanced-progress'

// Phase 1 Type exports
export type { 
  Module,
  Lesson,
  CourseProgress,
  SidebarNavigationProps 
} from './sidebar-navigation'

export type { 
  Breadcrumb,
  User,
  EnhancedHeaderProps 
} from './enhanced-header'

export type { 
  LessonContent,
  ContentData,
  NavigationInfo,
  EnhancedContentAreaProps 
} from './enhanced-content-area'

export type { 
  Quiz,
  Question,
  QuestionResult,
  QuizResults,
  InteractiveQuizProps 
} from './interactive-quiz'

export type { 
  LinearProgressProps,
  CircularProgressProps,
  StepProgressProps,
  StepItem,
  ModuleProgressProps,
  AchievementProgressProps,
  GamificationProgressProps 
} from './enhanced-progress'