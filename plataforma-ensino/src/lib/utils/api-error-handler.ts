/**
 * Centralized API Error Handler
 * 
 * Provides consistent error handling and logging for API endpoints
 * Integrates with existing Sentry setup for error tracking
 */

import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import * as Sentry from '@sentry/nextjs'
import type { 
  ApiErrorResponse, 
  SchedulingApiErrorCode 
} from '@/types/api'

// Error severity levels
export type ErrorSeverity = 'low' | 'normal' | 'high' | 'critical'

// Error mapping configuration
interface ErrorConfig {
  httpStatus: number
  severity: ErrorSeverity
  logToSentry: boolean
  includeDetails: boolean
}

// Standard error codes mapping
const ERROR_CONFIGS: Record<SchedulingApiErrorCode, ErrorConfig> = {
  'TEACHER_NOT_FOUND': {
    httpStatus: 404,
    severity: 'low',
    logToSentry: false,
    includeDetails: false
  },
  'NO_AVAILABILITY': {
    httpStatus: 404,
    severity: 'low',
    logToSentry: false,
    includeDetails: false
  },
  'HOLIDAY_CONFLICT': {
    httpStatus: 409,
    severity: 'normal',
    logToSentry: false,
    includeDetails: true
  },
  'INVALID_DATE_RANGE': {
    httpStatus: 400,
    severity: 'low',
    logToSentry: false,
    includeDetails: true
  },
  'CAPACITY_EXCEEDED': {
    httpStatus: 409,
    severity: 'normal',
    logToSentry: false,
    includeDetails: true
  },
  'INSUFFICIENT_PERMISSIONS': {
    httpStatus: 403,
    severity: 'normal',
    logToSentry: true,
    includeDetails: false
  },
  'VALIDATION_ERROR': {
    httpStatus: 400,
    severity: 'low',
    logToSentry: false,
    includeDetails: true
  },
  'AVAILABILITY_SLOT_NOT_FOUND': {
    httpStatus: 404,
    severity: 'low',
    logToSentry: false,
    includeDetails: false
  },
  'HOLIDAY_NOT_FOUND': {
    httpStatus: 404,
    severity: 'low',
    logToSentry: false,
    includeDetails: false
  },
  'TIME_SLOT_CONFLICT': {
    httpStatus: 409,
    severity: 'normal',
    logToSentry: false,
    includeDetails: true
  },
  'INVALID_TIME_FORMAT': {
    httpStatus: 400,
    severity: 'low',
    logToSentry: false,
    includeDetails: true
  },
  'UNAUTHORIZED': {
    httpStatus: 401,
    severity: 'normal',
    logToSentry: true,
    includeDetails: false
  },
  'FORBIDDEN': {
    httpStatus: 403,
    severity: 'normal',
    logToSentry: true,
    includeDetails: false
  }
}

/**
 * Create standardized API error response
 */
export function createApiErrorResponse(
  code: SchedulingApiErrorCode,
  message: string,
  path: string,
  details?: any,
  customStatus?: number
): NextResponse<ApiErrorResponse> {
  const config = ERROR_CONFIGS[code]
  const status = customStatus || config?.httpStatus || 500
  const includeDetails = config?.includeDetails || false
  
  const errorResponse: ApiErrorResponse = {
    error: {
      code,
      message,
      details: includeDetails ? details : undefined
    },
    timestamp: new Date().toISOString(),
    path
  }
  
  // Log to Sentry if configured
  if (config?.logToSentry || status >= 500) {
    logErrorToSentry(code, message, path, details, config?.severity || 'normal')
  }
  
  // Log to console for development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[API Error] ${code}: ${message}`, {
      path,
      status,
      details
    })
  }
  
  return NextResponse.json(errorResponse, { status })
}

/**
 * Log error to Sentry with appropriate context
 */
function logErrorToSentry(
  code: SchedulingApiErrorCode,
  message: string,
  path: string,
  details?: any,
  severity: ErrorSeverity = 'normal'
) {
  Sentry.withScope((scope) => {
    scope.setTag('error_code', code)
    scope.setTag('api_path', path)
    scope.setLevel(mapSeverityToSentryLevel(severity))
    
    if (details) {
      scope.setContext('error_details', details)
    }
    
    scope.setContext('api_error', {
      code,
      path,
      timestamp: new Date().toISOString()
    })
    
    Sentry.captureException(new Error(`API Error: ${code} - ${message}`))
  })
}

