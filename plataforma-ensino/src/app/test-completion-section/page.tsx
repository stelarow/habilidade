'use client'

import React, { useState } from 'react'
import { CompletionSection } from '@/components/lesson'
import { LessonProgressData } from '@/types/lesson'

export default function TestCompletionSectionPage() {
  const [timeSpent, setTimeSpent] = useState(0)
  const [progressData, setProgressData] = useState<LessonProgressData>({
    videoProgress: {
      currentTime: 0,
      duration: 300,
      percentageWatched: 0,
      watchTime: 0,
      lastPosition: 0,
      playbackRate: 1,
      completedSegments: []
    },
    pdfProgress: {
      currentPage: 1,
      totalPages: 20,
      percentageRead: 0,
      bookmarks: [],
      readingTime: 0,
      lastPageViewed: 1
    },
    quizProgress: {
      currentQuestion: 0,
      totalQuestions: 5,
      answeredQuestions: [],
      score: 0,
      attempts: 0,
      timeSpent: 0,
      isCompleted: false,
      isPassed: false
    },
    exerciseProgress: {
      completedExercises: [],
      submittedFiles: [],
      pendingReviews: [],
      totalExercises: 3,
      completionPercentage: 0
    },
    contentProgress: {
      scrollPercentage: 0,
      readingTime: 0,
      sectionsRead: [],
      estimatedCompletionTime: 0
    },
    overallProgress: {
      percentageComplete: 0,
      estimatedTimeRemaining: 0,
      lastActivity: new Date().toISOString(),
      isCompleted: false,
      componentProgress: []
    }
  })

  // Simulate time progression
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const simulateProgress = (type: 'pdf' | 'quiz' | 'exercises') => {
    setProgressData(prev => {
      const newData = { ...prev }
      
      switch (type) {
        case 'pdf':
          newData.pdfProgress.percentageRead = Math.min(100, prev.pdfProgress.percentageRead + 25)
          break
        case 'quiz':
          newData.quizProgress.score = 85
          newData.quizProgress.isCompleted = true
          newData.quizProgress.isPassed = true
          break
        case 'exercises':
          newData.exerciseProgress.completionPercentage = Math.min(100, prev.exerciseProgress.completionPercentage + 33.33)
          break
      }
      
      return newData
    })
  }

  const handleComplete = async () => {
    alert('Lesson completed successfully!')
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">CompletionSection Test</h1>
          <p className="text-muted-foreground">
            Test the completion criteria validation and UI states
          </p>
        </div>

        {/* Progress Simulation Controls */}
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Simulate Progress</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => simulateProgress('pdf')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Advance PDF (+25%)
            </button>
            <button
              onClick={() => simulateProgress('quiz')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Complete Quiz (85%)
            </button>
            <button
              onClick={() => simulateProgress('exercises')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Advance Exercises (+33%)
            </button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Time spent: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</p>
            <p>PDF Progress: {progressData.pdfProgress.percentageRead}%</p>
            <p>Quiz Score: {progressData.quizProgress.score}% (Completed: {progressData.quizProgress.isCompleted ? 'Yes' : 'No'})</p>
            <p>Exercises: {progressData.exerciseProgress.completionPercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* CompletionSection Component */}
        <CompletionSection
          progressData={progressData}
          timeSpent={timeSpent}
          minimumTimeMinutes={2} // Reduced for testing
          minimumQuizScore={70}
          onComplete={handleComplete}
          onProgressUpdate={(progress) => {
            console.log('Overall progress:', progress)
          }}
        />

        {/* Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Test Instructions:
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Wait 2+ minutes for time criterion to complete</li>
            <li>• Click &quot;Complete Quiz&quot; to pass the quiz criterion</li>
            <li>• Click &quot;Advance Exercises&quot; 3 times to complete exercises</li>
            <li>• Click &quot;Advance PDF&quot; 4 times to complete PDF reading</li>
            <li>• Once all criteria are met, the completion button will be enabled</li>
          </ul>
        </div>
      </div>
    </div>
  )
}