'use client'

import React, { useState, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Clock, CheckCircle, BookOpen, FileText, Play, Question } from 'phosphor-react'

interface CompletionCriterion {
  id: string
  name: string
  isCompleted: boolean
  progress: number
  icon: React.ReactNode
  color: string
  required: boolean
}

interface CompactProgressHeaderProps {
  criteria: CompletionCriterion[]
  overallProgress: number
  canComplete: boolean
  completedCount: number
  totalCount: number
  timeRemaining?: string
  currentTime?: string
  className?: string
  onSectionClick?: (sectionId: string) => void
}

/**
 * CompactProgressHeader - Header compacto com progresso dos critérios
 * 
 * Features:
 * - Layout horizontal compacto
 * - Indicadores de progresso circulares pequenos
 * - Informações essenciais em formato de header
 * - Animations suaves
 * - Visual sofisticado e não intrusivo
 */
const CompactProgressHeaderComponent = ({
  criteria,
  overallProgress,
  canComplete,
  completedCount,
  totalCount,
  timeRemaining,
  currentTime,
  className,
  onSectionClick
}: CompactProgressHeaderProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Memoized mini progress circle component
  const MiniProgressCircle = useMemo(() => {
    const MemoizedMiniProgressCircle = memo(({ percentage, size = 32, strokeWidth = 2, color = '#d400ff', isCompleted = false }: {
      percentage: number
      size?: number
      strokeWidth?: number
      color?: string
      isCompleted?: boolean
    }) => {
      const radius = (size - strokeWidth) / 2
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
              strokeWidth={strokeWidth}
              fill="transparent"
            />
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
                filter: `drop-shadow(0 0 4px ${color}30)`
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isCompleted ? (
              <CheckCircle className="w-4 h-4 text-green-400" weight="fill" />
            ) : (
              <span className="text-[10px] font-bold text-white">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </div>
      )
    })
    
    MemoizedMiniProgressCircle.displayName = 'MiniProgressCircle'
    return MemoizedMiniProgressCircle
  }, [])

  const handleSectionClick = useCallback((sectionId: string) => {
    onSectionClick?.(sectionId)
    
    // Scroll to section
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [onSectionClick])

  return (
    <div className={cn("sticky top-0 z-50 backdrop-blur-xl bg-gray-900/90 border-b border-gray-800/50", className)}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Progress Overview */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MiniProgressCircle 
                percentage={overallProgress} 
                size={36} 
                strokeWidth={3}
                color={canComplete ? "#22c55e" : "#d400ff"}
                isCompleted={canComplete}
              />
              <div className="flex flex-col">
                <div className="text-sm font-semibold text-white">
                  {Math.round(overallProgress)}% Concluído
                </div>
                <div className="text-xs text-gray-400">
                  {completedCount} de {totalCount} critérios
                </div>
              </div>
            </div>

            {/* Time info */}
            {(timeRemaining || currentTime) && (
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4" />
                <span>{currentTime || timeRemaining}</span>
              </div>
            )}
          </div>

          {/* Center - Criteria Status */}
          <div className="flex items-center gap-3">
            {criteria.map((criterion) => (
              <motion.button
                key={criterion.id}
                onClick={() => handleSectionClick(criterion.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                  "hover:bg-white/5 cursor-pointer",
                  criterion.isCompleted ? "bg-green-500/10 border border-green-500/20" : "bg-gray-800/50 border border-gray-700/50"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{criterion.icon}</span>
                  <MiniProgressCircle 
                    percentage={criterion.progress} 
                    size={24} 
                    strokeWidth={2}
                    color={criterion.color}
                    isCompleted={criterion.isCompleted}
                  />
                </div>
                <span className="hidden lg:block text-xs text-gray-300">
                  {criterion.name}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Right side - Completion Status */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {canComplete ? (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-green-400" weight="fill" />
                  <span className="text-sm font-semibold text-green-400">
                    Pronto para Concluir
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="not-ready"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    Em Progresso
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expand/Collapse button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
          </div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-800/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {criteria.map((criterion) => (
                  <motion.div
                    key={criterion.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-200",
                      criterion.isCompleted 
                        ? "bg-green-500/10 border-green-500/20" 
                        : "bg-gray-800/50 border-gray-700/50"
                    )}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{criterion.icon}</span>
                      <MiniProgressCircle 
                        percentage={criterion.progress} 
                        size={28} 
                        strokeWidth={2}
                        color={criterion.color}
                        isCompleted={criterion.isCompleted}
                      />
                    </div>
                    <div className="text-sm font-medium text-white mb-1">
                      {criterion.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {criterion.isCompleted ? (
                        <span className="text-green-400">✓ Concluído</span>
                      ) : (
                        <span>{Math.round(criterion.progress)}% completo</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Export memoized component
const MemoizedCompactProgressHeader = memo(CompactProgressHeaderComponent)
MemoizedCompactProgressHeader.displayName = 'CompactProgressHeader'
export const CompactProgressHeader = MemoizedCompactProgressHeader