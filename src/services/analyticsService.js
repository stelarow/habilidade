/**
 * Analytics Service - LGPD Compliant Blog Analytics
 * Tracks user interactions without collecting personal data
 */

import gaService from './googleAnalyticsService';

class AnalyticsService {
  constructor() {
    this.isEnabled = this.checkConsent();
    this.sessionId = this.generateSessionId();
    this.eventQueue = [];
    this.batchTimeout = null;
    this.BATCH_SIZE = 10;
    this.BATCH_TIMEOUT = 5000; // 5 seconds
    
    // Initialize tracking if consent is given
    if (this.isEnabled) {
      this.initializeTracking();
    }
  }

  /**
   * Check if user has given consent for analytics
   */
  checkConsent() {
    try {
      const consent = localStorage.getItem('habilidade_analytics_consent');
      return consent === 'true';
    } catch (error) {
      console.warn('[Analytics] Could not check consent:', error);
      return false;
    }
  }

  /**
   * Set user consent for analytics
   */
  setConsent(hasConsent) {
    try {
      localStorage.setItem('habilidade_analytics_consent', hasConsent.toString());
      this.isEnabled = hasConsent;
      
      if (hasConsent) {
        this.initializeTracking();
      } else {
        this.clearData();
      }
    } catch (error) {
      console.warn('[Analytics] Could not set consent:', error);
    }
  }

  /**
   * Generate anonymous session ID
   */
  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Initialize tracking mechanisms
   */
  initializeTracking() {
    this.setupScrollTracking();
    this.setupVisibilityTracking();
    this.setupUnloadTracking();
  }

  /**
   * Generic event tracking method
   */
  track(event, properties = {}) {
    if (!this.isEnabled) return;

    const eventData = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        url: window.location.pathname,
        referrer: document.referrer || 'direct',
        userAgent: this.sanitizeUserAgent(navigator.userAgent),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    this.eventQueue.push(eventData);
    this.processBatch();
  }

  /**
   * Track blog post view
   */
  trackPostView(postSlug, postTitle, category, readingTime) {
    this.track('post_view', {
      postSlug,
      postTitle: this.sanitizeText(postTitle),
      category,
      readingTime,
      viewStartTime: Date.now()
    });

    // Send to Google Analytics
    gaService.trackPostView(postSlug, postTitle, category, readingTime);

    // Start tracking time on page
    this.startTimeTracking(postSlug);
  }

  /**
   * Track search queries
   */
  trackSearch(query, resultsCount, category = null) {
    this.track('search', {
      query: this.sanitizeText(query),
      resultsCount,
      category,
      queryLength: query.length
    });

    // Send to Google Analytics
    gaService.trackSearch(query, resultsCount);
  }

  /**
   * Track social sharing
   */
  trackShare(platform, postSlug, postTitle) {
    this.track('share', {
      platform,
      postSlug,
      postTitle: this.sanitizeText(postTitle)
    });

    // Send to Google Analytics
    gaService.trackShare(platform, postSlug, postTitle);
  }

  /**
   * Track category navigation
   */
  trackCategoryView(categorySlug, categoryName, postsCount) {
    this.track('category_view', {
      categorySlug,
      categoryName: this.sanitizeText(categoryName),
      postsCount
    });

    // Send to Google Analytics
    gaService.trackCategoryView(categorySlug, categoryName, postsCount);
  }

  /**
   * Track reading progress
   */
  trackReadingProgress(postSlug, percentage) {
    // Only track at meaningful intervals
    const milestones = [25, 50, 75, 90, 100];
    if (milestones.includes(percentage)) {
      this.track('reading_progress', {
        postSlug,
        percentage,
        milestone: `${percentage}%`
      });

      // Send to Google Analytics
      gaService.trackReadingProgress(postSlug, percentage);
    }
  }

  /**
   * Track time spent on page
   */
  startTimeTracking(postSlug) {
    this.currentPost = {
      slug: postSlug,
      startTime: Date.now(),
      lastActiveTime: Date.now()
    };

    // Update active time on user interaction
    const updateActiveTime = () => {
      if (this.currentPost) {
        this.currentPost.lastActiveTime = Date.now();
      }
    };

    ['click', 'scroll', 'keydown', 'mousemove'].forEach(event => {
      document.addEventListener(event, updateActiveTime, { passive: true });
    });
  }

