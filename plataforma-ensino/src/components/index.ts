// Components Exports
export * from './ui';
export * from './backgrounds';
export * from './header';

// Lesson components - explicit exports to avoid conflicts
export { default as LessonPageRedesigned } from './lesson/LessonPageRedesigned'
export { default as LessonPageIntegration } from './lesson/LessonPageIntegration'
export { default as LessonHeaderRedesigned } from './lesson/LessonHeaderRedesigned'
export { default as VideoSection } from './lesson/VideoSection'
export { default as PDFSection } from './lesson/PDFSection'
export { default as PDFSectionWrapper } from './lesson/PDFSectionWrapper'
export { default as ExercisesSection } from './lesson/ExercisesSection'
export { default as QuizSection } from './lesson/QuizSection'
export { default as CompletionSection } from './lesson/CompletionSection'

// Lesson components with renamed exports to avoid conflicts
export { VideoPlayer as LessonVideoPlayerComponent } from './lesson/video/VideoPlayer'
export { PDFViewer as LessonPDFViewer } from './lesson/pdf/PDFViewer'
export { QuizInterface as LessonQuizInterface } from './lesson/quiz/QuizInterface'
export { ExercisePanel as LessonExercisePanel } from './lesson/exercises/ExercisePanel'

// Layout and Progress components
export * from './lesson/layout'
export * from './lesson/progress'

// Course Components
export { LessonVideoPlayer } from './course/LessonVideoPlayer';
export type { LessonVideoPlayerProps } from './course/LessonVideoPlayer';

// Examples (for development/documentation)
export { VideoPlayerExamples } from './examples/VideoPlayerExamples';