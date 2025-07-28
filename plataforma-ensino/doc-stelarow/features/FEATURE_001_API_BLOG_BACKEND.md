# FEATURE_001: API de Blog na Plataforma de Ensino

## Descri��o
Implementar endpoints REST na plataforma de ensino (Next.js/Supabase) para fornecer dados do blog ao site principal, incluindo configura��o de CORS e otimiza��es de performance.

## Contexto da SPEC.md
- **EPIC 1: BACKEND E GEST�O DE CONTE�DO** - Se��o "API de Blog na Plataforma de Ensino"
- Cen�rios: Cria��o de endpoints p�blicos, configura��o CORS, otimiza��o de performance
- Requisitos: Endpoints para listagem, artigo individual, categorias e filtros

## Contexto da ARCHITECTURE.md
- **Se��o 3: API ROUTES (NEXT.JS)** - Estrutura dos endpoints
- **Se��o 2: MODELAGEM DE DADOS SUPABASE** - Tabelas e RLS policies
- **Se��o 7: AUTENTICA��O E SEGURAN�A** - Middleware e valida��o

## Tarefas

### 1. Configurar estrutura base das API Routes
**Caminho do arquivo**: `src/app/api/blog/`
**Tecnologias**: Next.js 14 App Router, TypeScript
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`

- Criar estrutura de diret�rios para API Routes do blog
- Configurar middleware b�sico para CORS
- Implementar tipos TypeScript para responses da API
- Configurar cliente Supabase para server-side

### 2. Implementar endpoint de listagem de posts (GET /api/blog/posts)
**Caminho do arquivo**: `src/app/api/blog/posts/route.ts`
**Tecnologias**: Next.js API Routes, Supabase, Zod validation
**Dura��o Estimada**: 5 horas
**MCPs/Ferramentas**: `Supabase MCP`, `Context7`

- Implementar pagina��o com query parameters (page, limit)
- Adicionar filtros por categoria e busca textual
- Configurar cache headers (s-maxage=300, stale-while-revalidate=600)
- Implementar valida��o de entrada com Zod
- Testar com dados de exemplo

### 3. Implementar endpoint de artigo individual (GET /api/blog/posts/[slug])
**Caminho do arquivo**: `src/app/api/blog/posts/[slug]/route.ts`
**Tecnologias**: Next.js Dynamic Routes, Supabase
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Supabase MCP`, `Context7`

- Buscar post por slug com dados relacionados (categoria, autor, curso CTA)
- Implementar incremento de view_count
- Configurar cache longo (s-maxage=3600)
- Tratar erros 404 para posts n�o encontrados
- Adicionar logs para debugging

### 4. Implementar endpoints auxiliares (categorias e sitemap)
**Caminhos dos arquivos**: 
- `src/app/api/blog/categories/route.ts`
- `src/app/api/blog/sitemap/route.ts`
**Tecnologias**: Next.js API Routes, XML generation
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Supabase MCP`, `Context7`

- Endpoint GET /api/blog/categories para listar categorias
- Endpoint GET /api/blog/sitemap para XML sitemap do blog
- Cache agressivo para dados est�ticos
- Valida��o de sa�da consistente com outros endpoints

### 5. Configurar CORS e seguran�a para API p�blica
**Caminho do arquivo**: `src/middleware.ts` (atualiza��o)
**Tecnologias**: Next.js Middleware, Rate limiting
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Sequential Thinking`

- Configurar headers CORS espec�ficos para o site principal
- Implementar rate limiting b�sico por IP (60 req/min)
- Adicionar headers de seguran�a (CSP, X-Frame-Options)
- Implementar logging de requests suspeitos
- Testar bloqueio de origens n�o autorizadas

### 6. Otimizar performance e monitoramento da API
**Caminho do arquivo**: `src/lib/blog/performance.ts`
**Tecnologias**: Supabase indexes, Response caching
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Supabase MCP`, `Context7`

- Criar �ndices otimizados no Supabase para queries de blog
- Implementar sistema de cache em mem�ria para dados frequentes
- Adicionar metrics de performance (response time, cache hit rate)
- Configurar alertas para tempo de resposta > 200ms
- Implementar fallback para falhas de cache

## Crit�rios de Aceita��o

- [ ] Endpoint `/api/blog/posts` retorna lista paginada de artigos publicados
- [ ] Endpoint `/api/blog/posts/[slug]` retorna artigo espec�fico com dados relacionados
- [ ] Endpoint `/api/blog/categories` retorna todas as categorias
- [ ] CORS configurado permitindo apenas dom�nio do site principal
- [ ] Rate limiting funcionando (m�ximo 60 requests/min por IP)
- [ ] Cache headers configurados apropriadamente
- [ ] Tempo de resposta m�dio < 200ms
- [ ] Logs estruturados para debugging e monitoramento
- [ ] Todos os endpoints retornam apenas artigos com status "published"
- [ ] Valida��o de entrada com Zod em todos os endpoints

## Depend�ncias
- Tabelas do blog criadas no Supabase (blog_posts, blog_categories, etc.)
- RLS policies configuradas para acesso p�blico a conte�do publicado
- Cliente Supabase configurado na aplica��o Next.js