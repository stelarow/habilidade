'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import { useDashboard } from '@/hooks/useDashboard'
import { GradientButton, Starfield, Loading } from '@/components/ui'
import { formatDuration } from '@/lib/utils'
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendUp, 
  Play, 
  CheckCircle,
  Calendar,
  Target,
  Flame,
  Medal,
  ArrowRight,
  Gear
} from 'phosphor-react'

export default function DashboardPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  const {
    data,
    loading,
    error,
    refresh,
    stats,
    enrollments,
    recentCourses,
    recentActivity,
    user
  } = useDashboard(userId || undefined)

  // Get user authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user?.id || null)
      setUserEmail(user?.email || null)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserId(session.user.id)
          setUserEmail(session.user.email || null)
        } else {
          setUserId(null)
          setUserEmail(null)
          router.push('/auth/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const handleContinueCourse = (courseSlug: string, lessonId?: string) => {
    if (lessonId) {
      router.push(`/course/${courseSlug}/lesson/${lessonId}`)
    } else {
      router.push(`/course/${courseSlug}`)
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
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao carregar dashboard</h3>
          <p className="text-white/60 mb-4">{error}</p>
          <GradientButton onClick={refresh}>
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
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Bem-vindo{user?.full_name ? `, ${user.full_name}` : userEmail ? `, ${userEmail}` : ''} à plataforma Habilidade
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/courses')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explorar Cursos</span>
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Gear className="w-4 h-4" />
              <span>Perfil</span>
            </button>
            <GradientButton onClick={handleLogout}>
              Logout
            </GradientButton>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Courses */}
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Cursos Ativos</h3>
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats?.totalEnrollments || 0}</p>
            <p className="text-gray-400 text-sm mt-1">
              {stats?.completedCourses || 0} concluídos
            </p>
          </div>
          
          {/* Overall Progress */}
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Progresso</h3>
              <TrendUp className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-secondary">{stats?.completionPercentage || 0}%</p>
            <p className="text-gray-400 text-sm mt-1">
              {stats?.completedLessons || 0} de {stats?.totalLessons || 0} aulas
            </p>
          </div>
          
          {/* Study Time */}
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Tempo Total</h3>
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <p className="text-3xl font-bold text-accent">
              {formatDuration(stats?.totalWatchTime || 0)}
            </p>
            <p className="text-gray-400 text-sm mt-1">Tempo assistido</p>
          </div>

          {/* Current Streak */}
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Sequência</h3>
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-orange-400">{stats?.currentStreak || 0}</p>
            <p className="text-gray-400 text-sm mt-1">
              {stats?.currentStreak === 1 ? 'dia' : 'dias'} consecutivos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Continuar Estudando</h2>
                <button
                  onClick={() => router.push('/courses')}
                  className="text-primary hover:text-primary/80 transition-colors text-sm"
                >
                  Ver todos
                </button>
              </div>
              
              {recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {recentCourses.slice(0, 3).map((courseProgress) => (
                    <div
                      key={courseProgress.course_id}
                      className="bg-zinc-800/50 rounded-lg border border-gray-700 p-4 hover:border-primary/50 transition-colors group cursor-pointer"
                      onClick={() => handleContinueCourse(courseProgress.course_slug)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md flex items-center justify-center">
                          <span className="text-primary text-xl">
                            {getCourseFavicon(courseProgress.course_title)}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{courseProgress.course_title}</h3>
                          <p className="text-gray-400 text-sm mb-2">
                            {courseProgress.completed_lessons} de {courseProgress.total_lessons} aulas
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${courseProgress.progress_percentage}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm text-white font-medium">
                              {Math.round(courseProgress.progress_percentage)}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Play className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Você ainda não tem cursos ativos</p>
                  <GradientButton onClick={() => router.push('/courses')}>
                    Explorar Cursos
                  </GradientButton>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Atividade Recente
              </h3>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {activity.type === 'lesson_completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {activity.type === 'course_completed' && <Medal className="w-4 h-4 text-yellow-400" />}
                        {activity.type === 'course_started' && <Play className="w-4 h-4 text-primary" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-gray-400 text-xs truncate">{activity.description}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(activity.timestamp).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">Nenhuma atividade recente</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/courses')}
                  className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-white font-medium">Explorar Cursos</p>
                    <p className="text-gray-400 text-sm">Descubra novos conteúdos</p>
                  </div>
                </button>
                
                <button
                  onClick={() => router.push('/achievements')}
                  className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Conquistas</p>
                    <p className="text-gray-400 text-sm">Veja seus marcos</p>
                  </div>
                </button>
                
                <button
                  onClick={() => router.push('/progress')}
                  className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <TrendUp className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-white font-medium">Relatório</p>
                    <p className="text-gray-400 text-sm">Acompanhe seu progresso</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get course favicon based on title
function getCourseFavicon(title: string): string {
  const titleLower = title.toLowerCase()
  
  if (titleLower.includes('ia') || titleLower.includes('inteligência artificial')) return '🤖'
  if (titleLower.includes('design')) return '🎨'
  if (titleLower.includes('programação') || titleLower.includes('desenvolvimento')) return '💻'
  if (titleLower.includes('marketing')) return '📈'
  if (titleLower.includes('3d') || titleLower.includes('projetista')) return '🔷'
  if (titleLower.includes('vídeo') || titleLower.includes('edição')) return '🎬'
  if (titleLower.includes('bi') || titleLower.includes('business intelligence')) return '📊'
  if (titleLower.includes('informática')) return '🖥️'
  if (titleLower.includes('administração')) return '📋'
  
  return '📚'
}