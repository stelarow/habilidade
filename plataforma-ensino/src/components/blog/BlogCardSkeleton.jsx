import React from 'react';

const BlogCardSkeleton = ({ variant = 'standard' }) => {
  // Card variant styles matching BlogCard
  const variantStyles = {
    standard: 'bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50',
    featured: 'border-2 border-zinc-700/50',
    compact: 'bg-zinc-800/40 border border-zinc-700/40'
  };

  return (
    <article className={`group rounded-xl overflow-hidden transition-all duration-300 ${variantStyles[variant]} animate-pulse`}>
      <div className="block">
        {/* Featured Image Skeleton */}
        <div className="relative bg-zinc-700/50 overflow-hidden h-48">
          <div className="w-full h-full bg-gradient-to-br from-zinc-600/30 to-zinc-700/30"></div>
          
          {/* Category Badge Skeleton */}
          <div className="absolute top-4 left-4">
            <div className="h-6 w-20 bg-zinc-600/50 rounded-full"></div>
          </div>

          {/* Reading Time Badge Skeleton */}
          <div className="absolute top-4 right-4">
            <div className="h-6 w-16 bg-zinc-600/50 rounded-full"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-6">
          {/* Title Skeleton */}
          <div className="mb-3">
            <div className="h-6 bg-zinc-600/50 rounded mb-2"></div>
            <div className="h-6 bg-zinc-600/30 rounded w-3/4"></div>
          </div>

          {/* Excerpt Skeleton */}
          <div className="mb-4 space-y-2">
            <div className="h-4 bg-zinc-700/50 rounded"></div>
            <div className="h-4 bg-zinc-700/50 rounded"></div>
            <div className="h-4 bg-zinc-700/30 rounded w-2/3"></div>
          </div>

          {/* Meta Information Skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              {/* Date Skeleton */}
              <div className="h-3 w-16 bg-zinc-700/50 rounded"></div>
              {/* Author Skeleton */}
              <div className="h-3 w-24 bg-zinc-700/50 rounded"></div>
            </div>
            {/* Tags count Skeleton */}
            <div className="h-3 w-12 bg-zinc-700/30 rounded"></div>
          </div>

          {/* Tags Preview Skeleton */}
          <div className="flex flex-wrap gap-1">
            <div className="h-6 w-16 bg-zinc-700/50 rounded"></div>
            <div className="h-6 w-20 bg-zinc-700/50 rounded"></div>
            <div className="h-6 w-14 bg-zinc-700/30 rounded"></div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCardSkeleton;