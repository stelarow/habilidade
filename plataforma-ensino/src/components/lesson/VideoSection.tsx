'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, AlertCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { extractVimeoId, formatTime, LessonProgressManager } from '@/utils/lessonProgressUtils'

// Dynamic import for ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface VideoSectionProps {
  videoTitle: string
  videoDescription?: string
  videoUrl?: string
  lessonId?: string
  onProgressUpdate?: (progress: number) => void
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
  
  const playerRef = useRef<any>(null)
  const progressManagerRef = useRef<LessonProgressManager | null>(null)

  // Initialize progress manager
  useEffect(() => {
    progressManagerRef.current = new LessonProgressManager(lessonId)
    
    // Load saved progress
    const savedProgress = progressManagerRef.current.getProgress()
    setProgress(savedProgress.videoProgress)
  }, [lessonId])

  // Extract Vimeo ID and create player URL
  const vimeoId = extractVimeoId(videoUrl)
  const playerUrl = vimeoId ? `https://vimeo.com/${vimeoId}` : videoUrl

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
      onProgressUpdate(newProgress)
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
        
        {typeof window !== 'undefined' && (
          <ReactPlayer
            ref={playerRef}
            url={playerUrl}
            width="100%"
            height="100%"
            playing={isPlaying}
            onReady={handleReady}
            onError={handleError}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onPlay={handlePlay}
            onPause={handlePause}
            controls={false}
            config={{
              vimeo: {
                playerOptions: {
                  responsive: true,
                  controls: false,
                  title: false,
                  byline: false,
                  portrait: false
                }
              }
            } as any}
          />
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
        
        {/* Custom controls overlay */}
        {isReady && !error && (
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
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Descrição da Aula</h3>
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
        </div>
      </div>
    </Card>
  )
}

export default VideoSection