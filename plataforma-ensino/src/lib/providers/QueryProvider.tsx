'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/**
 * React Query provider with optimized configuration for the learning platform
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: how long data stays fresh
            staleTime: 5 * 60 * 1000, // 5 minutes
            
            // GC time: how long data stays in cache after becoming stale
            gcTime: 10 * 60 * 1000, // 10 minutes
            
            // Retry configuration
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors (except 408 timeout)
              if (error?.status >= 400 && error?.status < 500 && error?.status !== 408) {
                return false
              }
              // Retry up to 3 times for other errors
              return failureCount < 3
            },
            
            // Exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            
            // Refetch on window focus for real-time data
            refetchOnWindowFocus: true,
            
            // Refetch on network reconnect
            refetchOnReconnect: true,
            
            // Network mode
            networkMode: 'online'
          },
          mutations: {
            // Retry mutations once on network error
            retry: (failureCount, error: any) => {
              return failureCount < 1 && error?.code === 'NETWORK_ERROR'
            },
            
            // Network mode for mutations
            networkMode: 'online'
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}

/**
 * Query key factory for consistent cache keys
 */
export const queryKeys = {
  // User-related queries
  auth: ['auth'] as const,
  userPreferences: ['userPreferences'] as const,
  
  // Course-related queries
  courses: ['courses'] as const,
  course: (id: string) => ['courses', id] as const,
  courseProgress: (courseId: string) => ['courseProgress', courseId] as const,
  
  // Progress-related queries
  progress: ['progress'] as const,
  progressAnalytics: ['progressAnalytics'] as const,
  lessonProgress: (lessonId: string) => ['progress', 'lesson', lessonId] as const,
  
  // Gamification queries
  gamificationStats: ['gamificationStats'] as const,
  achievements: ['achievements'] as const,
  userAchievements: ['userAchievements'] as const,
  
  // Quiz-related queries
  quizzes: ['quizzes'] as const,
  quiz: (id: string) => ['quizzes', id] as const,
  quizAttempts: (quizId: string) => ['quizAttempts', quizId] as const,
  
  // Notification queries
  notifications: ['notifications'] as const,
  unreadNotifications: ['notifications', 'unread'] as const,
  
  // Content queries
  lessons: ['lessons'] as const,
  lesson: (id: string) => ['lessons', id] as const,
  bookmarks: ['bookmarks'] as const
} as const

/**
 * Global error handler for queries
 */
export function handleQueryError(error: any, queryKey: string[]) {
  console.error(`Query error for ${queryKey.join('.')}:`, error)
  
  // Track errors for monitoring
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'query_error', {
      error_message: error.message,
      query_key: queryKey.join('.'),
      error_stack: error.stack
    })
  }
  
  // Show user-friendly error messages
  const userMessage = getUserFriendlyErrorMessage(error)
  
  // Dispatch custom error event for global error handling
  window.dispatchEvent(new CustomEvent('queryError', {
    detail: {
      error,
      queryKey,
      userMessage
    }
  }))
}

/**
 * Convert technical errors to user-friendly messages
 */
function getUserFriendlyErrorMessage(error: any): string {
  if (!error) return 'Algo deu errado. Tente novamente.'
  
  // Network errors
  if (error.message?.includes('fetch') || error.code === 'NETWORK_ERROR') {
    return 'Problemas de conexão. Verifique sua internet e tente novamente.'
  }
  
  // Authentication errors
  if (error.status === 401) {
    return 'Sua sessão expirou. Faça login novamente.'
  }
  
  // Permission errors
  if (error.status === 403) {
    return 'Você não tem permissão para acessar este conteúdo.'
  }
  
  // Not found errors
  if (error.status === 404) {
    return 'Conteúdo não encontrado.'
  }
  
  // Server errors
  if (error.status >= 500) {
    return 'Erro no servidor. Tente novamente em alguns minutos.'
  }
  
  // Rate limiting
  if (error.status === 429) {
    return 'Muitas tentativas. Aguarde um momento antes de tentar novamente.'
  }
  
  // Default message
  return 'Algo deu errado. Tente novamente.'
}

/**
 * Query invalidation helpers
 */
export function createInvalidationHelpers(queryClient: QueryClient) {
  return {
    // Invalidate all user-related data
    invalidateUserData: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userPreferences })
      queryClient.invalidateQueries({ queryKey: queryKeys.gamificationStats })
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
    },
    
    // Invalidate course progress
    invalidateCourseProgress: (courseId?: string) => {
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.courseProgress(courseId) })
      } else {
        queryClient.invalidateQueries({ queryKey: ['courseProgress'] })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.progressAnalytics })
    },
    
    // Invalidate gamification data
    invalidateGamification: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gamificationStats })
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements })
      queryClient.invalidateQueries({ queryKey: queryKeys.userAchievements })
    },
    
    // Clear all cache (for logout)
    clearAllData: () => {
      queryClient.clear()
    }
  }
}

/**
 * Prefetch helpers for better UX
 */
export function createPrefetchHelpers(queryClient: QueryClient) {
  return {
    // Prefetch course data when user hovers over course card
    prefetchCourse: (courseId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.course(courseId),
        queryFn: () => fetch(`/api/courses/${courseId}`).then(res => res.json()),
        staleTime: 10 * 60 * 1000 // 10 minutes
      })
    },
    
    // Prefetch next lesson
    prefetchNextLesson: (lessonId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.lesson(lessonId),
        queryFn: () => fetch(`/api/lessons/${lessonId}`).then(res => res.json()),
        staleTime: 15 * 60 * 1000 // 15 minutes
      })
    },
    
    // Prefetch user achievements
    prefetchAchievements: () => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.achievements,
        queryFn: () => fetch('/api/achievements').then(res => res.json()),
        staleTime: 30 * 60 * 1000 // 30 minutes
      })
    }
  }
}