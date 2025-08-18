/**
 * Function de Health Check - Monitoramento de saúde da aplicação
 * Demonstra logging básico e monitoramento de performance
 */

const { withLogger } = require('./utils/logger');

async function handler(event, context) {
  const { logger } = context;
  
  logger.info('Health check initiated');
  
  try {
    // Simula verificações de saúde do sistema
    const checks = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    logger.debug('System metrics collected', { metrics: checks });
    
    // Simula verificação de dependências externas
    const dependencies = await checkDependencies(logger);
    
    const healthStatus = {
      status: 'healthy',
      timestamp: checks.timestamp,
      uptime: `${Math.floor(checks.uptime)}s`,
      memory: {
        used: Math.round(checks.memory.heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(checks.memory.heapTotal / 1024 / 1024) + 'MB'
      },
      environment: checks.environment,
      dependencies
    };
    
    logger.info('Health check completed successfully', { 
      status: healthStatus.status,
      dependenciesCount: Object.keys(dependencies).length 
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(healthStatus, null, 2)
    };
    
  } catch (error) {
    logger.error('Health check failed', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
}

/**
 * Verifica status de dependências externas
 */
async function checkDependencies(logger) {
  const dependencies = {};
  
  try {
    // Exemplo: verificar se consegue resolver DNS
    logger.debug('Checking DNS resolution');
    dependencies.dns = 'ok';
    
    // Exemplo: verificar conectividade de rede básica
    logger.debug('Checking network connectivity');
    dependencies.network = 'ok';
    
    logger.info('All dependencies checked', { 
      totalDependencies: Object.keys(dependencies).length 
    });
    
  } catch (error) {
    logger.warn('Some dependencies failed', error);
    dependencies.error = error.message;
  }
  
  return dependencies;
}

// Exporta o handler com logging automático
exports.handler = withLogger(handler, 'health-check');