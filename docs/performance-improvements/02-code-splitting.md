# 02 - Estratégia de Code Splitting

## Objetivo
Implementar divisão de código eficiente para reduzir o bundle inicial.

## Problema Identificado
Na versão otimizada, o code splitting muito agressivo pode ter quebrado importações dinâmicas.

## Implementação Segura

### 1. Manual Chunks - Configuração Base
**Arquivo**: `vite.config.js`

```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        // 1. React vendor (essencial)
        if (id.includes('node_modules/react/') || 
            id.includes('node_modules/react-dom/')) {
          return 'react-vendor';
        }
        
        // 2. Router separado
        if (id.includes('node_modules/react-router-dom/')) {
          return 'router';
        }
        
        // 3. Bibliotecas pesadas (lazy load)
        if (id.includes('node_modules/html2canvas/') ||
            id.includes('node_modules/jspdf/')) {
          return 'heavy-utils';
        }
        
        // 4. Serviços externos
        if (id.includes('node_modules/@emailjs/')) {
          return 'external-services';
        }
        
        // IMPORTANTE: NÃO dividir marked e highlight.js inicialmente
        // Eles podem ser necessários para renderização do blog
      }
    }
  }
}
```

### 2. Chunks Progressivos
Implementar em fases:

**Fase 1** (Mais segura):
- react-vendor
- router
- heavy-utils

**Fase 2** (Após validação):
- external-services
- ui-icons
- animations

**Fase 3** (Mais agressiva):
- blog-api
- blog-components
- course-components

### 3. Configuração de Nomes Consistentes
```javascript
output: {
  chunkFileNames: 'assets/js/[name]-[hash].js',
  entryFileNames: 'assets/js/[name]-[hash].js',
  assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
}
```

## Validação Crítica

### Teste do Blog
1. Acessar um artigo do blog
2. Verificar se o conteúdo carrega
3. Inspecionar Network tab para chunks carregados
4. Confirmar que `marked` está disponível

### Teste do Teste Vocacional
1. Acessar `/teste-vocacional`
2. Verificar se a página carrega
3. Testar funcionalidade de geração de PDF
4. Confirmar que `jspdf` e `html2canvas` carregam

## Problemas Conhecidos e Soluções

### Problema: "marked is not defined"
**Solução**: Não incluir marked em chunk separado inicialmente

### Problema: Lazy loading quebrado
**Solução**: Verificar importações dinâmicas em:
- `src/main.jsx`
- `src/components/LazyComponents.jsx`

## Rollback
Se houver problemas:
1. Remover configuração `manualChunks`
2. Deixar Vite decidir automaticamente
3. Testar novamente