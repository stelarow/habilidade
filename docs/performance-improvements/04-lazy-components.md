# 04 - Lazy Components

## Objetivo
Implementar lazy loading de componentes sem quebrar funcionalidades críticas.

## Análise do Problema
Na versão otimizada, o lazy loading agressivo pode ter causado:
- Race conditions no carregamento
- Componentes não disponíveis quando necessários
- Problemas com SSG (Static Site Generation)

## Implementação Segura

### 1. Componentes Seguros para Lazy Load
**Arquivo**: `src/components/LazyComponents.jsx`

```javascript
// SEGUROS - Não críticos para renderização inicial
export const LazyShareButtons = lazy(() => import('./blog/ShareButtons.jsx'));
export const LazyTableOfContents = lazy(() => import('./blog/TableOfContents.jsx'));
export const LazyQuickContactModal = lazy(() => import('./blog/QuickContactModal.jsx'));
export const LazySmartImageUpload = lazy(() => import('./SmartImageUpload.jsx'));

// CUIDADO - Podem ser necessários rapidamente
export const LazyContactForm = lazy(() => import('./ContactForm.jsx'));
export const LazyMegaMenu = lazy(() => import('./header/MegaMenu.jsx'));
export const LazyMobileMegaMenu = lazy(() => import('./header/MobileMegaMenu.jsx'));

// EVITAR LAZY - Críticos para funcionalidade
// - BlogTypography (necessário para renderizar posts)
// - AdvancedSearch (pode ser esperado imediatamente)
// - CourseCurriculum (conteúdo principal da página)
```

### 2. Wrapper com Fallback Adequado
```javascript
export const withLazy = (Component, fallback = null) => {
  return React.forwardRef((props, ref) => (
    <Suspense fallback={fallback || <ComponentFallback />}>
      <Component {...props} ref={ref} />
    </Suspense>
  ));
};

// Fallback mínimo para não afetar layout
const ComponentFallback = ({ height = 'auto' }) => (
  <div style={{ minHeight: height }} className="animate-pulse">
    {/* Mínimo possível para não quebrar layout */}
  </div>
);
```

### 3. Preload Estratégico
```javascript
// Em main.jsx ou App.jsx
useEffect(() => {
  // Preload componentes que serão usados em breve
  const preloadTimer = setTimeout(() => {
    import('./components/ContactForm.jsx');
    import('./components/header/MegaMenu.jsx');
  }, 2000); // 2 segundos após carregamento inicial

  return () => clearTimeout(preloadTimer);
}, []);
```

## Componentes Críticos - NÃO Usar Lazy

### Blog
- `BlogContent` - Renderização do conteúdo
- `BlogHeader` - SEO crítico
- `marked` e `highlight.js` - Processamento de markdown

### Teste Vocacional
- Componente principal do teste
- Lógica de cálculo
- Interface de perguntas

### Home
- Hero section
- Componentes above-the-fold

## Estratégia de Migração

### Fase 1: Remover Lazy Loading
1. Desabilitar todos os lazy loads
2. Verificar que tudo funciona
3. Medir performance baseline

### Fase 2: Lazy Loading Seletivo
1. Adicionar lazy apenas para:
   - ShareButtons
   - TableOfContents
   - QuickContactModal
2. Testar funcionalidades
3. Medir impacto

### Fase 3: Expansão Cuidadosa
1. Adicionar mais componentes gradualmente
2. Sempre testar após cada adição
3. Monitorar erros no console

## Validação

### Teste do Blog
```javascript
// Verificar se marked está disponível
console.log('Marked disponível:', typeof marked !== 'undefined');

// Verificar se conteúdo renderiza
const content = document.querySelector('.prose');
console.log('Conteúdo renderizado:', content?.innerHTML.length > 0);
```

### Teste de Componentes Lazy
```javascript
// Adicionar em cada componente lazy
useEffect(() => {
  console.log(`Componente ${componentName} carregado`);
}, []);
```

## Rollback
Se lazy loading causar problemas:
1. Importar todos os componentes estaticamente
2. Remover `Suspense` wrappers
3. Focar otimização em outras áreas