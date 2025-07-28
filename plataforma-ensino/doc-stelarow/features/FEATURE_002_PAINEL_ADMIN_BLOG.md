# FEATURE_002: Painel Administrativo de Blog na Plataforma

## Descri��o
Implementar interface administrativa completa na plataforma de ensino para gerenciamento de conte�do do blog, incluindo editor rico, sistema de SEO e controles de publica��o com tema violet do Shadcn/ui.

## Contexto da SPEC.md
- **EPIC 1: BACKEND E GEST�O DE CONTE�DO** - Se��o "Painel Administrativo na Plataforma"
- Cen�rios: Interface de gest�o, editor com foco SEO, sistema de revis�o e publica��o
- Requisitos: CRUD completo de artigos, categorias, preview e agendamento

## Contexto da ARCHITECTURE.md
- **Se��o 4: COMPONENTES UI COM SHADCN/UI (TEMA VIOLET)** - Configura��o e componentes
- **Se��o 8: INSTRU��ES MCP SHADCN/UI COM TEMA VIOLET** - Instala��o e uso
- **Se��o 5: GERENCIAMENTO DE ESTADO** - Zustand para estado da interface admin

## Tarefas

### 1. Configurar Shadcn/ui com tema violet na plataforma
**Caminho do arquivo**: `components.json`, `src/app/globals.css`, `tailwind.config.ts`
**Tecnologias**: Shadcn/ui, Tailwind CSS, Tema Violet
**Dura��o Estimada**: 2 horas
**MCPs/Ferramentas**: `Context7`
**Instru��o Shadcn/ui**: Execute `npx shadcn-ui@latest init` e selecione tema "violet". Configure CSS variables e path aliases conforme ARCHITECTURE.md se��o 8.

- Inicializar Shadcn/ui com tema violet
- Configurar variables CSS personalizadas para cores da Escola Habilidade
- Instalar componentes base: button, input, textarea, card, badge, select, dialog, form, tabs
- Verificar compatibilidade com design system existente
- Criar componente de teste para valida��o do tema

### 2. Implementar estrutura de navega��o admin para blog
**Caminho do arquivo**: `src/app/admin/blog/layout.tsx`
**Tecnologias**: Next.js App Router, Shadcn/ui Navigation
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`
**Instru��o Shadcn/ui**: Utilize componentes `navigation-menu`, `breadcrumb` e `separator` do Shadcn/ui.

- Criar sidebar de navega��o espec�fica para o blog
- Implementar breadcrumbs din�micos
- Adicionar estat�sticas r�pidas (total posts, rascunhos, publicados)
- Configurar prote��o de rota para administradores
- Implementar navega��o responsiva

### 3. Desenvolver p�gina dashboard do blog
**Caminho do arquivo**: `src/app/admin/blog/page.tsx`
**Tecnologias**: Shadcn/ui, React Charts, Analytics
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`
**Instru��o Shadcn/ui**: Use componentes `card`, `progress`, `badge` e `table` para criar dashboard informativo.

- Criar cards de m�tricas principais (posts publicados, visualiza��es, taxa convers�o)
- Implementar gr�fico de visualiza��es por per�odo
- Listar posts mais populares em tabela
- Adicionar a��es r�pidas (criar post, gerenciar categorias)
- Configurar auto-refresh de dados a cada 30 segundos

### 4. Implementar CRUD de categorias de blog
**Caminhos dos arquivos**: 
- `src/app/admin/blog/categories/page.tsx`
- `src/components/admin/blog/CategoryForm.tsx`
**Tecnologias**: Shadcn/ui Forms, Zod validation, Supabase
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`
**Instru��o Shadcn/ui**: Utilize `form`, `input`, `select`, `dialog` e `color-picker` (custom) para gerenciamento de categorias.

- Implementar listagem de categorias com contagem de posts
- Criar formul�rio de cria��o/edi��o com valida��o Zod
- Adicionar seletor de cor para categorias
- Implementar modal de confirma��o para exclus�o
- Validar slugs �nicos em tempo real

### 5. Desenvolver editor de posts principal (PostEditor)
**Caminho do arquivo**: `src/components/admin/blog/PostEditor.tsx`
**Tecnologias**: Shadcn/ui, Rich Text Editor, React Hook Form, Zod
**Dura��o Estimada**: 8 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`
**Instru��o Shadcn/ui**: Use `tabs`, `textarea`, `select`, `switch`, `calendar` e `popover` conforme exemplo na ARCHITECTURE.md se��o 4.

