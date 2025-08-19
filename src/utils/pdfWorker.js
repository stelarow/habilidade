/**
 * PDF Worker - Factory Pattern para carregamento lazy das bibliotecas PDF
 * 
 * Este módulo implementa um sistema de carregamento sob demanda para as bibliotecas
 * html2canvas e jspdf, garantindo que sejam carregadas apenas quando necessário.
 * 
 * Features:
 * - Carregamento lazy verdadeiro (sem preload)
 * - Cache das bibliotecas após primeiro carregamento
 * - Callbacks de progresso para UX
 * - Error handling robusto
 * - Fallback para casos de falha
 */

// Cache das bibliotecas carregadas
let librariesCache = {
  html2canvas: null,
  jspdf: null,
  isLoading: false
};

// Callbacks de progresso
let progressCallbacks = new Set();

/**
 * Adiciona callback de progresso
 */
export const onLoadProgress = (callback) => {
  progressCallbacks.add(callback);
  return () => progressCallbacks.delete(callback);
};

/**
 * Notifica progresso para todos os callbacks
 */
const notifyProgress = (progress) => {
  progressCallbacks.forEach(callback => {
    try {
      callback(progress);
    } catch (error) {
      console.warn('PDF Worker: Callback error:', error);
    }
  });
};

/**
 * Carrega as bibliotecas PDF de forma lazy
 * @returns {Promise<{html2canvas: Function, jsPDF: Function}>}
 */
const loadPDFLibraries = async () => {
  // Se já estão em cache, retorna imediatamente
  if (librariesCache.html2canvas && librariesCache.jspdf) {
    notifyProgress({ phase: 'cached', progress: 100 });
    return {
      html2canvas: librariesCache.html2canvas,
      jsPDF: librariesCache.jspdf
    };
  }

  // Se já está carregando, aguarda
  if (librariesCache.isLoading) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!librariesCache.isLoading && librariesCache.html2canvas && librariesCache.jspdf) {
          clearInterval(checkInterval);
          resolve({
            html2canvas: librariesCache.html2canvas,
            jsPDF: librariesCache.jspdf
          });
        }
      }, 100);
    });
  }

  librariesCache.isLoading = true;
  
  try {
    notifyProgress({ phase: 'loading', progress: 0, message: 'Preparando bibliotecas PDF...' });

    // Carrega html2canvas
    notifyProgress({ phase: 'loading', progress: 25, message: 'Carregando html2canvas...' });
    const html2canvasModule = await import('html2canvas');
    
    notifyProgress({ phase: 'loading', progress: 75, message: 'Carregando jsPDF...' });
    const jsPDFModule = await import('jspdf');
    
    // Cache as bibliotecas
    librariesCache.html2canvas = html2canvasModule.default;
    librariesCache.jspdf = jsPDFModule.default;
    
    notifyProgress({ phase: 'complete', progress: 100, message: 'Bibliotecas PDF carregadas!' });
    
    console.log('✅ PDF Worker: Libraries loaded and cached successfully');
    
    return {
      html2canvas: librariesCache.html2canvas,
      jsPDF: librariesCache.jspdf
    };
    
  } catch (error) {
    console.error('❌ PDF Worker: Failed to load libraries:', error);
    notifyProgress({ phase: 'error', progress: 0, message: 'Erro ao carregar bibliotecas PDF' });
    throw new Error(`Falha ao carregar bibliotecas PDF: ${error.message}`);
  } finally {
    librariesCache.isLoading = false;
  }
};

/**
 * Gera PDF de um elemento DOM
 * @param {HTMLElement} element - Elemento para capturar
 * @param {string} filename - Nome do arquivo PDF
 * @param {Object} options - Opções de configuração
 * @returns {Promise<void>}
 */
