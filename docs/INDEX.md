# 📋 DOCUMENTAÇÃO TÉCNICA - ESCOLA HABILIDADE

## 🏗️ ARQUITETURA DUAL
**Marketing Site (React/Vite) + Learning Platform (Next.js/Supabase)**

---

## 🔍 NAVEGAÇÃO RÁPIDA

### 📐 [01. ARQUITETURA](./01-architecture/)
- [Sistema Geral](./01-architecture/system-overview.md) - Visão completa da arquitetura
- [Marketing Site](./01-architecture/marketing-site.md) - React/Vite/Tailwind
- [Learning Platform](./01-architecture/learning-platform.md) - Next.js/Supabase/TypeScript
- [Integração](./01-architecture/integration.md) - Como os sistemas se comunicam
- [Banco de Dados](./01-architecture/database.md) - Schema Supabase e migrações

### ⚡ [02. FEATURES](./02-features/)
- [Sistema de Auth](./02-features/authentication.md) - Supabase Auth completo
- [Gestão de Cursos](./02-features/courses.md) - CRUD, matrículas, progresso
- [Sistema de Aulas](./02-features/lessons.md) - Vídeo, PDF, exercícios, quizzes
- [Painel Admin](./02-features/admin-panel.md) - Dashboard administrativo
- [Blog System](./02-features/blog.md) - CMS integrado para marketing
- [Portal do Aluno](./02-features/student-portal.md) - Dashboard estudantil
- [Sistema de Agendamento](./02-features/scheduling.md) - Calendário e disponibilidade

### 🔌 [03. APIs](./03-apis/)
- [Endpoints Públicos](./03-apis/public-endpoints.md) - Blog, cursos públicos
- [Endpoints Privados](./03-apis/private-endpoints.md) - Admin, estudante
- [Authentication](./03-apis/auth-api.md) - Rotas de autenticação
- [Error Handling](./03-apis/error-handling.md) - Padrões de erro
- [Rate Limiting](./03-apis/rate-limiting.md) - Proteção contra abuso

### 🧩 [04. COMPONENTES](./04-components/)
- [Design System](./04-components/design-system.md) - Shadcn/ui + Tailwind
- [Componentes Comuns](./04-components/shared.md) - Headers, footers, forms
- [Componentes Admin](./04-components/admin.md) - Dashboards, CRUD forms
- [Componentes de Curso](./04-components/course.md) - Player, progresso, exercícios
- [Componentes do Blog](./04-components/blog.md) - Cards, navegação, CTA

### 🚀 [05. DEPLOYMENT](./05-deployment/)
- [Ambiente de Produção](./05-deployment/production.md) - Netlify + Supabase
- [CI/CD Pipeline](./05-deployment/pipeline.md) - GitHub Actions
- [Configuração de Ambiente](./05-deployment/environment.md) - Variáveis e secrets
- [Monitoramento](./05-deployment/monitoring.md) - Logs, métricas, alertas
- [Backup & Recovery](./05-deployment/backup.md) - Estratégias de backup

### 💻 [06. DESENVOLVIMENTO](./06-development/)
- [Setup Local](./06-development/local-setup.md) - Como começar a desenvolver
- [Testes](./06-development/testing.md) - Jest, Playwright, estratégias
- [Code Style](./06-development/code-style.md) - ESLint, Prettier, padrões
- [Git Workflow](./06-development/git-workflow.md) - Branches, PRs, releases
- [Debugging](./06-development/debugging.md) - Ferramentas e técnicas

### 📁 [07. LEGACY](./07-legacy/)
- [Documentos Antigos](./07-legacy/) - Docs migrados para referência histórica

---

## 🎯 TECNOLOGIAS PRINCIPAIS

### Marketing Site (Frontend)
- **React 19** - Framework principal
- **Vite 7** - Build tool e dev server
- **Tailwind CSS 4** - Framework CSS utilitário
- **React Router v6** - Roteamento SPA
- **React Query** - Estado servidor e cache
- **EmailJS** - Sistema de contato

### Learning Platform (Fullstack)
- **Next.js 14** - Framework React com SSR/API
- **TypeScript** - Linguagem tipada
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth)
- **Shadcn/ui** - Biblioteca de componentes (tema violet)
- **Tailwind CSS** - Estilização
- **Zod** - Validação de schemas

### Banco de Dados
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)** - Segurança granular
- **Real-time subscriptions** - Updates em tempo real
- **Storage** - Upload de arquivos e mídias

---

## 🚦 STATUS DO PROJETO

### ✅ IMPLEMENTADO
- [x] Marketing Site completo (React/Vite)
- [x] Sistema de autenticação (Supabase)
- [x] Painel administrativo básico
- [x] CRUD de cursos e aulas
- [x] Player de vídeo integrado
- [x] Sistema de PDF com scroll
- [x] Exercícios e quizzes
- [x] Sistema de progresso
- [x] Blog backend (API)
- [x] Agendamento de aulas
- [x] Sistema de monitoramento

### 🔄 EM DESENVOLVIMENTO
- [ ] Blog frontend integrado
- [ ] Portal do estudante avançado
- [ ] Sistema de notificações
- [ ] Analytics avançado

---

## 🎨 DESIGN SYSTEM

### Cores Principais
```css
:root {
  --primary: #d400ff;      /* Roxo principal */
  --secondary: #00c4ff;    /* Azul secundário */
  --accent: #a000ff;       /* Roxo accent */
  --success: #10b981;      /* Verde sucesso */
  --warning: #f59e0b;      /* Amarelo aviso */
  --error: #ef4444;        /* Vermelho erro */
}
```

### Tipografia
- **Headers**: Inter/System fonts, weights 400-700
- **Body**: Inter/System fonts, weights 400-500
- **Code**: 'Fira Code', monospace

### Breakpoints
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🔗 LINKS ÚTEIS

### Ambientes
- **Marketing Site**: [www.escolahabilidade.com]
- **Learning Platform**: [https://plataformahabilidade.netlify.app/](https://plataformahabilidade.netlify.app/)
- **Supabase Dashboard**: [Dashboard do projeto](https://supabase.com/dashboard)

### Repositórios
- **Main Repository**: [GitHub - Escola Habilidade](https://github.com/stelarow/habilidade)
- **Issues & PRs**: [GitHub Issues](https://github.com/stelarow/habilidade/issues)

---

## 🆘 PRECISA DE AJUDA?

### 📖 Primeiros Passos
1. Leia [Setup Local](./06-development/local-setup.md)
2. Configure [Ambiente de Desenvolvimento](./06-development/environment.md)
3. Execute [Testes Locais](./06-development/testing.md)

### 🐛 Problemas Comuns
- [Troubleshooting Auth](./02-features/authentication.md#troubleshooting)
- [Problemas de Build](./06-development/debugging.md#build-errors)
- [Configuração Supabase](./01-architecture/database.md#setup)

### 📞 Contatos
- **Tech Lead**: alessandro.ferreira@escolahabilidade.com
- **DevOps**: [GitHub Issues](https://github.com/stelarow/habilidade/issues)

---

*Última atualização: 30/07/2025*
*Versão da documentação: 2.0*