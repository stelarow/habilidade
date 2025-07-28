# FEATURE_005: Sistema de Call-to-Actions Contextuais

## Descri��o
Implementar sistema inteligente de CTAs contextuais no blog para converter visitantes em leads qualificados, direcionando-os para cursos espec�ficos ou a��es de convers�o baseadas no conte�do dos artigos.

## Contexto da SPEC.md
- **EPIC 3: CONVERS�O E GERA��O DE LEADS** - Se��o "Sistema de Call-to-Actions Contextuais"
- Cen�rios: CTA espec�fico por artigo, CTA gen�rico, CTAs no meio do conte�do
- Requisitos: Cursos relacionados, elementos de urg�ncia, CTAs discretos inline

## Contexto da ARCHITECTURE.md
- Dados de CTA j� modelados na tabela blog_posts (cta_course_id, cta_title, cta_description)
- Sistema de componentes estabelecido para reutiliza��o
- Integra��o com cursos existentes no site principal

## Tarefas

### 1. Implementar componente CTA principal para final de artigos
**Caminho do arquivo**: `src/components/blog/BlogCTA.jsx`
**Tecnologias**: React, Conditional rendering, Course integration
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Criar componente CTA destacado visualmente para final de artigos
- Implementar variantes: espec�fico (com curso) e gen�rico
- Configurar layout responsivo com imagem, t�tulo, descri��o e bot�o
- Implementar elementos de urg�ncia configur�veis ("Vagas limitadas", "Oferta especial")
- Adicionar tracking de cliques para analytics
- Configurar anima��es de entrada suaves

### 2. Desenvolver sistema de CTAs inline discretos
**Caminhos dos arquivos**:
- `src/components/blog/InlineCTA.jsx`
- `src/utils/ctaParser.js`
**Tecnologias**: Content parsing, Conditional insertion, UX optimization
**Dura��o Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`, `Sequential Thinking`

- Criar componente CTA discreto para inser��o no meio do conte�do
- Implementar parser para detectar artigos longos (>1000 palavras)
- Configurar inser��o autom�tica ap�s par�grafos espec�ficos
- Implementar CTAs para recursos gratuitos (e-books, webinars, guias)
- Garantir que n�o interrompam excessivamente a leitura
- Adicionar controle de frequ�ncia (m�ximo 2 CTAs inline por artigo)

### 3. Implementar sistema de course matching inteligente
**Caminhos dos arquivos**:
- `src/utils/courseMatchingService.js`
- `src/hooks/useCourseSuggestions.js`
**Tecnologias**: Content analysis, Course recommendation, API integration
**Dura��o Estimada**: 6 horas
**MCPs/Ferramentas**: `Context7`, `Sequential Thinking`

- Desenvolver algoritmo para sugerir cursos baseado em conte�do do artigo
- Implementar fallback inteligente quando n�o h� curso espec�fico configurado
- Criar sistema de tags/palavras-chave para matching autom�tico
- Integrar com API de cursos do site principal
- Implementar cache de sugest�es para performance
- Configurar rankings de relev�ncia de cursos

### 4. Desenvolver CTAs gen�ricos de alta convers�o
**Caminhos dos arquivos**:
- `src/components/blog/GenericCTA.jsx`
- `src/data/ctaTemplates.js`
**Tecnologias**: A/B testing ready, Conversion optimization
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar templates de CTA gen�rico para diferentes contextos
- Implementar varia��es de mensagem ("Explore nossos cursos", "Transforme sua carreira")
- Configurar direcionamento para p�gina principal de cursos (/cursos)
- Implementar elementos visuais de convers�o (setas, �cones, cores contrast)
- Preparar estrutura para A/B testing futuro
- Adicionar mensagens de valor proposi��o da escola

### 5. Implementar sistema de personaliza��o de CTAs
**Caminhos dos arquivos**:
- `src/components/admin/blog/CTACustomizer.tsx`
- `src/utils/ctaPersonalization.js`
**Tecnologias**: Admin interface, Dynamic content, Supabase integration
**Dura��o Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`, `Supabase MCP`

