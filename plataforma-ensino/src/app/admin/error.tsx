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
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Admin error boundary caught:', error)
    
    // Report to Sentry
    Sentry.captureException(error, {
      tags: {
        section: 'admin',
        errorBoundary: true
      },
      extra: {
        digest: error.digest,
        message: error.message,
        stack: error.stack
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
        
        {/* Show error details in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-900 rounded border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Detalhes do erro:</p>
            <p className="text-xs text-red-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
        
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
          <a
            href="/admin"
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-center"
          >
            Voltar ao Admin
          </a>
        </div>
      </div>
    </div>
  )
}