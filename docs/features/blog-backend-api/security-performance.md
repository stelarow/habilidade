# Security and Performance - Blog Backend API

## Security Implementation

### 1. CORS (Cross-Origin Resource Sharing)

#### Configuration
O Blog Backend API implementa uma estratégia rigorosa de CORS para permitir acesso apenas de origens autorizadas.

```typescript
// middleware.ts - CORS Configuration
const allowedOrigins = [
  'https://www.escolahabilidade.com.br',      // Produção principal
  'https://escolahabilidade.com.br',          // Produção alternativa
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,  // Dev principal
  process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5173' : null   // Dev alternativo
].filter(Boolean) as string[]

function applyCORSHeaders(response: NextResponse, origin?: string | null) {
  const requestOrigin = origin || '*'
  const isOriginAllowed = allowedOrigins.includes(requestOrigin) || 
                         process.env.NODE_ENV === 'development'

  if (isOriginAllowed) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin)
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400') // 24 hours
}
```

#### Preflight Handling
```typescript
// utils.ts - CORS Preflight
export function handleCORSPreflight(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 200 })
  return addCORSHeaders(response, request.headers.get('origin') || undefined)
}

// Implementado em todos os endpoints
export async function OPTIONS(request: NextRequest) {
  return handleCORSPreflight(request)
}
```

#### Security Benefits
- **Origin Whitelist**: Apenas domínios específicos podem acessar a API
- **Method Restriction**: Apenas GET e OPTIONS são permitidos
- **Header Control**: Headers específicos são permitidos
- **Cache Control**: Preflight responses são cacheadas por 24h

### 2. Rate Limiting

#### Implementation Strategy
```typescript
// middleware.ts - Rate Limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000,        // 1 minuto
  maxRequests: 60,            // 60 requests/minuto
  keyGenerator: (request: NextRequest) => {
    // Prioridade: X-Forwarded-For → X-Real-IP → 'unknown'
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    return forwarded?.split(',')[0] || realIp || 'unknown'
  }
}

async function applyRateLimit(request: NextRequest, requestId: string): Promise<NextResponse | null> {
  const key = RATE_LIMIT_CONFIG.keyGenerator(request)
  const now = Date.now()
  
  // Cleanup automático de entradas expiradas
  for (const [k, v] of rateLimitStore.entries()) {
    if (now > v.resetTime) {
      rateLimitStore.delete(k)
    }
  }
  
  // Gerenciar contador por IP
  let rateLimitData = rateLimitStore.get(key)
  if (!rateLimitData || now > rateLimitData.resetTime) {
    rateLimitData = {
      count: 0,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    }
  }
  
  rateLimitData.count++
  rateLimitStore.set(key, rateLimitData)
  
  // Verificar se excedeu o limite
  if (rateLimitData.count > RATE_LIMIT_CONFIG.maxRequests) {
    return NextResponse.json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
      code: 429,
      timestamp: new Date().toISOString(),
      retry_after: Math.ceil((rateLimitData.resetTime - now) / 1000)
    }, { 
      status: 429,
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimitData.resetTime.toString(),
        'Retry-After': Math.ceil((rateLimitData.resetTime - now) / 1000).toString()
      }
    })
  }
  
  return null // Rate limit OK
}
```

#### Advanced Features
- **Sliding Window**: Janela deslizante de 60 segundos
- **IP Detection**: Suporte a proxies e load balancers
- **Automatic Cleanup**: Remoção automática de entradas expiradas
- **Informative Headers**: Cliente recebe informações sobre limites
- **Graceful Degradation**: Permite acesso em caso de erro interno

#### Scaling Considerations
```typescript
// Future: Redis-based distributed rate limiting
class DistributedRateLimit {
  private redis: Redis
  
  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl)
  }
  
  async checkLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
    const pipeline = this.redis.pipeline()
    pipeline.incr(key)
    pipeline.expire(key, Math.ceil(windowMs / 1000))
    
    const results = await pipeline.exec()
    const count = results?.[0]?.[1] as number
    
    return count <= limit
  }
}
```

### 3. Input Validation

#### Zod Schema Validation
```typescript
// types.ts - Validation Schemas
import { z } from 'zod'

export const BlogQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  category: z.string().optional(),
  search: z.string().min(1).optional(),
  sort: z.enum(['newest', 'oldest', 'popular', 'title']).default('newest')
})

export const BlogSlugSchema = z.object({
  slug: z.string().min(1).max(255)
})

// Usage in endpoints
const validatedQuery = BlogQuerySchema.parse(queryParams)
const validatedParams = BlogSlugSchema.parse({ slug: params.slug })
```

