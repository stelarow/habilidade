'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GradientButton, Starfield, Loading } from '@/components/ui'
import { 
  Clock,
  BookOpen,
  FileText,
  Download,
  Question,
  PaperPlaneRight,
  Plus,
  Trophy
} from 'phosphor-react'

// Import new components and hooks
import { useCompletionCriteria } from '@/hooks/useCompletionCriteria'
import { useVideoProgress } from '@/hooks/useVideoProgress'
import { QuizInterface } from '@/components/lesson/quiz/QuizInterface'
import { PDFViewer } from '@/components/lesson/pdf/PDFViewer'
import { LessonHeader } from '@/components/lesson/header'
import VideoPlayer from '@/components/ui/VideoPlayer'
import { VideoProgress } from '@/types'
import { QuizData } from '@/types/lesson'
import { LessonProgressData } from '@/types/lesson/progress'

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

export default function LessonPageRefactored() {
  const router = useRouter()
  const params = useParams()
  const courseSlug = params?.slug as string
  const lessonSlug = params?.lessonSlug as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null)
  const [exercises, setExercises] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [videoLoading, setVideoLoading] = useState(true)
  
  // Quiz state management
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null)
  const [quizProgress, setQuizProgress] = useState<{[key: string]: any}>({})
  const [quizError, setQuizError] = useState<string | null>(null)
  
  const supabase = createClient()

  // Initialize video progress hook
  const videoProgress = useVideoProgress({
    lessonId: lesson?.id || '',
    userId: userId || '',
    enrollmentId: enrollmentId || '',
    autoSaveInterval: 5000,
    completionThreshold: 0.9
  })

  // Initialize completion criteria hook
  const completionCriteria = useCompletionCriteria({
    minimumTimeMinutes: 25,
    minimumQuizScore: 70,
    requireAllExercises: true,
    requireFullPDFRead: true,
    lessonId: lesson?.id || 'default',
    pdfTotalPages: 10, // This should come from the lesson data
    onCompletionReady: () => {
      console.log('All completion criteria met!')
    }
  })

  const fetchLessonData = useCallback(async () => {
    try {
      // Get user authentication
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)

      // Fetch course by slug
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, slug')
        .eq('slug', courseSlug)
        .eq('is_published', true)
        .single()

      if (courseError) {
        if (courseError.code === 'PGRST116') {
          setError('Curso não encontrado')
        } else {
          throw courseError
        }
        return
      }

      setCourse(courseData)

      // Fetch lesson by slug and course
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .eq('slug', lessonSlug)
        .eq('is_published', true)
        .single()

      if (lessonError) {
        if (lessonError.code === 'PGRST116') {
          setError('Aula não encontrada')
        } else {
          throw lessonError
        }
        return
      }

      setLesson(lessonData)

      // Check enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseData.id)
        .eq('status', 'active')
        .single()

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        throw enrollmentError
      }

      if (!enrollmentData && !lessonData.is_preview) {
        setError('Você precisa estar matriculado para acessar esta aula')
        return
      }

      if (enrollmentData) {
        setEnrollmentId(enrollmentData.id)

        // Fetch user progress for this lesson
        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonData.id)
          .eq('enrollment_id', enrollmentData.id)
          .single()

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError
        }

        if (progressData) {
          setProgress(progressData)
        } else {
          // Create initial progress record
          const { data: newProgress, error: createError } = await supabase
            .from('progress')
            .insert({
              user_id: user.id,
              lesson_id: lessonData.id,
              enrollment_id: enrollmentData.id,
              completed: false,
              last_position: 0,
              watch_time: 0
            })
            .select()
            .single()

          if (createError) throw createError
          setProgress(newProgress)
        }
      }

      // Fetch exercises, quizzes, and submissions
      try {
        const { data: exercisesData } = await supabase
          .from('exercises')
          .select('*')
          .eq('lesson_id', lessonData.id)
          .order('order_index')
        
        setExercises(exercisesData || [])
      } catch (exerciseError) {
        setExercises([])
      }

      try {
        const { data: quizzesData } = await supabase
          .from('quizzes')
          .select('*')
          .eq('lesson_id', lessonData.id)
        
        setQuizzes(quizzesData || [])
      } catch (quizError) {
        setQuizzes([])
      }

      if (enrollmentData && user) {
        try {
          const { data: submissionsData } = await supabase
            .from('lesson_submissions')
            .select('*')
            .eq('lesson_id', lessonData.id)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          
          setSubmissions(submissionsData || [])
        } catch (submissionError) {
          setSubmissions([])
        }
      }

    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar aula')
    } finally {
      setLoading(false)
    }
  }, [courseSlug, lessonSlug, supabase, router])

  useEffect(() => {
    fetchLessonData()
  }, [fetchLessonData])

  // Quiz handlers
  const handleQuizStart = useCallback((quizId: string) => {
    setActiveQuizId(quizId)
    setQuizError(null)
  }, [])

  const handleQuizComplete = useCallback((score: number, attempts: any[]) => {
    const currentQuiz = quizzes.find(q => q.id === activeQuizId)
    if (!currentQuiz) return

    const isPassed = score >= currentQuiz.passing_score
    
    // Update quiz progress
    setQuizProgress(prev => ({
      ...prev,
      [activeQuizId!]: {
        score,
        attempts: attempts.length,
        isCompleted: true,
        isPassed,
        completedAt: new Date().toISOString()
      }
    }))

    // Update completion criteria with quiz progress
    const progressData: LessonProgressData = {
      videoProgress: {
        currentTime: 0,
        duration: 0,
        percentageWatched: 0,
        watchTime: 0,
        lastPosition: 0,
        playbackRate: 1,
        completedSegments: []
      },
      pdfProgress: {
        currentPage: 0,
        totalPages: 10,
        percentageRead: completionCriteria.pdfProgress.percentageRead,
        bookmarks: [],
        readingTime: 0,
        lastPageViewed: 0
      },
      quizProgress: {
        currentQuestion: attempts.length,
        totalQuestions: attempts.length,
        answeredQuestions: attempts.map((_, i) => i),
        score,
        attempts: 1,
        timeSpent: attempts.reduce((sum, a) => sum + a.timeSpent, 0),
        isCompleted: true,
        isPassed
      },
      exerciseProgress: {
        completedExercises: [],
        submittedFiles: [],
        pendingReviews: [],
        totalExercises: exercises.length,
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
    }

    completionCriteria.updateProgress(progressData)

    // Close quiz interface after a delay
    setTimeout(() => {
      setActiveQuizId(null)
    }, 3000)
  }, [activeQuizId, quizzes, completionCriteria, exercises.length])

  const handleQuizError = useCallback((error: string) => {
    setQuizError(error)
    console.error('Quiz error:', error)
  }, [])

  const handleLessonComplete = useCallback(async () => {
    if (!completionCriteria.canComplete) return

    // Get current quiz score from progress
    const currentQuizScore = Object.values(quizProgress).reduce((max: number, quiz: any) => 
      Math.max(max, quiz.score || 0), 0
    )

    // Prepare completion data
    const completionData = {
      timeSpent: completionCriteria.pageTimer.timeSpent,
      pdfProgress: completionCriteria.pdfProgress.percentageRead,
      quizScore: currentQuizScore,
      exercisesCompleted: 0, // Would come from exercise component
      completionCriteria: completionCriteria.criteria
    }

    console.log('Completing lesson with data:', completionData)
  }, [completionCriteria, quizProgress])

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
      // Create form data for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('lesson_id', lesson.id)
      formData.append('user_id', userId)

      // Upload file (this would need a file upload API endpoint)
      const response = await fetch('/api/lessons/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      
      // Add to submissions list
      setSubmissions(prev => [result.data, ...prev])
      
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
          <GradientButton onClick={() => router.push(`/course/${courseSlug}`)}>
            Voltar ao Curso
          </GradientButton>
        </div>
      </div>
    )
  }

  if (!lesson || !course) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <Starfield count={30} className="opacity-20" />
      
      {/* New Lesson Header */}
      <LessonHeader
        course={course}
        lesson={lesson}
        progressData={{
          videoProgress: {
            currentTime: videoProgress.progress?.last_position || 0,
            duration: lesson.video_duration || 0,
            percentageWatched: videoProgress.progress?.watch_time ? (videoProgress.progress.watch_time / (lesson.video_duration || 1)) * 100 : 0,
            watchTime: videoProgress.progress?.watch_time || 0,
            lastPosition: videoProgress.progress?.last_position || 0,
            playbackRate: 1,
            completedSegments: []
          },
          pdfProgress: {
            currentPage: completionCriteria.pdfProgress.currentPage,
            totalPages: completionCriteria.pdfProgress.totalPages,
            percentageRead: completionCriteria.pdfProgress.percentageRead,
            bookmarks: [],
            readingTime: 0,
            lastPageViewed: completionCriteria.pdfProgress.currentPage
          },
          quizProgress: {
            currentQuestion: 0,
            totalQuestions: quizzes.length,
            answeredQuestions: [],
            score: Object.values(quizProgress).reduce((max: number, quiz: any) => 
              Math.max(max, quiz.score || 0), 0
            ),
            attempts: Object.values(quizProgress).reduce((max: number, quiz: any) => 
              Math.max(max, quiz.attempts || 0), 0
            ),
            timeSpent: 0,
            isCompleted: completionCriteria.criteria.find(c => c.id === 'quiz')?.isCompleted || false,
            isPassed: completionCriteria.criteria.find(c => c.id === 'quiz')?.isCompleted || false
          },
          exerciseProgress: {
            completedExercises: submissions.filter(sub => sub.status === 'approved').map(sub => sub.exercise_id),
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
            completionPercentage: exercises.length > 0 ? (submissions.filter(sub => sub.status === 'approved').length / exercises.length) * 100 : 0
          },
          contentProgress: {
            scrollPercentage: 0,
            readingTime: 0,
            sectionsRead: [],
            estimatedCompletionTime: 0
          },
          overallProgress: {
            percentageComplete: completionCriteria.overallProgress,
            estimatedTimeRemaining: 0,
            lastActivity: new Date().toISOString(),
            isCompleted: completionCriteria.canComplete,
            componentProgress: [
              {
                component: 'video',
                percentage: videoProgress.progress?.watch_time ? (videoProgress.progress.watch_time / (lesson.video_duration || 1)) * 100 : 0,
                timeSpent: videoProgress.progress?.watch_time || 0,
                isCompleted: false,
                weight: 0.25
              },
              {
                component: 'pdf',
                percentage: completionCriteria.pdfProgress.percentageRead,
                timeSpent: 0,
                isCompleted: completionCriteria.criteria.find(c => c.id === 'pdf')?.isCompleted || false,
                weight: 0.25
              },
              {
                component: 'quiz',
                percentage: Object.values(quizProgress).reduce((max: number, quiz: any) => 
                  Math.max(max, quiz.score || 0), 0
                ),
                timeSpent: 0,
                isCompleted: completionCriteria.criteria.find(c => c.id === 'quiz')?.isCompleted || false,
                weight: 0.25
              },
              {
                component: 'exercises',
                percentage: exercises.length > 0 ? (submissions.filter(sub => sub.status === 'approved').length / exercises.length) * 100 : 0,
                timeSpent: 0,
                isCompleted: completionCriteria.criteria.find(c => c.id === 'exercises')?.isCompleted || false,
                weight: 0.25
              }
            ]
          }
        }}
        onExit={() => {
          console.log('Exiting lesson')
        }}
        onComplete={handleLessonComplete}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Main Content - Full Width Layout (No Sidebar) */}
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Video Player */}
            {lesson.video_url && (
              <div id="section-video" className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
{videoError ? (
                  <div className="aspect-video bg-red-900/20 rounded-lg flex items-center justify-center border border-red-500/30">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-400 text-2xl">⚠</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Erro no Player de Vídeo</h3>
                      <p className="text-red-400 mb-4">{videoError}</p>
                      <button
                        onClick={() => {
                          setVideoError(null)
                          setVideoLoading(true)
                        }}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                      >
                        Tentar Novamente
                      </button>
                    </div>
                  </div>
                ) : (
                  <VideoPlayer
                    url={lesson.video_url}
                    controls={true}
                    width="100%"
                    height="100%"
                    className="aspect-video rounded-lg overflow-hidden"
                    lesson={{
                      id: lesson.id,
                      title: lesson.title,
                      video_duration: lesson.video_duration || 0
                    }}
                    onProgressUpdate={videoProgress.handleProgress}
                    onLessonComplete={() => {
                      console.log('Video completed - 90% watched')
                    }}
                    onProgress={(progress) => {
                      // Handle video progress for UI updates
                      console.log('Video progress:', progress)
                    }}
                    onPlay={() => {
                      console.log('Video started playing')
                      setVideoLoading(false)
                    }}
                    onPause={() => {
                      console.log('Video paused')
                    }}
                    onEnded={() => {
                      console.log('Video ended')
                    }}
                    onReady={(player) => {
                      console.log('Video player ready')
                      setVideoLoading(false)
                      setVideoError(null)
                      
                      // Seek to last saved position if available
                      if (progress?.last_position && progress.last_position > 0) {
                        player.seekTo(progress.last_position, 'seconds')
                      }
                    }}
                    onError={(error) => {
                      console.error('Video player error:', error)
                      setVideoError('Não foi possível carregar o vídeo. Verifique sua conexão.')
                      setVideoLoading(false)
                    }}
                  />
                )}
                
                {lesson.video_duration && (
                  <div className="flex items-center gap-2 text-gray-400 mt-4">
                    <Clock className="w-4 h-4" />
                    <span>Duração: {formatDuration(lesson.video_duration)}</span>
                  </div>
                )}
                
                {/* Video Progress Info */}
                {videoProgress.progress && (
                  <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progresso do vídeo:</span>
                      <span className="text-white">
                        {formatDuration(videoProgress.progress.watch_time)} assistidos
                      </span>
                    </div>
                    {videoProgress.progress.last_position > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Última posição: {formatDuration(videoProgress.progress.last_position)}
                      </div>
                    )}
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
                  // Only update current page if user stays on the same page for a moment
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
                          <p className="text-sm text-gray-400">{material.type}</p>
                        </div>
                      </div>
                      {material.url && (
                        <a
                          href={material.url}
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

            {/* Exercises */}
            {exercises.length > 0 && (
              <div id="section-exercises" className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
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
                  <Question className="w-5 h-5 text-primary" />
                  Questionários
                </h3>
                
                {/* Quiz Error Display */}
                {quizError && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-xl">⚠️</span>
                      <div>
                        <h4 className="text-red-400 font-semibold">Erro no Questionário</h4>
                        <p className="text-red-300 text-sm">{quizError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {quizzes.map((quiz: any) => {
                    const quizProgressData = quizProgress[quiz.id]
                    const isActive = activeQuizId === quiz.id
                    
                    // Convert quiz data to QuizData format
                    const quizData: QuizData = {
                      id: quiz.id,
                      title: quiz.title,
                      description: quiz.description,
                      timeLimit: quiz.time_limit_minutes,
                      attemptsAllowed: quiz.attempts_allowed,
                      passingScore: quiz.passing_score,
                      totalQuestions: quiz.questions?.length || 3, // Default to 3 for demo
                      status: quizProgressData?.isCompleted 
                        ? (quizProgressData.isPassed ? 'passed' : 'failed')
                        : 'not_started',
                      lastScore: quizProgressData?.score,
                      remainingAttempts: quiz.attempts_allowed - (quizProgressData?.attempts || 0)
                    }
                    
                    return (
                      <div key={quiz.id}>
                        {isActive ? (
                          // Show QuizInterface when quiz is active
                          <QuizInterface
                            quiz={quizData}
                            onComplete={handleQuizComplete}
                            onProgressUpdate={(questionIndex, score) => {
                              console.log(`Quiz progress: Question ${questionIndex}, Score: ${score}%`)
                            }}
                            className="quiz-interface-container"
                          />
                        ) : (
                          // Show quiz card when not active
                          <div className="p-4 bg-zinc-800/50 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-white">{quiz.title}</h4>
                              <div className="flex items-center gap-2">
                                {quizProgressData?.isCompleted && (
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    quizProgressData.isPassed 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {quizProgressData.isPassed ? `✅ ${quizProgressData.score}%` : `❌ ${quizProgressData.score}%`}
                                  </span>
                                )}
                                <Trophy className="w-5 h-5 text-yellow-400" />
                              </div>
                            </div>
                            
                            {quiz.description && (
                              <p className="text-sm text-gray-400 mb-3">{quiz.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                              <span>Nota mínima: {quiz.passing_score}%</span>
                              <span>Tentativas: {quizData.remainingAttempts || quiz.attempts_allowed}</span>
                            </div>
                            
                            {quizProgressData?.isCompleted && quizProgressData.isPassed ? (
                              <div className="text-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <span className="text-green-400 font-semibold">✅ Questionário Concluído com Sucesso!</span>
                                <p className="text-green-300 text-sm mt-1">Pontuação: {quizProgressData.score}%</p>
                              </div>
                            ) : (
                              <GradientButton 
                                className="w-full mt-3"
                                onClick={() => handleQuizStart(quiz.id)}
                                disabled={(quizData.remainingAttempts || 0) === 0}
                              >
                                {quizProgressData?.isCompleted && !quizProgressData.isPassed
                                  ? (quizData.remainingAttempts || 0) > 0 
                                    ? '🔄 Tentar Novamente' 
                                    : '❌ Sem Tentativas Restantes'
                                  : '🚀 Iniciar Questionário'
                                }
                              </GradientButton>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
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
      </div>
    </div>
  )
}