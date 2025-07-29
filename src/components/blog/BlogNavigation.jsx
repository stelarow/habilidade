import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlass, 
  Funnel, 
  Tag, 
  TrendUp, 
  Clock, 
  CaretDown, 
  X,
  Hash,
  Article
} from 'phosphor-react';
import { useCategories } from '../../hooks/useBlogAPI';

/**
 * BlogNavigation Component
 * Centralized navigation for blog with categories, search, and popular posts
 */

const BlogNavigation = ({ 
  searchQuery = '', 
  onSearchChange, 
  selectedCategory = null,
  onCategoryChange,
  showSearch = true,
  showCategories = true,
  showPopular = true,
  className = '',
  variant = 'sidebar' // 'sidebar', 'horizontal', 'compact'
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [popularPosts] = useState([]); // This would come from API in real implementation
  
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.data?.categories || [];
  
  // Handle search input
  const handleSearchInput = (event) => {
    const value = event.target.value;
    onSearchChange?.(value);
    
    // Update URL with search query
    const searchParams = new URLSearchParams(location.search);
    if (value.trim()) {
      searchParams.set('search', value.trim());
    } else {
      searchParams.delete('search');
    }
    
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl, { replace: true });
  };
  
  // Handle category selection
  const handleCategorySelect = (categorySlug) => {
    onCategoryChange?.(categorySlug === selectedCategory ? null : categorySlug);
    
    if (categorySlug && categorySlug !== selectedCategory) {
      // Navigate to category page
      navigate(`/blog/categoria/${categorySlug}`);
    } else if (categorySlug === selectedCategory) {
      // Clear category filter
      navigate('/blog');
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    onSearchChange?.('');
    onCategoryChange?.(null);
    navigate('/blog');
  };
  
  // Get active filters count
  const activeFiltersCount = [
    searchQuery?.trim(),
    selectedCategory
  ].filter(Boolean).length;
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Escape to clear search when focused
      if (event.key === 'Escape' && isSearchFocused) {
        searchInputRef.current?.blur();
        if (searchQuery) {
          onSearchChange?.('');
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, isSearchFocused, onSearchChange]);
  
  // Search Component
  const SearchSection = () => (
    showSearch && (
      <div className="relative">
        <div className={`relative ${isSearchFocused ? 'ring-2 ring-purple-500/50' : ''} rounded-lg transition-all duration-200`}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlass 
              size={20} 
              className={`transition-colors ${isSearchFocused ? 'text-purple-400' : 'text-zinc-500'}`} 
            />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Pesquisar artigos... (Ctrl+K)"
            defaultValue={searchQuery}
            onChange={handleSearchInput}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:border-purple-500/50 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                if (searchInputRef.current) {
                  searchInputRef.current.value = '';
                  onSearchChange?.('');
                }
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Search shortcuts hint */}
        {isSearchFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-zinc-800/90 backdrop-blur-sm border border-zinc-700/50 rounded-lg text-xs text-zinc-400">
            <div className="flex items-center justify-between">
              <span>Pressione Enter para pesquisar</span>
              <span>Esc para limpar</span>
            </div>
          </div>
        )}
      </div>
    )
  );
  
  // Categories Component
  const CategoriesSection = () => (
    showCategories && (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <Tag size={20} className="text-purple-400" />
            Categorias
          </h3>
          {selectedCategory && (
            <button
              onClick={() => handleCategorySelect(null)}
              className="text-xs text-zinc-500 hover:text-purple-400 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>
        
        {categoriesLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-zinc-700/30 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.slug)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                  selectedCategory === category.slug
                    ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300'
                    : 'bg-zinc-800/30 border border-transparent text-zinc-300 hover:bg-zinc-700/50 hover:border-zinc-600/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Hash size={14} />
                  {category.name}
                </span>
                {category.post_count && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.slug
                      ? 'bg-purple-400/20 text-purple-200'
                      : 'bg-zinc-600/50 text-zinc-400'
                  }`}>
                    {category.post_count}
                  </span>
                )}
              </button>
            ))}
            
            {categories.length === 0 && (
              <div className="text-center py-6 text-zinc-500">
                <Tag size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhuma categoria disponível</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
  
  // Popular Posts Component (placeholder for future implementation)
  const PopularSection = () => (
    showPopular && (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <TrendUp size={20} className="text-orange-400" />
          Posts Populares
        </h3>
        
        {popularPosts.length === 0 ? (
          <div className="text-center py-6 text-zinc-500">
            <Article size={24} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Posts populares em breve</p>
          </div>
        ) : (
          <div className="space-y-2">
            {popularPosts.slice(0, 5).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="block p-3 bg-zinc-800/30 hover:bg-zinc-700/50 border border-transparent hover:border-zinc-600/50 rounded-lg transition-all duration-200"
              >
                <h4 className="text-sm font-medium text-zinc-200 line-clamp-2 mb-1">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock size={12} />
                  <span>{post.reading_time || 5} min de leitura</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  );
  
  // Active Filters Display
  const ActiveFilters = () => (
    activeFiltersCount > 0 && (
      <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <Funnel size={16} className="text-purple-400" />
        <span className="text-sm text-purple-300">
          {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} ativo{activeFiltersCount !== 1 ? 's' : ''}
        </span>
        <button
          onClick={clearFilters}
          className="ml-auto text-xs text-purple-400 hover:text-purple-300 transition-colors underline"
        >
          Limpar todos
        </button>
      </div>
    )
  );
  
  // Render based on variant
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-4 p-4 bg-zinc-800/30 rounded-lg ${className}`}>
        <div className="flex-1 max-w-md">
          <SearchSection />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600/50 rounded-lg text-zinc-300 transition-colors"
          >
            <Funnel size={16} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <CaretDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 p-4 bg-zinc-800/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-xl z-50">
              <CategoriesSection />
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={`space-y-4 ${className}`}>
        <SearchSection />
        <ActiveFilters />
      </div>
    );
  }
  
  // Default sidebar variant
  return (
    <div className={`space-y-6 ${className}`}>
      <SearchSection />
      <ActiveFilters />
      <CategoriesSection />
      <PopularSection />
    </div>
  );
};

export default BlogNavigation;