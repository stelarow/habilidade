# FEATURE_003: P�ginas P�blicas do Blog e Navega��o

## Descri��o:
Implementar as p�ginas p�blicas do blog otimizadas para SEO e experi�ncia do usu�rio, incluindo visualiza��o de artigos individuais, listagens por categoria/tag, sistema de busca e integra��o de CTAs para convers�o de leads.

## Contexto de Refer�ncia:
- **SPEC.md**: Se��o "EPIC 2: VISUALIZA��O P�BLICA E JORNADA DO UTILIZADOR" (linhas 82-184)
- **ARCHITECTURE.md**: Se��es "Otimiza��o de Performance" (linhas 1161-1236), "SEO e Metadados" (linhas 1237-1305), "Sistema de Busca" (linhas 1306-1400)

## Configura��o do Tema Shadcn/UI:
Esta feature utiliza o **tema VIOLET** do Shadcn/UI para manter consist�ncia com a identidade visual da Habilidade:
- **Primary (#d400ff)** ≈ violet-500 (258.3 89.5% 66.3%) - correspond�ncia muito pr�xima
- **Accent (#a000ff)** ≈ violet-600 (262.1 83.3% 57.8%) - alinhamento com tons mais escuros
- **Configura��o**: Definir baseColor como "violet" no components.json para aplicar automaticamente
- **Vantagem**: Mant�m harmonia visual entre as p�ginas p�blicas e a identidade da marca

## Tarefas:

### 1. **Implementar p�gina individual do artigo com SSR/SSG**
   * **Caminho de implementa��o**: `src/app/blog/[slug]/page.tsx`
   * **Descri��o**: Criar p�gina otimizada para SEO com renderiza��o do servidor
   * **Funcionalidades**:
     - Renderiza��o SSR/SSG para performance e SEO
     - Metadados din�micos (Open Graph, Twitter Cards)
     - Estrutura sem�ntica HTML5
     - Schema markup para rich snippets
     - Incremento autom�tico de views
   * **Tecnologias**: Next.js 14, TypeScript, Metadata API
   * **Contexto**: `SPEC.md` (linhas 88-100), `ARCHITECTURE.md` (linhas 1165-1235)
   * **MCPs/Ferramentas**: `Context7` (padr�es Next.js), `Supabase MCP`
   * **Instru��o Shadcn/ui**: Utilizar componentes `Card`, `Badge`, `Separator`, `Avatar` para layout do artigo. **Tema VIOLET**: Usar configura��o violet para consist�ncia com identidade Habilidade
   * **Crit�rios de Aceita��o**:
     - P�gina renderizada no servidor (SSR/SSG)
     - Meta tags preenchidas dinamicamente
     - Schema markup implementado
     - Artigos draft inacess�veis publicamente (404)
   * **Dura��o Estimada**: 8 horas

### 2. **Criar componente de visualiza��o de artigo**
   * **Caminho de implementa��o**: `src/components/blog/ArticleView.tsx`
   * **Descri��o**: Componente responsivo para exibi��o do conte�do do artigo
   * **Elementos inclu�dos**:
     - Cabe�alho com t�tulo, autor, data e imagem
     - Conte�do renderizado do Markdown
     - Breadcrumbs de navega��o
     - Informa��es do autor
     - Tags e categorias
     - Tempo estimado de leitura
   * **Tecnologias**: React, Markdown parser, Shadcn/UI
   * **Contexto**: `ARCHITECTURE.md` (linhas 45-46)
   * **MCPs/Ferramentas**: `Context7`
   * **Instru��o Shadcn/ui**: Usar componentes `Card`, `Avatar`, `Badge`, `Breadcrumb`, `Separator` para estrutura visual. **Tema VIOLET**: Aplicar cores violet-500/600 automaticamente
   * **Crit�rios de Aceita��o**:
     - Layout responsivo funcionando
     - Conte�do Markdown renderizado corretamente
     - Informa��es do autor exibidas
     - Navega��o breadcrumbs implementada
   * **Dura��o Estimada**: 6 horas

### 3. **Implementar p�gina principal do blog com listagem**
   * **Caminho de implementa��o**: `src/app/blog/page.tsx`
   * **Descri��o**: P�gina principal com lista paginada de artigos publicados
   * **Funcionalidades**:
     - Listagem ordenada por data de publica��o
     - Cards de artigo com preview
     - Pagina��o (10 artigos por p�gina)
     - Filtros por categoria
     - Campo de busca integrado
   * **Tecnologias**: Next.js, Shadcn/UI
   * **Contexto**: `SPEC.md` (linhas 111-117), `ARCHITECTURE.md` (linhas 20-21)
   * **MCPs/Ferramentas**: `Context7`, `Supabase MCP`
   * **Instru��o Shadcn/ui**: Utilizar componentes `Card`, `Input`, `Select`, `Pagination` para interface de listagem. **Tema VIOLET**: Manter consist�ncia com baseColor violet
   * **Crit�rios de Aceita��o**:
     - Lista de artigos carregada corretamente
     - Pagina��o funcionando
     - Filtros operacionais
     - Cards com informa��es completas (t�tulo, resumo, categoria, autor, data)
   * **Dura��o Estimada**: 7 horas

### 4. **Criar componente ArticleCard para listagens**
   * **Caminho de implementa��o**: `src/components/blog/ArticleCard.tsx`
   * **Descri��o**: Card reutiliz�vel para exibi��o de artigos em listagens
   * **Elementos do card**:
     - Imagem de destaque
     - T�tulo e excerpt
     - Categoria principal
     - Data de publica��o e autor
     - Contador de visualiza��es
     - Link para artigo completo
   * **Tecnologias**: React, Shadcn/UI
   * **Contexto**: `ARCHITECTURE.md` (linhas 41, 509-576)
   * **MCPs/Ferramentas**: `Context7`
   * **Instru��o Shadcn/ui**: Implementar com componentes `Card`, `CardHeader`, `CardContent`, `CardFooter`, `Badge`, `Avatar`. **Tema VIOLET**: Utilizar cores violet do tema para elementos interativos
   * **Crit�rios de Aceita��o**:
     - Card responsivo e visualmente atraente
     - Todas as informa��es exibidas corretamente
     - Hover effects implementados
     - Link funcional para artigo completo
   * **Dura��o Estimada**: 4 horas

### 5. **Implementar p�ginas de listagem por categoria**
   * **Caminho de implementa��o**: `src/app/blog/categoria/[slug]/page.tsx`
   * **Descri��o**: P�ginas dedicadas para cada categoria com artigos filtrados
   * **Funcionalidades**:
     - Listagem filtrada por categoria espec�fica
     - Breadcrumbs indicando categoria atual
     - Metadados SEO espec�ficos da categoria
     - Descri��o da categoria se dispon�vel
     - Pagina��o para muitos artigos
   * **Tecnologias**: Next.js, TypeScript
   * **Contexto**: `SPEC.md` (linhas 118-123), `ARCHITECTURE.md` (linhas 22-25)
   * **MCPs/Ferramentas**: `Context7`, `Supabase MCP`
   * **Instru��o Shadcn/ui**: Reutilizar componentes de listagem com `Breadcrumb` espec�fico. **Tema VIOLET**: Aplicar consist�ncia de cores violet em toda navega��o
   * **Crit�rios de Aceita��o**:
     - Filtro por categoria funcionando
     - Breadcrumbs corretos implementados
     - SEO metadata espec�fica
     - generateStaticParams para categorias principais
   * **Dura��o Estimada**: 5 horas

### 6. **Implementar p�ginas de listagem por tag**
   * **Caminho de implementa��o**: `src/app/blog/tag/[slug]/page.tsx`
   * **Descri��o**: P�ginas para visualiza��o de artigos por tag espec�fica
   * **Funcionalidades**:
     - Filtro por tag selecionada
     - Listagem de artigos relacionados
     - Breadcrumbs com indica��o da tag
     - Metadados SEO para a tag
     - Sugest�es de tags relacionadas
   * **Tecnologias**: Next.js, TypeScript
   * **Contexto**: `SPEC.md` (linhas 125-130), `ARCHITECTURE.md` (linhas 26-28)
   * **MCPs/Ferramentas**: `Context7`, `Supabase MCP`
   * **Instru��o Shadcn/ui**: Usar layout similar ao de categorias com componentes `Badge` para tags relacionadas. **Tema VIOLET**: Badges com cores violet para destaque visual
   * **Crit�rios de Aceita��o**:
     - Filtro por tag operacional
     - Breadcrumbs espec�ficos para tags
     - Tags relacionadas sugeridas
     - SEO otimizado para tags
   * **Dura��o Estimada**: 5 horas

### 7. **Implementar sistema de busca interno**
   * **Caminho de implementa��o**: `src/app/blog/pesquisar/page.tsx` e `src/components/blog/ArticleSearch.tsx`
   * **Descri��o**: Sistema de busca com p�gina de resultados e componente de pesquisa
   * **Funcionalidades**:
     - Campo de busca com auto-complete
     - P�gina de resultados com highlights
     - Ordena��o por relev�ncia
     - Filtros avan�ados (categoria, data)
     - Sugest�es para termos sem resultados
   * **Tecnologias**: React, PostgreSQL Full Text Search
   * **Contexto**: `SPEC.md` (linhas 139-159), `ARCHITECTURE.md` (linhas 1306-1400)
   * **MCPs/Ferramentas**: `Context7`, `Supabase MCP`
   * **Instru��o Shadcn/ui**: Utilizar componentes `Input`, `Command`, `Popover`, `Select` para interface de busca. **Tema VIOLET**: Command component com highlighting violet nos resultados
   * **Crit�rios de Aceita��o**:
     - Busca textual funcionando corretamente
     - Resultados ordenados por relev�ncia
     - Highlights nos termos encontrados
     - Mensagem adequada para "sem resultados"
   * **Dura��o Estimada**: 8 horas

### 8. **Implementar componentes de CTA integrados**
   * **Caminho de implementa��o**: `src/components/blog/CTASection.tsx`
   * **Descri��o**: Se��es de call-to-action para convers�o de leads
   * **Tipos de CTA**:
     - CTA espec�fico por artigo (curso relacionado)
     - CTA gen�rico para cat�logo de cursos
     - CTA de newsletter/contato
     - Banner promocional configur�vel
   * **Tecnologias**: React, Shadcn/UI
   * **Contexto**: `SPEC.md` (linhas 161-182), `ARCHITECTURE.md` (linha 50)
   * **MCPs/Ferramentas**: `Context7`
   * **Instru��o Shadcn/ui**: Criar com componentes `Card`, `Button`, `Badge` seguindo design system da Stelarow. **Tema VIOLET**: CTAs com botões violet para forte chamada visual
   * **Crit�rios de Aceita��o**:
     - CTAs espec�ficos exibidos corretamente
     - CTAs gen�ricos como fallback
     - Links direcionando para cursos/p�ginas corretas
     - Design consistente com identidade Stelarow
   * **Dura��o Estimada**: 6 horas

### 9. **Implementar pagina��o e controles de navega��o**
   * **Caminho de implementa��o**: `src/components/blog/ArticlePagination.tsx`
   * **Descri��o**: Sistema de pagina��o para listagens de artigos
   * **Funcionalidades**:
     - Navega��o num�rica de p�ginas
     - Bot�es anterior/pr�ximo
     - Indicador de p�gina atual
     - Jump direto para p�ginas espec�ficas
     - Informa��es de total de resultados
   * **Tecnologias**: React, Shadcn/UI
   * **Contexto**: `SPEC.md` (linhas 132-137), `ARCHITECTURE.md` (linha 47)
   * **MCPs/Ferramentas**: `Context7`
   * **Instru��o Shadcn/ui**: Usar componente `Pagination` da documenta��o shadcn/ui. **Tema VIOLET**: Pagination com cores violet para navegação intuitiva
   * **Crit�rios de Aceita��o**:
     - Pagina��o funcionando em todas as listagens
     - Navega��o intuitiva implementada
     - Estado atual claramente indicado
     - Performance otimizada para muitas p�ginas
   * **Dura��o Estimada**: 4 horas

### 10. **Implementar gera��o de metadados din�micos**
   * **Caminho de implementa��o**: `src/lib/seo/metadata-generator.ts`
   * **Descri��o**: Sistema para gera��o autom�tica de metadados SEO
   * **Funcionalidades**:
     - Metadados espec�ficos para artigos
     - Open Graph tags completas
     - Twitter Cards otimizadas
     - Schema.org markup (Article, Author, Organization)
     - Canonical URLs corretas
   * **Tecnologias**: Next.js Metadata API, TypeScript
   * **Contexto**: `ARCHITECTURE.md` (linhas 1237-1305)
   * **MCPs/Ferramentas**: `Context7`
   * **Crit�rios de Aceita��o**:
     - Metadados gerados automaticamente
     - Open Graph e Twitter Cards funcionando
     - Schema markup validado
     - SEO score alto nas ferramentas de auditoria
   * **Dura��o Estimada**: 6 horas

### 11. **Implementar tratamento de erros e p�ginas 404**
   * **Caminho de implementa��o**: `src/app/blog/not-found.tsx` e `src/app/blog/error.tsx`
   * **Descri��o**: P�ginas de erro customizadas para o blog
   * **Funcionalidades**:
     - P�gina 404 personalizada para artigos n�o encontrados
     - Error boundary para erros de renderiza��o
     - Sugest�es de artigos relacionados em p�ginas de erro
     - Links de navega��o para recupera��o
   * **Tecnologias**: Next.js, React Error Boundaries
   * **Contexto**: `SPEC.md` (linhas 102-106), `ARCHITECTURE.md` (linhas 1407-1476)
   * **MCPs/Ferramentas**: `Context7`
   * **Instru��o Shadcn/ui**: Usar componentes `Alert`, `Button`, `Card` para p�ginas de erro amig�veis. **Tema VIOLET**: Manter identidade visual mesmo em estados de erro
   * **Crit�rios de Aceita��o**:
     - 404 customizado para blog implementado
     - Error boundaries funcionando
     - Sugest�es de recupera��o fornecidas
     - Logs de erro configurados adequadamente
   * **Dura��o Estimada**: 4 horas

### 12. **Implementar testes E2E para navega��o p�blica**
   * **Caminho de implementa��o**: `e2e/blog/public-navigation.spec.ts`
   * **Descri��o**: Testes automatizados para jornada do usu�rio p�blico
   * **Cen�rios de teste**:
     - Navega��o na listagem principal
     - Acesso a artigo individual
     - Busca e filtros funcionando
     - Pagina��o operacional
     - CTAs redirecionando corretamente
     - Responsividade em diferentes dispositivos
   * **Tecnologias**: Playwright, TypeScript
   * **MCPs/Ferramentas**: `Puppeteer MCP`
   * **Crit�rios de Aceita��o**:
     - Todos os fluxos p�blicos testados
     - Testes mobile e desktop
     - Valida��o de SEO b�sico
     - Performance acceptable verificada
   * **Dura��o Estimada**: 7 horas

## Crit�rios de Aceita��o Gerais:
- [ ] P�gina individual de artigo com SSR/SSG otimizada
- [ ] Lista principal do blog com pagina��o
- [ ] P�ginas de categoria e tag funcionais
- [ ] Sistema de busca operacional
- [ ] CTAs integrados e funcionando
- [ ] Metadados SEO din�micos implementados
- [ ] Navega��o intuitiva e responsiva
- [ ] Tratamento de erros adequado
- [ ] Performance otimizada (Core Web Vitals)
- [ ] Testes E2E cobrindo jornada do usu�rio

## Depend�ncias:
- FEATURE_001 (Schema do blog) implementada
- FEATURE_002 (Interface administrativa) parcialmente implementada
- Componentes Shadcn/UI dispon�veis
- Sistema de roteamento Next.js configurado

## Estimativa Total: 70 horas

## Notas de Implementa��o:
- Priorizar performance e SEO em todas as implementa��es
- Utilizar Sequential Thinking para otimiza��o de Core Web Vitals
- Implementar Progressive Enhancement para JavaScript
- Garantir acessibilidade completa (WCAG 2.1 AA)
- Testar em m�ltiplos dispositivos e navegadores
- Implementar fallbacks graceful para funcionalidades avan�adas