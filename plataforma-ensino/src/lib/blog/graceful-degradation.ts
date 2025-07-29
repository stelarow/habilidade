/**
 * Sistema de Degradação Graceful - Mantém funcionalidades essenciais durante falhas
 * Feature: FEATURE_003_MAINTENANCE_MODE
 * 
 * Este sistema monitora a saúde dos serviços e implementa fallbacks automáticos
 * para manter a experiência do usuário durante problemas parciais do sistema.
 */

import React from 'react';

// Types
export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: Date;
  responseTime?: number;
  error?: string;
  criticality: 'critical' | 'important' | 'optional';
}

export interface DegradationLevel {
  level: 'normal' | 'degraded' | 'minimal' | 'emergency';
  availableFeatures: string[];
  disabledFeatures: string[];
  fallbackMethods: Record<string, string>;
}

export interface HealthCheck {
  url: string;
  timeout: number;
  retries: number;
  interval: number;
}

// Service definitions with health check configurations
const SERVICES: Record<string, { healthCheck: HealthCheck; criticality: ServiceStatus['criticality'] }> = {
  database: {
    healthCheck: {
      url: '/api/health/database',
      timeout: 5000,
      retries: 3,
      interval: 30000
    },
    criticality: 'critical'
  },
  auth: {
    healthCheck: {
      url: '/api/health/auth',
      timeout: 3000,
      retries: 2,
      interval: 15000
    },
    criticality: 'critical'
  },
  storage: {
    healthCheck: {
      url: '/api/health/storage',
      timeout: 8000,
      retries: 2,
      interval: 60000
    },
    criticality: 'important'
  },
  email: {
    healthCheck: {
      url: '/api/health/email',
      timeout: 10000,
      retries: 1,
      interval: 120000
    },
    criticality: 'optional'
  },
  analytics: {
    healthCheck: {
      url: '/api/health/analytics',
      timeout: 5000,
      retries: 1,
      interval: 300000
    },
    criticality: 'optional'
  }
};

// Degradation level configurations
const DEGRADATION_LEVELS: Record<DegradationLevel['level'], Omit<DegradationLevel, 'level'>> = {
  normal: {
    availableFeatures: ['all'],
    disabledFeatures: [],
    fallbackMethods: {}
  },
  degraded: {
    availableFeatures: [
      'core_functionality',
      'authentication',
      'basic_content',
      'emergency_contact'
    ],
    disabledFeatures: [
      'real_time_features',
      'analytics',
      'non_essential_apis'
    ],
    fallbackMethods: {
      'real_time_updates': 'polling',
      'analytics': 'local_storage',
      'notifications': 'basic_alerts'
    }
  },
  minimal: {
    availableFeatures: [
      'authentication',
      'basic_content',
      'emergency_contact'
    ],
    disabledFeatures: [
      'file_uploads',
      'real_time_features',
      'analytics',
      'notifications',
      'non_essential_apis'
    ],
    fallbackMethods: {
      'content_delivery': 'cached_static',
      'user_data': 'local_storage',
      'authentication': 'session_only'
    }
  },
  emergency: {
    availableFeatures: [
      'static_content',
      'emergency_contact'
    ],
    disabledFeatures: [
      'authentication',
      'dynamic_content',
      'user_interactions',
      'all_apis'
    ],
    fallbackMethods: {
      'all_content': 'static_fallback',
      'user_support': 'emergency_contact_only'
    }
  }
};

// Main degradation service class
export class GracefulDegradationService {
  private static instance: GracefulDegradationService;
  private serviceStatuses = new Map<string, ServiceStatus>();
  private currentDegradationLevel: DegradationLevel['level'] = 'normal';
  private healthCheckIntervals = new Map<string, NodeJS.Timeout>();
  private operationQueue: Array<{ operation: Function; priority: number; retries: number }> = [];
  private isProcessingQueue = false;
  private listeners: Array<(level: DegradationLevel) => void> = [];

  static getInstance(): GracefulDegradationService {
    if (!GracefulDegradationService.instance) {
      GracefulDegradationService.instance = new GracefulDegradationService();
    }
    return GracefulDegradationService.instance;
  }

  constructor() {
    this.initializeServices();
    this.startHealthChecks();
  }

  /**
   * Initialize service status tracking
   */
  private initializeServices(): void {
    Object.entries(SERVICES).forEach(([serviceName, config]) => {
      this.serviceStatuses.set(serviceName, {
        name: serviceName,
        status: 'healthy',
        lastCheck: new Date(),
        criticality: config.criticality
      });
    });
  }

