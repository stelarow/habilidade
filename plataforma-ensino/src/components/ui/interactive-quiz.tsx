'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  Target,
  AlertTriangle,
  Lightbulb,
  Play,
  SkipForward
} from 'lucide-react'
import type {
  StrictEventHandler,
  StrictVoidHandler
} from '@/types/phase1-components'

/**
 * Interface definitions for quiz system
 */
export interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
  hint?: string
}

export interface QuestionResult {
  questionId: string
  userAnswer: string | string[]
  correctAnswer: string | string[]
  isCorrect: boolean
  timeSpent: number
  pointsEarned: number
}

export interface QuizResults {
  score: number
  percentage: number
  correctAnswers: number
  totalQuestions: number
  timeTaken: number
  questionResults: QuestionResult[]
  passed: boolean
}

export interface Quiz {
  id: string
  title: string
  description?: string
  questions: Question[]
  timeLimit?: number // in minutes
  passingScore: number // percentage
  allowRetake?: boolean
  showFeedback?: boolean
}

export interface InteractiveQuizProps {
  quiz: Quiz
  onComplete: StrictEventHandler<QuizResults>
  onRetry: StrictVoidHandler
  allowRetake?: boolean
  showTimer?: boolean
  className?: string
}

/**
 * Quiz states
 */
type QuizState = 'introduction' | 'in-progress' | 'question-answered' | 'completed'

/**
 * Timer component
 */
const QuizTimer: React.FC<{
  timeLimit: number // in minutes
  onTimeUp: StrictVoidHandler
  isActive: boolean
}> = ({ timeLimit, onTimeUp, isActive }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60) // convert to seconds

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeUp])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const isUrgent = timeRemaining < 300 // less than 5 minutes

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg border",
      isUrgent ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-muted"
    )}>
      <Clock className="h-4 w-4" />
      <span className="font-mono text-sm">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}

/**
 * Quiz introduction screen
 */
const QuizIntroduction: React.FC<{
  quiz: Quiz
  onStart: StrictVoidHandler
}> = ({ quiz, onStart }) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">{quiz.title}</CardTitle>
        {quiz.description && (
          <p className="text-muted-foreground mt-2">{quiz.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{quiz.questions.length}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
          
          {quiz.timeLimit && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{quiz.timeLimit}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
          )}
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{quiz.passingScore}%</div>
            <div className="text-sm text-muted-foreground">Pass Score</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            Instructions
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Read each question carefully before selecting your answer</li>
            <li>• You can navigate between questions using the Previous/Next buttons</li>
            <li>• {quiz.showFeedback !== false ? 'Instant feedback will be provided after each answer' : 'Results will be shown at the end'}</li>
            {quiz.allowRetake && <li>• You can retake this quiz if needed</li>}
            {quiz.timeLimit && <li>• Complete the quiz within the time limit</li>}
          </ul>
        </div>

        <Button onClick={onStart} size="lg" className="w-full">
          <Play className="h-5 w-5 mr-2" />
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  )
}

/**
 * Question card component
 */
