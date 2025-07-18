'use client'

import React, { useState } from 'react'
import QuizSection from './QuizSection'

const QuizSectionDemo: React.FC = () => {
  const [progress, setProgress] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress)
    console.log('Quiz Progress:', newProgress)
  }

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizScore(score)
    setQuizCompleted(true)
    console.log('Quiz Completed:', { score, passed })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Quiz Section Demo</h1>
          <p className="text-muted-foreground">
            Demonstração do componente QuizSection com funcionalidades completas
          </p>
        </div>

        {/* Progress Display */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Status do Quiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Progresso:</span>
              <span className="ml-2 font-medium">{progress.toFixed(0)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Concluído:</span>
              <span className="ml-2 font-medium">{quizCompleted ? 'Sim' : 'Não'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pontuação:</span>
              <span className="ml-2 font-medium">{quizScore}%</span>
            </div>
          </div>
        </div>

        {/* Quiz Component */}
        <QuizSection
          title="Quiz de Demonstração - Fundamentos de Programação"
          onProgressUpdate={handleProgressUpdate}
          onQuizComplete={handleQuizComplete}
          passingScore={70}
        />

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
            Como usar o Quiz:
          </h3>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Navegue entre as perguntas usando os botões ou números</li>
            <li>• Selecione uma resposta para cada pergunta</li>
            <li>• O progresso é atualizado conforme você responde</li>
            <li>• Finalize o quiz quando todas as perguntas estiverem respondidas</li>
            <li>• Veja o resultado com pontuação e badge de desempenho</li>
            <li>• Consulte as explicações das respostas</li>
            <li>• Tente novamente quantas vezes quiser</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default QuizSectionDemo