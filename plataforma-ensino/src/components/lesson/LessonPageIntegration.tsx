'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import LessonPageRedesigned from './LessonPageRedesigned'
import { LessonProgressData } from '@/types/lesson'

// Types for existing lesson data structure (from current page.tsx)
interface Course {
  id: string
  title: string
  slug: string
}

interface Lesson {
  id: string
  course_id: string
  title: string
  slug: string
  description?: string
  video_url?: string
  video_duration?: number
  order_index: number
  content?: string
  materials: any[]
  allows_file_upload?: boolean
  is_preview: boolean
  is_published: boolean
}

interface UserProgress {
  id?: string
  lesson_id: string
  completed: boolean
  last_position: number
  watch_time: number
  completed_at?: string
}

interface LessonPageIntegrationProps {
  // Existing data from current lesson page
  course: Course
  lesson: Lesson
  progress: UserProgress | null
  exercises: any[]
  quizzes: any[]
  submissions: any[]
  quizProgress: { [key: string]: any }

  // Existing handlers
  onLessonComplete?: () => void
  onExit?: () => void

  // Additional props for integration (reserved for future use)
  // userId?: string
  // enrollmentId?: string
}

/**
 * Integration component that bridges existing lesson data with the new redesigned UI
 * This component adapts the current lesson page data structure to work with LessonPageRedesigned
 */
const LessonPageIntegration: React.FC<LessonPageIntegrationProps> = ({
  course,
  lesson,
  progress,
  exercises,
  quizzes,
  submissions,
  quizProgress,
  onLessonComplete,
  onExit
  // userId,
  // enrollmentId
}) => {
  const router = useRouter()

  // Transform existing data to match LessonPageRedesigned interface
  const adaptedLesson = useMemo(() => ({
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    course: {
      id: course.id,
      title: course.title,
      slug: course.slug
    }
  }), [lesson, course])

  // Transform existing progress data to LessonProgressData format
  const adaptedProgressData = useMemo((): LessonProgressData | null => {
    if (!progress && !quizProgress && !submissions.length) {
      return null
    }

    // Calculate video progress
    const videoPercentage = lesson.video_duration && progress?.watch_time
      ? (progress.watch_time / lesson.video_duration) * 100
      : 0

    // Calculate quiz progress
    const quizScores = Object.values(quizProgress)
    const bestQuizScore = quizScores.reduce((max: number, quiz: any) =>
      Math.max(max, quiz?.score || 0), 0
    )
    const quizCompleted = quizScores.some((quiz: any) => quiz?.isCompleted)
    const quizPassed = quizScores.some((quiz: any) => quiz?.isPassed)

    // Calculate exercise progress
    const approvedSubmissions = submissions.filter(sub => sub.status === 'approved')
    const exerciseCompletionPercentage = exercises.length > 0
      ? (approvedSubmissions.length / exercises.length) * 100
      : 0

    // Calculate overall progress
    const componentProgresses: any[] = [
      {
        component: 'video',
        percentage: videoPercentage,
        timeSpent: progress?.watch_time || 0,
        isCompleted: videoPercentage >= 90,
        weight: 0.25
      },
      {
        component: 'pdf',
        percentage: 0, // Will be updated by PDF component
        timeSpent: 0,
        isCompleted: false,
        weight: 0.25
      },
      {
        component: 'quiz',
        percentage: bestQuizScore,
        timeSpent: 0,
        isCompleted: quizCompleted,
        weight: 0.25
      },
      {
        component: 'exercises',
        percentage: exerciseCompletionPercentage,
        timeSpent: 0,
        isCompleted: exerciseCompletionPercentage >= 100,
        weight: 0.25
      }
    ]

    const overallPercentage = componentProgresses.reduce((sum, comp) =>
      sum + (comp.percentage * comp.weight), 0
    )

    return {
      videoProgress: {
        currentTime: progress?.last_position || 0,
        duration: lesson.video_duration || 0,
        percentageWatched: videoPercentage,
        watchTime: progress?.watch_time || 0,
        lastPosition: progress?.last_position || 0,
        playbackRate: 1,
        completedSegments: []
      },
      pdfProgress: {
        currentPage: 0,
        totalPages: 20, // Default, will be updated by PDF component
        percentageRead: 0,
        bookmarks: [],
        readingTime: 0,
        lastPageViewed: 0
      },
      quizProgress: {
        currentQuestion: 0,
        totalQuestions: quizzes.length,
        answeredQuestions: [],
        score: bestQuizScore,
        attempts: Object.values(quizProgress).reduce((max: number, quiz: any) =>
          Math.max(max, quiz?.attempts || 0), 0
        ),
        timeSpent: 0,
        isCompleted: quizCompleted,
        isPassed: quizPassed
      },
      exerciseProgress: {
        completedExercises: approvedSubmissions.map(sub => sub.exercise_id),
        submittedFiles: submissions.map(sub => ({
          exerciseId: sub.exercise_id,
          fileName: sub.file_name,
          fileUrl: sub.file_url || '',
          submittedAt: sub.created_at,
          status: sub.status,
          feedback: sub.feedback
        })),
        pendingReviews: submissions.filter(sub => sub.status === 'pending').map(sub => sub.id),
        totalExercises: exercises.length,
        completionPercentage: exerciseCompletionPercentage
      },
      contentProgress: {
        scrollPercentage: 0,
        readingTime: 0,
        sectionsRead: [],
        estimatedCompletionTime: 0
      },
      overallProgress: {
        percentageComplete: overallPercentage,
        estimatedTimeRemaining: 0,
        lastActivity: new Date().toISOString(),
        isCompleted: progress?.completed || false,
        completedAt: progress?.completed_at,
        componentProgress: componentProgresses
      }
    }
  }, [progress, lesson, quizProgress, submissions, exercises, quizzes])

  // Handle exit - navigate back to course
  const handleExit = useCallback(() => {
    if (onExit) {
      onExit()
    } else {
      router.push(`/course/${course.slug}`)
    }
  }, [onExit, router, course.slug])

  // Handle lesson completion
  const handleLessonComplete = useCallback(() => {
    if (onLessonComplete) {
      onLessonComplete()
    } else {
      // Default completion behavior - navigate back to course
      router.push(`/course/${course.slug}`)
    }
  }, [onLessonComplete, router, course.slug])

  return (
    <LessonPageRedesigned
      lesson={adaptedLesson}
      progressData={adaptedProgressData}
      onExit={handleExit}
      onLessonComplete={handleLessonComplete}
    />
  )
}

export default LessonPageIntegration