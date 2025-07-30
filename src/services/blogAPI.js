import { mockCategories, mockPosts } from './blogMockData.js';

// Mock data simulation delay (to mimic API response time)
const MOCK_DELAY = 300;

// Helper function to simulate API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

// Mock API functions
const mockAPI = {
  // Get all posts with pagination
  getAllPosts: async (page = 1, limit = 10, category = null, search = null) => {
    await mockDelay();
    
    let filteredPosts = [...mockPosts];
    
    // Filter by category
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.slug === category || post.category.name.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Calculate pagination
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      success: true,
      timestamp: new Date().toISOString()
    };
  },

  // Get single post by slug
  getPostBySlug: async (slug) => {
    await mockDelay();
    
    const post = mockPosts.find(p => p.slug === slug);
    
    if (!post) {
      throw {
        type: 'NOT_FOUND',
        message: 'Post não encontrado',
        userMessage: `O post "${slug}" não foi encontrado.`,
        retryable: false
      };
    }
    
    return {
      post,
      success: true,
      timestamp: new Date().toISOString()
    };
  },

  // Get posts by category
  getPostsByCategory: async (categorySlug, page = 1, limit = 10) => {
    await mockDelay();
    
    const category = mockCategories.find(c => c.slug === categorySlug);
    const filteredPosts = mockPosts.filter(post => post.category.slug === categorySlug);
    
    // Calculate pagination
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      category: category || { slug: categorySlug, name: categorySlug },
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      success: true,
      timestamp: new Date().toISOString()
    };
  },

  // Get all categories
  getCategories: async () => {
    await mockDelay();
    
    return {
      categories: mockCategories,
      success: true,
      timestamp: new Date().toISOString()
    };
  },

  // Search posts
  searchPosts: async (query, page = 1, limit = 10) => {
    await mockDelay();
    
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return {
        posts: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
        query: query || '',
        success: true,
        message: 'Query muito curta para pesquisa'
      };
    }
    
    const searchLower = query.toLowerCase();
    const filteredPosts = mockPosts.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
    
    // Calculate pagination
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      query: query.trim(),
      success: true,
      timestamp: new Date().toISOString()
    };
  }
};

// Health check for mock data
const healthCheck = {
  async checkHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      source: 'mock-data',
      version: '1.0.0',
      environment: 'mock'
    };
  },

  async checkDatabase() {
    return { 
      status: 'connected', 
      timestamp: new Date().toISOString(),
      source: 'mock-data'
    };
  },

  async getStatus() {
    return {
      api: await this.checkHealth(),
      database: await this.checkDatabase(),
      lastCheck: new Date().toISOString(),
      mode: 'mock-data'
    };
  }
};

// Blog API service functions using mock data
export const blogAPI = {
  health: healthCheck,
  getAllPosts: mockAPI.getAllPosts,
  getPostBySlug: mockAPI.getPostBySlug,
  getPostsByCategory: mockAPI.getPostsByCategory,
  getCategories: mockAPI.getCategories,
  searchPosts: mockAPI.searchPosts,
  
  getConfig: () => ({
    baseURL: 'mock-data',
    environment: 'mock',
    version: '1.0.0',
    timeout: 300,
    retries: 0,
    debug: false,
    useMockData: true
  }),

  setDebugMode: (enabled) => {
    console.log(`[Blog API Mock] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }
};

export const getBlogAPIConfig = () => blogAPI.getConfig();
export const setBlogAPIDebug = (enabled) => blogAPI.setDebugMode(enabled);
export const checkBlogAPIHealth = () => blogAPI.health.checkHealth();

export default blogAPI;