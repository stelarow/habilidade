/**
 * Blog Cache System - Multi-layer intelligent caching
 * Implements memory, localStorage, and sessionStorage caching with TTL management
 */

import { getCacheManager } from './cacheManager.js';

class BlogCache {
  constructor() {
    this.memoryCache = new Map();
    this.config = {
      // TTL values in milliseconds
      MEMORY_TTL: 5 * 60 * 1000, // 5 minutes
      LOCAL_STORAGE_TTL: 60 * 60 * 1000, // 1 hour
      SESSION_STORAGE_TTL: 30 * 60 * 1000, // 30 minutes
      
      // Size limits
      MEMORY_CACHE_SIZE: 50, // Max entries in memory
      STORAGE_CACHE_SIZE: 100, // Max entries in storage
      
      // Cache prefixes
      PREFIX_POSTS: 'blog_posts_',
      PREFIX_POST: 'blog_post_',
      PREFIX_CATEGORIES: 'blog_categories_',
      PREFIX_SEARCH: 'blog_search_',
      
      // Metrics
      METRICS_KEY: 'blog_cache_metrics'
    };
    
    this.metrics = this.loadMetrics();
    this.initializeCleanup();
  }

  /**
   * Initialize periodic cleanup and metrics tracking
   */
  initializeCleanup() {
    // Cleanup expired entries every 10 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 10 * 60 * 1000);

    // Save metrics every minute
    this.metricsInterval = setInterval(() => {
      this.saveMetrics();
    }, 60 * 1000);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  /**
   * Get item from multi-layer cache
   * @param {string} key - Cache key
   * @param {Object} options - Cache options
   * @returns {Object|null} Cached data or null
   */
  get(key, options = {}) {
    const { useMemory = true, useLocalStorage = true, useSessionStorage = true } = options;
    
    // Try memory cache first (fastest)
    if (useMemory && this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key);
      if (this.isValid(entry)) {
        this.metrics.hits.memory++;
        return entry.data;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Try localStorage (persistent)
    if (useLocalStorage) {
      const data = this.getFromStorage(key, 'localStorage');
      if (data) {
        // Promote to memory cache
        if (useMemory) {
          this.setInMemory(key, data, this.config.MEMORY_TTL);
        }
        this.metrics.hits.localStorage++;
        return data;
      }
    }

    // Try sessionStorage (session persistent)
    if (useSessionStorage) {
      const data = this.getFromStorage(key, 'sessionStorage');
      if (data) {
        // Promote to higher layers
        if (useMemory) {
          this.setInMemory(key, data, this.config.MEMORY_TTL);
        }
        if (useLocalStorage) {
          this.setInStorage(key, data, 'localStorage', this.config.LOCAL_STORAGE_TTL);
        }
        this.metrics.hits.sessionStorage++;
        return data;
      }
    }

    this.metrics.misses++;
    return null;
  }

  /**
   * Set item in multi-layer cache
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   * @param {Object} options - Cache options
   */
  set(key, data, options = {}) {
    const { 
      ttl = this.config.MEMORY_TTL,
      useMemory = true, 
      useLocalStorage = true, 
      useSessionStorage = false,
      priority = 'normal'
    } = options;

    if (useMemory) {
      this.setInMemory(key, data, ttl, priority);
    }

    if (useLocalStorage) {
      this.setInStorage(key, data, 'localStorage', this.config.LOCAL_STORAGE_TTL);
    }

    if (useSessionStorage) {
      this.setInStorage(key, data, 'sessionStorage', this.config.SESSION_STORAGE_TTL);
    }

    this.metrics.sets++;
  }

  /**
   * Set item in memory cache with LRU eviction
   */
  setInMemory(key, data, ttl, priority = 'normal') {
    // Check size limit and evict if necessary
    if (this.memoryCache.size >= this.config.MEMORY_CACHE_SIZE) {
      this.evictLRU(priority);
    }

    const entry = {
      data,
      timestamp: Date.now(),
      ttl,
      priority,
      accessCount: 0,
      lastAccess: Date.now()
    };

    this.memoryCache.set(key, entry);
  }

  /**
   * Set item in browser storage
   */
  setInStorage(key, data, storageType, ttl) {
    try {
      const storage = window[storageType];
      const entry = {
        data,
        timestamp: Date.now(),
        ttl
      };

      storage.setItem(key, JSON.stringify(entry));
      
      // Manage storage size
      this.manageStorageSize(storageType);
    } catch (error) {
      console.warn(`[BlogCache] Failed to set ${storageType}:`, error);
    }
  }

  /**
   * Get item from browser storage
   */
  getFromStorage(key, storageType) {
    try {
      const storage = window[storageType];
      const item = storage.getItem(key);
      
      if (!item) return null;

      const entry = JSON.parse(item);
      if (this.isValid(entry)) {
        return entry.data;
      } else {
        storage.removeItem(key);
        return null;
      }
    } catch (error) {
      console.warn(`[BlogCache] Failed to get from ${storageType}:`, error);
      return null;
    }
  }

  /**
   * Check if cache entry is valid (not expired)
   */
  isValid(entry) {
    if (!entry || !entry.timestamp) return false;
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Evict least recently used items from memory cache
   */
  evictLRU(priorityToKeep = 'normal') {
    const entries = Array.from(this.memoryCache.entries());
    
    // Sort by priority and last access time
    entries.sort(([, a], [, b]) => {
      // Keep high priority items
      if (a.priority === 'high' && b.priority !== 'high') return 1;
      if (b.priority === 'high' && a.priority !== 'high') return -1;
      
      // Then by access time
      return a.lastAccess - b.lastAccess;
    });

    // Remove oldest 25% of entries
    const toRemove = Math.ceil(entries.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      this.memoryCache.delete(entries[i][0]);
    }
  }

  /**
   * Manage browser storage size by removing old entries
   */
  manageStorageSize(storageType) {
    try {
      const storage = window[storageType];
      const keys = Object.keys(storage).filter(key => 
        key.startsWith(this.config.PREFIX_POSTS) ||
        key.startsWith(this.config.PREFIX_POST) ||
        key.startsWith(this.config.PREFIX_CATEGORIES) ||
        key.startsWith(this.config.PREFIX_SEARCH)
      );

      if (keys.length > this.config.STORAGE_CACHE_SIZE) {
        // Get entries with timestamps
        const entries = keys.map(key => {
          try {
            const item = JSON.parse(storage.getItem(key));
            return { key, timestamp: item.timestamp || 0 };
          } catch {
            return { key, timestamp: 0 };
          }
        });

        // Sort by timestamp and remove oldest
        entries.sort((a, b) => a.timestamp - b.timestamp);
        const toRemove = entries.slice(0, keys.length - this.config.STORAGE_CACHE_SIZE);
        
        toRemove.forEach(({ key }) => storage.removeItem(key));
      }
    } catch (error) {
      console.warn(`[BlogCache] Failed to manage ${storageType} size:`, error);
    }
  }

  /**
   * Generate cache key for posts list
   */
  getPostsKey(page = 1, limit = 10, category = null, search = null) {
    const params = [page, limit, category || '', search || ''].join('_');
    return `${this.config.PREFIX_POSTS}${params}`;
  }

  /**
   * Generate cache key for individual post
   */
  getPostKey(slug) {
    return `${this.config.PREFIX_POST}${slug}`;
  }

  /**
   * Generate cache key for categories
   */
  getCategoriesKey() {
    return `${this.config.PREFIX_CATEGORIES}all`;
  }

  /**
   * Clean up expired entries from all layers
   */
  cleanupExpired() {
    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry)) {
        this.memoryCache.delete(key);
      }
    }

    // Clean storage caches
    this.cleanupStorageExpired('localStorage');
    this.cleanupStorageExpired('sessionStorage');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const memorySize = this.memoryCache.size;
    const memoryEntries = Array.from(this.memoryCache.values());
    
    const stats = {
      memory: {
        size: memorySize,
        maxSize: this.config.MEMORY_CACHE_SIZE,
        usage: Math.round((memorySize / this.config.MEMORY_CACHE_SIZE) * 100),
        hitRate: this.calculateHitRate('memory')
      },
      localStorage: {
        size: this.getStorageSize('localStorage'),
        hitRate: this.calculateHitRate('localStorage')
      },
      sessionStorage: {
        size: this.getStorageSize('sessionStorage'),
        hitRate: this.calculateHitRate('sessionStorage')
      },
      overall: {
        totalHits: this.metrics.hits.memory + this.metrics.hits.localStorage + this.metrics.hits.sessionStorage,
        totalMisses: this.metrics.misses,
        hitRate: this.calculateOverallHitRate()
      }
    };

    return stats;
  }

