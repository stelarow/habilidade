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

// Importações com lazy loading para code splitting
const Home = React.lazy(() => import('./pages/Home'));
const CoursePage = React.lazy(() => import('./pages/CoursePage'));
const BlogIndex = React.lazy(() => import('./pages/BlogIndex'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// ... (resto do componente)

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cursos/:courseSlug" element={<CoursePage />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/habilidade" element={<Navigate to="/" replace />} />
                <Route path="/habilidade/" element={<Navigate to="/" replace />} />
                <Route 
                  path="/habilidade/cursos/:courseSlug" 
                  element={<CourseRedirect />} 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>

export default App;
