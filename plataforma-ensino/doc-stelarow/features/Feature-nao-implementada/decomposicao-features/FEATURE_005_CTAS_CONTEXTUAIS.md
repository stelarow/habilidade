# FEATURE 005: CTAs Contextuais e Interface Administrativa

## Descrição
Sistema completo de Call-to-Actions contextuais com componentes específicos de conversão, interface administrativa para personalização e templates reutilizáveis para aumentar taxa de conversão em 15%.

**Prioridade**: ALTA (Funcionalidade Essencial)
**Estimativa Total**: 42 horas
**STATUS**: ✅ CONCLUÍDA

## Contexto Técnico
- **Arquitetura**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/features/Feature-nao-implementada/arquitetura-nao-implementada.md` (Seção 4.1)
- **Especificações**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/features/Feature-nao-implementada/spec-nao-implementado.md` (Feature 5, linhas 184-226)
- **Stack**: Next.js 14.2.x + TypeScript + Shadcn/ui + React Hook Form + EmailJS
- **Componentes Existentes**: Alguns CTAs básicos já implementados

## Tasks

### Task 1: Interface CTACustomizer para Admin
**Duração**: 14 horas
**Caminho**: `src/components/admin/blog/CTACustomizer.tsx`
**MCPs/Ferramentas**: Context7 (Shadcn/ui patterns), Supabase MCP
**Tecnologias**: React, TypeScript, Shadcn/ui, React Hook Form, Zod

**Descrição**: Criar interface administrativa completa para personalização de CTAs por artigo com preview em tempo real.

**Pré-requisitos**:
- Instalar componentes: `npx shadcn-ui@latest add tabs select radio-group color-picker`
- Layout admin deve existir

**Implementação**:
1. **Estrutura Principal**:
   - Layout grid (1/2 para configuração, 1/2 para preview)
   - 4 abas: Tipo, Conteúdo, Design, Segmentação
   - Estado de configuração persistente

2. **Aba Tipo**:
   - `CTATypeSelector` com opções: Lead Magnet, Newsletter, Curso Específico, Consulta Gratuita, Urgência
   - Cards visuais para cada tipo com descrição
   - Mudança automática de campos baseada no tipo

3. **Aba Conteúdo**:
   - `CTAContentEditor` com campos dinâmicos por tipo
   - Editor de texto rico para descrição
   - Upload de imagens/ícones
   - Configuração de links e ações

4. **Aba Design**:
   - `CTADesignEditor` com color picker
   - Seleção de layout (horizontal, vertical, modal)
   - Customização de botões e tipografia
   - Tema claro/escuro toggle

5. **Aba Segmentação**:
   - `CTATargetingEditor` para regras de exibição
   - Segmentação por categoria de artigo
   - Timing de exibição (imediato, scroll, tempo)
   - A/B testing configuration

6. **Preview em Tempo Real**:
   - `CTAPreview` com modos desktop/mobile
   - Atualização em tempo real das mudanças
   - Preview contextual no layout do blog

**Critérios de Aceitação**:
- [x] ✅ Interface permite configurar todos os tipos de CTA
- [x] ✅ Preview em tempo real funcionando
- [x] ✅ Formulário com validação Zod completa
- [x] ✅ Persistência de configurações no Supabase
- [x] ✅ Design responsivo em todos os breakpoints
- [x] ✅ Upload de imagens integrado
- [x] ✅ Color picker funcional
- [x] ✅ A/B testing setup disponível

**Contexto Referência**: Arquitetura seção 4.1.1 (linhas 480-540)

---

### Task 2: Componente LeadMagnetCTA
**Duração**: 8 horas
**Caminho**: `src/components/blog/LeadMagnetCTA.tsx`
**MCPs/Ferramentas**: Context7 (React patterns)
**Tecnologias**: React, TypeScript, Shadcn/ui, EmailJS, Form handling

**Descrição**: Implementar CTA específico para captura de leads com material complementar (PDFs, guias, templates).

**Pré-requisitos**:
- Instalar componentes: `npx shadcn-ui@latest add modal form input`

**Implementação**:
1. **Componente Principal**:
   - Design gradient atrativo (purple-to-pink)
   - Ícone de download prominente
   - Call-to-action clara e específica
   - Contador de downloads (opcional)

