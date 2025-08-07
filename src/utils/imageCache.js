class ImageCache {
  constructor() {
    this.cache = new Map();
    this.preloadedImages = new Set();
    this.loadingPromises = new Map();
  }

  /**
   * Preload multiple images URLs
   * @param {string[]} urls - Array of image URLs to preload
   * @returns {Promise<void[]>} Promise that resolves when all images are loaded
   */
  preload(urls) {
    const promises = urls.map(url => this.loadImage(url));
    return Promise.allSettled(promises);
  }

  /**
   * Load a single image and add to cache
   * @param {string} url - Image URL to load
   * @returns {Promise<HTMLImageElement>} Promise that resolves with the loaded image
   */
  loadImage(url) {
    // Return cached promise if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // Return cached image if already loaded
    if (this.preloadedImages.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }

    // Create new loading promise
    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(url, img);
        this.preloadedImages.add(url);
        this.loadingPromises.delete(url);
        resolve(img);
      };
      
      img.onerror = (error) => {
        this.loadingPromises.delete(url);
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      // Add crossorigin attribute for external images
      if (url.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.src = url;
    });

    // Store loading promise
    this.loadingPromises.set(url, loadPromise);
    return loadPromise;
  }

  /**
   * Get cached image
   * @param {string} url - Image URL
   * @returns {HTMLImageElement|null} Cached image or null if not found
   */
  get(url) {
    return this.cache.get(url) || null;
  }

  /**
   * Check if image is cached
   * @param {string} url - Image URL
   * @returns {boolean} True if image is cached
   */
  has(url) {
    return this.preloadedImages.has(url);
  }

  /**
   * Clear all cached images
   */
  clear() {
    this.cache.clear();
    this.preloadedImages.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    return {
      cachedImages: this.cache.size,
      loadingImages: this.loadingPromises.size,
      totalAttempts: this.preloadedImages.size + this.loadingPromises.size
    };
  }
}

// Export singleton instance
export const imageCache = new ImageCache();

// Export class for creating additional instances if needed
export { ImageCache };

// Utility function to preload company logos specifically
export const preloadCompanyLogos = async (companies) => {
  const logoUrls = companies.map(company => company.logo).filter(Boolean);
  console.log(`Preloading ${logoUrls.length} company logos...`);
  
  try {
    const results = await imageCache.preload(logoUrls);
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    console.log(`Logo preloading complete: ${successful} successful, ${failed} failed`);
    return { successful, failed, total: logoUrls.length };
  } catch (error) {
    console.error('Error preloading company logos:', error);
    throw error;
  }
};