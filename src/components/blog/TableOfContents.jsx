/**
 * Table of Contents (TOC) Component
 * Auto-generates TOC from article headers with smooth scroll navigation
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { List, CaretDown, CaretRight, Hash } from 'phosphor-react';
import { combineClasses } from '../../utils/blogTheme';

/**
 * Extract headers from HTML content or DOM element
 * @param {string|HTMLElement} content - HTML content or DOM element
 * @returns {Array} Array of header objects
 */
const extractHeaders = (content) => {
  let element;
  
  if (typeof content === 'string') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    element = tempDiv;
  } else if (content instanceof HTMLElement) {
    element = content;
  } else {
    return [];
  }
  
  const headers = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  return Array.from(headers).map((header, index) => {
    const level = parseInt(header.tagName.charAt(1));
    const text = header.textContent?.trim() || '';
    const slug = generateSlug(text, index);
    
    // Add ID to header if it doesn't have one
    if (!header.id) {
      header.id = slug;
    }
    
    return {
      level,
      text,
      slug: header.id || slug,
      element: header
    };
  }).filter(header => header.text.length > 0);
};

/**
 * Generate URL-friendly slug from text
 * @param {string} text - Header text
 * @param {number} index - Fallback index
 * @returns {string} URL slug
 */
const generateSlug = (text, index) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .trim('-') || `header-${index}`;
};

/**
 * TOC Item Component
 */
const TOCItem = ({ header, isActive, onClick, isCollapsed }) => {
  const indentLevel = Math.max(0, header.level - 1);
  const indentClass = `ml-${Math.min(indentLevel * 4, 12)}`;
  
  return (
    <li className={`toc-item level-${header.level}`}>
      <button
        onClick={() => onClick(header)}
        className={combineClasses(
          'w-full text-left py-2 px-3 rounded-md transition-all duration-200 group flex items-center gap-2',
          'hover:bg-zinc-700/50 focus:bg-zinc-700/50 focus:outline-none',
          isActive 
            ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-500' 
            : 'text-zinc-400 hover:text-zinc-300',
          indentClass
        )}
        title={header.text}
      >
        <Hash 
          size={14} 
          className={combineClasses(
            'flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity',
            isActive && 'opacity-100'
          )}
        />
        <span className={combineClasses(
          'truncate text-sm leading-relaxed',
          header.level === 1 && 'font-semibold',
          header.level === 2 && 'font-medium',
          header.level >= 3 && 'font-normal'
        )}>
          {header.text}
        </span>
      </button>
    </li>
  );
};

/**
 * Main Table of Contents Component
 */
