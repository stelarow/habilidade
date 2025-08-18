/**
 * Serviço para integração com Netlify Functions
 * Fornece métodos para comunicação com as functions backend
 */

/**
 * Base URL para as functions (adapta automaticamente ao ambiente)
 */
const FUNCTIONS_BASE = '/.netlify/functions';

/**
 * Configurações padrão para requests
 */
const DEFAULT_CONFIG = {
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos
};

/**
 * Classe principal para comunicação com Netlify Functions
 */
class NetlifyFunctionsService {
  
  /**
   * Faz request para uma function específica
   */
  async callFunction(functionName, options = {}) {
    const { method = 'GET', body, queryParams, headers = {} } = options;
    
    let url = `${FUNCTIONS_BASE}/${functionName}`;
    
    // Adicionar query parameters se especificados
    if (queryParams) {
      const searchParams = new URLSearchParams(queryParams);
      url += `?${searchParams.toString()}`;
    }
    
    const config = {
      method,
      headers: {
        ...DEFAULT_CONFIG.headers,
        ...headers
      }
    };
    
    // Adicionar body se necessário
    if (body && method !== 'GET') {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return {
        success: true,
        data,
        status: response.status
      };
      
    } catch (error) {
      console.error(`Function ${functionName} call failed:`, error);
      
      return {
        success: false,
        error: error.message,
        status: 0
      };
    }
  }
  
  /**
   * Verifica saúde da aplicação
   */
  async checkHealth() {
    const result = await this.callFunction('health-check');
    
    if (result.success) {
      console.log('Application health check passed:', result.data.status);
    }
    
    return result;
  }
  
  /**
   * Envia formulário de contato
   */
  async submitContactForm(formData) {
    // Validação básica
    const requiredFields = ['name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        return {
          success: false,
          error: `Campo ${field} é obrigatório`
        };
      }
    }
    
    const result = await this.callFunction('contact-handler', {
      method: 'POST',
      body: formData
    });
    
    if (result.success) {
      console.log('Contact form submitted successfully:', result.data.submissionId);
      
      // Log para analytics
      this.logEvent('form_submission', {
        type: 'contact',
        success: true,
        submissionId: result.data.submissionId
      });
    } else {
      // Log erro para debugging
      this.logEvent('form_submission', {
        type: 'contact',
        success: false,
        error: result.error
      });
    }
    
    return result;
  }
  
  /**
   * Envia log para dev logger
   */
  async logEvent(eventType, data, source = 'frontend') {
    // Só enviar logs detalhados em desenvolvimento
    const shouldLog = process.env.NODE_ENV === 'development' || data.error;
    
    if (!shouldLog) return;
    
    const logData = {
      type: data.error ? 'error' : 'info',
      source,
      message: `Frontend event: ${eventType}`,
      data: {
        eventType,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...data
      }
    };
    
    // Não aguardar resposta para não bloquear UI
    this.callFunction('dev-logger', {
      method: 'POST',
      body: logData
    }).catch(error => {
      console.debug('Failed to send log to backend:', error);
    });
  }
  
  /**
   * Envia dados de analytics do blog
   */
  async trackBlogAnalytics(eventData) {
    const result = await this.callFunction('blog-analytics', {
      method: 'POST',
      body: {
        timestamp: Date.now(),
        url: window.location.href,
        referrer: document.referrer,
        ...eventData
      }
    });
    
    return result;
  }
  
  /**
   * Rastreia visualização de página
   */
  async trackPageView(pageData = {}) {
    return this.trackBlogAnalytics({
      event: 'page_view',
      page: window.location.pathname,
      title: document.title,
      ...pageData
    });
  }
  
  /**
   * Rastreia leitura de artigo do blog
   */
  async trackBlogRead(articleData) {
    return this.trackBlogAnalytics({
      event: 'blog_read',
      ...articleData
    });
  }
  
  /**
   * Rastreia engajamento do usuário
   */
  async trackEngagement(engagementData) {
    return this.trackBlogAnalytics({
      event: 'engagement',
      ...engagementData
    });
  }
  
  /**
   * Rastreia métricas de performance
   */
  async trackPerformance(perfData) {
    return this.trackBlogAnalytics({
      event: 'performance',
      ...perfData
    });
  }
}

