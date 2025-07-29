/**
 * Cache Middleware for Next.js API Routes
 * Provides transparent caching layer with stale-while-revalidate
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { apiCache, CacheKeys } from './api-cache'

// Cache configuration per route type
interface CacheConfig {
  ttl: number
  staleWhileRevalidate: number
  cacheHeaders: Record<string, string>
  revalidateInBackground?: boolean
  varyHeaders?: string[]
}

// Route cache configurations
const ROUTE_CACHE_CONFIG: Record<string, CacheConfig> = {
  'posts': {
    ttl: 300, // 5 minutes
    staleWhileRevalidate: 600, // 10 minutes
    cacheHeaders: {
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      'CDN-Cache-Control': 'max-age=300',
    },
    revalidateInBackground: true,
    varyHeaders: ['Accept', 'Authorization'],
  },
  'post': {
    ttl: 3600, // 1 hour
    staleWhileRevalidate: 7200, // 2 hours
    cacheHeaders: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
      'CDN-Cache-Control': 'max-age=3600',
    },
    revalidateInBackground: true,
  },
  'categories': {
    ttl: 1800, // 30 minutes
    staleWhileRevalidate: 3600, // 1 hour
    cacheHeaders: {
      'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
      'CDN-Cache-Control': 'max-age=1800',
    },
    revalidateInBackground: true,
  },
  'sitemap': {
    ttl: 3600, // 1 hour
    staleWhileRevalidate: 7200, // 2 hours
    cacheHeaders: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
      'Content-Type': 'application/xml; charset=utf-8',
    },
    revalidateInBackground: true,
  },
}

// Request context for cache operations
interface CacheContext {
  requestId: string
  cacheKey: string
  config: CacheConfig
  startTime: number
  pathname: string
  searchParams: URLSearchParams
}

// Cache result metadata
interface CacheResult<T> {
  data: T
  fromCache: boolean
  cacheAge?: number
  revalidating?: boolean
}

/**
 * Higher-order function to wrap API routes with caching
 */
export function withApiCache<T = any>(
  routeType: keyof typeof ROUTE_CACHE_CONFIG,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const context = createCacheContext(request, routeType)
    
    try {
      console.log(`[CACHE-MIDDLEWARE] ${context.requestId}: Processing ${routeType} request`, {
        cacheKey: context.cacheKey,
        method: request.method,
        url: context.pathname,
      })

      // Only cache GET requests
      if (request.method !== 'GET') {
        console.log(`[CACHE-MIDDLEWARE] ${context.requestId}: Skipping cache for ${request.method} request`)
        return await handler(request)
      }

      // Try to get cached response
      const cachedResult = await getCachedResponse<T>(context)
      
      if (cachedResult) {
        const response = createCachedResponse(cachedResult, context)
        
        console.log(`[CACHE-MIDDLEWARE] ${context.requestId}: Cache HIT - serving cached response`, {
          cacheAge: cachedResult.cacheAge,
          revalidating: cachedResult.revalidating,
        })
        
        return response
      }

      // Cache miss - execute original handler
      console.log(`[CACHE-MIDDLEWARE] ${context.requestId}: Cache MISS - executing handler`)
      const response = await handler(request)
      
      // Cache successful responses
      if (response.status === 200) {
        await cacheResponse(response, context)
      }

      // Apply cache headers
      applyCacheHeaders(response, context)
      
      console.log(`[CACHE-MIDDLEWARE] ${context.requestId}: Response processed`, {
        status: response.status,
        cached: response.status === 200,
        duration: Date.now() - context.startTime,
      })

      return response

    } catch (error) {
      console.error(`[CACHE-MIDDLEWARE] ${context.requestId}: Error in cache middleware:`, error)
      
      // Try to serve stale content on error
      try {
        const staleContent = await apiCache.get<any>(context.cacheKey)
        if (staleContent) {
          console.log(`[CACHE-MIDDLEWARE] ${context.requestId}: Serving stale content due to error`)
          const staleResponse = NextResponse.json(staleContent)
          applyCacheHeaders(staleResponse, context, true)
          return staleResponse
        }
      } catch (staleError) {
        console.error(`[CACHE-MIDDLEWARE] ${context.requestId}: Failed to serve stale content:`, staleError)
      }
      
      // If all else fails, execute handler without cache
      return await handler(request)
    }
  }
}

