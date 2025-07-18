'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, CheckCircle, XCircle, AlertCircle, RotateCcw } from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface QuizSectionProps {
  title?: string
  questions?: QuizQuestion[]
  passingScore?: number
  onProgressUpdate?: (progress: number) => void
  onQuizComplete?: (score: number, passed: boolean) => void
  initialAnswers?: { [questionId: number]: number }
  initialScore?: number
  initialCompleted?: boolean
}

const QuizSection: React.FC<QuizSectionProps> = ({
  title = "Quiz de Avaliação",
  questions = [
    {
      id: 1,
      question: "Qual é o conceito fundamental abordado nesta aula?",
      options: [
        "Conceito básico de programação",
        "Estruturas de dados avançadas", 
        "Algoritmos de ordenação",
        "Padrões de design"
      ],
      correctAnswer: 0,
      explanation: "O conceito fundamental desta aula é a programação básica, que serve como base para todos os outros tópicos."
    },
    {
      id: 2,
      question: "Qual das seguintes práticas é considerada uma boa prática de desenvolvimento?",
      options: [
        "Escrever código sem comentários",
        "Usar nomes de variáveis descritivos",
        "Ignorar tratamento de erros",
        "Copiar código sem entender"
      ],
      correctAnswer: 1,
      explanation: "Usar nomes de variáveis descritivos torna o código mais legível e fácil de manter."
    },
    {
      id: 3,
      question: "O que é mais importante ao aprender uma nova tecnologia?",
      options: [
        "Memorizar toda a documentação",
        "Praticar com projetos reais",
        "Apenas assistir vídeos",
        "Copiar exemplos sem modificar"
      ],
      correctAnswer: 1,
      explanation: "A prática com projetos reais é fundamental para consolidar o aprendizado e desenvolver habilidades práticas."
    },
    {
      id: 4,
      question: "Qual é a melhor abordagem para resolver problemas de programação?",
      options: [
        "Tentar resolver tudo de uma vez",
        "Quebrar o problema em partes menores",
        "Desistir no primeiro erro",
        "Sempre usar a primeira solução que funciona"
      ],
      correctAnswer: 1,
      explanation: "Quebrar problemas complexos em partes menores facilita a resolução e torna o código mais organizado."
    },
    {
      id: 5,
      question: "Por que é importante testar o código que desenvolvemos?",
      options: [
        "Apenas para impressionar outros desenvolvedores",
        "Para garantir que funciona corretamente",
        "É uma perda de tempo",
        "Só é necessário em projetos grandes"
      ],
      correctAnswer: 1,
      explanation: "Testar o código é essencial para garantir que ele funciona corretamente e prevenir bugs em produção."
    }
  ],
  passingScore = 70,
  onProgressUpdate,
  onQuizComplete,
  initialAnswers = {},
  initialScore = 0,
  initialCompleted = false
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>(initialAnswers)
  const [isSubmitted, setIsSubmitted] = useState(initialCompleted)
  const [score, setScore] = useState(initialScore)
  const [showResults, setShowResults] = useState(initialCompleted)
  const [showExplanations, setShowExplanations] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const answeredQuestions = Object.keys(answers).length
  const allQuestionsAnswered = answeredQuestions === totalQuestions

  // Handle answer selection
  const handleAnswerSelect = useCallback((questionId: number, answerIndex: number) => {
    if (isSubmitted) return

    const newAnswers = { ...answers, [questionId]: answerIndex }
    setAnswers(newAnswers)

    // Update progress based on answered questions
    const progress = (Object.keys(newAnswers).length / totalQuestions) * 100
    if (onProgressUpdate) {
      onProgressUpdate(progress)
    }
  }, [answers, isSubmitted, totalQuestions, onProgressUpdate])

  // Navigate between questions
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Calculate score
  const calculateScore = useCallback(() => {
    let correctAnswers = 0
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })
    return Math.round((correctAnswers / totalQuestions) * 100)
  }, [answers, questions, totalQuestions])

  // Submit quiz
  const handleSubmitQuiz = () => {
    if (!allQuestionsAnswered) return

    const finalScore = calculateScore()
    const passed = finalScore >= passingScore

    setScore(finalScore)
    setIsSubmitted(true)
    setShowResults(true)

    if (onQuizComplete) {
      onQuizComplete(finalScore, passed)
    }

    // Update progress to 100% when completed
    if (onProgressUpdate) {
      onProgressUpdate(100)
    }
  }

  // Reset quiz
  const handleResetQuiz = () => {
    setAnswers({})
    setIsSubmitted(false)
    setScore(0)
    setShowResults(false)
    setShowExplanations(false)
    setCurrentQuestionIndex(0)

    if (onProgressUpdate) {
      onProgressUpdate(0)
    }
  }

  // Get badge based on score
  const getBadge = (score: number) => {
    if (score >= 90) return { text: "Excelente!", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20" }
    if (score >= 80) return { text: "Muito Bom!", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" }
    if (score >= 70) return { text: "Bom!", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20" }
    return { text: "Precisa Melhorar", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20" }
  }

  const badge = getBadge(score)
  const passed = score >= passingScore

  return (
    <Card className="p-6 border-border/50">
      <h3 className="text-xl font-bold mb-4 gradient-text">{title}</h3>
      
      {!showResults ? (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <h4 className="font-medium">
                {index + 1}. {question.question}
              </h4>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`q${question.id}_${optionIndex}`}
                      name={`question_${question.id}`}
                      value={optionIndex}
                      checked={answers[question.id] === optionIndex}
                      onChange={() => handleAnswerSelect(question.id, optionIndex)}
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor={`q${question.id}_${optionIndex}`} className="text-sm">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <Button 
            onClick={handleSubmitQuiz}
            disabled={!allQuestionsAnswered}
            className="w-full gradient-button"
          >
            Finalizar Quiz
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className={`text-4xl mb-4 ${score >= passingScore ? 'text-success' : 'text-destructive'}`}>
            {score >= passingScore ? <CheckCircle className="h-16 w-16 mx-auto" /> : <XCircle className="h-16 w-16 mx-auto" />}
          </div>
          <h4 className="text-2xl font-bold mb-2">
            Quiz Finalizado!
          </h4>
          <p className="text-lg mb-4">
            Sua pontuação: <span className="font-bold">{score.toFixed(0)}%</span>
          </p>
          <div className={`inline-block px-4 py-2 rounded-full ${
            score >= passingScore 
              ? 'bg-success/10 text-success border border-success/30' 
              : 'bg-destructive/10 text-destructive border border-destructive/30'
          }`}>
            {score >= passingScore ? "Aprovado" : `Reprovado - Nota mínima: ${passingScore}%`}
          </div>
        </div>
      )}
    </Card>
  )
}

export default QuizSection