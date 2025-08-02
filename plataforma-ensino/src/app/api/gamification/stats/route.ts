import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET /api/gamification/stats - Get comprehensive gamification stats
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

    // Get or create user gamification stats
    let { data: stats, error: statsError } = await supabase
      .from('user_gamification_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (statsError && statsError.code === 'PGRST116') {
      // Create initial stats if they don't exist
      const { data: newStats, error: createError } = await supabase
        .from('user_gamification_stats')
        .insert([{
          user_id: user.id,
          total_xp: 0,
          current_level: 1,
          xp_to_next_level: 100,
          current_streak: 0,
          longest_streak: 0,
          total_study_minutes: 0,
          weekly_study_minutes: 0,
          monthly_study_minutes: 0,
          average_quiz_score: 0,
          courses_completed: 0,
          lessons_completed: 0,
          achievement_count: 0,
          badge_count: 0
        }])
        .select()
        .single()

      if (createError) {
        console.error('Error creating gamification stats:', createError)
        return NextResponse.json(
          { error: 'Failed to initialize gamification stats' },
          { status: 500 }
        )
      }

      stats = newStats
    } else if (statsError) {
      console.error('Error fetching gamification stats:', statsError)
      return NextResponse.json(
        { error: 'Failed to fetch gamification stats' },
        { status: 500 }
      )
    }

    // Get recent achievements (last 5)
    const { data: recentAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select(`
        unlocked_at,
        achievement:achievements(name, description, icon, points, rarity, badge_color)
      `)
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false })
      .limit(5)

    if (achievementsError) {
      console.error('Error fetching recent achievements:', achievementsError)
    }

    // Get progress towards next level
    const currentLevel = stats.current_level
    const currentXP = stats.total_xp
    const xpForCurrentLevel = (currentLevel - 1) * 100 + Math.max(0, (currentLevel - 2)) * 50
    const xpForNextLevel = currentLevel * 100 + Math.max(0, (currentLevel - 1)) * 50
    const xpProgressInLevel = currentXP - xpForCurrentLevel
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel
    const levelProgress = Math.round((xpProgressInLevel / xpNeededForLevel) * 100)

    // Calculate study time trends
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: weeklyActivity, error: weeklyError } = await supabase
      .from('lesson_analytics')
      .select('session_start, active_time_seconds')
      .eq('user_id', user.id)
      .gte('session_start', oneWeekAgo)

    const { data: monthlyActivity, error: monthlyError } = await supabase
      .from('lesson_analytics')
      .select('session_start, active_time_seconds')
      .eq('user_id', user.id)
      .gte('session_start', oneMonthAgo)

    if (weeklyError || monthlyError) {
      console.error('Error fetching activity data:', weeklyError || monthlyError)
    }

    // Calculate actual study time from analytics
    const actualWeeklyMinutes = weeklyActivity?.reduce((sum, session) => 
      sum + Math.round((session.active_time_seconds || 0) / 60), 0) || 0
    
    const actualMonthlyMinutes = monthlyActivity?.reduce((sum, session) => 
      sum + Math.round((session.active_time_seconds || 0) / 60), 0) || 0

    // Update the stats with actual calculated values
    if (actualWeeklyMinutes !== stats.weekly_study_minutes || 
        actualMonthlyMinutes !== stats.monthly_study_minutes) {
      await supabase
        .from('user_gamification_stats')
        .update({
          weekly_study_minutes: actualWeeklyMinutes,
          monthly_study_minutes: actualMonthlyMinutes,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
    }

    // Get quiz performance trend
    const { data: recentQuizzes, error: quizError } = await supabase
      .from('quiz_attempts')
      .select('score, total_points, completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10)

    const quizTrend = calculateQuizTrend(recentQuizzes || [])

    // Check for nearby achievements (close to unlocking)
    const { data: nearbyAchievements, error: nearbyError } = await supabase
      .rpc('get_nearby_achievements', { user_id_param: user.id })

    if (nearbyError) {
      console.error('Error fetching nearby achievements:', nearbyError)
    }

    // Build comprehensive response
    const gamificationData = {
      // Core Stats
      level: currentLevel,
      xp: currentXP,
      xp_to_next_level: stats.xp_to_next_level,
      level_progress_percentage: levelProgress,
      
      // Streaks
      current_streak: stats.current_streak,
      longest_streak: stats.longest_streak,
      
      // Study Time
      total_study_minutes: stats.total_study_minutes,
      weekly_study_minutes: actualWeeklyMinutes,
      monthly_study_minutes: actualMonthlyMinutes,
      
      // Performance
      average_quiz_score: stats.average_quiz_score,
      courses_completed: stats.courses_completed,
      lessons_completed: stats.lessons_completed,
      
      // Achievements & Badges
      achievement_count: stats.achievement_count,
      badge_count: stats.badge_count,
      recent_achievements: recentAchievements?.map(ua => ({
        ...ua.achievement,
        unlocked_at: ua.unlocked_at
      })) || [],
      
      // Trends & Progress
      quiz_performance_trend: quizTrend,
      study_consistency: calculateStudyConsistency(weeklyActivity || []),
      nearby_achievements: nearbyAchievements || [],
      
      // Recommendations
      recommendations: generateRecommendations(stats, actualWeeklyMinutes, quizTrend)
    }

    return NextResponse.json({
      data: gamificationData,
      last_updated: stats.updated_at
    })

  } catch (error) {
    console.error('Gamification stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
function calculateQuizTrend(quizzes: any[]) {
  if (quizzes.length < 2) return 0

  const scores = quizzes.map(q => (q.score / q.total_points) * 100).reverse()
  const firstHalf = scores.slice(0, Math.ceil(scores.length / 2))
  const secondHalf = scores.slice(Math.floor(scores.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length
  
  return Math.round(secondAvg - firstAvg)
}

function calculateStudyConsistency(weeklyActivity: any[]) {
  const dayMap = new Map()
  
  // Group by day
  weeklyActivity.forEach(session => {
    const day = session.session_start.split('T')[0]
    if (!dayMap.has(day)) {
      dayMap.set(day, 0)
    }
    dayMap.set(day, dayMap.get(day) + (session.active_time_seconds || 0))
  })
  
  const studyDays = dayMap.size
  const totalDays = 7
  
  return Math.round((studyDays / totalDays) * 100)
}

function generateRecommendations(stats: any, weeklyMinutes: number, quizTrend: number) {
  const recommendations = []
  
  if (weeklyMinutes < 60) {
    recommendations.push({
      type: 'study_time',
      title: 'Aumente seu tempo de estudo',
      description: 'Tente estudar pelo menos 1 hora por semana para melhores resultados',
      priority: 'medium'
    })
  }
  
  if (stats.current_streak === 0) {
    recommendations.push({
      type: 'streak',
      title: 'Comece uma nova sequência',
      description: 'Estude hoje para iniciar uma nova sequência de dias consecutivos',
      priority: 'high'
    })
  }
  
  if (quizTrend < -10) {
    recommendations.push({
      type: 'quiz_performance',
      title: 'Revise o conteúdo',
      description: 'Sua performance nos quizzes está diminuindo. Que tal revisar as lições?',
      priority: 'high'
    })
  }
  
  if (stats.average_quiz_score < 70) {
    recommendations.push({
      type: 'comprehension',
      title: 'Foque na compreensão',
      description: 'Dedique mais tempo para entender o conteúdo antes de fazer os quizzes',
      priority: 'medium'
    })
  }
  
  const xpToNextLevel = stats.xp_to_next_level
  if (xpToNextLevel < 50) {
    recommendations.push({
      type: 'level_up',
      title: 'Próximo do próximo nível!',
      description: `Você precisa apenas de ${xpToNextLevel} XP para subir de nível`,
      priority: 'low'
    })
  }
  
  return recommendations
}