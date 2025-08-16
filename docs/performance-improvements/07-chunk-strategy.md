# 07 - Estratégia de Chunks Completa

## Objetivo
Implementar estratégia completa de divisão de chunks para otimização máxima.

## Análise do Build Atual vs Otimizado

### Build Atual (4675010)
- `heavy-utils`: 1,580KB (html2canvas, jspdf, marked)
- `app-utils`: 317KB 
- `ui-icons`: 242KB
- `blog-components`: 214KB

### Build Otimizado (a723251)
- `index`: 1,480KB (problemático - muito grande)
- `react-vendor`: 536KB
- `jspdf`: 511KB (separado)
- `app-utils`: 435KB

## Estratégia Recomendada

### 1. Configuração Progressiva de Chunks

```javascript
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        // FASE 1: Chunks essenciais
        if (id.includes('node_modules/')) {
          // React core - SEMPRE separado
          if (id.includes('/react/') || id.includes('/react-dom/')) {
            return 'react-vendor';
          }
          
          // Router - frequentemente usado
          if (id.includes('/react-router-dom/')) {
            return 'router';
          }
        }
        
        // FASE 2: Bibliotecas pesadas (lazy load)
        if (id.includes('node_modules/')) {
          // PDF generation - usado apenas em teste vocacional
          if (id.includes('/jspdf/')) {
            return 'jspdf';
          }
          
          // Screenshot - usado apenas em teste vocacional
          if (id.includes('/html2canvas/')) {
            return 'html2canvas';
          }
          
          // Markdown - CUIDADO: necessário para blog
          if (id.includes('/marked/')) {
            return 'marked';
          }
          
          // Syntax highlighting
          if (id.includes('/highlight.js/') || 
              id.includes('/prismjs/')) {
            return 'syntax-highlighting';
          }
        }
        
        // FASE 3: Bibliotecas de UI
        if (id.includes('node_modules/')) {
          // Ícones
          if (id.includes('/@phosphor-icons/') ||
              id.includes('/lucide-react/') ||
              id.includes('/react-icons/')) {
            return 'phosphor-icons';
          }
          
          // Animações
          if (id.includes('/framer-motion/')) {
            return 'animations';
          }
          
          // Serviços externos
          if (id.includes('/@emailjs/')) {
            return 'external-services';
          }
        }
        
        // FASE 4: Código da aplicação
        if (!id.includes('node_modules/')) {
          // Blog API e cache
          if (id.includes('/services/blogAPI') ||
              id.includes('/utils/blogCache') ||
              id.includes('/services/cacheService')) {
            return 'blog-api';
          }
          
          // Componentes do blog
          if (id.includes('/components/blog/')) {
            return 'blog-components';
          }
          
          // Componentes do curso
          if (id.includes('/components/course/')) {
            return 'course-components';
          }
          
          // Backgrounds (sempre lazy)
          if (id.includes('/components/backgrounds/')) {
            return 'backgrounds';
          }
          
          // Utils e hooks
          if (id.includes('/hooks/') || 
              id.includes('/utils/')) {
            return 'app-hooks';
          }
        }
      }
    }
  }
}
```

### 2. Configuração de Vendor Chunks

```javascript
// Para evitar o problema do chunk gigante
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        // Vendor chunks explícitos
        'react-vendor': ['react', 'react-dom'],
        'router': ['react-router-dom'],
        'query': ['@tanstack/react-query'],
        'emailjs': ['@emailjs/browser'],
        
        // Chunks pesados para lazy load
        'pdf-generation': ['jspdf', 'html2canvas'],
        'markdown-processing': ['marked'],
        'syntax-highlighting': ['highlight.js'],
      }
    }
  }
}
```

### 3. Problema do Index.js Gigante

**Causa**: Todas as dependências acabam no index quando não há regra específica.

**Solução**:
```javascript
manualChunks(id) {
  // Catch-all para node_modules não categorizados
  if (id.includes('node_modules/')) {
    // Extrair nome do pacote
    const packageName = id.split('node_modules/')[1].split('/')[0];
    
    // Agrupar pacotes menores
    if (['axios', 'dompurify', 'prop-types'].includes(packageName)) {
      return 'vendor-utils';
    }
    
    // Outros vão para vendor-misc
    return 'vendor-misc';
  }
}
```

## Validação de Chunks

### Script de Análise
```javascript
// analyze-chunks.js
const fs = require('fs');
const path = require('path');

const distPath = './dist/assets/js';
const files = fs.readdirSync(distPath);

const chunks = files
  .filter(f => f.endsWith('.js'))
  .map(f => ({
    name: f,
    size: fs.statSync(path.join(distPath, f)).size / 1024
  }))
  .sort((a, b) => b.size - a.size);

console.log('Chunk Analysis:');
chunks.forEach(chunk => {
  const warning = chunk.size > 500 ? ' ⚠️' : '';
  console.log(`${chunk.name}: ${chunk.size.toFixed(2)}KB${warning}`);
});

const total = chunks.reduce((sum, c) => sum + c.size, 0);
console.log(`\nTotal: ${total.toFixed(2)}KB`);
```

## Métricas de Sucesso
- Nenhum chunk > 500KB (exceto vendor legítimo)
- Bundle inicial < 200KB
- Total de JS < 1.5MB
- Chunks bem distribuídos (não concentrados)

## Troubleshooting

### Chunk muito grande
1. Verificar se há import circular
2. Verificar dependências transitivas
3. Usar `rollup-plugin-visualizer` para análise

### Módulo no chunk errado
1. Verificar ordem das regras
2. Adicionar log para debug:
```javascript
manualChunks(id) {
  console.log('Processing:', id);
  // suas regras...
}
```

## Rollback
Se chunks causarem problemas:
1. Voltar para configuração automática do Vite
2. Usar apenas vendor-splitting básico
3. Focar em lazy loading ao invés de chunks