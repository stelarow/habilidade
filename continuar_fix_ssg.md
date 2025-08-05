# Continuação Fix SSG - Escola Habilidade

## Contexto do Problema

### Situação Original
- **Data**: 2025-08-05
- **Problema Inicial**: Site mostrava apenas header e footer após migração para SSG
- **URL**: https://www.escolahabilidade.com/
- **Causa Raiz**: Migração de SPA para SSG com `vite-react-ssg` v0.8.8

### O que Foi Descoberto

#### 1. Arquitetura Atual
- **Framework SSG**: `vite-react-ssg` v0.8.8
- **Routing**: Híbrido com `routes.jsx` (SSG) e `App.jsx` (SPA legado)
- **Build**: Vite 7.0.0
- **Deploy**: Netlify com build automático

#### 2. Estrutura de Arquivos Chave
```
src/
├── main.jsx           # Entry point SSG (ViteReactSSG)
├── App.jsx           # Entry point SPA legado (BrowserRouter) - AINDA EXISTE!
├── routes.jsx        # Rotas SSG com lazy loading
├── Layout.jsx        # Layout wrapper com providers
└── pages/
    ├── Home.jsx      # ✅ CORRIGIDO - Página inicial
    ├── BlogPostSSG.jsx # ❌ PROBLEMA - Posts do blog
    └── BlogIndex.jsx  # ❌ PROBLEMA - Índice do blog
```

## O que Foi Corrigido

### Fix na Página Home (FUNCIONOU ✅)

**Arquivo**: `src/pages/Home.jsx`

**Alterações aplicadas**:
```javascript
// Adicionado loader function para SSG
export function loader() {
  return null;
}

// Mantido export default
export default Home;

// Adicionado export Component para compatibilidade SSG
export { Home as Component };
```

**Commit**: `7e791f8` - "fix: add SSG loader and Component exports to Home page"

**Resultado**: Página inicial voltou a exibir todas as seções (Hero, Courses, etc.)

## Problemas Restantes

### 1. Páginas do Blog Não Renderizam Corretamente

**Sintomas**:
- URLs como `/blog/guia-completo-21-estilos-decoracao-transformar-casa` mostram apenas partes
- Conteúdo parcial ou ausente
- Meta tags podem estar sendo geradas mas componentes não renderizam

**Arquivos Suspeitos**:
- `src/pages/BlogPostSSG.jsx` - Precisa dos mesmos exports que Home.jsx
- `src/pages/BlogIndex.jsx` - Também pode precisar
- `src/pages/BlogCategory.jsx` - Verificar também

### 2. Navegação SPA Quebrada

**Sintomas**:
- Links mudam URL mas não navegam
- Página não recarrega ao clicar em links internos
- Comportamento típico de conflito SPA vs SSG

**Possível Causa**:
- Conflito entre `App.jsx` (usa BrowserRouter) e `main.jsx` (usa ViteReactSSG)
- React Router não está integrado corretamente com SSG
- Links podem estar usando navegação client-side quando deveriam ser full page loads

### 3. Rotas do Blog no SSG

**Configuração Atual em `routes.jsx`**:
```javascript
const blogSlugs = [
  'guia-completo-21-estilos-decoracao-transformar-casa',
  // ... mais 15 slugs
];

{
  path: ':slug',
  lazy: () => import('./pages/BlogPostSSG'),
  getStaticPaths: () => blogSlugs
}
```

## Solução Proposta

### Passo 1: Aplicar Fix do Home em BlogPostSSG

```javascript
// src/pages/BlogPostSSG.jsx
// Adicionar no final do arquivo:

export function loader({ params }) {
  // Manter loader existente se houver
  // ou criar um básico
  return { slug: params.slug };
}

export default BlogPostSSG;
export { BlogPostSSG as Component };
```

### Passo 2: Aplicar em BlogIndex e BlogCategory

Mesma estratégia - adicionar:
- `loader` function
- Export `Component` além do default

### Passo 3: Resolver Conflito de Routing

**Opção A**: Remover completamente `App.jsx` e usar apenas SSG
- Migrar todo conteúdo de App.jsx para Layout.jsx
- Garantir que index.html aponta para main.jsx

**Opção B**: Configurar navegação adequada
- Verificar se links usam `<Link>` do React Router
- Considerar usar `<a>` tags normais para forçar full page loads em produção

### Passo 4: Verificar Build Local

```bash
# Testar build SSG localmente
npm run build:production

# Servir arquivos estáticos para testar
npx serve dist
```

## Configurações Importantes

### vite.config.js
- Não tem plugin `vite-react-ssg` configurado explicitamente
- Usa plugin customizado para sitemap
- Build com code splitting manual

### package.json Scripts
```json
"dev": "vite-react-ssg dev",
"build:production": "vite-react-ssg build"
```

### Netlify _redirects
```
/* /index.html 200
```
Configurado para SPA fallback - pode estar causando conflitos com SSG

## Memórias MCP Relevantes

Para contexto completo, consultar:
```bash
mcp__structured-memory__get_full_memory("migracao-spa-para-ssg-vite-react-ssg")
```

Esta memória contém:
- Histórico completo da migração
- Problemas resolvidos anteriormente
- Configurações técnicas detalhadas

## Comandos Úteis para Debug

```bash
# Ver estrutura HTML gerada
cat dist/index.html | grep -A 10 "main-content"

# Verificar se páginas do blog foram geradas
ls -la dist/blog/

# Ver logs do build
npm run build:production 2>&1 | tee build.log

# Testar localmente
npx serve dist
```

## Próximos Passos Recomendados

1. **URGENTE**: Aplicar exports (loader + Component) em BlogPostSSG.jsx
2. **IMPORTANTE**: Testar se isso resolve renderização do blog
3. **VERIFICAR**: Se navegação ainda está quebrada, investigar conflito App.jsx vs main.jsx
4. **VALIDAR**: Build local antes de fazer push
5. **MONITORAR**: Deploy no Netlify após correções

## Notas Adicionais

- SSG build demora ~45 segundos
- Deploy Netlify leva 2-5 minutos
- Site em produção: https://www.escolahabilidade.com/
- Dev server SSG roda na porta 5173

## Commits Relevantes

- `104ab2d` - Migração inicial SPA → SSG
- `27ab3ed` - Fix rendering issues após SSG
- `7e791f8` - Fix Home page com loader/Component exports (FUNCIONOU!)

---

**Status Atual**: Página inicial funciona, blog e navegação precisam de correção usando a mesma estratégia que funcionou para Home.