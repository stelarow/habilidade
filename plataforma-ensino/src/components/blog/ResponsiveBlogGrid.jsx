import React from 'react';
import { useBlogResponsive } from '../../hooks/useBlogResponsive';
import { combineClasses, getAnimationClasses, getStaggeredDelay } from '../../utils/blogTheme';

const ResponsiveBlogGrid = ({
  children,
  variant = 'standard', // standard, masonry, featured
  columns = 'auto', // auto, 1, 2, 3, 4
  gap = 'medium', // small, medium, large
  animation = 'fade', // fade, slide, none
  className = '',
  ...props
}) => {
  const { isMobile, isTablet, isDesktop, gridColumns } = useBlogResponsive();

  // Gap size mappings
  const gapSizes = {
    small: 'gap-3',
    medium: 'gap-6',
    large: 'gap-8'
  };

  // Column configurations based on breakpoints
  const getColumnClasses = () => {
    if (columns === 'auto') {
      // Responsive auto columns based on content
      switch (variant) {
        case 'masonry':
          return 'columns-1 md:columns-2 lg:columns-3';
        case 'featured':
          return 'grid grid-cols-1 lg:grid-cols-3';
        default:
          return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      }
    }
    
    // Fixed column configurations
    const columnMap = {
      1: 'grid grid-cols-1',
      2: 'grid grid-cols-1 md:grid-cols-2',
      3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    };
    
    return columnMap[columns] || columnMap[3];
  };

  // Base grid classes
  const baseClasses = variant === 'masonry' 
    ? 'blog-grid-masonry' 
    : combineClasses(getColumnClasses(), gapSizes[gap]);

  // Animation classes
  const animationClasses = getAnimationClasses(animation);

  // Combined classes
  const gridClasses = combineClasses(
    baseClasses,
    animationClasses,
    className
  );

  // Handle masonry layout
  if (variant === 'masonry') {
    return (
      <div className={gridClasses} {...props}>
        {React.Children.map(children, (child, index) => (
          <div 
            key={index}
            className={combineClasses(
              'break-inside-avoid mb-6',
              animationClasses,
              getStaggeredDelay(index)
            )}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }

  // Handle featured layout (hero + grid)
  if (variant === 'featured' && React.Children.count(children) > 0) {
    const childrenArray = React.Children.toArray(children);
    const featuredPost = childrenArray[0];
    const remainingPosts = childrenArray.slice(1);

    return (
      <div className={combineClasses('space-y-8', className)} {...props}>
        {/* Featured post - full width */}
        <div className={combineClasses(
          'featured-post',
          animationClasses,
          getStaggeredDelay(0)
        )}>
          {featuredPost}
        </div>
        
        {/* Remaining posts in grid */}
        {remainingPosts.length > 0 && (
          <div className={combineClasses(
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
            gapSizes[gap]
          )}>
            {remainingPosts.map((child, index) => (
              <div 
                key={index + 1}
                className={combineClasses(
                  animationClasses,
                  getStaggeredDelay(index + 1)
                )}
              >
                {child}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Standard grid layout
  return (
    <div className={gridClasses} {...props}>
      {React.Children.map(children, (child, index) => (
        <div 
          key={index}
          className={combineClasses(
            animationClasses,
            getStaggeredDelay(index)
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Specialized grid components
export const BlogPostGrid = (props) => (
  <ResponsiveBlogGrid variant="standard" {...props} />
);

export const BlogMasonryGrid = (props) => (
  <ResponsiveBlogGrid variant="masonry" {...props} />
);

export const BlogFeaturedGrid = (props) => (
  <ResponsiveBlogGrid variant="featured" {...props} />
);

// Grid container with consistent spacing
export const BlogGridContainer = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={combineClasses(
        'w-full max-w-7xl mx-auto px-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Grid section with title and optional sidebar
export const BlogGridSection = ({ 
  title, 
  subtitle, 
  children, 
  sidebar,
  className = '',
  ...props 
}) => {
  const { isMobile } = useBlogResponsive();

  return (
    <section 
      className={combineClasses('space-y-6', className)}
      {...props}
    >
      {/* Section header */}
      {(title || subtitle) && (
        <div className="text-center space-y-2">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-zinc-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content with optional sidebar */}
      <div className={combineClasses(
        sidebar && !isMobile 
          ? 'grid grid-cols-1 lg:grid-cols-4 gap-8'
          : 'w-full'
      )}>
        {/* Main content */}
        <div className={sidebar && !isMobile ? 'lg:col-span-3' : 'w-full'}>
          {children}
        </div>

        {/* Sidebar (hidden on mobile) */}
        {sidebar && !isMobile && (
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {sidebar}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResponsiveBlogGrid;