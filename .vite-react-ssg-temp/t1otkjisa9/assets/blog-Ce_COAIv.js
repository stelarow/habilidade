import { createClient } from "@supabase/supabase-js";
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true, "VITE_DEBUG_MODE": "true", "VITE_SSG": "true", "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw", "VITE_SUPABASE_URL": "https://vfpdyllwquaturpcifpl.supabase.co" };
const DEFAULT_SUPABASE_URL = "https://vfpdyllwquaturpcifpl.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw";
let supabaseInstance = null;
let envChecked = false;
let supabaseUrl = DEFAULT_SUPABASE_URL;
let supabaseKey = DEFAULT_SUPABASE_ANON_KEY;
const checkEnvVars = () => {
  if (!envChecked && typeof window !== "undefined") {
    try {
      if (window.__VITE_SUPABASE_URL__) {
        supabaseUrl = window.__VITE_SUPABASE_URL__;
      }
      if (window.__VITE_SUPABASE_ANON_KEY__) {
        supabaseKey = window.__VITE_SUPABASE_ANON_KEY__;
      }
      if (typeof import.meta !== "undefined" && __vite_import_meta_env__) {
        supabaseUrl = "https://vfpdyllwquaturpcifpl.supabase.co";
        supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw";
      }
    } catch (e) {
      console.log("Using default Supabase configuration");
    }
    envChecked = true;
  }
};
const getSupabaseClient = () => {
  if (!supabaseInstance) {
    checkEnvVars();
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 2
        }
      },
      global: {
        headers: {
          "x-client-info": "escola-habilidade-frontend"
        }
      }
    });
  }
  return supabaseInstance;
};
const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabaseClient();
    return client[prop];
  }
});
const logSupabaseQuery = (table, operation, params = {}) => {
  if (typeof window !== "undefined" && window.__VITE_DEBUG_MODE__) {
    console.log(`[Supabase] ${operation} on ${table}:`, params);
  }
};
const handleSupabaseError = (error, operation) => {
  console.error(`[Supabase Error] ${operation}:`, error);
  return {
    type: "SUPABASE_ERROR",
    message: `Erro na operação: ${operation}`,
    userMessage: "Ocorreu um erro ao carregar os dados. Tente novamente em alguns instantes.",
    retryable: true,
    details: error
  };
};
const transformBlogPost = (post, category = null) => {
  var _a;
  if (!post) return null;
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    imageUrl: post.image_url,
    featuredImage: post.image_url ? {
      url: post.image_url,
      alt: post.title
    } : null,
    readingTime: post.reading_time || 5,
    views: post.views || 0,
    publishedAt: post.published_at,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    seoTitle: post.seo_title,
    seoDescription: post.seo_description,
    ogImage: post.og_image,
    canonicalUrl: post.canonical_url,
    category: category || {
      id: post.category_id,
      name: "Categoria",
      slug: "categoria"
    },
    tags: ((_a = post.blog_tags) == null ? void 0 : _a.map((tagRelation) => {
      var _a2;
      return (_a2 = tagRelation.blog_tag) == null ? void 0 : _a2.name;
    })) || [],
    author: post.blog_author || {
      id: post.author_id,
      name: "Escola Habilidade",
      email: "contato@escolahabilidade.com.br"
    }
  };
};
const transformCategory = (category) => {
  if (!category) return null;
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    postCount: category.post_count || 0,
    color: category.color || "#3B82F6"
  };
};
const supabaseBlogAPI = {
  // Verificar saúde da conexão
  health: {
    async checkHealth() {
      try {
        const { data, error } = await supabase.from("blog_categories").select("id").limit(1);
        if (error) throw error;
        return {
          status: "healthy",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "supabase",
          version: "1.0.0",
          environment: "production"
        };
      } catch (error) {
        return {
          status: "unhealthy",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "supabase",
          error: error.message
        };
      }
    },
    async checkDatabase() {
      try {
        const { data, error } = await supabase.from("blog_posts").select("id").limit(1);
        if (error) throw error;
        return {
          status: "connected",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "supabase"
        };
      } catch (error) {
        return {
          status: "disconnected",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "supabase",
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
        mode: "supabase"
      };
    }
  },
  // Buscar todos os posts com paginação
  async getAllPosts(page = 1, limit = 10, category = null, search = null) {
    try {
      logSupabaseQuery("blog_posts", "getAllPosts", { page, limit, category, search });
      let query = supabase.from("blog_posts").select(`
          *,
          blog_categories(id, name, slug, description, color),
          blog_post_tags!left(
            blog_tags!inner(id, name, slug)
          ),
          blog_authors(id, name, email)
        `).order("published_at", { ascending: false });
      if (category) {
        query = query.eq("blog_categories.slug", category);
      }
      if (search && search.trim().length >= 2) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
      }
      const { count } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
      const startIndex = (page - 1) * limit;
      query = query.range(startIndex, startIndex + limit - 1);
      const { data, error } = await query;
      if (error) throw error;
      const posts = (data == null ? void 0 : data.map((post) => transformBlogPost(post, transformCategory(post.blog_categories)))) || [];
      const total = count || 0;
      const totalPages = Math.ceil(total / limit);
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
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      throw handleSupabaseError(error, "getAllPosts");
    }
  },
  // Buscar post por slug
  async getPostBySlug(slug) {
    try {
      logSupabaseQuery("blog_posts", "getPostBySlug", { slug });
      const { data, error } = await supabase.from("blog_posts").select(`
          *,
          blog_categories(id, name, slug, description, color),
          blog_post_tags!left(
            blog_tags!inner(id, name, slug)
          ),
          blog_authors(id, name, email)
        `).eq("slug", slug).single();
      if (error) {
        if (error.code === "PGRST116") {
          throw {
            type: "NOT_FOUND",
            message: "Post não encontrado",
            userMessage: `O post "${slug}" não foi encontrado.`,
            retryable: false
          };
        }
        throw error;
      }
      const post = transformBlogPost(data, transformCategory(data.blog_categories));
      return {
        post,
        success: true,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      if (error.type === "NOT_FOUND") {
        throw error;
      }
      throw handleSupabaseError(error, "getPostBySlug");
    }
  },
  // Buscar posts por categoria
  async getPostsByCategory(categorySlug, page = 1, limit = 10) {
    try {
      logSupabaseQuery("blog_posts", "getPostsByCategory", { categorySlug, page, limit });
      const { data: categoryData, error: categoryError } = await supabase.from("blog_categories").select("*").eq("slug", categorySlug).single();
      if (categoryError) throw categoryError;
      const category = transformCategory(categoryData);
      const startIndex = (page - 1) * limit;
      const { data, error, count } = await supabase.from("blog_posts").select(`
          *,
          blog_categories(id, name, slug, description, color),
          blog_post_tags!left(
            blog_tags!inner(id, name, slug)
          ),
          blog_authors(id, name, email)
        `, { count: "exact" }).eq("blog_categories.slug", categorySlug).order("published_at", { ascending: false }).range(startIndex, startIndex + limit - 1);
      if (error) throw error;
      const posts = (data == null ? void 0 : data.map((post) => transformBlogPost(post, category))) || [];
      const total = count || 0;
      const totalPages = Math.ceil(total / limit);
      return {
        posts,
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
      throw handleSupabaseError(error, "getPostsByCategory");
    }
  },
  // Buscar todas as categorias
  async getCategories() {
    try {
      logSupabaseQuery("blog_categories", "getCategories");
      const { data, error } = await supabase.from("blog_categories").select(`
          *,
          blog_posts(count)
        `).order("name");
      if (error) throw error;
      const categories = (data == null ? void 0 : data.map((category) => {
        var _a;
        return {
          ...transformCategory(category),
          postCount: ((_a = category.blog_posts) == null ? void 0 : _a.length) || 0
        };
      })) || [];
      return {
        categories,
        success: true,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      throw handleSupabaseError(error, "getCategories");
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
      logSupabaseQuery("blog_posts", "searchPosts", { query, page, limit });
      const searchTerm = `%${query.trim()}%`;
      const startIndex = (page - 1) * limit;
      const { data, error, count } = await supabase.from("blog_posts").select(`
          *,
          blog_categories(id, name, slug, description, color),
          blog_post_tags!left(
            blog_tags!inner(id, name, slug)
          ),
          blog_authors(id, name, email)
        `, { count: "exact" }).or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`).order("published_at", { ascending: false }).range(startIndex, startIndex + limit - 1);
      if (error) throw error;
      const posts = (data == null ? void 0 : data.map((post) => transformBlogPost(post, transformCategory(post.blog_categories)))) || [];
      const total = count || 0;
      const totalPages = Math.ceil(total / limit);
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
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      throw handleSupabaseError(error, "searchPosts");
    }
  },
  // Configuração da API
  getConfig: () => ({
    baseURL: "supabase",
    environment: "production",
    version: "1.0.0",
    timeout: 3e4,
    retries: 3,
    debug: false,
    useMockData: false
  }),
  setDebugMode: (enabled) => {
    console.log(`[Supabase Blog API] Debug mode ${enabled ? "enabled" : "disabled"}`);
  }
};
const blogAPI = {
  health: supabaseBlogAPI.health,
  getAllPosts: supabaseBlogAPI.getAllPosts,
  getPostBySlug: supabaseBlogAPI.getPostBySlug,
  getPostsByCategory: supabaseBlogAPI.getPostsByCategory,
  getCategories: supabaseBlogAPI.getCategories,
  searchPosts: supabaseBlogAPI.searchPosts,
  getConfig: supabaseBlogAPI.getConfig,
  setDebugMode: supabaseBlogAPI.setDebugMode
};
export {
  blogAPI,
  blogAPI as default
};
