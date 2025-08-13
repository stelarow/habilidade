import { useEffect, useRef, useState, useCallback } from 'react';
import { intersectionObserverManager } from '../utils/performanceOptimizer.js';

/**
 * Optimized hook for lazy loading images using centralized observer
 * @param {Object} options - Configuration options
 * @param {string} options.src - Image source URL
 * @param {string} options.placeholder - Placeholder image URL
 * @param {number} options.threshold - Intersection threshold (default: 0.1)
 * @param {string} options.rootMargin - Root margin for early loading (default: '100px')
 * @param {boolean} options.eager - Load immediately without lazy loading (default: false)
 * @returns {Object} { ref, src: currentSrc, loaded, error }
 */
export default function useLazyImage(options = {}) {
  const {
    src,
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=',
    threshold = 0.1,
    rootMargin = '100px',
    eager = false
  } = options;

  const ref = useRef(null);
  const [currentSrc, setCurrentSrc] = useState(eager ? src : placeholder);
  const [loaded, setLoaded] = useState(eager);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(eager);
  const observerMetadata = useRef(null);

  // Handle intersection with performance optimization
  const handleIntersection = useCallback((entry) => {
    if (entry.isIntersecting && !inView) {
      setInView(true);
      // Unobserve after triggering to prevent unnecessary callbacks
      if (observerMetadata.current) {
        observerMetadata.current.unobserve();
        observerMetadata.current = null;
      }
    }
  }, [inView]);

  // Set up intersection observer
  useEffect(() => {
    const element = ref.current;
    
    // Skip observation if eager loading or already in view
    if (eager || inView || !element || !src) return;

    // Start observation
    observerMetadata.current = intersectionObserverManager.observe(
      element,
      handleIntersection,
      {
        threshold,
        rootMargin
      }
    );

    return () => {
      if (observerMetadata.current) {
        observerMetadata.current.unobserve();
        observerMetadata.current = null;
      }
    };
  }, [handleIntersection, threshold, rootMargin, eager, inView, src]);

  // Load image when in view
  useEffect(() => {
    if (!inView || !src || loaded) return;

    const img = new Image();
    
    const handleLoad = () => {
      setCurrentSrc(src);
      setLoaded(true);
      setError(false);
    };

    const handleError = () => {
      setError(true);
      setLoaded(false);
      console.warn(`[useLazyImage] Failed to load image: ${src}`);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    // Start loading
    img.src = src;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [inView, src, loaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerMetadata.current) {
        observerMetadata.current.unobserve();
      }
    };
  }, []);

  return {
    ref,
    src: currentSrc,
    loaded,
    error,
    inView
  };
}