  /**
   * Start health check intervals for all services
   */
  private startHealthChecks(): void {
    Object.entries(SERVICES).forEach(([serviceName, config]) => {
      const interval = setInterval(() => {
        this.checkServiceHealth(serviceName);
      }, config.healthCheck.interval);
      
      this.healthCheckIntervals.set(serviceName, interval);
      
      // Initial health check
      this.checkServiceHealth(serviceName);
    });
  }

  /**
   * Perform health check for a specific service
   */
  private async checkServiceHealth(serviceName: string): Promise<void> {
    const serviceConfig = SERVICES[serviceName];
    if (!serviceConfig) return;

    const startTime = Date.now();
    let status: ServiceStatus['status'] = 'down';
    let error: string | undefined;

    try {
      const response = await this.performHealthCheck(serviceConfig.healthCheck);
      
      if (response.ok) {
        status = 'healthy';
      } else {
        status = 'degraded';
        error = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (err) {
      status = 'down';
      error = err instanceof Error ? err.message : 'Unknown error';
    }

    const responseTime = Date.now() - startTime;

    // Update service status
    this.serviceStatuses.set(serviceName, {
      name: serviceName,
      status,
      lastCheck: new Date(),
      responseTime,
      error,
      criticality: serviceConfig.criticality
    });

    // Evaluate if degradation level needs to change
    this.evaluateDegradationLevel();

    console.log(`[DEGRADATION] Service ${serviceName}: ${status} (${responseTime}ms)`);
  }

  /**
   * Perform HTTP health check with retries
   */
  private async performHealthCheck(healthCheck: HealthCheck): Promise<Response> {
    let lastError: Error;

    for (let attempt = 1; attempt <= healthCheck.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), healthCheck.timeout);

        const response = await fetch(healthCheck.url, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < healthCheck.retries) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Evaluate current system health and determine degradation level
   */
  private evaluateDegradationLevel(): void {
    const services = Array.from(this.serviceStatuses.values());
    
    // Count services by criticality and status
    const criticalDown = services.filter(s => s.criticality === 'critical' && s.status === 'down').length;
    const criticalDegraded = services.filter(s => s.criticality === 'critical' && s.status === 'degraded').length;
    const importantDown = services.filter(s => s.criticality === 'important' && s.status === 'down').length;
    
    let newLevel: DegradationLevel['level'] = 'normal';

    // Determine degradation level based on service status
    if (criticalDown > 0) {
      newLevel = 'emergency';
    } else if (criticalDegraded > 1 || (criticalDegraded > 0 && importantDown > 0)) {
      newLevel = 'minimal';
    } else if (criticalDegraded > 0 || importantDown > 1) {
      newLevel = 'degraded';
    }

    // Update degradation level if changed
    if (newLevel !== this.currentDegradationLevel) {
      const previousLevel = this.currentDegradationLevel;
      this.currentDegradationLevel = newLevel;
      
      console.log(`[DEGRADATION] Level changed: ${previousLevel} ’ ${newLevel}`);
      
      // Notify listeners
      this.notifyLevelChange();
      
      // Process queued operations if recovering
      if (this.isLevelBetter(newLevel, previousLevel)) {
        this.processOperationQueue();
      }
    }
  }

  /**
   * Check if one degradation level is better than another
   */
  private isLevelBetter(level1: DegradationLevel['level'], level2: DegradationLevel['level']): boolean {
    const levels = ['emergency', 'minimal', 'degraded', 'normal'];
    return levels.indexOf(level1) > levels.indexOf(level2);
  }

  /**
   * Notify listeners about degradation level changes
   */
  private notifyLevelChange(): void {
    const currentLevel = this.getCurrentDegradationLevel();
    this.listeners.forEach(listener => {
      try {
        listener(currentLevel);
      } catch (error) {
        console.error('[DEGRADATION] Error notifying listener:', error);
      }
    });
  }

  /**
   * Get current degradation level with configuration
   */
  public getCurrentDegradationLevel(): DegradationLevel {
    return {
      level: this.currentDegradationLevel,
      ...DEGRADATION_LEVELS[this.currentDegradationLevel]
    };
  }

  /**
   * Get current service statuses
   */
  public getServiceStatuses(): ServiceStatus[] {
    return Array.from(this.serviceStatuses.values());
  }

  /**
   * Check if a feature is available in current degradation level
   */
  public isFeatureAvailable(feature: string): boolean {
    const currentLevel = this.getCurrentDegradationLevel();
    return currentLevel.availableFeatures.includes('all') || 
           currentLevel.availableFeatures.includes(feature);
  }

  /**
   * Get fallback method for a feature
   */
  public getFallbackMethod(feature: string): string | null {
    const currentLevel = this.getCurrentDegradationLevel();
    return currentLevel.fallbackMethods[feature] || null;
  }

  /**
   * Queue an operation for later execution during recovery
   */
  public queueOperation(operation: Function, priority: number = 1): void {
    this.operationQueue.push({
      operation,
      priority,
      retries: 3
    });

    // Sort queue by priority (higher priority first)
    this.operationQueue.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Process queued operations
   */
  private async processOperationQueue(): Promise<void> {
    if (this.isProcessingQueue || this.operationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    console.log(`[DEGRADATION] Processing ${this.operationQueue.length} queued operations`);

    while (this.operationQueue.length > 0) {
      const queueItem = this.operationQueue.shift()!;
      
      try {
        await queueItem.operation();
        console.log('[DEGRADATION] Successfully processed queued operation');
      } catch (error) {
        console.error('[DEGRADATION] Error processing queued operation:', error);
        
        // Retry if still have attempts
        if (queueItem.retries > 0) {
          queueItem.retries--;
          this.operationQueue.unshift(queueItem);
        }
      }

      // Don't overwhelm the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessingQueue = false;
  }

  /**
   * Add listener for degradation level changes
   */
  public addDegradationListener(listener: (level: DegradationLevel) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove degradation listener
   */
  public removeDegradationListener(listener: (level: DegradationLevel) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Force a specific degradation level (for testing)
   */
  public forceDegradationLevel(level: DegradationLevel['level']): void {
    this.currentDegradationLevel = level;
    this.notifyLevelChange();
    console.log(`[DEGRADATION] Forced degradation level: ${level}`);
  }

  /**
   * Manually mark a service as healthy/degraded/down
   */
  public setServiceStatus(serviceName: string, status: ServiceStatus['status'], error?: string): void {
    const currentStatus = this.serviceStatuses.get(serviceName);
    if (currentStatus) {
      this.serviceStatuses.set(serviceName, {
        ...currentStatus,
        status,
        error,
        lastCheck: new Date()
      });
      this.evaluateDegradationLevel();
    }
  }

  /**
   * Stop all health checks and clean up
   */
  public destroy(): void {
    this.healthCheckIntervals.forEach(interval => clearInterval(interval));
    this.healthCheckIntervals.clear();
    this.listeners = [];
    this.operationQueue = [];
  }
}

// Export singleton instance
export const gracefulDegradation = GracefulDegradationService.getInstance();

// React hook for using degradation status in components
export function useDegradationLevel() {
  const [degradationLevel, setDegradationLevel] = React.useState<DegradationLevel>(
    gracefulDegradation.getCurrentDegradationLevel()
  );

  React.useEffect(() => {
    const listener = (level: DegradationLevel) => {
      setDegradationLevel(level);
    };

    gracefulDegradation.addDegradationListener(listener);
    
    return () => {
      gracefulDegradation.removeDegradationListener(listener);
    };
  }, []);

  return {
    degradationLevel,
    isFeatureAvailable: (feature: string) => gracefulDegradation.isFeatureAvailable(feature),
    getFallbackMethod: (feature: string) => gracefulDegradation.getFallbackMethod(feature),
    queueOperation: (operation: Function, priority?: number) => gracefulDegradation.queueOperation(operation, priority)
  };
}

// Utility functions for components
export const DegradationUtils = {
  /**
   * Show appropriate UI based on degradation level
   */
  conditionalRender<T>(
    feature: string,
    normalComponent: T,
    fallbackComponent: T,
    degradedComponent?: T
  ): T {
    const level = gracefulDegradation.getCurrentDegradationLevel();
    
    if (level.availableFeatures.includes('all') || level.availableFeatures.includes(feature)) {
      return normalComponent;
    }
    
    if (degradedComponent && (level.level === 'degraded' || level.level === 'minimal')) {
      return degradedComponent;
    }
    
    return fallbackComponent;
  },

  /**
   * Get user-friendly message for current degradation level
   */
  getDegradationMessage(): string {
    const level = gracefulDegradation.getCurrentDegradationLevel().level;
    
    const messages = {
      normal: '',
      degraded: 'Alguns recursos podem estar limitados devido a problemas técnicos.',
      minimal: 'O sistema está operando com funcionalidade limitada.',
      emergency: 'O sistema está em modo de emergência. Apenas funcionalidades essenciais estão disponíveis.'
    };

    return messages[level];
  }
};