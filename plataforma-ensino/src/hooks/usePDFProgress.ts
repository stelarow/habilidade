'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface PDFProgressState {
  currentPage: number
  totalPages: number
  percentageRead: number
  pagesVisited: number[]
  timeSpentPerPage: { [page: number]: number }
  totalReadingTime: number
  isCompleted: boolean
  hasStarted: boolean
  averageTimePerPage: number
  estimatedTimeRemaining: number
}

interface UsePDFProgressOptions {
  totalPages?: number
  onProgressUpdate?: (progress: PDFProgressState) => void
  onPageComplete?: (page: number) => void
  onFullyRead?: () => void
  storageKey?: string
  lessonId?: string
  pageThresholdSeconds?: number // minimum time to consider a page as "read"
}

/**
 * usePDFProgress - Hook for tracking PDF reading progress
 * 
 * Features:
 * - Tracks current page and time spent per page
 * - Calculates reading percentage based on pages visited
 * - Persists progress in localStorage
 * - Provides completion status when 100% is reached
 * - Tracks reading time and provides estimates
 * 
 * Usage:
 * const { 
 *   currentPage, 
 *   percentageRead, 
 *   isCompleted,
 *   setCurrentPage,
 *   markPageAsRead
 * } = usePDFProgress({
 *   totalPages: 50,
 *   onFullyRead: () => console.log('PDF fully read!'),
 *   lessonId: 'lesson-123'
 * })
 */
