'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface ScrollState {
  scrollY: number
  scrollDirection: 'up' | 'down' | null
  isScrolled: boolean
  scrollProgress: number
  isScrollingFast: boolean
}

/**
 * Enhanced custom hook for managing scroll behavior with performance optimizations
 * Provides scroll position, direction, scrolled state, and scroll progress
 * Used for implementing smooth scroll-following header behavior matching homepage design
 * 
 * Features:
 * - Throttled scroll events for better performance
 * - Scroll progress calculation for animations
 * - Fast scrolling detection
 * - Smooth state transitions
 */
export const useScrollBehavior = (threshold: number = 10) => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: null,
    isScrolled: false,
    scrollProgress: 0,
    isScrollingFast: false
  })

  // Use refs for performance optimization
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(0)
  const ticking = useRef(false)

  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY
    const currentTime = Date.now()
    const timeDiff = currentTime - lastScrollTime.current
    const scrollDiff = Math.abs(currentScrollY - lastScrollY.current)

    // Calculate scroll velocity for fast scrolling detection
    const scrollVelocity = timeDiff > 0 ? scrollDiff / timeDiff : 0
    const isScrollingFast = scrollVelocity > 2 // Threshold for fast scrolling

    // Calculate scroll progress (0-1) based on document height
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollProgress = documentHeight > 0 ? Math.min(currentScrollY / documentHeight, 1) : 0

    setScrollState(prevState => {
      // Only update if there's a meaningful change to prevent unnecessary re-renders
      if (scrollDiff < 1 && Math.abs(scrollProgress - prevState.scrollProgress) < 0.01) {
        return prevState
      }

      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up'
      const newIsScrolled = currentScrollY > threshold
      
      // Only update direction if scroll difference is significant
      const newDirection = scrollDiff > threshold ? direction : prevState.scrollDirection
      
      return {
        scrollY: currentScrollY,
        scrollDirection: newDirection,
        isScrolled: newIsScrolled,
        scrollProgress,
        isScrollingFast
      }
    })

    lastScrollY.current = currentScrollY
    lastScrollTime.current = currentTime
    ticking.current = false
  }, [threshold])

  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame for smooth performance
    if (!ticking.current) {
      requestAnimationFrame(updateScrollState)
      ticking.current = true
    }
  }, [updateScrollState])

  useEffect(() => {
    // Set initial scroll position
    const initialScrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const initialScrollProgress = documentHeight > 0 ? Math.min(initialScrollY / documentHeight, 1) : 0

    setScrollState({
      scrollY: initialScrollY,
      scrollDirection: null,
      isScrolled: initialScrollY > threshold,
      scrollProgress: initialScrollProgress,
      isScrollingFast: false
    })

    lastScrollY.current = initialScrollY
    lastScrollTime.current = Date.now()

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, threshold])

  return scrollState
}