/**
 * Instância singleton do serviço
 */
const netlifyFunctions = new NetlifyFunctionsService();

/**
 * Hooks React para facilitar uso
 */

/**
 * Hook para envio de formulário de contato
 */
export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  const submitForm = async (formData) => {
    setIsSubmitting(true);
    setResult(null);
    
    try {
      const response = await netlifyFunctions.submitContactForm(formData);
      setResult(response);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setResult(null);
  };
  
  return {
    submitForm,
    resetForm,
    isSubmitting,
    result,
    success: result?.success,
    error: result?.error
  };
}

/**
 * Hook para analytics do blog
 */
export function useBlogAnalytics() {
  const trackPageView = (data) => netlifyFunctions.trackPageView(data);
  const trackBlogRead = (data) => netlifyFunctions.trackBlogRead(data);
  const trackEngagement = (data) => netlifyFunctions.trackEngagement(data);
  const trackPerformance = (data) => netlifyFunctions.trackPerformance(data);
  
  return {
    trackPageView,
    trackBlogRead,
    trackEngagement,
    trackPerformance
  };
}

/**
 * Hook para logging de desenvolvimento
 */
export function useDevLogger() {
  const logEvent = (eventType, data, source) => 
    netlifyFunctions.logEvent(eventType, data, source);
  
  const logError = (error, context = {}) => 
    netlifyFunctions.logEvent('error', { error: error.message, ...context });
  
  const logDebug = (message, data = {}) => 
    netlifyFunctions.logEvent('debug', { message, ...data });
  
  return {
    logEvent,
    logError,
    logDebug
  };
}

/**
 * Hook para verificação de saúde
 */
export function useHealthCheck() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  
  const checkHealth = async () => {
    setIsChecking(true);
    
    try {
      const result = await netlifyFunctions.checkHealth();
      setHealthStatus(result);
      return result;
    } finally {
      setIsChecking(false);
    }
  };
  
  return {
    checkHealth,
    healthStatus,
    isChecking,
    isHealthy: healthStatus?.success && healthStatus?.data?.status === 'healthy'
  };
}

/**
 * Utilitários para integração automática
 */

/**
 * Rastreamento automático de página
 */
export function trackPageViewAutomatically() {
  // Aguardar DOM carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      netlifyFunctions.trackPageView();
    });
  } else {
    netlifyFunctions.trackPageView();
  }
}

/**
 * Rastreamento automático de performance
 */
export function trackPerformanceAutomatically() {
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        const navigation = window.performance.navigation;
        
        const perfData = {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
          firstPaint: timing.responseStart - timing.navigationStart,
          navigationType: navigation.type
        };
        
        // Core Web Vitals se disponível
        if (window.PerformanceObserver) {
          try {
            // LCP (Largest Contentful Paint)
            new PerformanceObserver((entryList) => {
              const entries = entryList.getEntries();
              if (entries.length > 0) {
                perfData.lcp = entries[entries.length - 1].startTime;
              }
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // FID (First Input Delay)
            new PerformanceObserver((entryList) => {
              const entries = entryList.getEntries();
              if (entries.length > 0) {
                perfData.fid = entries[0].processingStart - entries[0].startTime;
              }
            }).observe({ entryTypes: ['first-input'] });
            
          } catch (error) {
            console.debug('Performance Observer not fully supported');
          }
        }
        
        netlifyFunctions.trackPerformance(perfData);
      }, 1000);
    });
  }
}

/**
 * Setup automático para SPAs
 */
export function setupAutomaticTracking(options = {}) {
  const {
    trackPageViews = true,
    trackPerformance = true,
    trackErrors = true
  } = options;
  
  if (trackPageViews) {
    trackPageViewAutomatically();
  }
  
  if (trackPerformance) {
    trackPerformanceAutomatically();
  }
  
  if (trackErrors) {
    window.addEventListener('error', (event) => {
      netlifyFunctions.logEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      netlifyFunctions.logEvent('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    });
  }
}

// Exportações
export default netlifyFunctions;
export { 
  NetlifyFunctionsService,
  useContactForm,
  useBlogAnalytics, 
  useDevLogger,
  useHealthCheck,
  setupAutomaticTracking
};