/**
 * Map error severity to Sentry severity level
 */
function mapSeverityToSentryLevel(severity: ErrorSeverity): 'info' | 'warning' | 'error' | 'fatal' {
  switch (severity) {
    case 'low': return 'info'
    case 'normal': return 'warning'
    case 'high': return 'error'
    case 'critical': return 'fatal'
    default: return 'warning'
  }
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(
  error: ZodError,
  path: string,
  message: string = 'Validation failed'
): NextResponse<ApiErrorResponse> {
  const details = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }))
  
  return createApiErrorResponse(
    'VALIDATION_ERROR',
    message,
    path,
    details
  )
}

/**
 * Handle database errors
 */
export function handleDatabaseError(
  error: any,
  path: string,
  operation: string = 'database operation'
): NextResponse<ApiErrorResponse> {
  // Log full error to Sentry for investigation
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'database_error')
    scope.setTag('operation', operation)
    scope.setContext('database_error', {
      error: error?.message || 'Unknown database error',
      code: error?.code || 'UNKNOWN',
      path,
      operation
    })
    Sentry.captureException(error)
  })
  
  // Return generic error message to client
  return createApiErrorResponse(
    'VALIDATION_ERROR',
    `Failed to ${operation}`,
    path,
    undefined, // Don't expose database details
    500
  )
}

/**
 * Handle authentication errors (from session verification)
 */
export function handleAuthError(
  error: any,
  path: string
): NextResponse<ApiErrorResponse> {
  // Check if it's a redirect error (authentication required)
  if (error instanceof Error && error.message.includes('Redirect')) {
    return createApiErrorResponse(
      'UNAUTHORIZED',
      'Authentication required',
      path
    )
  }
  
  // Check for specific auth errors
  if (error?.message?.includes('insufficient')) {
    return createApiErrorResponse(
      'INSUFFICIENT_PERMISSIONS',
      'Insufficient permissions',
      path
    )
  }
  
  // Generic authentication error
  return createApiErrorResponse(
    'UNAUTHORIZED',
    'Authentication failed',
    path,
    undefined
  )
}

/**
 * Generic error handler for unexpected errors
 */
export function handleUnexpectedError(
  error: any,
  path: string,
  context: string = 'API request'
): NextResponse<ApiErrorResponse> {
  // Log to Sentry with full context
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'unexpected_error')
    scope.setTag('context', context)
    scope.setContext('unexpected_error', {
      error: error?.message || 'Unknown error',
      stack: error?.stack,
      path,
      context
    })
    Sentry.captureException(error)
  })
  
  // Return generic 500 error
  return createApiErrorResponse(
    'VALIDATION_ERROR',
    'Internal server error',
    path,
    undefined,
    500
  )
}

/**
 * High-level error handling middleware
 * Wraps API handlers to provide consistent error handling
 */
export function withErrorHandling<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const url = new URL(request.url)
    const path = url.pathname
    
    try {
      return await handler(request, ...args)
    } catch (error) {
      // Handle different types of errors
      if (error instanceof ZodError) {
        return handleZodError(error, path)
      }
      
      if (error instanceof Error && error.message.includes('Redirect')) {
        return handleAuthError(error, path)
      }
      
      // Handle database errors (check for common database error patterns)
      if (error?.code || error?.message?.includes('database') || error?.message?.includes('relation')) {
        return handleDatabaseError(error, path)
      }
      
      // Default to unexpected error
      return handleUnexpectedError(error, path)
    }
  }
}

/**
 * Create success response with consistent format
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json({
    data,
    timestamp: new Date().toISOString()
  }, { status })
}

/**
 * Create paginated success response
 */
export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
  }
): NextResponse {
  const totalPages = Math.ceil(pagination.total / pagination.limit)
  
  return NextResponse.json({
    data,
    pagination: {
      ...pagination,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrevious: pagination.page > 1
    },
    timestamp: new Date().toISOString()
  })
}