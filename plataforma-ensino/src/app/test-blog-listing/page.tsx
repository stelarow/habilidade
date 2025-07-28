'use client';

import React, { useState, useMemo } from 'react';
import { BlogHeader } from '@/components/blog-test/BlogHeader';
import { BlogCard } from '@/components/blog-test/BlogCard';
import { CategoryFilter } from '@/components/blog-test/CategoryFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  mockPosts, 
  mockCategories, 
  getPostsByCategory, 
  getPopularPosts,
  searchPosts,
  type BlogPost 
} from '@/lib/blog-mockdata';
import { 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  List, 
  TrendingUp, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  ArrowUp
} from 'lucide-react';

export default function TestBlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'reading-time'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 6;

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let posts = [...mockPosts];

    // Apply category filter
    if (selectedCategory) {
      posts = getPostsByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      posts = searchPosts(searchQuery);
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        posts.sort((a, b) => b.views - a.views);
        break;
      case 'reading-time':
        posts.sort((a, b) => a.readingTime - b.readingTime);
        break;
      case 'recent':
      default:
        posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
    }

    return posts;
  }, [selectedCategory, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const popularPosts = getPopularPosts(4);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BlogHeader />

      {/* Main Content */}
      <main className="container-custom px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            
            {/* Search */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar artigos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category Filter */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <CategoryFilter
                  categories={mockCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  variant="default"
                />
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Posts Populares</h3>
                </div>
                
                <div className="space-y-3">
                  {popularPosts.map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      variant="compact"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Blog Stats */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Estat�sticas</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total de Posts:</span>
                    <Badge variant="secondary">{mockPosts.length}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Categorias:</span>
                    <Badge variant="secondary">{mockCategories.length}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Resultados:</span>
                    <Badge className="bg-primary">{filteredPosts.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card/30 backdrop-blur-sm rounded-lg border border-border/30">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
                </span>
                
                {(selectedCategory || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm bg-background/50 border border-border/30 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="popular">Mais Populares</option>
                  <option value="reading-time">Tempo de Leitura</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-border/30 rounded-lg p-1 bg-background/50">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-7 w-7 p-0"
                  >
                    <Grid3X3 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-7 w-7 p-0"
                  >
                    <List className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Posts Grid/List */}
            {paginatedPosts.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {paginatedPosts.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    variant={
                      viewMode === 'grid' 
                        ? (index === 0 ? 'featured' : 'default')
                        : 'compact'
                    }
                    className={
                      viewMode === 'grid' && index === 0 
                        ? 'md:col-span-2 xl:col-span-3' 
                        : ''
                    }
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-card/30 backdrop-blur-sm border-border/30">
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum artigo encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou buscar por outros termos.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                    }}
                  >
                    Limpar filtros
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-9 px-3"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 p-0 ${
                        currentPage === page ? 'gradient-button' : ''
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 px-3"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Back to Top */}
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="h-9 px-4"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Voltar ao topo
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Debug Info */}
      <div className="fixed bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg p-3 text-xs font-mono text-muted-foreground">
        <div>P�gina de Teste: Blog Listing</div>
        <div>Posts: {filteredPosts.length}/{mockPosts.length}</div>
        <div>P�gina: {currentPage}/{totalPages}</div>
        <div>Modo: {viewMode}</div>
      </div>
    </div>
  );
}