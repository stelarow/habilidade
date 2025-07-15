'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface LessonCompletionButtonProps {
  lessonId: string
  courseSlug: string
  canComplete: boolean
  className?: string
  onComplete?: () => void
}

/**
 * LessonCompletionButton - Magic UI completion button with rainbow effect
 * 
 * Features:
 * - Rainbow gradient button when ready
 * - Disabled shimmer state when not ready
 * - Loading animation during completion
 * - Success animation and redirect
 * - Confetti effect on click
 */
export function LessonCompletionButton({
  lessonId,
  courseSlug,
  canComplete,
  className,
  onComplete
}: LessonCompletionButtonProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

  // Handle lesson completion
  const handleComplete = async () => {
    if (!canComplete || isCompleting) return

    try {
      setIsCompleting(true)

      // Call completion callback
      onComplete?.()

      // API call to mark lesson as complete
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to complete lesson')
      }

      const result = await response.json()
      
      // Success animation
      setIsCompleted(true)
      
      // Wait for animation then redirect
      setTimeout(() => {
        router.push(`/course/${courseSlug}`)
      }, 2000)

    } catch (error) {
      console.error('Error completing lesson:', error)
      alert('Erro ao concluir a aula. Tente novamente.')
      setIsCompleting(false)
    }
  }

  // Rainbow Button Component (Magic UI inspired)
  const RainbowButton = ({ children, disabled, onClick }: {
    children: React.ReactNode
    disabled?: boolean
    onClick?: () => void
  }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative cursor-pointer group transition-all animate-rainbow",
        "inline-flex items-center justify-center gap-2 shrink-0",
        "rounded-xl outline-none focus-visible:ring-[3px]",
        "text-sm font-medium whitespace-nowrap px-8 py-4",
        "disabled:pointer-events-none disabled:opacity-50",
        disabled 
          ? "bg-gray-600 text-gray-300 border border-gray-500"
          : cn(
              "border-0 text-white",
              "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
              "bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.125rem)_solid_transparent]",
              "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow",
              "before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:[filter:blur(0.75rem)]"
            )
      )}
      style={{
        '--color-1': '#ff0080',
        '--color-2': '#7928ca', 
        '--color-3': '#ff0080',
        '--color-4': '#ff4d4d',
        '--color-5': '#f9cb28'
      } as React.CSSProperties}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  )

  // Shimmer Button Component (for disabled state)
  const ShimmerButton = ({ children }: { children: React.ReactNode }) => (
    <div className="relative group">
      <div 
        className={cn(
          "relative z-0 flex cursor-not-allowed items-center justify-center overflow-hidden whitespace-nowrap",
          "border border-white/10 px-8 py-4 text-white rounded-xl",
          "bg-gray-800/50 backdrop-blur-sm"
        )}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="relative z-10 flex items-center gap-2 text-gray-400">
          {children}
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <AnimatePresence mode="wait">
        {isCompleted ? (
          // Success State
          <motion.div
            key="success"
            className="text-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              🎉
            </motion.div>
            <div className="text-xl font-bold text-green-400 mb-2">
              Aula Concluída!
            </div>
            <div className="text-sm text-gray-300">
              Redirecionando para o curso...
            </div>
          </motion.div>
        ) : isCompleting ? (
          // Loading State
          <motion.div
            key="loading"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 text-white">
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Finalizando aula...</span>
            </div>
          </motion.div>
        ) : canComplete ? (
          // Ready to Complete
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <RainbowButton onClick={handleComplete}>
              <span className="text-lg">🏆</span>
              <span className="font-bold">Concluir Aula</span>
            </RainbowButton>
          </motion.div>
        ) : (
          // Not Ready
          <motion.div
            key="not-ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ShimmerButton>
              <span className="text-lg opacity-50">🔒</span>
              <span>Complete todos os critérios</span>
            </ShimmerButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text */}
      {!isCompleting && !isCompleted && (
        <motion.div
          className="text-center max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={cn(
            "text-xs",
            canComplete ? "text-green-300" : "text-gray-400"
          )}>
            {canComplete ? (
              "Todos os critérios foram atendidos. Clique para finalizar a aula e desbloquear a próxima."
            ) : (
              "Complete todos os critérios de conclusão para finalizar esta aula."
            )}
          </div>
        </motion.div>
      )}

      {/* Confetti Animation Container */}
      <AnimatePresence>
        {canComplete && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Floating particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: '50%'
                }}
                animate={{
                  y: [-20, -40, -20],
                  x: [-10, 10, -10],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-rainbow {
          animation: rainbow 3s ease infinite;
        }
      `}</style>
    </div>
  )
}