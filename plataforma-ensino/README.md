# 🎓 Plataforma de Ensino Habilidade

Uma plataforma de ensino moderna desenvolvida com Next.js 14, TypeScript, Tailwind CSS e Supabase, mantendo a identidade visual da marca Habilidade.

## ✅ Status do Projeto

### Concluído ✅
- **Estrutura Base**: Next.js 14.2.x + TypeScript + App Router
- **Design System**: Paleta de cores Habilidade + Tailwind CSS
- **Database**: Schema completo Supabase + RLS policies
- **Autenticação**: Middleware + clientes Supabase configurados
- **Tipos**: Sistema completo TypeScript para todas as entidades

### Em Desenvolvimento 🔄
- **Componentes UI**: Migração dos componentes da Habilidade
- **Dependências**: Instalação e configuração das libs principais
- **Páginas de Auth**: Login, registro e proteção de rotas

### Próximo 📋
- **Player de Vídeo**: React Player + Mux integration
- **Dashboard**: Interface do aluno com progresso
- **Admin Panel**: Gerenciamento de cursos e usuários

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

### Componentes
- **React Player** - Player de vídeo
- **Mux** - Streaming de vídeo profissional
- **Phosphor React** - Ícones
- **Radix UI** - Componentes headless

## 🎨 Design System

### Cores
- **Primary**: `#d400ff` (Magenta Habilidade)
- **Secondary**: `#00c4ff` (Ciano)
- **Accent**: `#a000ff` (Roxo)
- **Background**: `#0a0a0a` (Preto), `#181a2a` (Azul escuro)

### Tipografia
- **Fonte**: Montserrat (Google Fonts)
- **Hierarquia**: Sistema consistente com site atual

### Componentes
- **GradientButton**: Botões com efeito neon
- **Glass Effect**: Cards com efeito vidro
- **Corner Cut**: Cantos cortados característicos
- **Starfield**: Background animado com partículas

## 📁 Estrutura do Projeto

```
plataforma-ensino/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css     # Estilos globais + Design System
│   │   ├── layout.tsx      # Layout principal
│   │   └── page.tsx        # Página inicial
│   ├── components/         # Componentes React
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

# 2. Instalar dependências (em resolução)
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
SENTRY_DSN=your_sentry_dsn

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

## 📋 Próximos Passos

### Sessão 2
1. **Migrar Componentes**: GradientButton, Starfield, backgrounds
2. **Resolver npm install**: Dependências principais
3. **Criar Auth Pages**: Login, registro, recuperação
4. **Setup Sentry**: Error tracking e monitoramento

### Sessão 3
1. **Video Player**: Implementar React Player + Mux
2. **Dashboard Aluno**: Interface de cursos e progresso
3. **Navegação**: Sistema de rotas e menus
4. **Testes**: Jest + Testing Library setup

## 📞 Suporte

Para dúvidas sobre o desenvolvimento, consulte:
- **Plano Completo**: `/plataforma.md`
- **Database Schema**: `/database/schema.sql`
- **Tipos TypeScript**: `/src/types/index.ts`

---

**Desenvolvido com 💜 para a Habilidade**
