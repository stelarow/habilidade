'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Loading } from '@/components/ui'

// Lazy load the VideoSection component
const VideoSection = dynamic(() => import('./VideoSection'), {
  loading: () => (
    <Card className="p-6 border-border/50 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-1/3"></div>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <Loading />
        </div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    </Card>
  ),
  ssr: false, // Disable SSR for video components to reduce initial bundle
})

interface VideoSectionLazyProps {
  videoTitle: string
  videoDescription: string
  videoUrl: string
  lessonId: string
  onProgressUpdate: (progress: number, currentTime?: number, duration?: number) => void
}

const VideoSectionLazy: React.FC<VideoSectionLazyProps> = (props) => {
  return (
    <Suspense fallback={
      <Card className="p-6 border-border/50 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <Loading />
          </div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </Card>
    }>
      <VideoSection {...props} />
    </Suspense>
  )
}

export default VideoSectionLazy