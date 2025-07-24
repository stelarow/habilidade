# 4. Modelos de Dados e Alterações de Esquema

Para suportar o agendamento de aulas presenciais, propomos a introdução de um novo modelo de dados, `StudentSchedule`, e pequenas modificações na tabela `enrollments`.

## 4.1. Novos Modelos de Dados

### **StudentSchedule**
*   **Propósito:** Armazenar os dias e horários recorrentes das aulas para uma matrícula de um aluno presencial. Cada registro representa uma aula semanal.
*   **Integração:** Será diretamente relacionado à tabela `enrollments` existente.

*   **Atributos Chave:**
    *   `id`: `uuid` - Chave primária.
    *   `enrollment_id`: `uuid` - Chave estrangeira para `enrollments.id`.
    *   `instructor_id`: `uuid` - Chave estrangeira para `instructors.id`.
    *   `day_of_week`: `integer` - Dia da semana (ex: 1 para Segunda, 7 para Domingo).
    *   `start_time`: `time` - Horário de início da aula (ex: '14:00:00').
    *   `end_time`: `time` - Horário de término da aula (ex: '15:00:00').

*   **Relacionamentos:**
    *   **Com Existente:** Muitos-para-Um com `enrollments` (uma matrícula pode ter vários agendamentos).
    *   **Com Novo:** Nenhum.

## 4.2. Estratégia de Integração do Esquema

*   **Alterações no Banco de Dados Necessárias:**
    *   **Novas Tabelas:** `student_schedules`.
    *   **Tabelas Modificadas:** Adicionar uma coluna `modality` (`text`, ex: 'online' ou 'in-person') à tabela `enrollments` para facilitar a filtragem e a aplicação de lógica.
    *   **Novos Índices:** Um índice em `student_schedules(enrollment_id)` para buscas rápidas.
    *   **Estratégia de Migração:** Uma nova migração de banco de dados SQL será criada para adicionar a tabela `student_schedules` e a nova coluna na tabela `enrollments`.

*   **Compatibilidade com Versões Anteriores:**
    *   A nova coluna `modality` na tabela `enrollments` terá um valor padrão de `'online'` ou será anulável, garantindo que as matrículas existentes continuem a funcionar sem alterações.
    *   A nova tabela `student_schedules` não afeta os dados existentes.

---