#### SQL Injection Prevention
```typescript
// Supabase client provides automatic parameterization
const { data, error } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('slug', userProvidedSlug)        // Automatically escaped
  .eq('status', 'published')           // Safe constant
  .lte('published_at', new Date().toISOString()) // Safe method call
```

#### XSS Prevention
```typescript
// Content sanitization (for future HTML content)
import DOMPurify from 'dompurify'

function sanitizeContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'strong', 'em'],
    ALLOWED_ATTR: ['href', 'title']
  })
}
```

### 4. Authentication & Authorization

#### Row Level Security (Database)
```sql
-- Policies implementadas no banco
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (
        status = 'published' 
        AND published_at IS NOT NULL 
        AND published_at <= NOW()
    );

CREATE POLICY "Authors can manage their own blog posts" ON public.blog_posts
    FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

#### Application-Level Validation
```typescript
// utils.ts - Public Post Validation
export function isPublicPost(status: string, publishedAt?: string): boolean {
  return status === 'published' && 
         !!publishedAt && 
         new Date(publishedAt) <= new Date()
}

// Double-check in API endpoints
if (!isPublicPost(post.status, post.published_at)) {
  return createErrorResponse('POST_NOT_FOUND', 'Post not found', 404)
}
```

### 5. Security Headers

#### Comprehensive Header Implementation
```typescript
// middleware.ts - Security Headers
function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'"
  )
}
```

#### Header Explanations
- **X-Content-Type-Options**: Previne MIME type sniffing
- **X-Frame-Options**: Previne clickjacking attacks
- **X-XSS-Protection**: Ativa proteção XSS do browser
- **Referrer-Policy**: Controla informações de referrer
- **Content-Security-Policy**: Política de segurança de conteúdo

### 6. Error Handling Security

#### Information Disclosure Prevention
```typescript
// utils.ts - Secure Error Responses
export function createErrorResponse(
  error: string,
  message: string,
  code: number = 500,
  request_id?: string
): NextResponse<APIError> {
  // Log interno detalhado
  console.error(`[BLOG-API-ERROR] ${request_id || 'unknown'}:`, {
    error, message, code,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'development' ? new Error().stack : undefined
  })

  // Response público sanitizado
  const errorResponse: APIError = {
    error,           // Código controlado
    message,         // Mensagem segura
    code,
    timestamp: new Date().toISOString(),
    request_id       // Para suporte técnico
  }

  return NextResponse.json(errorResponse, { status: code })
}
```

#### Error Classification
```typescript
// Diferentes tipos de erro com mensagens seguras
if (error instanceof Error) {
  if (error.message.includes('validation')) {
    return createErrorResponse(
      'VALIDATION_ERROR',
      'Invalid parameters provided',  // Genérico
      400,
      requestId
    )
  }

  if (error.message.includes('Database connection')) {
    return createErrorResponse(
      'DATABASE_ERROR',
      'Service temporarily unavailable',  // Genérico
      503,
      requestId
    )
  }
}
```

## Performance Optimization

### 1. Caching Strategy

#### Multi-Layer Caching Architecture
```typescript
// performance.ts - In-Memory Cache
class BlogAPICache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_CACHE_SIZE = 100

  set<T>(key: string, data: T, ttl?: number): void {
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanup()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
      hits: 0
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    entry.hits++
    return entry.data
  }
}
```

#### HTTP Cache Headers
```typescript
// types.ts - Cache Configuration
export const CACHE_CONFIG = {
  POSTS_LIST: {
    'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    'CDN-Cache-Control': 'max-age=300'
  },
  SINGLE_POST: {
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
    'CDN-Cache-Control': 'max-age=3600'
  },
  CATEGORIES: {
    'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
    'CDN-Cache-Control': 'max-age=1800'
  },
  SITEMAP: {
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
    'Content-Type': 'application/xml; charset=utf-8'
  }
} as const
```

#### Cache Key Strategy
```typescript
// performance.ts - Intelligent Cache Keys
export const CacheKeys = {
  posts: (page: number, limit: number, category?: string, search?: string, sort?: string) => 
    `posts:${page}:${limit}:${category || 'all'}:${search || 'none'}:${sort || 'newest'}`,
  
  post: (slug: string) => `post:${slug}`,
  
  categories: () => 'categories:all',
  
  postCount: (categoryId?: string) => 
    `count:${categoryId || 'all'}`,
  
  relatedPosts: (categoryId: string, excludePostId: string) =>
    `related:${categoryId}:${excludePostId}`
}
```

### 2. Database Performance

#### Query Optimization
```sql
-- Índice composto otimizado para query principal
CREATE INDEX idx_blog_posts_status_published_at 
    ON blog_posts(status, published_at DESC)
    WHERE status = 'published' AND published_at <= NOW();

