# 13. Próximos Passos

Após a conclusão desta arquitetura brownfield, as próximas etapas se concentram na tradução deste design em histórias de usuário acionáveis e na orientação da equipe de desenvolvimento.

## 13.1. Handoff para o Gerente de Histórias (Scrum Master)

Prezado Gerente de Histórias,

Este documento de arquitetura detalha o aprimoramento da página de matrícula de administrador com agendamento condicional. Ele serve como o blueprint técnico para a implementação do PRD "Admin Enrollment Page Enhancement with Conditional Scheduling".

**Pontos Chave para a Criação de Histórias:**

*   **Referência:** Consulte este documento de arquitetura (`docs/architecture.md`) para todos os detalhes técnicos.
*   **Requisitos de Integração:** A implementação deve focar na integração perfeita dos novos componentes (`SchedulingSection`, `TeacherSelector`, `ConditionalCalendar`) na página de matrícula existente, estendendo a API de matrícula e criando a nova tabela `student_schedules`.
*   **Restrições do Sistema Existente:** Lembre-se que o projeto é um brownfield. A implementação deve aderir estritamente ao stack Next.js/React/Supabase/Tailwind existente e seguir as convenções de código e segurança.
*   **Primeira História Sugerida:**
    *   **Título:** "Como Administrador, quero ver a seção de agendamento condicional na página de matrícula para alunos presenciais."
    *   **Critérios de Aceitação:**
        *   A caixa "Curso Presencial" é exibida na página de matrícula.
        *   Quando marcada, a seção de agendamento (`SchedulingSection`) é exibida, contendo o `TeacherSelector` e o `ConditionalCalendar`.
        *   Quando desmarcada, a seção de agendamento é ocultada e os campos são limpos.
    *   **Checkpoints de Integração:** Verificação da renderização condicional e da limpeza de estado.
*   **Integridade do Sistema:** Enfatize a importância de manter a integridade do sistema existente. Qualquer alteração deve ser feita de forma aditiva e não disruptiva.

## 13.2. Handoff para o Desenvolvedor

Prezado Desenvolvedor,

Este documento de arquitetura (`docs/architecture.md`) é o seu guia técnico para implementar o aprimoramento da página de matrícula de administrador.

**Orientações Essenciais para a Implementação:**

*   **Padrões de Codificação:** Siga rigorosamente os padrões de codificação e as convenções de estilo (ESLint, TypeScript, Tailwind CSS) já estabelecidos no projeto. Consulte a Seção 9 deste documento.
*   **Requisitos de Integração:**
    *   **Front-end:** Integre o `SchedulingSection` na página de matrícula existente (`src/app/admin/enrollments/page.tsx`).
    *   **Back-end:** Estenda o endpoint da API de matrícula (`/api/enrollments`) para aceitar e persistir os dados de agendamento e crie a nova tabela `student_schedules` no Supabase.
*   **Decisões Técnicas Chave:**
    *   **Cálculo da Data de Término:** Implemente a lógica de cálculo da data de término considerando feriados e aulas duplas, conforme detalhado na Seção 4 (Modelos de Dados) e no PRD.
    *   **Validação:** Utilize `react-hook-form` e Zod para validação robusta no front-end e no back-end.
*   **Compatibilidade com o Sistema Existente:**
    *   **Verificação:** Garanta que as alterações não afetem o fluxo de matrícula online existente.
    *   **Testes:** Execute os testes unitários e de integração existentes, e adicione novos testes para cobrir as funcionalidades de agendamento.
*   **Sequenciamento da Implementação:**
    1.  Implementar a nova tabela `student_schedules` e a coluna `modality` no banco de dados.
    2.  Desenvolver o componente `SchedulingSection` e sua lógica de exibição condicional.
    3.  Estender o endpoint da API de matrícula para aceitar e persistir os dados de agendamento.
    4.  Implementar a lógica de cálculo da data de término.
    5.  Desenvolver os indicadores visuais no calendário do professor.
