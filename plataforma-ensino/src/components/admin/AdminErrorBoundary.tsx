'use client';

import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showReportButton?: boolean;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isReporting: boolean;
}

export class AdminErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isReporting: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      logError('Admin Error Boundary caught an error:', error, errorInfo);
    }

    // Report error to external service (e.g., Sentry)
    this.props.onError?.(error, errorInfo);

    // Report to Sentry if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        },
        tags: {
          component: this.props.componentName || 'AdminComponent',
          section: 'admin-interface'
        }
      });
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isReporting: false
    });
  };

  handleReportError = async () => {
    this.setState({ isReporting: true });
    
    try {
      // Send error report to backend
      await fetch('/api/admin/error-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            message: this.state.error?.message,
            stack: this.state.error?.stack,
            name: this.state.error?.name
          },
          errorInfo: this.state.errorInfo,
          component: this.props.componentName,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
    } catch (reportError) {
      logError('Failed to report error:', reportError);
    } finally {
      this.setState({ isReporting: false });
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div 
          className="min-h-[400px] flex items-center justify-center p-8"
          role="alert"
          aria-live="assertive"
        >
          <Card className="max-w-2xl w-full p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Algo deu errado
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {this.props.componentName 
                    ? `Ocorreu um erro no componente ${this.props.componentName}.`
                    : 'Ocorreu um erro inesperado na interface de administração.'
                  }
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="w-full max-w-lg">
                  <details className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                      Detalhes do erro (desenvolvimento)
                    </summary>
                    <div className="mt-2 text-xs font-mono text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
                      <div className="mb-2">
                        <strong>Erro:</strong> {this.state.error.message}
                      </div>
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {this.state.retryCount < this.maxRetries && (
                  <Button
                    onClick={this.handleRetry}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Tentar Novamente
                    {this.state.retryCount > 0 && (
                      <span className="text-xs">
                        ({this.state.retryCount}/{this.maxRetries})
                      </span>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/admin'}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Voltar ao Dashboard
                </Button>

                {this.props.showReportButton && (
                  <Button
                    variant="outline"
                    onClick={this.handleReportError}
                    disabled={this.state.isReporting}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {this.state.isReporting ? 'Reportando...' : 'Reportar Erro'}
                  </Button>
                )}
              </div>

              {this.state.retryCount >= this.maxRetries && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Múltiplas tentativas falharam. Por favor, recarregue a página ou entre em contato com o suporte.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="mt-2"
                  >
                    Recarregar Página
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withAdminErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    componentName?: string;
    showReportButton?: boolean;
    fallback?: ReactNode;
  } = {}
) {
  const WrappedComponent = (props: P) => (
    <AdminErrorBoundary
      componentName={options.componentName}
      showReportButton={options.showReportButton}
      fallback={options.fallback}
    >
      <Component {...props} />
    </AdminErrorBoundary>
  );

  WrappedComponent.displayName = `withAdminErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Specific error boundary for form components
export function AdminFormErrorBoundary({ 
  children, 
  onError,
  formName 
}: {
  children: ReactNode;
  onError?: (error: Error) => void;
  formName?: string;
}) {
  return (
    <AdminErrorBoundary
      componentName={formName ? `${formName} Form` : 'Admin Form'}
      onError={onError}
      showReportButton={true}
      fallback={
        <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Erro no Formulário</span>
          </div>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            Ocorreu um erro ao carregar o formulário. Por favor, recarregue a página.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Recarregar
          </Button>
        </div>
      }
    >
      {children}
    </AdminErrorBoundary>
  );
}

export default AdminErrorBoundary;