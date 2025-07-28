'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GradientButton, Starfield, Loading } from '@/components/ui'
import { 
  TrendUp, 
  Clock,
  Calendar,
  Target,
  BookOpen,
  CheckCircle,
  Play,
  ArrowLeft,
  ChartBar,
  ChartLine,
  Medal,
  Fire
} from 'phosphor-react'

interface CourseProgress {
  course_id: string
  course_title: string
  course_slug: string
  total_lessons: number
  completed_lessons: number
  progress_percentage: number
  last_accessed: string
  total_watch_time: number
}

interface StudySession {
  date: string
  minutes: number
  lessons_completed: number
}

interface WeeklyStats {
  week: string
  total_minutes: number
  lessons_completed: number
  courses_accessed: number
}

export default function ProgressPage() {
  const router = useRouter()
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [overallStats, setOverallStats] = useState({
    totalWatchTime: 0,
    totalLessons: 0,
    activeCourses: 0,
    completedCourses: 0,
    currentStreak: 0,
    longestStreak: 0
  })
  const supabase = createClient()

  const fetchProgressData = useCallback(async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch real course progress data
      const { data: progressData, error: progressError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false })

      if (progressError) {
        console.warn('Progress data not available, using mock data:', progressError)
      }

      // Use real data if available, otherwise fallback to mock
      const realCourseProgress: CourseProgress[] = progressData?.map((p: any) => ({
        course_id: p.course_id,
        course_title: p.course_title,
        course_slug: p.course_slug,
        total_lessons: p.total_lessons || 0,
        completed_lessons: p.completed_lessons || 0,
        progress_percentage: p.progress_percentage || 0,
        last_accessed: p.last_accessed || p.enrolled_at,
        total_watch_time: p.total_watch_time || 0
      })) || []

      // Fallback to mock data if no real data
      const mockCourseProgress: CourseProgress[] = realCourseProgress.length > 0 ? realCourseProgress : [
        {
          course_id: '1',
          course_title: 'Inteligência Artificial: Fundamentos e Aplicações',
          course_slug: 'ia-fundamentos',
          total_lessons: 20,
          completed_lessons: 15,
          progress_percentage: 75,
          last_accessed: '2025-01-08T14:30:00Z',
          total_watch_time: 480 // 8 horas em minutos
        },
        {
          course_id: '2',
          course_title: 'Design Gráfico Profissional',
          course_slug: 'design-grafico',
          total_lessons: 15,
          completed_lessons: 8,
          progress_percentage: 53,
          last_accessed: '2025-01-07T16:15:00Z',
          total_watch_time: 360 // 6 horas
        },
        {
          course_id: '3',
          course_title: 'Programação Web Moderna',
          course_slug: 'programacao-web',
          total_lessons: 25,
          completed_lessons: 25,
          progress_percentage: 100,
          last_accessed: '2025-01-05T10:00:00Z',
          total_watch_time: 720 // 12 horas
        }
      ]

      const mockStudySessions: StudySession[] = [
        { date: '2025-01-08', minutes: 120, lessons_completed: 3 },
        { date: '2025-01-07', minutes: 90, lessons_completed: 2 },
        { date: '2025-01-06', minutes: 0, lessons_completed: 0 },
        { date: '2025-01-05', minutes: 150, lessons_completed: 4 },
        { date: '2025-01-04', minutes: 60, lessons_completed: 1 },
        { date: '2025-01-03', minutes: 180, lessons_completed: 5 },
        { date: '2025-01-02', minutes: 45, lessons_completed: 1 },
        { date: '2025-01-01', minutes: 75, lessons_completed: 2 }
      ]

      const mockWeeklyStats: WeeklyStats[] = [
        { week: 'Semana 1', total_minutes: 720, lessons_completed: 18, courses_accessed: 3 },
        { week: 'Semana 2', total_minutes: 540, lessons_completed: 12, courses_accessed: 2 },
        { week: 'Semana 3', total_minutes: 450, lessons_completed: 10, courses_accessed: 2 },
        { week: 'Semana 4', total_minutes: 600, lessons_completed: 15, courses_accessed: 3 }
      ]

      setCourseProgress(realCourseProgress.length > 0 ? realCourseProgress : mockCourseProgress)
      setStudySessions(mockStudySessions)
      setWeeklyStats(mockWeeklyStats)

      // Calcular estatísticas gerais
      const courseData = realCourseProgress.length > 0 ? realCourseProgress : mockCourseProgress
      const totalWatchTime = courseData.reduce((sum, course) => sum + course.total_watch_time, 0)
      const totalLessons = courseData.reduce((sum, course) => sum + course.completed_lessons, 0)
      const activeCourses = courseData.filter((course: any) => course.progress_percentage > 0 && course.progress_percentage < 100).length
      const completedCourses = courseData.filter((course: any) => course.progress_percentage === 100).length
      
      // Calcular sequência atual
      const currentStreak = calculateCurrentStreak(mockStudySessions)
      const longestStreak = calculateLongestStreak(mockStudySessions)

      setOverallStats({
        totalWatchTime,
        totalLessons,
        activeCourses,
        completedCourses,
        currentStreak,
        longestStreak
      })

    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar dados de progresso')
    } finally {
      setLoading(false)
    }
  }, [router, supabase])

  // Carregar dados após definir a função e ao mudar selectedPeriod
  useEffect(() => {
    fetchProgressData()
  }, [fetchProgressData, selectedPeriod])

  const calculateCurrentStreak = (sessions: StudySession[]): number => {
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].date)
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === i && sessions[i].minutes > 0) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const calculateLongestStreak = (sessions: StudySession[]): number => {
    let longestStreak = 0
    let currentStreak = 0
    
    for (const session of sessions) {
      if (session.minutes > 0) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }
    
    return longestStreak
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`
    }
    return `${mins}min`
  }

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'text-green-400 bg-green-400/20'
    if (percentage >= 50) return 'text-yellow-400 bg-yellow-400/20'
    return 'text-blue-400 bg-blue-400/20'
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
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao carregar progresso</h3>
          <p className="text-white/60 mb-4">{error}</p>
          <GradientButton onClick={fetchProgressData}>
            Tentar novamente
          </GradientButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <Starfield count={30} className="opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Relatório de Progresso
              </h1>
              <p className="text-gray-400 mt-2">
                Acompanhe seu desenvolvimento e estatísticas de estudo
              </p>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex items-center gap-2">
            {[
              { key: 'week', label: 'Semana' },
              { key: 'month', label: 'Mês' },
              { key: 'year', label: 'Ano' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as 'week' | 'month' | 'year')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-4 text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{formatDuration(overallStats.totalWatchTime)}</p>
            <p className="text-gray-400 text-xs">Tempo Total</p>
          </div>
          
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-4 text-center">
            <BookOpen className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{overallStats.totalLessons}</p>
            <p className="text-gray-400 text-xs">Aulas Concluídas</p>
          </div>
          
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-4 text-center">
            <Play className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{overallStats.activeCourses}</p>
            <p className="text-gray-400 text-xs">Cursos Ativos</p>
          </div>

          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{overallStats.completedCourses}</p>
            <p className="text-gray-400 text-xs">Cursos Concluídos</p>
          </div>

          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-4 text-center">
            <Fire className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{overallStats.currentStreak}</p>
            <p className="text-gray-400 text-xs">Sequência Atual</p>
          </div>

          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-4 text-center">
            <Medal className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{overallStats.longestStreak}</p>
            <p className="text-gray-400 text-xs">Maior Sequência</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Progress */}
          <div className="space-y-6">
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Progresso dos Cursos
              </h3>

              <div className="space-y-4">
                {courseProgress.map((course) => (
                  <div
                    key={course.course_id}
                    className="bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-800/70 transition-colors cursor-pointer"
                    onClick={() => router.push(`/course/${course.course_slug}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{course.course_title}</h4>
                        <p className="text-gray-400 text-sm">
                          {course.completed_lessons} de {course.total_lessons} aulas • {formatDuration(course.total_watch_time)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getProgressColor(course.progress_percentage)}`}>
                        {course.progress_percentage}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress_percentage}%` }}
                      />
                    </div>

                    <p className="text-gray-500 text-xs">
                      Último acesso: {new Date(course.last_accessed).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Study Activity */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Atividade Recente
              </h3>

              <div className="space-y-3">
                {studySessions.slice(0, 7).map((session, index) => (
                  <div key={session.date} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${session.minutes > 0 ? 'bg-primary' : 'bg-gray-600'}`} />
                      <div>
                        <p className="text-white text-sm font-medium">
                          {new Date(session.date).toLocaleDateString('pt-BR', { 
                            weekday: 'short', 
                            day: '2-digit', 
                            month: 'short' 
                          })}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {session.lessons_completed} aulas
                        </p>
                      </div>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {formatDuration(session.minutes)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ChartBar className="w-5 h-5 text-primary" />
                Resumo Semanal
              </h3>

              <div className="space-y-3">
                {weeklyStats.map((week, index) => (
                  <div key={week.week} className="bg-zinc-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{week.week}</h4>
                      <span className="text-primary font-bold">{formatDuration(week.total_minutes)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                      <div>
                        <span className="block">{week.lessons_completed} aulas</span>
                        <span className="block">{week.courses_accessed} cursos</span>
                      </div>
                      <div className="text-right">
                        <span className="block">Média: {Math.round(week.total_minutes / 7)}min/dia</span>
                        <span className="block">
                          {week.total_minutes > 0 ? Math.round((week.total_minutes / 7) / 60 * 10) / 10 : 0}h/semana
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-8">
            <Target className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Continue Seu Progresso!</h3>
            <p className="text-gray-400 mb-6">
              Você está indo muito bem! Continue estudando para alcançar seus objetivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton onClick={() => router.push('/dashboard')}>
                Voltar ao Dashboard
              </GradientButton>
              <button
                onClick={() => router.push('/courses')}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                Explorar Mais Cursos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}