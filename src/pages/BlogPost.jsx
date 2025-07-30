
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

  const { trackClick, trackImpression } = useCTATracking();

  // Fetch post data
  const { data, isLoading, isError, error } = usePost(slug);
  const post = data?.post;

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

  return (
    <article className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <SEOHead 
        title={post.title}
        description={post.excerpt}
        image={post.featuredImage?.url}
        type="article"
      />
      
      {/* Article Header */}
      <header className="relative overflow-hidden">
        {post.featuredImage && (
          <div className="absolute inset-0">
            <LazyImage
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-invert max-w-none">
          <div 
            ref={articleRef}
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="article-content"
          />
        </div>
        
        {/* Share Buttons */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <ShareButtons 
            url={window.location.href}
            title={post.title}
            description={post.excerpt}
          />
        </div>
      </div>
      
      {/* WhatsApp Float */}
      <WhatsAppFloat />
    </article>
  );
};

export default BlogPost;
