/**
 * useBlogCache Hook - React hook for blog caching operations
 * Provides React integration for the multi-layer blog cache system
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getBlogCache } from '../utils/blogCache.js';
import blogAPI from '../services/blogAPI.js';

export const useBlogCache = (options = {}) => {
  const { 
    enableAutoRefresh = true,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    enableMetricsTracking = true 
  } = options;

  const cache = useRef(getBlogCache());
  const [cacheStats, setCacheStats] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef(null);

  // Initialize cache stats
  useEffect(() => {
    if (enableMetricsTracking) {
      setCacheStats(cache.current.getStats());
    }
  }, [enableMetricsTracking]);

  // Auto-refresh stats
  useEffect(() => {
    if (enableAutoRefresh && enableMetricsTracking) {
      refreshIntervalRef.current = setInterval(() => {
        setCacheStats(cache.current.getStats());
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [enableAutoRefresh, enableMetricsTracking, refreshInterval]);

  /**
   * Get posts with caching
   */
  const getCachedPosts = useCallback(async (page = 1, limit = 10, category = null, search = null) => {
    const cacheKey = cache.current.getPostsKey(page, limit, category, search);
    
    // Try cache first
    const cachedData = cache.current.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Fetch from API
    try {
      const data = await blogAPI.getAllPosts(page, limit, category, search);
      
      // Cache the result with different TTL based on content type
      const cacheOptions = {
        ttl: search ? 2 * 60 * 1000 : 5 * 60 * 1000, // 2min for search, 5min for lists
        priority: page === 1 ? 'high' : 'normal', // First page is high priority
        useSessionStorage: !!search // Use session storage for search results
      };
      
      cache.current.set(cacheKey, data, cacheOptions);
      
      // Update stats if tracking is enabled
      if (enableMetricsTracking) {
        setCacheStats(cache.current.getStats());
      }
      
      return data;
    } catch (error) {
      console.error('[useBlogCache] Error fetching posts:', error);
      throw error;
    }
  }, [enableMetricsTracking]);

  /**
   * Get single post with caching
   */
  const getCachedPost = useCallback(async (slug) => {
    const cacheKey = cache.current.getPostKey(slug);
    
    // Try cache first
    const cachedData = cache.current.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Fetch from API
    try {
      const data = await blogAPI.getPostBySlug(slug);
      
      // Cache individual posts with longer TTL and high priority
      const cacheOptions = {
        ttl: 60 * 60 * 1000, // 1 hour
        priority: 'high',
        useLocalStorage: true,
        useSessionStorage: false
      };
      
      cache.current.set(cacheKey, data, cacheOptions);
      
      // Update stats if tracking is enabled
      if (enableMetricsTracking) {
        setCacheStats(cache.current.getStats());
      }
      
      return data;
    } catch (error) {
      console.error('[useBlogCache] Error fetching post:', error);
      throw error;
    }
  }, [enableMetricsTracking]);

  /**
   * Get categories with caching
   */
  const getCachedCategories = useCallback(async () => {
    const cacheKey = cache.current.getCategoriesKey();
    
    // Try cache first
    const cachedData = cache.current.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Fetch from API
    try {
      const data = await blogAPI.getCategories();
      
      // Cache categories with long TTL and high priority
      const cacheOptions = {
        ttl: 30 * 60 * 1000, // 30 minutes
        priority: 'high',
        useLocalStorage: true
      };
      
      cache.current.set(cacheKey, data, cacheOptions);
      
      // Update stats if tracking is enabled
      if (enableMetricsTracking) {
        setCacheStats(cache.current.getStats());
      }
      
      return data;
    } catch (error) {
      console.error('[useBlogCache] Error fetching categories:', error);
      throw error;
    }
  }, [enableMetricsTracking]);

  /**
   * Search posts with caching
   */
  const getCachedSearchResults = useCallback(async (query, page = 1, limit = 10) => {
    // Don't cache empty or very short queries
    if (!query || query.trim().length < 2) {
      return blogAPI.searchPosts(query, page, limit);
    }

    const cacheKey = `${cache.current.config.PREFIX_SEARCH}${query}_${page}_${limit}`;
    
    // Try cache first
    const cachedData = cache.current.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Fetch from API
    try {
      const data = await blogAPI.searchPosts(query, page, limit);
      
      // Cache search results with short TTL in session storage
      const cacheOptions = {
        ttl: 2 * 60 * 1000, // 2 minutes
        priority: 'normal',
        useMemory: true,
        useLocalStorage: false,
        useSessionStorage: true
      };
      
      cache.current.set(cacheKey, data, cacheOptions);
      
      // Update stats if tracking is enabled
      if (enableMetricsTracking) {
        setCacheStats(cache.current.getStats());
      }
      
      return data;
    } catch (error) {
      console.error('[useBlogCache] Error searching posts:', error);
      throw error;
    }
  }, [enableMetricsTracking]);

  /**
   * Prefetch content for better performance
   */
  const prefetchContent = useCallback(async (prefetchOptions = {}) => {
    const {
      prefetchCategories = true,
      prefetchFirstPage = true,
      prefetchPopularPosts = false,
      popularSlugs = []
    } = prefetchOptions;

    setIsRefreshing(true);

    try {
      const prefetchPromises = [];

      // Prefetch categories
      if (prefetchCategories) {
        prefetchPromises.push(getCachedCategories());
      }

      // Prefetch first page of posts
      if (prefetchFirstPage) {
        prefetchPromises.push(getCachedPosts(1, 10));
      }

      // Prefetch popular posts
      if (prefetchPopularPosts && popularSlugs.length > 0) {
        popularSlugs.slice(0, 5).forEach(slug => {
          prefetchPromises.push(getCachedPost(slug));
        });
      }

      await Promise.allSettled(prefetchPromises);
    } catch (error) {
      console.warn('[useBlogCache] Prefetch failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [getCachedCategories, getCachedPosts, getCachedPost]);

  /**
   * Invalidate specific cache entries
   */
  const invalidateCache = useCallback((keys = []) => {
    if (keys.length === 0) {
      // Clear all cache
      cache.current.cleanupExpired();
    } else {
      // Remove specific keys
      keys.forEach(key => {
        cache.current.remove(key);
      });
    }

    // Update stats
    if (enableMetricsTracking) {
      setCacheStats(cache.current.getStats());
    }
  }, [enableMetricsTracking]);

  /**
   * Warm cache for specific content
   */
  const warmCache = useCallback(async (warmStrategy = {}) => {
    await prefetchContent(warmStrategy);
  }, [prefetchContent]);

  /**
   * Get cache performance metrics
   */
  const getCacheMetrics = useCallback(() => {
    return cache.current.getStats();
  }, []);

  /**
   * Force refresh cache stats
   */
  const refreshStats = useCallback(() => {
    if (enableMetricsTracking) {
      setCacheStats(cache.current.getStats());
    }
  }, [enableMetricsTracking]);

  return {
    // Core caching methods
    getCachedPosts,
    getCachedPost,
    getCachedCategories,
    getCachedSearchResults,

    // Cache management
    prefetchContent,
    invalidateCache,
    warmCache,

    // Metrics and monitoring
    cacheStats,
    getCacheMetrics,
    refreshStats,
    isRefreshing,

    // Cache utilities
    generatePostKey: (slug) => cache.current.getPostKey(slug),
    generatePostsKey: (page, limit, category, search) => 
      cache.current.getPostsKey(page, limit, category, search),
    generateCategoriesKey: () => cache.current.getCategoriesKey()
  };
};

/**
 * Hook for simple blog post caching (individual posts)
 */
export const useCachedPost = (slug, options = {}) => {
  const { getCachedPost } = useBlogCache(options);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postData = await getCachedPost(slug);
        
        if (isMounted) {
          setPost(postData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setPost(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [slug, getCachedPost]);

  return { post, loading, error };
};

/**
 * Hook for simple blog posts list caching
 */
export const useCachedPosts = (page = 1, limit = 10, category = null, search = null, options = {}) => {
  const { getCachedPosts } = useBlogCache(options);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getCachedPosts(page, limit, category, search);
        
        if (isMounted) {
          setPosts(data.posts || []);
          setPagination(data.pagination || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setPosts([]);
          setPagination(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [page, limit, category, search, getCachedPosts]);

  return { posts, pagination, loading, error };
};

export default useBlogCache;