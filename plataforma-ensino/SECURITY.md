# 🔐 Documentação de Segurança - Admin Authentication

## Visão Geral

O sistema implementa **autenticação e autorização em múltiplas camadas** (Defense in Depth) para proteger as rotas administrativas `/admin/*`.

## 🛡️ Camadas de Segurança

### Layer 1: Middleware Simplificado
- **Arquivo**: `middleware.ts`
- **Função**: Primeira linha de defesa focada em redirecionamentos
- **Características**:
  - Compatível com Netlify serverless
  - Verificações lightweight de autenticação
  - Redirecionamentos automáticos para usuários não autorizados
  - Usa funções do `session.ts` para verificações rápidas
  - Sem dependência de headers para Server Components

### Layer 2: Layout Protection
- **Arquivo**: `src/app/admin/layout.tsx` + `src/components/admin/AdminAuthWrapper.tsx`
- **Função**: Proteção no nível do layout
- **Características**:
  - Usa `ProtectedRoute` component
  - Verifica role="admin" e permission="admin.view"
  - Fallback elegante para usuários não autorizados
  - Suspense para loading states

### Layer 3: Server-Side Verification
- **Arquivo**: `src/lib/auth/session.ts`
- **Função**: Verificação centralizada em Server Components/Actions
- **Características**:
  - `requireAdmin()` - força autenticação admin ou redireciona
  - `verifySession()` - verificação geral de sessão (cached)
  - `verifySessionWithRole()` - verificação com role específica
  - `requireInstructorOrAdmin()` - acesso para instrutor ou admin
  - Verificação direta via Supabase (sem dependência de headers)
  - Cache React para evitar verificações duplicadas

### Layer 4: Database RLS Policies
- **Arquivo**: `database/admin-security-policies.sql`
- **Função**: Proteção a nível de banco de dados
- **Características**:
  - Row Level Security (RLS) habilitado
  - Função `public.is_admin()` para verificação
  - Policies específicas por tabela
  - Audit log para ações administrativas

### Layer 5: Client-Side Hook
- **Arquivo**: `src/hooks/useAdminAuth.ts`
- **Função**: Verificação reativa no cliente
- **Características**:
  - Hook `useAdminAuth()` para components
  - Verificação em tempo real
  - Auto-redirect em caso de perda de acesso
  - Refresh auth capability

## 🔑 Sistema de Permissões

### Roles Disponíveis
- **admin**: Acesso total ao sistema
- **instructor**: Gerenciamento de cursos próprios
- **student**: Acesso básico de estudante

### Permissões Admin
```typescript
'admin.view'           // Acesso ao painel admin
'admin.users.view'     // Visualizar usuários
'admin.users.create'   // Criar usuários
'admin.users.edit'     // Editar usuários
'admin.users.delete'   // Deletar usuários
'admin.courses.view'   // Visualizar cursos
'admin.courses.create' // Criar cursos
'admin.courses.edit'   // Editar cursos
'admin.courses.delete' // Deletar cursos
'admin.courses.publish'// Publicar cursos
// ... e mais
```

## 🚨 Fluxo de Segurança

### 1. Acesso a /admin/*
```
Request → Middleware → Auth Check → Role Check → Header Population → Layout → Component
```

### 2. Falha de Autenticação
```
No Token/Invalid → Redirect to /auth/login
Valid Token + Non-Admin → Redirect to /dashboard
```

### 3. Defense in Depth
```
Middleware FAIL → Layout Protection
Layout FAIL → Component Protection  
Component FAIL → Database RLS
```

## 🛠️ Como Usar

### Em Server Components
```typescript
import { requireAdmin } from '@/lib/auth/require-admin'

export default async function AdminPage() {
  const admin = await requireAdmin() // Auto-redirect se não admin
  
  return <div>Admin content</div>
}
```

### Em Client Components
```typescript
import { useAdminAuth } from '@/hooks/useAdminAuth'

export default function AdminComponent() {
  const { user, isAdmin, isLoading, error } = useAdminAuth()
  
  if (isLoading) return <Loading />
  if (error) return <Error message={error} />
  
  return <div>Admin content</div>
}
```

### Database Queries
```sql
-- RLS automaticamente aplicado
SELECT * FROM users; -- Só retorna dados permitidos para o role atual
```

## 🔍 Monitoramento

### Logs de Segurança
- Todas as tentativas de acesso são logadas
- Middleware logs em `[MIDDLEWARE]`
- Auth failures em `[REQUIRE_ADMIN]`

### Audit Trail
- Tabela `admin_audit_log` registra ações admin
- Include: ação, tabela, valores antigos/novos
- Somente admins podem visualizar

## ⚡ Performance

### Otimizações
- Middleware usa cliente cookieless para compatibilidade Netlify
- Headers populados uma vez no middleware
- Client-side caching de auth state
- Lazy loading de components protegidos

### Fallbacks
- Middleware error → Client-side auth
- Server auth error → Client-side verification
- Graceful degradation em todos os níveis

## 🧪 Testing

### Testar Autenticação
1. Acesse `/admin` sem login → Deve redirecionar para `/auth/login`
2. Login como student → Deve redirecionar para `/dashboard`
3. Login como admin → Deve acessar `/admin` normalmente

### Testar Database Security
```sql
-- Como student
SELECT * FROM users; -- Deve retornar apenas próprios dados

-- Como admin  
SELECT * FROM users; -- Deve retornar todos os usuários
```

## 🚀 Deployment

### Variáveis de Ambiente Necessárias
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Aplicar Policies no Supabase
```bash
# Execute o arquivo SQL no Supabase Dashboard
cat database/admin-security-policies.sql
```

---

**✅ Sistema implementado com segurança enterprise-grade usando Defense in Depth strategy.**