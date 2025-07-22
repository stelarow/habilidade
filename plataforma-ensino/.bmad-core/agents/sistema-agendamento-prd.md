# Sistema de Agendamento Aprimorado - PRD

## Informações do Projeto
- **Nome do Projeto**: Aprimoramento do Sistema de Agendamento da Plataforma Habilidade
- **Versão do Documento**: v1.0
- **Data**: 2025-01-22
- **Product Manager**: [Nome do PM]
- **Technical Lead**: [Nome do Tech Lead]
- **Stakeholders**: Equipe Pedagógica, Administradores, Professores, Alunos

## Resumo Executivo

Este projeto visa aprimorar significativamente o sistema de agendamento da Plataforma Habilidade, introduzindo calendários individuais para professores e um sistema robusto de gerenciamento de feriados. As melhorias permitirão maior flexibilidade no agendamento, cálculos precisos de datas de conclusão de cursos e melhor gestão administrativa dos recursos pedagógicos.

O projeto impacta diretamente na experiência do usuário ao agendar aulas, na eficiência operacional dos professores e na precisão dos cronogramas de curso, resultando em melhor planejamento e satisfação geral dos usuários.

## Análise do Estado Atual

### Visão Geral do Sistema Existente
- **Stack Tecnológico**: Next.js 14 + TypeScript + Supabase
- **Arquitetura**: App Router com Server Components
- **Base de Usuários**: Alunos, professores e administradores da Escola Habilidade
- **Métricas de Performance**: Sistema de agendamento básico sem personalização por professor

### Limitações e Pontos de Dor
1. **Dívida Técnica**
   - Sistema de agendamento genérico sem considerar especificidades dos professores
   - Ausência de cálculos automatizados considerando feriados
   - Calendário único para todos os professores

2. **Problemas de Experiência do Usuário**
   - Impossibilidade de escolher professor específico durante agendamento
   - Falta de transparência sobre vagas disponíveis por professor
   - Datas de término imprecisas nos cursos

3. **Restrições de Negócio**
   - Gestão manual de feriados e seus impactos nos cronogramas
   - Dificuldade em planejar cursos considerando capacidade individual dos professores
   - Ausência de diferenciação entre modalidades de ensino no cálculo de duração

## Objetivos e Critérios de Sucesso

### Objetivos Primários
1. **Personalização por Professor**: Implementar calendários individuais com capacidades específicas para cada professor
2. **Automação de Cálculos**: Desenvolver sistema automático de cálculo de datas considerando feriados e modalidades
3. **Gestão Administrativa**: Criar interface completa para gerenciamento de feriados e configurações

### Métricas de Sucesso
- **Performance**: Tempo de carregamento do calendário < 2 segundos após seleção do professor
- **Satisfação do Usuário**: Redução em 80% das consultas sobre datas de término de curso
- **Impacto no Negócio**: Aumento de 25% na precisão dos cronogramas de curso
- **Técnico**: Cobertura de testes > 85% para funcionalidades críticas

## Escopo e Restrições

### No Escopo
- Calendários individuais para cada professor (FR1)
- Seletor de professor no agendamento (FR2)
- Calendário condicional pós-seleção (FR3)
- Sistema de vagas por professor (FR4)
- Cálculo automático de datas com feriados (FR5)
- Ajuste para cursos presenciais (FR6)
- Interface admin para feriados (FR7-FR10)

### Fora do Escopo
- Sistema de notificações por email/SMS
- Integração com calendários externos (Google, Outlook)
- Sistema de pagamento online
- Funcionalidades de videochamada

### Restrições
- **Técnicas**: Utilizar stack atual Next.js + Supabase, manter compatibilidade com sistema existente
- **Recursos**: 4 semanas para desenvolvimento, 1 desenvolvedor full-stack
- **Negócio**: Não interromper funcionamento atual durante migração

## Abordagem da Solução

### Estratégia
Implementação incremental em 3 fases principais:
1. **Fase 1**: Infraestrutura de dados (database schema, feriados)
2. **Fase 2**: Lógica de negócio (APIs, cálculos)
3. **Fase 3**: Interface do usuário (componentes, admin)

### Plano de Migração/Aprimoramento
1. **Fase 1** (Semana 1): Estrutura de dados e população inicial
2. **Fase 2** (Semana 2): APIs e lógica backend
3. **Fase 3** (Semanas 3-4): Frontend e interfaces de usuário

### Mitigação de Riscos
- **Risco 1**: Quebra do sistema existente → **Mitigação**: Desenvolvimento em branch separada, testes extensivos
- **Risco 2**: Performance degradada → **Mitigação**: Implementar caching, otimizar queries
- **Risco 3**: Resistência dos usuários → **Mitigação**: Interface intuitiva, documentação clara

## Requisitos Funcionais

