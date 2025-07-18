'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { LessonProgressData } from '@/types/lesson'
import { EnhancedLessonCompletion } from './completion/EnhancedLessonCompletion'
import LessonHeaderRedesigned from './LessonHeaderRedesigned'
import VideoSection from './VideoSection'
import ExercisesSection from './ExercisesSection'
import PDFSection from './PDFSection'
import QuizSection from './QuizSection'
import CompletionSection from './CompletionSection'

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
  // State for tracking progress across all sections
  const [currentProgressData, setCurrentProgressData] = useState<LessonProgressData | null>(progressData)
  const [timeSpent, setTimeSpent] = useState(0)

  // Timer for tracking time spent on page
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Update progress data when prop changes
  useEffect(() => {
    setCurrentProgressData(progressData)
  }, [progressData])

  const handleExit = () => {
    if (onExit) {
      onExit()
    }
  }

  // Handle progress updates from individual sections
  const handleVideoProgress = useCallback((progress: number) => {
    setCurrentProgressData(prev => {
      if (!prev) return null
      return {
        ...prev,
        videoProgress: {
          ...prev.videoProgress,
          percentageWatched: progress
        }
      }
    })
  }, [])

  const handlePDFProgress = useCallback((progress: number) => {
    setCurrentProgressData(prev => {
      if (!prev) return null
      return {
        ...prev,
        pdfProgress: {
          ...prev.pdfProgress,
          percentageRead: progress
        }
      }
    })
  }, [])

  const handleQuizComplete = useCallback((score: number, passed: boolean) => {
    setCurrentProgressData(prev => {
      if (!prev) return null
      return {
        ...prev,
        quizProgress: {
          ...prev.quizProgress,
          score,
          isPassed: passed,
          isCompleted: true
        }
      }
    })
  }, [])

  const handleExercisesProgress = useCallback((progress: number) => {
    setCurrentProgressData(prev => {
      if (!prev) return null
      return {
        ...prev,
        exerciseProgress: {
          ...prev.exerciseProgress,
          completionPercentage: progress
        }
      }
    })
  }, [])

  return (
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
            progressData={progressData}
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
              onProgressUpdate={handleVideoProgress}
            />

            {/* PDF Section */}
            <PDFSection
              title="Material Didático - Apostila"
              totalPages={20}
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
  )
}

export default LessonPageRedesigned