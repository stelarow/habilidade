# Blog Advanced Features Documentation

Este documento descreve os recursos avan�ados implementados para o sistema de blog da Escola Habilidade.

## =� Analytics System (LGPD Compliant)

### Funcionalidades
- **Tracking de Views**: Tempo de perman�ncia e engajamento por post
- **Search Analytics**: Termos mais buscados e performance
- **Social Sharing**: Tracking de compartilhamentos por plataforma
- **Reading Progress**: Scroll depth e marcos de leitura
- **Category Navigation**: Popularidade de categorias

### Conformidade LGPD
- L **Sem dados pessoais**: User Agent sanitizado, sem IPs ou cookies
-  **Consentimento expl�cito**: Sistema opt-in com localStorage
- = **Controle do usu�rio**: Possibilidade de limpar dados a qualquer momento
- =� **Transpar�ncia**: Logs e dados dispon�veis para inspe��o

### Uso

```javascript
import { 
  trackPostView, 
  trackSearch, 
  trackShare,
  setAnalyticsConsent,
  getAnalyticsSummary 
} from '../services/analyticsService';

// Solicitar consentimento
setAnalyticsConsent(true);

// Tracking de eventos
trackPostView('post-slug', 'Post Title', 'category', 5);
trackSearch('javascript', 12, 'programming');
trackShare('twitter', 'post-slug', 'Post Title');

// Visualizar dados (desenvolvimento)
console.log(getAnalyticsSummary());
```

### Configura��o de Produ��o

```bash
# .env
REACT_APP_ANALYTICS_ENABLED=true
REACT_APP_ANALYTICS_ENDPOINT=https://your-analytics-api.com
```

## = Advanced Search System

### Recursos
- **Multi-filtros**: Categorias, autores, tags, tempo de leitura
- **Date Range**: Filtro por per�odo de publica��o
- **URL Persistence**: Filtros mantidos na URL para compartilhamento
- **Keyboard Shortcuts**: Ctrl+K (busca), Ctrl+Shift+F (filtros)
- **Real-time Results**: Busca em tempo real com debouncing

### Componente Principal

```jsx
import AdvancedSearch from './components/blog/AdvancedSearch';

<AdvancedSearch
  onSearch={handleSearch}
  onFiltersChange={handleFiltersChange}
  initialFilters={filtersFromURL}
  expanded={false}
  onExpandedChange={setExpanded}
/>
```

### Estrutura de Filtros

```javascript
const filters = {
  query: 'javascript',
  categories: ['programming', 'tutorial'],
  authors: ['alessandro-ferreira'],
  tags: ['iniciante', 'tutorial'],
  dateRange: {
    start: '2023-01-01',
    end: '2023-12-31'
  },
  readingTime: {
    min: 3,
    max: 7
  }
};
```

### Integra��o com Analytics

```javascript
// Tracking autom�tico de buscas
useEffect(() => {
  if (filters.query && filters.query.length >= 3) {
    trackSearch(filters.query, results.length, filters.categories[0]);
  }
}, [filters.query]);
```

## =� Cache Management System

### Estrat�gias Implementadas

1. **Stale-While-Revalidate**: Para listas de posts
2. **Cache-First**: Para imagens e recursos est�ticos
3. **Network-First**: Para p�ginas individuais
4. **Background Refresh**: Para posts populares

### Configura��o

```javascript
import { createCacheManager } from '../utils/cacheManager';
import { useQueryClient } from '@tanstack/react-query';

// Inicializa��o
const queryClient = useQueryClient();
const cacheManager = createCacheManager(queryClient);

// Invalida��o inteligente
await cacheManager.invalidateByType('posts', {
  force: false,
  tags: ['category:programming']
});

// Warming de cache
await cacheManager.warmCache({
  categories: true,
  popularPosts: true,
  recentPosts: true
});
```

### Service Worker Integration

O sistema utiliza um Service Worker para cache em background:

```javascript
// public/sw-cache.js implementa:
// - Cache autom�tico de recursos est�ticos
// - Stale-while-revalidate para APIs
// - Offline fallbacks
// - Background updates
```

### Monitoramento

```javascript
import { getCacheStats } from '../utils/cacheManager';

const stats = getCacheStats();
console.log('Cache hit rate:', stats.cacheHitRate);
console.log('Memory usage:', stats.memoryUsage);
console.log('Stale queries:', stats.staleQueries);
```

## < Production API Configuration

### Configura��o Robusta

```javascript
// Environment-based URLs with fallbacks
const productionUrls = [
  'https://plataforma.escolahabilidade.com/api',
  'https://api.escolahabilidade.com',
  'https://escolahabilidade.com/api'
];
```

### Retry Logic

- **Automatic retries**: 3 tentativas para erros 5xx
- **Exponential backoff**: Delay crescente entre tentativas
- **Circuit breaker**: Pause ap�s muitas falhas consecutivas

### Enhanced Error Handling

```javascript
const error = {
  type: 'NETWORK_ERROR',
  message: 'N�o foi poss�vel conectar ao servidor.',
  userMessage: 'Servidor temporariamente indispon�vel.',
  retryable: true,
  timestamp: '2024-01-15T10:30:00.000Z',
  requestId: 'req_1705312200000_abc123'
};
```

