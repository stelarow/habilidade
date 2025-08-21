/**
 * Utility for managing critical CSS and async CSS loading
 * This eliminates render-blocking CSS and improves First Contentful Paint
 */

// Critical CSS classes that are needed immediately for above-the-fold content
// Optimized for mobile-first, minimal set (~10KB target)
export const criticalCssClasses = [
  // Core layout (mobile-first)
  'font-sans', 'flex', 'flex-col', 'items-center', 'justify-center',
  'w-full', 'h-full', 'min-h-screen', 'container', 'mx-auto',
  
  // Mobile navigation essentials (black theme)
  'fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'z-40',
  'px-4', 'py-2', 'py-3', 'bg-black', 'bg-white', 'bg-opacity-95',
  
  // Hero section (critical for FCP)
  'bg-gradient-to-b', 'bg-gradient-to-r', 'from-black', 'to-gray-900',
  'from-purple-600', 'to-blue-600', 'py-16', 'py-20', 'text-center',
  
  // Essential typography (minimal set)
  'text-white', 'text-gray-100', 'text-gray-900', 'text-gray-700',
  'font-bold', 'font-semibold', 'font-medium',
  'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
  
  // Critical CTA buttons (above fold)
  'bg-purple-600', 'bg-blue-600', 'hover:bg-purple-700', 'hover:bg-blue-700',
  'px-6', 'py-3', 'rounded-lg', 'transition-colors', 'duration-300',
  
  // Essential spacing (mobile)
  'mt-4', 'mb-4', 'mt-6', 'mb-6', 'pt-4', 'pb-4', 
  'space-y-4', 'space-y-6', 'gap-4', 'gap-6',
  
  // Visibility/responsive (minimal)
  'block', 'hidden', 'md:block', 'md:hidden', 'md:flex',
  
  // Loading states (prevent CLS)
  'animate-pulse', 'animate-spin',
  'w-8', 'h-8', 'border-2', 'border-purple-500', 'border-t-transparent', 'rounded-full',
  
  // Essential utilities
  'overflow-hidden', 'relative', 'absolute', 'inset-0'
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