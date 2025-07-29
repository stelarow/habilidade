/**
 * Advanced API Cache System with Intelligent Invalidation
 * Implements stale-while-revalidate, dual storage, and webhook integration
 */

import Redis from 'ioredis'
import NodeCache from 'node-cache'
import { createHash } from 'crypto'

// Cache Configuration Interface
export interface ApiCacheConfig {
  // TTL configurations by content type (in seconds)
  ttl: {
    posts: number        // 5 minutes default
    post: number         // 1 hour default
    categories: number   // 24 hours default
    sitemap: number      // 6 hours default
  }
  // Memory cache settings
  memory: {
    maxSize: number      // Max entries in memory
    checkPeriod: number  // Cleanup check period in seconds
  }
  // Redis settings (optional)
  redis?: {
    enabled: boolean
    url?: string
    prefix: string
  }
  // Webhook settings
  webhook: {
    secret: string
    enabled: boolean
  }
  // Metrics settings
  metrics: {
    enabled: boolean
    maxEntries: number
  }
}

// Cache entry interface
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
  key: string
  isStale?: boolean
}

// Metrics interface
interface CacheMetrics {
  hits: number
  misses: number
  sets: number
  invalidations: number
  errors: number
  hitRate: number
  averageResponseTime: number
  memoryUsage: number
  redisConnected: boolean
  lastUpdated: string
}

// Background revalidation job interface
interface RevalidationJob {
  key: string
  fetcher: () => Promise<any>
  priority: 'high' | 'medium' | 'low'
  timestamp: number
}

export class ApiCacheManager {
  private config: ApiCacheConfig
  private memoryCache: NodeCache
  private redis: Redis | null = null
  private metrics: CacheMetrics
  private revalidationQueue: Map<string, RevalidationJob> = new Map()
  private isProcessingQueue = false

  constructor(config: Partial<ApiCacheConfig> = {}) {
    // Default configuration
    this.config = {
      ttl: {
        posts: parseInt(process.env.CACHE_TTL_POSTS || '300'), // 5 minutes
        post: parseInt(process.env.CACHE_TTL_POST || '3600'), // 1 hour
        categories: parseInt(process.env.CACHE_TTL_CATEGORIES || '86400'), // 24 hours
        sitemap: parseInt(process.env.CACHE_TTL_SITEMAP || '21600'), // 6 hours
      },
      memory: {
        maxSize: 1000,
        checkPeriod: 600, // 10 minutes
      },
      redis: {
        enabled: !!process.env.REDIS_URL,
        url: process.env.REDIS_URL,
        prefix: 'blog_cache:',
      },
      webhook: {
        secret: process.env.CACHE_WEBHOOK_SECRET || '',
        enabled: process.env.CACHE_WEBHOOK_SECRET ? true : false,
      },
      metrics: {
        enabled: process.env.CACHE_METRICS_ENABLED === 'true',
        maxEntries: 10000,
      },
      ...config,
    }

    // Initialize memory cache
    this.memoryCache = new NodeCache({
      maxKeys: this.config.memory.maxSize,
      checkperiod: this.config.memory.checkPeriod,
      useClones: false, // Better performance
    })

    // Initialize metrics
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      invalidations: 0,
      errors: 0,
      hitRate: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      redisConnected: false,
      lastUpdated: new Date().toISOString(),
    }

    // Initialize Redis if enabled
    this.initializeRedis()

    // Start background queue processor
    this.startQueueProcessor()

    // Setup cleanup handlers
    this.setupCleanupHandlers()

