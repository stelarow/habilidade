/**
 * Function dedicada para monitoramento de erros e métricas de produção
 * Centraliza logs críticos e fornece endpoints para debugging
 */

const { withProductionLogger } = require('./utils/production-logger');

async function handler(event, context) {
  const { logger } = context;
  
  logger.setBusinessContext('error_monitoring', 'logging_system', 'production_monitoring');
  
  const { httpMethod, path } = event;
  const operation = extractOperation(path);
  
  switch (operation) {
    case 'health':
      return handleHealthCheck(event, context);
    
    case 'log-error':
      return handleErrorLogging(event, context);
    
    case 'metrics':
      return handleMetricsCollection(event, context);
    
    case 'debug-request':
      return handleDebugRequest(event, context);
    
    default:
      return handleInvalidOperation(event, context);
  }
}

/**
 * Health check com métricas detalhadas
 */
async function handleHealthCheck(event, context) {
  const { logger } = context;
  
  logger.markPerformance('health_check_start');
  
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    function: 'error-monitoring',
    environment: process.env.NODE_ENV || 'production',
    
    // System metrics
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      usage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
    },
    
    uptime: Math.round(process.uptime()),
    nodeVersion: process.version,
    platform: process.platform,
    
    // Request info
    requestId: logger.requestId,
    userAgent: event.headers['user-agent']?.substring(0, 50),
    
    // Performance markers
    responseTime: null // Will be calculated
  };
  
  logger.markPerformance('health_check_end');
  healthData.responseTime = Date.now() - logger.performanceMarks.health_check_start.timestamp;
  
  logger.info('Health check completed', {
    healthCheck: true,
    status: healthData.status,
    memoryUsage: healthData.memory.usage,
    responseTime: healthData.responseTime,
    searchTag: 'health_check'
  });
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(healthData, null, 2)
  };
}

/**
 * Endpoint para logging de erros do frontend
 */
async function handleErrorLogging(event, context) {
  const { logger } = context;
  
  if (event.httpMethod !== 'POST') {
    logger.securityEvent('invalid_method_error_endpoint', {
      method: event.httpMethod,
      expected: 'POST'
    });
    
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const errorData = JSON.parse(event.body);
    
    // Log error from frontend
    logger.errorWithFullContext(
      'Frontend error reported',
      new Error(errorData.message || 'Unknown frontend error'),
      event,
      {
        frontendError: true,
        errorType: errorData.type || 'javascript',
        url: errorData.url,
        line: errorData.line,
        column: errorData.column,
        stack: errorData.stack,
        userAgent: event.headers['user-agent'],
        timestamp: errorData.timestamp,
        severity: errorData.severity || 'medium'
      }
    );
    
    logger.userAction('error_reported', {
      errorType: errorData.type,
      errorMessage: errorData.message?.substring(0, 100),
      url: errorData.url
    }, 'error');
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Error logged successfully',
        requestId: logger.requestId
      })
    };
    
  } catch (parseError) {
    logger.errorWithFullContext(
      'Failed to parse frontend error report',
      parseError,
      event,
      { frontendErrorLogging: true }
    );
    
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Invalid error data format',
        requestId: logger.requestId
      })
    };
  }
}

/**
 * Coleta de métricas de sistema
 */
async function handleMetricsCollection(event, context) {
  const { logger } = context;
  
  logger.markPerformance('metrics_collection_start');
  
  const metrics = {
    timestamp: new Date().toISOString(),
    
    // Memory metrics
    memory: {
      heapUsed: process.memoryUsage().heapUsed,
      heapTotal: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external,
      rss: process.memoryUsage().rss
    },
    
    // Process metrics
    process: {
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      version: process.version,
      platform: process.platform,
      arch: process.arch
    },
    
    // Function metrics
    function: {
      name: 'error-monitoring',
      requestId: logger.requestId,
      executionTime: Date.now() - logger.startTime
    },
    
    // Request metrics
    request: {
      method: event.httpMethod,
      userAgent: event.headers['user-agent']?.substring(0, 100),
      contentLength: event.headers['content-length'],
      referer: event.headers['referer']
    }
  };
  
  logger.markPerformance('metrics_collection_end');
  
  logger.info('System metrics collected', {
    metricsCollection: true,
    memoryUsage: metrics.memory.heapUsed,
    uptime: metrics.process.uptime,
    searchTag: 'system_metrics'
  });
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metrics, null, 2)
  };
}

/**
 * Debug request - para troubleshooting específico
 */
async function handleDebugRequest(event, context) {
  const { logger } = context;
  
  // Captura máximo context para debugging
  const debugInfo = {
    timestamp: new Date().toISOString(),
    requestId: logger.requestId,
    
    // Event details
    event: {
      httpMethod: event.httpMethod,
      path: event.path,
      queryStringParameters: event.queryStringParameters,
      headers: sanitizeHeaders(event.headers),
      body: event.body?.substring(0, 500), // First 500 chars
      isBase64Encoded: event.isBase64Encoded
    },
    
    // Context details
    context: {
      functionName: context.functionName,
      functionVersion: context.functionVersion,
      memoryLimitInMB: context.memoryLimitInMB,
      remainingTimeInMillis: context.getRemainingTimeInMillis()
    },
    
    // Environment
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    }
  };
  
  logger.info('Debug request processed', {
    debugRequest: true,
    requestMethod: event.httpMethod,
    hasBody: !!event.body,
    remainingTime: context.getRemainingTimeInMillis(),
    searchTag: 'debug_request'
  });
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(debugInfo, null, 2)
  };
}

/**
 * Handle invalid operations
 */
async function handleInvalidOperation(event, context) {
  const { logger } = context;
  
  logger.securityEvent('invalid_operation_attempt', {
    path: event.path,
    method: event.httpMethod,
    userAgent: event.headers['user-agent']?.substring(0, 50)
  }, 'low');
  
  return {
    statusCode: 404,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: 'Operation not found',
      available: ['health', 'log-error', 'metrics', 'debug-request'],
      requestId: logger.requestId
    })
  };
}

/**
 * Extract operation from path
 */
function extractOperation(path) {
  if (!path) return null;
  
  // Extract last segment from path
  const segments = path.split('/').filter(Boolean);
  return segments[segments.length - 1] || null;
}

/**
 * Sanitize headers for logging
 */
function sanitizeHeaders(headers) {
  const sensitive = ['authorization', 'cookie', 'x-api-key'];
  const sanitized = {};
  
  Object.keys(headers || {}).forEach(key => {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = headers[key];
    }
  });
  
  return sanitized;
}

exports.handler = withProductionLogger(handler, 'error-monitoring');