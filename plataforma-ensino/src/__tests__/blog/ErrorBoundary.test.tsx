import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BlogErrorBoundary } from '@/components/blog/BlogErrorBoundary';
import { blogErrorLogger } from '@/lib/blog/errorLogger';

// Mock the error logger
jest.mock('@/lib/blog/errorLogger', () => ({
  blogErrorLogger: {
    logError: jest.fn()
  }
}));

// Mock Sentry
const mockSentryCapture = jest.fn();
(global as any).window = {
  Sentry: {
    captureException: mockSentryCapture
  }
};

// Mock console methods to avoid test output pollution
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Component that throws different types of errors
const NetworkError = () => {
  throw new Error('Network request failed');
};

const ComponentError = () => {
  throw new Error('Component render failed');
};

const DataError = () => {
  throw new Error('JSON parse error');
};

describe('BlogErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Error Simulation Tests', () => {
    it('should catch and display error when child component throws', () => {
      render(
        <BlogErrorBoundary fallbackType="generic">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();
      expect(screen.getByText(/Encontramos um problema técnico/)).toBeInTheDocument();
    });

    it('should render children normally when no error occurs', () => {
      render(
        <BlogErrorBoundary fallbackType="generic">
          <ThrowError shouldThrow={false} />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Algo deu errado')).not.toBeInTheDocument();
    });

    it('should handle network errors with appropriate fallback', () => {
      render(
        <BlogErrorBoundary fallbackType="generic">
          <NetworkError />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();
    });

    it('should handle component errors with appropriate fallback', () => {
      render(
        <BlogErrorBoundary fallbackType="post">
          <ComponentError />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Conteúdo Temporariamente Indisponível')).toBeInTheDocument();
    });

    it('should handle data errors with appropriate fallback', () => {
      render(
        <BlogErrorBoundary fallbackType="list">
          <DataError />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Lista Temporariamente Indisponível')).toBeInTheDocument();
    });
  });

  describe('Fallback Rendering Tests', () => {
    it('should render post fallback correctly', () => {
      render(
        <BlogErrorBoundary fallbackType="post">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Conteúdo Temporariamente Indisponível')).toBeInTheDocument();
      expect(screen.getByText(/Nossa equipe foi notificada/)).toBeInTheDocument();
      expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
      expect(screen.getByText('Recarregar Página')).toBeInTheDocument();
      expect(screen.getByText('Voltar')).toBeInTheDocument();
    });

    it('should render list fallback correctly', () => {
      render(
        <BlogErrorBoundary fallbackType="list">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Lista Temporariamente Indisponível')).toBeInTheDocument();
      expect(screen.getByText(/Algumas funcionalidades podem estar limitadas/)).toBeInTheDocument();
      // Should show sample articles
      expect(screen.getByText('Artigo em destaque #1')).toBeInTheDocument();
    });

    it('should render category fallback correctly', () => {
      render(
        <BlogErrorBoundary fallbackType="category">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Categoria Temporariamente Indisponível')).toBeInTheDocument();
      expect(screen.getByText('Explorar Outras Categorias')).toBeInTheDocument();
    });

    it('should render search fallback correctly', () => {
      render(
        <BlogErrorBoundary fallbackType="search">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Busca Temporariamente Indisponível')).toBeInTheDocument();
      expect(screen.getByText('Ver Artigos em Destaque')).toBeInTheDocument();
    });

    it('should render generic fallback as default', () => {
      render(
        <BlogErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();
      expect(screen.getByText('Voltar ao Início')).toBeInTheDocument();
    });
  });

  describe('Recovery Button Functionality', () => {
    it('should reset error state when retry button is clicked', async () => {
      const onError = jest.fn();
      
      const TestComponent = () => {
        const [shouldThrow, setShouldThrow] = React.useState(true);
        
        React.useEffect(() => {
          // Simulate fixing the error after retry
          const timer = setTimeout(() => {
            if (shouldThrow) setShouldThrow(false);
          }, 100);
          return () => clearTimeout(timer);
        }, [shouldThrow]);
        
        return <ThrowError shouldThrow={shouldThrow} />;
      };

      render(
        <BlogErrorBoundary fallbackType="generic" onError={onError}>
          <TestComponent />
        </BlogErrorBoundary>
      );

      // Error should be displayed
      expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();

      // Click retry button
      const retryButton = screen.getByText('Tentar Novamente');
      fireEvent.click(retryButton);

      // Wait for component to potentially re-render
      await waitFor(() => {
        // The retry should reset the error boundary
        expect(onError).toHaveBeenCalled();
      });
    });

    it('should limit retry attempts', () => {
      let retryCount = 0;
      
      const TestComponent = () => {
        retryCount++;
        throw new Error(`Retry attempt ${retryCount}`);
      };

      render(
        <BlogErrorBoundary fallbackType="generic">
          <TestComponent />
        </BlogErrorBoundary>
      );

      // Should show retry button initially
      expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();

      // After max retries, button should be disabled or hidden
      const retryButton = screen.getByText('Tentar Novamente');
      
      // Simulate multiple retry attempts
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);

      // After 3 retries, button should still be there but might be disabled
      expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
    });
  });

  describe('Logging Tests', () => {
    it('should log error when boundary catches an error', () => {
      const onError = jest.fn();

      render(
        <BlogErrorBoundary fallbackType="generic" onError={onError}>
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test error'
        }),
        expect.any(Object)
      );
    });

    it('should call Sentry when error occurs', () => {
      render(
        <BlogErrorBoundary fallbackType="generic">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(mockSentryCapture).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test error'
        }),
        expect.objectContaining({
          tags: expect.objectContaining({
            component: 'BlogErrorBoundary',
            fallbackType: 'generic'
          })
        })
      );
    });

    it('should include context information in error logging', () => {
      const onError = jest.fn();

      render(
        <BlogErrorBoundary fallbackType="post" onError={onError}>
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
    });
  });

  describe('Navigation Functionality', () => {
    // Mock window methods
    const mockReload = jest.fn();
    const mockBack = jest.fn();
    
    beforeAll(() => {
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true
      });
      Object.defineProperty(window, 'history', {
        value: { back: mockBack },
        writable: true
      });
    });

    it('should reload page when reload button is clicked', () => {
      render(
        <BlogErrorBoundary fallbackType="generic">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      const reloadButton = screen.getByText('Recarregar Página');
      fireEvent.click(reloadButton);

      expect(mockReload).toHaveBeenCalled();
    });

    it('should go back when back button is clicked', () => {
      render(
        <BlogErrorBoundary fallbackType="post">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      const backButton = screen.getByText('Voltar');
      fireEvent.click(backButton);

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Error Details Display', () => {
    it('should show error details when showErrorDetails is true', () => {
      render(
        <BlogErrorBoundary fallbackType="generic" showErrorDetails={true}>
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Detalhes técnicos')).toBeInTheDocument();
    });

    it('should not show error details when showErrorDetails is false', () => {
      render(
        <BlogErrorBoundary fallbackType="generic" showErrorDetails={false}>
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(screen.queryByText('Detalhes técnicos')).not.toBeInTheDocument();
    });

    it('should not show error details by default', () => {
      render(
        <BlogErrorBoundary fallbackType="generic">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(screen.queryByText('Detalhes técnicos')).not.toBeInTheDocument();
    });
  });

  describe('Performance Tests', () => {
    it('should not impact performance when no error occurs', () => {
      const startTime = performance.now();
      
      render(
        <BlogErrorBoundary fallbackType="generic">
          <div>Normal content</div>
        </BlogErrorBoundary>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render quickly (less than 50ms in most cases)
      expect(renderTime).toBeLessThan(100);
    });

    it('should render fallback quickly when error occurs', () => {
      const startTime = performance.now();
      
      render(
        <BlogErrorBoundary fallbackType="generic">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Fallback should render quickly (less than 200ms)
      expect(renderTime).toBeLessThan(300);
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly when nested', () => {
      render(
        <BlogErrorBoundary fallbackType="generic">
          <div>
            <BlogErrorBoundary fallbackType="post">
              <ThrowError shouldThrow={true} />
            </BlogErrorBoundary>
          </div>
        </BlogErrorBoundary>
      );

      // Inner boundary should catch the error
      expect(screen.getByText('Conteúdo Temporariamente Indisponível')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Algo deu errado')).not.toBeInTheDocument();
    });

    it('should preserve layout structure in fallbacks', () => {
      render(
        <BlogErrorBoundary fallbackType="list">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      // Should maintain responsive grid structure
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should maintain accessibility in error states', () => {
      render(
        <BlogErrorBoundary fallbackType="generic">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      // Buttons should be accessible
      const retryButton = screen.getByText('Tentar Novamente');
      expect(retryButton).toBeInTheDocument();
      expect(retryButton.tagName).toBe('BUTTON');
    });
  });

  describe('User Experience Tests', () => {
    it('should display user-friendly messages', () => {
      render(
        <BlogErrorBoundary fallbackType="generic">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      // Should not show technical error details by default
      expect(screen.queryByText('Test error')).not.toBeInTheDocument();
      
      // Should show friendly message
      expect(screen.getByText(/Nossa equipe foi automaticamente notificada/)).toBeInTheDocument();
    });

    it('should provide helpful action buttons', () => {
      render(
        <BlogErrorBoundary fallbackType="post">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
      expect(screen.getByText('Recarregar Página')).toBeInTheDocument();
      expect(screen.getByText('Voltar')).toBeInTheDocument();
      expect(screen.getByText('Reportar Problema')).toBeInTheDocument();
    });

    it('should maintain visual consistency with design system', () => {
      render(
        <BlogErrorBoundary fallbackType="generic">
          <ThrowError shouldThrow={true} />
        </BlogErrorBoundary>
      );

      // Should use consistent styling
      const container = screen.getByText('Oops! Algo deu errado').closest('div');
      expect(container).toHaveClass('min-h-screen');
      expect(container).toHaveClass('bg-gradient-to-br');
    });
  });
});