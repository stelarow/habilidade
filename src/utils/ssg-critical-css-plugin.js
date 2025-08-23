/**
 * SSG Critical CSS Plugin for Vite
 * Post-processes HTML files after SSG build to inject critical CSS inline
 * and make non-critical CSS non-blocking
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Essential mobile-first critical CSS classes
 * Optimized for above-the-fold content (~10KB target)
 */
const CRITICAL_CSS_CLASSES = [
  // Core layout (mobile-first)
  'font-sans', 'flex', 'flex-col', 'items-center', 'justify-center',
  'w-full', 'h-full', 'min-h-screen', 'container', 'mx-auto',
  
  // Mobile navigation essentials
  'fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'z-40',
  'px-4', 'py-2', 'py-3', 'bg-black', 'bg-white', 'bg-opacity-95',
  
  // Hero section (critical for FCP)
  'bg-gradient-to-b', 'bg-gradient-to-r', 'from-black', 'to-gray-900',
  'from-purple-600', 'to-blue-600', 'py-16', 'py-20', 'text-center',
  
  // Essential typography
  'text-white', 'text-gray-100', 'text-gray-900', 'text-gray-700',
  'font-bold', 'font-semibold', 'font-medium',
  'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
  
  // Critical buttons (CTA above fold)
  'bg-purple-600', 'bg-blue-600', 'hover:bg-purple-700', 'hover:bg-blue-700',
  'px-6', 'py-3', 'rounded-lg', 'transition-colors', 'duration-300',
  
  // Essential spacing (mobile)
  'mt-4', 'mb-4', 'mt-6', 'mb-6', 'pt-4', 'pb-4', 'space-y-4', 'space-y-6',
  'gap-4', 'gap-6',
  
  // Visibility/responsive
  'block', 'hidden', 'md:block', 'md:hidden', 'md:flex',
  
  // Loading states (prevent CLS)
  'animate-pulse', 'animate-spin',
  'w-8', 'h-8', 'border-2', 'border-purple-500', 'border-t-transparent', 'rounded-full',
  
  // Essential utilities
  'overflow-hidden', 'relative', 'absolute', 'inset-0'
];

/**
 * Generates optimized critical CSS inline
 */
