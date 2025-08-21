/**
 * Performance Optimizer - Bundle size and runtime performance improvements
 */

import React from 'react';

// Lazy loading utilities
export const createLazyComponent = (importFn, fallback = null) => {
  const LazyComponent = React.lazy(importFn);
  
  return React.forwardRef((props, ref) => (
    <React.Suspense key={`lazy-${importFn.toString().slice(0, 20)}`} fallback={fallback}>
      <LazyComponent ref={ref} {...props} />
    </React.Suspense>
  ));
};

// Memory management
export const cleanupAnimations = () => {
  // Remove will-change from all elements after animations complete
  const elements = document.querySelectorAll('[style*="will-change"]');
  elements.forEach(el => {
    if (!el.style.willChange || el.style.willChange === 'auto') return;
    
    // Check if element is currently animating
    const computedStyle = window.getComputedStyle(el);
    const isAnimating = computedStyle.animationName !== 'none' || 
                       computedStyle.transitionProperty !== 'none';
    
    if (!isAnimating) {
      el.style.willChange = 'auto';
      el.classList.add('animation-complete');
    }
  });
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
            entries.forEach(entry => {
              const callback = entry.target._intersectionCallback;
              if (callback) callback(entry);
            });
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
    this.observers.forEach(({ observer, elements }) => {
      if (elements.has(element)) {
        observer.unobserve(element);
        elements.delete(element);
        delete element._intersectionCallback;
      }
    });
  }

  cleanup() {
    this.observers.forEach(({ observer }) => {
      observer.disconnect();
    });
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
      } catch (e) {
        console.warn('Performance measurement failed:', e);
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
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      } : null
    };
  }
};

// Image optimization helpers
export const imageOptimization = {
  preloadCritical(urls) {
    if (!Array.isArray(urls)) return;
    
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  },

  generateSrcSet(baseUrl, sizes = [400, 800, 1200, 1600]) {
    return sizes.map(size => {
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}w=${size}&q=80 ${size}w`;
    }).join(', ');
  },

  supportsWebP() {
    if (typeof window === 'undefined') return false;
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
    element.classList.add('animating');
    element.classList.add(animationClass);

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
      updates.forEach(update => {
        try {
          update();
        } catch (error) {
          console.warn('DOM update failed:', error);
        }
      });
    });
  },

  // Reduce motion for accessibility
  shouldReduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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