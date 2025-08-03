import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { 
  CourseProgressDetail, 
  QuizSubmission, 
  QuizResult, 
  UserPreferences,
  Achievement,
  UserNotification,
  ProgressAnalytics,
  EnhancedProgress
} from '@/types/gamification'
import type {
  AuthUser,
  UserProfile,
  CourseProgressData,
  ProgressUpdateRequest,
  UseAuthReturn,
  UseCourseProgressReturn,
  UseUpdateProgressReturn,
  UseGamificationStatsReturn,
  UseUserPreferencesReturn,
  GamificationStats,
  ApiError
} from '@/types/phase1-components'

/**
 * Core Supabase hook for managing authentication and client instance
 */
export function useSupabase() {
  const supabase = useMemo(() => createClient(), [])
  return supabase
}

/**
 * Authentication state management
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }: any) => {
      if (sessionError) {
        setError({ message: sessionError.message, code: sessionError.name })
      } else {
        setUser(session?.user ?? null)
        // Fetch user profile if user exists
        if (session?.user) {
          fetchUserProfile(session.user.id)
        }
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (profileError) {
        setError({ message: profileError.message, code: profileError.code })
      } else {
        setProfile(data)
      }
    } catch (err) {
      setError({ message: 'Failed to fetch user profile' })
    }
  }, [supabase])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (signInError) {
        setError({ message: signInError.message, code: signInError.name })
      }
    } catch (err) {
      setError({ message: 'Failed to sign in' })
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    try {
      setError(null)
      await supabase.auth.signOut()
      setProfile(null)
    } catch (err) {
      setError({ message: 'Failed to sign out' })
    }
  }, [supabase])

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) return
    
    try {
      setError(null)
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('user_id', user.id)
      
      if (updateError) {
        setError({ message: updateError.message, code: updateError.code })
      } else {
        // Refresh profile data
        await fetchUserProfile(user.id)
      }
    } catch (err) {
      setError({ message: 'Failed to update profile' })
    }
  }, [user, supabase, fetchUserProfile])

  return {
    user: user ? {
      id: user.id,
      email: user.email || '',
      user_metadata: user.user_metadata || {},
      created_at: user.created_at || '',
      updated_at: user.updated_at || ''
    } : null,
    profile,
    isLoading: loading,
    isAuthenticated: !!user,
    error,
    signIn,
    signOut,
    updateProfile
  }
}

/**
 * Course progress data fetching with real-time updates
 */
