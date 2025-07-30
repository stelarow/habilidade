import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useInfinitePosts } from './useBlogAPI';

/**
 * Hook otimizado para pesquisa do blog com melhor UX
 * Remove o efeito de "reload" e adiciona transições suaves
 */
export const useOptimizedBlogSearch = (initialSearch = '', initialCategory = '') => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearch);
  
  // Refs para performance
  const debounceTimeoutRef = useRef(null);
  const searchCountRef = useRef(0);

  // Debounce otimizado da pesquisa
  useEffect(() => {
    setIsSearching(true);
    searchCountRef.current += 1;
    const currentSearchCount = searchCountRef.current;
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      // Só atualiza se for a pesquisa mais recente
      if (currentSearchCount === searchCountRef.current) {
        setDebouncedSearchQuery(searchQuery);
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Hook do React Query com cache otimizado
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching,
  } = useInfinitePosts(12, selectedCategory || null, debouncedSearchQuery || null);

  // Posts processados com memoização
  const posts = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  // Handlers otimizados
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const handleCategoryChange = useCallback((categorySlug) => {
    setSelectedCategory(categorySlug);
    setIsSearching(true);
    
    // Feedback visual rápido
    setTimeout(() => setIsSearching(false), 150);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('');
    setIsSearching(false);
  }, []);

  return {
    // State
    searchQuery,
    selectedCategory,
    debouncedSearchQuery,
    isSearching,
    
    // Data
    posts,
    data,
    error,
    
    // Loading states
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    
    // Actions
    handleSearchChange,
    handleCategoryChange,
    clearFilters,
    fetchNextPage,
    
    // Computed
    hasActiveFilters: !!(debouncedSearchQuery || selectedCategory),
    isLoadingWithTransition: isLoading || (isSearching && !posts.length),
  };
};

export default useOptimizedBlogSearch;