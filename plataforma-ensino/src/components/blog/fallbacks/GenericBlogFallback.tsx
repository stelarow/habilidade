'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, BookOpen, Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GenericBlogFallbackProps {
  onRetry?: () => void;
  canRetry?: boolean;
  showErrorDetails?: boolean;
  error?: Error;
}

export default function GenericBlogFallback({
  onRetry,
  canRetry = true,
  showErrorDetails = false,
  error
}: GenericBlogFallbackProps) {

  const supportOptions = [
    {
      icon: Mail,
      title: 'Email',
      description: 'contato@escolahabilidade.com',
      action: () => window.open('mailto:contato@escolahabilidade.com', '_blank')
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: '(48) 98855-9491',
      action: () => window.open('https://wa.me/5548988559491', '_blank')
    },
    {
      icon: ExternalLink,
      title: 'Site Principal',
      description: 'www.escolahabilidade.com.br',
      action: () => window.open('https://www.escolahabilidade.com.br', '_blank')
    }
  ];

  const quickActions = [
    {
      title: 'Ir para Homepage',
      description: 'Voltar à página principal do site',
      icon: Home,
      action: () => window.location.href = '/',
      variant: 'default' as const
    },
    {
      title: 'Ver Cursos',
      description: 'Explorar nossos cursos disponíveis',
      icon: BookOpen,
      action: () => window.location.href = '/cursos',
      variant: 'outline' as const
    },
    {
      title: 'Blog Principal',
      description: 'Acessar a página principal do blog',
      icon: BookOpen,
      action: () => window.location.href = '/blog',
      variant: 'outline' as const
    }
  ];

  const handleReportProblem = () => {
    const errorDetails = error ? {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    } : null;

    const mailtoLink = `mailto:suporte@escolahabilidade.com?subject=Problema no Blog - Erro Reportado&body=Encontrei um problema no blog:%0D%0A%0D%0ADetalhes:%0D%0A${encodeURIComponent(JSON.stringify(errorDetails, null, 2))}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Error Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-3xl text-gray-900 mb-2">
              Oops! Algo deu errado
            </CardTitle>
            <p className="text-lg text-gray-600">
              Encontramos um problema técnico inesperado
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <Alert>
              <AlertDescription className="text-center">
                Nossos sistemas estão enfrentando uma dificuldade temporária. 
                Nossa equipe técnica foi automaticamente notificada e está trabalhando 
                para resolver o problema o mais rápido possível.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="space-y-4">
              {canRetry && onRetry && (
                <Button onClick={onRetry} className="w-full" size="lg">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Tentar Novamente
                </Button>
              )}
              
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Recarregar Página
              </Button>
            </div>

            {/* Error Details */}
            {showErrorDetails && error && (
              <details className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer text-gray-700 font-medium mb-3">
                  Detalhes técnicos (para desenvolvedores)
                </summary>
                <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-auto">
                  <div className="mb-2">
                    <strong>Erro:</strong> {error.name}
                  </div>
                  <div className="mb-2">
                    <strong>Mensagem:</strong> {error.message}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">{error.stack}</pre>
                  </div>
                </div>
              </details>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={action.action}>
              <CardContent className="text-center p-6">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <action.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Section */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">
              Precisa de Ajuda?
            </CardTitle>
            <p className="text-gray-600">
              Nossa équipe de suporte está sempre disponível para ajudar
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {supportOptions.map((option, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-purple-50 cursor-pointer transition-colors"
                  onClick={option.action}
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <option.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {option.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReportProblem}
              >
                <Mail className="w-4 h-4 mr-2" />
                Reportar Problema
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-8 p-4 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Escola Habilidade</strong> - Educação Profissional de Qualidade
          </p>
          <p className="text-xs text-gray-500">
            Se o problema persistir, entre em contato conosco pelos canais de suporte acima.
          </p>
        </div>
      </div>
    </div>
  );
}