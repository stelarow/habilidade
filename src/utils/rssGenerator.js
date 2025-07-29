/**
 * RSS Feed Generator for Blog
 * 
 * Geração automática de RSS feed RSS 2.0 compliant
 * para integração com o processo de build do Vite
 */

// Configurações do RSS
const RSS_CONFIG = {
  title: 'Escola Habilidade - Blog',
  description: 'Artigos sobre tecnologia, educação, carreira e desenvolvimento profissional',
  link: 'https://www.escolahabilidade.com.br',
  feedUrl: 'https://www.escolahabilidade.com.br/rss.xml',
  language: 'pt-BR',
  copyright: `© ${new Date().getFullYear()} Escola Habilidade. Todos os direitos reservados.`,
  managingEditor: 'blog@escolahabilidade.com.br (Escola Habilidade)',
  webMaster: 'contato@escolahabilidade.com.br (Escola Habilidade)',
  category: 'Education/Technology',
  ttl: 60, // minutos
  maxItems: 20,
  includeFullContent: true, // ou false para apenas excerpt
  generator: 'Escola Habilidade RSS Generator v1.0'
};

/**
 * Escapa caracteres XML especiais
 */
const escapeXml = (text) => {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Formata data para RFC-2822 (exigido pelo RSS)
 */
const formatRSSDate = (date) => {
  const d = new Date(date);
  return d.toUTCString();
};

/**
 * Extrai texto limpo de HTML
 */
const stripHtml = (html) => {
  if (!html) return '';
  
  // Remove tags HTML mas preserva quebras de linha
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Gera descrição/excerpt para o item RSS
 */
const generateDescription = (post, includeFullContent = false) => {
  if (includeFullContent && post.content) {
    return escapeXml(post.content);
  }
  
  // Usa excerpt se disponível, senão cria um do conteúdo
  let description = post.excerpt || post.content || '';
  
  if (!post.excerpt && post.content) {
    // Extrai primeiros 300 caracteres como excerpt
    const cleanText = stripHtml(post.content);
    description = cleanText.length > 300 
      ? cleanText.substring(0, 300) + '...'
      : cleanText;
  }
  
  return escapeXml(description);
};

/**
 * Gera enclosure para imagens (RSS media)
 */
const generateEnclosure = (imageUrl) => {
  if (!imageUrl) return '';
  
  // Determina tipo MIME baseado na extensão
  const extension = imageUrl.split('.').pop().toLowerCase();
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp'
  };
  
  const mimeType = mimeTypes[extension] || 'image/jpeg';
  
  return `
    <enclosure url="${escapeXml(imageUrl)}" type="${mimeType}" length="0" />`;
};

/**
 * Gera item RSS individual
 */
const generateRSSItem = (post, config) => {
  const pubDate = formatRSSDate(post.created_at || post.published_at || new Date());
  const postUrl = `${config.link}/blog/${post.slug}`;
  const description = generateDescription(post, config.includeFullContent);
  const enclosure = post.featured_image_url ? generateEnclosure(post.featured_image_url) : '';
  
  // Categorias/tags
  const categories = [];
  if (post.categories) {
    post.categories.forEach(cat => {
      categories.push(`<category>${escapeXml(cat.name || cat)}</category>`);
    });
  }
  if (post.tags) {
    post.tags.forEach(tag => {
      categories.push(`<category>${escapeXml(tag)}</category>`);
    });
  }
  
  // GUID único para o post
  const guid = post.id ? `${config.link}/blog/post/${post.id}` : postUrl;
  
  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${escapeXml(guid)}</guid>
      ${post.author_name ? `<author>blog@escolahabilidade.com.br (${escapeXml(post.author_name)})</author>` : ''}
      ${categories.join('\n      ')}
      ${enclosure}
    </item>`;
};

/**
 * Gera o feed RSS completo
 */
const generateRSSFeed = (posts, config = RSS_CONFIG) => {
  const buildDate = formatRSSDate(new Date());
  const lastBuildDate = posts.length > 0 
    ? formatRSSDate(posts[0].created_at || posts[0].published_at || new Date())
    : buildDate;
  
  // Ordena posts por data (mais recentes primeiro) e limita quantidade
  const sortedPosts = posts
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.published_at || 0);
      const dateB = new Date(b.created_at || b.published_at || 0);
      return dateB - dateA;
    })
    .slice(0, config.maxItems);
  
  // Gera itens RSS
  const rssItems = sortedPosts
    .map(post => generateRSSItem(post, config))
    .join('\n');
  
  // Template RSS 2.0 completo
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.title)}</title>
    <link>${escapeXml(config.link)}</link>
    <description>${escapeXml(config.description)}</description>
    <language>${config.language}</language>
    <copyright>${escapeXml(config.copyright)}</copyright>
    <managingEditor>${escapeXml(config.managingEditor)}</managingEditor>
    <webMaster>${escapeXml(config.webMaster)}</webMaster>
    <category>${escapeXml(config.category)}</category>
    <generator>${escapeXml(config.generator)}</generator>
    <ttl>${config.ttl}</ttl>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <atom:link href="${escapeXml(config.feedUrl)}" rel="self" type="application/rss+xml" />
    
    <image>
      <url>${config.link}/favicon.ico</url>
      <title>${escapeXml(config.title)}</title>
      <link>${escapeXml(config.link)}</link>
      <width>32</width>
      <height>32</height>
    </image>
    ${rssItems}
  </channel>
</rss>`;
};

/**
 * Valida feed RSS contra especificação RSS 2.0
 */
const validateRSSFeed = (rssXml) => {
  const errors = [];
  const warnings = [];
  
  // Verificações básicas de estrutura
  if (!rssXml.includes('<rss version="2.0"')) {
    errors.push('RSS version 2.0 não especificada');
  }
  
  if (!rssXml.includes('<channel>')) {
    errors.push('Elemento <channel> obrigatório não encontrado');
  }
  
  if (!rssXml.includes('<title>')) {
    errors.push('Elemento <title> obrigatório não encontrado');
  }
  
  if (!rssXml.includes('<link>')) {
    errors.push('Elemento <link> obrigatório não encontrado');
  }
  
  if (!rssXml.includes('<description>')) {
    errors.push('Elemento <description> obrigatório não encontrado');
  }
  
  // Verificações de qualidade
  const itemCount = (rssXml.match(/<item>/g) || []).length;
  if (itemCount === 0) {
    warnings.push('Nenhum item encontrado no feed');
  } else if (itemCount > 50) {
    warnings.push(`Muitos itens no feed (${itemCount}). Recomendado: máximo 20-30`);
  }
  
  // Verifica se tem imagem do feed
  if (!rssXml.includes('<image>')) {
    warnings.push('Imagem do feed não especificada (recomendado para melhor apresentação)');
  }
  
  // Verifica atom:link para autodiscovery
  if (!rssXml.includes('atom:link')) {
    warnings.push('Link atom:link não especificado (recomendado para autodiscovery)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    itemCount
  };
};

/**
 * Gera estatísticas do feed RSS
 */
const generateFeedStats = (posts, rssXml) => {
  const validation = validateRSSFeed(rssXml);
  
  const categoryCount = {};
  const authorCount = {};
  
  posts.forEach(post => {
    // Conta categorias
    if (post.categories) {
      post.categories.forEach(cat => {
        const catName = cat.name || cat;
        categoryCount[catName] = (categoryCount[catName] || 0) + 1;
      });
    }
    
    // Conta autores
    if (post.author_name) {
      authorCount[post.author_name] = (authorCount[post.author_name] || 0) + 1;
    }
  });
  
  return {
    totalPosts: posts.length,
    itemsInFeed: validation.itemCount,
    feedSize: (rssXml.length / 1024).toFixed(2) + ' KB',
    categories: Object.keys(categoryCount).length,
    authors: Object.keys(authorCount).length,
    topCategories: Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    topAuthors: Object.entries(authorCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count })),
    validation
  };
};

