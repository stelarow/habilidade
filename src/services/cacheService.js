/**
 * Cache Service - Centralized cache management service
 * Handles cache operations, invalidation, and performance monitoring
 */

import { getBlogCache } from '../utils/blogCache.js';
import { getCacheManager } from '../utils/cacheManager.js';

class CacheService {
  constructor() {
    this.blogCache = getBlogCache();
    this.isInitialized = false;
    this.subscriptions = new Map();
    this.invalidationQueue = [];
    this.processingInvalidation = false;
  }

  /**
   * Initialize cache service
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Setup invalidation processing
      this.setupInvalidationProcessor();
      
      // Setup periodic cleanup
      this.setupPeriodicMaintenance();
      
      // Warm essential cache entries
      await this.warmEssentialCache();
      
      this.isInitialized = true;
      console.log('[CacheService] Initialized successfully');
    } catch (error) {
      console.error('[CacheService] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup invalidation processor with queue
   */
  setupInvalidationProcessor() {
    // Process invalidation queue every 2 seconds
    setInterval(() => {
      this.processInvalidationQueue();
    }, 2000);
  }

  /**
   * Setup periodic maintenance tasks
   */
  setupPeriodicMaintenance() {
    // Cleanup expired entries every 15 minutes
    setInterval(() => {
      this.performMaintenance();
    }, 15 * 60 * 1000);

    // Performance monitoring every 5 minutes
    setInterval(() => {
      this.monitorPerformance();
    }, 5 * 60 * 1000);
  }

  /**
   * Warm essential cache entries on startup
   */
  async warmEssentialCache() {
    try {
      const warmingTasks = [
        // Categories are frequently accessed
        this.cacheCategories(),
        // First page of posts
        this.cachePostsList(1, 10),
      ];

      await Promise.allSettled(warmingTasks);
      console.log('[CacheService] Essential cache warmed');
    } catch (error) {
      console.warn('[CacheService] Cache warming failed:', error);
    }
  }

  /**
   * Cache categories
   */
  async cacheCategories() {
    const key = this.blogCache.getCategoriesKey();
    
    // Don't re-cache if already present and valid
    if (this.blogCache.get(key)) {
      return;
    }

    try {
      const { blogAPI } = await import('../services/blogAPI.js');
      const categories = await blogAPI.getCategories();
      
      this.blogCache.set(key, categories, {
        ttl: 30 * 60 * 1000, // 30 minutes
        priority: 'high',
        useLocalStorage: true
      });
    } catch (error) {
      console.warn('[CacheService] Categories caching failed:', error);
    }
  }

  /**
   * Cache posts list
   */
  async cachePostsList(page = 1, limit = 10, category = null, search = null) {
    const key = this.blogCache.getPostsKey(page, limit, category, search);
    
    // Don't re-cache if already present and valid
    if (this.blogCache.get(key)) {
      return;
    }

    try {
      const { blogAPI } = await import('../services/blogAPI.js');
      const posts = await blogAPI.getAllPosts(page, limit, category, search);
      
      const cacheOptions = {
        ttl: search ? 2 * 60 * 1000 : 5 * 60 * 1000, // 2min for search, 5min for lists
        priority: page === 1 && !search ? 'high' : 'normal',
        useSessionStorage: !!search // Use session storage for search results
      };
      
      this.blogCache.set(key, posts, cacheOptions);
    } catch (error) {
      console.warn('[CacheService] Posts list caching failed:', error);
    }
  }

  /**
   * Cache individual post
   */
  async cachePost(slug) {
    const key = this.blogCache.getPostKey(slug);
    
    // Don't re-cache if already present and valid
    if (this.blogCache.get(key)) {
      return;
    }

    try {
      const { blogAPI } = await import('../services/blogAPI.js');
      const post = await blogAPI.getPostBySlug(slug);
      
      this.blogCache.set(key, post, {
        ttl: 60 * 60 * 1000, // 1 hour
        priority: 'high',
        useLocalStorage: true
      });
    } catch (error) {
      console.warn('[CacheService] Post caching failed:', error);
    }
  }

  /**
   * Invalidate cache entries (queued processing)
   */
  invalidate(keys = [], options = {}) {
    const { immediate = false, cascade = true } = options;

    if (immediate) {
      this.performInvalidation(keys, { cascade });
    } else {
      // Add to queue for batch processing
      this.invalidationQueue.push({
        keys,
        options: { cascade },
        timestamp: Date.now()
      });
    }
  }

  /**
   * Process invalidation queue in batches
   */
  async processInvalidationQueue() {
    if (this.processingInvalidation || this.invalidationQueue.length === 0) {
      return;
    }

    this.processingInvalidation = true;

    try {
      // Process up to 20 invalidations at once
      const batch = this.invalidationQueue.splice(0, 20);
      
      for (const { keys, options } of batch) {
        await this.performInvalidation(keys, options);
      }
    } catch (error) {
      console.error('[CacheService] Invalidation queue processing failed:', error);
    } finally {
      this.processingInvalidation = false;
    }
  }

  /**
   * Perform actual invalidation
   */
  async performInvalidation(keys, options = {}) {
    const { cascade = true } = options;

    if (!keys || keys.length === 0) {
      // Clean expired entries
      this.blogCache.cleanupExpired();
      return;
    }

    // Remove specific keys
    keys.forEach(key => {
      this.blogCache.remove(key);
      
      // Cascade invalidation for related content
      if (cascade) {
        this.cascadeInvalidation(key);
      }
    });

    // Notify subscribers
    this.notifySubscribers('invalidation', { keys, cascade });
  }

