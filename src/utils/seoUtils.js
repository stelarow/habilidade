/**
 * SEO Utilities for Blog and Site-wide SEO Management
 * Comprehensive toolkit for optimizing search engine visibility
 */

// Base configuration
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.escolahabilidade.com'
  : 'http://localhost:5173';

const SITE_CONFIG = {
  name: 'Escola Habilidade',
  description: 'Desenvolva suas habilidades com cursos de tecnologia, design e negócios. Educação de qualidade para o mercado digital.',
  logo: `${BASE_URL}/logo-escola-habilidade.png`,
  twitter: '@escolahabilidade',
  facebook: 'escolahabilidade',
  linkedIn: 'escola-habilidade'
};

/**
 * Generate comprehensive meta tags for Open Graph and Twitter Cards
 * @param {Object} options - Meta tag configuration
 * @returns {Object} Meta tags object
 */
export const generateMetaTags = ({
  title,
  description,
  url,
  image = null,
  type = 'website',
  publishedTime = null,
  modifiedTime = null,
  author = SITE_CONFIG.name,
  section = null,
  tags = []
}) => {
  const fullUrl = url?.startsWith('http') ? url : `${BASE_URL}${url || ''}`;
  const ogImage = image || SITE_CONFIG.logo;
  
  const metaTags = {
    // Basic Meta Tags
    title,
    description,
    author,
    
    // Open Graph
    'og:type': type,
    'og:title': title,
    'og:description': description,
    'og:url': fullUrl,
    'og:image': ogImage,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:site_name': SITE_CONFIG.name,
    'og:locale': 'pt_BR',
    
    // Twitter Cards
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': ogImage,
    'twitter:site': SITE_CONFIG.twitter,
    'twitter:creator': SITE_CONFIG.twitter,
    
    // Additional Meta
    'theme-color': '#d400ff',
    'format-detection': 'telephone=no'
  };
  
  // Article-specific meta tags
  if (type === 'article') {
    if (publishedTime) metaTags['article:published_time'] = publishedTime;
    if (modifiedTime) metaTags['article:modified_time'] = modifiedTime;
    if (author) metaTags['article:author'] = author;
    if (section) metaTags['article:section'] = section;
    if (tags.length > 0) {
      tags.forEach((tag, index) => {
        metaTags[`article:tag:${index}`] = tag;
      });
    }
  }
  
  return metaTags;
};

/**
 * Generate JSON-LD structured data for articles
 * @param {Object} article - Article data
 * @returns {Object} JSON-LD structured data
 */
export const generateStructuredData = ({
  title,
  description,
  url,
  image,
  author = SITE_CONFIG.name,
  publishedDate,
  modifiedDate,
  category = null,
  tags = [],
  readingTime = null,
  wordCount = null
}) => {
  const fullUrl = url?.startsWith('http') ? url : `${BASE_URL}${url || ''}`;
  const ogImage = image || SITE_CONFIG.logo;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: [ogImage],
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': 'Organization',
      name: author,
      url: BASE_URL
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.logo
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    },
    url: fullUrl
  };
  
  // Optional fields
  if (category) {
    structuredData.articleSection = category;
  }
  
  if (tags.length > 0) {
    structuredData.keywords = tags.join(', ');
  }
  
  if (readingTime) {
    structuredData.timeRequired = `PT${readingTime}M`;
  }
  
  if (wordCount) {
    structuredData.wordCount = wordCount;
  }
  
  return structuredData;
};

/**
 * Generate canonical URL
 * @param {string} path - URL path
 * @param {Object} options - Canonical URL options
 * @returns {string} Canonical URL
 */
export const generateCanonicalUrl = (path = '', options = {}) => {
  const { 
    removeParams = false,
    forceDomain = null 
  } = options;
  
  const baseDomain = forceDomain || BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  let canonicalUrl = `${baseDomain}${cleanPath}`;
  
  // Remove query parameters if requested
  if (removeParams) {
    canonicalUrl = canonicalUrl.split('?')[0];
  }
  
  // Remove trailing slash except for root
  if (canonicalUrl !== baseDomain && canonicalUrl.endsWith('/')) {
    canonicalUrl = canonicalUrl.slice(0, -1);
  }
  
  return canonicalUrl;
};

/**
 * Sanitize and optimize title for SEO
 * @param {string} title - Raw title
 * @param {Object} options - Title options
 * @returns {string} Optimized title
 */
export const sanitizeTitle = (title, options = {}) => {
  const { 
    maxLength = 60,
    suffix = ' - Escola Habilidade',
    removeSuffix = false
  } = options;
  
  if (!title) return SITE_CONFIG.name;
  
  // Clean title
  let cleanTitle = title
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^\w\s\-\u00C0-\u017F]/g, ''); // Allow accented characters
  
  // Add suffix if not present and not removing
  if (!removeSuffix && !cleanTitle.includes(suffix.replace(' - ', ''))) {
    cleanTitle += suffix;
  }
  
  // Truncate if too long
  if (cleanTitle.length > maxLength) {
    const withoutSuffix = cleanTitle.replace(suffix, '');
    const maxContentLength = maxLength - suffix.length;
    
    if (withoutSuffix.length > maxContentLength) {
      cleanTitle = withoutSuffix.substring(0, maxContentLength).trim() + '...' + suffix;
    }
  }
  
  return cleanTitle;
};

