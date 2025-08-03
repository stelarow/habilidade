import React from 'react';
import BlogCardSkeleton from './BlogCardSkeleton';

// Main skeleton header component
const SkeletonHeader = () => (
  <div className="text-center mb-12 animate-pulse">
    <div className="h-12 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded mx-auto mb-4 w-48"></div>
    <div className="space-y-2">
      <div className="h-6 bg-zinc-700/70 rounded mx-auto w-96"></div>
      <div className="h-6 bg-zinc-700/70 rounded mx-auto w-80"></div>
    </div>
  </div>
);

// Search and filters skeleton
const SkeletonFilters = () => (
  <div className="mb-8 space-y-4 animate-pulse">
    <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
      {/* Search skeleton */}
      <div className="flex-1 h-12 bg-zinc-800 border border-zinc-700 rounded-lg"></div>
      
      {/* Filter dropdown skeleton */}
      <div className="w-full md:w-48 h-12 bg-zinc-800 border border-zinc-700 rounded-lg"></div>
    </div>
  </div>
);

const BlogLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <SkeletonHeader />
      
      {/* Filters Skeleton */}
      <SkeletonFilters />
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Generate 9 skeleton cards */}
        {Array.from({ length: 9 }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
      
      {/* Loading indicator */}
      <div className="flex justify-center py-8">
        <div className="flex items-center gap-3 text-zinc-400">
          <div className="w-6 h-6 border-2 border-zinc-400 border-t-purple-500 rounded-full animate-spin"></div>
          <span className="text-lg">Carregando artigos...</span>
        </div>
      </div>
    </div>
  );
};

export default BlogLoading;