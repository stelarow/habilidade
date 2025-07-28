import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  ChevronLeft, 
  ChevronRight,
  Download,
  RotateCw,
  Home,
  Activity
} from 'lucide-react';
import { PDFErrorBoundary } from './PDFErrorBoundary';
import { usePDFPerformance } from '../../hooks/usePDFPerformance';
import { PDFPerformanceDashboard, usePDFPerformanceDashboard } from './PDFPerformanceDashboard';

// Import required CSS for react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFSectionEnhancedProps {
  pdfUrl: string;
  lessonTitle?: string;
  lessonId?: string;
  onPageView?: (pageNumber: number) => void;
  onComplete?: () => void;
  className?: string;
  enablePerformanceMonitoring?: boolean;
  enableDeveloperMode?: boolean;
}

interface PDFViewState {
  numPages: number;
  currentPage: number;
  zoomLevel: number; // Percentage (50-200)
  rotation: number; // Degrees (0, 90, 180, 270)
  isFullscreen: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Enhanced PDF Section Component
 * 
 * Implements all the fixes for blank space issues plus:
 * - Error boundaries with retry mechanisms
 * - Performance monitoring and optimization
 * - Accessibility features
 * - Responsive design
 * - Advanced zoom controls
 * - Progress tracking
 */
export const PDFSectionEnhanced: React.FC<PDFSectionEnhancedProps> = ({
  pdfUrl,
  lessonTitle = 'PDF Document',
  lessonId,
  onPageView,
  onComplete,
  className = '',
  enablePerformanceMonitoring = process.env.NODE_ENV === 'development',
  enableDeveloperMode = process.env.NODE_ENV === 'development'
}) => {
  const [viewState, setViewState] = useState<PDFViewState>({
    numPages: 0,
    currentPage: 1,
    zoomLevel: 100,
    rotation: 0,
    isFullscreen: false,
    isLoading: true,
    error: null
  });

  const [viewportWidth, setViewportWidth] = useState(800);
  const [pagesViewed, setPagesViewed] = useState<Set<number>>(new Set());
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const {
    metrics,
    alerts,
    startDocumentLoad,
    endDocumentLoad,
    startPageRender,
    endPageRender,
    trackError,
    trackDimensions,
    generateReport
  } = usePDFPerformance({
    enableMemoryTracking: enablePerformanceMonitoring,
    enablePerformanceObserver: enablePerformanceMonitoring
  });

  const {
    isVisible: dashboardVisible,
    toggle: toggleDashboard,
    hide: hideDashboard
  } = usePDFPerformanceDashboard();

  // Calculate optimal page width based on zoom and viewport
  const calculatePageWidth = useCallback(() => {
    const baseWidth = Math.min(viewportWidth * 0.9, 800);
    return Math.round((baseWidth * viewState.zoomLevel) / 100);
  }, [viewportWidth, viewState.zoomLevel]);

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setViewportWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Track dimensions for blank space detection
  useEffect(() => {
    if (containerRef.current && documentRef.current && !viewState.isLoading) {
      const timeoutId = setTimeout(() => {
        trackDimensions(containerRef.current!, documentRef.current!);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [viewState.currentPage, viewState.zoomLevel, viewState.isLoading, trackDimensions]);

  // Document load handlers
  const handleDocumentLoadSuccess = useCallback((pdf: any) => {
    endDocumentLoad();
    setViewState(prev => ({
      ...prev,
      numPages: pdf.numPages,
      isLoading: false,
      error: null
    }));
  }, [endDocumentLoad]);

  const handleDocumentLoadError = useCallback((error: Error) => {
    trackError(error, 'document-load');
    setViewState(prev => ({
      ...prev,
      isLoading: false,
      error: error.message
    }));
  }, [trackError]);

  // Page load handlers
  const handlePageLoadSuccess = useCallback((page: any) => {
    endPageRender(page.pageNumber);
    
    // Track page view for progress
    const newPage = page.pageNumber;
    setPagesViewed(prev => {
      const updated = new Set([...prev, newPage]);
      
      // Call progress callback
      onPageView?.(newPage);
      
      // Check if all pages viewed for completion
      if (updated.size === viewState.numPages && viewState.numPages > 0) {
        onComplete?.();
      }
      
      return updated;
    });
  }, [endPageRender, onPageView, onComplete, viewState.numPages]);

  const handlePageLoadError = useCallback((error: Error) => {
    trackError(error, 'page-load');
  }, [trackError]);

  // Navigation controls
  const goToPage = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= viewState.numPages) {
      startPageRender(pageNumber);
      setViewState(prev => ({ ...prev, currentPage: pageNumber }));
    }
  }, [viewState.numPages, startPageRender]);

  const nextPage = useCallback(() => {
    goToPage(viewState.currentPage + 1);
  }, [viewState.currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(viewState.currentPage - 1);
  }, [viewState.currentPage, goToPage]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setViewState(prev => ({
      ...prev,
      zoomLevel: Math.min(prev.zoomLevel + 25, 200)
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setViewState(prev => ({
      ...prev,
      zoomLevel: Math.max(prev.zoomLevel - 25, 50)
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setViewState(prev => ({ ...prev, zoomLevel: 100 }));
  }, []);

  // Rotation control
  const rotate = useCallback(() => {
    setViewState(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  }, []);

  // Fullscreen control
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!viewState.isFullscreen) {
        await containerRef.current?.requestFullscreen();
        setViewState(prev => ({ ...prev, isFullscreen: true }));
      } else {
        await document.exitFullscreen();
        setViewState(prev => ({ ...prev, isFullscreen: false }));
      }
    } catch (error) {
      console.warn('Fullscreen not supported or failed:', error);
    }
  }, [viewState.isFullscreen]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setViewState(prev => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement
      }));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        previousPage();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextPage();
        break;
      case '+':
      case '=':
        event.preventDefault();
        zoomIn();
        break;
      case '-':
        event.preventDefault();
        zoomOut();
        break;
      case '0':
        event.preventDefault();
        resetZoom();
        break;
      case 'f':
      case 'F11':
        event.preventDefault();
        toggleFullscreen();
        break;
      case 'r':
        event.preventDefault();
        rotate();
        break;
    }
  }, [previousPage, nextPage, zoomIn, zoomOut, resetZoom, toggleFullscreen, rotate]);

