'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { Play, Pause, SkipBack, SkipForward, SpeakerHigh, SpeakerSlash, CornersOut, Gear } from 'phosphor-react'
import * as Sentry from '@sentry/nextjs'
import { VideoPlayerProps, VideoProgress } from '@/types'
import { cn } from '@/lib/utils'

interface MuxVideoPlayerProps extends Omit<VideoPlayerProps, 'url'> {
  playbackId: string
  onProgressUpdate?: (progress: VideoProgress) => void
  onLessonComplete?: () => void
  lesson?: {
    id: string
    title: string
    video_duration: number
  }
  className?: string
  autoSave?: boolean
  autoSaveInterval?: number
  streamType?: 'on-demand' | 'live'
  tokens?: {
    playback?: string
    thumbnail?: string
    storyboard?: string
  }
  customDomain?: string
}

export default function MuxVideoPlayer({
  playbackId,
  poster,
  onProgress,
  onProgressUpdate,
  onLessonComplete,
  onEnded,
  onStart,
  onPause,
  onPlay,
  controls = false,
  playing: externalPlaying,
  muted: externalMuted,
  volume: externalVolume = 1,
  playbackRate = 1,
  width = '100%',
  height = '100%',
  lesson,
  className,
  autoSave = true,
  autoSaveInterval = 5000,
  streamType = 'on-demand',
  tokens,
  customDomain,
  ...props
}: MuxVideoPlayerProps) {
  const playerRef = useRef<any>(null)
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playedSeconds, setPlayedSeconds] = useState(0)
  const [volume, setVolume] = useState(externalVolume)
  const [muted, setMuted] = useState(externalMuted || false)
  const [showControls, setShowControls] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [seeking, setSeeking] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [lastSavedProgress, setLastSavedProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playbackTokens, setPlaybackTokens] = useState(tokens)
  
  const hideControlsTimeout = useRef<NodeJS.Timeout>()
  const progressInterval = useRef<NodeJS.Timeout>()

  // Auto-hide controls
  const scheduleHideControls = useCallback(() => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current)
    }
    hideControlsTimeout.current = setTimeout(() => {
      if (!isHovering && playing) {
        setShowControls(false)
      }
    }, 3000)
  }, [isHovering, playing])

  // Progress tracking interval
  useEffect(() => {
    if (playing && playerRef.current) {
      progressInterval.current = setInterval(() => {
        const current = playerRef.current
        if (current && duration > 0) {
          const currentTime = current.currentTime
          const progressData: VideoProgress = {
            played: currentTime / duration,
            playedSeconds: currentTime,
            loaded: current.buffered.length > 0 ? current.buffered.end(0) / duration : 0,
            loadedSeconds: current.buffered.length > 0 ? current.buffered.end(0) : 0
          }

          setPlayed(progressData.played)
          setPlayedSeconds(progressData.playedSeconds)
          
          // Auto-save progress
          if (autoSave && lesson && Math.abs(currentTime - lastSavedProgress) >= autoSaveInterval / 1000) {
            setLastSavedProgress(currentTime)
            onProgressUpdate?.(progressData)
          }
          
          // Call external progress handler
          onProgress?.(progressData)
          
          // Check for lesson completion (90% watched)
          if (progressData.played >= 0.9 && lesson && !seeking) {
            onLessonComplete?.()
          }
        }
      }, 1000)
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [playing, duration, autoSave, lesson, lastSavedProgress, autoSaveInterval, onProgress, onProgressUpdate, onLessonComplete, seeking])

  // Handle seeking
  const handleSeekChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSeeking(true)
    const newPlayed = parseFloat(e.target.value)
    setPlayed(newPlayed)
    setPlayedSeconds(newPlayed * duration)
  }, [duration])

  const handleSeekMouseUp = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false)
    const newPlayed = parseFloat((e.target as HTMLInputElement).value)
    if (playerRef.current) {
      playerRef.current.currentTime = newPlayed * duration
    }
  }, [duration])

  // Playback controls
  const handlePlayPause = useCallback(() => {
    if (playerRef.current) {
      if (playing) {
        playerRef.current.pause()
      } else {
        playerRef.current.play()
      }
    }
  }, [playing])

  const handleSkip = useCallback((seconds: number) => {
    if (playerRef.current) {
      const newTime = Math.max(0, Math.min(duration, playerRef.current.currentTime + seconds))
      playerRef.current.currentTime = newTime
    }
  }, [duration])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setMuted(newVolume === 0)
    if (playerRef.current) {
      playerRef.current.volume = newVolume
    }
  }, [])

  const toggleMute = useCallback(() => {
    const newMuted = !muted
    setMuted(newMuted)
    if (playerRef.current) {
      playerRef.current.muted = newMuted
    }
  }, [muted])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (playerRef.current) {
      setDuration(playerRef.current.duration)
      setIsLoading(false)
      
      // Track video ready event
      Sentry.addBreadcrumb({
        category: 'video',
        message: `Mux video ready: ${lesson?.title || playbackId}`,
        level: 'info',
        data: { 
          lessonId: lesson?.id,
          playbackId,
          duration: playerRef.current.duration
        }
      })
      
      onStart?.()
    }
  }, [lesson, playbackId, onStart])

  const handlePlay = useCallback(() => {
    setPlaying(true)
    onPlay?.()
    scheduleHideControls()
    
    // Sentry performance tracking
    Sentry.addBreadcrumb({
      category: 'video',
      message: `Mux video play started: ${lesson?.title || playbackId}`,
      level: 'info',
      data: { lessonId: lesson?.id, playbackId, playedSeconds }
    })
  }, [onPlay, scheduleHideControls, lesson, playbackId, playedSeconds])

  const handlePause = useCallback(() => {
    setPlaying(false)
    onPause?.()
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current)
    }
  }, [onPause])

  const handleEnded = useCallback(() => {
    setPlaying(false)
    
    // Mark lesson as completed
    onLessonComplete?.()
    onEnded?.()
    
    // Track completion
    Sentry.addBreadcrumb({
      category: 'video',
      message: `Mux video completed: ${lesson?.title || playbackId}`,
      level: 'info',
      data: { 
        lessonId: lesson?.id,
        playbackId,
        totalWatchTime: playedSeconds,
        completionPercentage: played * 100
      }
    })
  }, [onLessonComplete, onEnded, lesson, playbackId, playedSeconds, played])

  // Generate playback token if needed
  const generatePlaybackToken = useCallback(async () => {
    try {
      const response = await fetch('/api/mux/playback-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          playbackId,
          userId: lesson?.id 
        })
      })
      
      if (response.ok) {
        const { token } = await response.json()
        setPlaybackTokens({ playback: token })
        return token
      }
    } catch (err) {
      console.error('Failed to generate playback token:', err)
    }
    return null
  }, [playbackId, lesson?.id])

  const handleError = useCallback(async (error: Event) => {
    let errorMessage = 'Error loading video'
    
    // Check if it's a 404/400 error (playback restrictions)
    if (error.type === 'error' && error.target) {
      const target = error.target as any
      if (target.error?.code === 4) {
        errorMessage = 'Playback ID not found. Please check your Mux configuration.'
      } else if (target.status === 400 || target.status === 403) {
        // Try to generate a playback token
        console.log('Playback restricted, attempting to generate token...')
        const token = await generatePlaybackToken()
        if (token) {
          // Token generated, component will re-render with new tokens
          return
        }
        errorMessage = 'Video playback restricted. Please check domain configuration in Mux settings.'
      }
    }
    
    setError(errorMessage)
    setIsLoading(false)
    
    Sentry.captureException(error, {
      tags: {
        component: 'MuxVideoPlayer',
        lessonId: lesson?.id,
        playbackId
      },
      extra: {
        playedSeconds,
        played,
        duration,
        errorMessage,
        hasTokens: !!playbackTokens
      }
    })
  }, [lesson, playbackId, playedSeconds, played, duration, playbackTokens, generatePlaybackToken])

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaybackSpeed(speed)
    if (playerRef.current) {
      playerRef.current.playbackRate = speed
    }
    setShowSettings(false)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target !== document.body) return
      
      switch (e.key) {
        case ' ':
          e.preventDefault()
          handlePlayPause()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handleSkip(-10)
          break
        case 'ArrowRight':
          e.preventDefault()
          handleSkip(10)
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handlePlayPause, handleSkip, toggleFullscreen, toggleMute])

  // Reset error when tokens change (retry with new tokens)
  useEffect(() => {
    if (playbackTokens && playbackTokens !== tokens) {
      setError(null)
      setIsLoading(true)
    }
  }, [playbackTokens, tokens])

  // Format time display
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

  if (error) {
    return (
      <div className={cn(
        "relative bg-black rounded-lg overflow-hidden flex items-center justify-center",
        className
      )}>
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠</span>
          </div>
          <p className="text-lg font-semibold mb-2">Erro ao carregar vídeo</p>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "relative bg-black rounded-lg overflow-hidden group",
        "shadow-2xl shadow-primary/20",
        className
      )}
      onMouseEnter={() => {
        setIsHovering(true)
        setShowControls(true)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        scheduleHideControls()
      }}
      onMouseMove={() => {
        setShowControls(true)
        scheduleHideControls()
      }}
    >
      {/* Mux Player */}
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        streamType={streamType}
        tokens={playbackTokens}
        customDomain={customDomain}
        poster={poster}
        muted={muted}
        autoPlay={false}
        style={{ 
          width: '100%', 
          height: '100%',
          aspectRatio: '16/9',
          '--controls': 'none'
        } as React.CSSProperties}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        onVolumeChange={(e) => {
          const target = e.target as HTMLMediaElement
          setVolume(target.volume)
          setMuted(target.muted)
        }}
        onRateChange={(e) => {
          const target = e.target as HTMLMediaElement
          setPlaybackSpeed(target.playbackRate)
        }}
        {...props}
      />

      {/* Custom Controls Overlay */}
      {controls && !isLoading && (
        <div 
          className={cn(
            "absolute inset-0 flex flex-col justify-end transition-opacity duration-300",
            showControls || !playing ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Progress Bar */}
          <div className="absolute bottom-16 left-0 right-0 px-4">
            <div className="relative">
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={played}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                         [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                         hover:[&::-webkit-slider-thumb]:scale-125"
                style={{
                  background: `linear-gradient(to right, #d400ff 0%, #d400ff ${played * 100}%, rgba(255,255,255,0.2) ${played * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>
          </div>

          {/* Control Bar */}
          <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
              >
                {playing ? (
                  <Pause className="w-5 h-5 text-white" weight="fill" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" weight="fill" />
                )}
              </button>

              {/* Skip buttons */}
              <button
                onClick={() => handleSkip(-10)}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
              >
                <SkipBack className="w-4 h-4 text-white" weight="fill" />
              </button>
              
              <button
                onClick={() => handleSkip(10)}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
              >
                <SkipForward className="w-4 h-4 text-white" weight="fill" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="hover:bg-white/10 p-1 rounded transition-colors">
                  {muted || volume === 0 ? (
                    <SpeakerSlash className="w-4 h-4 text-white" />
                  ) : (
                    <SpeakerHigh className="w-4 h-4 text-white" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                           [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* Time */}
              <span className="text-sm text-white font-mono">
                {formatTime(playedSeconds)} / {formatTime(duration)}
              </span>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Speed Control */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors"
                >
                  <Gear className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">{playbackSpeed}x</span>
                </button>
                
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[120px]">
                    <div className="text-xs text-white/60 mb-2">Velocidade</div>
                    {playbackRates.map(rate => (
                      <button
                        key={rate}
                        onClick={() => handleSpeedChange(rate)}
                        className={cn(
                          "block w-full text-left px-2 py-1 rounded text-sm transition-colors",
                          playbackSpeed === rate ? "bg-primary text-white" : "text-white/80 hover:bg-white/10"
                        )}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center justify-center w-8 h-8 rounded hover:bg-white/10 transition-colors"
              >
                <CornersOut className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-white/60">Carregando vídeo...</p>
          </div>
        </div>
      )}
    </div>
  )
}