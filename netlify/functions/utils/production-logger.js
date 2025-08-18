/**
 * Enhanced Production Logger para Netlify Functions
 * Focado em debugging detalhado em produção via Netlify Dashboard
 */

const { Logger, formatLog, sanitizeData } = require('./logger');

/**
 * Enhanced Logger com context completo para produção
 */
class ProductionLogger extends Logger {
  constructor(functionName, requestId = null) {
    super(functionName, requestId);
    this.userContext = {};
    this.businessContext = {};
    this.performanceMarks = {};
  }

  /**
   * Captura context do usuário para debugging
   */
  setUserContext(userAgent, ip, referer, sessionData = {}) {
    this.userContext = {
      userAgent: userAgent?.substring(0, 100) || 'unknown',
      ip: ip || 'unknown', 
      referer: referer || 'direct',
      timestamp: new Date().toISOString(),
      ...sanitizeData(sessionData)
    };
    
    this.debug('User context captured', this.userContext);
  }

  /**
   * Captura context de negócio
   */
  setBusinessContext(operation, module, feature = null) {
    this.businessContext = {
      operation,
      module, 
      feature,
      businessFlow: true
    };
    
    this.debug('Business context set', this.businessContext);
  }

  /**
   * Log de erro com máximo context para debugging
   */
  errorWithFullContext(message, error, event, additionalContext = {}) {
    const errorDetails = {
      // Error specifics
      errorName: error?.name || 'UnknownError',
      errorMessage: error?.message || message,
      errorCode: error?.code,
      errorStack: error?.stack?.split('\n').slice(0, 5).join('\\n'), // Primeiras 5 linhas
      
      // Request context
      httpMethod: event?.httpMethod,
      path: event?.path,
      queryParams: sanitizeData(event?.queryStringParameters || {}),
      headers: this._sanitizeHeaders(event?.headers || {}),
      
      // User context
      ...this.userContext,
      
      // Business context  
      ...this.businessContext,
      
      // Function context
      functionName: this.functionName,
      requestId: this.requestId,
      executionTime: Date.now() - this.startTime,
      memoryUsage: process.memoryUsage().heapUsed,
      
      // Debug helpers
      debugInfo: true,
      severity: 'high',
      requiresInvestigation: true,
      
      // Additional context
      ...sanitizeData(additionalContext)
    };

    console.error(formatLog('ERROR', `[PRODUCTION ERROR] ${message}`, errorDetails, this.requestId));
    
    // Log separado para facilitar busca
    this.error('Production error logged', null, { 
      productionError: true,
      errorId: this.requestId,
      quickSearch: `prod_error_${this.functionName}` 
    });
  }

  /**
   * Log de business logic error com context
   */
  businessError(errorType, message, context = {}, severity = 'medium') {
    this.error(`Business Error [${errorType}]: ${message}`, null, {
      businessError: true,
      errorType,
      severity,
      ...this.businessContext,
      ...sanitizeData(context),
      searchTag: `business_${errorType}`
    });
  }

  /**
   * Log de validation error detalhado
   */
  validationErrorDetailed(field, value, rule, userInput = {}) {
    this.warn('Validation failed with user context', {
      validationError: true,
      field,
      valueType: typeof value,
      valueLength: typeof value === 'string' ? value.length : 'N/A',
      rule,
      userInput: sanitizeData(userInput),
      ...this.userContext,
      searchTag: `validation_${field}`
    });
  }

  /**
   * Performance mark para tracking detalhado
   */
  markPerformance(operation, startTime = null) {
    const now = Date.now();
    const duration = startTime ? now - startTime : null;
    
    this.performanceMarks[operation] = {
      timestamp: now,
      duration
    };
    
    this.info(`Performance Mark: ${operation}`, {
      operation,
      duration,
      performance: true,
      performanceMark: operation,
      searchTag: `perf_${operation}`
    });
  }

