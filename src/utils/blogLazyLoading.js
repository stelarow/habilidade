/**
 * Blog Lazy Loading - Dynamic import utilities for blog components
 * Handles code splitting and lazy loading for better performance
 */

import { lazy, Suspense } from 'react';

// Cache for loaded components
const componentCache = new Map();

// Loading states and fallbacks
const LoadingFallbacks = {
  // Basic spinner for small components
  minimal: () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    </div>
  ),

  // Card-like loading for blog posts
  card: () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg p-6">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
  ),

  // Full page loading
  page: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando conte�do...</p>
      </div>
    </div>
  ),

  // Image loading placeholder
  image: () => (
    <div className="bg-gray-200 animate-pulse rounded-lg w-full h-48 flex items-center justify-center">
      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    </div>
  )
};

/**
 * Create lazy component with caching
 */
const createLazyComponent = (importFn, fallbackType = 'minimal', options = {}) => {
  const { 
    retries = 3, 
    retryDelay = 1000,
    preload = false,
    cacheable = true 
  } = options;

  // Create cache key from import function
  const cacheKey = importFn.toString();
  
  if (cacheable && componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey);
  }

  // Retry logic for failed imports
  const importWithRetries = async (importFn, retriesLeft = retries) => {
    try {
      return await importFn();
    } catch (error) {
      if (retriesLeft > 0) {
        console.warn(`[BlogLazyLoading] Import failed, retrying... (${retriesLeft} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return importWithRetries(importFn, retriesLeft - 1);
      } else {
        console.error('[BlogLazyLoading] Import failed after all retries:', error);
        throw error;
      }
    }
  };

  const LazyComponent = lazy(() => importWithRetries(importFn));
  
  const WrappedComponent = (props) => (
    <Suspense fallback={LoadingFallbacks[fallbackType]()}>
      <LazyComponent {...props} />
    </Suspense>
  );

  // Preload if requested
  if (preload) {
    // Preload during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), 1000);
    }
  }

  if (cacheable) {
    componentCache.set(cacheKey, WrappedComponent);
  }

  return WrappedComponent;
};

/**
 * Blog-specific lazy components
 */
export const LazyBlogComponents = {
  // Blog pages
  BlogIndex: createLazyComponent(
    () => import('../pages/BlogIndex.jsx'),
    'page',
    { preload: true }
  ),

  BlogPost: createLazyComponent(
    () => import('../pages/BlogPost.jsx'),
    'page'
  ),

  BlogCategory: createLazyComponent(
    () => import('../pages/BlogCategory.jsx'),
    'page'
  ),

  // Blog components
  BlogCard: createLazyComponent(
    () => import('../components/blog/BlogCard.jsx'),
    'card'
  ),

  CategoryFilter: createLazyComponent(
    () => import('../components/blog/CategoryFilter.jsx'),
    'minimal'
  ),

  OptimizedImage: createLazyComponent(
    () => import('../components/blog/OptimizedImage.jsx'),
    'image'
  ),

  // Heavy components that should be lazy loaded
  BlogEditor: createLazyComponent(
    () => import('../components/blog/BlogEditor.jsx'),
    'page'
  ),

  BlogSearch: createLazyComponent(
    () => import('../components/blog/BlogSearch.jsx'),
    'minimal'
  )
};

/**
 * Route-based lazy loading with preloading
 */
export const lazyRoute = (importFn, options = {}) => {
  return createLazyComponent(importFn, 'page', {
    preload: false,
    ...options
  });
};

/**
 * Preload blog routes based on user behavior
 */
export const preloadBlogRoutes = () => {
  const routes = {
    '/blog': () => import('../pages/BlogIndex.jsx'),
    '/blog/categoria': () => import('../pages/BlogCategory.jsx')
  };

  // Preload critical routes during idle time
  Object.entries(routes).forEach(([path, importFn]) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), Math.random() * 2000 + 1000);
    }
  });
};

/**
 * Preload based on link hover (prefetch on hover)
 */
export const setupHoverPreload = () => {
  const preloadedRoutes = new Set();
  
  const handleLinkHover = (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('/blog') || preloadedRoutes.has(href)) {
      return;
    }

    preloadedRoutes.add(href);

    // Map routes to import functions
    if (href === '/blog') {
      import('../pages/BlogIndex.jsx');
    } else if (href.includes('/blog/categoria')) {
      import('../pages/BlogCategory.jsx');
    } else if (href.includes('/blog/')) {
      import('../pages/BlogPost.jsx');
    }
  };

  // Add event listeners
  document.addEventListener('mouseover', handleLinkHover);
  
  // Cleanup function
  return () => {
    document.removeEventListener('mouseover', handleLinkHover);
  };
};

/**
 * Dynamic component loader with error boundaries
 */
export const loadComponent = async (componentName, fallback = null) => {
  try {
    if (LazyBlogComponents[componentName]) {
      return LazyBlogComponents[componentName];
    }

    // Dynamic import based on component name
    const module = await import(`../components/blog/${componentName}.jsx`);
    return module.default;
  } catch (error) {
    console.error(`[BlogLazyLoading] Failed to load component ${componentName}:`, error);
    
    if (fallback) {
      return fallback;
    }

    // Return error component
    return () => (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-700 text-sm">
          Erro ao carregar componente: {componentName}
        </p>
      </div>
    );
  }
};

/**
 * Bundle analyzer helper for development
 */
export const getBundleInfo = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return {
    cachedComponents: componentCache.size,
    availableComponents: Object.keys(LazyBlogComponents),
    loadingFallbacks: Object.keys(LoadingFallbacks)
  };
};

/**
 * Performance monitoring for lazy loading
 */
class LazyLoadingMonitor {
  constructor() {
    this.metrics = {
      loadTimes: new Map(),
      failures: new Map(),
      cacheHits: 0,
      cacheMisses: 0
    };
  }

  recordLoadTime(component, startTime) {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    if (!this.metrics.loadTimes.has(component)) {
      this.metrics.loadTimes.set(component, []);
    }
    
    this.metrics.loadTimes.get(component).push(loadTime);
  }

  recordFailure(component, error) {
    if (!this.metrics.failures.has(component)) {
      this.metrics.failures.set(component, []);
    }
    
    this.metrics.failures.get(component).push({
      error: error.message,
      timestamp: Date.now()
    });
  }

  getMetrics() {
    const avgLoadTimes = {};
    
    for (const [component, times] of this.metrics.loadTimes) {
      avgLoadTimes[component] = times.reduce((a, b) => a + b, 0) / times.length;
    }

    return {
      averageLoadTimes: avgLoadTimes,
      failures: Object.fromEntries(this.metrics.failures),
      cacheStats: {
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses,
        hitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100
      }
    };
  }
}

export const lazyLoadingMonitor = new LazyLoadingMonitor();

// Auto-setup on module load
if (typeof window !== 'undefined') {
  // Setup hover preloading
  let cleanup = null;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      cleanup = setupHoverPreload();
    });
  } else {
    cleanup = setupHoverPreload();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (cleanup) cleanup();
  });
}

export default {
  LazyBlogComponents,
  lazyRoute,
  preloadBlogRoutes,
  loadComponent,
  getBundleInfo,
  lazyLoadingMonitor
};