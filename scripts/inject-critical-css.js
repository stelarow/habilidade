#!/usr/bin/env node
/**
 * Post-Build Critical CSS Injector
 * Runs AFTER SSG to inject critical CSS into all generated HTML files
 * This solves the timing issue where SSG overwrites the critical CSS injection
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates optimized critical CSS inline
 * Same as the plugin but as a standalone function
 */
function generateCriticalCSS() {
  return `
    /* Critical CSS - Mobile-First Above-the-Fold (Optimized ~18KB) */

    /* CSS Reset (minimal) */
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{line-height:1.5;-webkit-text-size-adjust:100%;scroll-behavior:smooth}
    body{margin:0;font-family:"Inter",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-color:#000}
    
    /* Font Loading Optimization */
    @font-face{font-family:"Inter-fallback";src:local("Arial"),local("Helvetica");font-display:swap}
    @font-face{font-family:"Montserrat-fallback";src:local("Arial"),local("Helvetica");font-display:swap}
    
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
    .bg-blue-500{background-color:rgb(59 130 246)}
    .hover\\:bg-purple-700:hover{background-color:rgb(126 34 206)}
    .hover\\:bg-blue-700:hover{background-color:rgb(29 78 216)}
    .hover\\:bg-blue-600:hover{background-color:rgb(37 99 235)}
    .px-6{padding-left:1.5rem;padding-right:1.5rem}
    .px-8{padding-left:2rem;padding-right:2rem}
    .py-3{padding-top:0.75rem;padding-bottom:0.75rem}
    .py-4{padding-top:1rem;padding-bottom:1rem}
    .rounded-lg{border-radius:0.5rem}
    .rounded-full{border-radius:9999px}
    .transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
    .transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
    .duration-300{transition-duration:300ms}
    .transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}
    .hover\\:scale-105:hover{--tw-scale-x:1.05;--tw-scale-y:1.05;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}
    
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
    .pointer-events-none{pointer-events:none}
    .cursor-pointer{cursor:pointer}

    /* Critical Home Page Elements */
    .max-w-4xl{max-width:56rem}
    .max-w-6xl{max-width:72rem}
    .max-w-md{max-width:28rem}
    .max-w-lg{max-width:32rem}
    .max-w-xl{max-width:36rem}
    .min-w-0{min-width:0px}
    .object-cover{object-fit:cover}
    .object-center{object-position:center}

    /* Course Cards Critical Styles */
    .grid{display:grid}
    .grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
    .grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
    .grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
    .col-span-full{grid-column:1/-1}
    .row-span-2{grid-row:span 2/span 2}
    .aspect-video{aspect-ratio:16/9}
    .aspect-square{aspect-ratio:1/1}

    /* Card Layouts */
    .p-6{padding:1.5rem}
    .p-8{padding:2rem}
    .p-\[3px\]{padding:3px}
    .rounded-xl{border-radius:0.75rem}
    .rounded-2xl{border-radius:1rem}
    .border{border-width:1px}
    .border-gray-800{border-color:rgb(31 41 55)}
    .border-gray-700{border-color:rgb(55 65 81)}

    /* Gradient Borders for Course Cards */
    .bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}
    .bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}
    .from-orange-500\/60{--tw-gradient-from:rgb(249 115 22 / 0.6) var(--tw-gradient-from-position);--tw-gradient-to:rgb(249 115 22 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .to-amber-400\/60{--tw-gradient-to:rgb(251 191 36 / 0.6) var(--tw-gradient-to-position)}
    .from-blue-500\/60{--tw-gradient-from:rgb(59 130 246 / 0.6) var(--tw-gradient-from-position);--tw-gradient-to:rgb(59 130 246 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .to-indigo-400\/60{--tw-gradient-to:rgb(129 140 248 / 0.6) var(--tw-gradient-to-position)}
    .from-green-500\/60{--tw-gradient-from:rgb(34 197 94 / 0.6) var(--tw-gradient-from-position);--tw-gradient-to:rgb(34 197 94 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .to-emerald-400\/60{--tw-gradient-to:rgb(52 211 153 / 0.6) var(--tw-gradient-to-position)}
    .from-purple-500\/60{--tw-gradient-from:rgb(168 85 247 / 0.6) var(--tw-gradient-from-position);--tw-gradient-to:rgb(168 85 247 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .to-violet-400\/60{--tw-gradient-to:rgb(167 139 250 / 0.6) var(--tw-gradient-to-position)}

    /* Text Colors for Course Cards */
    .text-orange-400{color:rgb(251 146 60)}
    .text-blue-400{color:rgb(96 165 250)}
    .text-green-400{color:rgb(74 222 128)}
    .text-purple-400{color:rgb(196 181 253)}
    .text-pink-400{color:rgb(244 114 182)}
    .text-cyan-400{color:rgb(34 211 238)}
    .text-red-400{color:rgb(248 113 113)}
    .text-yellow-400{color:rgb(250 204 21)}

    /* Critical Spacing */
    .space-y-8>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(2rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(2rem * var(--tw-space-y-reverse))}
    .space-y-12>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(3rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(3rem * var(--tw-space-y-reverse))}
    .mt-8{margin-top:2rem}.mb-8{margin-bottom:2rem}
    .mt-12{margin-top:3rem}.mb-12{margin-bottom:3rem}
    .mt-16{margin-top:4rem}.mb-16{margin-bottom:4rem}
    
    /* Header/Navigation Critical */
    .backdrop-blur-sm{backdrop-filter:blur(4px)}
    .border-b{border-bottom-width:1px}
    .border-gray-800{border-color:rgb(31 41 55)}
    .shadow-lg{box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)}
    .justify-between{justify-content:space-between}
    .items-start{align-items:flex-start}
    .items-end{align-items:flex-end}
    .space-x-4>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(1rem * var(--tw-space-x-reverse));margin-left:calc(1rem * calc(1 - var(--tw-space-x-reverse)))}
    .space-x-6>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(1.5rem * var(--tw-space-x-reverse));margin-left:calc(1.5rem * calc(1 - var(--tw-space-x-reverse)))}
    
    /* Logo and Brand */
    .font-montserrat{font-family:"Montserrat","Montserrat-fallback",sans-serif}
    .font-inter{font-family:"Inter","Inter-fallback",sans-serif}
    .text-5xl{font-size:3rem;line-height:1}
    .leading-none{line-height:1}
    .tracking-tight{letter-spacing:-0.025em}
    
    /* Mobile Menu */
    .md\\:space-x-6>:not([hidden])~:not([hidden]){margin-right:calc(1.5rem * var(--tw-space-x-reverse));margin-left:calc(1.5rem * calc(1 - var(--tw-space-x-reverse)))}
    
    /* Background Gradients for Hero */
    .bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}
    .from-gray-900{--tw-gradient-from:#111827 var(--tw-gradient-from-position);--tw-gradient-to:rgb(17 24 39 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .via-black{--tw-gradient-to:rgb(0 0 0 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),#000 var(--tw-gradient-via-position),var(--tw-gradient-to)}
    
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
 * Advanced Async CSS loading script with progressive enhancement
 */
function generateAsyncCSSLoader() {
  return `
    <script>
      (function() {
        'use strict';

        // Enhanced CSS loading with progressive enhancement and error handling
        function loadCSS(href, before, media, id, priority) {
          return new Promise(function(resolve, reject) {
            var link = document.createElement('link');
            var ref = before || document.getElementsByTagName('script')[0];

            link.rel = 'stylesheet';
            link.href = href;
            link.media = media || 'print'; // Start with print to avoid blocking
            if (id) link.id = id;

            // Add high priority for critical resources
            if (priority === 'high') {
              link.fetchPriority = 'high';
            }

            // Handle load success
            link.onload = function() {
              // Switch to all media after load
              this.media = 'all';
              resolve(link);
            };

            // Handle load errors
            link.onerror = function() {
              console.warn('Failed to load CSS:', href);
              reject(new Error('CSS load failed: ' + href));
            };

            // Insert before reference
            ref.parentNode.insertBefore(link, ref);

            // Timeout fallback
            setTimeout(function() {
              if (link.media === 'print') {
                link.media = 'all';
                resolve(link);
              }
            }, 3000);
          });
        }

        // Progressive CSS loading strategy
        function loadNonCriticalCSS() {
          var cssFiles = [];

          // Find existing CSS links to load asynchronously
          var cssLinks = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');

          cssLinks.forEach(function(link) {
            // Skip if already processed
            if (link.getAttribute('data-async-processed')) return;

            var href = link.href;
            var id = link.id || null;

            // Mark as processed
            link.setAttribute('data-async-processed', 'true');

            // Remove original link temporarily
            link.remove();

            // Determine priority based on filename
            var priority = 'normal';
            if (href.includes('app-') || href.includes('main-')) {
              priority = 'high';
            }

            cssFiles.push({ href: href, id: id, priority: priority });
          });

          // Load CSS files in order of priority
          var highPriority = cssFiles.filter(function(f) { return f.priority === 'high'; });
          var normalPriority = cssFiles.filter(function(f) { return f.priority === 'normal'; });

          // Load high priority CSS first
          Promise.all(highPriority.map(function(file) {
            return loadCSS(file.href, null, 'all', file.id, 'high');
          })).then(function() {
            console.log('✅ High priority CSS loaded');

            // Then load normal priority CSS
            return Promise.all(normalPriority.map(function(file) {
              return loadCSS(file.href, null, 'all', file.id);
            }));
          }).then(function() {
            console.log('✅ All CSS loaded asynchronously');
          }).catch(function(error) {
            console.warn('CSS loading error:', error);
          });
        }

        // Connection-aware loading
        function getOptimalLoadDelay() {
          var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
          var isMobile = window.innerWidth <= 768;

          if (connection) {
            if (connection.effectiveType === '4g') return isMobile ? 50 : 25;
            if (connection.effectiveType === '3g') return isMobile ? 200 : 100;
            if (connection.effectiveType === '2g') return isMobile ? 500 : 300;
          }

          return isMobile ? 100 : 50;
        }

        // Preload critical resources with priority hints
        function preloadCriticalResources() {
          var resources = [
            {
              href: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous'
            },
            {
              href: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous'
            }
          ];

          resources.forEach(function(resource) {
            var link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.as;
            link.type = resource.type;
            link.href = resource.href;
            if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
            link.fetchPriority = 'high';
            document.head.appendChild(link);
          });
        }

        // Initialize async loading
        var loadDelay = getOptimalLoadDelay();

        // Preload fonts immediately
        preloadCriticalResources();

        // Load CSS based on document ready state
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(loadNonCriticalCSS, loadDelay);
          });
        } else {
          setTimeout(loadNonCriticalCSS, loadDelay);
        }

        // Performance monitoring
        if (window.performance && performance.mark) {
          performance.mark('css-async-loader-start');
          setTimeout(function() {
            performance.mark('css-async-loader-end');
            performance.measure('css-async-loader', 'css-async-loader-start', 'css-async-loader-end');
          }, loadDelay + 1000);
        }

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
 * Process HTML files and inject critical CSS
 */
