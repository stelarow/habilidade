'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import type { LessonProgressData } from '@/types/lesson'
import { EnhancedLessonCompletion } from './completion/EnhancedLessonCompletion'
import LessonHeaderRedesigned from './LessonHeaderRedesigned'
import VideoSectionLazy from './VideoSectionLazy'
import ExercisesSectionLazy from './ExercisesSectionLazy'
import PDFSectionLazy from './PDFSectionLazy'
import QuizSectionLazy from './QuizSectionLazy'
import CompletionSection from './CompletionSection'
import LessonErrorBoundary from './LessonErrorBoundary'
import CanvaEmbed from './CanvaEmbed'
import type { UploadedFile } from './ExercisesSection'

import { useLessonProgress } from '@/hooks/useLessonProgress'

interface LessonPageRedesignedProps {
  lesson: {
    id: string
    title: string
    slug: string
    description?: string
    course: {
      id: string
      title: string
      slug: string
    }
  }
  progressData: LessonProgressData | null
  onExit?: () => void
  onLessonComplete?: () => void
  // Real data from database
  videoUrl?: string
  materials?: any[]
  exercises?: any[]
  quizzes?: any[]
  content?: string
  // Canva embed data
  canvaEmbedUrl?: string
  canvaTitle?: string
  canvaDescription?: string
  canvaAuthor?: string
  canvaAuthorUrl?: string
}

const LessonPageRedesigned: React.FC<LessonPageRedesignedProps> = ({
  lesson,
  progressData,
  onExit,
  onLessonComplete,
  videoUrl,
  materials = [],
  exercises = [],
  quizzes = [],
  content,
  canvaEmbedUrl,
  canvaTitle,
  canvaDescription,
  canvaAuthor,
  canvaAuthorUrl
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



  const handleExit = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      if (onExit) {
        await onExit()
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
        {({ completeLesson, isCompleting, isCompleted, error, canComplete, navigateToCourse }) => (
        <div className="min-h-screen bg-background">
          {/* Header redesigned component */}
          <LessonHeaderRedesigned
            course={lesson.course}
            lesson={lesson}
            progressData={currentProgressData}
            onExit={handleExit}
            videoUrl={videoUrl}
            materials={materials}
            exercises={exercises}
            quizzes={quizzes}
          />

          {/* Conteúdo principal */}
          <main className="pt-24 lg:pt-20 container mx-auto px-4 py-8 space-y-12">
            {/* Título da aula */}
            <Card className="p-8 border-border/50">
              <h1 className="text-2xl font-bold gradient-text">
                {lesson.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                Curso: {lesson.course.title}
              </p>
            </Card>

            {/* Canva Presentation Section - Featured at the beginning */}
            {canvaEmbedUrl && (
              <div id="canva-section">
                <CanvaEmbed
                  embedUrl={canvaEmbedUrl}
                  title={canvaTitle || "Apresentação da Aula"}
                  description={canvaDescription || "Apresentação visual complementar ao conteúdo da aula"}
                  author={canvaAuthor}
                  authorUrl={canvaAuthorUrl}
                  className="mb-6"
                />
              </div>
            )}

            {/* Content Section - Lesson HTML Content */}
            {content && (
              <div id="content-section">
                <Card className="p-8 border-border/50">
                  <div 
                    className="lesson-content prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </Card>
              </div>
            )}

            {/* Video Section */}
            {videoUrl && (
              <div id="video-section">
                <VideoSectionLazy
                  videoTitle={`Vídeo: ${lesson.title}`}
                  videoDescription={lesson.description || "Assista ao conteúdo principal desta aula"}
                  videoUrl={videoUrl}
                  lessonId={lesson.id}
                  onProgressUpdate={handleVideoProgress}
                />
              </div>
            )}

            {/* PDF Section */}
            {materials.length > 0 && materials.find((m: any) => m.type === 'pdf') && (
              <div id="pdf-section">
                <PDFSectionLazy
                  title={materials.find((m: any) => m.type === 'pdf')?.title || "Material Didático"}
                  pdfUrl={materials.find((m: any) => m.type === 'pdf')?.url}
                  lessonId={lesson.id}
                  onProgressUpdate={handlePDFProgress}
                  initialProgress={currentProgressData?.pdfProgress?.percentageRead || 0}
                />
              </div>
            )}

            {/* Quiz Section */}
            {quizzes.length > 0 && (
              <div id="quiz-section">
                <QuizSectionLazy
                  title={quizzes[0]?.title || "Quiz de Avaliação"}
                  questions={quizzes[0]?.questions?.map((q: any, index: number) => ({
                    id: index + 1,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correct_answer,
                    explanation: q.explanation
                  })) || []}
                  passingScore={quizzes[0]?.passing_score || 70}
                  onProgressUpdate={(progress) => {
                    // console.log('Quiz progress:', progress) // Removed to prevent excessive logging
                  }}
                  onQuizComplete={handleQuizComplete}
                  initialScore={currentProgressData?.quizProgress?.score || 0}
                  initialCompleted={currentProgressData?.quizProgress?.isCompleted || false}
                />
              </div>
            )}

            {/* Exercises Section */}
            {exercises.length > 0 && (
              <div id="exercises-section">
                <ExercisesSectionLazy
                  title="Exercícios Práticos"
                  exercises={exercises}
                  onProgressUpdate={handleExercisesProgress}
                  onFilesUploaded={(files: UploadedFile[]) => {
                    // console.log('Files uploaded:', files) // Removed to prevent excessive logging
                  }}
                />
              </div>
            )}

            {/* Completion Section */}
            {isCompleted ? (
              <Card className="p-6 border-green-500/20 bg-green-950/20">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-green-400">Aula Concluída com Sucesso!</h2>
                  <p className="text-green-200">
                    Parabéns! Você completou todos os critérios e finalizou esta aula.
                  </p>
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={navigateToCourse}
                      className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Voltar ao Curso
                    </button>
                    <p className="text-sm text-green-300">
                      Esta aula permanecerá disponível para revisão a qualquer momento.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <CompletionSection
                progressData={currentProgressData}
                minimumQuizScore={70}
                minimumPDFPercentage={75}
                onComplete={completeLesson}
                isCompleting={isCompleting}
                completionError={error}
                canComplete={canComplete}
                onProgressUpdate={(progress) => {
                  // console.log('Overall completion progress:', progress) // Removed to prevent infinite logging
                }}
              />
            )}
          </main>
        </div>
        )}
      </EnhancedLessonCompletion>
    </LessonErrorBoundary>
  )
}

export default LessonPageRedesigned