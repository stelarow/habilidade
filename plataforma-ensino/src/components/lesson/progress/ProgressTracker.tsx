'use client'

import React, { useMemo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Clock, FileText, ClipboardText, Target, CheckCircle, Trophy } from '@phosphor-icons/react'
import type { LessonProgressData, ComponentProgress } from '@/types/lesson'
import { useEnhancedProgressCalculation } from '@/hooks/useEnhancedProgressCalculation'
import type { EnhancedProgressData } from '@/hooks/useEnhancedProgressCalculation'

interface ProgressTrackerProps {
  progress: LessonProgressData
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

/**
 * ProgressTracker - Visual progress tracking component with circular rings
 * Part of Fase 2: Desenvolvimento de Componentes (2.6)
 * 
 * Features:
 * - Circular progress rings with brand colors
 * - Component-wise progress breakdown
 * - Animated completion states
 * - Time estimates and milestones
 * - Responsive design
 */
export function ProgressTracker({ 
  progress, 
  className, 
  size = 'md',
  showDetails = true 
}: ProgressTrackerProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Use enhanced progress calculation
  const enhancedProgress = useEnhancedProgressCalculation(progress)

  // Calculate display data with enhanced progress
  const progressData = useMemo(() => {
    const overall = enhancedProgress.overallProgress.percentage
    
    // Component data with enhanced states
    const components = [
      {
        component: 'time',
        icon: Clock,
        color: '#f59e0b',
        name: 'Tempo',
        percentage: enhancedProgress.timeProgress.percentage,
        isCompleted: enhancedProgress.timeProgress.isCompleted,
        state: enhancedProgress.timeProgress.state
      },
      {
        component: 'pdf',
        icon: FileText,
        color: '#00c4ff',
        name: 'PDF',
        percentage: enhancedProgress.pdfProgress.percentage,
        isCompleted: enhancedProgress.pdfProgress.isCompleted,
        state: enhancedProgress.pdfProgress.state
      },
      {
        component: 'exercises',
        icon: ClipboardText,
        color: '#ef4444',
        name: 'Exercícios',
        percentage: enhancedProgress.exerciseProgress.percentage,
        isCompleted: enhancedProgress.exerciseProgress.isCompleted,
        state: enhancedProgress.exerciseProgress.state
      },
      {
        component: 'quiz',
        icon: Target,
        color: '#22c55e',
        name: 'Quiz',
        percentage: enhancedProgress.quizProgress.score,
        isCompleted: enhancedProgress.quizProgress.isPassed,
        state: enhancedProgress.quizProgress.state
      }
    ]

    return {
      overall,
      components,
      estimatedTime: 0, // Will be calculated based on remaining criteria
      isCompleted: enhancedProgress.overallProgress.isCompleted,
      canComplete: enhancedProgress.overallProgress.canComplete,
      visualStates: enhancedProgress.visualStates
    }
  }, [enhancedProgress])

  // Size configurations
  const sizes = {
    sm: { ring: 80, stroke: 8, text: 'text-sm' },
    md: { ring: 120, stroke: 12, text: 'text-base' },
    lg: { ring: 160, stroke: 16, text: 'text-lg' }
  }

  const config = sizes[size]
  const radius = (config.ring - config.stroke * 2) / 2
  const circumference = radius * 2 * Math.PI

  // Animation for progress ring
  const progressOffset = circumference - (progressData.overall / 100) * circumference

  // Celebration effect when 100% complete
  useEffect(() => {
    if (progressData.overall >= 100 && !showCelebration) {
      setShowCelebration(true)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 2000)
    }
  }, [progressData.overall, showCelebration])

