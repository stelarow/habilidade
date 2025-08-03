'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth, useUserPreferences } from '@/lib/hooks/useSupabase'
import { 
  useRealTimeNotifications, 
  useRealTimeAchievements, 
  useRealTimeGamification,
  useConnectionStatus,
  cleanupRealtimeSubscriptions
} from '@/lib/hooks/useRealtime'
import { handleQueryError, handleMutationError } from '@/lib/utils/errorHandling'
import type { UserNotification, Achievement } from '@/types/gamification'

/**
 * Integration context for managing global app state and real-time features
 */
interface IntegrationContextType {
  // Connection state
  isOnline: boolean
  isRealtimeConnected: boolean
  
  // Notifications
  notifications: UserNotification[]
  unreadCount: number
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  
  // Achievements
  newAchievements: Achievement[]
  dismissAchievement: (id: string) => void
  
  // UI state
  isSidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Theme and preferences
  theme: string
  updateTheme: (theme: string) => void
  
  // Error handling
  showError: (message: string) => void
  showSuccess: (message: string) => void
  showInfo: (message: string) => void
}

const IntegrationContext = createContext<IntegrationContextType | null>(null)

/**
 * Integration provider that orchestrates all real-time features and global state
 */
export function IntegrationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { preferences, updatePreferences } = useUserPreferences()
  const { isConnected } = useConnectionStatus()
  
  // Real-time hooks
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useRealTimeNotifications(user?.id || '')
  
  const { 
    newAchievements, 
    dismissAchievement 
  } = useRealTimeAchievements(user?.id || '')
  
  const { 
    levelUpEvent, 
    dismissLevelUp 
  } = useRealTimeGamification(user?.id || '')

  // Local state
  const [isOnline, setIsOnline] = useState(true)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Global event listeners for integration features
  useEffect(() => {
    const handleLessonSelected = (event: CustomEvent) => {
      const { lessonId, courseId } = event.detail
      // Handle lesson navigation
      window.location.href = `/courses/${courseId}/lessons/${lessonId}`
    }

    const handleAchievementUnlocked = (event: CustomEvent) => {
      const achievement = event.detail as Achievement
      
      // Show celebration toast
      toast.success(`🏆 Conquista Desbloqueada: ${achievement.name}!`, {
        description: achievement.description,
        duration: 6000,
        action: {
          label: 'Ver Detalhes',
          onClick: () => {
            // Open achievement modal or navigate to achievements page
            window.dispatchEvent(new CustomEvent('showAchievementDetails', {
              detail: achievement
            }))
          }
        }
      })
    }

    const handleLevelUp = (event: CustomEvent) => {
      const { level } = event.detail
      
      // Show level up celebration
      toast.success(`🎉 Parabéns! Você chegou ao nível ${level}!`, {
        description: 'Continue assim e desbloqueie mais conquistas!',
        duration: 8000
      })
    }

    const handleNotificationReceived = (event: CustomEvent) => {
      const notification = event.detail as UserNotification
      
      // Show notification toast for high priority notifications
      if (notification.priority === 'high' || notification.priority === 'urgent') {
        toast.info(notification.title, {
          description: notification.message,
          duration: 5000,
          action: notification.action_url ? {
            label: 'Ver',
            onClick: () => window.location.href = notification.action_url!
          } : undefined
        })
      }
    }

    const handleQueryError = (event: CustomEvent) => {
      const { error, userMessage } = event.detail
      console.error('Query error received:', error)
      toast.error(userMessage || 'Erro ao carregar dados')
    }

    const handleAuthError = () => {
      toast.error('Sua sessão expirou. Você será redirecionado para o login.')
    }

    const handleRetryLastOperation = () => {
      // This would be implemented to retry the last failed operation
      toast.info('Tentando novamente...')
    }

    // Add event listeners
    window.addEventListener('lessonSelected', handleLessonSelected as EventListener)
    window.addEventListener('achievementUnlocked', handleAchievementUnlocked as EventListener)
    window.addEventListener('levelUp', handleLevelUp as EventListener)
    window.addEventListener('notificationReceived', handleNotificationReceived as EventListener)
    window.addEventListener('queryError', handleQueryError as EventListener)
    window.addEventListener('authError', handleAuthError)
    window.addEventListener('retryLastOperation', handleRetryLastOperation)

    return () => {
      window.removeEventListener('lessonSelected', handleLessonSelected as EventListener)
      window.removeEventListener('achievementUnlocked', handleAchievementUnlocked as EventListener)
      window.removeEventListener('levelUp', handleLevelUp as EventListener)
      window.removeEventListener('notificationReceived', handleNotificationReceived as EventListener)
      window.removeEventListener('queryError', handleQueryError as EventListener)
      window.removeEventListener('authError', handleAuthError)
      window.removeEventListener('retryLastOperation', handleRetryLastOperation)
    }
  }, [])

  // Handle level up events
  useEffect(() => {
    if (levelUpEvent) {
      // Auto-dismiss level up event after showing
      const timer = setTimeout(() => {
        dismissLevelUp()
      }, 10000) // Dismiss after 10 seconds

      return () => clearTimeout(timer)
    }
    return undefined
  }, [levelUpEvent, dismissLevelUp])

  // Load saved sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved) {
      setSidebarCollapsed(JSON.parse(saved))
    }
  }, [])

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  // Cleanup real-time subscriptions on unmount
  useEffect(() => {
    return () => {
      cleanupRealtimeSubscriptions()
    }
  }, [])

  // Show offline notification
  useEffect(() => {
    if (!isOnline) {
      toast.warning('Você está offline. Algumas funcionalidades podem não funcionar.', {
        duration: Infinity,
        id: 'offline-warning'
      })
    } else {
      toast.dismiss('offline-warning')
    }
  }, [isOnline])

  // Show connection status for real-time features
  useEffect(() => {
    if (isAuthenticated && !isConnected) {
      toast.warning('Conexão instável. Atualizações em tempo real podem estar limitadas.', {
        duration: 5000,
        id: 'realtime-warning'
      })
    } else {
      toast.dismiss('realtime-warning')
    }
  }, [isAuthenticated, isConnected])

  const updateTheme = async (theme: string) => {
    if (updatePreferences) {
      updatePreferences({ theme } as any)
    }
  }

  const contextValue: IntegrationContextType = {
    // Connection state
    isOnline,
    isRealtimeConnected: isConnected,
    
    // Notifications
    notifications,
    unreadCount,
    markNotificationAsRead: markAsRead,
    markAllNotificationsAsRead: markAllAsRead,
    
    // Achievements
    newAchievements,
    dismissAchievement,
    
    // UI state
    isSidebarCollapsed,
    setSidebarCollapsed,
    
    // Theme and preferences
    theme: preferences?.theme || 'violet-dark',
    updateTheme,
    
    // Utility functions
    showError: (message: string) => toast.error(message),
    showSuccess: (message: string) => toast.success(message),
    showInfo: (message: string) => toast.info(message)
  }

  return (
    <IntegrationContext.Provider value={contextValue}>
      {children}
    </IntegrationContext.Provider>
  )
}

