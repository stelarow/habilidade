// Utility to format article content with better structure and styling

export const formatArticleContent = (content) => {
  // Remove extra whitespace and format properly
  let formatted = content
    .replaceAll(/^\s+|\s+$/g, '') // Remove leading/trailing whitespace
    .replaceAll(/\n\s*\n\s*\n/g, '\n\n') // Normalize multiple line breaks
    .replaceAll('<h2>', '<div class="article-section"><h2 class="text-2xl font-bold text-white mb-4 mt-8">')
    .replaceAll('</h2>', '</h2>')
    .replaceAll('<h3>', '<h3 class="text-xl font-semibold text-white mb-3 mt-6">')
    .replaceAll('</h3>', '</h3>')
    .replaceAll('<h4>', '<h4 class="text-lg font-medium text-white mb-2 mt-4">')
    .replaceAll('</h4>', '</h4>')
    .replaceAll('<p>', '<p class="text-zinc-300 leading-relaxed mb-4">')
    .replaceAll('<ul>', '<ul class="space-y-3 mb-6">')
    .replaceAll('<ol>', '<ol class="space-y-3 mb-6 list-decimal list-inside">')
    .replaceAll('<li>', '<li class="text-zinc-300 leading-relaxed flex items-start">')
    .replaceAll('<strong>', '<strong class="text-white font-semibold">')
    .replaceAll('<code>', '<code class="bg-zinc-800 text-blue-300 px-2 py-1 rounded text-sm font-mono">')
    .replaceAll('<pre>', '<pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 my-6 overflow-x-auto">')
    .replaceAll('<blockquote>', '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-zinc-800/50 rounded-r-lg text-zinc-200 italic">');

  // Wrap the entire content in a properly structured container
  return `
    <div class="article-content space-y-6">
      ${formatted}
    </div>
  `;
};

export const createArticleSection = (title, content, level = 3) => {
  const headingClass = level === 2 
    ? 'text-2xl font-bold text-white mb-4 mt-8'
    : (level === 3 
    ? 'text-xl font-semibold text-white mb-3 mt-6'
    : 'text-lg font-medium text-white mb-2 mt-4');
    
  return `
    <div class="article-section">
      <h${level} class="${headingClass}">${title}</h${level}>
      <div class="space-y-4">
        ${content}
      </div>
    </div>
  `;
};

export const createListItem = (content, type = 'bullet') => {
  return type === 'bullet' ? `
      <li class="flex items-start">
        <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
        <span class="text-zinc-300 leading-relaxed">${content}</span>
      </li>
    ` : `
      <li class="flex items-start">
        <span class="text-zinc-300 leading-relaxed">${content}</span>
      </li>
    `;
};

export const createHighlightBox = (title, content) => {
  return `
    <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 my-6">
      <h4 class="text-blue-300 font-semibold mb-3">${title}</h4>
      <p class="text-zinc-300">${content}</p>
    </div>
  `;
};