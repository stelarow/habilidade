import { LessonProgressData } from '@/types/lesson'

// Test data generators
export const createMockLessonProgressData = (overrides?: Partial<LessonProgressData>): LessonProgressData => ({
  videoProgress: {
    currentTime: 0,
    duration: 600,
    percentageWatched: 0,
    watchTime: 0,
    lastPosition: 0,
    playbackRate: 1,
    completedSegments: []
  },
  pdfProgress: {
    currentPage: 1,
    totalPages: 20,
    percentageRead: 0,
    bookmarks: [],
    readingTime: 0,
    lastPageViewed: 1
  },
  quizProgress: {
    currentQuestion: 0,
    totalQuestions: 5,
    answeredQuestions: [],
    score: 0,
    attempts: 0,
    timeSpent: 0,
    isCompleted: false,
    isPassed: false
  },
  exerciseProgress: {
    completedExercises: [],
    submittedFiles: [],
    pendingReviews: [],
    totalExercises: 3,
    completionPercentage: 0
  },
  contentProgress: {
    scrollPercentage: 0,
    readingTime: 0,
    sectionsRead: [],
    estimatedCompletionTime: 1800
  },
  overallProgress: {
    percentageComplete: 0,
    estimatedTimeRemaining: 1800,
    lastActivity: 'video',
    isCompleted: false,
    componentProgress: []
  },
  ...overrides
})

export const createMockLesson = () => ({
  id: 'test-lesson-1',
  title: 'Introdução ao React',
  slug: 'introducao-react',
  course: {
    id: 'test-course-1',
    title: 'Curso de React Completo',
    slug: 'react-completo'
  }
})

// Progress validation utilities
export const validateProgressData = (progress: LessonProgressData): string[] => {
  const errors: string[] = []

  // Validate video progress
  if (progress.videoProgress.percentageWatched < 0 || progress.videoProgress.percentageWatched > 100) {
    errors.push('Video percentage watched must be between 0 and 100')
  }

  if (progress.videoProgress.currentTime > progress.videoProgress.duration) {
    errors.push('Video current time cannot exceed duration')
  }

  // Validate PDF progress
  if (progress.pdfProgress.percentageRead < 0 || progress.pdfProgress.percentageRead > 100) {
    errors.push('PDF percentage read must be between 0 and 100')
  }

  if (progress.pdfProgress.currentPage > progress.pdfProgress.totalPages) {
    errors.push('PDF current page cannot exceed total pages')
  }

  // Validate quiz progress
  if (progress.quizProgress.score < 0 || progress.quizProgress.score > 100) {
    errors.push('Quiz score must be between 0 and 100')
  }

  if (progress.quizProgress.currentQuestion > progress.quizProgress.totalQuestions) {
    errors.push('Quiz current question cannot exceed total questions')
  }

  // Validate exercise progress
  if (progress.exerciseProgress.completionPercentage < 0 || progress.exerciseProgress.completionPercentage > 100) {
    errors.push('Exercise completion percentage must be between 0 and 100')
  }

  // Validate overall progress
  if (progress.overallProgress.percentageComplete < 0 || progress.overallProgress.percentageComplete > 100) {
    errors.push('Overall progress percentage must be between 0 and 100')
  }

  return errors
}

// Completion criteria testing
export const checkCompletionCriteria = (progress: LessonProgressData) => {
  const criteria = {
    videoWatched: progress.videoProgress.percentageWatched >= 80,
    pdfRead: progress.pdfProgress.percentageRead >= 70,
    quizPassed: progress.quizProgress.isCompleted && progress.quizProgress.isPassed,
    exercisesCompleted: progress.exerciseProgress.completionPercentage >= 100,
    minimumTimeSpent: progress.contentProgress.readingTime >= 300 // 5 minutes
  }

  const completedCriteria = Object.values(criteria).filter(Boolean).length
  const totalCriteria = Object.keys(criteria).length
  const canComplete = completedCriteria >= Math.ceil(totalCriteria * 0.8) // 80% of criteria

  return {
    criteria,
    completedCriteria,
    totalCriteria,
    canComplete,
    completionPercentage: (completedCriteria / totalCriteria) * 100
  }
}

// Performance testing utilities
export const measureComponentRenderTime = async (renderFn: () => Promise<void> | void) => {
  const start = performance.now()
  await renderFn()
  const end = performance.now()
  return end - start
}

