'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, AlertCircle, Copy, Check } from 'lucide-react'
import dynamic from 'next/dynamic'
import { extractVimeoId, formatTime, LessonProgressManager } from '@/utils/lessonProgressUtils'

// Dynamic import for ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface VideoSectionProps {
  videoTitle: string
  videoDescription?: string
  videoUrl?: string
  lessonId?: string
  onProgressUpdate?: (progress: number, currentTime?: number, duration?: number) => void
}

const VideoSection: React.FC<VideoSectionProps> = ({
  videoTitle,
  videoDescription,
  videoUrl = "https://vimeo.com/76979871", // Default test URL - public Vimeo URL
  lessonId = "test-lesson",
  onProgressUpdate
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  
  const playerRef = useRef<any>(null)
  const vimeoPlayerRef = useRef<any>(null)
  const progressManagerRef = useRef<LessonProgressManager | null>(null)

  // Extract Vimeo ID from URL like "https://vimeo.com/1095312387/8519cef8f3?share=copy"
  const extractVimeoIdFromUrl = (url: string): { id: string, hash?: string } | null => {
    const match = url.match(/vimeo\.com\/(\d+)(?:\/([a-z0-9]+))?/i)
    if (match) {
      return {
        id: match[1],
        hash: match[2]
      }
    }
    return null
  }

  const vimeoData = extractVimeoIdFromUrl(videoUrl)
  const vimeoEmbedUrl = vimeoData 
    ? `https://player.vimeo.com/video/${vimeoData.id}${vimeoData.hash ? `?h=${vimeoData.hash}` : ''}` 
    : null

  // Initialize progress manager
  useEffect(() => {
    progressManagerRef.current = new LessonProgressManager(lessonId)
    
    // Load saved progress
    const savedProgress = progressManagerRef.current.getProgress()
    setProgress(savedProgress.videoProgress)
  }, [lessonId])

  // Load Vimeo player script and initialize player for iframe videos
  useEffect(() => {
    if (vimeoEmbedUrl && !document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://player.vimeo.com/api/player.js'
      script.async = true
      script.onload = () => {
        // Script loaded, initialize player when iframe is ready
        setTimeout(initializeVimeoPlayer, 1000)
      }
      document.head.appendChild(script)
    } else if (vimeoEmbedUrl && window.Vimeo) {
      // Script already loaded, initialize player
      setTimeout(initializeVimeoPlayer, 1000)
    }
  }, [vimeoEmbedUrl])

  // Initialize Vimeo Player API for progress tracking
  const initializeVimeoPlayer = () => {
    if (!vimeoEmbedUrl || !window.Vimeo) return

    const iframe = document.querySelector('iframe[src*="player.vimeo.com"]') as HTMLIFrameElement
    if (!iframe) return

    try {
      const player = new window.Vimeo.Player(iframe)
      vimeoPlayerRef.current = player

      // Get video duration
      player.getDuration().then((duration: number) => {
        setDuration(duration)
        if (onProgressUpdate) {
          onProgressUpdate(0, 0, duration)
        }
      }).catch((error: any) => {
        console.error('Error getting Vimeo duration:', error)
      })

      // Track progress
      player.on('timeupdate', (data: { seconds: number, duration: number }) => {
        const currentTime = data.seconds
        const videoDuration = data.duration
        const progressPercent = (currentTime / videoDuration) * 100

        setCurrentTime(currentTime)
        setProgress(progressPercent)
        setDuration(videoDuration)

        // Save progress
        if (progressManagerRef.current && videoDuration > 0) {
          progressManagerRef.current.updateVideoProgress(currentTime, videoDuration)
        }

        // Call progress update callback
        if (onProgressUpdate) {
          onProgressUpdate(progressPercent, currentTime, videoDuration)
        }
      })

      // Track play/pause
      player.on('play', () => {
        setIsPlaying(true)
      })

      player.on('pause', () => {
        setIsPlaying(false)
      })

      // Track when video is ready
      player.on('loaded', () => {
        setIsReady(true)
        setIsLoading(false)
        setError(null)
      })

    } catch (error) {
      console.error('Error initializing Vimeo player:', error)
      setError('Erro ao inicializar player do Vimeo')
    }
  }

  const handleReady = () => {
    setIsReady(true)
    setIsLoading(false)
    setError(null)
    
    // Get duration when ready
    if (playerRef.current) {
      const videoDuration = playerRef.current.getDuration()
      setDuration(videoDuration)
    }
  }

  const handleError = (error: any) => {
    console.error('Video player error:', error)
    setError('Erro ao carregar o vídeo. Verifique a URL ou tente novamente.')
    setIsLoading(false)
  }

  const handleProgress = (state: { played: number, playedSeconds: number }) => {
    const newProgress = state.played * 100
    const newCurrentTime = state.playedSeconds
    
    setCurrentTime(newCurrentTime)
    setProgress(newProgress)
    
    // Save progress
    if (progressManagerRef.current && duration > 0) {
      progressManagerRef.current.updateVideoProgress(newCurrentTime, duration)
    }
    
    // Call progress update callback
    if (onProgressUpdate) {
      onProgressUpdate(newProgress, newCurrentTime, duration)
    }
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        setIsPlaying(false)
      } else {
        setIsPlaying(true)
      }
    }
  }

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !isReady) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickProgress = clickX / rect.width
    
    playerRef.current.seekTo(clickProgress, 'fraction')
  }

  const handleCopyDescription = async () => {
    const textToCopy = videoDescription || 
      "Nesta aula você aprenderá os conceitos fundamentais do design, incluindo " +
      "princípios básicos, teoria das cores e composição visual. O conteúdo aborda " +
      "desde conceitos teóricos até aplicações práticas no desenvolvimento de projetos."
    
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = textToCopy
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <Card className="p-6 border-border/50">
      <h2 className="text-2xl font-bold mb-4 gradient-text">{videoTitle}</h2>
      
      <div className="aspect-video bg-black rounded-lg mb-4 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Carregando vídeo...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-white text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {vimeoEmbedUrl ? (
          <div className="relative w-full h-full">
            <iframe 
              src={`${vimeoEmbedUrl}&badge=0&autopause=0&player_id=0&app_id=58479`}
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute top-0 left-0 w-full h-full"
              title={videoTitle}
              onLoad={() => {
                setIsLoading(false)
                setIsReady(true)
              }}
              onError={() => {
                setError('Erro ao carregar o vídeo')
                setIsLoading(false)
              }}
            />
          </div>
        ) : (
          typeof window !== 'undefined' && (
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              width="100%"
              height="100%"
              playing={isPlaying}
              onReady={handleReady}
              onError={handleError}
              onProgress={handleProgress}
              onDuration={handleDuration}
              onPlay={handlePlay}
              onPause={handlePause}
              controls={true}
              config={{
                vimeo: {
                  playerOptions: {
                    responsive: true,
                    controls: true,
                    title: false,
                    byline: false,
                    portrait: false
                  }
                }
              } as any}
            />
          )
        )}
        
        {/* SSR placeholder */}
        {typeof window === 'undefined' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Carregando player...</p>
            </div>
          </div>
        )}
        
        {/* Custom controls overlay - commented out to use native Vimeo controls */}
        {/* {isReady && !error && (
          <>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={handlePlayPause}
                className="bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-4 text-white">
                <span className="text-sm">{formatTime(currentTime)}</span>
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={handleSeek}
                >
                  <Progress 
                    value={progress} 
                    className="h-2 bg-white/20"
                  />
                </div>
                <span className="text-sm">{formatTime(duration)}</span>
              </div>
            </div>
          </>
        )} */}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Descrição da Aula</h3>
          <button
            onClick={handleCopyDescription}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
            title="Copiar descrição"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
        <p className="text-muted-foreground">
          {videoDescription || 
            "Nesta aula você aprenderá os conceitos fundamentais do design, incluindo " +
            "princípios básicos, teoria das cores e composição visual. O conteúdo aborda " +
            "desde conceitos teóricos até aplicações práticas no desenvolvimento de projetos."
          }
        </p>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Progresso do vídeo:</span>
          <span className="font-medium">{Math.round(progress)}%</span>
          {vimeoEmbedUrl && (
            <span className="text-xs text-green-500">
              (Vimeo {isReady ? '✓' : '⏳'})
            </span>
          )}
          {duration > 0 && (
            <span className="text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

export default VideoSection