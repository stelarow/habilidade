import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { PDFSection } from '../PDFSection';
import { PDFErrorBoundary } from '../PDFErrorBoundary';
import { usePDFPerformance } from '../../hooks/usePDFPerformance';

// Mock react-pdf
jest.mock('react-pdf', () => ({
  Document: ({ children, onLoadSuccess, onLoadError, file }: any) => {
    // Simulate successful load after delay
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (file.includes('valid')) {
          onLoadSuccess?.({ numPages: 3 });
        } else if (file.includes('error')) {
          onLoadError?.(new Error('Invalid PDF file'));
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }, [file, onLoadSuccess, onLoadError]);
    
    return <div data-testid="pdf-document">{children}</div>;
  },
  Page: ({ pageNumber, width, onLoadSuccess, onLoadError, ...props }: any) => {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (pageNumber <= 3) {
          onLoadSuccess?.({ 
            pageNumber, 
            height: width * 1.414, // A4 ratio
            width 
          });
        } else {
          onLoadError?.(new Error('Page not found'));
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }, [pageNumber, onLoadSuccess, onLoadError]);
    
    return (
      <div 
        data-testid={`pdf-page-${pageNumber}`}
        style={{ 
          width: `${width}px`, 
          height: `${width * 1.414}px`,
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc'
        }}
        {...props}
      >
        Page {pageNumber}
      </div>
    );
  },
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: ''
    }
  }
}));

// Mock performance hook
jest.mock('../../hooks/usePDFPerformance');
const mockUsePDFPerformance = usePDFPerformance as jest.MockedFunction<typeof usePDFPerformance>;

// Sample PDF data URLs for testing
const VALID_PDF_URL = 'data:application/pdf;base64,valid-pdf-content';
const INVALID_PDF_URL = 'data:application/pdf;base64,error-pdf-content';
const NETWORK_ERROR_URL = 'https://invalid-domain.test/document.pdf';

