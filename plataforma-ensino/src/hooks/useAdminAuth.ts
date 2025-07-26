'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUserClient, isAdmin, canAccessAdminPanel } from '@/lib/auth/permissions-client'
import type { User } from '@/types'

interface AdminAuthState {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  hasAdminAccess: boolean
  error: string | null
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isLoading: true,
    isAdmin: false,
    hasAdminAccess: false,
    error: null
  })
  
  const router = useRouter()

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))
        
        const user = await getCurrentUserClient()
        
        if (!user) {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'Usuário não autenticado' 
          }))
          router.push('/auth/login')
          return
        }

        const userIsAdmin = isAdmin(user)
        const hasAccess = canAccessAdminPanel(user)

        if (!userIsAdmin || !hasAccess) {
          setState(prev => ({ 
            ...prev, 
            user,
            isLoading: false, 
            error: 'Acesso negado: privilégios de administrador necessários' 
          }))
          router.push('/dashboard')
          return
        }

        setState({
          user,
          isLoading: false,
          isAdmin: userIsAdmin,
          hasAdminAccess: hasAccess,
          error: null
        })

      } catch (error) {
        logError('[useAdminAuth] Error:', error)
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Erro de autenticação' 
        }))
        router.push('/auth/login')
      }
    }

    checkAdminAuth()
  }, [router])

  const refreshAuth = async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const user = await getCurrentUserClient()
      
      if (user && isAdmin(user)) {
        setState(prev => ({
          ...prev,
          user,
          isLoading: false,
          isAdmin: true,
          hasAdminAccess: canAccessAdminPanel(user),
          error: null
        }))
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          isLoading: false,
          isAdmin: false,
          hasAdminAccess: false,
          error: 'Sessão expirada'
        }))
        router.push('/auth/login')
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar autenticação'
      }))
    }
  }

  return {
    ...state,
    refreshAuth
  }
}