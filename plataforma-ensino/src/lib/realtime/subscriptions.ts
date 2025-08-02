import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

// Types for real-time events
export interface ProgressUpdateEvent {
  user_id: string
  lesson_id: string
  enrollment_id: string
  completed: boolean
  progress_percentage: number
  updated_at: string
}

export interface AchievementUnlockedEvent {
  user_id: string
  achievement_id: string
  achievement: {
    name: string
    description: string
    icon: string
    points: number
    rarity: string
    badge_color: string
  }
  unlocked_at: string
}

export interface NotificationEvent {
  id: string
  user_id: string
  notification_type: string
  title: string
  message: string
  priority: string
  created_at: string
}

export interface GamificationUpdateEvent {
  user_id: string
  total_xp: number
  current_level: number
  current_streak: number
  lessons_completed: number
}

// Real-time subscription manager
export class RealtimeSubscriptionManager {
  private supabase = createClient()
  private channels: Map<string, RealtimeChannel> = new Map()
  private userId: string | null = null

  constructor(userId?: string) {
    this.userId = userId || null
  }

  async initialize() {
    if (!this.userId) {
      const { data: { user } } = await this.supabase.auth.getUser()
      this.userId = user?.id || null
    }
    
    if (!this.userId) {
      throw new Error('User must be authenticated to use real-time subscriptions')
    }
  }

  // Subscribe to progress updates for a specific enrollment
  subscribeToProgressUpdates(
    enrollmentId: string,
    callback: (event: ProgressUpdateEvent) => void
  ) {
    const channelName = `progress-${enrollmentId}`
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'progress',
          filter: `enrollment_id=eq.${enrollmentId}`
        },
        (payload) => {
          console.log('Progress update received:', payload)
          callback(payload.new as ProgressUpdateEvent)
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Subscribe to achievement unlocks for current user
  subscribeToAchievementUnlocks(
    callback: (event: AchievementUnlockedEvent) => void
  ) {
    if (!this.userId) {
      throw new Error('User ID required for achievement subscriptions')
    }

    const channelName = `achievements-${this.userId}`
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${this.userId}`
        },
        async (payload) => {
          console.log('Achievement unlocked:', payload)
          
          // Fetch the achievement details
          const { data: achievement } = await this.supabase
            .from('achievements')
            .select('*')
            .eq('id', payload.new.achievement_id)
            .single()

          if (achievement) {
            callback({
              ...payload.new,
              achievement
            } as AchievementUnlockedEvent)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Subscribe to notifications for current user
  subscribeToNotifications(
    callback: (event: NotificationEvent) => void
  ) {
    if (!this.userId) {
      throw new Error('User ID required for notification subscriptions')
    }

    const channelName = `notifications-${this.userId}`
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${this.userId}`
        },
        (payload) => {
          console.log('New notification:', payload)
          callback(payload.new as NotificationEvent)
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Subscribe to gamification stats updates
  subscribeToGamificationUpdates(
    callback: (event: GamificationUpdateEvent) => void
  ) {
    if (!this.userId) {
      throw new Error('User ID required for gamification subscriptions')
    }

    const channelName = `gamification-${this.userId}`
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_gamification_stats',
          filter: `user_id=eq.${this.userId}`
        },
        (payload) => {
          console.log('Gamification stats updated:', payload)
          callback(payload.new as GamificationUpdateEvent)
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Subscribe to course-wide updates (for instructor/admin views)
  subscribeToCourseUpdates(
    courseId: string,
    callback: (event: any) => void
  ) {
    const channelName = `course-${courseId}`
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'enrollments',
          filter: `course_id=eq.${courseId}`
        },
        (payload) => {
          console.log('Course enrollment update:', payload)
          callback(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress'
        },
        async (payload) => {
          // Filter for this course by checking enrollment
          const { data: enrollment } = await this.supabase
            .from('enrollments')
            .select('course_id')
            .eq('id', payload.new?.enrollment_id || payload.old?.enrollment_id)
            .single()

          if (enrollment?.course_id === courseId) {
            console.log('Course progress update:', payload)
            callback(payload)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      this.supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.channels.forEach((channel, channelName) => {
      this.supabase.removeChannel(channel)
    })
    this.channels.clear()
  }

  // Get active channel count
  getActiveChannelCount() {
    return this.channels.size
  }

  // Helper method to trigger custom events
  async triggerCustomEvent(channel: string, event: string, payload: any) {
    const customChannel = this.supabase.channel(channel)
    await customChannel.send({
      type: 'broadcast',
      event: event,
      payload: payload
    })
  }
}

// Factory function to create subscription manager
export function createRealtimeManager(userId?: string) {
  return new RealtimeSubscriptionManager(userId)
}

// React hook for using real-time subscriptions
export function useRealtimeSubscription() {
  return {
    // Convenience methods for common subscriptions
    subscribeToProgress: (enrollmentId: string, callback: (event: ProgressUpdateEvent) => void) => {
      const manager = createRealtimeManager()
      return manager.subscribeToProgressUpdates(enrollmentId, callback)
    },
    
    subscribeToAchievements: (callback: (event: AchievementUnlockedEvent) => void) => {
      const manager = createRealtimeManager()
      return manager.subscribeToAchievementUnlocks(callback)
    },
    
    subscribeToNotifications: (callback: (event: NotificationEvent) => void) => {
      const manager = createRealtimeManager()
      return manager.subscribeToNotifications(callback)
    },
    
    subscribeToGamification: (callback: (event: GamificationUpdateEvent) => void) => {
      const manager = createRealtimeManager()
      return manager.subscribeToGamificationUpdates(callback)
    }
  }
}

// Utility functions for common real-time operations
export const realtimeUtils = {
  // Format real-time event for display
  formatProgressEvent: (event: ProgressUpdateEvent) => ({
    message: event.completed 
      ? 'Lição completada!' 
      : `Progresso atualizado: ${event.progress_percentage}%`,
    timestamp: new Date(event.updated_at).toLocaleTimeString(),
    type: event.completed ? 'success' : 'info'
  }),

  formatAchievementEvent: (event: AchievementUnlockedEvent) => ({
    message: `Nova conquista desbloqueada: ${event.achievement.name}`,
    description: event.achievement.description,
    points: event.achievement.points,
    timestamp: new Date(event.unlocked_at).toLocaleTimeString(),
    type: 'achievement',
    icon: event.achievement.icon,
    color: event.achievement.badge_color
  }),

  formatNotificationEvent: (event: NotificationEvent) => ({
    message: event.title,
    description: event.message,
    timestamp: new Date(event.created_at).toLocaleTimeString(),
    type: event.notification_type,
    priority: event.priority
  }),

  // Check if real-time is supported
  isRealtimeSupported: () => {
    return typeof window !== 'undefined' && 'WebSocket' in window
  },

  // Get connection status
  getConnectionStatus: (channel: RealtimeChannel) => {
    return channel.state
  }
}