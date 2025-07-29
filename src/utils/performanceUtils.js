/**
 * Performance Utilities for Monitoring and Validation
 * Comprehensive toolkit for measuring and optimizing performance metrics
 */

// Web Vitals thresholds
const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }  // Time to First Byte
};

// Performance observer instance
let performanceObserver = null;
let metricsBuffer = [];
let isMonitoring = false;

/**
 * Initialize Web Vitals monitoring
 * @param {Function} onMetric - Callback for metric updates
 */
export const initWebVitals = (onMetric) => {
  if (!('PerformanceObserver' in window)) {
    console.warn('[Performance] PerformanceObserver not supported');
    return;
  }

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    const metric = {
      name: 'LCP',
      value: lastEntry.startTime,
      rating: getRating('LCP', lastEntry.startTime),
      element: lastEntry.element,
      timestamp: Date.now()
    };
    
    onMetric(metric);
    metricsBuffer.push(metric);
  });

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const metric = {
        name: 'FID',
        value: entry.processingStart - entry.startTime,
        rating: getRating('FID', entry.processingStart - entry.startTime),
        event: entry.name,
        timestamp: Date.now()
      };
      
      onMetric(metric);
      metricsBuffer.push(metric);
    });
  });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  let clsEntries = [];
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);
      }
    });

    const metric = {
      name: 'CLS',
      value: clsValue,
      rating: getRating('CLS', clsValue),
      entries: clsEntries.slice(),
      timestamp: Date.now()
    };
    
    onMetric(metric);
    metricsBuffer[metricsBuffer.findIndex(m => m.name === 'CLS')] = metric;
    if (!metricsBuffer.find(m => m.name === 'CLS')) {
      metricsBuffer.push(metric);
    }
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    fidObserver.observe({ entryTypes: ['first-input'] });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    isMonitoring = true;
  } catch (error) {
    console.error('[Performance] Error initializing observers:', error);
  }

  // Store observers for cleanup
  performanceObserver = {
    lcp: lcpObserver,
    fid: fidObserver,
    cls: clsObserver
  };
};

/**
 * Get performance rating based on thresholds
 * @param {string} metricName - Name of the metric
 * @param {number} value - Metric value
 * @returns {string} Rating (good, needs-improvement, poor)
 */
export const getRating = (metricName, value) => {
  const thresholds = WEB_VITALS_THRESHOLDS[metricName];
  if (!thresholds) return 'unknown';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
};

/**
 * Get color for rating visualization
 * @param {string} rating - Performance rating
 * @returns {string} CSS color class
 */
export const getRatingColor = (rating) => {
  switch (rating) {
    case 'good': return 'text-green-400';
    case 'needs-improvement': return 'text-yellow-400';
    case 'poor': return 'text-red-400';
    default: return 'text-zinc-400';
  }
};

/**
 * Measure First Contentful Paint (FCP)
 * @returns {Promise<Object>} FCP metric
 */
export const measureFCP = () => {
  return new Promise((resolve) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcpEntry) {
          const metric = {
            name: 'FCP',
            value: fcpEntry.startTime,
            rating: getRating('FCP', fcpEntry.startTime),
            timestamp: Date.now()
          };
          observer.disconnect();
          resolve(metric);
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    } else {
      // Fallback using Navigation Timing
      const timing = performance.timing;
      const fcp = timing.domContentLoadedEventStart - timing.navigationStart;
      resolve({
        name: 'FCP',
        value: fcp,
        rating: getRating('FCP', fcp),
        timestamp: Date.now(),
        fallback: true
      });
    }
  });
};

/**
 * Measure Time to First Byte (TTFB)
 * @returns {Object} TTFB metric
 */
export const measureTTFB = () => {
  if ('PerformanceObserver' in window) {
    const [navigationEntry] = performance.getEntriesByType('navigation');
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      return {
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
        timestamp: Date.now()
      };
    }
  }
  
  // Fallback
  const timing = performance.timing;
  const ttfb = timing.responseStart - timing.navigationStart;
  return {
    name: 'TTFB',
    value: ttfb,
    rating: getRating('TTFB', ttfb),
    timestamp: Date.now(),
    fallback: true
  };
};

/**
 * Get current memory usage
 * @returns {Object|null} Memory metrics
 */
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = performance.memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100,
      usage: Math.round(memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100),
      timestamp: Date.now()
    };
  }
  return null;
};

