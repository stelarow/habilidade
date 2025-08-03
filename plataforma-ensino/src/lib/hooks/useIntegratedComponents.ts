import { useState, useCallback, useMemo, useEffect } from 'react'
import { useAuth, useCourseProgress, useUpdateProgress, useUserPreferences, useGamificationStats } from './useSupabase'
import { useRealTimeProgress, useRealTimeNotifications, useRealTimeAchievements } from './useRealtime'
import type { Module, Lesson, CourseProgress } from '@/components/ui/sidebar-navigation'
import type { Question as QuizQuestion, QuizState } from '@/components/ui/interactive-quiz'
import type { LessonWithProgress } from '@/types/phase1-components'

/**
 * Integrated hook for sidebar navigation with real-time data
 */
export function useIntegratedSidebar(courseId: string) {
  const { user } = useAuth()
  const { data: courseData, isLoading, error } = useCourseProgress(courseId)
  const { mutate: updateProgress } = useUpdateProgress()
  const realTimeProgress = useRealTimeProgress(user?.id || '', courseId)

  // Transform API data to sidebar component format
  const courseStructure: Module[] = useMemo(() => {
    if (!courseData?.lessons) return []

    // Group lessons by module (assuming lessons have module_id or order_index grouping)
    const modulesMap = new Map<string, Lesson[]>()
    
    courseData.lessons.forEach((lessonData: LessonWithProgress) => {
      const lesson = lessonData.lesson
      const progress = lessonData.progress
      
      // Create module ID based on lesson order (every 5 lessons = 1 module)
      const moduleIndex = Math.floor((lesson.order_index - 1) / 5) + 1
      const moduleId = `module-${moduleIndex}`
      
      if (!modulesMap.has(moduleId)) {
        modulesMap.set(moduleId, [])
      }
      
      const transformedLesson: Lesson = {
        id: lesson.id,
        title: lesson.title,
        type: getContentType(lesson),
        duration: formatDuration(lesson.video_duration),
        isCompleted: progress?.completed || false,
        isLocked: !progress?.is_unlocked && !lesson.is_preview
      }
      
      modulesMap.get(moduleId)!.push(transformedLesson)
    })

    // Convert map to modules array
    return Array.from(modulesMap.entries()).map(([moduleId, lessons], index) => {
      const completedLessons = lessons.filter((l: Lesson) => l.isCompleted).length
      const progress = Math.round((completedLessons / lessons.length) * 100)
      
      return {
        id: moduleId,
        title: `Módulo ${index + 1}`,
        description: `${lessons.length} lições`,
        lessons,
        progress,
        isCompleted: progress === 100,
        estimatedTime: formatTotalDuration(lessons)
      }
    })
  }, [courseData])

  const courseProgress: CourseProgress = useMemo(() => {
    if (!courseData) return {
      totalLessons: 0,
      completedLessons: 0,
      currentStreak: 0,
      totalTimeSpent: '0 min'
    }

    return {
      totalLessons: courseData.stats.total_lessons,
      completedLessons: courseData.stats.completed_lessons,
      currentStreak: 0, // This would come from gamification stats
      totalTimeSpent: formatTimeSpent(courseData.stats.total_study_time)
    }
  }, [courseData])

  const handleLessonSelect = useCallback((lessonId: string) => {
    if (!courseData?.enrollment) return

    // Update progress when lesson is selected
    updateProgress({
      lessonId,
      enrollmentId: courseData.enrollment.id,
      lastPosition: 0
    })

    // Navigate to lesson (this would be handled by parent component)
    const event = new CustomEvent('lessonSelected', {
      detail: { lessonId, courseId }
    })
    window.dispatchEvent(event)
  }, [courseData, updateProgress, courseId])

  return {
    courseStructure,
    courseProgress,
    isLoading,
    error,
    onLessonSelect: handleLessonSelect
  }
}

/**
 * Integrated hook for enhanced header with real-time data
 */
