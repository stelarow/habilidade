import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';

// Import only the languages we need to keep bundle size small
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);

// Configure marked with custom renderer for v16 - consolidated configuration
marked.use({
  renderer: {
    // Override heading rendering to add Tailwind classes
    heading(text, level) {
      const classes = {
        1: 'text-4xl md:text-5xl font-bold text-white mb-6 mt-8',
        2: 'text-3xl md:text-4xl font-bold text-white mb-4 mt-8',
        3: 'text-2xl md:text-3xl font-semibold text-white mb-4 mt-6',
        4: 'text-xl md:text-2xl font-semibold text-white mb-3 mt-6',
        5: 'text-lg md:text-xl font-semibold text-white mb-3 mt-4',
        6: 'text-base md:text-lg font-semibold text-white mb-2 mt-4'
      };
      
      const className = classes[level] || classes[6];
      const safeText = String(text || '');
      const id = safeText.toLowerCase().replace(/[^\w]+/g, '-');
      
      return `<h${level} id="${id}" class="${className}">${safeText}</h${level}>`;
    },

    // Override paragraph rendering
    paragraph(text) {
      const safeText = String(text || '');
      return `<p class="text-gray-300 mb-4 leading-relaxed">${safeText}</p>`;
    },

    // Override list rendering
    list(body, ordered) {
      const safeBody = String(body || '');
      const tag = ordered ? 'ol' : 'ul';
      const className = ordered 
        ? 'list-decimal list-inside text-gray-300 mb-4 space-y-2 ml-4' 
        : 'list-disc list-inside text-gray-300 mb-4 space-y-2 ml-4';
      
      return `<${tag} class="${className}">${safeBody}</${tag}>`;
    },

    // Override list item rendering
    listitem(text) {
      const safeText = String(text || '');
      return `<li class="mb-1">${safeText}</li>`;
    },

    // Override blockquote rendering
    blockquote(quote) {
      const safeQuote = String(quote || '');
      return `<blockquote class="border-l-4 border-blue-500 pl-4 py-2 bg-zinc-800/50 rounded-r-lg mb-4 italic text-gray-300">${safeQuote}</blockquote>`;
    },

    // Override code block rendering
    code(code, infostring, escaped) {
      const safeCode = String(code || '');
      const lang = String(infostring || '').match(/\S*/)[0];
      
      return `<div class="bg-zinc-900 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre class="text-sm"><code class="hljs language-${lang || 'plaintext'}">${safeCode}</code></pre>
      </div>`;
    },

    // Override inline code rendering
    codespan(text) {
      const safeText = String(text || '');
      return `<code class="bg-zinc-800 text-blue-300 px-2 py-1 rounded text-sm">${safeText}</code>`;
    },

    // Override image rendering with Tailwind classes and error handling
    image(href, title, text) {
      const safeHref = String(href || '');
      const safeTitle = String(title || '');
      const safeText = String(text || '');
      const titleAttr = safeTitle ? ` title="${safeTitle}"` : '';
      const altAttr = safeText ? ` alt="${safeText}"` : '';
      
      return `<div class="mb-6">
        <img src="${safeHref}" class="w-full rounded-lg shadow-lg"${altAttr}${titleAttr} 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
        <div class="hidden bg-zinc-800 rounded-lg p-4 text-center">
          <div class="text-gray-400 text-sm">Imagem não encontrada: ${safeText || 'Sem descrição'}</div>
        </div>
        ${safeText ? `<p class="text-gray-500 text-sm text-center mt-2 italic">${safeText}</p>` : ''}
      </div>`;
    },

    // Override strong (bold) rendering
    strong(text) {
      const safeText = String(text || '');
      return `<strong class="font-bold text-white">${safeText}</strong>`;
    },

    // Override emphasis (italic) rendering
    em(text) {
      const safeText = String(text || '');
      return `<em class="italic text-gray-200">${safeText}</em>`;
    },

    // Override link rendering
    link(href, title, text) {
      const safeHref = String(href || '');
      const safeTitle = String(title || '');
      const safeText = String(text || '');
      const titleAttr = safeTitle ? ` title="${safeTitle}"` : '';
      const target = safeHref.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      
      return `<a href="${safeHref}" class="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"${titleAttr}${target}>${safeText}</a>`;
    },

    // Override horizontal rule rendering
    hr() {
      return '<hr class="border-zinc-700 my-8" />';
    },

    // Override table rendering
    table(header, body) {
      const safeHeader = String(header || '');
      const safeBody = String(body || '');
      return `<div class="overflow-x-auto mb-6">
        <table class="min-w-full bg-zinc-800 rounded-lg overflow-hidden">
          <thead class="bg-zinc-700">${safeHeader}</thead>
          <tbody>${safeBody}</tbody>
        </table>
      </div>`;
    },

    tablerow(content) {
      const safeContent = String(content || '');
      return `<tr class="border-b border-zinc-700">${safeContent}</tr>`;
    },

    tablecell(content, flags) {
      const safeContent = String(content || '');
      const type = flags.header ? 'th' : 'td';
      const className = flags.header 
        ? 'px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
        : 'px-6 py-4 whitespace-nowrap text-sm text-gray-300';
      
      return `<${type} class="${className}">${safeContent}</${type}>`;
    }
  },
  
  // Highlight function integrated within marked.use()
  highlight: function(code, lang) {
    // Safely handle language parameter
    if (!lang || typeof lang !== 'string') {
      return code;
    }
    try {
      if (hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
    } catch (error) {
      console.warn('Highlight.js error:', error);
    }
    return code;
  },
  
  // Other marked options
  breaks: true,
  gfm: true,
  pedantic: false,
  silent: true
});

/**
 * Detects if content is markdown or HTML
 * @param {string} content - The content to analyze
 * @returns {boolean} - True if content appears to be markdown
 */
export function isMarkdown(content) {
  if (!content || typeof content !== 'string') return false;
  
  // Check for common HTML patterns first
  const htmlPatterns = [
    /<div[^>]*class=["'][^"']*["'][^>]*>/i,
    /<p[^>]*class=["'][^"']*["'][^>]*>/i,
    /<h[1-6][^>]*class=["'][^"']*["'][^>]*>/i,
    /<img[^>]*class=["'][^"']*["'][^>]*>/i,
    /<span[^>]*class=["'][^"']*["'][^>]*>/i
  ];
  
  // If content has HTML with classes, it's probably already formatted HTML
  if (htmlPatterns.some(pattern => pattern.test(content))) {
    return false;
  }
  
  // Check for markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s+/m,           // Headers with #
    /^\s*[\*\-\+]\s+/m,      // Unordered lists
    /^\s*\d+\.\s+/m,         // Ordered lists
    /\*\*[^*]+\*\*/,         // Bold text **text**
    /\*[^*]+\*/,             // Italic text *text*
    /\[[^\]]+\]\([^)]+\)/,   // Links [text](url)
    /!\[[^\]]*\]\([^)]+\)/,  // Images ![alt](url)
    /^>\s+/m,                // Blockquotes
    /```[\s\S]*?```/,        // Code blocks
    /`[^`]+`/                // Inline code
  ];
  
  // Count markdown patterns
  const markdownScore = markdownPatterns.reduce((score, pattern) => {
    return score + (pattern.test(content) ? 1 : 0);
  }, 0);
  
  // If we find multiple markdown patterns, it's likely markdown
  return markdownScore >= 2;
}

/**
 * Fixes image paths in content for a specific blog post slug
 * @param {string} content - The content containing image references
 * @param {string} slug - The blog post slug
 * @returns {string} - Content with fixed image paths
 */
export function fixImagePaths(content, slug) {
  if (!content || !slug) return content;
  
  let fixedContent = content;
  
  // Fix markdown image syntax: ![alt](/images/blog/filename.jpg)
  const markdownImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  fixedContent = fixedContent.replace(markdownImgRegex, (match, alt, src) => {
    if (src.startsWith('/images/blog/') && !src.includes(`/images/blog/${slug}/`)) {
      const filename = src.split('/').pop();
      const newSrc = `/images/blog/${slug}/${filename}`;
      return `![${alt}](${newSrc})`;
    }
    return match;
  });
  
  // Fix HTML image tags: <img src="/images/blog/filename.jpg" />
  const htmlImgRegex = /<img([^>]+)src=["']([^"']+)["']([^>]*)>/g;
  fixedContent = fixedContent.replace(htmlImgRegex, (match, before, src, after) => {
    if (src.startsWith('/images/blog/') && !src.includes(`/images/blog/${slug}/`)) {
      const filename = src.split('/').pop();
      const newSrc = `/images/blog/${slug}/${filename}`;
      return `<img${before}src="${newSrc}"${after}>`;
    }
    return match;
  });
  
  return fixedContent;
}

/**
 * Processes blog content - converts markdown to HTML if needed and fixes paths
 * @param {string} content - Raw content from the database
 * @param {string} slug - Blog post slug for image path fixing
 * @returns {string} - Processed HTML content ready for rendering
 */
export function processContent(content, slug) {
  if (!content || typeof content !== 'string') return '';
  
  // Import image migration system
  let processedContent = content;
  
  try {
    // Apply smart image optimization to existing content
    if (typeof window !== 'undefined') {
      // Client-side: use dynamic import to avoid SSR issues
      import('../utils/blogImageMigration.js').then(({ default: blogImageMigration }) => {
        processedContent = blogImageMigration.migrateBlogContent(processedContent);
      }).catch(console.error);
    }
  } catch (error) {
    console.warn('[ContentProcessor] Image migration failed, continuing with original content:', error);
  }
  
  // Fix image paths first
  processedContent = fixImagePaths(processedContent, slug);
  
  // Convert markdown to HTML if needed
  if (isMarkdown(processedContent)) {
    console.log('[ContentProcessor] Converting markdown to HTML for slug:', slug);
    console.log('[ContentProcessor] Content type:', typeof processedContent);
    console.log('[ContentProcessor] Content length:', processedContent.length);
    console.log('[ContentProcessor] First 200 chars:', processedContent.substring(0, 200));
    
    try {
      // Debug: Log marked configuration
      console.log('[ContentProcessor] Marked version:', marked.VERSION || 'unknown');
      console.log('[ContentProcessor] Marked options:', marked.defaults);
      
      processedContent = marked(processedContent);
    } catch (error) {
      console.error('[ContentProcessor] marked.js failed with error:', error);
      console.error('[ContentProcessor] Error stack:', error.stack);
      console.error('[ContentProcessor] Content that caused error:', processedContent);
      throw error; // Re-throw to see the full error
    }
  }
  
  // Apply client-side image optimization after content is processed
  if (typeof window !== 'undefined') {
    // Schedule image optimization for next tick to ensure DOM is ready
    setTimeout(() => {
      import('../utils/blogImageMigration.js').then(({ default: blogImageMigration }) => {
        blogImageMigration.optimizeExistingImages().then(results => {
          if (results.length > 0) {
            console.log(`✅ Otimizadas ${results.filter(r => r.optimized).length} de ${results.length} imagens`);
          }
        });
      }).catch(console.error);
    }, 100);
  }
  
  return processedContent;
}

/**
 * Basic markdown to HTML converter as fallback
 * @param {string} markdown - Markdown content
 * @returns {string} - Basic HTML
 */
function basicMarkdownToHtml(markdown) {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl md:text-3xl font-semibold text-white mb-4 mt-6">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl md:text-4xl font-bold text-white mb-4 mt-8">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl md:text-5xl font-bold text-white mb-6 mt-8">$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em class="italic text-gray-200">$1</em>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<div class="mb-6"><img src="$2" alt="$1" class="w-full rounded-lg shadow-lg" /><p class="text-gray-500 text-sm text-center mt-2 italic">$1</p></div>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline transition-colors duration-200">$1</a>')
    // Paragraphs (convert double newlines to paragraph tags)
    .replace(/\n\n/gim, '</p><p class="text-gray-300 mb-4 leading-relaxed">')
    // Wrap in initial paragraph tag
    .replace(/^(.*)/, '<p class="text-gray-300 mb-4 leading-relaxed">$1</p>');
}

/**
 * Extracts plain text from HTML/Markdown for reading time calculation
 * @param {string} content - HTML or Markdown content
 * @returns {string} - Plain text content
 */
export function extractPlainText(content) {
  if (!content || typeof content !== 'string') return '';
  
  // For markdown, use simple text extraction without parsing
  if (isMarkdown(content)) {
    return content
      // Remove markdown syntax
      .replace(/^#{1,6}\s+/gm, '') // Headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/`([^`]+)`/g, '$1') // Inline code
      .replace(/```[\s\S]*?```/g, '') // Code blocks
      .replace(/>\s+(.*)/g, '$1') // Blockquotes
      .replace(/^\s*[\*\-\+]\s+/gm, '') // Lists
      .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // For HTML content, remove tags and decode entities
  return content
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export default {
  isMarkdown,
  fixImagePaths,
  processContent,
  extractPlainText
};