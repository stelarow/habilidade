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
    /* Critical CSS - Above-the-Fold Expanded (~8KB) - Prevents FOUC */

    /* Critical Self-Hosted Fonts */
    @font-face{font-family:'Montserrat';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/montserrat/montserrat-400.woff2') format('woff2')}
    @font-face{font-family:'Montserrat';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/montserrat/montserrat-600.woff2') format('woff2')}
    @font-face{font-family:'Montserrat';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/montserrat/montserrat-700.woff2') format('woff2')}
    @font-face{font-family:'Inter';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/inter/inter-400.woff2') format('woff2')}
    @font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/inter/inter-500.woff2') format('woff2')}

    /* Essential Reset & Base Styles */
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{line-height:1.5;-webkit-text-size-adjust:100%;scroll-behavior:smooth}
    body{margin:0;font-family:'Montserrat',system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-color:#000;color:#fafafa}

    /* Layout Utilities */
    .fixed{position:fixed}.relative{position:relative}.absolute{position:absolute}
    .top-0{top:0}.left-0{left:0}.right-0{right:0}.bottom-0{bottom:0}
    .z-10{z-index:10}.z-50{z-index:50}
    .w-full{width:100%}.h-full{height:100%}.h-16{height:4rem}
    .min-h-screen{min-height:100vh}.max-w-7xl{max-width:80rem}

    /* Flexbox */
    .flex{display:flex}.inline-flex{display:inline-flex}
    .flex-col{flex-direction:column}.flex-row{flex-direction:row}
    .items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}
    .justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-between{justify-content:space-between}
    .flex-1{flex:1 1 0%}.flex-shrink-0{flex-shrink:0}

    /* Grid */
    .grid{display:grid}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
    .gap-2{gap:0.5rem}.gap-3{gap:0.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}

    /* Spacing - Margin */
    .m-0{margin:0}.mx-auto{margin-left:auto;margin-right:auto}
    .mb-2{margin-bottom:0.5rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}
    .mb-8{margin-bottom:2rem}.mb-10{margin-bottom:2.5rem}.mb-12{margin-bottom:3rem}
    .mt-4{margin-top:1rem}.mt-8{margin-top:2rem}.mt-16{margin-top:4rem}

    /* Spacing - Padding */
    .p-4{padding:1rem}.p-6{padding:1.5rem}
    .px-4{padding-left:1rem;padding-right:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}
    .py-2{padding-top:0.5rem;padding-bottom:0.5rem}.py-3{padding-top:0.75rem;padding-bottom:0.75rem}
    .py-4{padding-top:1rem;padding-bottom:1rem}.py-8{padding-top:2rem;padding-bottom:2rem}
    .py-16{padding-top:4rem;padding-bottom:4rem}.py-20{padding-top:5rem;padding-bottom:5rem}
    .pt-20{padding-top:5rem}.pb-12{padding-bottom:3rem}

    /* Background Colors & Gradients */
    .bg-zinc-900{background-color:rgb(24 24 27)}.bg-zinc-950{background-color:rgb(9 9 11)}
    .bg-zinc-900\\/70{background-color:rgb(24 24 27 / 0.7)}
    .bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}
    .bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}
    .from-zinc-950{--tw-gradient-from:#09090b var(--tw-gradient-from-position);--tw-gradient-to:rgb(9 9 11 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .via-zinc-900{--tw-gradient-to:rgb(24 24 27 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),rgb(24 24 27) var(--tw-gradient-via-position),var(--tw-gradient-to)}
    .to-zinc-950{--tw-gradient-to:#09090b var(--tw-gradient-to-position)}
    .from-purple-600{--tw-gradient-from:#9333ea var(--tw-gradient-from-position);--tw-gradient-to:rgb(147 51 234 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .to-blue-600{--tw-gradient-to:#2563eb var(--tw-gradient-to-position)}

    /* Text Colors */
    .text-white{color:rgb(255 255 255)}.text-zinc-50{color:rgb(250 250 250)}
    .text-zinc-300{color:rgb(212 212 216)}.text-zinc-400{color:rgb(161 161 170)}
    .text-purple-400{color:rgb(192 132 252)}.text-blue-400{color:rgb(96 165 250)}

    /* Typography */
    .font-sans{font-family:'Montserrat',ui-sans-serif,system-ui}
    .font-bold{font-weight:700}.font-extrabold{font-weight:800}.font-semibold{font-weight:600}
    .text-xs{font-size:0.75rem;line-height:1rem}.text-sm{font-size:0.875rem;line-height:1.25rem}
    .text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}
    .text-xl{font-size:1.25rem;line-height:1.75rem}.text-2xl{font-size:1.5rem;line-height:2rem}
    .text-3xl{font-size:1.875rem;line-height:2.25rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}
    .text-5xl{font-size:3rem;line-height:1}.text-6xl{font-size:3.75rem;line-height:1}
    .text-7xl{font-size:4.5rem;line-height:1}
    .text-center{text-align:center}.text-left{text-align:left}
    .leading-tight{line-height:1.25}.leading-relaxed{line-height:1.625}.leading-snug{line-height:1.375}
    .tracking-tight{letter-spacing:-0.025em}.tracking-wide{letter-spacing:0.025em}
    .line-clamp-2{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}
    .truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

    /* Borders & Rounded */
    .border{border-width:1px}.border-b{border-bottom-width:1px}
    .border-zinc-700{border-color:rgb(63 63 70)}.border-gray-800\\/50{border-color:rgb(31 41 55 / 0.5)}
    .rounded-lg{border-radius:0.5rem}.rounded-xl{border-radius:0.75rem}

    /* Effects */
    .backdrop-blur-md{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
    .backdrop-blur-sm{backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
    .shadow-lg{box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1),0 4px 6px -4px rgb(0 0 0 / 0.1)}

    /* Visibility & Display */
    .hidden{display:none}.block{display:block}.inline-block{display:inline-block}
    .overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}

    /* Transitions */
    .transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
    .duration-200{transition-duration:200ms}.duration-300{transition-duration:300ms}

    /* Mobile Responsive */
    @media (min-width:640px){
      .sm\\:text-lg{font-size:1.125rem;line-height:1.75rem}
      .sm\\:text-xl{font-size:1.25rem;line-height:1.75rem}
      .sm\\:text-5xl{font-size:3rem;line-height:1}
      .sm\\:text-7xl{font-size:4.5rem;line-height:1}
      .sm\\:pt-0{padding-top:0}
      .sm\\:px-6{padding-left:1.5rem;padding-right:1.5rem}
      .sm\\:flex-row{flex-direction:row}
      .sm\\:gap-4{gap:1rem}
    }
    @media (min-width:768px){
      .md\\:text-2xl{font-size:1.5rem;line-height:2rem}
      .md\\:text-6xl{font-size:3.75rem;line-height:1}
      .md\\:px-8{padding-left:2rem;padding-right:2rem}
      .md\\:gap-6{gap:1.5rem}
    }
    @media (min-width:1024px){
      .lg\\:px-8{padding-left:2rem;padding-right:2rem}
      .lg\\:text-8xl{font-size:6rem;line-height:1}
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
          var isMobile = window.matchMedia('(max-width: 768px)').matches;

          if (connection) {
            if (connection.effectiveType === '4g') return isMobile ? 50 : 25;
            if (connection.effectiveType === '3g') return isMobile ? 200 : 100;
            if (connection.effectiveType === '2g') return isMobile ? 500 : 300;
          }

          return isMobile ? 100 : 50;
        }

        // Initialize async loading
        var loadDelay = getOptimalLoadDelay();

        // Note: Font preloading is handled in index.html <head> to avoid duplication

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
 * FOUC prevention REMOVED for better LCP performance
 * Using font-display: swap instead to prevent FOIT
 * This eliminates ~600-900ms of render delay
 */

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
  
  console.log(`🎨 Critical CSS injection: ${htmlFiles.length} files`);

  let processedCount = 0;
  let skippedCount = 0;

  for (const filePath of htmlFiles) {
    try {
      let html = fs.readFileSync(filePath, 'utf-8');

      // Skip if already processed
      if (html.includes('data-critical-css-processed="true"')) {
        skippedCount++;
        continue;
      }

      // Generate critical CSS components
      const criticalCSS = generateCriticalCSS();

      // Inject critical CSS inline right after the opening <head> tag
      const criticalCSSTag = `<style data-critical>${criticalCSS}</style>`;
      html = html.replace(
        /(<head[^>]*>)/i,
        `$1\n    ${criticalCSSTag}`
      );

      // Find all CSS links
      const existingCssLinks = html.match(/<link[^>]*(?:rel="stylesheet"|href="[^"]*\.css")[^>]*>/gi) || [];

      // Remove ALL CSS stylesheet links (any order of attributes)
      html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, '');
      html = html.replace(/<link[^>]*href="[^"]*\.css"[^>]*rel="[^"]*"[^>]*>/gi, '');
      html = html.replace(/<link[^>]*as="style"[^>]*href="[^"]*\.css"[^>]*>/gi, '');

      // Extract unique CSS hrefs from removed links
      const uniqueCssFiles = new Set();
      existingCssLinks.forEach(link => {
        const hrefMatch = link.match(/href="([^"]*\.css[^"]*)"/i);
        if (hrefMatch &&
            !hrefMatch[1].includes('fonts.googleapis.com') &&
            !hrefMatch[1].includes('/src/') &&
            !hrefMatch[1].includes('src/styles/fonts.css')) {
          uniqueCssFiles.add(hrefMatch[1]);
        }
      });

      // Add back as SYNCHRONOUS links to prevent FOUC
      let cssLinks = '';
      uniqueCssFiles.forEach(href => {
        cssLinks += `<link rel="stylesheet" href="${href}">\n    `;
      });

      // Insert CSS links before closing head (after critical inline CSS)
      if (cssLinks) {
        html = html.replace('</head>', `${cssLinks}</head>`);
      }

      // Remove existing Google Fonts links (fonts are bundled in main CSS)
      html = html.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi, '');
      html = html.replace(/<link[^>]*fonts\.gstatic\.com[^>]*>/gi, '');

      // Remove any existing async CSS loader script (from previous processing)
      html = html.replace(/<script>\s*\(function\(\)\s*\{\s*'use strict';[\s\S]*?loadNonCriticalCSS[\s\S]*?<\/script>/gi, '');

      // Mark as processed to avoid double-processing
      html = html.replace('<html', '<html data-critical-css-processed="true"');

      // Write processed HTML
      fs.writeFileSync(filePath, html);
      processedCount++;

    } catch (error) {
      console.error(`❌ Failed: ${path.relative(distDir, filePath)}:`, error.message);
    }
  }

  console.log(`✅ Critical CSS: ${processedCount} processed, ${skippedCount} skipped`);
  
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