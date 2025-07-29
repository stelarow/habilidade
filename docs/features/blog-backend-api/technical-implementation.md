# Technical Implementation Details - Blog Backend API

## Arquitetura de Software

### Padrões Arquiteturais Implementados

#### 1. API Routes Pattern (Next.js 14)
- **App Router**: Utilização do novo sistema de roteamento do Next.js 14
- **File-based Routing**: Estrutura intuitiva de diretórios
- **Route Handlers**: Implementação de GET/OPTIONS methods
- **Dynamic Routes**: Suporte a parâmetros de rota `[slug]`

#### 2. Repository Pattern
```typescript
// Abstração de acesso a dados via Supabase
const supabase = await getBlogSupabaseClient()
const { data, error } = await supabase
  .from('blog_posts')
  .select('...structured_query...')
  .eq('status', 'published')
```

#### 3. Service Layer Pattern
```typescript
// lib/blog/performance.ts - Serviço especializado
export class BlogAPICache {
  private cache = new Map<string, CacheEntry<any>>()
  // Lógica encapsulada de cache
}
```

#### 4. Factory Pattern
```typescript
// utils.ts - Factory para responses padronizadas
export function createErrorResponse(
  error: string,
  message: string,
  code: number = 500,
  request_id?: string
): NextResponse<APIError>
```

### Design Patterns Utilizados

#### Observer Pattern
- Sistema de logging estruturado
- Monitoramento de performance em tempo real
- Métricas coletadas automaticamente

#### Strategy Pattern
```typescript
// Diferentes estratégias de ordenação
export function buildOrderClause(sort: string): string {
  switch (sort) {
    case 'oldest': return 'published_at ASC'
    case 'popular': return 'view_count DESC, published_at DESC'
    case 'title': return 'title ASC'
    default: return 'published_at DESC'
  }
}
```

#### Singleton Pattern
```typescript
// Cache global compartilhado
export const blogCache = new BlogAPICache()
export const performanceMonitor = new PerformanceMonitor()
```

## Otimizações de Performance

### 1. Database Query Optimization

#### Índices Estratégicos
```sql
-- Índice composto para query principal
CREATE INDEX idx_blog_posts_status_published_at 
ON blog_posts(status, published_at DESC);

-- Índice para busca full-text em português
CREATE INDEX idx_blog_posts_search 
ON blog_posts USING gin(to_tsvector('portuguese', title || ' ' || excerpt || ' ' || content));
```

#### Query Optimization Techniques
- **Selective Fields**: SELECT apenas campos necessários
- **Early Filtering**: Filtros aplicados antes de JOINs
- **Limit/Offset Optimization**: Range queries em vez de OFFSET
- **Join Optimization**: LEFT JOIN com dados relacionados

```typescript
// Exemplo de query otimizada
let postsQuery = supabase
  .from('blog_posts')
  .select(`
    id, title, slug, excerpt, content, status,
    featured_image, seo_title, seo_description,
    author_id, category_id, view_count,
    created_at, updated_at, published_at,
    author:users(id, full_name, avatar_url),
    category:blog_categories(id, name, slug, color_theme),
    course_cta:blog_course_ctas(course_id, course_name, course_slug)
  `)
  .eq('status', 'published')
  .not('published_at', 'is', null)
  .lte('published_at', new Date().toISOString())
```

### 2. Caching Strategy

#### Multi-Layer Caching
1. **HTTP/CDN Cache**: Headers para cache em edge servers
2. **Application Cache**: In-memory cache para dados frequentes
3. **Database Cache**: Supabase connection pooling

#### Cache Key Generation
```typescript
export const CacheKeys = {
  posts: (page: number, limit: number, category?: string, search?: string, sort?: string) => 
    `posts:${page}:${limit}:${category || 'all'}:${search || 'none'}:${sort || 'newest'}`,
  post: (slug: string) => `post:${slug}`,
  categories: () => 'categories:all'
}
```

#### Cache Invalidation Strategy
- **TTL-based**: Expiração automática por tempo
- **Event-based**: Invalidação ao modificar dados
- **Stale-while-revalidate**: Serve stale + atualiza background

### 3. Response Optimization

#### Data Transformation
```typescript
// Normalizaçao de arrays Supabase para objetos
const transformedPost = {
  ...post,
  author: Array.isArray(post.author) ? post.author[0] : post.author,
  category: Array.isArray(post.category) ? post.category[0] : post.category,
  course_cta: Array.isArray(post.course_cta) ? post.course_cta[0] : post.course_cta
}
```

#### Lazy Loading
- **View Count**: Incremento assíncrono (fire-and-forget)
- **Related Posts**: Query opcional, não bloqueia response principal
- **Media URLs**: URLs públicas em vez de paths internos

