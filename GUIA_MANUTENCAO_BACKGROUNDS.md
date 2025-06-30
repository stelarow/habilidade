# 🔧 GUIA DE MANUTENÇÃO: Sistema de Backgrounds

## 🎯 OVERVIEW TÉCNICO

Este guia destina-se a desenvolvedores que precisam manter, atualizar ou solucionar problemas no sistema de backgrounds únicos.

## 📁 ESTRUTURA DE ARQUIVOS

```
src/
├── components/
│   ├── CourseBackground.jsx           # 🎛️ Orquestrador principal
│   ├── AccessibilityControls.jsx      # ♿ Controles de acessibilidade
│   └── backgrounds/                   # 🎨 Backgrounds individuais
│       ├── BIBackground.jsx
│       ├── DesignGraficoBackground.jsx
│       ├── EdicaoVideoBackground.jsx
│       ├── IABackground.jsx
│       ├── InformaticaBackground.jsx
│       ├── MarketingDigitalBackground.jsx
│       ├── ProgramacaoBackground.jsx
│       └── Projetista3DBackground.jsx
├── hooks/
│   └── usePerformanceLevel.js         # 📊 Detecção de performance
├── utils/
│   ├── backgroundPreloader.js         # 🚀 Sistema de cache/preload
│   └── backgroundTester.js            # 🧪 Testes automatizados
├── types/
│   └── backgrounds.js                 # 📝 Definições de tipos
└── styles/
    └── accessibility.css              # ♿ Estilos de acessibilidade
```

## 🔄 FLUXO DE EXECUÇÃO

### 1. Inicialização
```javascript
// CourseBackground.jsx
useEffect(() => {
  // 1. Detecta performance do dispositivo
  const performance = usePerformanceLevel();
  
  // 2. Carrega background baseado no slug
  const BackgroundComponent = getBackgroundComponent(courseSlug);
  
  // 3. Aplica cache se disponível
  if (backgroundCache.has(courseSlug)) {
    return backgroundCache.get(courseSlug);
  }
  
  // 4. Lazy load do componente
  const component = lazy(() => import(`./backgrounds/${BackgroundComponent}`));
  
  // 5. Salva no cache
  backgroundCache.set(courseSlug, component);
}, [courseSlug]);
```

### 2. Detecção de Performance
```javascript
// usePerformanceLevel.js
const detectPerformanceLevel = () => {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const connection = navigator.connection?.effectiveType || '4g';
  
  if (memory <= 2 || cores <= 2 || connection === 'slow-2g') return 'LOW';
  if (memory <= 4 || cores <= 4 || connection === '3g') return 'MEDIUM';
  return 'HIGH';
};
```

### 3. Renderização Condicional
```javascript
// Background individual
const renderByPerformanceLevel = (level) => {
  switch (level) {
    case 'LOW':
      return <StaticFallback />;
    case 'MEDIUM':
      return <SimpleAnimations />;
    case 'HIGH':
      return <ComplexAnimations />;
  }
};
```

## 🛠️ TAREFAS DE MANUTENÇÃO

### Diárias
- [ ] Verificar logs de erro no console
- [ ] Monitorar métricas de performance
- [ ] Revisar cache hit rates

### Semanais
- [ ] Executar testes automatizados
- [ ] Verificar compatibilidade com novos browsers
- [ ] Analisar feedback de usuários

### Mensais
- [ ] Audit de performance com Lighthouse
- [ ] Limpeza de cache obsoleto
- [ ] Atualização de dependências

### Trimestrais
- [ ] Revisão completa de acessibilidade
- [ ] Benchmark de performance
- [ ] Documentação de mudanças

## 🧪 COMANDOS DE TESTE

### Testes Básicos
```bash
# Testar todos os backgrounds
npm run test:backgrounds

# Resultado esperado:
# ✅ Projetista3DBackground: OK
# ✅ EdicaoVideoBackground: OK 
# ✅ InformaticaBackground: OK
# ✅ DesignGraficoBackground: OK
# ✅ ProgramacaoBackground: OK
# ✅ MarketingDigitalBackground: OK
# ✅ IABackground: OK
# ✅ BIBackground: OK
```

### Testes de Performance
```bash
# Testar performance específica
node src/utils/backgroundTester.js --course=programacao --level=HIGH

# Resultado esperado:
# 📊 Performance Test Results:
# - Load time: 1.2s
# - FPS average: 58fps
# - Memory usage: 45MB
# - Cache hit: true
```

### Debug Mode
```javascript
// Ativar debug no browser
localStorage.setItem('debug-backgrounds', 'true');
console.log('🐛 Debug mode ativado');

// Verificar performance atual
console.log('📊 Performance:', usePerformanceLevel());

// Verificar cache
console.log('🗄️ Cache:', backgroundCache.entries());
```

## 🚨 TROUBLESHOOTING

