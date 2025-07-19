import { useEffect, useRef, useState, useCallback } from 'react';

interface PDFPerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  errorCount: number;
  pageLoadTimes: Record<number, number>;
  averagePageLoad: number;
  containerHeight: number;
  contentHeight: number;
  blankSpaceRatio: number;
}

interface PDFPerformanceConfig {
  enableMemoryTracking: boolean;
  enablePerformanceObserver: boolean;
  memoryTrackingInterval: number;
  reportingThreshold: {
    loadTime: number;    // ms
    renderTime: number;  // ms
    memoryUsage: number; // MB
    blankSpaceRatio: number; // ratio
  };
}

const DEFAULT_CONFIG: PDFPerformanceConfig = {
  enableMemoryTracking: true,
  enablePerformanceObserver: true,
  memoryTrackingInterval: 5000,
  reportingThreshold: {
    loadTime: 3000,
    renderTime: 1000,
    memoryUsage: 100,
    blankSpaceRatio: 0.1 // 10% blank space tolerance
  }
};

/**
 * Advanced hook for monitoring PDF rendering performance
 * Tracks loading times, memory usage, and detects blank space issues
 */
export const usePDFPerformance = (
  config: Partial<PDFPerformanceConfig> = {},
  onThresholdExceeded?: (metric: string, value: number, threshold: number) => void
) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [metrics, setMetrics] = useState<PDFPerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    errorCount: 0,
    pageLoadTimes: {},
    averagePageLoad: 0,
    containerHeight: 0,
    contentHeight: 0,
    blankSpaceRatio: 0
  });

  const [isTracking, setIsTracking] = useState(false);
  const [alerts, setAlerts] = useState<Array<{ metric: string; value: number; timestamp: number }>>([]);

  // Timing references
  const loadStartTime = useRef<number>(0);
  const renderStartTime = useRef<number>(0);
  const pageLoadStartTimes = useRef<Record<number, number>>({});
  
  // Performance observer
  const performanceObserver = useRef<PerformanceObserver | null>(null);
  const memoryInterval = useRef<NodeJS.Timeout | null>(null);

  // Start tracking document load
  const startDocumentLoad = useCallback(() => {
    loadStartTime.current = performance.now();
    setIsTracking(true);
    
    // Clear previous metrics
    setMetrics(prev => ({
      ...prev,
      loadTime: 0,
      renderTime: 0,
      errorCount: 0,
      pageLoadTimes: {},
      averagePageLoad: 0
    }));
  }, []);

  // End tracking document load
  const endDocumentLoad = useCallback(() => {
    if (loadStartTime.current > 0) {
      const loadTime = performance.now() - loadStartTime.current;
      
      setMetrics(prev => ({ ...prev, loadTime }));
      
      // Check threshold
      if (loadTime > mergedConfig.reportingThreshold.loadTime) {
        onThresholdExceeded?.('loadTime', loadTime, mergedConfig.reportingThreshold.loadTime);
        setAlerts(prev => [...prev, { metric: 'loadTime', value: loadTime, timestamp: Date.now() }]);
      }
    }
  }, [mergedConfig.reportingThreshold.loadTime, onThresholdExceeded]);

  // Start tracking page render
  const startPageRender = useCallback((pageNumber?: number) => {
    renderStartTime.current = performance.now();
    
    if (pageNumber) {
      pageLoadStartTimes.current[pageNumber] = performance.now();
    }
  }, []);

  // End tracking page render
  const endPageRender = useCallback((pageNumber?: number) => {
    if (renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      
      setMetrics(prev => ({ ...prev, renderTime }));
      
      // Track individual page load time
      if (pageNumber && pageLoadStartTimes.current[pageNumber]) {
        const pageLoadTime = performance.now() - pageLoadStartTimes.current[pageNumber];
        
        setMetrics(prev => {
          const newPageLoadTimes = { ...prev.pageLoadTimes, [pageNumber]: pageLoadTime };
          const averagePageLoad = Object.values(newPageLoadTimes).reduce((a, b) => a + b, 0) / Object.keys(newPageLoadTimes).length;
          
          return {
            ...prev,
            pageLoadTimes: newPageLoadTimes,
            averagePageLoad
          };
        });
        
        delete pageLoadStartTimes.current[pageNumber];
      }
      
      // Check threshold
      if (renderTime > mergedConfig.reportingThreshold.renderTime) {
        onThresholdExceeded?.('renderTime', renderTime, mergedConfig.reportingThreshold.renderTime);
        setAlerts(prev => [...prev, { metric: 'renderTime', value: renderTime, timestamp: Date.now() }]);
      }
    }
  }, [mergedConfig.reportingThreshold.renderTime, onThresholdExceeded]);

  // Track errors
  const trackError = useCallback((error: Error, context?: string) => {
    console.error(`PDF Performance Tracking - Error in ${context}:`, error);
    
    setMetrics(prev => ({ ...prev, errorCount: prev.errorCount + 1 }));
    
    // Log error details for analysis
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pdf_error', {
        event_category: 'PDF Performance',
        event_label: context || 'unknown',
        value: metrics.errorCount + 1
      });
    }
  }, [metrics.errorCount]);

  // Track container and content dimensions to detect blank space
  const trackDimensions = useCallback((containerEl: HTMLElement, contentEl: HTMLElement) => {
    if (!containerEl || !contentEl) return;

    const containerHeight = containerEl.offsetHeight;
    const contentHeight = contentEl.offsetHeight;
    const blankSpaceRatio = contentHeight > 0 ? Math.abs(containerHeight - contentHeight) / contentHeight : 0;

    setMetrics(prev => ({
      ...prev,
      containerHeight,
      contentHeight,
      blankSpaceRatio
    }));

    // Check for excessive blank space
    if (blankSpaceRatio > mergedConfig.reportingThreshold.blankSpaceRatio) {
      onThresholdExceeded?.('blankSpaceRatio', blankSpaceRatio, mergedConfig.reportingThreshold.blankSpaceRatio);
      setAlerts(prev => [...prev, { metric: 'blankSpaceRatio', value: blankSpaceRatio, timestamp: Date.now() }]);
      
      console.warn(`PDF Blank Space Detected:`, {
        containerHeight,
        contentHeight,
        blankSpaceRatio: `${(blankSpaceRatio * 100).toFixed(1)}%`
      });
    }
  }, [mergedConfig.reportingThreshold.blankSpaceRatio, onThresholdExceeded]);

  // Memory tracking
  useEffect(() => {
    if (!mergedConfig.enableMemoryTracking || typeof window === 'undefined') return;

    const trackMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
        
        setMetrics(prev => ({ ...prev, memoryUsage }));
        
        // Check threshold
        if (memoryUsage > mergedConfig.reportingThreshold.memoryUsage) {
          onThresholdExceeded?.('memoryUsage', memoryUsage, mergedConfig.reportingThreshold.memoryUsage);
          setAlerts(prev => [...prev, { metric: 'memoryUsage', value: memoryUsage, timestamp: Date.now() }]);
        }
      }
    };

    // Initial measurement
    trackMemory();

    // Set up interval
    memoryInterval.current = setInterval(trackMemory, mergedConfig.memoryTrackingInterval);

    return () => {
      if (memoryInterval.current) {
        clearInterval(memoryInterval.current);
      }
    };
  }, [mergedConfig.enableMemoryTracking, mergedConfig.memoryTrackingInterval, mergedConfig.reportingThreshold.memoryUsage, onThresholdExceeded]);

  // Performance Observer for additional metrics
  useEffect(() => {
    if (!mergedConfig.enablePerformanceObserver || typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    try {
      performanceObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.name.includes('pdf') || entry.name.includes('canvas')) {
            console.log(`PDF Performance Entry:`, {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        });
      });

      performanceObserver.current.observe({ 
        entryTypes: ['measure', 'navigation', 'resource'] 
      });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    return () => {
      if (performanceObserver.current) {
        performanceObserver.current.disconnect();
      }
    };
  }, [mergedConfig.enablePerformanceObserver]);

  // Auto-cleanup alerts after 30 seconds
  useEffect(() => {
    const cleanup = setTimeout(() => {
      setAlerts(prev => prev.filter(alert => Date.now() - alert.timestamp < 30000));
    }, 30000);

    return () => clearTimeout(cleanup);
  }, [alerts]);

  // Generate performance report
  const generateReport = useCallback(() => {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: { ...metrics },
      alerts: [...alerts],
      summary: {
        performanceScore: calculatePerformanceScore(metrics, mergedConfig.reportingThreshold),
        recommendations: generateRecommendations(metrics, mergedConfig.reportingThreshold)
      }
    };

    console.log('PDF Performance Report:', report);
    return report;
  }, [metrics, alerts, mergedConfig.reportingThreshold]);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics({
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      errorCount: 0,
      pageLoadTimes: {},
      averagePageLoad: 0,
      containerHeight: 0,
      contentHeight: 0,
      blankSpaceRatio: 0
    });
    setAlerts([]);
    setIsTracking(false);
  }, []);

  return {
    metrics,
    alerts,
    isTracking,
    startDocumentLoad,
    endDocumentLoad,
    startPageRender,
    endPageRender,
    trackError,
    trackDimensions,
    generateReport,
    resetMetrics
  };
};

