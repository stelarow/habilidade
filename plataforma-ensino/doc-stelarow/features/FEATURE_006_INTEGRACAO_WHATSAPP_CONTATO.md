# FEATURE_006: Integração com WhatsApp e Canais de Contato

## Descrição
Implementar sistema de contato integrado com WhatsApp, telefone e email para facilitar o contato direto de interessados que chegaram através do blog, com mensagens contextuais e tracking de origem.

## Contexto da SPEC.md
- **EPIC 3: CONVERSÃO E GERAÇÃO DE LEADS** - Seção "Integração com WhatsApp e Canais de Contato"
- Cenários: Botão WhatsApp flutuante, links de contato no final dos artigos, mensagens pré-formatadas
- Requisitos: Contato contextual, múltiplos canais, integração discreta

## Contexto da ARCHITECTURE.md
- Site principal já possui sistema de contato estabelecido (EmailJS, WhatsApp)
- Telefone: (48) 98855-9491, Email: alessandro.ferreira@escolahabilidade.com
- Design system para componentes flutuantes e contato

## Tarefas

### 1. Implementar botão WhatsApp flutuante contextual
**Caminho do arquivo**: `src/components/shared/WhatsAppFloat.jsx`
**Tecnologias**: WhatsApp API, Context-aware messaging, Floating UI
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar botão flutuante discreto no canto inferior direito
- Implementar mensagens pré-formatadas com contexto do artigo lido
- Configurar aparecer após 30 segundos de leitura ou 50% scroll
- Adicionar animação de pulso sutil para chamar atenção
- Implementar logica de hide/show baseada na interação do usuário
- Configurar diferentes mensagens baseadas na categoria do artigo

### 2. Desenvolver sistema de mensagens WhatsApp contextuais
**Caminhos dos arquivos**:
- `src/utils/whatsappMessaging.js`
- `src/data/whatsappTemplates.js`
**Tecnologias**: URL encoding, Template system, Dynamic content
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Criar templates de mensagem por tipo de artigo/categoria
- Implementar sistema de variáveis (título do artigo, categoria, URL)
- Configurar mensagens específicas: "Olá! Vi o artigo sobre [título] e gostaria de saber mais sobre os cursos"
- Implementar fallback para mensagem genérica quando não há contexto
- Adicionar UTM parameters para tracking de origem
- Configurar mensagens diferentes para mobile vs desktop

### 3. Implementar seção de contato no final dos artigos
**Caminho do arquivo**: `src/components/blog/BlogContactSection.jsx`
**Tecnologias**: Multi-channel contact, Responsive design, Call tracking
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar seção elegante com telefone, email e WhatsApp
- Implementar click-to-call para números de telefone
- Configurar mailto com assunto pré-definido baseado no artigo
- Adicionar horário de atendimento e disponibilidade
- Implementar ícones e design consistente com site principal
- Configurar mensagem motivacional sobre consultoria gratuita

### 4. Desenvolver sistema de tracking de origem de contatos
**Caminhos dos arquivos**:
- `src/utils/contactTracking.js`
- `src/hooks/useContactAnalytics.js`
**Tecnologias**: UTM parameters, Analytics events, Lead attribution
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Sequential Thinking`

- Implementar UTM parameters automáticos em todos os links de contato
- Configurar eventos no Google Analytics para tracking de clicks
- Criar sistema de identificação de fonte (artigo específico ’ contato)
- Implementar dashboard de conversão blog ’ contato para admins
- Configurar lead scoring baseado na fonte do contato
- Adicionar timestamps e session tracking

### 5. Implementar modal de contato rápido
**Caminho do arquivo**: `src/components/blog/QuickContactModal.jsx`
**Tecnologias**: Modal UI, Form handling, Multi-step conversion
**Duração Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`

- Criar modal com opções: WhatsApp, Telefone, Email, Agendamento
- Implementar form de "Interesse em consultoria" com campos básicos
- Configurar envio via EmailJS com contexto do artigo
- Adicionar opção "Prefere ser contactado?" com horário preferido
- Implementar validação de formulário e feedback visual
- Configurar auto-close e thank you message

### 6. Desenvolver sistema de horário inteligente de contato
**Caminhos dos arquivos**:
- `src/utils/businessHours.js`
- `src/components/blog/ContactAvailability.jsx`
**Tecnologias**: Time zones, Business logic, Dynamic UI
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Implementar detector de horário comercial (8h-18h, segunda-sexta)
- Configurar mensagens diferentes para dentro/fora do horário
- Implementar indicador visual de "Online agora" vs "Responderemos em breve"
- Configurar timezone detection automático
- Adicionar estimativa de tempo de resposta
- Implementar queue de mensagens para horário não comercial

### 7. Implementar sistema de follow-up automático por email
**Caminhos dos arquivos**:
- `src/utils/emailAutomation.js`
- `src/templates/followupEmails.js`
**Tecnologias**: EmailJS automation, Drip campaigns, Content personalization
**Duração Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Configurar email de follow-up 24h após primeiro contato
- Implementar templates personalizados baseados no artigo lido
- Configurar série de emails educativos relacionados ao interesse
- Adicionar links para artigos relacionados e cursos
- Implementar unsubscribe e preferências de email
- Configurar tracking de abertura e cliques (se possível)

### 8. Desenvolver widget de consulta gratuita
**Caminho do arquivo**: `src/components/blog/FreeConsultationWidget.jsx`
**Tecnologias**: Scheduling integration, Lead qualification, Conversion optimization
**Duração Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`

- Criar widget destacado para "Consulta Gratuita de 15 minutos"
- Implementar calendário simples para agendamento (ou link externo)
- Configurar formulário de pré-qualificação (área de interesse, experiência)
- Adicionar elementos de confiança (depoimentos, certificações)
- Implementar sistema de confirmação por email/WhatsApp
- Configurar diferentes ofertas baseadas na categoria do artigo

### 9. Otimizar para mobile e diferentes contextos de uso
**Caminhos dos arquivos**:
- `src/styles/contact-mobile.css`
- `src/hooks/useContactOptimization.js`
**Tecnologias**: Mobile-first design, Touch optimization, Context detection
**Duração Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Otimizar botão WhatsApp para touch devices
- Implementar comportamento diferente para mobile (abrir app vs web)
- Configurar posicionamento inteligente que não interfere com navegação
- Implementar detecção de device para ajustar canais disponíveis
- Otimizar formulários para preenchimento mobile
- Testar em diferentes navegadores e apps (Instagram browser, Facebook browser)

## Critérios de Aceitação

- [ ] Botão WhatsApp flutuante aparece após 30s ou 50% scroll
- [ ] Mensagens WhatsApp incluem contexto do artigo lido
- [ ] Seção de contato aparece no final de todos os artigos
- [ ] Click-to-call funciona em dispositivos móveis
- [ ] Emails são enviados com assunto contextual baseado no artigo
- [ ] Tracking de origem funciona para todos os canais de contato
- [ ] Modal de contato rápido abre e funciona corretamente
- [ ] Indicador de horário comercial mostra status correto
- [ ] Sistema detecta timezone do usuário automaticamente
- [ ] Formulários de contato validam e enviam dados corretamente
- [ ] Widget de consulta gratuita está visível e funcional
- [ ] Todos os elementos são responsivos e touch-friendly
- [ ] Performance não é impactada pelos widgets de contato
- [ ] Analytics tracking funciona para todos os tipos de contato

## Dependências
- FEATURE_003 concluída (páginas do blog funcionais)
- EmailJS configurado no site principal
- Google Analytics configurado
- Dados de contato da escola validados (telefone, email, WhatsApp)