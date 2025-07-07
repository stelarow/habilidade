# Plano de Desenvolvimento da Área do Aluno - Plataforma de Ensino

## 📋 Visão Geral

Este plano detalha o desenvolvimento de uma plataforma de ensino completa onde os alunos podem assistir aulas, acompanhar progresso e interagir com o conteúdo educacional. A plataforma utilizará as melhores tecnologias disponíveis para garantir escalabilidade, performance e experiência do usuário.

## 🎯 Objetivos

- Criar uma área do aluno funcional e moderna
- Implementar sistema de reprodução de vídeos otimizado
- Desenvolver sistema de acompanhamento de progresso
- Integrar autenticação e autorização robusta
- Garantir escalabilidade e performance

## 🏗️ Arquitetura Tecnológica

### Frontend
- **Framework**: Next.js 14.2.x (Stable App Router)
- **UI Library**: React 18.x (Stable)
- **Styling**: Tailwind CSS (mantendo sistema atual da Habilidade)
- **Video Player**: React Player + Mux/HLS
- **State Management**: Zustand (simplicidade para MVP)
- **Animations**: Framer Motion (compatível com sistema atual)
- **Forms**: React Hook Form + Zod
- **Icons**: Phosphor React (mantendo consistência)
- **Error Tracking**: Sentry
- **Testing**: Jest + React Testing Library + Playwright

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Supabase REST API + GraphQL
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Video Processing**: Mux ou Vimeo API

### Hospedagem e Deploy
- **Frontend**: Vercel
- **Backend**: Supabase Cloud
- **CDN**: Cloudflare
- **Monitoring**: Vercel Analytics

## 🎨 Sistema de Design (Mantendo Identidade Habilidade)

### Paleta de Cores
- **Primária**: `#d400ff` (Magenta vibrante)
- **Secundária**: `#00c4ff` (Ciano)
- **Accent**: `#a000ff` (Roxo)
- **Background**: `#0a0a0a` (Preto profundo), `#181a2a` (Azul escuro)
- **Texto**: `#ffffff` (Branco), `#d4d4d8` (Cinza claro)

### Tipografia
- **Fonte**: Montserrat (mantendo fonte atual)
- **Hierarquia**: Seguindo sistema atual (text-6xl para hero, etc.)

### Componentes Reutilizáveis
- **GradientButton**: Mantendo estilo neon atual
- **Cards**: Glass effect com cantos cortados (clip-path)
- **Starfield**: Background animado para seções especiais
- **Tech Cards**: Animações de hover com brilho

### Efeitos Visuais
- **Gradientes Animados**: Fluxo de cores em 4s
- **Animações de Entrada**: Fade In Up, Scale In, Slide In
- **Hover Effects**: Pulse, Glow, Float
- **Backgrounds Temáticos**: Por área de conhecimento

### Responsividade
- **Breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- **Performance**: Redução automática de partículas em mobile
- **Acessibilidade**: Controles para movimento reduzido

## 📦 Template Recomendado

**LearnHouse** - Plataforma open-source moderna
- **Repositório**: https://github.com/learnhouse/learnhouse
- **Tecnologias**: Next.js 14, TailwindCSS, Radix UI, Tiptap
- **Vantagens**: 
  - Código limpo e moderno
  - Componentes reutilizáveis
  - Suporte a vídeos e documentos
  - Interface responsiva
  - Bem documentado

**Alternativa**: Next.js LMS Starter Kit
- **Tecnologias**: Next.js 15, PostgreSQL, Prisma, AWS S3, MUX
- **Vantagens**: 
  - Pronto para produção
  - Sistema de pagamentos integrado
  - Processamento de vídeo profissional

## 🔧 Etapas de Desenvolvimento

## 🎯 **ESTRATÉGIA: MVP + FASES**

### **MVP (6 semanas + 1 buffer) - Funcionalidades Essenciais**
- Autenticação de usuários
- Player de vídeo básico
- Sistema de progresso
- Dashboard do aluno
- Deploy funcional

### **Fase 2 (8 semanas) - Funcionalidades Avançadas**
- Painel administrativo completo
- Gamificação e certificados
- Recursos offline
- Otimizações avançadas

