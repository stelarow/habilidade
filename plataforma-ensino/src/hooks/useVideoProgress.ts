'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import * as Sentry from '@sentry/nextjs'
import { VideoProgress, Progress, Lesson } from '@/types'
import { debounce } from '@/lib/utils'

interface UseVideoProgressOptions {
  lessonId: string
  userId: string
  enrollmentId: string
  autoSave?: boolean
  autoSaveInterval?: number
  completionThreshold?: number
}

export function useVideoProgress({
  lessonId,
  userId,
  enrollmentId,
  autoSave = true,
  autoSaveInterval = 5000,
  completionThreshold = 0.9
}: UseVideoProgressOptions) {
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  
  const supabase = createClient()
  const lastSavedPosition = useRef(0)
  const totalWatchTime = useRef(0)

  // Load existing progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('progress')
          .select('*')
          .eq('lesson_id', lessonId)
          .eq('user_id', userId)
          .eq('enrollment_id', enrollmentId)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }

        if (data) {
          setProgress(data)
          setIsCompleted(data.completed)
          lastSavedPosition.current = data.last_position
          totalWatchTime.current = data.watch_time
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load progress'
        setError(message)
        Sentry.captureException(err, {
          tags: { component: 'useVideoProgress', action: 'loadProgress' },
          extra: { lessonId, userId, enrollmentId }
        })
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [lessonId, userId, enrollmentId, supabase])

  // Save progress to database
  const saveProgress = useCallback(async (
    lastPosition: number,
    watchTime: number,
    completed: boolean = false
  ) => {
    try {
      const progressData = {
        user_id: userId,
        lesson_id: lessonId,
        enrollment_id: enrollmentId,
        last_position: lastPosition,
        watch_time: watchTime,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }

      const { data, error: saveError } = await supabase
        .from('progress')
        .upsert(progressData, {
          onConflict: 'user_id,lesson_id,enrollment_id'
        })
        .select()
        .single()

      if (saveError) throw saveError

      setProgress(data)
      lastSavedPosition.current = lastPosition
      totalWatchTime.current = watchTime

      // Track in Sentry
      Sentry.addBreadcrumb({
        category: 'video',
        message: 'Progress saved',
        level: 'info',
        data: {
          lessonId,
          lastPosition,
          watchTime,
          completed
        }
      })

      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save progress'
      setError(message)
      Sentry.captureException(err, {
        tags: { component: 'useVideoProgress', action: 'saveProgress' },
        extra: { lessonId, userId, enrollmentId, lastPosition, watchTime, completed }
      })
      throw err
    }
  }, [userId, lessonId, enrollmentId, supabase])

  // Debounced save function for auto-saving
  const debouncedSave = useCallback(
    (position: number, watchTime: number) => {
      const debouncedFn = debounce((pos: number, wt: number) => {
        if (autoSave && Math.abs(pos - lastSavedPosition.current) >= 1) {
          saveProgress(pos, wt)
        }
      }, autoSaveInterval)
      debouncedFn(position, watchTime)
    },
    [autoSave, autoSaveInterval, saveProgress]
  )

  // Mark lesson as completed
  const markAsCompleted = useCallback(async () => {
    try {
      const currentProgress = progress || {
        user_id: userId,
        lesson_id: lessonId,
        enrollment_id: enrollmentId,
        last_position: 0,
        watch_time: 0,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await saveProgress(
        currentProgress.last_position,
        totalWatchTime.current,
        true
      )

      setIsCompleted(true)

      // Track completion event
      Sentry.addBreadcrumb({
        category: 'lesson',
        message: 'Lesson completed',
        level: 'info',
        data: {
          lessonId,
          userId,
          totalWatchTime: totalWatchTime.current
        }
      })

    } catch (err) {
      console.error('Failed to mark lesson as completed:', err)
    }
  }, [progress, userId, lessonId, enrollmentId, saveProgress])

  // Handle video progress updates
  const handleProgress = useCallback((videoProgress: VideoProgress) => {
    const { playedSeconds } = videoProgress
    
    // Update local state
    setProgress(prev => prev ? {
      ...prev,
      last_position: playedSeconds,
      watch_time: totalWatchTime.current + 1 // Increment watch time
    } : null)

    // Auto-save progress
    if (autoSave) {
      totalWatchTime.current += 1
      debouncedSave(playedSeconds, totalWatchTime.current)
    }

    // Check for completion
    if (videoProgress.played >= completionThreshold && !isCompleted) {
      setIsCompleted(true)
      markAsCompleted()
    }
  }, [autoSave, debouncedSave, completionThreshold, isCompleted, markAsCompleted])

  // Reset progress
  const resetProgress = useCallback(async () => {
    try {
      await saveProgress(0, 0, false)
      setIsCompleted(false)
      totalWatchTime.current = 0
    } catch (err) {
      console.error('Failed to reset progress:', err)
    }
  }, [saveProgress])

  // Get completion percentage
  const getCompletionPercentage = useCallback((videoDuration?: number) => {
    if (!progress) return 0
    // Based on time watched vs lesson duration or completion status
    const duration = videoDuration || progress.lesson?.video_duration || 1
    return isCompleted ? 100 : Math.min((progress.last_position / duration) * 100, 99)
  }, [progress, isCompleted])

  return {
    progress,
    loading,
    error,
    isCompleted,
    handleProgress,
    markAsCompleted,
    resetProgress,
    saveProgress,
    getCompletionPercentage,
    // Convenience getters
    lastPosition: progress?.last_position || 0,
    watchTime: progress?.watch_time || 0
  }
}