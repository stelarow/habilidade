/**
 * Webhook endpoint for cache invalidation
 * Provides secure cache invalidation triggered by content changes
 */

import { NextRequest, NextResponse } from 'next/server'
import { apiCache, verifyWebhookSignature } from '../../../../lib/blog/api-cache'
import { generateRequestId, createErrorResponse, logAPIRequest } from '../../utils'

// Rate limiting map to prevent abuse
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 50 // 50 requests per minute

// Security configuration
const WEBHOOK_CONFIG = {
  secret: process.env.CACHE_WEBHOOK_SECRET || '',
  ipWhitelist: process.env.CACHE_WEBHOOK_IPS?.split(',') || [],
  enableLogging: process.env.CACHE_WEBHOOK_LOGGING !== 'false',
  requireSignature: process.env.CACHE_WEBHOOK_REQUIRE_SIGNATURE !== 'false',
}

// Webhook payload interface
interface WebhookPayload {
  type: 'post.created' | 'post.updated' | 'post.deleted' | 'category.created' | 'category.updated' | 'category.deleted' | 'bulk.update'
  data: {
    id?: string
    slug?: string
    category_id?: string
    old_slug?: string // For updates
    old_category_id?: string // For category changes
  }
  timestamp: string
  source?: string
}

// Audit log interface
interface AuditLog {
  timestamp: string
  requestId: string
  ip: string
  userAgent: string
  payload: WebhookPayload
  invalidated: string[]
  success: boolean
  error?: string
}

// In-memory audit log (in production, this should be persisted)
const auditLogs: AuditLog[] = []
const MAX_AUDIT_LOGS = 1000

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  const clientIP = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    console.log(`[CACHE-WEBHOOK] ${requestId}: Webhook invalidation request`, {
      ip: clientIP,
      userAgent,
      timestamp: new Date().toISOString(),
    })

    // Rate limiting
    if (!checkRateLimit(clientIP)) {
      return createRateLimitResponse(requestId, clientIP)
    }

    // IP whitelist check (if configured)
    if (WEBHOOK_CONFIG.ipWhitelist.length > 0 && !WEBHOOK_CONFIG.ipWhitelist.includes(clientIP)) {
      console.warn(`[CACHE-WEBHOOK] ${requestId}: IP not whitelisted: ${clientIP}`)
      
      logAPIRequest(
        'POST',
        '/api/blog/cache/invalidate',
        requestId,
        startTime,
        403,
        { ip: clientIP, reason: 'ip_not_whitelisted' }
      )

      return NextResponse.json(
        { 
          error: 'FORBIDDEN',
          message: 'IP not whitelisted',
          request_id: requestId 
        },
        { status: 403 }
      )
    }

    // Parse request body
    const rawBody = await request.text()
    let payload: WebhookPayload

    try {
      payload = JSON.parse(rawBody)
    } catch (parseError) {
      console.error(`[CACHE-WEBHOOK] ${requestId}: Invalid JSON payload:`, parseError)
      
      return createErrorResponse(
        'INVALID_PAYLOAD',
        'Invalid JSON payload',
        400,
        requestId
      )
    }

    // Signature verification (if required)
    if (WEBHOOK_CONFIG.requireSignature && WEBHOOK_CONFIG.secret) {
      const signature = request.headers.get('x-webhook-signature') || request.headers.get('x-signature') || ''
      
      if (!verifyWebhookSignature(rawBody, signature, WEBHOOK_CONFIG.secret)) {
        console.warn(`[CACHE-WEBHOOK] ${requestId}: Invalid webhook signature`)
        
        logAPIRequest(
          'POST',
          '/api/blog/cache/invalidate',
          requestId,
          startTime,
          401,
          { reason: 'invalid_signature' }
        )

        return NextResponse.json(
          {
            error: 'INVALID_SIGNATURE',
            message: 'Webhook signature verification failed',
            request_id: requestId
          },
          { status: 401 }
        )
      }
    }

    // Validate payload structure
    const validationError = validatePayload(payload)
    if (validationError) {
      console.error(`[CACHE-WEBHOOK] ${requestId}: Payload validation failed:`, validationError)
      
      return createErrorResponse(
        'VALIDATION_ERROR',
        validationError,
        400,
        requestId
      )
    }

    // Process cache invalidation
    const invalidationResult = await apiCache.invalidateByWebhook(payload)
    
    // Create audit log entry
    const auditEntry: AuditLog = {
      timestamp: new Date().toISOString(),
      requestId,
      ip: clientIP,
      userAgent,
      payload,
      invalidated: invalidationResult.invalidated,
      success: true,
    }

    // Store audit log
    if (WEBHOOK_CONFIG.enableLogging) {
      auditLogs.push(auditEntry)
      
      // Keep only the last MAX_AUDIT_LOGS entries
      if (auditLogs.length > MAX_AUDIT_LOGS) {
        auditLogs.splice(0, auditLogs.length - MAX_AUDIT_LOGS)
      }
    }

    // Log successful request
    logAPIRequest(
      'POST',
      '/api/blog/cache/invalidate',
      requestId,
      startTime,
      200,
      {
        type: payload.type,
        invalidatedCount: invalidationResult.count,
        invalidatedKeys: invalidationResult.invalidated,
      }
    )

    // Send success response
    const response = {
      success: true,
      message: 'Cache invalidation completed',
      request_id: requestId,
      invalidated: invalidationResult.invalidated,
      count: invalidationResult.count,
      timestamp: new Date().toISOString(),
    }

    console.log(`[CACHE-WEBHOOK] ${requestId}: Invalidation completed successfully`, {
      type: payload.type,
      count: invalidationResult.count,
      duration: Date.now() - startTime,
    })

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error(`[CACHE-WEBHOOK] ${requestId}: Error processing webhook:`, error)

    // Create audit log entry for error
    if (WEBHOOK_CONFIG.enableLogging) {
      const auditEntry: AuditLog = {
        timestamp: new Date().toISOString(),
        requestId,
        ip: clientIP,
        userAgent,
        payload: {} as WebhookPayload, // We might not have parsed payload
        invalidated: [],
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }

      auditLogs.push(auditEntry)
      
      if (auditLogs.length > MAX_AUDIT_LOGS) {
        auditLogs.splice(0, auditLogs.length - MAX_AUDIT_LOGS)
      }
    }

    // Log error request
    logAPIRequest(
      'POST',
      '/api/blog/cache/invalidate',
      requestId,
      startTime,
      500,
      { error: error instanceof Error ? error.message : String(error) }
    )

    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred while processing webhook',
      500,
      requestId
    )
  }
}