  /**
   * Cascade invalidation to related content
   */
  cascadeInvalidation(key) {
    // If a post is invalidated, also invalidate post lists
    if (key.includes(this.blogCache.config.PREFIX_POST)) {
      // Invalidate first page of posts (most likely to contain this post)
      const firstPageKey = this.blogCache.getPostsKey(1, 10);
      this.blogCache.remove(firstPageKey);
    }

    // If categories are invalidated, invalidate posts by category
    if (key.includes(this.blogCache.config.PREFIX_CATEGORIES)) {
      // This is more complex - would need to track which posts belong to which categories
      // For now, we'll invalidate the first page of posts
      const firstPageKey = this.blogCache.getPostsKey(1, 10);
      this.blogCache.remove(firstPageKey);
    }
  }

  /**
   * Perform maintenance tasks
   */
  performMaintenance() {
    // Cleanup expired entries
    this.blogCache.cleanupExpired();
    
    // Get cache stats for monitoring
    const stats = this.blogCache.getStats();
    
    // Log performance metrics
    console.log('[CacheService] Maintenance completed:', {
      memoryUsage: stats.memory.usage,
      hitRate: stats.overall.hitRate,
      totalEntries: stats.memory.size + stats.localStorage.size + stats.sessionStorage.size
    });
  }

  /**
   * Monitor cache performance
   */
  monitorPerformance() {
    const stats = this.blogCache.getStats();
    
    // Check hit rate threshold
    if (stats.overall.hitRate < 60) {
      console.warn('[CacheService] Low cache hit rate:', stats.overall.hitRate);
      
      // Trigger cache warming for popular content
      this.warmEssentialCache();
    }

    // Check memory usage
    if (stats.memory.usage > 90) {
      console.warn('[CacheService] High memory usage:', stats.memory.usage);
      
      // Trigger aggressive cleanup
      this.blogCache.cleanupExpired();
    }

    // Notify subscribers about performance metrics
    this.notifySubscribers('performance', stats);
  }

  /**
   * Subscribe to cache events
   */
  subscribe(eventType, callback) {
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, new Set());
    }
    
    this.subscriptions.get(eventType).add(callback);
    
    // Return unsubscribe function
    return () => {
      const subscribers = this.subscriptions.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  /**
   * Notify subscribers of cache events
   */
  notifySubscribers(eventType, data) {
    const subscribers = this.subscriptions.get(eventType);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('[CacheService] Subscriber callback failed:', error);
        }
      });
    }
  }

  /**
   * Get comprehensive cache statistics
   */
  getStats() {
    const stats = this.blogCache.getStats();
    
    return {
      ...stats,
      invalidationQueue: {
        size: this.invalidationQueue.length,
        processing: this.processingInvalidation
      },
      subscribers: {
        total: Array.from(this.subscriptions.values()).reduce((sum, set) => sum + set.size, 0),
        byEvent: Object.fromEntries(
          Array.from(this.subscriptions.entries()).map(([event, subs]) => [event, subs.size])
        )
      },
      isInitialized: this.isInitialized
    };
  }

  /**
   * Prefetch content based on user behavior
   */
  async prefetchContent(strategy = {}) {
    const {
      categories = true,
      firstPage = true,
      popularPosts = [],
      relatedContent = false
    } = strategy;

    const prefetchTasks = [];

    if (categories) {
      prefetchTasks.push(this.cacheCategories());
    }

    if (firstPage) {
      prefetchTasks.push(this.cachePostsList(1, 10));
    }

    if (popularPosts.length > 0) {
      popularPosts.slice(0, 5).forEach(slug => {
        prefetchTasks.push(this.cachePost(slug));
      });
    }

    try {
      await Promise.allSettled(prefetchTasks);
      console.log('[CacheService] Content prefetched successfully');
    } catch (error) {
      console.warn('[CacheService] Content prefetching failed:', error);
    }
  }

  /**
   * Clear all cache (emergency function)
   */
  clearAll() {
    this.blogCache.clear();
    this.invalidationQueue = [];
    console.log('[CacheService] All cache cleared');
  }

  /**
   * Export cache for debugging
   */
  exportCacheData() {
    const stats = this.getStats();
    
    return {
      stats,
      memoryKeys: Array.from(this.blogCache.memoryCache.keys()),
      config: this.blogCache.config,
      metrics: this.blogCache.metrics
    };
  }
}

// Create singleton instance
let cacheServiceInstance = null;

export const getCacheService = () => {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new CacheService();
  }
  return cacheServiceInstance;
};

export const initializeCacheService = async () => {
  const service = getCacheService();
  await service.initialize();
  return service;
};

// Export convenience methods
export const invalidateCache = (keys, options) => {
  return getCacheService().invalidate(keys, options);
};

export const prefetchContent = (strategy) => {
  return getCacheService().prefetchContent(strategy);
};

export const getCacheStats = () => {
  return getCacheService().getStats();
};

export const subscribeToCacheEvents = (eventType, callback) => {
  return getCacheService().subscribe(eventType, callback);
};

export default CacheService;