const TableOfContents = ({ 
  content = null, 
  containerSelector = null,
  className = '',
  title = 'Índice',
  collapsible = true,
  initiallyCollapsed = false,
  minHeaders = 3,
  maxLevel = 6,
  offsetTop = 100,
  smoothScroll = true,
  updateUrlHash = true,
  showProgress = false,
  mobileBreakpoint = 768
}) => {
  const [headers, setHeaders] = useState([]);
  const [activeHeader, setActiveHeader] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  
  const observerRef = useRef(null);
  const headersRef = useRef([]);
  const tocRef = useRef(null);

  /**
   * Check if device is mobile
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  /**
   * Extract headers from content or container
   */
  useEffect(() => {
    let extractedHeaders = [];
    
    if (content) {
      // Extract from HTML content
      extractedHeaders = extractHeaders(content);
    } else if (containerSelector) {
      // Extract from DOM container
      const container = document.querySelector(containerSelector);
      if (container) {
        extractedHeaders = extractHeaders(container);
      }
    } else {
      // Extract from article element or main content
      const article = document.querySelector('article') || 
                    document.querySelector('main') ||
                    document.querySelector('.blog-content');
      if (article) {
        extractedHeaders = extractHeaders(article);
      }
    }
    
    // Filter by max level and minimum count
    const filteredHeaders = extractedHeaders.filter(h => h.level <= maxLevel);
    
    if (filteredHeaders.length >= minHeaders) {
      setHeaders(filteredHeaders);
      headersRef.current = filteredHeaders;
    } else {
      setHeaders([]);
      headersRef.current = [];
    }
  }, [content, containerSelector, maxLevel, minHeaders]);

  /**
   * Set up intersection observer for active header tracking
   */
  useEffect(() => {
    if (headers.length === 0) return;

    const observerOptions = {
      rootMargin: `-${offsetTop}px 0px -80% 0px`,
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const visibleHeaders = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => {
          const header = headersRef.current.find(h => h.element === entry.target);
          return { header, ratio: entry.intersectionRatio };
        })
        .filter(item => item.header);

      if (visibleHeaders.length > 0) {
        // Get the header with the highest intersection ratio
        const mostVisible = visibleHeaders.reduce((prev, current) => 
          prev.ratio > current.ratio ? prev : current
        );
        setActiveHeader(mostVisible.header.slug);
        
        if (updateUrlHash && mostVisible.header.slug) {
          const newUrl = `${window.location.pathname}${window.location.search}#${mostVisible.header.slug}`;
          window.history.replaceState(null, '', newUrl);
        }
      }
    }, observerOptions);

    // Observe all headers
    headers.forEach(header => {
      if (header.element) {
        observerRef.current.observe(header.element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headers, offsetTop, updateUrlHash]);

  /**
   * Reading progress calculation
   */
  useEffect(() => {
    if (!showProgress || headers.length === 0) return;

    const calculateProgress = () => {
      const article = document.querySelector('article') || 
                    document.querySelector('.blog-content') || 
                    document.querySelector('main');
      
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const articleHeight = rect.height;
      const articleTop = rect.top;

      if (articleTop > windowHeight) {
        setReadingProgress(0);
      } else if (articleTop + articleHeight < 0) {
        setReadingProgress(100);
      } else {
        const visibleHeight = Math.min(windowHeight - Math.max(articleTop, 0), articleHeight);
        const progress = (visibleHeight / articleHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    calculateProgress();
    window.addEventListener('scroll', calculateProgress);
    window.addEventListener('resize', calculateProgress);

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [showProgress, headers]);

  /**
   * Handle header click - smooth scroll to section
   */
  const handleHeaderClick = useCallback((header) => {
    if (!header.element) return;

    const yOffset = -offsetTop;
    const y = header.element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    if (smoothScroll) {
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo(0, y);
    }

    // Update URL hash immediately
    if (updateUrlHash) {
      const newUrl = `${window.location.pathname}${window.location.search}#${header.slug}`;
      window.history.pushState(null, '', newUrl);
    }

    // Close TOC on mobile after clicking
    if (isMobile && collapsible) {
      setIsCollapsed(true);
    }
  }, [offsetTop, smoothScroll, updateUrlHash, isMobile, collapsible]);

  /**
   * Toggle collapse state
   */
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Don't render if no headers
  if (headers.length === 0) {
    return null;
  }

  const tocContent = (
    <div className={combineClasses(
      'toc-container bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-700/50">
        <div className="flex items-center gap-3">
          <List size={18} className="text-zinc-400" />
          <h3 className="font-semibold text-zinc-200 text-sm">{title}</h3>
          {showProgress && (
            <span className="text-xs text-zinc-500">
              {Math.round(readingProgress)}%
            </span>
          )}
        </div>
        
        {collapsible && (
          <button
            onClick={toggleCollapse}
            className="p-1 text-zinc-400 hover:text-zinc-300 transition-colors"
            aria-label={isCollapsed ? 'Expandir Índice' : 'Recolher Índice'}
          >
            {isCollapsed ? <CaretRight size={16} /> : <CaretDown size={16} />}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && !isCollapsed && (
        <div className="px-4 py-2 border-b border-zinc-700/50">
          <div className="w-full bg-zinc-700 rounded-full h-1">
            <div 
              className="bg-purple-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* TOC List - Implementação da solução recomendada */}
      {!isCollapsed && (
        <nav 
          className={`toc-nav p-2 ${
            isMobile 
              ? 'max-h-[50vh] overflow-y-auto' 
              : 'max-h-[calc(100vh-200px)] overflow-visible'
          }`} 
          role="navigation" 
          aria-label="Índice do artigo"
          style={{
            // Custom scrollbar styling para quando necessário no mobile
            scrollbarWidth: 'thin',
            scrollbarColor: '#4A5568 #2D3748'
          }}
        >
          <style jsx>{`
            .toc-nav::-webkit-scrollbar {
              width: 4px;
            }
            .toc-nav::-webkit-scrollbar-track {
              background: #2D3748;
              border-radius: 2px;
            }
            .toc-nav::-webkit-scrollbar-thumb {
              background: #4A5568;
              border-radius: 2px;
            }
            .toc-nav::-webkit-scrollbar-thumb:hover {
              background: #718096;
            }
          `}</style>
          <ul className="space-y-1">
            {headers.map((header, index) => (
              <TOCItem
                key={`${header.slug}-${index}`}
                header={header}
                isActive={activeHeader === header.slug}
                onClick={handleHeaderClick}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </nav>
      )}
    </div>
  );

  // Mobile rendering (can be dropdown or overlay)
  if (isMobile) {
    return (
      <div className={combineClasses(
        'toc-mobile sticky top-20 z-30 mb-6',
        className
      )}>
        {tocContent}
      </div>
    );
  }

  // Desktop rendering (sticky sidebar)
  return (
    <div 
      ref={tocRef}
      className={combineClasses(
        'toc-desktop sticky top-24 max-h-[calc(100vh-6rem)]',
        className
      )}
    >
      {tocContent}
    </div>
  );
};

export default TableOfContents;