/**
 * CTA Analytics - Sistema de tracking e analytics para CTAs
 * Implementa tracking de impressões, cliques e conversões
 */

// Configuração do Google Analytics
const GA_MEASUREMENT_ID = 'GA_MEASUREMENT_ID'; // Substituir pela ID real

/**
 * Envia evento para Google Analytics
 */
const sendGAEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      send_to: GA_MEASUREMENT_ID
    });
  }
};

/**
 * Envia evento customizado para Google Analytics
 */
const sendCustomEvent = (category, action, label = '', value = 0) => {
  sendGAEvent('custom_event', {
    event_category: category,
    event_action: action,
    event_label: label,
    value: value
  });
};

/**
 * Storage local para tracking offline
 */
class CTAAnalyticsStorage {
  constructor() {
    this.storageKey = 'cta_analytics_data';
    this.maxStorageSize = 1000; // Máximo de eventos armazenados
  }

  // Adiciona evento ao storage local
  addEvent(event) {
    try {
      const stored = this.getStoredEvents();
      stored.push({
        ...event,
        timestamp: Date.now(),
        id: this.generateEventId()
      });

      // Remove eventos antigos se exceder o limite
      if (stored.length > this.maxStorageSize) {
        stored.splice(0, stored.length - this.maxStorageSize);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(stored));
    } catch (error) {
      console.warn('Error storing CTA analytics event:', error);
    }
  }

