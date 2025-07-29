/**
 * Sistema de Monitoramento Autom�tico
 * Task 2 - FEATURE_001_SISTEMA_ALERTAS
 * Integra��o com AlertService para monitoramento cont�nuo
 */

import { alertService, AlertType } from '@/services/alertService';
import { logger } from '@/utils/logger';

// Performance Metrics Interface
export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  timestamp: string;
}

// Health Check Result
export interface HealthCheckResult {
  isHealthy: boolean;
  uptime: number;
  responseTime: number;
  endpoints: {
    [endpoint: string]: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
      statusCode?: number;
      error?: string;
    };
  };
  timestamp: string;
}

// Anomaly Detection Result
export interface AnomalyDetection {
  detected: boolean;
  type: 'performance' | 'error_rate' | 'response_time' | 'memory';
  severity: 'low' | 'medium' | 'high' | 'critical';
  currentValue: number;
  baselineValue: number;
  threshold: number;
  confidence: number; // 0-1
  timestamp: string;
}

// Monitoring Configuration
const MONITORING_CONFIG = {
  healthCheckInterval: 5 * 60 * 1000,     // 5 minutes
  performanceInterval: 1 * 60 * 1000,     // 1 minute
  anomalyCheckInterval: 2 * 60 * 1000,    // 2 minutes
  
  // Thresholds
  healthCheck: {
    timeout: 10000,                       // 10 seconds
    retries: 3,
    retryDelay: 2000                      // 2 seconds
  },
  
  performance: {
    lcpThreshold: 3000,                   // 3 seconds
    fidThreshold: 100,                    // 100ms
    clsThreshold: 0.1,                    // 0.1 CLS score
    responseTimeThreshold: 2000,          // 2 seconds
    memoryThreshold: 80,                  // 80% usage
    cpuThreshold: 85                      // 85% usage
  },
  
  anomaly: {
    windowSize: 10,                       // Last 10 measurements
    deviationThreshold: 2,                // 2 standard deviations
    confidenceThreshold: 0.8              // 80% confidence
  }
};

// Critical endpoints to monitor
const CRITICAL_ENDPOINTS = [
  '/api/health',
  '/api/blog/posts',
  '/api/blog/categories',
  '/api/courses',
  '/api/auth/session',
  '/api/dashboard'
];

export class MonitoringSystem {
  private healthCheckTimer?: NodeJS.Timer;
  private performanceTimer?: NodeJS.Timer;
  private anomalyTimer?: NodeJS.Timer;
  
  private performanceHistory: PerformanceMetrics[] = [];
  private healthHistory: HealthCheckResult[] = [];
  
  private isMonitoring = false;
  private startTime = Date.now();

  constructor() {
    this.initializeMonitoring();
  }

  // Initialize monitoring system
  private async initializeMonitoring(): Promise<void> {
    try {
      logger.info('MonitoringSystem: Initializing monitoring system');
      
      // Validate environment
      await this.validateEnvironment();
      
      // Start monitoring processes
      this.startHealthCheckMonitoring();
      this.startPerformanceMonitoring();
      this.startAnomalyDetection();
      
      this.isMonitoring = true;
      
      logger.info('MonitoringSystem: Monitoring system initialized successfully');
    } catch (error) {
      logger.error('MonitoringSystem: Failed to initialize monitoring system', { error });
      throw error;
    }
  }

