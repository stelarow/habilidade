'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, SkipBack, SkipForward, SpeakerHigh, SpeakerSlash, CornersOut, Gear } from 'phosphor-react'
import * as Sentry from '@sentry/nextjs'
import { VideoPlayerProps, VideoProgress } from '@/types'
import { cn } from '@/lib/utils'
import { validateAndFormatYouTubeUrl } from '@/lib/youtube-utils'

interface CustomVideoPlayerProps extends VideoPlayerProps {
  onProgressUpdate?: (progress: VideoProgress) => void
  onLessonComplete?: () => void
  onReady?: (player: any) => void
  onError?: (error: any) => void
  lesson?: {
    id: string
    title: string
    video_duration: number
  }
  className?: string
  autoSave?: boolean
  autoSaveInterval?: number
}

export default function VideoPlayer({
  url,
  poster,
  onProgress,
  onProgressUpdate,
  onLessonComplete,
  onReady,
  onEnded,
  onStart,
  onPause,
  onPlay,
  onError,
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
  ...props
}: CustomVideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null)
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
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
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  
  const hideControlsTimeout = useRef<NodeJS.Timeout>()
  const autoSaveTimeout = useRef<NodeJS.Timeout>()
  const progressUpdateRef = useRef<VideoProgress>({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0
  })

  // Validate YouTube URL on mount
  useEffect(() => {
    if (url) {
      // Reset ready state when URL changes
      setIsVideoReady(false)
      
      const validation = validateAndFormatYouTubeUrl(url)
      if (!validation.isValid) {
        setVideoError(validation.error || 'Invalid video URL')
        console.error('Invalid YouTube URL:', url, validation.error)
      } else {
        setVideoError(null)
      }
    }
  }, [url])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
      }
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current)
      }
    }
  }, [])

  // Handle postMessage errors from YouTube and prevent DOM errors
  useEffect(() => {
    const handlePostMessageError = (event: MessageEvent) => {
      // Filter out YouTube postMessage errors to prevent console spam
      if (event.source && event.origin.includes('youtube.com')) {
        // These are expected YouTube iframe communications, ignore them
        return
      }
    }

    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message && (
        event.message.includes('postMessage') ||
        event.message.includes('removeChild') ||
        event.message.includes('Cannot read properties of null')
      )) {
        // Suppress common YouTube and React DOM errors
        event.preventDefault()
        console.warn('Suppressed video player error:', event.message)
        return false
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.toString().includes('postMessage')) {
        // Suppress YouTube postMessage promise rejections
        event.preventDefault()
        console.warn('Suppressed YouTube postMessage rejection:', event.reason)
      }
    }

    window.addEventListener('message', handlePostMessageError)
    window.addEventListener('error', handleGlobalError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('message', handlePostMessageError)
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

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

  // Handle progress updates
  const handleProgress = useCallback((state: VideoProgress) => {
    if (!seeking) {
      setPlayed(state.played)
      setLoaded(state.loaded)
      setPlayedSeconds(state.playedSeconds)
      
      progressUpdateRef.current = state
      
      // Auto-save progress
      if (autoSave && lesson && Math.abs(state.playedSeconds - lastSavedProgress) >= autoSaveInterval / 1000) {
        setLastSavedProgress(state.playedSeconds)
        onProgressUpdate?.(state)
      }
      
      // Call external progress handler
      onProgress?.(state)
      
      // Check for lesson completion (90% watched)
      if (state.played >= 0.9 && lesson && !seeking) {
        onLessonComplete?.()
      }
    }
  }, [seeking, autoSave, lesson, lastSavedProgress, autoSaveInterval, onProgress, onProgressUpdate, onLessonComplete])

  // Handle seeking
  const handleSeekChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSeeking(true)
    const newPlayed = parseFloat(e.target.value)
    setPlayed(newPlayed)
    setPlayedSeconds(newPlayed * duration)
  }, [duration])

  const handleSeekMouseUp = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    try {
      setSeeking(false)
      const newPlayed = parseFloat((e.target as HTMLInputElement).value)
      if (playerRef.current && !isNaN(newPlayed)) {
        playerRef.current.seekTo(newPlayed, 'fraction')
      }
    } catch (error) {
      console.warn('Error in handleSeekMouseUp:', error)
      setSeeking(false)
    }
  }, [])

  // Playback controls
  const handlePlayPause = useCallback(() => {
    try {
      // Clear any previous error states
      setVideoError(null)
      
      const newPlaying = !playing
      setPlaying(newPlaying)
      
      if (newPlaying) {
        onPlay?.()
        scheduleHideControls()
        
        // Sentry performance tracking
        Sentry.addBreadcrumb({
          category: 'video',
          message: `Video play started: ${lesson?.title || url}`,
          level: 'info',
          data: { lessonId: lesson?.id, playedSeconds }
        })
      } else {
        onPause?.()
        if (hideControlsTimeout.current) {
          clearTimeout(hideControlsTimeout.current)
        }
      }
    } catch (error) {
      console.warn('Error in handlePlayPause:', error)
      setVideoError('Erro ao controlar reprodução do vídeo')
    }
  }, [playing, onPlay, onPause, scheduleHideControls, lesson, url, playedSeconds])

  const handleSkip = useCallback((seconds: number) => {
    try {
      if (!playerRef.current) return
      
      const currentTime = playerRef.current.getCurrentTime() || 0
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
      playerRef.current.seekTo(newTime, 'seconds')
    } catch (error) {
      console.warn('Error in handleSkip:', error)
    }
  }, [duration])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setMuted(newVolume === 0)
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(!muted)
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

  const handleReady = useCallback((player: ReactPlayer) => {
    // Mark video as ready - this will hide the loading spinner
    setIsVideoReady(true)
    
    // Track video ready event
    Sentry.addBreadcrumb({
      category: 'video',
      message: `Video ready: ${lesson?.title || url}`,
      level: 'info',
      data: { lessonId: lesson?.id }
    })
    
    onStart?.()
    onReady?.(player)
  }, [lesson, url, onStart, onReady])

  const handleEnded = useCallback(() => {
    setPlaying(false)
    
    // Mark lesson as completed
    onLessonComplete?.()
    onEnded?.()
    
    // Track completion
    Sentry.addBreadcrumb({
      category: 'video',
      message: `Video completed: ${lesson?.title || url}`,
      level: 'info',
      data: { 
        lessonId: lesson?.id, 
        totalWatchTime: playedSeconds,
        completionPercentage: played * 100
      }
    })
  }, [onLessonComplete, onEnded, lesson, url, playedSeconds, played])

  const handleError = useCallback((error: any) => {
    // Set user-friendly error message
    if (error?.message?.includes('Invalid video id')) {
      setVideoError('Este vídeo não está disponível ou foi removido do YouTube.')
    } else if (error?.message?.includes('postMessage')) {
      setVideoError('Erro de comunicação com o YouTube. Recarregue a página.')
    } else {
      setVideoError('Erro ao carregar o vídeo. Tente novamente mais tarde.')
    }
    
    // Reset states to prevent React DOM errors
    setPlaying(false)
    setIsVideoReady(false)
    
    Sentry.captureException(error, {
      tags: {
        component: 'VideoPlayer',
        lessonId: lesson?.id,
        videoUrl: url
      },
      extra: {
        playedSeconds,
        played,
        duration,
        errorMessage: error?.message
      }
    })
    
    // Call external error handler
    onError?.(error)
  }, [lesson, url, playedSeconds, played, duration, onError])

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

  // Wrap entire component in error boundary
  try {
    return (
      <div 
        className={cn(
          "relative bg-black rounded-lg overflow-hidden group",
          "shadow-2xl shadow-primary/20",
          className
        )}
        onMouseEnter={() => {
          try {
            setIsHovering(true)
            setShowControls(true)
          } catch (error) {
            console.warn('Error in onMouseEnter:', error)
          }
        }}
        onMouseLeave={() => {
          try {
            setIsHovering(false)
            scheduleHideControls()
          } catch (error) {
            console.warn('Error in onMouseLeave:', error)
          }
        }}
        onMouseMove={() => {
          try {
            setShowControls(true)
            scheduleHideControls()
          } catch (error) {
            console.warn('Error in onMouseMove:', error)
          }
        }}
      >
      {/* React Player */}
      <ReactPlayer
        ref={playerRef}
        url={url}
        width={width}
        height={height}
        playing={externalPlaying !== undefined ? externalPlaying : playing}
        volume={muted ? 0 : volume}
        playbackRate={playbackSpeed}
        onProgress={handleProgress}
        onDuration={setDuration}
        onReady={handleReady}
        onStart={() => {
          setPlaying(true)
          setIsVideoReady(true)
        }}
        onPause={() => setPlaying(false)}
        onEnded={handleEnded}
        onError={handleError}
        light={poster}
        controls={false}
        onClickPreview={handlePlayPause}
        config={{
          youtube: {
            playerVars: {
              showinfo: 0,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              origin: typeof window !== 'undefined' ? window.location.origin : 'https://plataformahabilidade.netlify.app',
              // Additional params to reduce postMessage errors
              enablejsapi: 1,
              widgetid: 1
            }
          },
          vimeo: {
            playerOptions: {
              controls: false,
              title: false,
              byline: false,
              portrait: false
            }
          }
        }}
        {...props}
      />

      {/* Custom Controls Overlay */}
      {controls && (
        <div 
          className={cn(
            "absolute inset-0 flex flex-col justify-end transition-opacity duration-300",
            playing ? (showControls ? "opacity-100" : "opacity-0 pointer-events-none") : "opacity-0 pointer-events-none"
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
              {/* Loaded progress */}
              <div 
                className="absolute top-0 left-0 h-1 bg-white/40 rounded-full pointer-events-none"
                style={{ width: `${loaded * 100}%` }}
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
                        onClick={() => {
                          setPlaybackSpeed(rate)
                          setShowSettings(false)
                        }}
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

      {/* Error Display */}
      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Erro no Vídeo</h3>
            <p className="text-gray-300 text-sm mb-4">{videoError}</p>
            <button
              onClick={() => {
                setVideoError(null)
                setIsVideoReady(false)
                playerRef.current?.seekTo(0)
              }}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {!isVideoReady && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
  } catch (error) {
    // Fallback UI if component crashes
    console.error('VideoPlayer crashed:', error)
    return (
      <div className={cn(
        "relative bg-black rounded-lg overflow-hidden",
        "shadow-2xl shadow-primary/20",
        "flex items-center justify-center min-h-[200px]",
        className
      )}>
        <div className="text-center text-white p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Erro no Player</h3>
          <p className="text-gray-300 text-sm mb-4">O player de vídeo encontrou um erro crítico.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    )
  }
}