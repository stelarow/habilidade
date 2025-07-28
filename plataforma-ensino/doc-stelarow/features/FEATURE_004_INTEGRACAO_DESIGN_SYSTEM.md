# FEATURE_004: Integração com Design System do Site Principal

## Descrição
Garantir que o blog mantenha consistência visual completa com o site principal, incluindo componentes reutilizáveis, responsividade e otimizações de performance alinhadas com o design system existente.

## Contexto da SPEC.md
- **EPIC 2: FRONTEND NO SITE PRINCIPAL** - Seção "Integração com Design System do Site Principal"
- Cenários: Consistência visual, responsividade mobile, performance e otimização de assets
- Requisitos: Header/footer idênticos, design system unificado, Core Web Vitals otimizados

## Contexto da ARCHITECTURE.md
- **Seção 1: ESTRUTURA DE DIRETÓRIOS** - Componentes compartilhados e organização
- Site Principal já possui design system estabelecido com performance otimizada
- Memory manager customizado e lazy loading implementados

## Tarefas

### 1. Implementar layout base consistente para páginas do blog
**Caminhos dos arquivos**:
- `src/components/blog/BlogLayout.jsx`
- `src/components/blog/BlogHeader.jsx`
**Tecnologias**: React, CSS Modules, Tailwind CSS
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Reutilizar header e footer exatos do site principal
- Implementar container layouts responsivos idênticos
- Configurar navegação com link ativo para "Blog"
- Garantir breadcrumbs consistentes com padrão do site
- Implementar sidebar opcional para navegação de categorias
- Configurar spacing e grid system padronizados

### 2. Adaptar componentes existentes do design system para o blog
**Caminhos dos arquivos**:
- `src/components/blog/BlogButton.jsx` (baseado em Button existente)
- `src/components/blog/BlogCard.jsx` (baseado em Card existente)
- `src/components/blog/BlogBadge.jsx` (baseado em Badge existente)
**Tecnologias**: Component composition, Tailwind variants
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Estender componente Button para variantes específicas do blog (CTA, share, etc.)
- Adaptar Card component para BlogCard mantendo visual consistency
- Configurar Badge com cores de categoria mas mantendo design base
- Implementar variantes de texto e typography específicas do blog
- Garantir hover states e animations consistentes

### 3. Implementar sistema de cores e themming para o blog
**Caminhos dos arquivos**:
- `src/styles/blog-theme.css`
- `src/utils/blogTheme.js`
**Tecnologias**: CSS Custom Properties, Tailwind configuration
**Duração Estimada**: 2 horas
**MCPs/Ferramentas**: `Context7`

- Mapear cores existentes do site para contexto do blog
- Implementar palette de cores para categorias sem conflitar com brand
- Configurar dark mode consistency (se aplicável)
- Definir cores de estado (success, warning, error) alinhadas
- Implementar gradients e shadows padronizados

### 4. Otimizar responsividade específica para conteúdo de blog
**Caminhos dos arquivos**:
- `src/components/blog/ResponsiveBlogGrid.jsx`
- `src/hooks/useBlogResponsive.js`
**Tecnologias**: CSS Grid, Flexbox, Responsive hooks
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Implementar grid responsivo para listagem de artigos (1/2/3 colunas)
- Otimizar typography responsiva para conteúdo longo
- Configurar imagens responsivas com multiple breakpoints
- Implementar navegação mobile específica para blog
- Configurar sidebar collapse em dispositivos menores
- Testar em múltiplos tamanhos de tela e devices

### 5. Integrar sistema de performance do site principal
**Caminhos dos arquivos**:
- `src/utils/blogPerformance.js`
- `src/hooks/useBlogLazyLoading.js`
**Tecnologias**: Intersection Observer, Image lazy loading, Code splitting
**Duração Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`

- Reutilizar memory manager existente para componentes do blog
- Implementar lazy loading específico para imagens de artigos
- Configurar code splitting para rotas do blog
- Implementar prefetching inteligente de artigos relacionados
- Integrar com sistema de performance monitoring existente
- Configurar bundle optimization específico para páginas do blog

### 6. Implementar componentes de typography otimizada para leitura
**Caminhos dos arquivos**:
- `src/components/blog/BlogTypography.jsx`
- `src/styles/blog-typography.css`
**Tecnologias**: CSS Typography, Reading experience optimization
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Implementar hierarchy tipográfica otimizada para artigos longos
- Configurar line-height e spacing para máxima legibilidade
- Implementar contrast ratios adequados para acessibilidade
- Configurar font-size responsivo baseado em device type
- Adicionar estilos para elementos especiais (quotes, code, lists)
- Implementar reading width otimizada (ch units)

### 7. Implementar sistema de assets otimizado para blog
**Caminhos dos arquivos**:
- `src/utils/blogAssets.js`
- `src/components/blog/OptimizedBlogImage.jsx`
**Tecnologias**: Image optimization, WebP, Lazy loading
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Implementar sistema de imagens responsivas com srcset
- Configurar WebP fallback com JPEG/PNG
- Implementar placeholder blur effect durante loading
- Configurar compressão otimizada para diferentes contextos (hero, thumbnail, inline)
- Implementar CDN integration se aplicável
- Adicionar alt-text automático e acessibilidade

### 8. Configurar animações e micro-interactions consistentes
**Caminhos dos arquivos**:
- `src/components/blog/BlogAnimations.jsx`
- `src/utils/blogMotion.js`
**Tecnologias**: Framer Motion, CSS Transitions, Performance-aware animations
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Implementar hover animations consistentes com site principal
- Configurar page transitions suaves entre artigos
- Implementar scroll animations para reveal de conteúdo
- Configurar loading animations com skeleton UI
- Implementar prefers-reduced-motion respect
- Otimizar animations para performance (GPU acceleration)

### 9. Implementar testes de performance e Core Web Vitals
**Caminhos dos arquivos**:
- `src/tests/blog-performance.test.js`
- `src/utils/blogMetrics.js`
**Tecnologias**: Lighthouse CI, Web Vitals API, Performance testing
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`, `Puppeteer MCP`

- Configurar testes automatizados de LCP, FID, CLS
- Implementar monitoramento de performance em tempo real
- Configurar alerts para degradação de performance
- Implementar testes de responsive design automatizados
- Configurar bundle size monitoring específico para blog
- Implementar lighthouse CI integration

## Critérios de Aceitação

- [ ] Header e footer idênticos ao resto do site funcionando
- [ ] Todos os componentes seguem design system estabelecido
- [ ] Cores, typography e spacing consistentes em todas as páginas
- [ ] Grid responsivo funcionando perfeitamente em todos os devices
- [ ] Performance: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Images lazy loading com placeholder blur funcionando
- [ ] Code splitting otimizado para rotas do blog
- [ ] Animations consistentes e performance-aware
- [ ] Typography otimizada para reading experience
- [ ] Bundle size otimizado sem impactar resto do site
- [ ] Testes automatizados de performance passando
- [ ] Dark mode consistency (se aplicável)
- [ ] Acessibilidade mantida (contrast ratios, keyboard navigation)

## Dependências
- FEATURE_003 concluída (páginas básicas implementadas)
- Site principal com design system estabelecido
- Performance monitoring tools configurados
- Build system otimizado (Vite) configurado