
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Tag, Share, ArrowUp } from 'phosphor-react';
import { usePost } from '../hooks/useBlogAPI';
import SEOHead from '../components/shared/SEOHead';
import ShareButtons from '../components/blog/ShareButtons';
import Breadcrumbs from '../components/blog/Breadcrumbs';
import BlogLoading from '../components/blog/BlogLoading';
import BlogError from '../components/blog/BlogError';
import LazyImage from '../components/LazyImage';
import TableOfContents from '../components/blog/TableOfContents';
import BlogCTA from '../components/blog/BlogCTA';
import InlineCTA from '../components/blog/InlineCTA';
import BlogContactSection from '../components/blog/BlogContactSection';
import WhatsAppFloat from '../components/shared/WhatsAppFloat';
import QuickContactModal from '../components/blog/QuickContactModal';
import FreeConsultationWidget from '../components/blog/FreeConsultationWidget';
import { generateContextualCTAs, insertInlineCTAs, processCtaPlaceholders, shouldShowInlineCTAs } from '../utils/ctaParser';
import { useCTATracking } from '../utils/ctaAnalytics';

// Calculate reading time
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
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
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [processedContent, setProcessedContent] = useState('');
  const [inlineCTAs, setInlineCTAs] = useState([]);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const articleRef = useRef(null);

  const { data, isLoading, isError, error } = usePost(slug);
  const post = data?.post;
  const { trackClick, trackImpression } = useCTATracking();

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Process content and CTAs when post loads
  useEffect(() => {
    if (post && post.content) {
      // Generate contextual CTAs
      const contextualCTAs = generateContextualCTAs(post);
      setInlineCTAs(contextualCTAs);

      // Insert inline CTAs if article is long enough
      if (shouldShowInlineCTAs(post.content)) {
        const contentWithCTAs = insertInlineCTAs(post.content, contextualCTAs);
        setProcessedContent(contentWithCTAs);
      } else {
        setProcessedContent(post.content);
      }
    }
  }, [post]);

  // Process CTA placeholders after content renders
  useEffect(() => {
    if (articleRef.current && processedContent.includes('inline-cta-placeholder')) {
      const handleCtaRender = (placeholder, ctaData) => {
        // Create React component and replace placeholder
        const ctaComponent = React.createElement(InlineCTA, {
          key: ctaData.id,
          type: ctaData.type,
          title: ctaData.title,
          description: ctaData.description,
          actionText: ctaData.actionText,
          actionLink: ctaData.actionLink,
          onCtaClick: (trackingData) => {
            trackClick({
              ...trackingData,
              postSlug: post.slug,
              position: 'inline'
            });
          },
          className: 'my-8'
        });

        // Replace placeholder with React component (simplified approach)
        placeholder.style.display = 'none';
        
        // For actual implementation, you'd use React Portal or similar
        console.log('CTA should be rendered here:', ctaData);
      };

      processCtaPlaceholders(articleRef.current, handleCtaRender);
    }
  }, [processedContent, post]);

  // Handle main CTA tracking
  const handleMainCtaClick = (trackingData) => {
    trackClick({
      ...trackingData,
      postSlug: post?.slug,
      position: 'main'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <BlogLoading />
      </div>
    );
  }

  // Error state
  if (isError || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <SEOHead 
          title="Artigo não encontrado - Escola Habilidade"
          description="O artigo que você está procurando não foi encontrado."
          path={`/blog/${slug}`}
          noindex={true}
        />
        <BlogError 
          error={error || new Error('Artigo não encontrado')} 
          onRetry={() => navigate('/blog')} 
        />
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatDate(post.created_at || post.published_at);
  const primaryCategory = post.categories?.[0] || post.category;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <SEOHead 
        title={`${post.title} - Blog Escola Habilidade`}
        description={post.excerpt || post.content?.slice(0, 160) + '...'}
        path={`/blog/${post.slug}`}
        image={post.featured_image_url}
        type="article"
        publishedDate={post.created_at || post.published_at}
        modifiedDate={post.updated_at}
        author={post.author_name || 'Escola Habilidade'}
        keywords={post.tags?.join(', ') || ''}
      />

      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-zinc-300 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar ao blog</span>
            </Link>

            <ShareButtons 
              url={`${window.location.origin}/blog/${post.slug}`}
              title={post.title}
              compact={true}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Blog', path: '/blog' },
            { label: post.title, path: `/blog/${post.slug}`, current: true }
          ]}
        />

        {/* Article Header */}
        <header className="mb-8">
          {/* Categories */}
          {primaryCategory && (
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(primaryCategory.slug || 'tecnologia')}`}>
                <Tag size={14} />
                {primaryCategory.name || primaryCategory}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-zinc-400 mb-6">
            <span className="flex items-center gap-2">
              <Calendar size={18} />
              {formattedDate}
            </span>
            
            <span className="flex items-center gap-2">
              <Clock size={18} />
              {readingTime} min de leitura
            </span>
            
            {post.author_name && (
              <span className="flex items-center gap-2">
                <User size={18} />
                {post.author_name}
              </span>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-zinc-300 leading-relaxed mb-8 max-w-4xl">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="mb-12">
            <div className="relative rounded-2xl overflow-hidden bg-zinc-800">
              <LazyImage
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-auto max-h-96 object-cover"
                placeholder={
                  <div className="w-full h-96 bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-zinc-600 border-t-purple-500 rounded-full animate-spin"></div>
                  </div>
                }
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Article Content */}
            <article ref={articleRef} className="prose prose-lg prose-zinc prose-invert max-w-none">
              <div 
                className="text-zinc-200 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: processedContent || post.content }}
              />
            </article>

            {/* Main CTA - Appears after article content */}
            <div className="mt-12">
              <BlogCTA 
                post={post}
                variant="specific"
                showUrgency={false}
                onCtaClick={handleMainCtaClick}
                className="mb-8"
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-zinc-700">
                <h3 className="text-lg font-semibold text-zinc-200 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 bg-zinc-700/50 text-zinc-300 rounded-full text-sm hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="mt-12">
              <BlogContactSection 
                article={post}
                category={primaryCategory}
                className="mb-8"
              />
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-zinc-700">
              <h3 className="text-lg font-semibold text-zinc-200 mb-4">Compartilhe este artigo</h3>
              <ShareButtons 
                url={`${window.location.origin}/blog/${post.slug}`}
                title={post.title}
              />
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <TableOfContents 
                containerSelector="article"
                showProgress={true}
                collapsible={true}
                className="mb-6"
              />

              {/* Article Info */}
              <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
                <h3 className="font-semibold text-zinc-200 mb-4">Sobre o artigo</h3>
                <div className="space-y-3 text-sm text-zinc-400">
                  <div>
                    <span className="text-zinc-300">Tempo de leitura:</span> {readingTime} minutos
                  </div>
                  <div>
                    <span className="text-zinc-300">Publicado em:</span> {formattedDate}
                  </div>
                  {post.author_name && (
                    <div>
                      <span className="text-zinc-300">Autor:</span> {post.author_name}
                    </div>
                  )}
                </div>
              </div>

              {/* Free Consultation Widget */}
              <FreeConsultationWidget 
                article={post}
                category={primaryCategory}
                variant="sidebar"
                className="mb-6"
              />

              {/* Sidebar CTA */}
              <BlogCTA 
                post={post}
                variant="generic"
                showUrgency={Math.random() > 0.7} // 30% chance of showing urgency
                urgencyText="Vagas limitadas"
                onCtaClick={(trackingData) => {
                  trackClick({
                    ...trackingData,
                    postSlug: post?.slug,
                    position: 'sidebar'
                  });
                }}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-20 z-40 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Floating WhatsApp Button */}
      <WhatsAppFloat 
        article={post}
        category={primaryCategory}
        delaySeconds={30}
        scrollThreshold={0.5}
        position="bottom-right"
      />

      {/* Quick Contact Modal */}
      <QuickContactModal 
        isOpen={showQuickModal}
        onClose={() => setShowQuickModal(false)}
        article={post}
        category={primaryCategory}
        triggerSource="article-page"
      />
    </div>
  );
};

export default BlogPost;
