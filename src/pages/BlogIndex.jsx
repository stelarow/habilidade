
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MagnifyingGlass, Funnel, CaretDown } from 'phosphor-react';
import { useInfinitePosts, useCategories } from '../hooks/useBlogAPI';
import BlogCard from '../components/blog/BlogCard';
import BlogLoading from '../components/blog/BlogLoading';
import BlogError from '../components/blog/BlogError';
import BlogEmpty from '../components/blog/BlogEmpty';
import BlogLayout from '../components/blog/BlogLayout';
import ResponsiveBlogGrid, { BlogGridContainer, BlogGridSection } from '../components/blog/ResponsiveBlogGrid';
import { BlogTitle, BlogSubtitle } from '../components/blog/BlogTypography';
import useInView from '../hooks/useInView';

const BlogIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL params when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (debouncedSearchQuery) {
      newParams.set('search', debouncedSearchQuery);
    }
    
    if (selectedCategory) {
      newParams.set('category', selectedCategory);
    }

    setSearchParams(newParams, { replace: true });
  }, [debouncedSearchQuery, selectedCategory, setSearchParams]);

  // Fetch data with React Query
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfinitePosts(12, selectedCategory || null, debouncedSearchQuery || null);

  const { data: categoriesData } = useCategories();

  // Infinite scroll implementation
  const [loadMoreRef, inView] = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten posts from all pages
  const posts = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  // Categories for filter dropdown
  const categories = categoriesData?.categories || [];

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSearchParams({}, { replace: true });
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle category filter
  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setShowFilters(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <BlogLayout
        title="Blog - Escola Habilidade"
        description="Artigos sobre tecnologia, educação e carreira. Aprenda com nossos especialistas."
      >
        <BlogLoading />
      </BlogLayout>
    );
  }

  // Error state
  if (isError) {
    return (
      <BlogLayout
        title="Blog - Escola Habilidade"
        description="Artigos sobre tecnologia, educação e carreira."
      >
        <BlogError error={error} onRetry={() => window.location.reload()} />
      </BlogLayout>
    );
  }

  // No posts state
  if (posts.length === 0 && !isLoading) {
    return (
      <BlogLayout
        title="Blog - Escola Habilidade"
        description="Artigos sobre tecnologia, educação e carreira."
      >
        <BlogEmpty 
          hasFilters={!!(debouncedSearchQuery || selectedCategory)}
          onClearFilters={clearFilters}
        />
      </BlogLayout>
    );
  }

  return (
    <BlogLayout
      title="Blog - Escola Habilidade"
      description="Artigos sobre tecnologia, educação e carreira. Aprenda com nossos especialistas e mantenha-se atualizado com as últimas tendências."
    >
      <BlogGridContainer>
        <BlogGridSection
          title="Blog"
          subtitle="Artigos sobre tecnologia, educação e carreira para impulsionar seu crescimento profissional"
        >

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            {/* Enhanced Search Input with visual feedback */}
            <div className="relative flex-1">
              <MagnifyingGlass 
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                  searchQuery ? 'text-purple-400' : 'text-zinc-400'
                }`} 
                size={20} 
              />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg text-zinc-100 placeholder-zinc-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  searchQuery 
                    ? 'bg-purple-500/10 border border-purple-500/50 shadow-lg' 
                    : 'bg-zinc-800 border border-zinc-700 hover:border-zinc-600'
                }`}
              />
              {searchQuery && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            {/* Enhanced Category Filter with visual indicators */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-zinc-100 transition-all duration-300 ${
                  selectedCategory 
                    ? 'bg-purple-500/20 border border-purple-500/50 hover:bg-purple-500/30 shadow-lg'
                    : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <Funnel size={20} className={`transition-colors ${selectedCategory ? 'text-purple-300' : ''}`} />
                <span className="font-medium">
                  {selectedCategory 
                    ? categories.find(cat => cat.slug === selectedCategory)?.name || 'Categoria' 
                    : 'Todas as categorias'
                  }
                </span>
                {selectedCategory && (
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                )}
                <CaretDown 
                  size={16} 
                  className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown */}
              {showFilters && (
                <div className="absolute top-full mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-4 py-2 hover:bg-zinc-700 transition-colors ${
                      !selectedCategory ? 'bg-purple-500/20 text-purple-300' : 'text-zinc-300'
                    }`}
                  >
                    Todas as categorias
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => handleCategoryChange(category.slug)}
                      className={`w-full text-left px-4 py-2 hover:bg-zinc-700 transition-colors ${
                        selectedCategory === category.slug ? 'bg-purple-500/20 text-purple-300' : 'text-zinc-300'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Active Filters with better visuals */}
          {(debouncedSearchQuery || selectedCategory) && (
            <div className="flex flex-wrap gap-3 max-w-4xl mx-auto animate-fadeIn">
              {debouncedSearchQuery && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30 shadow-lg backdrop-blur-sm">
                  <MagnifyingGlass size={14} />
                  Busca: "{debouncedSearchQuery}"
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30 shadow-lg backdrop-blur-sm">
                  <Funnel size={14} />
                  {categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-zinc-300 text-sm bg-zinc-800/50 rounded-full border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 backdrop-blur-sm"
              >
                <span>✕</span>
                Limpar filtros
              </button>
            </div>
          )}
        </div>

          {/* Posts Grid */}
          <ResponsiveBlogGrid 
            variant="standard" 
            columns="auto" 
            gap="large"
            animation="fade"
            className="mb-12"
          >
            {posts.map((post, index) => (
              <BlogCard key={`${post.id}-${index}`} post={post} index={index} />
            ))}
          </ResponsiveBlogGrid>

        {/* Load More / Loading */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="flex justify-center py-8"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-zinc-400">
                <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Carregando mais artigos...</span>
              </div>
            ) : (
              <div className="text-zinc-500 text-center">
                <div className="w-2 h-2 bg-zinc-500 rounded-full mx-auto animate-pulse"></div>
              </div>
            )}
          </div>
        )}

        {/* No more posts */}
        {!hasNextPage && posts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-zinc-400">Você chegou ao final dos artigos</p>
          </div>
        )}
        </BlogGridSection>
      </BlogGridContainer>

      {/* Click outside to close filters */}
      {showFilters && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFilters(false)}
        />
      )}
    </BlogLayout>
  );
};

export default BlogIndex;
