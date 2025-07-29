/**
 * A/B Testing Integration Example
 * 
 * Demonstra como integrar o sistema de A/B testing
 * nos componentes de blog existentes
 */

import React, { useEffect } from 'react';
import { useABTest } from '../../utils/abTesting';
import BlogCard from './BlogCard';
import ResponsiveBlogGrid from './ResponsiveBlogGrid';
import BlogNavigation from './BlogNavigation';
import BlogCTA from './BlogCTA';
import InlineCTA from './InlineCTA';

/**
 * Exemplo de uso do A/B testing no layout de cards
 */
export const ABTestBlogLayout = ({ posts }) => {
  const { variant, trackMetric } = useABTest('blogCardLayout');

  useEffect(() => {
    // Track que o usuário viu esta variante
    trackMetric('pageView', 1, {
      variant: variant?.name,
      postCount: posts.length
    });
  }, [variant, trackMetric, posts.length]);

  const handleCardClick = (post) => {
    // Track cliques nos cards
    trackMetric('clickRate', 1, {
      postSlug: post.slug,
      position: posts.indexOf(post),
      variant: variant?.name
    });
  };

  const handlePageScroll = () => {
    // Track engajamento (scroll depth)
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > 75) {
      trackMetric('engagementRate', scrollPercent, {
        scrollDepth: scrollPercent,
        variant: variant?.name
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handlePageScroll);
    return () => window.removeEventListener('scroll', handlePageScroll);
  }, []);

  // Retorna layout baseado na variante
  if (!variant) return null;

  switch (variant.layout) {
    case 'grid':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} onClick={() => handleCardClick(post)}>
              <BlogCard 
                post={post} 
                variant={variant.cardVariant}
              />
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} onClick={() => handleCardClick(post)}>
              <BlogCard 
                post={post} 
                variant={variant.cardVariant}
              />
            </div>
          ))}
        </div>
      );

    case 'masonry':
      return (
        <ResponsiveBlogGrid variant="masonry">
          {posts.map((post) => (
            <div key={post.id} onClick={() => handleCardClick(post)}>
              <BlogCard 
                post={post} 
                variant={variant.cardVariant}
              />
            </div>
          ))}
        </ResponsiveBlogGrid>
      );

    default:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} onClick={() => handleCardClick(post)}>
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      );
  }
};

/**
 * Exemplo de uso do A/B testing para posicionamento de CTA
 */
export const ABTestCTAPlacement = ({ content, postSlug }) => {
  const { variant, trackMetric } = useABTest('ctaPlacement');

  const handleCTAClick = () => {
    trackMetric('conversionRate', 1, {
      postSlug,
      placement: variant?.placement,
      ctaStyle: variant?.style
    });
  };

  const handleCTAImpression = () => {
    trackMetric('clickRate', 0, {
      postSlug,
      placement: variant?.placement,
      impression: true
    });
  };

  useEffect(() => {
    // Track impressão do CTA
    handleCTAImpression();
  }, [variant]);

  if (!variant) return <div dangerouslySetInnerHTML={{ __html: content }} />;

  const ctaProps = {
    onClick: handleCTAClick,
    style: variant.style,
    className: `cta-${variant.placement}`
  };

  switch (variant.placement) {
    case 'bottom':
      return (
        <div>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <BlogCTA {...ctaProps} />
        </div>
      );

    case 'inline':
      // Insere CTA no meio do conteúdo
      const contentParts = content.split('</p>');
      const midPoint = Math.floor(contentParts.length / 2);
      
      return (
        <div>
          <div dangerouslySetInnerHTML={{ 
            __html: contentParts.slice(0, midPoint).join('</p>') + '</p>' 
          }} />
          <InlineCTA {...ctaProps} />
          <div dangerouslySetInnerHTML={{ 
            __html: contentParts.slice(midPoint).join('</p>') 
          }} />
        </div>
      );

    case 'sidebar':
      return (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="lg:w-80">
            <div className="sticky top-24">
              <BlogCTA {...ctaProps} />
            </div>
          </div>
        </div>
      );

    case 'floating':
      return (
        <div className="relative">
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <div className="fixed bottom-6 right-6 z-50">
            <BlogCTA {...ctaProps} />
          </div>
        </div>
      );

    default:
      return (
        <div>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <BlogCTA {...ctaProps} />
        </div>
      );
  }
};

/**
 * Exemplo de uso do A/B testing para posição da barra de pesquisa
 */