export function useIntegratedHeader(courseId: string, lessonId?: string) {
  const { user } = useAuth()
  const { data: courseData } = useCourseProgress(courseId)
  const { data: gamificationStats } = useGamificationStats()
  const { notifications, unreadCount } = useRealTimeNotifications(user?.id || '')
  const { preferences } = useUserPreferences()

  const breadcrumbs = useMemo(() => {
    if (!courseData || !lessonId) return []

    const currentLesson = courseData.lessons.find((l: LessonWithProgress) => l.lesson.id === lessonId)
    if (!currentLesson) return []

    return [
      { label: 'Cursos', href: '/dashboard', isActive: false },
      { label: 'Curso Atual', href: `/courses/${courseId}`, isActive: false },
      { label: currentLesson.lesson.title, href: '#', isActive: true }
    ]
  }, [courseData, courseId, lessonId])

  const progressData = useMemo(() => {
    if (!courseData) return { percentage: 0, current: 0, total: 0 }

    return {
      percentage: courseData.stats.progress_percentage,
      current: courseData.stats.completed_lessons,
      total: courseData.stats.total_lessons
    }
  }, [courseData])

  const userProfile = useMemo(() => {
    if (!user || !gamificationStats) return null

    return {
      name: user.user_metadata?.full_name || user.email,
      email: user.email,
      avatar: user.user_metadata?.avatar_url,
      level: gamificationStats.current_level,
      xp: gamificationStats.total_xp,
      xpToNext: gamificationStats.xp_to_next_level
    }
  }, [user, gamificationStats])

  return {
    breadcrumbs,
    progressData,
    userProfile,
    notifications: notifications.slice(0, 5), // Show only recent 5
    unreadCount,
    theme: preferences?.theme || 'violet-dark'
  }
}

/**
 * Integrated hook for content area with progress tracking
 */
export function useIntegratedContentArea(lessonId: string, courseId: string) {
  const { data: courseData } = useCourseProgress(courseId)
  const { mutate: updateProgress } = useUpdateProgress()
  const [currentPosition, setCurrentPosition] = useState(0)
  const [watchTime, setWatchTime] = useState(0)

  const lessonData = useMemo(() => {
    if (!courseData?.lessons) return null
    return courseData.lessons.find((l: LessonWithProgress) => l.lesson.id === lessonId)
  }, [courseData, lessonId])

  const handleProgressUpdate = useCallback((position: number, duration?: number) => {
    setCurrentPosition(position)
    
    if (!lessonData) return

    const progressPercentage = duration ? Math.round((position / duration) * 100) : 0
    const isCompleted = progressPercentage >= 90 // Mark as completed at 90%

    updateProgress({
      lessonId,
      enrollmentId: courseData?.enrollment.id || '',
      lastPosition: position,
      progressPercentage,
      completed: isCompleted,
      watchTime: Math.round(watchTime / 60) // Convert to minutes
    })
  }, [lessonData, lessonId, courseData, updateProgress, watchTime])

  const handleWatchTimeUpdate = useCallback((time: number) => {
    setWatchTime(prev => prev + time)
  }, [])

  const navigationData = useMemo(() => {
    if (!courseData?.lessons) return { prev: null, next: null }

    const currentIndex = courseData.lessons.findIndex((l: LessonWithProgress) => l.lesson.id === lessonId)
    if (currentIndex === -1) return { prev: null, next: null }

    const prevLesson = currentIndex > 0 ? courseData.lessons[currentIndex - 1] : null
    const nextLesson = currentIndex < courseData.lessons.length - 1 ? courseData.lessons[currentIndex + 1] : null

    return {
      prev: prevLesson ? {
        id: prevLesson.lesson.id,
        title: prevLesson.lesson.title,
        isLocked: !prevLesson.progress?.is_unlocked
      } : null,
      next: nextLesson ? {
        id: nextLesson.lesson.id,
        title: nextLesson.lesson.title,
        isLocked: !nextLesson.progress?.is_unlocked
      } : null
    }
  }, [courseData, lessonId])

  return {
    lessonData,
    currentPosition,
    watchTime: Math.round(watchTime / 60), // In minutes
    navigationData,
    onProgressUpdate: handleProgressUpdate,
    onWatchTimeUpdate: handleWatchTimeUpdate
  }
}

