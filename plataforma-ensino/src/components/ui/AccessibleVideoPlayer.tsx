'use client'

import React, { useState, useEffect, useRef } from 'react'
import { LazyVideoPlayer, LazyVideoPlayerProps } from './LazyVideoPlayer'
import { VideoPlayerRef } from './ReactVideoPlayer'
import { cn } from '@/lib/utils'

export interface AccessibleVideoPlayerProps extends LazyVideoPlayerProps {
  title?: string
  description?: string
  transcript?: string
  showTranscript?: boolean
  keyboardShortcuts?: boolean
  progressSaveKey?: string
  onProgressSave?: (progress: { played: number; playedSeconds: number }) => void
  onProgressLoad?: () => Promise<{ played: number; playedSeconds: number } | null>
  autoSaveProgress?: boolean
  accessibilityControls?: boolean
}

export const AccessibleVideoPlayer = React.forwardRef<VideoPlayerRef, AccessibleVideoPlayerProps>(({
  title,
  description,
  transcript,
  showTranscript = false,
  keyboardShortcuts = true,
  progressSaveKey,
  onProgressSave,
  onProgressLoad,
  autoSaveProgress = true,
  accessibilityControls = true,
  className,
  onProgress,
  onReady,
  ...props
}, ref) => {
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(showTranscript)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [savedProgress, setSavedProgress] = useState<{ played: number; playedSeconds: number } | null>(null)
  const playerRef = useRef<VideoPlayerRef>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Forward ref to internal player
  React.useImperativeHandle(ref, () => playerRef.current!)

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (onProgressLoad) {
        const progress = await onProgressLoad()
        if (progress) {
          setSavedProgress(progress)
        }
      } else if (progressSaveKey) {
        const saved = localStorage.getItem(`video_progress_${progressSaveKey}`)
        if (saved) {
          setSavedProgress(JSON.parse(saved))
        }
      }
    }

    loadProgress()
  }, [progressSaveKey, onProgressLoad])

  // Resume from saved progress when player is ready
  useEffect(() => {
    if (savedProgress && playerRef.current) {
      playerRef.current.seekTo(savedProgress.playedSeconds, 'seconds')
    }
  }, [savedProgress, playerRef.current])

  // Keyboard shortcuts
  useEffect(() => {
    if (!keyboardShortcuts) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playerRef.current) return

      // Only handle if video player container is focused or target is the container
      if (document.activeElement !== containerRef.current &&
          !containerRef.current?.contains(document.activeElement)) {
        return
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          // Toggle play/pause (would need to track playing state)
          break
        case 'ArrowLeft':
          e.preventDefault()
          playerRef.current.seekTo(Math.max(0, currentTime - 10), 'seconds')
          break
        case 'ArrowRight':
          e.preventDefault()
          playerRef.current.seekTo(Math.min(duration, currentTime + 10), 'seconds')
          break
        case 'ArrowUp':
          e.preventDefault()
          // Volume up (would need volume control)
          break
        case 'ArrowDown':
          e.preventDefault()
          // Volume down (would need volume control)
          break
        case 'f':
          e.preventDefault()
          // Toggle fullscreen (would need fullscreen API)
          break
        case 'c':
          e.preventDefault()
          setIsTranscriptVisible(!isTranscriptVisible)
          break
        case 'm':
          e.preventDefault()
          // Toggle mute (would need mute control)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [keyboardShortcuts, currentTime, duration, isTranscriptVisible])

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds)
    
    // Auto-save progress
    if (autoSaveProgress) {
      const progressData = { played: state.played, playedSeconds: state.playedSeconds }
      
      if (onProgressSave) {
        onProgressSave(progressData)
      } else if (progressSaveKey) {
        localStorage.setItem(`video_progress_${progressSaveKey}`, JSON.stringify(progressData))
      }
    }

    onProgress?.(state)
  }

  const handleReady = (player: any) => {
    setDuration(player.getDuration())
    onReady?.(player)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const uniqueId = React.useId()
  const transcriptId = `transcript-${uniqueId}`
  const descriptionId = `description-${uniqueId}`

  return (
    <div
      ref={containerRef}
      className={cn('focus-within:outline-none', className)}
      tabIndex={0}
      role="region"
      aria-label={title ? `Vídeo: ${title}` : 'Player de vídeo'}
      aria-describedby={description ? descriptionId : undefined}
    >
      {/* Video Title */}
      {title && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
          {description && (
            <p id={descriptionId} className="text-gray-400 text-sm">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Video Player */}
      <LazyVideoPlayer
        ref={playerRef}
        onProgress={handleProgress}
        onReady={handleReady}
        aria-describedby={transcript ? transcriptId : undefined}
        {...props}
      />

      {/* Accessibility Controls */}
      {accessibilityControls && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            {savedProgress && (
              <span className="text-blue-400">
                ⏳ Progresso salvo: {Math.round(savedProgress.played * 100)}%
              </span>
            )}
          </div>
          
          {transcript && (
            <button
              onClick={() => setIsTranscriptVisible(!isTranscriptVisible)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
              aria-expanded={isTranscriptVisible}
              aria-controls={transcriptId}
            >
              {isTranscriptVisible ? 'Ocultar' : 'Mostrar'} Transcrição
            </button>
          )}
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      {keyboardShortcuts && (
        <div className="mt-2 text-xs text-gray-500">
          <details>
            <summary className="cursor-pointer hover:text-gray-400">
              Atalhos do teclado
            </summary>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>Espaço/K: Play/Pausa</div>
              <div>← →: Voltar/Avançar 10s</div>
              <div>↑ ↓: Volume +/-</div>
              <div>F: Tela cheia</div>
              <div>M: Mute/Unmute</div>
              <div>C: Mostrar/Ocultar transcrição</div>
            </div>
          </details>
        </div>
      )}

      {/* Transcript */}
      {transcript && isTranscriptVisible && (
        <div
          id={transcriptId}
          className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
          role="region"
          aria-label="Transcrição do vídeo"
        >
          <h3 className="text-lg font-medium text-white mb-2">Transcrição</h3>
          <div className="text-gray-300 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
            {transcript}
          </div>
        </div>
      )}
    </div>
  )
})

AccessibleVideoPlayer.displayName = 'AccessibleVideoPlayer'

export default AccessibleVideoPlayer