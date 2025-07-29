'use client';

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Search, BookOpen, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface BlogListFallbackProps {
  onRetry?: () => void;
  canRetry?: boolean;
}

export default function BlogListFallback({
  onRetry,
  canRetry = true
}: BlogListFallbackProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas as Categorias', count: 120 },
    { id: 'carreira', name: 'Carreira', count: 35 },
    { id: 'educacao', name: 'Educação', count: 28 },
    { id: 'tecnologia', name: 'Tecnologia', count: 22 },
    { id: 'desenvolvimento', name: 'Desenvolvimento', count: 18 },
    { id: 'negócios', name: 'Negócios', count: 17 }
  ];

  const popularPosts = [
    {
      id: 1,
      title: 'Como se destacar no mercado de trabalho atual',
      category: 'Carreira',
      excerpt: 'Dicas essenciais para profissionais que querem se destacar',
      readTime: '8 min',
      author: 'Equipe Habilidade',
      publishDate: '15 de janeiro, 2024',
      featured: true
    },
    {
      id: 2,
      title: 'Tendências em educação profissional para 2024',
      category: 'Educação',
      excerpt: 'O que esperar do futuro da educação profissional',
      readTime: '6 min',
      author: 'Equipe Habilidade',
      publishDate: '12 de janeiro, 2024',
      featured: true
    },
    {
      id: 3,
      title: 'Desenvolvendo soft skills essenciais',
      category: 'Desenvolvimento',
      excerpt: 'As habilidades comportamentais mais valorizadas',
      readTime: '10 min',
      author: 'Equipe Habilidade',
      publishDate: '10 de janeiro, 2024',
      featured: false
    },
    {
      id: 4,
      title: 'Inteligência artificial na educação',
      category: 'Tecnologia',
      excerpt: 'Como a IA está transformando o aprendizado',
      readTime: '7 min',
      author: 'Equipe Habilidade',
      publishDate: '8 de janeiro, 2024',
      featured: false
    },
    {
      id: 5,
      title: 'Empreendedorismo na era digital',
      category: 'Negócios',
      excerpt: 'Oportunidades e desafios para novos empreendedores',
      readTime: '9 min',
      author: 'Equipe Habilidade',
      publishDate: '5 de janeiro, 2024',
      featured: false
    },
    {
      id: 6,
      title: 'Certificações profissionais que fazem diferença',
      category: 'Carreira',
      excerpt: 'As certificações mais valorizadas pelo mercado',
      readTime: '5 min',
      author: 'Equipe Habilidade',
      publishDate: '3 de janeiro, 2024',
      featured: false
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search requested:', searchQuery);
  };

  const filteredPosts = popularPosts.filter(post => 
    selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Habilidade</h1>
          <p className="text-gray-600">Conteúdo especializado para seu desenvolvimento profissional</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Alert */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Lista Temporariamente Indisponível</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Estamos tendo dificuldades para carregar a lista completa de artigos. 
                Algumas funcionalidades podem estar limitadas, mas você ainda pode explorar 
                nossos artigos em destaque abaixo.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3 mt-4 justify-center">
              {canRetry && onRetry && (
                <Button onClick={onRetry} size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}
              <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar Página
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </form>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-md p-1">
              <Button variant="ghost" size="sm" className="flex-1 bg-white shadow-sm">
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <List className="w-4 h-4 mr-2" />
                Lista
              </Button>
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(1).map(category => (
              <Badge 
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="cursor-pointer hover:bg-purple-100"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
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
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.publishDate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <div className="opacity-50">
            <Button variant="outline" disabled>
              Carregar mais artigos
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Funcionalidade temporariamente indisponível
            </p>
          </div>
        </div>

        {/* Newsletter CTA */}
        <Card className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Não perca nenhum conteúdo
            </h3>
            <p className="text-gray-600 mb-4">
              Receba os melhores artigos sobre educação e carreira direto no seu email.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Assinar Newsletter
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}