/**
 * Hook to use integration context
 */
export function useIntegration() {
  const context = useContext(IntegrationContext)
  if (!context) {
    throw new Error('useIntegration must be used within an IntegrationProvider')
  }
  return context
}

/**
 * Custom hooks for specific integration features
 */

/**
 * Hook for managing sidebar state with persistence
 */
export function useSidebarState() {
  const { isSidebarCollapsed, setSidebarCollapsed } = useIntegration()
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed)
  }

  return {
    isCollapsed: isSidebarCollapsed,
    setCollapsed: setSidebarCollapsed,
    toggle: toggleSidebar
  }
}

/**
 * Hook for showing notifications with consistent styling
 */
export function useNotifications() {
  const { showError, showSuccess, showInfo } = useIntegration()
  
  const showProgressSaved = () => {
    showSuccess('Progresso salvo automaticamente')
  }

  const showQuizCompleted = (score: number, passed: boolean) => {
    if (passed) {
      showSuccess(`Quiz concluído! Você acertou ${score}%`)
    } else {
      showError(`Quiz não passou. Você acertou ${score}%. Tente novamente!`)
    }
  }

  const showConnectionError = () => {
    showError('Problema de conexão. Suas alterações podem não ter sido salvas.')
  }

  return {
    showError,
    showSuccess,
    showInfo,
    showProgressSaved,
    showQuizCompleted,
    showConnectionError
  }
}

/**
 * Hook for theme management
 */
export function useTheme() {
  const { theme, updateTheme } = useIntegration()
  
  const setTheme = (newTheme: string) => {
    updateTheme(newTheme)
    
    // Apply theme immediately to document
    document.documentElement.className = `theme-${newTheme}`
  }

  return {
    theme,
    setTheme,
    isVioletDark: theme === 'violet-dark',
    isDark: theme.includes('dark'),
    isHighContrast: theme === 'high-contrast'
  }
}