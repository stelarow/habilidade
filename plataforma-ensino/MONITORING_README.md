# Sistema de Monitoramento e Manutenção - FEATURE_008

Este documento descreve o sistema completo de monitoramento e manutenção implementado para a plataforma de ensino.

## Visão Geral

O sistema de monitoramento fornece:
-  Health checks automáticos a cada 5 minutos
-  Alertas quando API não responde em 3 segundos
-  Dashboard de métricas em tempo real
-  Sistema de logging estruturado
-  Backup automático com scripts
-  Monitoramento de uptime e SLA
-  Audit trail para ações administrativas
-  Sistema de feature flags
-  Error boundaries e tracking de erros

## Configuração Inicial

### 1. Configurar o Banco de Dados

Execute o schema SQL no Supabase:

```sql
-- Executar no editor SQL do Supabase
\i database/monitoring-schema.sql
```

### 2. Variáveis de Ambiente

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

### 3. Instalação de Dependências

```bash
cd plataforma-ensino
npm install @supabase/supabase-js
```

## Componentes Implementados

### 1. Health Check System (`src/utils/healthCheck.js`)

Sistema de verificação de saúde que monitora:
- Database Supabase
- API endpoints do blog
- Supabase Storage
- Serviço de autenticação

**Uso:**
```javascript
import { healthChecker } from '@/utils/healthCheck';

// Iniciar monitoramento
healthChecker.start();

// Verificar status atual
const health = healthChecker.getCurrentHealth();

// Obter estatísticas de uptime
const stats = healthChecker.getUptimeStats();
```

### 2. Uptime Monitor (`src/services/uptimeMonitor.js`)

Monitora uptime e SLA com:
- Tracking de incidentes
- Métricas de SLA (99.5% target)
- Alertas de downtime
- Histórico de disponibilidade

**Uso:**
```javascript
import { uptimeMonitor } from '@/services/uptimeMonitor';

// Iniciar monitoramento
await uptimeMonitor.start();

// Obter status atual
const status = uptimeMonitor.getCurrentUptimeStatus();

// Gerar relatório
const report = await uptimeMonitor.getUptimeReport(startDate, endDate);
```

### 3. Sistema de Logging (`src/utils/logger.js`)

Logger estruturado com níveis:
- DEBUG, INFO, WARN, ERROR, CRITICAL
- Context capture automático
- Performance tracking
- Sanitização de dados sensíveis

**Uso:**
```javascript
import { logger } from '@/utils/logger';

// Logging básico
logger.info('User logged in', { userId: '123' });
logger.error('API error', { endpoint: '/api/posts', status: 500 });

// Performance tracking
logger.startPerformanceTimer('database-query');
// ... operação
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
- Status em tempo real de todos os serviços
- Métricas de uptime por janela de tempo
- Lista de alertas recentes
- Gráficos de performance
- Auto-refresh a cada 30 segundos

### 6. Sistema de Backup

**Executar backup manual:**
```bash
cd plataforma-ensino
node scripts/backup.js full
```

**Configurar backup automático (crontab):**
```bash
# Backup diário às 2:00 AM
0 2 * * * cd /path/to/plataforma-ensino && node scripts/backup.js full
```

## API Endpoints

### POST /api/logs
Recebe logs da aplicação frontend:

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
- `critical_logs` - Logs críticos
- `backup_operations` - Operações de backup
- `audit_logs` - Trilha de auditoria
- `feature_flags` - Flags de funcionalidades

### Políticas RLS

Todas as tabelas possuem RLS habilitado:
- Admins têm acesso completo
- Sistema pode inserir dados
- Usuários regulares não têm acesso

## Monitoramento em Produção

### Health Checks
- Executam a cada 5 minutos automaticamente
- Timeout de 3 segundos para APIs
- Alertas após 5 minutos de downtime

### SLA Monitoring
- Target: 99.5% uptime
- Janelas: 1h, 24h, 7d, 30d
- Alertas automáticos em caso de breach

### Cleanup Automático
- Logs antigos: 7 dias (info), 30 dias (erros)
- Dados de uptime: 30 dias
- Incidentes resolvidos: 90 dias
- Audit logs: 1 ano

## Troubleshooting

### Logs não aparecem no dashboard
1. Verificar se o serviço de logs está rodando
2. Checar conexão com Supabase
3. Verificar políticas RLS

### Health checks falham
1. Verificar conectividade de rede
2. Checar credenciais do Supabase
3. Verificar endpoints da API

### Backup falha
1. Verificar variáveis de ambiente
2. Checar permissões de escrita
3. Verificar espaço em disco

## Extensões Futuras

Para implementar funcionalidades adicionais:

1. **Sistema de Alertas por Email**
   - Implementar `src/services/alertService.js`
   - Configurar SMTP
   - Templates de email

2. **Dashboard de Métricas Avançado**
   - Gráficos interativos
   - Filtros avançados
   - Exportação de relatórios

3. **Modo de Manutenção**
   - UI de manutenção programada
   - Feature flags dinâmicas
   - Notificações automáticas

4. **Debug Panel**
   - Ferramenta de debug para admins
   - Simulador de condições
   - Cache inspector

## Contato de Suporte

Para questões sobre o sistema de monitoramento:
- Email: alessandro.ferreira@escolahabilidade.com
- WhatsApp: (48) 98855-9491