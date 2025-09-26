
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Calendar, User } from '@phosphor-icons/react';
import '../styles/blog-article.css';
import '../styles/highlight.css';
import { usePost } from '../hooks/useBlogAPI';
import SEOHead from '../components/shared/SEOHead';
import ShareButtons from '../components/blog/ShareButtons';
import Breadcrumbs from '../components/blog/Breadcrumbs';
import BlogLoading from '../components/blog/BlogLoading';
import BlogError from '../components/blog/BlogError';
import LazyImage from '../components/LazyImage';
import TableOfContents from '../components/blog/TableOfContents';
import WhatsAppFloat from '../components/shared/WhatsAppFloat';
import BlogCTA from '../components/blog/BlogCTA';
import { processContent, extractPlainText } from '../utils/contentProcessor';

// Calculate reading time using the content processor
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  // Use the content processor to extract plain text
  const textContent = extractPlainText(content);
  const words = textContent.split(' ').filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'Data não disponível';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data inválida';
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

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


const BlogPost = () => {
  const { slug } = useParams();
  
  // Force scroll to top and reset state when slug changes
  useEffect(() => {
    console.log('📝 BLOG POST: Slug changed to:', slug);
    console.log('🔄 BLOG POST: Scrolling to top and resetting state');
    window.scrollTo(0, 0);
    
    // Force React Query to refetch by removing the cache for this specific post
    // This ensures fresh data is loaded when navigating between posts
    return () => {
      // Cleanup function to ensure state is reset
      console.log('[BlogPost] Cleaning up for slug:', slug);
    };
  }, [slug]);
  const articleReference = useRef(null);

  // Fetch post data
  const { data, isLoading, isError, error } = usePost(slug);
  const post = data?.post;
  
  // Debug logging
  useEffect(() => {
    console.log('📊 BLOG POST: Data state changed:', { data, isLoading, isError, slug });
    if (post) {
      console.log('✅ BLOG POST: Content loaded successfully:', {
        title: post.title,
        hasContent: !!post.content,
        contentLength: post.content?.length || 0
      });
    }
  }, [data, isLoading, isError, slug, post]);

  // Loading state
  if (isLoading) {
    console.log('⏳ BLOG POST: Loading state active for slug:', slug);
    return <BlogLoading />;
  }

  // Error state
  if (isError) {
    console.error('❌ BLOG POST: Error state active:', error);
    return <BlogError error={error} />;
  }

  // No post found
  if (!post) {
    return <BlogError error={{ message: 'Post não encontrado' }} />;
  }

  const readingTime = calculateReadingTime(post.content);
  const categoryColor = getCategoryColor(post.category?.slug);

  // Generate article-specific meta tags
  const getArticleSpecificMeta = () => {
    const baseUrl = 'https://www.escolahabilidade.com';
    const articleUrl = `${baseUrl}/blog/${slug}`;
    
    // Article-specific descriptions based on slug
    const articleDescriptions = {
      'design-thinking-educacao-tecnologica': 'Descubra como o Design Thinking revoluciona a educação tecnológica. Aprenda os 5 estágios fundamentais e suas aplicações práticas no ensino de tecnologia.',
    };
    
    // Article-specific keywords
    const articleKeywords = {
      'design-thinking-educacao-tecnologica': 'design thinking, educação tecnológica, metodologia de ensino, inovação educacional, aprendizado centrado no usuário, 5 estágios design thinking',
    };

    return {
      description: articleDescriptions[slug] || post.excerpt,
      keywords: articleKeywords[slug] || '',
      url: articleUrl,
      publishedDate: post.publishedAt,
      modifiedDate: post.updatedAt || post.publishedAt,
    };
  };

  const articleMeta = getArticleSpecificMeta();

  // Generate structured data for the article
  const generateArticleStructuredData = () => {
    const baseUrl = 'https://www.escolahabilidade.com';
    const wordCount = post.content ? post.content.replace(/<[^>]*?>/g, '').split(' ').length : 0;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: articleMeta.description,
      author: {
        '@type': 'Organization',
        name: 'Escola Habilidade',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo-escola-habilidade.png`
        }
      },
      publisher: {
        '@type': 'Organization',
        name: 'Escola Habilidade',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo-escola-habilidade.png`
        }
      },
      datePublished: post.publishedAt,
      dateModified: articleMeta.modifiedDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleMeta.url
      },
      image: post.featuredImage?.url || `${baseUrl}/logo-escola-habilidade.png`,
      wordCount: wordCount,
      timeRequired: `PT${readingTime}M`,
      articleSection: post.category?.name || 'Blog',
      inLanguage: 'pt-BR',
      url: articleMeta.url
    };
  };

  return (
    <article className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <SEOHead 
        title={`${post.title} | Escola Habilidade`}
        description={articleMeta.description}
        keywords={articleMeta.keywords}
        path={`/blog/${slug}`}
        image={post.featuredImage?.url}
        type="article"
        publishedDate={articleMeta.publishedDate}
        modifiedDate={articleMeta.modifiedDate}
        schemaData={generateArticleStructuredData()}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          category={post.category}
          postTitle={post.title}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Main Content */}
          <article className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 shadow-2xl">
              {/* Header */}
              <header className="mb-8">
                {/* Category Badge */}
                {post.category && (
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColor}`}>
                      {post.category.name}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-50 mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 border-b border-zinc-800 pb-6">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{post.author?.name || 'Escola Habilidade'}</span>
                  </div>

                  {/* Published Date */}
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>

                  {/* Reading Time */}
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{readingTime} min de leitura</span>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {(post.featuredImage?.url || post.imageUrl) && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <LazyImage
                    src={post.featuredImage?.url || post.imageUrl}
                    alt={post.featuredImage?.alt || `Imagem do artigo: ${post.title}`}
                    className="w-full aspect-video object-cover"
                    loading="eager"
                    decoding="sync"
                  />
                </div>
              )}

              {/* Article Content */}
              <div 
                ref={articleReference}
                className="article-content prose prose-lg prose-invert prose-zinc max-w-none
                  prose-headings:text-zinc-50 prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
                  prose-strong:text-zinc-200 prose-strong:font-semibold
                  prose-code:text-pink-300 prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 prose-pre:rounded-lg
                  prose-blockquote:border-l-4 prose-blockquote:border-zinc-600 prose-blockquote:bg-zinc-800/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                  prose-ul:text-zinc-300 prose-ol:text-zinc-300
                  prose-li:marker:text-zinc-500
                  prose-img:rounded-lg prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: processContent(post.content, slug, post.title) }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          bg-zinc-800 text-zinc-300 border border-zinc-700
                          hover:bg-zinc-700 transition-colors duration-200"
                      >
                        #{tag.name || tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <ShareButtons
                  url={globalThis.location.href}
                  title={post.title}
                  description={post.excerpt}
                  variant="minimal"
                />
              </div>
            </div>

            {/* Blog CTA */}
            <div className="mt-8">
              <BlogCTA
                post={post}
                variant="specific"
                showUrgency={true}
                urgencyText="Vagas limitadas"
              />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 order-1 lg:order-2">
            {/* Table of Contents */}
            <div className="sticky top-8">
              <TableOfContents
                containerSelector=".article-content"
                title="Navegação do Artigo"
                collapsible={false}
                initiallyCollapsed={false}
                minHeaders={2}
                maxLevel={4}
                showProgress={true}
                className="bg-zinc-900/95 backdrop-blur-sm"
              />
            </div>
          </aside>
        </div>
      </div>
      
      {/* WhatsApp Float */}
      <WhatsAppFloat />
    </article>
  );
};

export default BlogPost;