---

---

## 📈 **STATUS ATUAL - IMPLEMENTAÇÃO**

### ✅ **CONCLUÍDO - Sessão 1 (2025-07-04)**

#### 1. Estrutura Base do Projeto
- [x] Criado projeto Next.js 14.2.x com TypeScript e App Router
- [x] Configurado Tailwind CSS com sistema de cores Habilidade
- [x] Setup da estrutura de pastas seguindo melhores práticas
- [x] Configurado package.json com todas as dependências necessárias
- [x] Criado arquivo .env.local e .env.example para variáveis de ambiente

#### 2. Sistema de Design Implementado
- [x] Paleta de cores Habilidade integrada no Tailwind (primary, secondary, accent)
- [x] Fonte Montserrat configurada via Google Fonts
- [x] Classes CSS customizadas para componentes (.gradient-text, .btn-neon, .glass-effect)
- [x] Animações base configuradas (gradient, float, pulse-glow)
- [x] Responsividade e acessibilidade implementadas
- [x] Sistema de scrollbar customizado
- [x] Estados de loading e formulários estilizados

#### 3. Configuração Supabase
- [x] Criados clientes Supabase para browser e server
- [x] Configurado middleware de autenticação
- [x] Schema completo do banco de dados desenvolvido (database/schema.sql)
- [x] Row Level Security (RLS) policies implementadas
- [x] Triggers e funções auxiliares criadas
- [x] Views para estatísticas e progresso implementadas

#### 4. TypeScript e Tipos
- [x] Sistema completo de tipos TypeScript (src/types/index.ts)
- [x] Interfaces para User, Course, Lesson, Enrollment, Progress, etc.
- [x] Tipos para formulários, API responses, componentes de vídeo
- [x] Tipos para dashboard, analytics e notificações

### ✅ **CONCLUÍDO - Sessão 2 (2025-07-07)**

#### 1. Migração de Componentes Habilidade ✅ [PRIORIDADE ALTA]
- [x] Copiar e converter GradientButton.jsx → .tsx (com Next.js Link support)
- [x] Copiar e converter Starfield.jsx → .tsx (performance otimizada)
- [x] Copiar e converter Loading.jsx → .tsx (múltiplas variantes)
- [x] Copiar e converter ErrorBoundary.jsx → .tsx (integração Sentry)
- [x] Migrar todos os backgrounds da pasta backgrounds/ (9 componentes)
- [x] Ajustar imports e tipos TypeScript (interfaces completas)
- [x] Testar componentes no novo ambiente (build success)

#### 2. Background Components Migration ✅
- [x] IABackground.tsx (já existia)
- [x] DesignGraficoBackground.tsx (já existia)
- [x] ProgramacaoBackground.tsx (já existia)
- [x] **Novos**: AdministracaoBackground.tsx
- [x] **Novos**: BIBackground.tsx
- [x] **Novos**: EdicaoVideoBackground.tsx
- [x] **Novos**: InformaticaBackground.tsx
- [x] **Novos**: MarketingDigitalBackground.tsx
- [x] **Novos**: Projetista3DBackground.tsx
- [x] Atualizado backgrounds/index.ts com todas as exportações

#### 3. Instalação de Dependências ✅
- [x] Resolver problemas de instalação do npm (792 packages instalados)
- [x] Instalar dependências principais: Supabase, React Player, Zustand, etc.
- [x] Configurar Sentry para error tracking (@sentry/nextjs@^7.99.0)
- [x] Setup de testes com Jest e Playwright (configurado, pendente implementação)

#### 4. Autenticação Base ✅
- [x] Criar páginas de login e registro (/auth/login, /auth/register)
- [x] Implementar componentes de autenticação (formulários completos)
- [x] Criar página de recuperação de senha (/auth/forgot-password)
- [x] Configurar proteção de rotas (auth layout)
- [x] Dashboard placeholder (/dashboard) com navegação básica

