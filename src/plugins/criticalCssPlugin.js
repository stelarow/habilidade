import { generate } from 'critical';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

/**
 * Vite plugin para extrair e inline critical CSS
 * Reduz render-blocking CSS para melhorar FCP e LCP
 */
export function criticalCssPlugin(options = {}) {
  const defaultOptions = {
    inline: true,
    extract: true,
    width: 414, // iPhone 12 Pro width
    height: 896, // iPhone 12 Pro height
    minify: true,
    ignore: {
      atrule: ['@font-face'],
      rule: [/^\.sr-only/], // Screen reader only
      decl: (node, value) => {
        // Ignorar algumas propriedades não críticas
        return /url\(.+\.(woff|woff2|ttf|eot)\)/.test(value);
      }
    },
    penthouse: {
      blockJSRequests: false,
      timeout: 30000
    }
  };

  const config = { ...defaultOptions, ...options };

  return {
    name: 'critical-css-plugin',
    enforce: 'post',
    apply: 'build',
    
    writeBundle: async function(options, bundle) {
      try {
        const outDir = options.dir || 'dist';
        
        // Encontrar arquivo HTML principal
        const htmlFiles = Object.keys(bundle).filter(fileName => 
          fileName.endsWith('.html')
        );
        
        for (const htmlFile of htmlFiles) {
          const htmlPath = join(outDir, htmlFile);
          
          console.log(`🎯 Extracting critical CSS for ${htmlFile}...`);
          
          // Configurar critical CSS extraction
          const result = await generate({
            ...config,
            src: htmlPath,
            dest: htmlPath,
            css: [join(outDir, 'assets/**/*.css')],
            target: {
              css: htmlPath,
              html: htmlPath
            }
          });
          
          console.log(`✅ Critical CSS extracted for ${htmlFile}`);
          console.log(`📊 Critical CSS size: ${(result.css.length / 1024).toFixed(2)} KB`);
          
          // Adicionar métricas de performance ao HTML
          if (result.css) {
            const htmlContent = readFileSync(htmlPath, 'utf8');
            const criticalSize = result.css.length;
            
            // Adicionar comentário com métricas
            const metricsComment = `
<!-- Critical CSS Performance Metrics -->
<!-- Critical CSS Size: ${(criticalSize / 1024).toFixed(2)} KB -->
<!-- Extraction Time: ${new Date().toISOString()} -->
<!-- Target Viewport: ${config.width}x${config.height} -->
`;
            
            const updatedHtml = htmlContent.replace(
              '<!-- Critical CSS Performance Metrics -->',
              metricsComment
            );
            
            writeFileSync(htmlPath, updatedHtml);
          }
        }
        
      } catch (error) {
        console.warn('⚠️ Critical CSS extraction failed:', error.message);
        console.warn('Continuing build without critical CSS optimization...');
      }
    }
  };
}