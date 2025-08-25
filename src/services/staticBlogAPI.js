/**
 * Static Blog API - Sistema de blog baseado em arquivos JSON locais
 * Substitui completamente as chamadas para Supabase mantendo compatibilidade total
 */

// Importa todos os posts JSON automaticamente
const postModules = import.meta.glob('../data/posts/*.json', { eager: true });

// Debug logging para desenvolvimento
const logStaticQuery = (operation, params = {}) => {
  if (import.meta.env.DEV) {
    console.log(`[Static Blog API] ${operation}:`, params);
  }
};

// Cache dos posts processados
let postsCache = null;
let categoriesCache = null;
let lastCacheUpdate = null;

// Tempo de cache em ms (5 minutos em dev, mais em produção)
const CACHE_DURATION = import.meta.env.DEV ? 5 * 60 * 1000 : 30 * 60 * 1000;

/**
 * Carrega e processa todos os posts dos arquivos JSON
 */
const loadPosts = () => {
  const now = Date.now();
  
  // Verifica se cache ainda é válido
  if (postsCache && lastCacheUpdate && (now - lastCacheUpdate) < CACHE_DURATION) {
    return postsCache;
  }

  logStaticQuery('loadPosts', { cached: false, modules: Object.keys(postModules).length });

  const posts = [];
  const categoriesSet = new Set();

  for (const [path, module] of Object.entries(postModules)) {
    try {
      const postData = module.default || module;
      
      if (postData?.post) {
        const post = postData.post;
        
        // Processa o post mantendo formato compatível com Supabase
        const processedPost = {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          imageUrl: post.imageUrl,
          featuredImage: post.featuredImage,
          readingTime: post.readingTime || 5,
          views: post.views || 0,
          publishedAt: post.publishedAt || post.createdAt,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          ogImage: post.ogImage,
          
          // Extrai categoria do post ou do nome do arquivo
          category: post.category || extractCategoryFromContent(post.content),
          
          // Compatibilidade com formato Supabase
          blog_categories: post.category ? {
            id: generateCategoryId(post.category.name || post.category),
            name: post.category.name || post.category,
            slug: post.category.slug || slugify(post.category.name || post.category),
            description: post.category.description || `Posts sobre ${post.category.name || post.category}`,
            color: post.category.color || generateCategoryColor(post.category.name || post.category)
          } : null,
          
          // Tags processadas
          blog_post_tags: post.tags ? post.tags.map(tag => ({
            blog_tags: {
              id: generateTagId(tag),
              name: tag,
              slug: slugify(tag)
            }
          })) : [],
          
          // Autor padrão
          blog_authors: {
            id: 1,
            name: post.author?.name || 'Escola Habilidade',
            email: post.author?.email || 'contato@escolahabilidade.com'
          }
        };

        posts.push(processedPost);
        
        // Coleta categorias
        if (processedPost.blog_categories) {
          categoriesSet.add(JSON.stringify(processedPost.blog_categories));
        }
      }
    } catch (error) {
      console.error(`[Static Blog API] Erro ao carregar post ${path}:`, error);
    }
  }

  // Ordena posts por data de publicação (mais recente primeiro)
  posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Cache dos posts
  postsCache = posts;
  lastCacheUpdate = now;

  // Processa categorias únicas
  const uniqueCategories = Array.from(categoriesSet)
    .map(catStr => JSON.parse(catStr))
    .sort((a, b) => a.name.localeCompare(b.name));

  categoriesCache = uniqueCategories;

  logStaticQuery('loadPosts', { 
    loaded: posts.length, 
    categories: uniqueCategories.length,
    cached: true 
  });

  return posts;
};

/**
 * Extrai categoria do conteúdo do post
 */
