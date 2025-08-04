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

// Custom renderer to add Tailwind classes
const renderer = new marked.Renderer();

// Override heading rendering to add Tailwind classes
renderer.heading = function(text, level) {
  const classes = {
    1: 'text-4xl md:text-5xl font-bold text-white mb-6 mt-8',
    2: 'text-3xl md:text-4xl font-bold text-white mb-4 mt-8',
    3: 'text-2xl md:text-3xl font-semibold text-white mb-4 mt-6',
    4: 'text-xl md:text-2xl font-semibold text-white mb-3 mt-6',
    5: 'text-lg md:text-xl font-semibold text-white mb-3 mt-4',
    6: 'text-base md:text-lg font-semibold text-white mb-2 mt-4'
  };
  
  const className = classes[level] || classes[6];
  const id = text.toLowerCase().replace(/[^\w]+/g, '-');
  
  return `<h${level} id="${id}" class="${className}">${text}</h${level}>`;
};

// Override paragraph rendering
renderer.paragraph = function(text) {
  return `<p class="text-gray-300 mb-4 leading-relaxed">${text}</p>`;
};

// Override list rendering
renderer.list = function(body, ordered) {
  const tag = ordered ? 'ol' : 'ul';
  const className = ordered 
    ? 'list-decimal list-inside text-gray-300 mb-4 space-y-2 ml-4' 
    : 'list-disc list-inside text-gray-300 mb-4 space-y-2 ml-4';
  
  return `<${tag} class="${className}">${body}</${tag}>`;
};

// Override list item rendering
renderer.listitem = function(text) {
  return `<li class="mb-1">${text}</li>`;
};

// Override blockquote rendering
renderer.blockquote = function(quote) {
  return `<blockquote class="border-l-4 border-blue-500 pl-4 py-2 bg-zinc-800/50 rounded-r-lg mb-4 italic text-gray-300">${quote}</blockquote>`;
};

// Override code block rendering
renderer.code = function(code, infostring, escaped) {
  const lang = (infostring || '').match(/\S*/)[0];
  
  return `<div class="bg-zinc-900 rounded-lg p-4 mb-4 overflow-x-auto">
    <pre class="text-sm"><code class="hljs language-${lang || 'plaintext'}">${code}</code></pre>
  </div>`;
};

// Override inline code rendering
renderer.codespan = function(text) {
  return `<code class="bg-zinc-800 text-blue-300 px-2 py-1 rounded text-sm">${text}</code>`;
};

// Override image rendering with Tailwind classes and error handling
renderer.image = function(href, title, text) {
  const titleAttr = title ? ` title="${title}"` : '';
  const altAttr = text ? ` alt="${text}"` : '';
  
  return `<div class="mb-6">
    <img src="${href}" class="w-full rounded-lg shadow-lg"${altAttr}${titleAttr} 
         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
    <div class="hidden bg-zinc-800 rounded-lg p-4 text-center">
      <div class="text-gray-400 text-sm">Imagem não encontrada: ${text || 'Sem descrição'}</div>
    </div>
    ${text ? `<p class="text-gray-500 text-sm text-center mt-2 italic">${text}</p>` : ''}
  </div>`;
};

// Override strong (bold) rendering
renderer.strong = function(text) {
  return `<strong class="font-bold text-white">${text}</strong>`;
};

// Override emphasis (italic) rendering
renderer.em = function(text) {
  return `<em class="italic text-gray-200">${text}</em>`;
};

// Override link rendering
renderer.link = function(href, title, text) {
  const titleAttr = title ? ` title="${title}"` : '';
  const target = href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
  
  return `<a href="${href}" class="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"${titleAttr}${target}>${text}</a>`;
};

// Override horizontal rule rendering
renderer.hr = function() {
  return '<hr class="border-zinc-700 my-8" />';
};

// Override table rendering
renderer.table = function(header, body) {
  return `<div class="overflow-x-auto mb-6">
    <table class="min-w-full bg-zinc-800 rounded-lg overflow-hidden">
      <thead class="bg-zinc-700">${header}</thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
};

renderer.tablerow = function(content) {
  return `<tr class="border-b border-zinc-700">${content}</tr>`;
};

renderer.tablecell = function(content, flags) {
  const type = flags.header ? 'th' : 'td';
  const className = flags.header 
    ? 'px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
    : 'px-6 py-4 whitespace-nowrap text-sm text-gray-300';
  
  return `<${type} class="${className}">${content}</${type}>`;
};

// Configure marked with custom renderer and options
marked.setOptions({
  renderer: renderer,
  highlight: function(code, lang) {
    // Temporarily disable highlighting to isolate the error
    console.log('[ContentProcessor] Highlight disabled for debugging - lang:', lang, 'type:', typeof lang);
    return code;
  },
  langPrefix: 'hljs language-',
  breaks: true,
  gfm: true,
  silent: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
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
  
  // Fix image paths first
  let processedContent = fixImagePaths(content, slug);
  
  // Convert markdown to HTML if needed
  if (isMarkdown(processedContent)) {
    console.log('[ContentProcessor] Converting markdown to HTML for slug:', slug);
    try {
      // Ensure content is properly formatted for marked
      const cleanContent = processedContent.trim();
      processedContent = marked.parse(cleanContent);
    } catch (error) {
      console.error('[ContentProcessor] Error parsing markdown:', error);
      // Fallback: try basic markdown-to-HTML conversion
      try {
        processedContent = basicMarkdownToHtml(processedContent);
      } catch (fallbackError) {
        console.error('[ContentProcessor] Fallback conversion also failed:', fallbackError);
        // Last resort: return original content with basic HTML structure
        return `<div class="prose prose-lg prose-invert max-w-none"><div class="text-gray-300">${content.replace(/\n/g, '<br>')}</div></div>`;
      }
    }
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