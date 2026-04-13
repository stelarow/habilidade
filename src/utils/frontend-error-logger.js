/**
 * Frontend Error Logger
 * Captura erros do cliente e envia para Netlify Functions para logging centralizado
 */

class FrontendErrorLogger {
  constructor(options = {}) {
    this.functionUrl = options.functionUrl || '/.netlify/functions/error-monitoring/log-error';
    this.enabled = options.enabled !== false && globalThis.window !== undefined;
    this.sessionId = this.generateSessionId();
    this.errorQueue = [];
    this.isOnline = true;
    
    if (this.enabled) {
      this.setupErrorHandlers();
      this.setupNetworkDetection();
    }
  }

  /**
   * Setup global error handlers
   */
  setupErrorHandlers() {
    // JavaScript errors
    globalThis.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        severity: 'high'
      });
    });

    // Unhandled promise rejections
    globalThis.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        severity: 'high'
      });
    });

    // Console errors (wrap console.error)
    this.wrapConsoleError();
  }

  /**
   * Setup network status detection
   */
  setupNetworkDetection() {
    if ('navigator' in globalThis && 'onLine' in navigator) {
      this.isOnline = navigator.onLine;
      
      globalThis.addEventListener('online', () => {
        this.isOnline = true;
        this.flushErrorQueue();
      });
      
      globalThis.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  /**
   * Wrap console.error to capture manual errors
   */
  wrapConsoleError() {
    const originalConsoleError = console.error;
    
    console.error = (...arguments_) => {
      // Call original console.error
      originalConsoleError.apply(console, arguments_);
      
      // Log to our system
      const message = arguments_.map(argument => 
        typeof argument === 'object' ? JSON.stringify(argument) : String(argument)
      ).join(' ');
      
      this.logError({
        type: 'console_error',
        message: message.slice(0, 500), // Limit size
        severity: 'medium'
      });
    };
  }

  /**
   * Log error to Netlify Function
   */
  async logError(errorData) {
    const enrichedError = {
      ...errorData,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      url: globalThis.location.href,
      userAgent: navigator.userAgent,
      screen: {
        width: window.screen?.width,
        height: window.screen?.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      referrer: document.referrer,
      // Context data
      context: this.getPageContext()
    };

    if (this.isOnline) {
      try {
        await this.sendError(enrichedError);
      } catch (networkError) {
        // Only warn in production, silently fail in development
        const isDevelopment = globalThis.location.hostname === 'localhost' || 
                             globalThis.location.hostname === '127.0.0.1' ||
                             globalThis.location.port === '5173' ||
                             globalThis.location.port === '3000';
        
        if (!isDevelopment) {
          console.warn('Failed to send error to server:', networkError);
        }
        this.queueError(enrichedError);
      }
    } else {
      this.queueError(enrichedError);
    }
  }

  /**
   * Send error to Netlify Function
   */
  async sendError(errorData) {
    try {
      const response = await fetch(this.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // In development, silently fail instead of logging to console
      const isDevelopment = globalThis.location.hostname === 'localhost' || 
                           globalThis.location.hostname === '127.0.0.1' ||
                           globalThis.location.port === '5173' ||
                           globalThis.location.port === '3000';
      
      if (isDevelopment) {
        // Fail silently in development
        return { success: false, development: true };
      }
      
      // Re-throw for production environments
      throw error;
    }
  }

  /**
   * Queue error for later sending
   */
  queueError(errorData) {
    this.errorQueue.push(errorData);
    
    // Limit queue size
    if (this.errorQueue.length > 50) {
      this.errorQueue.shift(); // Remove oldest
    }
    
    // Store in localStorage as backup
    try {
      localStorage.setItem('errorQueue', JSON.stringify(this.errorQueue));
    } catch {
      // localStorage might be full or disabled
    }
  }

  /**
   * Flush error queue when back online
   */
  async flushErrorQueue() {
    const queueToFlush = [...this.errorQueue];
    this.errorQueue = [];
    
    for (const error of queueToFlush) {
      try {
        await this.sendError(error);
        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
      } catch {
        // Re-queue if failed
        this.queueError(error);
        break;
      }
    }
    
    // Clear localStorage
    try {
      localStorage.removeItem('errorQueue');
    } catch {
      // Ignore
    }
  }

  /**
   * Get current page context
   */
  getPageContext() {
    return {
      title: document.title,
      path: globalThis.location.pathname,
      search: globalThis.location.search,
      hash: globalThis.location.hash,
      // React-specific context (if available)
      reactError: this.getReactErrorContext(),
      // Performance context
      performance: this.getPerformanceContext()
    };
  }

  /**
   * Get React error context (if React DevTools available)
   */
  getReactErrorContext() {
    try {
      if (globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        return {
          reactDetected: true,
          version: globalThis.React?.version || 'unknown'
        };
      }
    } catch {
      // Ignore
    }
    return null;
  }

  /**
   * Get performance context
   */
  getPerformanceContext() {
    try {
      if ('performance' in globalThis && globalThis.performance.navigation) {
        return {
          loadTime: globalThis.performance.navigation.loadEventEnd - globalThis.performance.navigation.navigationStart,
          domContentLoaded: globalThis.performance.navigation.domContentLoadedEventEnd - globalThis.performance.navigation.navigationStart,
          type: globalThis.performance.navigation.type
        };
      }
    } catch {
      // Ignore
    }
    return null;
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Manual error logging
   */
  logManualError(message, context = {}, severity = 'medium') {
    this.logError({
      type: 'manual',
      message,
      severity,
      context
    });
  }

  /**
   * Log user action errors
   */
  logUserActionError(action, error, context = {}) {
    this.logError({
      type: 'user_action',
      message: `User action failed: ${action}`,
      action,
      error: error?.message || error,
      stack: error?.stack,
      severity: 'medium',
      context
    });
  }

  /**
   * Log API errors
   */
  logApiError(url, method, status, response, context = {}) {
    this.logError({
      type: 'api_error',
      message: `API call failed: ${method} ${url}`,
      url,
      method,
      status,
      response: typeof response === 'string' ? response.slice(0, 200) : JSON.stringify(response).slice(0, 200),
      severity: status >= 500 ? 'high' : 'medium',
      context
    });
  }
}

// Create singleton instance
let errorLogger = null;

/**
 * Initialize error logger
 */
export function initializeErrorLogger(options = {}) {
  if (!errorLogger) {
    errorLogger = new FrontendErrorLogger(options);
  }
  return errorLogger;
}

/**
 * Get error logger instance
 */
export function getErrorLogger() {
  if (!errorLogger) {
    errorLogger = new FrontendErrorLogger();
  }
  return errorLogger;
}

/**
 * Quick logging functions
 */
export function logError(message, context, severity = 'medium') {
  getErrorLogger().logManualError(message, context, severity);
}

export function logUserActionError(action, error, context) {
  getErrorLogger().logUserActionError(action, error, context);
}

export function logApiError(url, method, status, response, context) {
  getErrorLogger().logApiError(url, method, status, response, context);
}

export default FrontendErrorLogger;