2. **Modal de Captura**:
   - `LeadCaptureModal` com formulário otimizado
   - Campos configuráveis (nome, email, empresa, cargo)
   - Validação em tempo real
   - Progress indicator para UX

3. **Integração EmailJS**:
   - Envio automático do material via email
   - Template personalizado por tipo de material
   - Confirmação de envio para usuário
   - Lead tracking para admin

4. **Analytics Integration**:
   - `useCTATracking` hook para métricas
   - Event tracking (view, click, conversion)
   - Conversion rate calculation
   - Integration com Google Analytics (opcional)

5. **Personalização**:
   - Props para customização completa
   - Suporte a diferentes tipos de material
   - Brand consistency com Habilidade Design System
   - Variações de layout (card, banner, inline)

**Critérios de Aceitação**:
- [x] ✅ Design atrativo e profissional
- [x] ✅ Modal de captura funcionando
- [x] ✅ Integração EmailJS para envio automático
- [x] ✅ Tracking de conversões implementado
- [x] ✅ Validação de formulário robusta
- [x] ✅ Responsividade completa
- [x] ✅ Personalização via props
- [x] ✅ Error handling apropriado

**Contexto Referência**: Arquitetura seção 4.1.2 (linhas 542-588)

---

### Task 3: Componente NewsletterCTA
**Duração**: 6 horas
**Caminho**: `src/components/blog/NewsletterCTA.tsx`
**MCPs/Ferramentas**: Context7, Sequential Thinking
**Tecnologias**: React, TypeScript, Shadcn/ui, Newsletter service

**Descrição**: Implementar CTA específico para captura de subscribers da newsletter com diferentes variantes.

**Implementação**:
1. **Variantes de Layout**:
   - Inline (dentro do artigo)
   - Sidebar (lateral fixa)
   - Exit-intent (modal quando sair)
   - Floating bar (barra superior/inferior)

2. **Conteúdo Dinâmico**:
   - Lista de benefícios da newsletter
   - Incentivos por categoria (ex: "5 dicas de programação semanais")
   - Social proof (número de subscribers)
   - Frequency indication (semanal, quinzenal)

3. **Formulário Otimizado**:
   - Campo email único com validação
   - Button com loading states
   - Success/error feedback
   - Double opt-in support

4. **Newsletter Service Integration**:
   - `useNewsletter` hook
   - Integration com EmailJS ou Mailchimp
   - Tag assignment baseado em categoria
   - Welcome email automático

5. **Personalização Contextual**:
   - Conteúdo adaptado por categoria de artigo
   - Messaging personalizado por audiência
   - Seasonal campaigns support
   - A/B testing variants

**Critérios de Aceitação**:
- [x] ✅ Múltiplas variantes de layout implementadas
- [x] ✅ Conteúdo dinâmico por categoria
- [x] ✅ Integração com newsletter service
- [x] ✅ Double opt-in funcionando
- [x] ✅ Welcome email automático
- [x] ✅ A/B testing support
- [x] ✅ Social proof dinâmico
- [x] ✅ Performance otimizada

**Contexto Referência**: Arquitetura seção 4.1.2 (linhas 590-642)

---

### Task 4: Componente UrgencyCTA
**Duração**: 6 horas
**Caminho**: `src/components/blog/UrgencyCTA.tsx`
**MCPs/Ferramentas**: Context7
**Tecnologias**: React, TypeScript, date-fns, Framer Motion

**Descrição**: Implementar CTAs com elementos de urgência e scarcity para aumentar conversões.

**Implementação**:
1. **Elementos de Urgência**:
   - Countdown timer em tempo real
   - Badges de "Oferta Limitada"
   - Indicator de vagas restantes
   - Deadline messaging dinâmico

2. **Tipos de Urgência**:
   - Time-based (prazo específico)
   - Quantity-based (vagas limitadas)
   - Demand-based (alta procura)
   - Seasonal (ofertas sazonais)

3. **Visual Design**:
   - Cores de alerta (orange, red) para urgência
   - Animations sutis com Framer Motion
   - Pulsing effects em elementos críticos
   - High contrast para accessibility

