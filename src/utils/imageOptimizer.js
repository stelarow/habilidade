/**
 * Image Optimizer - Advanced image optimization utilities
 * Features: Multiple format support, compression, responsive sizing
 */

class ImageOptimizer {
  constructor() {
    this.config = {
      // Default breakpoints for responsive images
      breakpoints: [640, 768, 1024, 1280, 1536],
      
      // Format priorities (browser will use first supported)
      formatPriority: ['avif', 'webp', 'jpg'],
      
      // Quality settings by format
      defaultQuality: {
        avif: 50,  // AVIF can use lower quality with better results
        webp: 80,  // WebP optimal quality
        jpg: 85,   // JPEG fallback quality
        png: 100   // PNG lossless
      },
      
      // Context-based optimization
      contextSettings: {
        thumbnail: { maxWidth: 300, quality: 75 },
        card: { maxWidth: 600, quality: 80 },
        hero: { maxWidth: 1920, quality: 85 },
        gallery: { maxWidth: 1200, quality: 80 },
        avatar: { maxWidth: 200, quality: 80 }
      },
      
      // CDN/Service endpoints
      serviceEndpoints: {
        // Can be configured for different image services
        default: null, // Use original URL
        // cloudinary: 'https://res.cloudinary.com/{cloud_name}/image/fetch/',
        // imagekit: 'https://ik.imagekit.io/{imagekit_id}/',
      },
      
      // Browser support detection
      supportedFormats: null // Will be detected
    };
    
    this.detectFormatSupport();
  }

