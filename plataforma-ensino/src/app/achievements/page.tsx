'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GradientButton, Starfield, Loading } from '@/components/ui'
import { 
  Trophy, 
  Medal,
  Star,
  Target,
  Calendar,
  Clock,
  BookOpen,
  Fire,
  Crown,
  ArrowLeft,
  CheckCircle,
  Lock
} from 'phosphor-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'learning' | 'streak' | 'completion' | 'special'
  points: number
  requirement: number
  unlocked: boolean
  unlockedAt?: string
  progress: number
}

export default function AchievementsPage() {
  const router = useRouter()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    unlockedCount: 0,
    level: 1
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createClient()

  const fetchAchievements = useCallback(async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Simular dados de conquistas por enquanto
      // Em um cenário real, isso viria do banco de dados
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'Primeiro Passo',
          description: 'Complete sua primeira aula',
          icon: '👶',
          category: 'learning',
          points: 10,
          requirement: 1,
          unlocked: true,
          unlockedAt: '2025-01-01T00:00:00Z',
          progress: 1
        },
        {
          id: '2',
          title: 'Estudante Dedicado',
          description: 'Complete 10 aulas',
          icon: '📚',
          category: 'learning',
          points: 50,
          requirement: 10,
          unlocked: true,
          unlockedAt: '2025-01-05T00:00:00Z',
          progress: 10
        },
        {
          id: '3',
          title: 'Maratonista',
          description: 'Complete 50 aulas',
          icon: '🏃‍♀️',
          category: 'learning',
          points: 250,
          requirement: 50,
          unlocked: false,
          progress: 23
        },
        {
          id: '4',
          title: 'Sequência de Fogo',
          description: 'Estude por 7 dias consecutivos',
          icon: '🔥',
          category: 'streak',
          points: 100,
          requirement: 7,
          unlocked: true,
          unlockedAt: '2025-01-07T00:00:00Z',
          progress: 7
        },
        {
          id: '5',
          title: 'Mestre da Consistência',
          description: 'Estude por 30 dias consecutivos',
          icon: '⚡',
          category: 'streak',
          points: 500,
          requirement: 30,
          unlocked: false,
          progress: 12
        },
        {
          id: '6',
          title: 'Finalizador',
          description: 'Complete seu primeiro curso',
          icon: '🎓',
          category: 'completion',
          points: 200,
          requirement: 1,
          unlocked: false,
          progress: 0
        },
        {
          id: '7',
          title: 'Colecionador',
          description: 'Complete 5 cursos',
          icon: '🏆',
          category: 'completion',
          points: 1000,
          requirement: 5,
          unlocked: false,
          progress: 0
        },
        {
          id: '8',
          title: 'Explorador',
          description: 'Explore 3 categorias diferentes',
          icon: '🧭',
          category: 'special',
          points: 150,
          requirement: 3,
          unlocked: true,
          unlockedAt: '2025-01-03T00:00:00Z',
          progress: 3
        },
        {
          id: '9',
          title: 'Velocista',
          description: 'Complete uma aula em menos de 30 minutos',
          icon: '💨',
          category: 'special',
          points: 75,
          requirement: 1,
          unlocked: false,
          progress: 0
        },
        {
          id: '10',
          title: 'Lenda',
          description: 'Desbloqueie todas as outras conquistas',
          icon: '👑',
          category: 'special',
          points: 2000,
          requirement: 9,
          unlocked: false,
          progress: 4
        }
      ]

      setAchievements(mockAchievements)
      
      // Calcular estatísticas
      const unlockedAchievements = mockAchievements.filter(a => a.unlocked)
      const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0)
      const level = Math.floor(totalPoints / 100) + 1

      setUserStats({
        totalPoints,
        unlockedCount: unlockedAchievements.length,
        level
      })

    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar conquistas')
    } finally {
      setLoading(false)
    }
  }, [router, supabase.auth])

  // Carregar conquistas após definir a função
  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'unlocked') return achievement.unlocked
    if (selectedCategory === 'locked') return !achievement.unlocked
    return achievement.category === selectedCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <BookOpen className="w-4 h-4" />
      case 'streak': return <Fire className="w-4 h-4" />
      case 'completion': return <CheckCircle className="w-4 h-4" />
      case 'special': return <Star className="w-4 h-4" />
      default: return <Trophy className="w-4 h-4" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'learning': return 'Aprendizado'
      case 'streak': return 'Sequência'
      case 'completion': return 'Conclusão'
      case 'special': return 'Especial'
      default: return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'text-blue-400 bg-blue-400/20'
      case 'streak': return 'text-orange-400 bg-orange-400/20'
      case 'completion': return 'text-green-400 bg-green-400/20'
      case 'special': return 'text-purple-400 bg-purple-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
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
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao carregar conquistas</h3>
          <p className="text-white/60 mb-4">{error}</p>
          <GradientButton onClick={fetchAchievements}>
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
                Conquistas
              </h1>
              <p className="text-gray-400 mt-2">
                Seus marcos e realizações na plataforma
              </p>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6 text-center">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">Nível {userStats.level}</p>
            <p className="text-gray-400 text-sm">
              {userStats.totalPoints % 100}/100 XP para próximo nível
            </p>
          </div>
          
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{userStats.unlockedCount}</p>
            <p className="text-gray-400 text-sm">Conquistas Desbloqueadas</p>
          </div>
          
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6 text-center">
            <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{userStats.totalPoints}</p>
            <p className="text-gray-400 text-sm">Pontos Totais</p>
          </div>

          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6 text-center">
            <Target className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{Math.round((userStats.unlockedCount / achievements.length) * 100)}%</p>
            <p className="text-gray-400 text-sm">Progresso Geral</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: 'all', label: 'Todas', icon: <Trophy className="w-4 h-4" /> },
            { key: 'unlocked', label: 'Desbloqueadas', icon: <CheckCircle className="w-4 h-4" /> },
            { key: 'locked', label: 'Bloqueadas', icon: <Lock className="w-4 h-4" /> },
            { key: 'learning', label: 'Aprendizado', icon: <BookOpen className="w-4 h-4" /> },
            { key: 'streak', label: 'Sequência', icon: <Fire className="w-4 h-4" /> },
            { key: 'completion', label: 'Conclusão', icon: <CheckCircle className="w-4 h-4" /> },
            { key: 'special', label: 'Especial', icon: <Star className="w-4 h-4" /> }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.key
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`glass-effect backdrop-blur-md rounded-lg border overflow-hidden transition-all duration-300 ${
                achievement.unlocked
                  ? 'bg-zinc-900/70 border-gray-800/50 hover:border-primary/50'
                  : 'bg-zinc-900/30 border-gray-800/30 opacity-60'
              }`}
            >
              <div className="p-6">
                {/* Achievement Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                        {achievement.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(achievement.category)}`}>
                        {getCategoryName(achievement.category)}
                      </span>
                    </div>
                  </div>
                  
                  {achievement.unlocked ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-500" />
                  )}
                </div>

                {/* Description */}
                <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                {!achievement.unlocked && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progresso</span>
                      <span>{achievement.progress}/{achievement.requirement}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {achievement.points} pontos
                    </span>
                  </div>
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma conquista encontrada</h3>
            <p className="text-gray-400 mb-6">
              Tente alterar os filtros para ver mais conquistas
            </p>
            <GradientButton onClick={() => setSelectedCategory('all')}>
              Ver Todas as Conquistas
            </GradientButton>
          </div>
        )}
      </div>
    </div>
  )
}