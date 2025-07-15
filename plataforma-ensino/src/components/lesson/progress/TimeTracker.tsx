'use client'

import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTimeTracker } from '@/hooks/useTimeTracker'

interface TimeTrackerProps {
  className?: string
  onMinimumReached?: () => void
  minimumTimeMinutes?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

/**
 * TimeTracker - Visual time tracking component with circular progress
 * 
 * Features:
 * - Circular progress ring with gradient
 * - Animated milestone indicators
 * - Visual feedback when minimum time reached
 * - Responsive sizing
 * - Shimmer effect on completion
 */
const TimeTrackerComponent = ({ 
  className,
  onMinimumReached,
  minimumTimeMinutes = 25,
  size = 'md',
  showLabel = true
}: TimeTrackerProps) => {
  const {
    timeSpent,
    isActive,
    hasReachedMinimum,
    formattedTime,
    progressPercentage,
    remainingTime,
    formattedRemainingTime
  } = useTimeTracker({
    minimumTimeMinutes,
    onMinimumReached,
    onTimeUpdate: (timeSpent) => {
      // This will be called every second with the current time spent
      // Parent components can listen to this if needed
    }
  })

  // Size configurations
  const sizeConfig = {
    sm: { radius: 40, strokeWidth: 4, textSize: 'text-xs' },
    md: { radius: 60, strokeWidth: 6, textSize: 'text-sm' },
    lg: { radius: 80, strokeWidth: 8, textSize: 'text-base' }
  }

  const { radius, strokeWidth, textSize } = sizeConfig[size]
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  // Milestone markers (every 5 minutes)
  const milestones = Array.from({ length: Math.ceil(minimumTimeMinutes / 5) }, (_, i) => (i + 1) * 5)

  return (
    <div className={cn("relative flex flex-col items-center gap-3", className)}>
      {/* Circular Progress */}
      <div className="relative">
        <svg 
          width={radius * 2 + strokeWidth * 2} 
          height={radius * 2 + strokeWidth * 2} 
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Milestone markers */}
          {milestones.map((milestone, index) => {
            const angle = (milestone / minimumTimeMinutes) * 360 - 90
            const x1 = (radius + strokeWidth) + (radius - 8) * Math.cos(angle * Math.PI / 180)
            const y1 = (radius + strokeWidth) + (radius - 8) * Math.sin(angle * Math.PI / 180)
            const x2 = (radius + strokeWidth) + (radius - 4) * Math.cos(angle * Math.PI / 180)
            const y2 = (radius + strokeWidth) + (radius - 4) * Math.sin(angle * Math.PI / 180)
            
            return (
              <line
                key={milestone}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
            )
          })}
          
          {/* Progress circle */}
          <motion.circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="url(#timeGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              filter: hasReachedMinimum 
                ? 'drop-shadow(0 0 12px #22c55e)' 
                : 'drop-shadow(0 0 8px #d400ff)'
            }}
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={hasReachedMinimum ? "#22c55e" : "#d400ff"} />
              <stop offset="50%" stopColor={hasReachedMinimum ? "#16a34a" : "#00c4ff"} />
              <stop offset="100%" stopColor={hasReachedMinimum ? "#15803d" : "#8b5cf6"} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div 
              className={cn("font-bold text-white", textSize)}
              animate={hasReachedMinimum ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {formattedTime}
            </motion.div>
            <div className={cn("text-gray-400", size === 'lg' ? 'text-xs' : 'text-[10px]')}>
              {hasReachedMinimum ? 'Completo!' : `${Math.round(progressPercentage)}%`}
            </div>
          </div>
        </div>

        {/* Completion animation */}
        <AnimatePresence>
          {hasReachedMinimum && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="text-green-400 text-2xl">✨</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activity indicator */}
        <div className={cn(
          "absolute -top-1 -right-1 w-3 h-3 rounded-full",
          isActive ? "bg-green-400 animate-pulse" : "bg-gray-600"
        )} />
      </div>

      {/* Label and status */}
      {showLabel && (
        <div className="text-center">
          <div className="flex items-center gap-2 text-white font-medium">
            <span>⏱️</span>
            <span>Tempo na Aula</span>
          </div>
          
          <motion.div 
            className={cn(
              "text-xs mt-1",
              hasReachedMinimum ? "text-green-400" : "text-gray-400"
            )}
            animate={hasReachedMinimum ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {hasReachedMinimum ? (
              <span className="flex items-center gap-1">
                <span>✅</span>
                <span>Tempo mínimo atingido!</span>
              </span>
            ) : (
              <span>Faltam {formattedRemainingTime} para o mínimo</span>
            )}
          </motion.div>
        </div>
      )}

      {/* Shimmer effect on completion */}
      <AnimatePresence>
        {hasReachedMinimum && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(34, 197, 94, 0.3), transparent, rgba(34, 197, 94, 0.3), transparent)',
            }}
            animate={{ 
              rotate: 360,
              opacity: [0, 0.5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

TimeTrackerComponent.displayName = 'TimeTracker'

// Memoize to prevent unnecessary re-renders
export const TimeTracker = memo(TimeTrackerComponent)