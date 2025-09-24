/**
 * SEO-First Sitemap Generator
 * Uses local JSON data files instead of network calls for reliable SSG builds
 */

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
    url: '/contato',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/blog',
    priority: 0.8,
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/teste-vocacional',
    priority: 0.9,
    changefreq: 'weekly',
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
  'excel-avancado-business-intelligence',
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

// Static blog slugs (matches routes.jsx blogSlugs array for SSG compatibility)
const BLOG_SLUGS = [
  'guia-completo-21-estilos-decoracao-transformar-casa',
  'por-que-enscape-essencial-visualizacao-arquitetonica',
  'o-que-e-sketchup-guia-completo-modelagem-3d-2025',
  'historia-sketchup-software-arquitetura',
  'design-espacos-varejo-sketchup-pro',
  'sketchup-arquitetura-paisagistica',
  'tipos-puxadores-moveis',
  'sketchup-workflows-avancados-arquitetura-paisagistica',
  'como-usar-sketchup-para-design-conceitual-arquitetonico',
  'dominando-shape-bender-curvando-geometrias-sketchup',
  'como-construir-seu-primeiro-agente-ia-n8n',
  'cinco-maneiras-maximizar-vistas-magnificas-casas-personalizadas',
  '10-dicas-especialistas-renderizacoes-enscape-destaque',
  'como-apresentar-projetos-design-interior-sketchup',
  'acelerando-workflow-grey-boxing-sketchup',
  '10-extensoes-sketchup-arquitetos',
  'editor-materiais-sketchup-realismo-enscape',
  'guia-completo-enscape-sketchup-iniciantes',
  'sketchup-2025-visualizacao-3d-materiais-fotorrealistas',
  '5-razoes-organizacoes-investir-treinamento-excel',
  'transforme-dados-em-decisoes-estrategicas-dashboards-empresariais'
];

/**
 * Fetch all published blog posts for sitemap
 * Falls back to static slugs during build time for SSG compatibility
 */
const fetchBlogPosts = async () => {
  try {
    
    // Usa dados unificados do bundle otimizado
    const { BLOG_POSTS, BLOG_SLUGS: unifiedSlugs } = await import('../data/posts/index.js');
    
    const posts = unifiedSlugs.map((slug) => {
      try {
        const postData = BLOG_POSTS[slug];
        
        if (postData && postData.post) {
          return {
            slug: postData.post.slug,
            title: postData.post.title,
            publishedAt: postData.post.publishedAt,
            createdAt: postData.post.createdAt,
            updatedAt: postData.post.updatedAt,
            category: postData.post.category
          };
        } else {
          console.warn(`Post data not found for ${slug}, using fallback`);
          return {
            slug,
            publishedAt: new Date('2025-01-01').toISOString(),
            createdAt: new Date('2025-01-01').toISOString()
          };
        }
      } catch (error) {
        console.warn(`Failed to process post data for ${slug}, using fallback:`, error.message);
        return {
          slug,
          publishedAt: new Date('2025-01-01').toISOString(),
          createdAt: new Date('2025-01-01').toISOString()
        };
      }
    });
    
    return posts.filter(post => post.slug);
    
  } catch (error) {
    console.warn('Failed to fetch blog posts from unified bundle, using static slugs:', error);
    return getBlogPostsFromStaticSlugs();
  }
};

/**
 * Generate blog post objects from static slugs
 */
const getBlogPostsFromStaticSlugs = () => {
  return BLOG_SLUGS.map(slug => ({
    slug,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }));
};

/**
 * Fetch all categories for sitemap from unified bundle (optimized)
 */
const fetchCategories = async () => {
  try {
    
    // Usa dados unificados do bundle otimizado
    const { BLOG_POSTS } = await import('../data/posts/index.js');
    
    // Extract unique categories from unified posts data
    const categoriesMap = new Map();
    
    for (const [slug, postData] of Object.entries(BLOG_POSTS)) {
      try {
        if (postData.post?.category && postData.post.category.slug) {
          const category = postData.post.category;
          categoriesMap.set(category.slug, {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            color: category.color || '#3B82F6'
          });
        }
      } catch (error) {
        console.warn(`Failed to extract category from ${slug}:`, error.message);
      }
    }
    
    const categories = Array.from(categoriesMap.values());
    return categories;
    
  } catch (error) {
    console.warn('Failed to fetch categories from unified bundle:', error);
    return [];
  }
};

/**
 * Generate complete sitemap XML
 */
export const generateSitemap = async () => {
  try {
    
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