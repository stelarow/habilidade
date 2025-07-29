/**
 * useSEO Hook - Dynamic SEO Management
 * Provides comprehensive SEO management with caching and validation
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  generateMetaTags, 
  generateStructuredData, 
  generateCanonicalUrl,
  sanitizeTitle,
  truncateDescription,
  validateSEO,
  generateBreadcrumbStructuredData,
  extractKeywords
} from '../utils/seoUtils';

// SEO cache to prevent redundant operations
const seoCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Main useSEO hook for dynamic SEO management
 * @param {Object} seoData - SEO configuration object
 * @param {Object} options - Hook options
 * @returns {Object} SEO utilities and state
 */
export const useSEO = (seoData = {}, options = {}) => {
  const location = useLocation();
  const [seoState, setSeoState] = useState({
    isValid: true,
    issues: [],
    warnings: [],
    score: 100
  });
  
  const {
    enableCache = true,
    enableValidation = true,
    autoUpdateTitle = true,
    enableMetrics = false
  } = options;

  const cacheKey = useRef(null);
  const metricsRef = useRef({
    renderCount: 0,
    lastUpdate: null,
    cacheHits: 0,
    cacheMisses: 0
  });

  // Increment render count for metrics
  useEffect(() => {
    if (enableMetrics) {
      metricsRef.current.renderCount++;
      metricsRef.current.lastUpdate = new Date().toISOString();
    }
  });

  /**
   * Generate cache key based on current data
   */
  const generateCacheKey = useCallback((data) => {
    const keyData = {
      pathname: location.pathname,
      title: data.title,
      description: data.description,
      type: data.type || 'website'
    };
    return btoa(JSON.stringify(keyData));
  }, [location.pathname]);

  /**
   * Get cached SEO data if available and fresh
   */
  const getCachedSEO = useCallback((key) => {
    if (!enableCache) return null;
    
    const cached = seoCache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
    if (isExpired) {
      seoCache.delete(key);
      return null;
    }
    
    if (enableMetrics) {
      metricsRef.current.cacheHits++;
    }
    
    return cached.data;
  }, [enableCache, enableMetrics]);

  /**
   * Cache SEO data
   */
  const cacheSEO = useCallback((key, data) => {
    if (!enableCache) return;
    
    seoCache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Limit cache size
    if (seoCache.size > 50) {
      const firstKey = seoCache.keys().next().value;
      seoCache.delete(firstKey);
    }
  }, [enableCache]);

  /**
   * Process and optimize SEO data
   */
  const processSEOData = useCallback((rawData) => {
    const processed = {
      title: sanitizeTitle(rawData.title),
      description: truncateDescription(rawData.description || rawData.excerpt),
      url: rawData.url || location.pathname,
      image: rawData.image || rawData.featured_image_url,
      type: rawData.type || 'website',
      publishedDate: rawData.publishedDate || rawData.created_at,
      modifiedDate: rawData.modifiedDate || rawData.updated_at,
      author: rawData.author || rawData.author_name,
      keywords: rawData.keywords || rawData.tags?.join(', ') || '',
      category: rawData.category,
      tags: rawData.tags || [],
      readingTime: rawData.readingTime,
      content: rawData.content
    };
    
    // Auto-extract keywords if not provided and content exists
    if (!processed.keywords && processed.content) {
      const extractedKeywords = extractKeywords(processed.content, { maxKeywords: 5 });
      processed.keywords = extractedKeywords.join(', ');
    }
    
    return processed;
  }, [location.pathname]);

  /**
   * Generate complete SEO package
   */
  const generateSEOPackage = useCallback((data) => {
    const processed = processSEOData(data);
    
    return {
      processed,
      metaTags: generateMetaTags({
        title: processed.title,
        description: processed.description,
        url: processed.url,
        image: processed.image,
        type: processed.type,
        publishedTime: processed.publishedDate,
        modifiedTime: processed.modifiedDate,
        author: processed.author,
        section: processed.category,
        tags: processed.tags
      }),
      structuredData: generateStructuredData({
        title: processed.title,
        description: processed.description,
        url: processed.url,
        image: processed.image,
        author: processed.author,
        publishedDate: processed.publishedDate,
        modifiedDate: processed.modifiedDate,
        category: processed.category,
        tags: processed.tags,
        readingTime: processed.readingTime
      }),
      canonicalUrl: generateCanonicalUrl(processed.url),
      breadcrumbData: data.breadcrumbs ? generateBreadcrumbStructuredData(data.breadcrumbs) : null
    };
  }, [processSEOData]);

  /**
   * Update document head with SEO data
   */
  const updateDocumentHead = useCallback((seoPackage) => {
    const { metaTags, structuredData, canonicalUrl, breadcrumbData } = seoPackage;
    
    // Update title
    if (autoUpdateTitle && metaTags.title) {
      document.title = metaTags.title;
    }
    
    // Update meta tags
    Object.entries(metaTags).forEach(([name, content]) => {
      if (!content) return;
      
      let selector, attribute;
      if (name.startsWith('og:') || name.startsWith('article:')) {
        selector = `meta[property="${name}"]`;
        attribute = 'property';
      } else if (name.startsWith('twitter:')) {
        selector = `meta[name="${name}"]`;
        attribute = 'name';
      } else {
        selector = `meta[name="${name}"]`;
        attribute = 'name';
      }
      
      let metaTag = document.querySelector(selector);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute(attribute, name);
        document.head.appendChild(metaTag);
      }
      metaTag.content = content;
    });
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
    
    // Update structured data
    const updateStructuredData = (data, id) => {
      if (!data) return;
      
      let scriptTag = document.querySelector(`script[data-seo="${id}"]`);
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.setAttribute('data-seo', id);
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(data);
    };
    
    updateStructuredData(structuredData, 'article');
    updateStructuredData(breadcrumbData, 'breadcrumbs');
    
  }, [autoUpdateTitle]);

  /**
   * Main effect - process SEO data and update head
   */
  useEffect(() => {
    const currentCacheKey = generateCacheKey(seoData);
    cacheKey.current = currentCacheKey;
    
    // Try to get from cache first
    const cachedSEO = getCachedSEO(currentCacheKey);
    if (cachedSEO) {
      updateDocumentHead(cachedSEO);
      if (enableValidation) {
        setSeoState(validateSEO(cachedSEO.processed));
      }
      return;
    }
    
    // Generate new SEO package
    if (enableMetrics) {
      metricsRef.current.cacheMisses++;
    }
    
    const seoPackage = generateSEOPackage(seoData);
    
    // Cache the result
    cacheSEO(currentCacheKey, seoPackage);
    
    // Update document head
    updateDocumentHead(seoPackage);
    
    // Validate SEO if enabled
    if (enableValidation) {
      const validation = validateSEO(seoPackage.processed);
      setSeoState(validation);
    }
    
  }, [
    seoData, 
    generateCacheKey, 
    getCachedSEO, 
    cacheSEO, 
    generateSEOPackage, 
    updateDocumentHead,
    enableValidation,
    enableMetrics
  ]);

  /**
   * Clear SEO cache manually
   */
  const clearCache = useCallback(() => {
    seoCache.clear();
    if (enableMetrics) {
      metricsRef.current.cacheHits = 0;
      metricsRef.current.cacheMisses = 0;
    }
  }, [enableMetrics]);

  /**
   * Get current metrics
   */
  const getMetrics = useCallback(() => {
    if (!enableMetrics) return null;
    
    return {
      ...metricsRef.current,
      cacheSize: seoCache.size,
      hitRate: metricsRef.current.cacheHits / 
        (metricsRef.current.cacheHits + metricsRef.current.cacheMisses) || 0
    };
  }, [enableMetrics]);

  /**
   * Validate current SEO manually
   */
  const validateCurrentSEO = useCallback(() => {
    const currentKey = generateCacheKey(seoData);
    const cached = getCachedSEO(currentKey);
    
    if (cached) {
      return validateSEO(cached.processed);
    }
    
    const seoPackage = generateSEOPackage(seoData);
    return validateSEO(seoPackage.processed);
  }, [seoData, generateCacheKey, getCachedSEO, generateSEOPackage]);

  return {
    // SEO state
    seoState,
    isValid: seoState.isValid,
    issues: seoState.issues,
    warnings: seoState.warnings,
    score: seoState.score,
    
    // Utilities
    clearCache,
    validateSEO: validateCurrentSEO,
    getMetrics,
    
    // Raw functions for manual use
    generateMetaTags,
    generateStructuredData,
    generateCanonicalUrl,
    sanitizeTitle,
    truncateDescription
  };
};

/**
 * usePageSEO - Simplified hook for basic page SEO
 * @param {Object} pageData - Basic page data
 * @returns {Object} SEO state
 */
export const usePageSEO = (pageData = {}) => {
  return useSEO(pageData, {
    enableCache: true,
    enableValidation: false,
    autoUpdateTitle: true
  });
};

/**
 * useArticleSEO - Specialized hook for blog articles
 * @param {Object} articleData - Article data
 * @returns {Object} SEO state with article-specific features
 */
export const useArticleSEO = (articleData = {}) => {
  const location = useLocation();
  
  const seoData = {
    ...articleData,
    type: 'article',
    url: articleData.url || `/blog/${articleData.slug}` || location.pathname
  };
  
  return useSEO(seoData, {
    enableCache: true,
    enableValidation: true,
    autoUpdateTitle: true,
    enableMetrics: true
  });
};

export default useSEO;