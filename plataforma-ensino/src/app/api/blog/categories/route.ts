import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { 
  BlogCategoriesResponse
} from '../types'
import { 
  CACHE_CONFIG 
} from '../types'
import {
  generateRequestId,
  createErrorResponse,
  addCORSHeaders,
  applyCacheHeaders,
  getBlogSupabaseClient,
  logAPIRequest,
  handleCORSPreflight
} from '../utils'

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  
  try {
    console.log(`[BLOG-API] ${requestId}: GET /api/blog/categories`, {
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin')
    })

    // Get Supabase client
    const supabase = await getBlogSupabaseClient()

    // Fetch all categories with post counts
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select(`
        id,
        name, 
        slug,
        description,
        color_theme,
        created_at,
        updated_at
      `)
      .order('name')

    if (categoriesError) {
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`)
    }

    // Get post counts for each category (only published posts)
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (category) => {
        const { count, error: countError } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'published')
          .not('published_at', 'is', null)
          .lte('published_at', new Date().toISOString())

        if (countError) {
          console.warn(`[BLOG-API] ${requestId}: Failed to count posts for category ${category.id}:`, countError)
        }

        return {
          ...category,
          post_count: count || 0
        }
      })
    )

    // Get total published posts count
    const { count: totalPosts, error: totalError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())

    if (totalError) {
      console.warn(`[BLOG-API] ${requestId}: Failed to count total posts:`, totalError)
    }

    // Build response
    const response: BlogCategoriesResponse = {
      categories: categoriesWithCounts,
      meta: {
        total_categories: categoriesWithCounts.length,
        total_posts: totalPosts || 0
      }
    }

    // Create response with proper headers
    const jsonResponse = NextResponse.json(response)
    
    // Apply caching for categories (semi-static data)
    applyCacheHeaders(jsonResponse, CACHE_CONFIG.CATEGORIES)
    
    // Apply CORS
    addCORSHeaders(jsonResponse, request.headers.get('origin') || undefined)

    // Log successful request
    logAPIRequest(
      'GET',
      '/api/blog/categories',
      requestId,
      startTime,
      200,
      {
        categoriesCount: categoriesWithCounts.length,
        totalPosts: totalPosts || 0,
        categoriesWithPosts: categoriesWithCounts.filter(cat => cat.post_count > 0).length
      }
    )

    return jsonResponse

  } catch (error) {
    console.error(`[BLOG-API] ${requestId}: Error in GET /api/blog/categories:`, error)
    
    // Log error request
    logAPIRequest(
      'GET',
      '/api/blog/categories',
      requestId,
      startTime,
      500,
      { error: error instanceof Error ? error.message : String(error) }
    )

    if (error instanceof Error) {
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
      'An unexpected error occurred while fetching categories',
      500,
      requestId
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCORSPreflight(request)
}