/**
 * Frontend Error Logger
 * Captura erros do cliente e envia para Netlify Functions para logging centralizado
 */

class FrontendErrorLogger {
  constructor(options = {}) {
    this.functionUrl = options.functionUrl || '/.netlify/functions/error-monitoring/log-error';
    this.enabled = options.enabled !== false && typeof window !== 'undefined';
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
    window.addEventListener('error', (event) => {
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
    window.addEventListener('unhandledrejection', (event) => {
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
    if ('navigator' in window && 'onLine' in navigator) {
      this.isOnline = navigator.onLine;
      
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.flushErrorQueue();
      });
      
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  /**
   * Wrap console.error to capture manual errors
   */
  wrapConsoleError() {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Log to our system
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      this.logError({
        type: 'console_error',
        message: message.substring(0, 500), // Limit size
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
      url: window.location.href,
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
        console.warn('Failed to send error to server:', networkError);
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
    } catch (e) {
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
      } catch (e) {
        // Re-queue if failed
        this.queueError(error);
        break;
      }
    }
    
    // Clear localStorage
    try {
      localStorage.removeItem('errorQueue');
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Get current page context
   */
  getPageContext() {
    return {
      title: document.title,
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
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
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        return {
          reactDetected: true,
          version: window.React?.version || 'unknown'
        };
      }
    } catch (e) {
      // Ignore
    }
    return null;
  }

  /**
   * Get performance context
   */
  getPerformanceContext() {
    try {
      if ('performance' in window && window.performance.navigation) {
        return {
          loadTime: window.performance.navigation.loadEventEnd - window.performance.navigation.navigationStart,
          domContentLoaded: window.performance.navigation.domContentLoadedEventEnd - window.performance.navigation.navigationStart,
          type: window.performance.navigation.type
        };
      }
    } catch (e) {
      // Ignore
    }
    return null;
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      response: typeof response === 'string' ? response.substring(0, 200) : JSON.stringify(response).substring(0, 200),
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