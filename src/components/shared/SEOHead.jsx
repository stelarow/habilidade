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
  description = 'Transforme sua carreira com cursos de tecnologia, design e neg�cios. Educa��o de qualidade para o mercado digital.',
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
  // Base URL - adjust for production
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://escolahabilidade.com.br'
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
      name: title,
      description: description,
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
      baseSchema.headline = title;
      baseSchema.datePublished = publishedDate;
      baseSchema.dateModified = modifiedDate || publishedDate;
      baseSchema.mainEntityOfPage = {
        '@type': 'WebPage',
        '@id': fullUrl
      };
    }
    
    return baseSchema;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Escola Habilidade" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@escolahabilidade" />
      <meta name="twitter:creator" content="@escolahabilidade" />
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedDate && (
        <>
          <meta property="article:published_time" content={publishedDate} />
          {modifiedDate && (
            <meta property="article:modified_time" content={modifiedDate} />
          )}
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Blog" />
        </>
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#d400ff" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchemaData())}
      </script>
    </Helmet>
  );
};

export default SEOHead;