/**
 * Generate cache key for request
 */
export function generateCacheKey(request: NextRequest, routeType: string): string {
  const url = new URL(request.url)
  const pathname = url.pathname
  const searchParams = url.searchParams
  
  // Normalize search parameters
  const normalizedParams = new URLSearchParams()
  
  // Sort parameters for consistent keys
  const sortedParams = Array.from(searchParams.entries()).sort(([a], [b]) => a.localeCompare(b))
  sortedParams.forEach(([key, value]) => {
    normalizedParams.set(key, value)
  })
  
  // Create base key from route type and path
  let baseKey = `${routeType}:${pathname.replace('/api/blog/', '')}`
  
  // Add parameters if any
  const paramString = normalizedParams.toString()
  if (paramString) {
    baseKey += `:${createHash('md5').update(paramString).digest('hex').substring(0, 8)}`
  }
  
  // Add user context if needed (for user-specific caching)
  const authHeader = request.headers.get('authorization')
  if (authHeader && routeType === 'post') {
    const userHash = createHash('md5').update(authHeader).digest('hex').substring(0, 8)
    baseKey += `:user:${userHash}`
  }
  
  return baseKey
}

/**
 * Create cache context for request
 */
function createCacheContext(request: NextRequest, routeType: keyof typeof ROUTE_CACHE_CONFIG): CacheContext {
  const url = new URL(request.url)
  const requestId = createHash('md5').update(`${Date.now()}-${Math.random()}`).digest('hex').substring(0, 8)
  const cacheKey = generateCacheKey(request, routeType)
  const config = ROUTE_CACHE_CONFIG[routeType]
  
  return {
    requestId,
    cacheKey,
    config,
    startTime: Date.now(),
    pathname: url.pathname,
    searchParams: url.searchParams,
  }
}

/**
 * Get cached response if available
 */
async function getCachedResponse<T>(context: CacheContext): Promise<CacheResult<T> | null> {
  try {
    // Use stale-while-revalidate for background updates
    if (context.config.revalidateInBackground) {
      const result = await apiCache.getWithRevalidate<T>(
        context.cacheKey,
        // This fetcher won't be used in this context since we're not handling cache miss here
        async () => { throw new Error('Should not be called') },
        context.config.ttl
      )
      
      if (result) {
        return {
          data: result,
          fromCache: true,
          revalidating: false, // getWithRevalidate handles this internally
        }
      }
    } else {
      // Simple cache get
      const result = await apiCache.get<T>(context.cacheKey)
      if (result) {
        return {
          data: result,
          fromCache: true,
        }
      }
    }
    
    return null
  } catch (error) {
    console.error(`[CACHE-MIDDLEWARE] ${context.requestId}: Error getting cached response:`, error)
    return null
  }
}

/**
 * Cache response data
 */
async function cacheResponse(response: NextResponse, context: CacheContext): Promise<void> {
  try {
    // Clone response to read body without consuming it
    const responseClone = response.clone()
    const responseData = await responseClone.json()
    
    // Store in cache
    await apiCache.set(context.cacheKey, responseData, context.config.ttl)
    
    console.log(`[CACHE-MIDDLEWARE] ${context.requestId}: Response cached`, {
      cacheKey: context.cacheKey,
      ttl: context.config.ttl,
      dataSize: JSON.stringify(responseData).length,
    })
  } catch (error) {
    console.error(`[CACHE-MIDDLEWARE] ${context.requestId}: Error caching response:`, error)
  }
}

/**
 * Create response from cached data
 */
function createCachedResponse<T>(cachedResult: CacheResult<T>, context: CacheContext): NextResponse {
  const response = NextResponse.json(cachedResult.data)
  
  // Apply cache headers
  applyCacheHeaders(response, context)
  
  // Add cache debugging headers
  response.headers.set('X-Cache', cachedResult.fromCache ? 'HIT' : 'MISS')
  response.headers.set('X-Cache-Key', context.cacheKey)
  
  if (cachedResult.cacheAge !== undefined) {
    response.headers.set('X-Cache-Age', cachedResult.cacheAge.toString())
  }
  
  if (cachedResult.revalidating) {
    response.headers.set('X-Cache-Revalidating', 'true')
  }
  
  return response
}

/**
 * Apply cache headers to response
 */
