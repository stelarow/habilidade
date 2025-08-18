/**
 * Utilitário de logging avançado para Netlify Functions
 * Baseado na documentação oficial: https://docs.netlify.com/build/functions/logs/
 */

// Níveis de log disponíveis
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

// Mapeamento de níveis para cores (para desenvolvimento local)
const LOG_COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[32m',  // Green
  WARN: '\x1b[33m',  // Yellow
  ERROR: '\x1b[31m', // Red
  FATAL: '\x1b[35m'  // Magenta
};

const RESET_COLOR = '\x1b[0m';

/**
 * Gera um ID único para rastreamento de requests
 */
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitiza dados sensíveis antes do logging
 */
function sanitizeData(data) {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization', 'cookie'];
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

/**
 * Formata o log de acordo com o ambiente (desenvolvimento vs produção)
 */
function formatLog(level, message, context = {}, requestId = null) {
  const timestamp = new Date().toISOString();
  const isProduction = process.env.NODE_ENV === 'production';
  
  const logData = {
    timestamp,
    level,
    message,
    ...(requestId && { requestId }),
    ...sanitizeData(context)
  };
  
  if (isProduction) {
    // Em produção, use JSON estruturado para melhor análise
    return JSON.stringify(logData);
  } else {
    // Em desenvolvimento, use formato colorido para melhor legibilidade
    const color = LOG_COLORS[level] || '';
    const levelPadded = level.padEnd(5);
    const contextStr = Object.keys(context).length > 0 
      ? ` | ${JSON.stringify(sanitizeData(context))}` 
      : '';
    const requestIdStr = requestId ? ` [${requestId}]` : '';
    
    return `${color}${timestamp} [${levelPadded}]${RESET_COLOR}${requestIdStr} ${message}${contextStr}`;
  }
}

/**
 * Classe principal do Logger
 */
class Logger {
  constructor(functionName = 'unknown', requestId = null) {
    this.functionName = functionName;
    this.requestId = requestId || generateRequestId();
    this.startTime = Date.now();
  }
  
  /**
   * Log de debug - apenas em desenvolvimento
   */
  debug(message, context = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatLog('DEBUG', message, { 
        ...context, 
        function: this.functionName 
      }, this.requestId));
    }
  }
  
  /**
   * Log informativo
   */
  info(message, context = {}) {
    console.log(formatLog('INFO', message, { 
      ...context, 
      function: this.functionName 
    }, this.requestId));
  }
  
  /**
   * Log de aviso
   */
  warn(message, context = {}) {
    console.warn(formatLog('WARN', message, { 
      ...context, 
      function: this.functionName 
    }, this.requestId));
  }
  
  /**
   * Log de erro
   */
  error(message, error = null, context = {}) {
    const errorContext = error ? {
      error: error.message,
      stack: error.stack,
      ...(error.code && { code: error.code })
    } : {};
    
    console.error(formatLog('ERROR', message, { 
      ...context, 
      ...errorContext,
      function: this.functionName 
    }, this.requestId));
  }
  
  /**
   * Log crítico/fatal
   */
  fatal(message, error = null, context = {}) {
    const errorContext = error ? {
      error: error.message,
      stack: error.stack,
      ...(error.code && { code: error.code })
    } : {};
    
    console.error(formatLog('FATAL', message, { 
      ...context, 
      ...errorContext,
      function: this.functionName 
    }, this.requestId));
  }
  
  /**
   * Log de performance - tempo de execução
   */
  performance(message, context = {}) {
    const executionTime = Date.now() - this.startTime;
    this.info(`${message} - Execution time: ${executionTime}ms`, {
      ...context,
      executionTime,
      performance: true
    });
  }
  
  /**
   * Log de request HTTP
   */
  logRequest(event) {
    const { httpMethod, path, headers, queryStringParameters } = event;
    
    this.info('Incoming request', {
      method: httpMethod,
      path,
      userAgent: headers['user-agent'],
      referer: headers['referer'],
      queryParams: sanitizeData(queryStringParameters || {}),
      requestType: 'incoming'
    });
  }
  
  /**
   * Log de response HTTP
   */
  logResponse(statusCode, body = null) {
    const bodySize = body ? JSON.stringify(body).length : 0;
    
    this.info('Outgoing response', {
      statusCode,
      bodySize,
      responseType: 'outgoing'
    });
  }
  
  /**
   * Log de erro de validação
   */
  validationError(field, value, rule) {
    this.warn('Validation failed', {
      field,
      value: typeof value,
      rule,
      validationType: 'input'
    });
  }
  
  /**
   * Log de integração externa (APIs, serviços)
   */
  externalCall(service, endpoint, method = 'GET', duration = null) {
    this.info(`External API call: ${service}`, {
      service,
      endpoint,
      method,
      ...(duration && { duration }),
      callType: 'external'
    });
  }
}

/**
 * Factory function para criar loggers
 */
function createLogger(functionName, requestId = null) {
  return new Logger(functionName, requestId);
}

/**
 * Middleware para adicionar logger automaticamente ao context
 */
function withLogger(handler, functionName) {
  return async (event, context) => {
    const logger = createLogger(functionName);
    
    // Log da requisição incoming
    logger.logRequest(event);
    
    try {
      // Adiciona logger ao context
      context.logger = logger;
      
      // Executa o handler
      const result = await handler(event, context);
      
      // Log da resposta
      if (result && result.statusCode) {
        logger.logResponse(result.statusCode, result.body);
      }
      
      // Log de performance final
      logger.performance('Function completed successfully');
      
      return result;
    } catch (error) {
      logger.error('Function execution failed', error);
      logger.performance('Function completed with error');
      throw error;
    }
  };
}

module.exports = {
  Logger,
  createLogger,
  withLogger,
  LOG_LEVELS,
  generateRequestId
};