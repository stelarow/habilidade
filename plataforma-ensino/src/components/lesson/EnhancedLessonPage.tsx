'use client'

import React, { useState, useCallback } from 'react'
import { LessonHeader } from './header/LessonHeader'
import { EnhancedLessonCompletion } from './completion/EnhancedLessonCompletion'
import { LessonProgressData } from '@/types/lesson'
import { cn } from '@/lib/utils'

interface EnhancedLessonPageProps {
  lesson: {
    id: string
    title: string
    slug: string
    course: {
      id: string
      title: string
      slug: string
    }
  }
  progressData: LessonProgressData | null
  onExit?: () => void
  onLessonComplete?: () => void
  className?: string
  children?: React.ReactNode
}

/**
 * EnhancedLessonPage - Complete lesson page with integrated completion flow
 * 
 * Features:
 * - Integrated lesson header with progress indicators
 * - Enhanced completion flow with celebration animations
 * - Comprehensive error handling and user feedback
 * - Automatic navigation after completion
 * - Loading states and visual feedback
 * - MagicUI celebration effects
 */
export const EnhancedLessonPage: React.FC<EnhancedLessonPageProps> = ({
  lesson,
  progressData,
  onExit,
  onLessonComplete,
  className,
  children
}) => {
  const [completionState, setCompletionState] = useState({
    isCompleting: false,
    error: null as string | null
  })

  // Handle lesson completion success
  const handleCompletionSuccess = useCallback(() => {
    console.log('✅ Lesson completed successfully!')
    onLessonComplete?.()
  }, [onLessonComplete])

  // Handle lesson completion error
  const handleCompletionError = useCallback((error: Error) => {
    console.error('❌ Lesson completion failed:', error)
    setCompletionState(prev => ({
      ...prev,
      error: error.message
    }))
  }, [])

  // Handle exit
  const handleExit = useCallback(() => {
    console.log('🚪 Exiting lesson')
    onExit?.()
  }, [onExit])

  return (
    <div className={cn("min-h-screen bg-gray-900", className)}>
      {/* Enhanced Lesson Completion Wrapper */}
      <EnhancedLessonCompletion
        lessonId={lesson.id}
        courseSlug={lesson.course.slug}
        lessonTitle={lesson.title}
        courseTitle={lesson.course.title}
        progressData={progressData}
        onSuccess={handleCompletionSuccess}
        onError={handleCompletionError}
      >
        {({ completeLesson, isCompleting, error, canComplete }) => (
          <>
            {/* Lesson Header with Integrated Completion */}
            <LessonHeader
              course={{
                title: lesson.course.title,
                slug: lesson.course.slug
              }}
              lesson={{
                title: lesson.title,
                slug: lesson.slug
              }}
              progressData={progressData}
              onExit={handleExit}
              onComplete={async () => {
                setCompletionState(prev => ({ ...prev, isCompleting: true }))
                try {
                  await completeLesson()
                } finally {
                  setCompletionState(prev => ({ ...prev, isCompleting: false }))
                }
              }}
            />

            {/* Main Lesson Content */}
            <main className="relative">
              {/* Loading Overlay for Lesson Content */}
              {isCompleting && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 pointer-events-none" />
              )}
              
              {/* Lesson Content */}
              <div className={cn(
                "transition-opacity duration-300",
                isCompleting && "opacity-50"
              )}>
                {children}
              </div>
            </main>

            {/* Development Helper - Show Completion Status */}
            {process.env.NODE_ENV === 'development' && (
              <div className="fixed bottom-4 right-4 z-20">
                <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-lg p-3 text-xs space-y-2 max-w-xs">
                  <div className="font-semibold text-white">
                    🔧 Completion Status
                  </div>
                  
                  <div className="space-y-1 text-gray-300">
                    <div className="flex justify-between">
                      <span>Can Complete:</span>
                      <span className={canComplete ? 'text-green-400' : 'text-red-400'}>
                        {canComplete ? '✅' : '❌'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Is Completing:</span>
                      <span className={isCompleting ? 'text-yellow-400' : 'text-gray-400'}>
                        {isCompleting ? '⏳' : '⏸️'}
                      </span>
                    </div>
                    
                    {error && (
                      <div className="text-red-400 text-[10px] mt-2 p-2 bg-red-900/20 rounded border border-red-500/30">
                        <div className="font-semibold mb-1">Error:</div>
                        <div className="break-words">
                          {error.length > 50 ? `${error.substring(0, 50)}...` : error}
                        </div>
                      </div>
                    )}
                    
                    {progressData && (
                      <div className="mt-2 pt-2 border-t border-gray-600">
                        <div className="text-[10px] space-y-1">
                          <div>Time: {Math.floor((progressData.videoProgress?.watchTime || 0) / 60)}min</div>
                          <div>PDF: {Math.round(progressData.pdfProgress?.percentageRead || 0)}%</div>
                          <div>Quiz: {Math.round(progressData.quizProgress?.score || 0)}%</div>
                          <div>Exercises: {Math.round(progressData.exerciseProgress?.completionPercentage || 0)}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </EnhancedLessonCompletion>
    </div>
  )
}

// Example usage component for testing
export const EnhancedLessonPageExample: React.FC = () => {
  // Mock lesson data
  const mockLesson = {
    id: 'lesson-123',
    title: 'Introdução ao React',
    slug: 'introducao-react',
    course: {
      id: 'course-456',
      title: 'Desenvolvimento Web Moderno',
      slug: 'desenvolvimento-web-moderno'
    }
  }

  // Mock progress data - you can modify these values to test different states
  const mockProgressData: LessonProgressData = {
    videoProgress: {
      currentTime: 900,
      duration: 1500,
      percentageWatched: 60,
      watchTime: 1800, // 30 minutes (meets requirement)
      lastPosition: 900,
      playbackRate: 1.0,
      completedSegments: [{ start: 0, end: 900, watchCount: 1 }]
    },
    pdfProgress: {
      currentPage: 10,
      totalPages: 10,
      percentageRead: 100, // 100% (meets requirement)
      bookmarks: [3, 6, 8],
      readingTime: 1200,
      lastPageViewed: 10
    },
    quizProgress: {
      currentQuestion: 5,
      totalQuestions: 5,
      answeredQuestions: [0, 1, 2, 3, 4],
      score: 85, // 85% (meets requirement)
      attempts: 1,
      timeSpent: 300,
      isCompleted: true,
      isPassed: true
    },
    exerciseProgress: {
      completedExercises: ['ex1', 'ex2', 'ex3', 'ex4'],
      submittedFiles: [],
      pendingReviews: [],
      totalExercises: 4,
      completionPercentage: 100 // 100% (meets requirement)
    },
    contentProgress: {
      scrollPercentage: 100,
      readingTime: 800,
      sectionsRead: ['intro', 'section1', 'section2', 'conclusion'],
      estimatedCompletionTime: 0
    },
    overallProgress: {
      percentageComplete: 92,
      estimatedTimeRemaining: 0,
      lastActivity: new Date().toISOString(),
      isCompleted: false,
      componentProgress: [
        { component: 'video', percentage: 60, timeSpent: 1800, isCompleted: false, weight: 0.4 },
        { component: 'pdf', percentage: 100, timeSpent: 1200, isCompleted: true, weight: 0.3 },
        { component: 'exercises', percentage: 100, timeSpent: 600, isCompleted: true, weight: 0.2 },
        { component: 'quiz', percentage: 85, timeSpent: 300, isCompleted: true, weight: 0.1 }
      ]
    }
  }

  const handleLessonComplete = () => {
    console.log('🎉 Lesson completion callback triggered!')
    alert('Lesson completed! This would normally trigger additional logic.')
  }

  const handleExit = () => {
    console.log('👋 Exit callback triggered!')
    alert('Exit triggered! This would normally navigate back to course.')
  }

  return (
    <EnhancedLessonPage
      lesson={mockLesson}
      progressData={mockProgressData}
      onLessonComplete={handleLessonComplete}
      onExit={handleExit}
    >
      {/* Example lesson content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Video Section */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            📹 Vídeo da Aula
          </h2>
          <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Video Player Component Here</p>
          </div>
        </section>

        {/* PDF Section */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            📄 Material de Apoio
          </h2>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">PDF Viewer Component Here</p>
          </div>
        </section>

        {/* Exercises Section */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            ✏️ Exercícios
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-300">Exercise 1: Create a React component</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-300">Exercise 2: Implement state management</p>
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            🎯 Quiz
          </h2>
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-300">Quiz Component Here</p>
            <p className="text-sm text-gray-400 mt-2">
              Score: 85% (Passed ✅)
            </p>
          </div>
        </section>
      </div>
    </EnhancedLessonPage>
  )
}