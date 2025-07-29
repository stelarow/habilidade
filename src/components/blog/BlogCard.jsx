import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, User, Tag } from 'phosphor-react';
import LazyImage from '../LazyImage';
import { usePrefetchPost } from '../../hooks/useBlogAPI';
import { useBlogResponsive } from '../../hooks/useBlogResponsive';
import BlogBadge from './BlogBadge';
import { combineClasses, getAnimationClasses } from '../../utils/blogTheme';

// Calculate reading time based on content length
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Hoje';
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
  
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Truncate text with word boundaries
const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > 0 
    ? truncated.slice(0, lastSpaceIndex) + '...'
    : truncated + '...';
};

// Get category color based on category slug
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

const BlogCard = ({ post, variant = 'standard', index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPrefetched, setIsPrefetched] = useState(false);
  const cardRef = useRef(null);
  const prefetchTimeoutRef = useRef(null);

  // Hooks
  const prefetchPost = usePrefetchPost();
  const { getTypographyClasses, shouldUseAnimations, getResponsiveImageProps } = useBlogResponsive();

  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatDate(post.created_at || post.published_at);
  const excerpt = truncateText(post.excerpt || post.content, 150);

  // Get first category for badge display
  const primaryCategory = post.categories?.[0] || post.category;
  const categorySlug = primaryCategory?.slug || 'tecnologia';
  const categoryName = primaryCategory?.name || 'Tecnologia';

  // Prefetch post content on hover with delay
  const handleMouseEnter = () => {
    if (!isPrefetched && post.slug) {
      prefetchTimeoutRef.current = setTimeout(() => {
        prefetchPost(post.slug);
        setIsPrefetched(true);
      }, 300); // 300ms delay to avoid unnecessary prefetches
    }
  };

  // Cancel prefetch if user moves away quickly
  const handleMouseLeave = () => {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
      prefetchTimeoutRef.current = null;
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  // Animation classes
  const animationClasses = shouldUseAnimations() ? getAnimationClasses('fade') : '';
  
  // Card variant styles
  const variantStyles = {
    standard: 'bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50',
    featured: 'blog-card-featured border-2',
    compact: 'bg-zinc-800/40 border border-zinc-700/40'
  };

  // Mobile responsiveness detection
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Combined card classes with mobile optimization
  const cardClasses = combineClasses(
    'group rounded-xl overflow-hidden transition-all duration-300',
    // Reduced hover effects on mobile for better performance
    isMobile 
      ? 'active:border-purple-500/50 active:shadow-lg active:shadow-purple-500/10' 
      : 'hover:border-purple-500/50 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 blog-hover-lift',
    variantStyles[variant],
    animationClasses
  );

  return (
    <article 
      ref={cardRef}
      className={cardClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/blog/${post.slug}`} className="block">
        {/* Featured Image */}
        <div className={`relative bg-zinc-700/50 overflow-hidden ${isMobile ? 'h-40' : 'h-48'}`}>
          {post.featured_image_url && !imageError ? (
            <LazyImage
              src={post.featured_image_url}
              alt={post.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              placeholder={
                <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-zinc-600 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
              }
            />
          ) : (
            // Fallback gradient when no image or error
            <div className="w-full h-full bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 flex items-center justify-center">
              <div className="text-center text-zinc-400">
                <div className="w-12 h-12 mx-auto mb-2 opacity-30">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <p className="text-xs">Artigo</p>
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          {primaryCategory && (
            <div className="absolute top-4 left-4">
              <BlogBadge 
                variant="category" 
                categorySlug={categorySlug} 
                size="small"
                icon={Tag}
              >
                {categoryName}
              </BlogBadge>
            </div>
          )}

          {/* Reading Time Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm text-white rounded-full text-xs">
              <Clock size={12} />
              {readingTime} min
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
          {/* Title */}
          <h2 className={combineClasses(
            "font-bold text-zinc-100 mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors",
            getTypographyClasses('title')
          )}>
            {post.title}
          </h2>

          {/* Excerpt */}
          {excerpt && (
            <p className={combineClasses(
              "text-zinc-400 mb-4 line-clamp-3 leading-relaxed",
              getTypographyClasses('body')
            )}>
              {excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              {/* Date */}
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formattedDate}
              </span>

              {/* Author (if available) */}
              {post.author_name && (
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {post.author_name}
                </span>
              )}
            </div>

            {/* Tags count (if available) */}
            {post.tags && post.tags.length > 0 && (
              <span className="text-zinc-600">
                +{post.tags.length} tags
              </span>
            )}
          </div>

          {/* Tags Preview */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 -mb-1">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-zinc-700/50 text-zinc-400 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-block px-2 py-1 bg-zinc-700/50 text-zinc-500 rounded text-xs">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;