- Implementar editor com 4 abas: Conte�do, SEO, Call-to-Action, Configura��es
- Integrar editor de texto rico ou Markdown para conte�do principal
- Criar formul�rio SEO com contadores de caracteres (t�tulo 60, description 160)
- Implementar sele��o de curso para CTA contextual
- Adicionar controles de status (rascunho, publicado, agendado)
- Implementar preview em tempo real

### 6. Implementar sistema de upload e gerenciamento de m�dia
**Caminhos dos arquivos**:
- `src/components/admin/blog/MediaUploader.tsx`
- `src/lib/blog/mediaService.ts`
**Tecnologias**: Supabase Storage, Image optimization, Drag & Drop
**Dura��o Estimada**: 5 horas
**MCPs/Ferramentas**: `Supabase MCP`, `Context7`
**Instru��o Shadcn/ui**: Use `dialog`, `progress`, `card` e custom drag-drop area.

- Criar interface drag-and-drop para upload de imagens
- Implementar redimensionamento autom�tico (m�ltiplos tamanhos)
- Configurar valida��o de tipos de arquivo e tamanho
- Integrar com Supabase Storage
- Adicionar preview de imagens e gallery
- Implementar alt-text autom�tico com IA (opcional)

### 7. Desenvolver p�ginas de gerenciamento de posts
**Caminhos dos arquivos**:
- `src/app/admin/blog/posts/page.tsx` (listagem)
- `src/app/admin/blog/posts/new/page.tsx` (criar)
- `src/app/admin/blog/posts/[id]/edit/page.tsx` (editar)
**Tecnologias**: Next.js Dynamic Routes, Shadcn/ui, Filtering & Search
**Dura��o Estimada**: 6 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`
**Instru��o Shadcn/ui**: Utilize `table`, `badge`, `dropdown-menu`, `search` e `pagination` components.

- Implementar tabela de posts com filtros (status, categoria, autor)
- Adicionar busca em tempo real por t�tulo e conte�do
- Criar actions dropdown (editar, duplicar, excluir, alterar status)
- Implementar pagina��o eficiente
- Adicionar bulk actions (publicar m�ltiplos, mover para categoria)
- Configurar ordena��o por data, t�tulo, visualiza��es

### 8. Implementar sistema de preview e agendamento
**Caminhos dos arquivos**:
- `src/components/admin/blog/PostPreview.tsx`
- `src/components/admin/blog/PublishControls.tsx`
**Tecnologias**: Server Components, Date/Time picker, Cron jobs
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`
**Instru��o Shadcn/ui**: Use `calendar`, `popover`, `switch`, `button` variants para controles de publica��o.

- Criar preview fiel ao layout do site principal
- Implementar seletor de data/hora para agendamento
- Configurar sistema de status com estados visuais claros
- Adicionar a��es de publica��o imediata vs agendada
- Implementar logs de hist�rico de publica��o
- Criar alertas para posts agendados pr�ximos

## Crit�rios de Aceita��o

- [ ] Shadcn/ui configurado com tema violet funcionando
- [ ] Dashboard exibe m�tricas em tempo real do blog
- [ ] CRUD completo de categorias com valida��o
- [ ] Editor de posts com 4 abas funcionais (Conte�do, SEO, CTA, Config)
- [ ] Upload de imagens funcionando com m�ltiplos tamanhos
- [ ] Listagem de posts com filtros e busca eficientes
- [ ] Preview de posts id�ntico ao layout do site principal
- [ ] Agendamento de posts funcionando com interface intuitiva
- [ ] Todas as a��es protegidas por middleware de admin
- [ ] Interface responsiva em todos os tamanhos de tela
- [ ] Valida��o Zod em todos os formul�rios
- [ ] Estados de loading e erro bem tratados

## Depend�ncias
- FEATURE_001 conclu�da (API endpoints funcionais)
- Middleware de autentica��o configurado
- Tabelas do blog criadas no Supabase
- Supabase Storage configurado para upload de imagens