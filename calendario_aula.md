# Sistema de Calendário de Aulas - Especificações

## 1. PLANO GERAL - O QUE QUEREMOS

### 1.1 Objetivo Principal
Criar um sistema de calendário visual que mostre a semana do professor com todos os alunos ativos organizados por dia e horário, preenchido automaticamente com base nas matrículas dos alunos.

### 1.2 Funcionalidades Essenciais

#### 1.2.1 Visualização do Calendário
- Interface visual mostrando a semana completa do professor
- Divisão por dias (Segunda a Sábado)
- Divisão por horários predefinidos:
  - 08:00 às 10:00
  - 10:00 às 12:00
  - 13:30 às 15:30
  - 15:30 às 17:30
  - 18:00 às 20:00
  - 20:00 às 22:00

#### 1.2.2 Preenchimento Automático
- Calendário preenchido automaticamente baseado em matrículas ativas
- Atualização em tempo real quando houver mudanças nas matrículas

#### 1.2.3 Gestão de Matrículas
- Campo de data de início do aluno
- Opção de modalidade presencial
- Seleção de horários para aulas presenciais
- Opção de duas aulas semanais (reduz duração do curso pela metade)

#### 1.2.4 Gestão de Cursos
- Campo de duração do curso
- Cálculo automático de data de término

#### 1.2.5 Gestão de Feriados
- Interface para cadastro/edição/remoção de feriados nacionais brasileiros
- Integração com o calendário para ajuste automático

#### 1.2.6 Limite de Turma
- Configuração de limite de alunos por professor
- Bloqueio de novas matrículas quando turma estiver cheia

#### 1.2.7 Sistema de Notificações
- Alerta 1 mês antes do término do curso
- Notificação quando aluno conclui o curso
- Opção de extensão do prazo

## 2. DESIGN DA SOLUÇÃO

### 2.1 Arquitetura do Sistema

#### 2.1.1 Banco de Dados - Novas Tabelas

```sql
-- Tabela de configuração de horários disponíveis
CREATE TABLE schedule_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 6), -- 1=Segunda, 6=Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_label VARCHAR(50) NOT NULL, -- Ex: "08:00 às 10:00"
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de feriados
CREATE TABLE holidays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de limites de turma por professor
CREATE TABLE teacher_class_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES profiles(id),
  max_students INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agendamento de aulas
CREATE TABLE class_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id),
  schedule_slot_id UUID NOT NULL REFERENCES schedule_slots(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.1.2 Atualizações em Tabelas Existentes

```sql
-- Atualizar tabela de cursos
ALTER TABLE courses 
ADD COLUMN duration_months INTEGER,
ADD COLUMN is_presencial_available BOOLEAN DEFAULT false;

