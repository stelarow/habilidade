'use client';

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Home, Search, BookOpen, TrendingUp, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface BlogSearchFallbackProps {
  searchQuery?: string;
  onRetry?: () => void;
  canRetry?: boolean;
}

export default function BlogSearchFallback({
  searchQuery = '',
  onRetry,
  canRetry = true
}: BlogSearchFallbackProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const popularSearches = [
    'carreira profissional',
    'educação online',
    'desenvolvimento pessoal',
    'mercado de trabalho',
    'habilidades técnicas',
    'empreendedorismo',
    'certificações',
    'soft skills'
  ];

  const popularPosts = [
    {
      title: 'Como se destacar no mercado de trabalho atual',
      category: 'Carreira',
      excerpt: 'Estratégias essenciais para profissionais que querem se destacar',
      readTime: '8 min',
      views: '12.5k'
    },
    {
      title: 'Tendências em educação profissional para 2024',
      category: 'Educação',
      excerpt: 'O que esperar do futuro da educação e capacitação profissional',
      readTime: '6 min',
      views: '9.8k'
    },
    {
      title: 'Desenvolvendo soft skills essenciais',
      category: 'Desenvolvimento',
      excerpt: 'As habilidades comportamentais mais valorizadas pelo mercado',
      readTime: '10 min',
      views: '8.2k'
    },
    {
      title: 'Inteligência artificial na educação',
      category: 'Tecnologia',
      excerpt: 'Como a IA está revolucionando o processo de aprendizagem',
      readTime: '7 min',
      views: '7.9k'
    }
  ];

  const categories = [
    { name: 'Carreira', count: 35, description: 'Desenvolvimento profissional' },
    { name: 'Educação', count: 28, description: 'Tendências educacionais' },
    { name: 'Tecnologia', count: 22, description: 'Inovações tecnológicas' },
    { name: 'Desenvolvimento', count: 18, description: 'Crescimento pessoal' },
    { name: 'Negócios', count: 17, description: 'Empreendedorismo' },
    { name: 'Mercado', count: 14, description: 'Análises de mercado' }
  ];

  const recentlyViewed = [
    { title: 'Como montar um portfólio profissional', category: 'Carreira' },
    { title: 'Machine Learning para iniciantes', category: 'Tecnologia' },
    { title: 'Gestão de tempo eficiente', category: 'Desenvolvimento' }
  ];

  const handleSimpleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Simple search attempted:', localSearchQuery);
    // Here would implement a basic search fallback
  };

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
              <Search className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Busca</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {searchQuery ? `Busca por: "${searchQuery}"` : 'Busca no Blog'}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Alert */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              Busca Temporariamente Indisponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                O sistema de busca está temporariamente indisponível. 
                Tente novamente em alguns minutos ou explore nossos artigos em destaque e categorias abaixo.
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
                Ver Artigos em Destaque
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Simple Search Fallback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Busca Simplificada</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSimpleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Digite palavras-chave para buscar..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Buscar (modo simplificado)
              </Button>
            </form>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Buscas populares:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-purple-50"
                    onClick={() => setLocalSearchQuery(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Popular Posts */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Artigos Mais Populares
                </h2>
              </div>
              
              <div className="space-y-6">
                {popularPosts.map((post, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-8 h-8 text-purple-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{post.readTime}</span>
                            <span className="text-xs text-gray-500">" {post.views} visualizações</span>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Explorar por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded hover:bg-purple-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Visualizados Recentemente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentlyViewed.map((item, index) => (
                    <div key={index} className="p-2 rounded hover:bg-purple-50 cursor-pointer transition-colors">
                      <p className="font-medium text-sm hover:text-purple-600">
                        {item.title}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {item.category}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="text-center p-6">
                <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Não perca nenhum conteúdo
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Receba nossos melhores artigos direto no seu email.
                </p>
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                  Assinar Newsletter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}