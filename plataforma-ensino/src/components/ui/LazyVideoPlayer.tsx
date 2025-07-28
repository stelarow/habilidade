'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { VideoPlayerWrapperProps } from './VideoPlayerWrapper'

// Dynamically import VideoPlayerWrapper with no SSR
const VideoPlayerWrapper = dynamic(
  () => import('./VideoPlayerWrapper'),
  {
    ssr: false,
    loading: () => <VideoPlayerSkeleton />
  }
)

interface VideoPlayerSkeletonProps {
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9' | string
  className?: string
}

const VideoPlayerSkeleton: React.FC<VideoPlayerSkeletonProps> = ({ 
  aspectRatio = '16/9',
  className 
}) => {
  const aspectRatioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '21/9': 'aspect-[21/9]'
  }[aspectRatio] || `aspect-[${aspectRatio}]`

  return (
    <div className={`w-full ${className}`}>
      <div className={`relative overflow-hidden rounded-lg bg-gray-200 ${aspectRatioClass}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 5v10l7-5-7-5z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export interface LazyVideoPlayerProps extends VideoPlayerWrapperProps {
  enableLazyLoading?: boolean
  fallback?: React.ReactNode
}

export const LazyVideoPlayer = React.forwardRef<any, LazyVideoPlayerProps>(({
  enableLazyLoading = true,
  fallback,
  ...props
}, ref) => {
  // If lazy loading is disabled, import and render directly
  if (!enableLazyLoading) {
    const VideoPlayerWrapper = require('./VideoPlayerWrapper').default
    return <VideoPlayerWrapper ref={ref} {...props} />
  }

  // Use Suspense for better loading experience
  return (
    <Suspense fallback={fallback || <VideoPlayerSkeleton aspectRatio={props.aspectRatio} />}>
      <VideoPlayerWrapper ref={ref} {...props} />
    </Suspense>
  )
})

LazyVideoPlayer.displayName = 'LazyVideoPlayer'

export default LazyVideoPlayer