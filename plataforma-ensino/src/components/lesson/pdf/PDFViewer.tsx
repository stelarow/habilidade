'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PDFData } from '@/types/lesson'
import { cn } from '@/lib/utils'

interface PDFViewerProps {
  pdf: PDFData
  className?: string
  onProgressUpdate?: (progress: number) => void
}

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

  const totalPages = pdf.pageCount || 10 // Fallback for simulation

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      const progress = (page / totalPages) * 100
      onProgressUpdate?.(progress)
    }
  }, [totalPages, onProgressUpdate])

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
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lesson-btn-icon"
              aria-label="Buscar no PDF"
            >
              🔍
            </button>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center space-x-1">
              <button
                onClick={() => handleZoomChange(zoom - 25)}
                className="lesson-btn-icon"
                disabled={zoom <= 50}
                aria-label="Diminuir zoom"
              >
                ➖
              </button>
              <span className="lesson-text-caption min-w-12 text-center">
                {zoom}%
              </span>
              <button
                onClick={() => handleZoomChange(zoom + 25)}
                className="lesson-btn-icon"
                disabled={zoom >= 200}
                aria-label="Aumentar zoom"
              >
                ➕
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="lesson-btn-icon"
              aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            >
              {isFullscreen ? '🗗' : '🗖'}
            </button>

            {/* Download Button */}
            {pdf.downloadable && (
              <button className="lesson-btn-secondary text-sm">
                📥 Download
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
          {/* Simulated PDF Pages */}
          <div 
            className="w-full h-full overflow-auto p-4"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
          >
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Simulated PDF Page */}
              <div className="aspect-[210/297] bg-white p-8 text-gray-800">
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {pdf.title} - Página {currentPage}
                  </h1>
                  
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      Este é um simulador de visualização de PDF. O conteúdo real seria carregado 
                      de {pdf.filename} usando uma biblioteca como react-pdf.
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        📚 Implementação Necessária
                      </h3>
                      <p className="text-blue-800 text-sm">
                        Para funcionalidade completa, integre com react-pdf ou pdfjs-dist:
                      </p>
                      <code className="block mt-2 text-xs bg-blue-100 p-2 rounded">
                        npm install react-pdf pdfjs-dist
                      </code>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">📖 Características</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Navegação por páginas</li>
                          <li>• Controle de zoom</li>
                          <li>• Busca no texto</li>
                          <li>• Modo tela cheia</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">⚡ Performance</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Carregamento lazy</li>
                          <li>• Cache de páginas</li>
                          <li>• Otimização mobile</li>
                          <li>• Progresso de leitura</li>
                        </ul>
                      </div>
                    </div>

                    {searchTerm && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">
                          🔍 Buscando por: &ldquo;<strong>{searchTerm}</strong>&rdquo;
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Função de busca seria implementada com a biblioteca PDF real.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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