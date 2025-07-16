'use client'

import React from 'react'
import { LessonHeader } from './LessonHeader'
import { LessonProgressData } from '@/types/lesson'

/**
 * Demo component to test scroll behavior
 * This creates a long page to test the header scroll-following behavior
 */
export const ScrollBehaviorDemo = () => {
  const mockProgressData: LessonProgressData = {
    videoProgress: {
      currentTime: 450, // 7.5 minutes
      duration: 1800, // 30 minutes total
      percentageWatched: 75,
      watchTime: 900, // 15 minutes total watch time
      lastPosition: 450,
      playbackRate: 1.0,
      completedSegments: [
        { start: 0, end: 300, watchCount: 1 },
        { start: 300, end: 450, watchCount: 1 }
      ]
    },
    pdfProgress: {
      currentPage: 5,
      totalPages: 10,
      percentageRead: 50,
      bookmarks: [2, 5],
      readingTime: 600, // 10 minutes
      lastPageViewed: 5
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
      completedExercises: ['ex1', 'ex2'],
      submittedFiles: [],
      pendingReviews: [],
      totalExercises: 4,
      completionPercentage: 50
    },
    contentProgress: {
      scrollPercentage: 30,
      readingTime: 300, // 5 minutes
      sectionsRead: ['intro', 'section1'],
      estimatedCompletionTime: 1200 // 20 minutes
    },
    overallProgress: {
      percentageComplete: 45,
      estimatedTimeRemaining: 900, // 15 minutes
      lastActivity: new Date().toISOString(),
      isCompleted: false,
      componentProgress: [
        { component: 'video', percentage: 75, timeSpent: 900, isCompleted: false, weight: 0.4 },
        { component: 'pdf', percentage: 50, timeSpent: 600, isCompleted: false, weight: 0.3 },
        { component: 'exercises', percentage: 50, timeSpent: 300, isCompleted: false, weight: 0.2 },
        { component: 'quiz', percentage: 0, timeSpent: 0, isCompleted: false, weight: 0.1 }
      ]
    }
  }

  const mockCourse = {
    title: "Curso de React Avançado",
    slug: "react-avancado"
  }

  const mockLesson = {
    title: "Hooks Personalizados",
    slug: "hooks-personalizados"
  }

  const handleExit = () => {
    console.log('Exit clicked')
  }

  const handleComplete = () => {
    console.log('Complete clicked')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <LessonHeader
        course={mockCourse}
        lesson={mockLesson}
        progressData={mockProgressData}
        onExit={handleExit}
        onComplete={handleComplete}
      />
      
      {/* Content to create scroll */}
      <div className="px-4 py-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">
                Seção {i + 1} - Conteúdo da Aula
              </h2>
              <p className="text-gray-300 mb-4">
                Este é um conteúdo de exemplo para testar o comportamento de scroll do header.
                O header deve acompanhar o movimento de scroll, não ficando fixo no topo da página.
              </p>
              <p className="text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="mt-4 h-32 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-bold mb-2">Teste de Scroll</h3>
        <p className="text-sm">
          Role a página para testar o comportamento do header. 
          Ele deve acompanhar o scroll (não fixo) e mudar a opacidade do fundo.
        </p>
      </div>
    </div>
  )
}