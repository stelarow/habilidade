# Tutorial: Resolver Problema de Renderização de Página com SSG

## Problema Identificado

Algumas páginas não estavam sendo renderizadas corretamente durante o processo de Static Site Generation (SSG) do Vite, gerando apenas arquivos HTML pequenos (~9.4 KiB) contendo apenas spinners de loading ao invés do conteúdo completo da página.

### Páginas Afetadas
- Página inicial (`/`)
- `/cursos/informatica` (já resolvido)
- `/cursos/projetista-3d` (já resolvido)

### Sintomas
- Arquivos HTML gerados com ~9.4 KiB ao invés de 150+ KiB
- Conteúdo exibindo apenas spinner de loading
- SEO prejudicado por falta de conteúdo estático

## Solução Aplicada

### 1. Diagnóstico
O problema estava relacionado ao uso do `Layout` principal para certas páginas durante o processo SSG. O `Layout` contém componentes que podem ter dependências que não funcionam corretamente no contexto de renderização estática.

### 2. Configuração no vite.config.js
Primeiro, foi necessário adicionar dependências problemáticas ao `ssr.noExternal`:

```js
ssr: {
  noExternal: ['phosphor-react', '@phosphor-icons/react']
}
```

### 3. Mudança de Layout
A solução principal foi mover as páginas problemáticas do `Layout` para o `CourseLayout`, que é mais otimizado para SSG.

#### Antes (src/routes.jsx):
```jsx
{
  path: '/',
  element: <Layout />,
  children: [
    {
      index: true,
      element: <Suspense key="home-page" fallback={<Loading />}><Home /></Suspense>
    },
    // outras rotas...
  ]
}
```

#### Depois (src/routes.jsx):
```jsx
// Página inicial usando CourseLayout para resolver problema SSG
{
  path: '/',
  element: <CourseLayout />,
  children: [
    {
      index: true,
      element: <Suspense key="home-page" fallback={<Loading />}><Home /></Suspense>
    }
  ]
},
// Layout principal movido para /pages
{
  path: '/pages',
  element: <Layout />,
  children: [
    // outras rotas que funcionam bem com Layout...
  ]
}
```

## Resultado

### Antes da Correção
```
dist/index.html       9.14 KiB  # ❌ Apenas spinner
```

### Depois da Correção
```
dist/index.html       151.79 KiB  # ✅ Conteúdo completo
dist/cursos/informatica.html  246.65 KiB  # ✅ Funcionando
dist/cursos/projetista-3d.html  205.08 KiB  # ✅ Funcionando
```

## Como Aplicar Esta Solução

### Passo 1: Identificar Páginas Problemáticas
Execute o build e verifique o tamanho dos arquivos HTML:
```bash
npm run build:production
```

Procure por arquivos com ~9.4 KiB que deveriam ter mais conteúdo.

### Passo 2: Mover para CourseLayout
No arquivo `src/routes.jsx`, mova a rota problemática do `Layout` para o `CourseLayout`:

```jsx
// Criar nova rota com CourseLayout
{
  path: '/sua-pagina-problema',
  element: <CourseLayout />,
  children: [
    {
      index: true,
      element: <Suspense fallback={<Loading />}><SuaPagina /></Suspense>
    }
  ]
},
```

### Passo 3: Verificar Resultado
Execute novamente o build e confirme que o arquivo HTML agora tem o tamanho esperado com conteúdo completo.

## Considerações Importantes

1. **CourseLayout vs Layout**: O `CourseLayout` é mais simples e otimizado para SSG, enquanto o `Layout` contém mais componentes dinâmicos que podem causar problemas na renderização estática.

2. **Suspense é Importante**: Mantenha o componente `Suspense` com fallback para garantir boa experiência durante o carregamento.

3. **Ordem das Rotas**: Mantenha as rotas com `CourseLayout` antes das rotas com `Layout` para evitar conflitos.

4. **Teste Sempre**: Após fazer mudanças, sempre execute o build completo para verificar se a solução funcionou.

## Aplicações Futuras

Esta solução pode ser aplicada a qualquer página que apresente problemas similares de renderização SSG. O padrão é:

1. Identificar páginas com arquivos HTML pequenos
2. Mover do `Layout` para `CourseLayout`
3. Verificar se a renderização ficou correta
4. Confirmar que a funcionalidade da página não foi afetada

---

**Data da Solução**: 2025-01-19
**Páginas Corrigidas**: Home, Informatica, Projetista 3D
**Resultado**: 100% das páginas problemáticas agora renderizam corretamente com SSG