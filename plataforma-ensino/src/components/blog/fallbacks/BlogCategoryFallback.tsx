'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, BookOpen, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface BlogCategoryFallbackProps {
  categoryName?: string;
  onRetry?: () => void;
  canRetry?: boolean;
}

export default function BlogCategoryFallback({
  categoryName = 'Esta categoria',
  onRetry,
  canRetry = true
}: BlogCategoryFallbackProps) {

  const relatedCategories = [
    {
      name: 'Carreira',
      description: 'Dicas e estratégias para desenvolvimento profissional',
      postCount: 35,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Educação',
      description: 'Tendências e inovações em educação profissional',
      postCount: 28,
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Tecnologia',
      description: 'Inovações tecnológicas aplicadas à educação',
      postCount: 22,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Desenvolvimento',
      description: 'Crescimento pessoal e desenvolvimento de habilidades',
      postCount: 18,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'Negócios',
      description: 'Empreendedorismo e gestão de negócios',
      postCount: 17,
      color: 'bg-red-100 text-red-800'
    },
    {
      name: 'Mercado',
      description: 'Análises e tendências do mercado de trabalho',
      postCount: 14,
      color: 'bg-indigo-100 text-indigo-800'
    }
  ];

  const featuredPosts = [
    {
      title: 'Como se destacar no mercado de trabalho',
      category: 'Carreira',
      readTime: '8 min',
      featured: true
    },
    {
      title: 'Futuro da educação profissional',
      category: 'Educação',
      readTime: '6 min',
      featured: true
    },
    {
      title: 'Inteligência artificial na educação',
      category: 'Tecnologia',
      readTime: '7 min',
      featured: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Blog
            </Button>
            <span className="text-gray-400">/</span>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">{categoryName}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Categoria: {categoryName}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Alert */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              Categoria Temporariamente Indisponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Esta categoria está temporariamente indisponível. 
                Explore outras categorias relacionadas enquanto resolvemos o problema.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3 mt-4 justify-center">
              {canRetry && onRetry && (
                <Button onClick={onRetry} size="sm">
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

        {/* Related Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Explore Outras Categorias
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${category.color} text-xs`}>
                      {category.postCount} artigos
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-purple-50">
                    Ver Artigos
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Artigos em Destaque
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-md flex items-center justify-center mb-4 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                    <BookOpen className="w-12 h-12 text-purple-600" />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <CardTitle className="text-lg font-semibold group-hover:text-purple-600 transition-colors leading-tight">
                    {post.title}
                    {post.featured && (
                      <Badge variant="default" className="ml-2 text-xs bg-yellow-500">
                        Destaque
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Conteúdo especializado para seu desenvolvimento profissional.
                  </p>
                  
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-purple-50">
                    Ler Artigo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="text-center py-12">
            <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Descubra Mais Conteúdo
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Temos centenas de artigos especializados para ajudar no seu desenvolvimento 
              profissional e pessoal. Explore nosso blog completo.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Ver Todos os Artigos
              </Button>
              <Button variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Explorar Categorias
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter */}
        <Card className="mt-8">
          <CardContent className="text-center py-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Mantenha-se Atualizado
            </h4>
            <p className="text-gray-600 mb-4">
              Receba nossos melhores conteúdos direto no seu email.
            </p>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              Assinar Newsletter
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}