-- Índice para busca full-text
CREATE INDEX idx_blog_posts_search 
    ON blog_posts USING gin(
        to_tsvector('portuguese', title || ' ' || excerpt || ' ' || content)
    );

-- Índice para filtro por categoria
CREATE INDEX idx_blog_posts_category_status 
    ON blog_posts(category_id, status, published_at DESC)
    WHERE status = 'published';
```

#### Query Analysis Tools
```typescript
// Performance monitoring with EXPLAIN
const analyzeQuery = async (query: string) => {
  const { data, error } = await supabase.rpc('explain_query', { 
    query_text: query 
  })
  
  console.log('Query Plan:', data)
  return data
}

// Cost-based optimization
const optimizePostsQuery = (filters: any) => {
  let query = supabase.from('blog_posts')
  
  // Apply most selective filters first
  if (filters.category) {
    query = query.eq('category_id', filters.category) // High selectivity
  }
  
  query = query.eq('status', 'published')              // Medium selectivity
  query = query.not('published_at', 'is', null)        // Low selectivity
  query = query.lte('published_at', new Date().toISOString()) // Low selectivity
  
  return query
}
```

#### Connection Optimization
```typescript
// utils.ts - Optimized Supabase Client
export async function getBlogSupabaseClient() {
  try {
    const supabase = createClient()
    
    // Health check with minimal overhead
    const { error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .single()
    
    if (error && !error.message.includes('JSON object requested')) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
    
    return supabase
  } catch (error) {
    console.error('[BLOG-API] Failed to create Supabase client:', error)
    throw error
  }
}
```

### 3. Response Optimization

#### Data Transformation
```typescript
// Efficient data transformation
const transformPosts = (posts: any[]) => {
  return posts.map(post => ({
    ...post,
    // Normalize Supabase array responses to objects
    author: Array.isArray(post.author) ? post.author[0] : post.author,
    category: Array.isArray(post.category) ? post.category[0] : post.category,
    course_cta: Array.isArray(post.course_cta) ? post.course_cta[0] : post.course_cta
  }))
}
```

#### Pagination Optimization
```typescript
// utils.ts - Efficient Pagination
export function calculatePagination(currentPage: number, totalItems: number, perPage: number) {
  const totalPages = Math.ceil(totalItems / perPage)
  
  return {
    current_page: currentPage,
    total_pages: totalPages,
    total_posts: totalItems,
    per_page: perPage,
    has_next: currentPage < totalPages,
    has_prev: currentPage > 1
  }
}

// Range-based queries instead of OFFSET
const { data, error } = await postsQuery
  .range(offset, offset + limit - 1) // More efficient than LIMIT/OFFSET
```

#### Async Operations
```typescript
// Non-blocking view count increment
const incrementViewCount = async (postId: string, viewCount: number) => {
  // Fire and forget - don't block response
  supabase
    .from('blog_posts')
    .update({ view_count: viewCount + 1 })
    .eq('id', postId)
    .then(({ error }) => {
      if (error) {
        console.warn(`Failed to increment view count for ${postId}:`, error)
      }
    })
}
```

### 4. Performance Monitoring

#### Real-time Metrics
```typescript
// performance.ts - Performance Monitoring
interface PerformanceMetrics {
  responseTime: number
  cacheHit: boolean
  queryCount: number
  dataSize: number
  timestamp: string
  endpoint: string
  requestId: string
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric)
    
    // Alert on slow responses
    if (metric.responseTime > 200) {
      console.warn(`[BLOG-PERFORMANCE] Slow response detected:`, {
        endpoint: metric.endpoint,
        responseTime: `${metric.responseTime}ms`,
        requestId: metric.requestId,
        cacheHit: metric.cacheHit
      })
    }
  }
  
  getAverageResponseTime(endpoint?: string): number {
    const filteredMetrics = endpoint 
      ? this.metrics.filter(m => m.endpoint === endpoint)
      : this.metrics

    if (filteredMetrics.length === 0) return 0

    const totalTime = filteredMetrics.reduce((sum, m) => sum + m.responseTime, 0)
    return Math.round(totalTime / filteredMetrics.length)
  }
}
```

#### Performance Reports
```typescript
// performance.ts - Comprehensive Reporting
export function getBlogAPIPerformanceReport() {
  const perfReport = performanceMonitor.getPerformanceReport()
  const cacheStats = blogCache.getStats()
  
  return {
    performance: {
      totalRequests: perfReport.totalRequests,
      averageResponseTime: perfReport.averageResponseTime,
      slowRequests: perfReport.slowRequests,
      endpointStats: perfReport.endpointStats
    },
    cache: {
      totalEntries: cacheStats.totalEntries,
      totalHits: cacheStats.totalHits,
      hitRate: cacheStats.hitRate,
      expiredCount: cacheStats.expiredCount
    },
    recommendations: {
      slowRequests: perfReport.slowRequests > 0 
        ? 'Consider optimizing slow endpoints' 
        : 'Response times look good',
      cacheHitRate: cacheStats.hitRate < 50 
        ? 'Consider increasing cache TTL or improving cache keys' 
        : 'Cache performance is good',
      database: 'Run recommended indexes for optimal performance'
    },
    timestamp: new Date().toISOString()
  }
}
```

### 5. Scaling Considerations

#### Horizontal Scaling
```typescript
// Future: Distributed caching with Redis
class DistributedCache {
  private redis: Redis
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL)
  }
  
  async get(key: string): Promise<any> {
    const cached = await this.redis.get(key)
    return cached ? JSON.parse(cached) : null
  }
  
  async set(key: string, value: any, ttl: number): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value))
  }
  
  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }
}
```

#### Database Scaling
```sql
-- Read replicas for high-read workloads
-- Connection to read replica for GET requests
CREATE ROLE blog_read_only;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO blog_read_only;
GRANT USAGE ON SCHEMA public TO blog_read_only;

