import { useEffect, useRef, useState, useCallback } from 'react';
import { intersectionObserverManager } from '../utils/performanceOptimizer.js';

function useInView(options = {}) {
  const {
    triggerOnce = true,
    threshold = 0.2,
    rootMargin = '0px',
    root = null,
    disabled = false
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState(null);
  const observerMetadata = useRef(null);

  // Memoized callback to prevent unnecessary observer updates
  const handleIntersection = useCallback((intersectionEntry) => {
    const isIntersecting = intersectionEntry.isIntersecting;
    
    setEntry(intersectionEntry);
    
    if (isIntersecting) {
      setIsVisible(true);
      
      // Auto-unobserve if triggerOnce is enabled
      if (triggerOnce && observerMetadata.current) {
        observerMetadata.current.unobserve();
        observerMetadata.current = null;
      }
    } else if (!triggerOnce) {
      setIsVisible(false);
    }
  }, [triggerOnce]);

  useEffect(() => {
    const element = ref.current;
    
    // Don't observe if disabled or no element
    if (disabled || !element) return;

    // Clean up existing observation
    if (observerMetadata.current) {
      observerMetadata.current.unobserve();
    }

    // Start new observation with centralized manager
    observerMetadata.current = intersectionObserverManager.observe(
      element,
      handleIntersection,
      {
        threshold,
        rootMargin,
        root
      }
    );

    // Cleanup function
    return () => {
      if (observerMetadata.current) {
        observerMetadata.current.unobserve();
        observerMetadata.current = null;
      }
    };
  }, [handleIntersection, threshold, rootMargin, root, disabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerMetadata.current) {
        observerMetadata.current.unobserve();
      }
    };
  }, []);

  return [ref, isVisible, entry];
} 