'use client'

import React from 'react'
import LessonPageRedesigned from '@/components/lesson/LessonPageRedesigned'
import type { LessonProgressData } from '@/types/lesson'

// Mock lesson data for testing
const mockLesson = {
  id: 'test-lesson-responsive',
  title: 'Teste de Responsividade - Design Fundamentals',
  slug: 'test-responsive-design',
  course: {
    id: 'test-course',
    title: 'Curso de Design Responsivo',
    slug: 'design-responsivo'
  }
}

// Mock progress data for testing
const mockProgressData: LessonProgressData = {
  videoProgress: {
    currentTime: 180,
    duration: 400,
    percentageWatched: 45,
    watchTime: 180,
    lastPosition: 180,
    playbackRate: 1,
    completedSegments: []
  },
  pdfProgress: {
    currentPage: 15,
    totalPages: 20,
    percentageRead: 75,
    bookmarks: [],
    readingTime: 300,
    lastPageViewed: 15
  },
  exerciseProgress: {
    completedExercises: ['ex1', 'ex2'],
    submittedFiles: [],
    pendingReviews: [],
    totalExercises: 3,
    completionPercentage: 60
  },
  quizProgress: {
    currentQuestion: 0,
    totalQuestions: 5,
    answeredQuestions: [0, 1, 2, 3, 4],
    score: 85,
    attempts: 1,
    timeSpent: 300,
    isCompleted: true,
    isPassed: true
  },
  contentProgress: {
    scrollPercentage: 80,
    readingTime: 600,
    sectionsRead: ['intro', 'main'],
    estimatedCompletionTime: 300
  },
  overallProgress: {
    percentageComplete: 66,
    estimatedTimeRemaining: 600,
    lastActivity: 'video',
    isCompleted: false,
    componentProgress: []
  }
}

export default function TestResponsiveLessonPage() {
  const handleExit = () => {
    console.log('Exit lesson clicked')
    // In a real app, this would navigate back to the course
  }

  const handleLessonComplete = () => {
    console.log('Lesson completed!')
    // In a real app, this would handle the completion flow
  }

  return (
    <div className="min-h-screen">
      {/* Responsive Test Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            🧪 Teste de Responsividade - Página de Aula Redesenhada
          </h1>
          <div className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
            <p><strong>Mobile:</strong> &lt; 640px - Layout compacto, botões touch-friendly</p>
            <p><strong>Tablet:</strong> 640px - 1024px - Layout intermediário</p>
            <p><strong>Desktop:</strong> &gt; 1024px - Layout completo</p>
          </div>
        </div>
      </div>

      <LessonPageRedesigned
        lesson={mockLesson}
        progressData={mockProgressData}
        onExit={handleExit}
        onLessonComplete={handleLessonComplete}
      />
    </div>
  )
}