/**
 * Performance Optimizer - Bundle size and runtime performance improvements
 */

import React from 'react';

// Lazy loading utilities
export const createLazyComponent = (importFunction, fallback = null) => {
  const LazyComponent = React.lazy(importFunction);
  
  return React.forwardRef((properties, reference) => (
    <React.Suspense key={`lazy-${importFunction.toString().slice(0, 20)}`} fallback={fallback}>
      <LazyComponent ref={reference} {...properties} />
    </React.Suspense>
  ));
};

// Memory management
export const cleanupAnimations = () => {
  // Remove will-change from all elements after animations complete
  const elements = document.querySelectorAll('[style*="will-change"]');
  for (const element of elements) {
    if (!element.style.willChange || element.style.willChange === 'auto') continue;
    
    // Check if element is currently animating
    const computedStyle = globalThis.getComputedStyle(element);
    const isAnimating = computedStyle.animationName !== 'none' || 
                       computedStyle.transitionProperty !== 'none';
    
    if (!isAnimating) {
      element.style.willChange = 'auto';
      element.classList.add('animation-complete');
    }
  }
};

// Intersection Observer singleton
class IntersectionObserverManager {
  constructor() {
    this.observers = new Map();
  }

  observe(element, callback, options = {}) {
    const key = JSON.stringify(options);
    
    if (!this.observers.has(key)) {
      this.observers.set(key, {
        observer: new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const callback = entry.target._intersectionCallback;
              if (callback) callback(entry);
            }
          },
          options
        ),
        elements: new Set()
      });
    }

    const observerData = this.observers.get(key);
    element._intersectionCallback = callback;
    observerData.observer.observe(element);
    observerData.elements.add(element);
  }

  unobserve(element) {
    for (const { observer, elements } of this.observers) {
      if (elements.has(element)) {
        observer.unobserve(element);
        elements.delete(element);
        delete element._intersectionCallback;
      }
    }
  }

  cleanup() {
    for (const { observer } of this.observers) {
      observer.disconnect();
    }
    this.observers.clear();
  }
}

export const intersectionObserverManager = new IntersectionObserverManager();

// Performance monitoring
export const measurePerformance = {
  mark(name) {
    if (performance.mark) {
      performance.mark(name);
    }
  },

  measure(name, startMark, endMark) {
    if (performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        return measure ? measure.duration : 0;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return 0;
      }
    }
    return 0;
  },

  getMetrics() {
    if (!performance.getEntriesByType) return {};

    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.navigationStart,
      loadComplete: navigation?.loadEventEnd - navigation?.navigationStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1_048_576),
        total: Math.round(performance.memory.totalJSHeapSize / 1_048_576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1_048_576)
      } : null
    };
  }
};

// Image optimization helpers
export const imageOptimization = {
  preloadCritical(urls) {
    if (!Array.isArray(urls)) return;
    
    for (const url of urls) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.append(link);
    }
  },

  generateSrcSet(baseUrl, sizes = [400, 800, 1200, 1600]) {
    return sizes.map(size => {
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}w=${size}&q=80 ${size}w`;
    }).join(', ');
  },

  supportsWebP() {
    if (globalThis.window === undefined) return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') > 0;
  }
};

// Bundle optimization
export const bundleOptimization = {
  // Dynamic imports for heavy libraries
  async loadFramerMotion() {
    try {
      const framer = await import('framer-motion');
      return framer;
    } catch (error) {
      console.warn('Failed to load framer-motion:', error);
      return null;
    }
  },

  async loadChartLibrary() {
    try {
      // Replace recharts with lighter alternative when possible
      const charts = await import('chart.js/auto');
      return charts;
    } catch (error) {
      console.warn('Failed to load chart library:', error);
      return null;
    }
  },

  // Code splitting by route
  createRouteChunk(routeLoader) {
    return React.lazy(routeLoader);
  }
};

// Animation performance
export const animationOptimization = {
  // Safe animation triggers
  triggerSafeAnimation(element, animationClass) {
    if (!element) return;

    // Add will-change only during animation
    element.style.willChange = 'opacity, transform';
    element.classList.add('animating', animationClass);

    // Remove will-change after animation
    const cleanup = () => {
      element.style.willChange = 'auto';
      element.classList.remove('animating');
      element.classList.add('animation-complete');
    };

    // Cleanup after transition/animation ends
    element.addEventListener('transitionend', cleanup, { once: true });
    element.addEventListener('animationend', cleanup, { once: true });

    // Fallback cleanup after maximum expected duration
    setTimeout(cleanup, 2000);
  },

  // Batch DOM operations
  batchDOMUpdates(updates) {
    if (!Array.isArray(updates)) return;

    // Use requestAnimationFrame to batch updates
    requestAnimationFrame(() => {
      for (const update of updates) {
        try {
          update();
        } catch (error) {
          console.warn('DOM update failed:', error);
        }
      }
    });
  },

  // Reduce motion for accessibility
  shouldReduceMotion() {
    return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

// Performance cleanup on page unload
export const setupPerformanceCleanup = () => {
  const cleanup = () => {
    cleanupAnimations();
    intersectionObserverManager.cleanup();
  };

  window.addEventListener('beforeunload', cleanup);
  window.addEventListener('pagehide', cleanup);

  // Return cleanup function for manual use
  return cleanup;
};

// Main performance initializer
export const initializePerformanceOptimizations = () => {
  // Set up cleanup
  const cleanup = setupPerformanceCleanup();

  // Regular cleanup interval
  const cleanupInterval = setInterval(() => {
    cleanupAnimations();
  }, 5000);

  // Monitor performance
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      const metrics = measurePerformance.getMetrics();
      console.log('Performance Metrics:', metrics);
    }, 2000);
  }

  return () => {
    cleanup();
    clearInterval(cleanupInterval);
  };
};

export default {
  createLazyComponent,
  cleanupAnimations,
  intersectionObserverManager,
  measurePerformance,
  imageOptimization,
  bundleOptimization,
  animationOptimization,
  initializePerformanceOptimizations
};