function generateCriticalCSS() {
  return `
    /* Critical CSS - Mobile-First Above-the-Fold (Optimized ~10KB) */
    
    /* CSS Reset (minimal) */
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{line-height:1.5;-webkit-text-size-adjust:100%;scroll-behavior:smooth}
    body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-color:#000}
    
    /* Essential Layout */
    .container{width:100%;max-width:1200px;margin:0 auto;padding:0 1rem}
    .flex{display:flex}.flex-col{flex-direction:column}
    .items-center{align-items:center}.justify-center{justify-content:center}
    .w-full{width:100%}.h-full{height:100%}.min-h-screen{min-height:100vh}
    .mx-auto{margin-left:auto;margin-right:auto}
    
    /* Navigation (Critical for UX) */
    .fixed{position:fixed}.top-0{top:0}.left-0{left:0}.right-0{right:0}
    .z-50{z-index:50}.z-40{z-index:40}
    .px-4{padding-left:1rem;padding-right:1rem}
    .py-2{padding-top:0.5rem;padding-bottom:0.5rem}
    .py-3{padding-top:0.75rem;padding-bottom:0.75rem}
    .bg-black{background-color:rgb(0 0 0)}
    .bg-white{background-color:rgb(255 255 255)}
    .bg-opacity-95{background-color:rgb(0 0 0 / 0.95)}
    
    /* Hero Section (Above-the-fold) */
    .bg-gradient-to-b{background-image:linear-gradient(to bottom,var(--tw-gradient-stops))}
    .bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}
    .from-black{--tw-gradient-from:#000 var(--tw-gradient-from-position);--tw-gradient-to:rgb(0 0 0 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .to-gray-900{--tw-gradient-to:#111827 var(--tw-gradient-to-position)}
    .from-purple-600{--tw-gradient-from:#9333ea var(--tw-gradient-from-position);--tw-gradient-to:rgb(147 51 234 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .to-blue-600{--tw-gradient-to:#2563eb var(--tw-gradient-to-position)}
    .py-16{padding-top:4rem;padding-bottom:4rem}
    .py-20{padding-top:5rem;padding-bottom:5rem}
    
    /* Typography (Critical) */
    .text-center{text-align:center}
    .text-white{color:rgb(255 255 255)}
    .text-gray-100{color:rgb(243 244 246)}
    .text-gray-700{color:rgb(55 65 81)}
    .text-gray-900{color:rgb(17 24 39)}
    .font-bold{font-weight:700}
    .font-semibold{font-weight:600}
    .font-medium{font-weight:500}
    .text-lg{font-size:1.125rem;line-height:1.75rem}
    .text-xl{font-size:1.25rem;line-height:1.75rem}
    .text-2xl{font-size:1.5rem;line-height:2rem}
    .text-3xl{font-size:1.875rem;line-height:2.25rem}
    .text-4xl{font-size:2.25rem;line-height:2.5rem}
    
    /* Critical CTA Buttons */
    .bg-purple-600{background-color:rgb(147 51 234)}
    .bg-blue-600{background-color:rgb(37 99 235)}
    .hover\\:bg-purple-700:hover{background-color:rgb(126 34 206)}
    .hover\\:bg-blue-700:hover{background-color:rgb(29 78 216)}
    .px-6{padding-left:1.5rem;padding-right:1.5rem}
    .rounded-lg{border-radius:0.5rem}
    .transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
    .duration-300{transition-duration:300ms}
    
    /* Critical Spacing */
    .mt-4{margin-top:1rem}.mb-4{margin-bottom:1rem}
    .mt-6{margin-top:1.5rem}.mb-6{margin-bottom:1.5rem}
    .pt-4{padding-top:1rem}.pb-4{padding-bottom:1rem}
    .space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}
    .space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem * var(--tw-space-y-reverse))}
    .gap-4{gap:1rem}.gap-6{gap:1.5rem}
    
    /* Visibility */
    .block{display:block}.hidden{display:none}
    
    /* Loading States (CLS Prevention) */
    .animate-pulse{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite}
    .animate-spin{animation:spin 1s linear infinite}
    .w-8{width:2rem}.h-8{height:2rem}
    .border-2{border-width:2px}
    .border-purple-500{border-color:rgb(168 85 247)}
    .border-t-transparent{border-top-color:transparent}
    .rounded-full{border-radius:9999px}
    
    /* Essential Utils */
    .overflow-hidden{overflow:hidden}
    .relative{position:relative}
    .absolute{position:absolute}
    .inset-0{inset:0}
    
    /* Responsive (Mobile-first) */
    @media (min-width:768px){
      .md\\:block{display:block}
      .md\\:hidden{display:none}
      .md\\:flex{display:flex}
      .container{padding:0 2rem}
    }
    
    /* Animations */
    @keyframes pulse{50%{opacity:.5}}
    @keyframes spin{to{transform:rotate(360deg)}}
    
    /* FOUC Prevention */
    .fouc-prevent{opacity:0;visibility:hidden}
    .fouc-ready{opacity:1;visibility:visible;transition:opacity 200ms ease-in-out}
  `;
}

/**
 * Async CSS loading script for non-blocking CSS
 */
function generateAsyncCSSLoader() {
  return `
    <script>
      (function() {
        'use strict';
        
        // Performance optimization: Load CSS asynchronously
        function loadCSS(href, before, media, id) {
          var link = document.createElement('link');
          var ref = before || document.getElementsByTagName('script')[0];
          link.rel = 'stylesheet';
          link.href = href;
          link.media = media || 'all';
          if (id) link.id = id;
          
          // Insert before reference
          ref.parentNode.insertBefore(link, ref);
          
          return link;
        }
        
        // Load non-critical CSS after critical render
        function loadNonCriticalCSS() {
          // Find CSS links that should be loaded asynchronously
          var cssLinks = document.querySelectorAll('link[rel="stylesheet"][data-async]');
          
          cssLinks.forEach(function(link) {
            var href = link.getAttribute('data-href') || link.href;
            var id = link.getAttribute('data-id');
            
            // Remove data-async attribute and load
            link.removeAttribute('data-async');
            link.removeAttribute('data-href');
            if (id) link.removeAttribute('data-id');
            
            // Force reload with proper media
            link.media = 'all';
          });
        }
        
        // Mobile-optimized loading strategy
        var loadTimeout = window.innerWidth <= 768 ? 100 : 50;
        
        // Load non-critical CSS after critical content
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(loadNonCriticalCSS, loadTimeout);
          });
        } else {
          setTimeout(loadNonCriticalCSS, loadTimeout);
        }
        
        // Preload critical fonts
        var fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.as = 'font';
        fontPreload.type = 'font/woff2';
        fontPreload.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
        fontPreload.crossOrigin = 'anonymous';
        document.head.appendChild(fontPreload);
        
      })();
    </script>
  `;
}