- Criar interface admin para customizar CTAs por artigo
- Implementar preview em tempo real das mudan�as
- Configurar sistema de templates reutiliz�veis
- Adicionar editor de texto rico para descri��es de CTA
- Implementar upload de imagens espec�ficas para CTAs
- Configurar sistema de agendamento de CTAs (ex: promo��es tempor�rias)

### 6. Desenvolver CTAs para diferentes tipos de convers�o
**Caminhos dos arquivos**:
- `src/components/blog/LeadMagnetCTA.jsx`
- `src/components/blog/ConsultationCTA.jsx`
- `src/components/blog/NewsletterCTA.jsx`
**Tecnologias**: Lead generation, Form integration, Multi-step conversion
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Implementar CTA para lead magnets (e-books, guias, templates)
- Criar CTA para agendamento de consulta gratuita
- Desenvolver CTA para newsletter com incentivos
- Implementar formul�rios modais para captura r�pida
- Configurar integra��o com EmailJS ou sistema de email
- Adicionar valida��o e feedback visual

### 7. Implementar sistema de urg�ncia e escassez
**Caminhos dos arquivos**:
- `src/components/blog/UrgencyCTA.jsx`
- `src/utils/urgencyHelpers.js`
**Tecnologias**: Dynamic content, Time-based triggers, Psychology-driven UX
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Implementar contadores de tempo para ofertas limitadas
- Criar indicadores de vagas restantes (din�micos ou est�ticos)
- Desenvolver badges de urg�ncia ("�ltimos dias", "Vagas limitadas")
- Implementar sistema de promo��es tempor�rias
- Configurar triggers baseados em comportamento (tempo de leitura)
- Adicionar elementos visuais de urg�ncia (cores, anima��es)

### 8. Implementar tracking e analytics de CTAs
**Caminhos dos arquivos**:
- `src/utils/ctaAnalytics.js`
- `src/hooks/useCTATracking.js`
**Tecnologias**: Event tracking, Conversion analytics, Dashboard integration
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Sequential Thinking`

- Implementar tracking de impress�es e cliques por CTA
- Configurar eventos customizados no Google Analytics
- Criar m�tricas de convers�o (CTR, conversion rate)
- Implementar heatmaps de intera��o com CTAs
- Configurar reports autom�ticos para admin dashboard
- Adicionar A/B testing tracking framework

### 9. Otimizar CTAs para mobile e diferentes dispositivos
**Caminhos dos arquivos**:
- `src/styles/cta-responsive.css`
- `src/hooks/useCTAResponsive.js`
**Tecnologias**: Responsive design, Touch optimization, Mobile UX
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Otimizar tamanhos de bot�o para touch devices
- Implementar layouts espec�ficos para mobile vs desktop
- Configurar posicionamento inteligente em telas pequenas
- Implementar sticky CTAs para mobile (quando apropriado)
- Otimizar carregamento de imagens em CTAs para mobile
- Testar usabilidade em diferentes tamanhos de tela

## Crit�rios de Aceita��o

- [ ] CTA principal aparece no final de todos os artigos
- [ ] CTAs espec�ficos mostram curso relacionado com imagem e descri��o
- [ ] CTAs gen�ricos direcionam para /cursos com mensagem motivacional
- [ ] CTAs inline aparecem apenas em artigos longos (>1000 palavras)
- [ ] Sistema de matching sugere cursos relevantes automaticamente
- [ ] Interface admin permite customizar CTAs por artigo
- [ ] Elementos de urg�ncia funcionam quando configurados
- [ ] Tracking de cliques e convers�es funcionando
- [ ] CTAs otimizados para mobile com touch-friendly buttons
- [ ] Performance n�o impactada (CTAs carregam sem afetar LCP)
- [ ] A/B testing framework preparado para uso futuro
- [ ] Formul�rios de captura integrados funcionando
- [ ] Preview de CTAs funcionando na interface admin

## Depend�ncias
- FEATURE_003 conclu�da (p�ginas do blog funcionais)
- API de cursos do site principal acess�vel
- Sistema de analytics (Google Analytics) configurado
- Design system estabelecido para componentes CTA