const extractCategoryFromContent = (content) => {
  // Palavras-chave para categorização automática
  const categoryKeywords = {
    'design': ['sketchup', 'enscape', 'design', 'modelagem', '3d', 'renderização', 'autocad', 'revit'],
    'tecnologia': ['programação', 'código', 'javascript', 'python', 'web', 'desenvolvimento'],
    'inteligencia-artificial': ['ia', 'inteligência artificial', 'machine learning', 'ai', 'agente'],
    'business-intelligence': ['bi', 'dashboard', 'dados', 'analytics', 'business intelligence'],
    'marketing': ['marketing', 'digital', 'redes sociais', 'seo'],
    'educacao': ['curso', 'aprender', 'ensino', 'educação'],
    'carreira': ['profissional', 'carreira', 'emprego', 'qualificação']
  };

  const lowerContent = content.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      return {
        name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
        slug: category
      };
    }
  }

  // Categoria padrão
  return {
    name: 'Design',
    slug: 'design'
  };
};

/**
 * Gera ID único para categoria baseado no nome
 */
const generateCategoryId = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10) + Math.random().toString(36).substring(2, 7);
};

/**
 * Gera ID único para tag
 */
const generateTagId = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8) + Math.random().toString(36).substring(2, 5);
};

/**
 * Cria slug a partir de texto
 */
const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Gera cor para categoria
 */
const generateCategoryColor = (name) => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

/**
 * Transforma post para formato compatível com componentes
 */
const transformBlogPost = (post, category = null) => {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    imageUrl: post.imageUrl,
    featuredImage: post.featuredImage,
    readingTime: post.readingTime,
    views: post.views,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    ogImage: post.ogImage,
    category: category || (post.blog_categories ? {
      id: post.blog_categories.id,
      name: post.blog_categories.name,
      slug: post.blog_categories.slug,
      description: post.blog_categories.description,
      color: post.blog_categories.color
    } : null),
    tags: post.blog_post_tags?.map(tag => ({
      id: tag.blog_tags.id,
      name: tag.blog_tags.name,
      slug: tag.blog_tags.slug
    })) || [],
    author: {
      id: post.blog_authors.id,
      name: post.blog_authors.name,
      email: post.blog_authors.email
    }
  };
};

/**
 * Transforma categoria para formato padrão
 */
const transformCategory = (category) => {
  if (!category) return null;
  
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    color: category.color
  };
};

/**
 * Trata erros de forma consistente
 */
const handleStaticError = (error, operation) => {
  console.error(`[Static Blog API] Erro em ${operation}:`, error);
  
  return {
    type: 'STATIC_ERROR',
    message: `Erro na operação ${operation}`,
    userMessage: 'Ocorreu um erro ao carregar os dados do blog.',
    retryable: true,
    originalError: error
  };
};

/**
 * API estática do blog - compatível com supabaseBlogAPI
 */
