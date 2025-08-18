/**
 * Function específica para logs de desenvolvimento
 * Útil para debugging e troubleshooting em desenvolvimento
 */

const { withLogger } = require('./utils/logger');

async function handler(event, context) {
  const { logger } = context;
  
  logger.info('Dev logger function called');
  
  try {
    const logData = parseRequestData(event, logger);
    
    // Log personalizado baseado no tipo de request
    switch (logData.logType) {
      case 'debug':
        await handleDebugLog(logData, logger);
        break;
        
      case 'error':
        await handleErrorLog(logData, logger);
        break;
        
      case 'performance':
        await handlePerformanceLog(logData, logger);
        break;
        
      case 'test':
        await handleTestLog(logData, logger);
        break;
        
      default:
        await handleGenericLog(logData, logger);
    }
    
    logger.info('Dev log processed successfully', { 
      type: logData.logType,
      source: logData.source 
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Log recorded successfully',
        timestamp: new Date().toISOString(),
        requestId: logger.requestId
      })
    };
    
  } catch (error) {
    logger.error('Dev logger function failed', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Dev logging failed',
        message: error.message
      })
    };
  }
}

/**
 * Parse dos dados da requisição
 */
function parseRequestData(event, logger) {
  const queryParams = event.queryStringParameters || {};
  let bodyData = {};
  
  // Parse do body se existir
  if (event.body) {
    try {
      bodyData = JSON.parse(event.body);
      logger.debug('Request body parsed', { bodyKeys: Object.keys(bodyData) });
    } catch (error) {
      logger.warn('Failed to parse request body', error);
    }
  }
  
  return {
    logType: queryParams.type || bodyData.type || 'generic',
    source: queryParams.source || bodyData.source || 'unknown',
    message: queryParams.message || bodyData.message || 'No message provided',
    data: bodyData.data || queryParams,
    timestamp: Date.now()
  };
}

/**
 * Manipula logs de debug
 */
async function handleDebugLog(logData, logger) {
  logger.debug(`[${logData.source}] ${logData.message}`, {
    debugData: logData.data,
    debugType: 'development'
  });
  
  // Log adicional com contexto de debug
  if (logData.data.component) {
    logger.debug(`Component debug: ${logData.data.component}`, {
      props: logData.data.props,
      state: logData.data.state
    });
  }
}

/**
 * Manipula logs de erro
 */
async function handleErrorLog(logData, logger) {
  const errorInfo = logData.data.error || {};
  
  logger.error(`[${logData.source}] ${logData.message}`, null, {
    errorType: errorInfo.type || 'unknown',
    errorCode: errorInfo.code,
    stackTrace: errorInfo.stack,
    userAgent: logData.data.userAgent,
    url: logData.data.url,
    userId: logData.data.userId
  });
  
  // Se for um erro crítico, log como fatal
  if (errorInfo.severity === 'critical') {
    logger.fatal('Critical error detected', null, {
      source: logData.source,
      errorDetails: errorInfo
    });
  }
}

/**
 * Manipula logs de performance
 */
async function handlePerformanceLog(logData, logger) {
  const perfData = logData.data;
  
  logger.info(`[${logData.source}] Performance: ${logData.message}`, {
    duration: perfData.duration,
    componentName: perfData.component,
    renderTime: perfData.renderTime,
    apiCallTime: perfData.apiCallTime,
    memoryUsage: perfData.memoryUsage,
    performanceType: 'frontend'
  });
  
  // Log de warning se performance está abaixo do esperado
  if (perfData.duration > 3000) { // 3 segundos
    logger.warn('Slow performance detected', {
      duration: perfData.duration,
      threshold: 3000,
      component: perfData.component
    });
  }
}

/**
 * Manipula logs de teste
 */
async function handleTestLog(logData, logger) {
  logger.info(`[TEST] [${logData.source}] ${logData.message}`, {
    testSuite: logData.data.suite,
    testCase: logData.data.testCase,
    testResult: logData.data.result,
    testDuration: logData.data.duration,
    testType: 'automated'
  });
  
  // Log de erro se teste falhou
  if (logData.data.result === 'failed') {
    logger.error('Test failure detected', null, {
      testSuite: logData.data.suite,
      testCase: logData.data.testCase,
      failureReason: logData.data.reason,
      expectedValue: logData.data.expected,
      actualValue: logData.data.actual
    });
  }
}

/**
 * Manipula logs genéricos
 */
async function handleGenericLog(logData, logger) {
  logger.info(`[${logData.source}] ${logData.message}`, {
    logData: logData.data,
    logType: 'generic'
  });
}

exports.handler = withLogger(handler, 'dev-logger');