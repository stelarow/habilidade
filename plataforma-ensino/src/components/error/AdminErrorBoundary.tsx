'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends React.Component<AdminErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ADMIN_ERROR_BOUNDARY] Component error caught:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Send to Sentry in production
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
        tags: {
          section: 'admin',
          boundary: 'AdminErrorBoundary'
        }
      });
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.retry} />;
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Algo deu errado!
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400">
                Ocorreu um erro inesperado. Nossa equipe foi notificada.
              </p>

              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm">
                <p className="font-medium mb-2">Detalhes do erro:</p>
                <p className="text-gray-700 dark:text-gray-300 font-mono text-xs break-all">
                  {this.state.error?.message || 'Erro desconhecido'}
                </p>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium">Possível solução:</p>
                <p>Este erro pode estar relacionado à autenticação ou conexão. Tente limpar o cache do navegador.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.retry} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Tentar novamente
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Recarregar página
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/admin'}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Voltar ao Admin
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;