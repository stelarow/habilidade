'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Mail, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface BlogPostFallbackProps {
  category?: string;
  postTitle?: string;
  onRetry?: () => void;
  canRetry?: boolean;
}

export default function BlogPostFallback({
  category = 'Artigo',
  postTitle,
  onRetry,
  canRetry = true
}: BlogPostFallbackProps) {
  
  const relatedPosts = [
    {
      title: 'Como se preparar para o mercado de trabalho',
      category: 'Carreira',
      readTime: '5 min'
    },
    {
      title: 'Tendências em educação profissional',
      category: 'Educação',
      readTime: '7 min'
    },
    {
      title: 'Desenvolva suas habilidades técnicas',
      category: 'Desenvolvimento',
      readTime: '10 min'
    }
  ];

  const handleNewsletterSignup = () => {
    // Newsletter signup logic would go here
    console.log('Newsletter signup requested');
  };

  const handleReportProblem = () => {
    // Report problem logic would go here
    console.log('Problem report requested');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>Blog</span>
              <span>/</span>
              <Badge variant="outline">{category}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Error Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900 mb-2">
              Conteúdo Temporariamente Indisponível
            </CardTitle>
            {postTitle && (
              <p className="text-lg text-gray-600 font-medium">
                "{postTitle}"
              </p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                Estamos enfrentando uma dificuldade técnica ao carregar este artigo. 
                Nossa equipe foi notificada e está trabalhando para resolver o problema.
              </AlertDescription>
            </Alert>

            {/* Category Context */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Sobre a categoria {category}
              </h3>
              <p className="text-gray-600 text-sm">
                Esta seção contém artigos especializados em {category.toLowerCase()}, 
                com conteúdo desenvolvido por nossos especialistas para ajudar 
                no seu desenvolvimento profissional e pessoal.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="grid gap-3">
              {canRetry && onRetry && (
                <Button 
                  onClick={onRetry} 
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}
              
              <Button 
                onClick={() => window.location.reload()}
                variant="outline" 
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar Página
              </Button>
              
              <Button 
                onClick={() => window.history.back()}
                variant="outline" 
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Blog
              </Button>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-gray-900 mb-2">
                Não perca nossos conteúdos
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Receba os melhores artigos sobre educação e carreira direto no seu email.
              </p>
              <Button 
                onClick={handleNewsletterSignup}
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Assinar Newsletter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Artigos Relacionados da Categoria {category}
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-md flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-sm font-medium hover:text-purple-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Conteúdo especializado para seu desenvolvimento profissional.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <Card className="bg-gray-50">
          <CardContent className="text-center py-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Problema persistindo?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Nossa equipe de suporte está aqui para ajudar.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReportProblem}
              >
                <Mail className="w-4 h-4 mr-2" />
                Reportar Problema
              </Button>
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Ir para Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}