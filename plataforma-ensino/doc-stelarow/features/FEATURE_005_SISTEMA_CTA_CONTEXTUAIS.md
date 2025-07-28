# FEATURE_005: Sistema de Call-to-Actions Contextuais

## Descrição
Implementar sistema inteligente de CTAs contextuais no blog para converter visitantes em leads qualificados, direcionando-os para cursos específicos ou ações de conversão baseadas no conteúdo dos artigos.

## Contexto da SPEC.md
- **EPIC 3: CONVERSÃO E GERAÇÃO DE LEADS** - Seção "Sistema de Call-to-Actions Contextuais"
- Cenários: CTA específico por artigo, CTA genérico, CTAs no meio do conteúdo
- Requisitos: Cursos relacionados, elementos de urgência, CTAs discretos inline

## Contexto da ARCHITECTURE.md
- Dados de CTA já modelados na tabela blog_posts (cta_course_id, cta_title, cta_description)
- Sistema de componentes estabelecido para reutilização
- Integração com cursos existentes no site principal

## Tarefas

### 1. Implementar componente CTA principal para final de artigos
**Caminho do arquivo**: `src/components/blog/BlogCTA.jsx`
**Tecnologias**: React, Conditional rendering, Course integration
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Criar componente CTA destacado visualmente para final de artigos
- Implementar variantes: específico (com curso) e genérico
- Configurar layout responsivo com imagem, título, descrição e botão
- Implementar elementos de urgência configuráveis ("Vagas limitadas", "Oferta especial")
- Adicionar tracking de cliques para analytics
- Configurar animações de entrada suaves

### 2. Desenvolver sistema de CTAs inline discretos
**Caminhos dos arquivos**:
- `src/components/blog/InlineCTA.jsx`
- `src/utils/ctaParser.js`
**Tecnologias**: Content parsing, Conditional insertion, UX optimization
**Duração Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`, `Sequential Thinking`

- Criar componente CTA discreto para inserção no meio do conteúdo
- Implementar parser para detectar artigos longos (>1000 palavras)
- Configurar inserção automática após parágrafos específicos
- Implementar CTAs para recursos gratuitos (e-books, webinars, guias)
- Garantir que não interrompam excessivamente a leitura
- Adicionar controle de frequência (máximo 2 CTAs inline por artigo)

### 3. Implementar sistema de course matching inteligente
**Caminhos dos arquivos**:
- `src/utils/courseMatchingService.js`
- `src/hooks/useCourseSuggestions.js`
**Tecnologias**: Content analysis, Course recommendation, API integration
**Duração Estimada**: 6 horas
**MCPs/Ferramentas**: `Context7`, `Sequential Thinking`

- Desenvolver algoritmo para sugerir cursos baseado em conteúdo do artigo
- Implementar fallback inteligente quando não há curso específico configurado
- Criar sistema de tags/palavras-chave para matching automático
- Integrar com API de cursos do site principal
- Implementar cache de sugestões para performance
- Configurar rankings de relevância de cursos

### 4. Desenvolver CTAs genéricos de alta conversão
**Caminhos dos arquivos**:
- `src/components/blog/GenericCTA.jsx`
- `src/data/ctaTemplates.js`
**Tecnologias**: A/B testing ready, Conversion optimization
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar templates de CTA genérico para diferentes contextos
- Implementar variações de mensagem ("Explore nossos cursos", "Transforme sua carreira")
- Configurar direcionamento para página principal de cursos (/cursos)
- Implementar elementos visuais de conversão (setas, ícones, cores contrast)
- Preparar estrutura para A/B testing futuro
- Adicionar mensagens de valor proposição da escola

### 5. Implementar sistema de personalização de CTAs
**Caminhos dos arquivos**:
- `src/components/admin/blog/CTACustomizer.tsx`
- `src/utils/ctaPersonalization.js`
**Tecnologias**: Admin interface, Dynamic content, Supabase integration
**Duração Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`

- Criar interface admin para customizar CTAs por artigo
- Implementar preview em tempo real das mudanças
- Configurar sistema de templates reutilizáveis
- Adicionar editor de texto rico para descrições de CTA
- Implementar upload de imagens específicas para CTAs
- Configurar sistema de agendamento de CTAs (ex: promoções temporárias)

### 6. Desenvolver CTAs para diferentes tipos de conversão
**Caminhos dos arquivos**:
- `src/components/blog/LeadMagnetCTA.jsx`
- `src/components/blog/ConsultationCTA.jsx`
- `src/components/blog/NewsletterCTA.jsx`
**Tecnologias**: Lead generation, Form integration, Multi-step conversion
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Implementar CTA para lead magnets (e-books, guias, templates)
- Criar CTA para agendamento de consulta gratuita
- Desenvolver CTA para newsletter com incentivos
- Implementar formulários modais para captura rápida
- Configurar integração com EmailJS ou sistema de email
- Adicionar validação e feedback visual

### 7. Implementar sistema de urgência e escassez
**Caminhos dos arquivos**:
- `src/components/blog/UrgencyCTA.jsx`
- `src/utils/urgencyHelpers.js`
**Tecnologias**: Dynamic content, Time-based triggers, Psychology-driven UX
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Implementar contadores de tempo para ofertas limitadas
- Criar indicadores de vagas restantes (dinâmicos ou estáticos)
- Desenvolver badges de urgência ("Últimos dias", "Vagas limitadas")
- Implementar sistema de promoções temporárias
- Configurar triggers baseados em comportamento (tempo de leitura)
- Adicionar elementos visuais de urgência (cores, animações)

### 8. Implementar tracking e analytics de CTAs
**Caminhos dos arquivos**:
- `src/utils/ctaAnalytics.js`
- `src/hooks/useCTATracking.js`
**Tecnologias**: Event tracking, Conversion analytics, Dashboard integration
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Sequential Thinking`

- Implementar tracking de impressões e cliques por CTA
- Configurar eventos customizados no Google Analytics
- Criar métricas de conversão (CTR, conversion rate)
- Implementar heatmaps de interação com CTAs
- Configurar reports automáticos para admin dashboard
- Adicionar A/B testing tracking framework

### 9. Otimizar CTAs para mobile e diferentes dispositivos
**Caminhos dos arquivos**:
- `src/styles/cta-responsive.css`
- `src/hooks/useCTAResponsive.js`
**Tecnologias**: Responsive design, Touch optimization, Mobile UX
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Otimizar tamanhos de botão para touch devices
- Implementar layouts específicos para mobile vs desktop
- Configurar posicionamento inteligente em telas pequenas
- Implementar sticky CTAs para mobile (quando apropriado)
- Otimizar carregamento de imagens em CTAs para mobile
- Testar usabilidade em diferentes tamanhos de tela

## Critérios de Aceitação

- [ ] CTA principal aparece no final de todos os artigos
- [ ] CTAs específicos mostram curso relacionado com imagem e descrição
- [ ] CTAs genéricos direcionam para /cursos com mensagem motivacional
- [ ] CTAs inline aparecem apenas em artigos longos (>1000 palavras)
- [ ] Sistema de matching sugere cursos relevantes automaticamente
- [ ] Interface admin permite customizar CTAs por artigo
- [ ] Elementos de urgência funcionam quando configurados
- [ ] Tracking de cliques e conversões funcionando
- [ ] CTAs otimizados para mobile com touch-friendly buttons
- [ ] Performance não impactada (CTAs carregam sem afetar LCP)
- [ ] A/B testing framework preparado para uso futuro
- [ ] Formulários de captura integrados funcionando
- [ ] Preview de CTAs funcionando na interface admin

## Dependências
- FEATURE_003 concluída (páginas do blog funcionais)
- API de cursos do site principal acessível
- Sistema de analytics (Google Analytics) configurado
- Design system estabelecido para componentes CTA