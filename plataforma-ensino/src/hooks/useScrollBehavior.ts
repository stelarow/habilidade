'use client'

import { useState, useEffect, useCallback } from 'react'

interface ScrollState {
  scrollY: number
  scrollDirection: 'up' | 'down' | null
  isScrolled: boolean
}

/**
 * Custom hook for managing scroll behavior
 * Provides scroll position, direction, and scrolled state
 * Used for implementing scroll-following header behavior
 */
export const useScrollBehavior = (threshold: number = 10) => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: null,
    isScrolled: false
  })

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    setScrollState(prevState => {
      // Only update if there's a meaningful change to prevent unnecessary re-renders
      const scrollDiff = Math.abs(currentScrollY - prevState.scrollY)
      if (scrollDiff < 1) return prevState

      const direction = currentScrollY > prevState.scrollY ? 'down' : 'up'
      const newIsScrolled = currentScrollY > threshold
      
      // Only update direction if scroll difference is significant
      const newDirection = scrollDiff > threshold ? direction : prevState.scrollDirection
      
      return {
        scrollY: currentScrollY,
        scrollDirection: newDirection,
        isScrolled: newIsScrolled
      }
    })
  }, [threshold])

  useEffect(() => {
    // Set initial scroll position
    setScrollState({
      scrollY: window.scrollY,
      scrollDirection: null,
      isScrolled: window.scrollY > threshold
    })

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, threshold])

  return scrollState
}