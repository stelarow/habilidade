'use client'

import React, { useState, useCallback, useEffect, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LessonProgressData } from '@/types/lesson'

interface FloatingProgressMenuProps {
  progress: LessonProgressData
  className?: string
  onNavigate?: (section: string) => void
}

interface NavigationSection {
  id: string
  name: string
  icon: string
  progress: number
  isCompleted: boolean
  color: string
}

/**
 * FloatingProgressMenu - Menu lateral flutuante com progresso e navegação
 * 
 * Features:
 * - Design baseado no menu flutuante das páginas do curso
 * - Sticky positioning que segue o scroll
 * - Magic UI effects (border-beam, magic-card)
 * - Progress bars circulares animadas
 * - Navegação para seções da aula
 * - Backdrop blur e gradientes
 */
const FloatingProgressMenuComponent = ({ 
  progress, 
  className, 
  onNavigate 
}: FloatingProgressMenuProps) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Memoize navigation sections calculation to prevent unnecessary re-renders
  const sections: NavigationSection[] = useMemo(() => [
    {
      id: 'video',
      name: 'Vídeo',
      icon: '🎬',
      progress: progress.videoProgress.percentageWatched,
      isCompleted: progress.videoProgress.percentageWatched >= 80,
      color: '#d400ff'
    },
    {
      id: 'pdf',
      name: 'Material PDF',
      icon: '📄',
      progress: progress.pdfProgress.percentageRead,
      isCompleted: progress.pdfProgress.percentageRead >= 90,
      color: '#00c4ff'
    },
    {
      id: 'exercises',
      name: 'Exercícios',
      icon: '📋',
      progress: progress.exerciseProgress.completionPercentage,
      isCompleted: progress.exerciseProgress.completionPercentage >= 100,
      color: '#f59e0b'
    },
    {
      id: 'quiz',
      name: 'Quiz',
      icon: '🧩',
      progress: progress.quizProgress.isCompleted ? 100 : 0,
      isCompleted: progress.quizProgress.isCompleted && progress.quizProgress.isPassed,
      color: progress.quizProgress.isPassed ? '#22c55e' : '#ef4444'
    }
  ], [
    progress.videoProgress.percentageWatched,
    progress.pdfProgress.percentageRead,
    progress.exerciseProgress.completionPercentage,
    progress.quizProgress.isCompleted,
    progress.quizProgress.isPassed
  ])

  const overallProgress = progress.overallProgress.percentageComplete

  const handleSectionClick = useCallback((sectionId: string) => {
    onNavigate?.(sectionId)
    
    // Scroll para a seção correspondente
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [onNavigate])

  // Memoized Progress circle component to prevent unnecessary re-renders
  const ProgressCircle = useMemo(() => {
    const MemoizedProgressCircle = memo(({ percentage, size = 50, strokeWidth = 4, color = '#d400ff' }: {
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
              transition={{ duration: 1, ease: "easeInOut" }}
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
    })
    
    MemoizedProgressCircle.displayName = 'ProgressCircle'
    return MemoizedProgressCircle
  }, [])

  // Magic card effect for the menu container
  const MagicCard = ({ children }: { children: React.ReactNode }) => (
    <div className="relative group">
      {/* Border beam effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Main content */}
      <div className="relative bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {/* Spotlight effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 50%)`
          }}
        />
        {children}
      </div>
    </div>
  )

  // Shimmer button component
  const ShimmerButton = ({ 
    children, 
    onClick, 
    disabled, 
    color 
  }: { 
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
    color: string 
  }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full p-3 rounded-xl text-left transition-all duration-300 overflow-hidden group",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 cursor-pointer"
      )}
      style={{
        background: `linear-gradient(135deg, ${color}20, ${color}10)`
      }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Shimmer effect */}
      {!disabled && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.button>
  )

  return (
    <div className={cn("sticky top-24 z-40", className)}>
      <MagicCard>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <motion.h3 
              className="text-xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Progresso da Aula
            </motion.h3>
            <motion.p 
              className="text-gray-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Acompanhe seu avanço e navegue pelas seções
            </motion.p>
          </div>

          {/* Overall Progress */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ProgressCircle 
              percentage={overallProgress} 
              size={80} 
              strokeWidth={6}
              color="#d400ff"
            />
            <div className="mt-3">
              <div className="text-lg font-bold text-white">
                Progresso Geral
              </div>
              <div className="text-sm text-gray-400">
                {Math.round(overallProgress)}% concluído
              </div>
            </div>
          </motion.div>

          {/* Sections Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Navegar para:</h4>
            
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <ShimmerButton
                  onClick={() => handleSectionClick(section.id)}
                  color={section.color}
                  disabled={false}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{section.icon}</span>
                      <ProgressCircle 
                        percentage={section.progress} 
                        size={32} 
                        strokeWidth={3}
                        color={section.color}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm">
                        {section.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {section.isCompleted ? (
                          <span className="text-green-400 flex items-center gap-1">
                            ✓ Concluído
                          </span>
                        ) : section.progress > 0 ? (
                          <span>{Math.round(section.progress)}% completo</span>
                        ) : (
                          <span>Não iniciado</span>
                        )}
                      </div>
                    </div>

                    {section.isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </div>
                </ShimmerButton>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <motion.div 
            className="pt-4 border-t border-gray-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-white">
                  {sections.filter(s => s.isCompleted).length}
                </div>
                <div className="text-xs text-gray-400">Concluídos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {Math.round(progress.overallProgress.estimatedTimeRemaining)}min
                </div>
                <div className="text-xs text-gray-400">Restante</div>
              </div>
            </div>
          </motion.div>

          {/* Celebration effect */}
          <AnimatePresence>
            {overallProgress >= 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <div className="text-xl font-bold text-white mb-2">
                    Parabéns!
                  </div>
                  <div className="text-sm text-gray-300">
                    Aula concluída com sucesso!
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MagicCard>
    </div>
  )
}

// Export memoized component with custom comparison to prevent unnecessary re-renders
const MemoizedFloatingProgressMenu = memo(FloatingProgressMenuComponent, (prevProps, nextProps) => {
  // Custom comparison to only re-render when progress values actually change
  const prevProgress = prevProps.progress
  const nextProgress = nextProps.progress
  
  return (
    prevProgress.videoProgress.percentageWatched === nextProgress.videoProgress.percentageWatched &&
    prevProgress.pdfProgress.percentageRead === nextProgress.pdfProgress.percentageRead &&
    prevProgress.exerciseProgress.completionPercentage === nextProgress.exerciseProgress.completionPercentage &&
    prevProgress.quizProgress.isCompleted === nextProgress.quizProgress.isCompleted &&
    prevProgress.quizProgress.isPassed === nextProgress.quizProgress.isPassed &&
    prevProgress.overallProgress.percentageComplete === nextProgress.overallProgress.percentageComplete &&
    prevProgress.overallProgress.estimatedTimeRemaining === nextProgress.overallProgress.estimatedTimeRemaining &&
    prevProps.className === nextProps.className
  )
})

MemoizedFloatingProgressMenu.displayName = 'FloatingProgressMenu'
export const FloatingProgressMenu = MemoizedFloatingProgressMenu