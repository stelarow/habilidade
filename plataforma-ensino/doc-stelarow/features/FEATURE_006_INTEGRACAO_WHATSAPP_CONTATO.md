# FEATURE_006: Integra��o com WhatsApp e Canais de Contato

## Descri��o
Implementar sistema de contato integrado com WhatsApp, telefone e email para facilitar o contato direto de interessados que chegaram atrav�s do blog, com mensagens contextuais e tracking de origem.

## Contexto da SPEC.md
- **EPIC 3: CONVERS�O E GERA��O DE LEADS** - Se��o "Integra��o com WhatsApp e Canais de Contato"
- Cen�rios: Bot�o WhatsApp flutuante, links de contato no final dos artigos, mensagens pr�-formatadas
- Requisitos: Contato contextual, m�ltiplos canais, integra��o discreta

## Contexto da ARCHITECTURE.md
- Site principal j� possui sistema de contato estabelecido (EmailJS, WhatsApp)
- Telefone: (48) 98855-9491, Email: alessandro.ferreira@escolahabilidade.com
- Design system para componentes flutuantes e contato

## Tarefas

### 1. Implementar bot�o WhatsApp flutuante contextual
**Caminho do arquivo**: `src/components/shared/WhatsAppFloat.jsx`
**Tecnologias**: WhatsApp API, Context-aware messaging, Floating UI
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar bot�o flutuante discreto no canto inferior direito
- Implementar mensagens pr�-formatadas com contexto do artigo lido
- Configurar aparecer ap�s 30 segundos de leitura ou 50% scroll
- Adicionar anima��o de pulso sutil para chamar aten��o
- Implementar logica de hide/show baseada na intera��o do usu�rio
- Configurar diferentes mensagens baseadas na categoria do artigo

### 2. Desenvolver sistema de mensagens WhatsApp contextuais
**Caminhos dos arquivos**:
- `src/utils/whatsappMessaging.js`
- `src/data/whatsappTemplates.js`
**Tecnologias**: URL encoding, Template system, Dynamic content
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Criar templates de mensagem por tipo de artigo/categoria
- Implementar sistema de vari�veis (t�tulo do artigo, categoria, URL)
- Configurar mensagens espec�ficas: "Ol�! Vi o artigo sobre [t�tulo] e gostaria de saber mais sobre os cursos"
- Implementar fallback para mensagem gen�rica quando n�o h� contexto
- Adicionar UTM parameters para tracking de origem
- Configurar mensagens diferentes para mobile vs desktop

### 3. Implementar se��o de contato no final dos artigos
**Caminho do arquivo**: `src/components/blog/BlogContactSection.jsx`
**Tecnologias**: Multi-channel contact, Responsive design, Call tracking
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Criar se��o elegante com telefone, email e WhatsApp
- Implementar click-to-call para n�meros de telefone
- Configurar mailto com assunto pr�-definido baseado no artigo
- Adicionar hor�rio de atendimento e disponibilidade
- Implementar �cones e design consistente com site principal
- Configurar mensagem motivacional sobre consultoria gratuita

### 4. Desenvolver sistema de tracking de origem de contatos
**Caminhos dos arquivos**:
- `src/utils/contactTracking.js`
- `src/hooks/useContactAnalytics.js`
**Tecnologias**: UTM parameters, Analytics events, Lead attribution
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`, `Sequential Thinking`

- Implementar UTM parameters autom�ticos em todos os links de contato
- Configurar eventos no Google Analytics para tracking de clicks
- Criar sistema de identifica��o de fonte (artigo espec�fico � contato)
- Implementar dashboard de convers�o blog � contato para admins
- Configurar lead scoring baseado na fonte do contato
- Adicionar timestamps e session tracking

### 5. Implementar modal de contato r�pido
**Caminho do arquivo**: `src/components/blog/QuickContactModal.jsx`
**Tecnologias**: Modal UI, Form handling, Multi-step conversion
**Dura��o Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`

- Criar modal com op��es: WhatsApp, Telefone, Email, Agendamento
- Implementar form de "Interesse em consultoria" com campos b�sicos
- Configurar envio via EmailJS com contexto do artigo
- Adicionar op��o "Prefere ser contactado?" com hor�rio preferido
- Implementar valida��o de formul�rio e feedback visual
- Configurar auto-close e thank you message

