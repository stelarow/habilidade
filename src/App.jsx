import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';

// Componente para redirecionamento de cursos
const CourseRedirect = () => {
  const { courseSlug } = useParams();
  return <Navigate to={`/cursos/${courseSlug}`} replace />;
};
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import Header from './components/Header';
import Footer from './components/Footer';
import AccessibilityControls from './components/AccessibilityControls';
import QueryProvider from './providers/QueryProvider';
import { HelmetProvider } from 'react-helmet-async';

// Importações com lazy loading para code splitting
const Home = React.lazy(() => import('./pages/Home'));
const CoursePage = React.lazy(() => import('./pages/CoursePage'));
const BlogIndex = React.lazy(() => import('./pages/BlogIndex'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const BlogCategory = React.lazy(() => import('./pages/BlogCategory'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Otimizações de performance
import domOptimizer from './utils/domOptimizer';
import usePerformanceLevel from './hooks/usePerformanceLevel';

function App() {
  const { performanceLevel } = usePerformanceLevel();

  // Inicializar otimizações ao montar o App
  useEffect(() => {
    // DOM Optimizer já é inicializado automaticamente
    
    // Preconnect para recursos externos
    const preconnectLinks = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.emailjs.com',
      'https://api.emailjs.com'
    ];

    preconnectLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

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
  }, [performanceLevel]);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryProvider>
          <Router future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
          <div className="App bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-screen text-zinc-50">
          {/* Accessibility Controls */}
          <AccessibilityControls />
          
          {/* Header */}
          <Header />
          
          {/* Main Content com lazy loading otimizado */}
          <main id="main-content" className="relative z-10">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cursos/:courseSlug" element={<CoursePage />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/categoria/:categorySlug" element={<BlogCategory />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/habilidade" element={<Navigate to="/" replace />} />
                <Route path="/habilidade/" element={<Navigate to="/" replace />} />
                <Route 
                  path="/habilidade/cursos/:courseSlug" 
                  element={<CourseRedirect />} 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          
          {/* Footer */}
          <Footer />
          </div>
          </Router>
        </QueryProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;