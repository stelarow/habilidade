import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET /api/achievements - Get all available achievements and user's unlocked ones
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const unlocked_only = url.searchParams.get('unlocked_only') === 'true'

    // Get all achievements
    let achievementsQuery = supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('points')

    if (category) {
      achievementsQuery = achievementsQuery.eq('category', category)
    }

    const { data: allAchievements, error: achievementsError } = await achievementsQuery

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError)
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500 }
      )
    }

    // Get user's unlocked achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at, progress_data')
      .eq('user_id', user.id)

    if (userAchievementsError) {
      console.error('Error fetching user achievements:', userAchievementsError)
      return NextResponse.json(
        { error: 'Failed to fetch user achievements' },
        { status: 500 }
      )
    }

    // Create a map of unlocked achievements
    const unlockedMap = userAchievements?.reduce((acc, ua) => {
      acc[ua.achievement_id] = {
        unlocked_at: ua.unlocked_at,
        progress_data: ua.progress_data
      }
      return acc
    }, {} as Record<string, any>) || {}

    // Get user's current stats for progress calculation
    const { data: userStats, error: userStatsError } = await supabase
      .from('user_gamification_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (userStatsError && userStatsError.code !== 'PGRST116') {
      console.error('Error fetching user stats:', userStatsError)
    }

    // Get additional progress data
    const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select('completed, lesson_id')
      .eq('user_id', user.id)

    const { data: quizData, error: quizError } = await supabase
      .from('quiz_attempts')
      .select('score, total_points, passed')
      .eq('user_id', user.id)

    // Calculate current progress for locked achievements
    const currentProgress = calculateCurrentProgress(userStats, progressData, quizData)

    // Combine achievement data with user progress
    const enrichedAchievements = allAchievements?.map(achievement => {
      const isUnlocked = achievement.id in unlockedMap
      const unlockedData = unlockedMap[achievement.id]
      
      let progress = 0
      if (!isUnlocked) {
        progress = calculateAchievementProgress(achievement, currentProgress)
      } else {
        progress = 100
      }

      return {
        ...achievement,
        is_unlocked: isUnlocked,
        unlocked_at: unlockedData?.unlocked_at || null,
        progress_percentage: Math.min(100, Math.max(0, progress)),
        progress_description: generateProgressDescription(achievement, currentProgress, progress)
      }
    }) || []

    // Filter if user wants only unlocked achievements
    const filteredAchievements = unlocked_only 
      ? enrichedAchievements.filter(a => a.is_unlocked)
      : enrichedAchievements

    // Group by category
    const categorizedAchievements = filteredAchievements.reduce((acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = []
      }
      acc[achievement.category].push(achievement)
      return acc
    }, {} as Record<string, any[]>)

    // Calculate category stats
    const categoryStats = Object.keys(categorizedAchievements).reduce((acc, category) => {
      const achievements = categorizedAchievements[category]
      const unlocked = achievements.filter(a => a.is_unlocked).length
      const total = achievements.length
      
      acc[category] = {
        total,
        unlocked,
        completion_percentage: Math.round((unlocked / total) * 100),
        total_points: achievements.reduce((sum, a) => sum + (a.is_unlocked ? a.points : 0), 0),
        max_points: achievements.reduce((sum, a) => sum + a.points, 0)
      }
      return acc
    }, {} as Record<string, any>)

    // Overall stats
    const totalAchievements = allAchievements?.length || 0
    const unlockedAchievements = Object.keys(unlockedMap).length
    const totalPointsEarned = allAchievements?.reduce((sum, a) => {
      return sum + (a.id in unlockedMap ? a.points : 0)
    }, 0) || 0

    return NextResponse.json({
      achievements: categorizedAchievements,
      stats: {
        total_achievements: totalAchievements,
        unlocked_achievements: unlockedAchievements,
        completion_percentage: totalAchievements > 0 ? Math.round((unlockedAchievements / totalAchievements) * 100) : 0,
        total_points_earned: totalPointsEarned,
        category_stats: categoryStats,
        recent_unlocks: userAchievements?.slice(-5).reverse() || []
      }
    })

  } catch (error) {
    console.error('Achievements API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
function calculateCurrentProgress(userStats: any, progressData: any, quizData: any) {
  const completedLessons = progressData?.filter((p: any) => p.completed).length || 0
  const totalQuizzes = quizData?.length || 0
  const perfectQuizzes = quizData?.filter((q: any) => q.score === q.total_points).length || 0
  const averageQuizScore = totalQuizzes > 0 
    ? quizData.reduce((sum: number, q: any) => sum + (q.score / q.total_points * 100), 0) / totalQuizzes 
    : 0

  return {
    lessons_completed: completedLessons,
    courses_completed: userStats?.courses_completed || 0,
    current_streak: userStats?.current_streak || 0,
    longest_streak: userStats?.longest_streak || 0,
    total_study_hours: Math.floor((userStats?.total_study_minutes || 0) / 60),
    quiz_perfect_score: perfectQuizzes,
    quiz_average_score: averageQuizScore,
    total_quizzes: totalQuizzes,
    user_level: userStats?.current_level || 1,
    total_xp: userStats?.total_xp || 0
  }
}

function calculateAchievementProgress(achievement: any, currentProgress: any) {
  const criteria = achievement.criteria
  
  switch (criteria.type) {
    case 'lessons_completed':
      return Math.min(100, (currentProgress.lessons_completed / criteria.target) * 100)
    
    case 'courses_completed':
      return Math.min(100, (currentProgress.courses_completed / criteria.target) * 100)
    
    case 'streak_days':
      return Math.min(100, (currentProgress.current_streak / criteria.target) * 100)
    
    case 'quiz_perfect_score':
      return Math.min(100, (currentProgress.quiz_perfect_score / criteria.target) * 100)
    
    case 'quiz_average_score':
      const hasMinimumQuizzes = currentProgress.total_quizzes >= (criteria.minimum_quizzes || 1)
      if (!hasMinimumQuizzes) return 0
      return currentProgress.quiz_average_score >= criteria.target ? 100 : 
             Math.min(100, (currentProgress.quiz_average_score / criteria.target) * 100)
    
    case 'total_study_hours':
      return Math.min(100, (currentProgress.total_study_hours / criteria.target) * 100)
    
    case 'user_level':
      return Math.min(100, (currentProgress.user_level / criteria.target) * 100)
    
    default:
      return 0
  }
}

function generateProgressDescription(achievement: any, currentProgress: any, progressPercentage: number) {
  const criteria = achievement.criteria
  
  if (progressPercentage >= 100) {
    return 'Conquista desbloqueada!'
  }
  
  switch (criteria.type) {
    case 'lessons_completed':
      return `${currentProgress.lessons_completed}/${criteria.target} lições completadas`
    
    case 'courses_completed':
      return `${currentProgress.courses_completed}/${criteria.target} cursos completados`
    
    case 'streak_days':
      return `Sequência atual: ${currentProgress.current_streak}/${criteria.target} dias`
    
    case 'quiz_perfect_score':
      return `${currentProgress.quiz_perfect_score}/${criteria.target} quizzes com 100%`
    
    case 'quiz_average_score':
      const hasMinimum = currentProgress.total_quizzes >= (criteria.minimum_quizzes || 1)
      if (!hasMinimum) {
        return `Realize ${criteria.minimum_quizzes || 1} quizzes primeiro`
      }
      return `Média atual: ${Math.round(currentProgress.quiz_average_score)}%/${criteria.target}%`
    
    case 'total_study_hours':
      return `${currentProgress.total_study_hours}/${criteria.target} horas de estudo`
    
    case 'user_level':
      return `Nível ${currentProgress.user_level}/${criteria.target}`
    
    default:
      return `${Math.round(progressPercentage)}% concluído`
  }
}