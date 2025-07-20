'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useLessonCompletion } from '@/hooks/useLessonCompletion'
import { LessonCompletionCelebration } from './LessonCompletionCelebration'
import { LessonProgressData } from '@/types/lesson'
import { Warning, ArrowClockwise, X } from '@phosphor-icons/react'

interface EnhancedLessonCompletionProps {
  lessonId: string
  courseSlug: string
  lessonTitle?: string
  courseTitle?: string
  progressData: LessonProgressData | null
  children: (props: {
    completeLesson: () => Promise<void>
    isCompleting: boolean
    isCompleted: boolean
    error: string | null
    canComplete: boolean
    navigateToCourse: () => void
  }) => React.ReactNode
  onSuccess?: () => void
  onError?: (error: Error) => void
  className?: string
}

/**
 * EnhancedLessonCompletion - Comprehensive lesson completion wrapper
 * 
 * Features:
 * - Integrates completion logic with celebration animations
 * - Comprehensive error handling with retry functionality
 * - Loading states and user feedback
 * - Celebration animation with confetti effects
 * - Automatic navigation after completion
 * - Render props pattern for flexible UI integration
 */
export const EnhancedLessonCompletion: React.FC<EnhancedLessonCompletionProps> = ({
  lessonId,
  courseSlug,
  lessonTitle = 'Aula',
  courseTitle = 'Curso',
  progressData,
  children,
  onSuccess,
  onError,
  className
}) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false)

  // Use the lesson completion hook
  const {
    isCompleting,
    isCompleted,
    error,
    showCelebration,
    completeLesson,
    retryCompletion,
    dismissError,
    navigateToCourse,
    validateCompletion
  } = useLessonCompletion({
    lessonId,
    courseSlug,
    progressData,
    onSuccess,
    onError
  })

  // SIMPLIFIED validation directly here to break loops
  const canComplete = useMemo(() => {
    if (!progressData) return true // Allow if no data
    
    const quizScore = progressData.quizProgress?.score || 0
    const hasQuiz = progressData.quizProgress?.totalQuestions > 0
    
    // Simple rule: if has quiz, need 70%+
    return hasQuiz ? quizScore >= 70 : true
  }, [progressData])
  
  const validation = { isValid: canComplete, errors: [] }

  // Handle completion with additional error handling
  const handleCompleteLesson = useCallback(async (): Promise<void> => {
    try {
      await completeLesson()
    } catch (error) {
      console.error('Completion failed:', error)
      // Error is already handled by the hook
    }
  }, [completeLesson])

  // Handle error retry
  const handleRetry = useCallback(async (): Promise<void> => {
    setShowErrorDetails(false)
    await retryCompletion()
  }, [retryCompletion])

  // Handle error dismissal
  const handleDismissError = useCallback((): void => {
    setShowErrorDetails(false)
    dismissError()
  }, [dismissError])

  return (
    <div className={cn("relative", className)}>
      {/* Main Content - Render Props Pattern */}
      {children({
        completeLesson: handleCompleteLesson,
        isCompleting,
        isCompleted,
        error,
        canComplete,
        navigateToCourse
      })}

      {/* Error Notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="fixed top-4 right-4 z-40 max-w-md"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="bg-red-900/90 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <Warning className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" weight="fill" />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-red-200 mb-1">
                    Erro ao Concluir Aula
                  </h4>
                  
                  <p className="text-xs text-red-300 mb-3">
                    {error.length > 100 && !showErrorDetails 
                      ? `${error.substring(0, 100)}...`
                      : error
                    }
                  </p>

                  {error.length > 100 && (
                    <button
                      onClick={() => setShowErrorDetails(!showErrorDetails)}
                      className="text-xs text-red-400 hover:text-red-300 underline mb-3"
                    >
                      {showErrorDetails ? 'Ver menos' : 'Ver detalhes'}
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleRetry}
                      disabled={isCompleting}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-xs rounded-md transition-colors"
                    >
                      <ArrowClockwise className={cn(
                        "w-3 h-3",
                        isCompleting && "animate-spin"
                      )} />
                      Tentar Novamente
                    </button>
                    
                    <button
                      onClick={handleDismissError}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-md transition-colors"
                    >
                      Dispensar
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDismissError}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isCompleting && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  className="w-6 h-6 border-2 border-[#d400ff] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-white font-medium">
                  Finalizando aula...
                </span>
              </div>
              
              <p className="text-sm text-gray-400">
                Salvando progresso e desbloqueando próxima aula
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Animation */}
      <LessonCompletionCelebration
        isVisible={showCelebration}
        lessonTitle={lessonTitle}
        courseTitle={courseTitle}
        onComplete={() => {
          // Celebration completed, prepare for navigation
          console.log('Celebration completed, preparing to navigate...')
        }}
        onNavigate={() => {
          // Navigate to course page
          console.log('Navigating to course:', courseSlug)
          navigateToCourse()
        }}
      />

      {/* Validation Error Helper (for development) */}
      {process.env.NODE_ENV === 'development' && !canComplete && validation.errors.length > 0 && (
        <div className="fixed bottom-4 left-4 z-20 max-w-sm">
          <motion.div
            className="bg-yellow-900/90 backdrop-blur-sm border border-yellow-500/50 rounded-lg p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h5 className="text-xs font-semibold text-yellow-200 mb-2">
              Critérios Pendentes:
            </h5>
            <ul className="text-xs text-yellow-300 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-yellow-500">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </div>
  )
}