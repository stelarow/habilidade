import { useCallback } from 'react';

/**
 * Hook for tracking contact interactions and analytics
 * Integrates with Google Analytics and custom tracking
 */
export const useContactAnalytics = () => {
  
  /**
   * Track contact click events
   * @param {Object} data - Tracking data
   */
  const trackContactClick = useCallback((data) => {
    const {
      channel, // whatsapp, email, phone
      source, // floating-button, contact-section, quick-modal
      article = 'unknown',
      category = 'unknown',
      position = 'unknown',
      message = ''
    } = data;

    // Google Analytics event tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'contact_click', {
        event_category: 'Contact',
        event_label: `${channel}_${source}`,
        custom_parameter_1: article,
        custom_parameter_2: category,
        custom_parameter_3: position,
        value: 1
      });
    }

    // Custom analytics tracking
    const trackingData = {
      event: 'contact_click',
      timestamp: new Date().toISOString(),
      channel,
      source,
      article,
      category,
      position,
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      sessionId: getSessionId(),
      message: message.substring(0, 100) // First 100 chars for privacy
    };

    // Send to analytics endpoint (if available)
    sendAnalytics(trackingData);

    // Store in localStorage for dashboard
    storeContactInteraction(trackingData);

    console.log('Contact interaction tracked:', trackingData);
  }, []);

  /**
   * Track contact form submissions
   * @param {Object} data - Form submission data
   */
  const trackFormSubmission = useCallback((data) => {
    const {
      formType, // contact-form, quick-contact, consultation
      source,
      article = 'unknown',
      success = false
    } = data;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        event_category: 'Form',
        event_label: formType,
        custom_parameter_1: source,
        custom_parameter_2: article,
        value: success ? 1 : 0
      });
    }

    const trackingData = {
      event: 'form_submission',
      timestamp: new Date().toISOString(),
      formType,
      source,
      article,
      success,
      url: window.location.href,
      sessionId: getSessionId()
    };

    sendAnalytics(trackingData);
    storeContactInteraction(trackingData);
  }, []);

  /**
   * Track page engagement for contact targeting
   * @param {Object} data - Engagement data
   */
  const trackEngagement = useCallback((data) => {
    const {
      article,
      timeOnPage,
      scrollDepth,
      interactions = []
    } = data;

    const engagementScore = calculateEngagementScore(timeOnPage, scrollDepth, interactions);

    const trackingData = {
      event: 'page_engagement',
      timestamp: new Date().toISOString(),
      article,
      timeOnPage,
      scrollDepth,
      interactions: interactions.length,
      engagementScore,
      url: window.location.href,
      sessionId: getSessionId()
    };

    sendAnalytics(trackingData);
    
    // Store for contact optimization
    localStorage.setItem('lastEngagement', JSON.stringify(trackingData));
  }, []);

  /**
   * Get contact conversion metrics
   * @returns {Object} Conversion metrics
   */
  const getConversionMetrics = useCallback(() => {
    try {
      const interactions = JSON.parse(localStorage.getItem('contactInteractions') || '[]');
      const last30Days = interactions.filter(
        interaction => 
          Date.now() - new Date(interaction.timestamp).getTime() < 30 * 24 * 60 * 60 * 1000
      );

      const metrics = {
        totalInteractions: last30Days.length,
        whatsappClicks: last30Days.filter(i => i.channel === 'whatsapp').length,
        emailClicks: last30Days.filter(i => i.channel === 'email').length,
        phoneClicks: last30Days.filter(i => i.channel === 'phone').length,
        topSources: getTopSources(last30Days),
        topArticles: getTopArticles(last30Days),
        conversionByHour: getConversionByHour(last30Days)
      };

      return metrics;
    } catch (error) {
      console.error('Error getting conversion metrics:', error);
      return null;
    }
  }, []);

  return {
    trackContactClick,
    trackFormSubmission,
    trackEngagement,
    getConversionMetrics
  };
};

/**
 * Generate or retrieve session ID
 * @returns {string} Session ID
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('contactSessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('contactSessionId', sessionId);
  }
  return sessionId;
};

/**
 * Send analytics data to endpoint
 * @param {Object} data - Analytics data
 */
const sendAnalytics = async (data) => {
  try {
    // In a real implementation, you would send this to your analytics endpoint
    // For now, we'll just log it
    console.log('Analytics data:', data);
    
    // Example API call:
    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  } catch (error) {
    console.error('Error sending analytics:', error);
  }
};

/**
 * Store contact interaction in localStorage
 * @param {Object} data - Interaction data
 */
const storeContactInteraction = (data) => {
  try {
    const interactions = JSON.parse(localStorage.getItem('contactInteractions') || '[]');
    interactions.push(data);
    
    // Keep only last 100 interactions
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100);
    }
    
    localStorage.setItem('contactInteractions', JSON.stringify(interactions));
  } catch (error) {
    console.error('Error storing interaction:', error);
  }
};

/**
 * Calculate engagement score based on user behavior
 * @param {number} timeOnPage - Time spent on page (seconds)
 * @param {number} scrollDepth - Scroll depth percentage
 * @param {Array} interactions - User interactions
 * @returns {number} Engagement score (0-100)
 */
const calculateEngagementScore = (timeOnPage, scrollDepth, interactions) => {
  let score = 0;
  
  // Time on page (max 30 points)
  score += Math.min(timeOnPage / 60 * 10, 30); // 10 points per minute, max 30
  
  // Scroll depth (max 30 points)
  score += scrollDepth * 30;
  
  // Interactions (max 40 points)
  score += Math.min(interactions.length * 10, 40);
  
  return Math.round(score);
};

/**
 * Get top sources from interactions
 * @param {Array} interactions - Contact interactions
 * @returns {Array} Top sources
 */
const getTopSources = (interactions) => {
  const sources = {};
  interactions.forEach(interaction => {
    const source = interaction.source || 'unknown';
    sources[source] = (sources[source] || 0) + 1;
  });
  
  return Object.entries(sources)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }));
};

/**
 * Get top articles from interactions
 * @param {Array} interactions - Contact interactions
 * @returns {Array} Top articles
 */
const getTopArticles = (interactions) => {
  const articles = {};
  interactions.forEach(interaction => {
    const article = interaction.article || 'unknown';
    if (article !== 'unknown') {
      articles[article] = (articles[article] || 0) + 1;
    }
  });
  
  return Object.entries(articles)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([article, count]) => ({ article, count }));
};

/**
 * Get conversion rates by hour of day
 * @param {Array} interactions - Contact interactions
 * @returns {Array} Conversion by hour
 */
const getConversionByHour = (interactions) => {
  const hourly = {};
  
  interactions.forEach(interaction => {
    const hour = new Date(interaction.timestamp).getHours();
    hourly[hour] = (hourly[hour] || 0) + 1;
  });
  
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourly[hour] || 0
  }));
};