# 💻 SETUP LOCAL - DESENVOLVIMENTO

## 🎯 PRÉ-REQUISITOS

### Ferramentas Necessárias
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** (incluído com Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Supabase CLI** (opcional, mas recomendado)
- **Editor**: VSCode, WebStorm, ou similar

### Verificar Instalação
```bash
node --version    # v18.0.0+
npm --version     # 8.0.0+
git --version     # 2.0.0+
```

---

## 🚀 INSTALAÇÃO INICIAL

### 1. Clonar o Repositório
```bash
# SSH (recomendado)
git clone git@github.com:stelarow/habilidade.git

# HTTPS
git clone https://github.com/stelarow/habilidade.git

cd habilidade
```

### 2. Instalar Dependências

#### Marketing Site (React/Vite)
```bash
# Na raiz do projeto
npm install

# Verificar instalação
npm run dev
```

#### Learning Platform (Next.js)
```bash
# Entrar na plataforma de ensino
cd plataforma-ensino

# Instalar dependências
npm install

# Verificar instalação
npm run dev
```

---

## ⚙️ CONFIGURAÇÃO DE AMBIENTE

### 1. Variáveis de Ambiente - Marketing Site

Criar arquivo `.env.local` na **raiz do projeto**:
```bash
# .env.local (Marketing Site)

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id  
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# API Endpoints
VITE_API_BASE_URL=http://localhost:3000
VITE_PLATFORM_URL=http://localhost:3000

# Analytics (opcional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 2. Variáveis de Ambiente - Learning Platform

Criar arquivo `.env.local` em **plataforma-ensino/**:
```bash
# .env.local (Learning Platform)

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MAIN_SITE_URL=http://localhost:5173

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment (futuro)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🗄️ CONFIGURAÇÃO DO BANCO DE DADOS

### 1. Criar Projeto no Supabase
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Clique em "New Project"
3. Configure:
   - **Name**: Escola Habilidade Dev
   - **Database Password**: Senha segura
   - **Region**: South America (São Paulo)

### 2. Executar Migrações
```bash
cd plataforma-ensino

# Instalar Supabase CLI (se não tiver)
npm install -g supabase

# Login no Supabase
supabase login

# Linkar projeto local
supabase link --project-ref your-project-ref

# Executar migrações
supabase db push

# Ou executar manualmente no SQL Editor
# Copiar conteúdo de database/schema.sql
```

### 3. Schema Principal
```sql
-- Executar no SQL Editor do Supabase
-- Copiar de: plataforma-ensino/database/schema.sql

-- Principais tabelas:
-- ✓ profiles (perfis de usuário)
-- ✓ courses (catálogo de cursos) 
-- ✓ lessons (aulas individuais)
-- ✓ enrollments (matrículas)
-- ✓ lesson_progress (progresso)
-- ✓ blog_posts (sistema de blog)
-- ✓ instructors (dados dos instrutores)
```

### 4. Dados de Teste
```bash
# Executar seeds (dados de exemplo)
cd plataforma-ensino/database
cat seed_instructors.sql | supabase db sql

# Ou no SQL Editor, executar:
# - seed_instructors.sql
# - test_integration_complete.sql
```

---

## 🧪 EXECUTAR LOCALMENTE

### 1. Dual Development Setup

#### Terminal 1 - Marketing Site
```bash
# Na raiz do projeto
npm run dev

# Disponível em: http://localhost:5173
```

#### Terminal 2 - Learning Platform  
```bash
# Em plataforma-ensino/
cd plataforma-ensino
npm run dev

# Disponível em: http://localhost:3000
```

### 2. URLs de Desenvolvimento
- **Marketing Site**: `http://localhost:5173`
- **Learning Platform**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`
- **API Routes**: `http://localhost:3000/api/*`

---

## 🔧 CONFIGURAÇÃO DO EDITOR (VSCODE)

### 1. Extensões Recomendadas
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss", 
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-eslint"
  ]
}
```

### 2. Settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### 3. Prettier Configuration
```json
// .prettierrc (em ambos os projetos)
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 🔍 VERIFICAR INSTALAÇÃO

### 1. Health Check Script
```bash
# Criar script de verificação
# plataforma-ensino/scripts/health-check.js

node scripts/health-check.js
```

```javascript
// scripts/health-check.js
const https = require('https')

const checks = [
  {
    name: 'Supabase Connection',
    test: () => fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/')
  },
  {
    name: 'Database Access', 
    test: async () => {
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      return supabase.from('profiles').select('count').limit(1)
    }
  }
]

async function runHealthCheck() {
  console.log('🔍 Verificando configuração...\n')

  for (const check of checks) {
    try {
      await check.test()
      console.log(`✅ ${check.name}`)
    } catch (error) {
      console.log(`❌ ${check.name}: ${error.message}`)
    }
  }
}

runHealthCheck()
```

### 2. Testes Básicos
```bash
# Marketing Site
npm run build     # Build deve passar
npm run lint      # Sem erros de lint

# Learning Platform  
cd plataforma-ensino
npm run build     # Build deve passar
npm run lint      # Sem erros de lint
npm run test      # Testes devem passar
```

---

## 🌐 CONFIGURAÇÃO DE CORS

### Development CORS (Next.js)
```typescript
// plataforma-ensino/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:5173' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## 📱 CONFIGURAÇÃO MOBILE (OPCIONAL)

### 1. React Native Setup (Futuro)
```bash
# Setup para desenvolvimento mobile
npm install -g @react-native-community/cli
npx react-native init EscolaHabilidadeApp

# iOS (macOS only)
cd ios && pod install

# Android
npx react-native run-android
```

---

## 🔄 WORKFLOW DE DESENVOLVIMENTO

### 1. Fluxo Diário
```bash
# 1. Atualizar código
git pull origin main

# 2. Instalar novas dependências (se houver)
npm install

# 3. Executar em modo dev
npm run dev

# 4. Fazer alterações...

# 5. Testar localmente
npm run test
npm run build

# 6. Commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### 2. Branch Strategy
```bash
# Feature branches
git checkout -b feature/nome-da-feature
git checkout -b fix/nome-do-bug
git checkout -b docs/update-readme

# Hot fixes
git checkout -b hotfix/critical-bug

# Release branches
git checkout -b release/v1.2.0
```

---

## 🐛 TROUBLESHOOTING

### Problemas Comuns

#### 1. "Module not found"
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 2. "Port already in use"
```bash
# Marketing Site (port 5173)
npx kill-port 5173
npm run dev

# Learning Platform (port 3000)  
npx kill-port 3000
npm run dev
```

#### 3. "Supabase connection failed"
```bash
# Verificar variáveis de ambiente
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Testar conexão
curl https://your-project.supabase.co/rest/v1/
```

#### 4. "Build failed"
```bash
# Verificar TypeScript
npx tsc --noEmit

# Verificar ESLint
npm run lint

# Limpar cache do Next.js
rm -rf .next
npm run build
```

### Logs de Debug
```bash
# Next.js debug
DEBUG=* npm run dev

# Supabase logs
supabase logs

# Aplicação específica
NEXT_PUBLIC_DEBUG=true npm run dev
```

---

## 📞 SUPORTE

### Recursos Úteis
- **Documentação Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Documentação Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)

### Contatos
- **Tech Lead**: alessandro.ferreira@escolahabilidade.com
- **GitHub Issues**: [Repository Issues](https://github.com/stelarow/habilidade/issues)
- **Discord**: Link do canal de desenvolvimento

---

*Documentação atualizada em: 30/07/2025*