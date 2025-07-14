'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GradientButton, Starfield, Loading } from '@/components/ui'
import { 
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  FileText,
  Download
} from 'phosphor-react'

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

export default function LessonPage() {
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
  
  const supabase = createClient()

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

    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar aula')
    } finally {
      setLoading(false)
    }
  }, [courseSlug, lessonSlug, supabase, router])

  useEffect(() => {
    fetchLessonData()
  }, [fetchLessonData])

  const handleMarkCompleted = async () => {
    if (!progress || !enrollmentId || !userId || !lesson) return

    try {
      const { error } = await supabase
        .from('progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', progress.id)

      if (error) throw error

      setProgress({
        ...progress,
        completed: true,
        completed_at: new Date().toISOString()
      })
    } catch (err) {
      console.error('Error marking lesson as completed:', err)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes > 0) {
      return `${minutes}min ${remainingSeconds > 0 ? `${remainingSeconds}s` : ''}`
    }
    return `${remainingSeconds}s`
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
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push(`/course/${courseSlug}`)}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Curso</span>
          </button>
          
          <div className="flex items-center gap-2 text-gray-400">
            <span>{course.title}</span>
            <span>/</span>
            <span className="text-white">{lesson.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {lesson.video_url && (
              <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            {progress && (
              <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Progresso</h3>
                
                <div className="space-y-4">
                  {progress.completed ? (
                    <div className="bg-green-400/20 border border-green-400/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">Concluída</span>
                      </div>
                      <p className="text-green-200 text-sm">
                        Concluída em {progress.completed_at ? new Date(progress.completed_at).toLocaleDateString('pt-BR') : ''}
                      </p>
                    </div>
                  ) : (
                    <GradientButton onClick={handleMarkCompleted} className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Concluída
                    </GradientButton>
                  )}

                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Tempo assistido</span>
                      <span className="text-white">{formatDuration(progress.watch_time || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                
                {lesson.is_preview && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-2 text-center">
                    <span className="text-blue-400 text-sm font-semibold">Aula Gratuita</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}