import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import QueryProvider from './providers/QueryProvider';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import AccessibilityControls from './components/AccessibilityControls';
import usePerformanceLevel from './hooks/usePerformanceLevel';
import useGoogleAnalytics from './hooks/useGoogleAnalytics';
import useScrollToHash from './hooks/useScrollToHash';
import useUrlCleanup from './hooks/useUrlCleanup';
import domOptimizer from './utils/domOptimizer';
import './styles/blog-animations.css';

/**
 * Layout específico para páginas de curso que precisam de header customizado
 * Remove o header global para evitar conflitos com headers específicos do curso
 */
function CourseLayout() {
  const location = useLocation();
  const { performanceLevel } = usePerformanceLevel();
  
  // Track page views with Google Analytics
  useGoogleAnalytics();
  
  // Clean up URLs with ~and~ encoding
  useUrlCleanup();
  
  // Auto-scroll to hash anchors
  useScrollToHash();

  // Inicializar otimizações ao montar o Layout
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Aplicar otimizações baseadas no nível de performance
      if (performanceLevel === 'LOW') {
        // Reduzir animações para dispositivos baixa performance
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
      }

      // Cleanup no unmount
      return () => {
        domOptimizer.destroy();
      };
    }
  }, [performanceLevel]);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryProvider>
          <div className="App bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-screen text-zinc-50">
            {/* Accessibility Controls */}
            <AccessibilityControls />
            
            {/* Main Content sem header global - cada página de curso define seu próprio header */}
            <main id="main-content" className="relative z-10">
              <Outlet />
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
        </QueryProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default CourseLayout;