function applyCacheHeaders(response: NextResponse, context: CacheContext, isStale = false): void {
  // Apply configured cache headers
  Object.entries(context.config.cacheHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add vary headers if configured
  if (context.config.varyHeaders) {
    response.headers.set('Vary', context.config.varyHeaders.join(', '))
  }
  
  // Add ETag for cache validation
  const etag = createHash('md5').update(context.cacheKey).digest('hex').substring(0, 16)
  response.headers.set('ETag', `"${etag}"`)
  
  // Mark stale responses
  if (isStale) {
    response.headers.set('X-Cache-Status', 'STALE')
    response.headers.set('Warning', '110 - "Response is stale"')
  }
  
  // Add performance headers
  const processingTime = Date.now() - context.startTime
  response.headers.set('X-Response-Time', `${processingTime}ms`)
  response.headers.set('X-Request-ID', context.requestId)
}

/**
 * Handle conditional requests (If-None-Match)
 */
export function handleConditionalRequest(request: NextRequest, etag: string): NextResponse | null {
  const ifNoneMatch = request.headers.get('if-none-match')
  
  if (ifNoneMatch && ifNoneMatch.includes(etag)) {
    console.log(`[CACHE-MIDDLEWARE] Conditional request matched ETag: ${etag}`)
    
    const notModifiedResponse = new NextResponse(null, { status: 304 })
    notModifiedResponse.headers.set('ETag', `"${etag}"`)
    notModifiedResponse.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    
    return notModifiedResponse
  }
  
  return null
}

/**
 * Background revalidation helper
 */
export async function revalidateInBackground(
  cacheKey: string, 
  fetcher: () => Promise<any>,
  ttl?: number
): Promise<void> {
  try {
    console.log(`[CACHE-MIDDLEWARE] Starting background revalidation for: ${cacheKey}`)
    
    const freshData = await fetcher()
    await apiCache.set(cacheKey, freshData, ttl)
    
    console.log(`[CACHE-MIDDLEWARE] Background revalidation completed for: ${cacheKey}`)
  } catch (error) {
    console.error(`[CACHE-MIDDLEWARE] Background revalidation failed for ${cacheKey}:`, error)
  }
}

/**
 * Cache warming utility
 */
export async function warmCache(routes: Array<{
  url: string
  routeType: keyof typeof ROUTE_CACHE_CONFIG
  fetcher: () => Promise<any>
}>): Promise<void> {
  console.log(`[CACHE-MIDDLEWARE] Starting cache warming for ${routes.length} routes`)
  
  const warmingPromises = routes.map(async ({ url, routeType, fetcher }) => {
    try {
      const request = new NextRequest(url)
      const cacheKey = generateCacheKey(request, routeType)
      const config = ROUTE_CACHE_CONFIG[routeType]
      
      const data = await fetcher()
      await apiCache.set(cacheKey, data, config.ttl)
      
      console.log(`[CACHE-MIDDLEWARE] Warmed cache for: ${cacheKey}`)
    } catch (error) {
      console.error(`[CACHE-MIDDLEWARE] Failed to warm cache for ${url}:`, error)
    }
  })
  
  await Promise.allSettled(warmingPromises)
  console.log(`[CACHE-MIDDLEWARE] Cache warming completed`)
}

/**
 * Cache health check
 */
export async function cacheHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  metrics: any
  issues: string[]
}> {
  const issues: string[] = []
  const metrics = apiCache.getMetrics()
  
  // Check hit rate
  if (metrics.hitRate < 70) {
    issues.push(`Low cache hit rate: ${metrics.hitRate.toFixed(1)}%`)
  }
  
  // Check error rate
  const errorRate = metrics.errors / (metrics.hits + metrics.misses + metrics.sets) * 100
  if (errorRate > 5) {
    issues.push(`High error rate: ${errorRate.toFixed(1)}%`)
  }
  
  // Check Redis connection
  if (!metrics.redisConnected && process.env.REDIS_URL) {
    issues.push('Redis connection unavailable')
  }
  
  // Determine status
  let status: 'healthy' | 'degraded' | 'unhealthy'
  if (issues.length === 0) {
    status = 'healthy'
  } else if (issues.length <= 2) {
    status = 'degraded'
  } else {
    status = 'unhealthy'
  }
  
  return { status, metrics, issues }
}