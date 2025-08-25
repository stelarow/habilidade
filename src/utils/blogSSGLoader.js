/**
 * Blog SSG Loader - Isolated from circular dependencies
 * This loader is used only during SSG build time to fetch blog data
 * without importing the main blog API services that cause circular deps
 */

export async function loadBlogDataForSSG() {
  try {
    // Direct import of Supabase client to avoid circular dependencies
    const { createClient } = await import('@supabase/supabase-js');
    
    // Use environment variables or fallback to default values
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vfpdyllwquaturpcifpl.supabase.co';
    const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw';
    
    // Create a direct Supabase client instance (no circular deps)
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    
    // Fetch posts with simplified query
    const { data: postsData, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        read_time,
        blog_categories!inner(id, name, slug, color),
        blog_authors(id, name)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(12);
    
    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('blog_categories')
      .select(`
        id,
        name,
        slug,
        description,
        color
      `)
      .order('name');
    
    if (postsError) {
      console.warn('SSG Blog posts fetch error:', postsError);
    }
    
    if (categoriesError) {
      console.warn('SSG Blog categories fetch error:', categoriesError);
    }
    
    // Transform posts data
    const posts = (postsData || []).map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featuredImage: post.featured_image,
      publishedAt: post.published_at,
      readTime: post.read_time || 5,
      category: post.blog_categories ? {
        id: post.blog_categories.id,
        name: post.blog_categories.name,
        slug: post.blog_categories.slug,
        color: post.blog_categories.color || '#4F46E5'
      } : {
        id: 1,
        name: 'Geral',
        slug: 'geral',
        color: '#4F46E5'
      },
      author: post.blog_authors ? {
        id: post.blog_authors.id,
        name: post.blog_authors.name
      } : {
        id: 1,
        name: 'Escola Habilidade'
      }
    }));
    
    // Transform categories data
    const categories = (categoriesData || []).map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color || '#4F46E5',
      postCount: 0
    }));
    
    console.log(`SSG Blog Loader: Successfully fetched ${posts.length} posts and ${categories.length} categories`);
    
    return {
      initialPosts: posts,
      initialCategories: categories,
      totalPosts: posts.length,
      hasMore: posts.length >= 12
    };
  } catch (error) {
    console.warn('SSG Blog loader error:', error.message);
    return { 
      initialPosts: [], 
      initialCategories: [],
      totalPosts: 0,
      hasMore: false
    };
  }
}