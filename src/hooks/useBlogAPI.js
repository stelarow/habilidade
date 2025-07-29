import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { blogAPI } from '../services/blogAPI';

// Cache configuration
const CACHE_CONFIG = {
  POSTS_LIST: 5 * 60 * 1000, // 5 minutes for lists
  POST_DETAIL: 60 * 60 * 1000, // 1 hour for individual posts
  CATEGORIES: 30 * 60 * 1000, // 30 minutes for categories
};

// Hook for fetching all posts with pagination
export const usePosts = (page = 1, limit = 10, category = null, search = null) => {
  return useQuery({
    queryKey: ['posts', page, limit, category, search],
    queryFn: () => blogAPI.getAllPosts(page, limit, category, search),
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for infinite scroll posts
export const useInfinitePosts = (limit = 10, category = null, search = null) => {
  return useInfiniteQuery({
    queryKey: ['infinitePosts', limit, category, search],
    queryFn: ({ pageParam = 1 }) => 
      blogAPI.getAllPosts(pageParam, limit, category, search),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages 
        ? pagination.page + 1 
        : undefined;
    },
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for fetching a single post by slug
export const usePost = (slug) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => blogAPI.getPostBySlug(slug),
    staleTime: CACHE_CONFIG.POST_DETAIL,
    retry: 2,
    enabled: !!slug, // Only run query if slug is provided
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for fetching posts by category
export const usePostsByCategory = (categorySlug, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['postsByCategory', categorySlug, page, limit],
    queryFn: () => blogAPI.getPostsByCategory(categorySlug, page, limit),
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 3,
    enabled: !!categorySlug,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for infinite scroll posts by category
export const useInfinitePostsByCategory = (categorySlug, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['infinitePostsByCategory', categorySlug, limit],
    queryFn: ({ pageParam = 1 }) => 
      blogAPI.getPostsByCategory(categorySlug, pageParam, limit),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages 
        ? pagination.page + 1 
        : undefined;
    },
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 3,
    enabled: !!categorySlug,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for fetching all categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => blogAPI.getCategories(),
    staleTime: CACHE_CONFIG.CATEGORIES,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for searching posts with debouncing
export const useSearchPosts = (query, page = 1, limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['searchPosts', query, page, limit],
    queryFn: () => blogAPI.searchPosts(query, page, limit),
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 2,
    enabled: enabled && !!query && query.length >= 3, // Only search if query is at least 3 chars
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for infinite scroll search
export const useInfiniteSearchPosts = (query, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['infiniteSearchPosts', query, limit],
    queryFn: ({ pageParam = 1 }) => 
      blogAPI.searchPosts(query, pageParam, limit),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages 
        ? pagination.page + 1 
        : undefined;
    },
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 2,
    enabled: !!query && query.length >= 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Utility hook for prefetching posts (for performance optimization)
export const usePrefetchPost = () => {
  const queryClient = useQueryClient();
  
  return (slug) => {
    queryClient.prefetchQuery({
      queryKey: ['post', slug],
      queryFn: () => blogAPI.getPostBySlug(slug),
      staleTime: CACHE_CONFIG.POST_DETAIL,
    });
  };
};

// Export all hooks as default for convenience
export default {
  usePosts,
  useInfinitePosts,
  usePost,
  usePostsByCategory,
  useInfinitePostsByCategory,
  useCategories,
  useSearchPosts,
  useInfiniteSearchPosts,
  usePrefetchPost,
};