-- Partitioning for large datasets
CREATE TABLE blog_posts_2025 PARTITION OF blog_posts
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE blog_posts_2024 PARTITION OF blog_posts
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

#### CDN Integration
```typescript
// Edge caching with Cloudflare Workers
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cache = caches.default
    const cacheKey = new Request(request.url, request)
    
    // Try cache first
    let response = await cache.match(cacheKey)
    
    if (!response) {
      // Fetch from origin
      response = await fetch(request)
      
      // Cache successful responses
      if (response.status === 200) {
        const headers = new Headers(response.headers)
        headers.set('Cache-Control', 'public, max-age=300')
        
        response = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers
        })
        
        await cache.put(cacheKey, response.clone())
      }
    }
    
    return response
  }
}
```

### 6. Monitoring and Alerting

#### Health Checks
```typescript
// Health check endpoint
export async function GET() {
  const startTime = Date.now()
  
  try {
    // Database connectivity
    const supabase = await getBlogSupabaseClient()
    const { error } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1)
      .single()
    
    if (error && !error.message.includes('JSON object requested')) {
      throw new Error('Database health check failed')
    }
    
    // Cache health
    const cacheStats = blogCache.getStats()
    
    // Performance metrics
    const avgResponseTime = performanceMonitor.getAverageResponseTime()
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      cache: {
        entries: cacheStats.totalEntries,
        hitRate: cacheStats.hitRate
      },
      performance: {
        averageResponseTime: avgResponseTime,
        checkDuration: Date.now() - startTime
      }
    }
    
    return NextResponse.json(healthData)
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}
```

#### Error Tracking
```typescript
// Integration with external monitoring
import * as Sentry from '@sentry/nextjs'

export function trackAPIError(error: Error, context: any) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: {
        component: 'blog-api',
        endpoint: context.endpoint
      },
      extra: {
        requestId: context.requestId,
        params: context.params,
        userAgent: context.userAgent
      }
    })
  }
}
```

Esta implementação de segurança e performance fornece uma base robusta e escalável para o Blog Backend API, garantindo alta disponibilidade, segurança rigorosa e performance otimizada.