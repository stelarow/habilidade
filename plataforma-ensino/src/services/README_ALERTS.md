# Sistema de Alertas - Escola Habilidade

## Visão Geral
Sistema completo de alertas automatizados que monitora performance, downtime e erros da plataforma, enviando notificações em tempo real para administradores.

## Arquitetura

### Componentes Principais

1. **AlertService** (`src/services/alertService.ts`)
   - Gerenciamento de configurações de alertas
   - Avaliação de condições de alerta
   - Envio de notificações via múltiplos canais
   - Sistema de escalação automática

2. **MonitoringSystem** (`src/lib/blog/monitoring-integration.ts`)
   - Monitoramento contínuo de saúde do sistema
   - Coleta de métricas de performance
   - Detecção de anomalias
   - Integração com AlertService

3. **AlertConfig Component** (`src/components/admin/blog/AlertConfig.tsx`)
   - Interface administrativa para configuração
   - Gestão de canais de notificação
   - Visualização de histórico de alertas

4. **Admin Page** (`src/app/admin/blog/alerts/page.tsx`)
   - Página administrativa integrada
   - Dashboard de métricas
   - Controles de status

## Funcionalidades

### Tipos de Alertas
- **Downtime**: Detecta quando APIs estão indisponíveis
- **Performance**: Monitora tempos de resposta e Core Web Vitals
- **Error**: Rastreia taxas de erro elevadas
- **Custom**: Alertas personalizáveis

### Canais de Notificação
- **Email**: Notificações via SMTP
- **Webhook**: Integração com serviços externos
- **Slack**: Mensagens diretas no workspace

### Escalação Automática
- Configuração de timeouts para escalação
- Múltiplos níveis de severidade
- Notificação de diferentes equipes

## Configuração

### Environment Variables
```bash
# Site URL para health checks
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Configurações de email
ALERT_EMAIL_SERVICE_URL=your_email_service_url

# Webhook para integrações
ALERT_WEBHOOK_SECRET=your_webhook_secret

# Slack webhook
ALERT_SLACK_WEBHOOK=your_slack_webhook_url

# Habilitar sistema de alertas
NEXT_PUBLIC_ADMIN_ALERT_ENABLED=true
```

### Database Setup
Execute a migration para criar as tabelas necessárias:

```sql
-- Execute database/migrations/add_alerts_tables.sql
```

## Uso

### Configuração via Interface Admin

1. Acesse `/admin/blog/alerts`
2. Configure regras de alerta na aba "Regras"
3. Configure canais de notificação na aba "Canais"
4. Monitore histórico na aba "Histórico"

### Configuração Programática

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
O sistema monitora automaticamente endpoints críticos:
- `/api/health`
- `/api/blog/posts`
- `/api/courses`
- `/api/auth/session`
- `/api/dashboard`

### Métricas Coletadas
- **LCP (Largest Contentful Paint)**
- **FID (First Input Delay)**
- **CLS (Cumulative Layout Shift)**
- **TTFB (Time to First Byte)**
- **Response Time médio**
- **Uso de memória**
- **Taxa de erro**

### Intervalos de Monitoramento
- Health Check: 5 minutos
- Performance: 1 minuto
- Detecção de Anomalias: 2 minutos
- Verificação de Escalação: 5 minutos

## API Reference

### AlertService Methods

```typescript
// Configurar alerta
configAlertRules(config: AlertConfig): Promise<AlertConfig>

// Carregar configurações
loadAlertConfigurations(): Promise<AlertConfig[]>

// Atualizar configuração
updateAlertConfig(id: string, updates: Partial<AlertConfig>): Promise<AlertConfig>

// Deletar configuração
deleteAlertConfig(id: string): Promise<boolean>

// Obter histórico
getAlertHistory(filters?: AlertFilters, page?: number, perPage?: number): Promise<AlertHistory>

// Reconhecer alerta
acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<boolean>

// Resolver alerta
resolveAlert(alertId: string, resolvedBy: string): Promise<boolean>

// Escalar alerta
escalateAlert(alertId: string): Promise<boolean>

// Obter métricas
getAlertMetrics(): Promise<AlertMetrics>
```

### MonitoringSystem Methods

```typescript
// Verificar saúde do sistema
performHealthCheck(): Promise<HealthCheckResult>

// Coletar métricas de performance
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
# Testes unitários
npm test src/services/__tests__/alertService.test.ts

# Cobertura de testes
npm run test:coverage
```

### Testes de Integração
```bash
# Testar health checks
curl http://localhost:3000/api/health

# Testar configuração de alertas
# Acesse /admin/blog/alerts e configure um alerta de teste
```

## Troubleshooting

### Problemas Comuns

1. **Alertas não estão sendo enviados**
   - Verifique as environment variables
   - Configure corretamente os canais de notificação
   - Verifique logs do AlertService

2. **Performance do monitoramento**
   - Sistema foi otimizado para overhead mínimo
   - Intervalos podem ser ajustados no código se necessário

3. **Problemas de permissão**
   - Verifique RLS policies no Supabase
   - Usuário deve ter role 'admin' para acessar interface

### Logs e Debug

```typescript
import { logger } from '@/utils/logger';

// Logs são automaticamente gerados pelo sistema
// Verificar console do browser ou logs do servidor
```

## Melhorias Futuras

### Possíveis Extensões
- [ ] Integração com Telegram
- [ ] Alertas via SMS
- [ ] Dashboard de métricas em tempo real
- [ ] Machine learning para detecção de anomalias
- [ ] Integração com Grafana/Prometheus
- [ ] Alertas baseados em logs
- [ ] Agrupamento inteligente de alertas

### Performance
- [ ] Caching de configurações
- [ ] Compressão de dados históricos
- [ ] Otimização de queries
- [ ] Worker threads para processamento

## Contribuição

Para contribuir com melhorias:

1. Siga os padrões de código TypeScript strict
2. Adicione testes para novas funcionalidades
3. Mantenha documentação atualizada
4. Use logging estruturado para debugging

## Suporte

Para dúvidas ou problemas:
- Verifique logs do sistema
- Consulte esta documentação
- Analise testes unitários para exemplos de uso