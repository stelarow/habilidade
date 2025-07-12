import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from './permissions'

/**
 * Server-side function to require admin access
 * Use in Server Components and Server Actions
 */
export async function requireAdmin() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      console.log('[REQUIRE_ADMIN] No user found, redirecting to login')
      redirect('/auth/login')
    }
    
    if (!isAdmin(user)) {
      console.log('[REQUIRE_ADMIN] User not admin, redirecting to dashboard')
      redirect('/dashboard')
    }
    
    console.log('[REQUIRE_ADMIN] Admin access verified for user:', user.id)
    return user
  } catch (error) {
    console.error('[REQUIRE_ADMIN] Error checking admin access:', error)
    redirect('/auth/login')
  }
}

/**
 * Server-side function to check admin access without redirect
 * Returns null if not admin, user object if admin
 */
export async function checkAdminAccess() {
  try {
    const user = await getCurrentUser()
    
    if (!user || !isAdmin(user)) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('[CHECK_ADMIN] Error checking admin access:', error)
    return null
  }
}