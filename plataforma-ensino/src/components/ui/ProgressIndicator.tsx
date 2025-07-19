import React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressIndicatorProps {
  /** Full label text (e.g., "Vídeo") */
  label: string
  /** Short label text for compact display (e.g., "V") */
  shortLabel: string
  /** Progress percentage (0-100) */
  progress: number
  /** Progress bar color variant */
  variant?: 'video' | 'material' | 'exercise' | 'default'
  /** Force compact mode regardless of screen size */
  compact?: boolean
  /** Additional CSS classes */
  className?: string
}

const variantColors = {
  video: {
    bg: 'bg-primary-100',
    fill: 'bg-primary-500',
    text: 'text-primary-700'
  },
  material: {
    bg: 'bg-secondary-100', 
    fill: 'bg-secondary-500',
    text: 'text-secondary-700'
  },
  exercise: {
    bg: 'bg-accent-100',
    fill: 'bg-accent-500', 
    text: 'text-accent-700'
  },
  default: {
    bg: 'bg-gray-100',
    fill: 'bg-gray-500',
    text: 'text-gray-700'
  }
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  label,
  shortLabel,
  progress,
  variant = 'default',
  compact = false,
  className
}) => {
  const colors = variantColors[variant]
  const clampedProgress = Math.max(0, Math.min(100, progress))
  
  return (
    <div className={cn(
      'flex items-center gap-2 min-w-0',
      className
    )}>
      {/* Label - responsive visibility */}
      <span className={cn(
        'text-sm font-medium whitespace-nowrap',
        colors.text,
        compact ? 'block' : 'hidden header-lg:block'
      )}>
        {compact ? shortLabel : label}
      </span>
      
      {/* Short label for medium screens */}
      <span className={cn(
        'text-sm font-medium whitespace-nowrap header-md:hidden header-lg:hidden',
        colors.text,
        compact ? 'hidden' : 'block'
      )}>
        {shortLabel}
      </span>
      
      {/* Progress bar */}
      <div className={cn(
        'relative h-2 flex-1 min-w-[40px] max-w-[80px] overflow-hidden rounded-full',
        colors.bg
      )}>
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            colors.fill
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      
      {/* Percentage - hidden on very small screens */}
      <span className={cn(
        'text-xs font-semibold tabular-nums whitespace-nowrap',
        colors.text,
        'hidden header-sm:block'
      )}>
        {Math.round(clampedProgress)}%
      </span>
    </div>
  )
}

export default ProgressIndicator