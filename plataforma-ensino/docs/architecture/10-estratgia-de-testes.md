# 10. Estratégia de Testes

A estratégia de testes para este aprimoramento se concentrará em testes unitários para os novos componentes, testes de integração para o fluxo de matrícula e testes de regressão para garantir a estabilidade do sistema.

## 10.1. Integração com os Testes Existentes
*   **Framework de Teste Existente:** Jest com React Testing Library.
*   **Organização dos Testes:** Os novos arquivos de teste serão colocados em um diretório `__tests__` dentro do diretório do componente que está sendo testado (ex: `src/components/scheduling/__tests__/SchedulingSection.test.tsx`).
*   **Requisitos de Cobertura:** Manter ou aumentar a cobertura de testes existente.

## 10.2. Novos Requisitos de Teste

### **Testes Unitários para Novos Componentes**
*   **Framework:** Jest, React Testing Library.
*   **Localização:** `src/components/scheduling/__tests__/`.
*   **Escopo:**
    *   Testar se o `SchedulingSection` renderiza condicionalmente com base na seleção da modalidade.
    *   Testar se o `TeacherSelector` busca e exibe os professores corretamente.
    *   Testar se o `ConditionalCalendar` é ativado/desativado e permite a seleção de horários.
*   **Integração com Existentes:** Os mocks para chamadas de API (Supabase) seguirão os padrões existentes.

### **Testes de Integração**
*   **Escopo:**
    *   Simular o fluxo completo de matrícula de um aluno presencial no formulário de administrador.
    *   Verificar se a validação do formulário funciona corretamente (campos obrigatórios).
    *   Verificar se o envio do formulário chama a API com o payload correto.
    *   Testar a lógica de cálculo da data de término no lado do cliente ou em um teste de API separado.

### **Testes de Regressão**
*   **Abordagem:**
    *   Executar a suíte de testes de regressão existente para garantir que o fluxo de matrícula online não foi afetado.
    *   Adicionar um novo teste de regressão (pode ser E2E com Playwright, que já está no projeto) para o fluxo de matrícula presencial.
*   **Suíte de Regressão Automatizada:** O novo teste E2E deve ser adicionado à suíte de regressão automatizada.

---