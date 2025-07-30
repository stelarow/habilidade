'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { blogErrorLogger, ErrorCategory } from '@/lib/blog/errorLogger';

export enum ErrorType {
  NETWORK = 'network',
  COMPONENT = 'component',
  DATA = 'data',
  RENDER = 'render',
  RUNTIME = 'runtime'
}

export enum RecoveryStrategy {
  NETWORK_RETRY = 'network_retry',
  COMPONENT_REMOUNT = 'component_remount',
  DATA_REFETCH = 'data_refetch',
  CACHE_INVALIDATION = 'cache_invalidation',
  GRACEFUL_DEGRADATION = 'graceful_degradation'
}

export interface RecoveryState {
  isRecovering: boolean;
  strategy: RecoveryStrategy | null;
  attempts: number;
  maxAttempts: number;
  lastAttempt: Date | null;
  success: boolean;
  errorHistory: Error[];
}

export interface RecoveryMetrics {
  recoveryAttempts: number;
  successfulRecoveries: number;
  failedRecoveries: number;
  averageRecoveryTime: number;
  mostCommonErrors: { type: ErrorType; count: number }[];
  userEngagementPostRecovery: number;
}

export interface RecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  enableAutomaticRecovery?: boolean;
  fallbackStrategy?: RecoveryStrategy;
  onRecoveryStart?: (strategy: RecoveryStrategy) => void;
  onRecoverySuccess?: (strategy: RecoveryStrategy, attempts: number) => void;
  onRecoveryFailure?: (strategy: RecoveryStrategy, error: Error) => void;
}

