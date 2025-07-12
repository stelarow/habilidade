'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUserClient, hasPermission, Permission } from '../../lib/auth/permissions-client'
import { User } from '@/types'
import Loading from '@/components/ui/Loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  permission?: Permission
  role?: string
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  permission,
  role,
  fallback,
  redirectTo = '/dashboard'
}: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      try {
        console.log('[PROTECTED_ROUTE] Starting access check...')
        const currentUser = await getCurrentUserClient()
        console.log('[PROTECTED_ROUTE] User:', { hasUser: !!currentUser, role: currentUser?.role })
        setUser(currentUser)

        if (!currentUser) {
          console.log('[PROTECTED_ROUTE] No user found - redirecting to login')
          setHasAccess(false)
          router.push('/auth/login')
          return
        }

        // Check role if specified
        if (role && currentUser.role !== role) {
          console.log('[PROTECTED_ROUTE] Role mismatch:', { required: role, actual: currentUser.role })
          setHasAccess(false)
          if (redirectTo) {
            router.push(redirectTo)
          }
          return
        }

        // Check permission if specified
        if (permission && !hasPermission(currentUser, permission)) {
          console.log('[PROTECTED_ROUTE] Permission denied:', { permission, userRole: currentUser.role })
          setHasAccess(false)
          if (redirectTo) {
            router.push(redirectTo)
          }
          return
        }

        console.log('[PROTECTED_ROUTE] Access granted')
        setHasAccess(true)
      } catch (error) {
        console.error('[PROTECTED_ROUTE] Error checking access:', error)
        setHasAccess(false)
        if (redirectTo) {
          router.push(redirectTo)
        }
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [permission, role, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Negado</h1>
          <p className="text-gray-400 mb-6">
            Você não tem permissão para acessar esta página.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}