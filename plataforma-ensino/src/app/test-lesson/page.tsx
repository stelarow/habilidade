'use client'

import React, { useState, useCallback } from 'react'
import CentralizedLessonLayout, { 
  CentralizedLessonTitle, 
  CentralizedLessonNav,
  useCentralizedLayout 
} from '@/components/lesson/layout/CentralizedLessonLayout'
import { VideoPlayer } from '@/components/lesson/video/VideoPlayer'
import { PDFViewer } from '@/components/lesson/pdf/PDFViewer'
import { EnhancedQuizInterface } from '@/components/lesson/quiz/EnhancedQuizInterface'
import { FloatingProgressMenu } from '@/components/lesson/progress/FloatingProgressMenu'
import dynamic from 'next/dynamic'

// Client-side only PDF viewer to avoid SSR issues
const ClientPDFViewer = dynamic(
  () => import('@/components/lesson/pdf/PDFViewer').then(mod => ({ default: mod.PDFViewer })),
  { 
    ssr: false,
    loading: () => (
      <div className="lesson-pdf-content">
        <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
              <p className="text-gray-600">Carregando visualizador PDF...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
import { ExercisePanel } from '@/components/lesson/exercises/ExercisePanel'
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
    const passingScore = testLessonContent.quiz!.passingScore
    const isPassed = score >= passingScore

    if (isPassed) {
      setCompletedComponents(prev => {
        const newSet = new Set(prev)
        newSet.add('quiz')
        return newSet
      })
      markComponentComplete('quiz')
    }

    setProgress(prev => ({
      ...prev,
      quizProgress: {
        ...prev.quizProgress,
        score,
        isCompleted: isPassed,
        isPassed,
        attempts: prev.quizProgress.attempts + 1
      },
      overallProgress: {
        ...prev.overallProgress,
        componentProgress: prev.overallProgress.componentProgress.map(comp =>
          comp.component === 'quiz' 
            ? { 
                ...comp, 
                percentage: isPassed ? 100 : 0,
                isCompleted: isPassed 
              }
            : comp
        )
      }
    }))
    
    // Update overall progress
    updateOverallProgress()
  }, [markComponentComplete, updateOverallProgress])
  
  const handleExerciseSubmit = useCallback(async (exerciseId: string, file: File) => {
    try {
      // Simulate file upload process
      console.log(`Submitting exercise ${exerciseId} with file:`, file.name)
      
      // In a real implementation, this would upload to a server
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mark exercise as completed
      setProgress(prev => ({
        ...prev,
        exerciseProgress: {
          ...prev.exerciseProgress,
          completedExercises: [...prev.exerciseProgress.completedExercises, exerciseId],
          submittedFiles: [...prev.exerciseProgress.submittedFiles, {
            exerciseId,
            fileName: file.name,
            fileUrl: URL.createObjectURL(file), // For demo purposes
            submittedAt: new Date().toISOString(),
            status: 'pending' as const
          }],
          completionPercentage: Math.round(
            ((prev.exerciseProgress.completedExercises.length + 1) / prev.exerciseProgress.totalExercises) * 100
          )
        }
      }))
      
      alert(`Exercício "${exerciseId}" enviado com sucesso!`)
      
      // Update overall progress
      updateOverallProgress()
    } catch (error) {
      console.error('Error submitting exercise:', error)
      throw error
    }
  }, [updateOverallProgress])

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

      {/* Main Layout with Floating Sidebar */}
      <div className="relative">
        {/* Floating Progress Menu - Sidebar */}
        <div className="hidden xl:block fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
          <FloatingProgressMenu 
            progress={progress}
            onNavigate={(section) => {
              scrollToSection(section)
            }}
          />
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
          
          
          video: testLessonContent.video && (
            <div id="section-video">
              <VideoPlayer
                video={testLessonContent.video}
                onProgressUpdate={handleVideoProgress}
                onComplete={handleVideoComplete}
                startTime={progress.videoProgress.lastPosition}
              />
            </div>
          ),
          
          pdf: testLessonContent.pdf && (
            <div id="section-pdf">
              <ClientPDFViewer 
                pdf={testLessonContent.pdf}
                onProgressUpdate={(progress) => {
                  setProgress(prev => ({
                    ...prev,
                    pdfProgress: {
                      ...prev.pdfProgress,
                      percentageRead: progress
                    },
                    overallProgress: {
                      ...prev.overallProgress,
                      componentProgress: prev.overallProgress.componentProgress.map(comp =>
                        comp.component === 'pdf' 
                          ? { ...comp, percentage: Math.min(progress, 100) }
                          : comp
                      )
                    }
                  }))
                  // Update overall progress
                  updateOverallProgress()
                }}
              />
            </div>
          ),
          
          exercises: testLessonContent.exercises && (
            <div id="section-exercises" className="space-y-4">
              <ExercisePanel 
                exercises={testLessonContent.exercises}
                onExerciseSubmit={handleExerciseSubmit}
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
            <div id="section-quiz">
              <EnhancedQuizInterface
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
          )
        }}
      </CentralizedLessonLayout>
      </div>

      {/* Mobile Progress Menu - Shows on smaller screens */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <FloatingProgressMenu 
          progress={progress}
          onNavigate={(section) => {
            scrollToSection(section)
          }}
          className="w-80 max-h-96 overflow-y-auto"
        />
      </div>

      {/* Debug Information */}
      <div className="lesson-background py-8">
        <div className="lesson-centralized-container">
          <details className="lesson-card-base lesson-card-padding">
            <summary className="text-white font-semibold cursor-pointer mb-4 lesson-focusable">
              🔍 Informações da Aula - Capítulo 2 Completo
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="text-green-400 font-semibold mb-3">📚 Conteúdo Implementado:</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• <strong>Vídeo Real:</strong> YouTube integrado ({testLessonContent.video?.url?.includes('Xq0xJl-2D_s') ? 'Ativo' : 'Demo'})</li>
                  <li>• <strong>PDF do Capítulo 2:</strong> Material autêntico</li>
                  <li>• <strong>Quiz Avançado:</strong> 8 questões categorizadas</li>
                  <li>• <strong>4 Exercícios Práticos:</strong> HTML5, CSS, JS, Otimização</li>
                  <li>• <strong>8 Materiais de Apoio:</strong> PDFs e links educativos</li>
                  <li>• <strong>Conteúdo Detalhado:</strong> Objetivos e metodologia</li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 font-semibold mb-3">🎯 Funcionalidades:</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• <strong>Quiz por Categorias:</strong> HTML, CSS, JS, Geral</li>
                  <li>• <strong>Explicações Detalhadas:</strong> Para cada questão</li>
                  <li>• <strong>Sistema de Pontuação:</strong> 200 pontos totais</li>
                  <li>• <strong>Timer Configurável:</strong> 15 minutos padrão</li>
                  <li>• <strong>Revisão Completa:</strong> Com feedback visual</li>
                  <li>• <strong>Layout Responsivo:</strong> Mobile e desktop</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="p-4 lesson-card-base rounded-lg">
                <h5 className="text-yellow-400 font-semibold mb-2">📊 Estatísticas da Aula:</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="text-center">
                    <div className="text-lg font-mono text-white">{progress.overallProgress.percentageComplete}%</div>
                    <div className="text-gray-400">Progresso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-mono text-white">8</div>
                    <div className="text-gray-400">Questões</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-mono text-white">4</div>
                    <div className="text-gray-400">Exercícios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-mono text-white">15</div>
                    <div className="text-gray-400">Min. Quiz</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 lesson-card-base rounded-lg">
                <h5 className="text-purple-400 font-semibold mb-2">🎥 Recursos Multimídia:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <strong className="text-white">Vídeo:</strong>
                    <div className="text-gray-300">YouTube: Xq0xJl-2D_s</div>
                    <div className="text-gray-300">Duração: ~20 minutos</div>
                  </div>
                  <div>
                    <strong className="text-white">PDF:</strong>
                    <div className="text-gray-300">Capítulo 2.pdf</div>
                    <div className="text-gray-300">Leitura in-page ativa</div>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </LessonProvider>
  )
}

