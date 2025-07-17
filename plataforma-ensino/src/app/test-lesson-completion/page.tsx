'use client'

import React, { useState } from 'react'
import { EnhancedLessonPageExample } from '@/components/lesson/EnhancedLessonPage'
import { LessonProgressData } from '@/types/lesson'

/**
 * Test page for the enhanced lesson completion flow
 * 
 * This page allows testing different completion scenarios:
 * - All criteria met (can complete)
 * - Missing criteria (cannot complete)
 * - Error scenarios
 * - Loading states
 * - Celebration animations
 */
export default function TestLessonCompletionPage() {
  const [scenario, setScenario] = useState<'complete' | 'incomplete' | 'partial'>('complete')

  // Different test scenarios
  const scenarios = {
    complete: {
      timeSpent: 1800, // 30 minutes ✅
      pdfProgress: 100, // 100% ✅
      quizScore: 85, // 85% ✅
      exercisesCompleted: 100, // 100% ✅
    },
    incomplete: {
      timeSpent: 900, // 15 minutes ❌
      pdfProgress: 60, // 60% ❌
      quizScore: 45, // 45% ❌
      exercisesCompleted: 50, // 50% ❌
    },
    partial: {
      timeSpent: 1800, // 30 minutes ✅
      pdfProgress: 100, // 100% ✅
      quizScore: 65, // 65% ❌ (needs 70%)
      exercisesCompleted: 80, // 80% ❌ (needs 100%)
    }
  }

  const currentScenario = scenarios[scenario]

  // Mock progress data based on selected scenario
  const mockProgressData: LessonProgressData = {
    lessonId: 'test-lesson-123',
    userId: 'test-user-789',
    timeSpent: currentScenario.timeSpent,
    pdfProgress: currentScenario.pdfProgress,
    quizScore: currentScenario.quizScore,
    exercisesCompleted: currentScenario.exercisesCompleted,
    isCompleted: false,
    lastAccessedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Test Controls */}
      <div className="fixed top-4 left-4 z-50 bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-lg p-4 max-w-sm">
        <h3 className="text-white font-semibold mb-3">🧪 Test Controls</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Test Scenario:
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="complete">✅ All Criteria Met</option>
              <option value="partial">⚠️ Partially Complete</option>
              <option value="incomplete">❌ Nothing Complete</option>
            </select>
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <div className="font-semibold text-gray-300">Current Values:</div>
            <div>Time: {Math.floor(currentScenario.timeSpent / 60)}min / 25min</div>
            <div>PDF: {currentScenario.pdfProgress}% / 100%</div>
            <div>Quiz: {currentScenario.quizScore}% / 70%</div>
            <div>Exercises: {currentScenario.exercisesCompleted}% / 100%</div>
          </div>

          <div className="pt-2 border-t border-gray-600">
            <div className="text-xs text-gray-400">
              <div className="font-semibold text-gray-300 mb-1">Instructions:</div>
              <ul className="space-y-1">
                <li>• Change scenario to test different states</li>
                <li>• Click "Concluir" when criteria are met</li>
                <li>• Watch for celebration animation</li>
                <li>• Check browser console for logs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Lesson Page */}
      <EnhancedLessonPageExample />

      {/* Scenario Status Indicator */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
          scenario === 'complete' 
            ? 'bg-green-900/80 text-green-200 border border-green-500/50'
            : scenario === 'partial'
            ? 'bg-yellow-900/80 text-yellow-200 border border-yellow-500/50'
            : 'bg-red-900/80 text-red-200 border border-red-500/50'
        }`}>
          {scenario === 'complete' && '✅ Ready to Complete'}
          {scenario === 'partial' && '⚠️ Partially Complete'}
          {scenario === 'incomplete' && '❌ Cannot Complete'}
        </div>
      </div>

      {/* Instructions Overlay */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-30 max-w-xs">
        <div className="bg-blue-900/80 backdrop-blur-sm border border-blue-500/50 rounded-lg p-4">
          <h4 className="text-blue-200 font-semibold mb-2">
            🎯 Testing Guide
          </h4>
          <div className="text-xs text-blue-300 space-y-2">
            <p>
              <strong>Complete Scenario:</strong> All criteria met, completion button should be enabled with celebration animation.
            </p>
            <p>
              <strong>Partial Scenario:</strong> Some criteria met, button disabled with helpful error messages.
            </p>
            <p>
              <strong>Incomplete Scenario:</strong> No criteria met, button disabled with validation errors.
            </p>
            <p className="pt-2 border-t border-blue-500/30">
              <strong>Expected Flow:</strong>
              <br />1. Check progress indicators
              <br />2. Click completion button
              <br />3. See loading state
              <br />4. Watch celebration
              <br />5. Auto-redirect (simulated)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}