  /**
   * Log de external API call com retry info
   */
  externalAPICall(service, endpoint, method, duration, attempt = 1, success = true) {
    this.info(`External API: ${service}${endpoint}`, {
      externalCall: true,
      service,
      endpoint,
      method,
      duration,
      attempt,
      success,
      ...this.businessContext,
      searchTag: `api_${service}`
    });
    
    if (!success) {
      this.warn('External API call failed', {
        apiFailure: true,
        service,
        endpoint,
        attempt,
        requiresMonitoring: true
      });
    }
  }

  /**
   * Log de user action para behavioral analysis
   */
  userAction(action, details = {}, outcome = 'success') {
    this.info(`User Action: ${action}`, {
      userAction: true,
      action,
      outcome,
      ...this.userContext,
      ...sanitizeData(details),
      searchTag: `user_${action}`
    });
  }

  /**
   * Log de security event
   */
  securityEvent(eventType, details = {}, severity = 'medium') {
    this.warn(`Security Event: ${eventType}`, {
      securityEvent: true,
      eventType,
      severity,
      ...this.userContext,
      ...sanitizeData(details),
      requiresReview: severity === 'high',
      searchTag: `security_${eventType}`
    });
  }

  /**
   * Summary log para final da execução
   */
  executionSummary(success = true, additionalMetrics = {}) {
    const summary = {
      executionSummary: true,
      success,
      totalDuration: Date.now() - this.startTime,
      memoryPeak: process.memoryUsage().heapUsed,
      functionName: this.functionName,
      requestId: this.requestId,
      performanceMarks: Object.keys(this.performanceMarks).length,
      ...additionalMetrics,
      searchTag: `summary_${this.functionName}`
    };
    
    if (success) {
      this.info('Execution completed successfully', summary);
    } else {
      this.error('Execution completed with errors', null, summary);
    }
  }

  /**
   * Sanitiza headers removendo dados sensíveis
   */
  _sanitizeHeaders(headers) {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    const sanitized = {};
    
    Object.keys(headers).forEach(key => {
      if (sensitiveHeaders.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = headers[key];
      }
    });
    
    return sanitized;
  }
}

/**
 * Middleware enhanced para produção
 */
function withProductionLogger(handler, functionName) {
  return async (event, context) => {
    const logger = new ProductionLogger(functionName);
    
    // Captura context do usuário automaticamente
    logger.setUserContext(
      event.headers['user-agent'],
      event.headers['x-forwarded-for'],
      event.headers['referer']
    );
    
    // Log da requisição com context completo
    logger.info('Production request received', {
      productionRequest: true,
      method: event.httpMethod,
      path: event.path,
      hasBody: !!event.body,
      searchTag: `req_${functionName}`
    });
    
    try {
      // Adiciona logger ao context
      context.logger = logger;
      context.productionLogger = logger; // Alias explícito
      
      // Mark início da execução
      logger.markPerformance('handler_start', logger.startTime);
      
      // Executa handler
      const result = await handler(event, context);
      
      // Mark fim da execução  
      logger.markPerformance('handler_end');
      
      // Log da resposta
      if (result?.statusCode) {
        logger.info('Production response sent', {
          statusCode: result.statusCode,
          hasBody: !!result.body,
          success: result.statusCode < 400,
          searchTag: `res_${functionName}`
        });
      }
      
      // Summary final
      logger.executionSummary(true, {
        statusCode: result?.statusCode,
        responseSize: result?.body ? result.body.length : 0
      });
      
      return result;
      
    } catch (error) {
      // Log erro com máximo context
      logger.errorWithFullContext(
        'Function execution failed', 
        error, 
        event, 
        { 
          handlerError: true,
          criticalFailure: true 
        }
      );
      
      // Summary de erro
      logger.executionSummary(false, {
        errorName: error.name,
        errorMessage: error.message
      });
      
      // Re-throw para manter comportamento
      throw error;
    }
  };
}

/**
 * Helper para criar logger standalone
 */
function createProductionLogger(functionName, requestId = null) {
  return new ProductionLogger(functionName, requestId);
}

module.exports = {
  ProductionLogger,
  withProductionLogger,
  createProductionLogger
};