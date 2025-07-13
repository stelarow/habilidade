
# Checklist de Testes Manuais para o Blog

Este checklist deve ser seguido antes de mover o blog para produção para garantir a qualidade, acessibilidade e responsividade.

## Funcionalidade

- [ ] **Criação de Post:**
  - [ ] Acessar a área de admin (`/admin/blog`).
  - [ ] Clicar em "New Post".
  - [ ] Preencher todos os campos do formulário.
  - [ ] Salvar o post como rascunho (`draft`).
  - [ ] Verificar se o post aparece na lista de posts com o status correto.
- [ ] **Publicação de Post:**
  - [ ] Editar o rascunho criado.
  - [ ] Mudar o status para `published`.
  - [ ] Salvar as alterações.
  - [ ] Verificar se o post aparece na página pública do blog (`/blog`).
- [ ] **Visualização de Post:**
  - [ ] Clicar no post na página `/blog`.
  - [ ] Verificar se o conteúdo, título, imagem e data são exibidos corretamente.
  - [ ] Verificar se a formatação do conteúdo (negrito, itálico, etc.) está correta.
- [ ] **Preview de Post:**
  - [ ] Criar ou editar um post e mantê-lo como `draft`.
  - [ ] Acessar a URL de preview (`/blog/preview/[slug]`).
  - [ ] Verificar se o conteúdo é exibido corretamente.
- [ ] **Links:**
  - [ ] Verificar se os links "Blog" no Header e Footer funcionam.

## Acessibilidade (a11y)

- [ ] **Contraste de Cores:**
  - [ ] Usar uma ferramenta (ex: Lighthouse, Wave) para verificar o contraste de texto em todas as novas páginas.
  - [ ] Prestar atenção especial em textos sobre fundos gradientes ou imagens.
- [ ] **Navegação por Teclado:**
  - [ ] Navegar por todas as páginas do blog (índice e post) usando apenas o teclado (Tab, Shift+Tab, Enter).
  - [ ] Garantir que todos os elementos interativos (links, botões) são focáveis e acionáveis.
  - [ ] Verificar se o foco do teclado é sempre visível.
- [ ] **Leitores de Tela:**
  - [ ] Usar um leitor de tela (ex: NVDA, VoiceOver) para navegar pelas páginas do blog.
  - [ ] Verificar se o conteúdo é lido em uma ordem lógica.
  - [ ] Garantir que todas as imagens têm `alt text` descritivo.

## Responsividade

- [ ] **Telas Pequenas (Mobile):**
  - [ ] Abrir as páginas do blog em um emulador de dispositivo móvel (ou no próprio celular).
  - [ ] Verificar se o layout se ajusta corretamente e não há conteúdo transbordando.
  - [ ] Garantir que os textos são legíveis e os botões são fáceis de tocar.
- [ ] **Telas Médias (Tablet):**
  - [ ] Testar em modo retrato e paisagem.
  - [ ] Verificar a grade de posts e o layout do artigo.
- [ ] **Telas Grandes (Desktop):**
  - [ ] Testar em resoluções de desktop comuns (ex: 1920x1080).
- [ ] **Telas Muito Grandes (Ultrawide):**
  - [ ] Verificar se o conteúdo não se estica demais, mantendo uma largura máxima de leitura confortável (o `container mx-auto` e `prose` devem ajudar com isso).

## Performance

- [ ] **Lighthouse Score:**
  - [ ] Rodar um teste do Lighthouse na página de índice do blog e em uma página de post.
  - [ ] Analisar os resultados para Performance, Acessibilidade, Boas Práticas e SEO.
  - [ ] Otimizar imagens e outros recursos conforme as recomendações.
