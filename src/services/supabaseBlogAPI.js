import { supabase, logSupabaseQuery } from '../config/supabase.js';

// Função helper para tratar erros do Supabase
const handleSupabaseError = (error, operation) => {
  console.error(`[Supabase Error] ${operation}:`, error);
  
  return {
    type: 'SUPABASE_ERROR',
    message: `Erro na operação: ${operation}`,
    userMessage: 'Ocorreu um erro ao carregar os dados. Tente novamente em alguns instantes.',
    retryable: true,
    details: error
  };
};

// Função helper para transformar dados do Supabase para formato esperado pelo frontend
const transformBlogPost = (post, category = null) => {
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
      name: 'Categoria',
      slug: 'categoria'
    },
    tags: post.blog_tags?.map(tagRelation => tagRelation.blog_tag?.name) || [],
    author: post.blog_author || {
      id: post.author_id,
      name: 'Escola Habilidade',
      email: 'contato@escolahabilidade.com.br'
    }
  };
};

const transformCategory = (category) => {
  if (!category) return null;
  
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    postCount: category.post_count || 0,
    color: category.color || '#3B82F6'
  };
};

// API service usando Supabase
export const supabaseBlogAPI = {
  // Verificar saúde da conexão
  health: {
    async checkHealth() {
      try {
        const { data, error } = await supabase
          .from('blog_categories')
          .select('id')
          .limit(1);
        
        if (error) throw error;
        
        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          source: 'supabase',
          version: '1.0.0',
          environment: 'production'
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          source: 'supabase',
          error: error.message
        };
      }
    },

    async checkDatabase() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id')
          .limit(1);
        
        if (error) throw error;
        
        return {
          status: 'connected',
          timestamp: new Date().toISOString(),
          source: 'supabase'
        };
      } catch (error) {
        return {
          status: 'disconnected',
          timestamp: new Date().toISOString(),
          source: 'supabase',
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
        mode: 'supabase'
      };
    }
  },

  // Buscar todos os posts com paginação
  async getAllPosts(page = 1, limit = 10, category = null, search = null) {
    try {
      logSupabaseQuery('blog_posts', 'getAllPosts', { page, limit, category, search });
      
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(id, name, slug, description, color),
          blog_post_tags!left(
            blog_tags!inner(id, name, slug)
          ),
          blog_authors(id, name, email)
        `)
        .order('published_at', { ascending: false });

      // Filtro por categoria
      if (category) {
        query = query.eq('blog_categories.slug', category);
      }

      // Filtro por busca
      if (search && search.trim().length >= 2) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
      }

      // Contagem total
      const { count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Paginação
      const startIndex = (page - 1) * limit;
      query = query.range(startIndex, startIndex + limit - 1);

      const { data, error } = await query;
      
      if (error) throw error;

      const posts = data?.map(post => transformBlogPost(post, transformCategory(post.blog_categories))) || [];
      
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
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw handleSupabaseError(error, 'getAllPosts');
    }
  },

  // Buscar post por slug
  async getPostBySlug(slug) {
    try {
      logSupabaseQuery('blog_posts', 'getPostBySlug', { slug });
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(id, name, slug, description, color),
          blog_post_tags!left(
            blog_tags!inner(id, name, slug)
          ),
          blog_authors(id, name, email)
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw {
            type: 'NOT_FOUND',
            message: 'Post não encontrado',
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
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error.type === 'NOT_FOUND') {
        throw error;
      }
      throw handleSupabaseError(error, 'getPostBySlug');
    }
  },

  // Buscar posts por categoria
  async getPostsByCategory(categorySlug, page = 1, limit = 10) {
    try {
      logSupabaseQuery('blog_posts', 'getPostsByCategory', { categorySlug, page, limit });
      
      // Buscar a categoria primeiro
      const { data: categoryData, error: categoryError } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('slug', categorySlug)
        .single();

      if (categoryError) throw categoryError;

      const category = transformCategory(categoryData);

      // Buscar posts da categoria
      const startIndex = (page - 1) * limit;
      const { data, error, count } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(id, name, slug, description, color),
          blog_post_tags!left(
            blog_tags!inner(id, name, slug)
          ),
          blog_authors(id, name, email)
        `, { count: 'exact' })
        .eq('blog_categories.slug', categorySlug)
        .order('published_at', { ascending: false })
        .range(startIndex, startIndex + limit - 1);

      if (error) throw error;

      const posts = data?.map(post => transformBlogPost(post, category)) || [];
      
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
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw handleSupabaseError(error, 'getPostsByCategory');
    }
  },

  // Buscar todas as categorias
  async getCategories() {
    try {
      logSupabaseQuery('blog_categories', 'getCategories');
      
      const { data, error } = await supabase
        .from('blog_categories')
        .select(`
          *,
          blog_posts(count)
        `)
        .order('name');

      if (error) throw error;

      const categories = data?.map(category => ({
        ...transformCategory(category),
        postCount: category.blog_posts?.length || 0
      })) || [];

      return {
        categories,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw handleSupabaseError(error, 'getCategories');
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

      logSupabaseQuery('blog_posts', 'searchPosts', { query, page, limit });
      
      const searchTerm = `%${query.trim()}%`;
      const startIndex = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(id, name, slug, description, color),
          blog_post_tags!left(
            blog_tags!inner(id, name, slug)
          ),
          blog_authors(id, name, email)
        `, { count: 'exact' })
        .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .order('published_at', { ascending: false })
        .range(startIndex, startIndex + limit - 1);

      if (error) throw error;

      const posts = data?.map(post => transformBlogPost(post, transformCategory(post.blog_categories))) || [];
      
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
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw handleSupabaseError(error, 'searchPosts');
    }
  },

  // Configuração da API
  getConfig: () => ({
    baseURL: 'supabase',
    environment: 'production', 
    version: '1.0.0',
    timeout: 30000,
    retries: 3,
    debug: import.meta.env.DEV,
    useMockData: false
  }),

  setDebugMode: (enabled) => {
    console.log(`[Supabase Blog API] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }
};

// Exports helpers
export const getBlogAPIConfig = () => supabaseBlogAPI.getConfig();
export const setBlogAPIDebug = (enabled) => supabaseBlogAPI.setDebugMode(enabled);
export const checkBlogAPIHealth = () => supabaseBlogAPI.health.checkHealth();

export default supabaseBlogAPI;