import React, { useEffect, useRef } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { Clock, Calendar, User } from '@phosphor-icons/react';
import '../styles/blog-article.css';
import '../styles/highlight.css';
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

function BlogPost() {
  const { slug } = useParams();
  const loaderData = useLoaderData();
  
  // Use loader data directly (available during SSG build)
  const post = loaderData?.post;
  const articleReference = useRef(null);
  
  // Force scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Loading state (should not happen with SSG, but good fallback)
  if (!post) {
    return <BlogError error={{ message: 'Post não encontrado' }} />;
  }

  const readingTime = calculateReadingTime(post.content);
  const categoryColor = getCategoryColor(post.category?.slug);

  // Process content with title to remove duplicates
  const processedContent = processContent(post.content, slug, post.title);

  // SEO data for meta tags
  const seoTitle = `${post.title} | Escola Habilidade`;
  const seoDescription = post.excerpt || `Aprenda ${post.title} com a Escola Habilidade`;
  const seoImage = (post.featuredImage?.url || post.imageUrl) || 'https://www.escolahabilidade.com/assets/logos/original/logo-original.png';
  const seoUrl = `https://www.escolahabilidade.com/blog/${slug}`;
  const seoAuthor = post.author?.name || 'Escola Habilidade';

  return (
    <>
      {/* SEO Head with vite-react-ssg */}
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="author" content={seoAuthor} />
        
        {/* Article specific meta tags */}
        <meta property="article:published_time" content={post.published_at} />
        {post.updated_at && <meta property="article:modified_time" content={post.updated_at} />}
        {post.category?.name && <meta property="article:section" content={post.category.name} />}
        {post.tags?.map(tag => (
          <meta key={tag.name} property="article:tag" content={tag.name} />
        ))}
        
        {/* Open Graph Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:image" content={seoImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Escola Habilidade" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        <meta name="twitter:site" content="@escolahabilidade" />
        <meta name="twitter:creator" content="@escolahabilidade" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={seoUrl} />
        
        {/* Additional meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#d400ff" />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: seoDescription,
            url: seoUrl,
            image: seoImage,
            datePublished: post.published_at,
            dateModified: post.updated_at || post.published_at,
            author: {
              '@type': 'Organization',
              name: 'Escola Habilidade',
              url: 'https://www.escolahabilidade.com'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Escola Habilidade',
              url: 'https://www.escolahabilidade.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.escolahabilidade.com/assets/logos/original/logo-original.png'
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': seoUrl
            }
          })
        }} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.category?.name || 'Artigo', href: `/blog/categoria/${post.category?.slug}` },
              { label: post.title, href: `/blog/${slug}`, current: true }
            ]}
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
                      <time dateTime={post.published_at}>
                        {formatDate(post.published_at)}
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
                      alt={`Imagem ilustrativa do artigo: ${post.title}`}
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
                  dangerouslySetInnerHTML={{ __html: processedContent }}
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
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <ShareButtons
                    url={`https://www.escolahabilidade.com/blog/${slug}`}
                    title={post.title}
                    description={post.excerpt}
                  />
                </div>
              </div>

              {/* Blog CTA */}
              <div className="mt-8">
                <BlogCTA
                  title="Transforme seu futuro profissional"
                  description="Descubra nossos cursos práticos e acelere sua carreira na área de tecnologia."
                  buttonText="Ver Cursos"
                  buttonLink="/cursos"
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
      </div>
    </>
  );
}

// Loader function for vite-react-ssg
export async function loader({ params }) {
  // This function runs at build time during SSG
  const { slug } = params;
  
  try {
    // Import blog API functions
    const { blogAPI } = await import('../services/blogAPI.js');
    
    // Fetch post data
    const postData = await blogAPI.getPostBySlug(slug);
    
    if (!postData || !postData.post) {
      throw new Error(`Post not found: ${slug}`);
    }

    return {
      post: postData.post,
      seoData: {
        title: postData.post.title,
        description: postData.post.excerpt,
        image: postData.post.featuredImage?.url || postData.post.imageUrl,
        url: `https://www.escolahabilidade.com/blog/${slug}`
      }
    };
  } catch (error) {
    console.error(`[BlogPost Loader] Error loading post ${slug}:`, error);
    throw new Error(`Failed to load post: ${slug}`);
  }
}

// Component and entry for vite-react-ssg
export const Component = BlogPost;
export const entry = 'src/pages/BlogPostSSG.jsx';

export default BlogPost;