# FEATURE_003: Páginas de Blog no Site Principal

## Descrição
Implementar páginas do blog no site principal (React/Vite) consumindo a API da plataforma, incluindo listagem de artigos, artigos individuais e páginas de categoria com SEO otimizado.

## Contexto da SPEC.md
- **EPIC 2: FRONTEND NO SITE PRINCIPAL** - Seção "Páginas de Blog no Site Principal"
- Cenários: Página de listagem (/blog), artigo individual (/blog/[slug]), categoria (/blog/categoria/[slug])
- Requisitos: Paginação, SEO otimizado, breadcrumbs, compartilhamento social

## Contexto da ARCHITECTURE.md
- **Seção 1: ESTRUTURA DE DIRETÓRIOS** - Site Principal estrutura do blog
- **Seção 5: GERENCIAMENTO DE ESTADO** - React Query para cache e estado server
- **Seção 6: FLUXO DE DADOS** - Arquitetura de integração entre aplicações

## Tarefas

### 1. Configurar React Query e serviços da API do blog
**Caminhos dos arquivos**:
- `src/services/blogAPI.js`
- `src/hooks/useBlogAPI.js`
- `src/providers/QueryProvider.jsx`
**Tecnologias**: React Query, Axios, Error handling
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Configurar cliente HTTP com interceptadores para a API da plataforma
- Implementar hooks customizados para posts, categorias e busca
- Configurar cache otimizado (5min para listas, 1h para artigos)
- Implementar retry logic e tratamento de erros
- Configurar timeout e fallbacks para dados offline

### 2. Implementar página de listagem principal (/blog)
**Caminho do arquivo**: `src/pages/blog/BlogIndex.jsx`
**Tecnologias**: React Router, Infinite scroll, Filtering
**Duração Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`

- Criar layout de grid responsivo para cards de artigos
- Implementar infinite scroll com React Query useInfiniteQuery
- Adicionar filtros por categoria com dropdown
- Implementar busca em tempo real
- Configurar meta tags SEO para página principal do blog
- Adicionar loading states e skeletons

### 3. Desenvolver componente BlogCard para listagens
**Caminho do arquivo**: `src/components/blog/BlogCard.jsx`
**Tecnologias**: React, Lazy loading, Image optimization
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar card responsivo com imagem, título, resumo e metadata
- Implementar lazy loading para imagens com placeholder
- Adicionar badges de categoria com cores dinâmicas
- Configurar truncamento inteligente de texto
- Implementar hover effects consistentes com design system
- Adicionar indicadores de tempo de leitura

### 4. Implementar página de artigo individual (/blog/[slug])
**Caminho do arquivo**: `src/pages/blog/BlogPost.jsx`
**Tecnologias**: React Router Dynamic Routes, Markdown/HTML rendering
**Duração Estimada**: 6 horas
**MCPs/Ferramentas**: `Context7`

- Implementar layout de artigo com typography otimizada
- Configurar rendering seguro de conteúdo HTML/Markdown
- Adicionar breadcrumbs navegacionais
- Implementar meta tags dinâmicas (Open Graph, Twitter Cards)
- Configurar structured data (JSON-LD Article schema)
- Adicionar navegação para próximo/anterior artigo

### 5. Criar páginas de categoria (/blog/categoria/[slug])
**Caminho do arquivo**: `src/pages/blog/BlogCategory.jsx`
**Tecnologias**: React Router, Filtering, SEO
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Implementar listagem filtrada por categoria específica
- Adicionar header da categoria com descrição
- Configurar paginação específica para categoria
- Implementar meta tags SEO específicas da categoria
- Adicionar breadcrumbs incluindo categoria
- Configurar canonical URLs para evitar conteúdo duplicado

### 6. Implementar sistema de navegação e breadcrumbs
**Caminhos dos arquivos**:
- `src/components/blog/BlogNavigation.jsx`
- `src/components/blog/Breadcrumbs.jsx`
**Tecnologias**: React Router, Context API
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar componente de breadcrumbs dinâmico baseado na rota
- Integrar link "Blog" no menu principal do site
- Implementar navegação de categorias no sidebar
- Adicionar indicador de página ativa
- Configurar navegação mobile responsiva

### 7. Desenvolver componentes de compartilhamento social
**Caminho do arquivo**: `src/components/blog/ShareButtons.jsx`
**Tecnologias**: Web Share API, Social Media APIs
**Duração Estimada**: 2 horas
**MCPs/Ferramentas**: `Context7`

- Implementar botões para Facebook, Twitter, LinkedIn, WhatsApp
- Configurar Web Share API para dispositivos móveis
- Adicionar botão de cópia de link
- Implementar tracking de compartilhamentos (opcional)
- Configurar textos pré-formatados para cada plataforma

### 8. Implementar sistema de SEO dinâmico
**Caminhos dos arquivos**:
- `src/components/shared/SEOHead.jsx`
- `src/hooks/useSEO.js`
- `src/utils/seoUtils.js`
**Tecnologias**: React Helmet, Schema.org, Meta tags
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Criar componente SEOHead para meta tags dinâmicas
- Implementar Open Graph tags para cada tipo de página
- Configurar Twitter Card tags
- Implementar JSON-LD structured data para artigos
- Adicionar canonical URLs e alternate languages
- Configurar sitemap.xml generation para páginas do blog

### 9. Implementar tratamento de erros e estados de loading
**Caminhos dos arquivos**:
- `src/components/blog/BlogError.jsx`
- `src/components/blog/BlogLoading.jsx`
- `src/components/blog/BlogEmpty.jsx`
**Tecnologias**: Error boundaries, Suspense, Skeleton UI
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar boundary de erro específico para páginas do blog
- Implementar skeleton loading para cada tipo de página
- Configurar fallbacks para API indisponível
- Adicionar mensagens de erro user-friendly
- Implementar retry automático com backoff exponencial

## Critérios de Aceitação

- [ ] Página `/blog` carrega e exibe lista paginada de artigos
- [ ] Infinite scroll funcionando suavemente na listagem
- [ ] Filtros por categoria funcionais com URLs preservadas
- [ ] Busca em tempo real com debounce funcionando
- [ ] Página `/blog/[slug]` renderiza artigos individuais corretamente
- [ ] Meta tags SEO dinâmicas corretas em todas as páginas
- [ ] Open Graph e Twitter Cards funcionando no compartilhamento
- [ ] Breadcrumbs dinâmicos em todas as páginas do blog
- [ ] Páginas de categoria `/blog/categoria/[slug]` funcionais
- [ ] Botões de compartilhamento social funcionais
- [ ] Estados de loading, erro e empty bem implementados
- [ ] Performance: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Responsividade funcional em todos os dispositivos
- [ ] Cache otimizado com invalidação apropriada

## Dependências
- FEATURE_001 concluída (API endpoints funcionais)
- Site principal configurado com React Router v6
- Design system e componentes base implementados
- React Query configurado no projeto