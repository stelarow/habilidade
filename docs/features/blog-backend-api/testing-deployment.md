# Testing and Deployment - Blog Backend API

## Testing Strategy

### 1. Unit Testing

#### API Route Testing with Jest

```typescript
// __tests__/api/blog/posts.test.ts
import { NextRequest } from 'next/server'
import { GET } from '../../../src/app/api/blog/posts/route'
import { createMockSupabaseClient } from '../../mocks/supabase'

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: () => createMockSupabaseClient()
}))

describe('/api/blog/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return paginated posts with default parameters', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        excerpt: 'Test excerpt',
        status: 'published',
        published_at: '2025-01-01T00:00:00Z',
        view_count: 10,
        author: { id: '1', full_name: 'John Doe' },
        category: { id: '1', name: 'Tech', slug: 'tech', color_theme: '#000' }
      }
    ]

    const mockSupabase = createMockSupabaseClient()
    mockSupabase.from().select().eq().not().lte().order().range.mockResolvedValue({
      data: mockPosts,
      error: null
    })

    const request = new NextRequest('http://localhost:3000/api/blog/posts')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.posts).toHaveLength(1)
    expect(data.posts[0]).toMatchObject({
      id: '1',
      title: 'Test Post',
      slug: 'test-post'
    })
    expect(data.pagination).toBeDefined()
    expect(data.meta).toBeDefined()
  })

  test('should handle search parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/blog/posts?search=test')
    const response = await GET(request)

    expect(response.status).toBe(200)
    // Verify search was applied to Supabase query
  })

  test('should handle category filter', async () => {
    const request = new NextRequest('http://localhost:3000/api/blog/posts?category=tech')
    const response = await GET(request)

    expect(response.status).toBe(200)
    // Verify category filter was applied
  })

  test('should return 400 for invalid parameters', async () => {
    const request = new NextRequest('http://localhost:3000/api/blog/posts?page=-1')
    const response = await GET(request)

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('VALIDATION_ERROR')
  })

  test('should return 503 for database errors', async () => {
    const mockSupabase = createMockSupabaseClient()
    mockSupabase.from().select().eq().not().lte().order().range.mockRejectedValue(
      new Error('Database connection failed')
    )

    const request = new NextRequest('http://localhost:3000/api/blog/posts')
    const response = await GET(request)

    expect(response.status).toBe(503)
    const data = await response.json()
    expect(data.error).toBe('DATABASE_ERROR')
  })
})
```

#### Utility Function Testing

```typescript
// __tests__/utils/blogUtils.test.ts
import {
  buildOrderClause,
  calculatePagination,
  isPublicPost,
  extractBlogQuery
} from '../../src/app/api/blog/utils'

describe('Blog Utils', () => {
  describe('buildOrderClause', () => {
    test('should return correct order for newest', () => {
      expect(buildOrderClause('newest')).toBe('published_at DESC')
    })

    test('should return correct order for popular', () => {
      expect(buildOrderClause('popular')).toBe('view_count DESC, published_at DESC')
    })

    test('should default to newest for invalid sort', () => {
      expect(buildOrderClause('invalid')).toBe('published_at DESC')
    })
  })

  describe('calculatePagination', () => {
    test('should calculate pagination correctly', () => {
      const pagination = calculatePagination(2, 25, 10)
      
      expect(pagination).toEqual({
        current_page: 2,
        total_pages: 3,
        total_posts: 25,
        per_page: 10,
        has_next: true,
        has_prev: true
      })
    })

    test('should handle edge cases', () => {
      const pagination = calculatePagination(1, 0, 10)
      
      expect(pagination).toEqual({
        current_page: 1,
        total_pages: 0,
        total_posts: 0,
        per_page: 10,
        has_next: false,
        has_prev: false
      })
    })
  })

  describe('isPublicPost', () => {
    test('should return true for published post', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString()
      expect(isPublicPost('published', pastDate)).toBe(true)
    })

    test('should return false for future published post', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString()
      expect(isPublicPost('published', futureDate)).toBe(false)
    })

    test('should return false for draft post', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString()
      expect(isPublicPost('draft', pastDate)).toBe(false)
    })
  })
})
```

