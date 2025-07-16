'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Clock, 
  FileText, 
  BookOpen, 
  Question, 
  CheckCircle 
} from 'phosphor-react'

interface ProgressIndicatorProps {
  icon: 'time' | 'pdf' | 'exercises' | 'quiz'
  label: string
  progress: number
  isCompleted: boolean
  color: string
  detail?: string
  onClick?: () => void
  className?: string
}

const ICON_MAP = {
  time: Clock,
  pdf: FileText,
  exercises: BookOpen,
  quiz: Question
}

/**
 * ProgressIndicator - Individual progress indicator for lesson criteria
 * 
 * Features:
 * - Phosphor React icons with duotone weight
 * - Circular progress visualization
 * - Brand colors for different criteria
 * - Responsive design with different sizes
 * - Smooth animations and hover effects
 * - Completion state with checkmark
 */
const ProgressIndicatorComponent = ({
  icon,
  label,
  progress,
  isCompleted,
  color,
  detail,
  onClick,
  className
}: ProgressIndicatorProps) => {
  const IconComponent = ICON_MAP[icon]
  const size = 32
  const strokeWidth = 2
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
        onClick && "cursor-pointer hover:bg-white/5",
        isCompleted && "bg-green-500/10 border border-green-500/20",
        !isCompleted && "hover:bg-white/5",
        className
      )}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      {/* Progress Circle */}
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
            stroke={isCompleted ? "#22c55e" : color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              filter: `drop-shadow(0 0 4px ${isCompleted ? "#22c55e" : color}30)`
            }}
          />
        </svg>
        
        {/* Icon or checkmark */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isCompleted ? (
            <CheckCircle 
              className="w-4 h-4 text-green-400" 
              weight="duotone" 
            />
          ) : (
            <IconComponent 
              className="w-4 h-4" 
              weight="duotone"
              style={{ color }}
            />
          )}
        </div>
      </div>

      {/* Label - Hidden on mobile, visible on larger screens */}
      <span className="hidden sm:block text-xs text-gray-300 font-medium text-center">
        {label}
      </span>

      {/* Detail - Hidden on mobile and small tablets */}
      {detail && (
        <span className="hidden lg:block text-xs text-gray-400 text-center">
          {detail}
        </span>
      )}

      {/* Mobile tooltip on hover/focus */}
      <div className="sm:hidden absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
        {label}: {detail || `${Math.round(progress)}%`}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </motion.div>
  )
}

// Export memoized component
const MemoizedProgressIndicator = memo(ProgressIndicatorComponent)
MemoizedProgressIndicator.displayName = 'ProgressIndicator'
export const ProgressIndicator = MemoizedProgressIndicator