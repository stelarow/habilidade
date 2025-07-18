'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { LessonProgressData } from '@/types/lesson'
import { EnhancedLessonCompletion } from './completion/EnhancedLessonCompletion'
import LessonHeaderRedesigned from './LessonHeaderRedesigned'
import VideoSection from './VideoSection'
import ExercisesSection from './ExercisesSection'
import PDFSectionWrapper from './PDFSectionWrapper'
import QuizSection from './QuizSection'
import CompletionSection from './CompletionSection'
import LessonErrorBoundary from './LessonErrorBoundary'

import { useLessonProgress } from '@/hooks/useLessonProgress'

interface LessonPageRedesignedProps {
  lesson: {
    id: string
    title: string
    slug: string
    course: {
      id: string
      title: string
      slug: string
    }
  }
  progressData: LessonProgressData | null
  onExit?: () => void
  onLessonComplete?: () => void
}

const LessonPageRedesigned: React.FC<LessonPageRedesignedProps> = ({
  lesson,
  progressData,
  onExit,
  onLessonComplete
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Real-time progress tracking
  const {
    progressData: currentProgressData,
    updateVideoProgress,
    updatePDFProgress,
    updateQuizProgress,
    updateExerciseProgress
  } = useLessonProgress({
    lessonId: lesson.id,
    initialProgressData: progressData
  })

  const [timeSpent, setTimeSpent] = useState(0)

  // Timer for tracking time spent on page
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleExit = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)
      if (onExit) {
        onExit()
      }
    } catch (err) {
      setError('Erro ao sair da aula. Tente novamente.')
      console.error('Exit error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [onExit])

  // Handle progress updates from individual sections using the new hook
  const handleVideoProgress = useCallback((progress: number, currentTime?: number, duration?: number) => {
    updateVideoProgress(progress, currentTime, duration)
  }, [updateVideoProgress])

  const handlePDFProgress = useCallback((progress: number, currentPage?: number, totalPages?: number) => {
    updatePDFProgress(progress, currentPage, totalPages)
  }, [updatePDFProgress])

  const handleQuizComplete = useCallback((score: number, passed: boolean) => {
    updateQuizProgress(score, true, passed)
  }, [updateQuizProgress])

  const handleExercisesProgress = useCallback((progress: number, uploadedFiles?: string[]) => {
    updateExerciseProgress(progress, uploadedFiles)
  }, [updateExerciseProgress])

  return (
    <LessonErrorBoundary>
      <EnhancedLessonCompletion
        lessonId={lesson.id}
        courseSlug={lesson.course.slug}
        lessonTitle={lesson.title}
        courseTitle={lesson.course.title}
        progressData={currentProgressData}
        onSuccess={onLessonComplete}
      >
        {({ completeLesson, isCompleting, error, canComplete }) => (
        <div className="min-h-screen bg-background">
          {/* Header redesigned component */}
          <LessonHeaderRedesigned
            course={lesson.course}
            lesson={lesson}
            progressData={currentProgressData}
            onExit={handleExit}
          />

          {/* Conteúdo principal */}
          <main className="pt-24 lg:pt-20 container mx-auto px-4 py-6 space-y-8">
            {/* Título da aula */}
            <Card className="p-6 border-border/50">
              <h1 className="text-2xl font-bold gradient-text">
                {lesson.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                Curso: {lesson.course.title}
              </p>
            </Card>

            {/* Video Section */}
            <VideoSection
              videoTitle={`Vídeo: ${lesson.title}`}
              videoDescription="Assista ao conteúdo principal desta aula"
              videoUrl="https://vimeo.com/1095312387"
              lessonId={lesson.id}
              onProgressUpdate={handleVideoProgress}
            />

            {/* PDF Section */}
            <PDFSectionWrapper
              title="Material Didático - Apostila"
              pdfUrl="/pdf/capitulo2.pdf"
              lessonId={lesson.id}
              onProgressUpdate={handlePDFProgress}
              initialProgress={currentProgressData?.pdfProgress?.percentageRead || 0}
            />

            {/* Quiz Section */}
            <QuizSection
              title="Quiz de Avaliação"
              passingScore={70}
              onProgressUpdate={(progress) => {
                console.log('Quiz progress:', progress)
              }}
              onQuizComplete={handleQuizComplete}
              initialScore={currentProgressData?.quizProgress?.score || 0}
              initialCompleted={currentProgressData?.quizProgress?.isCompleted || false}
            />

            {/* Exercises Section */}
            <ExercisesSection
              title="Exercícios Práticos"
              onProgressUpdate={handleExercisesProgress}
              onFilesUploaded={(files) => {
                console.log('Files uploaded:', files)
              }}
            />

            {/* Completion Section */}
            <CompletionSection
              progressData={currentProgressData}
              timeSpent={timeSpent}
              minimumTimeMinutes={25}
              minimumQuizScore={70}
              onComplete={completeLesson}
              isCompleting={isCompleting}
              completionError={error}
              canComplete={canComplete}
              onProgressUpdate={(progress) => {
                console.log('Overall completion progress:', progress)
              }}
            />
          </main>
        </div>
        )}
      </EnhancedLessonCompletion>
    </LessonErrorBoundary>
  )
}

export default LessonPageRedesigned