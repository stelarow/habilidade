/**
 * Advanced Cache Management System for Blog
 * Implements intelligent cache invalidation strategies with React Query integration
 */

import { QueryClient } from '@tanstack/react-query';

class CacheManager {
  constructor(queryClient) {
    this.queryClient = queryClient;
    this.cacheVersion = '1.0';
    this.backgroundRefreshInterval = null;
    this.popularPosts = new Set();
    this.lastInvalidation = Date.now();
    
    // Cache configuration
    this.config = {
      // TTL values in milliseconds
      POST_DETAIL_TTL: 60 * 60 * 1000, // 1 hour
      POSTS_LIST_TTL: 5 * 60 * 1000, // 5 minutes
      CATEGORIES_TTL: 30 * 60 * 1000, // 30 minutes
      SEARCH_TTL: 2 * 60 * 1000, // 2 minutes
      
      // Stale-while-revalidate times
      POST_DETAIL_SWR: 30 * 60 * 1000, // 30 minutes
      POSTS_LIST_SWR: 2 * 60 * 1000, // 2 minutes
      
      // Background refresh intervals
      POPULAR_POSTS_REFRESH: 10 * 60 * 1000, // 10 minutes
      CATEGORIES_REFRESH: 60 * 60 * 1000, // 1 hour
      
      // Batch operations
      INVALIDATION_BATCH_SIZE: 50,
      INVALIDATION_THROTTLE: 1000, // 1 second
    };
    
    this.initializeServiceWorker();
    this.setupPeriodicRefresh();
  }

  /**
   * Initialize Service Worker for background cache management
   */
  async initializeServiceWorker() {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw-cache.js');
        console.log('[CacheManager] Service Worker registered:', registration);
        
        // Listen for cache update messages
        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
      } catch (error) {
        console.warn('[CacheManager] Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Handle messages from Service Worker
   */
  handleServiceWorkerMessage(event) {
    const { type, data } = event.data;
    
    switch (type) {
      case 'CACHE_UPDATED':
        this.handleCacheUpdate(data);
        break;
      case 'CACHE_ERROR':
        this.handleCacheError(data);
        break;
      default:
        console.log('[CacheManager] Unknown SW message:', type, data);
    }
  }

  /**
   * Set up periodic background refresh for popular content
   */
  setupPeriodicRefresh() {
    // Refresh popular posts periodically
    this.backgroundRefreshInterval = setInterval(() => {
      this.refreshPopularContent();
    }, this.config.POPULAR_POSTS_REFRESH);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (this.backgroundRefreshInterval) {
        clearInterval(this.backgroundRefreshInterval);
      }
    });
  }

  /**
   * Mark posts as popular for background refresh priority
   */
  markAsPopular(postSlugs) {
    if (Array.isArray(postSlugs)) {
      postSlugs.forEach(slug => this.popularPosts.add(slug));
    } else {
      this.popularPosts.add(postSlugs);
    }
    
    // Trigger immediate background refresh for new popular posts
    this.refreshPopularContent();
  }

  /**
   * Background refresh for popular content
   */
  async refreshPopularContent() {
    const popularPostsArray = Array.from(this.popularPosts);
    
    // Batch prefetch popular posts
    const prefetchPromises = popularPostsArray.slice(0, 10).map(slug => 
      this.queryClient.prefetchQuery({
        queryKey: ['post', slug],
        queryFn: () => this.fetchPostBySlug(slug),
        staleTime: this.config.POST_DETAIL_SWR,
      })
    );
    
    try {
      await Promise.allSettled(prefetchPromises);
      console.log('[CacheManager] Popular content refreshed');
    } catch (error) {
      console.warn('[CacheManager] Background refresh failed:', error);
    }
  }

  /**
   * Invalidate cache by content type
   */
  invalidateByType(contentType, options = {}) {
    const { force = false, tags = [] } = options;
    
    switch (contentType) {
      case 'posts':
        return this.invalidatePostsCache(force, tags);
      case 'categories':
        return this.invalidateCategoriesCache(force);
      case 'search':
        return this.invalidateSearchCache(force);
      case 'all':
        return this.invalidateAllCache(force);
      default:
        console.warn('[CacheManager] Unknown content type:', contentType);
    }
  }

