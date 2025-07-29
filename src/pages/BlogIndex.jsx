
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MagnifyingGlass, Funnel, CaretDown } from 'phosphor-react';
import { useInfinitePosts, useCategories } from '../hooks/useBlogAPI';
import BlogCard from '../components/blog/BlogCard';
import BlogLoading from '../components/blog/BlogLoading';
import BlogError from '../components/blog/BlogError';
import BlogEmpty from '../components/blog/BlogEmpty';
import SEOHead from '../components/shared/SEOHead';
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
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <SEOHead 
          title="Blog - Escola Habilidade"
          description="Artigos sobre tecnologia, educação e carreira. Aprenda com nossos especialistas."
          path="/blog"
        />
        <BlogLoading />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <SEOHead 
          title="Blog - Escola Habilidade"
          description="Artigos sobre tecnologia, educação e carreira."
          path="/blog"
        />
        <BlogError error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  // No posts state
  if (posts.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <SEOHead 
          title="Blog - Escola Habilidade"
          description="Artigos sobre tecnologia, educação e carreira."
          path="/blog"
        />
        <BlogEmpty 
          hasFilters={!!(debouncedSearchQuery || selectedCategory)}
          onClearFilters={clearFilters}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <SEOHead 
        title="Blog - Escola Habilidade"
        description="Artigos sobre tecnologia, educação e carreira. Aprenda com nossos especialistas e mantenha-se atualizado com as últimas tendências."
        path="/blog"
        keywords="blog, tecnologia, educação, carreira, artigos, escola habilidade"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Artigos sobre tecnologia, educação e carreira para impulsionar seu crescimento profissional
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 hover:bg-zinc-700 transition-colors"
              >
                <Funnel size={20} />
                <span>
                  {selectedCategory 
                    ? categories.find(cat => cat.slug === selectedCategory)?.name || 'Categoria' 
                    : 'Todas as categorias'
                  }
                </span>
                <CaretDown 
                  size={16} 
                  className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} 
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

          {/* Active Filters */}
          {(debouncedSearchQuery || selectedCategory) && (
            <div className="flex flex-wrap gap-2 max-w-4xl mx-auto">
              {debouncedSearchQuery && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  Busca: "{debouncedSearchQuery}"
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  Categoria: {categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-1 text-zinc-400 hover:text-zinc-300 text-sm underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <BlogCard key={`${post.id}-${index}`} post={post} />
          ))}
        </div>

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
      </div>

      {/* Click outside to close filters */}
      {showFilters && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default BlogIndex;
