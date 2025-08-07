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
  breadcrumbs = null,
  faqData = null,
  courseData = null,
  localBusinessData = null,
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
    const schemas = [];
    
    // Main schema
    if (schemaData) {
      schemas.push(schemaData);
    } else {
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
      
      schemas.push(baseSchema);
    }
    
    // Breadcrumbs schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.path}`
        }))
      });
    }
    
    // FAQ schema
    if (faqData && faqData.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqData.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      });
    }
    
    // Course schema
    if (courseData) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: courseData.name,
        description: courseData.description,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Escola Habilidade'
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: courseData.mode || 'https://schema.org/MixedEventAttendanceMode',
          courseWorkload: courseData.workload || 'PT40H'
        },
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: 'BRL',
          category: 'EducationalOccupationalCredential'
        }
      });
    }
    
    // Local Business schema
    if (localBusinessData) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: localBusinessData.name || 'Escola Habilidade',
        description: localBusinessData.description,
        address: localBusinessData.address,
        telephone: localBusinessData.telephone,
        areaServed: localBusinessData.areaServed,
        openingHours: localBusinessData.openingHours
      });
    }
    
    return schemas.length === 1 ? schemas[0] : schemas;
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
      
      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#d400ff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="msapplication-TileColor" content="#d400ff" />
      
      {/* Performance and Loading */}
      <link rel="preload" href="/assets/logos/original/logo-original.png" as="image" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* Language and Regional */}
      <meta httpEquiv="content-language" content="pt-br" />
      <meta name="geo.region" content="BR-SC" />
      <meta name="geo.placename" content="Florianópolis, Santa Catarina, Brasil" />
      <meta name="geo.position" content="-27.5858;-48.6117" />
      <meta name="ICBM" content="-27.5858, -48.6117" />
      
      {/* Verification */}
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      
      {/* JSON-LD Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchemaData()) }}
      />
    </Helmet>
  );
};

export default SEOHead;