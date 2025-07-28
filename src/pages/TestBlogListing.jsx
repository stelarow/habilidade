import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Clock, Eye, Calendar } from 'lucide-react';

// Mock data for blog posts
const mockPosts = [
  {
    id: 1,
    title: 'As 10 Tendências de Design Gráfico para 2024',
    excerpt: 'Descubra as principais tendências que estão moldando o design gráfico em 2024 e como aplicá-las em seus projetos.',
    category: 'Design Gráfico',
    author: 'Mariana Silva',
    publishedAt: '2024-01-15',
    readingTime: 8,
    views: 1247,
    image: '/placeholder-blog.jpg',
    tags: ['design', 'tendências', 'cores', 'tipografia']
  },
  {
    id: 2,
    title: 'Como Criar uma Estratégia de Marketing Digital Eficaz',
    excerpt: 'Passo a passo completo para desenvolver uma estratégia de marketing digital que realmente converte.',
    category: 'Marketing Digital',
    author: 'Alessandro Ferreira',
    publishedAt: '2024-01-12',
    readingTime: 12,
    views: 892,
    image: '/placeholder-blog.jpg',
    tags: ['marketing', 'estratégia', 'digital', 'conversão']
  },
  {
    id: 3,
    title: 'JavaScript ES2024: Novidades e Recursos Avançados',
    excerpt: 'Explore as mais recentes funcionalidades do JavaScript ES2024 e como elas podem melhorar seu código.',
    category: 'Programação',
    author: 'Carlos Oliveira',
    publishedAt: '2024-01-10',
    readingTime: 15,
    views: 1456,
    image: '/placeholder-blog.jpg',
    tags: ['javascript', 'programação', 'web development']
  },
  {
    id: 4,
    title: 'Empreendedorismo Digital: Como Começar do Zero',
    excerpt: 'Guia prático para quem quer começar no empreendedorismo digital sem experiência prévia.',
    category: 'Empreendedorismo',
    author: 'Alessandro Ferreira',
    publishedAt: '2024-01-08',
    readingTime: 10,
    views: 634,
    image: '/placeholder-blog.jpg',
    tags: ['empreendedorismo', 'negócios', 'startup']
  },
  {
    id: 5,
    title: '10 Técnicas de Produtividade para Desenvolvedores',
    excerpt: 'Aumente sua eficiência e qualidade de código com essas técnicas comprovadas de produtividade.',
    category: 'Programação',
    author: 'Carlos Oliveira',
    publishedAt: '2024-01-05',
    readingTime: 7,
    views: 789,
    image: '/placeholder-blog.jpg',
    tags: ['produtividade', 'desenvolvimento', 'técnicas']
  },
  {
    id: 6,
    title: 'UX/UI Design: Princípios Fundamentais para Iniciantes',
    excerpt: 'Aprenda os princípios básicos de UX/UI Design e como aplicá-los em seus projetos.',
    category: 'Design Gráfico',
    author: 'Mariana Silva',
    publishedAt: '2024-01-03',
    readingTime: 11,
    views: 1023,
    image: '/placeholder-blog.jpg',
    tags: ['ux', 'ui', 'design', 'experiência usuário']
  }
];

const categories = [
  'Todos',
  'Design Gráfico',
  'Marketing Digital',
  'Programação',
  'Empreendedorismo'
];

export default function TestBlogListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = mockPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort posts
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'reading-time':
        filtered.sort((a, b) => a.readingTime - b.readingTime);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-zinc-800">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Blog Escola Habilidade
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Conhecimento que transforma vidas - Página de Validação UI/UX
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 mb-8">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                />
              </div>

              {/* Categories and Controls */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="recent">Mais Recentes</option>
                    <option value="popular">Mais Populares</option>
                    <option value="reading-time">Tempo de Leitura</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex bg-zinc-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-zinc-400">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
                {selectedCategory !== 'Todos' && ` na categoria "${selectedCategory}"`}
              </p>
            </div>

            {/* Posts Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                : 'space-y-6'
            }`}>
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all group ${
                    viewMode === 'list' ? 'flex gap-6' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`bg-gradient-to-br from-purple-600/20 to-blue-600/20 ${
                    viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-video'
                  } flex items-center justify-center`}>
                    <span className="text-zinc-400 text-sm">Imagem do Post</span>
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    {/* Category & Date */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                      {viewMode === 'list' && (
                        <span className="text-zinc-500 text-sm">
                          {formatDate(post.publishedAt)}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-zinc-50 mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-zinc-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-zinc-500">
                      <div className="flex items-center gap-4">
                        <span>Por {post.author}</span>
                        {viewMode === 'grid' && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.publishedAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readingTime}min
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatViews(post.views)}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                  Nenhum artigo encontrado
                </h3>
                <p className="text-zinc-500">
                  Tente ajustar seus filtros ou termo de busca
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-8">
            {/* Popular Posts */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-50 mb-4">
                Posts Populares
              </h3>
              <div className="space-y-4">
                {mockPosts.slice(0, 3).map((post, index) => (
                  <div key={post.id} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-zinc-50 line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-zinc-500">
                        {formatViews(post.views)} visualizações
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blog Stats */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-50 mb-4">
                Estatísticas do Blog
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total de Posts</span>
                  <span className="text-zinc-50 font-semibold">{mockPosts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total de Visualizações</span>
                  <span className="text-zinc-50 font-semibold">
                    {formatViews(mockPosts.reduce((sum, post) => sum + post.views, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tempo Médio de Leitura</span>
                  <span className="text-zinc-50 font-semibold">
                    {Math.round(mockPosts.reduce((sum, post) => sum + post.readingTime, 0) / mockPosts.length)}min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}