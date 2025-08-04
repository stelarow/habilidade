import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { 
  generateMetaTags, 
  generateStructuredData, 
  generateCanonicalUrl,
  generateBreadcrumbStructuredData,
  sanitizeTitle,
  truncateDescription
} from '../../utils/seoUtils';

const SEOHead = ({
  title = 'Escola Habilidade',
  description = 'Desenvolva suas habilidades com cursos de tecnologia, design e negócios. Educação de qualidade para o mercado digital.',
  keywords = '',
  path = '',
  image = null,
  author = 'Escola Habilidade',
  type = 'website',
  publishedDate = null,
  modifiedDate = null,
  noindex = false,
  canonical = null,
  schemaData = null,
}) => {
  // Sanitize all string inputs to prevent invalid children
  const safeTitle = String(title || 'Escola Habilidade');
  const safeDescription = String(description || 'Desenvolva suas habilidades com cursos de tecnologia, design e negócios. Educação de qualidade para o mercado digital.');
  const safeKeywords = keywords ? String(keywords).trim() : '';
  const safeAuthor = String(author || 'Escola Habilidade');
  
  // Base URL - adjust for production
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.escolahabilidade.com'
    : 'http://localhost:5173';
  
  const fullUrl = `${baseUrl}${path}`;
  const canonicalUrl = canonical || fullUrl;
  
  // Default image
  const defaultImage = `${baseUrl}/assets/logos/original/logo-original.png`;
  const ogImage = image || defaultImage;
  
  // Schema.org structured data
  const generateSchemaData = () => {
    if (schemaData) return schemaData;
    
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebPage',
      name: safeTitle,
      description: safeDescription,
      url: fullUrl,
      image: ogImage,
      author: {
        '@type': 'Organization',
        name: 'Escola Habilidade',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: defaultImage
        }
      },
      publisher: {
        '@type': 'Organization',
        name: 'Escola Habilidade',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: defaultImage
        }
      }
    };
    
    if (type === 'article') {
      baseSchema.headline = safeTitle;
      baseSchema.datePublished = publishedDate;
      baseSchema.dateModified = modifiedDate || publishedDate;
      baseSchema.mainEntityOfPage = {
        '@type': 'WebPage',
        '@id': fullUrl
      };
    }
    
    return baseSchema;
  };

  // Pre-render conditional elements to avoid React Helmet issues
  const keywordsMeta = safeKeywords ? <meta name="keywords" content={safeKeywords} /> : null;
  const robotsMeta = noindex ? <meta name="robots" content="noindex, nofollow" /> : null;
  
  const articleMetas = [];
  if (type === 'article' && publishedDate) {
    articleMetas.push(<meta key="published" property="article:published_time" content={publishedDate} />);
    if (modifiedDate) {
      articleMetas.push(<meta key="modified" property="article:modified_time" content={modifiedDate} />);
    }
    articleMetas.push(<meta key="author" property="article:author" content={safeAuthor} />);
    articleMetas.push(<meta key="section" property="article:section" content="Blog" />);
  }

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />
      {keywordsMeta}
      <meta name="author" content={safeAuthor} />
      
      <link rel="canonical" href={canonicalUrl} />
      
      {robotsMeta}
      
      <meta property="og:type" content={type} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Escola Habilidade" />
      <meta property="og:locale" content="pt_BR" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@escolahabilidade" />
      <meta name="twitter:creator" content="@escolahabilidade" />
      
      {articleMetas}
      
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#d400ff" />
      
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchemaData()) }}
      />
    </Helmet>
  );
};

export default SEOHead;