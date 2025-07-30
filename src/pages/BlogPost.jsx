
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

