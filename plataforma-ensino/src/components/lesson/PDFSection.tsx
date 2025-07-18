'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react'
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

  const progressManagerRef = useRef<LessonProgressManager | null>(null)
  const pageStartTimeRef = useRef<number>(Date.now())

  // Initialize progress manager
  useEffect(() => {
    progressManagerRef.current = new LessonProgressManager(lessonId)

    // Load saved progress
    const savedProgress = progressManagerRef.current.getProgress()
    setProgress(savedProgress.pdfProgress)
  }, [lessonId])

  // Handle responsive page width
  useEffect(() => {
    const updatePageWidth = () => {
      const containerWidth = window.innerWidth
      if (containerWidth < 768) {
        setPageWidth(containerWidth - 80) // Account for padding and margins
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

  // Track page view time
  useEffect(() => {
    pageStartTimeRef.current = Date.now()

    return () => {
      // Record time spent on page when leaving
      const timeSpent = Date.now() - pageStartTimeRef.current
      if (timeSpent > 3000) { // Only count if spent more than 3 seconds
        markPageAsRead(currentPage)
      }
    }
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

  const goToPrevPage = () => {
    if (currentPage > 1) {
      // Mark current page as read before leaving
      const timeSpent = Date.now() - pageStartTimeRef.current
      if (timeSpent > 3000) {
        markPageAsRead(currentPage)
      }
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < numPages) {
      // Mark current page as read before leaving
      const timeSpent = Date.now() - pageStartTimeRef.current
      if (timeSpent > 3000) {
        markPageAsRead(currentPage)
      }
      setCurrentPage(currentPage + 1)
    }
  }

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

  return (
    <Card className="p-6 border-border/50">
      <style jsx global>{`
        .react-pdf__Page {
          margin: 0 auto !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        }
        .react-pdf__Page__canvas {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
        }
        .react-pdf__Document {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
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
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="bg-muted rounded-lg min-h-[600px] mb-4 overflow-auto flex items-start justify-center">
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
          <div className="w-full p-4">
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
                width={pageWidth}
                onClick={handlePageClick}
                className="shadow-lg max-w-full mx-auto"
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
          💡 Dica: Passe pelo menos 3 segundos em cada página para que seja marcada como lida.
        </div>
      </div>
    </Card>
  )
}

export default PDFSection