// Real lesson content data based on provided resources
const testLessonContent: LessonContent = {
  id: "lesson-cap2-real",
  title: "Capítulo 2: Fundamentos do Desenvolvimento Web",
  description: "Aprenda os conceitos fundamentais de HTML, CSS e JavaScript através de exemplos práticos e exercícios interativos.",
  
  // Real YouTube video from provided URL
  video: {
    url: "https://www.youtube.com/embed/Xq0xJl-2D_s", // Converted to embed format
    duration: 1200, // Estimated 20 minutes (will be detected by player)
    thumbnail: "https://img.youtube.com/vi/Xq0xJl-2D_s/hqdefault.jpg",
    aspectRatio: 16/9
  },

  // PDF from the actual file path provided
  pdf: {
    url: "/pdf/capitulo2.pdf", // Simplified path in public directory
    title: "Capítulo 2: Fundamentos do Desenvolvimento Web",
    filename: "capitulo2.pdf",
    size: 2048000, // Will be detected from actual file
    pageCount: 20, // Estimated, will be detected from actual file
    downloadable: true
  },

  // Comprehensive quiz based on Chapter 2 content
  quiz: {
    id: "quiz-cap2-comprehensive",
    title: "Avaliação: Fundamentos do Desenvolvimento Web",
    description: "Teste completo sobre HTML, CSS, JavaScript e conceitos de desenvolvimento web responsivo. Baseado no conteúdo do Capítulo 2.",
    timeLimit: 15, // 15 minutes for comprehensive quiz
    attemptsAllowed: 3,
    passingScore: 75, // Higher passing score for comprehensive content
    totalQuestions: 8, // Updated to match actual number of questions
    status: 'not_started',
    remainingAttempts: 3
  },

  // Practical exercises based on Chapter 2 content
  exercises: [
    {
      id: "ex1",
      title: "Estrutura HTML5 Semântica",
      description: "Crie uma página HTML5 utilizando elementos semânticos (header, nav, main, section, aside, footer) com conteúdo sobre desenvolvimento web. Inclua pelo menos 3 seções diferentes com títulos hierárquicos adequados.",
      orderIndex: 1,
      status: 'not_started',
      allowsUpload: true,
      uploadInstructions: "Faça upload do arquivo HTML (.html) seguindo as práticas de HTML5 semântico apresentadas no capítulo."
    },
    {
      id: "ex2", 
      title: "CSS Layout Responsivo",
      description: "Aplicar estilos CSS à página criada no exercício anterior, implementando um layout responsivo com CSS Grid ou Flexbox. Inclua media queries para pelo menos 2 breakpoints (mobile e desktop).",
      orderIndex: 2,
      status: 'not_started',
      allowsUpload: true,
      uploadInstructions: "Faça upload dos arquivos HTML e CSS (.html, .css) demonstrando o layout responsivo funcionando."
    },
    {
      id: "ex3",
      title: "Interatividade com JavaScript",
      description: "Adicione funcionalidades JavaScript à sua página: menu hambúrguer para mobile, formulário de contato com validação básica, e um botão que alterna entre tema claro/escuro.",
      orderIndex: 3,
      status: 'not_started',
      allowsUpload: true,
      uploadInstructions: "Faça upload de todos os arquivos (.html, .css, .js) com as funcionalidades JavaScript implementadas."
    },
    {
      id: "ex4",
      title: "Otimização e Boas Práticas",
      description: "Otimize sua página seguindo as boas práticas: otimizar imagens, minificar CSS/JS, implementar meta tags adequadas, e validar o código HTML/CSS.",
      orderIndex: 4,
      status: 'not_started',
      allowsUpload: true,
      uploadInstructions: "Faça upload da versão final otimizada com relatório de validação (.html, .css, .js, .txt com relatório)."
    }
  ],

  // Additional learning materials for Chapter 2
  materials: [
    {
      type: 'pdf',
      title: 'HTML5 - Guia Completo de Elementos Semânticos',
      description: 'Referência detalhada de todos os elementos HTML5 com exemplos práticos',
      url: '/materials/html5-semantic-guide.pdf',
      downloadable: true
    },
    {
      type: 'pdf',
      title: 'CSS Grid e Flexbox - Manual Prático',
      description: 'Guia visual para layouts modernos com CSS Grid e Flexbox',
      url: '/materials/css-layout-guide.pdf',
      downloadable: true
    },
    {
      type: 'link',
      title: 'MDN Web Docs - HTML5',
      description: 'Documentação oficial do HTML5 com exemplos interativos',
      url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML'
    },
    {
      type: 'link',
      title: 'CSS Grid Garden - Jogo Interativo',
      description: 'Aprenda CSS Grid de forma divertida com este jogo interativo',
      url: 'https://cssgridgarden.com'
    },
    {
      type: 'link',
      title: 'Flexbox Froggy - Jogo de CSS Flexbox',
      description: 'Pratique CSS Flexbox ajudando o sapo a chegar ao seu objetivo',
      url: 'https://flexboxfroggy.com'
    },
    {
      type: 'link',
      title: 'Can I Use - Compatibilidade de Recursos',
      description: 'Verifique a compatibilidade de recursos HTML, CSS e JavaScript',
      url: 'https://caniuse.com'
    },
    {
      type: 'document',
      title: 'Starter Template - HTML5 + CSS3 + JS',
      description: 'Template inicial com estrutura HTML5, CSS moderno e JavaScript básico',
      url: '/templates/chapter2-starter.zip',
      downloadable: true
    },
    {
      type: 'document',
      title: 'Checklists de Boas Práticas',
      description: 'Listas de verificação para HTML, CSS e JavaScript',
      url: '/materials/best-practices-checklist.pdf',
      downloadable: true
    }
  ],

  // Enhanced content text for Chapter 2
  content: `
    <h2>Capítulo 2: Fundamentos do Desenvolvimento Web</h2>
    
    <h3>📚 Objetivos de Aprendizagem</h3>
    <p>Ao completar este capítulo, você será capaz de:</p>
    <ul>
      <li>Compreender a estrutura básica de documentos HTML5 e sua semântica</li>
      <li>Aplicar estilos CSS para criar layouts responsivos e atraentes</li>
      <li>Implementar interatividade básica com JavaScript</li>
      <li>Seguir as melhores práticas de desenvolvimento web moderno</li>
      <li>Otimizar páginas web para performance e acessibilidade</li>
    </ul>

    <h3>🌐 Conteúdo Programático</h3>
    
    <h4>1. HTML5 - Estrutura e Semântica</h4>
    <ul>
      <li><strong>Elementos semânticos:</strong> header, nav, main, section, article, aside, footer</li>
      <li><strong>Hierarquia de títulos:</strong> h1-h6 e sua importância para SEO</li>
      <li><strong>Formulários avançados:</strong> novos tipos de input e validação</li>
      <li><strong>Multimedia:</strong> video, audio e suas configurações</li>
      <li><strong>Meta tags:</strong> viewport, description, keywords</li>
    </ul>

    <h4>2. CSS3 - Estilização e Layout</h4>
    <ul>
      <li><strong>Flexbox:</strong> alinhamento e distribuição de elementos</li>
      <li><strong>CSS Grid:</strong> layouts bidimensionais complexos</li>
      <li><strong>Media Queries:</strong> design responsivo para diferentes dispositivos</li>
      <li><strong>Animações e transições:</strong> melhorando a experiência do usuário</li>
      <li><strong>Custom Properties:</strong> variáveis CSS para manutenibilidade</li>
    </ul>

    <h4>3. JavaScript Essencial</h4>
    <ul>
      <li><strong>DOM Manipulation:</strong> seleção e modificação de elementos</li>
      <li><strong>Event Listeners:</strong> interatividade com o usuário</li>
      <li><strong>ES6+ Features:</strong> let/const, arrow functions, template literals</li>
      <li><strong>APIs do Browser:</strong> localStorage, geolocation, fetch</li>
      <li><strong>Debugging:</strong> console, breakpoints e DevTools</li>
    </ul>

    <h3>🎯 Metodologia</h3>
    <p>Este capítulo combina teoria e prática através de:</p>
    <ul>
      <li><strong>Vídeo-aula:</strong> Explicação detalhada dos conceitos com exemplos práticos</li>
      <li><strong>Material de apoio:</strong> PDF com referências e exercícios complementares</li>
      <li><strong>Exercícios práticos:</strong> 4 projetos incrementais para aplicar o conhecimento</li>
      <li><strong>Quiz interativo:</strong> 8 questões para avaliar o aprendizado</li>
      <li><strong>Recursos externos:</strong> Links para ferramentas e jogos educativos</li>
    </ul>

    <h3>⏱️ Tempo Estimado</h3>
    <p><strong>Total:</strong> 3-4 horas</p>
    <ul>
      <li>Vídeo-aula: 20 minutos</li>
      <li>Leitura do material: 30 minutos</li>
      <li>Exercícios práticos: 2-2.5 horas</li>
      <li>Quiz e revisão: 15-30 minutos</li>
    </ul>

    <h3>✅ Pré-requisitos</h3>
    <ul>
      <li>Conhecimentos básicos de informática</li>
      <li>Editor de código instalado (VS Code recomendado)</li>
      <li>Navegador web moderno (Chrome, Firefox, Safari ou Edge)</li>
      <li>Conclusão do Capítulo 1: Introdução ao Desenvolvimento Web</li>
    </ul>

    <p><strong>Dica:</strong> Assista ao vídeo primeiro, depois leia o material PDF e pratique com os exercícios. O quiz ao final ajudará a consolidar seu aprendizado!</p>
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
    totalQuestions: 8, // Updated to match real quiz
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
    totalExercises: 4, // Updated to match new exercises
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