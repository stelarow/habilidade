'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GradientButton, Starfield, Loading } from '@/components/ui'
import { 
  BookOpen, 
  Clock, 
  User,
  Play,
  ArrowLeft,
  CheckCircle,
  Lock,
  Star,
  Medal,
  TrendUp
} from 'phosphor-react'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  thumbnail_url?: string
  price: number
  duration_minutes: number
  level: 'beginner' | 'intermediate' | 'advanced'
  requirements?: string[]
  what_you_learn?: string[]
  category?: {
    name: string
    color_theme: string
  }
  instructor?: {
    user?: {
      full_name: string
    }
  }
}

interface Lesson {
  id: string
  title: string
  slug: string
  description?: string
  video_duration?: number
  order_index: number
  is_preview: boolean
  is_published: boolean
}

interface UserProgress {
  lesson_id: string
  completed: boolean
  completed_at?: string
  watch_time?: number
}

export default function CoursePage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchCourseData = useCallback(async () => {
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
        .select(`
          *,
          category:categories(name, color_theme),
          instructor:instructors(
            user:users(full_name)
          )
        `)
        .eq('slug', slug)
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

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .eq('is_published', true)
        .order('order_index', { ascending: true })

      if (lessonsError) throw lessonsError
      setLessons(lessonsData || [])

      // Check enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseData.id)
        .eq('status', 'active')
        .single()

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        throw enrollmentError
      }

      setIsEnrolled(!!enrollmentData)

      // Fetch user progress if enrolled
      if (enrollmentData && lessonsData?.length) {
        const lessonIds = lessonsData.map(l => l.id)
        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .in('lesson_id', lessonIds)

        if (progressError) throw progressError
        setUserProgress(progressData || [])
      }

    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar curso')
    } finally {
      setLoading(false)
    }
  }, [slug, supabase, router])

  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  const handleEnroll = async () => {
    if (!userId || !course) return

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: course.id,
          status: 'active',
          enrolled_at: new Date().toISOString()
        })

      if (error) throw error

      setIsEnrolled(true)
      // Refresh data
      fetchCourseData()
    } catch (err) {
      console.error('Error enrolling in course:', err)
    }
  }

  const handleStartLesson = (lessonSlug: string) => {
    router.push(`/course/${slug}/lesson/${lessonSlug}`)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`
    }
    return `${mins}min`
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-400 bg-green-400/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20'
      case 'advanced': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante'
      case 'intermediate': return 'Intermediário'
      case 'advanced': return 'Avançado'
      default: return level
    }
  }

  const getProgressPercentage = () => {
    if (!lessons.length) return 0
    const completedLessons = lessons.filter(lesson => 
      userProgress.some(p => p.lesson_id === lesson.id && p.completed)
    ).length
    return Math.round((completedLessons / lessons.length) * 100)
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
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao carregar curso</h3>
          <p className="text-white/60 mb-4">{error}</p>
          <GradientButton onClick={() => router.push('/courses')}>
            Voltar aos Cursos
          </GradientButton>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <Starfield count={30} className="opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/courses')}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Cursos</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6 mb-6">
              {/* Course Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                    {course.title}
                  </h1>
                  <p className="text-gray-300 text-lg mb-4">{course.short_description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    {course.category && (
                      <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary">
                        {course.category.name}
                      </span>
                    )}
                    <span className={`text-sm px-3 py-1 rounded-full ${getLevelColor(course.level)}`}>
                      {getLevelText(course.level)}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(course.duration_minutes)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{lessons.length} aulas</span>
                    </div>
                    {course.instructor?.user && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{course.instructor.user.full_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Sobre o Curso</h3>
                <p className="text-gray-300 leading-relaxed">{course.description}</p>
              </div>

              {/* What You'll Learn */}
              {course.what_you_learn && course.what_you_learn.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <Medal className="w-5 h-5 text-primary" />
                    O que você vai aprender
                  </h3>
                  <ul className="space-y-2">
                    {course.what_you_learn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Requisitos</h3>
                  <ul className="space-y-2">
                    {course.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <div className="text-center mb-6">
                {course.price > 0 ? (
                  <div className="text-3xl font-bold text-primary mb-2">
                    R$ {course.price.toFixed(2)}
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    Gratuito
                  </div>
                )}
                <p className="text-gray-400 text-sm">Acesso completo ao curso</p>
              </div>

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="bg-green-400/20 border border-green-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-semibold">Matriculado</span>
                    </div>
                    <p className="text-green-200 text-sm">
                      Progresso: {getProgressPercentage()}% concluído
                    </p>
                  </div>
                  
                  <GradientButton 
                    onClick={() => {
                      const firstLesson = lessons.find(l => l.order_index === 1)
                      if (firstLesson) {
                        handleStartLesson(firstLesson.slug)
                      }
                    }}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continuar Estudando
                  </GradientButton>
                </div>
              ) : (
                <GradientButton onClick={handleEnroll} className="w-full">
                  Matricular-se Agora
                </GradientButton>
              )}
            </div>

            {/* Course Stats */}
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Estatísticas do Curso</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Aulas</span>
                  <span className="text-white font-semibold">{lessons.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Duração</span>
                  <span className="text-white font-semibold">{formatDuration(course.duration_minutes)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Nível</span>
                  <span className="text-white font-semibold">{getLevelText(course.level)}</span>
                </div>
                {isEnrolled && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Progresso</span>
                    <span className="text-primary font-semibold">{getProgressPercentage()}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="mt-8">
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Conteúdo do Curso
            </h3>

            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const isCompleted = userProgress.some(p => p.lesson_id === lesson.id && p.completed)
                const canAccess = isEnrolled || lesson.is_preview

                return (
                  <div
                    key={lesson.id}
                    className={`relative flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-950/30 border-green-500/30 hover:bg-green-950/40 cursor-pointer shadow-lg shadow-green-500/10' 
                        : canAccess 
                        ? 'bg-zinc-800/50 border-gray-700 hover:bg-zinc-800/70 cursor-pointer' 
                        : 'bg-zinc-800/30 border-gray-800 opacity-60'
                    }`}
                    onClick={() => canAccess && handleStartLesson(lesson.slug)}
                  >
                    {/* Completion shine effect */}
                    {isCompleted && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse" />
                    )}
                    
                    <div className="relative flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        isCompleted 
                          ? 'bg-green-500/20 ring-2 ring-green-400/30' 
                          : 'bg-primary/20'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : canAccess ? (
                          <Play className="w-4 h-4 text-primary" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold ${isCompleted ? 'text-green-100' : 'text-white'}`}>
                            {lesson.title}
                          </h4>
                          {isCompleted && (
                            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                              ✓ Concluída
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${isCompleted ? 'text-green-200' : 'text-gray-400'}`}>
                          {lesson.description}
                        </p>
                      </div>
                    </div>
                    <div className="relative flex items-center gap-3">
                      {lesson.is_preview && (
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                          Preview
                        </span>
                      )}
                      <span className={`text-sm ${isCompleted ? 'text-green-300' : 'text-gray-400'}`}>
                        {formatDuration(lesson.video_duration || 60)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}