export function useCourseProgress(courseId: string): UseCourseProgressReturn {
  const supabase = useSupabase()
  
  const query = useQuery({
    queryKey: ['courseProgress', courseId],
    queryFn: async (): Promise<CourseProgressData> => {
      const response = await fetch(`/api/progress/${courseId}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch course progress' }))
        throw new Error(errorData.message || 'Failed to fetch course progress')
      }
      return response.json()
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors
      return failureCount < 3 && !error.message.includes('404')
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    error: query.error ? { message: query.error.message } : null,
    refetch: async () => {
      await query.refetch()
    }
  }
}

/**
 * Progress update mutation with optimistic updates
 */
export function useUpdateProgress(): UseUpdateProgressReturn {
  const queryClient = useQueryClient()
  const supabase = useSupabase()

  const mutation = useMutation({
    mutationFn: async (data: ProgressUpdateRequest) => {
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update progress')
      }
      
      return response.json()
    },
    onMutate: async (newProgress: ProgressUpdateRequest) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['courseProgress'] })
      
      // Snapshot previous values
      const previousProgress = queryClient.getQueriesData({ queryKey: ['courseProgress'] })
      
      // Optimistically update progress
      queryClient.setQueriesData({ queryKey: ['courseProgress'] }, (old: unknown) => {
        const oldData = old as CourseProgressData | undefined
        if (!oldData) return oldData
        
        return {
          ...oldData,
          lessons: oldData.lessons?.map((lesson) => 
            lesson.lesson.id === newProgress.lessonId
              ? {
                  ...lesson,
                  progress: lesson.progress ? {
                    ...lesson.progress,
                    last_position: newProgress.lastPosition,
                    progress_percentage: newProgress.progressPercentage || lesson.progress.progress_percentage,
                    completed: newProgress.completed || lesson.progress.completed,
                    watch_time_minutes: newProgress.watchTime || lesson.progress.watch_time_minutes,
                    updated_at: new Date().toISOString()
                  } : null
                }
              : lesson
          )
        }
      })
      
      return { previousProgress }
    },
    onError: (err: Error, newProgress: ProgressUpdateRequest, context?: { previousProgress: unknown }) => {
      // Rollback optimistic updates
      if (context?.previousProgress) {
        const prevData = context.previousProgress as Array<[unknown, unknown]>
        prevData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey as string[], data)
        })
      }
    },
    onSuccess: (data: unknown, variables: ProgressUpdateRequest) => {
      // Trigger real-time updates
      queryClient.invalidateQueries({ queryKey: ['courseProgress'] })
      queryClient.invalidateQueries({ queryKey: ['gamificationStats'] })
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
    }
  })

  return {
    mutate: async (request: ProgressUpdateRequest) => {
      return new Promise<void>((resolve, reject) => {
        mutation.mutate(request, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        })
      })
    },
    isLoading: mutation.isPending,
    error: mutation.error ? { message: mutation.error.message } : null
  }
}

/**
 * Quiz submission with comprehensive feedback
 */
export function useSubmitQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (submission: QuizSubmission): Promise<QuizResult> => {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit quiz')
      }
      
      return response.json()
    },
    onSuccess: (data) => {
      // Invalidate related queries after quiz completion
      queryClient.invalidateQueries({ queryKey: ['courseProgress'] })
      queryClient.invalidateQueries({ queryKey: ['gamificationStats'] })
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })
}

/**
 * User preferences management
 */
export function useUserPreferences() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['userPreferences'],
    queryFn: async (): Promise<UserPreferences> => {
      const response = await fetch('/api/user/preferences')
      if (!response.ok) {
        throw new Error('Failed to fetch user preferences')
      }
      return response.json()
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000 // 30 minutes
  })

  const updatePreferences = useMutation({
    mutationFn: async (preferences: Partial<UserPreferences>) => {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }
      
      return response.json()
    },
    onMutate: async (newPreferences: Partial<UserPreferences>) => {
      await queryClient.cancelQueries({ queryKey: ['userPreferences'] })
      
      const previousPreferences = queryClient.getQueryData(['userPreferences'])
      
      queryClient.setQueryData(['userPreferences'], (old: unknown) => {
        const oldPrefs = old as UserPreferences | undefined
        return {
          ...oldPrefs,
          ...newPreferences,
          updated_at: new Date().toISOString()
        }
      })
      
      return { previousPreferences }
    },
    onError: (err: Error, newPreferences: Partial<UserPreferences>, context?: { previousPreferences: unknown }) => {
      if (context?.previousPreferences) {
        queryClient.setQueryData(['userPreferences'], context.previousPreferences)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] })
    }
  })

  return {
    preferences: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updatePreferences: updatePreferences.mutate,
    isUpdating: updatePreferences.isPending
  }
}

/**
 * Gamification stats with real-time updates
 */
export function useGamificationStats(): UseGamificationStatsReturn {
  const query = useQuery({
    queryKey: ['gamificationStats'],
    queryFn: async (): Promise<GamificationStats> => {
      const response = await fetch('/api/gamification/stats')
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch gamification stats' }))
        throw new Error(errorData.message || 'Failed to fetch gamification stats')
      }
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  })

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    error: query.error ? { message: query.error.message } : null,
    refetch: async () => {
      await query.refetch()
    }
  }
}

/**
 * Achievements data fetching
 */
export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async (): Promise<Achievement[]> => {
      const response = await fetch('/api/achievements')
      if (!response.ok) {
        throw new Error('Failed to fetch achievements')
      }
      const data = await response.json()
      return data.achievements || []
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000 // 30 minutes
  })
}

/**
 * Progress analytics for dashboard
 */
export function useProgressAnalytics() {
  return useQuery({
    queryKey: ['progressAnalytics'],
    queryFn: async (): Promise<ProgressAnalytics> => {
      const response = await fetch('/api/progress/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch progress analytics')
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 10 * 60 * 1000 // Refetch every 10 minutes
  })
}

/**
 * Resilient query hook with error recovery
 */
export function useResilientQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T>>
) {
  return useQuery({
    queryKey,
    queryFn,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors, but not for 4xx errors
      const errorMessage = error?.message || ''
      if (errorMessage.includes('404') || errorMessage.includes('403')) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options
  })
}

/**
 * Custom hook for handling loading states across multiple queries
 */
export function useLoadingState(queries: any[]) {
  const isLoading = queries.some(query => query.isLoading)
  const isError = queries.some(query => query.isError)
  const error = queries.find(query => query.error)?.error

  return {
    isLoading,
    isError,
    error
  }
}

/**
 * Error boundary state for handling query errors gracefully
 */
export function useErrorRecovery() {
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setHasError(false)
    setErrorMessage(null)
  }, [])

  const handleError = useCallback((error: Error) => {
    setHasError(true)
    setErrorMessage(error.message)
    console.error('Query error:', error)
  }, [])

  return {
    hasError,
    errorMessage,
    clearError,
    handleError
  }
}