  /**
   * Calculate hit rate for specific cache layer
   */
  calculateHitRate(layer) {
    const hits = this.metrics.hits[layer] || 0;
    const total = hits + this.metrics.misses;
    return total > 0 ? Math.round((hits / total) * 100) : 0;
  }

  /**
   * Calculate overall hit rate
   */
  calculateOverallHitRate() {
    const totalHits = this.metrics.hits.memory + this.metrics.hits.localStorage + this.metrics.hits.sessionStorage;
    const total = totalHits + this.metrics.misses;
    return total > 0 ? Math.round((totalHits / total) * 100) : 0;
  }

  /**
   * Get storage size (number of blog-related items)
   */
  getStorageSize(storageType) {
    try {
      const storage = window[storageType];
      const keys = Object.keys(storage).filter(key => 
        key.startsWith(this.config.PREFIX_POSTS) ||
        key.startsWith(this.config.PREFIX_POST) ||
        key.startsWith(this.config.PREFIX_CATEGORIES) ||
        key.startsWith(this.config.PREFIX_SEARCH)
      );
      return keys.length;
    } catch {
      return 0;
    }
  }

  /**
   * Initialize metrics object
   */
  initializeMetrics() {
    return {
      hits: {
        memory: 0,
        localStorage: 0,
        sessionStorage: 0
      },
      misses: 0,
      sets: 0,
      startTime: Date.now()
    };
  }

