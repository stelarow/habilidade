'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Loading } from '@/components/ui'

// Lazy load the PDFSectionWrapper component
const PDFSectionWrapper = dynamic(() => import('./PDFSectionWrapper'), {
  loading: () => (
    <Card className="p-6 border-border/50 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-1/4"></div>
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <Loading />
            <p className="text-sm text-muted-foreground">Carregando PDF...</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-muted rounded w-20"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </div>
      </div>
    </Card>
  ),
  ssr: false, // PDF.js doesn't work well with SSR
})

interface PDFSectionLazyProps {
  title: string
  pdfUrl: string
  lessonId: string
  onProgressUpdate: (progress: number, currentPage?: number, totalPages?: number) => void
  initialProgress?: number
}

const PDFSectionLazy: React.FC<PDFSectionLazyProps> = (props) => {
  return (
    <Suspense fallback={
      <Card className="p-6 border-border/50 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <Loading />
              <p className="text-sm text-muted-foreground">Carregando PDF...</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
      </Card>
    }>
      <PDFSectionWrapper {...props} />
    </Suspense>
  )
}

export default PDFSectionLazy