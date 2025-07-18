# 🎓 Plataforma de Ensino Habilidade

Uma plataforma de ensino moderna desenvolvida com Next.js 14, TypeScript, Tailwind CSS e Supabase, mantendo a identidade visual da marca Habilidade.

## ✅ Status do Projeto

### Concluído ✅
- **Estrutura Base**: Next.js 14.2.x + TypeScript + App Router
- **Design System**: Paleta de cores Habilidade + Tailwind CSS
- **Database**: Schema completo Supabase + RLS policies
- **Autenticação**: Middleware + clientes Supabase configurados
- **Tipos**: Sistema completo TypeScript para todas as entidades
- **Componentes UI**: Migração completa (GradientButton, Starfield, Loading, ErrorBoundary)
- **Background Components**: Todos os 9 backgrounds migrados para TypeScript
- **Dependências**: 792 packages instalados e configurados
- **Páginas de Auth**: Login, registro, recuperação de senha e dashboard
- **Sentry Integration**: Error tracking e performance monitoring completo

### Em Desenvolvimento (Sessão 3) 🔄
- **Player de Vídeo**: React Player + Mux integration
- **Dashboard Enhancement**: Interface do aluno com dados reais
- **Navigation System**: Sistema de rotas e menus protegidos
- **Lesson Page Redesign**: Nova interface de aulas com componentes modulares ✅ **QUASE COMPLETO**
  - ✅ **Core Components**: VideoSection, PDFSection, QuizSection, ExercisesSection, CompletionSection
  - ✅ **Integration Component**: LessonPageIntegration para bridge entre dados existentes e nova UI
  - ✅ **Completion Integration**: Integração com sistema de conclusão existente
  - ✅ **Responsive Design**: Design responsivo otimizado para mobile, tablet e desktop
  - ✅ **Design System**: Sistema de tokens CSS integrado com brand colors
  - ✅ **Test Pages**: Páginas de teste completas para validação de funcionalidades

### Próximo 📋
- **Admin Panel**: Gerenciamento de cursos e usuários
- **Testing**: Jest + Playwright implementation
- **Performance**: Otimizações avançadas e PWA

## 🏗️ Tecnologias

### Frontend
- **Next.js 14.2.x** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Styling com sistema Habilidade
- **Framer Motion** - Animações
- **Zustand** - Gerenciamento de estado
- **React Hook Form + Zod** - Formulários e validação

### Backend
- **Supabase** - Database PostgreSQL + Auth + Storage
- **Row Level Security** - Políticas de segurança implementadas
- **Real-time** - Atualizações em tempo real

### Monitoring & Quality
- **Sentry** - Error tracking e performance monitoring
- **Jest + Playwright** - Testes unitários e E2E (configurado)
- **ESLint + TypeScript** - Qualidade de código

### TypeScript Conventions
- **Strict Mode**: Enabled for maximum type safety
- **Optional Properties**: Use `undefined` over `null` for optional properties
- **Type Definitions**: Comprehensive types for all entities and components
- **Interface Design**: Prefer interfaces over types for object shapes

### Componentes
- **React Player** - Player de vídeo
- **Mux** - Streaming de vídeo profissional
- **Phosphor React** - Ícones
- **Radix UI** - Componentes headless

## 🎨 Design System

### Sistema de Cores (Design Tokens)
O projeto utiliza um sistema de design tokens baseado em CSS custom properties para máxima flexibilidade e manutenibilidade:

#### Cores Principais
- **Primary**: `#d400ff` (Magenta Habilidade) - `hsl(var(--primary))`
- **Secondary**: `#00c4ff` (Ciano) - `hsl(var(--secondary))`
- **Accent**: `#a000ff` (Roxo) - `hsl(var(--accent))`

#### Cores Semânticas
- **Background**: `hsl(var(--background))` - Fundo principal
- **Foreground**: `hsl(var(--foreground))` - Texto principal
- **Card**: `hsl(var(--card))` - Fundos de cards
- **Muted**: `hsl(var(--muted))` - Elementos secundários
- **Border**: `hsl(var(--border))` - Bordas e divisores
- **Success**: `hsl(var(--success))` - Estados de sucesso
- **Warning**: `hsl(var(--warning))` - Estados de aviso
- **Destructive**: `hsl(var(--destructive))` - Estados de erro