  /**
   * Load metrics from localStorage
   */
  loadMetrics() {
    try {
      const stored = localStorage.getItem(this.config.METRICS_KEY);
      return stored ? JSON.parse(stored) : this.initializeMetrics();
    } catch {
      return this.initializeMetrics();
    }
  }

  /**
   * Save metrics to localStorage
   */
  saveMetrics() {
    try {
      localStorage.setItem(this.config.METRICS_KEY, JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('[BlogCache] Failed to save metrics:', error);
    }
  }

  /**
   * Clean up expired entries from specific storage
   */
  cleanupStorageExpired(storageType) {
    try {
      const storage = window[storageType];
      const keys = Object.keys(storage).filter(key => 
        key.startsWith(this.config.PREFIX_POSTS) ||
        key.startsWith(this.config.PREFIX_POST) ||
        key.startsWith(this.config.PREFIX_CATEGORIES) ||
        key.startsWith(this.config.PREFIX_SEARCH)
      );

      keys.forEach(key => {
        try {
          const item = storage.getItem(key);
          if (item) {
            const entry = JSON.parse(item);
            if (!this.isValid(entry)) {
              storage.removeItem(key);
            }
          }
        } catch (error) {
          // Remove corrupted entries
          storage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn(`[BlogCache] Failed to cleanup ${storageType}:`, error);
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    this.saveMetrics();
  }
}

// Create singleton instance
let blogCacheInstance = null;

export const getBlogCache = () => {
  if (!blogCacheInstance) {
    blogCacheInstance = new BlogCache();
  }
  return blogCacheInstance;
};

export default BlogCache;