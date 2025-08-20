/**
 * Google Analytics Service
 * Integrates GA4 with the existing analytics system
 * Now works with LazyAnalyticsLoader for improved performance
 */


class GoogleAnalyticsService {
  constructor() {
    this.isEnabled = typeof window !== 'undefined';
  }

  /**
   * Check if analytics is ready, fallback to lazy loader
   */
  isAnalyticsReady() {
    return typeof window !== 'undefined' && typeof window.gtag !== 'undefined';
  }

  /**
   * Send event to Google Analytics
   * Uses lazy loading queue if analytics not ready yet
   */
  sendEvent(eventName, parameters = {}) {
    if (!this.isEnabled) return;

    try {
      if (this.isAnalyticsReady()) {
        window.gtag('event', eventName, parameters);
      } else {
        // Queue event through lazy loader if available
        const lazyLoader = window.lazyAnalyticsLoader;
        if (lazyLoader && typeof lazyLoader.queueEvent === 'function') {
          lazyLoader.queueEvent(eventName, parameters);
        }
      }
    } catch (error) {
      console.warn('[GA] Error sending event:', error);
      // Fallback to lazy loader queue if available
      const lazyLoader = window.lazyAnalyticsLoader;
      if (lazyLoader && typeof lazyLoader.queueEvent === 'function') {
        lazyLoader.queueEvent(eventName, parameters);
      }
    }
  }

  /**
   * Track page view
   */
  trackPageView(path, title) {
    this.sendEvent('page_view', {
      page_path: path,
      page_title: title
    });
  }

  /**
   * Track blog post view
   */
  trackPostView(postSlug, postTitle, category, readingTime) {
    this.sendEvent('view_content', {
      content_type: 'blog_post',
      content_id: postSlug,
      content_title: postTitle,
      content_category: category,
      reading_time: readingTime
    });
  }

  /**
   * Track search
   */
  trackSearch(query, resultsCount) {
    this.sendEvent('search', {
      search_term: query,
      results_count: resultsCount
    });
  }

  /**
   * Track social share
   */
  trackShare(platform, postSlug, postTitle) {
    this.sendEvent('share', {
      method: platform,
      content_type: 'blog_post',
      item_id: postSlug,
      content_title: postTitle
    });
  }

  /**
   * Track category view
   */
  trackCategoryView(categorySlug, categoryName, postsCount) {
    this.sendEvent('view_item_list', {
      item_list_id: categorySlug,
      item_list_name: categoryName,
      items_count: postsCount
    });
  }

  /**
   * Track reading progress milestones
   */
  trackReadingProgress(postSlug, percentage) {
    // Only track significant milestones
    if ([25, 50, 75, 100].includes(percentage)) {
      this.sendEvent('reading_progress', {
        content_id: postSlug,
        percent_scrolled: percentage,
        milestone: `${percentage}%`
      });
    }
  }

  /**
   * Track course CTA clicks
   */
  trackCTAClick(ctaType, location, courseSlug) {
    this.sendEvent('select_content', {
      content_type: 'cta',
      cta_type: ctaType,
      location: location,
      item_id: courseSlug
    });
  }

  /**
   * Track form submissions
   */
  trackFormSubmit(formType, formLocation) {
    this.sendEvent('generate_lead', {
      form_type: formType,
      form_location: formLocation
    });
  }

  /**
   * Track engagement time
   */
  trackEngagementTime(postSlug, timeSpent, engagementLevel) {
    this.sendEvent('user_engagement', {
      content_id: postSlug,
      engagement_time_msec: timeSpent,
      engagement_level: engagementLevel
    });
  }

  /**
   * Track errors
   */
  trackError(errorType, errorMessage, errorLocation) {
    this.sendEvent('exception', {
      description: `${errorType}: ${errorMessage}`,
      fatal: false,
      error_location: errorLocation
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties) {
    if (!this.isEnabled) return;

    try {
      if (this.isAnalyticsReady()) {
        window.gtag('set', 'user_properties', properties);
      } else {
        // Queue as custom event through lazy loader if available
        const lazyLoader = window.lazyAnalyticsLoader;
        if (lazyLoader && typeof lazyLoader.queueEvent === 'function') {
          lazyLoader.queueEvent('set_user_properties', properties);
        }
      }
    } catch (error) {
      console.warn('[GA] Error setting user properties:', error);
    }
  }

  /**
   * Initialize analytics if not already loaded
   * Useful for forcing analytics load in specific scenarios
   */
  ensureAnalyticsLoaded() {
    if (!this.isAnalyticsReady()) {
      const lazyLoader = window.lazyAnalyticsLoader;
      if (lazyLoader && typeof lazyLoader.forceLoad === 'function') {
        lazyLoader.forceLoad();
      }
    }
  }

  /**
   * Check if lazy analytics is ready
   */
  isLazyAnalyticsReady() {
    const lazyLoader = window.lazyAnalyticsLoader;
    return lazyLoader && typeof lazyLoader.isReady === 'function' ? lazyLoader.isReady() : false;
  }

  /**
   * Track custom conversions
   */
  trackConversion(conversionType, value = null) {
    const parameters = {
      conversion_type: conversionType,
      send_to: 'G-J4RJQLG6WP'
    };

    if (value !== null) {
      parameters.value = value;
      parameters.currency = 'BRL';
    }

    this.sendEvent('conversion', parameters);
  }
}

// Create singleton instance
const gaService = new GoogleAnalyticsService();

export default gaService;