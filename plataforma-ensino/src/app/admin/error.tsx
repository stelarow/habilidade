'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Handle hard refresh for server component errors
  const handleHardRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Admin error boundary caught:', error)
    
    // Enhanced error logging for SSR issues
    console.error('Error details:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    })
    
    // Report to Sentry with enhanced context
    Sentry.captureException(error, {
      tags: {
        section: 'admin',
        errorBoundary: true,
        errorType: error.digest ? 'server-component' : 'client-component',
        digest: error.digest || 'no-digest'
      },
      contexts: {
        serverComponent: {
          hasDigest: !!error.digest,
          digestValue: error.digest,
          possibleHydrationError: error.digest === '4010231887'
        }
      },
      extra: {
        digest: error.digest,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown'
      }
    })
  }, [error])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-red-400 mb-4">
          Algo deu errado!
        </h2>
        <p className="text-gray-300 mb-6">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>
        
        {/* Show error details in development or if digest indicates server component error */}
        {(process.env.NODE_ENV === 'development' || error.digest) && (
          <div className="mb-6 p-4 bg-gray-900 rounded border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Detalhes do erro:</p>
            <p className="text-xs text-red-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <>
                <p className="text-xs text-gray-500 mt-2">
                  Digest: {error.digest}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Erro de Server Component - verifique a hidratação de dados
                </p>
              </>
            )}
            {process.env.NODE_ENV === 'development' && error.stack && (
              <details className="mt-2">
                <summary className="text-xs text-gray-400 cursor-pointer">Stack Trace</summary>
                <pre className="text-xs text-gray-500 mt-1 overflow-auto max-h-32">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => reset()}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Tentar novamente
          </button>
          {error.digest && (
            <button
              onClick={handleHardRefresh}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Recarregar página
            </button>
          )}
          <a
            href="/admin"
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-center text-sm"
          >
            Voltar ao Admin
          </a>
        </div>
        
        {error.digest === '4010231887' && (
          <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded text-xs text-yellow-200">
            <p className="font-medium">Possível solução:</p>
            <p>Este erro pode estar relacionado à hidratação de Server Components. Tente limpar o cache do navegador.</p>
          </div>
        )}
      </div>
    </div>
  )
}