## Security Implementation

### 1. Input Validation

#### Zod Schema Validation
```typescript
export const BlogQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  category: z.string().optional(),
  search: z.string().min(1).optional(),
  sort: z.enum(['newest', 'oldest', 'popular', 'title']).default('newest')
})
```

#### SQL Injection Prevention
- **Supabase Client**: Prepared statements automáticos
- **Parameterized Queries**: Valores escapados automaticamente
- **Type Safety**: TypeScript previne erros de tipo

### 2. Rate Limiting Implementation

#### In-Memory Store
```typescript
// Rate limiting com cleanup automático
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000,    // 1 minuto
  maxRequests: 60,        // 60 requests/min
  keyGenerator: (request: NextRequest) => {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    return forwarded?.split(',')[0] || realIp || 'unknown'
  }
}
```

#### Distributed Rate Limiting (Future)
- Redis para ambiente distribuído
- Sliding window algorithm
- Per-user e per-IP limits diferenciados

### 3. CORS Security

#### Origin Whitelist
```typescript
const allowedOrigins = [
  'https://www.escolahabilidade.com.br',
  'https://escolahabilidade.com.br',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
  process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5173' : null
].filter(Boolean) as string[]
```

#### Preflight Handling
```typescript
// OPTIONS request handling
export async function OPTIONS(request: NextRequest) {
  return handleCORSPreflight(request)
}
```

### 4. Row Level Security (RLS)

#### Database-Level Security
```sql
-- Policy para acesso público apenas a posts publicados
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
FOR SELECT USING (
  status = 'published' 
  AND published_at IS NOT NULL 
  AND published_at <= NOW()
);
```

#### API-Level Validation
```typescript
// Double-check no código da aplicação
if (!isPublicPost(post.status, post.published_at)) {
  return createErrorResponse('POST_NOT_FOUND', 'Post not found', 404)
}
```

## Error Handling e Resilience

### 1. Graceful Error Handling

#### Error Classification
```typescript
// Tratamento diferenciado por tipo de erro
if (error instanceof Error) {
  if (error.message.includes('validation')) {
    return createErrorResponse('VALIDATION_ERROR', 'Invalid parameters', 400)
  }
  if (error.message.includes('Database connection')) {
    return createErrorResponse('DATABASE_ERROR', 'Unable to connect', 503)
  }
}
```

#### Error Recovery
- **Fallback Responses**: Dados padrão em caso de falhas
- **Partial Failures**: Continua operação mesmo com falhas não-críticas
- **Circuit Breaker**: Implementação futura para falhas recorrentes

### 2. Logging e Monitoring

#### Structured Logging
```typescript
export function logAPIRequest(
  method: string,
  path: string,
  requestId: string,
  startTime: number,
  status: number,
  extraData?: Record<string, any>
) {
  const duration = Date.now() - startTime
  const logData = {
    method, path, requestId,
    duration: `${duration}ms`,
    status, timestamp: new Date().toISOString(),
    ...extraData
  }
  
  if (status >= 400) {
    console.error(`[BLOG-API-ERROR] ${requestId}:`, logData)
  } else {
    console.log(`[BLOG-API] ${requestId}:`, logData)
  }
}
```

#### Performance Monitoring
```typescript
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric)
    
    // Alert para responses lentas
    if (metric.responseTime > 200) {
      console.warn(`[BLOG-PERFORMANCE] Slow response detected:`, {
        endpoint: metric.endpoint,
        responseTime: `${metric.responseTime}ms`,
        requestId: metric.requestId
      })
    }
  }
}
```

## Media Management Integration

### 1. Supabase Storage Integration

#### Upload Pipeline
```typescript
// Upload com variants automáticos
async uploadFile(file: File, onProgress?: (progress: UploadProgress) => void): Promise<MediaFile> {
  // 1. Gerar nome único
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  
  // 2. Upload para storage
  const { data: uploadData, error: uploadError } = await this.supabase.storage
    .from(this.bucketName)
    .upload(filePath, file, { cacheControl: '3600', upsert: false })
  
  // 3. Criar variants se for imagem
  if (file.type.startsWith('image/')) {
    variants = await this.createImageVariants(file, filePath)
  }
  
  // 4. Salvar metadados no banco
  const { data: dbData, error: dbError } = await this.supabase
    .from('blog_media')
    .insert(mediaData)
    .select()
    .single()
}
```