#### Cores Específicas
- **Header**: `hsl(var(--header-bg))` / `hsl(var(--header-foreground))`
- **Input**: `hsl(var(--input))` - Campos de entrada
- **Ring**: `hsl(var(--ring))` - Anéis de foco

### Tipografia
- **Fonte**: Montserrat (Google Fonts)
- **Hierarquia**: Sistema consistente com site atual

### Componentes
- **GradientButton**: Botões com efeito neon
- **Glass Effect**: Cards com efeito vidro
- **Corner Cut**: Cantos cortados característicos
- **Starfield**: Background animado com partículas

### Vantagens do Sistema de Tokens
- **Consistência**: Cores centralizadas e reutilizáveis
- **Manutenibilidade**: Mudanças globais com alterações mínimas
- **Temas**: Suporte nativo para temas claro/escuro
- **Acessibilidade**: Contraste e legibilidade otimizados

## 📁 Estrutura do Projeto

```
plataforma-ensino/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css     # Estilos globais + Design System
│   │   ├── layout.tsx      # Layout principal
│   │   └── page.tsx        # Página inicial
│   ├── components/         # Componentes React
│   │   ├── lesson/        # Componentes da página de aula
│   │   │   ├── LessonPageIntegration.tsx  # Bridge entre dados existentes e nova UI
│   │   │   └── LessonPageRedesigned.tsx   # Nova interface redesenhada
│   │   └── ui/            # Componentes do Design System
│   ├── lib/               # Utilitários
│   │   └── supabase/      # Configuração Supabase
│   └── types/             # Tipos TypeScript
├── database/
│   └── schema.sql         # Schema completo do banco
├── lib/
│   └── supabase/          # Clientes Supabase
├── middleware.ts          # Middleware de autenticação
└── tailwind.config.ts     # Configuração Tailwind + cores
```

## 🗄️ Database Schema

### Principais Tabelas
- **users** - Perfis de usuário (extends auth.users)
- **courses** - Cursos disponíveis
- **lessons** - Aulas dos cursos
- **enrollments** - Matrículas dos alunos
- **progress** - Progresso por aula
- **categories** - Categorias de cursos
- **certificates** - Certificados emitidos

### Features Implementadas
- **RLS Policies** - Segurança por linha
- **Triggers** - Atualizações automáticas
- **Views** - Estatísticas e relatórios
- **Functions** - Lógica de negócio no banco

## 🔐 Autenticação

### Fluxo de Auth
1. **Middleware** - Proteção automática de rotas
2. **Server Client** - Operações server-side
3. **Browser Client** - Operações client-side
4. **RLS** - Políticas de acesso no banco

### Roles
- **Student** - Aluno padrão
- **Instructor** - Instrutor de cursos
- **Admin** - Administrador da plataforma

## 📦 Instalação

```bash
# 1. Clone o repositório
cd plataforma-ensino

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local

# 4. Configurar Supabase
# - Criar projeto no Supabase
# - Executar database/schema.sql
# - Adicionar URLs e chaves no .env.local

# 5. Executar desenvolvimento
npm run dev
```

## 🌐 Variáveis de Ambiente

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Mux (vídeos)
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret

# Sentry (monitoramento)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## 🚀 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Executar produção
npm run lint         # Verificar código
npm run test         # Executar testes (quando configurado)
npm run test:e2e     # Testes E2E (quando configurado)
```

## 🧪 Páginas de Teste e Desenvolvimento

### Lesson Page Redesign Test Pages

#### CompletionSection Test Page
**URL**: `/test-completion-section`

Página de teste dedicada para o componente `CompletionSection`, parte do projeto de redesign da página de aulas.

**Funcionalidades**:
- ✅ Simulação de progresso em tempo real
- ✅ Controles para testar critérios de conclusão
- ✅ Interface visual para validação de estados
- ✅ Timer automático para teste de tempo mínimo

**Como usar**:
1. Acesse `http://localhost:3000/test-completion-section`
2. Use os botões de simulação para avançar o progresso:
   - **Advance PDF (+25%)**: Simula leitura do material
   - **Complete Quiz (85%)**: Marca quiz como concluído
   - **Advance Exercises (+33%)**: Simula envio de exercícios
