/**
 * API Response Helper Utilities
 * Centralized response creation for consistent API patterns
 */

import { NextResponse } from 'next/server'
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  SchedulingApiErrorCode
} from '@/types/api'

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  code: SchedulingApiErrorCode,
  message: string,
  status: number,
  path: string,
  details?: any
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({
    error: {
      code,
      message,
      details
    },
    timestamp: new Date().toISOString(),
    path
  }, { status })
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    data,
    timestamp: new Date().toISOString()
  }, { status })
}

/**
 * Creates a paginated success response (for future use)
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    hasNext: boolean
    hasPrev: boolean
  }
  timestamp: string
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse<PaginatedResponse<T>> {
  const hasNext = (page * limit) < total
  const hasPrev = page > 1

  return NextResponse.json({
    data,
    pagination: {
      total,
      page,
      limit,
      hasNext,
      hasPrev
    },
    timestamp: new Date().toISOString()
  })
}

/**
 * Common error responses for consistency
 */
export const CommonErrors = {
  DATABASE_UNAVAILABLE: (path: string) => 
    createErrorResponse('VALIDATION_ERROR', 'Database unavailable', 503, path),
  
  UNAUTHORIZED: (path: string) => 
    createErrorResponse('UNAUTHORIZED', 'Authentication required', 401, path),
  
  INVALID_UUID: (path: string) => 
    createErrorResponse('VALIDATION_ERROR', 'Invalid ID format', 400, path),
  
  NOT_FOUND: (resource: string, path: string) => 
    createErrorResponse('HOLIDAY_NOT_FOUND', `${resource} not found`, 404, path),
  
  INTERNAL_ERROR: (path: string) => 
    createErrorResponse('VALIDATION_ERROR', 'Internal server error', 500, path)
} as const