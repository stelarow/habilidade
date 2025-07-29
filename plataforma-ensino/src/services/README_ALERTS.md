# Sistema de Alertas - Escola Habilidade

## Vis�o Geral
Sistema completo de alertas automatizados que monitora performance, downtime e erros da plataforma, enviando notifica��es em tempo real para administradores.

## Arquitetura

### Componentes Principais

1. **AlertService** (`src/services/alertService.ts`)
   - Gerenciamento de configura��es de alertas
   - Avalia��o de condi��es de alerta
   - Envio de notifica��es via m�ltiplos canais
   - Sistema de escala��o autom�tica

2. **MonitoringSystem** (`src/lib/blog/monitoring-integration.ts`)
   - Monitoramento cont�nuo de sa�de do sistema
   - Coleta de m�tricas de performance
   - Detec��o de anomalias
   - Integra��o com AlertService

3. **AlertConfig Component** (`src/components/admin/blog/AlertConfig.tsx`)
   - Interface administrativa para configura��o
   - Gest�o de canais de notifica��o
   - Visualiza��o de hist�rico de alertas

4. **Admin Page** (`src/app/admin/blog/alerts/page.tsx`)
   - P�gina administrativa integrada
   - Dashboard de m�tricas
   - Controles de status

## Funcionalidades

### Tipos de Alertas
- **Downtime**: Detecta quando APIs est�o indispon�veis
- **Performance**: Monitora tempos de resposta e Core Web Vitals
- **Error**: Rastreia taxas de erro elevadas
- **Custom**: Alertas personaliz�veis

### Canais de Notifica��o
- **Email**: Notifica��es via SMTP
- **Webhook**: Integra��o com servi�os externos
- **Slack**: Mensagens diretas no workspace

### Escala��o Autom�tica
- Configura��o de timeouts para escala��o
- M�ltiplos n�veis de severidade
- Notifica��o de diferentes equipes

## Configura��o

### Environment Variables
```bash
# Site URL para health checks
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Configura��es de email
ALERT_EMAIL_SERVICE_URL=your_email_service_url

# Webhook para integra��es
ALERT_WEBHOOK_SECRET=your_webhook_secret

# Slack webhook
ALERT_SLACK_WEBHOOK=your_slack_webhook_url

# Habilitar sistema de alertas
NEXT_PUBLIC_ADMIN_ALERT_ENABLED=true
```

### Database Setup
Execute a migration para criar as tabelas necess�rias:

```sql
-- Execute database/migrations/add_alerts_tables.sql
```

## Uso

### Configura��o via Interface Admin

1. Acesse `/admin/blog/alerts`
2. Configure regras de alerta na aba "Regras"
3. Configure canais de notifica��o na aba "Canais"
4. Monitore hist�rico na aba "Hist�rico"

### Configura��o Program�tica

```typescript
import { alertService } from '@/services/alertService';

// Criar nova regra de alerta
const alertConfig = await alertService.configAlertRules({
  name: 'API Downtime Alert',
  type: 'downtime',
  severity: 'critical',
  threshold: {
    value: 5,
    unit: 'minutes',
    comparison: 'greater_than'
  },
  channels: ['email', 'slack'],
  enabled: true,
  escalation: {
    enabled: true,
    timeout: 30,
    escalate_to: ['webhook']
  },
  conditions: {
    duration: 5,
    cooldown: 15
  }
});
```

## Monitoramento

### Health Checks
O sistema monitora automaticamente endpoints cr�ticos:
- `/api/health`
- `/api/blog/posts`
- `/api/courses`
- `/api/auth/session`
- `/api/dashboard`

### M�tricas Coletadas
- **LCP (Largest Contentful Paint)**
- **FID (First Input Delay)**
- **CLS (Cumulative Layout Shift)**
- **TTFB (Time to First Byte)**
- **Response Time m�dio**
- **Uso de mem�ria**
- **Taxa de erro**

### Intervalos de Monitoramento
- Health Check: 5 minutos
- Performance: 1 minuto
- Detec��o de Anomalias: 2 minutos
- Verifica��o de Escala��o: 5 minutos

## API Reference

### AlertService Methods

