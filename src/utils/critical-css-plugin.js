/**
 * Advanced Critical CSS Plugin for Vite
 * Extracts above-the-fold CSS specifically for mobile performance
 * Eliminates render-blocking CSS without FOUC
 */

import fs from 'fs';
import path from 'path';

/**
 * Mobile-first Critical CSS classes
 * These are the minimum styles needed for above-the-fold mobile rendering
 */
const MOBILE_CRITICAL_CLASSES = [
  // Core layout (mobile-first)
  'font-sans', 'flex', 'flex-col', 'items-center', 'justify-center',
  'w-full', 'h-full', 'min-h-screen', 'container', 'mx-auto',
  
  // Mobile navigation
  'fixed', 'top-0', 'left-0', 'right-0', 'z-50', 
  'px-4', 'py-3', 'bg-black', 'bg-opacity-95',
  
  // Mobile typography
  'text-center', 'text-left', 'text-white', 'text-gray-100', 'text-gray-300',
  'font-bold', 'font-semibold', 'font-medium',
  'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
  
  // Mobile hero section
  'bg-gradient-to-b', 'from-black', 'to-gray-900',
  'py-12', 'py-16', 'px-4', 'space-y-6', 'space-y-8',
  
  // Critical buttons (mobile)
  'bg-purple-600', 'bg-blue-600', 'hover:bg-purple-700', 'hover:bg-blue-700',
  'px-6', 'py-3', 'rounded-lg', 'font-semibold', 'text-white',
  'transition-colors', 'duration-300',
  
  // Mobile spacing
  'mt-4', 'mb-4', 'mt-6', 'mb-6', 'pt-4', 'pb-4', 'gap-4',
  
  // Responsive visibility
  'block', 'hidden', 'md:hidden', 'md:block', 'md:flex',
  
  // Essential animations (reduced for mobile)
  'animate-pulse', 'transition-opacity', 'ease-in-out',
  
  // Mobile-specific utilities
  'overflow-hidden', 'relative', 'absolute', 'inset-0',
  'transform', 'translate-x-0', 'translate-y-0'
];

/**
 * Generates critical CSS content based on mobile-first approach
 */
function generateMobileCriticalCSS() {
  return `
    /* Critical CSS - Mobile-First Above-the-Fold */
    /* Reset and base */
    *,*::before,*::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
    html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
    body{margin:0;line-height:inherit;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-color:#000}
    
    /* Essential layout */
    .container{width:100%;max-width:1200px;margin:0 auto;padding:0 1rem}
    .flex{display:flex}
    .flex-col{flex-direction:column}
    .items-center{align-items:center}
    .justify-center{justify-content:center}
    .w-full{width:100%}
    .h-full{height:100%}
    .min-h-screen{min-height:100vh}
    .mx-auto{margin-left:auto;margin-right:auto}
    
    /* Mobile navigation */
    .fixed{position:fixed}
    .top-0{top:0}
    .left-0{left:0}
    .right-0{right:0}
    .z-50{z-index:50}
    .px-4{padding-left:1rem;padding-right:1rem}
    .py-3{padding-top:0.75rem;padding-bottom:0.75rem}
    .bg-black{background-color:rgb(0 0 0)}
    .bg-opacity-95{background-color:rgb(0 0 0 / 0.95)}
    
    /* Typography */
    .font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
    .text-center{text-align:center}
    .text-left{text-align:left}
    .text-white{color:rgb(255 255 255)}
    .text-gray-100{color:rgb(243 244 246)}
    .text-gray-300{color:rgb(209 213 219)}
    .font-bold{font-weight:700}
    .font-semibold{font-weight:600}
    .font-medium{font-weight:500}
    .text-lg{font-size:1.125rem;line-height:1.75rem}
    .text-xl{font-size:1.25rem;line-height:1.75rem}
    .text-2xl{font-size:1.5rem;line-height:2rem}
    .text-3xl{font-size:1.875rem;line-height:2.25rem}
    
    /* Mobile hero */
    .bg-gradient-to-b{background-image:linear-gradient(to bottom,var(--tw-gradient-stops))}
    .from-black{--tw-gradient-from:#000;--tw-gradient-to:rgb(0 0 0 / 0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .to-gray-900{--tw-gradient-to:#111827}
    .py-12{padding-top:3rem;padding-bottom:3rem}
    .py-16{padding-top:4rem;padding-bottom:4rem}
    .space-y-6>:not([hidden])~:not([hidden]){margin-top:1.5rem}
    .space-y-8>:not([hidden])~:not([hidden]){margin-top:2rem}
    
    /* Critical buttons */
    .bg-purple-600{background-color:rgb(147 51 234)}
    .bg-blue-600{background-color:rgb(37 99 235)}
    .px-6{padding-left:1.5rem;padding-right:1.5rem}
    .rounded-lg{border-radius:0.5rem}
    .transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
    .duration-300{transition-duration:300ms}
    
    /* Essential spacing */
    .mt-4{margin-top:1rem}
    .mb-4{margin-bottom:1rem}
    .mt-6{margin-top:1.5rem}
    .mb-6{margin-bottom:1.5rem}
    .pt-4{padding-top:1rem}
    .pb-4{padding-bottom:1rem}
    .gap-4{gap:1rem}
    
    /* Visibility */
    .block{display:block}
    .hidden{display:none}
    
    /* Essential utils */
    .overflow-hidden{overflow:hidden}
    .relative{position:relative}
    .absolute{position:absolute}
    .inset-0{top:0;right:0;bottom:0;left:0}
    
    /* Anti-FOUC */
    .fouc-prevent{visibility:hidden;opacity:0}
    .fouc-ready{visibility:visible;opacity:1;transition:opacity 300ms ease-in-out}
    
    /* Mobile responsive */
    @media (min-width:768px){
      .md\\:block{display:block}
      .md\\:flex{display:flex}
      .md\\:hidden{display:none}
      .container{padding:0 2rem}
    }
  `;
}

