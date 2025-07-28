'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Loading } from '@/components/ui'
import type { UploadedFile } from './ExercisesSection'

// Lazy load the ExercisesSection component
const ExercisesSection = dynamic(() => import('./ExercisesSection'), {
  loading: () => (
    <Card className="p-6 border-border/50 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-32 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20"></div>
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
        <div className="text-center">
          <Loading />
          <p className="text-sm text-muted-foreground mt-2">Carregando exercícios...</p>
        </div>
      </div>
    </Card>
  ),
  ssr: false, // File upload components don't work with SSR
})

interface ExercisesSectionLazyProps {
  title: string
  exercises: any[]
  onProgressUpdate: (progress: number, uploadedFiles?: string[]) => void
  onFilesUploaded: (files: UploadedFile[]) => void
}

const ExercisesSectionLazy: React.FC<ExercisesSectionLazyProps> = (props) => {
  return (
    <Suspense fallback={
      <Card className="p-6 border-border/50 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-32 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
          <div className="text-center">
            <Loading />
            <p className="text-sm text-muted-foreground mt-2">Carregando exercícios...</p>
          </div>
        </div>
      </Card>
    }>
      <ExercisesSection {...props} />
    </Suspense>
  )
}

export default ExercisesSectionLazy