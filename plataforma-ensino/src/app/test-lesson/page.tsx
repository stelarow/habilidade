'use client'

import React, { useEffect, useState, useCallback } from 'react'

// Force dynamic rendering to prevent SSR issues with DOM APIs
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { GradientButton, Starfield, Loading } from '@/components/ui'
import { 
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  ClipboardText,
  FileText,
  Download,
  Target,
  PaperPlaneRight,
  Plus,
  Trophy
} from '@phosphor-icons/react'

// Import new components and hooks
import { useCompletionCriteria } from '@/hooks/useCompletionCriteria'
import { CompletionProgress, CompactProgressHeader } from '@/components/lesson/progress'
import { LessonCompletionButton } from '@/components/lesson/completion/LessonCompletionButton'
import { PDFViewer } from '@/components/lesson/pdf/PDFViewer'

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

export default function TestLessonPage() {
  const router = useRouter()
  
  // Mock data for test lesson - mirrors regular lesson structure
  const [course] = useState<Course>({
    id: 'test-course-123',
    title: 'Curso de Desenvolvimento Web',
    slug: 'desenvolvimento-web'
  })
  
  const [lesson] = useState<Lesson>({
    id: 'test-lesson-123',
    course_id: 'test-course-123',
    title: 'Capítulo 2: Fundamentos do Desenvolvimento Web',
    slug: 'test-lesson',
    description: 'Aprenda os conceitos fundamentais de HTML, CSS e JavaScript através de exemplos práticos e exercícios interativos.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_duration: 1200,
    order_index: 2,
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

      <h3>⏱️ Tempo Estimado</h3>
      <p><strong>Total:</strong> 3-4 horas</p>
      <ul>
        <li>Vídeo-aula: 20 minutos</li>
        <li>Leitura do material: 30 minutos</li>
        <li>Exercícios práticos: 2-2.5 horas</li>
        <li>Quiz e revisão: 15-30 minutos</li>
      </ul>
    `,
    materials: [
      {
        type: 'pdf',
        title: 'HTML5 - Guia Completo de Elementos Semânticos',
        description: 'Referência detalhada de todos os elementos HTML5 com exemplos práticos',
        url: '/materials/html5-semantic-guide.pdf'
      },
      {
        type: 'pdf',
        title: 'CSS Grid e Flexbox - Manual Prático',
        description: 'Guia visual para layouts modernos com CSS Grid e Flexbox',
        url: '/materials/css-layout-guide.pdf'
      },
      {
        type: 'link',
        title: 'MDN Web Docs - HTML5',
        description: 'Documentação oficial do HTML5 com exemplos interativos',
        url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML'
      }
    ],
    allows_file_upload: true,
    is_preview: false,
    is_published: true
  })
  
  const [progress] = useState<UserProgress>({
    lesson_id: 'test-lesson-123',
    completed: false,
    last_position: 0,
    watch_time: 0
  })
  
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  const [userId] = useState<string>('test-user-123')
  const [enrollmentId] = useState<string>('test-enrollment-123')
  
  // Mock exercises data
  const [exercises] = useState([
    {
      id: 'ex1',
      title: 'Estrutura HTML5 Semântica',
      description: 'Crie uma página HTML5 utilizando elementos semânticos (header, nav, main, section, aside, footer) com conteúdo sobre desenvolvimento web.',
      order_index: 1,
      download_url: '/exercises/exercise1.html'
    },
    {
      id: 'ex2',
      title: 'CSS Layout Responsivo',
      description: 'Aplicar estilos CSS à página criada no exercício anterior, implementando um layout responsivo com CSS Grid ou Flexbox.',
      order_index: 2,
      download_url: '/exercises/exercise2.css'
    },
    {
      id: 'ex3',
      title: 'Interatividade com JavaScript',
      description: 'Adicione funcionalidades JavaScript à sua página: menu hambúrguer para mobile, formulário de contato com validação básica.',
      order_index: 3,
      download_url: '/exercises/exercise3.js'
    }
  ])
  
  // Mock quizzes data
  const [quizzes] = useState([
    {
      id: 'quiz1',
      title: 'Avaliação: Fundamentos do Desenvolvimento Web',
      description: 'Teste completo sobre HTML, CSS, JavaScript e conceitos de desenvolvimento web responsivo.',
      passing_score: 70,
      attempts_allowed: 3
    }
  ])
  
  const [submissions] = useState([])
  const [uploading, setUploading] = useState(false)

  // Initialize completion criteria hook
  const completionCriteria = useCompletionCriteria({
    minimumTimeMinutes: 25,
    minimumQuizScore: 70,
    requireAllExercises: true,
    requireFullPDFRead: true,
    lessonId: lesson.id,
    pdfTotalPages: 10,
    onCompletionReady: () => {
      console.log('All completion criteria met!')
    }
  })

  const handleLessonComplete = useCallback(async () => {
    if (!completionCriteria.canComplete) return

    // Prepare completion data
    const completionData = {
      timeSpent: completionCriteria.pageTimer.timeSpent,
      pdfProgress: completionCriteria.pdfProgress.percentageRead,
      quizScore: 0, // Would come from quiz component
      exercisesCompleted: 0, // Would come from exercise component
      completionCriteria: completionCriteria.criteria
    }

    console.log('Completing lesson with data:', completionData)
    
    // Simulate API call
    alert('Aula concluída com sucesso! (Página de Teste)')
  }, [completionCriteria])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes > 0) {
      return `${minutes}min ${remainingSeconds > 0 ? `${remainingSeconds}s` : ''}`
    }
    return `${remainingSeconds}s`
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !lesson || !userId) return

    setUploading(true)
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Arquivo "${file.name}" enviado com sucesso! (Página de Teste)`)
      
      // Reset file input
      event.target.value = ''
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erro ao enviar arquivo')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao carregar aula</h3>
          <p className="text-white/60 mb-4">{error}</p>
          <GradientButton onClick={() => router.push('/test-lesson')}>
            Recarregar Página
          </GradientButton>
        </div>
      </div>
    )
  }

  if (!lesson || !course) {
    return null
  }

  // Map completion criteria to header format
  const headerCriteria = [
    {
      id: 'time',
      name: 'Tempo',
      isCompleted: completionCriteria.criteria.find(c => c.id === 'time')?.isCompleted || false,
      progress: completionCriteria.pageTimer.timeSpent >= (25 * 60) ? 100 : (completionCriteria.pageTimer.timeSpent / (25 * 60)) * 100,
      icon: <Clock className="w-4 h-4" weight="duotone" />,
      color: '#f59e0b',
      required: true
    },
    {
      id: 'pdf',
      name: 'Material PDF',
      isCompleted: completionCriteria.criteria.find(c => c.id === 'pdf')?.isCompleted || false,
      progress: completionCriteria.pdfProgress.percentageRead,
      icon: <FileText className="w-4 h-4" weight="duotone" />,
      color: '#00c4ff',
      required: true
    },
    {
      id: 'quiz',
      name: 'Quiz',
      isCompleted: completionCriteria.criteria.find(c => c.id === 'quiz')?.isCompleted || false,
      progress: 0, // Would come from quiz component
      icon: <Target className="w-4 h-4" weight="duotone" />,
      color: '#22c55e',
      required: true
    },
    {
      id: 'exercises',
      name: 'Exercícios',
      isCompleted: completionCriteria.criteria.find(c => c.id === 'exercises')?.isCompleted || false,
      progress: 0, // Would come from exercises component
      icon: <ClipboardText className="w-4 h-4" weight="duotone" />,
      color: '#ef4444',
      required: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <Starfield count={30} className="opacity-20" />
      
      {/* Compact Progress Header */}
      <CompactProgressHeader
        criteria={headerCriteria}
        overallProgress={completionCriteria.overallProgress}
        canComplete={completionCriteria.canComplete}
        completedCount={completionCriteria.completedCount}
        totalCount={completionCriteria.totalCount}
        timeRemaining={completionCriteria.pageTimer.formattedRemainingTime}
        currentTime={completionCriteria.pageTimer.formattedTime}
        onSectionClick={(sectionId) => {
          // Handle section navigation
          const element = document.getElementById(`section-${sectionId}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
          
          <div className="flex items-center gap-2 text-gray-400">
            <span>{course.title}</span>
            <span>/</span>
            <span className="text-white">{lesson.title}</span>
          </div>
          
          <div className="ml-auto">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
              📚 Página de Teste
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            {lesson.video_url && (
              <div id="section-video" className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
                <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-primary mx-auto mb-2" />
                    <p className="text-gray-400">Player de vídeo será integrado aqui</p>
                    <p className="text-sm text-gray-500 mt-1">URL: {lesson.video_url}</p>
                  </div>
                </div>
                
                {lesson.video_duration && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Duração: {formatDuration(lesson.video_duration)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Lesson Content */}
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h1 className="text-3xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
                {lesson.title}
              </h1>
              
              {lesson.description && (
                <p className="text-gray-300 text-lg mb-6">{lesson.description}</p>
              )}

              {lesson.content && (
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                </div>
              )}
            </div>

            {/* PDF Viewer */}
            <div id="section-pdf" className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Material PDF
              </h3>
              
              <PDFViewer
                pdf={{
                  id: 'lesson-pdf',
                  title: 'Material da Aula',
                  url: '/pdf/capitulo2.pdf',
                  filename: 'capitulo2.pdf',
                  size: 1024 * 1024, // 1MB
                  pageCount: 10,
                  downloadable: true
                }}
                onProgressUpdate={(progress) => {
                  // Update PDF progress with debounced scroll handling
                  const currentPage = Math.ceil(progress / 10)
                  completionCriteria.pdfProgress.setCurrentPageFromScroll(currentPage)
                }}
              />
            </div>

            {/* Materials */}
            {lesson.materials && lesson.materials.length > 0 && (
              <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Materiais da Aula
                </h3>
                
                <div className="space-y-3">
                  {lesson.materials.map((material: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <Download className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium text-white">{material.title}</p>
                          <p className="text-sm text-gray-400">{material.description}</p>
                        </div>
                      </div>
                      {material.url && (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                        >
                          {material.type === 'link' ? 'Acessar' : 'Download'}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercises */}
            {exercises.length > 0 && (
              <div id="section-exercises" className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <ClipboardText className="w-5 h-5 text-primary" weight="duotone" />
                  Exercícios
                </h3>
                
                <div className="space-y-3">
                  {exercises.map((exercise: any, index: number) => (
                    <div key={exercise.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full text-primary font-semibold">
                          {exercise.order_index}
                        </div>
                        <div>
                          <p className="font-medium text-white">{exercise.title}</p>
                          {exercise.description && (
                            <p className="text-sm text-gray-400">{exercise.description}</p>
                          )}
                        </div>
                      </div>
                      {exercise.download_url && (
                        <a
                          href={exercise.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quizzes */}
            {quizzes.length > 0 && (
              <div id="section-quiz" className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" weight="duotone" />
                  Questionários
                </h3>
                
                <div className="space-y-3">
                  {quizzes.map((quiz: any) => (
                    <div key={quiz.id} className="p-4 bg-zinc-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{quiz.title}</h4>
                        <Trophy className="w-5 h-5 text-yellow-400" />
                      </div>
                      
                      {quiz.description && (
                        <p className="text-sm text-gray-400 mb-3">{quiz.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Nota mínima: {quiz.passing_score}%</span>
                        <span>Tentativas: {quiz.attempts_allowed}</span>
                      </div>
                      
                      <GradientButton className="w-full mt-3">
                        Iniciar Questionário
                      </GradientButton>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Submission */}
            {lesson.allows_file_upload && enrollmentId && (
              <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <PaperPlaneRight className="w-5 h-5 text-primary" />
                  Envio de Arquivos
                </h3>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer flex flex-col items-center gap-2 ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Plus className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-400">
                        {uploading ? 'Enviando...' : 'Clique para enviar arquivo'}
                      </span>
                    </label>
                  </div>
                  
                  {/* Previous Submissions */}
                  {submissions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Arquivos Enviados</h4>
                      {submissions.map((submission: any) => (
                        <div key={submission.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-gray-700">
                          <div>
                            <p className="font-medium text-white">{submission.file_name}</p>
                            <p className="text-sm text-gray-400">
                              Enviado em {new Date(submission.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              submission.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                              submission.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {submission.status === 'approved' ? 'Aprovado' :
                               submission.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Completion Progress */}
            <CompletionProgress
              criteria={completionCriteria.criteria}
              overallProgress={completionCriteria.overallProgress}
              canComplete={completionCriteria.canComplete}
              completedCount={completionCriteria.completedCount}
              totalCount={completionCriteria.totalCount}
              timeRemaining={completionCriteria.pageTimer.formattedRemainingTime}
            />

            {/* Completion Button */}
            <LessonCompletionButton
              lessonId={lesson.id}
              courseSlug={course.slug}
              canComplete={completionCriteria.canComplete}
              completedCount={completionCriteria.completedCount}
              totalCount={completionCriteria.totalCount}
              onComplete={handleLessonComplete}
              completionData={{
                timeSpent: completionCriteria.pageTimer.timeSpent,
                pdfProgress: completionCriteria.pdfProgress.percentageRead,
                quizScore: 0, // Would come from quiz component
                exercisesCompleted: 0, // Would come from exercise component
                completionCriteria: completionCriteria.criteria
              }}
            />

            {/* Lesson Info */}
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Informações da Aula</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Ordem</span>
                  <span className="text-white font-semibold">#{lesson.order_index}</span>
                </div>
                
                {lesson.video_duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duração</span>
                    <span className="text-white font-semibold">{formatDuration(lesson.video_duration)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tempo na página</span>
                  <span className="text-white font-semibold">{completionCriteria.pageTimer.formattedTime}</span>
                </div>
                
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-2 text-center">
                  <span className="text-blue-400 text-sm font-semibold">📚 Página de Teste - Layout Espelho</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}