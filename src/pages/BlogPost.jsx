
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Calendar, User } from 'phosphor-react';
import '../styles/blog-article.css';
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

// Calculate reading time
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  // Remove HTML tags and count actual words
  const textContent = content.replace(/<[^>]*?>/g, '').trim();
  const words = textContent.split(' ').filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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
  
  // Force component re-render when slug changes
  useEffect(() => {
    console.log('[BlogPost] Component mounted/updated with slug:', slug);
  }, [slug]);
  const articleReference = useRef(null);

  // Fetch post data
  const { data, isLoading, isError, error } = usePost(slug);
  const post = data?.post;
  
  // Debug logging
  useEffect(() => {
    console.log('[BlogPost] Data state changed:', { data, isLoading, isError, slug });
  }, [data, isLoading, isError, slug]);

  // Loading state
  if (isLoading) {
    return <BlogLoading />;
  }

  // Error state
  if (isError) {
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
          url: `${baseUrl}/assets/logos/original/logo-original.png`
        }
      },
      publisher: {
        '@type': 'Organization',
        name: 'Escola Habilidade',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/assets/logos/original/logo-original.png`
        }
      },
      datePublished: post.publishedAt,
      dateModified: articleMeta.modifiedDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleMeta.url
      },
      image: post.featuredImage?.url || `${baseUrl}/assets/logos/original/logo-original.png`,
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
      
      {/* Article Header */}
      <header className="relative overflow-hidden">
        {post.featuredImage && (
          <div className="absolute inset-0">
            <LazyImage
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || `Imagem do artigo: ${post.title}`}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
          </div>
        )}
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <Breadcrumbs 
            category={post.category}
            postTitle={post.title}
          />
          
          <div className="mt-8">
            {post.category && (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${categoryColor} mb-4`}>
                {post.category.name}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-zinc-300 mb-8 max-w-3xl">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{readingTime} min de leitura</span>
              </div>
              
              {post.author && (
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{post.author.name || post.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Table of Contents - Mobile */}
        <div className="xl:hidden mb-6">
          <TableOfContents 
            containerSelector=".article-content"
            title="Navegação do Artigo"
            collapsible={true}
            initiallyCollapsed={true}
            minHeaders={2}
            maxLevel={4}
            showProgress={false}
            className="bg-zinc-800/50"
          />
        </div>
        
        {/* Flex Container for Content and TOC */}
        <div className="flex gap-8 max-w-none">
          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-4xl">
            <div className="prose prose-lg prose-invert max-w-none">
              <div 
                ref={articleReference}
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="article-content"
              />
            </div>
            
            {/* Blog CTA Component */}
            <div className="mt-12">
              <BlogCTA 
                post={post}
                variant="specific"
                showUrgency={true}
                urgencyText="Vagas limitadas"
              />
            </div>
            
            {/* Share Buttons - Using minimal variant for elegance */}
            <div className="mt-12 pt-8 border-t border-zinc-800">
              <ShareButtons 
                url={globalThis.location.href}
                title={post.title}
                description={post.excerpt}
                variant="minimal"
              />
            </div>
          </div>
          
          {/* Sidebar TOC - Desktop */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
              <TableOfContents 
                containerSelector=".article-content"
                title="Navegação do Artigo"
                collapsible={true}
                initiallyCollapsed={false}
                minHeaders={2}
                maxLevel={4}
                showProgress={true}
                className="bg-zinc-900/95 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* WhatsApp Float */}
      <WhatsAppFloat />
    </article>
  );
};

export default BlogPost;