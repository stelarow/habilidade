import { useCallback, useEffect, useRef } from 'react';
import type { CTAEvent, CTAHookConfig, CTAMetrics } from '@/types/cta';

// Declare gtag global function
declare global {
  function gtag(command: string, targetId: string, config?: any): void;
}

interface CTATrackingConfig extends CTAHookConfig {
  ctaId: string;
  userId?: string;
  sessionId?: string;
}

interface CTAEventPayload {
  ctaId: string;
  eventType: 'view' | 'click' | 'conversion' | 'close';
  timestamp: number;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  userAgent?: string;
  url?: string;
  referrer?: string;
}

// Event queue for batching
interface EventQueue {
  events: CTAEventPayload[];
  lastFlush: number;
  maxSize: number;
  flushInterval: number;
}

const eventQueue: EventQueue = {
  events: [],
  lastFlush: Date.now(),
  maxSize: 10,
  flushInterval: 5000, // 5 seconds
};

// Privacy compliance settings
const PRIVACY_CONFIG = {
  respectDoNotTrack: true,
  anonymizeIP: true,
  consentRequired: true,
  dataRetentionDays: 365,
};

export function useCTATracking(config: CTATrackingConfig) {
  const {
    ctaId,
    trackViews = true,
    trackClicks = true,
    trackConversions = true,
    batchEvents = true,
    debugMode = false,
    userId,
    sessionId,
  } = config;

  const viewTracked = useRef(false);
  const clickCount = useRef(0);
  const conversionTracked = useRef(false);
  const startTime = useRef(Date.now());

  // Check privacy compliance
  const isTrackingAllowed = useCallback(() => {
    // Check Do Not Track header
    if (PRIVACY_CONFIG.respectDoNotTrack && navigator.doNotTrack === '1') {
      return false;
    }

    // Check if tracking is enabled
    if (!process.env.NEXT_PUBLIC_CTA_TRACKING_ENABLED) {
      return false;
    }

    // In production, you would check for user consent here
    // For now, we assume consent is given
    return true;
  }, []);

  // Generate session ID if not provided
  const getSessionId = useCallback(() => {
    if (sessionId) return sessionId;
    
    // Try to get from localStorage or generate new one
    let storedSessionId = null;
    try {
      storedSessionId = localStorage.getItem('cta_session_id');
    } catch (e) {
      // localStorage not available
    }

    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      try {
        localStorage.setItem('cta_session_id', storedSessionId);
      } catch (e) {
        // localStorage not available
      }
    }

    return storedSessionId;
  }, [sessionId]);

  // Create event payload
  const createEventPayload = useCallback((
    eventType: CTAEventPayload['eventType'],
    metadata?: Record<string, any>
  ): CTAEventPayload => {
    return {
      ctaId,
      eventType,
      timestamp: Date.now(),
      userId,
      sessionId: getSessionId(),
      metadata,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
    };
  }, [ctaId, userId, getSessionId]);

  // Send events to analytics endpoint
  const sendEvent = useCallback(async (payload: CTAEventPayload) => {
    if (!isTrackingAllowed()) {
      if (debugMode) {
        console.log('CTA Tracking: Blocked by privacy settings');
      }
      return;
    }

    try {
      // Send to custom analytics endpoint
      if (process.env.NEXT_PUBLIC_CTA_ANALYTICS_ENDPOINT) {
        await fetch(process.env.NEXT_PUBLIC_CTA_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      // Send to Google Analytics 4 (if configured)
      if (typeof gtag !== 'undefined') {
        gtag('event', `cta_${payload.eventType}`, {
          custom_parameter_1: payload.ctaId,
          custom_parameter_2: payload.metadata?.conversionValue || 0,
        });
      }

      // Send to Supabase for internal analytics
      const supabasePayload = {
        cta_id: payload.ctaId,
        event_type: payload.eventType,
        user_data: {
          userId: payload.userId,
          sessionId: payload.sessionId,
          userAgent: payload.userAgent,
          url: payload.url,
          referrer: payload.referrer,
          ...payload.metadata,
        },
        created_at: new Date(payload.timestamp).toISOString(),
      };

      await fetch('/api/analytics/cta-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supabasePayload),
      });

      if (debugMode) {
        console.log('CTA Event Tracked:', payload);
      }
    } catch (error) {
      console.error('CTA Tracking Error:', error);
      
      // Queue event for retry if network error
      if (batchEvents && eventQueue.events.length < eventQueue.maxSize) {
        eventQueue.events.push(payload);
      }
    }
  }, [isTrackingAllowed, debugMode, batchEvents]);

  // Batch event flushing
  const flushEventQueue = useCallback(async () => {
    if (eventQueue.events.length === 0) return;

    const eventsToFlush = [...eventQueue.events];
    eventQueue.events = [];
    eventQueue.lastFlush = Date.now();

    try {
      // Send batched events
      await fetch('/api/analytics/cta-events/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToFlush }),
      });

      if (debugMode) {
        console.log(`CTA Tracking: Flushed ${eventsToFlush.length} events`);
      }
    } catch (error) {
      console.error('CTA Batch Tracking Error:', error);
      // Re-queue events on failure
      eventQueue.events.unshift(...eventsToFlush);
    }
  }, [debugMode]);

  // Auto-flush event queue
  useEffect(() => {
    if (!batchEvents) return;

    const interval = setInterval(() => {
      const timeSinceLastFlush = Date.now() - eventQueue.lastFlush;
      
      if (eventQueue.events.length > 0 && 
          (eventQueue.events.length >= eventQueue.maxSize || 
           timeSinceLastFlush >= eventQueue.flushInterval)) {
        flushEventQueue();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [batchEvents, flushEventQueue]);

  // Flush events on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (eventQueue.events.length > 0) {
        // Use sendBeacon for reliable delivery on page unload
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            '/api/analytics/cta-events/batch',
            JSON.stringify({ events: eventQueue.events })
          );
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track event function
  const trackEvent = useCallback(async (
    eventType: 'view' | 'click' | 'conversion' | 'close',
    metadata?: Record<string, any>
  ) => {
    // Validate event type permissions
    if (eventType === 'view' && !trackViews) return;
    if (eventType === 'click' && !trackClicks) return;
    if (eventType === 'conversion' && !trackConversions) return;

    // Prevent duplicate view tracking
    if (eventType === 'view' && viewTracked.current) return;
    
    // Prevent duplicate conversion tracking
    if (eventType === 'conversion' && conversionTracked.current) return;

    const timeFromStart = Date.now() - startTime.current;
    const enhancedMetadata = {
      ...metadata,
      timeFromStart,
      clickCount: clickCount.current,
      pageLoadTime: performance.now(),
    };

    const payload = createEventPayload(eventType, enhancedMetadata);

    if (batchEvents) {
      eventQueue.events.push(payload);
      
      // Flush immediately for conversions (high priority)
      if (eventType === 'conversion') {
        await flushEventQueue();
      }
    } else {
      await sendEvent(payload);
    }

    // Update tracking state
    switch (eventType) {
      case 'view':
        viewTracked.current = true;
        break;
      case 'click':
        clickCount.current += 1;
        break;
      case 'conversion':
        conversionTracked.current = true;
        break;
    }

    // Trigger conversion webhook if configured
    if (eventType === 'conversion' && process.env.NEXT_PUBLIC_CTA_CONVERSION_WEBHOOK) {
      try {
        await fetch(process.env.NEXT_PUBLIC_CTA_CONVERSION_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ctaId,
            userId,
            conversionData: metadata,
            timestamp: payload.timestamp,
          }),
        });
      } catch (error) {
        console.error('Conversion webhook error:', error);
      }
    }
  }, [
    trackViews, 
    trackClicks, 
    trackConversions, 
    batchEvents,
    createEventPayload,
    sendEvent,
    flushEventQueue,
    ctaId,
    userId
  ]);

  // Get CTA metrics
  const getMetrics = useCallback(async (): Promise<CTAMetrics | null> => {
    try {
      const response = await fetch(`/api/analytics/cta-metrics/${ctaId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching CTA metrics:', error);
    }
    return null;
  }, [ctaId]);

  // A/B testing variant tracking
  const trackVariant = useCallback(async (variant: 'A' | 'B', splitRatio: number) => {
    const variantMetadata = {
      variant,
      splitRatio,
      assignmentTime: Date.now(),
    };

    await trackEvent('view', { abTest: variantMetadata });
  }, [trackEvent]);

  // Performance tracking
  const trackPerformance = useCallback(async (performanceData: {
    timeToView?: number;
    timeToClick?: number;
    timeToConversion?: number;
    scrollDepthAtView?: number;
    viewportSize?: { width: number; height: number };
  }) => {
    const payload = createEventPayload('view', {
      performance: performanceData,
      timestamp: Date.now(),
    });

    if (batchEvents) {
      eventQueue.events.push(payload);
    } else {
      await sendEvent(payload);
    }
  }, [createEventPayload, sendEvent, batchEvents]);

  // Offline event queueing
  useEffect(() => {
    const handleOnline = () => {
      if (eventQueue.events.length > 0) {
        flushEventQueue();
      }
    };

    const handleOffline = () => {
      if (debugMode) {
        console.log('CTA Tracking: Offline mode - events will be queued');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushEventQueue, debugMode]);

  return {
    trackEvent,
    getMetrics,
    trackVariant,
    trackPerformance,
    flushEventQueue,
    isTrackingAllowed: isTrackingAllowed(),
    eventQueueSize: eventQueue.events.length,
    sessionId: getSessionId(),
  };
}

// Hook para newsletter tracking
export function useNewsletter() {
  const subscribe = useCallback(async (data: { email: string; preferences?: string[]; source?: string }) => {
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      return await response.json();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw error;
    }
  }, []);

  return {
    subscribe,
    isLoading: false, // This would be managed by a state in a real implementation
  };
}

// Global CTA analytics functions
export const CTAAnalytics = {
  // Get overall CTA performance
  getOverallMetrics: async (): Promise<{
    totalViews: number;
    totalClicks: number;
    totalConversions: number;
    averageCTR: number;
    averageConversionRate: number;
    topPerformingCTAs: Array<{ ctaId: string; conversionRate: number }>;
  } | null> => {
    try {
      const response = await fetch('/api/analytics/cta-overview');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching overall CTA metrics:', error);
    }
    return null;
  },

  // Get A/B test results
  getABTestResults: async (ctaId: string): Promise<{
    variantA: { views: number; clicks: number; conversions: number };
    variantB: { views: number; clicks: number; conversions: number };
    statisticalSignificance: number;
    winningVariant: 'A' | 'B' | 'inconclusive';
  } | null> => {
    try {
      const response = await fetch(`/api/analytics/ab-test/${ctaId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching A/B test results:', error);
    }
    return null;
  },

  // Clear user data (GDPR compliance)
  clearUserData: async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/analytics/clear-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  },
};