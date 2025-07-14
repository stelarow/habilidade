'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { QuizData } from '@/types/lesson'

// Extended interfaces for detailed quiz functionality
interface QuizQuestion {
  id: string
  type: 'multiple_choice' | 'true_false' | 'single_choice'
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
}

interface QuizAttempt {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
}

interface QuizInterfaceProps {
  quiz: QuizData
  questions?: QuizQuestion[] // In real implementation, these would come from props or API
  className?: string
  onComplete?: (score: number, attempts: QuizAttempt[]) => void
  onProgressUpdate?: (questionIndex: number, score: number) => void
}

/**
 * QuizInterface - Interactive quiz component with gamification
 * Part of Fase 2: Desenvolvimento de Componentes (2.4)
 * 
 * Features:
 * - Interactive question cards with animations
 * - Real-time feedback (green/red visual cues)
 * - Progress bar and scoring system
 * - Timer functionality with visual countdown
 * - Slide animations between questions
 * - Confetti animation on completion
 * - Review mode and explanations
 * - Multiple attempt handling
 */
export function QuizInterface({ 
  quiz, 
  questions = generateSampleQuestions(quiz.totalQuestions),
  className,
  onComplete,
  onProgressUpdate 
}: QuizInterfaceProps) {
  // Quiz state
  const [isStarted, setIsStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<QuizAttempt[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  // Timer logic
  useEffect(() => {
    if (quiz.timeLimit && isStarted && !isCompleted) {
      setTimeRemaining(quiz.timeLimit * 60) // Convert to seconds
    }
  }, [quiz.timeLimit, isStarted, isCompleted])

  // Calculate score
  const currentScore = answers.length > 0 
    ? Math.round((answers.filter(a => a.isCorrect).length / answers.length) * 100)
    : 0

  const totalPossibleScore = questions.reduce((sum, q) => sum + q.points, 0)
  const earnedScore = answers.reduce((sum, a) => 
    sum + (a.isCorrect ? questions.find(q => q.id === a.questionId)?.points || 0 : 0), 0
  )

  // Current question e isLastQuestion
  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Complete quiz
  const handleQuizComplete = useCallback((finalAnswers = answers) => {
    setIsCompleted(true)
    setShowFeedback(false)
    const finalScore = Math.round((earnedScore / totalPossibleScore) * 100)
    onComplete?.(finalScore, finalAnswers)
  }, [earnedScore, totalPossibleScore, onComplete, answers]);

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

  // Start quiz
  const handleStartQuiz = () => {
    setIsStarted(true)
    setCurrentQuestionIndex(0)
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
        // Call handleQuizComplete with final answers including current attempt
        handleQuizComplete([...answers, attempt])
      } else {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setQuestionStartTime(Date.now())
      }
    }, 2000)
  }, [selectedAnswer, currentQuestion, answers, isLastQuestion, onProgressUpdate, currentScore, questionStartTime, currentQuestionIndex, handleQuizComplete])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // If not started, show start screen
  if (!isStarted) {
    return (
      <motion.div
        className={cn('quiz-start-screen p-6 text-center', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧩
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-2">{quiz.title}</h2>
          {quiz.description && (
            <p className="text-gray-300 mb-4">{quiz.description}</p>
          )}
          
          <div className="space-y-2 text-sm text-gray-400 mb-6">
            <p>📊 <strong>Questões:</strong> {quiz.totalQuestions}</p>
            <p>🎯 <strong>Nota Mínima:</strong> {quiz.passingScore}%</p>
            <p>🔄 <strong>Tentativas:</strong> {quiz.attemptsAllowed}</p>
            {quiz.timeLimit && <p>⏱️ <strong>Tempo:</strong> {quiz.timeLimit} minutos</p>}
          </div>

          <motion.button
            onClick={handleStartQuiz}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Iniciar Quiz
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // If completed, show results
  if (isCompleted) {
    const finalScore = Math.round((earnedScore / totalPossibleScore) * 100)
    const passed = finalScore >= quiz.passingScore

    return (
      <motion.div
        className={cn('quiz-results p-6 text-center', className)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md mx-auto">
          {/* Confetti Animation */}
          {passed && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    rotate: [0, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: 3,
                  }}
                />
              ))}
            </motion.div>
          )}

          <motion.div
            className={cn(
              'text-8xl mb-4',
              passed ? 'animate-bounce' : 'animate-pulse'
            )}
          >
            {passed ? '🎉' : '😔'}
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {passed ? 'Parabéns!' : 'Tente Novamente'}
          </h2>

          <div className="mb-6">
            <div className={cn(
              'text-6xl font-bold mb-2',
              passed ? 'text-green-400' : 'text-red-400'
            )}>
              {finalScore}%
            </div>
            <p className="text-gray-300">
              {answers.filter(a => a.isCorrect).length} de {questions.length} corretas
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={() => setShowReview(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📝 Revisar Respostas
            </motion.button>
            
            {!passed && quiz.remainingAttempts && quiz.remainingAttempts > 0 && (
              <motion.button
                onClick={handleStartQuiz}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 Tentar Novamente
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // Review mode
  if (showReview) {
    return (
      <div className={cn('quiz-review p-6', className)}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Revisão das Respostas</h2>
            <button
              onClick={() => setShowReview(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕ Fechar
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers.find(a => a.questionId === question.id)
              const isCorrect = userAnswer?.isCorrect || false

              return (
                <motion.div
                  key={question.id}
                  className={cn(
                    'p-4 rounded-lg border-2',
                    isCorrect 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'text-2xl',
                      isCorrect ? 'text-green-400' : 'text-red-400'
                    )}>
                      {isCorrect ? '✅' : '❌'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-2">
                        {index + 1}. {question.question}
                      </h3>
                      
                      <div className="space-y-1 mb-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={cn(
                              'p-2 rounded text-sm',
                              optionIndex === question.correctAnswer
                                ? 'bg-green-500/20 text-green-300'
                                : optionIndex === userAnswer?.selectedAnswer && !isCorrect
                                ? 'bg-red-500/20 text-red-300'
                                : 'text-gray-400'
                            )}
                          >
                            {optionIndex === question.correctAnswer && '✓ '}
                            {optionIndex === userAnswer?.selectedAnswer && optionIndex !== question.correctAnswer && '✗ '}
                            {option}
                          </div>
                        ))}
                      </div>

                      {question.explanation && (
                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded text-sm text-blue-300">
                          <strong>Explicação:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Main quiz interface
  return (
    <div className={cn('quiz-interface', className)}>
      {/* Header with progress and timer */}
      <div className="quiz-header mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white">
            <h2 className="text-xl font-bold">{quiz.title}</h2>
            <p className="text-gray-400">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </p>
          </div>
          
          {timeRemaining !== null && (
            <div className={cn(
              'text-right',
              timeRemaining < 60 ? 'text-red-400' : 'text-blue-400'
            )}>
              <div className="text-2xl font-mono font-bold">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm">restante</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Score display */}
        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
          <span>Progresso: {currentQuestionIndex + 1}/{questions.length}</span>
          <span>Pontuação: {earnedScore}/{totalPossibleScore} ({currentScore}%)</span>
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          className="question-card bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl text-white font-semibold mb-6">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={cn(
                  'w-full p-4 rounded-lg text-left transition-all duration-300',
                  'border-2 hover:scale-[1.02]',
                  selectedAnswer === index
                    ? showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-500/20 border-green-500 text-green-300'
                        : 'bg-red-500/20 border-red-500 text-red-300'
                      : 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : showFeedback && index === currentQuestion.correctAnswer
                    ? 'bg-green-500/20 border-green-500 text-green-300'
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                )}
                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold',
                    selectedAnswer === index && showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-red-500 bg-red-500 text-white'
                      : selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : showFeedback && index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-white/30'
                  )}>
                    {showFeedback && index === currentQuestion.correctAnswer
                      ? '✓'
                      : showFeedback && selectedAnswer === index && index !== currentQuestion.correctAnswer
                      ? '✗'
                      : String.fromCharCode(65 + index)
                    }
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Answer feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                className={cn(
                  'p-4 rounded-lg mb-4',
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-500/20 border border-green-500/30'
                    : 'bg-red-500/20 border border-red-500/30'
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {selectedAnswer === currentQuestion.correctAnswer ? '🎉' : '💪'}
                  </span>
                  <span className={cn(
                    'font-semibold',
                    selectedAnswer === currentQuestion.correctAnswer
                      ? 'text-green-300'
                      : 'text-red-300'
                  )}>
                    {selectedAnswer === currentQuestion.correctAnswer
                      ? 'Parabéns! Resposta correta!'
                      : 'Não foi dessa vez! Tente novamente.'}
                  </span>
                </div>
                {currentQuestion.explanation && (
                  <p className="text-gray-300 text-sm">
                    <strong>Explicação:</strong> {currentQuestion.explanation}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          {!showFeedback && (
            <motion.button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={cn(
                'w-full py-3 rounded-lg font-semibold transition-all duration-300',
                selectedAnswer !== null
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              )}
              whileHover={selectedAnswer !== null ? { scale: 1.02 } : {}}
              whileTap={selectedAnswer !== null ? { scale: 0.98 } : {}}
            >
              {isLastQuestion ? '🏁 Finalizar Quiz' : '➡️ Próxima Questão'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Generate sample questions for demo purposes
function generateSampleQuestions(count: number): QuizQuestion[] {
  const sampleQuestions: QuizQuestion[] = [
    {
      id: '1',
      type: 'multiple_choice',
      question: 'Qual é a capital do Brasil?',
      options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Belo Horizonte'],
      correctAnswer: 2,
      explanation: 'Brasília é a capital federal do Brasil desde 1960.',
      points: 10
    },
    {
      id: '2',
      type: 'multiple_choice',
      question: 'Qual linguagem é usada para estilizar páginas web?',
      options: ['HTML', 'CSS', 'JavaScript', 'Python'],
      correctAnswer: 1,
      explanation: 'CSS (Cascading Style Sheets) é usado para estilizar elementos HTML.',
      points: 10
    },
    {
      id: '3',
      type: 'true_false',
      question: 'React é uma biblioteca JavaScript para construir interfaces de usuário.',
      options: ['Verdadeiro', 'Falso'],
      correctAnswer: 0,
      explanation: 'React é realmente uma biblioteca JavaScript desenvolvida pelo Facebook para criar UIs.',
      points: 5
    }
  ]

  // Repeat questions to match requested count
  const questions: QuizQuestion[] = []
  for (let i = 0; i < count; i++) {
    const baseQuestion = sampleQuestions[i % sampleQuestions.length]
    questions.push({
      ...baseQuestion,
      id: `${baseQuestion.id}-${i}`,
      question: `${i + 1}. ${baseQuestion.question}`
    })
  }

  return questions
}