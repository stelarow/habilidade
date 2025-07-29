/**
 * Image Service - Centralized image processing and optimization service
 * Handles image uploads, processing, and optimization workflows
 */

import { getImageOptimizer } from '../utils/imageOptimizer.js';

class ImageService {
  constructor() {
    this.optimizer = getImageOptimizer();
    this.uploadQueue = new Map();
    this.processingQueue = new Map();
    this.cache = new Map();
    
    this.config = {
      // Upload settings
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
      
      // Processing settings
      defaultOptimization: {
        quality: 80,
        formats: ['webp', 'jpg']
      },
      
      // Batch processing
      batchSize: 5,
      processingDelay: 100, // ms between batches
      
      // Cache settings
      cacheTimeout: 30 * 60 * 1000, // 30 minutes
      maxCacheSize: 100
    };
  }

  /**
   * Process single image file
   */
  async processImage(file, options = {}) {
    const {
      resize = true,
      optimize = true,
      generateThumbnails = false,
      extractMetadata = true,
      generatePlaceholder = true
    } = options;

    // Validate file
    this.validateFile(file);
    
    const processingId = this.generateProcessingId();
    const processingInfo = {
      id: processingId,
      filename: file.name,
      size: file.size,
      type: file.type,
      status: 'processing',
      progress: 0,
      results: {}
    };

    this.processingQueue.set(processingId, processingInfo);

    try {
      // Extract metadata
      if (extractMetadata) {
        processingInfo.progress = 10;
        const metadata = await this.extractImageMetadata(file);
        processingInfo.results.metadata = metadata;
      }

      // Generate placeholder
      if (generatePlaceholder) {
        processingInfo.progress = 20;
        const placeholder = await this.generatePlaceholder(file);
        processingInfo.results.placeholder = placeholder;
      }

      // Optimize main image
      if (optimize) {
        processingInfo.progress = 40;
        const optimized = await this.optimizeImage(file, options);
        processingInfo.results.optimized = optimized;
      }

      // Generate thumbnails
      if (generateThumbnails) {
        processingInfo.progress = 70;
        const thumbnails = await this.generateThumbnails(file, options.thumbnailSizes);
        processingInfo.results.thumbnails = thumbnails;
      }

      // Generate responsive variants
      processingInfo.progress = 90;
      const responsive = await this.generateResponsiveVariants(file, options);
      processingInfo.results.responsive = responsive;

      processingInfo.status = 'completed';
      processingInfo.progress = 100;

      return processingInfo.results;

    } catch (error) {
      processingInfo.status = 'error';
      processingInfo.error = error.message;
      throw error;
    } finally {
      // Clean up processing queue after delay
      setTimeout(() => {
        this.processingQueue.delete(processingId);
      }, 60000); // Keep for 1 minute for status checking
    }
  }

  /**
   * Process multiple images in batches
   */
  async processBatch(files, options = {}) {
    const { batchSize = this.config.batchSize } = options;
    const results = [];
    
    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      const batchPromises = batch.map(file => 
        this.processImage(file, options).catch(error => ({
          error: error.message,
          filename: file.name
        }))
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Delay between batches
      if (i + batchSize < files.length) {
        await this.delay(this.config.processingDelay);
      }
    }

    return results;
  }