#### 5. Sentry Integration ✅ [AVANÇADO]
- [x] Configuração completa Sentry (client, server, edge configs)
- [x] Next.js config com webpack plugin e otimizações
- [x] Custom error classes para plataforma de ensino
- [x] Utilities avançadas (/lib/sentry.ts) com contexto específico
- [x] React hooks para integração (/hooks/useSentry.ts)
- [x] ErrorBoundary com reporte automático
- [x] Performance monitoring e video tracking
- [x] Conectado à organização Sentry "habilidade"

#### 6. Build & Quality Assurance ✅
- [x] Build Next.js production (✓ Compiled successfully)
- [x] Bundle size otimizado (92.4 kB first load JS)
- [x] TypeScript coverage 100% nos novos componentes
- [x] Apenas warnings ESLint (React hooks dependencies)

### 🔄 **PRÓXIMAS ETAPAS - Sessão 3**

#### 1. Video Player Implementation [PRIORIDADE ALTA]
- [ ] Configurar React Player com controles customizados
- [ ] Integração com Mux para streaming otimizado
- [ ] Implementar tracking de progresso automático
- [ ] Controles de qualidade adaptativa
- [ ] Integração com Sentry para monitoramento de vídeo
- [ ] Testes de compatibilidade mobile

#### 2. Dashboard Enhancement [PRIORIDADE ALTA]
- [ ] Interface de cursos matriculados
- [ ] Sistema de progresso visual
- [ ] Navegação entre aulas
- [ ] Integração com Supabase para dados reais
- [ ] Loading states e error handling
- [ ] Responsive design otimizado

#### 3. Navigation System [PRIORIDADE MÉDIA]
- [ ] Sistema de rotas protegidas
- [ ] Menu de navegação principal
- [ ] Breadcrumbs para navegação de curso
- [ ] Header component migrado do site principal
- [ ] Mobile navigation com hamburger menu

#### 4. Testing Setup [PRIORIDADE BAIXA]
- [ ] Configurar Jest + React Testing Library
- [ ] Setup Playwright para testes E2E
- [ ] Testes unitários para componentes principais
- [ ] Testes de integração para autenticação
- [ ] Coverage report setup

---

## 📅 **MVP - DESENVOLVIMENTO CORE**

### Semana 1: Setup Base + DevOps ✅ CONCLUÍDO
**Equipe**: 1 Desenvolvedor Full-Stack + 1 DevOps

#### 1.1 Setup do Projeto ✅
- [x] Criar projeto Next.js 14.2.x + React 18 + TypeScript
- [x] Configurar Tailwind CSS com sistema Habilidade
- [x] Configurar ESLint, Prettier, TypeScript
- [x] Package.json com todas as dependências

#### 1.2 DevOps e Qualidade (PARCIAL)
- [ ] Configurar Sentry error tracking
- [ ] Setup CI/CD com GitHub Actions
- [ ] Configurar Jest + React Testing Library
- [ ] Setup Playwright para E2E
- [ ] Gates obrigatórios: lint + tests + build
- [ ] Configurar Vercel deploy automático

#### 1.3 Configuração Supabase ✅
- [x] Schema completo do banco de dados
- [x] Configurar autenticação (middleware + clientes)
- [x] Setup RLS policies completas
- [x] Tipos TypeScript para todas as tabelas
- [x] Triggers e funções auxiliares

#### 1.4 Estrutura Base ✅
- [x] Estrutura de pastas Next.js App Router
- [x] Sistema de tipos TypeScript completo
- [x] Configurar middleware de autenticação
- [x] Classes CSS customizadas (.btn-neon, .glass-effect, etc.)

### Semana 2: Autenticação + Database Schema
**Equipe**: 1 Desenvolvedor Frontend + 1 Desenvolvedor Backend

#### 2.1 Páginas de Autenticação (Frontend)
- [ ] Página de login com testes
- [ ] Página de registro com validação
- [ ] Página de recuperação de senha
- [ ] Página de verificação de email
- [ ] Integração com Supabase Auth

#### 2.2 Proteção de Rotas (Frontend)
- [ ] Middleware de autenticação
- [ ] Proteção de rotas privadas
- [ ] Redirecionamento automático
- [ ] Gerenciamento de sessão
- [ ] Testes E2E de autenticação

