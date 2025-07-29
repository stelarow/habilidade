# Sistema de Monitoramento e Manuten��o - FEATURE_008

Este documento descreve o sistema completo de monitoramento e manuten��o implementado para a plataforma de ensino.

## Vis�o Geral

O sistema de monitoramento fornece:
-  Health checks autom�ticos a cada 5 minutos
-  Alertas quando API n�o responde em 3 segundos
-  Dashboard de m�tricas em tempo real
-  Sistema de logging estruturado
-  Backup autom�tico com scripts
-  Monitoramento de uptime e SLA
-  Audit trail para a��es administrativas
-  Sistema de feature flags
-  Error boundaries e tracking de erros

## Configura��o Inicial

### 1. Configurar o Banco de Dados

Execute o schema SQL no Supabase:

```sql
-- Executar no editor SQL do Supabase
\i database/monitoring-schema.sql
```

### 2. Vari�veis de Ambiente

Adicione ao seu `.env.local`:

```env
# Monitoramento
BACKUP_DIR=./backups
BACKUP_RETENTION_DAYS=30
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Alertas (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ALERT_EMAIL=admin@escolahabilidade.com
```

### 3. Instala��o de Depend�ncias

```bash
cd plataforma-ensino
npm install @supabase/supabase-js
```

## Componentes Implementados

### 1. Health Check System (`src/utils/healthCheck.js`)

Sistema de verifica��o de sa�de que monitora:
- Database Supabase
- API endpoints do blog
- Supabase Storage
- Servi�o de autentica��o

**Uso:**
```javascript
import { healthChecker } from '@/utils/healthCheck';

// Iniciar monitoramento
healthChecker.start();

// Verificar status atual
const health = healthChecker.getCurrentHealth();

// Obter estat�sticas de uptime
const stats = healthChecker.getUptimeStats();
```

### 2. Uptime Monitor (`src/services/uptimeMonitor.js`)

Monitora uptime e SLA com:
- Tracking de incidentes
- M�tricas de SLA (99.5% target)
- Alertas de downtime
- Hist�rico de disponibilidade

**Uso:**
```javascript
import { uptimeMonitor } from '@/services/uptimeMonitor';

// Iniciar monitoramento
await uptimeMonitor.start();

// Obter status atual
const status = uptimeMonitor.getCurrentUptimeStatus();

// Gerar relat�rio
const report = await uptimeMonitor.getUptimeReport(startDate, endDate);
```

### 3. Sistema de Logging (`src/utils/logger.js`)

Logger estruturado com n�veis:
- DEBUG, INFO, WARN, ERROR, CRITICAL
- Context capture autom�tico
- Performance tracking
- Sanitiza��o de dados sens�veis

**Uso:**
```javascript
import { logger } from '@/utils/logger';

// Logging b�sico
logger.info('User logged in', { userId: '123' });
logger.error('API error', { endpoint: '/api/posts', status: 500 });

// Performance tracking
logger.startPerformanceTimer('database-query');
// ... opera��o
logger.endPerformanceTimer('database-query');

// User actions
logger.userAction('post-created', { postId: 'abc123' });
```

### 4. Hook de Error Logging (`src/hooks/useErrorLogging.js`)

Hook React para logging de erros em componentes:

**Uso:**
```javascript
import { useErrorLogging } from '@/hooks/useErrorLogging';

function MyComponent() {
  const { logError, logUserAction, measurePerformance } = useErrorLogging('MyComponent');

  const handleSubmit = async (data) => {
    try {
      await measurePerformance('submit', () => apiCall(data));
      logUserAction('form-submitted', { formType: 'contact' });
    } catch (error) {
      logError(error, { formData: data });
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 5. Dashboard de Monitoramento

Acesse via: `/admin/monitoring`

**Funcionalidades:**
- Status em tempo real de todos os servi�os
- M�tricas de uptime por janela de tempo
- Lista de alertas recentes
- Gr�ficos de performance
- Auto-refresh a cada 30 segundos

### 6. Sistema de Backup

**Executar backup manual:**
```bash
cd plataforma-ensino
node scripts/backup.js full
```

**Configurar backup autom�tico (crontab):**
```bash
# Backup di�rio �s 2:00 AM
0 2 * * * cd /path/to/plataforma-ensino && node scripts/backup.js full
```

## API Endpoints

### POST /api/logs
Recebe logs da aplica��o frontend:

```javascript
fetch('/api/logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(logEntry)
});
```

### GET /api/logs (Admin only)
Recupera logs com filtros:

```javascript
const response = await fetch('/api/logs?level=3&limit=100&since=2024-01-01');
const { logs } = await response.json();
```

## Database Schema

### Tabelas Principais

- `uptime_monitoring` - Dados de health checks
- `system_incidents` - Incidentes de downtime
- `system_alerts` - Alertas do sistema
- `system_logs` - Logs centralizados
- `critical_logs` - Logs cr�ticos
- `backup_operations` - Opera��es de backup
- `audit_logs` - Trilha de auditoria
- `feature_flags` - Flags de funcionalidades

### Pol�ticas RLS

Todas as tabelas possuem RLS habilitado:
- Admins t�m acesso completo
- Sistema pode inserir dados
- Usu�rios regulares n�o t�m acesso

## Monitoramento em Produ��o

### Health Checks
- Executam a cada 5 minutos automaticamente
- Timeout de 3 segundos para APIs
- Alertas ap�s 5 minutos de downtime

### SLA Monitoring
- Target: 99.5% uptime
- Janelas: 1h, 24h, 7d, 30d
- Alertas autom�ticos em caso de breach

### Cleanup Autom�tico
- Logs antigos: 7 dias (info), 30 dias (erros)
- Dados de uptime: 30 dias
- Incidentes resolvidos: 90 dias
- Audit logs: 1 ano

## Troubleshooting

### Logs n�o aparecem no dashboard
1. Verificar se o servi�o de logs est� rodando
2. Checar conex�o com Supabase
3. Verificar pol�ticas RLS

### Health checks falham
1. Verificar conectividade de rede
2. Checar credenciais do Supabase
3. Verificar endpoints da API

### Backup falha
1. Verificar vari�veis de ambiente
2. Checar permiss�es de escrita
3. Verificar espa�o em disco

## Extens�es Futuras

Para implementar funcionalidades adicionais:

1. **Sistema de Alertas por Email**
   - Implementar `src/services/alertService.js`
   - Configurar SMTP
   - Templates de email

2. **Dashboard de M�tricas Avan�ado**
   - Gr�ficos interativos
   - Filtros avan�ados
   - Exporta��o de relat�rios

3. **Modo de Manuten��o**
   - UI de manuten��o programada
   - Feature flags din�micas
   - Notifica��es autom�ticas

4. **Debug Panel**
   - Ferramenta de debug para admins
   - Simulador de condi��es
   - Cache inspector

## Contato de Suporte

Para quest�es sobre o sistema de monitoramento:
- Email: alessandro.ferreira@escolahabilidade.com
- WhatsApp: (48) 98855-9491