/**
 * Monitor bundle size and loading performance
 * @returns {Promise<Object>} Bundle metrics
 */
export const getBundleMetrics = async () => {
  const entries = performance.getEntriesByType('resource');
  
  const jsFiles = entries.filter(entry => 
    entry.name.includes('.js') && 
    !entry.name.includes('node_modules')
  );
  
  const cssFiles = entries.filter(entry => 
    entry.name.includes('.css')
  );
  
  const totalJSSize = jsFiles.reduce((total, file) => total + (file.transferSize || 0), 0);
  const totalCSSSize = cssFiles.reduce((total, file) => total + (file.transferSize || 0), 0);
  
  return {
    jsFiles: jsFiles.length,
    cssFiles: cssFiles.length,
    totalJSSize: Math.round(totalJSSize / 1024 * 100) / 100,
    totalCSSSize: Math.round(totalCSSSize / 1024 * 100) / 100,
    totalSize: Math.round((totalJSSize + totalCSSSize) / 1024 * 100) / 100,
    largestJS: jsFiles.reduce((largest, file) => 
      (file.transferSize || 0) > (largest.transferSize || 0) ? file : largest, 
      { transferSize: 0, name: 'none' }
    ),
    timestamp: Date.now()
  };
};

/**
 * Measure Core Web Vitals compliance
 * @returns {Promise<Object>} Compliance report
 */
export const measureWebVitalsCompliance = async () => {
  const metrics = {};
  
  // Get current metrics from buffer
  metricsBuffer.forEach(metric => {
    metrics[metric.name] = metric;
  });
  
  // Add FCP and TTFB if not present
  if (!metrics.FCP) {
    metrics.FCP = await measureFCP();
  }
  
  if (!metrics.TTFB) {
    metrics.TTFB = measureTTFB();
  }
  
  // Calculate compliance score
  let score = 0;
  let totalMetrics = 0;
  
  Object.values(metrics).forEach(metric => {
    if (metric.rating === 'good') score += 100;
    else if (metric.rating === 'needs-improvement') score += 50;
    totalMetrics++;
  });
  
  const complianceScore = totalMetrics > 0 ? Math.round(score / totalMetrics) : 0;
  
  return {
    metrics,
    score: complianceScore,
    passed: complianceScore >= 75,
    timestamp: Date.now()
  };
};

/**
 * Performance monitoring class for continuous tracking
 */
export class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      interval: 5000, // 5 seconds
      maxEntries: 100,
      enableMemoryTracking: true,
      enableBundleTracking: false,
      ...options
    };
    
    this.metrics = [];
    this.intervalId = null;
    this.isRunning = false;
  }
  
  start(onUpdate) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.onUpdate = onUpdate;
    
    // Initialize Web Vitals
    initWebVitals((metric) => {
      this.addMetric(metric);
      if (this.onUpdate) this.onUpdate(this.getLatestMetrics());
    });
    
    // Start interval monitoring
    this.intervalId = setInterval(() => {
      this.collectMetrics();
    }, this.options.interval);
    
    // Initial collection
    this.collectMetrics();
  }
  
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    // Disconnect observers
    if (performanceObserver) {
      Object.values(performanceObserver).forEach(observer => {
        try { observer.disconnect(); } catch (e) { /* ignore */ }
      });
      performanceObserver = null;
    }
  }
  
  collectMetrics() {
    const timestamp = Date.now();
    
    // Memory metrics
    if (this.options.enableMemoryTracking) {
      const memory = getMemoryUsage();
      if (memory) {
        this.addMetric({ ...memory, name: 'Memory', timestamp });
      }
    }
    
    // Bundle metrics (less frequent)
    if (this.options.enableBundleTracking && timestamp % (this.options.interval * 4) === 0) {
      getBundleMetrics().then(bundle => {
        this.addMetric({ ...bundle, name: 'Bundle', timestamp });
        if (this.onUpdate) this.onUpdate(this.getLatestMetrics());
      });
    }
  }
  
  addMetric(metric) {
    this.metrics.push(metric);
    
    // Limit buffer size
    if (this.metrics.length > this.options.maxEntries) {
      this.metrics = this.metrics.slice(-this.options.maxEntries);
    }
  }
  
  getLatestMetrics() {
    const latest = {};
    this.metrics.forEach(metric => {
      if (!latest[metric.name] || metric.timestamp > latest[metric.name].timestamp) {
        latest[metric.name] = metric;
      }
    });
    return latest;
  }
  
  getMetricHistory(name, limit = 10) {
    return this.metrics
      .filter(m => m.name === name)
      .slice(-limit);
  }
  
  generateReport() {
    const latest = this.getLatestMetrics();
    const report = {
      timestamp: Date.now(),
      metrics: latest,
      summary: {
        webVitalsScore: 0,
        memoryUsage: latest.Memory?.usage || 0,
        bundleSize: latest.Bundle?.totalSize || 0,
        performance: 'unknown'
      }
    };
    
    // Calculate Web Vitals score
    const vitalsMetrics = ['LCP', 'FID', 'CLS'];
    let vitalsScore = 0;
    let vitalsCount = 0;
    
    vitalsMetrics.forEach(name => {
      if (latest[name]) {
        if (latest[name].rating === 'good') vitalsScore += 100;
        else if (latest[name].rating === 'needs-improvement') vitalsScore += 50;
        vitalsCount++;
      }
    });
    
    if (vitalsCount > 0) {
      report.summary.webVitalsScore = Math.round(vitalsScore / vitalsCount);
    }
    
    // Overall performance rating
    if (report.summary.webVitalsScore >= 80) report.summary.performance = 'excellent';
    else if (report.summary.webVitalsScore >= 60) report.summary.performance = 'good';
    else if (report.summary.webVitalsScore >= 40) report.summary.performance = 'needs-improvement';
    else report.summary.performance = 'poor';
    
    return report;
  }
}