  // Download PDF
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${lessonTitle}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl, lessonTitle]);

  // Start document loading
  useEffect(() => {
    startDocumentLoad();
  }, [pdfUrl, startDocumentLoad]);

  const pageWidth = calculatePageWidth();
  const progressPercentage = viewState.numPages ? (pagesViewed.size / viewState.numPages) * 100 : 0;

  return (
    <PDFErrorBoundary
      pdfUrl={pdfUrl}
      lessonTitle={lessonTitle}
      onError={(error, errorInfo) => {
        trackError(error, 'error-boundary');
        console.error('PDF Error Boundary:', error, errorInfo);
      }}
    >
      <section
        className={`relative bg-muted rounded-lg mb-4 ${className}`}
        role="document"
        aria-label={`PDF Document Viewer: ${lessonTitle}`}
        aria-describedby="pdf-controls"
      >
        {/* Hidden description for screen readers */}
        <div id="pdf-controls" className="sr-only">
          PDF document viewer. Use arrow keys to navigate pages, plus and minus to zoom, 
          F key for fullscreen, R key to rotate. Current page {viewState.currentPage} of {viewState.numPages}.
        </div>

        {/* Progress indicator */}
        {viewState.numPages > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-lg overflow-hidden z-10">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {/* Navigation */}
            <button
              onClick={previousPage}
              disabled={viewState.currentPage <= 1}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="text-sm font-medium px-3">
              {viewState.currentPage} / {viewState.numPages}
            </span>
            
            <button
              onClick={nextPage}
              disabled={viewState.currentPage >= viewState.numPages}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Zoom controls */}
            <button
              onClick={zoomOut}
              disabled={viewState.zoomLevel <= 50}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <span 
              className="text-sm font-medium px-3 cursor-pointer hover:bg-gray-200 rounded"
              onClick={resetZoom}
              data-testid="zoom-display"
              title="Click to reset zoom"
            >
              {viewState.zoomLevel}%
            </span>
            
            <button
              onClick={zoomIn}
              disabled={viewState.zoomLevel >= 200}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Additional controls */}
            <div className="h-4 w-px bg-gray-300 mx-2" />
            
            <button
              onClick={rotate}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              aria-label="Rotate document"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            
            <button
              onClick={resetZoom}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              aria-label="Fit to width"
              title="Fit to width"
            >
              <Home className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              aria-label="Toggle fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              aria-label="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Performance toggle for developers */}
            {enableDeveloperMode && (
              <button
                onClick={toggleDashboard}
                className={`p-2 rounded transition-colors ${
                  alerts.length > 0 
                    ? 'text-red-600 hover:bg-red-100' 
                    : 'hover:bg-gray-200'
                }`}
                aria-label="Toggle performance dashboard"
                title={`Performance monitoring ${alerts.length > 0 ? '(alerts)' : ''}`}
              >
                <Activity className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* PDF Container */}
        <div
          ref={containerRef}
          className={`relative overflow-hidden flex items-start justify-center transition-all duration-200 ${
            viewState.isFullscreen 
              ? 'fixed inset-0 bg-black z-50 items-center' 
              : 'bg-gray-100 rounded-b-lg'
          }`}
          style={{
            minHeight: viewState.isFullscreen ? '100vh' : 'fit-content',
            height: viewState.isFullscreen ? '100vh' : 'auto'
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="application"
          aria-label={`PDF document, page ${viewState.currentPage} of ${viewState.numPages}. ${
            Math.round(progressPercentage)
          }% viewed.`}
          data-testid="pdf-container"
        >
          {viewState.isLoading && (
            <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading PDF document...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a few moments...</p>
            </div>
          )}

          {!viewState.isLoading && !viewState.error && (
            <div 
              ref={documentRef}
              className="pdf-document-container"
              data-testid="pdf-document"
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                loading={null} // Handled by our custom loading state
                error={null}   // Handled by error boundary
                className="flex flex-col items-center"
              >
                <Page
                  key={`${viewState.currentPage}-${viewState.zoomLevel}-${viewState.rotation}`}
                  pageNumber={viewState.currentPage}
                  width={pageWidth}
                  rotate={viewState.rotation}
                  onLoadSuccess={handlePageLoadSuccess}
                  onLoadError={handlePageLoadError}
                  className="shadow-lg max-w-full mx-auto rounded-lg"
                  renderTextLayer={false} // Optimized for performance
                  renderAnnotationLayer={true} // Keep for links and interactions
                  data-testid={`pdf-page-${viewState.currentPage}`}
                />
              </Document>
            </div>
          )}
        </div>

        {/* Fullscreen controls overlay */}
        {viewState.isFullscreen && (
          <div className="fixed top-4 right-4 z-50 flex space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
              aria-label="Exit fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Performance Dashboard */}
        {enablePerformanceMonitoring && (
          <PDFPerformanceDashboard
            isVisible={dashboardVisible}
            onClose={hideDashboard}
            position="bottom-right"
          />
        )}
      </section>
    </PDFErrorBoundary>
  );
};

export default PDFSectionEnhanced;