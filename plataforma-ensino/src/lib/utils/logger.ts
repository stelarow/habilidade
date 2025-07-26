/**
 * Development-safe logging utility
 * Replaces console statements throughout the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  userId?: string;
  action?: string;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${JSON.stringify(context)}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    // Only log in development environment
    if (!this.isDevelopment) return false;
    
    // In development, log everything
    return true;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      // eslint-disable-next-line no-console
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorInfo = error instanceof Error ? { 
        message: error.message, 
        stack: error.stack 
      } : error;
      
      const fullContext = { ...context, error: errorInfo };
      
      // eslint-disable-next-line no-console
      console.error(this.formatMessage('error', message, fullContext));
    }
  }

  // For production error reporting (Sentry integration)
  reportError(message: string, error?: Error | unknown, context?: LogContext): void {
    // TODO: Integrate with Sentry for production error reporting
    // For now, just log in development
    this.error(message, error, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports for common patterns
export const logDebug = logger.debug.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logError = logger.error.bind(logger);
export const reportError = logger.reportError.bind(logger);