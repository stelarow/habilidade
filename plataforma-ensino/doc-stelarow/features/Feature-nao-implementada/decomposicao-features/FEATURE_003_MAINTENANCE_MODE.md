# FEATURE 003: Sistema de Manutenção Programada

## Descrição
Sistema completo de manutenção programada que permite ativar/desativar modo de manutenção de forma controlada, com interface de usuário dedicada, bypass para administradores e notificações automáticas.

**Prioridade**: CRÍTICA (Bloqueador para Produção)
**Estimativa Total**: 32 horas
**Status**: ✅ CONCLUÍDA - Sistema completo de manutenção implementado

## Contexto Técnico
- **Arquitetura**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/features/Feature-nao-implementada/arquitetura-nao-implementada.md` (Seção 3.3)
- **Especificações**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/features/Feature-nao-implementada/spec-nao-implementado.md` (Feature 8, linhas 307-324)
- **Stack**: Next.js 14.2.x + TypeScript + Supabase + Middleware
- **Backend Status**: Parcialmente implementado - precisa completar frontend

## Tasks

### Task 1: Implementar MaintenanceService
**Duração**: 8 horas
**Caminho**: `src/services/maintenanceService.ts`
**MCPs/Ferramentas**: Supabase MCP, Context7
**Tecnologias**: TypeScript, Supabase Client, Node.js

**Descrição**: Criar serviço principal para gerenciamento de janelas de manutenção programada.

**Implementação**:
1. **Interface MaintenanceWindow**:
   - Campos: id, title, description, startTime, endTime, affectedServices
   - Status: scheduled, active, completed, cancelled
   - Sistema de bypass para usuários específicos
   - Controle de notificações enviadas

2. **Classe MaintenanceService**:
   - `scheduleMaintenanceWindow()`: Agendar nova janela de manutenção
   - `activateMaintenanceMode()`: Ativar modo automaticamente ou manualmente
   - `deactivateMaintenanceMode()`: Desativar modo de manutenção
   - `checkMaintenanceStatus()`: Verificar status atual do sistema
   - `sendMaintenanceNotifications()`: Enviar notificações para usuários
   - `addBypassUser()`: Adicionar usuário ao bypass temporário

3. **Integração com Supabase**:
   - Tabela `maintenance_windows` para persistência
   - RLS policies para acesso administrativo
   - Real-time subscriptions para mudanças de status

4. **Sistema de Notificações**:
   - Email para todos os usuários cadastrados
   - Webhook para integrações externas
   - Template personalizável de notificação

**Critérios de Aceitação**:
- [x] Interface MaintenanceWindow implementada seguindo TypeScript strict
- [x] Todos os métodos da classe MaintenanceService funcionais
- [x] Integração completa com Supabase (CRUD + RLS)
- [x] Sistema de bypass funcionando para administradores
- [x] Notificações automáticas por email
- [x] Logs estruturados para auditoria
- [ ] Testes unitários com cobertura > 80% (Pendente)

**Contexto Referência**: Arquitetura seção 3.3.1 (linhas 328-353)

---

### Task 2: Componente MaintenanceMode UI
**Duração**: 10 horas
**Caminho**: `src/components/blog/MaintenanceMode.tsx`
**MCPs/Ferramentas**: Context7 (Shadcn/ui patterns)
**Tecnologias**: React, TypeScript, Shadcn/ui, date-fns, Framer Motion

**Descrição**: Criar interface de usuário para modo de manutenção com design consistente e informações claras.

**Pré-requisitos**:
- Instalar componentes: `npx shadcn-ui@latest add card button`
- Task 1 (MaintenanceService) deve estar completa

**Implementação**:
1. **Componente Principal**:
   - Layout fullscreen centralizado
   - Background gradient consistente com Habilidade Design System
   - Componente responsivo para mobile/desktop

2. **Informações da Manutenção**:
   - Título e descrição personalizáveis
   - Countdown em tempo real até conclusão estimada
   - Ícone de ferramentas/configuração
   - Serviços afetados listados

3. **Bypass para Administradores**:
   - Componente `AdminMaintenanceNotice` discreta
   - Banner no topo para admins em modo bypass
   - Link para painel de controle de manutenção
   - Indicador visual de modo ativo

4. **Opções de Contato**:
   - Botão WhatsApp para emergências
   - Informações de contato alternativo
   - Links para redes sociais
   - Estimativa atualizada automaticamente

5. **Animações e UX**:
   - Animações suaves com Framer Motion
   - Estados de loading para atualizações
   - Refresh automático de informações
   - Design acessível (ARIA labels)

**Critérios de Aceitação**:
- [x] Interface fullscreen responsiva funcionando
- [x] Countdown em tempo real funcionando
- [x] Bypass para administradores implementado
- [x] Integração com WhatsApp para contato
- [x] Design consistente com Habilidade Design System
- [x] Animações suaves e performance otimizada
- [x] Acessibilidade completa (WCAG 2.1)
- [x] Refresh automático de dados sem reload da página

**Contexto Referência**: Arquitetura seção 3.3.2 (linhas 355-405)

