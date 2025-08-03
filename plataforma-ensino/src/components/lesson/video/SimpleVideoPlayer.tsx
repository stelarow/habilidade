'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Play, Lightbulb } from '@phosphor-icons/react'
import type { VideoData } from '@/types/lesson'

interface SimpleVideoPlayerProps {
  video: VideoData
  className?: string
}

// Helper functions for YouTube URLs
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

const convertToEmbedUrl = (url: string): string => {
  // If already embed URL, return as is
  if (url.includes('/embed/')) return url
  
  // Extract video ID from YouTube URLs using simpler regex patterns
  let videoId: string | null = null
  
  // Standard YouTube URL (youtube.com/watch?v=VIDEO_ID)
  if (url.includes('youtube.com/watch')) {
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
    videoId = match ? match[1] : null
  }
  
  // Short YouTube URL (youtu.be/VIDEO_ID)
  else if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
    videoId = match ? match[1] : null
  }
  
  // YouTube embed URL (youtube.com/embed/VIDEO_ID)
  else if (url.includes('youtube.com/embed/')) {
    const match = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/)
    videoId = match ? match[1] : null
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
  }
  
  return url
}

/**
 * SimpleVideoPlayer - Clean YouTube embed without progress tracking
 * 
 * Features:
 * - Clean YouTube iframe embed
 * - No custom controls or progress tracking
 * - Responsive aspect ratio
 * - Focus on content consumption
 * - No interference with lesson completion logic
 */
export function SimpleVideoPlayer({ video, className }: SimpleVideoPlayerProps) {
  // Determine if this is a YouTube video
  const isYouTube = isYouTubeUrl(video.url)
  const embedUrl = isYouTube ? convertToEmbedUrl(video.url) : video.url

  // Calculate responsive dimensions
  const aspectRatio = video.aspectRatio || 16/9

  return (
    <motion.div
      className={cn(
        'simple-video-player relative rounded-lg overflow-hidden bg-black',
        'w-full',
        'min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px]',
        className
      )}
      style={{
        aspectRatio: aspectRatio,
        maxHeight: '80vh'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video Section Header */}
      <div className="absolute top-4 left-4 z-10">
        <motion.div 
          className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Play size={16} weight="duotone" style={{ color: '#d400ff' }} />
          <span>Vídeo da Aula</span>
        </motion.div>
      </div>

      {/* YouTube Embed or Regular Video */}
      {isYouTube ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          style={{ 
            border: 'none',
            minHeight: '100%'
          }}
          title="Vídeo da aula"
        />
      ) : (
        <video
          src={embedUrl}
          poster={video.thumbnail}
          className="absolute inset-0 w-full h-full object-cover"
          controls
          playsInline
        />
      )}

      {/* Educational Note */}
      <div className="absolute bottom-4 right-4 z-10">
        <motion.div 
          className="bg-blue-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Lightbulb size={12} weight="duotone" style={{ color: '#00c4ff' }} />
          <span>Assista com atenção</span>
        </motion.div>
      </div>
    </motion.div>
  )
}