#### Performance Testing

```typescript
// __tests__/performance/cache.test.ts
import { blogCache, performanceMonitor } from '../../src/lib/blog/performance'

describe('Blog Performance', () => {
  beforeEach(() => {
    blogCache.clear()
    performanceMonitor.clearMetrics()
  })

  describe('BlogAPICache', () => {
    test('should cache and retrieve data', () => {
      const testData = { id: '1', title: 'Test' }
      blogCache.set('test-key', testData, 1000)
      
      const retrieved = blogCache.get('test-key')
      expect(retrieved).toEqual(testData)
    })

    test('should expire old entries', async () => {
      const testData = { id: '1', title: 'Test' }
      blogCache.set('test-key', testData, 100) // 100ms TTL
      
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const retrieved = blogCache.get('test-key')
      expect(retrieved).toBeNull()
    })

    test('should handle cache size limits', () => {
      // Fill cache beyond limit
      for (let i = 0; i < 150; i++) {
        blogCache.set(`key-${i}`, { data: i }, 10000)
      }
      
      const stats = blogCache.getStats()
      expect(stats.totalEntries).toBeLessThanOrEqual(100)
    })
  })

  describe('PerformanceMonitor', () => {
    test('should record metrics', () => {
      performanceMonitor.recordMetric({
        responseTime: 150,
        cacheHit: false,
        queryCount: 2,
        dataSize: 1024,
        timestamp: new Date().toISOString(),
        endpoint: '/api/blog/posts',
        requestId: 'test-123'
      })

      const avgTime = performanceMonitor.getAverageResponseTime()
      expect(avgTime).toBe(150)
    })

    test('should alert on slow responses', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      performanceMonitor.recordMetric({
        responseTime: 250, // > 200ms threshold
        cacheHit: false,
        queryCount: 1,
        dataSize: 512,
        timestamp: new Date().toISOString(),
        endpoint: '/api/blog/posts',
        requestId: 'test-slow'
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Slow response detected')
      )
      
      consoleSpy.mockRestore()
    })
  })
})
```

### 2. Integration Testing

#### API Integration Tests with Playwright

```typescript
// tests/integration/blog-api.spec.ts
import { test, expect } from '@playwright/test'

const API_BASE = process.env.TEST_API_URL || 'http://localhost:3000/api/blog'

test.describe('Blog API Integration', () => {
  test('should fetch posts list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts`)
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('posts')
    expect(data).toHaveProperty('pagination')
    expect(data).toHaveProperty('meta')
    expect(Array.isArray(data.posts)).toBe(true)
  })

  test('should respect pagination', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts?page=1&limit=5`)
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.posts.length).toBeLessThanOrEqual(5)
    expect(data.pagination.current_page).toBe(1)
    expect(data.pagination.per_page).toBe(5)
  })

  test('should filter by category', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts?category=design`)
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    if (data.posts.length > 0) {
      data.posts.forEach(post => {
        expect(post.category?.slug).toBe('design')
      })
    }
  })

  test('should search posts', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts?search=design`)
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    if (data.posts.length > 0) {
      data.posts.forEach(post => {
        const content = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase()
        expect(content).toContain('design')
      })
    }
  })

  test('should fetch single post', async ({ request }) => {
    // First get a post slug
    const listResponse = await request.get(`${API_BASE}/posts?limit=1`)
    const listData = await listResponse.json()
    
    if (listData.posts.length > 0) {
      const slug = listData.posts[0].slug
      
      const response = await request.get(`${API_BASE}/posts/${slug}`)
      expect(response.status()).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('post')
      expect(data).toHaveProperty('meta')
      expect(data.post.slug).toBe(slug)
    }
  })

  test('should return 404 for non-existent post', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts/non-existent-post`)
    
    expect(response.status()).toBe(404)
    
    const data = await response.json()
    expect(data.error).toBe('POST_NOT_FOUND')
  })

  test('should fetch categories', async ({ request }) => {
    const response = await request.get(`${API_BASE}/categories`)
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('categories')
    expect(data).toHaveProperty('meta')
    expect(Array.isArray(data.categories)).toBe(true)
  })

  test('should generate sitemap', async ({ request }) => {
    const response = await request.get(`${API_BASE}/sitemap`)
    
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('xml')
    
    const xmlContent = await response.text()
    expect(xmlContent).toContain('<?xml version="1.0"')
    expect(xmlContent).toContain('<urlset')
    expect(xmlContent).toContain('</urlset>')
  })
})
```

#### CORS Testing

```typescript
// tests/integration/cors.spec.ts
import { test, expect } from '@playwright/test'