---

### Task 3: Extensão do Middleware para Manutenção
**Duração**: 6 horas
**Caminho**: `src/middleware.ts` (extensão)
**MCPs/Ferramentas**: Context7 (Next.js Middleware patterns)
**Tecnologias**: Next.js Middleware, TypeScript, Edge Runtime

**Descrição**: Estender middleware existente para interceptar requests durante manutenção e implementar sistema de bypass.

**Pré-requisitos**:
- Task 1 (MaintenanceService) deve estar completa
- Verificar middleware existente para não quebrar funcionalidades

**Implementação**:
1. **Verificação de Manutenção**:
   - Check de status de manutenção em cada request
   - Cache do status para otimizar performance
   - Invalidação de cache baseada em mudanças

2. **Sistema de Bypass**:
   - Verificação de role de administrador
   - Cookie/header especial para bypass temporário
   - Logs de acessos durante manutenção

3. **Rotas Protegidas**:
   - Lista de rotas que devem funcionar durante manutenção
   - APIs essenciais (health check, auth)
   - Painel administrativo de manutenção

4. **Redirecionamento Inteligente**:
   - Redirect para `/maintenance` quando aplicável
   - Preservar query parameters quando necessário
   - Diferentes comportamentos por tipo de rota

5. **Performance**:
   - Edge runtime compatible
   - Minimal database calls
   - Efficient caching strategy

**Critérios de Aceitação**:
- [x] Middleware intercepta corretamente durante manutenção
- [x] Sistema de bypass funcionando para administradores
- [x] Performance não degradada (< 10ms overhead)
- [x] Compatibilidade com middleware existente
- [x] APIs essenciais continuam funcionando
- [x] Logs apropriados para debugging
- [x] Edge runtime compatible

**Contexto Referência**: Arquitetura seção 5.2.1 (linhas 948-964)

---

### Task 4: Painel de Controle de Manutenção
**Duração**: 12 horas
**Caminho**: `src/app/admin/blog/maintenance/page.tsx`
**MCPs/Ferramentas**: Context7, Supabase MCP
**Tecnologias**: Next.js App Router, TypeScript, Shadcn/ui, React Hook Form

**Descrição**: Criar interface administrativa completa para agendar, ativar e gerenciar manutenções.

**Pré-requisitos**:
- Tasks 1, 2 e 3 devem estar completas
- Layout admin deve existir
- Instalar componentes: `npx shadcn-ui@latest add calendar popover switch`

**Implementação**:
1. **Dashboard de Manutenção**:
   - Status atual do sistema (ativo/inativo)
   - Lista de manutenções agendadas
   - Histórico de manutenções passadas
   - Métricas de uptime/downtime

2. **Formulário de Agendamento**:
   - Título e descrição da manutenção
   - Date/time picker para início e fim
   - Seleção de serviços afetados
   - Templates de notificação personalizáveis
   - Preview da página de manutenção

3. **Controles de Ativação**:
   - Botão emergencial "Ativar Agora"
   - Cancelamento de manutenções agendadas
   - Extensão de tempo de manutenção ativa
   - Lista de usuários com bypass

4. **Gestão de Bypass**:
   - Adicionar/remover usuários do bypass
   - Bypass temporário com expiração
   - Logs de acessos durante manutenção
   - Notificações para usuários com bypass

5. **Notificações e Comunicação**:
   - Preview de emails de notificação
   - Teste de envio de notificações
   - Templates personalizáveis
   - Integração com canais de comunicação

**Critérios de Aceitação**:
- [x] Interface permite agendar manutenções completas
- [x] Ativação/desativação manual funcionando
- [x] Sistema de bypass gerenciável via interface
- [x] Preview da página de manutenção funcionando
- [x] Notificações testáveis via interface
- [x] Histórico e logs acessíveis
- [x] Validação completa de formulários
- [ ] Integração com sistema de alertas (Feature 1) (Pendente)

**Contexto Referência**: Especificação linhas 310-316

---

### Task 5: Database Schema e Migrations
**Duração**: 4 horas
**Caminho**: `database/migrations/add_maintenance_tables.sql`
**MCPs/Ferramentas**: Supabase MCP
**Tecnologias**: PostgreSQL, Supabase RLS

**Descrição**: Criar estrutura de banco de dados para gerenciar janelas de manutenção.

**Implementação**:
1. **Tabela maintenance_windows**:
   - Campos completos conforme interface MaintenanceWindow
   - Constraints apropriados para datas
   - Validação de status enum
   - Campos JSONB para configurações flexíveis

2. **Tabela maintenance_bypass_users**:
   - Relação com tabela de usuários
   - Expiração temporária de bypass
   - Logs de criação e uso

3. **RLS Policies**:
   - Acesso completo apenas para administradores
   - Leitura de status público para middleware
   - Auditoria de mudanças sensíveis

4. **Índices e Performance**:
   - Índice em status + datas para queries frequentes
   - Índice em bypass_users para verificações rápidas
   - Partial indexes para otimização

