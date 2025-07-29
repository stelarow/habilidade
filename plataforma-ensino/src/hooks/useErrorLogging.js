/**
 * useErrorLogging Hook
 * React hook for comprehensive error logging and tracking
 */

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { logger } from '@/utils/logger';

export const useErrorLogging = (componentName = 'Unknown', options = {}) => {
  const router = useRouter();
  const mountTimeRef = useRef(Date.now());
  const errorCountRef = useRef(0);
  
  const {
    trackPerformance = true,
    trackUserActions = true,
    trackNetworkErrors = true,
    maxErrorsPerSession = 10,
    enableErrorRecovery = true
  } = options;

  // Component lifecycle logging
  useEffect(() => {
    const mountTime = Date.now();
    mountTimeRef.current = mountTime;
    
    logger.componentMount(componentName, options);
    
    return () => {
      const unmountTime = Date.now();
      const mountDuration = unmountTime - mountTime;
      
      logger.componentUnmount(componentName);
      
      if (trackPerformance) {
        logger.info('Component Lifecycle', {
          component: componentName,
          mountDuration,
          errorCount: errorCountRef.current,
          type: 'component_performance'
        });
      }
    };
  }, [componentName, trackPerformance]);

  // Error boundary functionality
  const logError = useCallback((error, errorInfo = {}) => {
    errorCountRef.current += 1;
    
    const errorData = {
      component: componentName,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo,
      errorCount: errorCountRef.current,
      mountDuration: Date.now() - mountTimeRef.current,
      type: 'component_error'
    };

    logger.error('Component Error', errorData);

    // Check if error limit exceeded
    if (errorCountRef.current >= maxErrorsPerSession) {
      logger.critical('Component Error Limit Exceeded', {
        component: componentName,
        errorCount: errorCountRef.current,
        maxErrors: maxErrorsPerSession,
        type: 'error_limit_exceeded'
      });
    }

    return errorData;
  }, [componentName, maxErrorsPerSession]);

  // Async error logging
  const logAsyncError = useCallback(async (asyncFunction, context = {}) => {
    try {
      const result = await asyncFunction();
      return result;
    } catch (error) {
      const errorData = {
        component: componentName,
        context,
        async: true,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        type: 'async_error'
      };

      logger.error('Async Operation Error', errorData);
      
      if (enableErrorRecovery) {
        // Attempt recovery or provide fallback
        return null;
      } else {
        throw error;
      }
    }
  }, [componentName, enableErrorRecovery]);

  // Network error tracking
  const logNetworkError = useCallback((url, method, status, response = {}) => {
    if (!trackNetworkErrors) return;

    const networkErrorData = {
      component: componentName,
      url,
      method,
      status,
      response,
      type: 'network_error'
    };

    logger.apiError(url, method, status, response, {
      component: componentName
    });

    return networkErrorData;
  }, [componentName, trackNetworkErrors]);

  // User action logging
  const logUserAction = useCallback((action, details = {}) => {
    if (!trackUserActions) return;

    logger.userAction(action, {
      component: componentName,
      ...details
    });
  }, [componentName, trackUserActions]);

  // Performance measurement
  const measurePerformance = useCallback((label, operation) => {
    if (!trackPerformance) {
      return operation();
    }

    const performanceLabel = `${componentName}_${label}`;
    logger.startPerformanceTimer(performanceLabel);
    
    try {
      const result = operation();
      
      // Handle async operations
      if (result && typeof result.then === 'function') {
        return result.finally(() => {
          logger.endPerformanceTimer(performanceLabel, {
            component: componentName,
            operation: label
          });
        });
      } else {
        logger.endPerformanceTimer(performanceLabel, {
          component: componentName,
          operation: label
        });
        return result;
      }
    } catch (error) {
      logger.endPerformanceTimer(performanceLabel, {
        component: componentName,
        operation: label,
        error: true
      });
      throw error;
    }
  }, [componentName, trackPerformance]);

  // Form error logging
  const logFormError = useCallback((fieldName, errorMessage, formData = {}) => {
    logger.warn('Form Validation Error', {
      component: componentName,
      field: fieldName,
      error: errorMessage,
      formData: logger.sanitizeData ? logger.sanitizeData(formData) : formData,
      type: 'form_error'
    });
  }, [componentName]);

  // Route change error logging
  useEffect(() => {
    const handleRouteError = (error) => {
      logger.error('Route Change Error', {
        component: componentName,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        type: 'route_error'
      });
    };

    // Listen for route errors if router is available
    if (router && router.events) {
      router.events.on('routeChangeError', handleRouteError);
      
      return () => {
        router.events.off('routeChangeError', handleRouteError);
      };
    }
  }, [router, componentName]);

  // State change logging
  const logStateChange = useCallback((stateName, oldValue, newValue) => {
    logger.debug('State Change', {
      component: componentName,
      state: stateName,
      oldValue: oldValue,
      newValue: newValue,
      type: 'state_change'
    });
  }, [componentName]);

  // API call wrapper with error logging
  const loggedApiCall = useCallback(async (apiCall, endpoint, options = {}) => {
    const startTime = Date.now();
    
    try {
      logger.debug('API Call Started', {
        component: componentName,
        endpoint,
        options: logger.sanitizeData ? logger.sanitizeData(options) : options,
        type: 'api_call_start'
      });

      const result = await apiCall();
      const duration = Date.now() - startTime;
      
      logger.info('API Call Success', {
        component: componentName,
        endpoint,
        duration,
        type: 'api_call_success'
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logNetworkError(endpoint, options.method || 'GET', error.status || 0, {
        error: error.message,
        duration
      });
      
      throw error;
    }
  }, [componentName, logNetworkError]);

  // Memory usage tracking
  const logMemoryUsage = useCallback((context = '') => {
    if (!trackPerformance || typeof window === 'undefined' || !performance.memory) {
      return;
    }

    logger.debug('Memory Usage', {
      component: componentName,
      context,
      memory: {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      },
      type: 'memory_usage'
    });
  }, [componentName, trackPerformance]);

  // Error recovery utilities
  const createErrorBoundary = useCallback((fallbackComponent) => {
    return {
      componentDidCatch: (error, errorInfo) => {
        logError(error, errorInfo);
      },
      render: ({ hasError, error, children }) => {
        if (hasError) {
          logger.warn('Error Boundary Activated', {
            component: componentName,
            error: error?.message,
            type: 'error_boundary'
          });
          return fallbackComponent || null;
        }
        return children;
      }
    };
  }, [componentName, logError]);

  // Get current error statistics
  const getErrorStats = useCallback(() => {
    return {
      component: componentName,
      errorCount: errorCountRef.current,
      mountDuration: Date.now() - mountTimeRef.current,
      mountTime: new Date(mountTimeRef.current).toISOString()
    };
  }, [componentName]);

  return {
    // Core error logging
    logError,
    logAsyncError,
    logNetworkError,
    
    // User interaction logging
    logUserAction,
    logFormError,
    logStateChange,
    
    // Performance and monitoring
    measurePerformance,
    logMemoryUsage,
    loggedApiCall,
    
    // Utilities
    createErrorBoundary,
    getErrorStats,
    
    // Component info
    componentName,
    errorCount: errorCountRef.current
  };
};

// Enhanced version with additional features
export const useAdvancedErrorLogging = (componentName, options = {}) => {
  const basicLogging = useErrorLogging(componentName, options);
  
  // Additional advanced features
  const logBusinessLogicError = useCallback((operation, data, error) => {
    logger.error('Business Logic Error', {
      component: componentName,
      operation,
      data: logger.sanitizeData ? logger.sanitizeData(data) : data,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      type: 'business_logic_error'
    });
  }, [componentName]);

  const logSecurityEvent = useCallback((event, details = {}) => {
    logger.warn('Security Event', {
      component: componentName,
      event,
      details,
      type: 'security_event'
    });
  }, [componentName]);

  const logUserExperience = useCallback((metric, value, context = {}) => {
    logger.info('User Experience Metric', {
      component: componentName,
      metric,
      value,
      context,
      type: 'ux_metric'
    });
  }, [componentName]);

  return {
    ...basicLogging,
    logBusinessLogicError,
    logSecurityEvent,
    logUserExperience
  };
};

export default useErrorLogging;