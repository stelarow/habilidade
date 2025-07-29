import { createClient } from '@/lib/supabase/client';

export interface BlogErrorContext {
  pageType: string;
  postId?: string;
  categoryId?: string;
  searchQuery?: string;
  userAgent: string;
  timestamp: Date;
  url: string;
  userId?: string;
  sessionId?: string;
  performanceMetrics?: {
    loadTime?: number;
    memoryUsage?: number;
    navigationTiming?: PerformanceNavigationTiming;
  };
}

export enum ErrorCategory {
  RUNTIME = 'runtime',
  NETWORK = 'network', 
  COMPONENT = 'component',
  DATA = 'data',
  RENDER = 'render',
  PERFORMANCE = 'performance',
  SECURITY = 'security'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface BlogErrorLog {
  id?: string;
  error_name: string;
  error_message: string;
  error_stack?: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context: BlogErrorContext;
  user_id?: string;
  session_id?: string;
  resolved: boolean;
  created_at?: string;
  metadata?: Record<string, any>;
}

export interface AlertThreshold {
  errorType: string;
  frequency: number;
  timeWindow: number; // minutes
  severity: ErrorSeverity;
  alertMethod: 'email' | 'webhook' | 'both';
}

export class BlogErrorLogger {
  private supabase: ReturnType<typeof createClient>;
  private sessionId: string;
  private errorCache: Map<string, number> = new Map();
  private alertThresholds: AlertThreshold[] = [
    {
      errorType: 'runtime',
      frequency: 5,
      timeWindow: 10,
      severity: ErrorSeverity.HIGH,
      alertMethod: 'both'
    },
    {
      errorType: 'network',
      frequency: 10,
      timeWindow: 15,
      severity: ErrorSeverity.MEDIUM,
      alertMethod: 'email'
    },
    {
      errorType: 'component',
      frequency: 3,
      timeWindow: 5,
      severity: ErrorSeverity.HIGH,
      alertMethod: 'both'
    },
    {
      errorType: 'data',
      frequency: 7,
      timeWindow: 10,
      severity: ErrorSeverity.MEDIUM,
      alertMethod: 'email'
    }
  ];

  constructor() {
    this.supabase = createClient();
    this.sessionId = this.generateSessionId();
    this.initializePerformanceMonitoring();
  }

