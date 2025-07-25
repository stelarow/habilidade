'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import * as Sentry from '@sentry/nextjs'
import type { Course, Enrollment, Progress, User, UserCourseProgress } from '@/types'

interface DashboardStats {
  totalEnrollments: number
  completedCourses: number
  totalWatchTime: number
  completionPercentage: number
  currentStreak: number
  totalLessons: number
  completedLessons: number
}

interface RecentActivity {
  id: string
  type: 'lesson_completed' | 'course_started' | 'course_completed' | 'milestone_reached'
  title: string
  description: string
  timestamp: string
  course?: Course
  lesson?: { id: string; title: string }
}

interface DashboardData {
  stats: DashboardStats
  enrollments: Enrollment[]
  recentCourses: UserCourseProgress[]
  recentActivity: RecentActivity[]
  user: User | null
}

export function useDashboard(userId?: string) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      // Fetch enrollments with course data
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(
            id,
            title,
            slug,
            thumbnail_url,
            background_theme,
            duration_minutes,
            category:categories(name, color_theme)
          )
        `)
        .eq('user_id', userId)
        .in('status', ['active', 'completed'])
        .order('enrolled_at', { ascending: false })

      if (enrollmentsError) throw enrollmentsError

      // Fetch user course progress view
      const { data: progressData, error: progressError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false })

      if (progressError) throw progressError

      // Fetch recent lesson completions for activity
      const { data: recentCompletions, error: completionsError } = await supabase
        .from('progress')
        .select(`
          *,
          lesson:lessons(
            id,
            title,
            course:courses(id, title, background_theme)
          )
        `)
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(10)

      if (completionsError) throw completionsError

      // Calculate stats
      const stats: DashboardStats = {
        totalEnrollments: enrollmentsData?.length || 0,
        completedCourses: progressData?.filter(p => p.status === 'completed').length || 0,
        totalWatchTime: progressData?.reduce((total, p) => total + (p.total_watch_time || 0), 0) || 0,
        completionPercentage: progressData?.length > 0 
          ? Math.round(progressData.reduce((total, p) => total + p.progress_percentage, 0) / progressData.length)
          : 0,
        currentStreak: calculateCurrentStreak(recentCompletions || []),
        totalLessons: progressData?.reduce((total, p) => total + (p.total_lessons || 0), 0) || 0,
        completedLessons: progressData?.reduce((total, p) => total + (p.completed_lessons || 0), 0) || 0
      }

      // Format recent activity
      const recentActivity: RecentActivity[] = (recentCompletions || [])
        .slice(0, 5)
        .map(completion => ({
          id: completion.id,
          type: 'lesson_completed',
          title: completion.lesson?.title || 'Aula concluída',
          description: `Curso: ${completion.lesson?.course?.title || 'Desconhecido'}`,
          timestamp: completion.completed_at || completion.updated_at,
          course: completion.lesson?.course,
          lesson: completion.lesson
        }))

      // Add course completion activities
      const completedCourses = progressData?.filter(p => p.status === 'completed') || []
      completedCourses.forEach(course => {
        recentActivity.push({
          id: `course_${course.course_id}`,
          type: 'course_completed',
          title: 'Curso concluído!',
          description: `${course.course_title} - Parabéns!`,
          timestamp: course.enrolled_at, // This should be completion date
          course: {
            id: course.course_id,
            title: course.course_title,
            slug: course.course_slug,
            background_theme: 'default'
          } as Course
        })
      })

      // Sort activity by timestamp
      recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setData({
        stats,
        enrollments: enrollmentsData || [],
        recentCourses: progressData || [],
        recentActivity: recentActivity.slice(0, 10),
        user: userData
      })

      // Track dashboard load
      Sentry.addBreadcrumb({
        category: 'dashboard',
        message: 'Dashboard data loaded',
        level: 'info',
        data: {
          userId,
          enrollmentsCount: enrollmentsData?.length,
          progressCount: progressData?.length
        }
      })

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(message)
      Sentry.captureException(err, {
        tags: { component: 'useDashboard' },
        extra: { userId }
      })
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  // Calculate current streak (days with completed lessons)
  const calculateCurrentStreak = (completions: any[]): number => {
    if (!completions.length) return 0

    const completionDates = completions
      .map(c => new Date(c.completed_at || c.updated_at))
      .map(date => date.toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index) // Unique dates
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let streak = 0
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    // Start counting from today or yesterday
    if (completionDates.includes(today)) {
      streak = 1
    } else if (completionDates.includes(yesterday)) {
      streak = 1
    } else {
      return 0
    }

    // Count consecutive days
    for (let i = 1; i < completionDates.length; i++) {
      const currentDate = new Date(completionDates[i])
      const previousDate = new Date(completionDates[i - 1])
      const dayDiff = Math.floor((previousDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000))

      if (dayDiff === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  // Refresh dashboard data
  const refresh = useCallback(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Real-time updates for progress changes
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('dashboard_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress',
          filter: `user_id=eq.${userId}`
        },
        () => {
          // Refresh data when progress changes
          refresh()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'enrollments',
          filter: `user_id=eq.${userId}`
        },
        () => {
          // Refresh data when enrollments change
          refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, refresh])

  return {
    data,
    loading,
    error,
    refresh,
    // Convenience getters
    stats: data?.stats || null,
    enrollments: data?.enrollments || [],
    recentCourses: data?.recentCourses || [],
    recentActivity: data?.recentActivity || [],
    user: data?.user || null
  }
}