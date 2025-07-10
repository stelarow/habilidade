'use client'

import React, { useEffect, useState } from 'react'
import { VideoPlayer } from '@/components/ui'
import { useVideoProgress } from '@/hooks/useVideoProgress'
import { createClient } from '../../../lib/supabase/client'
import { Lesson, Progress, User, Enrollment } from '@/types'
import { formatDuration } from '@/lib/utils'
import { 
  Play, 
  CheckCircle, 
  Clock, 
  FileText, 
  DownloadSimple,
  BookOpen,
  ArrowLeft,
  ArrowRight 
} from 'phosphor-react'
import { GradientButton } from '@/components/ui'

interface LessonViewerProps {
  lesson: Lesson
  user: User
  enrollment: Enrollment
  onLessonComplete?: () => void
  onNavigateLesson?: (direction: 'prev' | 'next') => void
  hasPreviousLesson?: boolean
  hasNextLesson?: boolean
  course?: {
    id: string
    title: string
    background_theme: string
  }
}

export default function LessonViewer({
  lesson,
  user,
  enrollment,
  onLessonComplete,
  onNavigateLesson,
  hasPreviousLesson = false,
  hasNextLesson = false,
  course
}: LessonViewerProps) {
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  const {
    progress,
    loading,
    error,
    isCompleted,
    handleProgress,
    markAsCompleted,
    getCompletionPercentage,
    lastPosition
  } = useVideoProgress({
    lessonId: lesson.id,
    userId: user.id,
    enrollmentId: enrollment.id,
    autoSave: true,
    autoSaveInterval: 3000,
    completionThreshold: 0.9
  })

  // Handle lesson completion
  const handleLessonComplete = () => {
    markAsCompleted()
    onLessonComplete?.()
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if not focused on input elements
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case 'ArrowUp':
          if (hasPreviousLesson) {
            e.preventDefault()
            onNavigateLesson?.('prev')
          }
          break
        case 'ArrowDown':
          if (hasNextLesson) {
            e.preventDefault()
            onNavigateLesson?.('next')
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [hasPreviousLesson, hasNextLesson, onNavigateLesson])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-white/60">Carregando aula...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao carregar aula</h3>
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg text-white transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateLesson?.('prev')}
                disabled={!hasPreviousLesson}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Anterior</span>
              </button>
              
              <button
                onClick={() => onNavigateLesson?.('next')}
                disabled={!hasNextLesson}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-sm">Próxima</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Completion Status */}
          <div className="flex items-center gap-3">
            {isCompleted ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400" weight="fill" />
                <span className="text-sm text-green-400">Concluída</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">{Math.round(getCompletionPercentage())}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Title and Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {lesson.title}
          </h1>
          {lesson.description && (
            <p className="text-white/70 text-lg leading-relaxed">
              {lesson.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(lesson.video_duration)}
            </span>
            {lesson.materials?.length > 0 && (
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {lesson.materials.length} {lesson.materials.length === 1 ? 'material' : 'materiais'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {lesson.video_url ? (
          <VideoPlayer
            url={lesson.video_url}
            controls={true}
            onProgressUpdate={handleProgress}
            onLessonComplete={handleLessonComplete}
            lesson={{
              id: lesson.id,
              title: lesson.title,
              video_duration: lesson.video_duration
            }}
            playing={false}
            className="w-full h-full"
            // Resume from last position
            onReady={(player) => {
              setIsPlayerReady(true)
              if (lastPosition > 0 && !isCompleted) {
                // Wait a bit before seeking to ensure player is ready
                setTimeout(() => {
                  player.seekTo(lastPosition, 'seconds')
                }, 500)
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Play className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">Vídeo não disponível</p>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transcript */}
          {lesson.transcript && (
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Transcrição
                </h3>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {showTranscript ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              
              {showTranscript && (
                <div className="prose prose-invert max-w-none">
                  <div className="text-white/80 leading-relaxed whitespace-pre-line">
                    {lesson.transcript}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Complete Lesson Button */}
          {!isCompleted && getCompletionPercentage() >= 90 && (
            <div className="text-center">
              <GradientButton
                onClick={handleLessonComplete}
                className="px-8 py-3"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Marcar como Concluída
              </GradientButton>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Materials */}
          {lesson.materials && lesson.materials.length > 0 && (
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Materiais de Apoio
              </h3>
              
              <div className="space-y-3">
                {lesson.materials.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{material.title}</p>
                        <p className="text-white/60 text-sm capitalize">{material.type}</p>
                      </div>
                    </div>
                    
                    {material.url && (
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <DownloadSimple className="w-4 h-4 text-white/60" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Summary */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Seu Progresso</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Conclusão</span>
                  <span className="text-white">{Math.round(getCompletionPercentage())}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  />
                </div>
              </div>
              
              {progress && (
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Tempo assistido</span>
                    <span className="text-white">{formatDuration(progress.watch_time)}</span>
                  </div>
                  
                  {!isCompleted && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Última posição</span>
                      <span className="text-white">{formatDuration(progress.last_position)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}