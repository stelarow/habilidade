'use client'

import React, { useState, useCallback } from 'react'
import { LessonLayoutProvider, LessonContainer } from '@/components/lesson/layout'
import { VideoPlayer } from '@/components/lesson/video/VideoPlayer'
import { PDFViewer } from '@/components/lesson/pdf/PDFViewer'
import { QuizInterface } from '@/components/lesson/quiz/QuizInterface'
import { ExercisePanel } from '@/components/lesson/exercises/ExercisePanel'
import { ProgressTracker } from '@/components/lesson/progress/ProgressTracker'
import { LessonProvider } from '@/contexts/LessonContext'
import { LessonContent, LessonProgressData } from '@/types/lesson'

// Import CSS
import '@/styles/lesson-layout.css'

/**
 * TestLessonPage - Comprehensive test page for Phase 2 lesson components
 * 
 * Demonstrates:
 * - LessonLayout adaptive system
 * - VideoPlayer with custom controls
 * - PDFViewer integration
 * - QuizInterface with gamification
 * - ExercisePanel with file upload
 * - ProgressTracker with real-time updates
 */
export default function TestLessonPage() {
  // State for progress tracking
  const [progress, setProgress] = useState<LessonProgressData>(initialProgressData)
  const [completedComponents, setCompletedComponents] = useState<Set<string>>(new Set())

  // Progress update handlers
  const handleVideoProgress = useCallback((currentTime: number, duration: number) => {
    const percentage = (currentTime / duration) * 100
    setProgress(prev => ({
      ...prev,
      videoProgress: {
        ...prev.videoProgress,
        currentTime,
        duration,
        percentageWatched: percentage,
        lastPosition: currentTime
      },
      overallProgress: {
        ...prev.overallProgress,
        componentProgress: prev.overallProgress.componentProgress.map(comp =>
          comp.component === 'video' 
            ? { ...comp, percentage: Math.min(percentage, 100) }
            : comp
        )
      }
    }))
    
    // Update overall progress
    updateOverallProgress()
  }, [updateOverallProgress])

  const handleVideoComplete = useCallback(() => {
    setCompletedComponents(prev => {
      const newSet = new Set(prev)
      newSet.add('video')
      return newSet
    })
    markComponentComplete('video')
  }, [markComponentComplete])

  const handleQuizComplete = useCallback((score: number) => {
    setCompletedComponents(prev => {
      const newSet = new Set(prev)
      newSet.add('quiz')
      return newSet
    })
    setProgress(prev => ({
      ...prev,
      quizProgress: {
        ...prev.quizProgress,
        score,
        isCompleted: true,
        isPassed: score >= testLessonContent.quiz!.passingScore
      }
    }))
    markComponentComplete('quiz')
  }, [markComponentComplete])

  const markComponentComplete = useCallback((component: string) => {
    setProgress(prev => ({
      ...prev,
      overallProgress: {
        ...prev.overallProgress,
        componentProgress: prev.overallProgress.componentProgress.map(comp =>
          comp.component === component 
            ? { ...comp, percentage: 100, isCompleted: true }
            : comp
        )
      }
    }))
    updateOverallProgress()
  }, [updateOverallProgress])

  const updateOverallProgress = useCallback(() => {
    setProgress(prev => {
      const totalWeight = prev.overallProgress.componentProgress.reduce((sum, comp) => sum + comp.weight, 0)
      const weightedProgress = prev.overallProgress.componentProgress.reduce(
        (sum, comp) => sum + (comp.percentage * comp.weight), 0
      )
      const overallPercentage = totalWeight > 0 ? weightedProgress / totalWeight : 0
      
      return {
        ...prev,
        overallProgress: {
          ...prev.overallProgress,
          percentageComplete: Math.round(overallPercentage),
          isCompleted: overallPercentage >= 95,
          estimatedTimeRemaining: Math.max(0, 25 - (overallPercentage / 100) * 25) // 25 minutes total
        }
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <LessonProvider>
        <LessonLayoutProvider initialContent={testLessonContent}>
          <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-white mb-2">
                📚 Página de Teste - Sistema de Aulas
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Demonstração completa dos componentes da Fase 2
              </p>
              
              {/* Progress Overview */}
              <div className="max-w-md mx-auto mb-8">
                <ProgressTracker 
                  progress={progress} 
                  size="lg" 
                  showDetails={true}
                />
              </div>
            </div>

            {/* Main Lesson Layout */}
            <LessonContainer 
              content={testLessonContent}
              className="lesson-test-container"
            >
              {/* Video Player */}
              {testLessonContent.video && (
                <div className="lesson-video" data-area="main">
                  <VideoPlayer
                    video={testLessonContent.video}
                    onProgressUpdate={handleVideoProgress}
                    onComplete={handleVideoComplete}
                    startTime={progress.videoProgress.lastPosition}
                  />
                </div>
              )}

              {/* PDF Viewer */}
              {testLessonContent.pdf && (
                <div className="lesson-pdf" data-area="main">
                  <PDFViewer 
                    pdf={testLessonContent.pdf}
                  />
                </div>
              )}

              {/* Quiz Interface */}
              {testLessonContent.quiz && (
                <div className="lesson-quiz" data-area="sidebar">
                  <QuizInterface
                    quiz={testLessonContent.quiz}
                    onComplete={handleQuizComplete}
                    onProgressUpdate={(questionIndex, score) => {
                      setProgress(prev => ({
                        ...prev,
                        quizProgress: {
                          ...prev.quizProgress,
                          currentQuestion: questionIndex,
                          score
                        }
                      }))
                    }}
                  />
                </div>
              )}

              {/* Exercise Panel */}
              {testLessonContent.exercises && (
                <div className="lesson-exercises" data-area="exercises">
                  <ExercisePanel 
                    exercises={testLessonContent.exercises}
                  />
                </div>
              )}

              {/* Materials */}
              {testLessonContent.materials && (
                <div className="lesson-materials" data-area="sidebar">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      📎 Materiais de Apoio
                    </h3>
                    <div className="space-y-2">
                      {testLessonContent.materials.map((material, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-xl">
                            {material.type === 'pdf' ? '📄' : 
                             material.type === 'link' ? '🔗' : 
                             material.type === 'image' ? '🖼️' : '📄'}
                          </span>
                          <div className="flex-1">
                            <div className="text-white font-medium">{material.title}</div>
                            {material.description && (
                              <div className="text-sm text-gray-400">{material.description}</div>
                            )}
                          </div>
                          {material.url && (
                            <a 
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              🔗
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </LessonContainer>

            {/* Debug Information */}
            <div className="mt-12 max-w-4xl mx-auto">
              <details className="bg-black/20 rounded-lg p-4">
                <summary className="text-white font-semibold cursor-pointer mb-4">
                  🔍 Debug Information - Fase 2 Components Status
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2">✅ Componentes Implementados:</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• LessonLayout (2.1) - Container adaptativo</li>
                      <li>• VideoPlayer (2.2) - Player HTML5 customizado</li>
                      <li>• QuizInterface (2.4) - Sistema interativo com gamificação</li>
                      <li>• ProgressTracker (2.6) - Rastreamento visual</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">🔄 Componentes Placeholder:</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• PDFViewer (2.3) - Visualizador básico</li>
                      <li>• ExercisePanel (2.5) - Upload não implementado</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-900/30 rounded">
                  <p className="text-purple-200 text-sm">
                    <strong>Progresso Atual:</strong> {progress.overallProgress.percentageComplete}% | 
                    <strong> Componentes Concluídos:</strong> {completedComponents.size}/6 |
                    <strong> Tempo Restante:</strong> ~{Math.round(progress.overallProgress.estimatedTimeRemaining)} min
                  </p>
                </div>
              </details>
            </div>
          </div>
        </LessonLayoutProvider>
      </LessonProvider>
    </div>
  )
}

// Sample lesson content data
const testLessonContent: LessonContent = {
  // Video with sample URL (YouTube URL converted to direct video)
  video: {
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Sample video for demo
    duration: 30, // 30 seconds for quick testing
    thumbnail: "/images/video-thumb.jpg",
    aspectRatio: 16/9
  },

  // PDF for the specified chapter
  pdf: {
    url: "/pdf/capitulo2.pdf", // Web accessible path
    title: "Capítulo 2: Fundamentos do Desenvolvimento Web",
    filename: "Capitulo-2.pdf",
    size: 2048000, // 2MB
    pageCount: 15,
    downloadable: true
  },

  // Quiz with educational questions about web development
  quiz: {
    id: "quiz-cap2",
    title: "Quiz: Fundamentos do Desenvolvimento Web",
    description: "Teste seus conhecimentos sobre HTML, CSS e JavaScript",
    timeLimit: 10, // 10 minutes
    attemptsAllowed: 3,
    passingScore: 70,
    totalQuestions: 4,
    status: 'not_started',
    remainingAttempts: 3
  },

  // Exercises based on the lesson content
  exercises: [
    {
      id: "ex1",
      title: "Criar uma Página HTML Básica",
      description: "Crie uma página HTML com estrutura básica, incluindo cabeçalho, navegação e conteúdo principal.",
      orderIndex: 1,
      status: 'not_started',
      allowsUpload: true,
      uploadInstructions: "Faça upload do arquivo HTML (.html) que você criou seguindo as instruções."
    },
    {
      id: "ex2", 
      title: "Estilizar com CSS",
      description: "Adicione estilos CSS à sua página HTML, incluindo cores, fontes e layout responsivo.",
      orderIndex: 2,
      status: 'not_started',
      allowsUpload: true,
      uploadInstructions: "Faça upload dos arquivos HTML e CSS (.html, .css) da sua página estilizada."
    },
    {
      id: "ex3",
      title: "Adicionar Interatividade",
      description: "Implemente funcionalidades básicas com JavaScript, como botões interativos ou validação de formulário.",
      orderIndex: 3,
      status: 'not_started',
      allowsUpload: true,
      uploadInstructions: "Faça upload de todos os arquivos (.html, .css, .js) do seu projeto completo."
    }
  ],

  // Additional materials
  materials: [
    {
      type: 'pdf',
      title: 'Guia de Referência HTML',
      description: 'Referência completa das tags HTML mais utilizadas',
      url: '/materials/html-reference.pdf',
      downloadable: true
    },
    {
      type: 'link',
      title: 'MDN Web Docs - HTML',
      description: 'Documentação oficial do HTML',
      url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML'
    },
    {
      type: 'link',
      title: 'CSS Tricks - Guia Completo',
      description: 'Recursos e tutoriais avançados de CSS',
      url: 'https://css-tricks.com'
    },
    {
      type: 'document',
      title: 'Template de Projeto',
      description: 'Arquivo base para iniciar seus exercícios',
      url: '/templates/projeto-base.zip',
      downloadable: true
    }
  ],

  // Additional content text
  content: `
    <h2>Introdução ao Desenvolvimento Web</h2>
    <p>Nesta aula, você aprenderá os fundamentos essenciais do desenvolvimento web moderno, incluindo:</p>
    <ul>
      <li><strong>HTML</strong> - Estrutura e semântica</li>
      <li><strong>CSS</strong> - Estilização e layout responsivo</li>
      <li><strong>JavaScript</strong> - Interatividade e lógica</li>
    </ul>
    <p>Ao final desta aula, você será capaz de criar páginas web funcionais e atrativas.</p>
  `
}

// Initial progress data
const initialProgressData: LessonProgressData = {
  videoProgress: {
    currentTime: 0,
    duration: 30,
    percentageWatched: 0,
    watchTime: 0,
    lastPosition: 0,
    playbackRate: 1,
    completedSegments: []
  },
  pdfProgress: {
    currentPage: 1,
    totalPages: 15,
    percentageRead: 0,
    bookmarks: [],
    readingTime: 0,
    lastPageViewed: 1
  },
  quizProgress: {
    currentQuestion: 0,
    totalQuestions: 4,
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
    estimatedCompletionTime: 25
  },
  overallProgress: {
    percentageComplete: 0,
    estimatedTimeRemaining: 25,
    lastActivity: new Date().toISOString(),
    isCompleted: false,
    componentProgress: [
      { component: 'video', percentage: 0, timeSpent: 0, isCompleted: false, weight: 30 },
      { component: 'pdf', percentage: 0, timeSpent: 0, isCompleted: false, weight: 25 },
      { component: 'quiz', percentage: 0, timeSpent: 0, isCompleted: false, weight: 25 },
      { component: 'exercises', percentage: 0, timeSpent: 0, isCompleted: false, weight: 15 },
      { component: 'content', percentage: 0, timeSpent: 0, isCompleted: false, weight: 5 }
    ]
  }
}