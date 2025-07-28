# FEATURE_003: P�ginas de Blog no Site Principal

## Descri��o
Implementar p�ginas do blog no site principal (React/Vite) consumindo a API da plataforma, incluindo listagem de artigos, artigos individuais e p�ginas de categoria com SEO otimizado.

## Contexto da SPEC.md
- **EPIC 2: FRONTEND NO SITE PRINCIPAL** - Se��o "P�ginas de Blog no Site Principal"
- Cen�rios: P�gina de listagem (/blog), artigo individual (/blog/[slug]), categoria (/blog/categoria/[slug])
- Requisitos: Pagina��o, SEO otimizado, breadcrumbs, compartilhamento social

## Contexto da ARCHITECTURE.md
- **Se��o 1: ESTRUTURA DE DIRET�RIOS** - Site Principal estrutura do blog
- **Se��o 5: GERENCIAMENTO DE ESTADO** - React Query para cache e estado server
- **Se��o 6: FLUXO DE DADOS** - Arquitetura de integra��o entre aplica��es

## Tarefas

### 1. Configurar React Query e servi�os da API do blog
**Caminhos dos arquivos**:
- `src/services/blogAPI.js`
- `src/hooks/useBlogAPI.js`
- `src/providers/QueryProvider.jsx`
**Tecnologias**: React Query, Axios, Error handling
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Configurar cliente HTTP com interceptadores para a API da plataforma
- Implementar hooks customizados para posts, categorias e busca
- Configurar cache otimizado (5min para listas, 1h para artigos)
- Implementar retry logic e tratamento de erros
- Configurar timeout e fallbacks para dados offline

### 2. Implementar p�gina de listagem principal (/blog)
**Caminho do arquivo**: `src/pages/blog/BlogIndex.jsx`
**Tecnologias**: React Router, Infinite scroll, Filtering
**Dura��o Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`

- Criar layout de grid responsivo para cards de artigos
- Implementar infinite scroll com React Query useInfiniteQuery
- Adicionar filtros por categoria com dropdown
- Implementar busca em tempo real
- Configurar meta tags SEO para p�gina principal do blog
- Adicionar loading states e skeletons

### 3. Desenvolver componente BlogCard para listagens
**Caminho do arquivo**: `src/components/blog/BlogCard.jsx`
**Tecnologias**: React, Lazy loading, Image optimization
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar card responsivo com imagem, t�tulo, resumo e metadata
- Implementar lazy loading para imagens com placeholder
- Adicionar badges de categoria com cores din�micas
- Configurar truncamento inteligente de texto
- Implementar hover effects consistentes com design system
- Adicionar indicadores de tempo de leitura

### 4. Implementar p�gina de artigo individual (/blog/[slug])
**Caminho do arquivo**: `src/pages/blog/BlogPost.jsx`
**Tecnologias**: React Router Dynamic Routes, Markdown/HTML rendering
**Dura��o Estimada**: 6 horas
**MCPs/Ferramentas**: `Context7`

- Implementar layout de artigo com typography otimizada
- Configurar rendering seguro de conte�do HTML/Markdown
- Adicionar breadcrumbs navegacionais
- Implementar meta tags din�micas (Open Graph, Twitter Cards)
- Configurar structured data (JSON-LD Article schema)
- Adicionar navega��o para pr�ximo/anterior artigo

### 5. Criar p�ginas de categoria (/blog/categoria/[slug])
**Caminho do arquivo**: `src/pages/blog/BlogCategory.jsx`
**Tecnologias**: React Router, Filtering, SEO
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Implementar listagem filtrada por categoria espec�fica
- Adicionar header da categoria com descri��o
- Configurar pagina��o espec�fica para categoria
- Implementar meta tags SEO espec�ficas da categoria
- Adicionar breadcrumbs incluindo categoria
- Configurar canonical URLs para evitar conte�do duplicado

### 6. Implementar sistema de navega��o e breadcrumbs
**Caminhos dos arquivos**:
- `src/components/blog/BlogNavigation.jsx`
- `src/components/blog/Breadcrumbs.jsx`
**Tecnologias**: React Router, Context API
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar componente de breadcrumbs din�mico baseado na rota
- Integrar link "Blog" no menu principal do site
- Implementar navega��o de categorias no sidebar
- Adicionar indicador de p�gina ativa
- Configurar navega��o mobile responsiva

### 7. Desenvolver componentes de compartilhamento social
**Caminho do arquivo**: `src/components/blog/ShareButtons.jsx`
**Tecnologias**: Web Share API, Social Media APIs
**Dura��o Estimada**: 2 horas
**MCPs/Ferramentas**: `Context7`

- Implementar bot�es para Facebook, Twitter, LinkedIn, WhatsApp
- Configurar Web Share API para dispositivos m�veis
- Adicionar bot�o de c�pia de link
- Implementar tracking de compartilhamentos (opcional)
- Configurar textos pr�-formatados para cada plataforma

### 8. Implementar sistema de SEO din�mico
**Caminhos dos arquivos**:
- `src/components/shared/SEOHead.jsx`
- `src/hooks/useSEO.js`
- `src/utils/seoUtils.js`
**Tecnologias**: React Helmet, Schema.org, Meta tags
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Criar componente SEOHead para meta tags din�micas
- Implementar Open Graph tags para cada tipo de p�gina
- Configurar Twitter Card tags
- Implementar JSON-LD structured data para artigos
- Adicionar canonical URLs e alternate languages
- Configurar sitemap.xml generation para p�ginas do blog

### 9. Implementar tratamento de erros e estados de loading
**Caminhos dos arquivos**:
- `src/components/blog/BlogError.jsx`
- `src/components/blog/BlogLoading.jsx`
- `src/components/blog/BlogEmpty.jsx`
**Tecnologias**: Error boundaries, Suspense, Skeleton UI
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar boundary de erro espec�fico para p�ginas do blog
- Implementar skeleton loading para cada tipo de p�gina
- Configurar fallbacks para API indispon�vel
- Adicionar mensagens de erro user-friendly
- Implementar retry autom�tico com backoff exponencial

## Crit�rios de Aceita��o

- [ ] P�gina `/blog` carrega e exibe lista paginada de artigos
- [ ] Infinite scroll funcionando suavemente na listagem
- [ ] Filtros por categoria funcionais com URLs preservadas
- [ ] Busca em tempo real com debounce funcionando
- [ ] P�gina `/blog/[slug]` renderiza artigos individuais corretamente
- [ ] Meta tags SEO din�micas corretas em todas as p�ginas
- [ ] Open Graph e Twitter Cards funcionando no compartilhamento
- [ ] Breadcrumbs din�micos em todas as p�ginas do blog
- [ ] P�ginas de categoria `/blog/categoria/[slug]` funcionais
- [ ] Bot�es de compartilhamento social funcionais
- [ ] Estados de loading, erro e empty bem implementados
- [ ] Performance: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Responsividade funcional em todos os dispositivos
- [ ] Cache otimizado com invalida��o apropriada

## Depend�ncias
- FEATURE_001 conclu�da (API endpoints funcionais)
- Site principal configurado com React Router v6
- Design system e componentes base implementados
- React Query configurado no projeto