'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, Volume2, Maximize } from 'lucide-react'

interface VideoSectionProps {
  videoTitle: string
  videoDescription?: string
  onProgressUpdate?: (progress: number) => void
}

const VideoSection: React.FC<VideoSectionProps> = ({
  videoTitle,
  videoDescription,
  onProgressUpdate
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(300) // 5 minutes simulation
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Video simulation logic with useEffect
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1
          const newProgress = (newTime / duration) * 100
          
          setProgress(newProgress)
          
          // Call progress update callback
          if (onProgressUpdate) {
            onProgressUpdate(newProgress)
          }
          
          // Auto-pause when video ends
          if (newTime >= duration) {
            setIsPlaying(false)
            return duration
          }
          
          return newTime
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, duration, onProgressUpdate])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickProgress = (clickX / rect.width) * 100
    const newTime = (clickProgress / 100) * duration
    
    setCurrentTime(newTime)
    setProgress(clickProgress)
    
    if (onProgressUpdate) {
      onProgressUpdate(clickProgress)
    }
  }

  return (
    <Card className="p-6 border-border/50">
      <h2 className="text-2xl font-bold mb-4 gradient-text">{videoTitle}</h2>
      
      <div className="aspect-video bg-black rounded-lg mb-4 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePlayPause}
            className="bg-black/50 hover:bg-black/70 text-white hover:gradient-button"
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-4 text-white">
            <span>{formatTime(currentTime)}</span>
            <Progress value={(currentTime / duration) * 100} className="flex-1" />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
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
      </div>
    </Card>
  )
}

export default VideoSection