### Funcionalidades Principais

#### 1. Sistema de Calendários Individuais (FR1-FR4)
- **Descrição**: Cada professor terá calendário próprio com configurações específicas
- **Critérios de Aceitação**: 
  - Professores podem definir horários de disponibilidade
  - Seletor dropdown funcional na página de agendamento
  - Calendário só aparece após seleção de professor
  - Vagas exibem capacidade específica do professor selecionado
- **Prioridade**: Alta

#### 2. Cálculo Automático de Datas (FR5-FR6)
- **Descrição**: Sistema calcula automaticamente data de término considerando feriados
- **Critérios de Aceitação**:
  - Cálculo preciso baseado em carga horária e feriados cadastrados
  - Ajuste automático para cursos presenciais (2 aulas/semana)
  - Exclusão de feriados do cronograma
- **Prioridade**: Alta

#### 3. Gerenciamento de Feriados (FR7-FR10)
- **Descrição**: Interface administrativa completa para gestão de feriados
- **Critérios de Aceitação**:
  - Área específica no painel admin
  - Feriados nacionais pré-carregados
  - Funcionalidades de adicionar/excluir feriados
  - Organização por ano específico
- **Prioridade**: Média

### User Stories
- Como **aluno**, quero selecionar um professor específico para que eu possa ver apenas os horários que ele oferece
- Como **aluno**, quero ver quantas vagas estão disponíveis com cada professor para que eu possa tomar uma decisão informada
- Como **administrador**, quero gerenciar feriados facilmente para que os cronogramas sejam sempre precisos
- Como **professor**, quero definir minha própria capacidade de alunos para que eu possa gerenciar melhor minhas turmas

## Requisitos Técnicos

### Requisitos de Performance
- **Tempo de Resposta**: Carregamento de calendário < 2s, APIs < 500ms
- **Throughput**: Suportar 50 usuários simultâneos no agendamento
- **Disponibilidade**: 99.5% uptime durante horário comercial
- **Escalabilidade**: Suportar até 100 professores e 10 anos de feriados

### Requisitos de Segurança
- **Autenticação**: Utilizar sistema Supabase Auth existente
- **Autorização**: RLS policies para acesso a dados de professores e feriados
- **Proteção de Dados**: Validação de inputs, sanitização de dados
- **Compliance**: Manter conformidade com LGPD existente

### Requisitos de Integração
- **APIs Internas**: Integração com sistema de usuários e cursos existente
- **Banco de Dados**: Extensão do schema Supabase atual
- **Migração de Dados**: Preservar agendamentos existentes durante transição

## Requisitos de Experiência do Usuário

### Interface do Usuário
- **Sistema de Design**: Manter consistência com design system Habilidade
- **Acessibilidade**: WCAG 2.1 AA compliance
- **Design Responsivo**: Funcional em desktop, tablet e mobile
- **Suporte de Browser**: Chrome, Firefox, Safari, Edge (últimas 2 versões)

### Melhorias na Jornada do Usuário
1. **Jornada Atual**: Selecionar curso → Ver calendário genérico → Agendar
2. **Jornada Aprimorada**: Selecionar curso → Escolher professor → Ver calendário personalizado → Ver vagas disponíveis → Agendar

## Plano de Implementação

### Cronograma
| Fase | Duração | Data Início | Data Fim | Principais Entregas |
|------|---------|-------------|----------|---------------------|
| Fase 1 | 1 semana | 2025-01-22 | 2025-01-29 | Schema DB, população de feriados, APIs básicas |
| Fase 2 | 1 semana | 2025-01-29 | 2025-02-05 | Lógica de cálculos, APIs de professores |
| Fase 3 | 2 semanas | 2025-02-05 | 2025-02-19 | Componentes React, interface admin, testes |

### Recursos Necessários
- **Desenvolvimento**: 1 desenvolvedor full-stack (Next.js + Supabase)
- **Design**: Utilizar sistema existente, sem necessidade de designer dedicado
- **QA**: Testes automatizados + validação manual
- **DevOps**: Utilizar infraestrutura Supabase existente

### Dependências
- Acesso ao banco de dados Supabase de produção para migration
- Lista oficial de feriados nacionais brasileiros
- Validação das regras de negócio com equipe pedagógica

## Estratégia de Testes

### Abordagem de Testes
- **Testes Unitários**: Cobertura > 85% para funções de cálculo de datas
- **Testes de Integração**: Validação das APIs com banco de dados
- **Testes de Performance**: Carga no sistema de agendamento
- **Testes de Aceitação**: Validação com usuários reais (professores e alunos)

### Plano de Rollback
- Manter versão atual em branch separada
- Scripts de reversão de migrations prontos
- Backup completo antes do deploy de produção

## Estratégia de Lançamento