  /**
   * Invalidate posts cache with intelligent strategy
   */
  async invalidatePostsCache(force = false, tags = []) {
    const queries = this.queryClient.getQueryCache().getAll();
    const postsQueries = queries.filter(query => 
      query.queryKey[0] === 'posts' || 
      query.queryKey[0] === 'infinitePosts' ||
      query.queryKey[0] === 'postsByCategory' ||
      query.queryKey[0] === 'infinitePostsByCategory'
    );

    // Group invalidations by strategy
    const strategies = {
      immediate: [], // Force invalidate
      background: [], // Background refresh
      stale: [] // Mark as stale
    };

    postsQueries.forEach(query => {
      const age = Date.now() - query.state.dataUpdatedAt;
      const queryTags = this.extractQueryTags(query.queryKey);
      
      // Check if query matches specific tags
      const hasMatchingTags = tags.length === 0 || 
        tags.some(tag => queryTags.includes(tag));
      
      if (!hasMatchingTags && !force) return;
      
      if (force || age > this.config.POSTS_LIST_TTL) {
        strategies.immediate.push(query.queryKey);
      } else if (age > this.config.POSTS_LIST_SWR) {
        strategies.background.push(query.queryKey);
      } else {
        strategies.stale.push(query.queryKey);
      }
    });

    // Execute invalidation strategies
    await this.executeInvalidationStrategies(strategies);
    
    console.log('[CacheManager] Posts cache invalidated:', {
      immediate: strategies.immediate.length,
      background: strategies.background.length,
      stale: strategies.stale.length
    });
  }

  /**
   * Invalidate individual post cache
   */
  async invalidatePost(postSlug, options = {}) {
    const { cascade = true, strategy = 'immediate' } = options;
    
    // Invalidate specific post
    await this.queryClient.invalidateQueries({
      queryKey: ['post', postSlug],
      exact: true
    });
    
    // Cascade invalidation to related queries
    if (cascade) {
      await this.queryClient.invalidateQueries({
        queryKey: ['posts'],
        type: 'active'
      });
      
      await this.queryClient.invalidateQueries({
        queryKey: ['infinitePosts'],
        type: 'active'
      });
      
      // Invalidate search results that might contain this post
      await this.queryClient.invalidateQueries({
        queryKey: ['searchPosts'],
        type: 'active'
      });
    }
    
    console.log(`[CacheManager] Post ${postSlug} cache invalidated with cascade:${cascade}`);
  }

  /**
   * Invalidate categories cache
   */
  async invalidateCategoriesCache(force = false) {
    if (force) {
      await this.queryClient.invalidateQueries({
        queryKey: ['categories'],
        exact: true
      });
    } else {
      // Use stale-while-revalidate strategy
      this.queryClient.refetchQueries({
        queryKey: ['categories'],
        type: 'active'
      });
    }
    
    console.log('[CacheManager] Categories cache invalidated');
  }

  /**
   * Invalidate search cache
   */
  async invalidateSearchCache(force = false) {
    const searchQueries = ['searchPosts', 'infiniteSearchPosts'];
    
    for (const queryType of searchQueries) {
      if (force) {
        await this.queryClient.invalidateQueries({
          queryKey: [queryType],
          type: 'all'
        });
      } else {
        await this.queryClient.invalidateQueries({
          queryKey: [queryType],
          type: 'inactive'
        });
      }
    }
    
    console.log('[CacheManager] Search cache invalidated');
  }