const API_BASE = process.env.TEST_API_URL || 'http://localhost:3000/api/blog'

test.describe('CORS Configuration', () => {
  test('should allow requests from main site', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts`, {
      headers: {
        'Origin': 'https://www.escolahabilidade.com.br'
      }
    })
    
    expect(response.status()).toBe(200)
    expect(response.headers()['access-control-allow-origin'])
      .toBe('https://www.escolahabilidade.com.br')
  })

  test('should handle preflight requests', async ({ request }) => {
    const response = await request.fetch(`${API_BASE}/posts`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://www.escolahabilidade.com.br',
        'Access-Control-Request-Method': 'GET'
      }
    })
    
    expect(response.status()).toBe(200)
    expect(response.headers()['access-control-allow-methods']).toContain('GET')
    expect(response.headers()['access-control-allow-origin'])
      .toBe('https://www.escolahabilidade.com.br')
  })

  test('should reject unauthorized origins in production', async ({ request }) => {
    // Skip if in development mode
    if (process.env.NODE_ENV === 'development') {
      test.skip()
    }

    const response = await request.get(`${API_BASE}/posts`, {
      headers: {
        'Origin': 'https://malicious-site.com'
      }
    })
    
    expect(response.headers()['access-control-allow-origin']).toBeUndefined()
  })
})
```

#### Rate Limiting Tests

```typescript
// tests/integration/rate-limiting.spec.ts
import { test, expect } from '@playwright/test'

const API_BASE = process.env.TEST_API_URL || 'http://localhost:3000/api/blog'

test.describe('Rate Limiting', () => {
  test('should apply rate limiting', async ({ request }) => {
    const requests = []
    
    // Make 65 rapid requests (limit is 60/min)
    for (let i = 0; i < 65; i++) {
      requests.push(request.get(`${API_BASE}/posts`))
    }
    
    const responses = await Promise.all(requests)
    
    // Check if some requests were rate limited
    const rateLimitedResponses = responses.filter(r => r.status() === 429)
    expect(rateLimitedResponses.length).toBeGreaterThan(0)
    
    // Check rate limit headers on successful response
    const successfulResponse = responses.find(r => r.status() === 200)
    if (successfulResponse) {
      expect(successfulResponse.headers()['x-ratelimit-limit']).toBe('60')
      expect(successfulResponse.headers()['x-ratelimit-remaining']).toBeDefined()
    }
    
    // Check rate limit error format
    if (rateLimitedResponses.length > 0) {
      const errorData = await rateLimitedResponses[0].json()
      expect(errorData.error).toBe('RATE_LIMIT_EXCEEDED')
      expect(errorData.retry_after).toBeDefined()
    }
  })
})
```

### 3. Performance Testing

#### Load Testing with Artillery

```yaml
# artillery/blog-api-load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  variables:
    categories:
      - "design"
      - "tecnologia"
      - "carreira"
      - "educacao"
    searchTerms:
      - "design"
      - "javascript"
      - "carreira"
      - "curso"

scenarios:
  - name: "Blog API Load Test"
    weight: 100
    requests:
      # Posts listing (70% of traffic)
      - get:
          url: "/api/blog/posts?page={{ $randomInt(1, 5) }}&limit=10"
          weight: 40
      - get:
          url: "/api/blog/posts?category={{ categories[$randomInt(0, 3)] }}&page={{ $randomInt(1, 3) }}"
          weight: 20
      - get:
          url: "/api/blog/posts?search={{ searchTerms[$randomInt(0, 3)] }}"
          weight: 10
      
      # Single post (25% of traffic)
      - get:
          url: "/api/blog/posts/{{ $randomString() }}"
          weight: 25
          expect:
            - statusCode: [200, 404]
      
      # Categories (3% of traffic)
      - get:
          url: "/api/blog/categories"
          weight: 3
      
      # Sitemap (2% of traffic)
      - get:
          url: "/api/blog/sitemap"
          weight: 2

  - name: "Cache Performance Test"
    weight: 30
    requests:
      # Repeated requests to test cache hit rate
      - get:
          url: "/api/blog/posts?page=1&limit=10"
      - get:
          url: "/api/blog/categories"
```

#### Performance Benchmarking

```typescript
// scripts/performance-benchmark.ts
import fetch from 'node-fetch'

interface BenchmarkResult {
  endpoint: string
  avgResponseTime: number
  minResponseTime: number
  maxResponseTime: number
  successRate: number
  requestsPerSecond: number
}

async function benchmarkEndpoint(
  url: string, 
  requests: number = 100,
  concurrency: number = 10
): Promise<BenchmarkResult> {
  const results: number[] = []
  const errors: number = 0
  const startTime = Date.now()

  const promises = []
  for (let i = 0; i < requests; i++) {
    promises.push(
      fetch(url)
        .then(response => {
          const responseTime = Date.now()
          if (response.ok) {
            results.push(responseTime)
          }
          return response.ok
        })
        .catch(() => false)
    )

    // Control concurrency
    if (promises.length >= concurrency) {
      await Promise.all(promises.splice(0, concurrency))
    }
  }

  // Wait for remaining requests
  await Promise.all(promises)

  const totalTime = Date.now() - startTime
  const responseTimes = results.map((endTime, index) => 
    endTime - startTime - (index * (totalTime / requests))
  )

  return {
    endpoint: url,
    avgResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
    minResponseTime: Math.min(...responseTimes),
    maxResponseTime: Math.max(...responseTimes),
    successRate: (results.length / requests) * 100,
    requestsPerSecond: requests / (totalTime / 1000)
  }
}

async function runBenchmarks() {
  const baseUrl = process.env.API_BASE || 'http://localhost:3000/api/blog'
  
  const endpoints = [
    `${baseUrl}/posts`,
    `${baseUrl}/posts?category=design`,
    `${baseUrl}/posts?search=design`,
    `${baseUrl}/categories`,
    `${baseUrl}/sitemap`
  ]

  console.log('🚀 Starting API Performance Benchmarks...\n')

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint}`)
    
    try {
      const result = await benchmarkEndpoint(endpoint, 50, 5)
      
      console.log(`  ✅ Success Rate: ${result.successRate.toFixed(1)}%`)
      console.log(`  ⚡ Avg Response: ${result.avgResponseTime.toFixed(0)}ms`)
      console.log(`  📊 Min/Max: ${result.minResponseTime.toFixed(0)}ms / ${result.maxResponseTime.toFixed(0)}ms`)
      console.log(`  🔄 RPS: ${result.requestsPerSecond.toFixed(1)}\n`)
      
      // Alert if performance is below threshold
      if (result.avgResponseTime > 200) {
        console.log(`  ⚠️  WARNING: Average response time exceeds 200ms threshold`)
      }
      if (result.successRate < 99) {
        console.log(`  ⚠️  WARNING: Success rate below 99%`)
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`)
    }
  }
}

// Run benchmarks
runBenchmarks().catch(console.error)
```

## Deployment

### 1. Environment Configuration

#### Production Environment Variables

```bash
# .env.production
NODE_ENV=production

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.escolahabilidade.com.br

# Optional: External Services
SENTRY_DSN=https://your-sentry-dsn
REDIS_URL=redis://your-redis-url
```

#### Staging Environment Variables

```bash
# .env.staging
NODE_ENV=production

# Supabase Staging
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key

# Staging Site
NEXT_PUBLIC_SITE_URL=https://staging.escolahabilidade.com.br
```

### 2. Vercel Deployment

#### Project Configuration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "plataforma-ensino/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/blog/(.*)",
      "dest": "/plataforma-ensino/api/blog/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "functions": {
    "plataforma-ensino/src/app/api/blog/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

#### Deployment Script

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Starting deployment process..."

# Environment check
if [ "$NODE_ENV" != "production" ]; then
    echo "❌ NODE_ENV must be set to 'production'"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd plataforma-ensino
npm ci --production

# Run tests
echo "🧪 Running tests..."
npm run test

# Build application
echo "🏗️  Building application..."
npm run build

# Run post-build checks
echo "✅ Running post-build checks..."
npm run test:api

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!"
```

### 3. Database Migration

#### Migration Scripts

```sql
-- migrations/001_blog_schema.sql
-- Apply the complete blog schema
\i database/blog-schema.sql

-- migrations/002_performance_indexes.sql
-- Additional performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_published_performance 
    ON blog_posts(status, published_at DESC, view_count DESC)
    WHERE status = 'published' AND published_at <= NOW();

-- migrations/003_audit_tables.sql
-- Add audit logging
CREATE TABLE IF NOT EXISTS blog_audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    operation TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

#### Migration Runner

```typescript
// scripts/migrate.ts
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../migrations')
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()

  console.log(`Found ${migrationFiles.length} migration files`)

  for (const file of migrationFiles) {
    console.log(`Running migration: ${file}`)
    
    const sqlContent = fs.readFileSync(
      path.join(migrationsDir, file), 
      'utf-8'
    )
    
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: sqlContent 
      })
      
      if (error) {
        throw error
      }
      
      console.log(`✅ Migration ${file} completed`)
    } catch (error) {
      console.error(`❌ Migration ${file} failed:`, error)
      process.exit(1)
    }
  }
  
  console.log('🎉 All migrations completed successfully')
}

runMigrations().catch(console.error)
```

### 4. Health Checks

#### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { getBlogSupabaseClient } from '../blog/utils'

export async function GET() {
  const startTime = Date.now()
  const checks = {
    database: false,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || 'unknown'
  }

  try {
    // Database connectivity check
    const supabase = await getBlogSupabaseClient()
    const { error } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1)
      .single()

    checks.database = !error || error.message.includes('JSON object requested')

    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: checks.database ? 'healthy' : 'unhealthy',
      checks,
      responseTime: `${responseTime}ms`
    }, {
      status: checks.database ? 200 : 503
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      checks,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${Date.now() - startTime}ms`
    }, {
      status: 503
    })
  }
}
```

#### Monitoring Setup

```typescript
// scripts/monitor.ts
import fetch from 'node-fetch'

interface HealthCheck {
  endpoint: string
  expectedStatus: number
  timeout: number
}

const HEALTH_CHECKS: HealthCheck[] = [
  {
    endpoint: 'https://plataforma.escolahabilidade.com/api/health',
    expectedStatus: 200,
    timeout: 5000
  },
  {
    endpoint: 'https://plataforma.escolahabilidade.com/api/blog/posts',
    expectedStatus: 200,
    timeout: 10000
  }
]

async function runHealthCheck(check: HealthCheck): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), check.timeout)

    const response = await fetch(check.endpoint, {
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    return response.status === check.expectedStatus
  } catch (error) {
    console.error(`Health check failed for ${check.endpoint}:`, error.message)
    return false
  }
}

async function monitorHealth() {
  console.log('🏥 Running health checks...')

  const results = await Promise.all(
    HEALTH_CHECKS.map(async check => ({
      endpoint: check.endpoint,
      healthy: await runHealthCheck(check)
    }))
  )

  const allHealthy = results.every(result => result.healthy)

  if (allHealthy) {
    console.log('✅ All health checks passed')
  } else {
    console.log('❌ Some health checks failed:')
    results.forEach(result => {
      console.log(`  ${result.endpoint}: ${result.healthy ? '✅' : '❌'}`)
    })
  }

  return allHealthy
}

// Run monitoring
if (require.main === module) {
  monitorHealth()
    .then(healthy => process.exit(healthy ? 0 : 1))
    .catch(error => {
      console.error('Monitor error:', error)
      process.exit(1)
    })
}
```

### 5. CI/CD Pipeline

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Blog API

on:
  push:
    branches: [main]
    paths: ['plataforma-ensino/**']
  pull_request:
    branches: [main]
    paths: ['plataforma-ensino/**']

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: plataforma-ensino/package-lock.json
      
      - name: Install dependencies
        run: |
          cd plataforma-ensino
          npm ci
      
      - name: Run linting
        run: |
          cd plataforma-ensino
          npm run lint
      
      - name: Run unit tests
        run: |
          cd plataforma-ensino
          npm run test
        env:
          NODE_ENV: test
      
      - name: Run build
        run: |
          cd plataforma-ensino
          npm run build
        env:
          NODE_ENV: production
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

  integration-test:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: plataforma-ensino/package-lock.json
      
      - name: Install dependencies
        run: |
          cd plataforma-ensino
          npm ci
      
      - name: Start application
        run: |
          cd plataforma-ensino
          npm run build
          npm run start &
          sleep 10
        env:
          NODE_ENV: production
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_STAGING_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_STAGING_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_STAGING_SERVICE_KEY }}
      
      - name: Run integration tests
        run: |
          cd plataforma-ensino
          npx playwright test
        env:
          TEST_API_URL: http://localhost:3000/api/blog

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: plataforma-ensino
          vercel-args: '--prod'
      
      - name: Run post-deployment health check
        run: |
          sleep 30
          curl -f https://plataforma.escolahabilidade.com/api/health || exit 1
          curl -f https://plataforma.escolahabilidade.com/api/blog/posts || exit 1
```

### 6. Rollback Strategy

#### Rollback Script

```bash
#!/bin/bash
# scripts/rollback.sh

set -e

DEPLOYMENT_ID=$1

if [ -z "$DEPLOYMENT_ID" ]; then
    echo "Usage: ./rollback.sh <deployment-id>"
    echo "Get deployment ID from: vercel ls"
    exit 1
fi

echo "🔄 Rolling back to deployment: $DEPLOYMENT_ID"

# Promote previous deployment
vercel promote $DEPLOYMENT_ID

# Verify rollback
echo "✅ Verifying rollback..."
sleep 10

# Health check
curl -f https://plataforma.escolahabilidade.com/api/health

echo "✅ Rollback completed successfully"
```

#### Blue-Green Deployment

```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

set -e

# Deploy to staging environment first
echo "🔵 Deploying to staging (blue)..."
vercel --env staging

# Run comprehensive tests against staging
echo "🧪 Running tests against staging..."
TEST_API_URL=https://staging.escolahabilidade.com/api/blog npm run test:integration

# If tests pass, promote to production
echo "🟢 Promoting to production (green)..."
vercel promote $(vercel ls --scope team --meta staging=true -j | jq -r '.[0].uid')

# Final health check
echo "✅ Final health check..."
curl -f https://plataforma.escolahabilidade.com/api/health

echo "🎉 Blue-green deployment completed!"
```

Esta documentação de testing e deployment fornece uma estratégia completa para garantir a qualidade e confiabilidade do Blog Backend API em produção.