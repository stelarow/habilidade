// Blog API Performance Monitoring and Optimization

interface PerformanceMetrics {
  responseTime: number
  cacheHit: boolean
  queryCount: number
  dataSize: number
  timestamp: string
  endpoint: string
  requestId: string
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
}

// In-memory cache for frequently accessed data
class BlogAPICache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_CACHE_SIZE = 100

  set<T>(key: string, data: T, ttl?: number): void {
    // Clean up expired entries if cache is getting full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanup()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
      hits: 0
    })

    console.log(`[BLOG-CACHE] Set cache entry: ${key} (TTL: ${ttl || this.DEFAULT_TTL}ms)`)
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      console.log(`[BLOG-CACHE] Cache miss (expired): ${key}`)
      return null
    }

    // Increment hit counter
    entry.hits++
    console.log(`[BLOG-CACHE] Cache hit: ${key} (hits: ${entry.hits})`)
    return entry.data
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      console.log(`[BLOG-CACHE] Deleted cache entry: ${key}`)
    }
    return deleted
  }

  clear(): void {
    const size = this.cache.size
    this.cache.clear()
    console.log(`[BLOG-CACHE] Cleared ${size} cache entries`)
  }

  private cleanup(): void {
    const now = Date.now()
    let cleanedCount = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        cleanedCount++
      }
    }

    console.log(`[BLOG-CACHE] Cleaned up ${cleanedCount} expired entries`)
  }

  getStats() {
    let totalHits = 0
    let expiredCount = 0
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      totalHits += entry.hits
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++
      }
    }

    return {
      totalEntries: this.cache.size,
      totalHits,
      expiredCount,
      hitRate: this.cache.size > 0 ? totalHits / this.cache.size : 0
    }
  }
}

// Global cache instance
export const blogCache = new BlogAPICache()

// Performance metrics collection
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private readonly MAX_METRICS = 1000

  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric)

    // Keep only the last MAX_METRICS entries
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS)
    }

    // Alert on slow responses
    if (metric.responseTime > 200) {
      console.warn(`[BLOG-PERFORMANCE] Slow response detected:`, {
        endpoint: metric.endpoint,
        responseTime: `${metric.responseTime}ms`,
        requestId: metric.requestId,
        cacheHit: metric.cacheHit
      })
    }

    console.log(`[BLOG-PERFORMANCE] ${metric.requestId}:`, {
      endpoint: metric.endpoint,
      responseTime: `${metric.responseTime}ms`,
      cacheHit: metric.cacheHit ? 'HIT' : 'MISS',
      queryCount: metric.queryCount,
      dataSize: `${Math.round(metric.dataSize / 1024)}KB`
    })
  }

  getAverageResponseTime(endpoint?: string): number {
    const filteredMetrics = endpoint 
      ? this.metrics.filter(m => m.endpoint === endpoint)
      : this.metrics

    if (filteredMetrics.length === 0) return 0

    const totalTime = filteredMetrics.reduce((sum, m) => sum + m.responseTime, 0)
    return Math.round(totalTime / filteredMetrics.length)
  }

  getCacheHitRate(endpoint?: string): number {
    const filteredMetrics = endpoint 
      ? this.metrics.filter(m => m.endpoint === endpoint)
      : this.metrics

    if (filteredMetrics.length === 0) return 0

    const cacheHits = filteredMetrics.filter(m => m.cacheHit).length
    return Math.round((cacheHits / filteredMetrics.length) * 100)
  }

  getPerformanceReport(): {
    totalRequests: number
    averageResponseTime: number
    cacheHitRate: number
    slowRequests: number
    endpointStats: Record<string, {
      requests: number
      averageResponseTime: number
      cacheHitRate: number
    }>
  } {
    const totalRequests = this.metrics.length
    const slowRequests = this.metrics.filter(m => m.responseTime > 200).length
    
    // Group by endpoint
    const endpointStats: Record<string, any> = {}
    
    for (const metric of this.metrics) {
      if (!endpointStats[metric.endpoint]) {
        endpointStats[metric.endpoint] = {
          requests: 0,
          totalResponseTime: 0,
          cacheHits: 0
        }
      }
      
      const stats = endpointStats[metric.endpoint]
      stats.requests++
      stats.totalResponseTime += metric.responseTime
      if (metric.cacheHit) stats.cacheHits++
    }

    // Calculate averages
    for (const endpoint in endpointStats) {
      const stats = endpointStats[endpoint]
      stats.averageResponseTime = Math.round(stats.totalResponseTime / stats.requests)
      stats.cacheHitRate = Math.round((stats.cacheHits / stats.requests) * 100)
      delete stats.totalResponseTime
      delete stats.cacheHits
    }

    return {
      totalRequests,
      averageResponseTime: this.getAverageResponseTime(),
      cacheHitRate: this.getCacheHitRate(),
      slowRequests,
      endpointStats
    }
  }

  clearMetrics(): void {
    const count = this.metrics.length
    this.metrics = []
    console.log(`[BLOG-PERFORMANCE] Cleared ${count} performance metrics`)
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Cache key generators
export const CacheKeys = {
  posts: (page: number, limit: number, category?: string, search?: string, sort?: string) => 
    `posts:${page}:${limit}:${category || 'all'}:${search || 'none'}:${sort || 'newest'}`,
  
  post: (slug: string) => `post:${slug}`,
  
  categories: () => 'categories:all',
  
  sitemap: () => 'sitemap:xml',
  
  postCount: (categoryId?: string) => 
    `count:${categoryId || 'all'}`,
  
  relatedPosts: (categoryId: string, excludePostId: string) =>
    `related:${categoryId}:${excludePostId}`
}

// Performance helper functions
export function measurePerformance<T>(
  fn: () => Promise<T>,
  endpoint: string,
  requestId: string,
  queryCount: number = 1
): Promise<T> {
  const startTime = Date.now()
  
  return fn().then(result => {
    const responseTime = Date.now() - startTime
    const dataSize = JSON.stringify(result).length
    
    performanceMonitor.recordMetric({
      responseTime,
      cacheHit: false, // Will be overridden if cache was used
      queryCount,
      dataSize,
      timestamp: new Date().toISOString(),
      endpoint,
      requestId
    })
    
    return result
  })
}

export function recordCacheHit(
  endpoint: string,
  requestId: string,
  dataSize: number
): void {
  performanceMonitor.recordMetric({
    responseTime: 0, // Cache hits are essentially instant
    cacheHit: true,
    queryCount: 0,
    dataSize,
    timestamp: new Date().toISOString(),
    endpoint,
    requestId
  })
}

// Database optimization helpers
export const DatabaseOptimizations = {
  // Suggested indexes for optimal blog query performance
  recommendedIndexes: [
    'CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at ON blog_posts(status, published_at DESC);',
    'CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);',
    'CREATE INDEX IF NOT EXISTS idx_blog_posts_category_status ON blog_posts(category_id, status, published_at DESC);',
    'CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING gin(to_tsvector(\'portuguese\', title || \' \' || excerpt || \' \' || content));',
    'CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);'
  ],

  // Query optimization suggestions
  queryOptimizations: {
    posts: 'Use partial indexes for published posts, avoid SELECT * when possible',
    search: 'Consider implementing full-text search with PostgreSQL tsvector',
    counting: 'Use approximate counts for large datasets with pg_stat_user_tables',
    caching: 'Cache category counts and update them with triggers'
  }
}

// Export performance report function
export function getBlogAPIPerformanceReport() {
  const perfReport = performanceMonitor.getPerformanceReport()
  const cacheStats = blogCache.getStats()
  
  return {
    performance: perfReport,
    cache: cacheStats,
    recommendations: {
      slowRequests: perfReport.slowRequests > 0 ? 'Consider optimizing slow endpoints' : 'Response times look good',
      cacheHitRate: cacheStats.hitRate < 50 ? 'Consider increasing cache TTL or improving cache keys' : 'Cache performance is good',
      database: 'Run recommended indexes for optimal performance'
    },
    timestamp: new Date().toISOString()
  }
}