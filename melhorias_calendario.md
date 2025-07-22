# Melhorias do Sistema de Calendário - Escola Habilidade

## Visão Geral
Este documento descreve as melhorias necessárias no sistema de calendário da plataforma de ensino, focando em funcionalidades administrativas para gerenciamento de professores, alunos e agendamentos.

## 1. Calendários Únicos por Professor

### Requisito
Como administrador da escola, preciso que cada professor tenha seu próprio calendário único e independente.

### Implementação Proposta
- [ ] Modificar a visualização do calendário para filtrar por `teacher_id`
- [ ] Garantir que cada professor veja apenas seus próprios compromissos
- [ ] Implementar isolamento de dados por professor no banco de dados

### Benefícios
- Melhor organização dos horários de cada professor
- Evita conflitos de agendamento entre professores
- Facilita o gerenciamento individual de disponibilidade

## 2. Seletor de Professor no Calendário

### Requisito
Como administrador, preciso de um botão/dropdown no calendário para escolher qual professor visualizar.

### Implementação Proposta
- [ ] Adicionar componente de seleção de professor na tela do calendário
- [ ] Implementar filtro dinâmico baseado no professor selecionado
- [ ] Carregar lista de professores ativos do banco de dados
- [ ] Manter estado do professor selecionado durante a navegação

### Interface Sugerida
```
[Dropdown: Selecione o Professor ▼]
- Prof. João Silva
- Prof. Maria Santos
- Prof. Carlos Oliveira
```

## 3. Limite de Alunos por Professor

### Requisito
O número de vagas disponíveis em cada horário deve ser específico por professor, não global.

### Implementação Proposta
- [ ] Adicionar campo `max_students_per_slot` na tabela de professores ou criar tabela de configuração
- [ ] Modificar a lógica de contagem de vagas para considerar o professor
- [ ] Atualizar a interface de matrícula para mostrar vagas por professor
- [ ] Implementar validação no backend considerando limite por professor

### Estrutura de Dados
```sql
-- Opção 1: Campo na tabela users (para professores)
ALTER TABLE users ADD COLUMN max_students_per_slot INTEGER DEFAULT 3;

-- Opção 2: Tabela separada de configurações
CREATE TABLE teacher_settings (
  teacher_id UUID REFERENCES users(id),
  max_students_per_slot INTEGER DEFAULT 3,
  -- outras configurações específicas do professor
);
```

## 4. Seleção Obrigatória de Professor na Matrícula

### Requisito
Durante a matrícula, deve ser obrigatório selecionar primeiro o professor antes de escolher o horário.

### Implementação Proposta
- [ ] Reordenar o formulário de matrícula: Professor → Horário
- [ ] Desabilitar seleção de horário até que um professor seja escolhido
- [ ] Carregar horários disponíveis apenas do professor selecionado
- [ ] Mostrar apenas slots com vagas para o professor específico

### Fluxo de Interface
1. Selecionar curso
2. **Selecionar professor** (novo passo obrigatório)
3. Selecionar modalidade (presencial/online)
4. Selecionar horários (filtrados por professor)

## 5. Cálculo Automático de Data de Término

### Requisito
Como administrador, preciso que a data de término seja calculada automaticamente considerando:
- Duração do curso
- Calendário de feriados nacionais
- Frequência das aulas (1x ou 2x por semana)

### Implementação Proposta
- [ ] Criar tabela de feriados no banco de dados
- [ ] Implementar função de cálculo que:
  - Some a duração do curso em semanas
  - Pule feriados e finais de semana (se aplicável)
  - Considere a frequência semanal das aulas
- [ ] Exibir data prevista de término no momento da matrícula
- [ ] Permitir ajuste manual se necessário

### Algoritmo de Cálculo
```typescript
function calcularDataTermino(
  dataInicio: Date,
  duracaoCursoSemanas: number,
  frequenciaSemanal: number,
  feriados: Date[]
): Date {
  // Calcular número total de aulas
  const totalAulas = duracaoCursoSemanas * frequenciaSemanal;
  
  // Iterar pelos dias, pulando feriados
  // Retornar data final
}
```

## 6. Gerenciamento de Feriados

### Requisito
Como administrador, preciso visualizar, adicionar e excluir feriados do calendário.

### Implementação Proposta
- [ ] Criar interface administrativa para feriados
- [ ] Implementar CRUD completo (Create, Read, Update, Delete)
- [ ] Categorizar feriados (nacional, estadual, municipal, escolar)
- [ ] Importar feriados nacionais automaticamente
- [ ] Permitir feriados recorrentes (ex: toda sexta-feira santa)

### Estrutura da Tabela
```sql
CREATE TABLE holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'national', 'state', 'city', 'school'
  recurring BOOLEAN DEFAULT FALSE,
  recurring_rule VARCHAR(255), -- para feriados móveis
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Índice para busca eficiente
CREATE INDEX idx_holidays_date ON holidays(date);
```

### Interface de Gerenciamento
```
Feriados e Datas Especiais
[+ Adicionar Feriado]

| Data       | Feriado                | Tipo     | Ações        |
|------------|------------------------|----------|--------------|
| 01/01/2025 | Ano Novo              | Nacional | [Editar] [X] |
| 21/04/2025 | Tiradentes            | Nacional | [Editar] [X] |
| 01/05/2025 | Dia do Trabalho       | Nacional | [Editar] [X] |
| 15/07/2025 | Recesso Escolar       | Escolar  | [Editar] [X] |
```

## Priorização das Melhorias

### Fase 1 - Essencial (1-2 semanas)
1. Seleção obrigatória de professor na matrícula
2. Calendários únicos por professor
3. Seletor de professor no calendário

### Fase 2 - Importante (2-3 semanas)
4. Limite de alunos por professor
5. Tabela básica de feriados
6. Cálculo automático de data de término

### Fase 3 - Melhorias (1-2 semanas)
7. Interface completa de gerenciamento de feriados
8. Importação automática de feriados
9. Relatórios e dashboards por professor

## Considerações Técnicas

### Banco de Dados
- Adicionar índices apropriados para queries por professor
- Garantir integridade referencial
- Implementar soft delete para feriados

### Performance
- Cachear lista de professores
- Paginar resultados do calendário
- Otimizar queries com JOINs

### Segurança
- Validar permissões de admin para todas as operações
- Audit log para mudanças em feriados
- Rate limiting em APIs

### UX/UI
- Loading states durante carregamento
- Feedback visual para ações
- Responsividade em todos os componentes

## Métricas de Sucesso
- Redução de 90% em conflitos de agendamento
- Tempo médio de matrícula < 3 minutos
- Zero erros de cálculo de data de término
- Satisfação dos professores > 4.5/5

---

*Documento criado em: 21/01/2025*
*Última atualização: 21/01/2025*