3. Aguarde 2+ minutos para critério de tempo
4. Observe a habilitação do botão de conclusão

**Critérios testados**:
- ⏱️ Tempo mínimo na aula (2 min para teste)
- 📄 Leitura completa do PDF (100%)
- 🏆 Aprovação no quiz (≥70%)
- 📝 Conclusão dos exercícios (100%)

#### Redesigned Lesson Page Test
**URL**: `/test-lesson-redesigned`

Página de teste para a nova interface de aulas redesenhada com integração completa do sistema de conclusão.

**Funcionalidades**:
- ✅ Interface redesenhada com header fixo e progresso visual
- ✅ Seções modulares: Vídeo, PDF, Exercícios, Quiz, Conclusão
- ✅ Integração com `EnhancedLessonCompletion` para celebração
- ✅ Simulação completa de progresso e conclusão de aula
- ✅ Design responsivo para desktop, tablet e mobile

**Componentes integrados**:
- **LessonHeaderRedesigned**: Header com logo e indicadores de progresso
- **VideoSection**: Player simulado com controles e progresso
- **PDFSection**: Visualizador de apostila com simulação de leitura
- **ExercisesSection**: Upload de arquivos com drag-and-drop
- **QuizSection**: Sistema de perguntas com pontuação e explicações
- **CompletionSection**: Validação de critérios e botão de conclusão

## 🔗 Integração de Componentes

### LessonPageIntegration Component

**Localização**: `/src/components/lesson/LessonPageIntegration.tsx`

Componente de integração que faz a ponte entre a estrutura de dados existente da página de aula e a nova interface redesenhada.

**Funcionalidades**:
- ✅ **Data Transformation**: Converte dados existentes para o formato da nova UI
- ✅ **Progress Mapping**: Mapeia progresso existente para LessonProgressData
- ✅ **Navigation Handling**: Gerencia navegação e callbacks de conclusão
- ✅ **Backward Compatibility**: Mantém compatibilidade com estrutura existente

**Uso**:
```typescript
import LessonPageIntegration from '@/components/lesson/LessonPageIntegration'

<LessonPageIntegration
  course={course}
  lesson={lesson}
  progress={progress}
  exercises={exercises}
  quizzes={quizzes}
  submissions={submissions}
  quizProgress={quizProgress}
  onLessonComplete={handleComplete}
  onExit={handleExit}
/>
```

**Data Transformation**:
- **Video Progress**: Calcula percentual baseado em watch_time/duration
- **Quiz Progress**: Extrai melhor pontuação e status de conclusão
- **Exercise Progress**: Calcula baseado em submissões aprovadas
- **Overall Progress**: Combina todos os componentes com pesos específicos

**Integration Points**:
- Conecta com `LessonPageRedesigned` para renderização
- Mantém callbacks existentes para navegação
- Preserva lógica de conclusão de aula existente

## 📋 Progresso de Desenvolvimento

### ✅ Sessão 2 (Concluída)
1. **✅ Migrar Componentes**: GradientButton, Starfield, backgrounds (9 componentes)
2. **✅ Resolver npm install**: 792 dependências instaladas
3. **✅ Criar Auth Pages**: Login, registro, recuperação completos
4. **✅ Setup Sentry**: Error tracking e performance monitoring

### 🔄 Sessão 3 (Em Progresso)
1. **Video Player**: Implementar React Player + Mux
2. **Dashboard Enhancement**: Interface de cursos e progresso com dados reais
3. **Navigation System**: Sistema de rotas protegidas e menus
4. **Testing**: Jest + Testing Library implementation

## 📞 Suporte

Para dúvidas sobre o desenvolvimento, consulte:
- **Plano Completo**: `/plataforma.md`
- **Database Schema**: `/database/schema.sql`
- **Tipos TypeScript**: `/src/types/index.ts`

---

**Desenvolvido com 💜 para a Habilidade**
