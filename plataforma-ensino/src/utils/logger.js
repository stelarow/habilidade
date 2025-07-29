/**
 * Structured Logger Utility
 * Provides comprehensive logging with different levels and context capture
 */

// Log levels configuration
const LOG_LEVELS = {
  DEBUG: { level: 0, name: 'DEBUG', color: '#6366f1' },
  INFO: { level: 1, name: 'INFO', color: '#10b981' },
  WARN: { level: 2, name: 'WARN', color: '#f59e0b' },
  ERROR: { level: 3, name: 'ERROR', color: '#ef4444' },
  CRITICAL: { level: 4, name: 'CRITICAL', color: '#dc2626' }
};

// Logger configuration
const LOGGER_CONFIG = {
  minLevel: process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO.level : LOG_LEVELS.DEBUG.level,
  maxLogEntries: 1000,
  enableConsole: true,
  enableStorage: true,
  enableRemote: process.env.NODE_ENV === 'production',
  contextCapture: {
    userAgent: true,
    url: true,
    timestamp: true,
    sessionId: true,
    userId: true,
    performance: true
  }
};

export class Logger {
  constructor() {
    this.logs = [];
    this.sessionId = this.generateSessionId();
    this.listeners = new Set();
    this.performanceStartTimes = new Map();
    
    // Setup automatic cleanup
    this.setupCleanup();
    
    // Setup error tracking
    this.setupErrorTracking();
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Setup automatic log cleanup
  setupCleanup() {
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Setup global error tracking
  setupErrorTracking() {
    if (typeof window !== 'undefined') {
      // Track unhandled errors
      window.addEventListener('error', (event) => {
        this.error('Unhandled Error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          type: 'javascript_error'
        });
      });

      // Track unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled Promise Rejection', {
          reason: event.reason,
          promise: event.promise,
          type: 'promise_rejection'
        });
      });

      // Track console errors (wrap console.error)
      const originalConsoleError = console.error;
      console.error = (...args) => {
        this.error('Console Error', {
          args: args,
          type: 'console_error'
        });
        originalConsoleError.apply(console, args);
      };
    }
  }

  // Create log entry with full context
  createLogEntry(level, message, data = {}, context = {}) {
    const timestamp = new Date().toISOString();
    const logLevel = Object.values(LOG_LEVELS).find(l => l.level === level) || LOG_LEVELS.INFO;
    
    // Capture context information
    const capturedContext = this.captureContext();
    
    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      level: logLevel.level,
      levelName: logLevel.name,
      message,
      data: this.sanitizeData(data),
      context: {
        ...capturedContext,
        ...context
      },
      sessionId: this.sessionId
    };

    return logEntry;
  }

  // Capture current context information
  captureContext() {
    const context = {};

    if (typeof window !== 'undefined' && LOGGER_CONFIG.contextCapture) {
      if (LOGGER_CONFIG.contextCapture.userAgent) {
        context.userAgent = navigator.userAgent;
      }
      
      if (LOGGER_CONFIG.contextCapture.url) {
        context.url = window.location.href;
        context.pathname = window.location.pathname;
      }
      
      if (LOGGER_CONFIG.contextCapture.performance) {
        context.performance = {
          memory: performance.memory ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
          } : null,
          timing: {
            navigationStart: performance.timing?.navigationStart,
            loadEventEnd: performance.timing?.loadEventEnd,
            domContentLoadedEventEnd: performance.timing?.domContentLoadedEventEnd
          }
        };
      }
    }

    return context;
  }

  // Sanitize data to prevent circular references and sensitive information
  sanitizeData(data) {
    try {
      // Handle circular references
      const seen = new WeakSet();
      const sanitized = JSON.parse(JSON.stringify(data, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular Reference]';
          }
          seen.add(value);
        }
        
        // Remove sensitive information
        const sensitiveKeys = ['password', 'token', 'key', 'secret', 'authorization'];
        if (typeof key === 'string' && sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
          return '[REDACTED]';
        }
        
        return value;
      }));
      
      return sanitized;
    } catch (error) {
      return { error: 'Failed to sanitize data', original: String(data) };
    }
  }

  // Core logging method
  log(level, message, data = {}, context = {}) {
    // Check if level meets minimum threshold
    if (level < LOGGER_CONFIG.minLevel) {
      return;
    }

    const logEntry = this.createLogEntry(level, message, data, context);
    
    // Store log entry
    this.logs.push(logEntry);
    
    // Console output
    if (LOGGER_CONFIG.enableConsole) {
      this.outputToConsole(logEntry);
    }
    
    // Persist to storage
    if (LOGGER_CONFIG.enableStorage) {
      this.persistToStorage(logEntry);
    }
    
    // Send to remote service
    if (LOGGER_CONFIG.enableRemote) {
      this.sendToRemote(logEntry);
    }
    
    // Notify listeners
    this.notifyListeners(logEntry);
    
    // Automatic cleanup if needed
    if (this.logs.length > LOGGER_CONFIG.maxLogEntries) {
      this.cleanup();
    }
  }

  // Debug level logging
  debug(message, data = {}, context = {}) {
    this.log(LOG_LEVELS.DEBUG.level, message, data, context);
  }

  // Info level logging
  info(message, data = {}, context = {}) {
    this.log(LOG_LEVELS.INFO.level, message, data, context);
  }

  // Warning level logging
  warn(message, data = {}, context = {}) {
    this.log(LOG_LEVELS.WARN.level, message, data, context);
  }

  // Error level logging
  error(message, data = {}, context = {}) {
    this.log(LOG_LEVELS.ERROR.level, message, data, context);
  }

  // Critical level logging
  critical(message, data = {}, context = {}) {
    this.log(LOG_LEVELS.CRITICAL.level, message, data, context);
  }

  // API error logging
  apiError(endpoint, method, status, responseData = {}, requestData = {}) {
    this.error('API Error', {
      endpoint,
      method,
      status,
      response: responseData,
      request: requestData,
      type: 'api_error'
    });
  }

  // User action logging
  userAction(action, details = {}) {
    this.info('User Action', {
      action,
      details,
      type: 'user_action'
    });
  }

  // Performance logging
  startPerformanceTimer(label) {
    this.performanceStartTimes.set(label, performance.now());
  }

  endPerformanceTimer(label, data = {}) {
    const startTime = this.performanceStartTimes.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.performanceStartTimes.delete(label);
      
      this.info('Performance Measurement', {
        label,
        duration: Math.round(duration),
        ...data,
        type: 'performance'
      });
      
      return duration;
    }
    return null;
  }

  // Component lifecycle logging
  componentMount(componentName, props = {}) {
    this.debug('Component Mounted', {
      component: componentName,
      props: this.sanitizeData(props),
      type: 'component_lifecycle'
    });
  }

  componentUnmount(componentName) {
    this.debug('Component Unmounted', {
      component: componentName,
      type: 'component_lifecycle'
    });
  }

  // Output to console with formatting
  outputToConsole(logEntry) {
    const { levelName, message, data, timestamp } = logEntry;
    const logLevel = Object.values(LOG_LEVELS).find(l => l.name === levelName);
    const color = logLevel?.color || '#666';
    
    const timeString = new Date(timestamp).toLocaleTimeString();
    
    console.group(`%c[${levelName}] ${timeString} - ${message}`, `color: ${color}; font-weight: bold;`);
    
    if (Object.keys(data).length > 0) {
      console.log('Data:', data);
    }
    
    if (Object.keys(logEntry.context).length > 0) {
      console.log('Context:', logEntry.context);
    }
    
    console.groupEnd();
  }

  // Persist to local storage
  persistToStorage(logEntry) {
    if (typeof window === 'undefined') return;
    
    try {
      const storageKey = `app_logs_${new Date().toDateString()}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.push(logEntry);
      
      // Keep only last 100 entries per day to prevent storage overflow
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (error) {
      console.warn('Failed to persist log to storage:', error);
    }
  }

  // Send to remote logging service
  async sendToRemote(logEntry) {
    if (typeof window === 'undefined') return;
    
    try {
      // Only send warnings and errors to remote service
      if (logEntry.level < LOG_LEVELS.WARN.level) {
        return;
      }
      
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      console.warn('Failed to send log to remote service:', error);
    }
  }

  // Add log listener
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify listeners
  notifyListeners(logEntry) {
    this.listeners.forEach(callback => {
      try {
        callback(logEntry);
      } catch (error) {
        console.error('Log listener error:', error);
      }
    });
  }

  // Get logs with optional filtering
  getLogs(filter = {}) {
    let filteredLogs = [...this.logs];
    
    if (filter.level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level >= filter.level);
    }
    
    if (filter.type) {
      filteredLogs = filteredLogs.filter(log => log.data.type === filter.type);
    }
    
    if (filter.since) {
      const sinceTime = new Date(filter.since).getTime();
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp).getTime() >= sinceTime);
    }
    
    if (filter.limit) {
      filteredLogs = filteredLogs.slice(-filter.limit);
    }
    
    return filteredLogs;
  }

  // Get logs from storage
  getStoredLogs(date = new Date()) {
    if (typeof window === 'undefined') return [];
    
    try {
      const storageKey = `app_logs_${date.toDateString()}`;
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (error) {
      console.warn('Failed to retrieve stored logs:', error);
      return [];
    }
  }

  // Export logs as JSON
  exportLogs(filter = {}) {
    const logs = this.getLogs(filter);
    const exportData = {
      sessionId: this.sessionId,
      exportTimestamp: new Date().toISOString(),
      logsCount: logs.length,
      logs
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.info('Logs cleared');
  }

  // Cleanup old logs
  cleanup() {
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const cutoff = Date.now() - maxAge;
    
    const oldCount = this.logs.length;
    this.logs = this.logs.filter(log => new Date(log.timestamp).getTime() > cutoff);
    
    if (this.logs.length < oldCount) {
      this.debug('Log cleanup completed', {
        removedCount: oldCount - this.logs.length,
        remainingCount: this.logs.length
      });
    }
  }

  // Get logger statistics
  getStats() {
    const levels = {};
    const types = {};
    
    this.logs.forEach(log => {
      levels[log.levelName] = (levels[log.levelName] || 0) + 1;
      if (log.data.type) {
        types[log.data.type] = (types[log.data.type] || 0) + 1;
      }
    });
    
    return {
      totalLogs: this.logs.length,
      sessionId: this.sessionId,
      levels,
      types,
      oldestLog: this.logs.length > 0 ? this.logs[0].timestamp : null,
      newestLog: this.logs.length > 0 ? this.logs[this.logs.length - 1].timestamp : null
    };
  }
}

// Singleton instance
export const logger = new Logger();

// Convenience exports
export const { debug, info, warn, error, critical, apiError, userAction } = logger;

export default logger;