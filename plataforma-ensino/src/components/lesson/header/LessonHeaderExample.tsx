'use client'

import React from 'react'
import { LessonHeader } from './LessonHeader'

/**
 * Example usage of the LessonHeader component
 * This demonstrates how to use the component with sample data
 */
export function LessonHeaderExample() {
  const sampleData = {
    course: {
      title: 'Curso de React Avançado',
      slug: 'react-avancado',
    },
    lesson: {
      title: 'Hooks e Context API',
      slug: 'hooks-context-api',
    },
    progress: {
      overall: 65,
      time: {
        current: 1200, // 20 minutes in seconds
        required: 1500, // 25 minutes required
        formatted: '20min',
      },
      pdf: {
        percentage: 80,
        isCompleted: false,
      },
      exercises: {
        completed: 2,
        total: 3,
        isCompleted: false,
      },
      quiz: {
        score: 85,
        isCompleted: true,
        isPassed: true,
      },
    },
    canComplete: false,
    onExit: () => {
      console.log('Exit button clicked')
    },
    onComplete: () => {
      console.log('Complete button clicked')
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <LessonHeader {...sampleData} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Lesson Header Example</h1>
          <p className="text-gray-300 mb-8">
            This demonstrates the new LessonHeader component with progress indicators.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <ul className="text-left space-y-2 text-gray-300">
                <li>✓ Logo da Escola Habilidade</li>
                <li>✓ Botão de saída para voltar ao curso</li>
                <li>✓ Indicadores de progresso para todos os critérios</li>
                <li>✓ Design responsivo</li>
                <li>✓ Ícones Phosphor React com peso duotone</li>
                <li>✓ Cores da marca (#d400ff, #00c4ff, #a000ff)</li>
                <li>✓ Comportamento de scroll (não fixo)</li>
              </ul>
            </div>
            
            <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Progress Criteria</h3>
              <div className="text-left space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Tempo:</span>
                  <span className="text-yellow-400">20min / 25min</span>
                </div>
                <div className="flex justify-between">
                  <span>PDF:</span>
                  <span className="text-blue-400">80%</span>
                </div>
                <div className="flex justify-between">
                  <span>Exercícios:</span>
                  <span className="text-red-400">2/3</span>
                </div>
                <div className="flex justify-between">
                  <span>Quiz:</span>
                  <span className="text-green-400">85% ✓</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-gray-700">
                  <span>Geral:</span>
                  <span className="text-primary">65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}