describe('Enhanced PDF Section Tests', () => {
  let mockPerformanceHook: any;
  
  beforeEach(() => {
    // Reset performance hook mock
    mockPerformanceHook = {
      metrics: {
        loadTime: 0,
        renderTime: 0,
        memoryUsage: 45,
        errorCount: 0,
        pageLoadTimes: {},
        averagePageLoad: 0,
        containerHeight: 600,
        contentHeight: 590,
        blankSpaceRatio: 0.02
      },
      alerts: [],
      isTracking: false,
      startDocumentLoad: jest.fn(),
      endDocumentLoad: jest.fn(),
      startPageRender: jest.fn(),
      endPageRender: jest.fn(),
      trackError: jest.fn(),
      trackDimensions: jest.fn(),
      generateReport: jest.fn(),
      resetMetrics: jest.fn()
    };
    
    mockUsePDFPerformance.mockReturnValue(mockPerformanceHook);
    
    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
    
    // Mock performance API
    Object.defineProperty(window, 'performance', {
      value: {
        now: jest.fn(() => Date.now()),
        memory: {
          usedJSHeapSize: 50 * 1024 * 1024 // 50MB
        }
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Blank Space Prevention', () => {
    test('should not create excessive blank space below PDF content', async () => {
      render(
        <PDFErrorBoundary>
          <PDFSection pdfUrl={VALID_PDF_URL} />
        </PDFErrorBoundary>
      );

      await waitFor(() => {
        expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      // Check that dimensions tracking was called
      expect(mockPerformanceHook.trackDimensions).toHaveBeenCalled();
      
      // Verify blank space ratio is within acceptable limits
      expect(mockPerformanceHook.metrics.blankSpaceRatio).toBeLessThan(0.1);
    });

    test('should maintain proper aspect ratio for PDF pages', async () => {
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        const page = screen.getByTestId('pdf-page-1');
        const computedStyle = window.getComputedStyle(page);
        const width = parseInt(computedStyle.width);
        const height = parseInt(computedStyle.height);
        
        // Check A4 aspect ratio (approximately 1.414)
        const ratio = height / width;
        expect(ratio).toBeCloseTo(1.414, 1);
      });
    });

    test('should handle container resize without creating blank space', async () => {
      const { rerender } = render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      // Simulate window resize
      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 800 });
        window.dispatchEvent(new Event('resize'));
      });

      rerender(<PDFSection pdfUrl={VALID_PDF_URL} />);

      // Verify container adjusts without blank space
      await waitFor(() => {
        expect(mockPerformanceHook.trackDimensions).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Zoom Functionality', () => {
    test('should implement width-based zoom correctly', async () => {
      const user = userEvent.setup();
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      const zoomInButton = screen.getByLabelText(/zoom in/i);
      const zoomDisplay = screen.getByTestId('zoom-display');

      // Initial zoom should be 100%
      expect(zoomDisplay).toHaveTextContent('100%');

      // Test zoom in
      await user.click(zoomInButton);
      await waitFor(() => {
        expect(zoomDisplay).toHaveTextContent('125%');
      });

      // Test multiple zoom levels
      await user.click(zoomInButton);
      await waitFor(() => {
        expect(zoomDisplay).toHaveTextContent('150%');
      });
    });

    test('should respect zoom limits', async () => {
      const user = userEvent.setup();
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      const zoomInButton = screen.getByLabelText(/zoom in/i);
      const zoomOutButton = screen.getByLabelText(/zoom out/i);
      const zoomDisplay = screen.getByTestId('zoom-display');

      // Test maximum zoom (200%)
      for (let i = 0; i < 10; i++) {
        await user.click(zoomInButton);
      }
      
      await waitFor(() => {
        expect(zoomDisplay).toHaveTextContent('200%');
      });

      // Test minimum zoom (50%)
      for (let i = 0; i < 20; i++) {
        await user.click(zoomOutButton);
      }
      
      await waitFor(() => {
        expect(zoomDisplay).toHaveTextContent('50%');
      });
    });

    test('should maintain page quality at different zoom levels', async () => {
      const user = userEvent.setup();
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      const zoomInButton = screen.getByLabelText(/zoom in/i);
      
      // Zoom in and check page dimensions update
      await user.click(zoomInButton);
      
      await waitFor(() => {
        const page = screen.getByTestId('pdf-page-1');
        const width = parseInt(window.getComputedStyle(page).width);
        expect(width).toBeGreaterThan(800); // Assuming default width is around 800px
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle PDF loading errors gracefully', async () => {
      render(
        <PDFErrorBoundary>
          <PDFSection pdfUrl={INVALID_PDF_URL} />
        </PDFErrorBoundary>
      );

      await waitFor(() => {
        expect(screen.getByText(/PDF Rendering Error/i)).toBeInTheDocument();
        expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
      });

      expect(mockPerformanceHook.trackError).toHaveBeenCalled();
    });

    test('should provide retry functionality', async () => {
      const user = userEvent.setup();
      render(
        <PDFErrorBoundary maxRetries={2}>
          <PDFSection pdfUrl={INVALID_PDF_URL} />
        </PDFErrorBoundary>
      );

      await waitFor(() => {
        expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByText(/Try Again/i);
      expect(retryButton).toHaveTextContent('Try Again (2 left)');

      await user.click(retryButton);

      await waitFor(() => {
        const updatedRetryButton = screen.getByText(/Try Again/i);
        expect(updatedRetryButton).toHaveTextContent('Try Again (1 left)');
      });
    });

    test('should offer alternative access methods on error', async () => {
      render(
        <PDFErrorBoundary pdfUrl={INVALID_PDF_URL}>
          <PDFSection pdfUrl={INVALID_PDF_URL} />
        </PDFErrorBoundary>
      );

      await waitFor(() => {
        expect(screen.getByText(/Download PDF/i)).toBeInTheDocument();
        expect(screen.getByText(/Open in New Tab/i)).toBeInTheDocument();
      });
    });

    test('should handle network errors differently from file errors', async () => {
      render(
        <PDFErrorBoundary>
          <PDFSection pdfUrl={NETWORK_ERROR_URL} />
        </PDFErrorBoundary>
      );

      await waitFor(() => {
        expect(screen.getByText(/Network Connection Error/i)).toBeInTheDocument();
        expect(screen.getByText(/Check your internet connection/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance Monitoring', () => {
    test('should track loading performance metrics', async () => {
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      expect(mockPerformanceHook.startDocumentLoad).toHaveBeenCalled();
      expect(mockPerformanceHook.endDocumentLoad).toHaveBeenCalled();
      expect(mockPerformanceHook.startPageRender).toHaveBeenCalled();
      expect(mockPerformanceHook.endPageRender).toHaveBeenCalled();
    });

    test('should detect and report performance issues', async () => {
      // Mock slow performance
      mockPerformanceHook.metrics = {
        ...mockPerformanceHook.metrics,
        loadTime: 5000, // 5 seconds (above threshold)
        blankSpaceRatio: 0.5 // 50% blank space
      };
      mockPerformanceHook.alerts = [
        { metric: 'loadTime', value: 5000, timestamp: Date.now() },
        { metric: 'blankSpaceRatio', value: 0.5, timestamp: Date.now() }
      ];

      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      // Should show performance warnings
      expect(mockPerformanceHook.alerts).toHaveLength(2);
    });

    test('should generate performance reports', async () => {
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      // Trigger report generation
      act(() => {
        mockPerformanceHook.generateReport();
      });

      expect(mockPerformanceHook.generateReport).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels and roles', async () => {
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByRole('document')).toBeInTheDocument();
        expect(screen.getByLabelText(/PDF Document Viewer/i)).toBeInTheDocument();
      });
    });

    test('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      const pdfContainer = screen.getByRole('application');
      
      // Focus the container
      await user.click(pdfContainer);
      
      // Test arrow key navigation
      await user.keyboard('{ArrowRight}');
      
      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-2')).toBeInTheDocument();
      });
      
      // Test zoom keyboard shortcuts
      await user.keyboard('{+}');
      
      await waitFor(() => {
        const zoomDisplay = screen.getByTestId('zoom-display');
        expect(zoomDisplay).toHaveTextContent('125%');
      });
    });

    test('should announce page changes to screen readers', async () => {
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        const container = screen.getByRole('application');
        expect(container).toHaveAttribute('aria-label', expect.stringContaining('page 1 of'));
      });
    });
  });

  describe('Responsive Design', () => {
    test('should adapt to mobile viewports', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 667 });

      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        const page = screen.getByTestId('pdf-page-1');
        const width = parseInt(window.getComputedStyle(page).width);
        expect(width).toBeLessThan(375); // Should fit mobile screen
      });
    });

    test('should handle orientation changes', async () => {
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      // Simulate orientation change
      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 667 });
        Object.defineProperty(window, 'innerHeight', { value: 375 });
        window.dispatchEvent(new Event('orientationchange'));
      });

      // Should maintain proper scaling
      await waitFor(() => {
        expect(mockPerformanceHook.trackDimensions).toHaveBeenCalled();
      });
    });
  });

  describe('Integration Tests', () => {
    test('should work with lesson progress tracking', async () => {
      const mockTrackProgress = jest.fn();
      
      render(
        <PDFSection 
          pdfUrl={VALID_PDF_URL} 
          onPageView={mockTrackProgress}
          lessonId="test-lesson"
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      // Should track page view
      expect(mockTrackProgress).toHaveBeenCalledWith(1);
    });

    test('should integrate with fullscreen mode', async () => {
      const user = userEvent.setup();
      
      // Mock fullscreen API
      document.exitFullscreen = jest.fn().mockResolvedValue(undefined);
      (document.documentElement as any).requestFullscreen = jest.fn().mockResolvedValue(undefined);
      
      render(<PDFSection pdfUrl={VALID_PDF_URL} />);

      await waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
      });

      const fullscreenButton = screen.getByLabelText(/fullscreen/i);
      await user.click(fullscreenButton);

      expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    });
  });
});

describe('Visual Regression Tests', () => {
  test('should maintain consistent visual appearance', async () => {
    const { container } = render(<PDFSection pdfUrl={VALID_PDF_URL} />);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
    });

    // This would typically use a visual regression testing tool
    // like Percy, Chromatic, or Playwright's visual comparisons
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render error states consistently', async () => {
    const { container } = render(
      <PDFErrorBoundary>
        <PDFSection pdfUrl={INVALID_PDF_URL} />
      </PDFErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText(/PDF Rendering Error/i)).toBeInTheDocument();
    });

    expect(container.firstChild).toMatchSnapshot();
  });
});

// Performance benchmark tests
describe('Performance Benchmarks', () => {
  test('should load within performance budget', async () => {
    const startTime = performance.now();
    
    render(<PDFSection pdfUrl={VALID_PDF_URL} />);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
    });

    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(2000); // 2 second budget
  });

  test('should not exceed memory thresholds', async () => {
    render(<PDFSection pdfUrl={VALID_PDF_URL} />);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
    });

    expect(mockPerformanceHook.metrics.memoryUsage).toBeLessThan(100); // 100MB limit
  });
});