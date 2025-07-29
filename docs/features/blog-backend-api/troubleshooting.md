# Troubleshooting Guide - Blog Backend API

## Common Issues and Solutions

### 1. API Connectivity Issues

#### Issue: "Database connection failed"

**Symptoms:**
```json
{
  "error": "DATABASE_ERROR",
  "message": "Unable to connect to database",
  "code": 503
}
```

**Possible Causes:**
- Invalid Supabase credentials
- Network connectivity issues
- Supabase project paused/inactive
- RLS policies blocking access

**Solutions:**

1. **Verify Environment Variables**
```bash
# Check if all required env vars are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
echo $SUPABASE_SERVICE_ROLE_KEY

# Verify format
# URL should be: https://your-project.supabase.co
# Keys should be long base64 strings
```

2. **Test Database Connection**
```typescript
// Test connection manually
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1)
      .single()
    
    console.log('Connection test:', { data, error })
  } catch (err) {
    console.error('Connection failed:', err)
  }
}

testConnection()
```

3. **Check Supabase Project Status**
```bash
# Login to Supabase dashboard
# Verify project is active and not paused
# Check billing status
```

4. **Verify RLS Policies**
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'blog_%';

-- Check policies
SELECT * FROM pg_policies 
WHERE tablename LIKE 'blog_%';
```

#### Issue: "CORS policy error"

**Symptoms:**
- Browser console errors about CORS
- Requests blocked in browser dev tools
- API works in Postman but not in browser

**Solutions:**

1. **Verify Origin Configuration**
```typescript
// middleware.ts - Check allowed origins
const allowedOrigins = [
  'https://www.escolahabilidade.com.br',
  'https://escolahabilidade.com.br',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null
].filter(Boolean)

console.log('Allowed origins:', allowedOrigins)
console.log('Request origin:', request.headers.get('origin'))
```

2. **Check Request Headers**
```javascript
// In browser console
fetch('/api/blog/posts', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}).then(response => {
  console.log('CORS headers:', {
    'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
    'access-control-allow-methods': response.headers.get('access-control-allow-methods')
  })
})
```

3. **Debug CORS in Development**
```bash
# Add debug logging
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:3000/api/blog/posts
```

### 2. Performance Issues

#### Issue: Slow Response Times (>200ms)

**Symptoms:**
- Console warnings about slow responses
- High response times in monitoring
- Poor user experience

**Diagnosis:**

1. **Check Performance Metrics**
```typescript
// Get performance report
import { getBlogAPIPerformanceReport } from '@/lib/blog/performance'

const report = getBlogAPIPerformanceReport()
console.log('Performance Report:', report)

// Check specific endpoint performance
console.log('Posts endpoint avg:', 
  report.performance.endpointStats['/api/blog/posts']?.averageResponseTime
)
```

2. **Analyze Database Performance**
```sql
-- Check query performance
EXPLAIN ANALYZE 
SELECT bp.*, bc.name as category_name, u.full_name as author_name
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN users u ON bp.author_id = u.id
WHERE bp.status = 'published'
  AND bp.published_at <= NOW()
ORDER BY bp.published_at DESC
LIMIT 10;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename LIKE 'blog_%'
ORDER BY idx_tup_read DESC;
```

**Solutions:**

1. **Optimize Database Queries**
```sql
-- Ensure proper indexes exist
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_published_optimized
    ON blog_posts(status, published_at DESC)
    WHERE status = 'published' AND published_at <= NOW();

-- Update table statistics
ANALYZE blog_posts;
ANALYZE blog_categories;
```

2. **Improve Cache Hit Rate**
```typescript
// Increase cache TTL for stable data
blogCache.set('categories:all', categories, 30 * 60 * 1000) // 30 minutes

// Pre-warm cache for popular content
const popularPosts = await blogAPI.getPosts({ sort: 'popular', limit: 20 })
blogCache.set('posts:popular', popularPosts, 10 * 60 * 1000)
```

3. **Connection Pool Optimization**
```typescript
// Use connection pooling in production
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: { 'x-my-custom-header': 'blog-api' },
  },
})
```

#### Issue: High Memory Usage

**Symptoms:**
- Out of memory errors
- Slow garbage collection
- Cache growing unbounded

**Solutions:**

1. **Monitor Cache Size**
```typescript
// Add cache monitoring
const stats = blogCache.getStats()
console.log('Cache stats:', {
  entries: stats.totalEntries,
  hitRate: stats.hitRate,
  expiredCount: stats.expiredCount
})

