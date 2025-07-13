'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getRedirectUrlForCurrentUser } from '@/lib/auth/redirect-helpers'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const sessionId = Math.random().toString(36).substr(2, 9)
    
    const checkAuthStatus = async () => {
      try {
        console.log(`[AUTH-LAYOUT-${sessionId}] 🔍 Client-side auth check starting for: ${pathname}`)
        
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.log(`[AUTH-LAYOUT-${sessionId}] ❌ Error getting user:`, error.message)
          setShouldRender(true)
          return
        }

        if (user) {
          console.log(`[AUTH-LAYOUT-${sessionId}] ✅ User authenticated (ID: ${user.id})`)
          console.log(`[AUTH-LAYOUT-${sessionId}] 👤 User details:`, {
            email: user.email,
            role: user.user_metadata?.role || 'not_set',
            created_at: user.created_at
          })

          // Check if this is a restricted auth route
          const restrictedRoutes = ['/auth/login', '/auth/register']
          const isRestrictedRoute = restrictedRoutes.some(route => 
            pathname === route || pathname.startsWith(route + '/')
          )

          if (isRestrictedRoute) {
            console.log(`[AUTH-LAYOUT-${sessionId}] 🚫 Restricted route detected for authenticated user`)
            console.log(`[AUTH-LAYOUT-${sessionId}] 🎯 Getting redirect URL...`)
            
            try {
              const redirectUrl = await getRedirectUrlForCurrentUser()
              console.log(`[AUTH-LAYOUT-${sessionId}] ↗️ Redirecting to: ${redirectUrl}`)
              router.replace(redirectUrl)
              return
            } catch (redirectError) {
              console.error(`[AUTH-LAYOUT-${sessionId}] ❌ Error getting redirect URL:`, redirectError)
              console.log(`[AUTH-LAYOUT-${sessionId}] 🔄 Falling back to /dashboard`)
              router.replace('/dashboard')
              return
            }
          } else {
            console.log(`[AUTH-LAYOUT-${sessionId}] ℹ️ Non-restricted auth route: ${pathname}`)
          }
        } else {
          console.log(`[AUTH-LAYOUT-${sessionId}] 👤 No authenticated user found - allowing access`)
        }

        setShouldRender(true)
        
      } catch (error) {
        console.error(`[AUTH-LAYOUT-${sessionId}] ❌ Unexpected error in auth check:`, error)
        // Allow rendering on error to avoid blocking the page
        setShouldRender(true)
      } finally {
        setIsChecking(false)
        console.log(`[AUTH-LAYOUT-${sessionId}] ✅ Auth check completed`)
      }
    }

    checkAuthStatus()
  }, [router, pathname])

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Only render children if checks pass
  if (!shouldRender) {
    return null
  }

  return (
    <div className="auth-layout">
      {children}
    </div>
  );
}