  /**
   * Detect browser format support
   */
  async detectFormatSupport() {
    if (typeof window === 'undefined') {
      this.config.supportedFormats = ['jpg', 'png']; // Server-side fallback
      return;
    }

    const supported = {
      avif: false,
      webp: false,
      jpg: true,
      png: true
    };

    // Check AVIF support
    try {
      const avifCanvas = document.createElement('canvas');
      avifCanvas.width = 1;
      avifCanvas.height = 1;
      supported.avif = avifCanvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch (e) {
      supported.avif = false;
    }

    // Check WebP support
    try {
      const webpCanvas = document.createElement('canvas');
      webpCanvas.width = 1;
      webpCanvas.height = 1;
      supported.webp = webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (e) {
      supported.webp = false;
    }

    this.config.supportedFormats = supported;
  }

  /**
   * Generate optimized image URL
   */
  /**
   * Generate optimized image URL with intelligent resizing
   */
  async generateUrl(src, options = {}) {
    if (!src) return '';

    const {
      width,
      height,
      format = 'auto',
      quality = 'auto',
      context = 'default',
      crop = 'cover',
      gravity = 'center'
    } = options;

    // Apply context-based settings
    const contextConfig = this.config.contextSettings[context] || {};
    const effectiveWidth = width || contextConfig.maxWidth;
    const effectiveQuality = quality === 'auto' 
      ? (contextConfig.quality || this.getOptimalQuality(format))
      : quality;

    // Determine best format
    const targetFormat = format === 'auto' ? this.getBestFormat() : format;

    // Use intelligent resizing system
    try {
      const optimizedUrl = await this.buildServiceUrl(src, {
        width: effectiveWidth,
        height,
        format: targetFormat,
        quality: effectiveQuality,
        crop,
        gravity
      });
      
      return optimizedUrl;
    } catch (error) {
      console.warn('Image optimization failed, using original:', error);
      return src;
    }
  }

  /**
   * Get optimal quality for format
   */
  getOptimalQuality(format) {
    return this.config.defaultQuality[format] || this.config.defaultQuality.jpg;
  }

  /**
   * Get best supported format
   */
  getBestFormat() {
    if (!this.config.supportedFormats) {
      return 'jpg'; // Fallback
    }

    // Return first supported format from priority list
    for (const format of this.config.formatPriority) {
      if (this.config.supportedFormats[format]) {
        return format;
      }
    }

    return 'jpg'; // Ultimate fallback
  }

  /**
   * Build service-specific URL (placeholder for future CDN integration)
   */
  /**
   * Build service-specific URL with intelligent resizing
   */
  buildServiceUrl(src, params) {
    // Check if we can get image dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
        const targetWidth = params.width;
        
        // If image is smaller than target and would be stretched, apply smart resizing
        if (originalWidth < targetWidth && originalWidth < 600) {
          // Use canvas to upscale with better quality
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate better dimensions (max 2x upscale to maintain quality)
          const maxUpscale = 2;
          const effectiveWidth = Math.min(targetWidth, originalWidth * maxUpscale);
          const effectiveHeight = (originalHeight * effectiveWidth) / originalWidth;
          
          canvas.width = effectiveWidth;
          canvas.height = effectiveHeight;
          
          // Use image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Draw and upscale
          ctx.drawImage(img, 0, 0, effectiveWidth, effectiveHeight);
          
          // Return the enhanced image as data URL
          resolve(canvas.toDataURL('image/jpeg', params.quality / 100));
        } else {
          // Image is adequate size, return original
          resolve(src);
        }
      };
      
      img.onerror = () => {
        // Fallback to original if we can't process
        resolve(src);
      };
      
      img.src = src;
    });
  }

  /**
   * Generate responsive image srcSet
   */
  async generateSrcSet(src, options = {}) {
    const {
      breakpoints = this.config.breakpoints,
      format = 'auto',
      quality = 'auto',
      context = 'default'
    } = options;

    const promises = breakpoints.map(async width => {
      const url = await this.generateUrl(src, {
        width,
        format,
        quality,
        context
      });
      return `${url} ${width}w`;
    });

    const results = await Promise.all(promises);
    return results.join(', ');
  }

  /**
   * Generate multiple format sources for <picture> element
   */
  async generateSources(src, options = {}) {
    const {
      breakpoints = this.config.breakpoints,
      formats = this.config.formatPriority,
      quality = 'auto',
      context = 'default',
      sizes = '100vw'
    } = options;

    const promises = formats
      .filter(format => this.isFormatSupported(format))
      .map(async format => ({
        type: `image/${format === 'jpg' ? 'jpeg' : format}`,
        srcSet: await this.generateSrcSet(src, {
          breakpoints,
          format,
          quality,
          context
        }),
        sizes
      }));

    return Promise.all(promises);
  }

  /**
   * Check if format is supported
   */
  isFormatSupported(format) {
    if (!this.config.supportedFormats) return true; // Assume supported if not detected
    return this.config.supportedFormats[format] || false;
  }

  /**
   * Compress image file (client-side)
   */
  async compressImage(file, options = {}) {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Extract dominant colors from image
   */
  async extractDominantColors(imageSrc, colorCount = 5) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Use small canvas for performance
        const sampleSize = 100;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        
        try {
          const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
          const colors = this.analyzeColors(imageData.data, colorCount);
          resolve(colors);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image for color analysis'));
      img.src = imageSrc;
    });
  }

  /**
   * Analyze colors from image data
   */
  analyzeColors(imageData, colorCount) {
    const colorMap = new Map();
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < imageData.length; i += 16) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const a = imageData[i + 3];
      
      // Skip transparent pixels
      if (a < 128) continue;
      
      // Reduce color precision to group similar colors
      const reducedR = Math.floor(r / 32) * 32;
      const reducedG = Math.floor(g / 32) * 32;
      const reducedB = Math.floor(b / 32) * 32;
      
      const colorKey = `${reducedR}-${reducedG}-${reducedB}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }
    
    // Sort by frequency and return top colors
    return Array.from(colorMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, colorCount)
      .map(([color, count]) => {
        const [r, g, b] = color.split('-').map(Number);
        return {
          rgb: `rgb(${r}, ${g}, ${b})`,
          hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
          count
        };
      });
  }

  /**
   * Generate blur placeholder from image
   */
  async generateBlurPlaceholder(imageSrc, size = 4) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = size;
        canvas.height = size;
        
        // Draw very small version
        ctx.drawImage(img, 0, 0, size, size);
        
        // Convert to low-quality data URL
        const dataURL = canvas.toDataURL('image/jpeg', 0.1);
        resolve(dataURL);
      };
      
      img.onerror = () => reject(new Error('Failed to generate blur placeholder'));
      img.src = imageSrc;
    });
  }

  /**
   * Preload critical images
   */
  preloadImages(urls, options = {}) {
    const { priority = true, formats = ['webp'] } = options;
    
    if (!priority) return [];

    return urls.map(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = this.generateUrl(url, {
        width: 1024,
        format: formats[0],
        quality: 80
      });
      
      document.head.appendChild(link);
      return link;
    });
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(imageSrc) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          src: imageSrc
        });
      };
      
      img.onerror = () => reject(new Error('Failed to load image metadata'));
      img.src = imageSrc;
    });
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }
}

// Create singleton instance
let imageOptimizerInstance = null;

export const getImageOptimizer = () => {
  if (!imageOptimizerInstance) {
    imageOptimizerInstance = new ImageOptimizer();
  }
  return imageOptimizerInstance;
};

// Convenience functions
export const generateOptimizedUrl = (src, options) => {
  return getImageOptimizer().generateUrl(src, options);
};

export const generateSrcSet = (src, options) => {
  return getImageOptimizer().generateSrcSet(src, options);
};

export const generateSources = (src, options) => {
  return getImageOptimizer().generateSources(src, options);
};

export const compressImage = (file, options) => {
  return getImageOptimizer().compressImage(file, options);
};

export const extractDominantColors = (imageSrc, colorCount) => {
  return getImageOptimizer().extractDominantColors(imageSrc, colorCount);
};

export const generateBlurPlaceholder = (imageSrc, size) => {
  return getImageOptimizer().generateBlurPlaceholder(imageSrc, size);
};

export const preloadImages = (urls, options) => {
  return getImageOptimizer().preloadImages(urls, options);
};

export default ImageOptimizer;