### 6. Desenvolver sistema de hor�rio inteligente de contato
**Caminhos dos arquivos**:
- `src/utils/businessHours.js`
- `src/components/blog/ContactAvailability.jsx`
**Tecnologias**: Time zones, Business logic, Dynamic UI
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Implementar detector de hor�rio comercial (8h-18h, segunda-sexta)
- Configurar mensagens diferentes para dentro/fora do hor�rio
- Implementar indicador visual de "Online agora" vs "Responderemos em breve"
- Configurar timezone detection autom�tico
- Adicionar estimativa de tempo de resposta
- Implementar queue de mensagens para hor�rio n�o comercial

### 7. Implementar sistema de follow-up autom�tico por email
**Caminhos dos arquivos**:
- `src/utils/emailAutomation.js`
- `src/templates/followupEmails.js`
**Tecnologias**: EmailJS automation, Drip campaigns, Content personalization
**Dura��o Estimada**: 4 horas
**MCPs/Ferramentas**: `Context7`

- Configurar email de follow-up 24h ap�s primeiro contato
- Implementar templates personalizados baseados no artigo lido
- Configurar s�rie de emails educativos relacionados ao interesse
- Adicionar links para artigos relacionados e cursos
- Implementar unsubscribe e prefer�ncias de email
- Configurar tracking de abertura e cliques (se poss�vel)

### 8. Desenvolver widget de consulta gratuita
**Caminho do arquivo**: `src/components/blog/FreeConsultationWidget.jsx`
**Tecnologias**: Scheduling integration, Lead qualification, Conversion optimization
**Dura��o Estimada**: 5 horas
**MCPs/Ferramentas**: `Context7`

- Criar widget destacado para "Consulta Gratuita de 15 minutos"
- Implementar calend�rio simples para agendamento (ou link externo)
- Configurar formul�rio de pr�-qualifica��o (�rea de interesse, experi�ncia)
- Adicionar elementos de confian�a (depoimentos, certifica��es)
- Implementar sistema de confirma��o por email/WhatsApp
- Configurar diferentes ofertas baseadas na categoria do artigo

### 9. Otimizar para mobile e diferentes contextos de uso
**Caminhos dos arquivos**:
- `src/styles/contact-mobile.css`
- `src/hooks/useContactOptimization.js`
**Tecnologias**: Mobile-first design, Touch optimization, Context detection
**Dura��o Estimada**: 3 horas
**MCPs/Ferramentas**: `Context7`

- Otimizar bot�o WhatsApp para touch devices
- Implementar comportamento diferente para mobile (abrir app vs web)
- Configurar posicionamento inteligente que n�o interfere com navega��o
- Implementar detec��o de device para ajustar canais dispon�veis
- Otimizar formul�rios para preenchimento mobile
- Testar em diferentes navegadores e apps (Instagram browser, Facebook browser)

## Crit�rios de Aceita��o

- [ ] Bot�o WhatsApp flutuante aparece ap�s 30s ou 50% scroll
- [ ] Mensagens WhatsApp incluem contexto do artigo lido
- [ ] Se��o de contato aparece no final de todos os artigos
- [ ] Click-to-call funciona em dispositivos m�veis
- [ ] Emails s�o enviados com assunto contextual baseado no artigo
- [ ] Tracking de origem funciona para todos os canais de contato
- [ ] Modal de contato r�pido abre e funciona corretamente
- [ ] Indicador de hor�rio comercial mostra status correto
- [ ] Sistema detecta timezone do usu�rio automaticamente
- [ ] Formul�rios de contato validam e enviam dados corretamente
- [ ] Widget de consulta gratuita est� vis�vel e funcional
- [ ] Todos os elementos s�o responsivos e touch-friendly
- [ ] Performance n�o � impactada pelos widgets de contato
- [ ] Analytics tracking funciona para todos os tipos de contato

## Depend�ncias
- FEATURE_003 conclu�da (p�ginas do blog funcionais)
- EmailJS configurado no site principal
- Google Analytics configurado
- Dados de contato da escola validados (telefone, email, WhatsApp)