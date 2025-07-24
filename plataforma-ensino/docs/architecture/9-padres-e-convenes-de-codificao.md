# 9. Padrões e Convenções de Codificação

Todo o novo código desenvolvido para este aprimoramento deve aderir estritamente aos padrões e convenções existentes no projeto.

## 9.1. Conformidade com os Padrões Existentes
*   **Estilo de Código:** O código seguirá as regras definidas no arquivo `.eslintrc.json`, que estende a configuração `eslint-config-next`.
*   **Regras de Linting:** O comando `npm run lint` deve ser executado e passar sem erros antes de qualquer código ser mesclado.
*   **Padrões de Teste:** Os testes unitários e de integração seguirão os padrões existentes usando Jest e a React Testing Library, localizados no diretório `__tests__`.
*   **Estilo de Documentação:** Comentários no código devem ser usados para explicar lógicas complexas. O código deve ser o mais autoexplicativo possível.

## 9.2. Padrões Específicos do Aprimoramento
*   **Gerenciamento de Estado:** O estado local dos componentes deve ser preferencialmente gerenciado com os hooks do React (`useState`, `useReducer`). O Zustand deve ser usado apenas se for necessário compartilhar o estado entre componentes não relacionados.

## 9.3. Regras Críticas de Integração
*   **Compatibilidade com a API Existente:** O front-end não deve fazer suposições sobre a forma do payload da API. A validação com Zod deve ser usada para garantir que os dados recebidos estejam corretos.
*   **Integração com o Banco de Dados:** Todas as interações com o banco de dados devem ser feitas através dos clientes Supabase e seguir as políticas de segurança de nível de linha (RLS) existentes.
*   **Tratamento de Erros:** As chamadas de API devem ter um tratamento de erro robusto, exibindo mensagens claras para o usuário em caso de falha, utilizando o sistema de Toast existente.
*   **Consistência de Logging:** O logging de erros deve ser feito através do Sentry, que já está configurado no projeto.

---