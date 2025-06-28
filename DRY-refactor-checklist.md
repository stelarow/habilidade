# Checklist de Refatoração DRY

> Objetivo: eliminar código duplicado e criar abstrações reutilizáveis (componentes, hooks ou funções utilitárias) no projeto **habilidade**.

## 1. Auditoria de duplicação

- [ ] Executar **Buscar em Arquivos** (`Ctrl + Shift + F`) procurando por padrões suspeitos (e.g. `href="#cursos"`, classes `bg-gradient-to-r from-fuchsia-500 to-cyan-400`).
- [ ] Rodar `npx eslint . --ext .js,.jsx` adicionando os plugins `eslint-plugin-sonarjs` e `eslint-plugin-unicorn` para receber alertas de duplicidade.
- [ ] Listar todos os trechos repetidos ou muito semelhantes encontrados.

## 2. Navegação (links duplicados)

- [ ] Criar um arquivo `src/constants/navigation.js` exportando um array `NAV_LINKS` com `{ label, href }`.
- [ ] Alterar o componente `Header.jsx` para gerar **tanto** a navegação desktop quanto mobile via `NAV_LINKS.map(...)`.
- [ ] Garantir que clicar em um link também feche o menu mobile.

## 3. Botão gradiente reutilizável

- [ ] Criar componente `GradientButton.jsx` que receba `children`, `href`, `onClick`, etc.
- [ ] Mover as classes gradientes repetidas (`bg-gradient-to-r from-fuchsia-500 to-cyan-400 ...`) para esse componente.
- [ ] Substituir todos os botões "Começar Agora" (desktop e mobile) pelo novo componente.

## 4. Layout de Seções

- [ ] Criar componente `Section.jsx` que envolva `<section>` com classes base:
  `relative flex flex-col items-center justify-center min-h-screen px-4`.
- [ ] Aceitar `id`, `className` adicional e `children`.
- [ ] Refatorar `Hero.jsx` e `Courses.jsx` para usar `<Section>`.

## 5. Texto com gradiente reutilizável

- [ ] Adicionar utilitário Tailwind Safelist ou classe CSS `.gradient-text` em `index.css`.
- [ ] Substituir ocorrências de `bg-gradient-to-r ... bg-clip-text text-transparent` pela nova classe.

## 6. Hook de alternância (toggle)

- [ ] Criar `useToggle.js` retornando `[value, toggleFn]`.
- [ ] Usar `useToggle` no `Header` para abrir/fechar menu mobile.

## 7. Validação Starfield

- [ ] Verificar usos de `<Starfield>` e padronizar props (`count`, `className`).
- [ ] Considerar extrair configurações (densidade, opacidade) para constantes ou contexto.

## 8. Garantir qualidade

- [ ] Rodar `npm run lint` e corrigir todos os avisos.
- [ ] Rodar `npm run dev` e testar navegação desktop/mobile.
- [ ] Confirmar que nenhum comportamento visual foi perdido após refatorações.

---
Quando todas as caixas acima estiverem marcadas, o projeto estará livre das principais duplicações atuais e mais preparado para crescer seguindo o princípio **Don't Repeat Yourself (DRY)**. 