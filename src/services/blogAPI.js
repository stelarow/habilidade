import axios from 'axios';

// Configure base URL - em produção, pode ser o domínio da plataforma
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://plataforma.escolahabilidade.com/api' // Adjust when deployed
  : 'http://localhost:3000/api'; // Local development

// Create axios instance with default configuration
const blogApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and error handling
blogApiClient.interceptors.request.use(
  (config) => {
    console.log(`[Blog API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Blog API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
blogApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('[Blog API] Response error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Servidor temporariamente indisponível. Tente novamente mais tarde.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Conteúdo não encontrado.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
    }
    
    throw error;
  }
);

// Blog API service functions
export const blogAPI = {
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
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // Return fallback data for offline/error scenarios
      return {
        posts: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
        error: error.message
      };
    }
  },

  // Get single post by slug
  getPostBySlug: async (slug) => {
    try {
      const response = await blogApiClient.get(`/posts/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${slug}:`, error);
      throw error;
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
          { slug: 'educacao', name: 'Educação' },
          { slug: 'carreira', name: 'Carreira' }
        ],
        error: error.message
      };
    }
  },

  // Search posts
  searchPosts: async (query, page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams({
        search: query,
        page: page.toString(),
        limit: limit.toString(),
      });
      
      const response = await blogApiClient.get(`/posts?${params}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching posts for "${query}":`, error);
      
      // Return fallback data
      return {
        posts: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
        query,
        error: error.message
      };
    }
  }
};

export default blogAPI;