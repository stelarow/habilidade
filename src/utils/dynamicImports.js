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
 * Framer Motion - Para animações complexas
 * Carrega apenas quando necessário
 */
export const loadFramerMotion = async () => {
  return cachedImport(
    () => import('framer-motion'),
    'framer-motion'
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
 * @deprecated Use PDF Worker instead: import { generatePDF } from '../utils/pdfWorker'
 * Esta função foi movida para o PDF Worker para melhor gestão de cache e performance
 */
export const generatePDF = async (element, filename = 'documento.pdf') => {
  console.warn('⚠️ generatePDF from dynamicImports is deprecated. Use PDF Worker instead.');
  try {
    // Carrega as dependências apenas quando necessário
    const [html2canvas, jsPDF] = await Promise.all([
      loadHtml2Canvas(),
      loadJsPDF()
    ]);
    
    const canvas = await html2canvas.default(element, {
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF.default();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(filename);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    // Fallback: mostrar mensagem ao usuário
    alert('Erro ao gerar PDF. Tente novamente.');
  }
};

/**
 * @deprecated Use PDF Worker instead: import { captureScreenshot } from '../utils/pdfWorker'
 * Esta função foi movida para o PDF Worker para melhor gestão de cache e performance
 */
export const captureScreenshot = async (element, filename = 'screenshot.png') => {
  console.warn('⚠️ captureScreenshot from dynamicImports is deprecated. Use PDF Worker instead.');
  try {
    const html2canvas = await loadHtml2Canvas();
    
    const canvas = await html2canvas.default(element, {
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    // Converter para blob e baixar
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
    
  } catch (error) {
    console.error('Erro ao capturar screenshot:', error);
    alert('Erro ao capturar imagem. Tente novamente.');
  }
};

/**
 * Preload condicionais baseados na rota
 */
export const preloadByRoute = {
  // Blog: preload highlight.js
  '/blog': () => loadHighlightJS(),
  
  // Páginas com certificados: PDF libraries carregadas sob demanda via PDF Worker
  // '/cursos': REMOVIDO - PDF Worker carrega bibliotecas apenas quando necessário
  
  // Páginas com animações: preload framer-motion
  '/': () => loadFramerMotion()
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