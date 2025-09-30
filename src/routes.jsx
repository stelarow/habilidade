import React, { Suspense } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Layout from './Layout.jsx';
import Loading from './components/Loading';

// Lazy loading removido - usando React Router lazy() diretamente nas rotas


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
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        lazy: () => import('./pages/Home')
      },
      // Rotas de cursos
      {
        path: 'cursos/sketchup-enscape',
        lazy: () => import('./pages/CursoSketchupEnscape')
      },
      {
        path: 'cursos/informatica',
        lazy: () => import('./pages/courses/Informatica')
      },
      {
        path: 'cursos/projetista-3d',
        lazy: () => import('./pages/courses/Projetista3D')
      },
      {
        path: 'cursos/design-grafico',
        lazy: async () => {
          const { default: Component, loader } = await import('./pages/courses/DesignGrafico');
          return { Component, loader };
        }
      },
      {
        path: 'cursos/programacao',
        lazy: () => import('./pages/courses/Programacao')
      },
      {
        path: 'cursos/marketing-digital',
        lazy: async () => {
          const { default: Component, loader } = await import('./pages/courses/MarketingDigital');
          return { Component, loader };
        }
      },
      {
        path: 'cursos/inteligencia-artificial',
        lazy: async () => {
          const { default: Component, loader } = await import('./pages/courses/InteligenciaArtificial');
          return { Component, loader };
        }
      },
      {
        path: 'cursos/excel-avancado-business-intelligence',
        lazy: async () => {
          const { default: Component, loader } = await import('./pages/courses/BusinessIntelligence');
          return { Component, loader };
        }
      },
      // Redirect 301: business-intelligence → excel-avancado-business-intelligence
      {
        path: 'cursos/business-intelligence',
        element: <Navigate to="/cursos/excel-avancado-business-intelligence" replace />
      },
      {
        path: 'cursos/edicao-video',
        lazy: async () => {
          const { default: Component, loader } = await import('./pages/courses/EdicaoVideo');
          return { Component, loader };
        }
      },
      {
        path: 'cursos/administracao',
        lazy: async () => {
          const { default: Component, loader } = await import('./pages/courses/Administracao');
          return { Component, loader };
        }
      },
      {
        path: 'contato',
        lazy: () => import('./pages/Contact')
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
      // Páginas de localização (SEO local)
      {
        path: 'cursos-florianopolis',
        lazy: () => import('./pages/CursosFlorianopolis')
      },
      {
        path: 'cursos-sao-jose',
        lazy: () => import('./pages/CursosSaoJose')
      },
      {
        path: 'cursos-palhoca',
        lazy: () => import('./pages/CursosPalhoca')
      },
      // Página do teste vocacional
      {
        path: 'teste-vocacional',
        lazy: () => import('./pages/TesteVocacional')
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