#### 2.3 Database Schema MVP (Backend)
- [ ] Schema otimizado para MVP
- [ ] RLS policies completas
- [ ] Índices em tabelas críticas
- [ ] Triggers para auditoria
- [ ] Testes de database

#### 3.1 Schema do Banco
```sql
-- Tabelas principais
- users (perfil do usuário)
  - id, email, name, avatar, role (student/admin/instructor)
  - created_at, updated_at, last_login
  - preferences (tema, notificações)

- courses (cursos)
  - id, title, description, thumbnail
  - category_id, instructor_id, price
  - duration, level, requirements
  - background_theme (IA, Design, etc.)

- lessons (aulas)
  - id, course_id, title, description
  - video_url, duration, order
  - materials (PDF, links)
  - transcript

- enrollments (matrículas)
  - id, user_id, course_id
  - enrolled_at, completed_at
  - access_until, status

- progress (progresso)
  - id, user_id, lesson_id
  - completed, last_position
  - watch_time, completed_at

- categories (categorias)
  - id, name, color_theme, icon
  - background_type (seguindo padrão Habilidade)

- instructors (instrutores)
  - id, user_id, bio, expertise
  - social_links, rating

- admin_settings (configurações)
  - platform_theme, colors, logos
  - notification_settings
  - course_categories_config
```

#### 3.2 Configuração RLS
- [ ] Políticas de segurança
- [ ] Permissões por usuário
- [ ] Autorização por curso
- [ ] Controle de acesso a vídeos

### Semana 3: Player de Vídeo + Dashboard Básico
**Equipe**: 2 Desenvolvedores Frontend

#### 3.1 Player MVP
- [ ] Configurar React Player com testes
- [ ] Integração básica com Mux/HLS
- [ ] Controles essenciais
- [ ] Qualidade adaptativa
- [ ] Tracking de progresso básico

#### 3.2 Dashboard do Aluno MVP
- [ ] Layout básico com design Habilidade
- [ ] Lista de cursos matriculados
- [ ] Progresso visual simples
- [ ] Navegação entre aulas
- [ ] Componentes com testes unitários

### Semana 4: Sistema de Progresso + Deploy MVP
**Equipe**: 1 Frontend + 1 Backend + 1 DevOps

#### 4.1 Sistema de Progresso
- [ ] Tracking automático com testes
- [ ] Salvamento de posição
- [ ] Marcação de conclusão
- [ ] Sincronização em tempo real
- [ ] Persistência no Supabase

#### 4.2 Interface de Reprodução
- [ ] Layout do player responsivo
- [ ] Sidebar com conteúdo
- [ ] Navegação entre aulas
- [ ] Design system Habilidade aplicado
- [ ] Testes E2E do fluxo completo

#### 4.3 Deploy MVP
- [ ] Pipeline CI/CD funcionando
- [ ] Deploy automático na Vercel
- [ ] Configuração de domínio
- [ ] SSL e segurança básica
- [ ] Monitoramento Sentry ativo

### Semana 5: Polimento + Otimizações MVP
**Equipe**: 2 Desenvolvedores Full-Stack

#### 5.1 Polimento UX
- [ ] Animações do design Habilidade
- [ ] Responsividade mobile
- [ ] Performance otimizada
- [ ] Loading states
- [ ] Error boundaries

#### 5.2 Funcionalidades Complementares MVP
- [ ] Busca básica de cursos
- [ ] Filtros simples
- [ ] Perfil do usuário
- [ ] Configurações básicas
- [ ] Notificações simples

### Semana 6: Testes Intensivos + Preparação Produção
**Equipe**: 1 QA + 1 Desenvolvedor

#### 6.1 Testes Completos MVP
- [ ] Bateria completa de testes automatizados
- [ ] Testes de performance
- [ ] Testes de segurança
- [ ] Testes de usabilidade
- [ ] Correção de bugs críticos

#### 6.2 Preparação Produção
- [ ] Backup e recovery testados
- [ ] Rate limiting configurado
- [ ] Logs e monitoring
- [ ] Documentação básica
- [ ] Plano de rollback

### Semana 7: Buffer + Ajustes Finais MVP
**Equipe**: Toda equipe conforme necessário

