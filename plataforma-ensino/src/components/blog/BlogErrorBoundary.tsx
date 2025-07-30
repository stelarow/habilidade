'use client';

import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface BlogErrorBoundaryProps {
  children: ReactNode;
  fallbackType?: 'post' | 'list' | 'category' | 'search' | 'generic';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showErrorDetails?: boolean;
}

export interface BlogErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

export interface BlogErrorContext {
  pageType: string;
  postId?: string;
  categoryId?: string;
  searchQuery?: string;
  userAgent: string;
  timestamp: Date;
  url: string;
}

export class BlogErrorBoundary extends Component<BlogErrorBoundaryProps, BlogErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: BlogErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<BlogErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo
    });

    this.logError(error, errorInfo);
    this.reportToSentry(error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private logError = (error: Error, errorInfo: React.ErrorInfo) => {
    const context: BlogErrorContext = {
      pageType: this.props.fallbackType || 'generic',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    console.error('Blog Error Boundary caught an error:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo,
      context
    });

    // Integrate with our error logger
    import('@/lib/blog/errorLogger').then(({ blogErrorLogger }) => {
      blogErrorLogger.logError(error, context);
    }).catch(console.error);
  };

  private reportToSentry = (error: Error, errorInfo: React.ErrorInfo) => {
    // Sentry integration would go here
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        },
        tags: {
          component: 'BlogErrorBoundary',
          fallbackType: this.props.fallbackType || 'generic'
        }
      });
    }
  };

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private renderFallback = () => {
    const { fallbackType = 'generic' } = this.props;
    const { error, retryCount } = this.state;

    const maxRetries = 3;
    const canRetry = retryCount < maxRetries;

    switch (fallbackType) {
      case 'post':
        return this.renderPostFallback(canRetry);
      case 'list':
        return this.renderListFallback(canRetry);
      case 'category':
        return this.renderCategoryFallback(canRetry);
      case 'search':
        return this.renderSearchFallback(canRetry);
      default:
        return this.renderGenericFallback(canRetry);
    }
  };

  private renderPostFallback = (canRetry: boolean) => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Conte�do Temporariamente Indispon�vel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              Estamos enfrentando uma dificuldade t�cnica ao carregar este artigo. 
              Nossa equipe foi notificada e est� trabalhando para resolver o problema.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <p className="text-gray-600 text-center">
              Enquanto isso, voc� pode:
            </p>
            
            <div className="grid gap-3">
              {canRetry && (
                <Button 
                  onClick={this.handleRetry} 
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}
              
              <Button 
                onClick={this.handleReload}
                variant="outline" 
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar P�gina
              </Button>
              
              <Button 
                onClick={() => window.history.back()}
                variant="outline" 
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500 mb-2">
              Problema persistindo?
            </p>
            <Button variant="ghost" size="sm" className="text-purple-600">
              <Mail className="w-4 h-4 mr-2" />
              Reportar Problema
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  private renderListFallback = (canRetry: boolean) => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              Lista Temporariamente Indispon�vel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Estamos tendo dificuldades para carregar a lista completa de artigos. 
                Algumas funcionalidades podem estar limitadas.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3 mt-4 justify-center">
              {canRetry && (
                <Button onClick={this.handleRetry} size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}
              <Button onClick={this.handleReload} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fallback content - would show popular posts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="opacity-50">
              <CardHeader>
                <div className="w-full h-32 bg-gray-200 rounded-md animate-pulse"></div>
                <CardTitle className="text-sm">Artigo em destaque #{i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Conte�do temporariamente indispon�vel...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  private renderCategoryFallback = (canRetry: boolean) => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              Categoria Temporariamente Indispon�vel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Esta categoria est� temporariamente indispon�vel. 
                Explore outras categorias enquanto resolvemos o problema.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3 mt-4 justify-center">
              {canRetry && (
                <Button onClick={this.handleRetry} size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}
              <Button onClick={() => window.history.back()} variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Explorar Outras Categorias
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  private renderSearchFallback = (canRetry: boolean) => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              Busca Temporariamente Indispon�vel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                O sistema de busca est� temporariamente indispon�vel. 
                Tente novamente em alguns minutos ou explore nossos artigos em destaque.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3 mt-4 justify-center">
              {canRetry && (
                <Button onClick={this.handleRetry} size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}
              <Button onClick={() => window.history.back()} variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Ver Artigos em Destaque
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  private renderGenericFallback = (canRetry: boolean) => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Oops! Algo deu errado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              Encontramos um problema t�cnico. Nossa equipe foi notificada 
              e est� trabalhando para resolver rapidamente.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            {canRetry && (
              <Button onClick={this.handleRetry} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            )}
            
            <Button onClick={this.handleReload} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recarregar P�gina
            </Button>
            
            <Button onClick={() => window.history.back()} variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao In�cio
            </Button>
          </div>

          {this.props.showErrorDetails && this.state.error && (
            <details className="text-xs bg-gray-50 p-3 rounded">
              <summary className="cursor-pointer text-gray-600 mb-2">
                Detalhes t�cnicos
              </summary>
              <pre className="whitespace-pre-wrap text-red-600">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

export default BlogErrorBoundary;