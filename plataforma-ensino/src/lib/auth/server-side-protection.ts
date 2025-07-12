import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * 🔒 CRITICAL SERVER-SIDE PROTECTION
 * 
 * This function MUST be called at the beginning of every admin page/component
 * to ensure server-side security before any content is rendered.
 * 
 * @param redirectTo - Where to redirect non-authenticated users (default: '/auth/login')
 * @param requireRole - Required role for access (default: 'admin')
 * @returns User profile if access is granted, otherwise redirects
 */
export async function requireServerSideAdminAccess(
  redirectTo: string = '/auth/login',
  requireRole: string = 'admin'
) {
  const protectionId = Math.random().toString(36).substr(2, 9)
  console.log(`[SERVER_PROTECTION-${protectionId}] 🔒🔒🔒 CRITICAL SERVER-SIDE SECURITY CHECK STARTING 🔒🔒🔒`)
  
  try {
    const supabase = createClient()
    console.log(`[SERVER_PROTECTION-${protectionId}] Supabase client created`)

    // Check user authentication
    console.log(`[SERVER_PROTECTION-${protectionId}] 🛡️ EXECUTING MANDATORY AUTH CHECK...`)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log(`[SERVER_PROTECTION-${protectionId}] Auth check result:`, {
      hasUser: !!user,
      userId: user?.id,
      userError: userError?.message,
      requiredRole: requireRole
    })

    // BLOCK: No user or auth error
    if (!user || userError) {
      console.log(`[SERVER_PROTECTION-${protectionId}] 🚨 SECURITY BLOCK: No authenticated user - REDIRECTING TO ${redirectTo}`)
      redirect(redirectTo)
    }

    // Check user role in database
    console.log(`[SERVER_PROTECTION-${protectionId}] 🔍 Checking user role for: ${user.id}`)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role, full_name, email, id, created_at, updated_at')
      .eq('id', user.id)
      .single()

    console.log(`[SERVER_PROTECTION-${protectionId}] Profile check result:`, {
      hasProfile: !!profile,
      role: profile?.role,
      email: profile?.email,
      profileError: profileError?.message
    })

    // BLOCK: No profile or profile fetch error
    if (profileError || !profile) {
      console.log(`[SERVER_PROTECTION-${protectionId}] 🚨 SECURITY BLOCK: Profile not found or error - REDIRECTING TO ${redirectTo}`)
      redirect(redirectTo)
    }

    // BLOCK: User does not have required role
    if (profile.role !== requireRole) {
      const fallbackRedirect = profile.role === 'student' ? '/dashboard' : '/'
      console.log(`[SERVER_PROTECTION-${protectionId}] 🚨 SECURITY BLOCK: User role '${profile.role}' != required '${requireRole}' - REDIRECTING TO ${fallbackRedirect}`)
      redirect(fallbackRedirect)
    }

    // SUCCESS: Access granted
    console.log(`[SERVER_PROTECTION-${protectionId}] ✅ ACCESS GRANTED for user: ${profile.email} (${profile.role})`)
    console.log(`[SERVER_PROTECTION-${protectionId}] 🔒🔒🔒 SECURITY CHECK PASSED - RETURNING USER PROFILE 🔒🔒🔒`)

    return {
      user,
      profile,
      isAuthenticated: true,
      hasRequiredRole: true
    }

  } catch (error) {
    console.error(`[SERVER_PROTECTION-${protectionId}] 💥 CRITICAL ERROR in security check:`, error)
    console.log(`[SERVER_PROTECTION-${protectionId}] 🚨 SECURITY BLOCK: Error in auth check - REDIRECTING TO ${redirectTo}`)
    redirect(redirectTo)
  }
}

/**
 * 🔒 QUICK ADMIN CHECK
 * 
 * Simplified version for admin-only pages
 */
export async function requireAdmin() {
  return requireServerSideAdminAccess('/auth/login', 'admin')
}

/**
 * 🔒 INSTRUCTOR OR ADMIN CHECK
 * 
 * For pages that allow both instructors and admins
 */
export async function requireInstructorOrAdmin() {
  const protectionId = Math.random().toString(36).substr(2, 9)
  console.log(`[SERVER_PROTECTION-${protectionId}] 🔒 Checking for instructor or admin access...`)
  
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (!user || userError) {
      console.log(`[SERVER_PROTECTION-${protectionId}] 🚨 No user - redirecting to login`)
      redirect('/auth/login')
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role, full_name, email, id, created_at, updated_at')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.log(`[SERVER_PROTECTION-${protectionId}] 🚨 Profile error - redirecting to login`)
      redirect('/auth/login')
    }

    if (profile.role !== 'admin' && profile.role !== 'instructor') {
      console.log(`[SERVER_PROTECTION-${protectionId}] 🚨 Insufficient role: ${profile.role}`)
      redirect('/dashboard')
    }

    console.log(`[SERVER_PROTECTION-${protectionId}] ✅ Access granted for ${profile.role}`)
    return { user, profile }

  } catch (error) {
    console.error(`[SERVER_PROTECTION-${protectionId}] Error:`, error)
    redirect('/auth/login')
  }
}

/**
 * 🔒 AUTHENTICATED USER CHECK
 * 
 * For pages that just need any authenticated user
 */
export async function requireAuthentication() {
  return requireServerSideAdminAccess('/auth/login', 'student') // Will allow student, instructor, or admin
}