#### Image Processing
```typescript
// Redimensionamento client-side usando Canvas API
private async resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calcular proporções
      let { width, height } = img
      const aspectRatio = width / height
      
      // Redimensionar mantendo proporção
      if (width > height) {
        if (width > maxWidth) {
          width = maxWidth
          height = width / aspectRatio
        }
      } else {
        if (height > maxHeight) {
          height = maxHeight
          width = height * aspectRatio
        }
      }
      
      // Desenhar no canvas redimensionado
      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(resolve, file.type, 0.8)
    }
    
    img.src = URL.createObjectURL(file)
  })
}
```

### 2. Media Optimization

#### Automatic Variants
- **Thumbnail**: 150x150px para previews
- **Medium**: 600x400px para listings
- **Large**: 1200x800px para posts individuais
- **Original**: Preservado para qualidade máxima

#### Metadata Management
```typescript
interface MediaFile {
  id: string
  name: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  alt_text?: string
  width?: number
  height?: number
  variants?: {
    thumbnail?: string
    medium?: string
    large?: string
  }
  created_at: string
  updated_at: string
}
```

## Testing Strategy

### 1. Unit Testing

#### Test Structure
```typescript
// Jest tests para funções utilitárias
describe('Blog API Utils', () => {
  test('buildOrderClause should return correct SQL', () => {
    expect(buildOrderClause('newest')).toBe('published_at DESC')
    expect(buildOrderClause('popular')).toBe('view_count DESC, published_at DESC')
  })
  
  test('calculatePagination should handle edge cases', () => {
    const pagination = calculatePagination(1, 0, 10)
    expect(pagination.total_pages).toBe(0)
    expect(pagination.has_next).toBe(false)
  })
})
```

#### Mock Strategy
```typescript
// Mocking Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({ data: mockData, error: null }))
    }))
  }))
}))
```

### 2. Integration Testing

#### API Endpoint Testing
```typescript
// Playwright E2E tests
test('Blog API should return paginated posts', async ({ request }) => {
  const response = await request.get('/api/blog/posts?page=1&limit=5')
  expect(response.status()).toBe(200)
  
  const data = await response.json()
  expect(data.posts).toHaveLength(5)
  expect(data.pagination.current_page).toBe(1)
})
```

#### CORS Testing
```typescript
test('Blog API should handle CORS correctly', async ({ request }) => {
  const response = await request.fetch('/api/blog/posts', {
    headers: { 'Origin': 'https://www.escolahabilidade.com.br' }
  })
  
  expect(response.headers()['access-control-allow-origin'])
    .toBe('https://www.escolahabilidade.com.br')
})
```

### 3. Performance Testing

#### Load Testing
```typescript
// Artillery.js configuration
{
  "config": {
    "target": "http://localhost:3000",
    "phases": [
      { "duration": 60, "arrivalRate": 10 },
      { "duration": 120, "arrivalRate": 50 }
    ]
  },
  "scenarios": [
    {
      "name": "Blog Posts API",
      "requests": [
        { "get": { "url": "/api/blog/posts" } },
        { "get": { "url": "/api/blog/posts/{{ slug }}" } }
      ]
    }
  ]
}
```

#### Cache Performance Testing
```typescript
// Métricas de cache hit rate
test('Cache should improve response times', async () => {
  // First request (cache miss)
  const start1 = Date.now()
  await fetchBlogPosts()
  const time1 = Date.now() - start1
  
  // Second request (cache hit)
  const start2 = Date.now()
  await fetchBlogPosts()
  const time2 = Date.now() - start2
  
  expect(time2).toBeLessThan(time1 * 0.5) // 50% faster with cache
})
```

## Development Workflow

### 1. Local Development Setup

#### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:5173
```

#### Database Setup
```bash
# 1. Criar projeto Supabase
# 2. Executar schema
psql -h your-host -U postgres -f database/blog-schema.sql

