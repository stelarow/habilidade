'use client'

import React, { memo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { ProgressIndicator } from './ProgressIndicator'
import { useEnhancedProgressCalculation } from '@/hooks/useEnhancedProgressCalculation'
import { useScrollBehavior } from '@/hooks/useScrollBehavior'
import { LessonProgressData } from '@/types/lesson'
import styles from './LessonHeader.module.css'

interface LessonHeaderProps {
  course: {
    title: string
    slug: string
  }
  lesson: {
    title: string
    slug: string
  }
  progressData: LessonProgressData | null
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
  progressData,
  onExit,
  onComplete,
  className
}: LessonHeaderProps) => {
  const router = useRouter()
  
  // Use enhanced progress calculation
  const progress = useEnhancedProgressCalculation(progressData)
  
  // Use scroll behavior hook for scroll-following behavior
  const { isScrolled } = useScrollBehavior(10)
  
  const handleExit = () => {
    onExit()
    router.push(`/course/${course.slug}`)
  }

  const handleComplete = () => {
    if (progress.overallProgress.canComplete) {
      onComplete()
    }
  }

  return (
    <header 
      className={cn(
        "w-full transition-all duration-300 relative z-10",
        styles.lessonHeader,
        // Dynamic background opacity based on scroll state
        isScrolled 
          ? "bg-zinc-900/95 backdrop-blur-md border-b border-gray-800/70 shadow-lg" 
          : "bg-zinc-900/80 backdrop-blur-md border-b border-gray-800/50",
        className
      )}
      style={{ 
        position: 'relative',
        // Force override any global CSS that might apply position: fixed
        transform: 'translateZ(0)'
      }}
      role="banner"
      data-lesson-header="true"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-14">
          
          {/* Left side - Logo and Exit */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl gradient-text bg-gradient-to-r from-[#d400ff] via-[#00c4ff] to-[#a000ff] bg-clip-text text-transparent">
                H
              </span>
              <span className="hidden sm:block text-white font-semibold text-sm">
                Escola Habilidade
              </span>
            </div>

            {/* Exit Button */}
            <motion.button
              onClick={handleExit}
              className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#d400ff]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Voltar ao curso"
            >
              <ArrowLeft className="w-4 h-4" weight="duotone" />
              <span className="hidden sm:inline text-xs">Sair</span>
            </motion.button>
          </div>

          {/* Center - Compact Progress Indicators */}
          <div className="flex items-center justify-center gap-1 sm:gap-1.5">
            <ProgressIndicator
              icon="time"
              label="Tempo"
              progress={progress.timeProgress.percentage}
              isCompleted={progress.timeProgress.isCompleted}
              color="#f59e0b"
              detail={progress.timeProgress.formatted}
              state={progress.timeProgress.state}
              showPulse={progress.timeProgress.state === 'in_progress'}
              size="sm"
            />
            
            <ProgressIndicator
              icon="pdf"
              label="PDF"
              progress={progress.pdfProgress.percentage}
              isCompleted={progress.pdfProgress.isCompleted}
              color="#00c4ff"
              detail={`${Math.round(progress.pdfProgress.percentage)}%`}
              state={progress.pdfProgress.state}
              showPulse={progress.pdfProgress.state === 'in_progress'}
              size="sm"
            />
            
            <ProgressIndicator
              icon="exercises"
              label="Exercícios"
              progress={progress.exerciseProgress.percentage}
              isCompleted={progress.exerciseProgress.isCompleted}
              color="#ef4444"
              detail={`${progress.exerciseProgress.completed}/${progress.exerciseProgress.total}`}
              state={progress.exerciseProgress.state}
              showPulse={progress.exerciseProgress.state === 'in_progress'}
              size="sm"
            />
            
            <ProgressIndicator
              icon="quiz"
              label="Quiz"
              progress={progress.quizProgress.score}
              isCompleted={progress.quizProgress.isPassed}
              color="#22c55e"
              detail={progress.quizProgress.score > 0 ? `${progress.quizProgress.score}%` : '-'}
              state={progress.quizProgress.state}
              showPulse={progress.quizProgress.state === 'in_progress'}
              size="sm"
            />
          </div>

          {/* Right side - Overall Progress and Complete Button */}
          <div className="flex items-center gap-2">
            {/* Overall Progress - Compact */}
            <div className="hidden md:flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs font-semibold text-white">
                  {Math.round(progress.overallProgress.percentage)}%
                </div>
                <div className="text-[10px] text-gray-400">
                  Geral
                </div>
              </div>
              <div className="w-6 h-6 relative">
                <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1.5"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke={progress.overallProgress.canComplete ? "#22c55e" : progress.visualStates.progressColor}
                    strokeWidth="1.5"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 9}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 9 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 9 * (1 - progress.overallProgress.percentage / 100)
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                      filter: `drop-shadow(0 0 2px ${progress.overallProgress.canComplete ? "#22c55e" : progress.visualStates.progressColor}30)`
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {progress.overallProgress.canComplete ? (
                    <span className="text-green-400 text-[9px]">✓</span>
                  ) : (
                    <span className="text-[8px] font-bold text-white">
                      {Math.round(progress.overallProgress.percentage)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Complete Button - Compact */}
            {progress.visualStates.showCompletionButton && (
              <motion.button
                onClick={handleComplete}
                className="px-3 py-1 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-semibold rounded-md hover:from-[#16a34a] hover:to-[#15803d] transition-all focus:outline-none focus:ring-2 focus:ring-green-400 text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="hidden sm:inline">Concluir</span>
                <span className="sm:hidden">✓</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Progress Bar - More Compact */}
        <div className="md:hidden pb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400">Progresso Geral</span>
            <span className="text-[10px] font-semibold text-white">{Math.round(progress.overallProgress.percentage)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <motion.div
              className="h-1.5 rounded-full"
              style={{
                background: `linear-gradient(to right, ${progress.visualStates.progressColor}, #00c4ff)`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress.overallProgress.percentage}%` }}
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