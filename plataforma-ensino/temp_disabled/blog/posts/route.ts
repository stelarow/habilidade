import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { 
  BlogListResponse
} from '../types'
import { 
  BlogQuerySchema, 
  CACHE_CONFIG 
} from '../types'
import {
  generateRequestId,
  createErrorResponse,
  addCORSHeaders,
  applyCacheHeaders,
  getBlogSupabaseClient,
  extractBlogQuery,
  buildOrderClause,
  calculatePagination,
  logAPIRequest,
  handleCORSPreflight,
  isPublicPost
} from '../utils'
import { withApiCache } from '../../../lib/blog/cache-middleware'

// Original handler function
async function handleGetRequest(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  
  try {
    // Extract and validate query parameters
    const queryParams = extractBlogQuery(request)
    const validatedQuery = BlogQuerySchema.parse(queryParams)
    
    console.log(`[BLOG-API] ${requestId}: GET /api/blog/posts`, {
      query: validatedQuery,
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin')
    })

    // Get Supabase client
    const supabase = await getBlogSupabaseClient()

    // Build base query for published posts only
    let postsQuery = supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        status,
        featured_image,
        seo_title,
        seo_description,
        author_id,
        category_id,
        view_count,
        created_at,
        updated_at,
        published_at,
        author:users(id, full_name, avatar_url),
        category:blog_categories(id, name, slug, color_theme),
        course_cta:blog_course_ctas(
          course_id,
          course_name,
          course_slug
        )
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())

    // Apply category filter
    if (validatedQuery.category) {
      postsQuery = postsQuery.eq('category.slug', validatedQuery.category)
    }

    // Apply search filter
    if (validatedQuery.search) {
      postsQuery = postsQuery.or(`title.ilike.%${validatedQuery.search}%,excerpt.ilike.%${validatedQuery.search}%,content.ilike.%${validatedQuery.search}%`)
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())

    if (countError) {
      throw new Error(`Failed to count posts: ${countError.message}`)
    }

    // Apply sorting and pagination
    const orderClause = buildOrderClause(validatedQuery.sort)
    const offset = (validatedQuery.page - 1) * validatedQuery.limit

    const { data: posts, error: postsError } = await postsQuery
      .order(orderClause.split(' ')[0], { 
        ascending: orderClause.includes('ASC') 
      })
      .range(offset, offset + validatedQuery.limit - 1)

    if (postsError) {
      throw new Error(`Failed to fetch posts: ${postsError.message}`)
    }

    // Get categories for metadata
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select(`
        id,
        name, 
        slug,
        description,
        color_theme,
        post_count:blog_posts(count)
      `)
      .order('name')

    if (categoriesError) {
      console.warn(`[BLOG-API] ${requestId}: Failed to fetch categories:`, categoriesError)
    }

    // Filter posts to ensure they're truly public and transform join arrays
    const publicPosts = (posts?.filter(post => 
      isPublicPost(post.status, post.published_at)
    ) || []).map(post => ({
      ...post,
      author: Array.isArray(post.author) ? post.author[0] : post.author,
      category: Array.isArray(post.category) ? post.category[0] : post.category,
      course_cta: Array.isArray(post.course_cta) ? post.course_cta[0] : post.course_cta
    }))

    // Build response
    const pagination = calculatePagination(
      validatedQuery.page,
      totalCount || 0,
      validatedQuery.limit
    )

    const response: BlogListResponse = {
      posts: publicPosts,
      pagination,
      meta: {
        total_published: totalCount || 0,
        categories: categories?.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          color_theme: cat.color_theme,
          post_count: cat.post_count?.[0]?.count || 0
        })) || []
      }
    }

    // Create response with proper headers
    const jsonResponse = NextResponse.json(response)
    
    // Apply caching
    applyCacheHeaders(jsonResponse, CACHE_CONFIG.POSTS_LIST)
    
    // Apply CORS
    addCORSHeaders(jsonResponse, request.headers.get('origin') || undefined)

    // Log successful request
    logAPIRequest(
      'GET',
      '/api/blog/posts',
      requestId,
      startTime,
      200,
      {
        postsCount: publicPosts.length,
        totalPosts: totalCount,
        page: validatedQuery.page,
        filters: {
          category: validatedQuery.category,
          search: validatedQuery.search,
          sort: validatedQuery.sort
        }
      }
    )

    return jsonResponse

  } catch (error) {
    console.error(`[BLOG-API] ${requestId}: Error in GET /api/blog/posts:`, error)
    
    // Log error request
    logAPIRequest(
      'GET',
      '/api/blog/posts',
      requestId,
      startTime,
      500,
      { error: error instanceof Error ? error.message : String(error) }
    )

    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return createErrorResponse(
          'VALIDATION_ERROR',
          'Invalid query parameters provided',
          400,
          requestId
        )
      }

      if (error.message.includes('Database connection')) {
        return createErrorResponse(
          'DATABASE_ERROR',
          'Unable to connect to database',
          503,
          requestId
        )
      }
    }

    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred while fetching posts',
      500,
      requestId
    )
  }
}

// Export cached version
export const GET = withApiCache('posts', handleGetRequest)

export async function OPTIONS(request: NextRequest) {
  return handleCORSPreflight(request)
}