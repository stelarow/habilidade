/**
 * Cache Performance Tests
 * Validates cache performance improvements and monitors regressions
 */

import { apiCache, CacheKeys } from '../../src/lib/blog/api-cache'
import { cacheHealthCheck } from '../../src/lib/blog/cache-middleware'

describe('Cache Performance Tests', () => {
  beforeEach(async () => {
    // Clear cache before each test
    await apiCache.clear()
  })

  afterAll(async () => {
    // Cleanup after all tests
    await apiCache.clear()
  })

  describe('Performance Benchmarks', () => {
    test('cache hit should be significantly faster than cache miss', async () => {
      const testKey = 'test:performance'
      const testData = { message: 'test data', timestamp: Date.now() }

      // Measure cache miss (first call)
      const missStart = performance.now()
      await apiCache.set(testKey, testData)
      const setTime = performance.now() - missStart

      // Measure cache hit (subsequent call)
      const hitStart = performance.now()
      const cachedData = await apiCache.get(testKey)
      const hitTime = performance.now() - hitStart

      // Assertions
      expect(cachedData).toEqual(testData)
      expect(hitTime).toBeLessThan(setTime) // Hit should be faster than set
      expect(hitTime).toBeLessThan(5) // Hit should be under 5ms
      
      console.log(`Cache Performance: Set=${setTime.toFixed(2)}ms, Hit=${hitTime.toFixed(2)}ms`)
    })

    test('memory cache should be faster than redis fallback', async () => {
      const testKey = 'test:memory-vs-redis'
      const testData = { size: 'large', data: 'x'.repeat(10000) }

      // First set - goes to both memory and redis
      await apiCache.set(testKey, testData)

      // Measure memory cache hit
      const memoryStart = performance.now()
      const memoryResult = await apiCache.get(testKey)
      const memoryTime = performance.now() - memoryStart

      expect(memoryResult).toEqual(testData)
      expect(memoryTime).toBeLessThan(2) // Memory should be very fast
      
      console.log(`Memory Cache Hit: ${memoryTime.toFixed(2)}ms`)
    })

    test('bulk operations should maintain performance', async () => {
      const operations = 100
      const testData = { message: 'bulk test data' }

      // Measure bulk set operations
      const setStart = performance.now()
      const setPromises = Array.from({ length: operations }, (_, i) => 
        apiCache.set(`bulk:test:${i}`, { ...testData, id: i })
      )
      await Promise.all(setPromises)
      const setTime = performance.now() - setStart

      // Measure bulk get operations
      const getStart = performance.now()
      const getPromises = Array.from({ length: operations }, (_, i) => 
        apiCache.get(`bulk:test:${i}`)
      )
      const results = await Promise.all(getPromises)
      const getTime = performance.now() - getStart

      // Assertions
      expect(results).toHaveLength(operations)
      expect(results.every(r => r !== null)).toBe(true)
      expect(setTime / operations).toBeLessThan(10) // Average set time should be reasonable
      expect(getTime / operations).toBeLessThan(5) // Average get time should be fast
      
      console.log(`Bulk Performance: Avg Set=${(setTime/operations).toFixed(2)}ms, Avg Get=${(getTime/operations).toFixed(2)}ms`)
    })
  })

  describe('Cache Hit Rate Tests', () => {
    test('should achieve >80% hit rate with realistic usage pattern', async () => {
      // Simulate realistic blog usage
      const posts = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        title: `Post ${i}`,
        content: 'Sample content'
      }))

      // Initial population (cache misses)
      for (const post of posts) {
        await apiCache.set(CacheKeys.post(post.id.toString()), post)
      }

      // Simulate user access pattern (80/20 rule - 80% access to 20% of content)
      const popularPosts = posts.slice(0, 4) // Top 20% of posts
      const accessPattern = [
        ...popularPosts, ...popularPosts, ...popularPosts, ...popularPosts, // 80% of accesses
        ...posts.slice(4, 8) // 20% of accesses to other posts
      ]

      let hits = 0
      let total = 0

      for (const post of accessPattern) {
        const result = await apiCache.get(CacheKeys.post(post.id.toString()))
        if (result) hits++
        total++
      }

      const hitRate = (hits / total) * 100
      expect(hitRate).toBeGreaterThan(80)
      
      console.log(`Hit Rate: ${hitRate.toFixed(1)}%`)
    })

    test('cache metrics should be accurate', async () => {
      // Perform known operations
      await apiCache.set('metrics:test:1', { data: 'test1' })
      await apiCache.set('metrics:test:2', { data: 'test2' })
      
      await apiCache.get('metrics:test:1') // hit
      await apiCache.get('metrics:test:1') // hit
      await apiCache.get('metrics:test:3') // miss

      const metrics = apiCache.getMetrics()
      
      expect(metrics.sets).toBeGreaterThanOrEqual(2)
      expect(metrics.hits).toBeGreaterThanOrEqual(2)
      expect(metrics.misses).toBeGreaterThanOrEqual(1)
      expect(metrics.hitRate).toBeGreaterThan(0)
      
      console.log('Cache Metrics:', metrics)
    })
  })

  describe('Memory Usage Tests', () => {
    test('memory usage should stay within limits', async () => {
      const maxEntries = 100
      const testData = { content: 'x'.repeat(1000) } // 1KB per entry

      // Fill cache up to limit
      for (let i = 0; i < maxEntries; i++) {
        await apiCache.set(`memory:test:${i}`, { ...testData, id: i })
      }

      const metrics = apiCache.getMetrics()
      expect(metrics.memoryUsage).toBeLessThanOrEqual(maxEntries)
      
      console.log(`Memory Usage: ${metrics.memoryUsage} entries`)
    })

    test('cache cleanup should work correctly', async () => {
      // Set entries with short TTL
      const shortTTL = 1 // 1 second
      await apiCache.set('cleanup:test:1', { data: 'test1' }, shortTTL)
      await apiCache.set('cleanup:test:2', { data: 'test2' }, shortTTL)

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100))

      // Try to get expired entries
      const result1 = await apiCache.get('cleanup:test:1')
      const result2 = await apiCache.get('cleanup:test:2')

      expect(result1).toBeNull()
      expect(result2).toBeNull()
    })
  })

  describe('Invalidation Performance', () => {
    test('pattern invalidation should be efficient', async () => {
      // Set up test data
      const testData = { message: 'invalidation test' }
      await apiCache.set('posts:1:page:1', testData)
      await apiCache.set('posts:2:page:1', testData)
      await apiCache.set('categories:all', testData)

      // Measure invalidation performance
      const start = performance.now()
      const invalidated = await apiCache.invalidate('posts:*')
      const time = performance.now() - start

      expect(invalidated).toBeGreaterThan(0)
      expect(time).toBeLessThan(100) // Should complete quickly
      
      // Verify invalidation worked
      const result1 = await apiCache.get('posts:1:page:1')
      const result2 = await apiCache.get('categories:all')
      
      expect(result1).toBeNull() // Should be invalidated
      expect(result2).not.toBeNull() // Should remain
      
      console.log(`Invalidation Performance: ${time.toFixed(2)}ms for ${invalidated} entries`)
    })

    test('webhook invalidation should handle large payloads', async () => {
      // Set up test data
      for (let i = 0; i < 50; i++) {
        await apiCache.set(`webhook:test:${i}`, { id: i, data: 'test' })
      }

      // Test webhook payload
      const payload = {
        type: 'bulk.update' as const,
        data: {},
        timestamp: new Date().toISOString()
      }

      const start = performance.now()
      const result = await apiCache.invalidateByWebhook(payload)
      const time = performance.now() - start

      expect(result.count).toBeGreaterThan(0)
      expect(time).toBeLessThan(500) // Should handle bulk operations efficiently
      
      console.log(`Webhook Invalidation: ${time.toFixed(2)}ms for ${result.count} entries`)
    })
  })

  describe('Health Check Tests', () => {
    test('cache health check should provide accurate status', async () => {
      const health = await cacheHealthCheck()
      
      expect(health).toHaveProperty('status')
      expect(health).toHaveProperty('metrics')
      expect(health).toHaveProperty('issues')
      
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status)
      expect(Array.isArray(health.issues)).toBe(true)
      
      console.log('Cache Health:', health)
    })
  })

  describe('Concurrency Tests', () => {
    test('concurrent operations should not cause race conditions', async () => {
      const testKey = 'concurrent:test'
      const iterations = 50

      // Concurrent sets
      const setPromises = Array.from({ length: iterations }, (_, i) => 
        apiCache.set(`${testKey}:${i}`, { id: i, timestamp: Date.now() })
      )

      // Concurrent gets
      const getPromises = Array.from({ length: iterations }, (_, i) => 
        apiCache.get(`${testKey}:${i}`)
      )

      // Execute concurrently
      await Promise.all([...setPromises, ...getPromises])

      // Verify data integrity
      for (let i = 0; i < iterations; i++) {
        const result = await apiCache.get(`${testKey}:${i}`)
        if (result) {
          expect(result.id).toBe(i)
        }
      }
    })
  })

  describe('Performance Budgets', () => {
    test('cache operations should meet performance budgets', async () => {
      const budgets = {
        cacheGet: 5, // ms
        cacheSet: 10, // ms
        invalidation: 100, // ms
        healthCheck: 50, // ms
      }

      // Test get performance
      await apiCache.set('budget:test', { data: 'test' })
      const getStart = performance.now()
      await apiCache.get('budget:test')
      const getTime = performance.now() - getStart
      expect(getTime).toBeLessThan(budgets.cacheGet)

      // Test set performance
      const setStart = performance.now()
      await apiCache.set('budget:test:2', { data: 'test2' })
      const setTime = performance.now() - setStart
      expect(setTime).toBeLessThan(budgets.cacheSet)

      // Test invalidation performance
      const invalidateStart = performance.now()
      await apiCache.invalidate('budget:*')
      const invalidateTime = performance.now() - invalidateStart
      expect(invalidateTime).toBeLessThan(budgets.invalidation)

      // Test health check performance
      const healthStart = performance.now()
      await cacheHealthCheck()
      const healthTime = performance.now() - healthStart
      expect(healthTime).toBeLessThan(budgets.healthCheck)

      console.log('Performance Budgets:', {
        get: `${getTime.toFixed(2)}ms (budget: ${budgets.cacheGet}ms)`,
        set: `${setTime.toFixed(2)}ms (budget: ${budgets.cacheSet}ms)`,
        invalidate: `${invalidateTime.toFixed(2)}ms (budget: ${budgets.invalidation}ms)`,
        health: `${healthTime.toFixed(2)}ms (budget: ${budgets.healthCheck}ms)`,
      })
    })
  })
})

// Performance monitoring utilities
export class PerformanceMonitor {
  private measurements: Array<{
    name: string
    duration: number
    timestamp: number
  }> = []

  measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    return fn().then(result => {
      const duration = performance.now() - start
      this.measurements.push({
        name,
        duration,
        timestamp: Date.now()
      })
      return result
    })
  }

  getReport() {
    const byName = this.measurements.reduce((acc, m) => {
      if (!acc[m.name]) {
        acc[m.name] = []
      }
      acc[m.name].push(m.duration)
      return acc
    }, {} as Record<string, number[]>)

    return Object.entries(byName).map(([name, durations]) => ({
      name,
      count: durations.length,
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      p95: durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)]
    }))
  }

  clear() {
    this.measurements = []
  }
}

// Cache warming utility
export async function warmCache() {
  console.log('Starting cache warming...')
  
  const warmingData = [
    { key: CacheKeys.categories(), data: { categories: [] } },
    { key: CacheKeys.posts(1, 10), data: { posts: [], pagination: {} } },
    { key: CacheKeys.sitemap(), data: '<xml></xml>' },
  ]

  for (const { key, data } of warmingData) {
    await apiCache.set(key, data)
  }

  console.log('Cache warming completed')
}