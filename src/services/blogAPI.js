import axios from 'axios';

// Configure base URL with environment-based fallbacks
const getAPIBaseURL = () => {
  // Priority order: Custom env var > Production domain > Development fallback
  if (process.env.REACT_APP_BLOG_API_URL) {
    return process.env.REACT_APP_BLOG_API_URL;
  }
  
  if (process.env.NODE_ENV === 'production') {
    // Production URLs with fallback chain
    const productionUrls = [
      'https://plataforma.escolahabilidade.com/api',
      'https://api.escolahabilidade.com',
      'https://escolahabilidade.com/api'
    ];
    
    // Return first URL (primary production endpoint)
    return productionUrls[0];
  }
  
  // Development/local URLs
  return process.env.REACT_APP_DEV_API_URL || 'http://localhost:3000/api';
};

const API_BASE_URL = getAPIBaseURL();

// Production-ready configuration
const createBlogApiClient = () => {
  const config = {
    baseURL: API_BASE_URL,
    timeout: process.env.NODE_ENV === 'production' ? 15000 : 10000, // Longer timeout for production
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
    },
    // Enable automatic request retries for production
    retries: process.env.NODE_ENV === 'production' ? 3 : 1,
    retryDelay: (retryNumber = 0) => {
      const delay = Math.min(1000 * Math.pow(2, retryNumber), 10000);
      return delay;
    }
  };

  // Add API version if specified
  if (process.env.REACT_APP_API_VERSION) {
    config.headers['API-Version'] = process.env.REACT_APP_API_VERSION;
  }

  return axios.create(config);
};

const blogApiClient = createBlogApiClient();

// Enhanced request interceptor with retry logic
blogApiClient.interceptors.request.use(
  (config) => {
    // Add request ID for tracking
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log only in development or if debugging is enabled
    if (process.env.NODE_ENV === 'development' || localStorage.getItem('debug_api') === 'true') {
      console.log(`[Blog API] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        headers: config.headers
      });
    }
    
    return config;
  },
  (error) => {
    console.error('[Blog API] Request error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with intelligent error handling
blogApiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development' || localStorage.getItem('debug_api') === 'true') {
      console.log(`[Blog API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        data: response.data,
        timing: response.headers['x-response-time']
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Enhanced error logging
    console.error('[Blog API] Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      requestId: error.config?.headers['X-Request-ID']
    });
    
    // Retry logic for production
    if (process.env.NODE_ENV === 'production' && 
        !originalRequest._retry && 
        error.response?.status >= 500) {
      
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      if (originalRequest._retryCount <= (blogApiClient.defaults.retries || 3)) {
        const delay = blogApiClient.defaults.retryDelay(originalRequest._retryCount - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.log(`[Blog API] Retrying request (${originalRequest._retryCount}/3)...`);
        return blogApiClient(originalRequest);
      }
    }
    
    // Enhanced error messages with user-friendly descriptions
    const enhancedError = createEnhancedError(error);
    throw enhancedError;
  }
);

// Create enhanced error with user-friendly messages
const createEnhancedError = (error) => {
  const baseError = {
    originalError: error,
    timestamp: new Date().toISOString(),
    requestId: error.config?.headers?.['X-Request-ID']
  };

  // Network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
    return {
      ...baseError,
      type: 'NETWORK_ERROR',
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
      userMessage: 'Servidor temporariamente indisponível. Tente novamente em alguns instantes.',
      retryable: true
    };
  }
  
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return {
      ...baseError,
      type: 'TIMEOUT_ERROR',
      message: 'A requisição demorou muito para responder.',
      userMessage: 'Tempo de resposta excedido. Tente novamente.',
      retryable: true
    };
  }

  // HTTP status errors
  const status = error.response?.status;
  const data = error.response?.data;
  
  switch (status) {
    case 400:
      return {
        ...baseError,
        type: 'BAD_REQUEST',
        message: data?.message || 'Requisição inválida.',
        userMessage: 'Dados inválidos enviados. Verifique os filtros e tente novamente.',
        retryable: false
      };
      
    case 401:
      return {
        ...baseError,
        type: 'UNAUTHORIZED',
        message: 'Acesso não autorizado.',
        userMessage: 'Sessão expirada. Recarregue a página.',
        retryable: false
      };
      
    case 403:
      return {
        ...baseError,
        type: 'FORBIDDEN',
        message: 'Acesso negado.',
        userMessage: 'Você não tem permissão para acessar este conteúdo.',
        retryable: false
      };
      
    case 404:
      return {
        ...baseError,
        type: 'NOT_FOUND',
        message: 'Conteúdo não encontrado.',
        userMessage: 'O conteúdo solicitado não foi encontrado.',
        retryable: false
      };
      
    case 429:
      return {
        ...baseError,
        type: 'RATE_LIMITED',
        message: 'Muitas requisições.',
        userMessage: 'Muitas tentativas. Aguarde um momento antes de tentar novamente.',
        retryable: true,
        retryAfter: error.response?.headers?.['retry-after']
      };
      
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        ...baseError,
        type: 'SERVER_ERROR',
        message: data?.message || 'Erro interno do servidor.',
        userMessage: 'Erro temporário no servidor. Tente novamente em alguns instantes.',
        retryable: true
      };
      
    default:
      return {
        ...baseError,
        type: 'UNKNOWN_ERROR',
        message: error.message || 'Erro desconhecido.',
        userMessage: 'Ocorreu um erro inesperado. Tente novamente.',
        retryable: true
      };
  }
};

