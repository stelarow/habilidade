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
const TesteVocacional = React.lazy(() => import('./pages/TesteVocacional'));

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
  'sketchup-2025-visualizacao-3d-materiais-fotorrealistas',
  '5-razoes-organizacoes-investir-treinamento-excel',
  'transforme-dados-em-decisoes-estrategicas-dashboards-empresariais'
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
        element: <Suspense key="course-sketchup-enscape" fallback={<Loading />}><CursoSketchupEnscape /></Suspense>
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
      // Rotas estáticas individuais para garantir SSG
      {
        path: 'cursos/informatica',
        lazy: () => import('./pages/courses/Informatica')
      },
      {
        path: 'cursos/design-grafico',
        lazy: () => import('./pages/courses/DesignGrafico')
      },
      {
        path: 'cursos/programacao',
        lazy: () => import('./pages/courses/Programacao')
      },
      {
        path: 'cursos/marketing-digital',
        lazy: () => import('./pages/courses/MarketingDigital')
      },
      {
        path: 'cursos/inteligencia-artificial',
        lazy: () => import('./pages/courses/InteligenciaArtificial')
      },
      {
        path: 'cursos/excel-avancado-business-intelligence',
        lazy: () => import('./pages/courses/BusinessIntelligence')
      },
      // Redirect 301: business-intelligence → excel-avancado-business-intelligence
      {
        path: 'cursos/business-intelligence',
        element: <Navigate to="/cursos/excel-avancado-business-intelligence" replace />
      },
      {
        path: 'cursos/projetista-3d',
        lazy: () => import('./pages/courses/Projetista3D')
      },
      {
        path: 'cursos/projetista-3d-novo',
        lazy: () => import('./pages/courses/Projetista3DNew')
      },
      {
        path: 'cursos/edicao-video',
        lazy: () => import('./pages/courses/EdicaoVideo')
      },
      {
        path: 'cursos/administracao',
        lazy: () => import('./pages/courses/Administracao')
      },
      {
        path: 'contato',
        element: <Suspense key="contact-page" fallback={<Loading />}><Contact /></Suspense>
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
        element: <Suspense key="cursos-florianopolis" fallback={<Loading />}><CursosFlorianopolis /></Suspense>
      },
      {
        path: 'cursos-sao-jose',
        element: <Suspense key="cursos-sao-jose" fallback={<Loading />}><CursosSaoJose /></Suspense>
      },
      {
        path: 'cursos-palhoca',
        element: <Suspense key="cursos-palhoca" fallback={<Loading />}><CursosPalhoca /></Suspense>
      },
      // Página do teste vocacional
      {
        path: 'teste-vocacional',
        element: <TesteVocacional />
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