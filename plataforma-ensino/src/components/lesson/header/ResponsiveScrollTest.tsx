'use client'

import React, { useState, useEffect } from 'react'
import { LessonHeader } from './LessonHeader'
import { LessonProgressData } from '@/types/lesson'

/**
 * Comprehensive test component for header scroll behavior across different screen sizes
 */
export const ResponsiveScrollTest = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [scrollPosition, setScrollPosition] = useState(0)

  // Mock progress data
  const mockProgressData: LessonProgressData = {
    videoProgress: {
      currentTime: 900, // 15 minutes
      duration: 1500, // 25 minutes total
      percentageWatched: 60,
      watchTime: 900,
      lastPosition: 900,
      playbackRate: 1.0,
      completedSegments: [{ start: 0, end: 900, watchCount: 1 }]
    },
    pdfProgress: {
      currentPage: 8,
      totalPages: 10,
      percentageRead: 80,
      bookmarks: [3, 6, 8],
      readingTime: 1200,
      lastPageViewed: 8
    },
    quizProgress: {
      currentQuestion: 3,
      totalQuestions: 5,
      answeredQuestions: [0, 1, 2],
      score: 75,
      attempts: 1,
      timeSpent: 300,
      isCompleted: true,
      isPassed: true
    },
    exerciseProgress: {
      completedExercises: ['ex1', 'ex2', 'ex3'],
      submittedFiles: [],
      pendingReviews: [],
      totalExercises: 4,
      completionPercentage: 75
    },
    contentProgress: {
      scrollPercentage: 65,
      readingTime: 800,
      sectionsRead: ['intro', 'section1', 'section2'],
      estimatedCompletionTime: 600
    },
    overallProgress: {
      percentageComplete: 85,
      estimatedTimeRemaining: 300,
      lastActivity: new Date().toISOString(),
      isCompleted: false,
      componentProgress: [
        { component: 'video', percentage: 60, timeSpent: 900, isCompleted: false, weight: 0.4 },
        { component: 'pdf', percentage: 80, timeSpent: 1200, isCompleted: false, weight: 0.3 },
        { component: 'exercises', percentage: 75, timeSpent: 600, isCompleted: false, weight: 0.2 },
        { component: 'quiz', percentage: 100, timeSpent: 300, isCompleted: true, weight: 0.1 }
      ]
    }
  }

  const mockCourse = {
    title: "Curso Avançado de React",
    slug: "react-avancado"
  }

  const mockLesson = {
    title: "Hooks Personalizados e Performance",
    slug: "hooks-personalizados-performance"
  }

  // Track scroll position for testing
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setScreenSize('mobile')
      } else if (width < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleExit = () => {
    console.log('Exit clicked - would navigate to course page')
  }

  const handleComplete = async () => {
    console.log('Complete clicked - would mark lesson as completed')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with scroll behavior */}
      <LessonHeader
        course={mockCourse}
        lesson={mockLesson}
        progressData={mockProgressData}
        onExit={handleExit}
        onComplete={handleComplete}
      />
      
      {/* Test content sections */}
      <div className="px-4 py-8 max-w-6xl mx-auto">
        {/* Debug info panel - hidden in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8 sticky top-20 z-10">
            <h2 className="text-xl font-bold text-white mb-4">Debug: Teste de Comportamento do Header</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Tamanho da Tela:</span>
                <span className="ml-2 text-white font-semibold capitalize">{screenSize}</span>
              </div>
              <div>
                <span className="text-gray-400">Posição do Scroll:</span>
                <span className="ml-2 text-white font-semibold">{Math.round(scrollPosition)}px</span>
              </div>
              <div>
                <span className="text-gray-400">Resolução:</span>
                <span className="ml-2 text-white font-semibold">
                  {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content sections to test scroll behavior */}
        <div className="space-y-8">
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4">
                Seção {i + 1} - Conteúdo de Teste
              </h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Esta seção testa o comportamento de scroll do header. O header deve:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Acompanhar o movimento de scroll (não ser fixo)</li>
                  <li>Mudar a opacidade do fundo baseado na posição do scroll</li>
                  <li>Manter todos os elementos visíveis em diferentes tamanhos de tela</li>
                  <li>Ter transições suaves entre estados</li>
                </ul>
                
                {/* Different content for different sections */}
                {i % 3 === 0 && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Vídeo da Aula</h4>
                    <div className="h-32 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-gray-400">Player de Vídeo Simulado</span>
                    </div>
                  </div>
                )}
                
                {i % 3 === 1 && (
                  <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Material PDF</h4>
                    <div className="h-24 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-gray-400">Visualizador de PDF Simulado</span>
                    </div>
                  </div>
                )}
                
                {i % 3 === 2 && (
                  <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Exercícios</h4>
                    <div className="h-20 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-gray-400">Área de Exercícios Simulada</span>
                    </div>
                  </div>
                )}
                
                <p className="text-gray-400 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Test instructions */}
      <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-bold mb-2">Instruções de Teste</h3>
        <ul className="text-xs space-y-1">
          <li>• Role a página para testar o scroll</li>
          <li>• Redimensione a janela para testar responsividade</li>
          <li>• Observe as mudanças de opacidade do header</li>
          <li>• Verifique se todos os elementos permanecem visíveis</li>
          <li>• Teste em diferentes dispositivos/tamanhos</li>
        </ul>
      </div>
    </div>
  )
}