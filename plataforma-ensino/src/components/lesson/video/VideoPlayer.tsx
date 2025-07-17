'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { VideoData } from '@/types/lesson'

interface VideoPlayerProps {
  video: VideoData
  className?: string
  onProgressUpdate?: (currentTime: number, duration: number) => void
  onComplete?: () => void
  autoSaveInterval?: number
  startTime?: number
}

// Helper functions for YouTube URLs
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

const convertToEmbedUrl = (url: string): string => {
  // If already embed URL, return as is
  if (url.includes('/embed/')) return url
  
  // Extract video ID from various YouTube URL formats
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  const videoId = videoIdMatch ? videoIdMatch[1] : null
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : 'https://plataformahabilidade.netlify.app'}`
  }
  
  return url
}

/**
 * VideoPlayer - Enhanced video player component
 * Part of Fase 2: Desenvolvimento de Componentes (2.2)
 * 
 * Features:
 * - Custom HTML5 player with brand colors
 * - Progress tracking and auto-save
 * - Playback speed controls (0.5x to 2x)
 * - Keyboard shortcuts
 * - Fullscreen support
 * - Loading states and animations
 */
export function VideoPlayer({ 
  video, 
  className, 
  onProgressUpdate,
  onComplete,
  autoSaveInterval = 5000,
  startTime = 0
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Determine if this is a YouTube video
  const isYouTube = isYouTubeUrl(video.url)
  const embedUrl = isYouTube ? convertToEmbedUrl(video.url) : video.url

  // Calculate responsive dimensions
  const aspectRatio = video.aspectRatio || 16/9
  const aspectRatioPercent = (1 / aspectRatio) * 100

  // Player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(startTime)
  const [duration, setDuration] = useState(video.duration || 0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(!isYouTube) // Hide custom controls for YouTube
  const [isLoading, setIsLoading] = useState(true)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [hasManuallyStarted, setHasManuallyStarted] = useState(false) // Track if user manually started video
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false) // Track actual YouTube play state
  const [hasLoadingError, setHasLoadingError] = useState(false)
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  // Control visibility timer
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-save timer
  const autoSaveRef = useRef<NodeJS.Timeout>()
  
  // Progress tracking interval for YouTube
  const progressIntervalRef = useRef<NodeJS.Timeout>()
  
  // Loading timeout for YouTube
  const loadingTimeoutRef = useRef<NodeJS.Timeout>()

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  // Auto-save progress
  useEffect(() => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    
    autoSaveRef.current = setTimeout(() => {
      if (onProgressUpdate && currentTime > 0) {
        onProgressUpdate(currentTime, duration)
      }
    }, autoSaveInterval)

    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    }
  }, [currentTime, duration, onProgressUpdate, autoSaveInterval])

  // Check for completion (80% threshold)
  useEffect(() => {
    if (duration > 0 && progressPercentage >= 80 && !hasCompleted) {
      setHasCompleted(true)
      onComplete?.()
    }
  }, [progressPercentage, duration, hasCompleted, onComplete])

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      videoRef.current.currentTime = startTime
      setIsLoading(false)
    }
  }

  // YouTube iframe loaded handler
  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasLoadingError(false)
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }
    // Don't start progress tracking automatically - wait for user to manually start
  }
  
  // Retry loading
  const retryLoading = () => {
    setIsLoading(true)
    setHasLoadingError(false)
    setLoadingTimeout(false)
    
    // Reset timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }
    
    // Force iframe reload by updating src
    if (iframeRef.current && isYouTube) {
      const currentSrc = iframeRef.current.src
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc
        }
      }, 100)
    }
    
    // Start new timeout
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false)
      setHasLoadingError(true)
      setLoadingTimeout(true)
    }, 15000) // 15 second timeout
  }

  // Manual play handler for YouTube videos
  const handleManualPlay = () => {
    const wasManuallyStarted = hasManuallyStarted
    setHasManuallyStarted(true)
    setIsPlaying(true)
    setIsActuallyPlaying(true)
    
    // Start progress tracking simulation only when user manually plays for the first time
    if (onProgressUpdate && !wasManuallyStarted) {
      // Use actual video duration or reasonable fallback
      const videoDuration = video.duration || 1200 // Default to 20 minutes if no duration
      setDuration(videoDuration)
      
      // Start progress tracking that only counts when actually playing
      startYouTubeProgressTracking(videoDuration)
      
      // Initial progress update
      onProgressUpdate(0, videoDuration)
    }
  }
  
  // YouTube progress tracking that respects play/pause state
  const startYouTubeProgressTracking = (videoDuration: number) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    
    progressIntervalRef.current = setInterval(() => {
      // Only increment time if video is actually playing
      if (isActuallyPlaying && hasManuallyStarted) {
        setCurrentTime(prev => {
          const newTime = prev + 1 // Increment by 1 second for smoother progress
          
          if (newTime >= videoDuration * 0.8) {
            // Mark as completed when 80% watched
            setHasCompleted(true)
            onComplete?.()
            clearInterval(progressIntervalRef.current!)
            return videoDuration * 0.8
          }
          
          // Update progress every 5 seconds to avoid too frequent updates
          if (Math.floor(newTime) % 5 === 0) {
            onProgressUpdate?.(newTime, videoDuration)
          }
          
          return newTime
        })
      }
    }, 1000) // Check every second
  }
  
  // Toggle YouTube play/pause simulation
  const toggleYouTubePlayback = () => {
    if (hasManuallyStarted) {
      setIsActuallyPlaying(prev => !prev)
      setIsPlaying(prev => !prev)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)

  // Control functions
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }, [isPlaying])

  const handleSeek = useCallback((percentage: number) => {
    if (videoRef.current && duration > 0) {
      const newTime = (percentage / 100) * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }, [duration])

  const changePlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted
      videoRef.current.muted = newMuted
      setIsMuted(newMuted)
    }
  }, [isMuted])

  const changeVolume = useCallback((newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Show/hide controls
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }, [isPlaying])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handleSeek(Math.max(0, progressPercentage - 5))
          break
        case 'ArrowRight':
          e.preventDefault()
          handleSeek(Math.min(100, progressPercentage + 5))
          break
        case 'KeyM':
          e.preventDefault()
          toggleMute()
          break
        case 'KeyF':
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, handleSeek, progressPercentage, toggleMute, toggleFullscreen])
  
  // Loading timeout effect for YouTube videos
  useEffect(() => {
    if (isYouTube && isLoading) {
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        setHasLoadingError(true)
        setLoadingTimeout(true)
      }, 15000) // 15 second timeout
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [isYouTube, isLoading])
  
  // Cleanup YouTube progress interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [])

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'video-player relative rounded-lg overflow-hidden bg-black group',
        'hover:shadow-[0_0_30px_rgba(212,0,255,0.3)] transition-shadow duration-300',
        // Responsive sizing with aspect ratio
        'w-full',
        'min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px]',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      style={{
        aspectRatio: aspectRatio,
        maxHeight: isFullscreen ? '100vh' : '80vh'
      }}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => setShowControls(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video Element or YouTube Iframe */}
      {isYouTube ? (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={() => {
            setIsLoading(false)
            setHasLoadingError(true)
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current)
            }
          }}
          style={{ 
            border: 'none',
            minHeight: '100%'
          }}
          title="YouTube video player"
        />
      ) : (
        <video
          ref={videoRef}
          src={embedUrl}
          poster={video.thumbnail}
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          playsInline
        />
      )}

      {/* Loading Overlay */}
      <AnimatePresence>
        {(isLoading || hasLoadingError) && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center text-white">
              {!hasLoadingError ? (
                <>
                  <motion.div
                    className={cn(
                      "w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4",
                      isYouTube ? "border-red-500" : "border-purple-500"
                    )}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-lg font-medium">
                    {isYouTube ? "Carregando YouTube..." : "Carregando vídeo..."}
                  </p>
                  {isYouTube && (
                    <p className="text-sm text-gray-300 mt-2">
                      Conectando com YouTube Player
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-lg font-medium mb-2">
                    Erro ao carregar vídeo
                  </p>
                  <p className="text-sm text-gray-300 mb-4">
                    {isYouTube 
                      ? "Não foi possível conectar com o YouTube. Verifique sua conexão."
                      : "Não foi possível carregar o vídeo. Tente novamente."
                    }
                  </p>
                  <motion.button
                    onClick={retryLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔄 Tentar Novamente
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play Button Overlay - Only for non-YouTube videos */}
      <AnimatePresence>
        {!isYouTube && !isPlaying && !isLoading && (
          <motion.button
            className="absolute inset-0 flex items-center justify-center bg-black/30 text-white"
            onClick={togglePlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Manual Play Button Overlay for YouTube videos */}
      <AnimatePresence>
        {isYouTube && !hasManuallyStarted && !isLoading && (
          <motion.button
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white"
            onClick={handleManualPlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent ml-1" />
              </div>
              <p className="text-xl font-medium">Clique para iniciar o vídeo</p>
              <p className="text-sm text-gray-300 mt-2">O progresso será rastreado apenas enquanto o vídeo estiver em reprodução</p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Controls - Only for non-YouTube videos */}
      <AnimatePresence>
        {!isYouTube && showControls && !isLoading && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress Bar */}
            <div
              ref={progressRef}
              className="w-full h-2 bg-white/20 rounded-full mb-3 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const percentage = ((e.clientX - rect.left) / rect.width) * 100
                handleSeek(percentage)
              }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative"
                style={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.1 }}
              >
                <div className="absolute right-0 top-1/2 w-4 h-4 bg-white rounded-full transform -translate-y-1/2 translate-x-1/2 shadow-lg" />
              </motion.div>
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <div className="w-2 h-4 bg-white mr-1"></div>
                  ) : (
                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                  )}
                  <div className="w-2 h-4 bg-white ml-1"></div>
                </button>

                {/* Time */}
                <span className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <button onClick={toggleMute} className="p-1">
                    {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                    className="w-16 h-1 bg-white/20 rounded-full appearance-none slider"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Playback Speed */}
                <select
                  value={playbackRate}
                  onChange={(e) => changePlaybackRate(Number(e.target.value))}
                  className="bg-white/20 text-white text-sm rounded px-2 py-1 border-none outline-none"
                >
                  {playbackRates.map(rate => (
                    <option key={rate} value={rate} className="bg-black">
                      {rate}x
                    </option>
                  ))}
                </select>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
                >
                  {isFullscreen ? '⛶' : '⛶'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Badge */}
      <AnimatePresence>
        {hasCompleted && (
          <motion.div
            className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            ✅ Concluído
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Video Info & Controls */}
      {isYouTube && !isLoading && (
        <>
          <motion.div 
            className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <span>📺</span>
            <span>YouTube</span>
          </motion.div>
          
          {/* YouTube Progress Control */}
          {hasManuallyStarted && (
            <motion.div 
              className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-3 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <button
                onClick={toggleYouTubePlayback}
                className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
                title={isActuallyPlaying ? "Pausar rastreamento" : "Retomar rastreamento"}
              >
                {isActuallyPlaying ? (
                  <>
                    <span>⏸️</span>
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <span>▶️</span>
                    <span>Retomar</span>
                  </>
                )}
              </button>
              <div className="text-xs text-gray-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Aspect Ratio Fallback for older browsers */}
      {!isFullscreen && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            paddingTop: `${aspectRatioPercent}%`,
            display: 'block'
          }}
        />
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d400ff;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d400ff;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </motion.div>
  )
}