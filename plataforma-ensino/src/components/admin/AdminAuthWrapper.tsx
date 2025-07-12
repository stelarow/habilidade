'use client'

import { Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import Loading from '@/components/ui/Loading'

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <Loading />
        </div>
      }
    >
      <ProtectedRoute
        role="admin"
        permission="admin.view"
        redirectTo="/auth/login"
        fallback={
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Acesso Restrito
              </h1>
              <p className="text-gray-400 mb-6 max-w-md">
                Esta área é restrita apenas para administradores do sistema.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Se você é um administrador, faça login com suas credenciais.
                </p>
                <div className="flex gap-4 justify-center">
                  <a
                    href="/auth/login"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Fazer Login
                  </a>
                  <a
                    href="/"
                    className="border border-gray-600 hover:border-gray-500 text-gray-300 px-6 py-2 rounded-lg transition-colors"
                  >
                    Página Inicial
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
      >
        {children}
      </ProtectedRoute>
    </Suspense>
  )
}