#### 7.1 Buffer para Imprevistos (15%)
- [ ] Ajustes de última hora
- [ ] Correções de bugs
- [ ] Otimizações de performance
- [ ] Testes finais
- [ ] Preparação para Fase 2

---

## 📅 **FASE 2 - FUNCIONALIDADES AVANÇADAS (8 semanas)**

### Semana 8-9: Painel Administrativo Base
**Equipe**: 2 Desenvolvedores Full-Stack

#### 7.5.1 Dashboard Administrativo
- [ ] Visão geral de métricas
- [ ] Estatísticas de usuários ativos
- [ ] Relatórios de progresso
- [ ] Analytics de cursos
- [ ] Monitoramento em tempo real

#### 7.5.2 Gerenciamento de Usuários
- [ ] Lista de alunos com filtros
- [ ] Adicionar novo aluno
- [ ] Editar perfil de aluno
- [ ] Deletar/desativar aluno
- [ ] Gerenciar permissões
- [ ] Histórico de atividades

#### 7.5.3 Gerenciamento de Cursos
- [ ] Criar novo curso
- [ ] Editar cursos existentes
- [ ] Upload de vídeos e materiais
- [ ] Organizar lições e módulos
- [ ] Definir pré-requisitos
- [ ] Configurar certificados

#### 7.5.4 Gestão de Matrículas
- [ ] Matricular aluno em curso
- [ ] Cancelar matrícula
- [ ] Transferir entre cursos
- [ ] Definir datas de acesso
- [ ] Controle de vagas
- [ ] Relatórios de matrículas

#### 7.5.5 Sistema de Notificações
- [ ] Enviar notificações para alunos
- [ ] Templates de email
- [ ] Notificações push
- [ ] Alertas automáticos
- [ ] Configuração de preferências

#### 7.5.6 Relatórios e Analytics
- [ ] Relatório de progresso por aluno
- [ ] Estatísticas de engajamento
- [ ] Tempo médio de conclusão
- [ ] Avaliação de cursos
- [ ] Exportar dados (CSV/PDF)

#### 7.5.7 Configurações do Sistema
- [ ] Configurar aparência da plataforma
- [ ] Gerenciar categorias de cursos
- [ ] Configurar integrações
- [ ] Backup e restore
- [ ] Logs de sistema

### Fase 8: Mobile e Responsividade (Semana 7)
**Equipe**: 1 Desenvolvedor Frontend

#### 8.1 Otimização Mobile (Seguindo Design Habilidade)
- [ ] Design responsivo com breakpoints atuais
- [ ] Touch gestures para player de vídeo
- [ ] Navegação mobile com menu hamburger
- [ ] Performance otimizada (redução de partículas)
- [ ] PWA capabilities
- [ ] Starfield adaptativo para mobile
- [ ] Componentes touch-friendly

### Fase 9: Integração Visual Habilidade (Semana 8)
**Equipe**: 1 Designer + 1 Desenvolvedor Frontend

#### 9.1 Implementação do Design System
- [ ] Migrar componentes atuais (GradientButton, Starfield)
- [ ] Implementar backgrounds temáticos por curso
- [ ] Configurar gradientes animados
- [ ] Aplicar tipografia Montserrat
- [ ] Implementar animações de entrada/hover
- [ ] Configurar paleta de cores oficial

#### 9.2 Customização por Área
- [ ] Backgrounds específicos (IA, Design, Marketing, etc.)
- [ ] Cores temáticas por categoria
- [ ] Ícones Phosphor React
- [ ] Efeitos neon personalizados
- [ ] Glass effects em cards

### Fase 10: Testes e Qualidade (Semana 9)
**Equipe**: 1 QA + 1 Desenvolvedor

#### 10.1 Testes Automatizados
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes E2E (incluindo admin)
- [ ] Testes de performance
- [ ] Testes de segurança
- [ ] Testes de responsividade

#### 10.2 Testes de Usabilidade
- [ ] Navegação intuitiva
- [ ] Acessibilidade (movimento reduzido)
- [ ] Performance em dispositivos móveis
- [ ] Compatibilidade de browsers

