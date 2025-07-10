
# Plano de Implementação do Blog (Revisado)

Este documento detalha o passo a passo para a criação e integração de uma seção de blog no site, incorporando melhores práticas de arquitetura, segurança e performance.

## 1. Arquitetura e Performance

- **Renderização Estática (SSG/ISR):** As páginas do blog (`/blog` e `/blog/[slug]`) serão pré-renderizadas no build time (Static Site Generation) e atualizadas incrementalmente (Incremental Static Regeneration) para garantir performance máxima e SEO. Isso elimina a necessidade de `client-side fetch` para o conteúdo principal.
- **Otimização de Imagens:** As imagens serão servidas através do `next/image` para otimização automática, e o upload será feito para o **Supabase Storage**, mantendo o banco de dados leve.
- **Cache Headers:** Headers de cache serão configurados para o conteúdo estático, melhorando os tempos de carregamento para visitantes recorrentes.

## 2. Design e Experiência do Usuário (UX)

O design original se mantém, com foco no conteúdo e consistência com a identidade visual do site.

- **Componentes a serem criados:**
  - `src/app/blog/page.jsx`: (Next.js App Router) Página de índice do blog.
  - `src/app/blog/[slug]/page.jsx`: Template da página do artigo.
  - `src/components/blog/PostCard.jsx`: Card para o post.
  - `src/components/blog/AuthorBio.jsx`: Biografia do autor.

## 3. Backend e Banco de Dados (`plataforma-ensino`)

### 3.1. Tabela `posts` no Supabase

A tabela será expandida para suportar versionamento e metadados:

- `id`, `title`, `slug`, `author_id`, `published_at`, `created_at`, `updated_at`, `status`, `excerpt`, `featured_image_url` (como antes)
- **Novos campos:**
  - `version` (integer): Para histórico de alterações.
  - `metadata` (jsonb): Para dados extras (ex: tempo de leitura).
  - `tags` (array de text): Para categorização.

### 3.2. Segurança (Row-Level Security - RLS)

- **Política de Acesso:**
  - **Público:** Apenas `SELECT` em posts com `status = 'published'`.
  - **Administradores (`role = admin`):** Permissões totais (`INSERT`, `UPDATE`, `DELETE`).
- **Sanitização de Conteúdo:** O conteúdo Markdown será sanitizado no backend com **DOMPurify** antes de ser salvo no banco de dados para prevenir ataques XSS.

### 3.3. API no Next.js

- As rotas da API (`/api/posts/...`) serão mantidas para o uso do admin, com validação de schema (Zod) e tratamento de erros robusto.
- **Webhooks:** Um webhook será configurado para revalidar as páginas do blog no site principal sempre que um post for publicado ou atualizado.

## 4. Gerenciamento de Conteúdo (Admin)

### 4.1. Experiência do Administrador

- **Editor Moderno:** Em vez de Markdown puro, será implementado o **TipTap**, que oferece uma experiência rica (WYSIWYG) mas exporta Markdown limpo.
- **Pré-visualização (Preview Mode):** Uma rota protegida (`/api/preview`) e uma página (`/blog/preview/[slug]`) serão criadas para permitir que administradores visualizem o post exatamente como ele aparecerá no site antes de publicar.
- **Workflow Editorial:** O status do post evoluirá de `draft` -> `in_review` -> `published`.

## 5. SEO e Acessibilidade

- O plano de SEO original é mantido.
- **Testes de Acessibilidade:** Serão realizados testes com **Lighthouse** e **axe** para garantir conformidade com as diretrizes WCAG.

## 6. Monitoramento e Observabilidade

- **Logging:** Logs serão instrumentados no Supabase e na API da `plataforma-ensino`.
- **Monitoramento de Erros:** O Sentry (já configurado no projeto) será usado para monitorar erros tanto no frontend quanto no backend do blog.

## Plano de Sprints Sugerido

- **Sprint 1: Fundação do Backend**
  - [ ] Definir e aplicar o schema da tabela `posts` com as novas colunas.
  - [ ] Implementar as políticas RLS no Supabase.
  - [ ] Criar as rotas da API com testes unitários, incluindo sanitização e validação.
- **Sprint 2: Admin UI e Workflow**
  - [ ] Implementar a UI de admin com listagem, criação e edição de posts.
  - [ ] Integrar o editor TipTap.
  - [ ] Implementar a funcionalidade de preview.
- **Sprint 3: Frontend Público**
  - [ ] Desenvolver as páginas `/blog` e `/blog/[slug]` usando SSG/ISR.
  - [ ] Criar os componentes de UI (`PostCard`, etc.).
  - [ ] Conectar o frontend com a API para revalidação.
- **Sprint 4: Testes e Otimização**
  - [ ] Realizar testes de acessibilidade e responsividade.
  - [ ] Configurar Image Optimization e cache headers.
  - [ ] Implementar logging e monitoramento no Sentry.
- **Sprint 5: Go-live**
  - [ ] Deploy em um ambiente de staging.
  - [ ] Documentar o processo editorial para a equipe.
  - [ ] Deploy em produção e monitoramento inicial.
