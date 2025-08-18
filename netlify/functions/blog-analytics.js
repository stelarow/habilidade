/**
 * Function para analytics do blog
 * Demonstra logging de analytics, métricas e integração com dados existentes
 */

const { withLogger } = require('./utils/logger');

async function handler(event, context) {
  const { logger } = context;
  
  logger.info('Blog analytics function called');
  
  try {
    const analyticsData = parseAnalyticsData(event, logger);
    
    // Processar diferentes tipos de eventos de analytics
    switch (analyticsData.eventType) {
      case 'page_view':
        await trackPageView(analyticsData, logger);
        break;
        
      case 'blog_read':
        await trackBlogRead(analyticsData, logger);
        break;
        
      case 'engagement':
        await trackUserEngagement(analyticsData, logger);
        break;
        
      case 'performance':
        await trackPerformanceMetrics(analyticsData, logger);
        break;
        
      default:
        await trackGenericEvent(analyticsData, logger);
    }
    
    // Gerar insights básicos
    const insights = await generateInsights(analyticsData, logger);
    
    logger.info('Analytics processed successfully', {
      eventType: analyticsData.eventType,
      insightsGenerated: Object.keys(insights).length
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        success: true,
        message: 'Analytics data processed',
        insights,
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    logger.error('Blog analytics function failed', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Analytics processing failed',
        message: error.message
      })
    };
  }
}

/**
 * Parse dos dados de analytics
 */
function parseAnalyticsData(event, logger) {
  const queryParams = event.queryStringParameters || {};
  let bodyData = {};
  
  if (event.body) {
    try {
      bodyData = JSON.parse(event.body);
    } catch (error) {
      logger.warn('Failed to parse analytics body', error);
    }
  }
  
  const data = {
    eventType: queryParams.event || bodyData.event || 'page_view',
    timestamp: Date.now(),
    userAgent: event.headers['user-agent'],
    referer: event.headers['referer'],
    ip: event.headers['x-forwarded-for']?.split(',')[0] || 'unknown',
    ...bodyData
  };
  
  logger.debug('Analytics data parsed', {
    eventType: data.eventType,
    hasReferer: !!data.referer,
    dataKeys: Object.keys(data)
  });
  
  return data;
}

/**
 * Rastreia visualizações de página
 */
async function trackPageView(data, logger) {
  logger.info('Tracking page view', {
    page: data.page || data.path,
    referer: data.referer,
    userAgent: data.userAgent?.substring(0, 50) + '...',
    trackingType: 'page_view'
  });
  
  // Detectar tipo de página
  const pageType = detectPageType(data.page || data.path, logger);
  
  logger.info('Page type detected', {
    page: data.page,
    pageType,
    categoryDetection: true
  });
}

/**
 * Rastreia leitura de artigos do blog
 */
async function trackBlogRead(data, logger) {
  const blogData = {
    articleSlug: data.slug,
    readingTime: data.readingTime,
    scrollDepth: data.scrollDepth,
    timeOnPage: data.timeOnPage,
    completedReading: data.scrollDepth > 80 // Considera como lido se passou de 80%
  };
  
  logger.info('Tracking blog article read', {
    ...blogData,
    engagementLevel: blogData.completedReading ? 'high' : 'medium',
    trackingType: 'content_engagement'
  });
  
  // Log específico para artigos populares
  const popularSlugs = [
    'historia-sketchup-software-arquitetura',
    'sketchup-2025-visualizacao-3d-materiais-fotorrealistas',
    'design-espacos-varejo-sketchup-pro'
  ];
  
  if (popularSlugs.includes(blogData.articleSlug)) {
    logger.info('Popular article accessed', {
      slug: blogData.articleSlug,
      popularity: 'high',
      contentPerformance: true
    });
  }
}

/**
 * Rastreia engajamento do usuário
 */
async function trackUserEngagement(data, logger) {
  const engagementMetrics = {
    action: data.action, // click, scroll, form_interaction, etc.
    element: data.element,
    value: data.value,
    sessionDuration: data.sessionDuration,
    pageDepth: data.pageDepth
  };
  
  logger.info('Tracking user engagement', {
    ...engagementMetrics,
    engagementScore: calculateEngagementScore(engagementMetrics),
    trackingType: 'user_behavior'
  });
  
  // Log de ações importantes
  if (data.action === 'cta_click') {
    logger.info('CTA interaction detected', {
      ctaType: data.ctaType,
      ctaPosition: data.ctaPosition,
      conversionTracking: true
    });
  }
}

/**
 * Rastreia métricas de performance
 */