### Fase 11: Deploy e Monitoramento (Semana 10)
**Equipe**: 1 DevOps

#### 11.1 Deploy
- [ ] Configurar CI/CD
- [ ] Deploy para produção
- [ ] Configurar domínio
- [ ] SSL e segurança
- [ ] Backup e recovery

#### 11.2 Monitoramento
- [ ] Analytics (mantendo design)
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] User behavior tracking
- [ ] Logs e debugging
- [ ] Métricas de admin

## 📊 Recursos Necessários

### Equipe
- **1 Tech Lead** (todas as fases)
- **2-3 Desenvolvedores Frontend**
- **1 Desenvolvedor Backend**
- **1 Designer UI/UX**
- **1 QA Engineer**
- **1 DevOps Engineer**

### Ferramentas e Serviços

#### Custos MVP (Primeiros 3 meses)
- **Supabase Pro**: $25/mês × 3 = $75
- **Vercel Pro**: $20/mês × 3 = $60  
- **Mux**: $150/mês × 3 = $450 (500h 720p)
- **Sentry**: $26/mês × 3 = $78
- **Cloudflare Pro**: $20/mês × 3 = $60
- **Figma Pro**: $15/mês × 3 = $45
- **Total MVP**: **$768** (3 meses)

#### Estimativas de Tráfego MVP
- **Users**: 100 alunos ativos
- **Vídeo**: 500h/mês consumo total
- **Storage**: 50GB cursos + 10GB user data
- **Bandwidth**: 2TB/mês
- **Limites Técnicos**: 720p máximo, 1.5x speed max

#### Custos Fase 2 (Meses 4-6)
- **Usuários**: 500 alunos (+400%)
- **Vídeo**: 2000h/mês (+300%)
- **Mux**: $600/mês
- **Supabase**: $100/mês (upgrade)
- **Total Fase 2**: **$850/mês**

#### Limites e Otimizações
- **Resolução máxima**: 720p (controle de custos)
- **Velocidade máxima**: 2x (anti-pirataria)
- **Rate limiting**: 10 req/s por usuário
- **Storage limits**: 100MB por usuário

## 🚀 Cronograma Revisado

### **MVP (7 semanas com buffer)**
| Semana | Foco | Equipe | Status |
|--------|------|--------|---------|
| 1 | **Setup + DevOps + Tests** | 2 devs | 🔄 MVP |
| 2 | **Auth + Database + RLS** | 2 devs | 🔄 MVP |
| 3 | **Player + Dashboard Básico** | 2 devs | 🔄 MVP |
| 4 | **Progresso + Deploy MVP** | 3 devs | 🔄 MVP |
| 5 | **Polimento UX + Mobile** | 2 devs | 🔄 MVP |
| 6 | **Testes Intensivos + Produção** | 2 devs | 🔄 MVP |
| 7 | **Buffer + Ajustes (15%)** | Variável | ⏱️ Buffer |

### **Fase 2 (8 semanas)**
| Semana | Foco | Equipe | Status |
|--------|------|--------|---------|
| 8-9 | **Painel Admin Base** | 2 devs | 🚀 Fase 2 |
| 10-11 | **Admin Avançado + Relatórios** | 2 devs | 🚀 Fase 2 |
| 12-13 | **Gamificação + Certificados** | 2 devs | 🚀 Fase 2 |
| 14-15 | **Recursos Avançados + Offline** | 2 devs | 🚀 Fase 2 |

### Cronograma Detalhado de Paralelização

#### Semanas 1-2: Base
- **Dev 1**: Setup Next.js + Supabase
- **Dev 2**: Sistema de autenticação + Database schema

#### Semanas 3-4: Core Features  
- **Dev 1**: Player de vídeo + controles
- **Dev 2**: Dashboard do aluno + navegação
- **Dev 3**: Sistema de progresso + backend

#### Semanas 5-6: Features + Admin
- **Dev 1**: Interatividade (comentários, Q&A)
- **Dev 2**: Painel admin (usuários + cursos)
- **Dev 3**: Relatórios + analytics