  /**
   * Validate uploaded file
   */
  validateFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > this.config.maxFileSize) {
      throw new Error(`File size exceeds maximum of ${this.config.maxFileSize / 1024 / 1024}MB`);
    }

    if (!this.config.allowedFormats.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }
  }

  /**
   * Extract image metadata
   */
  async extractImageMetadata(file) {
    const url = URL.createObjectURL(file);
    
    try {
      const metadata = await this.optimizer.getImageMetadata(url);
      
      // Add file information
      metadata.fileSize = file.size;
      metadata.fileType = file.type;
      metadata.fileName = file.name;
      metadata.lastModified = file.lastModified;
      
      // Calculate additional metrics
      metadata.megapixels = Math.round((metadata.width * metadata.height) / 1000000 * 10) / 10;
      metadata.orientation = metadata.width > metadata.height ? 'landscape' : 
                           metadata.height > metadata.width ? 'portrait' : 'square';
      
      return metadata;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Generate blur placeholder
   */
  async generatePlaceholder(file) {
    const url = URL.createObjectURL(file);
    
    try {
      return await this.optimizer.generateBlurPlaceholder(url, 4);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Optimize single image
   */
  async optimizeImage(file, options = {}) {
    const {
      quality = this.config.defaultOptimization.quality,
      format = 'webp',
      maxWidth = 1920,
      maxHeight = 1080
    } = options;

    const optimized = await this.optimizer.compressImage(file, {
      maxWidth,
      maxHeight,
      quality: quality / 100, // Convert percentage to decimal
      format
    });

    return {
      blob: optimized,
      size: optimized.size,
      format,
      compressionRatio: Math.round((1 - optimized.size / file.size) * 100)
    };
  }

  /**
   * Generate thumbnail variants
   */
  async generateThumbnails(file, sizes = [150, 300, 600]) {
    const thumbnails = {};

    for (const size of sizes) {
      const thumbnail = await this.optimizer.compressImage(file, {
        maxWidth: size,
        maxHeight: size,
        quality: 0.8,
        format: 'webp'
      });

      thumbnails[`${size}w`] = {
        blob: thumbnail,
        size: thumbnail.size,
        width: size,
        height: size
      };
    }

    return thumbnails;
  }

  /**
   * Generate responsive image variants
   */
  async generateResponsiveVariants(file, options = {}) {
    const {
      breakpoints = [640, 768, 1024, 1280, 1536],
      formats = ['webp', 'jpg']
    } = options;

    const variants = {};

    for (const format of formats) {
      variants[format] = {};
      
      for (const breakpoint of breakpoints) {
        const variant = await this.optimizer.compressImage(file, {
          maxWidth: breakpoint,
          maxHeight: Math.round(breakpoint * 0.75), // 4:3 aspect ratio max
          quality: format === 'webp' ? 0.8 : 0.85,
          format: format === 'jpg' ? 'jpeg' : format
        });

        variants[format][`${breakpoint}w`] = {
          blob: variant,
          size: variant.size,
          width: breakpoint
        };
      }
    }

    return variants;
  }

  /**
   * Upload processed images (placeholder for actual upload logic)
   */
  async uploadImages(processedResults, uploadOptions = {}) {
    const { 
      uploadEndpoint = '/api/upload/images',
      generateUrls = true,
      cleanup = true
    } = uploadOptions;

    // This is a placeholder for actual upload implementation
    // In a real application, you would:
    // 1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Generate public URLs
    // 3. Store metadata in database
    // 4. Clean up temporary files

    const uploadResults = {
      urls: {},
      metadata: processedResults.metadata,
      placeholder: processedResults.placeholder
    };

    // Simulate upload process
    if (processedResults.optimized) {
      uploadResults.urls.optimized = 'https://example.com/optimized-image.webp';
    }

    if (processedResults.thumbnails) {
      uploadResults.urls.thumbnails = {};
      Object.keys(processedResults.thumbnails).forEach(size => {
        uploadResults.urls.thumbnails[size] = `https://example.com/thumb-${size}.webp`;
      });
    }

    if (processedResults.responsive) {
      uploadResults.urls.responsive = {};
      Object.entries(processedResults.responsive).forEach(([format, variants]) => {
        uploadResults.urls.responsive[format] = {};
        Object.keys(variants).forEach(size => {
          uploadResults.urls.responsive[format][size] = `https://example.com/${format}-${size}.${format}`;
        });
      });
    }

    return uploadResults;
  }

  /**
   * Get processing status
   */
  getProcessingStatus(processingId) {
    return this.processingQueue.get(processingId) || null;
  }

  /**
   * Get all processing statuses
   */
  getAllProcessingStatuses() {
    return Array.from(this.processingQueue.values());
  }

  /**
   * Cancel processing
   */
  cancelProcessing(processingId) {
    const processing = this.processingQueue.get(processingId);
    if (processing && processing.status === 'processing') {
      processing.status = 'cancelled';
      return true;
    }
    return false;
  }

  /**
   * Clear completed/cancelled processing entries
   */
  clearProcessingHistory() {
    for (const [id, processing] of this.processingQueue.entries()) {
      if (['completed', 'cancelled', 'error'].includes(processing.status)) {
        this.processingQueue.delete(id);
      }
    }
  }

  /**
   * Analyze image for optimal settings
   */
  async analyzeImage(file) {
    const metadata = await this.extractImageMetadata(file);
    const url = URL.createObjectURL(file);
    
    try {
      // Extract dominant colors
      const colors = await this.optimizer.extractDominantColors(url, 5);
      
      // Recommend optimization settings
      const recommendations = this.generateOptimizationRecommendations(metadata);
      
      return {
        metadata,
        colors,
        recommendations
      };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Generate optimization recommendations based on image analysis
   */
  generateOptimizationRecommendations(metadata) {
    const recommendations = {
      quality: 80,
      formats: ['webp', 'jpg'],
      resize: false,
      maxWidth: metadata.width,
      maxHeight: metadata.height
    };

    // Adjust quality based on image characteristics
    if (metadata.megapixels > 8) {
      recommendations.quality = 75; // Higher compression for large images
    }

    if (metadata.fileSize > 5 * 1024 * 1024) { // 5MB
      recommendations.resize = true;
      recommendations.maxWidth = Math.min(1920, metadata.width);
      recommendations.maxHeight = Math.min(1080, metadata.height);
    }

    // Format recommendations
    if (metadata.fileType === 'image/png') {
      recommendations.formats = ['webp', 'png']; // Keep PNG for transparency
    }

    return recommendations;
  }

  /**
   * Utility methods
   */
  generateProcessingId() {
    return `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update service configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get service statistics
   */
  getStats() {
    const processingStatuses = Array.from(this.processingQueue.values());
    
    return {
      processing: {
        total: processingStatuses.length,
        active: processingStatuses.filter(p => p.status === 'processing').length,
        completed: processingStatuses.filter(p => p.status === 'completed').length,
        errors: processingStatuses.filter(p => p.status === 'error').length
      },
      cache: {
        size: this.cache.size,
        maxSize: this.config.maxCacheSize
      },
      config: this.config
    };
  }
}

// Create singleton instance
let imageServiceInstance = null;

export const getImageService = () => {
  if (!imageServiceInstance) {
    imageServiceInstance = new ImageService();
  }
  return imageServiceInstance;
};

// Convenience functions
export const processImage = (file, options) => {
  return getImageService().processImage(file, options);
};

export const processBatch = (files, options) => {
  return getImageService().processBatch(files, options);
};

export const analyzeImage = (file) => {
  return getImageService().analyzeImage(file);
};

export const getProcessingStatus = (id) => {
  return getImageService().getProcessingStatus(id);
};

export default ImageService;