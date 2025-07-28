# FEATURE_001: API de Blog na Plataforma de Ensino

## Descrição
Implementar endpoints REST na plataforma de ensino (Next.js/Supabase) para fornecer dados do blog ao site principal, incluindo configuração de CORS e otimizações de performance.

## Contexto da SPEC.md
- **EPIC 1: BACKEND E GESTÃO DE CONTEÚDO** - Seção "API de Blog na Plataforma de Ensino"
- Cenários: Criação de endpoints públicos, configuração CORS, otimização de performance
- Requisitos: Endpoints para listagem, artigo individual, categorias e filtros

## Contexto da ARCHITECTURE.md
- **Seção 3: API ROUTES (NEXT.JS)** - Estrutura dos endpoints
- **Seção 2: MODELAGEM DE DADOS SUPABASE** - Tabelas e RLS policies
- **Seção 7: AUTENTICAÇÃO E SEGURANÇA** - Middleware e validação

## Tarefas

### 1. Configurar estrutura base das API Routes
**Caminho do arquivo**: `src/app/api/blog/`
**Tecnologias**: Next.js 14 App Router, TypeScript
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`

- Criar estrutura de diretórios para API Routes do blog
- Configurar middleware básico para CORS
- Implementar tipos TypeScript para responses da API
- Configurar cliente Supabase para server-side

### 2. Implementar endpoint de listagem de posts (GET /api/blog/posts)
**Caminho do arquivo**: `src/app/api/blog/posts/route.ts`
**Tecnologias**: Next.js API Routes, Supabase, Zod validation
**Duração Estimada**: 5 horas
**MCPs/Ferramentas**: `Supabase MCP`, `Context7`

- Implementar paginação com query parameters (page, limit)
- Adicionar filtros por categoria e busca textual
- Configurar cache headers (s-maxage=300, stale-while-revalidate=600)
- Implementar validação de entrada com Zod
- Testar com dados de exemplo

### 3. Implementar endpoint de artigo individual (GET /api/blog/posts/[slug])
**Caminho do arquivo**: `src/app/api/blog/posts/[slug]/route.ts`
**Tecnologias**: Next.js Dynamic Routes, Supabase
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Supabase MCP`, `Context7`

- Buscar post por slug com dados relacionados (categoria, autor, curso CTA)
- Implementar incremento de view_count
- Configurar cache longo (s-maxage=3600)
- Tratar erros 404 para posts não encontrados
- Adicionar logs para debugging

### 4. Implementar endpoints auxiliares (categorias e sitemap)
**Caminhos dos arquivos**: 
- `src/app/api/blog/categories/route.ts`
- `src/app/api/blog/sitemap/route.ts`
**Tecnologias**: Next.js API Routes, XML generation
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Supabase MCP`, `Context7`

- Endpoint GET /api/blog/categories para listar categorias
- Endpoint GET /api/blog/sitemap para XML sitemap do blog
- Cache agressivo para dados estáticos
- Validação de saída consistente com outros endpoints

### 5. Configurar CORS e segurança para API pública
**Caminho do arquivo**: `src/middleware.ts` (atualização)
**Tecnologias**: Next.js Middleware, Rate limiting
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Sequential Thinking`

- Configurar headers CORS específicos para o site principal
- Implementar rate limiting básico por IP (60 req/min)
- Adicionar headers de segurança (CSP, X-Frame-Options)
- Implementar logging de requests suspeitos
- Testar bloqueio de origens não autorizadas

### 6. Otimizar performance e monitoramento da API
**Caminho do arquivo**: `src/lib/blog/performance.ts`
**Tecnologias**: Supabase indexes, Response caching
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Supabase MCP`, `Context7`

- Criar índices otimizados no Supabase para queries de blog
- Implementar sistema de cache em memória para dados frequentes
- Adicionar metrics de performance (response time, cache hit rate)
- Configurar alertas para tempo de resposta > 200ms
- Implementar fallback para falhas de cache

## Critérios de Aceitação

- [ ] Endpoint `/api/blog/posts` retorna lista paginada de artigos publicados
- [ ] Endpoint `/api/blog/posts/[slug]` retorna artigo específico com dados relacionados
- [ ] Endpoint `/api/blog/categories` retorna todas as categorias
- [ ] CORS configurado permitindo apenas domínio do site principal
- [ ] Rate limiting funcionando (máximo 60 requests/min por IP)
- [ ] Cache headers configurados apropriadamente
- [ ] Tempo de resposta médio < 200ms
- [ ] Logs estruturados para debugging e monitoramento
- [ ] Todos os endpoints retornam apenas artigos com status "published"
- [ ] Validação de entrada com Zod em todos os endpoints

## Dependências
- Tabelas do blog criadas no Supabase (blog_posts, blog_categories, etc.)
- RLS policies configuradas para acesso público a conteúdo publicado
- Cliente Supabase configurado na aplicação Next.js