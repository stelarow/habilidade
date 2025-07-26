'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Loading } from '@/components/ui'

// Lazy load the QuizSection component
const QuizSection = dynamic(() => import('./QuizSection'), {
  loading: () => (
    <Card className="p-6 border-border/50 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted rounded border"></div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <Loading />
          <p className="text-sm text-muted-foreground mt-2">Carregando quiz...</p>
        </div>
      </div>
    </Card>
  ),
  ssr: false, // Quiz logic is client-side only
})

interface QuizSectionLazyProps {
  title: string
  questions: Array<{
    id: number
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
  }>
  passingScore: number
  onProgressUpdate: (progress: number) => void
  onQuizComplete: (score: number, passed: boolean) => void
  initialScore?: number
  initialCompleted?: boolean
}

const QuizSectionLazy: React.FC<QuizSectionLazyProps> = (props) => {
  return (
    <Suspense fallback={
      <Card className="p-6 border-border/50 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted rounded border"></div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <Loading />
            <p className="text-sm text-muted-foreground mt-2">Carregando quiz...</p>
          </div>
        </div>
      </Card>
    }>
      <QuizSection {...props} />
    </Suspense>
  )
}

export default QuizSectionLazy