/**
 * Simple performance audit function
 * @returns {Promise<Object>} Audit results
 */
export const performanceAudit = async () => {
  const startTime = performance.now();
  
  // Collect all metrics
  const [webVitals, memory, bundle] = await Promise.all([
    measureWebVitalsCompliance(),
    Promise.resolve(getMemoryUsage()),
    getBundleMetrics()
  ]);
  
  const auditTime = performance.now() - startTime;
  
  return {
    timestamp: Date.now(),
    auditDuration: Math.round(auditTime * 100) / 100,
    webVitals: webVitals.metrics,
    webVitalsScore: webVitals.score,
    webVitalsPassed: webVitals.passed,
    memory,
    bundle,
    recommendations: generateRecommendations(webVitals, memory, bundle)
  };
};

/**
 * Generate performance recommendations
 * @param {Object} webVitals - Web Vitals metrics
 * @param {Object} memory - Memory metrics
 * @param {Object} bundle - Bundle metrics
 * @returns {Array} Array of recommendations
 */
const generateRecommendations = (webVitals, memory, bundle) => {
  const recommendations = [];
  
  // Web Vitals recommendations
  if (webVitals.metrics.LCP?.rating === 'poor') {
    recommendations.push({
      type: 'LCP',
      priority: 'high',
      message: 'Largest Contentful Paint is slow. Consider optimizing images, preloading critical resources, or improving server response times.'
    });
  }
  
  if (webVitals.metrics.FID?.rating === 'poor') {
    recommendations.push({
      type: 'FID',
      priority: 'high',
      message: 'First Input Delay is high. Consider reducing JavaScript execution time and breaking up long tasks.'
    });
  }
  
  if (webVitals.metrics.CLS?.rating === 'poor') {
    recommendations.push({
      type: 'CLS',
      priority: 'medium',
      message: 'Cumulative Layout Shift is high. Ensure images and ads have size attributes and avoid inserting content above existing content.'
    });
  }
  
  // Memory recommendations
  if (memory && memory.usage > 80) {
    recommendations.push({
      type: 'Memory',
      priority: 'medium',
      message: 'Memory usage is high. Consider optimizing data structures, cleaning up event listeners, and implementing lazy loading.'
    });
  }
  
  // Bundle recommendations
  if (bundle.totalSize > 1000) { // 1MB
    recommendations.push({
      type: 'Bundle',
      priority: 'medium',
      message: 'Bundle size is large. Consider code splitting, tree shaking, and removing unused dependencies.'
    });
  }
  
  return recommendations;
};

/**
 * Cleanup function to stop all monitoring
 */
export const cleanup = () => {
  isMonitoring = false;
  metricsBuffer = [];
  
  if (performanceObserver) {
    Object.values(performanceObserver).forEach(observer => {
      try { observer.disconnect(); } catch (e) { /* ignore */ }
    });
    performanceObserver = null;
  }
};

// Export constants
export { WEB_VITALS_THRESHOLDS };

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanup);
}