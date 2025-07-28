# FEATURE_002: Painel Administrativo de Blog na Plataforma

## Descrição
Implementar interface administrativa completa na plataforma de ensino para gerenciamento de conteúdo do blog, incluindo editor rico, sistema de SEO e controles de publicação com tema violet do Shadcn/ui.

## Contexto da SPEC.md
- **EPIC 1: BACKEND E GESTÃO DE CONTEÚDO** - Seção "Painel Administrativo na Plataforma"
- Cenários: Interface de gestão, editor com foco SEO, sistema de revisão e publicação
- Requisitos: CRUD completo de artigos, categorias, preview e agendamento

## Contexto da ARCHITECTURE.md
- **Seção 4: COMPONENTES UI COM SHADCN/UI (TEMA VIOLET)** - Configuração e componentes
- **Seção 8: INSTRUÇÕES MCP SHADCN/UI COM TEMA VIOLET** - Instalação e uso
- **Seção 5: GERENCIAMENTO DE ESTADO** - Zustand para estado da interface admin

## Tarefas

### 1. Configurar Shadcn/ui com tema violet na plataforma
**Caminho do arquivo**: `components.json`, `src/app/globals.css`, `tailwind.config.ts`
**Tecnologias**: Shadcn/ui, Tailwind CSS, Tema Violet
**Duração Estimada**: 2 horas
**MCPs/Ferramentas**: `Context7`
**Instrução Shadcn/ui**: Execute `npx shadcn-ui@latest init` e selecione tema "violet". Configure CSS variables e path aliases conforme ARCHITECTURE.md seção 8.

- Inicializar Shadcn/ui com tema violet
- Configurar variables CSS personalizadas para cores da Escola Habilidade
- Instalar componentes base: button, input, textarea, card, badge, select, dialog, form, tabs
- Verificar compatibilidade com design system existente
- Criar componente de teste para validação do tema

### 2. Implementar estrutura de navegação admin para blog
**Caminho do arquivo**: `src/app/admin/blog/layout.tsx`
**Tecnologias**: Next.js App Router, Shadcn/ui Navigation
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`
**Instrução Shadcn/ui**: Utilize componentes `navigation-menu`, `breadcrumb` e `separator` do Shadcn/ui.

- Criar sidebar de navegação específica para o blog
- Implementar breadcrumbs dinâmicos
- Adicionar estatísticas rápidas (total posts, rascunhos, publicados)
- Configurar proteção de rota para administradores
- Implementar navegação responsiva

### 3. Desenvolver página dashboard do blog
**Caminho do arquivo**: `src/app/admin/blog/page.tsx`
**Tecnologias**: Shadcn/ui, React Charts, Analytics
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`
**Instrução Shadcn/ui**: Use componentes `card`, `progress`, `badge` e `table` para criar dashboard informativo.

- Criar cards de métricas principais (posts publicados, visualizações, taxa conversão)
- Implementar gráfico de visualizações por período
- Listar posts mais populares em tabela
- Adicionar ações rápidas (criar post, gerenciar categorias)
- Configurar auto-refresh de dados a cada 30 segundos

### 4. Implementar CRUD de categorias de blog
**Caminhos dos arquivos**: 
- `src/app/admin/blog/categories/page.tsx`
- `src/components/admin/blog/CategoryForm.tsx`
**Tecnologias**: Shadcn/ui Forms, Zod validation, Supabase
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`
**Instrução Shadcn/ui**: Utilize `form`, `input`, `select`, `dialog` e `color-picker` (custom) para gerenciamento de categorias.

- Implementar listagem de categorias com contagem de posts
- Criar formulário de criação/edição com validação Zod
- Adicionar seletor de cor para categorias
- Implementar modal de confirmação para exclusão
- Validar slugs únicos em tempo real

### 5. Desenvolver editor de posts principal (PostEditor)
**Caminho do arquivo**: `src/components/admin/blog/PostEditor.tsx`
**Tecnologias**: Shadcn/ui, Rich Text Editor, React Hook Form, Zod
**Duração Estimada**: 8 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`
**Instrução Shadcn/ui**: Use `tabs`, `textarea`, `select`, `switch`, `calendar` e `popover` conforme exemplo na ARCHITECTURE.md seção 4.