export function useBlogErrorRecovery(options: RecoveryOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    exponentialBackoff = true,
    enableAutomaticRecovery = true,
    fallbackStrategy = RecoveryStrategy.GRACEFUL_DEGRADATION,
    onRecoveryStart,
    onRecoverySuccess,
    onRecoveryFailure
  } = options;

  const [recoveryState, setRecoveryState] = useState<RecoveryState>({
    isRecovering: false,
    strategy: null,
    attempts: 0,
    maxAttempts: maxRetries,
    lastAttempt: null,
    success: false,
    errorHistory: []
  });

  const [metrics, setMetrics] = useState<RecoveryMetrics>({
    recoveryAttempts: 0,
    successfulRecoveries: 0,
    failedRecoveries: 0,
    averageRecoveryTime: 0,
    mostCommonErrors: [],
    userEngagementPostRecovery: 0
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recoveryStartTime = useRef<number | null>(null);
  const cachedData = useRef<Map<string, any>>(new Map());

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getRecoveryStrategy = useCallback((errorType: ErrorType): RecoveryStrategy => {
    switch (errorType) {
      case ErrorType.NETWORK:
        return RecoveryStrategy.NETWORK_RETRY;
      case ErrorType.COMPONENT:
        return RecoveryStrategy.COMPONENT_REMOUNT;
      case ErrorType.DATA:
        return RecoveryStrategy.DATA_REFETCH;
      case ErrorType.RENDER:
        return RecoveryStrategy.COMPONENT_REMOUNT;
      case ErrorType.RUNTIME:
        return RecoveryStrategy.CACHE_INVALIDATION;
      default:
        return fallbackStrategy;
    }
  }, [fallbackStrategy]);

  const calculateDelay = useCallback((attempt: number): number => {
    if (!exponentialBackoff) return retryDelay;
    return retryDelay * Math.pow(2, attempt - 1);
  }, [retryDelay, exponentialBackoff]);

  const updateMetrics = useCallback((success: boolean, recoveryTime: number) => {
    setMetrics(prev => {
      const newSuccessful = success ? prev.successfulRecoveries + 1 : prev.successfulRecoveries;
      const newFailed = success ? prev.failedRecoveries : prev.failedRecoveries + 1;
      const totalRecoveries = newSuccessful + newFailed;
      
      const newAverageTime = totalRecoveries > 0 
        ? (prev.averageRecoveryTime * (totalRecoveries - 1) + recoveryTime) / totalRecoveries
        : recoveryTime;

      return {
        ...prev,
        recoveryAttempts: prev.recoveryAttempts + 1,
        successfulRecoveries: newSuccessful,
        failedRecoveries: newFailed,
        averageRecoveryTime: newAverageTime
      };
    });
  }, []);

  const executeNetworkRetry = useCallback(async (attempt: number): Promise<boolean> => {
    try {
      // Simulate network retry logic
      await new Promise(resolve => setTimeout(resolve, calculateDelay(attempt)));
      
      // Check if network is available
      if (!navigator.onLine) {
        throw new Error('Network unavailable');
      }

      // Try to fetch a lightweight resource to test connectivity
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Network retry failed:', error);
      return false;
    }
  }, [calculateDelay]);

  const executeComponentRemount = useCallback(async (): Promise<boolean> => {
    try {
      // Signal for component remount (would be handled by parent component)
      window.dispatchEvent(new CustomEvent('blog-component-remount', {
        detail: { timestamp: Date.now() }
      }));
      
      // Wait a bit for remount to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Component remount failed:', error);
      return false;
    }
  }, []);

  const executeDataRefetch = useCallback(async (cacheKey?: string): Promise<boolean> => {
    try {
      // Clear specific cache if key provided
      if (cacheKey) {
        cachedData.current.delete(cacheKey);
      }

      // Signal for data refetch
      window.dispatchEvent(new CustomEvent('blog-data-refetch', {
        detail: { cacheKey, timestamp: Date.now() }
      }));

      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (error) {
      console.error('Data refetch failed:', error);
      return false;
    }
  }, []);

  const executeCacheInvalidation = useCallback(async (): Promise<boolean> => {
    try {
      // Clear all cached data
      cachedData.current.clear();
      
      // Clear browser cache if possible
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Clear localStorage blog-related data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('blog_') || key.startsWith('post_')) {
          localStorage.removeItem(key);
        }
      });

      return true;
    } catch (error) {
      console.error('Cache invalidation failed:', error);
      return false;
    }
  }, []);

  const executeGracefulDegradation = useCallback(async (): Promise<boolean> => {
    try {
      // Enable fallback mode
      window.dispatchEvent(new CustomEvent('blog-fallback-mode', {
        detail: { enabled: true, timestamp: Date.now() }
      }));

      // Use cached data if available
      const cachedPosts = cachedData.current.get('blog_posts');
      if (cachedPosts) {
        window.dispatchEvent(new CustomEvent('blog-use-cached-data', {
          detail: { data: cachedPosts, timestamp: Date.now() }
        }));
      }

      return true;
    } catch (error) {
      console.error('Graceful degradation failed:', error);
      return false;
    }
  }, []);

  const executeRecoveryStrategy = useCallback(async (
    strategy: RecoveryStrategy, 
    attempt: number,
    errorContext?: any
  ): Promise<boolean> => {
    switch (strategy) {
      case RecoveryStrategy.NETWORK_RETRY:
        return executeNetworkRetry(attempt);
      
      case RecoveryStrategy.COMPONENT_REMOUNT:
        return executeComponentRemount();
      
      case RecoveryStrategy.DATA_REFETCH:
        return executeDataRefetch(errorContext?.cacheKey);
      
      case RecoveryStrategy.CACHE_INVALIDATION:
        return executeCacheInvalidation();
      
      case RecoveryStrategy.GRACEFUL_DEGRADATION:
        return executeGracefulDegradation();
      
      default:
        return false;
    }
  }, [executeNetworkRetry, executeComponentRemount, executeDataRefetch, executeCacheInvalidation, executeGracefulDegradation]);

  const attemptRecovery = useCallback(async (
    errorType: ErrorType,
    error?: Error,
    errorContext?: any
  ): Promise<boolean> => {
    if (recoveryState.isRecovering || recoveryState.attempts >= maxRetries) {
      return false;
    }

    const strategy = getRecoveryStrategy(errorType);
    recoveryStartTime.current = Date.now();

    setRecoveryState(prev => ({
      ...prev,
      isRecovering: true,
      strategy,
      attempts: prev.attempts + 1,
      lastAttempt: new Date(),
      errorHistory: error ? [...prev.errorHistory, error] : prev.errorHistory
    }));

    onRecoveryStart?.(strategy);

    try {
      const success = await executeRecoveryStrategy(strategy, recoveryState.attempts + 1, errorContext);
      const recoveryTime = Date.now() - (recoveryStartTime.current || 0);

      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false,
        success
      }));

      updateMetrics(success, recoveryTime);

      if (success) {
        onRecoverySuccess?.(strategy, recoveryState.attempts + 1);
        
        // Log successful recovery
        if (error) {
          blogErrorLogger.logError(new Error(`Recovery successful: ${strategy}`), {
            pageType: 'recovery',
            userAgent: navigator.userAgent,
            timestamp: new Date(),
            url: window.location.href,
            performanceMetrics: {
              loadTime: recoveryTime
            }
          });
        }
      } else {
        onRecoveryFailure?.(strategy, error || new Error('Recovery failed'));
      }

      return success;
    } catch (recoveryError) {
      const recoveryTime = Date.now() - (recoveryStartTime.current || 0);
      
      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false,
        success: false
      }));

      updateMetrics(false, recoveryTime);
      onRecoveryFailure?.(strategy, recoveryError as Error);

      return false;
    }
  }, [recoveryState, maxRetries, getRecoveryStrategy, executeRecoveryStrategy, updateMetrics, onRecoveryStart, onRecoverySuccess, onRecoveryFailure]);

  const retryWithFallback = useCallback(async (errorType: ErrorType): Promise<void> => {
    const primarySuccess = await attemptRecovery(errorType);
    
    if (!primarySuccess && recoveryState.attempts < maxRetries) {
      // Try fallback strategy
      await attemptRecovery(ErrorType.RUNTIME); // This will trigger graceful degradation
    }
  }, [attemptRecovery, recoveryState.attempts, maxRetries]);

  const resetRecoveryState = useCallback(() => {
    setRecoveryState({
      isRecovering: false,
      strategy: null,
      attempts: 0,
      maxAttempts: maxRetries,
      lastAttempt: null,
      success: false,
      errorHistory: []
    });
  }, [maxRetries]);

  const manualRetry = useCallback(async (errorType?: ErrorType): Promise<boolean> => {
    const type = errorType || ErrorType.RUNTIME;
    return attemptRecovery(type);
  }, [attemptRecovery]);

  const cacheData = useCallback((key: string, data: any, ttl: number = 300000): void => {
    cachedData.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Clean up expired data
    setTimeout(() => {
      const cached = cachedData.current.get(key);
      if (cached && Date.now() - cached.timestamp > cached.ttl) {
        cachedData.current.delete(key);
      }
    }, ttl);
  }, []);

  const getCachedData = useCallback((key: string): any => {
    const cached = cachedData.current.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      cachedData.current.delete(key);
      return null;
    }

    return cached.data;
  }, []);

  // Automatic recovery on network status change
  useEffect(() => {
    if (!enableAutomaticRecovery) return;

    const handleOnline = () => {
      if (recoveryState.errorHistory.some(error => 
        error.message.toLowerCase().includes('network') || 
        error.message.toLowerCase().includes('fetch')
      )) {
        attemptRecovery(ErrorType.NETWORK);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [enableAutomaticRecovery, recoveryState.errorHistory, attemptRecovery]);

  return {
    recoveryState,
    metrics,
    attemptRecovery,
    retryWithFallback,
    manualRetry,
    resetRecoveryState,
    cacheData,
    getCachedData,
    isRecovering: recoveryState.isRecovering,
    canRetry: recoveryState.attempts < maxRetries,
    recoveryProgress: recoveryState.attempts / maxRetries
  };
}