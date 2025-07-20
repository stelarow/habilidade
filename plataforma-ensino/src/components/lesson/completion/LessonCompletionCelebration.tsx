'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Trophy, Star, CheckCircle } from '@phosphor-icons/react'

interface LessonCompletionCelebrationProps {
  isVisible: boolean
  lessonTitle?: string
  courseTitle?: string
  onComplete?: () => void
  onNavigate?: () => void
  className?: string
}

/**
 * LessonCompletionCelebration - Celebration animation for lesson completion
 * 
 * Features:
 * - Confetti-like particle animation
 * - Trophy and success icons
 * - Smooth fade in/out animations
 * - Celebration message with lesson details
 * - Auto-dismiss after animation
 */
export const LessonCompletionCelebration: React.FC<LessonCompletionCelebrationProps> = ({
  isVisible,
  lessonTitle = 'Aula',
  courseTitle = 'Curso',
  onComplete,
  onNavigate,
  className
}) => {
  const confettiRef = useRef<HTMLDivElement>(null)

  // Auto-complete and navigate after animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete?.()
        // Navigate after completion callback
        setTimeout(() => {
          onNavigate?.()
        }, 500)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete, onNavigate])

  // Generate confetti particles
  const generateConfetti = () => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      color: [
        '#d400ff', // Primary magenta
        '#00c4ff', // Secondary cyan  
        '#a000ff', // Accent purple
        '#22c55e', // Success green
        '#f59e0b', // Warning amber
        '#ef4444'  // Error red
      ][Math.floor(Math.random() * 6)],
      delay: Math.random() * 2
    }))
  }

  const confettiParticles = generateConfetti()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "bg-black/80 backdrop-blur-sm",
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Confetti Container */}
          <div 
            ref={confettiRef}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: particle.color,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
                initial={{
                  scale: 0,
                  rotate: 0,
                  y: -100,
                  opacity: 0
                }}
                animate={{
                  scale: [0, particle.scale, 0],
                  rotate: [0, particle.rotation, particle.rotation * 2],
                  y: [0, 100, 200],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Main Celebration Content */}
          <motion.div
            className="relative z-10 text-center max-w-md mx-auto px-6"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              delay: 0.2 
            }}
          >
            {/* Trophy Icon with Glow */}
            <motion.div
              className="relative mb-6"
              animate={{ 
                rotate: [0, -10, 10, -5, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl scale-150" />
              <Trophy 
                className="w-24 h-24 mx-auto text-yellow-400 relative z-10" 
                weight="fill"
              />
              
              {/* Sparkle effects around trophy */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    left: `${50 + 30 * Math.cos((i * Math.PI * 2) / 8)}%`,
                    top: `${50 + 30 * Math.sin((i * Math.PI * 2) / 8)}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Success Message */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <CheckCircle className="w-8 h-8 text-green-400" weight="fill" />
                Parabéns!
              </h1>
              
              <p className="text-xl text-gray-200 mb-4">
                Você concluiu a aula com sucesso!
              </p>
              
              <div className="space-y-2">
                <p className="text-lg font-semibold text-[#d400ff]">
                  {lessonTitle}
                </p>
                <p className="text-sm text-gray-400">
                  {courseTitle}
                </p>
              </div>
            </motion.div>

            {/* Achievement Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" weight="fill" />
                </div>
                <p className="text-xs text-gray-400">Critérios</p>
                <p className="text-sm font-semibold text-white">Completos</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-400" weight="fill" />
                </div>
                <p className="text-xs text-gray-400">Progresso</p>
                <p className="text-sm font-semibold text-white">100%</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-400" weight="fill" />
                </div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="text-sm font-semibold text-white">Concluído</p>
              </div>
            </motion.div>

            {/* Progress Message */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <p className="text-sm text-gray-300 mb-4">
                Redirecionando para o curso...
              </p>
              
              {/* Loading dots */}
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-[#d400ff] rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>

              {/* Fallback Button - appears after 2 seconds */}
              <motion.button
                onClick={onNavigate}
                className="px-4 py-2 bg-[#d400ff] hover:bg-[#b000dd] text-white rounded-lg text-sm font-medium transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2, duration: 0.3 }}
              >
                Continuar para o Curso
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Background Gradient Animation */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, #d400ff 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, #00c4ff 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, #a000ff 0%, transparent 50%)
              `
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}