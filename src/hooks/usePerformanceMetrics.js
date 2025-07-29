/**
 * usePerformanceMetrics - React hook for real-time performance monitoring
 * Integrates with blog cache, image optimization, and Web Vitals
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { PerformanceMonitor, initWebVitals } from '../utils/performanceUtils.js';
import { getCacheStats } from '../utils/blogCache.js';
import { getBundleInfo, lazyLoadingMonitor } from '../utils/blogLazyLoading.js';

export const usePerformanceMetrics = (options = {}) => {
  const {
    enableWebVitals = true,
    enableCacheMetrics = true,
    enableBundleMetrics = true,
    enableLazyLoadingMetrics = true,
    updateInterval = 5000,
    alertThresholds = {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      cacheHitRate: 70
    }
  } = options;

  const [metrics, setMetrics] = useState({
    webVitals: {},
    cache: {},
    bundle: {},
    lazyLoading: {},
    alerts: []
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const performanceMonitor = useRef(null);
  const intervalId = useRef(null);
  const alertsRef = useRef([]);

  // Initialize performance monitoring
  useEffect(() => {
    if (enableWebVitals) {
      performanceMonitor.current = new PerformanceMonitor({
        interval: updateInterval,
        enableMemoryTracking: true,
        enableBundleTracking: enableBundleMetrics
      });

      performanceMonitor.current.start((latestMetrics) => {
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          webVitals: latestMetrics
        }));

        // Check for performance alerts
        checkPerformanceAlerts(latestMetrics);
      });

      setIsMonitoring(true);
    }

    return () => {
      if (performanceMonitor.current) {
        performanceMonitor.current.stop();
      }
    };
  }, [enableWebVitals, updateInterval, enableBundleMetrics]);

  // Collect metrics periodically
  useEffect(() => {
    if (!isMonitoring) return;

    const collectMetrics = () => {
      const newMetrics = { ...metrics };

      // Cache metrics
      if (enableCacheMetrics) {
        try {
          newMetrics.cache = getCacheStats();
        } catch (error) {
          console.warn('[usePerformanceMetrics] Cache metrics collection failed:', error);
        }
      }

      // Bundle metrics
      if (enableBundleMetrics) {
        try {
          newMetrics.bundle = getBundleInfo();
        } catch (error) {
          console.warn('[usePerformanceMetrics] Bundle metrics collection failed:', error);
        }
      }

      // Lazy loading metrics
      if (enableLazyLoadingMetrics) {
        try {
          newMetrics.lazyLoading = lazyLoadingMonitor.getMetrics();
        } catch (error) {
          console.warn('[usePerformanceMetrics] Lazy loading metrics collection failed:', error);
        }
      }

      setMetrics(newMetrics);
    };

    intervalId.current = setInterval(collectMetrics, updateInterval);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [isMonitoring, updateInterval, enableCacheMetrics, enableBundleMetrics, enableLazyLoadingMetrics]);

  // Check for performance alerts
  const checkPerformanceAlerts = useCallback((webVitals) => {
    const newAlerts = [];

    // Web Vitals alerts
    if (webVitals.LCP && webVitals.LCP.value > alertThresholds.lcp) {
      newAlerts.push({
        type: 'LCP',
        severity: 'warning',
        message: `Largest Contentful Paint is ${webVitals.LCP.value}ms (threshold: ${alertThresholds.lcp}ms)`,
        value: webVitals.LCP.value,
        threshold: alertThresholds.lcp,
        timestamp: Date.now()
      });
    }

    if (webVitals.FID && webVitals.FID.value > alertThresholds.fid) {
      newAlerts.push({
        type: 'FID',
        severity: 'warning',
        message: `First Input Delay is ${webVitals.FID.value}ms (threshold: ${alertThresholds.fid}ms)`,
        value: webVitals.FID.value,
        threshold: alertThresholds.fid,
        timestamp: Date.now()
      });
    }

    if (webVitals.CLS && webVitals.CLS.value > alertThresholds.cls) {
      newAlerts.push({
        type: 'CLS',
        severity: 'warning',
        message: `Cumulative Layout Shift is ${webVitals.CLS.value} (threshold: ${alertThresholds.cls})`,
        value: webVitals.CLS.value,
        threshold: alertThresholds.cls,
        timestamp: Date.now()
      });
    }

    // Cache performance alerts
    if (metrics.cache.overall && metrics.cache.overall.hitRate < alertThresholds.cacheHitRate) {
      newAlerts.push({
        type: 'CACHE_HIT_RATE',
        severity: 'info',
        message: `Cache hit rate is ${metrics.cache.overall.hitRate}% (threshold: ${alertThresholds.cacheHitRate}%)`,
        value: metrics.cache.overall.hitRate,
        threshold: alertThresholds.cacheHitRate,
        timestamp: Date.now()
      });
    }

    // Update alerts (keep only recent ones)
    alertsRef.current = [...alertsRef.current, ...newAlerts]
      .filter(alert => Date.now() - alert.timestamp < 300000) // Keep alerts for 5 minutes
      .slice(-10); // Keep max 10 alerts

    setMetrics(prevMetrics => ({
      ...prevMetrics,
      alerts: alertsRef.current
    }));
  }, [alertThresholds, metrics.cache]);

  // Manual metrics collection
  const collectMetrics = useCallback(async () => {
    const timestamp = Date.now();
    const collectedMetrics = {
      timestamp,
      webVitals: {},
      cache: {},
      bundle: {},
      lazyLoading: {},
      alerts: alertsRef.current
    };

    // Web Vitals
    if (enableWebVitals && performanceMonitor.current) {
      collectedMetrics.webVitals = performanceMonitor.current.getLatestMetrics();
    }

    // Cache metrics
    if (enableCacheMetrics) {
      collectedMetrics.cache = getCacheStats();
    }

    // Bundle metrics
    if (enableBundleMetrics) {
      collectedMetrics.bundle = getBundleInfo();
    }

    // Lazy loading metrics
    if (enableLazyLoadingMetrics) {
      collectedMetrics.lazyLoading = lazyLoadingMonitor.getMetrics();
    }

    setMetrics(collectedMetrics);
    return collectedMetrics;
  }, [enableWebVitals, enableCacheMetrics, enableBundleMetrics, enableLazyLoadingMetrics]);

  // Performance report generation
  const generateReport = useCallback(() => {
    const report = {
      timestamp: Date.now(),
      summary: {
        overall: 'unknown',
        score: 0,
        recommendations: []
      },
      details: {
        webVitals: metrics.webVitals,
        cache: metrics.cache,
        bundle: metrics.bundle,
        lazyLoading: metrics.lazyLoading
      },
      alerts: metrics.alerts
    };

    // Calculate overall score
    let scoreFactors = [];

    // Web Vitals score (0-100)
    if (metrics.webVitals.LCP) {
      const lcpScore = metrics.webVitals.LCP.value <= 2500 ? 100 : 
                      metrics.webVitals.LCP.value <= 4000 ? 50 : 0;
      scoreFactors.push(lcpScore);
    }

    if (metrics.webVitals.FID) {
      const fidScore = metrics.webVitals.FID.value <= 100 ? 100 : 
                      metrics.webVitals.FID.value <= 300 ? 50 : 0;
      scoreFactors.push(fidScore);
    }

    if (metrics.webVitals.CLS) {
      const clsScore = metrics.webVitals.CLS.value <= 0.1 ? 100 : 
                      metrics.webVitals.CLS.value <= 0.25 ? 50 : 0;
      scoreFactors.push(clsScore);
    }

    // Cache score
    if (metrics.cache.overall) {
      const cacheScore = Math.min(100, metrics.cache.overall.hitRate);
      scoreFactors.push(cacheScore);
    }

    // Calculate overall score
    if (scoreFactors.length > 0) {
      report.summary.score = Math.round(
        scoreFactors.reduce((a, b) => a + b, 0) / scoreFactors.length
      );
    }

    // Overall rating
    if (report.summary.score >= 90) report.summary.overall = 'excellent';
    else if (report.summary.score >= 75) report.summary.overall = 'good';
    else if (report.summary.score >= 50) report.summary.overall = 'needs-improvement';
    else report.summary.overall = 'poor';

    // Generate recommendations
    if (metrics.webVitals.LCP && metrics.webVitals.LCP.value > 2500) {
      report.summary.recommendations.push('Optimize images and preload critical resources to improve LCP');
    }

    if (metrics.cache.overall && metrics.cache.overall.hitRate < 80) {
      report.summary.recommendations.push('Improve cache hit rate by optimizing cache strategies');
    }

    if (metrics.lazyLoading.cacheStats && metrics.lazyLoading.cacheStats.hitRate < 70) {
      report.summary.recommendations.push('Consider preloading more components to improve lazy loading performance');
    }

    return report;
  }, [metrics]);

  // Start/stop monitoring
  const startMonitoring = useCallback(() => {
    if (!isMonitoring && performanceMonitor.current) {
      performanceMonitor.current.start();
      setIsMonitoring(true);
    }
  }, [isMonitoring]);

  const stopMonitoring = useCallback(() => {
    if (isMonitoring && performanceMonitor.current) {
      performanceMonitor.current.stop();
      setIsMonitoring(false);
    }
  }, [isMonitoring]);

  // Clear alerts
  const clearAlerts = useCallback(() => {
    alertsRef.current = [];
    setMetrics(prevMetrics => ({
      ...prevMetrics,
      alerts: []
    }));
  }, []);

  return {
    metrics,
    isMonitoring,
    collectMetrics,
    generateReport,
    startMonitoring,
    stopMonitoring,
    clearAlerts
  };
};

/**
 * Simplified hook for basic performance monitoring
 */
export const useBasicPerformance = () => {
  const [webVitals, setWebVitals] = useState({});

  useEffect(() => {
    initWebVitals((metric) => {
      setWebVitals(prev => ({
        ...prev,
        [metric.name]: metric
      }));
    });
  }, []);

  return webVitals;
};

/**
 * Hook for monitoring specific performance metrics
 */
export const useMetricMonitor = (metricNames = ['LCP', 'FID', 'CLS']) => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    initWebVitals((metric) => {
      if (metricNames.includes(metric.name)) {
        setMetrics(prev => ({
          ...prev,
          [metric.name]: metric
        }));
      }
    });
  }, [metricNames]);

  return metrics;
};

export default usePerformanceMetrics;