/**
 * Truncate and optimize description for SEO
 * @param {string} description - Raw description
 * @param {Object} options - Description options
 * @returns {string} Optimized description
 */
export const truncateDescription = (description, options = {}) => {
  const { 
    maxLength = 160,
    preserveWords = true 
  } = options;
  
  if (!description) return SITE_CONFIG.description;
  
  // Clean description
  let cleanDesc = description
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/<[^>]*>/g, ''); // Remove HTML tags
  
  if (cleanDesc.length <= maxLength) {
    return cleanDesc;
  }
  
  if (preserveWords) {
    // Find last complete word within limit
    const truncated = cleanDesc.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) { // Only if we don't lose too much
      return truncated.substring(0, lastSpace) + '...';
    }
  }
  
  return cleanDesc.substring(0, maxLength - 3) + '...';
};

/**
 * Generate breadcrumb structured data
 * @param {Array} breadcrumbs - Breadcrumb items
 * @returns {Object} Breadcrumb JSON-LD
 */
export const generateBreadcrumbStructuredData = (breadcrumbs = []) => {
  if (!breadcrumbs.length) return null;
  
  const itemListElement = breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.label,
    item: crumb.path?.startsWith('http') ? crumb.path : `${BASE_URL}${crumb.path}`
  }));
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };
};

/**
 * Extract keywords from content
 * @param {string} content - Article content
 * @param {Object} options - Extraction options
 * @returns {Array} Array of keywords
 */
export const extractKeywords = (content, options = {}) => {
  const { 
    maxKeywords = 10,
    minLength = 3,
    excludeCommon = true 
  } = options;
  
  if (!content) return [];
  
  // Common Portuguese stop words to exclude
  const stopWords = excludeCommon ? [
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'para', 'por', 'com', 'sem', 'sob', 'sobre', 'ante', 'ap�s',
    'que', 'se', 'quando', 'onde', 'como', 'porque', 'mas', 'mais',
    'muito', 'bem', 'j�', 'ainda', 'tamb�m', 's�', 'at�', 'desde'
  ] : [];
  
  // Extract words
  const words = content
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // Remove HTML
    .replace(/[^\w\s�-�]/g, ' ') // Keep only letters and accented chars
    .split(/\s+/)
    .filter(word => 
      word.length >= minLength && 
      !stopWords.includes(word) &&
      !/^\d+$/.test(word) // Exclude pure numbers
    );
  
  // Count frequency
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

/**
 * Generate sitemap entry for a page
 * @param {Object} page - Page data
 * @returns {Object} Sitemap entry
 */
export const generateSitemapEntry = ({
  url,
  lastmod = new Date().toISOString(),
  changefreq = 'monthly',
  priority = 0.5
}) => {
  const fullUrl = url?.startsWith('http') ? url : `${BASE_URL}${url}`;
  
  return {
    loc: fullUrl,
    lastmod: lastmod.split('T')[0], // YYYY-MM-DD format
    changefreq,
    priority: Math.min(Math.max(priority, 0.0), 1.0) // Clamp between 0-1
  };
};

/**
 * Validate SEO requirements
 * @param {Object} pageData - Page SEO data
 * @returns {Object} Validation result
 */
export const validateSEO = (pageData) => {
  const { title, description, url, image } = pageData;
  const issues = [];
  const warnings = [];
  
  // Title validation
  if (!title) {
    issues.push('Title is required');
  } else {
    if (title.length < 30) warnings.push('Title is quite short (recommended: 30-60 chars)');
    if (title.length > 60) warnings.push('Title is too long (recommended: 30-60 chars)');
  }
  
  // Description validation
  if (!description) {
    issues.push('Description is required');
  } else {
    if (description.length < 120) warnings.push('Description is short (recommended: 120-160 chars)');
    if (description.length > 160) warnings.push('Description is too long (recommended: 120-160 chars)');
  }
  
  // URL validation
  if (!url) {
    warnings.push('URL not provided for canonical link');
  }
  
  // Image validation
  if (!image) {
    warnings.push('No featured image provided for social sharing');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, 100 - (issues.length * 25) - (warnings.length * 5))
  };
};

/**
 * Generate robots meta content
 * @param {Object} options - Robots options
 * @returns {string} Robots meta content
 */
export const generateRobotsMeta = (options = {}) => {
  const {
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false,
    noimageindex = false,
    maxSnippet = null,
    maxImagePreview = null
  } = options;
  
  const directives = [];
  
  directives.push(index ? 'index' : 'noindex');
  directives.push(follow ? 'follow' : 'nofollow');
  
  if (noarchive) directives.push('noarchive');
  if (nosnippet) directives.push('nosnippet');
  if (noimageindex) directives.push('noimageindex');
  if (maxSnippet) directives.push(`max-snippet:${maxSnippet}`);
  if (maxImagePreview) directives.push(`max-image-preview:${maxImagePreview}`);
  
  return directives.join(', ');
};

// Export constants for external use
export { BASE_URL, SITE_CONFIG };