export const simulateUserInteractions = {
  playVideo: (duration: number = 1000) => new Promise(resolve => setTimeout(resolve, duration)),
  
  readPDF: (pages: number = 5, timePerPage: number = 2000) => 
    new Promise(resolve => setTimeout(resolve, pages * timePerPage)),
  
  answerQuiz: (questions: number = 5, timePerQuestion: number = 3000) =>
    new Promise(resolve => setTimeout(resolve, questions * timePerQuestion)),
  
  uploadFiles: (fileCount: number = 3, timePerFile: number = 1500) =>
    new Promise(resolve => setTimeout(resolve, fileCount * timePerFile))
}

// Error simulation for testing error handling
export const simulateErrors = {
  networkError: () => {
    throw new Error('Network request failed')
  },
  
  validationError: (field: string) => {
    throw new Error(`Validation failed for field: ${field}`)
  },
  
  timeoutError: () => {
    throw new Error('Request timeout')
  },
  
  permissionError: () => {
    throw new Error('Permission denied')
  }
}

// Test scenarios
export const testScenarios = {
  // Complete lesson successfully
  successfulCompletion: createMockLessonProgressData({
    videoProgress: {
      currentTime: 480,
      duration: 600,
      percentageWatched: 80,
      watchTime: 480,
      lastPosition: 480,
      playbackRate: 1,
      completedSegments: [{ start: 0, end: 480, watchCount: 1 }]
    },
    pdfProgress: {
      currentPage: 20,
      totalPages: 20,
      percentageRead: 100,
      bookmarks: [5, 10, 15],
      readingTime: 600,
      lastPageViewed: 20
    },
    quizProgress: {
      currentQuestion: 5,
      totalQuestions: 5,
      answeredQuestions: [0, 1, 2, 3, 4],
      score: 85,
      attempts: 1,
      timeSpent: 300,
      isCompleted: true,
      isPassed: true
    },
    exerciseProgress: {
      completedExercises: ['ex1', 'ex2', 'ex3'],
      submittedFiles: [],
      pendingReviews: [],
      totalExercises: 3,
      completionPercentage: 100
    },
    overallProgress: {
      percentageComplete: 90,
      estimatedTimeRemaining: 0,
      lastActivity: 'completion',
      isCompleted: true,
      completedAt: new Date().toISOString(),
      componentProgress: []
    }
  }),

  // Partial progress
  partialProgress: createMockLessonProgressData({
    videoProgress: {
      currentTime: 300,
      duration: 600,
      percentageWatched: 50,
      watchTime: 300,
      lastPosition: 300,
      playbackRate: 1,
      completedSegments: [{ start: 0, end: 300, watchCount: 1 }]
    },
    pdfProgress: {
      currentPage: 10,
      totalPages: 20,
      percentageRead: 50,
      bookmarks: [5],
      readingTime: 300,
      lastPageViewed: 10
    },
    overallProgress: {
      percentageComplete: 40,
      estimatedTimeRemaining: 900,
      lastActivity: 'video',
      isCompleted: false,
      componentProgress: []
    }
  }),

  // No progress
  noProgress: createMockLessonProgressData()
}

// Accessibility testing helpers
export const accessibilityChecks = {
  checkFocusManagement: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    return Array.from(focusableElements).every(el => 
      el.getAttribute('tabindex') !== '-1' || el.hasAttribute('aria-hidden')
    )
  },

  checkAriaLabels: (container: HTMLElement) => {
    const interactiveElements = container.querySelectorAll('button, input, select, textarea')
    return Array.from(interactiveElements).every(el => 
      el.hasAttribute('aria-label') || 
      el.hasAttribute('aria-labelledby') || 
      el.textContent?.trim()
    )
  },

  checkColorContrast: (element: HTMLElement) => {
    // This would require a more sophisticated implementation
    // For now, just check if text is visible
    const styles = window.getComputedStyle(element)
    return styles.color !== styles.backgroundColor
  }
}

const lessonTestUtils = {
  createMockLessonProgressData,
  createMockLesson,
  validateProgressData,
  checkCompletionCriteria,
  measureComponentRenderTime,
  simulateUserInteractions,
  simulateErrors,
  testScenarios,
  accessibilityChecks
}

export default lessonTestUtils