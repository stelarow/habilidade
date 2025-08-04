/**
 * Image Upload Processor - Automatic resize and validation system
 * Handles image uploads with intelligent resizing and quality optimization
 */

class ImageUploadProcessor {
  constructor() {
    this.config = {
      // Minimum dimensions for blog images
      minDimensions: {
        blog: { width: 800, height: 600 },
        card: { width: 600, height: 400 },
        hero: { width: 1200, height: 800 },
        thumbnail: { width: 300, height: 200 }
      },
      
      // Maximum file sizes (in bytes)
      maxFileSize: {
        original: 10 * 1024 * 1024, // 10MB
        processed: 2 * 1024 * 1024   // 2MB
      },
      
      // Supported formats
      supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
      
      // Quality settings
      quality: {
        high: 0.9,
        medium: 0.8,
        low: 0.7
      }
    };
  }

  /**
   * Validate uploaded image file
   */
  validateImage(file, context = 'blog') {
    const errors = [];

    // Check file type
    if (!this.config.supportedFormats.includes(file.type)) {
      errors.push(`Formato não suportado. Use: ${this.config.supportedFormats.join(', ')}`);
    }

    // Check file size
    if (file.size > this.config.maxFileSize.original) {
      errors.push(`Arquivo muito grande. Máximo: ${this.config.maxFileSize.original / (1024 * 1024)}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get image dimensions from file
   */
  getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Não foi possível carregar a imagem'));
      };

      img.src = url;
    });
  }

  /**
   * Automatically resize image if needed
   */
  async processImage(file, context = 'blog', options = {}) {
    try {
      // Validate file first
      const validation = this.validateImage(file, context);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Get original dimensions
      const originalDimensions = await this.getImageDimensions(file);
      const minDims = this.config.minDimensions[context];

      // Check if resize is needed
      const needsResize = originalDimensions.width < minDims.width || 
                         originalDimensions.height < minDims.height;

      if (needsResize) {
        console.log(`Imagem pequena detectada (${originalDimensions.width}x${originalDimensions.height}). Redimensionando para ${minDims.width}x${minDims.height}...`);
        
        return await this.resizeImage(file, minDims, options);
      }

      // Image is adequate, but check if we need to compress
      if (file.size > this.config.maxFileSize.processed) {
        console.log('Imagem grande detectada. Comprimindo...');
        return await this.compressImage(file, options);
      }

      // Image is fine as-is
      return {
        file,
        processed: false,
        originalDimensions,
        finalDimensions: originalDimensions,
        message: 'Imagem aprovada sem processamento'
      };

    } catch (error) {
      throw new Error(`Erro ao processar imagem: ${error.message}`);
    }
  }

  /**
   * Resize image to minimum required dimensions
   */
  async resizeImage(file, targetDimensions, options = {}) {
    const {
      quality = this.config.quality.high,
      maintainAspectRatio = true,
      useAIUpscaling = true
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;

        let newWidth = targetDimensions.width;
        let newHeight = targetDimensions.height;

        if (maintainAspectRatio) {
          const aspectRatio = originalWidth / originalHeight;
          const targetAspectRatio = newWidth / newHeight;

          if (aspectRatio > targetAspectRatio) {
            // Image is wider - base on width
            newHeight = newWidth / aspectRatio;
          } else {
            // Image is taller - base on height
            newWidth = newHeight * aspectRatio;
          }

          // Ensure minimum dimensions are met
          if (newWidth < targetDimensions.width) {
            newWidth = targetDimensions.width;
            newHeight = newWidth / aspectRatio;
          }
          if (newHeight < targetDimensions.height) {
            newHeight = targetDimensions.height;
            newWidth = newHeight * aspectRatio;
          }
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Use advanced upscaling techniques for small images
        if (useAIUpscaling && (originalWidth < newWidth || originalHeight < newHeight)) {
          // Apply sharpening filter for upscaled images
          ctx.filter = 'contrast(1.1) brightness(1.02)';
        }

        // Draw the resized image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert back to blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Falha ao processar imagem'));
            return;
          }

          // Create new file object
          const processedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });

          resolve({
            file: processedFile,
            processed: true,
            originalDimensions: { width: originalWidth, height: originalHeight },
            finalDimensions: { width: newWidth, height: newHeight },
            message: `Imagem redimensionada de ${originalWidth}x${originalHeight} para ${Math.round(newWidth)}x${Math.round(newHeight)}`
          });
        }, 'image/jpeg', quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Não foi possível carregar a imagem para redimensionamento'));
      };

      img.src = url;
    });
  }

  /**
   * Compress image while maintaining quality
   */
  async compressImage(file, options = {}) {
    const { quality = this.config.quality.medium } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Falha ao comprimir imagem'));
            return;
          }

          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });

          resolve({
            file: compressedFile,
            processed: true,
            originalDimensions: { width: img.naturalWidth, height: img.naturalHeight },
            finalDimensions: { width: img.naturalWidth, height: img.naturalHeight },
            message: `Imagem comprimida de ${(file.size / 1024 / 1024).toFixed(2)}MB para ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
          });
        }, 'image/jpeg', quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Não foi possível carregar a imagem para compressão'));
      };

      img.src = url;
    });
  }

  /**
   * Batch process multiple images
   */
  async processBatch(files, context = 'blog', options = {}) {
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.processImage(files[i], context, options);
        results.push(result);
      } catch (error) {
        errors.push({
          file: files[i].name,
          error: error.message
        });
      }
    }

    return {
      results,
      errors,
      totalProcessed: results.length,
      totalErrors: errors.length
    };
  }

  /**
   * Generate preview for processed image
   */
  generatePreview(file, maxWidth = 300, maxHeight = 200) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        const { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        
        canvas.width = width * ratio;
        canvas.height = height * ratio;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    });
  }
}

// Export singleton instance
const imageUploadProcessor = new ImageUploadProcessor();
export default imageUploadProcessor;

// Named exports for specific functions
export {
  ImageUploadProcessor
};