    console.log('[API-CACHE] ApiCacheManager initialized', {
      memoryCache: true,
      redis: this.redis ? 'connected' : 'disabled',
      webhook: this.config.webhook.enabled,
      metrics: this.config.metrics.enabled,
    })
  }

  private async initializeRedis(): Promise<void> {
    if (!this.config.redis?.enabled || !this.config.redis.url) {
      return
    }

    try {
      this.redis = new Redis(this.config.redis.url, {
        retryDelayOnFailover: 100,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      })

      this.redis.on('connect', () => {
        this.metrics.redisConnected = true
        console.log('[API-CACHE] Redis connected successfully')
      })

      this.redis.on('error', (error) => {
        this.metrics.redisConnected = false
        this.metrics.errors++
        console.warn('[API-CACHE] Redis error (falling back to memory):', error.message)
      })

      await this.redis.connect()
    } catch (error) {
      console.warn('[API-CACHE] Failed to connect to Redis, using memory cache only:', error)
      this.redis = null
    }
  }

  /**
   * Get item from cache with stale-while-revalidate support
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const startTime = Date.now()

      // Try memory cache first (fastest)
      const memoryEntry = this.memoryCache.get<CacheEntry<T>>(key)
      if (memoryEntry) {
        memoryEntry.hits++
        this.metrics.hits++
        this.updateMetrics('get', Date.now() - startTime)
        
        console.log(`[API-CACHE] Memory cache hit: ${key}`)
        return memoryEntry.data
      }

      // Try Redis cache
      if (this.redis && this.metrics.redisConnected) {
        try {
          const redisData = await this.redis.get(this.config.redis!.prefix + key)
          if (redisData) {
            const entry: CacheEntry<T> = JSON.parse(redisData)
            entry.hits++
            
            // Store in memory cache for faster access
            this.memoryCache.set(key, entry, Math.max(0, (entry.timestamp + entry.ttl * 1000 - Date.now()) / 1000))
            
            this.metrics.hits++
            this.updateMetrics('get', Date.now() - startTime)
            
            console.log(`[API-CACHE] Redis cache hit: ${key}`)
            return entry.data
          }
        } catch (error) {
          console.warn(`[API-CACHE] Redis get error for key ${key}:`, error)
          this.metrics.errors++
        }
      }

      this.metrics.misses++
      this.updateMetrics('get', Date.now() - startTime)
      
      console.log(`[API-CACHE] Cache miss: ${key}`)
      return null
    } catch (error) {
      console.error(`[API-CACHE] Error getting cache entry ${key}:`, error)
      this.metrics.errors++
      return null
    }
  }

  /**
   * Set item in cache with appropriate TTL
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const startTime = Date.now()
      const cacheEntry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.getTTLForKey(key),
        hits: 0,
        key,
      }

      // Store in memory cache
      this.memoryCache.set(key, cacheEntry, cacheEntry.ttl)

      // Store in Redis if available
      if (this.redis && this.metrics.redisConnected) {
        try {
          await this.redis.setex(
            this.config.redis!.prefix + key,
            cacheEntry.ttl,
            JSON.stringify(cacheEntry)
          )
        } catch (error) {
          console.warn(`[API-CACHE] Redis set error for key ${key}:`, error)
          this.metrics.errors++
        }
      }

      this.metrics.sets++
      this.updateMetrics('set', Date.now() - startTime)
      
      console.log(`[API-CACHE] Cache set: ${key} (TTL: ${cacheEntry.ttl}s)`)
    } catch (error) {
      console.error(`[API-CACHE] Error setting cache entry ${key}:`, error)
      this.metrics.errors++
    }
  }

  /**
   * Get with revalidation - implements stale-while-revalidate
   */
  async getWithRevalidate<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const startTime = Date.now()

    try {
      // Try to get from cache first
      const cached = await this.get<T>(key)
      
      if (cached) {
        // Check if cache entry is stale (past 50% of TTL)
        const entry = this.memoryCache.get<CacheEntry<T>>(key)
        if (entry) {
          const age = Date.now() - entry.timestamp
          const staleThreshold = (entry.ttl * 1000) * 0.5 // 50% of TTL
          
          if (age > staleThreshold) {
            // Queue for background revalidation
            this.queueRevalidation(key, fetcher, 'medium')
            console.log(`[API-CACHE] Serving stale content, queued revalidation: ${key}`)
          }
        }
        
        return cached
      }

      // Cache miss - fetch fresh data
      console.log(`[API-CACHE] Cache miss, fetching fresh data: ${key}`)
      const freshData = await fetcher()
      
      // Cache the fresh data
      await this.set(key, freshData, ttl)
      
      this.updateMetrics('getWithRevalidate', Date.now() - startTime)
      return freshData

    } catch (error) {
      console.error(`[API-CACHE] Error in getWithRevalidate for ${key}:`, error)
      this.metrics.errors++
      
      // Try to return stale data if available
      const staleData = await this.get<T>(key)
      if (staleData) {
        console.log(`[API-CACHE] Returning stale data due to error: ${key}`)
        return staleData
      }
      
      throw error
    }
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidate(pattern: string): Promise<number> {
    try {
      const startTime = Date.now()
      let invalidatedCount = 0

      // Handle wildcards
      const isPattern = pattern.includes('*')
      
      if (isPattern) {
        // Convert pattern to regex
        const regex = new RegExp(pattern.replace(/\*/g, '.*'))
        
        // Invalidate from memory cache
        const memoryKeys = this.memoryCache.keys()
        for (const key of memoryKeys) {
          if (regex.test(key)) {
            this.memoryCache.del(key)
            invalidatedCount++
          }
        }

        // Invalidate from Redis
        if (this.redis && this.metrics.redisConnected) {
          try {
            const redisKeys = await this.redis.keys(this.config.redis!.prefix + pattern)
            if (redisKeys.length > 0) {
              await this.redis.del(...redisKeys)
              invalidatedCount += redisKeys.length
            }
          } catch (error) {
            console.warn('[API-CACHE] Redis pattern invalidation error:', error)
            this.metrics.errors++
          }
        }
      } else {
        // Exact key match
        this.memoryCache.del(pattern)
        if (this.redis && this.metrics.redisConnected) {
          try {
            await this.redis.del(this.config.redis!.prefix + pattern)
          } catch (error) {
            console.warn(`[API-CACHE] Redis del error for key ${pattern}:`, error)
            this.metrics.errors++
          }
        }
        invalidatedCount = 1
      }

      this.metrics.invalidations += invalidatedCount
      this.updateMetrics('invalidate', Date.now() - startTime)
      
      console.log(`[API-CACHE] Invalidated ${invalidatedCount} entries for pattern: ${pattern}`)
      return invalidatedCount
    } catch (error) {
      console.error(`[API-CACHE] Error invalidating pattern ${pattern}:`, error)
      this.metrics.errors++
      return 0
    }
  }

  /**
   * Invalidate cache based on webhook payload
   */
  async invalidateByWebhook(payload: any): Promise<{
    invalidated: string[]
    count: number
  }> {
    const invalidated: string[] = []
    
    try {
      const { type, data } = payload
      
      switch (type) {
        case 'post.created':
        case 'post.updated':
        case 'post.deleted':
          // Invalidate post-specific cache
          if (data.slug) {
            await this.invalidate(`post:${data.slug}`)
            invalidated.push(`post:${data.slug}`)
          }
          // Invalidate posts lists
          await this.invalidate('posts:*')
          invalidated.push('posts:*')
          // Invalidate sitemap
          await this.invalidate('sitemap:*')
          invalidated.push('sitemap:*')
          break

        case 'category.created':
        case 'category.updated':
        case 'category.deleted':
          // Invalidate categories
          await this.invalidate('categories:*')
          invalidated.push('categories:*')
          // Invalidate related posts lists
          await this.invalidate('posts:*')
          invalidated.push('posts:*')
          break

        case 'bulk.update':
          // Clear all blog cache
          await this.invalidate('*')
          invalidated.push('*')
          break

        default:
          console.warn(`[API-CACHE] Unknown webhook type: ${type}`)
      }

      console.log(`[API-CACHE] Webhook invalidation completed:`, {
        type,
        invalidated,
        count: invalidated.length,
      })

      return {
        invalidated,
        count: invalidated.length,
      }
    } catch (error) {
      console.error('[API-CACHE] Webhook invalidation error:', error)
      this.metrics.errors++
      return {
        invalidated: [],
        count: 0,
      }
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    try {
      // Clear memory cache
      this.memoryCache.flushAll()

      // Clear Redis cache
      if (this.redis && this.metrics.redisConnected) {
        try {
          const keys = await this.redis.keys(this.config.redis!.prefix + '*')
          if (keys.length > 0) {
            await this.redis.del(...keys)
          }
        } catch (error) {
          console.warn('[API-CACHE] Redis clear error:', error)
          this.metrics.errors++
        }
      }

      console.log('[API-CACHE] All cache entries cleared')
    } catch (error) {
      console.error('[API-CACHE] Error clearing cache:', error)
      this.metrics.errors++
    }
  }

  /**
   * Get cache statistics and metrics
   */
  getMetrics(): CacheMetrics {
    this.metrics.hitRate = this.metrics.hits + this.metrics.misses > 0 
      ? (this.metrics.hits / (this.metrics.hits + this.metrics.misses)) * 100 
      : 0
    
    this.metrics.memoryUsage = this.memoryCache.keys().length
    this.metrics.lastUpdated = new Date().toISOString()
    
    return { ...this.metrics }
  }

  /**
   * Get cache inspection data
   */
  async inspect(): Promise<{
    memory: Array<{
      key: string
      size: number
      ttl: number
      hits: number
      age: number
    }>
    redis: Array<{
      key: string
      ttl: number
    }>
  }> {
    const memory: any[] = []
    const redis: any[] = []

    // Inspect memory cache
    for (const key of this.memoryCache.keys()) {
      const entry = this.memoryCache.get<CacheEntry<any>>(key)
      if (entry) {
        memory.push({
          key,
          size: JSON.stringify(entry.data).length,
          ttl: Math.max(0, (entry.timestamp + entry.ttl * 1000 - Date.now()) / 1000),
          hits: entry.hits,
          age: (Date.now() - entry.timestamp) / 1000,
        })
      }
    }

    // Inspect Redis cache
    if (this.redis && this.metrics.redisConnected) {
      try {
        const keys = await this.redis.keys(this.config.redis!.prefix + '*')
        for (const key of keys) {
          const ttl = await this.redis.ttl(key)
          redis.push({
            key: key.replace(this.config.redis!.prefix, ''),
            ttl,
          })
        }
      } catch (error) {
        console.warn('[API-CACHE] Redis inspection error:', error)
      }
    }

    return { memory, redis }
  }

  // Private helper methods

  private getTTLForKey(key: string): number {
    if (key.startsWith('posts:')) return this.config.ttl.posts
    if (key.startsWith('post:')) return this.config.ttl.post
    if (key.startsWith('categories:')) return this.config.ttl.categories
    if (key.startsWith('sitemap:')) return this.config.ttl.sitemap
    
    return this.config.ttl.posts // Default
  }

  private queueRevalidation(key: string, fetcher: () => Promise<any>, priority: 'high' | 'medium' | 'low'): void {
    this.revalidationQueue.set(key, {
      key,
      fetcher,
      priority,
      timestamp: Date.now(),
    })
  }

  private async startQueueProcessor(): Promise<void> {
    if (this.isProcessingQueue) return
    
    this.isProcessingQueue = true
    
    const processQueue = async () => {
      if (this.revalidationQueue.size === 0) {
        setTimeout(processQueue, 5000) // Check every 5 seconds
        return
      }

      // Process jobs by priority
      const jobs = Array.from(this.revalidationQueue.values())
        .sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        })

      for (const job of jobs.slice(0, 3)) { // Process max 3 jobs per cycle
        try {
          console.log(`[API-CACHE] Background revalidating: ${job.key}`)
          const freshData = await job.fetcher()
          await this.set(job.key, freshData)
          this.revalidationQueue.delete(job.key)
        } catch (error) {
          console.error(`[API-CACHE] Background revalidation failed for ${job.key}:`, error)
          
          // Remove failed jobs older than 5 minutes
          if (Date.now() - job.timestamp > 5 * 60 * 1000) {
            this.revalidationQueue.delete(job.key)
          }
        }
      }

      setTimeout(processQueue, 2000) // Process every 2 seconds
    }

    processQueue()
  }

  private updateMetrics(operation: string, responseTime: number): void {
    if (!this.config.metrics.enabled) return
    
    // Update average response time
    const totalOps = this.metrics.hits + this.metrics.misses + this.metrics.sets
    this.metrics.averageResponseTime = totalOps > 0 
      ? (this.metrics.averageResponseTime * (totalOps - 1) + responseTime) / totalOps
      : responseTime
  }

  private setupCleanupHandlers(): void {
    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('[API-CACHE] Shutting down gracefully...')
      if (this.redis) {
        await this.redis.quit()
      }
    })

    process.on('SIGINT', async () => {
      console.log('[API-CACHE] Shutting down gracefully...')
      if (this.redis) {
        await this.redis.quit()
      }
    })
  }
}

// Global cache instance
export const apiCache = new ApiCacheManager()

// Utility functions for cache key generation
export const CacheKeys = {
  posts: (page: number, limit: number, category?: string, search?: string, sort?: string) => 
    `posts:${page}:${limit}:${category || 'all'}:${search || 'none'}:${sort || 'newest'}`,
  
  post: (slug: string) => `post:${slug}`,
  
  categories: () => 'categories:all',
  
  sitemap: () => 'sitemap:xml',
  
  postCount: (categoryId?: string) => 
    `count:${categoryId || 'all'}`,
  
  relatedPosts: (categoryId: string, excludePostId: string) =>
    `related:${categoryId}:${excludePostId}`,

  // Pattern helpers for invalidation
  allPosts: () => 'posts:*',
  allCategories: () => 'categories:*',
  allCache: () => '*',
}

// Webhook signature verification
export function verifyWebhookSignature(
  payload: string, 
  signature: string, 
  secret: string
): boolean {
  if (!secret) return false
  
  const expectedSignature = createHash('sha256')
    .update(payload)
    .update(secret)
    .digest('hex')
  
  return signature === `sha256=${expectedSignature}`
}