5. **Triggers e Automatizações**:
   - Trigger para atualizar status automaticamente
   - Limpeza de bypass expirados
   - Logs de auditoria

**Critérios de Aceitação**:
- [x] Schema compatível com estrutura Supabase existente
- [x] RLS policies restritivas e seguras
- [x] Índices otimizados para performance
- [x] Triggers funcionando corretamente
- [x] Migration script reversível
- [x] Validações de integridade completas

**Contexto Referência**: Arquitetura seção 6.4 (linhas 1068-1106)

---

### Task 6: Sistema de Degradação Graceful
**Duração**: 8 horas
**Caminho**: `src/lib/blog/graceful-degradation.ts`
**MCPs/Ferramentas**: Context7, Sequential Thinking
**Tecnologias**: TypeScript, Error Handling, Service Workers

**Descrição**: Implementar sistema que mantém funcionalidades essenciais durante problemas parciais do sistema.

**Implementação**:
1. **Detector de Serviços**:
   - Health check de serviços individuais
   - Categorização por criticidade (crítico, importante, opcional)
   - Cache de status para performance

2. **Sistema de Fallbacks**:
   - Fallback para funcionalidades offline
   - Modo degradado com funcionalidades limitadas
   - Queue de operações para execução posterior

3. **Interface de Degradação**:
   - Notificações discretas sobre limitações
   - UI adaptada para funcionalidades disponíveis
   - Feedback claro sobre indisponibilidades

4. **Recovery Automático**:
   - Monitoring contínuo de serviços
   - Reativação automática quando serviços voltam
   - Processamento de queue acumulada

5. **Integração com Manutenção**:
   - Coordenação com sistema de manutenção
   - Degradação preventiva antes de manutenções
   - Logs consolidados para análise

**Critérios de Aceitação**:
- [x] Detecção automática de falhas parciais
- [x] Fallbacks funcionando para serviços críticos
- [x] UI adapta-se gracefully a limitações
- [x] Recovery automático quando serviços voltam
- [x] 80% das funcionalidades mantidas durante degradação
- [x] Logs estruturados para debugging
- [x] Performance não impactada durante operação normal

**Contexto Referência**: Especificação linhas 318-324

---

## Dependências Técnicas

### Environment Variables Necessárias
```bash
# .env.local
MAINTENANCE_BYPASS_SECRET=
MAINTENANCE_NOTIFICATION_EMAIL=
NEXT_PUBLIC_MAINTENANCE_ENABLED=true
MAINTENANCE_CHECK_INTERVAL=60000
MAINTENANCE_CACHE_TTL=300
```

### Componentes Shadcn/ui Necessários
```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add button
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
```

### Dependências NPM Adicionais
```json
{
  "dependencies": {
    "date-fns": "^3.0.0",
    "framer-motion": "^10.16.0",
    "@types/node-cron": "^3.0.11",
    "node-cron": "^3.0.3"
  }
}
```

## Critérios de Aceitação Globais

### Funcionalidade
- [x] Modo de manutenção pode ser ativado/desativado remotamente em < 30 segundos
- [x] Sistema de bypass funcionando para administradores
- [x] Notificações automáticas enviadas para usuários
- [x] Interface de usuário clara e informativa durante manutenção
- [x] Agendamento de manutenções funcionando completamente

### Performance
- [x] Verificação de manutenção adiciona < 10ms por request
- [x] Cache eficiente de status para reduzir database calls
- [x] Edge middleware compatible para máxima performance
- [x] Recovery automático funciona em < 1 minuto após resolução

### UX/UI
- [x] Interface de manutenção profissional e consistente
- [x] Countdown em tempo real funcionando
- [x] Informações claras sobre duração e motivo
- [x] Opções de contato alternativo disponíveis
- [x] Design responsivo em todos os dispositivos

### Segurança
- [x] Bypass apenas para usuários autorizados
- [x] Logs de auditoria para todas as ativações
- [x] Validação server-side de todas as operações
- [x] Rate limiting para APIs de configuração

## Dependências de Outras Features

### Relacionadas
- **Feature 1** (Sistema de Alertas): Alertas devem ser enviados quando manutenção é ativada
- **Feature 2** (Interface Admin): Painel de manutenção integrado ao layout admin
- **Feature 8** (Monitoramento): Métricas de uptime/downtime integradas

### Bloqueadores
- Middleware existente deve ser preservado
- Database schema deve suportar novas tabelas
- Sistema de email deve estar configurado para notificações

## Notas de Implementação

### Padrões de Código
- Edge Runtime compatible para middleware
- TypeScript strict mode obrigatório
- Error boundaries para todos os componentes
- Logs estruturados com contexto apropriado

### Otimizações
- Cache do status de manutenção com TTL configurável
- Minimal database calls no middleware
- Service Workers para funcionalidades offline
- Real-time updates via Supabase subscriptions

### Testing
- Unit tests para MaintenanceService
- Integration tests para middleware
- E2E tests para fluxo completo de manutenção
- Performance tests para overhead do middleware
- Chaos engineering para testar degradação graceful