/**
 * FOUC prevention script
 */
function generateFOUCPrevention() {
  return `
    <script>
      (function() {
        // Prevent FOUC with optimized approach
        document.documentElement.classList.add('fouc-prevent');
        
        function makeReady() {
          document.documentElement.classList.remove('fouc-prevent');
          document.documentElement.classList.add('fouc-ready');
        }
        
        // Fast ready detection for mobile
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
}

/**
 * Post-process HTML files after SSG build
 */
async function postProcessHTMLFiles(outDir) {
  const htmlFiles = await glob(`${outDir}/**/*.html`);
  
  console.log(`🎨 Post-processing ${htmlFiles.length} HTML files for Critical CSS...`);
  
  for (const filePath of htmlFiles) {
    try {
      let html = fs.readFileSync(filePath, 'utf-8');
      
      // Generate critical CSS
      const criticalCSS = generateCriticalCSS();
      const asyncLoader = generateAsyncCSSLoader();
      const foucPrevention = generateFOUCPrevention();
      
      // Debug log to verify critical CSS content
      console.log(`🔍 Critical CSS size: ${criticalCSS.length} chars for ${path.relative(outDir, filePath)}`);
      
      // Inject critical CSS inline right after the opening <head> tag (more reliable than before title)
      const criticalCSSTag = `<style data-critical>${criticalCSS}</style>`;
      html = html.replace(
        /(<head[^>]*>)/i, 
        `$1\n    ${criticalCSSTag}\n    ${foucPrevention}`
      );
      
      // Make main CSS async by adding data-async attribute
      html = html.replace(
        /<link rel="stylesheet"([^>]*href="[^"]*\.css"[^>]*)>/g,
        '<link rel="preload" as="style" data-async$1 onload="this.onload=null;this.rel=\'stylesheet\'">'
      );
      
      // Add noscript fallback for CSS
      const noscriptCSS = html.match(/data-async[^>]*href="([^"]*\.css)"/g);
      if (noscriptCSS) {
        let noscriptLinks = '<noscript>';
        noscriptCSS.forEach(match => {
          const href = match.match(/href="([^"]*)"/)[1];
          noscriptLinks += `<link rel="stylesheet" href="${href}">`;
        });
        noscriptLinks += '</noscript>';
        
        html = html.replace('</head>', `${noscriptLinks}\n</head>`);
      }
      
      // Inject async loader before closing body
      html = html.replace('</body>', `${asyncLoader}\n</body>`);
      
      // Mark as processed
      html = html.replace('<html', '<html data-critical-css-processed="true"');
      
      // Write processed HTML
      fs.writeFileSync(filePath, html);
      
      console.log(`✅ Processed: ${path.relative(outDir, filePath)}`);
      
    } catch (error) {
      console.error(`❌ Failed to process ${filePath}:`, error);
    }
  }
  
  console.log('🎨 Critical CSS post-processing completed!');
}

/**
 * SSG Critical CSS Plugin
 */
export function createSSGCriticalCSSPlugin() {
  return {
    name: 'ssg-critical-css',
    apply: 'build',
    
    writeBundle: {
      sequential: true,
      order: 'post',
      handler: async function(options) {
        // Wait a bit to ensure all files are written
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Post-process HTML files
        await postProcessHTMLFiles(options.dir || 'dist');
      }
    }
  };
}

export default createSSGCriticalCSSPlugin;