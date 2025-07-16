'use client'

import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCompletionCriteria } from '@/hooks/useCompletionCriteria'
import { LessonProgressData } from '@/types/lesson'

interface CompletionCriteriaProps {
  progressData: LessonProgressData | null
  timeSpent: number
  className?: string
  minimumTimeMinutes?: number
  minimumQuizScore?: number
  onCriteriaChange?: (canComplete: boolean) => void
}

/**
 * CompletionCriteria - Visual dashboard showing lesson completion requirements
 * 
 * Features:
 * - Beautiful criteria cards with progress indicators
 * - Real-time status updates
 * - Animated completions
 * - Magic UI styling
 * - Responsive layout
 */
const CompletionCriteriaComponent = ({
  progressData,
  timeSpent,
  className,
  minimumTimeMinutes = 25,
  minimumQuizScore = 70,
  onCriteriaChange
}: CompletionCriteriaProps) => {
  const {
    criteria,
    overallProgress,
    canComplete,
    completedCount,
    totalCount
  } = useCompletionCriteria({
    minimumTimeMinutes,
    minimumQuizScore,
    onCriteriaUpdated: (state) => {
      onCriteriaChange?.(state.canComplete)
    }
  })

  // Update progress data
  React.useEffect(() => {
    if (progressData) {
      // This would normally be handled by the hook, but we need to pass the data
    }
  }, [progressData])

  // Progress circle component
  const ProgressCircle = ({ percentage, size = 32, color = '#d400ff' }: {
    percentage: number
    size?: number 
    color?: string
  }) => {
    const radius = (size - 4) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${circumference} ${circumference}`
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              filter: `drop-shadow(0 0 4px ${color}40)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        "completion-criteria bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🎯</span>
            <span>Critérios de Conclusão</span>
          </h3>
          <div className="text-sm text-gray-300">
            {completedCount}/{totalCount}
          </div>
        </div>
        
        {/* Overall progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {overallProgress}% do progresso total
        </div>
      </div>

      {/* Criteria Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {criteria.map((criterion, index) => (
          <motion.div
            key={criterion.id}
            className={cn(
              "criterion-card relative p-4 rounded-xl border transition-all duration-300",
              "bg-gradient-to-br from-white/5 to-white/[0.02]",
              criterion.isCompleted
                ? "border-green-500/50 bg-green-500/10"
                : "border-white/10 hover:border-white/20"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Completion glow effect */}
            {criterion.isCompleted && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-green-500/20 blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{criterion.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {criterion.name}
                    </div>
                    {criterion.isCompleted && (
                      <motion.div
                        className="text-xs text-green-400"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        ✅ Concluído
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <ProgressCircle 
                  percentage={criterion.progress} 
                  color={criterion.color}
                />
              </div>

              {/* Description */}
              <div className="text-xs text-gray-400 mb-2">
                {criterion.description}
              </div>

              {/* Progress details */}
              <div className="flex items-center justify-between text-xs">
                <span className={cn(
                  "font-medium",
                  criterion.isCompleted ? "text-green-400" : "text-gray-300"
                )}>
                  {criterion.id === 'time' && (
                    <span>{Math.floor(timeSpent / 60)}min de {minimumTimeMinutes}min</span>
                  )}
                  {criterion.id === 'quiz' && (
                    <span>{Math.round(criterion.progress)}% de {minimumQuizScore}%</span>
                  )}
                  {criterion.id === 'exercises' && (
                    <span>{Math.round(criterion.progress)}% completo</span>
                  )}
                  {criterion.id === 'pdf' && (
                    <span>{Math.round(criterion.progress)}% lido</span>
                  )}
                </span>
                
                {criterion.isCompleted && (
                  <motion.span
                    className="text-green-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    ✨
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Status */}
      <AnimatePresence>
        {canComplete ? (
          <motion.div
            className="completion-ready text-center p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🎉</span>
              <span className="text-lg font-bold text-green-400">
                Pronto para concluir!
              </span>
            </div>
            <div className="text-sm text-green-300">
              Todos os critérios foram atendidos. Você pode finalizar a aula agora.
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="completion-pending text-center p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-yellow-300 mb-1">
              Continue progredindo para concluir a aula
            </div>
            <div className="text-xs text-gray-400">
              {totalCount - completedCount} critério{totalCount - completedCount !== 1 ? 's' : ''} restante{totalCount - completedCount !== 1 ? 's' : ''}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

CompletionCriteriaComponent.displayName = 'CompletionCriteria'

export const CompletionCriteria = memo(CompletionCriteriaComponent)