async function injectCriticalCSS() {
  const distDir = path.resolve(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory not found. Run this after build completion.');
    process.exit(1);
  }

  const htmlFiles = await glob(`${distDir}/**/*.html`);
  
  console.log(`🎨 Post-SSG Critical CSS injection starting...`);
  console.log(`📁 Processing ${htmlFiles.length} HTML files in ${distDir}`);
  
  let processedCount = 0;
  let skippedCount = 0;
  
  for (const filePath of htmlFiles) {
    try {
      let html = fs.readFileSync(filePath, 'utf-8');
      
      // Skip if already processed
      if (html.includes('data-critical-css-processed="true"')) {
        console.log(`⏭️  Already processed: ${path.relative(distDir, filePath)}`);
        skippedCount++;
        continue;
      }
      
      // Generate critical CSS components
      const criticalCSS = generateCriticalCSS();
      const asyncLoader = generateAsyncCSSLoader();
      const foucPrevention = generateFOUCPrevention();
      
      console.log(`🔍 Injecting ${criticalCSS.length} chars of Critical CSS into ${path.relative(distDir, filePath)}`);
      
      // Inject critical CSS inline right after the opening <head> tag
      const criticalCSSTag = `<style data-critical>${criticalCSS}</style>`;
      html = html.replace(
        /(<head[^>]*>)/i, 
        `$1\n    ${criticalCSSTag}\n    ${foucPrevention}`
      );
      
      // Step 1: Remove ALL existing CSS links to prevent duplication
      console.log(`🧹 Removing existing CSS links to prevent duplication...`);
      
      // Find all CSS links for logging
      const existingCssLinks = html.match(/<link[^>]*(?:rel="stylesheet"|href="[^"]*\.css")[^>]*>/gi) || [];
      console.log(`🔍 Found ${existingCssLinks.length} existing CSS links to process`);
      
      // Remove ALL CSS stylesheet links (any order of attributes)
      html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, '');
      html = html.replace(/<link[^>]*href="[^"]*\.css"[^>]*rel="[^"]*"[^>]*>/gi, '');
      html = html.replace(/<link[^>]*as="style"[^>]*href="[^"]*\.css"[^>]*>/gi, '');
      
      // Step 2: Extract unique CSS hrefs from removed links
      const uniqueCssFiles = new Set();
      existingCssLinks.forEach(link => {
        const hrefMatch = link.match(/href="([^"]*\.css[^"]*)"/i);
        if (hrefMatch && !hrefMatch[1].includes('fonts.googleapis.com')) {
          uniqueCssFiles.add(hrefMatch[1]);
        }
      });
      
      console.log(`📁 Unique CSS files to make async: ${uniqueCssFiles.size}`);
      
      // Step 3: Add back as async links
      let asyncCssLinks = '';
      uniqueCssFiles.forEach(href => {
        asyncCssLinks += `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'" media="all">\n    `;
      });
      
      // Insert async CSS links before closing head
      if (asyncCssLinks) {
        html = html.replace('</head>', `${asyncCssLinks}</head>`);
      }
      
      // Step 4: Optimize Google Fonts loading
      console.log(`🔤 Optimizing Google Fonts for non-blocking load...`);
      
      // Remove existing Google Fonts links
      html = html.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi, '');
      html = html.replace(/<link[^>]*fonts\.gstatic\.com[^>]*>/gi, '');
      
      // Add optimized Google Fonts loading
      const optimizedFonts = `
        <!-- Optimized Google Fonts - Non-blocking -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" onload="this.onload=null;this.rel='stylesheet'">
        <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap"></noscript>
      `;
      
      html = html.replace('</head>', `${optimizedFonts}\n</head>`);
      
      // Add noscript fallback for CSS
      if (uniqueCssFiles.size > 0) {
        let noscriptLinks = '<noscript>\n      ';
        uniqueCssFiles.forEach(href => {
          noscriptLinks += `<link rel="stylesheet" href="${href}">\n      `;
        });
        noscriptLinks += '</noscript>';
        
        html = html.replace('</head>', `${noscriptLinks}\n</head>`);
      }
      
      // Inject async loader before closing body
      html = html.replace('</body>', `${asyncLoader}\n</body>`);
      
      // Mark as processed to avoid double-processing
      html = html.replace('<html', '<html data-critical-css-processed="true"');
      
      // Write processed HTML
      fs.writeFileSync(filePath, html);
      
      console.log(`✅ Processed: ${path.relative(distDir, filePath)}`);
      processedCount++;
      
    } catch (error) {
      console.error(`❌ Failed to process ${filePath}:`, error);
    }
  }
  
  console.log(`🎨 Critical CSS injection completed!`);
  console.log(`📊 Summary: ${processedCount} processed, ${skippedCount} skipped`);
  
  if (processedCount === 0 && skippedCount === 0) {
    console.warn('⚠️  No files were processed. Check that HTML files exist in dist/');
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  injectCriticalCSS().catch(error => {
    console.error('❌ Critical CSS injection failed:', error);
    process.exit(1);
  });
}

export { injectCriticalCSS };