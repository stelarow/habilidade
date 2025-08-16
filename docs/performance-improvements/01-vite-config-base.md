# 01 - Configurações Básicas do Vite

## Objetivo
Otimizar configurações básicas do Vite sem afetar funcionalidades.

## Mudanças Seguras

### 1. Configuração de Build Target
**Arquivo**: `vite.config.js`

```javascript
build: {
  // Target mais moderno para melhor performance
  target: ['es2020', 'chrome80', 'safari13'],
  
  // Desabilitar source maps em produção
  sourcemap: false,
  
  // CSS code split habilitado
  cssCodeSplit: true,
  
  // Module preload otimizado
  modulePreload: {
    polyfill: false
  }
}
```

### 2. Configuração de CSS
```javascript
css: {
  devSourcemap: false,
  modules: false
}
```

### 3. Configuração de SSR
```javascript
ssr: {
  noExternal: ['phosphor-react']
}
```

### 4. Definições de Produção
```javascript
define: {
  __DEV__: false,
  'process.env.NODE_ENV': JSON.stringify('production')
}
```

## Teste de Validação
1. Build: `npm run build:production`
2. Preview: `npm run preview`
3. Verificar:
   - Console sem erros
   - CSS carregando corretamente
   - Ícones do Phosphor funcionando

## Impacto Esperado
- Redução no tamanho do bundle: ~5-10KB
- Melhoria no tempo de build
- Sem impacto nas funcionalidades

## Rollback
Se houver problemas, reverter o arquivo `vite.config.js` para versão anterior.