async function trackPerformanceMetrics(data, logger) {
  const perfMetrics = {
    loadTime: data.loadTime,
    firstContentfulPaint: data.fcp,
    largestContentfulPaint: data.lcp,
    cumulativeLayoutShift: data.cls,
    firstInputDelay: data.fid
  };
  
  logger.info('Performance metrics received', {
    ...perfMetrics,
    coreWebVitalsScore: calculateWebVitalsScore(perfMetrics),
    trackingType: 'performance'
  });
  
  // Log de warnings para performance ruim
  if (perfMetrics.loadTime > 3000) {
    logger.warn('Slow page load detected', {
      loadTime: perfMetrics.loadTime,
      threshold: 3000,
      performanceIssue: true
    });
  }
  
  if (perfMetrics.largestContentfulPaint > 2500) {
    logger.warn('Poor LCP detected', {
      lcp: perfMetrics.largestContentfulPaint,
      threshold: 2500,
      coreWebVital: 'LCP'
    });
  }
}

/**
 * Rastreia eventos genéricos
 */
async function trackGenericEvent(data, logger) {
  logger.info('Generic event tracked', {
    eventData: data,
    trackingType: 'generic'
  });
}

/**
 * Detecta tipo de página baseado na URL
 */
function detectPageType(path, logger) {
  if (!path) return 'unknown';
  
  const pageTypes = {
    '/': 'home',
    '/blog': 'blog_index',
    '/blog/': 'blog_index',
    '/cursos': 'courses_overview',
    '/contact': 'contact',
    '/teste-vocacional': 'test'
  };
  
  // Verifica páginas específicas
  if (pageTypes[path]) {
    return pageTypes[path];
  }
  
  // Verifica padrões
  if (path.startsWith('/blog/')) {
    return 'blog_article';
  }
  
  if (path.startsWith('/cursos/')) {
    return 'course_page';
  }
  
  if (path.includes('florianopolis') || path.includes('sao-jose') || path.includes('palhoca')) {
    return 'local_seo';
  }
  
  logger.debug('Page type detection', { path, detectedType: 'unknown' });
  return 'unknown';
}

/**
 * Calcula score de engajamento
 */
function calculateEngagementScore(metrics) {
  let score = 0;
  
  if (metrics.sessionDuration > 60) score += 20; // Mais de 1 minuto
  if (metrics.sessionDuration > 180) score += 30; // Mais de 3 minutos
  if (metrics.pageDepth > 1) score += 25; // Visitou mais de uma página
  if (metrics.action === 'cta_click') score += 25; // Interagiu com CTA
  
  return Math.min(score, 100);
}

/**
 * Calcula score dos Core Web Vitals
 */
function calculateWebVitalsScore(metrics) {
  let score = 100;
  
  // LCP (Largest Contentful Paint)
  if (metrics.largestContentfulPaint > 4000) score -= 40;
  else if (metrics.largestContentfulPaint > 2500) score -= 20;
  
  // FID (First Input Delay)
  if (metrics.firstInputDelay > 300) score -= 30;
  else if (metrics.firstInputDelay > 100) score -= 15;
  
  // CLS (Cumulative Layout Shift)
  if (metrics.cumulativeLayoutShift > 0.25) score -= 30;
  else if (metrics.cumulativeLayoutShift > 0.1) score -= 15;
  
  return Math.max(score, 0);
}

/**
 * Gera insights básicos dos dados
 */
async function generateInsights(data, logger) {
  const insights = {};
  
  try {
    // Insight sobre dispositivo
    if (data.userAgent) {
      insights.device = detectDeviceType(data.userAgent);
    }
    
    // Insight sobre origem do tráfego
    if (data.referer) {
      insights.trafficSource = detectTrafficSource(data.referer);
    }
    
    // Insight sobre horário
    const hour = new Date().getHours();
    insights.timeSegment = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    
    logger.debug('Insights generated', { 
      insightCount: Object.keys(insights).length,
      insights 
    });
    
  } catch (error) {
    logger.warn('Failed to generate some insights', error);
  }
  
  return insights;
}

/**
 * Detecta tipo de dispositivo
 */
function detectDeviceType(userAgent) {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  }
  
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  }
  
  return 'desktop';
}

/**
 * Detecta origem do tráfego
 */
function detectTrafficSource(referer) {
  if (!referer) return 'direct';
  
  const domain = new URL(referer).hostname;
  
  if (domain.includes('google')) return 'google_search';
  if (domain.includes('facebook')) return 'facebook';
  if (domain.includes('instagram')) return 'instagram';
  if (domain.includes('linkedin')) return 'linkedin';
  
  return 'referral';
}

exports.handler = withLogger(handler, 'blog-analytics');