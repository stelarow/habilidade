import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Tag, MagnifyingGlass } from 'phosphor-react';
import { useInfinitePostsByCategory, useCategories } from '../hooks/useBlogAPI';
import BlogCard from '../components/blog/BlogCard';
import BlogLoading from '../components/blog/BlogLoading';
import BlogError from '../components/blog/BlogError';
import BlogEmpty from '../components/blog/BlogEmpty';
import BlogNavigation from '../components/blog/BlogNavigation';
import SEOHead from '../components/shared/SEOHead';
import Breadcrumbs from '../components/blog/Breadcrumbs';
import useInView from '../hooks/useInView';

// Get category color
const getCategoryColor = (categorySlug) => {
  const colors = {
    'tecnologia': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'educacao': 'bg-green-500/20 text-green-300 border-green-500/30',
    'carreira': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'design': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'programacao': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'marketing': 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  
  return colors[categorySlug] || 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
};

const BlogCategory = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL params when search changes
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (debouncedSearchQuery) {
      newParams.set('search', debouncedSearchQuery);
    }

    setSearchParams(newParams, { replace: true });
  }, [debouncedSearchQuery, setSearchParams]);

  // Fetch data
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfinitePostsByCategory(categorySlug, 12);

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

  // Get category info
  const categories = categoriesData?.categories || [];
  const currentCategory = categories.find(cat => cat.slug === categorySlug) || {
    slug: categorySlug,
    name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
    description: `Artigos sobre ${categorySlug}`
  };

  // Filter posts by search if provided
  const filteredPosts = useMemo(() => {
    if (!debouncedSearchQuery) return posts;
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [posts, debouncedSearchQuery]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <SEOHead 
          title={`Categoria ${currentCategory.name} - Blog Escola Habilidade`}
          description={`Artigos sobre ${currentCategory.name.toLowerCase()}.`}
          path={`/blog/categoria/${categorySlug}`}
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
          title={`Categoria ${currentCategory.name} - Blog Escola Habilidade`}
          description={`Artigos sobre ${currentCategory.name.toLowerCase()}.`}
          path={`/blog/categoria/${categorySlug}`}
        />
        <BlogError error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <SEOHead 
        title={`${currentCategory.name} - Blog Escola Habilidade`}
        description={currentCategory.description || `Artigos sobre ${currentCategory.name.toLowerCase()} para impulsionar seu crescimento profissional.`}
        path={`/blog/categoria/${categorySlug}`}
        keywords={`${currentCategory.name.toLowerCase()}, artigos, blog, escola habilidade`}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Blog', path: '/blog' },
            { label: currentCategory.name, path: `/blog/categoria/${categorySlug}`, current: true }
          ]}
        />

        {/* Navigation */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Voltar ao blog</span>
          </Link>
        </div>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-medium border ${getCategoryColor(categorySlug)}`}>
              <Tag size={20} />
              {currentCategory.name}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-100">
            Artigos sobre {currentCategory.name}
          </h1>
          
          {currentCategory.description && (
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              {currentCategory.description}
            </p>
          )}
        </div>

        {/* Search with Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
                <input
                  type="text"
                  placeholder={`Buscar em ${currentCategory.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Active Search Filter */}
              {debouncedSearchQuery && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                    Busca: "{debouncedSearchQuery}"
                  </span>
                  <button
                    onClick={clearSearch}
                    className="text-zinc-400 hover:text-zinc-300 text-sm underline"
                  >
                    Limpar
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <BlogNavigation
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={categorySlug}
                onCategoryChange={() => {}} // Disabled in category page
                showSearch={false} // Hide search since we have main search
                showCategories={true}
                showPopular={true}
                variant="sidebar"
                className="sticky top-8"
              />
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredPosts.map((post, index) => (
                <BlogCard key={`${post.id}-${index}`} post={post} />
              ))}
            </div>

            {/* Load More / Loading - only show if no search filter */}
            {!debouncedSearchQuery && hasNextPage && (
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
            {!debouncedSearchQuery && !hasNextPage && posts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-zinc-400">Você chegou ao final dos artigos de {currentCategory.name}</p>
              </div>
            )}
          </>
        ) : (
          <BlogEmpty 
            hasFilters={!!debouncedSearchQuery}
            onClearFilters={clearSearch}
          />
        )}

        {/* Other Categories */}
        {categories.length > 1 && (
          <div className="mt-16 pt-8 border-t border-zinc-700">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6 text-center">
              Explore outras categorias
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories
                .filter(cat => cat.slug !== categorySlug)
                .map((category) => (
                  <Link
                    key={category.slug}
                    to={`/blog/categoria/${category.slug}`}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:scale-105 ${getCategoryColor(category.slug)}`}
                  >
                    <Tag size={14} />
                    {category.name}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCategory;