import { useState, useEffect, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { 
  EnhancedProgress, 
  UserNotification, 
  Achievement, 
  GamificationStats 
} from '@/types/gamification'

/**
 * Real-time subscription manager for centralized WebSocket connections
 */
class RealtimeSubscriptionManager {
  private static instance: RealtimeSubscriptionManager
  private supabase = createClient()
  private channels = new Map<string, RealtimeChannel>()
  private subscribers = new Map<string, Set<(data: any) => void>>()

  static getInstance() {
    if (!RealtimeSubscriptionManager.instance) {
      RealtimeSubscriptionManager.instance = new RealtimeSubscriptionManager()
    }
    return RealtimeSubscriptionManager.instance
  }

  subscribe(channelName: string, callback: (data: any) => void) {
    // Add callback to subscribers
    if (!this.subscribers.has(channelName)) {
      this.subscribers.set(channelName, new Set())
    }
    this.subscribers.get(channelName)!.add(callback)

    // Create channel if it doesn't exist
    if (!this.channels.has(channelName)) {
      this.createChannel(channelName)
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(channelName)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.removeChannel(channelName)
        }
      }
    }
  }

  private createChannel(channelName: string) {
    const channel = this.supabase.channel(channelName)
    
    // Configure channel based on type
    if (channelName.startsWith('progress-')) {
      const userId = channelName.split('-')[1]
      channel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'progress',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.notifySubscribers(channelName, { type: 'progress', payload })
      })
    } else if (channelName.startsWith('notifications-')) {
      const userId = channelName.split('-')[1]
      channel.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.notifySubscribers(channelName, { type: 'notification', payload })
      })
    } else if (channelName.startsWith('achievements-')) {
      const userId = channelName.split('-')[1]
      channel.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_achievements',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.notifySubscribers(channelName, { type: 'achievement', payload })
      })
    } else if (channelName.startsWith('gamification-')) {
      const userId = channelName.split('-')[1]
      channel.on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_gamification_stats',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.notifySubscribers(channelName, { type: 'gamification', payload })
      })
    }

    channel.subscribe((status) => {
      console.log(`Channel ${channelName} status:`, status)
    })

    this.channels.set(channelName, channel)
  }

  private removeChannel(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      channel.unsubscribe()
      this.channels.delete(channelName)
      this.subscribers.delete(channelName)
    }
  }

  private notifySubscribers(channelName: string, data: any) {
    const callbacks = this.subscribers.get(channelName)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in real-time callback:', error)
        }
      })
    }
  }

  cleanup() {
    this.channels.forEach((channel, channelName) => {
      channel.unsubscribe()
    })
    this.channels.clear()
    this.subscribers.clear()
  }
}

/**
 * Real-time progress tracking hook
 */
export function useRealTimeProgress(userId: string, courseId?: string) {
  const [progress, setProgress] = useState<EnhancedProgress[]>([])
  const queryClient = useQueryClient()
  const manager = RealtimeSubscriptionManager.getInstance()

  useEffect(() => {
    if (!userId) return

    const unsubscribe = manager.subscribe(`progress-${userId}`, (data) => {
      if (data.type === 'progress') {
        const { eventType, new: newRecord, old: oldRecord } = data.payload
        
        setProgress(prev => {
          switch (eventType) {
            case 'INSERT':
              return [...prev, newRecord]
            case 'UPDATE':
              return prev.map(p => p.id === newRecord.id ? newRecord : p)
            case 'DELETE':
              return prev.filter(p => p.id !== oldRecord.id)
            default:
              return prev
          }
        })

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId] })
        queryClient.invalidateQueries({ queryKey: ['progressAnalytics'] })
      }
    })

    return unsubscribe
  }, [userId, courseId, queryClient, manager])

  return progress
}

/**
 * Real-time notifications hook
 */
export function useRealTimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const queryClient = useQueryClient()
  const manager = RealtimeSubscriptionManager.getInstance()

  useEffect(() => {
    if (!userId) return

    const unsubscribe = manager.subscribe(`notifications-${userId}`, (data) => {
      if (data.type === 'notification') {
        const newNotification = data.payload.new as UserNotification
        
        setNotifications(prev => [newNotification, ...prev])
        setUnreadCount(prev => prev + 1)

        // Show toast notification for high priority items
        if (newNotification.priority === 'high' || newNotification.priority === 'urgent') {
          showNotificationToast(newNotification)
        }

        // Invalidate notifications query
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      }
    })

    return unsubscribe
  }, [userId, queryClient, manager])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST'
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  }
}

/**
 * Real-time achievements hook
 */
export function useRealTimeAchievements(userId: string) {
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const queryClient = useQueryClient()
  const manager = RealtimeSubscriptionManager.getInstance()

  useEffect(() => {
    if (!userId) return

    const unsubscribe = manager.subscribe(`achievements-${userId}`, (data) => {
      if (data.type === 'achievement') {
        const userAchievement = data.payload.new
        
        // Fetch the achievement details
        fetchAchievementDetails(userAchievement.achievement_id).then(achievement => {
          if (achievement) {
            setNewAchievements(prev => [achievement, ...prev])
            showAchievementCelebration(achievement)
            
            // Invalidate achievements query
            queryClient.invalidateQueries({ queryKey: ['achievements'] })
            queryClient.invalidateQueries({ queryKey: ['gamificationStats'] })
          }
        })
      }
    })

    return unsubscribe
  }, [userId, queryClient, manager])

  const dismissAchievement = useCallback((achievementId: string) => {
    setNewAchievements(prev => prev.filter(a => a.id !== achievementId))
  }, [])

  return {
    newAchievements,
    dismissAchievement
  }
}

/**
 * Real-time gamification stats hook
 */
export function useRealTimeGamification(userId: string) {
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [levelUpEvent, setLevelUpEvent] = useState<{ oldLevel: number; newLevel: number } | null>(null)
  const queryClient = useQueryClient()
  const manager = RealtimeSubscriptionManager.getInstance()

  useEffect(() => {
    if (!userId) return

    const unsubscribe = manager.subscribe(`gamification-${userId}`, (data) => {
      if (data.type === 'gamification') {
        const newStats = data.payload.new as GamificationStats
        const oldStats = data.payload.old as GamificationStats
        
        // Check for level up
        if (oldStats && newStats.current_level > oldStats.current_level) {
          setLevelUpEvent({
            oldLevel: oldStats.current_level,
            newLevel: newStats.current_level
          })
          showLevelUpCelebration(newStats.current_level)
        }
        
        setStats(newStats)
        
        // Invalidate gamification queries
        queryClient.invalidateQueries({ queryKey: ['gamificationStats'] })
        queryClient.invalidateQueries({ queryKey: ['progressAnalytics'] })
      }
    })

    return unsubscribe
  }, [userId, queryClient, manager])

  const dismissLevelUp = useCallback(() => {
    setLevelUpEvent(null)
  }, [])

  return {
    stats,
    levelUpEvent,
    dismissLevelUp
  }
}

/**
 * Connection status hook for monitoring real-time connectivity
 */
export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true)
  const [lastConnected, setLastConnected] = useState<Date>(new Date())
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel('connection-status')
    
    channel.subscribe((status) => {
      switch (status) {
        case 'SUBSCRIBED':
          setIsConnected(true)
          setLastConnected(new Date())
          break
        case 'CHANNEL_ERROR':
        case 'TIMED_OUT':
        case 'CLOSED':
          setIsConnected(false)
          break
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  return {
    isConnected,
    lastConnected
  }
}

/**
 * Helper function to show achievement celebration
 */
function showAchievementCelebration(achievement: Achievement) {
  // Create custom event for achievement celebration
  const event = new CustomEvent('achievementUnlocked', {
    detail: achievement
  })
  window.dispatchEvent(event)
}

/**
 * Helper function to show level up celebration
 */
function showLevelUpCelebration(newLevel: number) {
  // Create custom event for level up celebration
  const event = new CustomEvent('levelUp', {
    detail: { level: newLevel }
  })
  window.dispatchEvent(event)
}

/**
 * Helper function to show notification toast
 */
function showNotificationToast(notification: UserNotification) {
  // Create custom event for notification toast
  const event = new CustomEvent('notificationReceived', {
    detail: notification
  })
  window.dispatchEvent(event)
}

/**
 * Helper function to fetch achievement details
 */
async function fetchAchievementDetails(achievementId: string): Promise<Achievement | null> {
  try {
    const response = await fetch(`/api/achievements/${achievementId}`)
    if (response.ok) {
      return response.json()
    }
  } catch (error) {
    console.error('Error fetching achievement details:', error)
  }
  return null
}

/**
 * Cleanup function for real-time subscriptions
 */
export function cleanupRealtimeSubscriptions() {
  RealtimeSubscriptionManager.getInstance().cleanup()
}