- Implementar editor com 4 abas: Conteúdo, SEO, Call-to-Action, Configurações
- Integrar editor de texto rico ou Markdown para conteúdo principal
- Criar formulário SEO com contadores de caracteres (título 60, description 160)
- Implementar seleção de curso para CTA contextual
- Adicionar controles de status (rascunho, publicado, agendado)
- Implementar preview em tempo real

### 6. Implementar sistema de upload e gerenciamento de mídia
**Caminhos dos arquivos**:
- `src/components/admin/blog/MediaUploader.tsx`
- `src/lib/blog/mediaService.ts`
**Tecnologias**: Supabase Storage, Image optimization, Drag & Drop
**Duração Estimada**: 5 horas
**MCPs/Ferramentas**: `Supabase MCP`, `Context7`
**Instrução Shadcn/ui**: Use `dialog`, `progress`, `card` e custom drag-drop area.

- Criar interface drag-and-drop para upload de imagens
- Implementar redimensionamento automático (múltiplos tamanhos)
- Configurar validação de tipos de arquivo e tamanho
- Integrar com Supabase Storage
- Adicionar preview de imagens e gallery
- Implementar alt-text automático com IA (opcional)

### 7. Desenvolver páginas de gerenciamento de posts
**Caminhos dos arquivos**:
- `src/app/admin/blog/posts/page.tsx` (listagem)
- `src/app/admin/blog/posts/new/page.tsx` (criar)
- `src/app/admin/blog/posts/[id]/edit/page.tsx` (editar)
**Tecnologias**: Next.js Dynamic Routes, Shadcn/ui, Filtering & Search
**Duração Estimada**: 6 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`
**Instrução Shadcn/ui**: Utilize `table`, `badge`, `dropdown-menu`, `search` e `pagination` components.

- Implementar tabela de posts com filtros (status, categoria, autor)
- Adicionar busca em tempo real por título e conteúdo
- Criar actions dropdown (editar, duplicar, excluir, alterar status)
- Implementar paginação eficiente
- Adicionar bulk actions (publicar múltiplos, mover para categoria)
- Configurar ordenação por data, título, visualizações

### 8. Implementar sistema de preview e agendamento
**Caminhos dos arquivos**:
- `src/components/admin/blog/PostPreview.tsx`
- `src/components/admin/blog/PublishControls.tsx`
**Tecnologias**: Server Components, Date/Time picker, Cron jobs
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`
**Instrução Shadcn/ui**: Use `calendar`, `popover`, `switch`, `button` variants para controles de publicação.

- Criar preview fiel ao layout do site principal
- Implementar seletor de data/hora para agendamento
- Configurar sistema de status com estados visuais claros
- Adicionar ações de publicação imediata vs agendada
- Implementar logs de histórico de publicação
- Criar alertas para posts agendados próximos

## Critérios de Aceitação

- [ ] Shadcn/ui configurado com tema violet funcionando
- [ ] Dashboard exibe métricas em tempo real do blog
- [ ] CRUD completo de categorias com validação
- [ ] Editor de posts com 4 abas funcionais (Conteúdo, SEO, CTA, Config)
- [ ] Upload de imagens funcionando com múltiplos tamanhos
- [ ] Listagem de posts com filtros e busca eficientes
- [ ] Preview de posts idêntico ao layout do site principal
- [ ] Agendamento de posts funcionando com interface intuitiva
- [ ] Todas as ações protegidas por middleware de admin
- [ ] Interface responsiva em todos os tamanhos de tela
- [ ] Validação Zod em todos os formulários
- [ ] Estados de loading e erro bem tratados

## Dependências
- FEATURE_001 concluída (API endpoints funcionais)
- Middleware de autenticação configurado
- Tabelas do blog criadas no Supabase
- Supabase Storage configurado para upload de imagens