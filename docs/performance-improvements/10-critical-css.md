# 10 - Critical CSS

## Objetivo
Implementar CSS crítico inline para melhorar FCP (First Contentful Paint).

## Análise do Problema
Build otimizado usa Beasties (Critters) para gerar CSS crítico, mas pode estar causando problemas de renderização.

## Implementação Segura

### 1. Configuração do Beasties/Critters
**Arquivo**: `vite.config.js` ou plugin separado

```javascript
// Plugin para critical CSS
import { defineConfig } from 'vite';
import critical from 'vite-plugin-critical';

export default defineConfig({
  plugins: [
    // Outros plugins...
    critical({
      // Configuração conservadora
      inline: true,
      extract: false, // NÃO extrair, manter CSS original
      width: 375, // Mobile first
      height: 667,
      penthouse: {
        blockJSRequests: false, // Permitir JS
        timeout: 30000
      }
    })
  ]
});
```

### 2. Implementação Manual (Mais Controle)

```javascript
// build-critical.js
const critical = require('critical');

critical.generate({
  base: 'dist/',
  src: 'index.html',
  target: 'index.html',
  inline: true,
  extract: false, // Manter CSS original
  css: ['dist/assets/css/*.css'],
  dimensions: [
    { width: 375, height: 667 }, // Mobile
    { width: 1920, height: 1080 } // Desktop
  ],
  ignore: {
    atrule: ['@font-face'], // Não inline fonts
    rule: [/\.lazy-/] // Não inline classes lazy
  }
});
```

### 3. CSS Crítico Manual (Mais Seguro)

```html
<!-- index.html -->
<head>
  <!-- CSS Crítico Inline -->
  <style>
    /* Reset e base */
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; }
    
    /* Layout crítico */
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    .hero { min-height: 100vh; display: flex; align-items: center; }
    
    /* Typography crítica */
    h1 { font-size: clamp(2rem, 5vw, 4rem); }
    
    /* Cores principais */
    :root {
      --primary: #3b82f6;
      --text: #1f2937;
      --bg: #ffffff;
    }
    
    /* Loading states */
    .skeleton { background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%); }
  </style>
  
  <!-- CSS principal com preload -->
  <link rel="preload" href="/assets/css/core.css" as="style">
  <link rel="stylesheet" href="/assets/css/core.css">
</head>
```

## Estratégia de CSS Splitting

### 1. Core CSS (Crítico)
```css
/* core.css - Carregado imediatamente */
- Reset/Normalize
- Layout grid/flex
- Typography base
- Cores e variáveis
- Componentes above-the-fold
```

### 2. Components CSS (Async)
```css
/* components.css - Carregado async */
- Componentes específicos
- Animações
- Estados hover/focus
- Componentes below-the-fold
```

### 3. Blog CSS (Lazy)
```css
/* blog.css - Apenas em páginas de blog */
- Prose/Typography
- Syntax highlighting
- Blog-specific components
```

## Implementação com Vite

```javascript
// vite.config.js
build: {
  cssCodeSplit: true, // Habilitar splitting
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        // CSS organizado por tipo
        if (assetInfo.name.endsWith('.css')) {
          // Detectar tipo de CSS
          if (assetInfo.name.includes('core')) {
            return 'assets/css/core-[hash].css';
          }
          if (assetInfo.name.includes('blog')) {
            return 'assets/css/blog-[hash].css';
          }
          return 'assets/css/[name]-[hash].css';
        }
        return 'assets/[ext]/[name]-[hash].[ext]';
      }
    }
  }
}
```

## Validação

### Teste de Renderização
1. Desabilitar JavaScript
2. Verificar se conteúdo crítico aparece
3. Verificar se não há FOUC (Flash of Unstyled Content)

### Métricas
- FCP < 1.5s
- CLS < 0.1
- Tamanho do HTML inline < 50KB

## Problemas Comuns

### 1. CSS Duplicado
**Problema**: CSS crítico e principal duplicados
**Solução**: Usar `extract: true` com cuidado

### 2. FOUC
**Problema**: Flash de conteúdo sem estilo
**Solução**: Aumentar CSS crítico ou usar fade-in

### 3. Especificidade
**Problema**: CSS inline sobrescreve styles
**Solução**: Usar `:where()` para reduzir especificidade

## Rollback
Se critical CSS causar problemas:
1. Remover plugin de critical CSS
2. Voltar para carregamento normal
3. Usar apenas `preload` para otimização