  // Validate monitoring environment
  private async validateEnvironment(): Promise<void> {
    // Check if required services are available
    const requiredEnvVars = [
      'NEXT_PUBLIC_SITE_URL'
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Required environment variable ${envVar} is not set`);
      }
    }

    // Test basic connectivity
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/health`, {
        timeout: 5000
      });
      
      if (!response.ok) {
        logger.warn('MonitoringSystem: Health endpoint not responding properly');
      }
    } catch (error) {
      logger.warn('MonitoringSystem: Unable to connect to health endpoint', { error });
    }
  }

  // Start health check monitoring
  private startHealthCheckMonitoring(): void {
    this.healthCheckTimer = setInterval(async () => {
      try {
        const result = await this.performHealthCheck();
        this.healthHistory.push(result);
        
        // Keep only last 100 health checks
        if (this.healthHistory.length > 100) {
          this.healthHistory = this.healthHistory.slice(-100);
        }
        
        // Check for downtime alerts
        if (!result.isHealthy) {
          await this.triggerDowntimeAlert(result);
        }
        
        logger.debug('MonitoringSystem: Health check completed', {
          isHealthy: result.isHealthy,
          responseTime: result.responseTime
        });
        
      } catch (error) {
        logger.error('MonitoringSystem: Health check failed', { error });
      }
    }, MONITORING_CONFIG.healthCheckInterval);

    logger.info('MonitoringSystem: Health check monitoring started');
  }

  // Start performance monitoring
  private startPerformanceMonitoring(): void {
    this.performanceTimer = setInterval(async () => {
      try {
        const metrics = await this.collectPerformanceMetrics();
        this.performanceHistory.push(metrics);
        
        // Keep only last 200 performance measurements
        if (this.performanceHistory.length > 200) {
          this.performanceHistory = this.performanceHistory.slice(-200);
        }
        
        // Check for performance alerts
        await this.checkPerformanceThresholds(metrics);
        
        logger.debug('MonitoringSystem: Performance metrics collected', {
          lcp: metrics.lcp,
          responseTime: metrics.responseTime,
          memoryUsage: metrics.memoryUsage
        });
        
      } catch (error) {
        logger.error('MonitoringSystem: Performance monitoring failed', { error });
      }
    }, MONITORING_CONFIG.performanceInterval);

    logger.info('MonitoringSystem: Performance monitoring started');
  }

  // Start anomaly detection
  private startAnomalyDetection(): void {
    this.anomalyTimer = setInterval(async () => {
      try {
        const anomalies = await this.detectAnomalies();
        
        for (const anomaly of anomalies) {
          if (anomaly.detected && anomaly.confidence >= MONITORING_CONFIG.anomaly.confidenceThreshold) {
            await this.triggerAnomalyAlert(anomaly);
          }
        }
        
        logger.debug('MonitoringSystem: Anomaly detection completed', {
          anomaliesDetected: anomalies.filter(a => a.detected).length
        });
        
      } catch (error) {
        logger.error('MonitoringSystem: Anomaly detection failed', { error });
      }
    }, MONITORING_CONFIG.anomalyCheckInterval);

    logger.info('MonitoringSystem: Anomaly detection started');
  }

  // Perform comprehensive health check
  public async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const endpoints: HealthCheckResult['endpoints'] = {};
    
    let totalResponseTime = 0;
    let healthyEndpoints = 0;

    for (const endpoint of CRITICAL_ENDPOINTS) {
      const endpointStart = Date.now();
      
      try {
        const response = await this.fetchWithRetry(
          `${process.env.NEXT_PUBLIC_SITE_URL}${endpoint}`,
          {
            timeout: MONITORING_CONFIG.healthCheck.timeout,
            method: 'GET',
            headers: {
              'User-Agent': 'Habilidade-Monitor/1.0',
              'Accept': 'application/json'
            }
          }
        );
        
        const responseTime = Date.now() - endpointStart;
        totalResponseTime += responseTime;
        
        endpoints[endpoint] = {
          status: response.ok ? 'healthy' : 'unhealthy',
          responseTime,
          statusCode: response.status
        };
        
        if (response.ok) {
          healthyEndpoints++;
        }
        
      } catch (error) {
        const responseTime = Date.now() - endpointStart;
        totalResponseTime += responseTime;
        
        endpoints[endpoint] = {
          status: 'unhealthy',
          responseTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    const averageResponseTime = totalResponseTime / CRITICAL_ENDPOINTS.length;
    const healthyPercentage = healthyEndpoints / CRITICAL_ENDPOINTS.length;
    const isHealthy = healthyPercentage >= 0.8; // 80% of endpoints must be healthy

    return {
      isHealthy,
      uptime: Date.now() - this.startTime,
      responseTime: averageResponseTime,
      endpoints,
      timestamp: new Date().toISOString()
    };
  }

  // Collect performance metrics
  public async collectPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      // Core Web Vitals simulation (in production, this would use real metrics)
      const lcp = await this.measureLCP();
      const fid = await this.measureFID();
      const cls = await this.measureCLS();
      const ttfb = await this.measureTTFB();
      
      // System metrics
      const responseTime = await this.measureAverageResponseTime();
      const memoryUsage = await this.getMemoryUsage();
      const cpuUsage = await this.getCPUUsage();

      return {
        lcp,
        fid,
        cls,
        ttfb,
        responseTime,
        memoryUsage,
        cpuUsage,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('MonitoringSystem: Failed to collect performance metrics', { error });
      
      // Return default metrics on error
      return {
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0,
        responseTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Detect performance anomalies
  public async detectAnomalies(): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = [];
    
    if (this.performanceHistory.length < MONITORING_CONFIG.anomaly.windowSize) {
      return anomalies; // Need more data
    }

    const recentMetrics = this.performanceHistory.slice(-MONITORING_CONFIG.anomaly.windowSize);
    const latest = recentMetrics[recentMetrics.length - 1];
    
    // Check LCP anomaly
    const lcpAnomaly = this.detectMetricAnomaly(
      recentMetrics.map(m => m.lcp),
      latest.lcp,
      'performance'
    );
    if (lcpAnomaly.detected) {
      anomalies.push(lcpAnomaly);
    }

    // Check response time anomaly
    const responseTimeAnomaly = this.detectMetricAnomaly(
      recentMetrics.map(m => m.responseTime),
      latest.responseTime,
      'response_time'
    );
    if (responseTimeAnomaly.detected) {
      anomalies.push(responseTimeAnomaly);
    }

    // Check memory usage anomaly
    const memoryAnomaly = this.detectMetricAnomaly(
      recentMetrics.map(m => m.memoryUsage),
      latest.memoryUsage,
      'memory'
    );
    if (memoryAnomaly.detected) {
      anomalies.push(memoryAnomaly);
    }

    return anomalies;
  }

  // Detect anomaly in a specific metric
  private detectMetricAnomaly(
    values: number[],
    currentValue: number,
    type: AnomalyDetection['type']
  ): AnomalyDetection {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    const zScore = Math.abs((currentValue - mean) / stdDev);
    const threshold = MONITORING_CONFIG.anomaly.deviationThreshold;
    
    const detected = zScore > threshold;
    const confidence = Math.min(zScore / threshold, 1); // Cap at 1.0
    
    let severity: AnomalyDetection['severity'] = 'low';
    if (zScore > threshold * 3) severity = 'critical';
    else if (zScore > threshold * 2) severity = 'high';
    else if (zScore > threshold * 1.5) severity = 'medium';

    return {
      detected,
      type,
      severity,
      currentValue,
      baselineValue: mean,
      threshold,
      confidence,
      timestamp: new Date().toISOString()
    };
  }

  // Trigger downtime alert
  private async triggerDowntimeAlert(healthResult: HealthCheckResult): Promise<void> {
    try {
      // Check if we should trigger alert (avoid spam)
      const recentDowntime = this.healthHistory
        .slice(-5) // Last 5 checks
        .filter(h => !h.isHealthy);
      
      if (recentDowntime.length >= 3) { // 3 consecutive unhealthy checks
        logger.warn('MonitoringSystem: Downtime detected, triggering alert', {
          unhealthyEndpoints: Object.entries(healthResult.endpoints)
            .filter(([_, status]) => status.status === 'unhealthy')
            .map(([endpoint]) => endpoint)
        });
        
        // Import alertService dynamically to avoid circular dependencies
        const { alertService } = await import('@/services/alertService');
        
        // Find downtime alert configuration
        const configs = await alertService.loadAlertConfigurations();
        const downtimeConfig = configs.find(c => c.type === 'downtime' && c.enabled);
        
        if (downtimeConfig) {
          // Check if this matches the alert's conditions
          const downtimeDuration = recentDowntime.length * 5; // minutes
          const alertThreshold = downtimeConfig.conditions.duration;
          
          if (downtimeDuration >= alertThreshold) {
            // Simulate alert condition evaluation
            await alertService.evaluateAlertCondition(downtimeConfig);
            
            logger.info('MonitoringSystem: Downtime alert condition triggered', {
              configId: downtimeConfig.id,
              duration: downtimeDuration,
              threshold: alertThreshold
            });
          }
        }
      }
    } catch (error) {
      logger.error('MonitoringSystem: Failed to trigger downtime alert', { error });
    }
  }

  // Check performance thresholds
  private async checkPerformanceThresholds(metrics: PerformanceMetrics): Promise<void> {
    const config = MONITORING_CONFIG.performance;
    
    try {
      // Import alertService dynamically
      const { alertService } = await import('@/services/alertService');
      const alertConfigs = await alertService.loadAlertConfigurations();
      
      // Check LCP threshold
      if (metrics.lcp > config.lcpThreshold) {
        const recentHighLCP = this.performanceHistory
          .slice(-5)
          .filter(m => m.lcp > config.lcpThreshold);
        
        if (recentHighLCP.length >= 5) { // 5 consecutive high LCP measurements
          logger.warn('MonitoringSystem: LCP threshold exceeded consistently', {
            currentLCP: metrics.lcp,
            threshold: config.lcpThreshold,
            duration: '5 minutes'
          });
          
          // Find LCP performance alert config
          const lcpConfig = alertConfigs.find(c => 
            c.type === 'performance' && 
            c.enabled && 
            c.metadata?.metric === 'lcp'
          );
          
          if (lcpConfig && metrics.lcp > lcpConfig.threshold.value) {
            await alertService.evaluateAlertCondition(lcpConfig);
          }
        }
      }
      
      // Check response time threshold
      if (metrics.responseTime > config.responseTimeThreshold) {
        const recentSlowResponse = this.performanceHistory
          .slice(-3)
          .filter(m => m.responseTime > config.responseTimeThreshold);
        
        if (recentSlowResponse.length >= 3) {
          logger.warn('MonitoringSystem: Response time threshold exceeded', {
            currentResponseTime: metrics.responseTime,
            threshold: config.responseTimeThreshold,
            duration: '3 minutes'
          });
          
          // Find response time performance alert config
          const responseConfig = alertConfigs.find(c => 
            c.type === 'performance' && 
            c.enabled && 
            c.metadata?.metric === 'response_time'
          );
          
          if (responseConfig && metrics.responseTime > responseConfig.threshold.value) {
            await alertService.evaluateAlertCondition(responseConfig);
          }
        }
      }
      
      // Check memory threshold
      if (metrics.memoryUsage > config.memoryThreshold) {
        logger.warn('MonitoringSystem: Memory usage threshold exceeded', {
          currentMemoryUsage: metrics.memoryUsage,
          threshold: config.memoryThreshold
        });
        
        // Find memory alert config
        const memoryConfig = alertConfigs.find(c => 
          c.type === 'performance' && 
          c.enabled && 
          c.metadata?.metric === 'memory'
        );
        
        if (memoryConfig && metrics.memoryUsage > memoryConfig.threshold.value) {
          await alertService.evaluateAlertCondition(memoryConfig);
        }
      }
    } catch (error) {
      logger.error('MonitoringSystem: Failed to check performance thresholds', { error });
    }
  }

  // Trigger anomaly alert
  private async triggerAnomalyAlert(anomaly: AnomalyDetection): Promise<void> {
    try {
      logger.warn('MonitoringSystem: Anomaly detected', {
        type: anomaly.type,
        severity: anomaly.severity,
        currentValue: anomaly.currentValue,
        baselineValue: anomaly.baselineValue,
        confidence: anomaly.confidence
      });
      
      // This would integrate with AlertService to send actual alerts
      // For now, we log the anomaly
    } catch (error) {
      logger.error('MonitoringSystem: Failed to trigger anomaly alert', { error });
    }
  }

  // Utility methods for fetching with retry
  private async fetchWithRetry(
    url: string,
    options: RequestInit & { timeout?: number },
    retries = MONITORING_CONFIG.healthCheck.retries
  ): Promise<Response> {
    for (let i = 0; i <= retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout || 5000);
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response;
        
      } catch (error) {
        if (i === retries) throw error;
        
        await new Promise(resolve => 
          setTimeout(resolve, MONITORING_CONFIG.healthCheck.retryDelay)
        );
      }
    }
    
    throw new Error('All retries exhausted');
  }

  // Performance measurement methods (simulated for now)
  private async measureLCP(): Promise<number> {
    // In production, this would use Performance Observer API
    // For now, simulate with actual network request
    const start = Date.now();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/health`, { timeout: 5000 });
      return Date.now() - start;
    } catch {
      return 5000; // Return max time on error
    }
  }

  private async measureFID(): Promise<number> {
    // Simulated FID measurement
    return Math.random() * 100; // 0-100ms
  }

  private async measureCLS(): Promise<number> {
    // Simulated CLS measurement
    return Math.random() * 0.2; // 0-0.2 CLS score
  }

  private async measureTTFB(): Promise<number> {
    // Measure actual TTFB
    const start = Date.now();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/health`, {
        timeout: 5000
      });
      return Date.now() - start;
    } catch {
      return 5000;
    }
  }

  private async measureAverageResponseTime(): Promise<number> {
    const start = Date.now();
    const promises = CRITICAL_ENDPOINTS.slice(0, 3).map(endpoint =>
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}${endpoint}`, { timeout: 3000 })
        .catch(() => null)
    );
    
    await Promise.allSettled(promises);
    return (Date.now() - start) / 3;
  }

  private async getMemoryUsage(): Promise<number> {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      return Math.round((usage.heapUsed / usage.heapTotal) * 100);
    }
    return Math.random() * 100; // Fallback simulation
  }

  private async getCPUUsage(): Promise<number> {
    // CPU usage is harder to measure in Node.js
    // For now, simulate based on response times
    const recentMetrics = this.performanceHistory.slice(-5);
    if (recentMetrics.length === 0) return 0;
    
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;
    
    // Simulate CPU usage based on response time
    return Math.min(Math.round(avgResponseTime / 50), 100);
  }

  // Public methods for external access

  // Get current monitoring status
  public getMonitoringStatus(): {
    isMonitoring: boolean;
    uptime: number;
    lastHealthCheck?: HealthCheckResult;
    lastPerformanceMetrics?: PerformanceMetrics;
    totalHealthChecks: number;
    totalPerformanceChecks: number;
  } {
    return {
      isMonitoring: this.isMonitoring,
      uptime: Date.now() - this.startTime,
      lastHealthCheck: this.healthHistory[this.healthHistory.length - 1],
      lastPerformanceMetrics: this.performanceHistory[this.performanceHistory.length - 1],
      totalHealthChecks: this.healthHistory.length,
      totalPerformanceChecks: this.performanceHistory.length
    };
  }

  // Get performance history
  public getPerformanceHistory(limit = 50): PerformanceMetrics[] {
    return this.performanceHistory.slice(-limit);
  }

  // Get health history
  public getHealthHistory(limit = 50): HealthCheckResult[] {
    return this.healthHistory.slice(-limit);
  }

  // Manual trigger for health check
  public async triggerHealthCheck(): Promise<HealthCheckResult> {
    return await this.performHealthCheck();
  }

  // Manual trigger for performance metrics collection
  public async triggerPerformanceCollection(): Promise<PerformanceMetrics> {
    return await this.collectPerformanceMetrics();
  }

  // Stop monitoring
  public stopMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = undefined;
    }
    
    if (this.performanceTimer) {
      clearInterval(this.performanceTimer);
      this.performanceTimer = undefined;
    }
    
    if (this.anomalyTimer) {
      clearInterval(this.anomalyTimer);
      this.anomalyTimer = undefined;
    }
    
    this.isMonitoring = false;
    
    logger.info('MonitoringSystem: Monitoring stopped');
  }

  // Cleanup resources
  public cleanup(): void {
    this.stopMonitoring();
    this.performanceHistory = [];
    this.healthHistory = [];
    
    logger.info('MonitoringSystem: Resources cleaned up');
  }
}

// Export singleton instance
export const monitoringSystem = new MonitoringSystem();