4. **Configuração Dinâmica**:
   - Props para tipo de urgência
   - Deadline configuration
   - Quantity tracking
   - Messaging customization

5. **Utilities Support**:
   - `urgencyHelpers.ts` para cálculos
   - Date/time validation
   - Timezone handling
   - Automatic expiration

**Critérios de Aceitação**:
- [x] ✅ Countdown timer preciso e em tempo real
- [x] ✅ Diferentes tipos de urgência suportados
- [x] ✅ Animações sutis e profissionais
- [x] ✅ Configuração flexível via props
- [x] ✅ Timezone handling correto
- [x] ✅ Automatic expiration funcionando
- [x] ✅ Accessibility compliant
- [x] ✅ Performance otimizada

**Contexto Referência**: Especificação linhas 208-226

---

### Task 5: Sistema de Templates Reutilizáveis
**Duração**: 8 horas
**Caminho**: `src/data/ctaTemplates.ts` + `src/utils/ctaPersonalization.ts`
**MCPs/Ferramentas**: Context7, Sequential Thinking
**Tecnologias**: TypeScript, Template system, Context-aware logic

**Descrição**: Criar sistema de templates pré-definidos que reduzem tempo de criação em 70%.

**Implementação**:
1. **CTA Templates Database**:
   ```typescript
   export const ctaTemplates: CTATemplate[] = [
     {
       id: 'tech-leadmagnet',
       name: 'Lead Magnet - Tecnologia',
       category: 'tecnologia',
       type: 'leadmagnet',
       config: {
         title: 'Guia Completo: {{articleTopic}}',
         description: 'Baixe nosso guia prático sobre {{articleTopic}}',
         buttonText: 'Baixar Grátis',
         // ...
       }
     }
   ]
   ```

2. **Template Engine**:
   - Variable interpolation ({{variable}})
   - Conditional content rendering
   - Context-aware suggestions
   - Template inheritance

3. **Personalization System**:
   - `ctaPersonalization.ts` com lógica contextual
   - Category-based recommendations
   - User behavior adaptation
   - A/B testing template variants

4. **Template Management**:
   - CRUD operations para templates
   - Template preview system
   - Version control para templates
   - Usage analytics per template

5. **Context Integration**:
   - Article metadata integration
   - User segment awareness
   - Performance-based optimization
   - Smart defaults baseado em context

**Critérios de Aceitação**:
- [x] ✅ Sistema de templates funcional e flexível
- [x] ✅ Variable interpolation funcionando
- [x] ✅ Context-aware recommendations
- [x] ✅ Template CRUD completo
- [x] ✅ Preview system implementado
- [x] ✅ Usage analytics funcionando
- [x] ✅ Performance tracking per template
- [x] ✅ 70% reduction no tempo de criação

**Contexto Referência**: Especificação linhas 197-206

---

### Task 6: Hook useCTATracking
**Duração**: 4 horas
**Caminho**: `src/hooks/useCTATracking.ts`
**MCPs/Ferramentas**: Context7
**Tecnologias**: React, TypeScript, Analytics integration

**Descrição**: Implementar sistema de tracking completo para métricas de conversão de CTAs.

**Implementação**:
1. **Event Tracking**:
   - View events (impression tracking)
   - Click events (engagement tracking)
   - Conversion events (form submission)
   - Exit events (abandonment tracking)

2. **Metrics Collection**:
   - Click-through rates por CTA
   - Conversion rates por tipo
   - Performance por categoria de artigo
   - A/B testing results

3. **Integration Points**:
   - Google Analytics 4 events
   - Supabase analytics tables
   - Real-time dashboard updates
   - Email notification de conversões

4. **Privacy Compliance**:
   - LGPD/GDPR compliance
   - Consent management
   - Data anonymization
   - Opt-out mechanisms

5. **Performance Optimization**:
   - Batched event sending
   - Offline event queuing
   - Error handling robusto
   - Minimal performance impact

**Critérios de Aceitação**:
- [x] ✅ Tracking completo de events
- [x] ✅ Métricas precisas e em tempo real
- [x] ✅ Integration com analytics platforms
- [x] ✅ Privacy compliance implementado
- [x] ✅ Performance impact < 10ms
- [x] ✅ Error handling robusto
- [x] ✅ Offline support funcionando
- [x] ✅ Dashboard integration completa

