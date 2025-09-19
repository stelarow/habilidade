/**
 * Utility for managing critical CSS and async CSS loading
 * This eliminates render-blocking CSS and improves First Contentful Paint
 */

// Critical CSS classes - ONLY above-the-fold essentials for immediate render
// Optimized for minimal set (~2KB target)
export const criticalCssClasses = [
  // Essential layout (header + hero only)
  'fixed', 'top-0', 'w-full', 'z-50', 'flex', 'flex-col',
  'items-center', 'justify-center', 'justify-between',
  'h-16', 'min-h-screen', 'max-w-7xl', 'mx-auto', 'px-4',

  // Header critical styles
  'bg-zinc-900/70', 'backdrop-blur-md', 'border-b', 'border-gray-800/50',

  // Hero critical styles
  'bg-zinc-950', 'text-center', 'text-white', 'text-purple-400',
  'text-zinc-300', 'font-bold', 'font-extrabold',
  'text-3xl', 'text-5xl', 'text-7xl', 'text-lg',
  'pt-20', 'mb-10', 'mb-2', 'mb-6', 'leading-relaxed',
  'tracking-tight', 'tracking-wide',

  // Critical button styles
  'px-6', 'py-3', 'rounded-lg', 'bg-gradient-to-r',
  'from-purple-600', 'to-blue-600',

  // Anti-FOUC
  'fouc-prevent', 'fouc-ready'
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
 * Mobile-first critical CSS initialization
 * Optimized for mobile performance and Core Web Vitals
 * Now works with SSG Critical CSS plugin
 */
export const initCriticalCss = () => {
  // Optimize font loading for mobile
  optimizeFontLoading();
  
  // Mobile-specific optimizations
  if (window.innerWidth <= 768) {
    // Disable smooth scrolling on mobile for better performance
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Optimize touch interactions
    document.body.style.touchAction = 'manipulation';
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
  
  // Enhanced FOUC management for SSG
  if (document.documentElement.classList.contains('fouc-prevent')) {
    // Critical CSS is inline, ready for transition
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('fouc-prevent');
      document.documentElement.classList.add('fouc-ready');
    });
  }
  
  // Load non-critical CSS chunks after critical render
  setTimeout(() => {
    const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"][data-async]');
    preloadLinks.forEach(link => {
      if (link.onload) {
        link.onload(); // Trigger CSS activation
      }
    });
  }, 100); // Quick activation for better UX
  
  // Mark critical CSS as loaded
  document.documentElement.setAttribute('data-critical-loaded', 'true');
  
  // Performance mark for monitoring
  if (window.performance && window.performance.mark) {
    window.performance.mark('critical-css-ready');
  }
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