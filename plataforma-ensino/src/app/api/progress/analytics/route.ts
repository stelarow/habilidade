import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET /api/progress/analytics - Get aggregated progress analytics for dashboard
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
    const period = url.searchParams.get('period') || '30d' // 7d, 30d, 90d, all
    const courseId = url.searchParams.get('course_id')

    // Calculate date range based on period
    let dateFilter = ''
    if (period !== 'all') {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      dateFilter = `and created_at >= '${startDate}'`
    }

    // Get user's gamification stats
    const { data: gamificationStats, error: gamificationError } = await supabase
      .from('user_gamification_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (gamificationError && gamificationError.code !== 'PGRST116') {
      console.error('Error fetching gamification stats:', gamificationError)
    }

    // Get study time analytics
    const { data: studyTimeData, error: studyTimeError } = await supabase
      .from('lesson_analytics')
      .select('session_start, active_time_seconds, lesson_id')
      .eq('user_id', user.id)
      .gte('session_start', period === 'all' ? '1970-01-01' : 
           new Date(Date.now() - (period === '7d' ? 7 : period === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000).toISOString())
      .order('session_start')

    if (studyTimeError) {
      console.error('Error fetching study time data:', studyTimeError)
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      )
    }

    // Get progress distribution
    let progressQuery = supabase
      .from('progress')
      .select(`
        completed,
        progress_percentage,
        time_spent_minutes,
        lesson:lessons(course_id, title)
      `)
      .eq('user_id', user.id)

    if (courseId) {
      progressQuery = progressQuery.eq('lesson.course_id', courseId)
    }

    const { data: progressData, error: progressError } = await progressQuery

    if (progressError) {
      console.error('Error fetching progress data:', progressError)
      return NextResponse.json(
        { error: 'Failed to fetch progress data' },
        { status: 500 }
      )
    }

    // Get quiz performance
    const { data: quizData, error: quizError } = await supabase
      .from('quiz_attempts')
      .select('score, total_points, completed_at, quiz_id')
      .eq('user_id', user.id)
      .gte('completed_at', period === 'all' ? '1970-01-01' : 
           new Date(Date.now() - (period === '7d' ? 7 : period === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000).toISOString())
      .order('completed_at')

    if (quizError) {
      console.error('Error fetching quiz data:', quizError)
    }

    // Get recent achievements
    const { data: recentAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select(`
        unlocked_at,
        achievement:achievements(name, description, icon, points, rarity, badge_color)
      `)
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false })
      .limit(10)

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError)
    }

    // Process study time data for charts
    const dailyStudyTime = processDailyStudyTime(studyTimeData || [], period)
    
    // Calculate engagement metrics
    const totalStudyMinutes = progressData?.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) || 0
    const completedLessons = progressData?.filter(p => p.completed).length || 0
    const totalLessons = progressData?.length || 0
    
    // Calculate quiz performance metrics
    const quizPerformance = calculateQuizPerformance(quizData || [])
    
    // Calculate streak information
    const streakInfo = calculateStreakInfo(studyTimeData || [])

    // Build response
    const analytics = {
      gamification: gamificationStats || {
        total_xp: 0,
        current_level: 1,
        current_streak: 0,
        longest_streak: 0,
        total_study_minutes: totalStudyMinutes,
        courses_completed: 0,
        lessons_completed: completedLessons,
        achievement_count: recentAchievements?.length || 0
      },
      
      study_time: {
        total_minutes: totalStudyMinutes,
        daily_average: dailyStudyTime.length > 0 ? 
          dailyStudyTime.reduce((sum, d) => sum + d.minutes, 0) / dailyStudyTime.length : 0,
        daily_data: dailyStudyTime,
        streak: streakInfo
      },

      progress: {
        completion_rate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        average_progress: progressData?.length > 0 ?
          progressData.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / progressData.length : 0
      },

      quiz_performance: quizPerformance,
      
      recent_achievements: recentAchievements?.map(ua => ({
        ...ua.achievement,
        unlocked_at: ua.unlocked_at
      })) || [],

      insights: generateInsights({
        studyTime: totalStudyMinutes,
        completionRate: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
        quizAverage: quizPerformance.average_score,
        streak: streakInfo.current_streak,
        period
      })
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
function processDailyStudyTime(studyTimeData: any[], period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
  const dailyMap = new Map()

  // Initialize all days with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const dateKey = date.toISOString().split('T')[0]
    dailyMap.set(dateKey, { date: dateKey, minutes: 0 })
  }

  // Aggregate study time by date
  studyTimeData.forEach(session => {
    const dateKey = session.session_start.split('T')[0]
    if (dailyMap.has(dateKey)) {
      const current = dailyMap.get(dateKey)
      current.minutes += Math.round((session.active_time_seconds || 0) / 60)
    }
  })

  return Array.from(dailyMap.values()).reverse() // Chronological order
}

function calculateQuizPerformance(quizData: any[]) {
  if (quizData.length === 0) {
    return {
      total_attempts: 0,
      average_score: 0,
      best_score: 0,
      improvement_trend: 0
    }
  }

  const scores = quizData.map(q => (q.score / q.total_points) * 100)
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
  const bestScore = Math.max(...scores)
  
  // Calculate improvement trend (last 5 vs first 5 quizzes)
  let improvementTrend = 0
  if (scores.length >= 10) {
    const firstFive = scores.slice(0, 5).reduce((sum, score) => sum + score, 0) / 5
    const lastFive = scores.slice(-5).reduce((sum, score) => sum + score, 0) / 5
    improvementTrend = lastFive - firstFive
  }

  return {
    total_attempts: quizData.length,
    average_score: Math.round(averageScore),
    best_score: Math.round(bestScore),
    improvement_trend: Math.round(improvementTrend)
  }
}

function calculateStreakInfo(studyTimeData: any[]) {
  // Group by date and check for consecutive days
  const studyDates = new Set(
    studyTimeData.map(session => session.session_start.split('T')[0])
  )

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  // Check from today backwards
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
    const dateKey = date.toISOString().split('T')[0]
    
    if (studyDates.has(dateKey)) {
      tempStreak++
      if (i === 0 || currentStreak === i) { // Continue current streak
        currentStreak = tempStreak
      }
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak
      }
      if (i === 0) { // Today has no study
        currentStreak = 0
      }
      tempStreak = 0
    }
  }

  return {
    current_streak: currentStreak,
    longest_streak: Math.max(longestStreak, tempStreak)
  }
}

function generateInsights(data: any) {
  const insights = []

  if (data.streak >= 7) {
    insights.push({
      type: 'positive',
      title: 'Excelente consistência!',
      message: `Você mantém uma sequência de ${data.streak} dias estudando. Continue assim!`
    })
  } else if (data.streak === 0) {
    insights.push({
      type: 'suggestion',
      title: 'Que tal estudar hoje?',
      message: 'Comece uma nova sequência de estudos hoje mesmo!'
    })
  }

  if (data.completionRate >= 80) {
    insights.push({
      type: 'positive',
      title: 'Alto nível de conclusão!',
      message: `Você completa ${Math.round(data.completionRate)}% das lições que inicia.`
    })
  }

  if (data.quizAverage >= 85) {
    insights.push({
      type: 'positive',
      title: 'Excelente performance nos quizzes!',
      message: `Sua média de ${Math.round(data.quizAverage)}% mostra domínio do conteúdo.`
    })
  }

  if (data.studyTime < 30 && data.period === '7d') {
    insights.push({
      type: 'suggestion',
      title: 'Aumente seu tempo de estudo',
      message: 'Tente dedicar pelo menos 30 minutos por semana aos estudos.'
    })
  }

  return insights
}