// Alert if cache is growing too large
if (stats.totalEntries > 150) {
  console.warn('Cache size exceeding limit, forcing cleanup')
  blogCache.clear()
}
```

2. **Implement Cache Cleanup**
```typescript
// Aggressive cleanup for memory pressure
class BlogAPICache {
  private cleanup(): void {
    const now = Date.now()
    let cleanedCount = 0
    const entries = Array.from(this.cache.entries())
    
    // Remove expired entries first
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        cleanedCount++
      }
    }
    
    // If still too large, remove least recently used
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const sortedEntries = entries
        .filter(([key]) => this.cache.has(key))
        .sort(([,a], [,b]) => a.hits - b.hits)
      
      const toRemove = this.cache.size - this.MAX_CACHE_SIZE
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(sortedEntries[i][0])
        cleanedCount++
      }
    }
    
    console.log(`Cache cleanup: removed ${cleanedCount} entries`)
  }
}
```

### 3. Rate Limiting Issues

#### Issue: "Rate limit exceeded" errors

**Symptoms:**
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests, please try again later",
  "code": 429,
  "retry_after": 30
}
```

**Diagnosis:**

1. **Check Rate Limit Headers**
```bash
curl -I http://localhost:3000/api/blog/posts

# Look for:
# X-RateLimit-Limit: 60
# X-RateLimit-Remaining: 45
# X-RateLimit-Reset: 1706453400
```

2. **Identify Request Sources**
```typescript
// Add IP tracking in middleware
console.log('Rate limit check:', {
  ip: request.headers.get('x-forwarded-for'),
  userAgent: request.headers.get('user-agent'),
  origin: request.headers.get('origin')
})
```

**Solutions:**

1. **Implement Client-Side Rate Limiting**
```typescript
// Client-side request throttling
class ThrottledAPI {
  private requestQueue: Promise<any>[] = []
  private readonly maxConcurrent = 5
  private readonly delayBetweenRequests = 100

  async request(url: string, options?: RequestInit) {
    // Wait if too many concurrent requests
    if (this.requestQueue.length >= this.maxConcurrent) {
      await Promise.race(this.requestQueue)
    }

    const requestPromise = this.makeRequest(url, options)
    this.requestQueue.push(requestPromise)
    
    // Clean up completed requests
    requestPromise.finally(() => {
      const index = this.requestQueue.indexOf(requestPromise)
      if (index > -1) {
        this.requestQueue.splice(index, 1)
      }
    })

    return requestPromise
  }

  private async makeRequest(url: string, options?: RequestInit) {
    await new Promise(resolve => setTimeout(resolve, this.delayBetweenRequests))
    
    const response = await fetch(url, options)
    
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60')
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
      return this.makeRequest(url, options) // Retry
    }
    
    return response
  }
}
```

2. **Adjust Rate Limits**
```typescript
// Increase limits for trusted sources
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000,
  maxRequests: process.env.NODE_ENV === 'development' ? 200 : 60,
  keyGenerator: (request: NextRequest) => {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const origin = request.headers.get('origin')
    
    // More lenient for main site
    if (origin === 'https://www.escolahabilidade.com.br') {
      return `trusted:${forwarded || realIp || 'unknown'}`
    }
    
    return forwarded?.split(',')[0] || realIp || 'unknown'
  }
}
```

### 4. Data Issues

#### Issue: "Post not found" for existing posts

**Symptoms:**
- 404 errors for posts that exist in database
- Inconsistent availability of posts

**Diagnosis:**

1. **Check Post Status**
```sql
-- Verify post exists and is published
SELECT id, title, slug, status, published_at, created_at
FROM blog_posts 
WHERE slug = 'your-post-slug';

-- Check if published_at is in future
SELECT slug, published_at, NOW(), 
       CASE WHEN published_at <= NOW() THEN 'visible' ELSE 'future' END as visibility
FROM blog_posts 
WHERE slug = 'your-post-slug';
```

