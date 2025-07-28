'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { LessonProgressData } from '@/types/lesson'
import { useProgressStateManager } from '@/hooks/useProgressStateManager'
import { EnhancedCompletionProgress } from './EnhancedCompletionProgress'
import { LessonHeader } from '../header/LessonHeader'

/**
 * EnhancedProgressDemo - Demonstration component for the enhanced progress tracking system
 * 
 * This component showcases:
 * - Enhanced progress calculation
 * - Visual states and animations
 * - Smooth transitions
 * - Completion flow
 * - Integration between components
 */
export function EnhancedProgressDemo() {
  // Initialize progress state manager
  const progressManager = useProgressStateManager()
  
  // Demo controls
  const [selectedCriterion, setSelectedCriterion] = useState<string | null>(null)
  
  // Mock course and lesson data
  const mockCourse = {
    title: 'Curso de Desenvolvimento Web',
    slug: 'desenvolvimento-web'
  }
  
  const mockLesson = {
    title: 'Introdução ao React',
    slug: 'introducao-react'
  }
  
  // Demo actions
  const handleUpdateVideoProgress = () => {
    const currentTime = Math.min(progressManager.progressData?.videoProgress.currentTime || 0 + 300, 1500) // Add 5 minutes, max 25 minutes
    progressManager.updateVideoProgress(currentTime, 1800) // 30 minute video
  }
  
  const handleUpdatePDFProgress = () => {
    const currentPage = Math.min((progressManager.progressData?.pdfProgress.currentPage || 0) + 2, 10)
    progressManager.updatePDFProgress(currentPage, 10) // 10 page PDF
  }
  
  const handleUpdateExerciseProgress = () => {
    const currentCompleted = progressManager.progressData?.exerciseProgress.completedExercises.length || 0
    const newCompleted = Math.min(currentCompleted + 1, 3)
    const completedIds = Array.from({ length: newCompleted }, (_, i) => `exercise-${i + 1}`)
    progressManager.updateExerciseProgress(completedIds, 3) // 3 total exercises
  }
  
  const handleUpdateQuizProgress = () => {
    const currentScore = progressManager.progressData?.quizProgress.score || 0
    const newScore = Math.min(currentScore + 20, 100)
    const isCompleted = newScore >= 70
    const isPassed = newScore >= 70
    progressManager.updateQuizProgress(newScore, isCompleted, isPassed)
  }
  
  const handleCompleteLesson = async () => {
    console.log('Lesson completed!', progressManager.enhancedProgress)
    alert('🎉 Parabéns! Aula concluída com sucesso!')
  }
  
  const handleResetProgress = () => {
    progressManager.resetProgress()
    setSelectedCriterion(null)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Enhanced Lesson Header */}
      <LessonHeader
        course={mockCourse}
        lesson={mockLesson}
        progressData={progressManager.progressData}
        onExit={() => console.log('Exit lesson')}
        onComplete={handleCompleteLesson}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Demo Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Enhanced Progress Tracking Demo
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            This demo showcases the enhanced progress tracking system with visual states, 
            smooth animations, and intelligent completion logic.
          </p>
        </div>
        
        {/* Demo Controls */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Demo Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.button
              onClick={handleUpdateVideoProgress}
              className="px-4 py-3 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ⏱️ Add 5min Video Time
            </motion.button>
            
            <motion.button
              onClick={handleUpdatePDFProgress}
              className="px-4 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📄 Read 2 PDF Pages
            </motion.button>
            
            <motion.button
              onClick={handleUpdateExerciseProgress}
              className="px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📋 Complete Exercise
            </motion.button>
            
            <motion.button
              onClick={handleUpdateQuizProgress}
              className="px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🎯 Add 20% Quiz Score
            </motion.button>
          </div>
          
          <div className="mt-4 flex justify-center">
            <motion.button
              onClick={handleResetProgress}
              className="px-6 py-2 bg-gray-600/50 border border-gray-500/50 text-gray-300 rounded-lg hover:bg-gray-600/70 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Reset Progress
            </motion.button>
          </div>
        </div>
        
        {/* Enhanced Completion Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Enhanced Completion Progress</h2>
            <EnhancedCompletionProgress
              progressData={progressManager.progressData}
              onCompleteClick={handleCompleteLesson}
              showCompleteButton={true}
            />
          </div>
          
          {/* Progress State Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Progress State Information</h2>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">Overall Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Percentage:</span>
                  <span className="text-white font-mono">
                    {Math.round(progressManager.enhancedProgress.overallProgress.percentage)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed Criteria:</span>
                  <span className="text-white font-mono">
                    {progressManager.enhancedProgress.overallProgress.completedCriteria}/
                    {progressManager.enhancedProgress.overallProgress.totalCriteria}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Can Complete:</span>
                  <span className={cn(
                    "font-mono",
                    progressManager.enhancedProgress.overallProgress.canComplete 
                      ? "text-green-400" 
                      : "text-red-400"
                  )}>
                    {progressManager.enhancedProgress.overallProgress.canComplete ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Progress Color:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: progressManager.enhancedProgress.visualStates.progressColor }}
                    />
                    <span className="text-white font-mono text-xs">
                      {progressManager.enhancedProgress.visualStates.progressColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">Individual Criteria</h3>
              <div className="space-y-3 text-sm">
                {[
                  { name: 'Time', data: progressManager.enhancedProgress.timeProgress },
                  { name: 'PDF', data: progressManager.enhancedProgress.pdfProgress },
                  { name: 'Exercises', data: progressManager.enhancedProgress.exerciseProgress },
                  { name: 'Quiz', data: progressManager.enhancedProgress.quizProgress }
                ].map(({ name, data }) => (
                  <div key={name} className="flex justify-between items-center">
                    <span className="text-gray-400">{name}:</span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-mono",
                        data.state === 'completed' ? "bg-green-500/20 text-green-400" :
                        data.state === 'in_progress' ? "bg-amber-500/20 text-amber-400" :
                        data.state === 'failed' ? "bg-red-500/20 text-red-400" :
                        "bg-gray-500/20 text-gray-400"
                      )}>
                        {data.state}
                      </span>
                      <span className="text-white font-mono">
                        {'percentage' in data ? Math.round(data.percentage) : 
                         'score' in data ? data.score : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Animation States */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">Animation States</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Is Animating:</span>
                  <span className={cn(
                    "font-mono",
                    progressManager.isAnimating ? "text-amber-400" : "text-gray-400"
                  )}>
                    {progressManager.isAnimating ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Show Celebration:</span>
                  <span className={cn(
                    "font-mono",
                    progressManager.showCelebration ? "text-green-400" : "text-gray-400"
                  )}>
                    {progressManager.showCelebration ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Is Saving:</span>
                  <span className={cn(
                    "font-mono",
                    progressManager.isSaving ? "text-blue-400" : "text-gray-400"
                  )}>
                    {progressManager.isSaving ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Completion Message */}
        {progressManager.enhancedProgress.visualStates.completionMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg px-6 py-3">
              <p className="text-purple-300 font-medium">
                {progressManager.enhancedProgress.visualStates.completionMessage}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}