// Helper function to calculate performance score (0-100)
function calculatePerformanceScore(
  metrics: PDFPerformanceMetrics, 
  thresholds: PDFPerformanceConfig['reportingThreshold']
): number {
  let score = 100;

  // Deduct points for slow loading
  if (metrics.loadTime > thresholds.loadTime) {
    score -= Math.min(30, (metrics.loadTime - thresholds.loadTime) / 100);
  }

  // Deduct points for slow rendering
  if (metrics.renderTime > thresholds.renderTime) {
    score -= Math.min(20, (metrics.renderTime - thresholds.renderTime) / 50);
  }

  // Deduct points for high memory usage
  if (metrics.memoryUsage > thresholds.memoryUsage) {
    score -= Math.min(20, (metrics.memoryUsage - thresholds.memoryUsage) / 10);
  }

  // Deduct points for blank space issues
  if (metrics.blankSpaceRatio > thresholds.blankSpaceRatio) {
    score -= Math.min(20, metrics.blankSpaceRatio * 100);
  }

  // Deduct points for errors
  score -= Math.min(10, metrics.errorCount * 2);

  return Math.max(0, Math.round(score));
}

// Helper function to generate recommendations
function generateRecommendations(
  metrics: PDFPerformanceMetrics,
  thresholds: PDFPerformanceConfig['reportingThreshold']
): string[] {
  const recommendations: string[] = [];

  if (metrics.loadTime > thresholds.loadTime) {
    recommendations.push('Consider optimizing PDF file size or using a CDN');
  }

  if (metrics.renderTime > thresholds.renderTime) {
    recommendations.push('Disable text layer rendering if not needed');
  }

  if (metrics.memoryUsage > thresholds.memoryUsage) {
    recommendations.push('Consider implementing page-by-page loading');
  }

  if (metrics.blankSpaceRatio > thresholds.blankSpaceRatio) {
    recommendations.push('Check for CSS conflicts with react-pdf styling');
  }

  if (metrics.errorCount > 0) {
    recommendations.push('Implement error boundaries and retry mechanisms');
  }

  if (recommendations.length === 0) {
    recommendations.push('PDF performance is optimal');
  }

  return recommendations;
}

export default usePDFPerformance;