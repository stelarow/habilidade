'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Document, Page, pdfjs } from 'react-pdf'
import { PDFData } from '@/types/lesson'
import { cn } from '@/lib/utils'

// Configure PDF.js worker - use local worker file instead of CDN
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

// CSS imports removed - will be handled via global styles or inline
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

interface PDFViewerProps {
  pdf: PDFData
  className?: string
  onProgressUpdate?: (progress: number) => void
}

type PDFFile = string | File | null;

/**
 * Enhanced PDFViewer - In-page PDF reading component
 * 
 * Features:
 * - In-page PDF reading interface (simulated for now)
 * - Page navigation with controls
 * - Zoom functionality
 * - Reading progress tracking
 * - Search functionality
 * - Fullscreen mode
 * - Main site aesthetic integration
 * 
 * TODO: Integrate with react-pdf or similar library for actual PDF rendering
 */
export function PDFViewer({ pdf, className, onProgressUpdate }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageWidth, setPageWidth] = useState<number>(600)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalPages = numPages || pdf.pageCount || 10

  // PDF document callbacks
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    setError(`Erro ao carregar PDF: ${error.message}`)
    setIsLoading(false)
  }, [])

  const onPageLoadSuccess = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      const progress = (page / totalPages) * 100
      onProgressUpdate?.(progress)
    }
  }, [totalPages, onProgressUpdate])

  // Update page width for responsive design
  useEffect(() => {
    const updatePageWidth = () => {
      const containerWidth = window.innerWidth
      if (containerWidth < 768) {
        setPageWidth(containerWidth - 40)
      } else if (containerWidth < 1024) {
        setPageWidth(700)
      } else {
        setPageWidth(800)
      }
    }

    updatePageWidth()
    window.addEventListener('resize', updatePageWidth)
    return () => window.removeEventListener('resize', updatePageWidth)
  }, [])

  // Download PDF function
  const handleDownload = useCallback(() => {
    if (pdf.downloadable && pdf.url) {
      const link = document.createElement('a')
      link.href = pdf.url
      link.download = pdf.filename || 'document.pdf'
      link.click()
    }
  }, [pdf])

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(Math.max(50, Math.min(200, newZoom)))
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  return (
    <div className={cn(
      'lesson-pdf-viewer',
      isFullscreen && 'fixed inset-0 z-50 bg-gray-900',
      className
    )}>
      {/* PDF Controls */}
      <div className="lesson-pdf-controls">
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-3">
            <span className="lesson-text-subtitle">
              {pdf.title}
            </span>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
              <span>{(pdf.size / 1024 / 1024).toFixed(1)} MB</span>
              <span>•</span>
              <span>{totalPages} páginas</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            {/* Search Toggle - Enhanced with Magic UI */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="relative group w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
              aria-label="Buscar no PDF"
            >
              <span className="relative z-10 text-lg">🔍</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-active:opacity-100 transition-opacity duration-100" />
            </button>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center space-x-1">
              <button
                onClick={() => handleZoomChange(zoom - 25)}
                className="relative group w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={zoom <= 50}
                aria-label="Diminuir zoom"
              >
                <span className="relative z-10">➖</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <span className="lesson-text-caption min-w-12 text-center px-2 py-1 bg-white/10 rounded-lg">
                {zoom}%
              </span>
              <button
                onClick={() => handleZoomChange(zoom + 25)}
                className="relative group w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={zoom >= 200}
                aria-label="Aumentar zoom"
              >
                <span className="relative z-10">➕</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Fullscreen Toggle - Enhanced with Magic UI */}
            <button
              onClick={toggleFullscreen}
              className="relative group w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
              aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            >
              <span className="relative z-10 text-lg">{isFullscreen ? '🗗' : '🗖'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-active:opacity-100 transition-opacity duration-100" />
            </button>

            {/* Download Button - Enhanced with Magic UI */}
            {pdf.downloadable && (
              <button 
                onClick={handleDownload}
                className="relative group px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  📥 Download
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-active:opacity-100 transition-opacity duration-100" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t border-gray-600"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Buscar no PDF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="lesson-btn-icon">
                  ⬆️
                </button>
                <button className="lesson-btn-icon">
                  ⬇️
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PDF Content Area */}
      <div className="lesson-pdf-content">
        <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden">
          <div 
            className="w-full h-full overflow-auto p-4"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
          >
            <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden" style={{ width: 'fit-content' }}>
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <motion.div
                      className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-gray-600">Carregando PDF...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center text-red-600">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-lg font-medium mb-2">Erro ao carregar PDF</p>
                    <p className="text-sm text-gray-600">{error}</p>
                  </div>
                </div>
              )}

              {/* PDF Document */}
              {!error && (
                <Document
                  file={pdf.url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={null}
                  error={null}
                  className="pdf-document"
                >
                  <Page
                    pageNumber={currentPage}
                    width={pageWidth}
                    onLoadSuccess={onPageLoadSuccess}
                    loading={null}
                    error={null}
                    className="pdf-page"
                  />
                </Document>
              )}

              {/* Search Results Overlay */}
              {searchTerm && !error && (
                <div className="absolute top-4 left-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 z-10">
                  <p className="text-yellow-800 text-sm">
                    🔍 Buscando por: &ldquo;<strong>{searchTerm}</strong>&rdquo;
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Função de busca em desenvolvimento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="lesson-pdf-controls mt-4">
        <div className="flex items-center justify-between">
          {/* Page Navigation */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="lesson-btn-icon"
              aria-label="Página anterior"
            >
              ⬅️
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="lesson-text-body">Página</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-center"
              />
              <span className="lesson-text-body">de {totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="lesson-btn-icon"
              aria-label="Próxima página"
            >
              ➡️
            </button>
          </div>

          {/* Reading Progress */}
          <div className="flex items-center space-x-3">
            <span className="lesson-text-subtitle">Progresso:</span>
            <div className="w-32 bg-white/20 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="lesson-text-caption">
              {Math.round((currentPage / totalPages) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add PDF-specific styles including react-pdf CSS
const pdfStyles = `
  .pdf-document {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .pdf-page {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }
  
  .pdf-page > div {
    border-radius: 8px;
    overflow: hidden;
  }

  /* React-PDF annotation layer styles */
  .react-pdf__Page__annotations {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  .react-pdf__Page__annotations .linkAnnotation > a {
    position: absolute;
    color: transparent;
    border: 1px solid transparent;
    background: rgba(255, 255, 0, 0.2);
    box-sizing: border-box;
  }
  
  .react-pdf__Page__annotations .linkAnnotation > a:hover {
    background: rgba(255, 255, 0, 0.4);
  }

  /* React-PDF text layer styles */
  .react-pdf__Page__textContent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    opacity: 0.2;
    line-height: 1.0;
  }
  
  .react-pdf__Page__textContent span {
    color: transparent;
    position: absolute;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
  }
  
  .react-pdf__Page__textContent span::selection {
    background: rgba(0, 0, 255, 0.3);
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = pdfStyles
  document.head.appendChild(styleSheet)
}