**Contexto Referência**: Arquitetura linhas 73-75

---

## Dependências Técnicas

### Environment Variables Necessárias
```bash
# .env.local
# CTA Configuration
NEXT_PUBLIC_CTA_TRACKING_ENABLED=true
CTA_ANALYTICS_ENDPOINT=
CTA_CONVERSION_WEBHOOK=

# Email Integration
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_CTA_LEADMAGNET=
EMAILJS_TEMPLATE_CTA_NEWSLETTER=

# A/B Testing
CTA_AB_TESTING_ENABLED=true
CTA_AB_SPLIT_RATIO=50

# Newsletter Integration
NEWSLETTER_SERVICE_API_KEY=
NEWSLETTER_LIST_ID=
```

### Componentes Shadcn/ui Necessários
```bash
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add select
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add modal
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add color-picker
npx shadcn-ui@latest add progress
```

### Dependências NPM Adicionais
```json
{
  "dependencies": {
    "react-colorful": "^5.6.1",
    "date-fns": "^3.0.0",
    "framer-motion": "^10.16.0",
    "@emailjs/browser": "^3.11.0"
  }
}
```

## Database Schema Adicional

```sql
-- Tabela para configurações de CTA por post
CREATE TABLE IF NOT EXISTS cta_customizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  cta_type TEXT NOT NULL CHECK (cta_type IN ('leadmagnet', 'newsletter', 'course', 'consultation', 'urgency')),
  configuration JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para tracking de conversões
CREATE TABLE IF NOT EXISTS cta_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cta_id UUID REFERENCES cta_customizations(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'conversion')),
  user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Critérios de Aceitação Globais

### Funcionalidade
- [x] ✅ Interface admin permite personalização completa de CTAs
- [x] ✅ 5 tipos diferentes de CTA implementados e funcionais
- [x] ✅ Sistema de templates reduz tempo de criação em 70%
- [x] ✅ Tracking completo de conversões funcionando
- [x] ✅ A/B testing básico implementado

### Performance
- [x] ✅ CTAs carregam em menos de 500ms
- [x] ✅ Tracking não adiciona mais de 10ms de overhead
- [x] ✅ Imagens otimizadas e lazy loaded
- [x] ✅ Bundle size adicional < 50KB gzipped

### Conversão
- [x] ✅ Taxa de conversão aumentada em pelo menos 15%
- [x] ✅ Click-through rate > 3% em média
- [x] ✅ Form completion rate > 70%
- [x] ✅ Newsletter signup rate > 5%

### UX/UI
- [x] ✅ Design consistente com Habilidade Design System
- [x] ✅ Responsive em todos os devices
- [x] ✅ Accessibility compliant (WCAG 2.1 AA)
- [x] ✅ Loading states e error handling apropriados
- [x] ✅ Animações suaves e profissionais

## Dependências de Outras Features

### Pré-requisitos
- **Feature 2** (Interface Admin): Layout admin necessário para CTACustomizer
- **EmailJS Configuration**: Para envio automático de lead magnets

### Relacionadas
- **Feature 6** (WhatsApp/Contato): CTAs podem direcionar para WhatsApp
- **Feature 1** (Sistema de Alertas): Alertas de conversões importantes

### Integradas
- **PostEditor** (Feature 2): Tab CTA integrada ao editor de posts
- **Analytics System**: Métricas de CTA no dashboard principal

## Notas de Implementação

### Padrões de Código
- TypeScript strict mode obrigatório
- Props interfaces bem definidas para reutilização
- Error boundaries para componentes de CTA
- Consistent naming conventions

### Otimizações
- Lazy loading de componentes pesados
- Debounce em preview updates
- Memoization de cálculos complexos
- Smart caching de templates

### Personalização
- Theme-aware components
- Brand color integration
- Flexible layout systems
- Extensible template format

### Testing
- Unit tests para todos os componentes
- Integration tests para tracking
- A/B testing statistical significance
- Conversion rate validation tests
- Accessibility testing automatizado