export const ABTestSearchPosition = ({ 
  searchQuery, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange 
}) => {
  const { variant, trackMetric } = useABTest('searchBarPosition');

  const handleSearchUse = (query) => {
    trackMetric('searchUsage', 1, {
      query,
      position: variant?.position,
      queryLength: query.length
    });
    onSearchChange(query);
  };

  const handleSearchSuccess = (resultsCount) => {
    trackMetric('findabilityScore', resultsCount > 0 ? 1 : 0, {
      resultsCount,
      position: variant?.position
    });
  };

  if (!variant) {
    return (
      <BlogNavigation
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
    );
  }

  const searchProps = {
    searchQuery,
    onSearchChange: handleSearchUse,
    selectedCategory,
    onCategoryChange,
    className: `search-${variant.position}`,
    variant: variant.style === 'prominent' ? 'horizontal' : 'sidebar'
  };

  switch (variant.position) {
    case 'header':
      return (
        <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="container mx-auto px-4 py-4">
            <BlogNavigation {...searchProps} variant="horizontal" />
          </div>
        </div>
      );

    case 'floating':
      return (
        <>
          <div className="fixed top-20 right-6 z-50 w-80">
            <BlogNavigation {...searchProps} variant="compact" />
          </div>
          <div className="lg:mr-96"> {/* Offset content */}
            <BlogNavigation {...searchProps} showSearch={false} />
          </div>
        </>
      );

    case 'sidebar':
    default:
      return <BlogNavigation {...searchProps} />;
  }
};

/**
 * Exemplo de uso do A/B testing para navegação de categorias
 */
export const ABTestCategoryNavigation = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  const { variant, trackMetric } = useABTest('categoryNavigation');

  const handleCategoryClick = (categorySlug) => {
    trackMetric('categoryEngagement', 1, {
      categorySlug,
      navigationStyle: variant?.style
    });
    
    trackMetric('navigationClicks', 1, {
      from: selectedCategory,
      to: categorySlug,
      style: variant?.style
    });

    onCategoryChange(categorySlug);
  };

  if (!variant || !categories.length) return null;

  const categoryElements = categories.map((category) => (
    <button
      key={category.slug}
      onClick={() => handleCategoryClick(category.slug)}
      className={`category-item category-${variant.style} ${
        selectedCategory === category.slug ? 'active' : ''
      }`}
    >
      {category.name}
      {category.post_count && (
        <span className="count">({category.post_count})</span>
      )}
    </button>
  ));

  switch (variant.style) {
    case 'horizontal-tabs':
      return (
        <div className="border-b border-zinc-700">
          <div className="flex overflow-x-auto gap-1 px-4">
            {categoryElements}
          </div>
        </div>
      );

    case 'dropdown':
      return (
        <div className="relative">
          <select 
            value={selectedCategory || ''}
            onChange={(e) => handleCategoryClick(e.target.value)}
            className="category-dropdown"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name} ({category.post_count})
              </option>
            ))}
          </select>
        </div>
      );

    case 'pills':
      return (
        <div className="flex flex-wrap gap-2 p-4">
          {categoryElements}
        </div>
      );

    case 'vertical-list':
    default:
      return (
        <div className="space-y-1 p-4">
          {categoryElements}
        </div>
      );
  }
};

/**
 * Hook para facilitar tracking de métricas personalizadas
 */
export const useBlogAnalytics = (experimentKey) => {
  const { variant, trackMetric } = useABTest(experimentKey);

  const trackTimeOnPage = (startTime) => {
    const timeSpent = Date.now() - startTime;
    trackMetric('timeOnPage', timeSpent, {
      timeSpentSeconds: Math.floor(timeSpent / 1000),
      variant: variant?.name
    });
  };

  const trackScrollDepth = (maxScrollPercent) => {
    trackMetric('scrollDepth', maxScrollPercent, {
      maxScroll: maxScrollPercent,
      variant: variant?.name
    });
  };

  const trackContentInteraction = (interactionType, element) => {
    trackMetric('contentInteraction', 1, {
      type: interactionType,
      element,
      variant: variant?.name
    });
  };

  return {
    variant,
    trackTimeOnPage,
    trackScrollDepth,
    trackContentInteraction,
    trackCustomMetric: trackMetric
  };
};

// Exemplo de uso completo em uma página de blog
export const ABTestBlogPage = ({ posts, content, postSlug }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation com A/B test */}
      <ABTestSearchPosition />
      
      {/* Category Navigation com A/B test */}
      <ABTestCategoryNavigation />
      
      {/* Post Content com CTA A/B test */}
      <ABTestCTAPlacement content={content} postSlug={postSlug} />
      
      {/* Blog Layout com A/B test */}
      <ABTestBlogLayout posts={posts} />
    </div>
  );
};

export default {
  ABTestBlogLayout,
  ABTestCTAPlacement,
  ABTestSearchPosition,
  ABTestCategoryNavigation,
  useBlogAnalytics,
  ABTestBlogPage
};