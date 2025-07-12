import { createClient } from '@/lib/supabase/server'
import { User, AuthError } from '@supabase/supabase-js'
import { cache } from 'react'

/**
 * 🔒 CENTRALIZED SESSION MANAGEMENT
 * 
 * This module provides a unified interface for session verification across 
 * middleware, Server Components, and other server-side code.
 * 
 * Based on Next.js best practices:
 * - Server Components call verifySession() directly
 * - Middleware uses lightweight verification for redirects
 * - No dependency on headers for session data
 */

export interface UserProfile {
  id: string
  email: string
  role: 'admin' | 'instructor' | 'student'
  full_name: string | null
  created_at: string
  updated_at: string
  last_login?: string
}

export interface SessionResult {
  user: User | null
  profile: UserProfile | null
  isAuthenticated: boolean
  error?: string
}

export interface AuthorizedSessionResult extends SessionResult {
  user: User
  profile: UserProfile
  isAuthenticated: true
  hasRequiredRole: true
}

/**
 * 🔍 VERIFY SESSION (Cached)
 * 
 * Verifies user session and fetches profile from database.
 * Results are cached per request to avoid duplicate database calls.
 * 
 * @returns SessionResult with user and profile data
 */
export const verifySession = cache(async (): Promise<SessionResult> => {
  const sessionId = Math.random().toString(36).substr(2, 9)
  console.log(`[SESSION-${sessionId}] 🔍 Verifying session...`)
  
  try {
    const supabase = createClient()
    
    // Get authenticated user
    console.log(`[SESSION-${sessionId}] Checking authentication...`)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log(`[SESSION-${sessionId}] ❌ No authenticated user:`, authError?.message)
      return {
        user: null,
        profile: null,
        isAuthenticated: false,
        error: authError?.message || 'No authenticated user'
      }
    }

    console.log(`[SESSION-${sessionId}] ✅ User authenticated: ${user.id}`)

    // Fetch user profile
    console.log(`[SESSION-${sessionId}] Fetching user profile...`)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, role, full_name, created_at, updated_at, last_login')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.log(`[SESSION-${sessionId}] ❌ Profile fetch failed:`, profileError?.message)
      return {
        user,
        profile: null,
        isAuthenticated: true,
        error: profileError?.message || 'Profile not found'
      }
    }

    console.log(`[SESSION-${sessionId}] ✅ Session verified: ${profile.email} (${profile.role})`)
    
    return {
      user,
      profile,
      isAuthenticated: true
    }

  } catch (error) {
    console.error(`[SESSION-${sessionId}] 💥 Session verification error:`, error)
    return {
      user: null,
      profile: null,
      isAuthenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})

/**
 * 🛡️ VERIFY SESSION WITH ROLE
 * 
 * Verifies session and checks if user has required role.
 * Throws redirect errors for unauthorized access.
 * 
 * @param requiredRole - Required role for access
 * @returns AuthorizedSessionResult if authorized
 * @throws Redirect error if unauthorized
 */
export async function verifySessionWithRole(
  requiredRole: 'admin' | 'instructor' | 'student' = 'admin'
): Promise<AuthorizedSessionResult> {
  const sessionId = Math.random().toString(36).substr(2, 9)
  console.log(`[SESSION_ROLE-${sessionId}] 🔒 Verifying session with role: ${requiredRole}`)
  
  const session = await verifySession()
  
  // Check authentication and profile
  if (!session.isAuthenticated || !session.user || !session.profile) {
    console.log(`[SESSION_ROLE-${sessionId}] ❌ Not authenticated or missing profile, redirecting to login`)
    const { redirect } = await import('next/navigation')
    redirect('/auth/login')
    throw new Error('Redirect to login') // Never executes but tells TypeScript execution stops
  }

  // TypeScript guard clause: ensure profile exists (redundant but explicit)
  if (!session.profile) {
    console.log(`[SESSION_ROLE-${sessionId}] ❌ Profile verification failed`)
    const { redirect } = await import('next/navigation')
    redirect('/auth/login')
    throw new Error('Redirect to login') // Never executes but tells TypeScript execution stops
  }

  if (session.profile.role !== requiredRole && !(requiredRole === 'student' && ['instructor', 'admin'].includes(session.profile.role))) {
    console.log(`[SESSION_ROLE-${sessionId}] ❌ Insufficient role: ${session.profile.role} (required: ${requiredRole})`)
    
    // Smart redirect based on user role
    const { redirect } = await import('next/navigation')
    const fallbackUrl = session.profile.role === 'student' ? '/dashboard' : '/'
    redirect(fallbackUrl)
    throw new Error('Redirect to fallback') // Never executes but tells TypeScript execution stops
  }

  console.log(`[SESSION_ROLE-${sessionId}] ✅ Authorization granted: ${session.profile.email} (${session.profile.role})`)
  
  return {
    user: session.user,
    profile: session.profile,
    isAuthenticated: true,
    hasRequiredRole: true
  }
}

/**
 * 🔧 LIGHTWEIGHT SESSION CHECK
 * 
 * Quick authentication check for middleware.
 * Only verifies authentication, doesn't fetch profile.
 * 
 * @returns boolean indicating if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    return !error && !!user
  } catch {
    return false
  }
}

/**
 * 🔧 LIGHTWEIGHT ROLE CHECK
 * 
 * Quick role verification for middleware.
 * Used for basic route protection before full verification.
 * 
 * @param requiredRole - Required role to check
 * @returns boolean indicating if user has required role
 */
export async function hasRole(requiredRole: 'admin' | 'instructor' | 'student'): Promise<boolean> {
  try {
    const supabase = createClient()
    
    // Quick auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return false

    // Quick profile check
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) return false

    // Check role hierarchy: admin > instructor > student
    if (requiredRole === 'student') {
      return ['admin', 'instructor', 'student'].includes(profile.role)
    }
    if (requiredRole === 'instructor') {
      return ['admin', 'instructor'].includes(profile.role)
    }
    if (requiredRole === 'admin') {
      return profile.role === 'admin'
    }

    return false
  } catch {
    return false
  }
}

/**
 * 🚀 ADMIN ACCESS SHORTCUT
 * 
 * Convenience function for admin-only pages.
 * Equivalent to verifySessionWithRole('admin').
 */
export async function requireAdmin(): Promise<AuthorizedSessionResult> {
  return verifySessionWithRole('admin')
}

/**
 * 🚀 INSTRUCTOR OR ADMIN ACCESS
 * 
 * Convenience function for instructor/admin pages.
 */
export async function requireInstructorOrAdmin(): Promise<AuthorizedSessionResult> {
  const session = await verifySession()
  
  if (!session.isAuthenticated || !session.user || !session.profile) {
    const { redirect } = await import('next/navigation')
    redirect('/auth/login')
    // This part will not be reached, but it helps TypeScript understand
    // that execution stops here, preventing it from thinking session.user
    // or session.profile could be null in the code that follows.
    throw new Error("Redirecting to login");
  }

  // Explicitly check for profile to satisfy TypeScript's null-safety checks
  if (!session.profile) {
    const { redirect } = await import('next/navigation');
    redirect('/auth/login');
    throw new Error("Redirecting to login due to missing profile");
  }

  if (!['admin', 'instructor'].includes(session.profile.role)) {
    const { redirect } = await import('next/navigation')
    redirect('/dashboard')
    // Similarly, ensure TypeScript knows execution stops here.
    throw new Error("Redirecting to dashboard due to insufficient role");
  }

  return {
    user: session.user,
    profile: session.profile,
    isAuthenticated: true,
    hasRequiredRole: true
  }
}