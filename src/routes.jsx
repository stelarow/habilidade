import React, { Suspense } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Layout from './Layout.jsx';
import CourseLayout from './CourseLayout.jsx';
import Loading from './components/Loading';

// Importações com lazy loading para code splitting
const Home = React.lazy(() => import('./pages/Home'));
const CoursePage = React.lazy(() => import('./pages/CoursePage'));
const Contact = React.lazy(() => import('./pages/Contact'));
const BlogIndex = React.lazy(() => import('./pages/BlogIndex'));
const BlogTestPage = React.lazy(() => import('./pages/BlogTestPage'));
const BlogCategory = React.lazy(() => import('./pages/BlogCategory'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const CursosFlorianopolis = React.lazy(() => import('./pages/CursosFlorianopolis'));
const CursosSaoJose = React.lazy(() => import('./pages/CursosSaoJose'));
const CursosPalhoca = React.lazy(() => import('./pages/CursosPalhoca'));
const CursoSketchupEnscape = React.lazy(() => import('./pages/CursoSketchupEnscape'));

// Componente para redirecionamento de cursos
const CourseRedirect = () => {
  const { courseSlug } = useParams();
  return <Navigate to={`/cursos/${courseSlug}`} replace />;
};

// Slugs dos posts do blog (dados estáticos para SSG)
const blogSlugs = [
  'guia-completo-21-estilos-decoracao-transformar-casa',
  'por-que-enscape-essencial-visualizacao-arquitetonica',
  'o-que-e-sketchup-guia-completo-modelagem-3d-2025',
  'historia-sketchup-software-arquitetura',
  'design-espacos-varejo-sketchup-pro',
  'sketchup-arquitetura-paisagistica',
  'tipos-puxadores-moveis',
  'sketchup-workflows-avancados-arquitetura-paisagistica',
  'como-usar-sketchup-para-design-conceitual-arquitetonico',
  'dominando-shape-bender-curvando-geometrias-sketchup',
  'como-construir-seu-primeiro-agente-ia-n8n',
  'cinco-maneiras-maximizar-vistas-magnificas-casas-personalizadas',
  '10-dicas-especialistas-renderizacoes-enscape-destaque',
  'como-apresentar-projetos-design-interior-sketchup',
  'acelerando-workflow-grey-boxing-sketchup',
  '10-extensoes-sketchup-arquitetos',
  'editor-materiais-sketchup-realismo-enscape',
  'guia-completo-enscape-sketchup-iniciantes',
  'guia-completo-enscape-sketchup'
];

// Configuração das rotas para vite-react-ssg
export const routes = [
  // Rotas de curso com layout específico (sem header global) - DEVEM VIR ANTES das rotas gerais
  {
    path: '/cursos/sketchup-enscape',
    element: <CourseLayout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading />}><CursoSketchupEnscape /></Suspense>
      }
    ]
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        lazy: () => import('./pages/Home')
      },
      {
        path: 'cursos/:courseSlug',
        lazy: () => import('./pages/CoursePage')
      },
      {
        path: 'contato',
        element: <Suspense fallback={<Loading />}><Contact /></Suspense>
      },
      {
        path: 'blog',
        children: [
          {
            index: true,
            lazy: () => import('./pages/BlogIndex')
          },
          {
            path: 'categoria/:categorySlug',
            lazy: () => import('./pages/BlogCategory')
          },
          {
            path: ':slug',
            lazy: () => import('./pages/BlogPostSSG'),
            getStaticPaths: () => blogSlugs
          }
        ]
      },
      {
        path: 'blog-test',
        children: [
          {
            index: true,
            lazy: () => import('./pages/BlogTestPage')
          },
          {
            path: ':slug',
            lazy: () => import('./pages/BlogTestPage')
          }
        ]
      },
      // Páginas de localização (SEO local)
      {
        path: 'cursos-florianopolis',
        element: <Suspense fallback={<Loading />}><CursosFlorianopolis /></Suspense>
      },
      {
        path: 'cursos-sao-jose',
        element: <Suspense fallback={<Loading />}><CursosSaoJose /></Suspense>
      },
      {
        path: 'cursos-palhoca',
        element: <Suspense fallback={<Loading />}><CursosPalhoca /></Suspense>
      },
      // Redirects para compatibilidade
      {
        path: 'habilidade',
        element: <Navigate to="/" replace />
      },
      {
        path: 'habilidade/',
        element: <Navigate to="/" replace />
      },
      {
        path: 'habilidade/cursos/:courseSlug',
        element: <CourseRedirect />
      },
      {
        path: '*',
        lazy: () => import('./pages/NotFound')
      }
    ]
  }
];