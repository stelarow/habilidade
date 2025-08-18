# 📊 Guia Completo: Logs Detalhados em Produção (Netlify Functions)

## 🎯 Objetivo

Implementar sistema robusto de logging para capturar erros detalhados e métricas em produção, facilitando debugging e monitoramento via Netlify Dashboard.

## 📍 Onde Visualizar Logs em Produção

### 1. **Netlify Dashboard** (Método Principal)
```
https://app.netlify.com → Seu Site → Logs → Functions
```

**Funcionalidades Disponíveis:**
- ✅ **Real-time**: Logs ao vivo conforme execução
- ✅ **Filtros de Tempo**: Last hour, day, 7 days, custom range
- ✅ **Filtros de Texto**: Buscar por "ERROR", request ID, function name
- ✅ **Níveis de Log**: INFO, ERROR, WARN, FATAL, DEBUG
- ✅ **Retenção**: 24h (plano free), 7 dias (plano pago)

### 2. **Estratégias de Filtro para Debugging**
```javascript
// No campo "Text filter" do Netlify Dashboard:
"ERROR"           // Apenas erros
"req-abc123"      // Rastrear request específica
"contact_"        // Todas submissões de contato
"ValidationError" // Erros de validação
"performance"     // Métricas de performance
"external"        // Chamadas para APIs externas
```

## 🔧 Sistema de Logging Atual (Funcional)

### Estrutura Implementada
```
netlify/functions/
├── utils/logger.js          # Sistema de logging avançado
├── contact-handler.js       # Exemplo com logs detalhados
├── dev-logger.js           # Function dedicada para logs
├── health-check.js         # Monitoramento básico
└── blog-analytics.js       # Analytics e métricas
```

### Logger Features Disponíveis
```javascript
const { logger } = context; // Automaticamente disponível

// Tipos de log
logger.debug("Debug info", { data });        // Só em desenvolvimento
logger.info("Info message", { context });    // Informacional
logger.warn("Warning", { details });         // Avisos
logger.error("Error", error, { context });   // Erros
logger.fatal("Critical", error, { context }); // Críticos

// Logs especializados
logger.performance("Operation completed");     // Métricas de tempo
logger.validationError(field, value, rule);  // Erros de validação
logger.externalCall(service, endpoint, method, duration); // APIs externas
logger.logRequest(event);                     // Request HTTP
logger.logResponse(statusCode, body);         // Response HTTP
```

## 🚀 Melhorias para Logs Mais Detalhados

### 1. Enhanced Error Context Logger
```javascript
// Adicionar em netlify/functions/utils/enhanced-logger.js
class EnhancedLogger extends Logger {
  /**
   * Log de erro com context completo para debugging
   */
  errorWithContext(message, error, event, additionalContext = {}) {
    const fullContext = {
      // Request context
      userAgent: event.headers['user-agent'],
      referer: event.headers['referer'] || 'direct',
      ip: event.headers['x-forwarded-for'] || 'unknown',
      timestamp: new Date().toISOString(),
      
      // Error details
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      
      // Function context
      functionName: this.functionName,
      requestId: this.requestId,
      executionTime: Date.now() - this.startTime,
      
      // Additional context
      ...additionalContext
    };
    
    console.error(formatLog('ERROR', message, fullContext, this.requestId));
  }
  
  /**
   * Log de user action para tracking
   */
  userAction(action, details = {}) {
    this.info(`User Action: ${action}`, {
      action,
      ...details,
      actionType: 'user_interaction',
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Log de business logic errors
   */
  businessError(type, message, context = {}) {
    this.error(`Business Logic Error: ${type}`, null, {
      errorType: type,
      businessLogic: true,
      ...context
    });
  }
}
```

### 2. Global Error Handler
```javascript
// Adicionar em todas as functions
function globalErrorHandler(error, event, context, logger) {
  // Captura erros não tratados
  logger.errorWithContext('Unhandled error in function', error, event, {
    errorCaught: 'global_handler',
    severity: 'critical'
  });
  
  // Notifica sistema de monitoramento (opcional)
  if (process.env.NODE_ENV === 'production') {
    sendErrorNotification(error, event, context);
  }
  
  return {
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: true,
      message: 'Internal server error',
      requestId: logger.requestId // Para usuário rastrear
    })
  };
}
```