  // Format time estimate
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}min`
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  return (
    <div className={cn(
      'progress-tracker relative',
      className
    )}>
      {/* Main Progress Display */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6">
        {/* Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg
            width={config.ring}
            height={config.ring}
            className="transform -rotate-90"
          >
            {/* Background ring */}
            <circle
              cx={config.ring / 2}
              cy={config.ring / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={config.stroke}
              fill="transparent"
            />
            
            {/* Progress ring */}
            <motion.circle
              cx={config.ring / 2}
              cy={config.ring / 2}
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth={config.stroke}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: progressOffset }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className={cn(
                isAnimating && "animate-pulse",
                progressData.isCompleted && "drop-shadow-[0_0_20px_rgba(212,0,255,0.5)]"
              )}
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d400ff" />
                <stop offset="50%" stopColor="#a000ff" />
                <stop offset="100%" stopColor="#00c4ff" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className={cn("font-bold text-white", config.text)}
              animate={{ scale: isAnimating ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: isAnimating ? 3 : 0 }}
            >
              {Math.round(progressData.overall)}%
            </motion.div>
            {progressData.isCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-400 text-xl"
              >
                <CheckCircle size={20} weight="duotone" style={{ color: '#22c55e' }} />
              </motion.div>
            ) : (
              <div className="text-xs text-gray-400">
                {formatTime(progressData.estimatedTime)}
              </div>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="text-lg sm:text-xl font-semibold text-white">
            {progressData.isCompleted ? (
              <span className="text-green-400 flex items-center gap-2">
                <Trophy size={20} weight="duotone" style={{ color: '#22c55e' }} />
                Aula Concluída!
              </span>
            ) : (
              <span>Progresso da Aula</span>
            )}
          </div>
          <div className="lesson-text-body">
            {progressData.isCompleted 
              ? "Parabéns! Você completou todos os componentes desta aula."
              : `Você completou ${Math.round(progressData.overall)}% desta aula.`
            }
          </div>
          {!progressData.isCompleted && (
            <div className="lesson-text-subtitle">
              Tempo estimado restante: {formatTime(progressData.estimatedTime)}
            </div>
          )}
        </div>
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="text-6xl animate-bounce">
              <Trophy size={64} weight="duotone" style={{ color: '#22c55e' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Component Progress Details */}
      {showDetails && (
        <div className="space-y-4">
          <h4 className="lesson-text-subtitle text-center">
            Progresso por Componente
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {progressData.components.map((comp) => (
              <motion.div
                key={comp.component}
                className="lesson-exercise-item"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <comp.icon 
                      size={20} 
                      weight="duotone" 
                      style={{ color: comp.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-white truncate">
                        {comp.name}
                      </div>
                      <div className="text-sm text-gray-300 font-mono ml-2">
                        {Math.round(comp.percentage)}%
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: comp.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${comp.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      {showDetails && (
        <div className="flex justify-center items-center space-x-4 mt-6 pt-4 border-t border-white/10">
          <span className="lesson-text-caption">Marcos:</span>
          {[25, 50, 75, 100].map((milestone) => (
            <motion.div
              key={milestone}
              className={cn(
                "flex flex-col items-center space-y-1"
              )}
            >
              <motion.div
                className={cn(
                  "w-3 h-3 rounded-full border-2",
                  progressData.overall >= milestone
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 border-purple-400"
                    : "bg-transparent border-gray-600"
                )}
                animate={{
                  scale: progressData.overall >= milestone ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              <span className="lesson-text-caption">{milestone}%</span>
            </motion.div>
          ))}
        </div>
      )}

      <style jsx>{`
        .progress-tracker {
          user-select: none;
        }
        
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(212, 0, 255, 0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(212, 0, 255, 0.6)); }
        }
        
        .animate-glow {
          animation: glow 2s infinite;
        }
      `}</style>
    </div>
  )
}

// Hook to use with LessonContext
export function useProgressTracker() {
  // This would integrate with LessonContext when implemented
  return {
    trackVideoProgress: (time: number, duration: number) => {
      // Implementation would call context actions
    },
    trackPDFProgress: (page: number, totalPages: number) => {
      // Implementation would call context actions  
    },
    trackQuizProgress: (questionIndex: number, answer: number) => {
      // Implementation would call context actions
    },
    markComponentComplete: (component: string) => {
      // Implementation would call context actions
    }
  }
}