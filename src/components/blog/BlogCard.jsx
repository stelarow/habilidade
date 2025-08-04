import React, { useState, useRef } from 'react';
import { Clock, Calendar, User, Tag } from 'phosphor-react';
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
  if (!dateString) return 'Data não disponível';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data inválida';
  
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

const BlogCard = ({ post, variant = 'standard', index = 0 }) => {
  // Enhanced state management
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    isInView: false
  });
  const [isPrefetched, setIsPrefetched] = useState(false);
  const cardRef = useRef(null);
  const prefetchTimeoutRef = useRef(null);
  const imageRef = useRef(null);

  // Hooks
  const prefetchPost = usePrefetchPost();
  const { getTypographyClasses, shouldUseAnimations } = useBlogResponsive();

  // Enhanced image handling with multiple fallbacks
  const getImageSrc = () => {
    // Priority order: featured_image_url > featuredImage.url > featuredImage > imageUrl
    if (post.featured_image_url && post.featured_image_url !== null) return post.featured_image_url;
    if (post.featuredImage && typeof post.featuredImage === 'object' && post.featuredImage.url) return post.featuredImage.url;
    if (post.featuredImage && typeof post.featuredImage === 'string') return post.featuredImage;
    if (post.imageUrl && post.imageUrl !== null) return post.imageUrl;
    return null; // Will trigger our enhanced placeholder
  };

  // Enhanced intersection observer for lazy loading
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageState(prev => ({ ...prev, isInView: true }));
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Enhanced image loading handlers
  const handleImageLoad = () => {
    setImageState(prev => ({ ...prev, loaded: true, error: false }));
  };

  const handleImageError = () => {
    setImageState(prev => ({ ...prev, error: true, loaded: true }));
  };

  // Computed values
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatDate(post.publishedAt || post.created_at || post.published_at);
  const excerpt = truncateText(post.excerpt || post.content, 150);
  const primaryCategory = post.categories?.[0] || post.category;
  const categorySlug = primaryCategory?.slug || 'tecnologia';
  const categoryName = primaryCategory?.name || 'Tecnologia';
  const imageSrc = getImageSrc();

  // Enhanced placeholder component
  const EnhancedPlaceholder = () => {
    const categoryGradients = {
      'tecnologia': 'from-blue-600/30 via-purple-600/25 to-cyan-600/30',
      'programacao': 'from-purple-600/30 via-blue-600/25 to-indigo-600/30',
      'educacao': 'from-green-600/30 via-emerald-600/25 to-teal-600/30',
      'carreira': 'from-orange-600/30 via-yellow-600/25 to-amber-600/30',
      'design': 'from-pink-600/30 via-rose-600/25 to-red-600/30',
      'arquitetura': 'from-cyan-600/30 via-teal-600/25 to-blue-600/30'
    };

    const gradient = categoryGradients[categorySlug] || categoryGradients.tecnologia;

    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
        {/* Enhanced animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 left-6 w-8 h-8 border border-purple-300/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 right-8 w-6 h-6 border border-blue-300/30 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-12 w-4 h-4 border border-pink-300/30 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 left-12 w-5 h-5 border border-green-300/30 rounded-full animate-pulse delay-700"></div>
        </div>
        
        {/* Content icon with category-specific styling */}
        <div className="text-center text-zinc-300 relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 opacity-70 transform group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <p className="text-base font-semibold opacity-90 mb-2">{categoryName}</p>
          <div className="flex justify-center">
            <div className="w-16 h-1.5 bg-gradient-to-r from-purple-400/60 to-blue-400/60 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced prefetch handlers
  const handleMouseEnter = () => {
    if (!isPrefetched && post.slug) {
      prefetchTimeoutRef.current = setTimeout(() => {
        prefetchPost(post.slug);
        setIsPrefetched(true);
      }, 200);
    }
  };

  const handleMouseLeave = () => {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
      prefetchTimeoutRef.current = null;
    }
  };

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  // Enhanced styling
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const animationClasses = shouldUseAnimations() ? getAnimationClasses('fade') : '';
  
  const variantStyles = {
    standard: 'bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50',
    featured: 'blog-card-featured border-2 border-purple-500/20',
    compact: 'bg-zinc-800/40 border border-zinc-700/40'
  };

  const cardClasses = combineClasses(
    'group rounded-xl overflow-hidden transition-all duration-500 ease-out',
    isMobile 
      ? 'active:border-purple-500/50 active:shadow-lg active:shadow-purple-500/10 active:scale-[0.98]' 
      : 'hover:border-purple-500/50 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 cursor-pointer',
    !isMobile && 'hover:ring-1 hover:ring-purple-500/20',
    variantStyles[variant],
    animationClasses
  );

  const handleCardClick = (e) => {
    e.preventDefault();
    const targetUrl = `/blog/${post.slug}`;
    window.location.href = targetUrl;
  };

  return (
    <article 
      ref={cardRef}
      className={cardClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a 
        href={`/blog/${post.slug}`}
        onClick={handleCardClick}
        className="block"
      >
        {/* Enhanced Featured Image Section */}
        <div className={`relative bg-zinc-700/50 overflow-hidden ${isMobile ? 'h-40' : 'h-48'}`}>
          {imageSrc ? (
            <>
              <img
                ref={imageRef}
                src={imageSrc}
                alt={post.title}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                  imageState.loaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
              
              {/* Show placeholder only while loading or on error */}
              {(!imageState.loaded || imageState.error) && (
                <div className="absolute inset-0">
                  <EnhancedPlaceholder />
                </div>
              )}
              
              {/* Loading indicator */}
              {!imageState.loaded && !imageState.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/50">
                  <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </>
          ) : (
            <EnhancedPlaceholder />
          )}
          
          {/* Category Badge */}
          {primaryCategory && (
            <div className="absolute top-4 left-4 z-10">
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
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium">
              <Clock size={12} />
              {readingTime} min
            </span>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <h2 className={combineClasses(
            "font-bold text-zinc-100 mb-3 line-clamp-2 group-hover:text-purple-300 transition-all duration-300 transform group-hover:translate-x-1",
            getTypographyClasses('title')
          )}>
            {post.title}
          </h2>

          {excerpt && (
            <p className={combineClasses(
              "text-zinc-400 mb-4 line-clamp-3 leading-relaxed",
              getTypographyClasses('body')
            )}>
              {excerpt}
            </p>
          )}

          <div className={`text-xs text-zinc-500 ${isMobile ? 'space-y-2' : 'flex items-center justify-between'}`}>
            <div className={`flex items-center ${isMobile ? 'justify-between' : 'gap-4'}`}>
              <span className="flex items-center gap-1 hover:text-zinc-400 transition-colors">
                <Calendar size={12} className="group-hover:text-purple-400 transition-colors" />
                {formattedDate}
              </span>

              {post.author_name && (
                <span className="flex items-center gap-1 hover:text-zinc-400 transition-colors">
                  <User size={12} className="group-hover:text-purple-400 transition-colors" />
                  {post.author_name}
                </span>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <span className="text-zinc-600 group-hover:text-zinc-500 transition-colors px-2 py-1 bg-zinc-800/50 rounded-full">
                +{post.tags.length} tags
              </span>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 -mb-1">
              {post.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-block px-2 py-1 bg-zinc-700/50 text-zinc-400 rounded text-xs hover:bg-zinc-600/50 transition-colors"
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
      </a>
    </article>
  );
};

export default BlogCard;