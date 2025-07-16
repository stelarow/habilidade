'use client'

import React, { memo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'phosphor-react'
import { ProgressIndicator } from './ProgressIndicator'

interface LessonHeaderProps {
  course: {
    title: string
    slug: string
  }
  lesson: {
    title: string
    slug: string
  }
  progress: {
    overall: number
    time: {
      current: number
      required: number
      formatted: string
    }
    pdf: {
      percentage: number
      isCompleted: boolean
    }
    exercises: {
      completed: number
      total: number
      isCompleted: boolean
    }
    quiz: {
      score: number
      isCompleted: boolean
      isPassed: boolean
    }
  }
  canComplete: boolean
  onExit: () => void
  onComplete: () => void
  className?: string
}

/**
 * LessonHeader - Modern lesson header based on homepage design
 * 
 * Features:
 * - Logo da Escola Habilidade
 * - Exit button to return to course
 * - Progress indicators for all completion criteria
 * - Responsive design for desktop, tablet, and mobile
 * - Scroll-following behavior (not fixed)
 * - Brand colors and consistent styling
 */
const LessonHeaderComponent = ({
  course,
  lesson,
  progress,
  canComplete,
  onExit,
  onComplete,
  className
}: LessonHeaderProps) => {
  const router = useRouter()

  const handleExit = () => {
    onExit()
    router.push(`/course/${course.slug}`)
  }

  const handleComplete = () => {
    if (canComplete) {
      onComplete()
    }
  }

  return (
    <header 
      className={cn(
        "w-full bg-zinc-900/70 backdrop-blur-md border-b border-gray-800/50 transition-all duration-300",
        className
      )}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side - Logo and Exit */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-extrabold text-2xl sm:text-4xl gradient-text bg-gradient-to-r from-[#d400ff] via-[#00c4ff] to-[#a000ff] bg-clip-text text-transparent animate-gradient">
                H
              </span>
              <span className="hidden sm:block text-white font-semibold text-base sm:text-lg">
                Escola Habilidade
              </span>
            </div>

            {/* Exit Button */}
            <motion.button
              onClick={handleExit}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#d400ff] focus:ring-offset-2 focus:ring-offset-gray-900"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Voltar ao curso"
            >
              <ArrowLeft className="w-4 h-4" weight="duotone" />
              <span className="hidden sm:inline text-sm">Sair</span>
            </motion.button>
          </div>

          {/* Center - Progress Indicators */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ProgressIndicator
              icon="time"
              label="Tempo"
              progress={progress.time.current >= progress.time.required ? 100 : (progress.time.current / progress.time.required) * 100}
              isCompleted={progress.time.current >= progress.time.required}
              color="#f59e0b"
              detail={progress.time.formatted}
            />
            
            <ProgressIndicator
              icon="pdf"
              label="PDF"
              progress={progress.pdf.percentage}
              isCompleted={progress.pdf.isCompleted}
              color="#00c4ff"
              detail={`${Math.round(progress.pdf.percentage)}%`}
            />
            
            <ProgressIndicator
              icon="exercises"
              label="Exercícios"
              progress={progress.exercises.total > 0 ? (progress.exercises.completed / progress.exercises.total) * 100 : 0}
              isCompleted={progress.exercises.isCompleted}
              color="#ef4444"
              detail={`${progress.exercises.completed}/${progress.exercises.total}`}
            />
            
            <ProgressIndicator
              icon="quiz"
              label="Quiz"
              progress={progress.quiz.isPassed ? 100 : progress.quiz.score}
              isCompleted={progress.quiz.isCompleted && progress.quiz.isPassed}
              color="#22c55e"
              detail={progress.quiz.score > 0 ? `${progress.quiz.score}%` : '-'}
            />
          </div>

          {/* Right side - Overall Progress and Complete Button */}
          <div className="flex items-center gap-3">
            {/* Overall Progress */}
            <div className="hidden md:flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-semibold text-white">
                  {Math.round(progress.overall)}%
                </div>
                <div className="text-xs text-gray-400">
                  Concluído
                </div>
              </div>
              <div className="w-12 h-12 relative">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke={canComplete ? "#22c55e" : "#d400ff"}
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 20 * (1 - progress.overall / 100)
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                      filter: `drop-shadow(0 0 4px ${canComplete ? "#22c55e" : "#d400ff"}30)`
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {canComplete ? (
                    <span className="text-green-400 text-lg">✓</span>
                  ) : (
                    <span className="text-xs font-bold text-white">
                      {Math.round(progress.overall)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Complete Button */}
            {canComplete && (
              <motion.button
                onClick={handleComplete}
                className="px-4 py-2 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-semibold rounded-lg hover:from-[#16a34a] hover:to-[#15803d] transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="hidden sm:inline">Concluir Aula</span>
                <span className="sm:hidden">Concluir</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Progresso Geral</span>
            <span className="text-xs font-semibold text-white">{Math.round(progress.overall)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-[#d400ff] to-[#00c4ff]"
              initial={{ width: 0 }}
              animate={{ width: `${progress.overall}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

// Export memoized component
const MemoizedLessonHeader = memo(LessonHeaderComponent)
MemoizedLessonHeader.displayName = 'LessonHeader'
export const LessonHeader = MemoizedLessonHeader