/**
 * Integrated hook for quiz component with submission and feedback
 */
export function useIntegratedQuiz(quizId: string, enrollmentId: string) {
  const [quizState, setQuizState] = useState<QuizState>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeSpent, setTimeSpent] = useState(0)
  const [quizResult, setQuizResult] = useState<{
    score: number
    percentage: number
    passed: boolean
    correctAnswers: number
    totalQuestions: number
    timeTaken: number
  } | null>(null)

  // This would typically fetch quiz data from API
  const [quizData, setQuizData] = useState<{
    id: string
    title: string
    description: string
    questions: QuizQuestion[]
    passingScore: number
  } | null>(null)

  const handleAnswerSelect = useCallback((questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!quizData) return

    try {
      const submission = {
        quiz_id: quizId,
        enrollment_id: enrollmentId,
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          question_id: questionId,
          selected_answer: selectedAnswer.toString(),
          time_taken_seconds: Math.round(timeSpent / quizData.questions.length)
        })),
        total_time_seconds: timeSpent,
        started_at: new Date(Date.now() - timeSpent * 1000).toISOString(),
        completed_at: new Date().toISOString()
      }

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      })

      if (response.ok) {
        const result = await response.json()
        setQuizResult(result)
        setQuizState('results')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
    }
  }, [quizData, quizId, enrollmentId, answers, timeSpent])

  // Load quiz data on mount
  useEffect(() => {
    // This would fetch quiz data from API
    // For now, using mock data structure
    setQuizData({
      id: quizId,
      title: 'Quiz de Conhecimentos',
      description: 'Teste seus conhecimentos sobre o conteúdo da lição',
      questions: [], // Would be populated from API
      passingScore: 70
    })
  }, [quizId])

  return {
    quizState,
    currentQuestion,
    answers,
    timeSpent,
    quizResult,
    quizData,
    onAnswerSelect: handleAnswerSelect,
    onSubmit: handleSubmit,
    onStateChange: setQuizState,
    onQuestionChange: setCurrentQuestion,
    onTimeUpdate: setTimeSpent
  }
}

/**
 * Integrated hook for progress indicators with real-time updates
 */
export function useIntegratedProgress(courseId: string) {
  const { data: courseData } = useCourseProgress(courseId)
  const { data: gamificationStats } = useGamificationStats()
  const { newAchievements } = useRealTimeAchievements(courseData?.enrollment.user_id || '')

  const progressData = useMemo(() => {
    if (!courseData || !gamificationStats) return null

    return {
      course: {
        percentage: courseData.stats.progress_percentage,
        completed: courseData.stats.completed_lessons,
        total: courseData.stats.total_lessons
      },
      gamification: {
        level: gamificationStats.current_level,
        xp: gamificationStats.total_xp,
        xpToNext: gamificationStats.xp_to_next_level,
        streak: gamificationStats.current_streak
      },
      achievements: newAchievements
    }
  }, [courseData, gamificationStats, newAchievements])

  return progressData
}

// Helper functions
function getContentType(lesson: {
  video_duration?: number
  quiz_id?: string
  assignment_id?: string
}): 'video' | 'text' | 'quiz' | 'assignment' {
  if (lesson.video_duration) return 'video'
  if (lesson.quiz_id) return 'quiz'
  if (lesson.assignment_id) return 'assignment'
  return 'text'
}

function formatDuration(seconds?: number): string {
  if (!seconds) return ''
  const minutes = Math.round(seconds / 60)
  return `${minutes} min`
}

function formatTotalDuration(lessons: Lesson[]): string {
  // This would calculate total estimated time for all lessons
  return `~${lessons.length * 15} min` // Assuming 15 min average per lesson
}

function formatTimeSpent(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}