/**
 * Salva feed RSS em arquivo (para uso no build)
 */
const saveRSSFeed = async (rssXml, outputPath = './public/rss.xml') => {
  try {
    // Em ambiente Node.js
    if (typeof window === 'undefined') {
      const fs = require('fs').promises;
      const path = require('path');
      
      // Garante que o diretório existe
      const dir = path.dirname(outputPath);
      await fs.mkdir(dir, { recursive: true });
      
      // Escreve o arquivo
      await fs.writeFile(outputPath, rssXml, 'utf8');
      
      console.log(` RSS feed salvo em: ${outputPath}`);
      return true;
    }
    
    // Em ambiente browser, retorna o XML para download manual
    console.warn('  Ambiente browser: RSS feed gerado em memória apenas');
    return rssXml;
    
  } catch (error) {
    console.error('L Erro ao salvar RSS feed:', error);
    return false;
  }
};

/**
 * Gera RSS feed a partir de dados de posts
 */
const generateBlogRSS = async (posts, options = {}) => {
  const config = { ...RSS_CONFIG, ...options };
  
  try {
    console.log(`= Gerando RSS feed com ${posts.length} posts...`);
    
    // Gera o XML
    const rssXml = generateRSSFeed(posts, config);
    
    // Valida o feed
    const validation = validateRSSFeed(rssXml);
    
    if (!validation.valid) {
      console.error('L RSS feed inválido:', validation.errors);
      return null;
    }
    
    if (validation.warnings.length > 0) {
      console.warn('  Avisos RSS:', validation.warnings);
    }
    
    // Gera estatísticas
    const stats = generateFeedStats(posts, rssXml);
    console.log('=Ê Estatísticas do RSS:', stats);
    
    // Salva o arquivo se especificado
    if (options.outputPath) {
      await saveRSSFeed(rssXml, options.outputPath);
    }
    
    console.log(' RSS feed gerado com sucesso!');
    
    return {
      xml: rssXml,
      stats,
      validation,
      size: rssXml.length
    };
    
  } catch (error) {
    console.error('L Erro ao gerar RSS feed:', error);
    return null;
  }
};

