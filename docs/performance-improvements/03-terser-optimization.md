# 03 - Otimização com Terser

## Objetivo
Configurar compressão e minificação agressiva sem quebrar funcionalidades.

## Configuração Progressiva

### Fase 1: Configuração Básica (Mais Segura)
**Arquivo**: `vite.config.js`

```javascript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: false, // MANTER console inicialmente
      drop_debugger: true,
      unused: true,
      dead_code: true
    },
    mangle: true,
    format: {
      comments: false
    }
  }
}
```

### Fase 2: Remoção Seletiva de Console
```javascript
terserOptions: {
  compress: {
    drop_console: false,
    drop_debugger: true,
    pure_funcs: ['console.debug', 'console.info'], // Remover apenas debug/info
    unused: true,
    dead_code: true
  }
}
```

### Fase 3: Configuração Completa (Após Validação)
```javascript
terserOptions: {
  compress: {
    drop_console: true, // Remover todos os console.log
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.info', 'console.debug'],
    unused: true,
    dead_code: true,
    passes: 2 // Múltiplas passadas para melhor otimização
  },
  mangle: {
    properties: false // NÃO manusear propriedades (pode quebrar)
  },
  format: {
    comments: false,
    beautify: false
  }
}
```

## Pontos de Atenção

### 1. Console.log em Produção
**Problema**: Alguns componentes podem depender de console.log para funcionar
**Solução**: Testar progressivamente a remoção

### 2. Mangle de Propriedades
**Problema**: Pode quebrar objetos e APIs
**Solução**: NUNCA usar `mangle.properties: true`

### 3. Tree Shaking
Adicionar configuração de tree shaking:
```javascript
build: {
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false
  }
}
```

## Validação

### Testes Essenciais
1. **EmailJS**: Enviar email de teste
2. **Blog API**: Carregar artigo
3. **Formulários**: Testar validação
4. **Analytics**: Verificar se eventos disparam

### Verificação de Erros
```javascript
// Adicionar temporariamente no App.jsx
useEffect(() => {
  window.addEventListener('error', (e) => {
    console.error('Global error:', e);
  });
}, []);
```

## Métricas de Sucesso
- Redução de bundle: 10-20%
- Sem erros no console
- Todas funcionalidades operacionais

## Rollback
Se houver problemas:
1. Desabilitar `drop_console`
2. Reduzir agressividade do tree shaking
3. Usar `minify: 'esbuild'` como alternativa