export const staticBlogAPI = {
  // Verificar saúde da conexão
  health: {
    async checkHealth() {
      try {
        const posts = loadPosts();
        
        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          source: 'static',
          version: '1.0.0',
          environment: 'production',
          postsLoaded: posts.length
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          source: 'static',
          error: error.message
        };
      }
    },

    async checkDatabase() {
      try {
        const posts = loadPosts();
        
        return {
          status: 'connected',
          timestamp: new Date().toISOString(),
          source: 'static',
          postsCount: posts.length
        };
      } catch (error) {
        return {
          status: 'disconnected',
          timestamp: new Date().toISOString(),
          source: 'static',
          error: error.message
        };
      }
    },

    async getStatus() {
      const [api, database] = await Promise.all([
        this.checkHealth(),
        this.checkDatabase()
      ]);
      
      return {
        api,
        database,
        lastCheck: new Date().toISOString(),
        mode: 'static'
      };
    }
  },

  // Buscar todos os posts com paginação
  async getAllPosts(page = 1, limit = 10, category = null, search = null) {
    try {
      logStaticQuery('getAllPosts', { page, limit, category, search });
      
      let posts = loadPosts();

      // Filtro por categoria
      if (category) {
        posts = posts.filter(post => 
          post.blog_categories && post.blog_categories.slug === category
        );
      }

      // Filtro por busca
      if (search && search.trim().length >= 2) {
        const searchTerm = search.trim().toLowerCase();
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm)
        );
      }

      // Paginação
      const total = posts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedPosts = posts.slice(startIndex, startIndex + limit);

      const transformedPosts = paginatedPosts.map(post => 
        transformBlogPost(post, transformCategory(post.blog_categories))
      );

      return {
        posts: transformedPosts,
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
    } catch (error) {
      throw handleStaticError(error, 'getAllPosts');
    }
  },

  // Buscar post por slug
  async getPostBySlug(slug) {
    try {
      logStaticQuery('getPostBySlug', { slug });
      
      const posts = loadPosts();
      const post = posts.find(p => p.slug === slug);

      if (!post) {
        throw {
          type: 'NOT_FOUND',
          message: 'Post não encontrado',
          userMessage: `O post "${slug}" não foi encontrado.`,
          retryable: false
        };
      }

      const transformedPost = transformBlogPost(post, transformCategory(post.blog_categories));

      return {
        post: transformedPost,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error.type === 'NOT_FOUND') {
        throw error;
      }
      throw handleStaticError(error, 'getPostBySlug');
    }
  },

  // Buscar posts por categoria
  async getPostsByCategory(categorySlug, page = 1, limit = 10) {
    try {
      logStaticQuery('getPostsByCategory', { categorySlug, page, limit });
      
      const posts = loadPosts();
      
      // Buscar a categoria
      const categoryPost = posts.find(p => 
        p.blog_categories && p.blog_categories.slug === categorySlug
      );
      
      if (!categoryPost) {
        throw {
          type: 'NOT_FOUND',
          message: 'Categoria não encontrada',
          userMessage: `A categoria "${categorySlug}" não foi encontrada.`,
          retryable: false
        };
      }

      const category = transformCategory(categoryPost.blog_categories);

      // Filtrar posts da categoria
      const categoryPosts = posts.filter(post => 
        post.blog_categories && post.blog_categories.slug === categorySlug
      );

      // Paginação
      const total = categoryPosts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedPosts = categoryPosts.slice(startIndex, startIndex + limit);

      const transformedPosts = paginatedPosts.map(post => 
        transformBlogPost(post, category)
      );

      return {
        posts: transformedPosts,
        category,
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
    } catch (error) {
      if (error.type === 'NOT_FOUND') {
        throw error;
      }
      throw handleStaticError(error, 'getPostsByCategory');
    }
  },

  // Buscar todas as categorias
  async getCategories() {
    try {
      logStaticQuery('getCategories');
      
      loadPosts(); // Garante que cache de categorias está atualizado
      
      const categories = categoriesCache.map(category => {
        const posts = loadPosts();
        const postCount = posts.filter(post => 
          post.blog_categories && post.blog_categories.id === category.id
        ).length;
        
        return {
          ...transformCategory(category),
          postCount
        };
      });

      return {
        categories,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw handleStaticError(error, 'getCategories');
    }
  },

  // Buscar posts
  async searchPosts(query, page = 1, limit = 10) {
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

      logStaticQuery('searchPosts', { query, page, limit });
      
      const searchTerm = query.trim().toLowerCase();
      const posts = loadPosts();
      
      const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      );

      // Paginação
      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);

      const transformedPosts = paginatedPosts.map(post => 
        transformBlogPost(post, transformCategory(post.blog_categories))
      );

      return {
        posts: transformedPosts,
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
    } catch (error) {
      throw handleStaticError(error, 'searchPosts');
    }
  },

  // Configuração da API
  getConfig: () => ({
    baseURL: 'static',
    environment: 'production', 
    version: '1.0.0',
    timeout: 0, // Sem timeout para sistema local
    retries: 0, // Sem retries necessários
    debug: import.meta.env.DEV,
    useMockData: false,
    postsCount: postsCache?.length || 0
  }),

  setDebugMode: (enabled) => {
    console.log(`[Static Blog API] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }
};

export default staticBlogAPI;