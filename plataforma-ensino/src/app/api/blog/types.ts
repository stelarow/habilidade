import { z } from 'zod'

// Blog Post Response Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published' | 'archived'
  featured_image?: string
  seo_title?: string
  seo_description?: string
  author_id: string
  category_id: string
  view_count: number
  created_at: string
  updated_at: string
  published_at?: string
  
  // Related data
  author?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  category?: {
    id: string
    name: string
    slug: string
    color_theme: string
  }
  course_cta?: {
    course_id: string
    course_name: string
    course_slug: string
  }
}

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image?: string
  published_at?: string
  view_count: number
  
  // Related data
  author?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  category?: {
    id: string
    name: string
    slug: string
    color_theme: string
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color_theme: string
  post_count?: number
}

// API Response Types
export interface BlogListResponse {
  posts: BlogPost[]
  pagination: {
    current_page: number
    total_pages: number
    total_posts: number
    per_page: number
    has_next: boolean
    has_prev: boolean
  }
  meta: {
    total_published: number
    categories: BlogCategory[]
  }
}

export interface BlogPostResponse {
  post: BlogPost
  meta: {
    related_posts: BlogPostSummary[]
    next_post?: BlogPostSummary
    prev_post?: BlogPostSummary
  }
}

export interface BlogCategoriesResponse {
  categories: BlogCategory[]
  meta: {
    total_categories: number
    total_posts: number
  }
}

// Validation Schemas
export const BlogQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  category: z.string().optional(),
  search: z.string().min(1).optional(),
  sort: z.enum(['newest', 'oldest', 'popular', 'title']).default('newest')
})

export const BlogSlugSchema = z.object({
  slug: z.string().min(1).max(255)
})

// API Error Types
export interface APIError {
  error: string
  message: string
  code: number
  timestamp: string
  request_id?: string
}

// Cache Headers Configuration
export const CACHE_CONFIG = {
  POSTS_LIST: {
    'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    'CDN-Cache-Control': 'max-age=300'
  },
  SINGLE_POST: {
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
    'CDN-Cache-Control': 'max-age=3600'
  },
  CATEGORIES: {
    'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
    'CDN-Cache-Control': 'max-age=1800'
  },
  SITEMAP: {
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
    'Content-Type': 'application/xml; charset=utf-8'
  }
} as const