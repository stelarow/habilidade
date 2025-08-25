import { parse } from "node-html-parser";
class BlogImageMigration {
  constructor() {
    this.processedImages = /* @__PURE__ */ new Map();
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
    if (!content || typeof content !== "string") {
      return content;
    }
    try {
      const root = parse(content);
      const images = root.querySelectorAll("img");
      this.optimizationStats.totalImages += images.length;
      images.forEach((img, index) => {
        const src = img.getAttribute("src");
        const alt = img.getAttribute("alt") || "";
        const className = img.getAttribute("class") || "";
        if (!src) {
          this.optimizationStats.skipped++;
          return;
        }
        const isLocalBlogImage = src.includes("/images/blog/") || src.startsWith("/images/");
        if (isLocalBlogImage) {
          const smartImageHtml = this.generateSmartImageHtml(src, alt, className, index);
          img.replaceWith(parse(smartImageHtml));
          this.optimizationStats.optimizedImages++;
        } else {
          this.optimizationStats.skipped++;
        }
      });
      return root.toString();
    } catch (error) {
      console.error("Erro ao migrar conteúdo do blog:", error);
      this.optimizationStats.errors++;
      return content;
    }
  }
  /**
   * Generate SmartBlogImage HTML wrapper
   */
  generateSmartImageHtml(src, alt, className = "", index = 0) {
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
        <\/script>
      </div>
    `;
  }
  /**
   * Apply client-side image optimization to existing images
   */
  async optimizeExistingImages() {
    if (typeof document === "undefined") {
      console.warn("BlogImageMigration: document not available in SSR context");
      return [];
    }
    const smartImages = document.querySelectorAll('[data-smart-optimization="true"]');
    const results = [];
    for (const img of smartImages) {
      try {
        const result = await this.optimizeImage(img);
        results.push(result);
      } catch (error) {
        console.error("Erro ao otimizar imagem:", error);
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
      if (this.processedImages.has(imgElement.src)) {
        resolve(this.processedImages.get(imgElement.src));
        return;
      }
      const tempImg = new Image();
      tempImg.crossOrigin = "anonymous";
      tempImg.onload = () => {
        const { naturalWidth, naturalHeight } = tempImg;
        const isSmall = naturalWidth < 600;
        let result = {
          src: imgElement.src,
          originalDimensions: { width: naturalWidth, height: naturalHeight },
          optimized: false,
          message: "Imagem em tamanho adequado"
        };
        if (isSmall) {
          const optimizedSrc = this.createOptimizedVersion(tempImg);
          if (optimizedSrc) {
            imgElement.src = optimizedSrc;
            imgElement.classList.add("blog-image-optimized");
            const maxWidth = Math.min(600, naturalWidth * 2);
            imgElement.style.maxWidth = `${maxWidth}px`;
            imgElement.style.height = "auto";
            result = {
              ...result,
              optimized: true,
              optimizedSrc,
              message: `Imagem otimizada de ${naturalWidth}x${naturalHeight} para melhor qualidade`
            };
          }
        }
        this.processedImages.set(imgElement.src, result);
        resolve(result);
      };
      tempImg.onerror = () => {
        const result = {
          src: imgElement.src,
          error: "Falha ao carregar imagem",
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
      if (typeof document === "undefined") {
        console.warn("BlogImageMigration: document not available in SSR context");
        return null;
      }
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const { naturalWidth, naturalHeight } = imgElement;
      const maxUpscale = 2;
      const targetWidth = Math.min(800, naturalWidth * maxUpscale);
      const targetHeight = naturalHeight * targetWidth / naturalWidth;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.filter = "contrast(1.05) brightness(1.01)";
      ctx.drawImage(imgElement, 0, 0, targetWidth, targetHeight);
      return canvas.toDataURL("image/jpeg", 0.9);
    } catch (error) {
      console.error("Erro ao criar versão otimizada:", error);
      return null;
    }
  }
  /**
   * Initialize automatic optimization for the entire page
   */
  initializePageOptimization() {
    if (typeof document === "undefined") {
      console.warn("BlogImageMigration: document not available in SSR context");
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.optimizeExistingImages();
      });
    } else {
      this.optimizeExistingImages();
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const images = node.querySelectorAll ? node.querySelectorAll('[data-smart-optimization="true"]') : [];
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
const blogImageMigration = new BlogImageMigration();
if (typeof window !== "undefined") {
  blogImageMigration.initializePageOptimization();
}
export {
  BlogImageMigration,
  blogImageMigration as default
};
