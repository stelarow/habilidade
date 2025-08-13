/**
 * Performance Optimizer - Bundle size and runtime performance improvements
 */

// Lazy loading utilities - moved to LazyComponents.jsx to avoid JSX in .js file
export const createLazyComponentFactory = (importFn) => {
  // Returns a factory function for creating lazy components
  return () => {
    if (typeof React !== 'undefined') {
      return React.lazy(importFn);
    }
    console.warn('React not available for lazy loading');
    return null;
  };
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
    this.callbacks = new WeakMap();
    this.activeElements = new WeakSet();
    this.metrics = {
      totalObservers: 0,
      totalElements: 0,
      observerConfigs: new Set()
    };
    
    // Performance monitoring
    this.performanceMetrics = {
      observerCreations: 0,
      callbackExecutions: 0,
      averageProcessingTime: 0,
      lastProcessingTime: 0
    };
  }

  /**
   * Observe an element with consolidated observer management
   * @param {Element} element - DOM element to observe
   * @param {Function} callback - Callback function (entry) => {}
   * @param {Object} options - IntersectionObserver options
   * @returns {Object} - Observer metadata for cleanup
   */
  observe(element, callback, options = {}) {
    if (!element || typeof callback !== 'function') {
      console.warn('[ObserverManager] Invalid element or callback provided');
      return null;
    }

    // Normalize options for consistent hashing
    const normalizedOptions = this.normalizeOptions(options);
    const optionsKey = this.getOptionsKey(normalizedOptions);
    
    // Track configuration diversity for optimization insights
    this.metrics.observerConfigs.add(optionsKey);
    
    // Get or create observer for this configuration
    let observerData = this.observers.get(optionsKey);
    
    if (!observerData) {
      observerData = this.createObserver(normalizedOptions, optionsKey);
      this.observers.set(optionsKey, observerData);
      this.performanceMetrics.observerCreations++;
    }

    // Store callback and register element
    this.callbacks.set(element, {
      callback,
      options: normalizedOptions,
      optionsKey,
      registeredAt: Date.now()
    });
    
    observerData.observer.observe(element);
    observerData.elements.add(element);
    this.activeElements.add(element);
    this.metrics.totalElements++;

    // Return metadata for manual cleanup if needed
    return {
      element,
      optionsKey,
      unobserve: () => this.unobserve(element)
    };
  }

  /**
   * Create a new IntersectionObserver with performance monitoring
   */
  createObserver(options, optionsKey) {
    const observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      options
    );

    this.metrics.totalObservers++;
    
    return {
      observer,
      elements: new Set(),
      options,
      createdAt: Date.now(),
      callbackCount: 0
    };
  }

  /**
   * Handle intersection events with performance monitoring
   */
  handleIntersection(entries) {
    const startTime = performance.now();
    
    entries.forEach(entry => {
      const callbackData = this.callbacks.get(entry.target);
      
      if (callbackData && callbackData.callback) {
        try {
          callbackData.callback(entry);
          
          // Update observer data
          const observerData = this.observers.get(callbackData.optionsKey);
          if (observerData) {
            observerData.callbackCount++;
          }
          
        } catch (error) {
          console.error('[ObserverManager] Callback execution failed:', error);
        }
      }
    });

    // Performance tracking
    const processingTime = performance.now() - startTime;
    this.performanceMetrics.callbackExecutions++;
    this.performanceMetrics.lastProcessingTime = processingTime;
    this.performanceMetrics.averageProcessingTime = 
      ((this.performanceMetrics.averageProcessingTime * (this.performanceMetrics.callbackExecutions - 1)) + processingTime) / 
      this.performanceMetrics.callbackExecutions;
  }

  /**
   * Stop observing an element
   */
  unobserve(element) {
    if (!element || !this.activeElements.has(element)) {
      return false;
    }

    const callbackData = this.callbacks.get(element);
    if (!callbackData) return false;

    const observerData = this.observers.get(callbackData.optionsKey);
    if (observerData) {
      observerData.observer.unobserve(element);
      observerData.elements.delete(element);
      
      // Clean up empty observers
      if (observerData.elements.size === 0) {
        observerData.observer.disconnect();
        this.observers.delete(callbackData.optionsKey);
        this.metrics.totalObservers--;
      }
    }

    this.callbacks.delete(element);
    this.activeElements.delete(element);
    this.metrics.totalElements--;
    
    return true;
  }

  /**
   * Normalize options for consistent observer grouping
   */
  normalizeOptions(options) {
    return {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: Array.isArray(options.threshold) 
        ? options.threshold.slice().sort() 
        : [options.threshold || 0]
    };
  }

  /**
   * Generate unique key for options
   */
  getOptionsKey(options) {
    return JSON.stringify({
      root: options.root ? 'custom' : null,
      rootMargin: options.rootMargin,
      threshold: options.threshold
    });
  }

  /**
   * Get performance and usage statistics
   */
  getStats() {
    const observerDetails = Array.from(this.observers.entries()).map(([key, data]) => ({
      optionsKey: key,
      elementCount: data.elements.size,
      callbackCount: data.callbackCount,
      ageMs: Date.now() - data.createdAt,
      options: data.options
    }));

    return {
      summary: {
        totalObservers: this.metrics.totalObservers,
        totalElements: this.metrics.totalElements,
        uniqueConfigurations: this.metrics.observerConfigs.size,
        averageElementsPerObserver: this.metrics.totalObservers > 0 
          ? (this.metrics.totalElements / this.metrics.totalObservers).toFixed(2)
          : 0
      },
      performance: this.performanceMetrics,
      observers: observerDetails,
      efficiency: {
        consolidationRatio: this.metrics.observerConfigs.size > 0 
          ? (this.metrics.totalObservers / this.metrics.observerConfigs.size).toFixed(2)
          : 1,
        averageProcessingTime: this.performanceMetrics.averageProcessingTime.toFixed(2) + 'ms'
      }
    };
  }

  /**
   * Cleanup all observers
   */
  cleanup() {
    this.observers.forEach(({ observer }) => {
      observer.disconnect();
    });
    
    this.observers.clear();
    this.callbacks = new WeakMap();
    this.activeElements = new WeakSet();
    
    // Reset metrics
    this.metrics = {
      totalObservers: 0,
      totalElements: 0,
      observerConfigs: new Set()
    };
    
    console.log('[ObserverManager] Cleanup completed');
  }

  /**
   * Debug helper - log current state
   */
  logStats() {
    const stats = this.getStats();
    console.group('[ObserverManager] Performance Stats');
    console.table(stats.summary);
    console.table(stats.performance);
    console.table(stats.observers);
    console.log('Efficiency Metrics:', stats.efficiency);
    console.groupEnd();
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
      // Dynamic chart loading - implement when chart library is needed
      console.log('Chart library loading requested - implement when needed');
      return null;
    } catch (error) {
      console.warn('Failed to load chart library:', error);
      return null;
    }
  },

  // Code splitting by route - moved to LazyComponents.jsx to avoid React dependency
  createRouteChunk(routeLoader) {
    console.warn('createRouteChunk moved to LazyComponents.jsx - use that instead');
    return null;
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
  createLazyComponentFactory,
  cleanupAnimations,
  intersectionObserverManager,
  measurePerformance,
  imageOptimization,
  bundleOptimization,
  animationOptimization,
  initializePerformanceOptimizations
};