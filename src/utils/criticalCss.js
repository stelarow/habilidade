/**
 * Utility for managing critical CSS and async CSS loading
 * This eliminates render-blocking CSS and improves First Contentful Paint
 */

// Critical CSS classes that are needed immediately for above-the-fold content
export const criticalCssClasses = [
  // Layout essentials
  'flex', 'flex-col', 'flex-row', 'justify-center', 'items-center',
  'w-full', 'h-full', 'min-h-screen', 'container', 'mx-auto',
  
  // Header and navigation
  'fixed', 'top-0', 'z-50', 'bg-white', 'shadow-md',
  'px-4', 'py-2', 'md:px-6', 'lg:px-8',
  
  // Typography essentials
  'text-center', 'text-left', 'text-white', 'text-gray-900', 'text-gray-700',
  'font-bold', 'font-semibold', 'text-xl', 'text-2xl', 'text-3xl',
  
  // Button and CTA essentials
  'bg-blue-600', 'bg-green-600', 'hover:bg-blue-700', 'hover:bg-green-700',
  'text-white', 'px-6', 'py-3', 'rounded-lg', 'font-semibold',
  
  // Basic spacing
  'mt-4', 'mb-4', 'pt-8', 'pb-8', 'space-y-4', 'gap-4',
  
  // Responsive utilities
  'block', 'hidden', 'md:block', 'md:hidden', 'md:flex',
  
  // Hero section essentials
  'bg-gradient-to-r', 'from-blue-600', 'to-purple-600',
  'py-20', 'px-4', 'text-center'
];

/**
 * Loads CSS files asynchronously to prevent render blocking
 * @param {string} href - CSS file URL
 * @param {string} id - Unique identifier for the CSS link
 */
export const loadCssAsync = (href, id = null) => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (id && document.getElementById(id)) {
      resolve();
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    if (id) link.id = id;
    
    // Use print media trick for non-blocking load
    link.media = 'print';
    
    link.onload = () => {
      // Switch to all media once loaded
      link.media = 'all';
      resolve();
    };
    
    link.onerror = reject;
    
    // Insert before first stylesheet or in head
    const firstStylesheet = document.querySelector('link[rel="stylesheet"], style');
    if (firstStylesheet) {
      firstStylesheet.parentNode.insertBefore(link, firstStylesheet);
    } else {
      document.head.appendChild(link);
    }
    
    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const fallbackLink = link.cloneNode();
    fallbackLink.media = 'all';
    noscript.appendChild(fallbackLink);
    link.parentNode.insertBefore(noscript, link.nextSibling);
  });
};

/**
 * Preloads CSS files for faster subsequent loads
 * @param {string[]} hrefs - Array of CSS file URLs to preload
 */
export const preloadCss = (hrefs) => {
  hrefs.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
};

/**
 * Generates inline critical CSS based on above-the-fold content
 * This should be called during build time to extract critical styles
 */
export const generateCriticalCss = () => {
  // This is a simplified version - in production, use tools like Critical or Penthouse
  const criticalStyles = `
    /* Critical CSS - Above the fold styles */
    .container { max-width: 1200px; margin: 0 auto; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .text-center { text-align: center; }
    .font-bold { font-weight: 700; }
    .text-white { color: #ffffff; }
    .bg-blue-600 { background-color: #2563eb; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .fixed { position: fixed; }
    .top-0 { top: 0; }
    .w-full { width: 100%; }
    .z-50 { z-index: 50; }
    .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
  `;
  
  return criticalStyles;
};

/**
 * Optimizes font loading to prevent FOIT (Flash of Invisible Text)
 */
export const optimizeFontLoading = () => {
  // Create font display fallbacks
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Montserrat-fallback';
      src: local('Arial'), local('Helvetica');
      font-display: swap;
    }
    @font-face {
      font-family: 'Inter-fallback';
      src: local('Arial'), local('Helvetica');
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Main initialization function for critical CSS optimization
 */
export const initCriticalCss = () => {
  // Optimize font loading
  optimizeFontLoading();
  
  // Load non-critical CSS asynchronously
  const nonCriticalCss = [
    '/assets/css/blog-components.css',
    '/assets/css/course-animations.css'
  ];
  
  // Load after initial render
  requestIdleCallback(() => {
    nonCriticalCss.forEach(css => {
      loadCssAsync(css).catch(console.warn);
    });
  }, { timeout: 2000 });
};

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  // Load critical CSS optimizations after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCriticalCss);
  } else {
    initCriticalCss();
  }
}