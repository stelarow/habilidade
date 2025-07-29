import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { APIError } from './types'

// Generate unique request ID for logging
export function generateRequestId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Create standardized error response
export function createErrorResponse(
  error: string,
  message: string,
  code: number = 500,
  request_id?: string
): NextResponse<APIError> {
  const errorResponse: APIError = {
    error,
    message,
    code,
    timestamp: new Date().toISOString(),
    request_id
  }

  console.error(`[BLOG-API-ERROR] ${request_id || 'unknown'}:`, {
    error,
    message,
    code,
    timestamp: errorResponse.timestamp
  })

  return NextResponse.json(errorResponse, { status: code })
}

// Add CORS headers for blog API
export function addCORSHeaders(response: NextResponse, origin?: string): NextResponse {
  // Only allow requests from the main site domain
  const allowedOrigins = [
    'https://www.escolahabilidade.com.br',
    'https://escolahabilidade.com.br',
    process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
    process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5173' : null
  ].filter(Boolean) as string[]

  const requestOrigin = origin || '*'
  const isOriginAllowed = allowedOrigins.includes(requestOrigin) || process.env.NODE_ENV === 'development'

  if (isOriginAllowed) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin)
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}

// Apply cache headers to response
export function applyCacheHeaders(response: NextResponse, cacheConfig: Record<string, string>): NextResponse {
  Object.entries(cacheConfig).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Get Supabase client for blog operations
export async function getBlogSupabaseClient() {
  try {
    const supabase = createClient()
    
    // Test connection
    const { error } = await supabase.from('users').select('count').limit(1).single()
    if (error && !error.message.includes('JSON object requested')) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
    
    return supabase
  } catch (error) {
    console.error('[BLOG-API] Failed to create Supabase client:', error)
    throw error
  }
}

// Extract and validate query parameters
export function extractBlogQuery(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: Math.min(parseInt(searchParams.get('limit') || '10', 10), 50),
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || 'newest'
  }
}

// Build order clause based on sort parameter
export function buildOrderClause(sort: string): string {
  switch (sort) {
    case 'oldest':
      return 'published_at ASC'
    case 'popular':
      return 'view_count DESC, published_at DESC'
    case 'title':
      return 'title ASC'
    case 'newest':
    default:
      return 'published_at DESC'
  }
}

// Calculate pagination data
export function calculatePagination(currentPage: number, totalItems: number, perPage: number) {
  const totalPages = Math.ceil(totalItems / perPage)
  
  return {
    current_page: currentPage,
    total_pages: totalPages,
    total_posts: totalItems,
    per_page: perPage,
    has_next: currentPage < totalPages,
    has_prev: currentPage > 1
  }
}

// Log API request with performance metrics
export function logAPIRequest(
  method: string,
  path: string,
  requestId: string,
  startTime: number,
  status: number,
  extraData?: Record<string, any>
) {
  const duration = Date.now() - startTime
  const logData = {
    method,
    path,
    requestId,
    duration: `${duration}ms`,
    status,
    timestamp: new Date().toISOString(),
    ...extraData
  }

  if (status >= 400) {
    console.error(`[BLOG-API-ERROR] ${requestId}:`, logData)
  } else {
    console.log(`[BLOG-API] ${requestId}:`, logData)
  }
}

// Handle OPTIONS requests for CORS preflight
export function handleCORSPreflight(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 200 })
  return addCORSHeaders(response, request.headers.get('origin') || undefined)
}

// Validate blog post status for public access
export function isPublicPost(status: string, publishedAt?: string): boolean {
  return status === 'published' && !!publishedAt && new Date(publishedAt) <= new Date()
}