2. **Verify RLS Policies**
```sql
-- Test policy directly
SELECT * FROM blog_posts 
WHERE slug = 'your-post-slug'
  AND status = 'published'
  AND published_at IS NOT NULL
  AND published_at <= NOW();
```

**Solutions:**

1. **Fix Published Date Issues**
```sql
-- Update posts with future dates
UPDATE blog_posts 
SET published_at = NOW()
WHERE status = 'published' 
  AND published_at > NOW();
```

2. **Add Debug Logging**
```typescript
// Add detailed logging in API route
console.log('Post query details:', {
  slug: validatedParams.slug,
  currentTime: new Date().toISOString(),
  query: {
    status: 'published',
    published_at_not_null: true,
    published_at_lte_now: true
  }
})

const { data: post, error: postError } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('slug', validatedParams.slug)
  .eq('status', 'published')
  .not('published_at', 'is', null)
  .lte('published_at', new Date().toISOString())
  .single()

console.log('Query result:', { post: !!post, error: postError })
```

#### Issue: Inconsistent category data

**Symptoms:**
- Missing category information in API responses
- Broken category filters

**Solutions:**

1. **Fix Missing Category Relationships**
```sql
-- Find posts without categories
SELECT id, title, category_id 
FROM blog_posts 
WHERE category_id IS NULL;

-- Assign default category
UPDATE blog_posts 
SET category_id = (
  SELECT id FROM blog_categories 
  WHERE slug = 'geral' 
  LIMIT 1
)
WHERE category_id IS NULL;
```

2. **Verify Join Queries**
```typescript
// Test category join manually
const { data, error } = await supabase
  .from('blog_posts')
  .select(`
    id, title, slug,
    category:blog_categories(id, name, slug, color_theme)
  `)
  .eq('status', 'published')
  .limit(1)

console.log('Category join test:', { data, error })
```

### 5. Caching Issues

#### Issue: Stale cache data

**Symptoms:**
- Updated posts not appearing immediately
- Old data returned despite recent changes

**Solutions:**

1. **Manual Cache Invalidation**
```typescript
// Clear specific cache entries
blogCache.delete('posts:1:10:all:none:newest')
blogCache.delete('categories:all')

// Clear all cache
blogCache.clear()
```

2. **Implement Cache Invalidation on Updates**
```typescript
// Add to admin post update/create handlers
async function invalidateBlogCache(postId?: string, categorySlug?: string) {
  // Clear general caches
  blogCache.delete('categories:all')
  
  // Clear posts listings
  const cacheKeys = ['newest', 'oldest', 'popular', 'title']
  for (let page = 1; page <= 5; page++) {
    for (const sort of cacheKeys) {
      blogCache.delete(`posts:${page}:10:all:none:${sort}`)
      if (categorySlug) {
        blogCache.delete(`posts:${page}:10:${categorySlug}:none:${sort}`)
      }
    }
  }
  
  // Clear specific post if provided
  if (postId) {
    const { data: post } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('id', postId)
      .single()
    
    if (post) {
      blogCache.delete(`post:${post.slug}`)
    }
  }
}
```

### 6. Deployment Issues

#### Issue: Environment variables not loading

**Symptoms:**
- "undefined" values in environment variables
- Different behavior between local and production

**Solutions:**

1. **Verify Environment Variables**
```bash
# Check Vercel environment variables
vercel env ls

# Test in production
vercel logs --function=/api/blog/posts
```

2. **Add Environment Validation**
```typescript
// Add to API route startup
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

console.log('Environment check passed:', {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
  hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
})
```

## Debugging Tools

### 1. API Testing Script

```bash
#!/bin/bash
# scripts/test-api.sh

BASE_URL=${1:-"http://localhost:3000/api/blog"}

echo "🧪 Testing Blog API at: $BASE_URL"

# Test posts endpoint
echo "Testing posts..."
curl -s "$BASE_URL/posts" | jq '.posts | length'

# Test single post
echo "Testing single post..."
SLUG=$(curl -s "$BASE_URL/posts?limit=1" | jq -r '.posts[0].slug')
if [ "$SLUG" != "null" ]; then
  curl -s "$BASE_URL/posts/$SLUG" | jq '.post.title'
else
  echo "No posts available"
fi

# Test categories
echo "Testing categories..."
curl -s "$BASE_URL/categories" | jq '.categories | length'

# Test CORS
echo "Testing CORS..."
curl -H "Origin: https://www.escolahabilidade.com.br" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     -I "$BASE_URL/posts"

echo "✅ API tests completed"
```