```typescript
// Configurar alerta
configAlertRules(config: AlertConfig): Promise<AlertConfig>

// Carregar configura��es
loadAlertConfigurations(): Promise<AlertConfig[]>

// Atualizar configura��o
updateAlertConfig(id: string, updates: Partial<AlertConfig>): Promise<AlertConfig>

// Deletar configura��o
deleteAlertConfig(id: string): Promise<boolean>

// Obter hist�rico
getAlertHistory(filters?: AlertFilters, page?: number, perPage?: number): Promise<AlertHistory>

// Reconhecer alerta
acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<boolean>

// Resolver alerta
resolveAlert(alertId: string, resolvedBy: string): Promise<boolean>

// Escalar alerta
escalateAlert(alertId: string): Promise<boolean>

// Obter m�tricas
getAlertMetrics(): Promise<AlertMetrics>
```

### MonitoringSystem Methods

```typescript
// Verificar sa�de do sistema
performHealthCheck(): Promise<HealthCheckResult>

// Coletar m�tricas de performance
collectPerformanceMetrics(): Promise<PerformanceMetrics>

// Detectar anomalias
detectAnomalies(): Promise<AnomalyDetection[]>

// Obter status de monitoramento
getMonitoringStatus(): Promise<MonitoringStatus>

// Parar monitoramento
stopMonitoring(): void

// Limpar recursos
cleanup(): void
```

## Database Schema

### Tabelas Principais

#### alert_configurations
```sql
- id: UUID (Primary Key)
- name: VARCHAR(100)
- type: VARCHAR(20) [downtime, performance, error, custom]
- severity: VARCHAR(20) [low, medium, high, critical]
- threshold: JSONB
- channels: TEXT[]
- enabled: BOOLEAN
- escalation: JSONB
- conditions: JSONB
- metadata: JSONB
- created_at, updated_at: TIMESTAMP
```

#### alert_history
```sql
- id: UUID (Primary Key)
- config_id: UUID (Foreign Key)
- severity: VARCHAR(20)
- status: VARCHAR(20) [active, acknowledged, resolved, escalated]
- title: VARCHAR(255)
- message: TEXT
- data: JSONB
- triggered_at: TIMESTAMP
- acknowledged_at: TIMESTAMP
- resolved_at: TIMESTAMP
- acknowledged_by: VARCHAR(255)
- channels_sent: TEXT[]
- escalation_count: INTEGER
```

#### alert_channel_configs
```sql
- id: UUID (Primary Key)
- channel_type: VARCHAR(20) [email, webhook, slack]
- config: JSONB
- enabled: BOOLEAN
- created_at, updated_at: TIMESTAMP
```

## Testes

### Executar Testes
```bash
# Testes unit�rios
npm test src/services/__tests__/alertService.test.ts

# Cobertura de testes
npm run test:coverage
```

### Testes de Integra��o
```bash
# Testar health checks
curl http://localhost:3000/api/health

# Testar configura��o de alertas
# Acesse /admin/blog/alerts e configure um alerta de teste
```

## Troubleshooting

### Problemas Comuns

1. **Alertas n�o est�o sendo enviados**
   - Verifique as environment variables
   - Configure corretamente os canais de notifica��o
   - Verifique logs do AlertService

2. **Performance do monitoramento**
   - Sistema foi otimizado para overhead m�nimo
   - Intervalos podem ser ajustados no c�digo se necess�rio

3. **Problemas de permiss�o**
   - Verifique RLS policies no Supabase
   - Usu�rio deve ter role 'admin' para acessar interface

### Logs e Debug

```typescript
import { logger } from '@/utils/logger';

// Logs s�o automaticamente gerados pelo sistema
// Verificar console do browser ou logs do servidor
```

## Melhorias Futuras

### Poss�veis Extens�es
- [ ] Integra��o com Telegram
- [ ] Alertas via SMS
- [ ] Dashboard de m�tricas em tempo real
- [ ] Machine learning para detec��o de anomalias
- [ ] Integra��o com Grafana/Prometheus
- [ ] Alertas baseados em logs
- [ ] Agrupamento inteligente de alertas

### Performance
- [ ] Caching de configura��es
- [ ] Compress�o de dados hist�ricos
- [ ] Otimiza��o de queries
- [ ] Worker threads para processamento

## Contribui��o

Para contribuir com melhorias:

1. Siga os padr�es de c�digo TypeScript strict
2. Adicione testes para novas funcionalidades
3. Mantenha documenta��o atualizada
4. Use logging estruturado para debugging

## Suporte

Para d�vidas ou problemas:
- Verifique logs do sistema
- Consulte esta documenta��o
- Analise testes unit�rios para exemplos de uso