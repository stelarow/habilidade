import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { BLOG_POSTS } from "./blog-data-CxiE244K.js";
const logStaticQuery = (operation, params = {}) => {
};
let postsCache = null;
let categoriesCache = null;
let lastCacheUpdate = null;
const CACHE_DURATION = 30 * 60 * 1e3;
const loadPosts = () => {
  var _a, _b;
  const now = Date.now();
  if (postsCache && lastCacheUpdate && now - lastCacheUpdate < CACHE_DURATION) {
    return postsCache;
  }
  const posts = [];
  const categoriesSet = /* @__PURE__ */ new Set();
  for (const [slug, postData] of Object.entries(BLOG_POSTS)) {
    try {
      if (postData == null ? void 0 : postData.post) {
        const post = postData.post;
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
          blog_post_tags: post.tags ? post.tags.map((tag) => ({
            blog_tags: {
              id: generateTagId(tag),
              name: tag,
              slug: slugify(tag)
            }
          })) : [],
          // Autor padrão
          blog_authors: {
            id: 1,
            name: ((_a = post.author) == null ? void 0 : _a.name) || "Escola Habilidade",
            email: ((_b = post.author) == null ? void 0 : _b.email) || "contato@escolahabilidade.com"
          }
        };
        posts.push(processedPost);
        if (processedPost.blog_categories) {
          categoriesSet.add(JSON.stringify(processedPost.blog_categories));
        }
      }
    } catch (error) {
      console.error(`[Static Blog API] Erro ao carregar post ${slug}:`, error);
    }
  }
  posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  postsCache = posts;
  lastCacheUpdate = now;
  const uniqueCategories = Array.from(categoriesSet).map((catStr) => JSON.parse(catStr)).sort((a, b) => a.name.localeCompare(b.name));
  categoriesCache = uniqueCategories;
  logStaticQuery("loadPosts", {
    loaded: posts.length,
    categories: uniqueCategories.length
  });
  return posts;
};
const extractCategoryFromContent = (content) => {
  const categoryKeywords = {
    "design": ["sketchup", "enscape", "design", "modelagem", "3d", "renderização", "autocad", "revit"],
    "tecnologia": ["programação", "código", "javascript", "python", "web", "desenvolvimento"],
    "inteligencia-artificial": ["ia", "inteligência artificial", "machine learning", "ai", "agente"],
    "business-intelligence": ["bi", "dashboard", "dados", "analytics", "business intelligence"],
    "marketing": ["marketing", "digital", "redes sociais", "seo"],
    "educacao": ["curso", "aprender", "ensino", "educação"],
    "carreira": ["profissional", "carreira", "emprego", "qualificação"]
  };
  const lowerContent = content.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowerContent.includes(keyword))) {
      return {
        name: category.charAt(0).toUpperCase() + category.slice(1).replace("-", " "),
        slug: category
      };
    }
  }
  return {
    name: "Design",
    slug: "design"
  };
};
const generateCategoryId = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 10) + Math.random().toString(36).substring(2, 7);
};
const generateTagId = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 8) + Math.random().toString(36).substring(2, 5);
};
const slugify = (text) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};
const generateCategoryColor = (name) => {
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#f97316", "#06b6d4", "#84cc16"];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
const transformBlogPost = (post, category = null) => {
  var _a;
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
    tags: ((_a = post.blog_post_tags) == null ? void 0 : _a.map((tag) => ({
      id: tag.blog_tags.id,
      name: tag.blog_tags.name,
      slug: tag.blog_tags.slug
    }))) || [],
    author: {
      id: post.blog_authors.id,
      name: post.blog_authors.name,
      email: post.blog_authors.email
    }
  };
};
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
const handleStaticError = (error, operation) => {
  console.error(`[Static Blog API] Erro em ${operation}:`, error);
  return {
    type: "STATIC_ERROR",
    message: `Erro na operação ${operation}`,
    userMessage: "Ocorreu um erro ao carregar os dados do blog.",
    retryable: true,
    originalError: error
  };
};
const staticBlogAPI = {
  // Verificar saúde da conexão
  health: {
    async checkHealth() {
      try {
        const posts = loadPosts();
        return {
          status: "healthy",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "static",
          version: "1.0.0",
          environment: "production",
          postsLoaded: posts.length
        };
      } catch (error) {
        return {
          status: "unhealthy",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "static",
          error: error.message
        };
      }
    },
    async checkDatabase() {
      try {
        const posts = loadPosts();
        return {
          status: "connected",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "static",
          postsCount: posts.length
        };
      } catch (error) {
        return {
          status: "disconnected",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "static",
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
        lastCheck: (/* @__PURE__ */ new Date()).toISOString(),
        mode: "static"
      };
    }
  },
  // Buscar todos os posts com paginação
  async getAllPosts(page = 1, limit = 10, category = null, search = null) {
    try {
      logStaticQuery("getAllPosts", { page, limit, category, search });
      let posts = loadPosts();
      if (category) {
        posts = posts.filter(
          (post) => post.blog_categories && post.blog_categories.slug === category
        );
      }
      if (search && search.trim().length >= 2) {
        const searchTerm = search.trim().toLowerCase();
        posts = posts.filter(
          (post) => post.title.toLowerCase().includes(searchTerm) || post.excerpt.toLowerCase().includes(searchTerm) || post.content.toLowerCase().includes(searchTerm)
        );
      }
      const total = posts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedPosts = posts.slice(startIndex, startIndex + limit);
      const transformedPosts = paginatedPosts.map(
        (post) => transformBlogPost(post, transformCategory(post.blog_categories))
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
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      throw handleStaticError(error, "getAllPosts");
    }
  },
  // Buscar post por slug
  async getPostBySlug(slug) {
    try {
      logStaticQuery("getPostBySlug", { slug });
      const posts = loadPosts();
      const post = posts.find((p) => p.slug === slug);
      if (!post) {
        throw {
          type: "NOT_FOUND",
          message: "Post não encontrado",
          userMessage: `O post "${slug}" não foi encontrado.`,
          retryable: false
        };
      }
      const transformedPost = transformBlogPost(post, transformCategory(post.blog_categories));
      return {
        post: transformedPost,
        success: true,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      if (error.type === "NOT_FOUND") {
        throw error;
      }
      throw handleStaticError(error, "getPostBySlug");
    }
  },
  // Buscar posts por categoria
  async getPostsByCategory(categorySlug, page = 1, limit = 10) {
    try {
      logStaticQuery("getPostsByCategory", { categorySlug, page, limit });
      const posts = loadPosts();
      const categoryPost = posts.find(
        (p) => p.blog_categories && p.blog_categories.slug === categorySlug
      );
      if (!categoryPost) {
        throw {
          type: "NOT_FOUND",
          message: "Categoria não encontrada",
          userMessage: `A categoria "${categorySlug}" não foi encontrada.`,
          retryable: false
        };
      }
      const category = transformCategory(categoryPost.blog_categories);
      const categoryPosts = posts.filter(
        (post) => post.blog_categories && post.blog_categories.slug === categorySlug
      );
      const total = categoryPosts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedPosts = categoryPosts.slice(startIndex, startIndex + limit);
      const transformedPosts = paginatedPosts.map(
        (post) => transformBlogPost(post, category)
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
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      if (error.type === "NOT_FOUND") {
        throw error;
      }
      throw handleStaticError(error, "getPostsByCategory");
    }
  },
  // Buscar todas as categorias
  async getCategories() {
    try {
      logStaticQuery("getCategories");
      loadPosts();
      const categories = categoriesCache.map((category) => {
        const posts = loadPosts();
        const postCount = posts.filter(
          (post) => post.blog_categories && post.blog_categories.id === category.id
        ).length;
        return {
          ...transformCategory(category),
          postCount
        };
      });
      return {
        categories,
        success: true,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      throw handleStaticError(error, "getCategories");
    }
  },
  // Buscar posts
  async searchPosts(query, page = 1, limit = 10) {
    try {
      if (!query || typeof query !== "string" || query.trim().length < 2) {
        return {
          posts: [],
          pagination: { page: 1, limit, total: 0, totalPages: 0 },
          query: query || "",
          success: true,
          message: "Query muito curta para pesquisa"
        };
      }
      logStaticQuery("searchPosts", { query, page, limit });
      const searchTerm = query.trim().toLowerCase();
      const posts = loadPosts();
      const filteredPosts = posts.filter(
        (post) => post.title.toLowerCase().includes(searchTerm) || post.excerpt.toLowerCase().includes(searchTerm) || post.content.toLowerCase().includes(searchTerm)
      );
      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
      const transformedPosts = paginatedPosts.map(
        (post) => transformBlogPost(post, transformCategory(post.blog_categories))
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
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      throw handleStaticError(error, "searchPosts");
    }
  },
  // Configuração da API
  getConfig: () => ({
    baseURL: "static",
    environment: "production",
    version: "1.0.0",
    timeout: 0,
    // Sem timeout para sistema local
    retries: 0,
    // Sem retries necessários
    debug: false,
    useMockData: false,
    postsCount: (postsCache == null ? void 0 : postsCache.length) || 0
  }),
  setDebugMode: (enabled) => {
    console.log(`[Static Blog API] Debug mode ${enabled ? "enabled" : "disabled"}`);
  }
};
const blogAPI = {
  health: staticBlogAPI.health,
  getAllPosts: staticBlogAPI.getAllPosts,
  getPostBySlug: staticBlogAPI.getPostBySlug,
  getPostsByCategory: staticBlogAPI.getPostsByCategory,
  getCategories: staticBlogAPI.getCategories,
  searchPosts: staticBlogAPI.searchPosts,
  getConfig: staticBlogAPI.getConfig,
  setDebugMode: staticBlogAPI.setDebugMode
};
const CACHE_CONFIG = {
  POSTS_LIST: 30 * 60 * 1e3,
  // 30 minutes for lists (dados estáticos mudam pouco)
  POST_DETAIL: 2 * 60 * 60 * 1e3,
  // 2 hours for individual posts  
  CATEGORIES: 60 * 60 * 1e3
  // 1 hour for categories
};
const usePosts = (page = 1, limit = 10, category = null, search = null) => {
  return useQuery({
    queryKey: ["posts", page, limit, category, search],
    queryFn: () => blogAPI.getAllPosts(page, limit, category, search),
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3e3)
  });
};
const useInfinitePosts = (limit = 10, category = null, search = null) => {
  return useInfiniteQuery({
    queryKey: ["infinitePosts", limit, category, search],
    queryFn: ({ pageParam = 1 }) => blogAPI.getAllPosts(pageParam, limit, category, search),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : void 0;
    },
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3e3)
  });
};
const usePost = (slug) => {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => blogAPI.getPostBySlug(slug),
    staleTime: CACHE_CONFIG.POST_DETAIL,
    retry: 2,
    enabled: !!slug,
    // Only run query if slug is provided
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3e3)
  });
};
const useInfinitePostsByCategory = (categorySlug, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["infinitePostsByCategory", categorySlug, limit],
    queryFn: ({ pageParam = 1 }) => blogAPI.getPostsByCategory(categorySlug, pageParam, limit),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : void 0;
    },
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 3,
    enabled: !!categorySlug,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3e3)
  });
};
const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => blogAPI.getCategories(),
    staleTime: CACHE_CONFIG.CATEGORIES,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3e3)
  });
};
const usePrefetchPost = () => {
  const queryClient = useQueryClient();
  return (slug) => {
    queryClient.prefetchQuery({
      queryKey: ["post", slug],
      queryFn: () => blogAPI.getPostBySlug(slug),
      staleTime: CACHE_CONFIG.POST_DETAIL
    });
  };
};
export {
  useCategories as a,
  useInfinitePostsByCategory as b,
  usePrefetchPost as c,
  useInfinitePosts as d,
  usePosts as e,
  usePost as u
};