// Health check and diagnostics
const healthCheck = {
  // Check API availability
  async checkHealth() {
    try {
      const response = await blogApiClient.get('/health', { 
        timeout: 5000,
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        responseTime: response.headers['x-response-time'],
        version: response.data?.version,
        environment: response.data?.environment
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        type: error.type || 'UNKNOWN_ERROR'
      };
    }
  },

  // Check database connectivity
  async checkDatabase() {
    try {
      await blogApiClient.get('/health/database', { timeout: 10000 });
      return { status: 'connected', timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        status: 'disconnected', 
        timestamp: new Date().toISOString(),
        error: error.message 
      };
    }
  },

  // Get API status and metrics
  async getStatus() {
    try {
      const response = await blogApiClient.get('/status');
      return response.data;
    } catch (error) {
      console.warn('[Blog API] Status check failed:', error);
      return {
        api: await this.checkHealth(),
        database: await this.checkDatabase(),
        lastCheck: new Date().toISOString()
      };
    }
  }
};

// Blog API service functions
export const blogAPI = {
  // Health check methods
  health: healthCheck,
  // Get all posts with pagination
  getAllPosts: async (page = 1, limit = 10, category = null, search = null) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await blogApiClient.get(`/posts?${params}`);
      
      // Validate response data structure
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      return {
        ...response.data,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // Return structured error response with fallback data
      return {
        posts: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
        success: false,
        error: {
          message: error.userMessage || error.message || 'Erro ao carregar posts',
          type: error.type || 'UNKNOWN_ERROR',
          retryable: error.retryable || false,
          timestamp: new Date().toISOString()
        }
      };
    }
  },

  // Get single post by slug
  getPostBySlug: async (slug) => {
    try {
      if (!slug || typeof slug !== 'string') {
        throw new Error('Invalid post slug provided');
      }
      
      const response = await blogApiClient.get(`/posts/slug/${encodeURIComponent(slug)}`);
      
      if (!response.data) {
        throw new Error('Post not found');
      }
      
      return {
        ...response.data,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching post ${slug}:`, error);
      
      // For individual posts, we don't provide fallback data
      // Instead, we let the error bubble up with enhanced information
      throw {
        ...error,
        context: { postSlug: slug },
        userMessage: error.userMessage || `Não foi possível carregar o post "${slug}".`
      };
    }
  },

  // Get posts by category
  getPostsByCategory: async (categorySlug, page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        category: categorySlug,
      });
      
      const response = await blogApiClient.get(`/posts?${params}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for category ${categorySlug}:`, error);
      
      // Return fallback data
      return {
        posts: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
        category: { slug: categorySlug, name: categorySlug },
        error: error.message
      };
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await blogApiClient.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Return fallback categories
      return {
        categories: [
          { slug: 'tecnologia', name: 'Tecnologia' },
          { slug: 'educacao', name: 'Educa��o' },
          { slug: 'carreira', name: 'Carreira' }
        ],
        error: error.message
      };
    }
  },

  // Search posts
  searchPosts: async (query, page = 1, limit = 10) => {
    try {
      if (!query || typeof query !== 'string' || query.trim().length < 2) {
        return {
          posts: [],
          pagination: { page: 1, limit, total: 0, totalPages: 0 },
          query: query || '',
          success: true,
          message: 'Query muito curta para pesquisa'
        };
      }
      
      const params = new URLSearchParams({
        search: query.trim(),
        page: page.toString(),
        limit: limit.toString(),
      });
      
      const response = await blogApiClient.get(`/posts?${params}`);
      
      return {
        ...response.data,
        query: query.trim(),
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error searching posts for "${query}":`, error);
      
      return {
        posts: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
        query: query || '',
        success: false,
        error: {
          message: error.userMessage || 'Erro ao pesquisar posts',
          type: error.type || 'SEARCH_ERROR',
          retryable: error.retryable || true,
          timestamp: new Date().toISOString()
        }
      };
    }
  },

  // Get API configuration and status for debugging
  getConfig: () => ({
    baseURL: API_BASE_URL,
    environment: process.env.NODE_ENV,
    version: process.env.REACT_APP_API_VERSION || 'unknown',
    timeout: blogApiClient.defaults.timeout,
    retries: blogApiClient.defaults.retries,
    debug: localStorage.getItem('debug_api') === 'true'
  }),

  // Enable/disable debug mode
  setDebugMode: (enabled) => {
    if (enabled) {
      localStorage.setItem('debug_api', 'true');
    } else {
      localStorage.removeItem('debug_api');
    }
    console.log(`[Blog API] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }
};

// Export enhanced API client for advanced usage
export { blogApiClient };

// Export configuration helpers
export const getBlogAPIConfig = () => blogAPI.getConfig();
export const setBlogAPIDebug = (enabled) => blogAPI.setDebugMode(enabled);
export const checkBlogAPIHealth = () => blogAPI.health.checkHealth();

export default blogAPI;