'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useEnhancedProgressCalculation, EnhancedProgressData } from '@/hooks/useEnhancedProgressCalculation'
import { LessonProgressData } from '@/types/lesson'

interface CompletionCriterion {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  isCompleted: boolean
  progress: number
  weight: number
  color: string
}

interface CompletionProgressProps {
  criteria: CompletionCriterion[]
  overallProgress: number
  canComplete: boolean
  completedCount: number
  totalCount: number
  className?: string
  onCriterionClick?: (criterion: CompletionCriterion) => void
  timeRemaining?: string
  showCompleteButton?: boolean
  onCompleteClick?: () => void
}

/**
 * CompletionProgress - Component to show completion criteria status
 * 
 * Features:
 * - Visual progress for each criterion
 * - Overall completion percentage
 * - Complete lesson button when all criteria are met
 * - Time remaining display
 * - Interactive criterion items
 * - Animated progress indicators
 */
export function CompletionProgress({
  criteria,
  overallProgress,
  canComplete,
  completedCount,
  totalCount,
  className,
  onCriterionClick,
  timeRemaining,
  showCompleteButton = false,
  onCompleteClick
}: CompletionProgressProps) {
  
  // Progress circle component
  const ProgressCircle = useMemo(() => {
    const MemoizedProgressCircle = ({ 
      percentage, 
      size = 40, 
      strokeWidth = 3, 
      color = '#d400ff' 
    }: {
      percentage: number
      size?: number
      strokeWidth?: number
      color?: string
    }) => {
      const radius = (size - strokeWidth) / 2
      const circumference = radius * 2 * Math.PI
      const strokeDasharray = `${circumference} ${circumference}`
      const strokeDashoffset = circumference - (percentage / 100) * circumference

      return (
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                filter: `drop-shadow(0 0 6px ${color}40)`
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      )
    }
    
    return MemoizedProgressCircle
  }, [])

  return (
    <div className={cn("bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-4", className)}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-2">
          Critérios de Conclusão
        </h3>
        <p className="text-gray-400 text-sm">
          Complete todos os critérios para concluir a aula
        </p>
      </div>

      {/* Overall Progress */}
      <div className="text-center py-3">
        <div className="relative inline-block">
          <ProgressCircle 
            percentage={overallProgress} 
            size={80} 
            strokeWidth={6}
            color={canComplete ? '#22c55e' : '#d400ff'}
          />
          {canComplete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-sm">✓</span>
            </motion.div>
          )}
        </div>
        <div className="mt-3">
          <div className="text-lg font-bold text-white">
            {completedCount} de {totalCount} critérios
          </div>
          <div className="text-sm text-gray-400">
            {Math.round(overallProgress)}% concluído
          </div>
          {timeRemaining && (
            <div className="text-xs text-gray-500 mt-1">
              {timeRemaining}
            </div>
          )}
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-2">
        {criteria.map((criterion) => (
          <motion.div
            key={criterion.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all duration-300",
              criterion.isCompleted 
                ? "bg-green-500/20 border-green-500/30 text-green-100" 
                : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50",
              onCriterionClick && "cursor-pointer hover:bg-gray-700/50"
            )}
            onClick={() => onCriterionClick?.(criterion)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon and Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                {criterion.icon}
              </div>
              <ProgressCircle 
                percentage={criterion.progress} 
                size={32} 
                strokeWidth={2}
                color={criterion.color}
              />
            </div>
            
            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  {criterion.name}
                </span>
                {criterion.isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {criterion.description}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="text-right">
              <div className="text-xs font-medium text-white">
                {Math.round(criterion.progress)}%
              </div>
              <div className="text-xs text-gray-400">
                {criterion.isCompleted ? 'Concluído' : 'Pendente'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Complete Button */}
      {showCompleteButton && canComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t border-gray-700/50"
        >
          <button
            onClick={onCompleteClick}
            className="w-full relative group px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>✓</span>
              Concluir Aula
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-active:opacity-100 transition-opacity duration-100" />
          </button>
        </motion.div>
      )}

      {/* Encouragement Message */}
      {!canComplete && (
        <div className="text-center py-2">
          <p className="text-sm text-gray-400">
            Continue trabalhando nos critérios restantes
          </p>
          {criteria.some(c => !c.isCompleted) && (
            <p className="text-xs text-gray-500 mt-1">
              Próximo: {criteria.find(c => !c.isCompleted)?.name}
            </p>
          )}
        </div>
      )}

      {/* Celebration Effect */}
      {canComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-4 left-4 text-2xl animate-bounce">🎉</div>
          <div className="absolute top-4 right-4 text-2xl animate-bounce delay-100">🎊</div>
          <div className="absolute bottom-4 left-4 text-2xl animate-bounce delay-200">⭐</div>
          <div className="absolute bottom-4 right-4 text-2xl animate-bounce delay-300">🏆</div>
        </motion.div>
      )}
    </div>
  )
}