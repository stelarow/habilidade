/**
 * Blog Image Migration System
 * Applies smart image optimization to existing blog content
 */

import { parse } from 'node-html-parser';

class BlogImageMigration {
  constructor() {
    this.processedImages = new Map();
    this.optimizationStats = {
      totalImages: 0,
      optimizedImages: 0,
      errors: 0,
      skipped: 0
    };
  }

  /**
   * Process blog content and replace img tags with SmartBlogImage components
   */
  migrateBlogContent(content) {
    if (!content || typeof content !== 'string') {
      return content;
    }

    try {
      // Parse HTML content
      const root = parse(content);
      const images = root.querySelectorAll('img');
      
      this.optimizationStats.totalImages += images.length;

      images.forEach((img, index) => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || '';
        const className = img.getAttribute('class') || '';
        
        if (!src) {
          this.optimizationStats.skipped++;
          return;
        }

        // Check if this is a local blog image that might need optimization
        const isLocalBlogImage = src.includes('/images/blog/') || src.startsWith('/images/');
        
        if (isLocalBlogImage) {
          // Replace with SmartBlogImage wrapper
          const smartImageHtml = this.generateSmartImageHtml(src, alt, className, index);
          img.replaceWith(parse(smartImageHtml));
          this.optimizationStats.optimizedImages++;
        } else {
          this.optimizationStats.skipped++;
        }
      });

      return root.toString();

    } catch (error) {
      console.error('Erro ao migrar conteúdo do blog:', error);
      this.optimizationStats.errors++;
      return content; // Return original content on error
    }
  }

  /**
   * Generate SmartBlogImage HTML wrapper
   */
  generateSmartImageHtml(src, alt, className = '', index = 0) {
    // Generate unique ID for React component
    const imageId = `smart-blog-img-${Date.now()}-${index}`;
    
    return `
      <div class="smart-blog-image-container" data-image-id="${imageId}">
        <img 
          src="${src}" 
          alt="${alt}" 
          class="smart-blog-image ${className}"
          data-smart-optimization="true"
          loading="lazy"
          decoding="async"
        />
        <script type="application/json" class="smart-image-config">
          {
            "src": "${src}",
            "alt": "${alt}",
            "originalClass": "${className}",
            "optimizationEnabled": true
          }
        </script>
      </div>
    `;
  }

  /**
   * Apply client-side image optimization to existing images
   */
  async optimizeExistingImages() {
    // Guard against SSR environment
    if (typeof document === 'undefined') {
      console.warn('BlogImageMigration: document not available in SSR context');
      return [];
    }
    
    const smartImages = document.querySelectorAll('[data-smart-optimization="true"]');
    const results = [];

    for (const img of smartImages) {
      try {
        const result = await this.optimizeImage(img);
        results.push(result);
      } catch (error) {
        console.error('Erro ao otimizar imagem:', error);
        results.push({
          src: img.src,
          error: error.message,
          optimized: false
        });
      }
    }

    return results;
  }

  /**
   * Optimize individual image element
   */
  async optimizeImage(imgElement) {
    return new Promise((resolve) => {
      // Skip if already processed
      if (this.processedImages.has(imgElement.src)) {
        resolve(this.processedImages.get(imgElement.src));
        return;
      }

      const tempImg = new Image();
      tempImg.crossOrigin = 'anonymous';

      tempImg.onload = () => {
        const { naturalWidth, naturalHeight } = tempImg;
        const isSmall = naturalWidth < 600;
        
        let result = {
          src: imgElement.src,
          originalDimensions: { width: naturalWidth, height: naturalHeight },
          optimized: false,
          message: 'Imagem em tamanho adequado'
        };

        if (isSmall) {
          // Apply optimization
          const optimizedSrc = this.createOptimizedVersion(tempImg);
          
          if (optimizedSrc) {
            imgElement.src = optimizedSrc;
            imgElement.classList.add('blog-image-optimized');
            
            // Add size limitation
            const maxWidth = Math.min(600, naturalWidth * 2);
            imgElement.style.maxWidth = `${maxWidth}px`;
            imgElement.style.height = 'auto';
            
            result = {
              ...result,
              optimized: true,
              optimizedSrc,
              message: `Imagem otimizada de ${naturalWidth}x${naturalHeight} para melhor qualidade`
            };
            
            // Add development indicator
            if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
              const indicator = document.createElement('div');
              indicator.className = 'absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-75';
              indicator.textContent = `Otimizada ${naturalWidth}x${naturalHeight}`;
              imgElement.parentElement.style.position = 'relative';
              imgElement.parentElement.appendChild(indicator);
            }
          }
        }

        this.processedImages.set(imgElement.src, result);
        resolve(result);
      };

      tempImg.onerror = () => {
        const result = {
          src: imgElement.src,
          error: 'Falha ao carregar imagem',
          optimized: false
        };
        
        this.processedImages.set(imgElement.src, result);
        resolve(result);
      };

      tempImg.src = imgElement.src;
    });
  }

  /**
   * Create optimized version of image using canvas
   */
  createOptimizedVersion(imgElement) {
    try {
      // Guard against SSR environment
      if (typeof document === 'undefined') {
        console.warn('BlogImageMigration: document not available in SSR context');
        return null;
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const { naturalWidth, naturalHeight } = imgElement;
      
      // Calculate better dimensions (max 2x upscale)
      const maxUpscale = 2;
      const targetWidth = Math.min(800, naturalWidth * maxUpscale);
      const targetHeight = (naturalHeight * targetWidth) / naturalWidth;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Apply high-quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Apply subtle enhancements
      ctx.filter = 'contrast(1.05) brightness(1.01)';
      
      // Draw optimized image
      ctx.drawImage(imgElement, 0, 0, targetWidth, targetHeight);
      
      return canvas.toDataURL('image/jpeg', 0.9);
      
    } catch (error) {
      console.error('Erro ao criar versão otimizada:', error);
      return null;
    }
  }

  /**
   * Initialize automatic optimization for the entire page
   */
  initializePageOptimization() {
    // Guard against SSR environment
    if (typeof document === 'undefined') {
      console.warn('BlogImageMigration: document not available in SSR context');
      return;
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.optimizeExistingImages();
      });
    } else {
      this.optimizeExistingImages();
    }

    // Also handle dynamically loaded images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const images = node.querySelectorAll ? 
              node.querySelectorAll('[data-smart-optimization="true"]') : [];
            
            images.forEach((img) => {
              this.optimizeImage(img);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  /**
   * Get optimization statistics
   */
  getStats() {
    return {
      ...this.optimizationStats,
      processedImages: this.processedImages.size
    };
  }

  /**
   * Reset statistics and cache
   */
  reset() {
    this.processedImages.clear();
    this.optimizationStats = {
      totalImages: 0,
      optimizedImages: 0,
      errors: 0,
      skipped: 0
    };
  }
}

// Export singleton instance for global use
const blogImageMigration = new BlogImageMigration();

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  blogImageMigration.initializePageOptimization();
}

export default blogImageMigration;
export { BlogImageMigration };