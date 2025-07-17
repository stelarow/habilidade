'use client'

import React, { useState, useEffect } from 'react'
import { AccessibleVideoPlayer } from '../ui/AccessibleVideoPlayer'
import { VideoPlayerRef, VideoTrack } from '../ui/ReactVideoPlayer'
import { createClient } from '@/lib/supabase/client'
import { Lesson, Progress } from '@/types'

export interface LessonVideoPlayerProps {
  lesson: Lesson
  enrollmentId: string
  userId: string
  onProgress?: (progress: Progress) => void
  onComplete?: () => void
  autoplay?: boolean
  className?: string
}

export const LessonVideoPlayer: React.FC<LessonVideoPlayerProps> = ({
  lesson,
  enrollmentId,
  userId,
  onProgress,
  onComplete,
  autoplay = false,
  className
}) => {
  const [videoRef, setVideoRef] = useState<VideoPlayerRef | null>(null)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [currentProgress, setCurrentProgress] = useState<Progress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  // Load existing progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('progress')
          .select('*')
          .eq('lesson_id', lesson.id)
          .eq('user_id', userId)
          .eq('enrollment_id', enrollmentId)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        if (data) {
          setCurrentProgress(data)
        }
      } catch (err) {
        console.error('Error loading progress:', err)
        setError('Erro ao carregar progresso do vídeo')
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [lesson.id, userId, enrollmentId, supabase])

  // Save progress to database
  const saveProgress = async (progressData: { played: number; playedSeconds: number }) => {
    try {
      const progressUpdate = {
        user_id: userId,
        lesson_id: lesson.id,
        enrollment_id: enrollmentId,
        completed: progressData.played >= 0.9, // Consider 90% as completed
        last_position: progressData.playedSeconds,
        watch_time: progressData.playedSeconds,
        completed_at: progressData.played >= 0.9 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('progress')
        .upsert(progressUpdate, {
          onConflict: 'user_id,lesson_id,enrollment_id'
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setCurrentProgress(data)
        onProgress?.(data)
        
        // Trigger completion callback if lesson is completed
        if (data.completed && !currentProgress?.completed) {
          onComplete?.()
        }
      }
    } catch (err) {
      console.error('Error saving progress:', err)
      // Don't show error to user for progress saving failures
    }
  }

  // Load saved progress
  const loadSavedProgress = async (): Promise<{ played: number; playedSeconds: number } | null> => {
    if (currentProgress) {
      const duration = lesson.video_duration || 0
      return {
        played: duration > 0 ? currentProgress.last_position / duration : 0,
        playedSeconds: currentProgress.last_position
      }
    }
    return null
  }

  const handleVideoProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    // Save progress every 10 seconds
    if (Math.floor(state.playedSeconds) % 10 === 0) {
      saveProgress(state)
    }
  }

  const handleVideoEnd = () => {
    if (videoRef) {
      const duration = videoRef.getDuration()
      saveProgress({
        played: 1,
        playedSeconds: duration
      })
    }
  }

  // Prepare video tracks (subtitles/captions)
  const videoTracks: VideoTrack[] = []
  
  // Add Portuguese subtitles if available
  if (lesson.materials?.some(m => m.type === 'subtitle' && m.url)) {
    const subtitleMaterial = lesson.materials.find(m => m.type === 'subtitle' && m.url)
    if (subtitleMaterial?.url) {
      videoTracks.push({
        kind: 'subtitles',
        src: subtitleMaterial.url,
        srcLang: 'pt-BR',
        label: 'Português',
        default: true
      })
    }
  }

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando vídeo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-400 font-medium mb-2">Erro ao carregar vídeo</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!lesson.video_url) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🎥</div>
          <p className="text-gray-300">Nenhum vídeo disponível para esta aula</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <AccessibleVideoPlayer
        ref={setVideoRef}
        url={lesson.video_url}
        title={lesson.title}
        description={lesson.description}
        transcript={lesson.transcript}
        tracks={videoTracks}
        playing={isPlaying}
        light={true} // Use light mode for better performance
        controls={true}
        playsInline={true}
        keyboardShortcuts={true}
        accessibilityControls={true}
        autoSaveProgress={true}
        progressSaveKey={`lesson_${lesson.id}`}
        onProgressSave={saveProgress}
        onProgressLoad={loadSavedProgress}
        onProgress={handleVideoProgress}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleVideoEnd}
        onError={(error) => {
          console.error('Video playback error:', error)
          setError('Erro na reprodução do vídeo')
        }}
        config={{
          youtube: {
            playerVars: {
              showinfo: 1,
              modestbranding: 1,
              rel: 0
            },
            embedOptions: {
              origin: typeof window !== 'undefined' ? window.location.origin : 'https://plataformahabilidade.netlify.app'
            }
          },
          vimeo: {
            playerOptions: {
              title: false,
              byline: false,
              portrait: false
            }
          }
        }}
        className="w-full"
      />
      
      {/* Progress indicator */}
      {currentProgress && (
        <div className="mt-4 text-sm text-gray-400">
          <div className="flex items-center justify-between">
            <span>
              {currentProgress.completed ? '✅ Aula concluída' : '⏱️ Em progresso'}
            </span>
            <span>
              {Math.round((currentProgress.last_position / (lesson.video_duration || 1)) * 100)}% assistido
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(currentProgress.last_position / (lesson.video_duration || 1)) * 100}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default LessonVideoPlayer