### Abordagem de Deploy
- **Ambiente de Staging**: Testes completos antes da produção
- **Deploy de Produção**: Deploy incremental com feature flags
- **Monitoramento**: Sentry para erros, métricas de performance customizadas

### Plano de Comunicação
- **Interno**: Treinamento para equipe administrativa e professores
- **Externo**: Comunicado aos alunos sobre novas funcionalidades, tutorial de uso

## Manutenção e Suporte

### Suporte Pós-Lançamento
- **Monitoramento**: Dashboards para uso do sistema, performance das APIs
- **Manutenção**: Atualização anual da lista de feriados
- **Processo de Suporte**: Integração com canal de suporte existente

### Melhorias Futuras
- Integração com calendários externos (Google Calendar, Outlook)
- Sistema de notificações automáticas
- Relatórios avançados de utilização por professor
- API pública para integrações terceiras

## Implementação Técnica Detalhada

### Schema de Banco de Dados

```sql
-- Nova tabela para feriados
CREATE TABLE holidays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  is_national BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extensão da tabela de professores
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS max_students_per_class INTEGER DEFAULT 10;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS calendar_settings JSONB DEFAULT '{}';

-- Nova tabela para disponibilidade dos professores
CREATE TABLE teacher_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_students INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_holidays_date ON holidays(date);
CREATE INDEX idx_holidays_year ON holidays(year);
CREATE INDEX idx_teacher_availability_teacher ON teacher_availability(teacher_id);
CREATE INDEX idx_teacher_availability_day ON teacher_availability(day_of_week);
```

### Feriados Nacionais 2025 (Pré-carregamento)

```sql
INSERT INTO holidays (date, name, year, is_national) VALUES
('2025-01-01', 'Confraternização Universal', 2025, true),
('2025-03-03', 'Carnaval', 2025, true),
('2025-03-04', 'Carnaval', 2025, true),
('2025-04-18', 'Sexta-feira Santa', 2025, true),
('2025-04-21', 'Tiradentes', 2025, true),
('2025-05-01', 'Dia do Trabalhador', 2025, true),
('2025-09-07', 'Independência do Brasil', 2025, true),
('2025-10-12', 'Nossa Senhora Aparecida', 2025, true),
('2025-11-02', 'Finados', 2025, true),
('2025-11-15', 'Proclamação da República', 2025, true),
('2025-12-25', 'Natal', 2025, true);
```

### APIs Principais

#### 1. API de Feriados
```typescript
// GET /api/holidays?year=2025
// POST /api/holidays (admin only)
// DELETE /api/holidays/[id] (admin only)
```

#### 2. API de Professores
```typescript
// GET /api/teachers/availability
// GET /api/teachers/[id]/calendar
// POST /api/teachers/[id]/availability (admin only)
```

#### 3. API de Cálculos
```typescript
// POST /api/calculate-end-date
// Body: { startDate, courseHours, weeklyClasses, teacherId }
```

### Componentes React Principais

#### 1. TeacherSelector Component
```typescript
interface TeacherSelectorProps {
  onTeacherSelect: (teacherId: string) => void;
  selectedTeacherId?: string;
}
```

#### 2. ConditionalCalendar Component
```typescript
interface ConditionalCalendarProps {
  teacherId?: string;
  courseId: string;
  onTimeSlotSelect: (slot: TimeSlot) => void;
}
```

#### 3. HolidayManager Component (Admin)
```typescript
interface HolidayManagerProps {
  year: number;
  onYearChange: (year: number) => void;
}
```

### Utilities para Cálculos

```typescript
// src/utils/dateCalculations.ts
export function calculateCourseEndDate(
  startDate: Date,
  courseHours: number,
  weeklyClasses: number,
  holidays: Date[]
): Date {
  const totalWeeks = Math.ceil(courseHours / weeklyClasses);
  let currentDate = new Date(startDate);
  let validWeeksCount = 0;
  
  while (validWeeksCount < totalWeeks) {
    currentDate.setDate(currentDate.getDate() + 7);
    
    const weekHasHoliday = holidays.some(holiday => 
      isDateInSameWeek(holiday, currentDate)
    );
    
    if (!weekHasHoliday) {
      validWeeksCount++;
    }
  }
  
  return currentDate;
}
```

## Apêndices

### A. Diagramas de Arquitetura
[Incluir diagramas de fluxo do sistema de agendamento]

### B. Fluxos de Usuário
[Incluir mapeamentos das jornadas antes e depois]

### C. Modelos de Dados
[Incluir ERD do banco de dados atualizado]

### D. Especificações de API
[Incluir documentação OpenAPI/Swagger]

---

**Status do Documento**: Aprovado para Implementação  
**Última Atualização**: 2025-01-22  
**Próxima Revisão**: 2025-02-05