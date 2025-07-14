'use client'

import React from 'react'
import { chapter2Questions } from '@/data/quiz-questions'

interface QuizQuestionsDataProps {
  onDataLoaded: (questions: typeof chapter2Questions) => void
}

/**
 * QuizQuestionsData - Component that provides quiz questions data
 * 
 * This component loads the quiz questions from the data file and provides
 * them to the quiz interface. It's designed to be easily replaceable
 * with a dynamic data source (API, database, etc.) in the future.
 */
export function QuizQuestionsData({ onDataLoaded }: QuizQuestionsDataProps) {
  React.useEffect(() => {
    // Simulate loading from data source
    const loadQuestions = () => {
      // In a real application, this could be an API call
      // For now, we use the static questions from Chapter 2
      onDataLoaded(chapter2Questions)
    }

    loadQuestions()
  }, [onDataLoaded])

  return null // This component doesn't render anything
}

/**
 * Hook to get quiz questions data
 */
export function useQuizQuestions() {
  const [questions, setQuestions] = React.useState(chapter2Questions)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const loadQuestions = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate async loading
      await new Promise(resolve => setTimeout(resolve, 100))
      setQuestions(chapter2Questions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  return {
    questions,
    isLoading,
    error,
    reload: loadQuestions
  }
}

/**
 * Convert YouTube URL to embedded format
 */
export function convertYouTubeUrl(url: string): { embedUrl: string; videoId: string | null } {
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  const videoId = videoIdMatch ? videoIdMatch[1] : null
  
  return {
    embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : url,
    videoId
  }
}

/**
 * Get YouTube video thumbnail
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high') {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`
}