-- Atualizar tabela de matrículas
ALTER TABLE enrollments
ADD COLUMN start_date DATE NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN end_date DATE,
ADD COLUMN is_presencial BOOLEAN DEFAULT false,
ADD COLUMN has_double_schedule BOOLEAN DEFAULT false,
ADD COLUMN extension_months INTEGER DEFAULT 0;
```

### 2.2 Componentes da Interface

#### 2.2.1 Página Principal do Calendário
- **CalendarView**: Componente principal que renderiza a semana
- **WeekHeader**: Cabeçalho com dias da semana
- **TimeSlotGrid**: Grade de horários
- **StudentCard**: Card individual de cada aluno no slot
- **TeacherSelector**: Seletor de professor (para admin)

#### 2.2.2 Página de Gestão de Feriados
- **HolidaysList**: Lista de feriados cadastrados
- **HolidayForm**: Formulário para adicionar/editar feriado
- **HolidayCalendar**: Visualização em calendário

#### 2.2.3 Página de Configuração
- **TeacherLimitsForm**: Configurar limite de alunos por professor
- **ScheduleSlotManager**: Gerenciar horários disponíveis

#### 2.2.4 Componentes de Matrícula (Atualizações)
- **EnrollmentForm**: Adicionar campos de data início e modalidade
- **ScheduleSelector**: Seletor de horários para aulas presenciais
- **DoubleScheduleOption**: Opção para duas aulas semanais

### 2.3 Fluxos de Dados

#### 2.3.1 Fluxo de Preenchimento do Calendário
1. Buscar matrículas ativas com modalidade presencial
2. Buscar agendamentos de aulas (class_schedules)
3. Agrupar por professor, dia e horário
4. Verificar limites de turma
5. Renderizar no calendário

#### 2.3.2 Fluxo de Matrícula Presencial
1. Selecionar curso com opção presencial
2. Marcar modalidade presencial
3. Selecionar horário(s) disponível(is)
4. Verificar disponibilidade (limite de turma)
5. Criar registro em class_schedules
6. Calcular data fim baseado na duração

#### 2.3.3 Fluxo de Notificações
1. Job diário verifica matrículas próximas do fim (30 dias)
2. Marca alunos para notificação
3. Ao abrir calendário, exibe alertas
4. Opção de extensão atualiza end_date

### 2.4 Validações e Regras de Negócio

#### 2.4.1 Regras de Agendamento
- Não permitir agendamento em horário já cheio
- Validar conflito de horários para mesmo aluno
- Respeitar feriados (opcional: reagendar ou pular)

#### 2.4.2 Regras de Duração
- Duas aulas semanais = duração / 2
- Extensão soma meses à data fim original
- Recalcular considerando feriados

#### 2.4.3 Regras de Limite
- Verificar antes de permitir nova matrícula
- Bloquear slots cheios na interface
- Permitir lista de espera (futuro)

## 3. TASKS ORGANIZADAS POR DEPENDÊNCIAS

### Fase 1: Preparação do Banco de Dados
**Tasks fundamentais que precisam ser feitas primeiro**

1. **Task 1.1**: Criar migrations para novas tabelas
   - schedule_slots
   - holidays
   - teacher_class_limits
   - class_schedules

2. **Task 1.2**: Criar migrations para alterações em tabelas existentes
   - Adicionar campos em courses
   - Adicionar campos em enrollments

3. **Task 1.3**: Popular tabela schedule_slots com horários padrão
   - Inserir os 6 slots de horário para cada dia da semana

4. **Task 1.4**: Criar funções e triggers no banco
   - Trigger para calcular end_date automaticamente
   - Função para verificar disponibilidade de slot

### Fase 2: Backend - APIs e Lógica de Negócio
**Tasks que dependem do banco estar pronto**

5. **Task 2.1**: Criar API de gestão de feriados
   - GET /api/holidays
   - POST /api/holidays
   - PUT /api/holidays/:id
   - DELETE /api/holidays/:id

6. **Task 2.2**: Criar API de configuração de professores
   - GET /api/teachers/limits
   - PUT /api/teachers/:id/limit

7. **Task 2.3**: Atualizar API de cursos
   - Adicionar campos duration_months e is_presencial_available
   - Validações nos endpoints existentes

8. **Task 2.4**: Atualizar API de matrículas
   - Adicionar lógica para modalidade presencial
   - Endpoint para criar agendamentos
   - Validação de disponibilidade

9. **Task 2.5**: Criar API do calendário
   - GET /api/calendar/week/:teacherId
   - GET /api/calendar/availability/:slotId
   - POST /api/calendar/extend-enrollment

### Fase 3: Frontend - Componentes Base
**Tasks que podem começar em paralelo com o backend**

10. **Task 3.1**: Criar estrutura de páginas
    - /admin/calendar
    - /admin/holidays
    - /admin/settings/teachers

11. **Task 3.2**: Implementar componentes do calendário
    - CalendarView (container principal)
    - WeekHeader
    - TimeSlotGrid
    - StudentCard

12. **Task 3.3**: Implementar gestão de feriados
    - HolidaysList
    - HolidayForm
    - Integração com API

13. **Task 3.4**: Atualizar formulário de matrícula
    - Adicionar campos de modalidade
    - ScheduleSelector component
    - Validação de disponibilidade

### Fase 4: Integração e Funcionalidades Avançadas
**Tasks que dependem das fases anteriores**

14. **Task 4.1**: Integrar calendário com dados reais
    - Conectar com APIs
    - Implementar atualização em tempo real

15. **Task 4.2**: Implementar sistema de notificações
    - Componente de alertas
    - Lógica de verificação de prazos
    - Modal de extensão de curso

16. **Task 4.3**: Implementar validações visuais
    - Slots cheios em vermelho
    - Indicadores de capacidade
    - Tooltips informativos

17. **Task 4.4**: Implementar filtros e visualizações
    - Filtro por professor
    - Visão mensal (futuro)
    - Exportação de dados

### Fase 5: Testes e Refinamentos
**Tasks finais de qualidade**

18. **Task 5.1**: Testes unitários
    - APIs
    - Componentes
    - Validações

19. **Task 5.2**: Testes de integração
    - Fluxo completo de matrícula presencial
    - Gestão de feriados
    - Notificações

20. **Task 5.3**: Ajustes de UX/UI
    - Responsividade
    - Feedback visual
    - Performance

### Ordem de Execução Recomendada

**Semana 1**: Fase 1 completa (Tasks 1.1 - 1.4)
**Semana 2**: Fase 2 Tasks 2.1 - 2.3 + Início Fase 3 (Tasks 3.1 - 3.2)
**Semana 3**: Fase 2 Tasks 2.4 - 2.5 + Fase 3 Tasks 3.3 - 3.4
**Semana 4**: Fase 4 completa (Tasks 4.1 - 4.4)
**Semana 5**: Fase 5 completa (Tasks 5.1 - 5.3)

### Dependências Críticas

- **Nenhuma task da Fase 2 pode começar antes da Fase 1**
- **Task 3.4 depende de Task 2.3**
- **Toda Fase 4 depende de pelo menos 80% das Fases 2 e 3**
- **Task 4.2 depende especificamente de Task 2.5**

### Considerações Importantes

1. **Performance**: O calendário deve carregar rapidamente mesmo com muitos alunos
2. **Responsividade**: Deve funcionar bem em tablets para professores
3. **Acessibilidade**: Navegação por teclado e leitores de tela
4. **Segurança**: Apenas admin pode configurar limites e feriados
5. **Backup**: Implementar soft delete para dados críticos