'use client'

import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import DOMPurify from 'dompurify'
import { cn } from '@/lib/utils'

// Import ReactPlayer dinamicamente para evitar problemas de SSR
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-gray-100 aspect-video">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )
})

export interface VideoTrack {
  kind: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata'
  src: string
  srcLang: string
  label?: string
  default?: boolean
}

export interface VideoPlayerProps {
  url: string
  tracks?: VideoTrack[]
  className?: string
  light?: boolean | string
  playing?: boolean
  loop?: boolean
  controls?: boolean
  volume?: number
  muted?: boolean
  playbackRate?: number
  width?: string | number
  height?: string | number
  pip?: boolean
  playsInline?: boolean
  onReady?: (player: any) => void
  onStart?: () => void
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onError?: (error: any) => void
  onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void
  onDuration?: (duration: number) => void
  onSeek?: (seconds: number) => void
  onBuffer?: () => void
  onBufferEnd?: () => void
  config?: any
  fallback?: React.ReactNode
  'aria-label'?: string
  'aria-describedby'?: string
}

export interface VideoPlayerRef {
  getCurrentTime: () => number
  getSecondsLoaded: () => number
  getDuration: () => number
  getInternalPlayer: () => any
  seekTo: (amount: number, type?: 'seconds' | 'fraction') => void
  showPreview: () => void
}

export const ReactVideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  url,
  tracks = [],
  className,
  light = false,
  playing = false,
  loop = false,
  controls = true,
  volume = 1,
  muted = false,
  playbackRate = 1,
  width = '100%',
  height = '100%',
  pip = false,
  playsInline = true,
  onReady,
  onStart,
  onPlay,
  onPause,
  onEnded,
  onError,
  onProgress,
  onDuration,
  onSeek,
  onBuffer,
  onBufferEnd,
  config,
  fallback,
  'aria-label': ariaLabel = 'Player de vídeo',
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const playerRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [sanitizedUrl, setSanitizedUrl] = useState('')

  // Sanitize URL on mount and when URL changes
  useEffect(() => {
    if (url) {
      const cleaned = DOMPurify.sanitize(url, { ALLOWED_TAGS: [] })
      setSanitizedUrl(cleaned)
    }
  }, [url])

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getCurrentTime: () => playerRef.current?.getCurrentTime() || 0,
    getSecondsLoaded: () => playerRef.current?.getSecondsLoaded() || 0,
    getDuration: () => playerRef.current?.getDuration() || 0,
    getInternalPlayer: () => playerRef.current?.getInternalPlayer(),
    seekTo: (amount: number, type: 'seconds' | 'fraction' = 'seconds') => {
      playerRef.current?.seekTo(amount, type)
    },
    showPreview: () => {
      if (playerRef.current) {
        playerRef.current.showPreview()
      }
    }
  }))

  const handleReady = (player: any) => {
    setIsReady(true)
    setHasError(false)
    onReady?.(player)
  }

  const handleError = (error: any) => {
    console.error('Video player error:', error)
    setHasError(true)
    onError?.(error)
  }

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    onProgress?.(state)
  }

  // Error fallback
  if (hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 text-gray-500', className)}>
        {fallback || (
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-lg font-medium">Erro ao carregar o vídeo</p>
            <p className="text-sm">Por favor, tente novamente mais tarde</p>
          </div>
        )}
      </div>
    )
  }

  // Loading state
  if (!isReady && !light) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100', className)}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando vídeo...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn('relative w-full', className)}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <ReactPlayer
        ref={playerRef}
        className="react-player"
        url={sanitizedUrl}
        width={width}
        height={height}
        playing={playing}
        loop={loop}
        controls={controls}
        light={light}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        pip={pip}
        playsInline={playsInline} // Essential for good iOS experience
        onReady={handleReady}
        onStart={onStart}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onError={handleError}
        onProgress={handleProgress}
        onDuration={onDuration}
        onSeek={onSeek}
        onBuffer={onBuffer}
        onBufferEnd={onBufferEnd}
        config={config}
        {...props}
      >
        {/* Add subtitles/captions declaratively */}
        {tracks.map((track, index) => (
          <track
            key={index}
            kind={track.kind}
            src={track.src}
            srcLang={track.srcLang}
            label={track.label}
            default={track.default}
          />
        ))}
      </ReactPlayer>
    </div>
  )
})

ReactVideoPlayer.displayName = 'ReactVideoPlayer'

export default ReactVideoPlayer