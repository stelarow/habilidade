import { NextRequest, NextResponse } from 'next/server'
import type { 
  BlogPostResponse
} from '../../types'
import { 
  BlogSlugSchema, 
  CACHE_CONFIG 
} from '../../types'
import {
  generateRequestId,
  createErrorResponse,
  addCORSHeaders,
  applyCacheHeaders,
  getBlogSupabaseClient,
  logAPIRequest,
  handleCORSPreflight,
  isPublicPost
} from '../../utils'

interface RouteParams {
  params: {
    slug: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  
  try {
    // Validate slug parameter
    const validatedParams = BlogSlugSchema.parse({ slug: params.slug })
    
    console.log(`[BLOG-API] ${requestId}: GET /api/blog/posts/${validatedParams.slug}`, {
      slug: validatedParams.slug,
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin')
    })

    // Get Supabase client
    const supabase = await getBlogSupabaseClient()

    // Fetch the specific post with related data
    const { data: post, error: postError } = await supabase
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
      .eq('slug', validatedParams.slug)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .single()

    if (postError || !post) {
      console.log(`[BLOG-API] ${requestId}: Post not found: ${validatedParams.slug}`)
      
      logAPIRequest(
        'GET',
        `/api/blog/posts/${validatedParams.slug}`,
        requestId,
        startTime,
        404,
        { slug: validatedParams.slug, error: postError?.message }
      )

      return createErrorResponse(
        'POST_NOT_FOUND',
        `Blog post with slug "${validatedParams.slug}" not found`,
        404,
        requestId
      )
    }

    // Double-check post is public
    if (!isPublicPost(post.status, post.published_at)) {
      console.log(`[BLOG-API] ${requestId}: Post not public: ${validatedParams.slug}`)
      
      logAPIRequest(
        'GET',
        `/api/blog/posts/${validatedParams.slug}`,
        requestId,
        startTime,
        404,
        { slug: validatedParams.slug, reason: 'not_public' }
      )

      return createErrorResponse(
        'POST_NOT_FOUND',
        `Blog post with slug "${validatedParams.slug}" not found`,
        404,
        requestId
      )
    }

    // Increment view count (fire and forget - don't block response)
    supabase
      .from('blog_posts')
      .update({ view_count: post.view_count + 1 })
      .eq('id', post.id)
      .then(({ error }) => {
        if (error) {
          console.warn(`[BLOG-API] ${requestId}: Failed to increment view count for ${post.id}:`, error)
        } else {
          console.log(`[BLOG-API] ${requestId}: Incremented view count for ${post.id}`)
        }
      })

    // Fetch related posts (same category, excluding current post)
    const { data: relatedPosts, error: relatedError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        view_count,
        author:users(id, full_name, avatar_url),
        category:blog_categories(id, name, slug, color_theme)
      `)
      .eq('category_id', post.category_id)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .neq('id', post.id)
      .order('published_at', { ascending: false })
      .limit(3)

    if (relatedError) {
      console.warn(`[BLOG-API] ${requestId}: Failed to fetch related posts:`, relatedError)
    }

    // Fetch next and previous posts chronologically
    const { data: nextPost, error: nextError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        view_count
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .gt('published_at', post.published_at)
      .order('published_at', { ascending: true })
      .limit(1)
      .single()

    const { data: prevPost, error: prevError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        view_count
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lt('published_at', post.published_at)
      .order('published_at', { ascending: false })
      .limit(1)
      .single()

    if (nextError && !nextError.message.includes('JSON object requested')) {
      console.warn(`[BLOG-API] ${requestId}: Failed to fetch next post:`, nextError)
    }

    if (prevError && !prevError.message.includes('JSON object requested')) {
      console.warn(`[BLOG-API] ${requestId}: Failed to fetch previous post:`, prevError)
    }

    // Transform post data to fix join relationships (arrays to single objects)
    const transformedPost = {
      ...post,
      author: Array.isArray(post.author) ? post.author[0] : post.author,
      category: Array.isArray(post.category) ? post.category[0] : post.category,
      course_cta: Array.isArray(post.course_cta) ? post.course_cta[0] : post.course_cta
    }

    // Transform related posts to fix join relationships
    const transformedRelatedPosts = (relatedPosts || []).map(relatedPost => ({
      ...relatedPost,
      author: Array.isArray(relatedPost.author) ? relatedPost.author[0] : relatedPost.author,
      category: Array.isArray(relatedPost.category) ? relatedPost.category[0] : relatedPost.category
    }))

    // nextPost and prevPost don't have author/category joins, so no transformation needed

    // Build response
    const response: BlogPostResponse = {
      post: transformedPost,
      meta: {
        related_posts: transformedRelatedPosts,
        next_post: nextPost || undefined,
        prev_post: prevPost || undefined
      }
    }

    // Create response with proper headers
    const jsonResponse = NextResponse.json(response)
    
    // Apply long caching for individual posts
    applyCacheHeaders(jsonResponse, CACHE_CONFIG.SINGLE_POST)
    
    // Apply CORS
    addCORSHeaders(jsonResponse, request.headers.get('origin') || undefined)

    // Log successful request
    logAPIRequest(
      'GET',
      `/api/blog/posts/${validatedParams.slug}`,
      requestId,
      startTime,
      200,
      {
        postId: transformedPost.id,
        title: transformedPost.title,
        categorySlug: transformedPost.category?.slug,
        viewCount: transformedPost.view_count,
        relatedPostsCount: relatedPosts?.length || 0,
        hasNext: !!nextPost,
        hasPrev: !!prevPost
      }
    )

    return jsonResponse

  } catch (error) {
    console.error(`[BLOG-API] ${requestId}: Error in GET /api/blog/posts/[slug]:`, error)
    
    // Log error request
    logAPIRequest(
      'GET',
      `/api/blog/posts/${params.slug}`,
      requestId,
      startTime,
      500,
      { error: error instanceof Error ? error.message : String(error) }
    )

    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return createErrorResponse(
          'VALIDATION_ERROR',
          'Invalid slug parameter provided',
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
      'An unexpected error occurred while fetching the blog post',
      500,
      requestId
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCORSPreflight(request)
}