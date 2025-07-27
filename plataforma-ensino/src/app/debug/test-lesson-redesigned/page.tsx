'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import LessonPageRedesigned from '@/components/lesson/LessonPageRedesigned'
import type { LessonProgressData } from '@/types/lesson'

export default function TestLessonRedesignedPage() {
  const router = useRouter()
  
  const [progressData, setProgressData] = useState<LessonProgressData>({
    videoProgress: {
      currentTime: 0,
      duration: 300,
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
      estimatedCompletionTime: 0
    },
    overallProgress: {
      percentageComplete: 0,
      estimatedTimeRemaining: 0,
      lastActivity: new Date().toISOString(),
      isCompleted: false,
      componentProgress: []
    }
  })

  // Mock lesson data
  const mockLesson = {
    id: 'test-lesson-1',
    title: 'Introdução ao React',
    slug: 'introducao-react',
    course: {
      id: 'test-course-1',
      title: 'Curso de React Avançado',
      slug: 'react-avancado'
    }
  }

  const handleExit = () => {
    console.log('Exit lesson - navigating to course page')
    try {
      // Navigate to the test course page
      router.push('/course/react-avancado')
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback to dashboard if course route doesn't exist
      router.push('/dashboard')
    }
  }

  const handleLessonComplete = () => {
    console.log('Lesson completed successfully!')
    alert('Aula concluída com sucesso! Redirecionando para o curso...')
  }

  return (
    <LessonPageRedesigned
      lesson={mockLesson}
      progressData={progressData}
      onExit={handleExit}
      onLessonComplete={handleLessonComplete}
    />
  )
}