export const generatePDF = async (element, filename = 'documento.pdf', options = {}) => {
  if (!element) {
    throw new Error('Elemento DOM é obrigatório para geração do PDF');
  }

  try {
    notifyProgress({ phase: 'start', progress: 0, message: 'Iniciando geração de PDF...' });

    // Carrega as bibliotecas se necessário
    const { html2canvas, jsPDF } = await loadPDFLibraries();
    
    notifyProgress({ phase: 'capture', progress: 20, message: 'Capturando conteúdo da página...' });
    
    // Configurações padrão para html2canvas
    const canvasOptions = {
      height: element.scrollHeight,
      width: element.scrollWidth,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#f9fafb',
      logging: false,
      ...options.canvas
    };
    
    // Captura o elemento como canvas
    const canvas = await html2canvas(element, canvasOptions);
    
    notifyProgress({ phase: 'processing', progress: 60, message: 'Processando imagem...' });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calcular dimensões para o PDF
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    notifyProgress({ phase: 'generating', progress: 80, message: 'Gerando arquivo PDF...' });
    
    // Adicionar imagem ao PDF
    if (imgHeight > pageHeight - 20) {
      // Se a imagem for maior que uma página, redimensionar
      const scaledHeight = pageHeight - 20;
      const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
      pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth) / 2, 10, scaledWidth, scaledHeight);
    } else {
      pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
    }
    
    notifyProgress({ phase: 'saving', progress: 95, message: 'Salvando arquivo...' });
    
    // Salvar o PDF
    pdf.save(filename);
    
    notifyProgress({ phase: 'complete', progress: 100, message: 'PDF gerado com sucesso!' });
    
    console.log('✅ PDF Worker: PDF generated successfully:', filename);
    
  } catch (error) {
    console.error('❌ PDF Worker: PDF generation failed:', error);
    notifyProgress({ phase: 'error', progress: 0, message: 'Erro ao gerar PDF' });
    
    // Fallback: mostrar mensagem de erro ao usuário
    const userMessage = error.message.includes('bibliotecas PDF') 
      ? 'Não foi possível carregar as ferramentas necessárias. Verifique sua conexão e tente novamente.'
      : 'Erro ao gerar PDF. Tente novamente.';
      
    throw new Error(userMessage);
  }
};

/**
 * Captura screenshot de um elemento DOM
 * @param {HTMLElement} element - Elemento para capturar
 * @param {string} filename - Nome do arquivo de imagem
 * @param {Object} options - Opções de configuração
 * @returns {Promise<void>}
 */
export const captureScreenshot = async (element, filename = 'screenshot.png', options = {}) => {
  if (!element) {
    throw new Error('Elemento DOM é obrigatório para captura de screenshot');
  }

  try {
    notifyProgress({ phase: 'start', progress: 0, message: 'Iniciando captura de screenshot...' });

    const { html2canvas } = await loadPDFLibraries();
    
    notifyProgress({ phase: 'capture', progress: 50, message: 'Capturando imagem...' });
    
    const canvasOptions = {
      scale: 2,
      logging: false,
      useCORS: true,
      ...options.canvas
    };
    
    const canvas = await html2canvas(element, canvasOptions);
    
    notifyProgress({ phase: 'saving', progress: 90, message: 'Salvando imagem...' });
    
    // Converter para blob e baixar
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      notifyProgress({ phase: 'complete', progress: 100, message: 'Screenshot salvo com sucesso!' });
    }, 'image/png');
    
  } catch (error) {
    console.error('❌ PDF Worker: Screenshot capture failed:', error);
    notifyProgress({ phase: 'error', progress: 0, message: 'Erro ao capturar screenshot' });
    throw new Error('Erro ao capturar imagem. Tente novamente.');
  }
};

/**
 * Verifica se as bibliotecas PDF estão em cache
 * @returns {boolean}
 */
export const arePDFLibrariesCached = () => {
  return !!(librariesCache.html2canvas && librariesCache.jspdf);
};

/**
 * Limpa o cache das bibliotecas (útil para desenvolvimento)
 */
export const clearPDFCache = () => {
  librariesCache.html2canvas = null;
  librariesCache.jspdf = null;
  librariesCache.isLoading = false;
  console.log('🧹 PDF Worker: Cache cleared');
};

/**
 * Estatísticas do PDF Worker
 * @returns {Object}
 */
export const getPDFWorkerStats = () => {
  return {
    isLoaded: arePDFLibrariesCached(),
    isLoading: librariesCache.isLoading,
    callbackCount: progressCallbacks.size
  };
};

export default {
  generatePDF,
  captureScreenshot,
  onLoadProgress,
  arePDFLibrariesCached,
  clearPDFCache,
  getPDFWorkerStats
};