export function usePDFProgress({
  totalPages = 1,
  onProgressUpdate,
  onPageComplete,
  onFullyRead,
  storageKey = 'pdf-progress',
  lessonId = 'default',
  pageThresholdSeconds = 5 // 5 seconds minimum to consider page as read
}: UsePDFProgressOptions = {}) {
  const [progressState, setProgressState] = useState<PDFProgressState>({
    currentPage: 1,
    totalPages,
    percentageRead: 0,
    pagesVisited: [],
    timeSpentPerPage: {},
    totalReadingTime: 0,
    isCompleted: false,
    hasStarted: false,
    averageTimePerPage: 0,
    estimatedTimeRemaining: 0
  })

  const pageStartTimeRef = useRef<number>(Date.now())
  const currentPageRef = useRef<number>(1)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasCalledFullyReadRef = useRef<boolean>(false)
  const fullStorageKey = `${storageKey}-${lessonId}`

  // Calculate percentage read based on pages visited
  const calculatePercentageRead = useCallback((pagesVisited: number[], totalPages: number): number => {
    if (totalPages === 0) return 0
    return (pagesVisited.length / totalPages) * 100
  }, [])

  // Calculate estimated time remaining
  const calculateEstimatedTimeRemaining = useCallback(
    (pagesVisited: number[], averageTimePerPage: number, totalPages: number): number => {
      const pagesRemaining = totalPages - pagesVisited.length
      return pagesRemaining * averageTimePerPage
    },
    []
  )

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(fullStorageKey)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setProgressState(prev => {
          const newState = {
            ...prev,
            ...parsed,
            totalPages, // Update total pages in case it changed
            percentageRead: calculatePercentageRead(parsed.pagesVisited, totalPages),
            isCompleted: parsed.pagesVisited.length === totalPages,
            estimatedTimeRemaining: calculateEstimatedTimeRemaining(
              parsed.pagesVisited,
              parsed.averageTimePerPage,
              totalPages
            )
          }
          return newState
        })

        // Set refs based on saved data
        currentPageRef.current = parsed.currentPage || 1
        if (parsed.isCompleted) {
          hasCalledFullyReadRef.current = true
        }
      } catch (error) {
        console.error('Failed to parse saved PDF progress:', error)
      }
    }
  }, [fullStorageKey, totalPages, calculatePercentageRead, calculateEstimatedTimeRemaining])

  // Save progress to localStorage
  const saveProgress = useCallback((state: PDFProgressState) => {
    const dataToSave = {
      ...state,
      lastSaved: Date.now(),
      lessonId
    }
    localStorage.setItem(fullStorageKey, JSON.stringify(dataToSave))
  }, [fullStorageKey, lessonId])

  // Update page time and check completion
  const updatePageTime = useCallback(() => {
    const now = Date.now()
    const timeSpent = Math.floor((now - pageStartTimeRef.current) / 1000)
    const currentPage = currentPageRef.current

    setProgressState(prev => {
      const newTimeSpentPerPage = {
        ...prev.timeSpentPerPage,
        [currentPage]: (prev.timeSpentPerPage[currentPage] || 0) + 1
      }

      // Check if page should be marked as read
      const isPageRead = newTimeSpentPerPage[currentPage] >= pageThresholdSeconds
      let newPagesVisited = prev.pagesVisited
      
      if (isPageRead && !prev.pagesVisited.includes(currentPage)) {
        newPagesVisited = [...prev.pagesVisited, currentPage].sort((a, b) => a - b)
        
        // Call page complete callback
        if (onPageComplete) {
          onPageComplete(currentPage)
        }
      }

      const totalReadingTime = Object.values(newTimeSpentPerPage).reduce((sum, time) => sum + time, 0)
      const averageTimePerPage = newPagesVisited.length > 0 ? totalReadingTime / newPagesVisited.length : 0
      const percentageRead = calculatePercentageRead(newPagesVisited, prev.totalPages)
      const isCompleted = newPagesVisited.length === prev.totalPages
      const estimatedTimeRemaining = calculateEstimatedTimeRemaining(
        newPagesVisited,
        averageTimePerPage,
        prev.totalPages
      )

      const newState = {
        ...prev,
        pagesVisited: newPagesVisited,
        timeSpentPerPage: newTimeSpentPerPage,
        totalReadingTime,
        averageTimePerPage,
        percentageRead,
        isCompleted,
        hasStarted: true,
        estimatedTimeRemaining
      }

      // Call fully read callback only once
      if (isCompleted && !hasCalledFullyReadRef.current && onFullyRead) {
        hasCalledFullyReadRef.current = true
        onFullyRead()
      }

      return newState
    })
  }, [
    pageThresholdSeconds,
    onPageComplete,
    onFullyRead,
    calculatePercentageRead,
    calculateEstimatedTimeRemaining
  ])

  // Start time tracking interval
  useEffect(() => {
    intervalRef.current = setInterval(updatePageTime, 1000)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [updatePageTime])

  // Save progress when state changes
  useEffect(() => {
    if (progressState.hasStarted) {
      saveProgress(progressState)
    }
  }, [progressState, saveProgress])

  // Call progress update callback
  useEffect(() => {
    if (onProgressUpdate) {
      onProgressUpdate(progressState)
    }
  }, [progressState, onProgressUpdate])

  // Set current page with debouncing to prevent rapid page changes during scrolling
  const setCurrentPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPageRef.current) {
      // Update time for previous page
      updatePageTime()
      
      // Reset timer for new page
      pageStartTimeRef.current = Date.now()
      currentPageRef.current = page
      
      setProgressState(prev => ({
        ...prev,
        currentPage: page,
        hasStarted: true
      }))
    }
  }, [totalPages, updatePageTime])

  // Set current page with delay for scroll-based updates
  const setCurrentPageFromScroll = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPageRef.current) {
      // Only update if user stays on the same page for a short time
      setTimeout(() => {
        if (currentPageRef.current !== page) {
          setCurrentPage(page)
        }
      }, 1000) // 1 second delay to ensure user is actually viewing the page
    }
  }, [totalPages, setCurrentPage])

  // Mark specific page as read (for manual completion)
  const markPageAsRead = useCallback((page: number) => {
    setProgressState(prev => {
      if (prev.pagesVisited.includes(page)) {
        return prev
      }

      const newPagesVisited = [...prev.pagesVisited, page].sort((a, b) => a - b)
      const percentageRead = calculatePercentageRead(newPagesVisited, prev.totalPages)
      const isCompleted = newPagesVisited.length === prev.totalPages
      const estimatedTimeRemaining = calculateEstimatedTimeRemaining(
        newPagesVisited,
        prev.averageTimePerPage,
        prev.totalPages
      )

      const newState = {
        ...prev,
        pagesVisited: newPagesVisited,
        percentageRead,
        isCompleted,
        hasStarted: true,
        estimatedTimeRemaining
      }

      // Call page complete callback
      if (onPageComplete) {
        onPageComplete(page)
      }

      // Call fully read callback only once
      if (isCompleted && !hasCalledFullyReadRef.current && onFullyRead) {
        hasCalledFullyReadRef.current = true
        onFullyRead()
      }

      return newState
    })
  }, [calculatePercentageRead, calculateEstimatedTimeRemaining, onPageComplete, onFullyRead])

  // Mark all pages as read (for completion)
  const markAllPagesAsRead = useCallback(() => {
    const allPages = Array.from({ length: totalPages }, (_, i) => i + 1)
    setProgressState(prev => {
      const newState = {
        ...prev,
        pagesVisited: allPages,
        percentageRead: 100,
        isCompleted: true,
        hasStarted: true,
        estimatedTimeRemaining: 0
      }

      // Call fully read callback only once
      if (!hasCalledFullyReadRef.current && onFullyRead) {
        hasCalledFullyReadRef.current = true
        onFullyRead()
      }

      return newState
    })
  }, [totalPages, onFullyRead])

  // Reset progress
  const resetProgress = useCallback(() => {
    localStorage.removeItem(fullStorageKey)
    hasCalledFullyReadRef.current = false
    pageStartTimeRef.current = Date.now()
    currentPageRef.current = 1
    
    setProgressState({
      currentPage: 1,
      totalPages,
      percentageRead: 0,
      pagesVisited: [],
      timeSpentPerPage: {},
      totalReadingTime: 0,
      isCompleted: false,
      hasStarted: false,
      averageTimePerPage: 0,
      estimatedTimeRemaining: 0
    })
  }, [fullStorageKey, totalPages])

  // Get pages remaining
  const getPagesRemaining = useCallback((): number => {
    return totalPages - progressState.pagesVisited.length
  }, [totalPages, progressState.pagesVisited.length])

  // Get reading summary
  const getReadingSummary = useCallback(() => {
    return {
      pagesRead: progressState.pagesVisited.length,
      pagesTotal: totalPages,
      percentageRead: progressState.percentageRead,
      timeSpent: progressState.totalReadingTime,
      averageTimePerPage: progressState.averageTimePerPage,
      estimatedTimeRemaining: progressState.estimatedTimeRemaining,
      isCompleted: progressState.isCompleted
    }
  }, [progressState, totalPages])

  // Check if specific page is read
  const isPageRead = useCallback((page: number): boolean => {
    return progressState.pagesVisited.includes(page)
  }, [progressState.pagesVisited])

  return {
    // State
    ...progressState,
    
    // Actions
    setCurrentPage,
    setCurrentPageFromScroll,
    markPageAsRead,
    markAllPagesAsRead,
    resetProgress,
    
    // Utilities
    getPagesRemaining,
    getReadingSummary,
    isPageRead
  }
}