### 2. Performance Monitoring

```typescript
// scripts/monitor-performance.ts
import fetch from 'node-fetch'

async function monitorAPI() {
  const endpoints = [
    '/api/blog/posts',
    '/api/blog/categories',
    '/api/blog/sitemap'
  ]

  const baseUrl = process.env.API_BASE || 'http://localhost:3000'

  console.log('📊 Monitoring API performance...')

  for (const endpoint of endpoints) {
    const startTime = Date.now()
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`)
      const responseTime = Date.now() - startTime
      
      console.log(`${endpoint}: ${response.status} (${responseTime}ms)`)
      
      if (responseTime > 200) {
        console.warn(`⚠️  Slow response: ${endpoint} took ${responseTime}ms`)
      }
      
      if (!response.ok) {
        console.error(`❌ Error: ${endpoint} returned ${response.status}`)
      }
    } catch (error) {
      console.error(`❌ Failed: ${endpoint} - ${error.message}`)
    }
  }
}

// Run every 30 seconds
setInterval(monitorAPI, 30000)
monitorAPI() // Run immediately
```

### 3. Database Diagnostics

```sql
-- scripts/db-diagnostics.sql

-- Check blog tables health
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_rows,
  n_dead_tup as dead_rows
FROM pg_stat_user_tables 
WHERE tablename LIKE 'blog_%'
ORDER BY tablename;

-- Check index effectiveness
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch,
  idx_tup_read + idx_tup_fetch as total_usage
FROM pg_stat_user_indexes 
WHERE tablename LIKE 'blog_%'
ORDER BY total_usage DESC;

-- Find slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements 
WHERE query ILIKE '%blog_%'
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as total_size,
  pg_size_pretty(pg_relation_size(tablename::regclass)) as table_size,
  pg_size_pretty(pg_total_relation_size(tablename::regclass) - pg_relation_size(tablename::regclass)) as index_size
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'blog_%'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

## Prevention Strategies

### 1. Monitoring and Alerts

```typescript
// monitoring/alerts.ts
interface Alert {
  type: 'performance' | 'error' | 'availability'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  data?: any
}

class AlertManager {
  private alerts: Alert[] = []

  alert(alert: Alert) {
    this.alerts.push({
      ...alert,
      timestamp: new Date().toISOString()
    })

    // Log alert
    console.warn(`🚨 ALERT [${alert.severity.toUpperCase()}]:`, alert.message)

    // Send to external monitoring (Sentry, etc.)
    if (alert.severity === 'critical') {
      this.sendCriticalAlert(alert)
    }
  }

  private sendCriticalAlert(alert: Alert) {
    // Integration with external alerting systems
    // Slack, email, PagerDuty, etc.
  }
}

export const alertManager = new AlertManager()

// Usage in API routes
if (responseTime > 1000) {
  alertManager.alert({
    type: 'performance',
    severity: 'high',
    message: `API response time exceeded 1000ms: ${responseTime}ms`,
    data: { endpoint, requestId, responseTime }
  })
}
```

### 2. Health Checks

```typescript
// Add comprehensive health checks
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      cache: checkCache(),
      external: await checkExternalServices()
    }
  }

  const allHealthy = Object.values(health.services).every(service => service.healthy)
  
  return NextResponse.json(health, {
    status: allHealthy ? 200 : 503
  })
}

async function checkDatabase() {
  try {
    const supabase = await getBlogSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1)
      .single()

    return {
      healthy: !error,
      responseTime: '< 50ms',
      details: error ? error.message : 'Connected'
    }
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    }
  }
}
```

Esta documentação de troubleshooting fornece soluções práticas para os problemas mais comuns que podem ocorrer com o Blog Backend API, incluindo ferramentas de diagnóstico e estratégias de prevenção.