/**
 * Plugin Vite para geração automática do RSS
 */
const viteRSSPlugin = (options = {}) => {
  return {
    name: 'rss-generator',
    
    async buildStart() {
      console.log('=€ Plugin RSS iniciado');
    },
    
    async generateBundle() {
      try {
        // Em produção, carregaria posts de uma API ou arquivo
        // Para demo, usar posts mock ou carregar de src/data
        const { getBlogPosts } = await import('../data/blogPosts.js').catch(() => ({
          getBlogPosts: () => []
        }));
        
        const posts = getBlogPosts();
        
        if (posts.length === 0) {
          console.warn('  Nenhum post encontrado para RSS');
          return;
        }
        
        const rssResult = await generateBlogRSS(posts, {
          ...options,
          outputPath: './public/rss.xml'
        });
        
        if (rssResult) {
          // Adiciona o RSS como asset do bundle
          this.emitFile({
            type: 'asset',
            fileName: 'rss.xml',
            source: rssResult.xml
          });
        }
        
      } catch (error) {
        console.error('L Erro no plugin RSS:', error);
      }
    }
  };
};

/**
 * Hook React para integração com componentes
 */
const useRSSFeed = () => {
  const generateFeed = async (posts, options = {}) => {
    return await generateBlogRSS(posts, options);
  };
  
  const downloadFeed = (rssXml, filename = 'feed.xml') => {
    const blob = new Blob([rssXml], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return {
    generateFeed,
    downloadFeed,
    validateFeed: validateRSSFeed,
    config: RSS_CONFIG
  };
};

// Exportações
export {
  generateBlogRSS,
  generateRSSFeed,
  validateRSSFeed,
  generateFeedStats,
  saveRSSFeed,
  viteRSSPlugin,
  useRSSFeed,
  RSS_CONFIG,
  escapeXml,
  formatRSSDate
};

export default generateBlogRSS;