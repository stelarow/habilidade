import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Download, ExternalLink } from 'lucide-react';

interface PDFErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

interface PDFErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  pdfUrl?: string;
  lessonTitle?: string;
}

/**
 * Enhanced Error Boundary specifically designed for PDF rendering errors
 * Provides graceful error handling with retry mechanisms and user-friendly fallbacks
 */
export class PDFErrorBoundary extends Component<PDFErrorBoundaryProps, PDFErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: PDFErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<PDFErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error details
    console.error('PDF Error Boundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Track error in analytics/monitoring
    this.trackError(error, errorInfo);
  }

  componentWillUnmount() {
    // Clean up any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private trackError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Integration with error tracking service (Sentry, LogRocket, etc.)
    try {
      // Example integration - replace with your preferred service
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          tags: {
            component: 'PDFErrorBoundary',
            retryCount: this.state.retryCount
          },
          extra: {
            errorInfo,
            pdfUrl: this.props.pdfUrl,
            lessonTitle: this.props.lessonTitle
          },
          level: 'error'
        });
      }
    } catch (trackingError) {
      console.warn('Failed to track PDF error:', trackingError);
    }
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  private handleDownloadPDF = () => {
    if (this.props.pdfUrl) {
      const link = document.createElement('a');
      link.href = this.props.pdfUrl;
      link.download = `${this.props.lessonTitle || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  private handleOpenInNewTab = () => {
    if (this.props.pdfUrl) {
      window.open(this.props.pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  private getErrorType = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'network';
    }
    if (message.includes('pdf') || message.includes('invalid')) {
      return 'invalid-pdf';
    }
    if (message.includes('memory') || message.includes('out of memory')) {
      return 'memory';
    }
    if (message.includes('cors')) {
      return 'cors';
    }
    
    return 'unknown';
  };

  private renderErrorDetails = () => {
    const { error } = this.state;
    if (!error) return null;

    const errorType = this.getErrorType(error);
    
    const errorMessages = {
      network: {
        title: 'Network Connection Error',
        description: 'Unable to download the PDF file. Please check your internet connection.',
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Contact support if the problem persists'
        ]
      },
      'invalid-pdf': {
        title: 'Invalid PDF File',
        description: 'The PDF file appears to be corrupted or in an unsupported format.',
        suggestions: [
          'Try downloading the file directly',
          'Check if the file opens in other PDF viewers',
          'Contact support to report the issue'
        ]
      },
      memory: {
        title: 'Memory Limit Exceeded',
        description: 'The PDF file is too large for your browser to handle.',
        suggestions: [
          'Try closing other browser tabs',
          'Download the PDF instead of viewing online',
          'Use a device with more memory'
        ]
      },
      cors: {
        title: 'Security Restriction',
        description: 'Browser security settings prevent loading this PDF.',
        suggestions: [
          'Try downloading the PDF directly',
          'Open the PDF in a new tab',
          'Contact support for alternative access'
        ]
      },
      unknown: {
        title: 'PDF Rendering Error',
        description: 'An unexpected error occurred while displaying the PDF.',
        suggestions: [
          'Try refreshing the page',
          'Download the PDF to view offline',
          'Contact support if the issue continues'
        ]
      }
    };

    return errorMessages[errorType] || errorMessages.unknown;
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      const errorDetails = this.renderErrorDetails();
      const { maxRetries = 3 } = this.props;
      const canRetry = this.state.retryCount < maxRetries;

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 shadow-lg min-h-[400px]">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-12 h-12 text-red-500 mr-4" />
            <div>
              <h3 className="text-2xl font-bold text-red-800 mb-1">
                {errorDetails.title}
              </h3>
              <p className="text-red-600">
                {errorDetails.description}
              </p>
            </div>
          </div>

          {/* Error suggestions */}
          <div className="mb-6 p-4 bg-white rounded-lg border border-red-100 max-w-md">
            <h4 className="font-semibold text-gray-800 mb-2">Try these solutions:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {errorDetails.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {canRetry && (
              <button
                onClick={this.handleRetry}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again ({maxRetries - this.state.retryCount} left)
              </button>
            )}
            
            {this.props.pdfUrl && (
              <>
                <button
                  onClick={this.handleDownloadPDF}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
                
                <button
                  onClick={this.handleOpenInNewTab}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </button>
              </>
            )}
          </div>

          {/* Technical details (development only) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 p-4 bg-gray-100 rounded-lg w-full max-w-2xl">
              <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                Technical Details
              </summary>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                {this.state.error.message}
                {this.state.error.stack && (
                  <>
                    {'\n\nStack Trace:\n'}
                    {this.state.error.stack}
                  </>
                )}
              </pre>
            </details>
          )}

          {/* Retry count indicator */}
          {this.state.retryCount > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Attempt {this.state.retryCount + 1} of {maxRetries + 1}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Enhanced PDF Loading Component with error handling
 */
export const PDFLoadingFallback: React.FC<{ message?: string }> = ({ 
  message = "Loading PDF document..." 
}) => (
  <div className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-lg border border-blue-200 min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
    <p className="text-blue-800 font-medium">{message}</p>
    <p className="text-blue-600 text-sm mt-2">This may take a few moments...</p>
  </div>
);

/**
 * Simple PDF Error Fallback for basic use cases
 */
export const SimplePDFErrorFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200">
    <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
    <p className="text-red-700 text-center mb-4">Unable to display PDF</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export default PDFErrorBoundary;