### 3. Request Correlation System
```javascript
// Sistema para rastrear requests relacionadas
class CorrelationLogger extends EnhancedLogger {
  constructor(functionName, correlationId = null) {
    super(functionName);
    this.correlationId = correlationId || this.requestId;
  }
  
  // Link requests relacionadas
  linkRequest(relatedRequestId, relationship) {
    this.info('Request correlation established', {
      correlationId: this.correlationId,
      relatedRequest: relatedRequestId,
      relationship,
      correlationType: 'linked'
    });
  }
}
```

## 🔍 Debugging Workflow em Produção

### 1. **Quando Usuário Reporta Erro**
```bash
# No Netlify Dashboard → Logs → Functions:
# 1. Filtrar por tempo quando erro ocorreu
# 2. Buscar por texto relacionado ao erro
# 3. Encontrar requestId nos logs
# 4. Rastrear toda sequência com o requestId
```

### 2. **Comandos de Busca Úteis**
```javascript
// Logs estruturados permitem buscas específicas:
"statusCode":500              // Todos erros 500
"validationType"              // Erros de validação
"performance":true            // Métricas de performance
"executionTime">3000          // Functions lentas (>3s)
"callType":"external"         // Chamadas externas
"businessLogic":true          // Erros de regra de negócio
```

### 3. **Monitoramento Proativo**
```javascript
// Function para monitoramento contínuo
exports.handler = withLogger(async (event, context) => {
  const { logger } = context;
  
  // Log métricas importantes sempre
  logger.info('Function health check', {
    memoryUsed: process.memoryUsage().heapUsed,
    uptime: process.uptime(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV
  });
  
  return { statusCode: 200, body: 'OK' };
}, 'monitoring');
```

## 📊 Dashboard de Monitoramento

### Métricas Importantes para Acompanhar
1. **Error Rate**: % de requests com erro
2. **Response Time**: Tempo médio de resposta
3. **Memory Usage**: Uso de memória
4. **External API Failures**: Falhas em integrações
5. **Validation Errors**: Erros de input do usuário

### Alertas Recomendados
```javascript
// Configurar alertas baseados em logs:
- Error rate > 5% em 5 minutos
- Response time > 3 segundos
- Memory usage > 80%
- Mais de 10 validation errors por hora
```

## 🎯 Implementação Imediata

### 1. **Melhorar Functions Existentes**
- ✅ Sistema de logging já implementado
- ⚠️ Adicionar enhanced context em erros
- ⚠️ Implementar correlation tracking
- ⚠️ Adicionar business logic logging

### 2. **Monitoramento em Produção**
- ✅ Logs disponíveis no Netlify Dashboard
- ✅ Filtros e buscas funcionais
- ⚠️ Configurar alertas automáticos
- ⚠️ Implementar health checks regulares

### 3. **Troubleshooting Workflow**
1. Usuário reporta erro → Pegar horário aproximado
2. Netlify Dashboard → Logs → Functions
3. Filtrar por tempo e buscar padrões de erro
4. Usar requestId para rastrear sequência completa
5. Analisar context completo do erro
6. Implementar fix baseado em evidências dos logs

## 🔧 Comandos Úteis para Produção

```bash
# Deploy automático (functions já incluídas)
git push origin main

# Verificar functions em produção
curl https://escolahabilidade.com/.netlify/functions/health-check

# Testar logging específico
curl -X POST https://escolahabilidade.com/.netlify/functions/contact-handler \
  -H "Content-Type: application/json" \
  -d '{"test": "logging"}'
```

## 🎯 Próximos Passos

1. **Implementar enhanced logging** nos arquivos existentes
2. **Configurar alertas** baseados em padrões de log  
3. **Criar dashboard** de métricas customizado
4. **Implementar correlation tracking** para requests relacionadas
5. **Adicionar business intelligence** aos logs

---

**💡 Dica Principal**: O Netlify Dashboard já oferece logging robusto. O foco deve ser em **estruturar melhor os logs** e **criar workflows eficientes de debugging** usando as ferramentas existentes.