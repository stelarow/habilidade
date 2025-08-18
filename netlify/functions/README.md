# Netlify Functions com Sistema de Logging Avançado

Este diretório contém as Netlify Functions configuradas para o projeto Escola Habilidade, todas equipadas com sistema de logging profissional para facilitar desenvolvimento e troubleshooting.

## 📋 Índice

- [Configuração](#configuração)
- [Functions Disponíveis](#functions-disponíveis)
- [Sistema de Logging](#sistema-de-logging)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Testes](#testes)
- [Deploy e Produção](#deploy-e-produção)
- [Troubleshooting](#troubleshooting)

## 🚀 Configuração

### Pré-requisitos

1. **Netlify CLI** instalado globalmente:
```bash
npm install -g netlify-cli
```

2. **Autenticação** no Netlify:
```bash
netlify login
```

3. **Link do projeto** (se ainda não estiver linkado):
```bash
netlify link
```

### Estrutura de Arquivos

```
netlify/functions/
├── utils/
│   └── logger.js              # Utilitário de logging avançado
├── health-check.js            # Function de monitoramento de saúde
├── contact-handler.js         # Processador de formulários de contato
├── dev-logger.js              # Logger específico para desenvolvimento
├── blog-analytics.js          # Analytics do blog
└── README.md                  # Esta documentação
```

## 🔧 Functions Disponíveis

### 1. Health Check (`health-check.js`)

**Endpoint:** `/.netlify/functions/health-check`  
**Método:** GET  
**Descrição:** Monitora a saúde da aplicação e verifica dependências

**Exemplo de uso:**
```bash
curl https://seu-site.netlify.app/.netlify/functions/health-check
```

**Resposta exemplo:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-18T10:30:45.123Z",
  "uptime": "3600s",
  "memory": {
    "used": "45MB",
    "total": "128MB"
  },
  "environment": "production",
  "dependencies": {
    "dns": "ok",
    "network": "ok"
  }
}
```

### 2. Contact Handler (`contact-handler.js`)

**Endpoint:** `/.netlify/functions/contact-handler`  
**Método:** POST  
**Descrição:** Processa formulários de contato com validação e logging completo

**Payload exemplo:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "subject": "Informações sobre curso",
  "message": "Gostaria de saber mais sobre o curso de SketchUp."
}
```

**Exemplo de uso:**
```bash
curl -X POST https://seu-site.netlify.app/.netlify/functions/contact-handler \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@example.com","subject":"Teste","message":"Mensagem de teste"}'
```

### 3. Dev Logger (`dev-logger.js`)

**Endpoint:** `/.netlify/functions/dev-logger`  
**Método:** GET/POST  
**Descrição:** Sistema de logging centralizado para desenvolvimento e debugging

**Parâmetros (Query String):**
- `type`: debug, error, performance, test, generic
- `source`: origem do log (componente, página, etc.)
- `message`: mensagem do log

**Exemplo de uso:**
```bash
# Via query string
curl "https://seu-site.netlify.app/.netlify/functions/dev-logger?type=debug&source=contact-form&message=Form validation passed"

# Via POST
curl -X POST https://seu-site.netlify.app/.netlify/functions/dev-logger \
  -H "Content-Type: application/json" \
  -d '{"type":"error","source":"blog","message":"Failed to load article","data":{"error":"Network timeout"}}'
```

### 4. Blog Analytics (`blog-analytics.js`)

**Endpoint:** `/.netlify/functions/blog-analytics`  
**Método:** POST  
**Descrição:** Coleta e processa dados de analytics do blog

**Eventos suportados:**
- `page_view`: Visualizações de página
- `blog_read`: Leitura de artigos
- `engagement`: Interações do usuário
- `performance`: Métricas de performance

**Exemplo de uso:**
```bash
curl -X POST https://seu-site.netlify.app/.netlify/functions/blog-analytics \
  -H "Content-Type: application/json" \
  -d '{"event":"blog_read","slug":"historia-sketchup","readingTime":300,"scrollDepth":85}'
```

## 📊 Sistema de Logging

### Níveis de Log

O sistema suporta 5 níveis de log:

1. **DEBUG** - Informações detalhadas para desenvolvimento
2. **INFO** - Informações gerais de operação
3. **WARN** - Avisos que não impedem funcionamento
4. **ERROR** - Erros que afetam funcionamento
5. **FATAL** - Erros críticos que podem parar a aplicação

### Formato dos Logs

**Desenvolvimento (colorido):**
```
2025-01-18T10:30:45.123Z [INFO ] [req-123] Contact form processed successfully | {"submissionId":"contact_123","emailSent":true}
```

**Produção (JSON estruturado):**
```json
{
  "timestamp": "2025-01-18T10:30:45.123Z",
  "level": "INFO",
  "message": "Contact form processed successfully",
  "requestId": "req-123",
  "function": "contact-handler",
  "submissionId": "contact_123",
  "emailSent": true
}
```

### Recursos do Logger

- **Request ID automático** para rastreamento
- **Sanitização de dados sensíveis**
- **Performance tracking** automático
- **Context tracking** entre functions
- **Error handling** com stack traces
- **External API call logging**

### Usando o Logger

```javascript
const { withLogger, createLogger } = require('./utils/logger');

// Wrapper automático (recomendado)
exports.handler = withLogger(async (event, context) => {
  const { logger } = context;
  
  logger.info('Function started');
  logger.debug('Debug info', { data: 'value' });
  logger.error('Something went wrong', error);
  logger.performance('Operation completed');
  
  return { statusCode: 200, body: 'OK' };
}, 'my-function');

// Logger manual
const logger = createLogger('my-function');
logger.info('Manual logging');
```

## 🛠 Desenvolvimento Local

### 1. Servidor de Development (Recomendado)

Inicia servidor completo com site + functions:

```bash
npm run functions:dev
# ou
netlify dev
```

Acesso:
- Site: http://localhost:8888
- Functions: http://localhost:8888/.netlify/functions/[function-name]

### 2. Servidor Standalone de Functions

Apenas functions, sem o site:

```bash
npm run functions:serve
# ou
netlify functions:serve
```

Acesso:
- Functions: http://localhost:9999/.netlify/functions/[function-name]

### 3. Debug Mode

Para debugging com Node.js inspector:

```bash
npm run functions:debug
# ou
NODE_OPTIONS='--inspect' netlify functions:serve
```

Depois conecte o debugger do VS Code ou Chrome DevTools em localhost:9229.

### 4. Scripts Disponíveis

```bash
# Desenvolvimento
npm run functions:dev          # Servidor completo
npm run functions:serve        # Apenas functions
npm run functions:debug        # Debug mode

# Gerenciamento
npm run functions:create       # Criar nova function
npm run functions:list         # Listar functions

# Testes rápidos
npm run functions:invoke:health      # Testar health-check
npm run functions:invoke:contact     # Testar contact-handler
npm run functions:invoke:logger      # Testar dev-logger

# Testes automáticos
npm run functions:test               # Testar todas as functions
```

## 🧪 Testes

### Script de Teste Automatizado

```bash
# Testes básicos
npm run functions:test

# Testes com mais opções
node scripts/test-functions.js --performance  # Testes de performance
node scripts/test-functions.js --stress       # Testes de stress
node scripts/test-functions.js --all          # Todos os testes
```

### Testes Manuais via CLI

```bash
# Health check
netlify functions:invoke health-check

# Contact form
netlify functions:invoke contact-handler --payload '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'

# Dev logger
netlify functions:invoke dev-logger --querystring "type=debug&source=test&message=Test log"

# Blog analytics
netlify functions:invoke blog-analytics --payload '{"event":"page_view","page":"/blog"}'
```

### Testes via HTTP

```bash
# Assumindo servidor rodando em localhost:9999

# Health check
curl http://localhost:9999/.netlify/functions/health-check

# Contact form
curl -X POST http://localhost:9999/.netlify/functions/contact-handler \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"Test","message":"Test message"}'
```

## 🚀 Deploy e Produção

### Configuração no Netlify

As functions são automaticamente deployadas quando você faz push para o repositório. Certifique-se de que o `netlify.toml` está configurado:

```toml
[build]
  functions = "netlify/functions"

[dev]
  functions = "netlify/functions"
  functionsPort = 9999
```

### Variáveis de Ambiente

Configure no dashboard do Netlify as variáveis necessárias:

- `NODE_ENV=production`
- Outras variáveis específicas das suas functions

### Monitoramento de Logs

1. **Netlify Dashboard**: Vá para Site > Functions > Logs
2. **Real-time**: Use o filtro "Real-time" para logs ao vivo
3. **Filtros**: Use filtros de texto para encontrar logs específicos
4. **Retention**: Logs ficam disponíveis por 7-24h dependendo do plano

## 🔍 Visualizando Logs no Netlify

### 1. Via Dashboard

1. Acesse seu site no Netlify Dashboard
2. Vá em **Logs** > **Functions**
3. Selecione a function específica
4. Use filtros por data, texto ou nível

### 2. Log Levels no Netlify

O Netlify reconhece automaticamente estes níveis:
- `INFO`
- `ERROR` 
- `WARN`
- `DEBUG`
- `FATAL`
- `TRACE`

### 3. Estrutura de Logs Recomendada

Para melhor análise no Netlify, use:

```javascript
// ✅ Bom - JSON estruturado em produção
logger.info('User action completed', {
  action: 'form_submit',
  userId: 'user123',
  success: true,
  duration: 150
});

// ❌ Evitar - String simples sem contexto
console.log('Form submitted');
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Function não encontrada (404)

**Sintomas:** Erro 404 ao acessar function
**Soluções:**
- Verifique se o arquivo está em `netlify/functions/`
- Confirme que exporta `exports.handler`
- Verifique `netlify.toml` configuração

#### 2. Timeout na Function

**Sintomas:** Error 500, timeout no log
**Soluções:**
- Functions têm limite de 10s (background: 15min)
- Otimize operações assíncronas
- Use background functions para processos longos

#### 3. Logs não aparecem

**Sintomas:** Console.log não aparece no Netlify
**Soluções:**
- Use `console.log`, não outros loggers
- Aguarde alguns segundos para logs aparecerem
- Verifique se function executou com sucesso

#### 4. CORS Issues

**Sintomas:** Erro de CORS no browser
**Soluções:**
```javascript
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  },
  body: JSON.stringify(data)
};
```

### Debug Checklist

1. ✅ Function exporta `exports.handler`?
2. ✅ Arquivo está em `netlify/functions/`?
3. ✅ `netlify.toml` configurado corretamente?
4. ✅ Logs estão sendo chamados com `console.log`?
5. ✅ Headers de CORS configurados se necessário?
6. ✅ Timeout adequado para operação?

### Logs de Sistema Úteis

```javascript
// Informações do environment
logger.info('Environment info', {
  nodeVersion: process.version,
  platform: process.platform,
  memory: process.memoryUsage(),
  env: process.env.NODE_ENV
});

// Headers da requisição
logger.debug('Request headers', {
  userAgent: event.headers['user-agent'],
  referer: event.headers['referer'],
  origin: event.headers['origin']
});

// Performance da function
const startTime = Date.now();
// ... operação ...
logger.info('Function performance', {
  executionTime: Date.now() - startTime,
  memoryUsed: process.memoryUsage().heapUsed
});
```

## 📚 Recursos Adicionais

### Documentação Oficial

- [Netlify Functions Docs](https://docs.netlify.com/build/functions/)
- [Netlify CLI Commands](https://cli.netlify.com/commands/functions)
- [Function Logs Guide](https://docs.netlify.com/build/functions/logs/)

### Exemplos Avançados

- [Event-triggered Functions](https://docs.netlify.com/build/functions/trigger-on-events/)
- [Background Functions](https://docs.netlify.com/build/functions/background-functions/)
- [Function Templates](https://github.com/netlify/functions)

### Integração com o Projeto

Para integrar estas functions com seu site React:

```javascript
// Exemplo de integração no frontend
const submitContactForm = async (formData) => {
  try {
    const response = await fetch('/.netlify/functions/contact-handler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Sucesso
      console.log('Form submitted successfully');
    } else {
      // Erro
      console.error('Form submission failed:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

---

## 🤝 Contribuindo

Para adicionar uma nova function:

1. Crie o arquivo em `netlify/functions/`
2. Use o utilitário `withLogger` para logging automático
3. Adicione testes em `scripts/test-functions.js`
4. Documente no README

Exemplo de template básico:

```javascript
const { withLogger } = require('./utils/logger');

async function handler(event, context) {
  const { logger } = context;
  
  logger.info('My new function called');
  
  // Sua lógica aqui
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' })
  };
}

exports.handler = withLogger(handler, 'my-new-function');
```