/**
 * Advanced Critical CSS Plugin for Vite
 * Extracts above-the-fold CSS specifically for mobile performance
 * Eliminates render-blocking CSS without FOUC
 */

import fs from 'fs';
import path from 'path';

/**
 * Minimal Critical CSS classes - ONLY above-the-fold essentials
 * Optimized for immediate viewport rendering without layout shift
 */
const MOBILE_CRITICAL_CLASSES = [
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
 * Now integrates with SSG post-processing
 */
export function createCriticalCssPlugin() {
  return {
    name: 'vite-critical-css-mobile',
    
    configResolved(config) {
      this.isProduction = config.command === 'build';
    },
    
    // Remove transformIndexHtml as SSG plugin handles HTML processing
    // Keep only bundle processing for development insights
    
    generateBundle(options, bundle) {
      if (!this.isProduction) return;
      
      // Analyze CSS files for optimization insights
      for (const fileName in bundle) {
        if (fileName.endsWith('.css')) {
          const cssBundle = bundle[fileName];
          
          if (cssBundle.type === 'asset') {
            const cssSize = Buffer.byteLength(cssBundle.source, 'utf-8');
            console.log(`📊 CSS Bundle Analysis: ${fileName} (${(cssSize/1024).toFixed(1)}KB)`);
            
            // Log if CSS is too large for optimal performance
            if (cssSize > 150000) { // 150KB threshold
              console.warn(`⚠️  Large CSS detected: ${fileName} - Will be loaded asynchronously`);
            }
          }
        }
      }
    },
    
    // New: writeBundle hook for additional processing coordination
    writeBundle: {
      sequential: true,
      order: 'pre', // Run before SSG plugin
      handler: async function(options, bundle) {
        // Prepare for SSG post-processing
        console.log('🎨 Critical CSS plugin: Preparing for SSG post-processing...');
        
        // Create a manifest of CSS files for SSG plugin
        const cssFiles = Object.keys(bundle)
          .filter(fileName => fileName.endsWith('.css'))
          .map(fileName => ({
            fileName,
            size: Buffer.byteLength(bundle[fileName].source, 'utf-8'),
            isMain: fileName.includes('app-') // Main app CSS
          }));
        
        if (cssFiles.length > 0) {
          console.log('📝 CSS Files for async loading:', cssFiles.map(f => f.fileName));
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