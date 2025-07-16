'use client'

import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Clock, 
  FileText, 
  ClipboardText, 
  Target, 
  CheckCircle,
  Warning,
  X
} from '@phosphor-icons/react'
import { ProgressState } from '@/hooks/useEnhancedProgressCalculation'

interface ProgressIndicatorProps {
  icon: 'time' | 'pdf' | 'exercises' | 'quiz'
  label: string
  progress: number
  isCompleted: boolean
  color: string
  detail?: string
  onClick?: () => void
  className?: string
  state?: ProgressState
  showPulse?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const ICON_MAP = {
  time: Clock,
  pdf: FileText,
  exercises: ClipboardText,
  quiz: Target
}

const STATE_COLORS = {
  not_started: 'rgba(255,255,255,0.3)',
  in_progress: '#f59e0b',
  completed: '#22c55e',
  failed: '#ef4444'
}

const SIZE_CONFIG = {
  sm: { circle: 24, stroke: 2, icon: 'w-3 h-3' },
  md: { circle: 32, stroke: 2, icon: 'w-4 h-4' },
  lg: { circle: 40, stroke: 3, icon: 'w-5 h-5' }
}

/**
 * Enhanced ProgressIndicator - Individual progress indicator with advanced visual states
 * 
 * Features:
 * - Enhanced visual states (not_started, in_progress, completed, failed)
 * - Smooth progress animations with easing
 * - Pulse animations for active states
 * - Multiple sizes (sm, md, lg)
 * - State-based colors and icons
 * - Improved accessibility
 */
const ProgressIndicatorComponent = ({
  icon,
  label,
  progress,
  isCompleted,
  color,
  detail,
  onClick,
  className,
  state = 'not_started',
  showPulse = false,
  size = 'md'
}: ProgressIndicatorProps) => {
  const IconComponent = ICON_MAP[icon]
  const sizeConfig = SIZE_CONFIG[size]
  const radius = (sizeConfig.circle - sizeConfig.stroke * 2) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Determine colors based on state
  const getStateColor = () => {
    if (isCompleted) return STATE_COLORS.completed
    if (state === 'failed') return STATE_COLORS.failed
    if (state === 'in_progress') return STATE_COLORS.in_progress
    return color
  }

  // Get appropriate icon based on state
  const getStateIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-400" weight="fill" />
    }
    if (state === 'failed') {
      return <X className="w-4 h-4 text-red-400" weight="bold" />
    }
    return (
      <IconComponent 
        className="w-4 h-4" 
        weight="duotone"
        style={{ color: getStateColor() }}
      />
    )
  }

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300",
        onClick && "cursor-pointer hover:bg-white/5",
        isCompleted && "bg-green-500/10 border border-green-500/20",
        state === 'failed' && "bg-red-500/10 border border-red-500/20",
        state === 'in_progress' && "bg-amber-500/10 border border-amber-500/20",
        !isCompleted && state !== 'failed' && "hover:bg-white/5",
        className
      )}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      role="button"
      tabIndex={onClick ? 0 : -1}
      aria-label={`${label}: ${isCompleted ? 'Concluído' : `${Math.round(progress)}% completo`}`}
    >
      {/* Progress Circle */}
      <div className="relative">
        <svg width={sizeConfig.circle} height={sizeConfig.circle} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={sizeConfig.circle / 2}
            cy={sizeConfig.circle / 2}
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={sizeConfig.stroke}
            fill="transparent"
          />
          
          {/* Progress circle with enhanced animations */}
          <motion.circle
            cx={sizeConfig.circle / 2}
            cy={sizeConfig.circle / 2}
            r={radius}
            stroke={getStateColor()}
            strokeWidth={sizeConfig.stroke}
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ 
              strokeDashoffset,
              stroke: getStateColor()
            }}
            transition={{ 
              strokeDashoffset: { duration: 0.8, ease: "easeInOut" },
              stroke: { duration: 0.3 }
            }}
            style={{
              filter: `drop-shadow(0 0 6px ${getStateColor()}40)`,
              ...(showPulse && state === 'in_progress' && {
                animation: 'pulse 2s infinite'
              })
            }}
          />
        </svg>
        
        {/* Icon with state-based rendering */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${state}-${isCompleted}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {getStateIcon()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Completion celebration effect */}
        {isCompleted && (
          <motion.div
            className="absolute -inset-2 rounded-full border-2 border-green-400/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: [0, 1, 0] }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        )}
      </div>

      {/* Enhanced Label with state indication */}
      <motion.span 
        className={cn(
          "hidden sm:block text-xs font-medium text-center transition-colors duration-300",
          isCompleted && "text-green-300",
          state === 'failed' && "text-red-300",
          state === 'in_progress' && "text-amber-300",
          state === 'not_started' && "text-gray-400"
        )}
        animate={{ 
          color: isCompleted ? '#86efac' : 
                state === 'failed' ? '#fca5a5' :
                state === 'in_progress' ? '#fcd34d' : '#9ca3af'
        }}
      >
        {label}
      </motion.span>

      {/* Enhanced Detail with progress indication */}
      {detail && (
        <motion.span 
          className={cn(
            "hidden lg:block text-xs text-center transition-colors duration-300",
            isCompleted && "text-green-400",
            state === 'failed' && "text-red-400", 
            state === 'in_progress' && "text-amber-400",
            state === 'not_started' && "text-gray-500"
          )}
          animate={{ opacity: 1 }}
        >
          {detail}
        </motion.span>
      )}

      {/* Enhanced Mobile tooltip */}
      <div className="sm:hidden absolute -top-14 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-10">
        <div className="text-center">
          <div className="font-medium">{label}</div>
          <div className="text-gray-300">
            {isCompleted ? 'Concluído' : 
             state === 'failed' ? 'Falhou' :
             state === 'in_progress' ? `${Math.round(progress)}% - Em progresso` :
             detail || `${Math.round(progress)}%`}
          </div>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800/90"></div>
      </div>
    </motion.div>
  )
}

// Export memoized component
const MemoizedProgressIndicator = memo(ProgressIndicatorComponent)
MemoizedProgressIndicator.displayName = 'ProgressIndicator'
export const ProgressIndicator = MemoizedProgressIndicator