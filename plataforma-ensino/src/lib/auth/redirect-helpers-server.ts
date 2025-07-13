/**
 * 🎯 SERVER-SIDE ROLE-BASED REDIRECT UTILITIES
 * 
 * Server-side utilities for determining post-authentication redirect destinations
 * based on user roles. Only for use in server components, API routes, and middleware.
 */

import { createClient } from '@/lib/supabase/server'
import { getRedirectUrlForRole } from './redirect-helpers'

/**
 * SERVER-SIDE: Get redirect URL for currently authenticated user
 * For use in server components, API routes, and middleware
 */
export async function getRedirectUrlForCurrentUserServer(): Promise<string> {
  const redirectId = Math.random().toString(36).substr(2, 9)
  console.log(`[SERVER_REDIRECT-${redirectId}] 🎯 Determining redirect URL for current user (server)`)

  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log(`[SERVER_REDIRECT-${redirectId}] ⚠️ No authenticated user, defaulting to login`)
      return '/auth/login'
    }

    console.log(`[SERVER_REDIRECT-${redirectId}] 👤 User found: ${user.id}`)

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role, email, full_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.log(`[SERVER_REDIRECT-${redirectId}] ⚠️ Profile not found, defaulting to dashboard`)
      return '/dashboard'
    }

    const redirectUrl = getRedirectUrlForRole(profile.role)
    console.log(`[SERVER_REDIRECT-${redirectId}] ✅ Role: ${profile.role} → Redirect: ${redirectUrl}`)
    
    return redirectUrl

  } catch (error) {
    console.error(`[SERVER_REDIRECT-${redirectId}] 💥 Error determining redirect:`, error)
    return '/dashboard'
  }
}