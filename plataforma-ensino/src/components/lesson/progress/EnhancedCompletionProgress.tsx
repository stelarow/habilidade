'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useEnhancedProgressCalculation } from '@/hooks/useEnhancedProgressCalculation'
import { LessonProgressData } from '@/types/lesson'
import { 
  Clock, 
  FileText, 
  ClipboardText, 
  Target, 
  CheckCircle,
  Trophy,
  Sparkle
} from '@phosphor-icons/react'

interface EnhancedCompletionProgressProps {
  progressData: LessonProgressData | null
  className?: string
  onCompleteClick?: () => void
  showCompleteButton?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const CRITERION_ICONS = {
  time: Clock,
  pdf: FileText,
  exercises: ClipboardText,
  quiz: Target
}

const CRITERION_COLORS = {
  time: '#f59e0b',
  pdf: '#00c4ff', 
  exercises: '#ef4444',
  quiz: '#22c55e'
}

/**
 * EnhancedCompletionProgress - Advanced completion progress component
 * 
 * Features:
 * - Integration with enhanced progress calculation
 * - Smooth animations and state transitions
 * - Visual celebration effects
 * - Responsive design with multiple sizes
 * - Interactive criterion items with hover effects
 * - Progress milestone indicators
 * - Time estimation and completion predictions
 */
export function EnhancedCompletionProgress({
  progressData,
  className,
  onCompleteClick,
  showCompleteButton = true,
  size = 'md'
}: EnhancedCompletionProgressProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [completionJustAchieved, setCompletionJustAchieved] = useState(false)
  
  // Enhanced progress calculation
  const progress = useEnhancedProgressCalculation(progressData)
  
  // Size configurations
  const sizeConfig = {
    sm: { 
      mainCircle: 60, 
      criterionCircle: 24, 
      strokeWidth: 4,
      text: 'text-sm',
      spacing: 'space-y-2'
    },
    md: { 
      mainCircle: 80, 
      criterionCircle: 32, 
      strokeWidth: 6,
      text: 'text-base',
      spacing: 'space-y-3'
    },
    lg: { 
      mainCircle: 100, 
      criterionCircle: 40, 
      strokeWidth: 8,
      text: 'text-lg',
      spacing: 'space-y-4'
    }
  }
  
  const config = sizeConfig[size]
  
  // Handle completion celebration
  useEffect(() => {
    if (progress.overallProgress.isCompleted && !showCelebration) {
      setCompletionJustAchieved(true)
      setShowCelebration(true)
      
      // Reset celebration flag after animation
      const timer = setTimeout(() => {
        setCompletionJustAchieved(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [progress.overallProgress.isCompleted, showCelebration])
  
  // Progress circle component with enhanced animations
  const ProgressCircle = useMemo(() => {
    const MemoizedProgressCircle = ({ 
      percentage, 
      size = config.criterionCircle, 
      strokeWidth = 3, 
      color = '#d400ff',
      showPulse = false,
      isCompleted = false
    }: {
      percentage: number
      size?: number
      strokeWidth?: number
      color?: string
      showPulse?: boolean
      isCompleted?: boolean
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
              stroke={isCompleted ? '#22c55e' : color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ 
                strokeDashoffset,
                stroke: isCompleted ? '#22c55e' : color
              }}
              transition={{ 
                strokeDashoffset: { duration: 1, ease: "easeInOut" },
                stroke: { duration: 0.5 }
              }}
              style={{
                filter: `drop-shadow(0 0 8px ${isCompleted ? '#22c55e' : color}40)`,
                ...(showPulse && {
                  animation: 'pulse 2s infinite'
                })
              }}
            />
            {/* Completion glow effect */}
            {isCompleted && (
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius + 2}
                stroke="#22c55e"
                strokeWidth={1}
                fill="transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.2, 1.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CheckCircle className="w-4 h-4 text-green-400" weight="duotone" />
              </motion.div>
            ) : (
              <span className="text-xs font-bold text-white">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </div>
      )
    }
    
    return MemoizedProgressCircle
  }, [config.criterionCircle])

  // Criteria data with enhanced information
  const criteriaData = useMemo(() => [
    {
      id: 'time',
      name: 'Tempo de Estudo',
      description: `Assista por pelo menos ${progress.timeProgress.requiredMinutes} minutos`,
      icon: CRITERION_ICONS.time,
      color: CRITERION_COLORS.time,
      progress: progress.timeProgress.percentage,
      isCompleted: progress.timeProgress.isCompleted,
      state: progress.timeProgress.state,
      detail: progress.timeProgress.formatted
    },
    {
      id: 'pdf',
      name: 'Material de Estudo',
      description: 'Leia todo o material PDF disponível',
      icon: CRITERION_ICONS.pdf,
      color: CRITERION_COLORS.pdf,
      progress: progress.pdfProgress.percentage,
      isCompleted: progress.pdfProgress.isCompleted,
      state: progress.pdfProgress.state,
      detail: `${Math.round(progress.pdfProgress.percentage)}%`
    },
    {
      id: 'exercises',
      name: 'Exercícios Práticos',
      description: 'Complete todos os exercícios propostos',
      icon: CRITERION_ICONS.exercises,
      color: CRITERION_COLORS.exercises,
      progress: progress.exerciseProgress.percentage,
      isCompleted: progress.exerciseProgress.isCompleted,
      state: progress.exerciseProgress.state,
      detail: `${progress.exerciseProgress.completed}/${progress.exerciseProgress.total}`
    },
    {
      id: 'quiz',
      name: 'Avaliação',
      description: 'Obtenha pelo menos 70% no teste',
      icon: CRITERION_ICONS.quiz,
      color: CRITERION_COLORS.quiz,
      progress: progress.quizProgress.score,
      isCompleted: progress.quizProgress.isPassed,
      state: progress.quizProgress.state,
      detail: progress.quizProgress.score > 0 ? `${progress.quizProgress.score}%` : 'Não iniciado'
    }
  ], [progress])

  return (
    <div className={cn(
      "relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 overflow-hidden",
      config.spacing,
      className
    )}>
      {/* Celebration Background Effect */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Animated background particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                initial={{ 
                  x: '50%', 
                  y: '50%', 
                  scale: 0,
                  opacity: 0
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          className="flex items-center justify-center gap-2 mb-2"
          animate={completionJustAchieved ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.6 }}
        >
          <Trophy className="w-5 h-5 text-yellow-400" weight="duotone" />
          <h3 className={cn("font-bold text-white", config.text)}>
            {progress.overallProgress.isCompleted ? 'Aula Concluída!' : 'Critérios de Conclusão'}
          </h3>
          {progress.overallProgress.isCompleted && (
            <Sparkle className="w-5 h-5 text-yellow-400" weight="duotone" />
          )}
        </motion.div>
        <p className="text-gray-400 text-sm">
          {progress.overallProgress.isCompleted 
            ? progress.visualStates.completionMessage
            : 'Complete todos os critérios para concluir a aula'
          }
        </p>
      </div>

      {/* Overall Progress Circle */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <ProgressCircle 
            percentage={progress.overallProgress.percentage} 
            size={config.mainCircle} 
            strokeWidth={config.strokeWidth}
            color={progress.visualStates.progressColor}
            isCompleted={progress.overallProgress.isCompleted}
            showPulse={progress.overallProgress.percentage > 0 && !progress.overallProgress.isCompleted}
          />
          
          {/* Completion badge */}
          {progress.overallProgress.isCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <CheckCircle className="w-5 h-5 text-white" weight="bold" />
            </motion.div>
          )}
        </div>
        
        <div className="mt-4">
          <motion.div 
            className={cn("font-bold text-white", config.text)}
            animate={completionJustAchieved ? { scale: [1, 1.2, 1] } : {}}
          >
            {progress.overallProgress.completedCriteria} de {progress.overallProgress.totalCriteria} critérios
          </motion.div>
          <div className="text-sm text-gray-400 mt-1">
            {Math.round(progress.overallProgress.percentage)}% concluído
          </div>
        </div>
      </div>

      {/* Criteria List */}
      <div className={cn("grid gap-3", config.spacing)}>
        {criteriaData.map((criterion, index) => {
          const IconComponent = criterion.icon
          
          return (
            <motion.div
              key={criterion.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border transition-all duration-300",
                criterion.isCompleted 
                  ? "bg-green-500/20 border-green-500/30" 
                  : criterion.state === 'in_progress'
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Icon and Progress Circle */}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  criterion.isCompleted 
                    ? "bg-green-500/20" 
                    : criterion.state === 'in_progress'
                    ? "bg-amber-500/20"
                    : "bg-gray-700/50"
                )}>
                  <IconComponent 
                    className="w-5 h-5" 
                    weight="duotone"
                    style={{ color: criterion.isCompleted ? '#22c55e' : criterion.color }}
                  />
                </div>
                <ProgressCircle 
                  percentage={criterion.progress} 
                  size={config.criterionCircle} 
                  strokeWidth={2}
                  color={criterion.color}
                  isCompleted={criterion.isCompleted}
                  showPulse={criterion.state === 'in_progress'}
                />
              </div>
              
              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">
                    {criterion.name}
                  </span>
                  {criterion.isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {criterion.description}
                </p>
              </div>

              {/* Progress Detail */}
              <div className="text-right">
                <div className={cn(
                  "text-xs font-medium",
                  criterion.isCompleted ? "text-green-400" : "text-white"
                )}>
                  {criterion.detail}
                </div>
                <div className={cn(
                  "text-xs",
                  criterion.isCompleted ? "text-green-300" : 
                  criterion.state === 'in_progress' ? "text-amber-400" : "text-gray-400"
                )}>
                  {criterion.isCompleted ? 'Concluído' : 
                   criterion.state === 'in_progress' ? 'Em progresso' : 'Pendente'}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Complete Button */}
      {showCompleteButton && progress.visualStates.showCompletionButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-4 border-t border-gray-700/50"
        >
          <motion.button
            onClick={onCompleteClick}
            className="w-full relative group px-6 py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Trophy className="w-5 h-5" weight="duotone" />
              Concluir Aula
              <Sparkle className="w-5 h-5" weight="duotone" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div 
              className="absolute inset-0 bg-white/20 rounded-lg opacity-0"
              whileTap={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            />
          </motion.button>
        </motion.div>
      )}

      {/* Progress Milestones */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex justify-center items-center space-x-6">
          <span className="text-xs text-gray-400">Marcos:</span>
          {[25, 50, 75, 100].map((milestone) => (
            <motion.div
              key={milestone}
              className="flex flex-col items-center space-y-1"
            >
              <motion.div
                className={cn(
                  "w-3 h-3 rounded-full border-2 transition-all duration-300",
                  progress.overallProgress.percentage >= milestone
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 border-purple-400 shadow-lg"
                    : "bg-transparent border-gray-600"
                )}
                animate={{
                  scale: progress.overallProgress.percentage >= milestone ? [1, 1.3, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              />
              <span className="text-xs text-gray-400">{milestone}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Encouragement Message */}
      {!progress.overallProgress.isCompleted && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            {progress.visualStates.completionMessage}
          </p>
          {criteriaData.some(c => !c.isCompleted) && (
            <p className="text-xs text-gray-500 mt-1">
              Próximo: {criteriaData.find(c => !c.isCompleted)?.name}
            </p>
          )}
        </div>
      )}
    </div>
  )
}