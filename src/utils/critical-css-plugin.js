/**
 * Simplified Critical CSS Plugin for Vite
 * Analyzes CSS bundles and provides insights
 * CSS injection handled by post-build script (scripts/inject-critical-css.js)
 */

/**
 * Simplified Critical CSS Plugin for Vite
 * Only analyzes bundles - CSS injection handled by post-build script
 */
export function createCriticalCssPlugin() {
  return {
    name: 'vite-critical-css-analyzer',

    generateBundle(options, bundle) {
      // Analyze CSS files for optimization insights
      const cssFiles = [];

      for (const fileName in bundle) {
        if (fileName.endsWith('.css') && bundle[fileName].type === 'asset') {
          const cssSize = Buffer.byteLength(bundle[fileName].source, 'utf-8');
          cssFiles.push({ fileName, size: cssSize });

          console.log(`📊 CSS Bundle: ${fileName} (${(cssSize/1024).toFixed(1)}KB)`);

          if (cssSize > 150000) { // 150KB threshold
            console.warn(`⚠️ Large CSS detected: ${fileName} - Will be loaded asynchronously`);
          }
        }
      }

      if (cssFiles.length > 0) {
        console.log(`🎨 Total CSS files: ${cssFiles.length} | Total size: ${(cssFiles.reduce((acc, f) => acc + f.size, 0)/1024).toFixed(1)}KB`);
      }
    }
  };
}

export default createCriticalCssPlugin;