const QuestionCard: React.FC<{
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswer: string | undefined
  onAnswerSelect: StrictEventHandler<string>
  showFeedback: boolean
  isCorrect?: boolean
  onNext: StrictVoidHandler
  onPrevious: StrictVoidHandler
  onSkip: StrictVoidHandler
  hasPrevious: boolean
  hasNext: boolean
  isAnswered: boolean
}> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showFeedback,
  isCorrect,
  onNext,
  onPrevious,
  onSkip,
  hasPrevious,
  hasNext,
  isAnswered
}) => {
  const progressPercentage = (questionNumber / totalQuestions) * 100

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          
          <div className="text-sm text-muted-foreground">
            {question.points} {question.points === 1 ? 'point' : 'points'}
          </div>
        </div>
        
        <Progress value={progressPercentage} className="mb-4" />
        
        <CardTitle className="text-lg leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Answer Options */}
        {question.type === 'multiple-choice' && question.options && (
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={onAnswerSelect}
            className="space-y-3"
            disabled={showFeedback && isAnswered}
          >
            {question.options.map((option, index) => {
              const optionId = `option-${question.id}-${index}`
              const isSelected = selectedAnswer === option
              const isCorrectOption = option === question.correctAnswer
              
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-lg border transition-all",
                    "hover:bg-accent cursor-pointer",
                    isSelected && !showFeedback && "border-primary bg-primary/5",
                    showFeedback && isAnswered && isSelected && isCorrect && "border-success bg-success/10",
                    showFeedback && isAnswered && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                    showFeedback && isAnswered && !isSelected && isCorrectOption && "border-success bg-success/5"
                  )}
                >
                  <RadioGroupItem 
                    value={option} 
                    id={optionId}
                    className={cn(
                      showFeedback && isAnswered && isSelected && isCorrect && "border-success text-success",
                      showFeedback && isAnswered && isSelected && !isCorrect && "border-destructive text-destructive"
                    )}
                  />
                  <Label 
                    htmlFor={optionId}
                    className="flex-1 cursor-pointer leading-relaxed"
                  >
                    {option}
                  </Label>
                  
                  {showFeedback && isAnswered && (
                    <div className="flex-shrink-0">
                      {isSelected && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      {!isSelected && isCorrectOption && (
                        <div className="flex items-center gap-1 text-success text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Correct</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </RadioGroup>
        )}

        {/* True/False questions */}
        {question.type === 'true-false' && (
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={onAnswerSelect}
            className="space-y-3"
            disabled={showFeedback && isAnswered}
          >
            {['True', 'False'].map((option) => {
              const optionId = `option-${question.id}-${option}`
              const isSelected = selectedAnswer === option
              const isCorrectOption = option === question.correctAnswer
              
              return (
                <div
                  key={option}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-lg border transition-all",
                    "hover:bg-accent cursor-pointer",
                    isSelected && !showFeedback && "border-primary bg-primary/5",
                    showFeedback && isAnswered && isSelected && isCorrect && "border-success bg-success/10",
                    showFeedback && isAnswered && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                    showFeedback && isAnswered && !isSelected && isCorrectOption && "border-success bg-success/5"
                  )}
                >
                  <RadioGroupItem 
                    value={option} 
                    id={optionId}
                    className={cn(
                      showFeedback && isAnswered && isSelected && isCorrect && "border-success text-success",
                      showFeedback && isAnswered && isSelected && !isCorrect && "border-destructive text-destructive"
                    )}
                  />
                  <Label 
                    htmlFor={optionId}
                    className="flex-1 cursor-pointer text-lg font-medium"
                  >
                    {option}
                  </Label>
                  
                  {showFeedback && isAnswered && (
                    <div className="flex-shrink-0">
                      {isSelected && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      {!isSelected && isCorrectOption && (
                        <div className="flex items-center gap-1 text-success text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Correct</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </RadioGroup>
        )}

        {/* Feedback Section */}
        {showFeedback && isAnswered && (
          <div className={cn(
            "p-4 rounded-lg border",
            isCorrect ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"
          )}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={cn(
                  "font-semibold mb-1",
                  isCorrect ? "text-success" : "text-destructive"
                )}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
                <p className="text-sm leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hint */}
        {question.hint && !isAnswered && (
          <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-warning mb-1">Hint</h4>
                <p className="text-sm">{question.hint}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {!showFeedback && (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="flex items-center gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Skip
              </Button>
            )}
            
            <Button
              onClick={onNext}
              disabled={!hasNext && !isAnswered}
              className="flex items-center gap-2"
            >
              {hasNext ? 'Next' : 'Finish'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Quiz results component
 */
const QuizResults: React.FC<{
  results: QuizResults
  quiz: Quiz
  onRetry: StrictVoidHandler
  allowRetake?: boolean
}> = ({ results, quiz, onRetry, allowRetake }) => {
  const isPassed = results.percentage >= quiz.passingScore

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className={cn(
          "mx-auto mb-4 p-4 rounded-full w-fit",
          isPassed ? "bg-success/10" : "bg-destructive/10"
        )}>
          {isPassed ? (
            <Trophy className="h-10 w-10 text-success" />
          ) : (
            <AlertTriangle className="h-10 w-10 text-destructive" />
          )}
        </div>
        
        <CardTitle className="text-2xl">
          {isPassed ? 'Congratulations!' : 'Quiz Complete'}
        </CardTitle>
        
        <p className="text-muted-foreground">
          {isPassed 
            ? 'You have successfully passed the quiz!' 
            : `You need ${quiz.passingScore}% to pass. You can try again!`
          }
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <div className={cn(
            "text-6xl font-bold mb-2",
            isPassed ? "text-success" : "text-destructive"
          )}>
            {Math.round(results.percentage)}%
          </div>
          <p className="text-muted-foreground">
            {results.correctAnswers} of {results.totalQuestions} questions correct
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{results.score}</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold">
              {Math.floor(results.timeTaken / 60)}m {results.timeTaken % 60}s
            </div>
            <div className="text-sm text-muted-foreground">Time Taken</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-3">
          <h3 className="font-semibold">Question Review</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.questionResults.map((result, index) => (
              <div
                key={result.questionId}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  result.isCorrect ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {result.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <span className="text-sm">Question {index + 1}</span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {result.pointsEarned} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {allowRetake && (
            <Button onClick={onRetry} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button className="flex-1" onClick={() => window.location.reload()}>
            Continue Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Main interactive quiz component
 */
export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  quiz,
  onComplete,
  onRetry,
  allowRetake = quiz.allowRetake || false,
  showTimer = !!quiz.timeLimit,
  className
}) => {
  const [currentState, setCurrentState] = useState<QuizState>('introduction')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [results, setResults] = useState<QuizResults | null>(null)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const selectedAnswer = answers[currentQuestion?.id]
  const isAnswered = !!selectedAnswer

  const handleStartQuiz = useCallback(() => {
    setCurrentState('in-progress')
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
  }, [])

  const handleAnswerSelect = useCallback((answer: string) => {
    if (currentQuestion && !isAnswered) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }))
      
      if (quiz.showFeedback !== false) {
        setCurrentState('question-answered')
        
        // Record result
        const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
        const isCorrect = answer === currentQuestion.correctAnswer
        const pointsEarned = isCorrect ? currentQuestion.points : 0
        
        const result: QuestionResult = {
          questionId: currentQuestion.id,
          userAnswer: answer,
          correctAnswer: currentQuestion.correctAnswer,
          isCorrect,
          timeSpent,
          pointsEarned
        }
        
        setQuestionResults(prev => {
          const updated = [...prev]
          const existingIndex = updated.findIndex(r => r.questionId === currentQuestion.id)
          if (existingIndex >= 0) {
            updated[existingIndex] = result
          } else {
            updated.push(result)
          }
          return updated
        })
      }
    }
  }, [currentQuestion, isAnswered, quiz.showFeedback, questionStartTime])

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setCurrentState('in-progress')
      setQuestionStartTime(Date.now())
    } else {
      // Quiz complete
      const totalTime = Math.round((Date.now() - startTime) / 1000)
      
      // Calculate final results
      const allResults = quiz.questions.map(question => {
        const existingResult = questionResults.find(r => r.questionId === question.id)
        if (existingResult) return existingResult
        
        // For unanswered questions
        return {
          questionId: question.id,
          userAnswer: answers[question.id] || '',
          correctAnswer: question.correctAnswer,
          isCorrect: false,
          timeSpent: 0,
          pointsEarned: 0
        }
      })
      
      const correctAnswers = allResults.filter(r => r.isCorrect).length
      const totalPoints = allResults.reduce((sum, r) => sum + r.pointsEarned, 0)
      const maxPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0)
      const percentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0
      
      const finalResults: QuizResults = {
        score: totalPoints,
        percentage,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        timeTaken: totalTime,
        questionResults: allResults,
        passed: percentage >= quiz.passingScore
      }
      
      setResults(finalResults)
      setCurrentState('completed')
      onComplete(finalResults)
    }
  }, [currentQuestionIndex, quiz, questionResults, answers, startTime, onComplete])

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setCurrentState('in-progress')
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestionIndex])

  const handleSkip = useCallback(() => {
    handleNext()
  }, [handleNext])

  const handleTimeUp = useCallback(() => {
    handleNext()
  }, [handleNext])

  const handleRetry = useCallback(() => {
    setCurrentState('introduction')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setQuestionResults([])
    setResults(null)
    onRetry()
  }, [onRetry])

  const isCorrect = useMemo(() => {
    if (!currentQuestion || !selectedAnswer) return false
    return selectedAnswer === currentQuestion.correctAnswer
  }, [currentQuestion, selectedAnswer])

  return (
    <div className={cn("min-h-screen py-8 px-4", className)}>
      {/* Timer */}
      {showTimer && quiz.timeLimit && currentState === 'in-progress' && (
        <div className="fixed top-4 right-4 z-50">
          <QuizTimer
            timeLimit={quiz.timeLimit}
            onTimeUp={handleTimeUp}
            isActive={currentState === 'in-progress'}
          />
        </div>
      )}

      {/* Content */}
      {currentState === 'introduction' && (
        <QuizIntroduction quiz={quiz} onStart={handleStartQuiz} />
      )}

      {(currentState === 'in-progress' || currentState === 'question-answered') && currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          showFeedback={currentState === 'question-answered' && quiz.showFeedback !== false}
          isCorrect={isCorrect}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          hasPrevious={currentQuestionIndex > 0}
          hasNext={currentQuestionIndex < quiz.questions.length - 1}
          isAnswered={isAnswered}
        />
      )}

      {currentState === 'completed' && results && (
        <QuizResults
          results={results}
          quiz={quiz}
          onRetry={handleRetry}
          allowRetake={allowRetake}
        />
      )}
    </div>
  )
}

export default InteractiveQuiz