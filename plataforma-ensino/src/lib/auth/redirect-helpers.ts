/**
 * 🎯 ROLE-BASED REDIRECT UTILITIES
 * 
 * Utilities for determining post-authentication redirect destinations
 * based on user roles and providing consistent redirect behavior
 * across the application.
 */

import { createClient } from '@/lib/supabase/client'

/**
 * Get redirect URL based on user role
 * @param role - User role ('admin', 'instructor', 'student')
 * @returns Appropriate dashboard URL for the role
 */
export function getRedirectUrlForRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'instructor':
      return '/dashboard' // Instructors use regular dashboard for now
    case 'student':
    default:
      return '/dashboard'
  }
}

/**
 * CLIENT-SIDE: Get redirect URL for currently authenticated user
 * For use in client components after successful authentication
 */
export async function getRedirectUrlForCurrentUser(): Promise<string> {
  const redirectId = Math.random().toString(36).substr(2, 9)
  console.log(`[CLIENT_REDIRECT-${redirectId}] 🎯 Determining redirect URL for current user`)

  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log(`[CLIENT_REDIRECT-${redirectId}] ⚠️ No authenticated user, defaulting to login`)
      return '/auth/login'
    }

    console.log(`[CLIENT_REDIRECT-${redirectId}] 👤 User found: ${user.id}`)

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role, email, full_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.log(`[CLIENT_REDIRECT-${redirectId}] ⚠️ Profile not found, defaulting to dashboard`)
      return '/dashboard'
    }

    const redirectUrl = getRedirectUrlForRole(profile.role)
    console.log(`[CLIENT_REDIRECT-${redirectId}] ✅ Role: ${profile.role} → Redirect: ${redirectUrl}`)
    
    return redirectUrl

  } catch (error) {
    console.error(`[CLIENT_REDIRECT-${redirectId}] 💥 Error determining redirect:`, error)
    return '/dashboard'
  }
}


/**
 * ROLE HIERARCHY DEFINITIONS
 * 
 * Defines access levels and redirect priorities for different user roles
 */
export const ROLE_HIERARCHY = {
  admin: {
    level: 3,
    defaultRedirect: '/admin',
    allowedRoutes: ['/admin', '/dashboard', '/courses', '/profile']
  },
  instructor: {
    level: 2,
    defaultRedirect: '/dashboard',
    allowedRoutes: ['/dashboard', '/courses', '/profile']
  },
  student: {
    level: 1,
    defaultRedirect: '/dashboard',
    allowedRoutes: ['/dashboard', '/courses', '/profile', '/progress']
  }
} as const

/**
 * Check if user role has access to a specific route
 * @param userRole - User's role
 * @param route - Route to check access for
 * @returns Whether user has access to the route
 */
export function hasRouteAccess(userRole: string, route: string): boolean {
  const roleConfig = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY]
  if (!roleConfig) return false
  
  return roleConfig.allowedRoutes.some(allowedRoute => 
    route.startsWith(allowedRoute)
  )
}