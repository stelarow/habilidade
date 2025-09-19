/**
 * Progressive Hydration Plugin for Vite
 * Optimizes script loading and implements defer/async strategies
 */

import fs from 'fs';
import path from 'path';

/**
 * Creates progressive hydration plugin for Vite
 */
export function createProgressiveHydrationPlugin() {
  return {
    name: 'progressive-hydration',

    // Inject progressive hydration scripts in HTML
    transformIndexHtml(html, context) {
      // Only process during build
      if (!context || context.server) return html;

      // Find main script and add defer attribute
      let modifiedHtml = html.replace(
        /<script type="module" crossorigin src="([^"]*\/assets\/js\/app-[^"]*\.js)"><\/script>/,
        '<script type="module" defer crossorigin src="$1"></script>'
      );

      // Add progressive hydration control script before main script
      const progressiveScript = `
<script>
window.__PROGRESSIVE_HYDRATION__ = {
  critical: ['ContactForm', 'AccessibilityControls', 'Header', 'WhatsAppFloat'],
  lazy: ['backgrounds', 'modals', 'carousels'],
  intersectionThreshold: 0.1,
  delay: 100
};

// Progressive hydration scheduler
window.__scheduleHydration__ = function(componentName, element, hydrateFn) {
  if (window.__PROGRESSIVE_HYDRATION__.critical.includes(componentName)) {
    // Hydrate critical components immediately after main script loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () =>
        requestIdleCallback(() => hydrateFn(element), { timeout: 100 })
      );
    } else {
      requestIdleCallback(() => hydrateFn(element), { timeout: 100 });
    }
  } else {
    // Lazy hydrate non-critical components on intersection
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setTimeout(() => hydrateFn(element), window.__PROGRESSIVE_HYDRATION__.delay);
        }
      });
    }, { threshold: window.__PROGRESSIVE_HYDRATION__.intersectionThreshold });
    observer.observe(element);
  }
};
</script>`;

      // Insert progressive hydration script before main script
      if (modifiedHtml.includes('<script type="module" defer crossorigin')) {
        modifiedHtml = modifiedHtml.replace(
          /<script type="module" defer crossorigin/,
          progressiveScript + '\n    <script type="module" defer crossorigin'
        );
      }

      return modifiedHtml;
    },

    // Optimize chunk loading order
    generateBundle(options, bundle) {
      // Add resource hints for critical chunks
      const criticalChunks = Object.keys(bundle).filter(key =>
        key.includes('react-vendor') ||
        key.includes('router') ||
        key.includes('external-services')
      );

      console.log('🎯 Progressive Hydration: Critical chunks identified:', criticalChunks);
    }
  };
}