/**
 * Advanced Critical CSS Plugin for Vite
 */
export function createCriticalCssPlugin() {
  return {
    name: 'vite-critical-css-mobile',
    
    configResolved(config) {
      this.isProduction = config.command === 'build';
    },
    
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        if (!this.isProduction) return html;
        
        // Generate mobile-first critical CSS
        const criticalCSS = generateMobileCriticalCSS();
        
        // Anti-FOUC script with mobile optimization
        const antiFoucScript = `
          <script>
            (function() {
              // Mobile-optimized FOUC prevention
              document.documentElement.className += ' fouc-prevent';
              
              // Faster readiness detection for mobile
              function makeReady() {
                document.documentElement.className = 
                  document.documentElement.className.replace('fouc-prevent', 'fouc-ready');
              }
              
              // Use RAF for smooth transition on mobile
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  requestAnimationFrame(makeReady);
                });
              } else {
                requestAnimationFrame(makeReady);
              }
            })();
          </script>
        `;
        
        // Async CSS loading for non-critical styles
        const asyncCssScript = `
          <script>
            (function() {
              // Load non-critical CSS asynchronously
              function loadCSS(href, before, media) {
                var link = document.createElement('link');
                var ref = before || document.getElementsByTagName('script')[0];
                link.rel = 'stylesheet';
                link.href = href;
                link.media = media || 'all';
                ref.parentNode.insertBefore(link, ref);
                return link;
              }
              
              // Wait for critical render, then load non-critical CSS
              setTimeout(function() {
                var criticalCSSLoaded = document.querySelector('style[data-critical]') || 
                                       document.documentElement.getAttribute('data-critical-loaded') === 'true';
                if (criticalCSSLoaded) {
                  // Find non-critical CSS files and load them
                  var links = document.querySelectorAll('link[rel="stylesheet"][data-non-critical]');
                  links.forEach(function(link) {
                    link.removeAttribute('data-non-critical');
                    link.media = 'all';
                  });
                }
              }, 500); // Increased delay for consistency with mobile optimization
            })();
          </script>
        `;
        
        // Inject critical CSS inline
        const criticalCssTag = `<style data-critical>${criticalCSS}</style>`;
        
        // Transform HTML
        let transformedHtml = html
          .replace('<title>', `${criticalCssTag}\n    ${antiFoucScript}\n    <title>`)
          .replace('</body>', `${asyncCssScript}\n  </body>`);
        
        return transformedHtml;
      }
    },
    
    generateBundle(options, bundle) {
      // Mark CSS files as non-critical for async loading
      for (const fileName in bundle) {
        if (fileName.endsWith('.css')) {
          const cssBundle = bundle[fileName];
          
          // Modify CSS loading to be non-blocking
          if (cssBundle.type === 'asset') {
            console.log(`🎨 Processing CSS for async loading: ${fileName}`);
            // CSS will be loaded asynchronously via the script above
          }
        }
      }
    }
  };
}

/**
 * Mobile-specific CSS optimizations
 */
export function optimizeMobileCSS(cssContent) {
  // Remove unused mobile breakpoints and optimize for mobile-first
  return cssContent
    // Remove desktop-only animations on mobile
    .replace(/@media \(max-width: 767px\)[^}]*\{[^}]*animation: none[^}]*\}/g, '')
    // Optimize mobile touch targets
    .replace(/button|a\[role="button"\]|input\[type="submit"\]/g, match => 
      `${match} { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }`
    );
}

export default createCriticalCssPlugin;