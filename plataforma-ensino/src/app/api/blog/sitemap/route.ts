import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { CACHE_CONFIG } from '../types'
import {
  generateRequestId,
  createErrorResponse,
  addCORSHeaders,
  applyCacheHeaders,
  getBlogSupabaseClient,
  logAPIRequest,
  handleCORSPreflight,
  isPublicPost
} from '../utils'

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  
  try {
    console.log(`[BLOG-API] ${requestId}: GET /api/blog/sitemap`, {
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin')
    })

    // Get Supabase client
    const supabase = await getBlogSupabaseClient()

    // Fetch all published posts for sitemap
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        slug,
        updated_at,
        published_at
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })

    if (postsError) {
      throw new Error(`Failed to fetch posts for sitemap: ${postsError.message}`)
    }

    // Filter posts to ensure they're truly public
    const publicPosts = posts?.filter(post => 
      isPublicPost('published', post.published_at)
    ) || []

    // Get base URL from environment or use default
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.escolahabilidade.com.br'

    // Generate XML sitemap
    const sitemap = generateXMLSitemap(baseUrl, publicPosts)

    // Create response with XML content type
    const response = new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    })
    
    // Apply caching for sitemap
    applyCacheHeaders(response, CACHE_CONFIG.SITEMAP)
    
    // Apply CORS
    addCORSHeaders(response, request.headers.get('origin') || undefined)

    // Log successful request
    logAPIRequest(
      'GET',
      '/api/blog/sitemap',
      requestId,
      startTime,
      200,
      {
        postsCount: publicPosts.length,
        sitemapSize: sitemap.length
      }
    )

    return response

  } catch (error) {
    console.error(`[BLOG-API] ${requestId}: Error in GET /api/blog/sitemap:`, error)
    
    // Log error request
    logAPIRequest(
      'GET',
      '/api/blog/sitemap',
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
      'An unexpected error occurred while generating sitemap',
      500,
      requestId
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCORSPreflight(request)
}

// Helper function to generate XML sitemap
function generateXMLSitemap(baseUrl: string, posts: Array<{ slug: string; updated_at: string; published_at: string }>): string {
  const currentDate = new Date().toISOString()
  
  // XML header
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  // Blog index page
  xml += '  <url>\n'
  xml += `    <loc>${baseUrl}/blog</loc>\n`
  xml += `    <lastmod>${currentDate}</lastmod>\n`
  xml += '    <changefreq>daily</changefreq>\n'
  xml += '    <priority>0.8</priority>\n'
  xml += '  </url>\n'
  
  // Individual blog posts
  posts.forEach(post => {
    const lastmod = post.updated_at > post.published_at ? post.updated_at : post.published_at
    
    xml += '  <url>\n'
    xml += `    <loc>${baseUrl}/blog/${encodeURIComponent(post.slug)}</loc>\n`
    xml += `    <lastmod>${lastmod}</lastmod>\n`
    xml += '    <changefreq>weekly</changefreq>\n'
    xml += '    <priority>0.6</priority>\n'
    xml += '  </url>\n'
  })
  
  xml += '</urlset>'
  
  return xml
}