'use client'

import React, { useState, useCallback } from 'react'
import CentralizedLessonLayout, { 
  CentralizedLessonTitle, 
  CentralizedLessonNav,
  useCentralizedLayout 
} from '@/components/lesson/layout/CentralizedLessonLayout'
import { VideoPlayer } from '@/components/lesson/video/VideoPlayer'
import { PDFViewer } from '@/components/lesson/pdf/PDFViewer'
import { QuizInterface } from '@/components/lesson/quiz/QuizInterface'
import { ExercisePanel } from '@/components/lesson/exercises/ExercisePanel'
import { ProgressTracker } from '@/components/lesson/progress/ProgressTracker'
import { LessonProvider } from '@/contexts/LessonContext'
import { LessonContent, LessonProgressData } from '@/types/lesson'

// Import CSS
import '@/styles/lesson-centralized.css'

/**
 * TestLessonPage - Comprehensive test page for Phase 2 lesson components
 * 
 * Demonstrates:
 * - Centralized lesson layout (NEW)
 * - VideoPlayer with custom controls
 * - PDFViewer with in-page reading
 * - QuizInterface with gamification
 * - ExercisePanel with file upload
 * - ProgressTracker with card-based design
 */
export default function TestLessonPage() {
  // State for progress tracking
  const [progress, setProgress] = useState<LessonProgressData>(initialProgressData)
  const [completedComponents, setCompletedComponents] = useState<Set<string>>(new Set())
  
  // Centralized layout hooks
  const { activeSection, scrollToSection } = useCentralizedLayout()

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

  return (
    <LessonProvider>
      {/* Page Header */}
      <div className="lesson-background py-8">
        <div className="lesson-centralized-container">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              📚 Página de Teste - Sistema de Aulas
            </h1>
            <p className="lesson-text-body text-center mb-6">
              Demonstração do novo layout centralizado com componentes da Fase 2
            </p>
            
            {/* Quick Navigation */}
            <CentralizedLessonNav 
              lesson={testLessonContent}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />
          </div>
        </div>
      </div>

      {/* Main Centralized Layout */}
      <CentralizedLessonLayout
        lesson={testLessonContent}
        progress={{
          overall: progress.overallProgress.percentageComplete,
          video: progress.videoProgress.percentageWatched,
          pdf: progress.pdfProgress.percentageRead,
          quiz: progress.quizProgress.score,
          exercises: progress.exerciseProgress.completionPercentage
        }}
      >
        {{
          title: (
            <CentralizedLessonTitle
              title={testLessonContent.title}
              courseTitle="Curso de Desenvolvimento Web"
              themeColors={{
                primary: '#d400ff',
                secondary: '#00c4ff'
              }}
            />
          ),
          
          progress: (
            <ProgressTracker 
              progress={progress} 
              size="md" 
              showDetails={true}
            />
          ),
          
          video: testLessonContent.video && (
            <VideoPlayer
              video={testLessonContent.video}
              onProgressUpdate={handleVideoProgress}
              onComplete={handleVideoComplete}
              startTime={progress.videoProgress.lastPosition}
            />
          ),
          
          pdf: testLessonContent.pdf && (
            <PDFViewer 
              pdf={testLessonContent.pdf}
              onProgressUpdate={(progress) => {
                setProgress(prev => ({
                  ...prev,
                  pdfProgress: {
                    ...prev.pdfProgress,
                    percentageRead: progress
                  }
                }))
              }}
            />
          ),
          
          exercises: testLessonContent.exercises && (
            <div className="space-y-4">
              <ExercisePanel 
                exercises={testLessonContent.exercises}
              />
              
              {/* Materials Section */}
              {testLessonContent.materials && (
                <div className="lesson-exercise-item">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    📎 Materiais de Apoio
                  </h4>
                  <div className="space-y-3">
                    {testLessonContent.materials.map((material, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-xl flex-shrink-0">
                          {material.type === 'pdf' ? '📄' : 
                           material.type === 'link' ? '🔗' : 
                           material.type === 'image' ? '🖼️' : '📄'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium">{material.title}</div>
                          {material.description && (
                            <div className="lesson-text-caption mt-1">{material.description}</div>
                          )}
                        </div>
                        {material.url && (
                          <a 
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lesson-btn-icon"
                            aria-label={`Abrir ${material.title}`}
                          >
                            🔗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ),
          
          quiz: testLessonContent.quiz && (
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
          )
        }}
      </CentralizedLessonLayout>

      {/* Debug Information */}
      <div className="lesson-background py-8">
        <div className="lesson-centralized-container">
          <details className="lesson-card-base lesson-card-padding">
            <summary className="text-white font-semibold cursor-pointer mb-4 lesson-focusable">
              🔍 Informações de Debug - Novo Layout Centralizado
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="text-green-400 font-semibold mb-3">✅ Componentes Atualizados:</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• CentralizedLessonLayout - Layout linear centralizado</li>
                  <li>• ProgressTracker - Design baseado em cards</li>
                  <li>• PDFViewer - Leitura in-page com controles</li>
                  <li>• VideoPlayer - Mantido com estilo atualizado</li>
                  <li>• ExercisePanel - Layout em cards</li>
                  <li>• QuizInterface - Design atualizado</li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 font-semibold mb-3">🎨 Melhorias de Design:</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• Estética do site principal replicada</li>
                  <li>• Layout responsivo mobile-first</li>
                  <li>• Navegação por seções integrada</li>
                  <li>• Animações suaves entre seções</li>
                  <li>• Cards com gradientes e blur</li>
                  <li>• Sistema de cores unificado</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 lesson-card-base rounded-lg">
              <p className="text-purple-200 text-sm">
                <strong>Progresso Atual:</strong> {progress.overallProgress.percentageComplete}% | 
                <strong> Componentes:</strong> {completedComponents.size}/6 |
                <strong> Tempo Restante:</strong> ~{Math.round(progress.overallProgress.estimatedTimeRemaining)} min
              </p>
              <p className="text-blue-200 text-sm mt-2">
                <strong>Layout:</strong> Centralizado | 
                <strong> Ordem:</strong> Título → Progresso → Vídeo → PDF → Exercícios → Teste |
                <strong> Navegação:</strong> Ativa
              </p>
            </div>
          </details>
        </div>
      </div>
    </LessonProvider>
  )
}

// Sample lesson content data
const testLessonContent: LessonContent = {
  id: "lesson-cap2",
  title: "Aula Capítulo 2: Fundamentos do Desenvolvimento Web",
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