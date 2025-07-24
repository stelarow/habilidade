# 7. Integração na Árvore de Código-Source

A integração de novos arquivos e modificações seguirá a estrutura de projeto existente para garantir consistência.

## 7.1. Estrutura de Projeto Existente (Partes Relevantes)
```plaintext
src/
├── app/
│   └── admin/
│       └── enrollments/
│           ├── [id]/
│           │   └── page.tsx      # Formulário para editar matrícula
│           └── page.tsx          # Formulário para criar nova matrícula
└── components/
    ├── scheduling/
    │   ├── ConditionalCalendar.tsx
    │   └── TeacherSelector.tsx
    └── ui/
        ├── Button.tsx
        └── Checkbox.tsx
```

## 7.2. Organização de Novos Arquivos
O novo componente `SchedulingSection` será colocado junto com outros componentes de agendamento para manter a coesão.

```plaintext
src/
├── app/
│   └── admin/
│       └── enrollments/
│           ├── [id]/
│           │   └── page.tsx      # MODIFICADO para incluir SchedulingSection
│           └── page.tsx          # MODIFICADO para incluir SchedulingSection
└── components/
    └── scheduling/
        ├── ConditionalCalendar.tsx # EXISTENTE
        ├── SchedulingSection.tsx   # NOVO
        └── TeacherSelector.tsx     # EXISTENTE
```

## 7.3. Diretrizes de Integração
*   **Nomenclatura de Arquivos:** Os novos arquivos seguirão a convenção PascalCase para componentes React (ex: `SchedulingSection.tsx`).
*   **Organização de Pastas:** O novo componente será colocado no diretório `src/components/scheduling/` para agrupar funcionalidades relacionadas.
*   **Padrões de Importação/Exportação:** As importações e exportações seguirão os padrões existentes no projeto, provavelmente usando importações nominais de um arquivo `index.ts` no diretório do componente, se aplicável.

---