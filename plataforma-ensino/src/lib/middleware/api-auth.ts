/**
 * API Authentication Middleware
 * 
 * Provides utilities for API route authentication and authorization
 * following existing project patterns and integrating with the session management
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import type { 
  ApiErrorResponse, 
  SchedulingApiErrorCode 
} from '@/types/api'

// Common authentication result type
export interface ApiAuthResult {
  isAuthenticated: boolean
  user: any | null
  profile: any | null
  error?: string
}

// Role-based authorization result
export interface ApiAuthzResult extends ApiAuthResult {
  hasRequiredRole: boolean
  roleError?: string
}

/**
 * Create standardized API error response
 */
export function createApiErrorResponse(
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
 * Middleware to verify API authentication
 * 
 * @param request - NextRequest object
 * @returns ApiAuthResult with user information or error
 */
export async function verifyApiAuthentication(request: NextRequest): Promise<ApiAuthResult> {
  try {
    const session = await verifySession()
    
    if (!session.isAuthenticated || !session.user || !session.profile) {
      return {
        isAuthenticated: false,
        user: null,
        profile: null,
        error: 'Authentication required'
      }
    }
    
    return {
      isAuthenticated: true,
      user: session.user,
      profile: session.profile
    }
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      profile: null,
      error: error instanceof Error ? error.message : 'Authentication failed'
    }
  }
}

/**
 * Middleware to verify role-based authorization
 * 
 * @param request - NextRequest object
 * @param requiredRole - Required role ('admin', 'instructor', 'student')
 * @returns ApiAuthzResult with authorization information
 */
export async function verifyApiAuthorization(
  request: NextRequest,
  requiredRole: 'admin' | 'instructor' | 'student'
): Promise<ApiAuthzResult> {
  const authResult = await verifyApiAuthentication(request)
  
  if (!authResult.isAuthenticated) {
    return {
      ...authResult,
      hasRequiredRole: false,
      roleError: 'Authentication required'
    }
  }
  
  const userRole = authResult.profile?.role
  
  // Check role hierarchy: admin > instructor > student
  let hasRequiredRole = false
  
  switch (requiredRole) {
    case 'student':
      hasRequiredRole = ['admin', 'instructor', 'student'].includes(userRole)
      break
    case 'instructor':
      hasRequiredRole = ['admin', 'instructor'].includes(userRole)
      break
    case 'admin':
      hasRequiredRole = userRole === 'admin'
      break
    default:
      hasRequiredRole = false
  }
  
  return {
    ...authResult,
    hasRequiredRole,
    roleError: hasRequiredRole ? undefined : `Insufficient permissions. Required: ${requiredRole}, Current: ${userRole}`
  }
}

/**
 * Middleware to check if user can manage teacher resources
 * 
 * @param request - NextRequest object  
 * @param teacherId - Teacher ID to check ownership
 * @returns ApiAuthzResult with ownership information
 */
export async function verifyTeacherResourceAccess(
  request: NextRequest,
  teacherId: string
): Promise<ApiAuthzResult> {
  const authResult = await verifyApiAuthentication(request)
  
  if (!authResult.isAuthenticated) {
    return {
      ...authResult,
      hasRequiredRole: false,
      roleError: 'Authentication required'
    }
  }
  
  const userRole = authResult.profile?.role
  
  // Admin can manage any teacher resources
  if (userRole === 'admin') {
    return {
      ...authResult,
      hasRequiredRole: true
    }
  }
  
  // Check if user is the teacher (owns the resource)
  try {
    const supabase = createClient()
    const { data: teacher } = await supabase
      .from('instructors')
      .select('user_id')
      .eq('id', teacherId)
      .single()
    
    if (!teacher) {
      return {
        ...authResult,
        hasRequiredRole: false,
        roleError: 'Teacher not found'
      }
    }
    
    const isOwner = teacher.user_id === authResult.user?.id
    
    return {
      ...authResult,
      hasRequiredRole: isOwner,
      roleError: isOwner ? undefined : 'You can only manage your own resources'
    }
  } catch (error) {
    return {
      ...authResult,
      hasRequiredRole: false,
      roleError: 'Failed to verify resource ownership'
    }
  }
}

/**
 * Higher-order function to wrap API handlers with admin-only authentication
 */
export function requireAdminApi<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const url = new URL(request.url)
    const authzResult = await verifyApiAuthorization(request, 'admin')
    
    if (!authzResult.hasRequiredRole) {
      const status = authzResult.isAuthenticated ? 403 : 401
      const code: SchedulingApiErrorCode = authzResult.isAuthenticated ? 'INSUFFICIENT_PERMISSIONS' : 'UNAUTHORIZED'
      
      return createApiErrorResponse(
        code,
        authzResult.roleError || 'Authentication required',
        status,
        url.pathname
      )
    }
    
    return handler(request, ...args)
  }
}

/**
 * Higher-order function to wrap API handlers with instructor/admin authentication
 */
export function requireInstructorApi<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const url = new URL(request.url)
    const authzResult = await verifyApiAuthorization(request, 'instructor')
    
    if (!authzResult.hasRequiredRole) {
      const status = authzResult.isAuthenticated ? 403 : 401
      const code: SchedulingApiErrorCode = authzResult.isAuthenticated ? 'INSUFFICIENT_PERMISSIONS' : 'UNAUTHORIZED'
      
      return createApiErrorResponse(
        code,
        authzResult.roleError || 'Authentication required',
        status,
        url.pathname
      )
    }
    
    return handler(request, ...args)
  }
}

/**
 * Higher-order function to wrap API handlers with teacher resource ownership validation
 */
export function requireTeacherResourceAccess<T extends any[]>(
  getTeacherId: (request: NextRequest, ...args: T) => string,
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const url = new URL(request.url)
    const teacherId = getTeacherId(request, ...args)
    const authzResult = await verifyTeacherResourceAccess(request, teacherId)
    
    if (!authzResult.hasRequiredRole) {
      const status = authzResult.isAuthenticated ? 403 : 401
      const code: SchedulingApiErrorCode = authzResult.isAuthenticated ? 'INSUFFICIENT_PERMISSIONS' : 'UNAUTHORIZED'
      
      return createApiErrorResponse(
        code,
        authzResult.roleError || 'Authentication required',
        status,
        url.pathname
      )
    }
    
    return handler(request, ...args)
  }
}

/**
 * Utility to validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Utility to validate date format (YYYY-MM-DD)
 */
export function isValidDateString(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) {
    return false
  }
  
  // Additional validation to ensure it's a valid date
  const date = new Date(dateString)
  return date.toISOString().substring(0, 10) === dateString
}

/**
 * Utility to validate time format (HH:MM)
 */
export function isValidTimeString(timeString: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(timeString)
}

/**
 * Simple authentication middleware
 * Alias for verifyApiAuthentication for backward compatibility
 */
export async function authMiddleware(request: NextRequest): Promise<{
  success: boolean
  error?: string
  user?: any
  profile?: any
}> {
  const result = await verifyApiAuthentication(request)
  return {
    success: result.isAuthenticated,
    error: result.error,
    user: result.user,
    profile: result.profile
  }
}