#### Semanas 7-8: Visual + Mobile
- **Dev 1**: Mobile responsivo + PWA
- **Dev 2**: Implementação design Habilidade
- **Dev 3**: Finalização admin + notificações

#### Semanas 9-10: Finalização
- **QA**: Testes completos + usabilidade
- **DevOps**: Deploy + monitoramento
- **Dev**: Ajustes finais + documentação

## 🔒 Segurança

### Medidas de Segurança
- Row Level Security (RLS) no Supabase
- Autenticação JWT
- Autorização por função
- Proteção contra pirataria de vídeo
- Rate limiting
- Input validation
- HTTPS obrigatório

### Compliance
- LGPD compliance
- Backup automatizado
- Audit trails
- Monitoramento de acesso

## 📈 Métricas de Sucesso

### Performance
- Tempo de carregamento < 2s
- Uptime > 99.9%
- Streaming sem buffering
- Mobile performance score > 90

### Usuário
- Taxa de conclusão > 70%
- Tempo médio de sessão > 30min
- NPS > 8.0
- Bounce rate < 20%

## 🎯 Próximos Passos

1. **Aprovação do plano** - Revisão e aprovação das tecnologias + design system
2. **Setup da equipe** - Definição de papéis e responsabilidades  
3. **Migração de componentes** - Extrair componentes reutilizáveis do site atual
4. **Criação do repositório** - Fork do template LearnHouse + customizações
5. **Configuração inicial** - Setup do ambiente com design Habilidade
6. **Sprint planning** - Definição detalhada das tarefas por desenvolvedor

### Checklist Pré-Desenvolvimento

#### Design System
- [ ] Exportar componentes atuais (GradientButton, Starfield, Header)
- [ ] Documentar paleta de cores e tipografia
- [ ] Criar library de ícones Phosphor React
- [ ] Definir estrutura de backgrounds temáticos
- [ ] Configurar animações base (CSS + Framer Motion)

#### Setup Técnico  
- [ ] Configurar Supabase com schema definido
- [ ] Setup Next.js 15 com App Router
- [ ] Integrar Tailwind CSS com classes customizadas
- [ ] Configurar Mux para streaming de vídeo
- [ ] Setup autenticação e RLS policies

#### Ambiente de Desenvolvimento
- [ ] Definir estrutura de pastas mantendo organização atual
- [ ] Configurar ESLint/Prettier com padrões do projeto
- [ ] Setup do ambiente de desenvolvimento para cada dev
- [ ] Documentação de componentes e padrões

## 📝 Observações

- Este plano pode ser executado por múltiplos agentes de IA trabalhando em paralelo
- Cada fase tem dependências claramente definidas
- A documentação deve ser atualizada continuamente
- Testes devem ser implementados desde o início
- O feedback dos usuários deve ser coletado constantemente

---

## 🎨 Anexo: Especificações Técnicas do Design Habilidade

### Componentes a Migrar
1. **GradientButton**: `src/components/GradientButton.jsx`
2. **Starfield**: `src/components/Starfield.jsx`
3. **Header**: `src/components/Header.jsx` (navbar structure)
4. **Backgrounds**: `src/components/backgrounds/` (todos os temas)

### CSS Classes Importantes
- `.gradient-text` - Texto com gradiente animado
- `.animate-gradient` - Animação de fluxo de gradiente
- `.btn-neon` - Estilo neon para botões
- `.glass-effect` - Efeito vidro em cards

### Cores por Categoria (HEX)
- **IA**: `#22d3ee` (Ciano)
- **Design**: `#f472b6` (Rosa)  
- **Programação**: `#4ade80` (Verde)
- **Marketing**: `#a78bfa` (Roxo claro)
- **3D**: `#f97316` (Laranja)
- **Vídeo**: `#f87171` (Vermelho coral)

### Animations CSS
- **Entrada**: `transform: translateY(30px)` → `translateY(0)`
- **Hover**: `scale(1)` → `scale(1.05)`
- **Gradient**: `background-position: 0% 50%` → `100% 50%`

---

**Última atualização**: 2024-07-04  
**Status**: Plano completo com especificações de design
**Responsável**: Equipe de Desenvolvimento + Design System Habilidade