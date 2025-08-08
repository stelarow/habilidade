/**
 * Optimized Scroll Hook - Centralized, throttled scroll management
 * Replaces multiple inefficient scroll handlers across components
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// Global scroll manager to prevent multiple listeners
class ScrollManager {
  constructor() {
    this.listeners = new Set();
    this.isScrolling = false;
    this.scrollY = 0;
    this.direction = 'down';
    this.lastScrollY = 0;
    this.throttleId = null;
  }

  addListener(callback) {
    this.listeners.add(callback);
    
    // Initialize scroll handling if this is the first listener
    if (this.listeners.size === 1) {
      this.startScrollTracking();
    }
  }

  removeListener(callback) {
    this.listeners.delete(callback);
    
    // Stop scroll handling if no listeners remain
    if (this.listeners.size === 0) {
      this.stopScrollTracking();
    }
  }

  startScrollTracking() {
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  stopScrollTracking() {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.throttleId) {
      cancelAnimationFrame(this.throttleId);
    }
  }

  handleScroll() {
    // Use requestAnimationFrame for smooth performance
    if (this.throttleId) {
      cancelAnimationFrame(this.throttleId);
    }

    this.throttleId = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > this.lastScrollY ? 'down' : 'up';
      
      const scrollData = {
        scrollY: currentScrollY,
        direction,
        isScrolling: true,
        deltaY: currentScrollY - this.lastScrollY
      };

      this.scrollY = currentScrollY;
      this.direction = direction;
      this.lastScrollY = currentScrollY;
      this.isScrolling = true;

      // Notify all listeners
      this.listeners.forEach(callback => {
        try {
          callback(scrollData);
        } catch (error) {
          console.warn('Error in scroll listener:', error);
        }
      });

      // Clear isScrolling flag after a delay
      clearTimeout(this.scrollEndTimer);
      this.scrollEndTimer = setTimeout(() => {
        this.isScrolling = false;
        this.listeners.forEach(callback => {
          try {
            callback({ ...scrollData, isScrolling: false });
          } catch (error) {
            console.warn('Error in scroll end listener:', error);
          }
        });
      }, 150);
    });
  }
}

// Global instance
const globalScrollManager = new ScrollManager();

/**
 * Optimized scroll hook with multiple features
 */
export const useOptimizedScroll = (options = {}) => {
  const {
    threshold = 50,
    onScroll,
    onScrollEnd,
    trackDirection = false,
    trackProgress = false,
    element = null // For element-specific scroll tracking
  } = options;

  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    direction: 'down',
    isScrolling: false,
    progress: 0,
    isScrolled: false
  });

  const onScrollRef = useRef(onScroll);
  const onScrollEndRef = useRef(onScrollEnd);

  // Update refs without causing re-renders
  useEffect(() => {
    onScrollRef.current = onScroll;
    onScrollEndRef.current = onScrollEnd;
  }, [onScroll, onScrollEnd]);

  const handleScrollData = useCallback((scrollData) => {
    const { scrollY, direction, isScrolling, deltaY } = scrollData;
    const isScrolled = scrollY > threshold;
    
    let progress = 0;
    if (trackProgress) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
    }

    const newState = {
      scrollY,
      direction: trackDirection ? direction : 'down',
      isScrolling,
      progress,
      isScrolled,
      deltaY
    };

    setScrollState(newState);

    // Call callbacks if they exist
    if (isScrolling && onScrollRef.current) {
      onScrollRef.current(newState);
    } else if (!isScrolling && onScrollEndRef.current) {
      onScrollEndRef.current(newState);
    }
  }, [threshold, trackDirection, trackProgress]);

  useEffect(() => {
    if (element) {
      // Element-specific scroll handling
      let elementScrollY = 0;
      const handleElementScroll = () => {
        elementScrollY = element.scrollTop;
        const maxScroll = element.scrollHeight - element.clientHeight;
        const progress = maxScroll > 0 ? Math.min(elementScrollY / maxScroll, 1) : 0;
        
        setScrollState(prev => ({
          ...prev,
          scrollY: elementScrollY,
          progress,
          isScrolled: elementScrollY > threshold
        }));
      };

      element.addEventListener('scroll', handleElementScroll, { passive: true });
      return () => element.removeEventListener('scroll', handleElementScroll);
    } else {
      // Window scroll handling
      globalScrollManager.addListener(handleScrollData);
      return () => globalScrollManager.removeListener(handleScrollData);
    }
  }, [element, handleScrollData]);

  return scrollState;
};

/**
 * Specialized hook for header visibility
 */
export const useScrollHeader = (threshold = 50) => {
  const { scrollY, direction, isScrolling } = useOptimizedScroll({
    threshold,
    trackDirection: true
  });

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isScrolling) return;

    const shouldHide = scrollY > threshold && direction === 'down';
    const shouldShow = direction === 'up' || scrollY <= threshold;

    if (shouldHide && isVisible) {
      setIsVisible(false);
    } else if (shouldShow && !isVisible) {
      setIsVisible(true);
    }
  }, [scrollY, direction, isScrolling, threshold, isVisible]);

  return {
    isVisible,
    isScrolled: scrollY > threshold,
    scrollY
  };
};

/**
 * Hook for scroll progress tracking
 */
export const useScrollProgress = () => {
  return useOptimizedScroll({
    trackProgress: true
  });
};

/**
 * Hook for element visibility detection with intersection observer
 */
export const useScrollVisibility = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          
          // Stop observing if triggerOnce is true
          if (triggerOnce) {
            observerRef.current?.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return {
    elementRef,
    isVisible: triggerOnce ? hasBeenVisible : isVisible,
    hasBeenVisible
  };
};

/**
 * Debounced scroll hook for expensive operations
 */
export const useDebouncedScroll = (callback, delay = 300) => {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback((scrollData) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(scrollData);
    }, delay);
  }, [delay]);

  useOptimizedScroll({
    onScrollEnd: debouncedCallback
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};

export default useOptimizedScroll;