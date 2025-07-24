# 3. Alinhamento do Stack de Tecnologia

A estratégia para este aprimoramento é aderir estritamente ao stack de tecnologia existente para garantir consistência, manutenibilidade e integração perfeita. Nenhuma nova dependência de produção é prevista.

## 3.1. Stack de Tecnologia Existente

| Categoria | Tecnologia Atual | Versão | Uso no Aprimoramento | Notas |
| :--- | :--- | :--- | :--- | :--- |
| **Framework Front-end** | Next.js (React) | ~14.2.30 | A página de matrícula e os novos componentes serão implementados dentro do ecossistema Next.js/React. | Padrão do projeto. |
| **Linguagem** | TypeScript | ~5.4.4 | Toda a nova lógica de front-end e back-end será escrita em TypeScript. | Garante a segurança de tipos. |
| **Estilização** | Tailwind CSS | ~3.4.1 | Os novos componentes (`TeacherSelector`, `ConditionalCalendar`) serão estilizados com Tailwind CSS. | Mantém a consistência visual. |
| **Componentes UI** | Radix UI / Headless UI | ^1.0.0 | Os componentes existentes provavelmente usam Radix. Os novos componentes devem seguir o mesmo padrão. | Reutilização de componentes base. |
| **Banco de Dados** | Supabase (PostgreSQL) | ^2.50.4 | O Supabase será usado para buscar dados (professores, feriados) e salvar as matrículas atualizadas. | Plataforma de dados principal. |
| **Gerenciamento de Estado**| Zustand / React Context | ^4.5.0 | O estado local dos componentes (seleção de professor, datas) será gerenciado com `useState` ou `Zustand` se um estado global for necessário. | A ser definido com base na complexidade. |
| **Validação de Formulário**| React Hook Form / Zod | ^7.48.0 | A validação do formulário de matrícula usará a biblioteca existente para garantir consistência. | Padrão para formulários no projeto. |

## 3.2. Novas Adições de Tecnologia
*Nenhuma nova tecnologia ou biblioteca será adicionada. O aprimoramento utilizará exclusivamente o stack existente.*

---