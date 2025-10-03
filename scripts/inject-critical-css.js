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
    /* Critical CSS - Above-the-Fold Only (~2KB) */

    /* Critical Self-Hosted Fonts */
    @font-face{font-family:'Montserrat';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/montserrat/montserrat-400.woff2') format('woff2')}
    @font-face{font-family:'Montserrat';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/montserrat/montserrat-600.woff2') format('woff2')}
    @font-face{font-family:'Montserrat';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/montserrat/montserrat-700.woff2') format('woff2')}
    @font-face{font-family:'Inter';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/inter/inter-400.woff2') format('woff2')}
    @font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/inter/inter-500.woff2') format('woff2')}

    /* Essential Reset */
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{line-height:1.5;-webkit-text-size-adjust:100%}
    body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased;background-color:#000}

    /* Critical Layout (Header + Hero Only) */
    .fixed{position:fixed}.top-0{top:0}.w-full{width:100%}.z-50{z-index:50}
    .flex{display:flex}.flex-col{flex-direction:column}.items-center{align-items:center}
    .justify-center{justify-content:center}.justify-between{justify-content:space-between}
    .h-16{height:4rem}.min-h-screen{min-height:100vh}.max-w-7xl{max-width:80rem}
    .mx-auto{margin-left:auto;margin-right:auto}.px-4{padding-left:1rem;padding-right:1rem}

    /* Header Critical Styles */
    .bg-zinc-900\\/70{background-color:rgb(24 24 27 / 0.7)}
    .backdrop-blur-md{backdrop-filter:blur(12px)}
    .border-b{border-bottom-width:1px}.border-gray-800\\/50{border-color:rgb(31 41 55 / 0.5)}

    /* Hero Critical Styles */
    .bg-zinc-950{background-color:rgb(9 9 11)}.text-center{text-align:center}
    .text-white{color:rgb(255 255 255)}.text-purple-400{color:rgb(196 181 253)}
    .text-zinc-300{color:rgb(212 212 216)}
    .font-bold{font-weight:700}.font-extrabold{font-weight:800}
    .text-3xl{font-size:1.875rem;line-height:2.25rem}.text-5xl{font-size:3rem;line-height:1}
    .text-7xl{font-size:4.5rem;line-height:1}.text-lg{font-size:1.125rem;line-height:1.75rem}
    .pt-20{padding-top:5rem}.mb-10{margin-bottom:2.5rem}.mb-2{margin-bottom:0.5rem}
    .mb-6{margin-bottom:1.5rem}.leading-relaxed{line-height:1.625}
    .tracking-tight{letter-spacing:-0.025em}.tracking-wide{letter-spacing:0.025em}

    /* Critical Button Styles */
    .px-6{padding-left:1.5rem;padding-right:1.5rem}
    .py-3{padding-top:0.75rem;padding-bottom:0.75rem}
    .rounded-lg{border-radius:0.5rem}
    .bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}
    .from-purple-600{--tw-gradient-from:#9333ea;--tw-gradient-to:rgb(147 51 234 / 0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .to-blue-600{--tw-gradient-to:#2563eb}

    /* Anti-FOUC */
    .fouc-prevent{opacity:0;visibility:hidden}
    .fouc-ready{opacity:1;visibility:visible;transition:opacity 200ms}

    /* Mobile Responsive */
    @media (min-width:640px){
      .sm\\:text-5xl{font-size:3rem;line-height:1}
      .sm\\:text-7xl{font-size:4.5rem;line-height:1}
      .sm\\:pt-0{padding-top:0}
      .sm\\:flex-row{flex-direction:row}
    }
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

            // Skip development paths that shouldn't exist in production
            if (href.includes('/src/') || href.includes('src/styles/fonts.css')) {
              console.warn('Skipping development CSS path:', href);
              link.remove();
              return;
            }

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

        // Preload critical resources with priority hints (self-hosted fonts)
        function preloadCriticalResources() {
          var resources = [
            {
              href: '/fonts/inter/inter-400.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous'
            },
            {
              href: '/fonts/montserrat/montserrat-400.woff2',
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
 * FOUC prevention script with noscript fallback for crawlers
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
    <noscript>
      <style>
        /* Ensure content is visible for crawlers without JavaScript */
        html.fouc-prevent, .fouc-prevent {
          opacity: 1 !important;
          visibility: visible !important;
        }
      </style>
    </noscript>
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
        if (hrefMatch &&
            !hrefMatch[1].includes('fonts.googleapis.com') &&
            !hrefMatch[1].includes('/src/') && // Filter out development paths
            !hrefMatch[1].includes('src/styles/fonts.css')) { // Specifically exclude fonts.css
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
      
      // Self-hosted fonts are already bundled by Vite in the main CSS
      // No need to add separate link that would cause 404 errors
      console.log(`✅ Fonts are bundled in main CSS, skipping separate font CSS link`);
      
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