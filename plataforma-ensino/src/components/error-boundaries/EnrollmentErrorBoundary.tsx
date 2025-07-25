/**
 * Enrollment Error Boundary Component
 * Story 3.1: Teacher Enrollment Integration - Task 4
 * 
 * Provides graceful error handling for the enrollment flow
 * with user-friendly error messages and recovery options.
 */

'use client'

import React, { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'
import GradientButton from '@/components/ui/GradientButton'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
}

const MAX_RETRIES = 3

export class EnrollmentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Enrollment Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Report to Sentry or error tracking service
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      ;(window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        },
        tags: {
          component: 'EnrollmentErrorBoundary',
          feature: 'teacher-enrollment'
        }
      })
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < MAX_RETRIES) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    })
  }

  getErrorMessage(error: Error): string {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.'
    }
    
    if (message.includes('teacher') || message.includes('availability')) {
      return 'Erro ao carregar informações do professor. Tente novamente em alguns segundos.'
    }
    
    if (message.includes('calendar') || message.includes('schedule')) {
      return 'Erro ao carregar horários disponíveis. Recarregue a página.'
    }
    
    if (message.includes('validation') || message.includes('form')) {
      return 'Erro na validação dos dados. Verifique as informações e tente novamente.'
    }
    
    return 'Ocorreu um erro inesperado. Nossa equipe foi notificada.'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      const errorMessage = this.state.error 
        ? this.getErrorMessage(this.state.error)
        : 'Erro desconhecido'

      const canRetry = this.state.retryCount < MAX_RETRIES

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center space-y-6 border-red-500/50 bg-red-500/10 backdrop-blur-sm">
            <div className="flex justify-center">
              <div className="p-4 bg-red-500/20 rounded-full border border-red-500/50">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Ops! Algo deu errado
              </h2>
              <p className="text-gray-300 mb-4">
                {errorMessage}
              </p>
              
              {this.state.retryCount > 0 && (
                <p className="text-sm text-gray-400">
                  Tentativa {this.state.retryCount} de {MAX_RETRIES}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {canRetry && (
                <GradientButton 
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Tentar Novamente
                </GradientButton>
              )}

              <button
                onClick={this.handleReset}
                className="w-full px-4 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-white"
              >
                <Home className="w-4 h-4" />
                Voltar ao Início
              </button>

              <button
                onClick={() => window.location.href = 'mailto:suporte@escolahabilidade.com.br?subject=Erro na Matrícula'}
                className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contatar Suporte
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-300 mb-2">
                  Detalhes do Erro (Dev)
                </summary>
                <div className="bg-black/20 p-3 rounded text-xs font-mono overflow-auto max-h-32 border border-white/10">
                  <div className="mb-2">
                    <strong className="text-red-400">Error:</strong> <span className="text-gray-300">{this.state.error.message}</span>
                  </div>
                  <div className="mb-2">
                    <strong className="text-red-400">Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs text-gray-400">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong className="text-red-400">Component Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs text-gray-400">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default EnrollmentErrorBoundary