### Problema: Background não carrega

**Sintomas:**
- Página mostra background vazio
- Console mostra erro de import
- Fallback não aparece

**Diagnóstico:**
```javascript
// 1. Verificar se o arquivo existe
import(`./backgrounds/${courseSlug}Background.jsx`)
  .then(module => console.log('✅ Arquivo encontrado'))
  .catch(err => console.error('❌ Arquivo não encontrado:', err));

// 2. Verificar mapeamento
console.log('🗺️ Mapeamento:', BACKGROUND_COMPONENTS[courseSlug]);

// 3. Verificar cache
console.log('🗄️ Cache:', backgroundCache.get(courseSlug));
```

**Soluções:**
1. Verificar nome do arquivo na pasta `backgrounds/`
2. Confirmar mapeamento em `types/backgrounds.js`
3. Limpar cache: `backgroundCache.clear()`
4. Forçar reload: `window.location.reload()`

### Problema: Performance baixa

**Sintomas:**
- FPS abaixo de 30
- Animações travando
- High CPU usage

**Diagnóstico:**
```javascript
// 1. Verificar performance level
const { level, metrics } = usePerformanceLevel();
console.log('📊 Level:', level, 'Metrics:', metrics);

// 2. Monitor FPS
let fps = 0;
setInterval(() => {
  console.log('🎯 FPS atual:', fps);
  fps = 0;
}, 1000);

requestAnimationFrame(function count() {
  fps++;
  requestAnimationFrame(count);
});

// 3. Verificar memory usage
console.log('💾 Memory:', navigator.deviceMemory + 'GB');
```

**Soluções:**
1. Forçar downgrade: `localStorage.setItem('force-performance-level', 'LOW')`
2. Reduzir animações: `localStorage.setItem('reduce-animations', 'true')`
3. Limpar cache: `backgroundCache.clear()`
4. Otimizar código do background específico

### Problema: Acessibilidade

**Sintomas:**
- Screen reader não funciona
- Controles não respondem
- Alto contraste não aplica

**Diagnóstico:**
```javascript
// 1. Verificar preferências
console.log('♿ Reduced motion:', 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// 2. Verificar controles
console.log('🎛️ Accessibility controls:', 
  document.querySelector('.accessibility-controls'));

// 3. Verificar ARIA
console.log('🏷️ ARIA labels:', 
  document.querySelectorAll('[aria-label]'));
```

**Soluções:**
1. Verificar `AccessibilityControls.jsx`
2. Confirmar `accessibility.css` carregado
3. Testar com screen reader (NVDA/JAWS)
4. Executar audit de acessibilidade

## 📝 LOGS E MONITORAMENTO

### Estrutura de Logs
```javascript
// backgroundPreloader.js
const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    data,
    url: window.location.href,
    userAgent: navigator.userAgent
  };
  
  if (level === 'error') {
    console.error('🚨 Background Error:', logEntry);
  } else if (localStorage.getItem('debug-backgrounds')) {
    console.log('🐛 Background Debug:', logEntry);
  }
};
```

### Métricas Importantes
```javascript
// Métricas a monitorar
const metrics = {
  loadTime: Date.now() - startTime,
  cacheHitRate: cacheHits / totalRequests,
  averageFPS: fpsSum / fpsCount,
  memoryUsage: performance.memory?.usedJSHeapSize || 0,
  errorRate: errors / totalRequests
};
```

## 🔄 ATUALIZAÇÕES E VERSIONAMENTO

### Adicionando Novo Background

1. **Criar arquivo** `src/components/backgrounds/NovoBackground.jsx`
2. **Registrar** em `src/types/backgrounds.js`
3. **Testar** com `npm run test:backgrounds`
4. **Documentar** alterações
5. **Deploy** gradual

### Modificando Background Existente

1. **Backup** da versão atual
2. **Implementar** mudanças
3. **Testar** performance
4. **Verificar** acessibilidade
5. **Commit** com descrição detalhada

### Versionamento
```javascript
// Sempre incrementar versão em package.json
{
  "version": "1.1.0", // Major.Minor.Patch
  "backgroundSystemVersion": "1.0.0"
}
```

## 📋 CHECKLIST PRÉ-DEPLOY

- [ ] Todos os testes passando
- [ ] Performance audit OK (Score > 90)
- [ ] Acessibilidade verificada
- [ ] Cross-browser testado
- [ ] Mobile responsivo
- [ ] Cache configurado
- [ ] Logs implementados
- [ ] Documentação atualizada
- [ ] Backup feito
- [ ] Rollback plan definido

---

**🔧 Para emergências:** Criar issue no GitHub com label `urgent`  
**📞 Suporte:** Consultar DOCUMENTACAO_SISTEMA_BACKGROUNDS.md  
**🐛 Bugs:** Usar template de bug report no repositório 