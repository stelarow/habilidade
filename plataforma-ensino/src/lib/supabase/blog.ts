import { createClient } from '@/lib/supabase/server';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  post_count: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category_id: string;
  author_id: string;
  image_url: string;
  reading_time: number;
  views: number;
  published_at: string;
  seo_title: string;
  seo_description: string;
  og_image: string;
  canonical_url: string;
  category?: BlogCategory;
  author?: BlogAuthor;
  tags?: BlogTag[];
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export async function getBlogPosts(limit = 10, offset = 0) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      author:blog_authors(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) throw error;
  
  return data?.map(post => ({
    ...post,
    tags: post.tags?.map((t: any) => t.tag) || []
  })) || [];
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      author:blog_authors(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `)
    .eq('slug', slug)
    .lte('published_at', new Date().toISOString())
    .single();
  
  if (error) return null;
  
  // Increment views
  await supabase
    .from('blog_posts')
    .update({ views: data.views + 1 })
    .eq('id', data.id);
  
  return {
    ...data,
    tags: data.tags?.map((t: any) => t.tag) || []
  };
}

export async function getBlogPostsByCategory(categorySlug: string, limit = 10, offset = 0) {
  const supabase = createClient();
  
  // First get the category
  const { data: category } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();
  
  if (!category) return [];
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      author:blog_authors(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `)
    .eq('category_id', category.id)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) throw error;
  
  return data?.map(post => ({
    ...post,
    tags: post.tags?.map((t: any) => t.tag) || []
  })) || [];
}

export async function getBlogCategories() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  return data || [];
}

export async function getBlogTags() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  return data || [];
}

export async function searchBlogPosts(query: string, limit = 10) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      author:blog_authors(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `)
    .lte('published_at', new Date().toISOString())
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  
  return data?.map(post => ({
    ...post,
    tags: post.tags?.map((t: any) => t.tag) || []
  })) || [];
}