  /**
   * Setup scroll tracking for reading progress
   */
  setupScrollTracking() {
    let ticking = false;
    const trackScrollProgress = () => {
      if (!ticking && this.currentPost) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = Math.round((scrollTop / docHeight) * 100);
          
          if (scrollPercent >= 0 && scrollPercent <= 100) {
            this.trackReadingProgress(this.currentPost.slug, scrollPercent);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', trackScrollProgress, { passive: true });
  }

  /**
   * Setup page visibility tracking
   */
  setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.currentPost) {
        this.trackTimeOnPage();
      } else if (!document.hidden && this.currentPost) {
        this.currentPost.lastActiveTime = Date.now();
      }
    });
  }

  /**
   * Setup unload tracking
   */
  setupUnloadTracking() {
    window.addEventListener('beforeunload', () => {
      if (this.currentPost) {
        this.trackTimeOnPage();
      }
      this.flushEvents();
    });
  }

  /**
   * Track total time spent on page
   */
  trackTimeOnPage() {
    if (!this.currentPost) return;

    const timeSpent = this.currentPost.lastActiveTime - this.currentPost.startTime;
    
    // Only track if user was active for at least 10 seconds
    if (timeSpent >= 10000) {
      const engagementLevel = this.calculateEngagementLevel(timeSpent);
      
      this.track('time_on_page', {
        postSlug: this.currentPost.slug,
        timeSpent: Math.round(timeSpent / 1000), // in seconds
        engagementLevel
      });

      // Send to Google Analytics
      gaService.trackEngagementTime(this.currentPost.slug, timeSpent, engagementLevel);
    }

    this.currentPost = null;
  }

  /**
   * Calculate engagement level based on time spent
   */
  calculateEngagementLevel(timeSpent) {
    const seconds = timeSpent / 1000;
    if (seconds < 30) return 'low';
    if (seconds < 120) return 'medium';
    if (seconds < 300) return 'high';
    return 'very_high';
  }

  /**
   * Process event queue in batches
   */
  processBatch() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    if (this.eventQueue.length >= this.BATCH_SIZE) {
      this.flushEvents();
    } else {
      this.batchTimeout = setTimeout(() => {
        this.flushEvents();
      }, this.BATCH_TIMEOUT);
    }
  }

  /**
   * Send events to analytics endpoint
   */
  async flushEvents() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // In production, this would send to your analytics endpoint
      // For now, we'll store locally and log for development
      await this.sendEvents(events);
    } catch (error) {
      console.warn('[Analytics] Failed to send events:', error);
      // Re-queue events for retry
      this.eventQueue.unshift(...events);
    }

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }

  /**
   * Send events to analytics backend
   */
  async sendEvents(events) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Events:', events);
      this.storeEventsLocally(events);
      return;
    }

    // In production, send to your analytics API
    const response = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events })
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status}`);
    }
  }

  /**
   * Store events locally for development/debugging
   */
  storeEventsLocally(events) {
    try {
      const existing = JSON.parse(localStorage.getItem('habilidade_analytics_events') || '[]');
      const updated = [...existing, ...events].slice(-1000); // Keep last 1000 events
      localStorage.setItem('habilidade_analytics_events', JSON.stringify(updated));
    } catch (error) {
      console.warn('[Analytics] Could not store events locally:', error);
    }
  }

  /**
   * Get analytics summary (for development/debugging)
   */
  getAnalyticsSummary() {
    try {
      const events = JSON.parse(localStorage.getItem('habilidade_analytics_events') || '[]');
      
      const summary = {
        totalEvents: events.length,
        eventTypes: {},
        topPosts: {},
        topSearches: {},
        topCategories: {}
      };

      events.forEach(event => {
        // Count event types
        summary.eventTypes[event.event] = (summary.eventTypes[event.event] || 0) + 1;

        // Count post views
        if (event.event === 'post_view') {
          const slug = event.properties.postSlug;
          summary.topPosts[slug] = (summary.topPosts[slug] || 0) + 1;
        }

        // Count searches
        if (event.event === 'search') {
          const query = event.properties.query;
          summary.topSearches[query] = (summary.topSearches[query] || 0) + 1;
        }

        // Count category views
        if (event.event === 'category_view') {
          const category = event.properties.categorySlug;
          summary.topCategories[category] = (summary.topCategories[category] || 0) + 1;
        }
      });

      return summary;
    } catch (error) {
      console.warn('[Analytics] Could not generate summary:', error);
      return null;
    }
  }

  /**
   * Clear all analytics data
   */
  clearData() {
    try {
      localStorage.removeItem('habilidade_analytics_events');
      this.eventQueue = [];
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
        this.batchTimeout = null;
      }
    } catch (error) {
      console.warn('[Analytics] Could not clear data:', error);
    }
  }

  /**
   * Sanitize text to remove potentially sensitive information
   */
  sanitizeText(text) {
    if (!text) return '';
    
    // Remove emails, phone numbers, and other PII patterns
    return text
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email]')
      .replace(/\b\d{4,}\b/g, '[number]')
      .substring(0, 200); // Limit length
  }

  /**
   * Sanitize user agent to remove detailed version info
   */
  sanitizeUserAgent(userAgent) {
    if (!userAgent) return '';
    
    // Extract only browser family and OS family
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)/i);
    const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/i);
    
    return `${browserMatch?.[0] || 'Unknown'} on ${osMatch?.[0] || 'Unknown'}`;
  }
}

// Create singleton instance
const analytics = new AnalyticsService();

// Export convenience methods
export const trackPostView = (postSlug, postTitle, category, readingTime) =>
  analytics.trackPostView(postSlug, postTitle, category, readingTime);

export const trackSearch = (query, resultsCount, category) =>
  analytics.trackSearch(query, resultsCount, category);

export const trackShare = (platform, postSlug, postTitle) =>
  analytics.trackShare(platform, postSlug, postTitle);

export const trackCategoryView = (categorySlug, categoryName, postsCount) =>
  analytics.trackCategoryView(categorySlug, categoryName, postsCount);

export const setAnalyticsConsent = (hasConsent) =>
  analytics.setConsent(hasConsent);

export const getAnalyticsSummary = () =>
  analytics.getAnalyticsSummary();

export const clearAnalyticsData = () =>
  analytics.clearData();

export default analytics;