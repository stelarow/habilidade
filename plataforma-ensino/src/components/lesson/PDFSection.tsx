'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, AlertCircle, Maximize2, X, Minimize2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { calculatePDFProgress, LessonProgressManager } from '@/utils/lessonProgressUtils'

// Dynamic import for PDF components
import dynamic from 'next/dynamic'

const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false })
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false })

// Initialize PDF.js worker on client side
if (typeof window !== 'undefined') {
  import('react-pdf').then((reactPdf) => {
    // Set up PDF.js worker using local file to avoid CORS issues
    reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  }).catch((error) => {
    console.error('Failed to load PDF.js:', error)
  })
}

interface PDFSectionProps {
  title?: string
  pdfUrl?: string
  lessonId?: string
  onProgressUpdate?: (progress: number) => void
  initialProgress?: number
}

const PDFSection: React.FC<PDFSectionProps> = ({
  title = "Material Didático - Apostila",
  pdfUrl = "https://drive.google.com/uc?export=download&id=1olJNk4502nTBjqaipihJS48lLO-VR4N0", // Google Drive PDF
  lessonId = "test-lesson",
  onProgressUpdate,
  initialProgress = 0
}) => {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [pagesRead, setPagesRead] = useState<number[]>([])
  const [progress, setProgress] = useState<number>(initialProgress)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [pageWidth, setPageWidth] = useState<number>(600)
  const [pageHeight, setPageHeight] = useState<number>(800) // Add height control
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [showFloatingControls, setShowFloatingControls] = useState<boolean>(false)
  const [isPDFSectionVisible, setIsPDFSectionVisible] = useState<boolean>(false)

  const progressManagerRef = useRef<LessonProgressManager | null>(null)
  const pageStartTimeRef = useRef<number>(Date.now())
  const pdfSectionRef = useRef<HTMLDivElement | null>(null)

  // Initialize progress manager
  useEffect(() => {
    progressManagerRef.current = new LessonProgressManager(lessonId)

    // Load saved progress
    const savedProgress = progressManagerRef.current.getProgress()
    setProgress(savedProgress.pdfProgress)
  }, [lessonId])

  // Handle responsive page dimensions with proper constraints
  useEffect(() => {
    const updatePageDimensions = () => {
      const containerWidth = window.innerWidth
      const containerHeight = window.innerHeight
      const containerElement = pdfSectionRef.current
      const availableWidth = containerElement ? containerElement.clientWidth - 32 : containerWidth - 80 // 32px for padding
      
      // Set max width constraints to prevent oversizing
      let newWidth = 600
      if (containerWidth < 768) {
        newWidth = Math.min(availableWidth, 600) // Mobile: max 600px
      } else if (containerWidth < 1024) {
        newWidth = Math.min(availableWidth, 700) // Tablet: max 700px  
      } else {
        newWidth = Math.min(availableWidth, 800) // Desktop: max 800px
      }
      
      // Set height constraints to prevent oversizing (key fix!)
      // Height should be proportional to width but capped
      const maxHeight = Math.min(containerHeight * 0.8, 800) // Max 80% of viewport or 800px
      const proportionalHeight = (newWidth * 4) / 3 // 4:3 aspect ratio as base
      const newHeight = Math.min(proportionalHeight, maxHeight)
      
      setPageWidth(newWidth)
      setPageHeight(newHeight)
    }

    // Add delay to ensure container is rendered
    const timeoutId = setTimeout(updatePageDimensions, 100)
    
    window.addEventListener('resize', updatePageDimensions)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updatePageDimensions)
    }
  }, [])

  // Intersection Observer for PDF section visibility
  useEffect(() => {
    const currentPdfSection = pdfSectionRef.current
    if (!currentPdfSection) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsPDFSectionVisible(entry.isIntersecting && entry.intersectionRatio > 0.1)
      },
      {
        threshold: [0.1, 0.9],
        rootMargin: '-20px'
      }
    )

    observer.observe(currentPdfSection)
    return () => observer.disconnect()
  }, [])

  const markPageAsRead = useCallback((pageNumber: number) => {
    setPagesRead(prev => {
      if (!prev.includes(pageNumber)) {
        const newPagesRead = [...prev, pageNumber]
        const newProgress = calculatePDFProgress(newPagesRead, numPages)

        setProgress(newProgress)

        // Save progress
        if (progressManagerRef.current) {
          progressManagerRef.current.updatePDFProgress(newPagesRead, numPages)
        }

        // Call progress update callback
        if (onProgressUpdate) {
          onProgressUpdate(newProgress)
        }

        return newPagesRead
      }
      return prev
    })
  }, [numPages, onProgressUpdate])

  // Mark page as read when navigating
  useEffect(() => {
    // Mark current page as read immediately when page loads
    markPageAsRead(currentPage)
  }, [currentPage, markPageAsRead])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error)
    let errorMessage = 'Erro ao carregar o PDF.'
    
    // Check for specific error types
    if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
      errorMessage = 'Erro de CORS: Não foi possível carregar o PDF devido a restrições de segurança.'
    } else if (error.message.includes('Network')) {
      errorMessage = 'Erro de rede: Verifique sua conexão com a internet.'
    } else if (error.message.includes('404') || error.message.includes('Not Found')) {
      errorMessage = 'PDF não encontrado. Verifique se o arquivo existe.'
    } else if (error.message.includes('Invalid PDF')) {
      errorMessage = 'Arquivo PDF inválido ou corrompido.'
    }
    
    setError(errorMessage)
    setIsLoading(false)
  }

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }, [currentPage])

  const goToNextPage = useCallback(() => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1)
    }
  }, [currentPage, numPages])

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.0))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const handlePageClick = () => {
    // Mark page as read when clicked/interacted with
    markPageAsRead(currentPage)
  }

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when PDF section is in focus or fullscreen
      if (showFloatingControls || isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault()
            goToPrevPage()
            break
          case 'ArrowRight':
            e.preventDefault()
            goToNextPage()
            break
          case 'f':
          case 'F':
            e.preventDefault()
            toggleFullscreen()
            break
          case 'Escape':
            if (isFullscreen) {
              e.preventDefault()
              exitFullscreen()
            }
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showFloatingControls, isFullscreen, currentPage, numPages, goToPrevPage, goToNextPage, toggleFullscreen, exitFullscreen])

  // Handle mouse enter/leave for floating controls
  const handleMouseEnter = () => {
    setShowFloatingControls(true)
  }

  const handleMouseLeave = () => {
    setShowFloatingControls(false)
  }

  return (
    <Card className="p-6 border-border/50">
      <style jsx global>{`
        .react-pdf__Page {
          margin: 0 auto !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
          max-width: 100% !important;
          max-height: 800px !important;
          overflow: hidden !important;
        }
        .react-pdf__Page__canvas {
          max-width: 100% !important;
          max-height: 800px !important;
          height: auto !important;
          width: auto !important;
          display: block !important;
          margin: 0 auto !important;
          object-fit: contain !important;
        }
        .react-pdf__Document {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          max-width: 100% !important;
          overflow: hidden !important;
        }
        .react-pdf__Page > div {
          max-width: 100% !important;
          max-height: 800px !important;
          overflow: hidden !important;
        }
      `}</style>
      <h3 className="text-xl font-bold mb-4 gradient-text">{title}</h3>

      {/* PDF Controls */}
      <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium">
            Página {currentPage} de {numPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-sm">{Math.round(scale * 100)}%</span>

          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 2.0}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            title="Modo Foco (F)"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div 
        ref={pdfSectionRef}
        className="relative bg-muted rounded-lg min-h-[600px] mb-4 overflow-hidden flex items-start justify-center max-w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Carregando PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!error && typeof window !== 'undefined' && (
          <div className="w-full p-4 flex justify-center max-w-full overflow-hidden">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="text-center text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p>Carregando PDF...</p>
                  </div>
                </div>
              }
              error={
                <div className="flex items-center justify-center h-96">
                  <div className="text-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Erro ao carregar PDF</p>
                  </div>
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                width={Math.min(pageWidth, 800)} // Ensure maximum width constraint
                height={Math.min(pageHeight, 800)} // Ensure maximum height constraint - KEY FIX!
                onClick={handlePageClick}
                className="shadow-lg max-w-full max-h-[800px] h-auto object-contain"
                loading={
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                }
                renderTextLayer={false}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        )}

        {/* SSR placeholder */}
        {typeof window === 'undefined' && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">PDF será carregado no cliente</p>
            </div>
          </div>
        )}

        {/* Floating Controls */}
        <AnimatePresence>
          {showFloatingControls && !isFullscreen && isPDFSectionVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
            >
              <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 text-white shadow-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage <= 1}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-sm font-medium px-2">
                  {currentPage} / {numPages}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage >= numPages}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <div className="w-px h-4 bg-white/30 mx-1" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  title="Modo Foco (F)"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Information */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Progresso de leitura:</span>
          <Progress value={progress} className="flex-1" />
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Páginas lidas: {pagesRead.length}/{numPages}</span>
          <span>
            {pagesRead.length === numPages ?
              "✅ Leitura concluída!" :
              `${numPages - pagesRead.length} páginas restantes`
            }
          </span>
        </div>

        {/* Reading tip */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          💡 Dica: Use as setas ← → para navegar, &lsquo;F&rsquo; para modo foco ou passe o mouse sobre o PDF para ver os controles.
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          >
            <div className="max-w-6xl max-h-full overflow-auto p-8 relative">
              {/* Fullscreen Header */}
              <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exitFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Fullscreen PDF Content */}
              <div className="mt-16 mb-24 flex justify-center">
                {!error && typeof window !== 'undefined' && (
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="flex items-center justify-center h-96">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                          <p>Carregando PDF...</p>
                        </div>
                      </div>
                    }
                    error={
                      <div className="flex items-center justify-center h-96">
                        <div className="text-center text-white">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Erro ao carregar PDF</p>
                        </div>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={currentPage}
                      scale={scale}
                      width={Math.min(pageWidth * 1.2, window.innerWidth - 100, 1000)} // Controlled fullscreen sizing
                      height={Math.min(pageHeight * 1.2, window.innerHeight - 200, 900)} // Controlled fullscreen height - KEY FIX!
                      onClick={handlePageClick}
                      className="shadow-lg max-w-full max-h-[90vh] h-auto object-contain"
                      loading={
                        <div className="flex items-center justify-center h-96">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      }
                      renderTextLayer={false}
                      renderAnnotationLayer={true}
                    />
                  </Document>
                )}
              </div>

              {/* Fullscreen Controls */}
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[110]">
                <div className="flex items-center gap-4 bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 text-white shadow-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage <= 1}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <span className="text-lg font-medium px-4">
                    {currentPage} / {numPages}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage >= numPages}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  <div className="w-px h-6 bg-white/30 mx-2" />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    className="text-white hover:bg-white/20"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </Button>

                  <span className="text-sm px-2">{Math.round(scale * 100)}%</span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={zoomIn}
                    disabled={scale >= 2.0}
                    className="text-white hover:bg-white/20"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>

                  <div className="w-px h-6 bg-white/30 mx-2" />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exitFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Minimize2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress bar in fullscreen */}
                <div className="mt-4 w-64 mx-auto">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <span>Progresso:</span>
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <motion.div
                        className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default PDFSection