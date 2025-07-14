'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { QuizData } from '@/types/lesson'
import { chapter2Questions, type QuizQuestion } from '@/data/quiz-questions'

interface QuizAttempt {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
}

interface EnhancedQuizInterfaceProps {
  quiz: QuizData
  onComplete?: (score: number, attempts: QuizAttempt[]) => void
  onProgressUpdate?: (questionIndex: number, score: number) => void
  className?: string
}

/**
 * Enhanced Quiz Interface with real Chapter 2 questions
 * 
 * Features:
 * - 8 comprehensive questions about web development fundamentals
 * - Detailed explanations for each answer
 * - Category-based scoring (HTML, CSS, JavaScript, General)
 * - Visual feedback with animations
 * - Progress tracking and time management
 */
export function EnhancedQuizInterface({
  quiz,
  onComplete,
  onProgressUpdate,
  className
}: EnhancedQuizInterfaceProps) {
  // Quiz state
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<QuizAttempt[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  // Use real questions from Chapter 2
  const questions = chapter2Questions
  const totalQuestions = questions.length
  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  // Calculate scores
  const correctAnswers = answers.filter(a => a.isCorrect).length
  const totalPossibleScore = questions.reduce((sum, q) => sum + q.points, 0)
  const earnedScore = answers.reduce((sum, a) => {
    const question = questions.find(q => q.id === a.questionId)
    return sum + (a.isCorrect ? (question?.points || 0) : 0)
  }, 0)
  const currentScore = totalPossibleScore > 0 ? Math.round((earnedScore / totalPossibleScore) * 100) : 0

  // Timer effect
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && isStarted && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      handleQuizComplete()
    }
  }, [timeRemaining, isStarted, isCompleted])

  // Complete quiz function
  const handleQuizComplete = useCallback((finalAnswers = answers) => {
    setIsCompleted(true)
    setShowFeedback(false)
    const finalScore = Math.round((earnedScore / totalPossibleScore) * 100)
    onComplete?.(finalScore, finalAnswers)
  }, [earnedScore, totalPossibleScore, onComplete, answers])

  // Start quiz
  const handleStartQuiz = () => {
    setIsStarted(true)
    setCurrentQuestionIndex(0)
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : null)
    setAnswers([])
    setSelectedAnswer(null)
    setShowFeedback(false)
    setIsCompleted(false)
    setShowReview(false)
    setQuestionStartTime(Date.now())
  }

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return
    setSelectedAnswer(answerIndex)
  }

  // Submit answer
  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null || !currentQuestion) return

    const timeSpent = Date.now() - questionStartTime
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    const attempt: QuizAttempt = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent
    }

    const newAnswers = [...answers, attempt]
    setAnswers(newAnswers)
    setShowFeedback(true)

    // Update progress
    onProgressUpdate?.(currentQuestionIndex + 1, currentScore)

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (isLastQuestion) {
        handleQuizComplete([...answers, attempt])
      } else {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setQuestionStartTime(Date.now())
      }
    }, 3000) // Show feedback for 3 seconds
  }, [selectedAnswer, currentQuestion, answers, isLastQuestion, onProgressUpdate, currentScore, questionStartTime, currentQuestionIndex, handleQuizComplete])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get category color
  const getCategoryColor = (category: QuizQuestion['category']) => {
    const colors = {
      html: 'text-orange-400',
      css: 'text-blue-400', 
      javascript: 'text-yellow-400',
      general: 'text-purple-400'
    }
    return colors[category] || 'text-gray-400'
  }

  // Get category icon
  const getCategoryIcon = (category: QuizQuestion['category']) => {
    const icons = {
      html: '🏗️',
      css: '🎨',
      javascript: '⚡',
      general: '🌐'
    }
    return icons[category] || '❓'
  }

  if (!isStarted) {
    return (
      <div className={cn('lesson-quiz-container', className)}>
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="lesson-quiz-header">{quiz.title}</h3>
            <p className="lesson-text-body">{quiz.description}</p>
          </div>
          
          <div className="lesson-card-base lesson-card-padding space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="lesson-text-subtitle">📝 Questões:</span>
                  <span className="text-white font-mono">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="lesson-text-subtitle">⏱️ Tempo:</span>
                  <span className="text-white font-mono">
                    {quiz.timeLimit ? `${quiz.timeLimit} min` : 'Ilimitado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="lesson-text-subtitle">🎯 Aprovação:</span>
                  <span className="text-white font-mono">{quiz.passingScore}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="lesson-text-subtitle">🔄 Tentativas:</span>
                  <span className="text-white font-mono">{quiz.attemptsAllowed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="lesson-text-subtitle">📋 Categorias:</span>
                  <span className="text-white font-mono">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="lesson-text-subtitle">🏆 Pontos:</span>
                  <span className="text-white font-mono">{totalPossibleScore}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Categorias das Questões:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['html', 'css', 'javascript', 'general'].map(category => {
                    const count = questions.filter(q => q.category === category).length
                    return (
                      <div key={category} className="flex items-center gap-2">
                        <span>{getCategoryIcon(category as QuizQuestion['category'])}</span>
                        <span className={getCategoryColor(category as QuizQuestion['category'])}>
                          {category.toUpperCase()}
                        </span>
                        <span className="text-gray-400">({count})</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="lesson-btn-primary text-lg px-8 py-4"
          >
            🚀 Iniciar Quiz
          </button>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    const passed = currentScore >= quiz.passingScore
    const categoryScores = ['html', 'css', 'javascript', 'general'].map(category => {
      const categoryQuestions = questions.filter(q => q.category === category)
      const categoryAnswers = answers.filter(a => {
        const question = questions.find(q => q.id === a.questionId)
        return question?.category === category
      })
      const correct = categoryAnswers.filter(a => a.isCorrect).length
      const percentage = categoryQuestions.length > 0 ? Math.round((correct / categoryQuestions.length) * 100) : 0
      
      return {
        category,
        correct,
        total: categoryQuestions.length,
        percentage
      }
    })

    return (
      <div className={cn('lesson-quiz-container', className)}>
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-6xl ${passed ? 'text-green-400' : 'text-orange-400'}`}
          >
            {passed ? '🎉' : '📚'}
          </motion.div>

          <div className="space-y-2">
            <h3 className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-orange-400'}`}>
              {passed ? 'Parabéns! Você passou!' : 'Continue estudando!'}
            </h3>
            <p className="lesson-text-body">
              {passed 
                ? 'Excelente desempenho! Você domina os fundamentos do desenvolvimento web.'
                : 'Revise o material e tente novamente. Você está no caminho certo!'
              }
            </p>
          </div>

          <div className="lesson-card-base lesson-card-padding space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{currentScore}%</div>
              <div className="text-sm text-gray-400">
                {correctAnswers} de {totalQuestions} questões corretas
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Desempenho por Categoria:</h4>
              {categoryScores.map(({ category, correct, total, percentage }) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>{getCategoryIcon(category as QuizQuestion['category'])}</span>
                      <span className={getCategoryColor(category as QuizQuestion['category'])}>
                        {category.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white font-mono text-sm">
                      {correct}/{total} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowReview(!showReview)}
              className="lesson-btn-secondary"
            >
              {showReview ? '👁️ Ocultar' : '👁️ Ver'} Revisão
            </button>
            
            {!passed && quiz.remainingAttempts && quiz.remainingAttempts > 1 && (
              <button
                onClick={handleStartQuiz}
                className="lesson-btn-primary"
              >
                🔄 Tentar Novamente
              </button>
            )}
          </div>

          <AnimatePresence>
            {showReview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {questions.map((question, index) => {
                  const attempt = answers.find(a => a.questionId === question.id)
                  const isCorrect = attempt?.isCorrect || false
                  
                  return (
                    <div
                      key={question.id}
                      className={`lesson-card-base lesson-card-padding border-l-4 ${
                        isCorrect ? 'border-green-400' : 'border-red-400'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h5 className="text-white font-medium">
                            {index + 1}. {question.question}
                          </h5>
                          <div className="flex items-center gap-2">
                            <span className={getCategoryColor(question.category)}>
                              {getCategoryIcon(question.category)}
                            </span>
                            <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                              {isCorrect ? '✅' : '❌'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={cn(
                                'p-2 rounded-lg text-sm',
                                optIndex === question.correctAnswer
                                  ? 'bg-green-500/20 border border-green-400/50 text-green-100'
                                  : optIndex === attempt?.selectedAnswer && !isCorrect
                                  ? 'bg-red-500/20 border border-red-400/50 text-red-100'
                                  : 'bg-white/5 text-gray-300'
                              )}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-sm text-blue-200 bg-blue-500/10 p-3 rounded-lg">
                          <strong>💡 Explicação:</strong> {question.explanation}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('lesson-quiz-container', className)}>
      {/* Quiz Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={getCategoryColor(currentQuestion.category)}>
              {getCategoryIcon(currentQuestion.category)}
            </span>
            <span className="lesson-text-subtitle">
              Questão {currentQuestionIndex + 1} de {totalQuestions}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Categoria: {currentQuestion.category.toUpperCase()} • {currentQuestion.points} pontos
          </div>
        </div>
        
        <div className="text-right space-y-1">
          {timeRemaining !== null && (
            <div className={`font-mono ${timeRemaining <= 60 ? 'text-red-400' : 'text-white'}`}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          )}
          <div className="text-xs text-gray-400">
            Score: {currentScore}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/20 rounded-full h-2 mb-6">
        <motion.div
          className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <div className="lesson-quiz-question">
        <h4 className="text-lg font-semibold text-white mb-4">
          {currentQuestion.question}
        </h4>

        <div className="lesson-quiz-options">
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={index}
              className={cn(
                'lesson-quiz-option lesson-focusable',
                selectedAnswer === index && 'selected',
                showFeedback && index === currentQuestion.correctAnswer && 'correct',
                showFeedback && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer && 'incorrect'
              )}
              onClick={() => handleAnswerSelect(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          ))}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? 'bg-green-500/20 border border-green-400/50'
                  : 'bg-red-500/20 border border-red-400/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {selectedAnswer === currentQuestion.correctAnswer ? '✅' : '❌'}
                </span>
                <div>
                  <div className="font-semibold text-white mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer 
                      ? 'Correto!' 
                      : 'Incorreto!'
                    }
                  </div>
                  <div className="text-sm text-gray-100">
                    {currentQuestion.explanation}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        {!showFeedback && (
          <div className="mt-6 text-center">
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={cn(
                'lesson-btn-primary',
                selectedAnswer === null && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLastQuestion ? '🏁 Finalizar Quiz' : '➡️ Próxima Questão'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}