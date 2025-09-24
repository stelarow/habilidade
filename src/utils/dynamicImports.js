/**
 * Sistema de Dynamic Imports Inteligente
 * Carrega bibliotecas pesadas apenas quando necessário
 * Com fallback e cache para otimização
 */

// Cache de imports para evitar recarregamentos
const importCache = new Map();

/**
 * Importação condicional com cache
 */
const cachedImport = async (importFn, cacheKey) => {
  if (importCache.has(cacheKey)) {
    return importCache.get(cacheKey);
  }
  
  try {
    const module = await importFn();
    importCache.set(cacheKey, module);
    return module;
  } catch (error) {
    console.warn(`Falha ao carregar módulo ${cacheKey}:`, error);
    throw error;
  }
};

/**
 * HTML2Canvas - Para captura de screenshots/PDFs
 * Carrega apenas quando necessário
 */
export const loadHtml2Canvas = async () => {
  return cachedImport(
    () => import('html2canvas'),
    'html2canvas'
  );
};

/**
 * jsPDF - Para geração de PDFs
 * Carrega apenas quando necessário
 */
export const loadJsPDF = async () => {
  return cachedImport(
    () => import('jspdf'),
    'jspdf'
  );
};


/**
 * Highlight.js - Para syntax highlighting do blog
 * Carrega apenas em páginas de blog
 */
export const loadHighlightJS = async () => {
  return cachedImport(
    () => import('highlight.js'),
    'highlightjs'
  );
};



/**
 * Preload condicionais baseados na rota
 */
export const preloadByRoute = {
  // Blog: preload highlight.js
  '/blog': () => loadHighlightJS(),

  // Páginas com animações: preload framer-motion via lazy utility
  '/': async () => {
    const { preloadFramerMotion } = await import('./lazyMotion.jsx');
    return preloadFramerMotion();
  }
};

/**
 * Sistema de preload inteligente
 */
export const intelligentPreload = (currentPath) => {
  Object.entries(preloadByRoute).forEach(([route, preloadFn]) => {
    if (currentPath.startsWith(route)) {
      // Preload com delay para não atrasar o render inicial
      setTimeout(preloadFn, 1000);
    }
  });
};

/**
 * Verificar se módulo está em cache
 */
export const isModuleCached = (moduleKey) => {
  return importCache.has(moduleKey);
};

/**
 * Limpar cache (útil para desenvolvimento)
 */
export const clearImportCache = () => {
  importCache.clear();
};

/**
 * Stats de uso do cache
 */
export const getCacheStats = () => {
  return {
    size: importCache.size,
    modules: Array.from(importCache.keys())
  };
};