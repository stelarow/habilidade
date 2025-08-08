// Conditional import to avoid Supabase loading during build time
let blogAPI = null;

const loadBlogAPI = async () => {
  if (!blogAPI) {
    try {
      const module = await import('../services/blogAPI.js');
      blogAPI = module.blogAPI || module.default;
    } catch (error) {
      console.warn('Failed to load blogAPI:', error);
      return null;
    }
  }
  return blogAPI;
};

/**
 * Sitemap Generator for SEO optimization
 * Generates dynamic sitemap.xml based on published blog posts
 */

// Static pages configuration
const STATIC_PAGES = [
  {
    url: '/',
    priority: 1.0,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/blog',
    priority: 0.8,
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// SEO Local pages
const SEO_LOCAL_PAGES = [
  {
    url: '/cursos-florianopolis',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/cursos-sao-jose',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/cursos-palhoca',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Course pages - these should match your course structure
const COURSE_PAGES = [
  'informatica',
  'projetista-3d',
  'design-grafico',
  'programacao',
  'marketing-digital',
  'edicao-video',
  'business-intelligence',
  'inteligencia-artificial',
  'sketchup-enscape'
].map(slug => ({
  url: `/cursos/${slug}`,
  priority: 0.9,
  changefreq: 'monthly',
  lastmod: new Date().toISOString().split('T')[0]
}));

/**
 * Format date for sitemap (YYYY-MM-DD format)
 */
const formatSitemapDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.warn('Invalid date format:', dateString);
    return new Date().toISOString().split('T')[0];
  }
};

/**
 * Get priority based on content type and date
 */
const getContentPriority = (post) => {
  const now = new Date();
  const postDate = new Date(post.publishedAt || post.createdAt);
  const daysDiff = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
  
  // Higher priority for newer posts
  if (daysDiff <= 7) return 0.9;      // Last week
  if (daysDiff <= 30) return 0.8;     // Last month
  if (daysDiff <= 90) return 0.7;     // Last 3 months
  return 0.6;                         // Older posts
};

/**
 * Get change frequency based on content type
 */
const getChangeFrequency = (post) => {
  // Blog posts typically don't change after publication
  return 'monthly';
};

/**
 * Generate sitemap entry for a single URL
 */
const generateSitemapEntry = ({ url, priority, changefreq, lastmod }) => {
  const baseUrl = 'https://www.escolahabilidade.com';
  
  return `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};

/**
 * Fetch all published blog posts for sitemap
 */
const fetchBlogPosts = async () => {
  try {
    const api = await loadBlogAPI();
    if (!api) return [];
    
    // Fetch all posts (large limit to get everything)
    const response = await api.getAllPosts(1, 1000);
    
    if (response?.posts) {
      return response.posts.filter(post => 
        post.publishedAt && post.slug
      );
    }
    
    return [];
  } catch (error) {
    console.warn('Failed to fetch blog posts for sitemap:', error);
    return [];
  }
};

/**
 * Fetch all categories for sitemap
 */
const fetchCategories = async () => {
  try {
    const api = await loadBlogAPI();
    if (!api) return [];
    
    const response = await api.getCategories();
    
    if (response?.categories) {
      return response.categories.filter(category => category.slug);
    }
    
    return [];
  } catch (error) {
    console.warn('Failed to fetch categories for sitemap:', error);
    return [];
  }
};

/**
 * Generate complete sitemap XML
 */
export const generateSitemap = async () => {
  try {
    console.log('Generating sitemap...');
    
    // Fetch dynamic content
    const [blogPosts, categories] = await Promise.all([
      fetchBlogPosts(),
      fetchCategories()
    ]);
    
    // Combine all URLs
    const allUrls = [
      // Static pages
      ...STATIC_PAGES,
      
      // Course pages
      ...COURSE_PAGES,
      
      // SEO Local pages
      ...SEO_LOCAL_PAGES,
      
      // Blog post pages
      ...blogPosts.map(post => ({
        url: `/blog/${post.slug}`,
        priority: getContentPriority(post),
        changefreq: getChangeFrequency(post),
        lastmod: formatSitemapDate(post.publishedAt || post.createdAt)
      })),
      
      // Category pages
      ...categories.map(category => ({
        url: `/blog/categoria/${category.slug}`,
        priority: 0.7,
        changefreq: 'weekly',
        lastmod: new Date().toISOString().split('T')[0]
      }))
    ];
    
    // Generate XML
    const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    const sitemapFooter = `</urlset>`;
    
    const sitemapEntries = allUrls
      .map(generateSitemapEntry)
      .join('\n');
    
    const fullSitemap = `${sitemapHeader}
${sitemapEntries}
${sitemapFooter}`;
    
    console.log(`Sitemap generated with ${allUrls.length} URLs:`, {
      static: STATIC_PAGES.length,
      courses: COURSE_PAGES.length,
      seoLocal: SEO_LOCAL_PAGES.length,
      posts: blogPosts.length,
      categories: categories.length
    });
    
    return fullSitemap;
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap with just static pages
    const fallbackUrls = [...STATIC_PAGES, ...COURSE_PAGES, ...SEO_LOCAL_PAGES];
    const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    const sitemapFooter = `</urlset>`;
    const sitemapEntries = fallbackUrls.map(generateSitemapEntry).join('\n');
    
    return `${sitemapHeader}
${sitemapEntries}
${sitemapFooter}`;
  }
};

/**
 * Save sitemap to public directory
 */
export const saveSitemap = async (outputPath = '/public/sitemap.xml') => {
  try {
    const sitemapContent = await generateSitemap();
    
    // In a Vite environment, we need to write to the public directory
    // This would typically be done during build process
    if (typeof window === 'undefined') {
      // Server-side or build-time execution
      const fs = await import('fs');
      const path = await import('path');
      
      const fullPath = path.resolve(process.cwd(), outputPath.replace('/public/', 'public/'));
      await fs.promises.writeFile(fullPath, sitemapContent, 'utf8');
      
      console.log(`Sitemap saved to: ${fullPath}`);
      return fullPath;
    } else {
      // Client-side - return content for download
      return sitemapContent;
    }
    
  } catch (error) {
    console.error('Error saving sitemap:', error);
    throw error;
  }
};

/**
 * Generate sitemap for build process integration
 */
export const buildTimeSitemapGeneration = async () => {
  try {
    const sitemap = await generateSitemap();
    
    // Create a data URL for the sitemap
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    return {
      content: sitemap,
      url,
      filename: 'sitemap.xml'
    };
    
  } catch (error) {
    console.error('Build-time sitemap generation failed:', error);
    throw error;
  }
};

/**
 * Validate sitemap XML
 */
export const validateSitemap = (sitemapXml) => {
  const errors = [];
  
  // Basic XML structure validation
  if (!sitemapXml.includes('<?xml version="1.0"')) {
    errors.push('Missing XML declaration');
  }
  
  if (!sitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    errors.push('Missing or invalid urlset declaration');
  }
  
  if (!sitemapXml.includes('</urlset>')) {
    errors.push('Missing closing urlset tag');
  }
  
  // Count URLs
  const urlMatches = sitemapXml.match(/<url>/g);
  const urlCount = urlMatches ? urlMatches.length : 0;
  
  if (urlCount === 0) {
    errors.push('No URLs found in sitemap');
  }
  
  // Check for required elements
  const locMatches = sitemapXml.match(/<loc>/g);
  const locCount = locMatches ? locMatches.length : 0;
  
  if (locCount !== urlCount) {
    errors.push('Mismatch between URL count and location count');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    stats: {
      totalUrls: urlCount,
      totalLocations: locCount
    }
  };
};

export default {
  generateSitemap,
  saveSitemap,
  buildTimeSitemapGeneration,
  validateSitemap
};