  // Recupera eventos armazenados
  getStoredEvents() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error reading stored CTA analytics:', error);
      return [];
    }
  }

  // Limpa eventos antigos (mais de 7 dias)
  cleanOldEvents() {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const events = this.getStoredEvents();
    const filteredEvents = events.filter(event => event.timestamp > sevenDaysAgo);
    
    if (filteredEvents.length !== events.length) {
      localStorage.setItem(this.storageKey, JSON.stringify(filteredEvents));
    }
  }

  // Gera ID único para evento
  generateEventId() {
    return `cta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Obtém estatísticas dos eventos armazenados
  getLocalStats() {
    const events = this.getStoredEvents();
    
    const stats = {
      totalEvents: events.length,
      impressions: events.filter(e => e.type === 'impression').length,
      clicks: events.filter(e => e.type === 'click').length,
      conversions: events.filter(e => e.type === 'conversion').length,
      byCtaType: {},
      byPost: {},
      byTimeframe: {}
    };

    // Agrupa por tipo de CTA
    events.forEach(event => {
      const ctaType = event.ctaType || 'unknown';
      if (!stats.byCtaType[ctaType]) {
        stats.byCtaType[ctaType] = { impressions: 0, clicks: 0, conversions: 0 };
      }
      stats.byCtaType[ctaType][event.type]++;
    });

    // Agrupa por post
    events.forEach(event => {
      const postSlug = event.postSlug || 'unknown';
      if (!stats.byPost[postSlug]) {
        stats.byPost[postSlug] = { impressions: 0, clicks: 0, conversions: 0 };
      }
      stats.byPost[postSlug][event.type]++;
    });

    return stats;
  }
}

const analyticsStorage = new CTAAnalyticsStorage();

/**
 * Classe principal para tracking de CTAs
 */
class CTAAnalytics {
  constructor() {
    this.sessionData = new Map();
    this.observedElements = new WeakSet();
    this.impressionThreshold = 0.5; // 50% visível
    this.impressionDuration = 1000; // 1 segundo visível
  }

  /**
   * Registra impressão de CTA
   */
  trackImpression(ctaData) {
    const eventData = {
      type: 'impression',
      ctaType: ctaData.ctaType || 'unknown',
      postSlug: ctaData.postSlug,
      courseId: ctaData.courseId,
      position: ctaData.position || 'unknown', // 'main', 'inline', 'sidebar'
      urgencyShown: ctaData.urgencyShown || false,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // Envia para Google Analytics
    sendGAEvent('cta_impression', {
      cta_type: eventData.ctaType,
      post_slug: eventData.postSlug,
      course_id: eventData.courseId,
      position: eventData.position
    });

    // Armazena localmente
    analyticsStorage.addEvent(eventData);

    console.log('CTA Impression tracked:', eventData);
  }

  /**
   * Registra clique em CTA
   */
  trackClick(ctaData) {
    const eventData = {
      type: 'click',
      ctaType: ctaData.ctaType || 'unknown',
      postSlug: ctaData.postSlug,
      courseId: ctaData.courseId,
      position: ctaData.position || 'unknown',
      actionType: ctaData.actionType || 'link', // 'link', 'modal', 'form'
      urgencyShown: ctaData.urgencyShown || false,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      previousImpressions: this.getSessionImpressions(ctaData.postSlug),
      timeOnPage: this.getTimeOnPage()
    };

    // Envia para Google Analytics
    sendGAEvent('cta_click', {
      cta_type: eventData.ctaType,
      post_slug: eventData.postSlug,
      course_id: eventData.courseId,
      position: eventData.position,
      value: 1
    });

    // Armazena localmente
    analyticsStorage.addEvent(eventData);

    console.log('CTA Click tracked:', eventData);
  }

  /**
   * Registra conversão (quando usuário completa ação)
   */
  trackConversion(ctaData, conversionData = {}) {
    const eventData = {
      type: 'conversion',
      ctaType: ctaData.ctaType || 'unknown',
      postSlug: ctaData.postSlug,
      courseId: ctaData.courseId,
      conversionType: conversionData.type || 'unknown', // 'course_view', 'form_submit', 'purchase'
      conversionValue: conversionData.value || 0,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      timeToConversion: conversionData.timeToConversion || 0
    };

    // Envia para Google Analytics
    sendGAEvent('cta_conversion', {
      cta_type: eventData.ctaType,
      post_slug: eventData.postSlug,
      course_id: eventData.courseId,
      conversion_type: eventData.conversionType,
      value: eventData.conversionValue
    });

    // Armazena localmente
    analyticsStorage.addEvent(eventData);

    console.log('CTA Conversion tracked:', eventData);
  }

  /**
   * Configura observer de intersecção para tracking automático de impressões
   */
  observeImpressions(element, ctaData) {
    if (this.observedElements.has(element)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= this.impressionThreshold) {
            // Aguarda duração mínima antes de registrar impressão
            setTimeout(() => {
              if (entry.isIntersecting) {
                this.trackImpression(ctaData);
                observer.unobserve(entry.target);
              }
            }, this.impressionDuration);
          }
        });
      },
      {
        threshold: this.impressionThreshold,
        rootMargin: '10px'
      }
    );

    observer.observe(element);
    this.observedElements.add(element);
  }

  /**
   * Obtém ID da sessão
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('cta_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('cta_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Obtém número de impressões na sessão atual
   */
  getSessionImpressions(postSlug) {
    const key = `impressions_${postSlug}`;
    return parseInt(sessionStorage.getItem(key) || '0');
  }

  /**
   * Incrementa contador de impressões da sessão
   */
  incrementSessionImpressions(postSlug) {
    const key = `impressions_${postSlug}`;
    const current = this.getSessionImpressions(postSlug);
    sessionStorage.setItem(key, (current + 1).toString());
  }

  /**
   * Calcula tempo na página
   */
  getTimeOnPage() {
    const startTime = parseInt(sessionStorage.getItem('page_start_time') || Date.now().toString());
    return Date.now() - startTime;
  }

  /**
   * Gera relatório de performance
   */
  generateReport(timeframe = '7d') {
    const events = analyticsStorage.getStoredEvents();
    const now = Date.now();
    const timeframes = {
      '1d': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = now - (timeframes[timeframe] || timeframes['7d']);
    const filteredEvents = events.filter(event => event.timestamp >= cutoff);

    const report = {
      timeframe,
      period: {
        start: new Date(cutoff).toISOString(),
        end: new Date(now).toISOString()
      },
      summary: {
        totalImpressions: filteredEvents.filter(e => e.type === 'impression').length,
        totalClicks: filteredEvents.filter(e => e.type === 'click').length,
        totalConversions: filteredEvents.filter(e => e.type === 'conversion').length,
        ctr: 0, // Calculado abaixo
        conversionRate: 0 // Calculado abaixo
      },
      byCtaType: {},
      byPost: {},
      topPerformers: []
    };

    // Calcula métricas
    if (report.summary.totalImpressions > 0) {
      report.summary.ctr = (report.summary.totalClicks / report.summary.totalImpressions * 100).toFixed(2);
    }
    if (report.summary.totalClicks > 0) {
      report.summary.conversionRate = (report.summary.totalConversions / report.summary.totalClicks * 100).toFixed(2);
    }

    // Agrupa dados por tipo de CTA
    filteredEvents.forEach(event => {
      const type = event.ctaType || 'unknown';
      if (!report.byCtaType[type]) {
        report.byCtaType[type] = { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversionRate: 0 };
      }
      report.byCtaType[type][event.type]++;
    });

    // Calcula métricas por tipo
    Object.keys(report.byCtaType).forEach(type => {
      const data = report.byCtaType[type];
      data.ctr = data.impressions > 0 ? (data.clicks / data.impressions * 100).toFixed(2) : 0;
      data.conversionRate = data.clicks > 0 ? (data.conversions / data.clicks * 100).toFixed(2) : 0;
    });

    return report;
  }
}

// Instância singleton
const ctaAnalytics = new CTAAnalytics();

// Inicialização quando o DOM estiver pronto
if (typeof window !== 'undefined') {
  // Registra timestamp de início da página
  sessionStorage.setItem('page_start_time', Date.now().toString());

  // Limpa eventos antigos periodicamente
  setTimeout(() => {
    analyticsStorage.cleanOldEvents();
  }, 5000);
}

/**
 * Hook para tracking de CTAs
 */
export const useCTATracking = () => {
  return {
    trackImpression: (ctaData) => ctaAnalytics.trackImpression(ctaData),
    trackClick: (ctaData) => ctaAnalytics.trackClick(ctaData),
    trackConversion: (ctaData, conversionData) => ctaAnalytics.trackConversion(ctaData, conversionData),
    observeImpressions: (element, ctaData) => ctaAnalytics.observeImpressions(element, ctaData),
    generateReport: (timeframe) => ctaAnalytics.generateReport(timeframe),
    getLocalStats: () => analyticsStorage.getLocalStats()
  };
};

/**
 * Funções exportadas
 */
export const trackCTAImpression = (ctaData) => ctaAnalytics.trackImpression(ctaData);
export const trackCTAClick = (ctaData) => ctaAnalytics.trackClick(ctaData);
export const trackCTAConversion = (ctaData, conversionData) => ctaAnalytics.trackConversion(ctaData, conversionData);
export const observeCTAImpressions = (element, ctaData) => ctaAnalytics.observeImpressions(element, ctaData);
export const generateCTAReport = (timeframe) => ctaAnalytics.generateReport(timeframe);
export const getCTALocalStats = () => analyticsStorage.getLocalStats();

export default ctaAnalytics;