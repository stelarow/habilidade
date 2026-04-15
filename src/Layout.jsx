import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import QueryProvider from './providers/QueryProvider';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import DeferredEffects from './components/DeferredEffects';
import usePerformanceLevel from './hooks/usePerformanceLevel';
import './styles/blog-animations.css';

function Layout() {
  const location = useLocation();
  const { performanceLevel } = usePerformanceLevel();
  const [nonCriticalLoaded, setNonCriticalLoaded] = useState(false);

  // Global click diagnostic
  useEffect(() => {
    console.log('[Layout] Adding global click listener');
    const handleGlobalClick = (e) => {
      console.log('[Layout] Global click detected on:', e.target.tagName, e.target.className.slice(0, 50));
    };
    document.addEventListener('click', handleGlobalClick, true); // capture phase
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  // Defer non-critical effects para após LCP render
  useEffect(() => {
    // Usa requestIdleCallback para máxima performance
    if ('requestIdleCallback' in globalThis) {
      requestIdleCallback(() => {
        setNonCriticalLoaded(true);
      }, { timeout: 2000 });
    } else {
      // Fallback para navegadores sem requestIdleCallback
      setTimeout(() => {
        setNonCriticalLoaded(true);
      }, 100);
    }
  }, []);

  // Aplicar otimizações de performance
  useEffect(() => {
    if (globalThis.window !== undefined && typeof document !== 'undefined' && performanceLevel === 'LOW') {
        // Reduzir animações para dispositivos baixa performance
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
      }
  }, [performanceLevel]);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryProvider>
          <div className="App bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-screen text-zinc-50">

              {/* Header */}
              <Header />

              {/* Main Content com lazy loading otimizado */}
              <main id="main-content" className="relative z-10">
                <Outlet />
              </main>

              {/* Footer */}
              <Footer />

              {/* Deferred Effects - carregados apenas após LCP */}
              {nonCriticalLoaded && <DeferredEffects />}
            </div>
        </QueryProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default Layout;