### Health Checks

```javascript
import { checkBlogAPIHealth } from '../services/blogAPI';

const health = await checkBlogAPIHealth();
if (health.status === 'unhealthy') {
  // Fallback ou notification
}
```

### Environment Variables

```bash
# Configura��o completa no .env
REACT_APP_BLOG_API_URL=https://your-api.com/api
REACT_APP_API_VERSION=v1
REACT_APP_API_MAX_RETRIES=3
REACT_APP_API_RETRY_ENABLED=true
```

## =� Performance Features

### Lazy Loading
- Componentes carregados sob demanda
- Imagens com intersection observer
- Infinite scroll otimizado

### Bundle Optimization
- Code splitting por rotas
- Tree shaking autom�tico
- Compression gzip/brotli

### Memory Management
- Cleanup de event listeners
- Debouncing de inputs
- Query garbage collection

## =' Development Tools

### Debug Mode
```javascript
// Ativar logs detalhados
localStorage.setItem('debug_api', 'true');

// Ver configura��o atual
import { getBlogAPIConfig } from '../services/blogAPI';
console.log(getBlogAPIConfig());
```

### Analytics Dashboard
```javascript
// Console de analytics para desenvolvimento
import { getAnalyticsSummary } from '../services/analyticsService';
console.table(getAnalyticsSummary());
```

### Cache Inspector
```javascript
// Inspe��o de cache
import { getCacheStats } from '../utils/cacheManager';
const stats = getCacheStats();
console.log('Cache Status:', stats);
```

## =� Mobile Optimizations

### Responsive Design
- Filtros adapt�veis em mobile
- Touch-friendly interfaces
- Reduced animations em devices low-end

### Performance
- Smaller bundle size para mobile
- Lazy loading agressivo
- Service Worker otimizado

## = Security Features

### Request Security
- CSRF protection via headers
- Request ID tracking
- Rate limiting awareness

### Data Privacy
- No PII collection
- Local data encryption
- Automatic data expiration

## =� Monitoring & Analytics

### Error Tracking
- Enhanced error context
- Request correlation IDs
- Performance metrics

### User Experience
- Search conversion rates
- Content engagement metrics
- Performance monitoring

## >� Testing Strategy

### Unit Tests
```bash
npm test -- --testPathPattern=blog
```

### Integration Tests
```bash
npm run test:integration -- blog
```

### E2E Tests
```bash
npm run test:e2e -- --spec="blog-advanced.spec.js"
```

## =� Migration Guide

### From Basic to Advanced Search

1. **Install new component**:
```jsx
// Replace basic BlogNavigation with AdvancedSearch
import AdvancedSearch from './components/blog/AdvancedSearch';
```

2. **Update state management**:
```javascript
// Handle complex filter state
const [filters, setFilters] = useState({
  query: '',
  categories: [],
  // ... other filters
});
```

3. **Integrate with URL**:
```javascript
// URL synchronization is built-in
// No additional configuration needed
```

### Analytics Migration

1. **Request user consent**:
```jsx
// Add consent banner
<AnalyticsConsentBanner onAccept={() => setAnalyticsConsent(true)} />
```

2. **Add tracking calls**:
```javascript
// Replace manual tracking with service
trackPostView(slug, title, category, readingTime);
```

## = Maintenance

### Cache Cleanup
```javascript
// Automated cleanup (runs daily)
setInterval(() => {
  cleanupCache({ maxAge: 24 * 60 * 60 * 1000 });
}, 24 * 60 * 60 * 1000);
```

### Analytics Data Management
```javascript
// Clear old analytics data (LGPD compliance)
import { clearAnalyticsData } from '../services/analyticsService';

// Run monthly
clearAnalyticsData();
```

### Health Monitoring
```javascript
// Automated health checks
setInterval(async () => {
  const health = await checkBlogAPIHealth();
  if (health.status === 'unhealthy') {
    // Send notification
  }
}, 5 * 60 * 1000); // Every 5 minutes
```

## =� Support

### Debug Information
Quando reportar problemas, inclua:

```javascript
// Collect debug info
const debugInfo = {
  config: getBlogAPIConfig(),
  cache: getCacheStats(),
  analytics: getAnalyticsSummary(),
  browser: navigator.userAgent,
  timestamp: new Date().toISOString()
};

console.log('Debug Info:', debugInfo);
```

### Common Issues

1. **Analytics n�o tracking**: Verificar consentimento
2. **Cache n�o funcionando**: Verificar Service Worker
3. **API timeouts**: Verificar health checks
4. **Search lenta**: Verificar debouncing settings

### Performance Monitoring

```javascript
// Monitor key metrics
const metrics = {
  searchLatency: performance.measure('search'),
  cacheHitRatio: getCacheStats().cacheHitRate,
  errorRate: getAnalyticsSummary().errorEvents / totalEvents
};
```

---

**�ltima atualiza��o**: Janeiro 2024  
**Vers�o**: 1.0.0  
**Autor**: Equipe Escola Habilidade