  /**
   * Invalidate all blog-related cache
   */
  async invalidateAllCache(force = false) {
    const blogQueries = [
      'posts', 'infinitePosts', 'post', 
      'postsByCategory', 'infinitePostsByCategory',
      'categories', 'searchPosts', 'infiniteSearchPosts'
    ];
    
    for (const queryType of blogQueries) {
      await this.queryClient.invalidateQueries({
        queryKey: [queryType],
        type: force ? 'all' : 'active'
      });
    }
    
    // Clear browser cache as well
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const blogCaches = cacheNames.filter(name => name.includes('blog'));
        await Promise.all(blogCaches.map(name => caches.delete(name)));
      } catch (error) {
        console.warn('[CacheManager] Browser cache clear failed:', error);
      }
    }
    
    console.log('[CacheManager] All cache invalidated');
  }

  /**
   * Execute different invalidation strategies
   */
  async executeInvalidationStrategies(strategies) {
    // Immediate invalidation
    if (strategies.immediate.length > 0) {
      const batches = this.createBatches(strategies.immediate, this.config.INVALIDATION_BATCH_SIZE);
      
      for (const batch of batches) {
        await Promise.all(batch.map(queryKey =>
          this.queryClient.invalidateQueries({ queryKey, exact: true })
        ));
        
        // Throttle between batches
        if (batches.length > 1) {
          await this.delay(this.config.INVALIDATION_THROTTLE);
        }
      }
    }

    // Background refresh
    if (strategies.background.length > 0) {
      // Use requestIdleCallback for background work
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          strategies.background.forEach(queryKey => {
            this.queryClient.refetchQueries({ queryKey, type: 'active' });
          });
        });
      } else {
        // Fallback to setTimeout
        setTimeout(() => {
          strategies.background.forEach(queryKey => {
            this.queryClient.refetchQueries({ queryKey, type: 'active' });
          });
        }, 100);
      }
    }

    // Mark as stale
    strategies.stale.forEach(queryKey => {
      const query = this.queryClient.getQueryCache().find({ queryKey, exact: true });
      if (query) {
        query.setState(oldState => ({
          ...oldState,
          isStale: true
        }));
      }
    });
  }

  /**
   * Smart cache warming for anticipated content
   */
  async warmCache(warmingStrategy = {}) {
    const {
      categories = true,
      popularPosts = true,
      recentPosts = true,
      relatedContent = false
    } = warmingStrategy;

    const warmingPromises = [];

    // Warm categories cache
    if (categories) {
      warmingPromises.push(
        this.queryClient.prefetchQuery({
          queryKey: ['categories'],
          queryFn: () => this.fetchCategories(),
          staleTime: this.config.CATEGORIES_TTL,
        })
      );
    }

    // Warm popular posts
    if (popularPosts && this.popularPosts.size > 0) {
      const popular = Array.from(this.popularPosts).slice(0, 5);
      popular.forEach(slug => {
        warmingPromises.push(
          this.queryClient.prefetchQuery({
            queryKey: ['post', slug],
            queryFn: () => this.fetchPostBySlug(slug),
            staleTime: this.config.POST_DETAIL_TTL,
          })
        );
      });
    }

    // Warm recent posts
    if (recentPosts) {
      warmingPromises.push(
        this.queryClient.prefetchQuery({
          queryKey: ['posts', 1, 10, null, null],
          queryFn: () => this.fetchPosts(1, 10),
          staleTime: this.config.POSTS_LIST_TTL,
        })
      );
    }

    try {
      await Promise.allSettled(warmingPromises);
      console.log('[CacheManager] Cache warming completed');
    } catch (error) {
      console.warn('[CacheManager] Cache warming failed:', error);
    }
  }

  /**
   * Get cache statistics and health info
   */
  getCacheStats() {
    const queries = this.queryClient.getQueryCache().getAll();
    const now = Date.now();
    
    const stats = {
      totalQueries: queries.length,
      blogQueries: 0,
      staleQueries: 0,
      errorQueries: 0,
      cacheHitRate: 0,
      averageAge: 0,
      memoryUsage: 0,
      popularPosts: this.popularPosts.size,
      lastInvalidation: this.lastInvalidation
    };

    let totalAge = 0;
    let blogQueriesCount = 0;
    let hitCount = 0;

    queries.forEach(query => {
      const isBlogQuery = this.isBlogQuery(query.queryKey);
      if (isBlogQuery) {
        blogQueriesCount++;
        
        if (query.state.isStale) stats.staleQueries++;
        if (query.state.isError) stats.errorQueries++;
        if (query.state.dataUpdatedAt > 0) {
          hitCount++;
          totalAge += now - query.state.dataUpdatedAt;
        }
        
        // Estimate memory usage (rough calculation)
        stats.memoryUsage += this.estimateQuerySize(query);
      }
    });

    stats.blogQueries = blogQueriesCount;
    stats.cacheHitRate = blogQueriesCount > 0 ? (hitCount / blogQueriesCount) * 100 : 0;
    stats.averageAge = hitCount > 0 ? totalAge / hitCount : 0;

    return stats;
  }

  /**
   * Cleanup expired and unused cache entries
   */
  async cleanupCache(options = {}) {
    const { maxAge = 24 * 60 * 60 * 1000, keepActive = true } = options;
    const now = Date.now();
    const queries = this.queryClient.getQueryCache().getAll();
    
    let cleanedCount = 0;
    
    for (const query of queries) {
      if (!this.isBlogQuery(query.queryKey)) continue;
      
      const age = now - query.state.dataUpdatedAt;
      const isExpired = age > maxAge;
      const isInactive = query.getObserversCount() === 0;
      
      if (isExpired && (!keepActive || isInactive)) {
        this.queryClient.removeQueries({ queryKey: query.queryKey, exact: true });
        cleanedCount++;
      }
    }
    
    console.log(`[CacheManager] Cleaned up ${cleanedCount} expired cache entries`);
    return cleanedCount;
  }

  // Helper methods

  isBlogQuery(queryKey) {
    const blogQueryTypes = [
      'posts', 'infinitePosts', 'post', 
      'postsByCategory', 'infinitePostsByCategory',
      'categories', 'searchPosts', 'infiniteSearchPosts'
    ];
    return blogQueryTypes.includes(queryKey[0]);
  }

  extractQueryTags(queryKey) {
    const tags = [];
    
    // Extract category from query key
    if (queryKey.includes('category') || queryKey[3]) {
      tags.push(`category:${queryKey[3] || queryKey[1]}`);
    }
    
    // Extract search terms
    if (queryKey.includes('search') || queryKey[4]) {
      tags.push(`search:${queryKey[4] || queryKey[1]}`);
    }
    
    return tags;
  }

  estimateQuerySize(query) {
    try {
      return JSON.stringify(query.state.data).length;
    } catch {
      return 1000; // Fallback estimate
    }
  }

  createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Placeholder methods for API calls (to be replaced with actual implementations)
  async fetchPostBySlug(slug) {
    // This would be replaced with actual API call
    console.log(`[CacheManager] Fetching post: ${slug}`);
    return null;
  }

  async fetchPosts(page = 1, limit = 10) {
    // This would be replaced with actual API call
    console.log(`[CacheManager] Fetching posts: page ${page}, limit ${limit}`);
    return null;
  }

  async fetchCategories() {
    // This would be replaced with actual API call
    console.log('[CacheManager] Fetching categories');
    return null;
  }
}

// Create and export singleton instance
let cacheManagerInstance = null;

export const createCacheManager = (queryClient) => {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CacheManager(queryClient);
  }
  return cacheManagerInstance;
};

export const getCacheManager = () => {
  if (!cacheManagerInstance) {
    throw new Error('CacheManager not initialized. Call createCacheManager first.');
  }
  return cacheManagerInstance;
};

// Export convenience methods
export const invalidateCache = (contentType, options) => {
  return getCacheManager().invalidateByType(contentType, options);
};

export const markAsPopular = (postSlugs) => {
  return getCacheManager().markAsPopular(postSlugs);
};

export const warmCache = (strategy) => {
  return getCacheManager().warmCache(strategy);
};

export const getCacheStats = () => {
  return getCacheManager().getCacheStats();
};

export const cleanupCache = (options) => {
  return getCacheManager().cleanupCache(options);
};

export default CacheManager;