# 3. Verificar políticas RLS
# 4. Inserir dados de teste
```

### 2. Testing Interface

#### Test Page Implementation
```typescript
// pages/test-blog-api.tsx
export default function TestBlogAPI() {
  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const testEndpoint = async (endpoint: string, params: object) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blog/${endpoint}?${new URLSearchParams(params)}`)
      const data = await response.json()
      setPosts(data)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-4">
      <button onClick={() => testEndpoint('posts', { page: 1, limit: 5 })}>
        Test Posts API
      </button>
      {/* Results display */}
    </div>
  )
}
```

### 3. Debugging Tools

#### Request Tracing
```typescript
// Cada request tem um ID único para correlação
const requestId = generateRequestId() // abc123def
console.log(`[BLOG-API] ${requestId}: Processing request`)

// Todos os logs incluem o requestId
console.log(`[BLOG-API] ${requestId}: Query completed in ${duration}ms`)
```

#### Performance Debugging
```typescript
// Performance report detalhado
const report = getBlogAPIPerformanceReport()
console.log('Performance Report:', {
  totalRequests: report.performance.totalRequests,
  averageResponseTime: report.performance.averageResponseTime,
  cacheHitRate: report.cache.hitRate,
  recommendations: report.recommendations
})
```

## Deployment Considerations

### 1. Production Optimization

#### Environment Variables
```bash
# Production
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
NEXT_PUBLIC_SITE_URL=https://www.escolahabilidade.com.br
```

#### Build Optimization
```json
// next.config.js
{
  "experimental": {
    "serverComponentsExternalPackages": ["@supabase/ssr"]
  },
  "images": {
    "domains": ["your-supabase-project.supabase.co"]
  }
}
```

### 2. Monitoring Setup

#### Error Tracking
```typescript
// Sentry integration
if (process.env.NODE_ENV === 'production') {
  Sentry.captureException(error, {
    tags: { component: 'blog-api' },
    extra: { requestId, endpoint, params }
  })
}
```

#### Performance Monitoring
```typescript
// Custom metrics para Vercel Analytics
import { track } from '@vercel/analytics'

track('blog_api_request', {
  endpoint,
  responseTime: duration,
  cacheHit: cacheHit.toString(),
  status: response.status
})
```

### 3. Scaling Considerations

#### Database Scaling
- **Connection Pooling**: Supabase Postgres pooling
- **Read Replicas**: Para high-read workloads
- **Partitioning**: Por data para posts históricos

#### Application Scaling
- **Edge Functions**: Deploying API routes no edge
- **CDN**: Cache de responses em multiple regions
- **Rate Limiting**: Redis distribuído para multi-instance

#### Cache Scaling
```typescript
// Redis implementation para cache distribuído
import Redis from 'ioredis'

class DistributedBlogCache {
  private redis = new Redis(process.env.REDIS_URL)
  
  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key)
    return cached ? JSON.parse(cached) : null
  }
  
  async set<T>(key: string, data: T, ttl: number): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(data))
  }
}
```

## Future Enhancements

### 1. Advanced Features

#### GraphQL Endpoint
```typescript
// Future: GraphQL schema para queries flexíveis
type Query {
  blogPosts(
    first: Int
    after: String
    where: BlogPostFilter
  ): BlogPostConnection
  
  blogPost(slug: String!): BlogPost
}
```

#### Search Enhancement
```typescript
// ElasticSearch integration
import { Client } from '@elastic/elasticsearch'

const searchClient = new Client({
  node: process.env.ELASTICSEARCH_URL
})

const searchPosts = async (query: string) => {
  const result = await searchClient.search({
    index: 'blog_posts',
    body: {
      query: {
        multi_match: {
          query,
          fields: ['title^3', 'excerpt^2', 'content']
        }
      }
    }
  })
  
  return result.body.hits.hits
}
```

### 2. Performance Enhancements

#### Edge Caching
```typescript
// Cloudflare Workers integration
export default {
  async fetch(request: Request, env: Env) {
    const cache = caches.default
    const cacheKey = new Request(request.url, request)
    
    let response = await cache.match(cacheKey)
    if (!response) {
      response = await fetch(request)
      const headers = new Headers(response.headers)
      headers.set('Cache-Control', 'public, max-age=300')
      
      response = new Response(response.body, { headers })
      await cache.put(cacheKey, response.clone())
    }
    
    return response
  }
}
```

#### Database Optimization
```sql
-- Materialized views para agregações
CREATE MATERIALIZED VIEW blog_post_stats AS
SELECT 
  bp.id,
  bp.title,
  bp.view_count,
  bc.name as category_name,
  COUNT(bcc.id) as cta_count
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN blog_course_ctas bcc ON bp.id = bcc.post_id
WHERE bp.status = 'published'
GROUP BY bp.id, bc.name;

-- Refresh automático
CREATE OR REPLACE FUNCTION refresh_blog_stats()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY blog_post_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### 3. Analytics Integration

#### Custom Analytics
```typescript
// Blog analytics tracking
interface BlogAnalytics {
  trackPostView(postId: string, userAgent: string, referrer: string): void
  trackSearchQuery(query: string, resultCount: number): void
  trackCategoryFilter(category: string): void
}

class BlogAnalyticsService implements BlogAnalytics {
  async trackPostView(postId: string, userAgent: string, referrer: string) {
    await this.supabase
      .from('blog_analytics')
      .insert({
        event_type: 'post_view',
        post_id: postId,
        user_agent: userAgent,
        referrer,
        timestamp: new Date().toISOString()
      })
  }
}
```

Esta documentação técnica fornece uma visão completa da implementação, padrões utilizados e considerações para manutenção e evolução do sistema Blog Backend API.