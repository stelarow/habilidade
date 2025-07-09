'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ReactVideoPlayer, VideoPlayerProps, VideoPlayerRef } from './ReactVideoPlayer'

export interface VideoPlayerWrapperProps extends VideoPlayerProps {
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9' | string
  maxWidth?: string
  responsive?: boolean
  showControls?: boolean
  className?: string
}

export const VideoPlayerWrapper = React.forwardRef<VideoPlayerRef, VideoPlayerWrapperProps>(({
  aspectRatio = '16/9',
  maxWidth = '100%',
  responsive = true,
  showControls = true,
  className,
  ...props
}, ref) => {
  const aspectRatioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '21/9': 'aspect-[21/9]'
  }[aspectRatio] || `aspect-[${aspectRatio}]`

  return (
    <div 
      className={cn(
        'w-full',
        responsive && 'max-w-full',
        className
      )}
      style={{ maxWidth }}
    >
      <div className={cn(
        'relative overflow-hidden rounded-lg bg-black',
        aspectRatioClass
      )}>
        <div className="absolute inset-0">
          <ReactVideoPlayer
            ref={ref}
            className="w-full h-full"
            controls={showControls}
            width="100%"
            height="100%"
            {...props}
          />
        </div>
      </div>
    </div>
  )
})

VideoPlayerWrapper.displayName = 'VideoPlayerWrapper'

export default VideoPlayerWrapper