// GET endpoint for webhook health check and audit logs
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  const clientIP = getClientIP(request)

  // Simple authentication check for GET requests
  const authHeader = request.headers.get('authorization')
  const expectedAuth = `Bearer ${WEBHOOK_CONFIG.secret}`
  
  if (!authHeader || authHeader !== expectedAuth) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED', message: 'Invalid authorization' },
      { status: 401 }
    )
  }

  try {
    const url = new URL(request.url)
    const endpoint = url.searchParams.get('endpoint')

    switch (endpoint) {
      case 'health':
        return NextResponse.json({
          status: 'healthy',
          webhook_config: {
            require_signature: WEBHOOK_CONFIG.requireSignature,
            ip_whitelist_enabled: WEBHOOK_CONFIG.ipWhitelist.length > 0,
            logging_enabled: WEBHOOK_CONFIG.enableLogging,
          },
          cache_status: apiCache.getMetrics(),
          timestamp: new Date().toISOString(),
        })

      case 'audit':
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100)
        const offset = parseInt(url.searchParams.get('offset') || '0')
        
        const paginatedLogs = auditLogs
          .slice(-limit - offset)
          .slice(-limit)
          .reverse()

        return NextResponse.json({
          logs: paginatedLogs,
          total: auditLogs.length,
          limit,
          offset,
          timestamp: new Date().toISOString(),
        })

      case 'stats':
        const successCount = auditLogs.filter(log => log.success).length
        const errorCount = auditLogs.filter(log => !log.success).length
        const typeStats = auditLogs.reduce((acc, log) => {
          if (log.payload.type) {
            acc[log.payload.type] = (acc[log.payload.type] || 0) + 1
          }
          return acc
        }, {} as Record<string, number>)

        return NextResponse.json({
          stats: {
            total_requests: auditLogs.length,
            successful_requests: successCount,
            failed_requests: errorCount,
            success_rate: auditLogs.length > 0 ? (successCount / auditLogs.length) * 100 : 0,
            type_breakdown: typeStats,
          },
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json({
          endpoints: ['health', 'audit', 'stats'],
          usage: '?endpoint=health|audit|stats',
          timestamp: new Date().toISOString(),
        })
    }

  } catch (error) {
    console.error(`[CACHE-WEBHOOK] ${requestId}: Error in GET handler:`, error)
    
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred',
      500,
      requestId
    )
  }
}

// Helper functions

function getClientIP(request: NextRequest): string {
  // Check various headers for client IP
  const xForwardedFor = request.headers.get('x-forwarded-for')
  const xRealIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  
  if (xRealIp) {
    return xRealIp
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp
  }
  
  return 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  
  if (!entry || now > entry.resetTime) {
    // Reset or create new entry
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  entry.count++
  return true
}

function createRateLimitResponse(requestId: string, ip: string): NextResponse {
  console.warn(`[CACHE-WEBHOOK] ${requestId}: Rate limit exceeded for IP: ${ip}`)
  
  return NextResponse.json(
    {
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
      request_id: requestId,
      retry_after: 60,
    },
    { 
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': '0',
      }
    }
  )
}

function validatePayload(payload: any): string | null {
  if (!payload || typeof payload !== 'object') {
    return 'Payload must be a valid JSON object'
  }

  if (!payload.type || typeof payload.type !== 'string') {
    return 'Missing or invalid "type" field'
  }

  const validTypes = [
    'post.created',
    'post.updated', 
    'post.deleted',
    'category.created',
    'category.updated',
    'category.deleted',
    'bulk.update'
  ]

  if (!validTypes.includes(payload.type)) {
    return `Invalid type. Must be one of: ${validTypes.join(', ')}`
  }

  if (!payload.data || typeof payload.data !== 'object') {
    return 'Missing or invalid "data" field'
  }

  // Type-specific validations
  switch (payload.type) {
    case 'post.created':
    case 'post.updated':
    case 'post.deleted':
      if (!payload.data.slug && !payload.data.id) {
        return 'Post operations require either "slug" or "id" in data'
      }
      break

    case 'category.created':
    case 'category.updated':
    case 'category.deleted':
      if (!payload.data.id && !payload.data.slug) {
        return 'Category operations require either "id" or "slug" in data'
      }
      break
  }

  return null // Valid
}

// Export audit logs for admin interface
export function getAuditLogs(limit = 50, offset = 0): {
  logs: AuditLog[]
  total: number
} {
  const paginatedLogs = auditLogs
    .slice(-limit - offset)
    .slice(-limit)
    .reverse()

  return {
    logs: paginatedLogs,
    total: auditLogs.length,
  }
}