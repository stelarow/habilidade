'use client'

import React, { memo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { ProgressIndicator } from './ProgressIndicator'
import { useEnhancedProgressCalculation } from '@/hooks/useEnhancedProgressCalculation'
import { useScrollBehavior } from '@/hooks/useScrollBehavior'
import type { LessonProgressData } from '@/types/lesson'
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
  onComplete: () => Promise<void>
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
  lesson: _lesson,
  progressData,
  onExit,
  onComplete,
  className
}: LessonHeaderProps) => {
  const router = useRouter()
  
  // Use enhanced progress calculation
  const progress = useEnhancedProgressCalculation(progressData)
  
  // Use enhanced scroll behavior hook for smooth scroll-following behavior
  const { isScrolled, scrollDirection, isScrollingFast } = useScrollBehavior(10)
  
  const handleExit = () => {
    onExit()
    router.push(`/course/${course.slug}`)
  }

  const handleExitKeyDown = (event: React.KeyboardEvent) => {
    // Handle keyboard navigation for exit button
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleExit()
    }
  }

  const handleComplete = async () => {
    if (progress.overallProgress.canComplete) {
      try {
        // Call the completion handler with all progress data
        await onComplete()
      } catch (error) {
        console.error('Error completing lesson:', error)
        // Error handling is managed by the parent component
      }
    }
  }

  return (
    <motion.header 
      className={cn(
        "w-full relative z-10",
        styles.lessonHeader,
        className
      )}
      style={{ 
        position: 'relative',
        // Force override any global CSS that might apply position: fixed
        transform: 'translateZ(0)'
      }}
      role="banner"
      data-lesson-header="true"
      // Smooth scroll-following animations based on scroll state
      animate={{
        backgroundColor: isScrolled 
          ? 'rgba(24, 24, 27, 0.95)' // zinc-900/95
          : 'rgba(24, 24, 27, 0.80)', // zinc-900/80
        backdropFilter: 'blur(12px)',
        borderBottomColor: isScrolled 
          ? 'rgba(31, 41, 55, 0.7)' // gray-800/70
          : 'rgba(31, 41, 55, 0.5)', // gray-800/50
        boxShadow: isScrolled 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        // Subtle transform based on scroll direction for enhanced feel
        y: isScrollingFast && scrollDirection === 'down' ? -2 : 0,
      }}
      transition={{
        backgroundColor: { duration: 0.3, ease: "easeOut" },
        borderBottomColor: { duration: 0.3, ease: "easeOut" },
        boxShadow: { duration: 0.3, ease: "easeOut" },
        y: { duration: 0.2, ease: "easeOut" }
      }}
      initial={false}
    >
      <div className="mx-auto max-w-7xl">
        {/* Main Header Grid Layout */}
        <div className="header-grid">
          
          {/* Logo Area - Left Column */}
          <div className="header-logo-area">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Logo - Responsive sizing */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <span className="header-logo-size font-extrabold gradient-text bg-gradient-to-r from-[#d400ff] via-[#00c4ff] to-[#a000ff] bg-clip-text text-transparent flex items-center justify-center">
                  H
                </span>
                {/* Hide brand text on mobile to save space */}
                <span className="header-hide-mobile text-white font-semibold text-sm sm:text-base truncate-ellipsis max-w-[120px] sm:max-w-none">
                  Escola Habilidade
                </span>
              </div>

              {/* Exit Button - Enhanced responsive positioning and touch targets */}
              <motion.button
                onClick={handleExit}
                onKeyDown={handleExitKeyDown}
                className="header-exit-button flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#d400ff] focus:ring-offset-2 focus:ring-offset-transparent flex-shrink-0 touch-manipulation relative z-20"
                style={{
                  // Ensure button maintains fixed size and position
                  minWidth: 'var(--header-button-size-mobile)',
                  minHeight: 'var(--header-button-size-mobile)',
                  // Prevent overlap with other elements
                  position: 'relative',
                  zIndex: 20,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Voltar ao curso - Pressione Enter ou Espaço para ativar"
                role="button"
                tabIndex={0}
                type="button"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" weight="duotone" />
                <span className="header-hide-mobile text-xs font-medium whitespace-nowrap">Sair</span>
              </motion.button>
            </div>
          </div>

          {/* Progress Area - Center Column with Responsive Layout */}
          <div className="header-progress-area">
            {/* Ultra-Mobile (< 480px): Vertical compact layout */}
            <div className="flex sm:hidden progress-layout-vertical">
              <div className="flex flex-col items-center gap-0.5 min-w-0">
                <div className="flex items-center gap-1 overflow-hidden">
                  <ProgressIndicator
                    icon="time"
                    label="T"
                    progress={progress.timeProgress.percentage}
                    isCompleted={progress.timeProgress.isCompleted}
                    color="#f59e0b"
                    detail={progress.timeProgress.formatted}
                    state={progress.timeProgress.state}
                    showPulse={progress.timeProgress.state === 'in_progress'}
                    size="sm"
                  />
                  
                  <ProgressIndicator
                    icon="quiz"
                    label="Q"
                    progress={progress.quizProgress.score}
                    isCompleted={progress.quizProgress.isPassed}
                    color="#22c55e"
                    detail={progress.quizProgress.score > 0 ? `${progress.quizProgress.score}%` : '-'}
                    state={progress.quizProgress.state}
                    showPulse={progress.quizProgress.state === 'in_progress'}
                    size="sm"
                  />
                </div>
                
                {/* Progress percentage display for mobile */}
                <div className="text-[9px] font-medium text-white/80 whitespace-nowrap">
                  {Math.round(progress.overallProgress.percentage)}% total
                </div>
              </div>
            </div>

            {/* Mobile (480px - 767px): Horizontal compact layout */}
            <div className="hidden xs:flex sm:hidden progress-layout-horizontal items-center justify-center gap-1 overflow-hidden">
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

            {/* Tablet (768px - 1023px): Adaptive horizontal layout */}
            <div className="hidden sm:flex lg:hidden progress-layout-tablet items-center justify-center gap-1.5 overflow-hidden">
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
                label="Exerc."
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

            {/* Desktop (>= 1024px): Full horizontal layout with optimal spacing */}
            <div className="hidden lg:flex progress-layout-desktop items-center justify-center gap-2 xl:gap-3 overflow-hidden">
              <ProgressIndicator
                icon="time"
                label="Tempo"
                progress={progress.timeProgress.percentage}
                isCompleted={progress.timeProgress.isCompleted}
                color="#f59e0b"
                detail={progress.timeProgress.formatted}
                state={progress.timeProgress.state}
                showPulse={progress.timeProgress.state === 'in_progress'}
                size="md"
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
                size="md"
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
                size="md"
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
                size="md"
              />
            </div>
          </div>

          {/* Actions Area - Right Column */}
          <div className="header-actions-area">
            {/* Mobile: Show only completion button if available */}
            <div className="flex sm:hidden items-center gap-1">
              {/* Complete Button - Mobile optimized */}
              {progress.visualStates.showCompletionButton && (
                <motion.button
                  onClick={handleComplete}
                  disabled={false} // Will be controlled by parent component
                  className="w-8 h-8 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-bold rounded-md hover:from-[#16a34a] hover:to-[#15803d] active:from-[#15803d] active:to-[#166534] transition-all focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center touch-manipulation"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  aria-label="Concluir aula"
                >
                  <span className="text-sm">✓</span>
                </motion.button>
              )}
            </div>

            {/* Tablet and Desktop: Show full actions */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              {/* Overall Progress - Desktop Only */}
              <div className="header-hide-tablet flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">
                    {Math.round(progress.overallProgress.percentage)}%
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Geral
                  </div>
                </div>
                <div className="w-6 h-6 relative flex-shrink-0">
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

              {/* Complete Button - Tablet and Desktop */}
              {progress.visualStates.showCompletionButton && (
                <motion.button
                  onClick={handleComplete}
                  disabled={false} // Will be controlled by parent component
                  className="px-3 py-1.5 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-semibold rounded-md hover:from-[#16a34a] hover:to-[#15803d] active:from-[#15803d] active:to-[#166534] transition-all focus:outline-none focus:ring-2 focus:ring-green-400 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 touch-manipulation"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  aria-label="Concluir aula"
                >
                  Concluir
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar - Mobile and Tablet Only */}
        <div className="header-hide-desktop">
          <div className="flex items-center justify-between mb-1 px-2 sm:px-3">
            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">Progresso</span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-white">
              {Math.round(progress.overallProgress.percentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-800/60 rounded-full h-1 sm:h-1.5 mx-2 sm:mx-3">
            <motion.div
              className="h-1 sm:h-1.5 rounded-full"
              style={{
                background: progress.overallProgress.canComplete 
                  ? `linear-gradient(to right, #22c55e, #16a34a)`
                  : `linear-gradient(to right, ${progress.visualStates.progressColor}, #00c4ff)`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress.overallProgress.percentage}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

// Export memoized component
const MemoizedLessonHeader = memo(LessonHeaderComponent)
MemoizedLessonHeader.displayName = 'LessonHeader'
export const LessonHeader = MemoizedLessonHeader