  private generateSessionId(): string {
    return `blog_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceMonitoring() {
    if (typeof window !== 'undefined') {
      // Monitor performance metrics
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.collectPerformanceMetrics();
        }, 1000);
      });

      // Monitor memory usage if available
      if ('memory' in performance) {
        setInterval(() => {
          this.checkMemoryUsage();
        }, 30000); // Check every 30 seconds
      }
    }
  }

  private collectPerformanceMetrics(): PerformanceNavigationTiming | null {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation;
    }
    return null;
  }

  private checkMemoryUsage() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      if (usageRatio > 0.9) {
        this.logError(new Error('High memory usage detected'), {
          pageType: 'performance',
          userAgent: navigator.userAgent,
          timestamp: new Date(),
          url: window.location.href,
          sessionId: this.sessionId,
          performanceMetrics: {
            memoryUsage: usageRatio
          }
        });
      }
    }
  }

  public async logError(error: Error, context: BlogErrorContext): Promise<void> {
    try {
      const category = this.categorizeError(error);
      const severity = this.determineSeverity(error, category);
      
      const errorLog: BlogErrorLog = {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack,
        category,
        severity,
        context: {
          ...context,
          sessionId: this.sessionId,
          performanceMetrics: {
            ...context.performanceMetrics,
            navigationTiming: this.collectPerformanceMetrics()
          }
        },
        session_id: this.sessionId,
        resolved: false,
        metadata: {
          browser: this.getBrowserInfo(),
          viewport: this.getViewportInfo(),
          connection: this.getConnectionInfo()
        }
      };

      // Log to console for development
      if (process.env.NODE_ENV === 'development') {
        console.group('=¨ Blog Error Logged');
        console.error('Error:', error);
        console.log('Category:', category);
        console.log('Severity:', severity);
        console.log('Context:', context);
        console.groupEnd();
      }

      // Store in database
      await this.storeErrorLog(errorLog);

      // Check if we should send alerts
      await this.checkAlertThresholds(category, severity);

      // Report to Sentry if available
      this.reportToSentry(error, errorLog);

      // Update error frequency cache
      this.updateErrorCache(category);

    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
      // Fallback: at least log to console
      console.error('Original error that failed to log:', error);
    }
  }

  public categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Network errors
    if (message.includes('network') || message.includes('fetch') || 
        message.includes('timeout') || message.includes('cors')) {
      return ErrorCategory.NETWORK;
    }

    // Component lifecycle errors
    if (stack.includes('react') || message.includes('render') || 
        message.includes('component') || message.includes('hook')) {
      return ErrorCategory.COMPONENT;
    }

    // Data-related errors
    if (message.includes('json') || message.includes('parse') || 
        message.includes('undefined') || message.includes('null')) {
      return ErrorCategory.DATA;
    }

    // Render errors
    if (message.includes('render') || message.includes('dom') || 
        message.includes('element')) {
      return ErrorCategory.RENDER;
    }

    // Performance errors
    if (message.includes('memory') || message.includes('performance') || 
        message.includes('slow')) {
      return ErrorCategory.PERFORMANCE;
    }

    // Security errors
    if (message.includes('security') || message.includes('csp') || 
        message.includes('cors') || message.includes('xss')) {
      return ErrorCategory.SECURITY;
    }

    // Default to runtime
    return ErrorCategory.RUNTIME;
  }

  private determineSeverity(error: Error, category: ErrorCategory): ErrorSeverity {
    const message = error.message.toLowerCase();

    // Critical errors
    if (message.includes('critical') || message.includes('fatal') || 
        category === ErrorCategory.SECURITY) {
      return ErrorSeverity.CRITICAL;
    }

    // High severity
    if (category === ErrorCategory.COMPONENT || category === ErrorCategory.RENDER ||
        message.includes('crash') || message.includes('fail')) {
      return ErrorSeverity.HIGH;
    }

    // Medium severity
    if (category === ErrorCategory.NETWORK || category === ErrorCategory.DATA ||
        message.includes('warning') || message.includes('deprecated')) {
      return ErrorSeverity.MEDIUM;
    }

    // Default to low
    return ErrorSeverity.LOW;
  }

  private async storeErrorLog(errorLog: BlogErrorLog): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('blog_error_logs')
        .insert([errorLog]);

      if (error) {
        console.error('Failed to store error log in database:', error);
      }
    } catch (dbError) {
      console.error('Database error while storing error log:', dbError);
    }
  }

  private async checkAlertThresholds(category: ErrorCategory, severity: ErrorSeverity): Promise<void> {
    const threshold = this.alertThresholds.find(t => t.errorType === category);
    if (!threshold) return;

    const frequency = await this.getErrorFrequency(category, threshold.timeWindow);
    
    if (frequency >= threshold.frequency && severity >= threshold.severity) {
      await this.sendAlert(category, frequency, threshold);
    }
  }

  public async getErrorFrequency(errorType: string, timeWindowMinutes: number): Promise<number> {
    try {
      const timeWindow = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
      
      const { data, error } = await this.supabase
        .from('blog_error_logs')
        .select('id')
        .eq('category', errorType)
        .gte('created_at', timeWindow.toISOString());

      if (error) {
        console.error('Error fetching error frequency:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Error calculating error frequency:', error);
      return 0;
    }
  }

  private async sendAlert(category: ErrorCategory, frequency: number, threshold: AlertThreshold): Promise<void> {
    const alertData = {
      category,
      frequency,
      threshold: threshold.frequency,
      timeWindow: threshold.timeWindow,
      severity: threshold.severity,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    // Send email alert
    if (threshold.alertMethod === 'email' || threshold.alertMethod === 'both') {
      await this.sendEmailAlert(alertData);
    }

    // Send webhook alert
    if (threshold.alertMethod === 'webhook' || threshold.alertMethod === 'both') {
      await this.sendWebhookAlert(alertData);
    }
  }

  private async sendEmailAlert(alertData: any): Promise<void> {
    // Implementation would depend on email service
    console.log('Email alert would be sent:', alertData);
  }

  private async sendWebhookAlert(alertData: any): Promise<void> {
    try {
      const webhookUrl = process.env.ERROR_ALERT_WEBHOOK;
      if (!webhookUrl) return;

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData)
      });
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
    }
  }

  private reportToSentry(error: Error, errorLog: BlogErrorLog): void {
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          component: 'BlogErrorLogger',
          category: errorLog.category,
          severity: errorLog.severity,
          sessionId: this.sessionId
        },
        contexts: {
          blog: {
            pageType: errorLog.context.pageType,
            postId: errorLog.context.postId,
            categoryId: errorLog.context.categoryId,
            searchQuery: errorLog.context.searchQuery
          }
        },
        extra: {
          errorLog,
          performanceMetrics: errorLog.context.performanceMetrics
        }
      });
    }
  }

  private updateErrorCache(category: ErrorCategory): void {
    const current = this.errorCache.get(category) || 0;
    this.errorCache.set(category, current + 1);
  }

  public shouldAlert(error: Error): boolean {
    const category = this.categorizeError(error);
    const severity = this.determineSeverity(error, category);
    
    return severity === ErrorSeverity.CRITICAL || severity === ErrorSeverity.HIGH;
  }

  private getBrowserInfo(): any {
    if (typeof window === 'undefined') return null;

    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };
  }

  private getViewportInfo(): any {
    if (typeof window === 'undefined') return null;

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      colorDepth: screen.colorDepth
    };
  }

  private getConnectionInfo(): any {
    if (typeof window === 'undefined' || !('connection' in navigator)) return null;

    const connection = (navigator as any).connection;
    return {
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      saveData: connection?.saveData
    };
  }

  // Public method to check system health
  public async getSystemHealth(): Promise<{
    errorRate: number;
    criticalErrorsLast24h: number;
    averageResponseTime: number;
    memoryUsage?: number;
  }> {
    try {
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const { data: errors } = await this.supabase
        .from('blog_error_logs')
        .select('severity, created_at')
        .gte('created_at', last24Hours.toISOString());

      const criticalErrorsLast24h = errors?.filter(e => e.severity === ErrorSeverity.CRITICAL)?.length || 0;
      const errorRate = (errors?.length || 0) / 24; // errors per hour

      let memoryUsage;
      if (typeof window !== 'undefined' && 'memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      }

      return {
        errorRate,
        criticalErrorsLast24h,
        averageResponseTime: 0, // Would be calculated from performance data
        memoryUsage
      };
    } catch (error) {
      console.error('Error getting system health:', error);
      return {
        errorRate: 0,
        criticalErrorsLast24h: 0,
        averageResponseTime: 0
      };
    }
  }
}

// Singleton instance
export const blogErrorLogger = new BlogErrorLogger();

// Export types
export type { BlogErrorContext, BlogErrorLog, AlertThreshold };