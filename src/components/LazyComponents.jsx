import React, { Suspense, lazy } from 'react';
import Loading from './Loading';

// Lazy loading para componentes pesados do blog
export const BlogTypography = lazy(() => import('./blog/BlogTypography.jsx'));
export const AdvancedSearch = lazy(() => import('./blog/AdvancedSearch.jsx'));
export const TableOfContents = lazy(() => import('./blog/TableOfContents.jsx'));
export const ShareButtons = lazy(() => import('./blog/ShareButtons.jsx'));
export const QuickContactModal = lazy(() => import('./blog/QuickContactModal.jsx'));

// Lazy loading para componentes pesados do curso
export const CourseCurriculum = lazy(() => import('./course/CourseCurriculum.jsx'));
export const CourseTestimonials = lazy(() => import('./course/CourseTestimonials.jsx'));
export const CourseWorkflowSection = lazy(() => import('./course/CourseWorkflowSection.jsx'));
export const CourseToolsOverview = lazy(() => import('./course/CourseToolsOverview.jsx'));

// Lazy loading para componentes de formulário pesados
export const ContactForm = lazy(() => import('./ContactForm.jsx'));
export const CourseContactForm = lazy(() => import('./course/CourseContactForm.jsx'));
export const SmartImageUpload = lazy(() => import('./SmartImageUpload.jsx'));

// Lazy loading para componentes de navegação complexos
export const MegaMenu = lazy(() => import('./header/MegaMenu.jsx'));
export const MobileMegaMenu = lazy(() => import('./header/MobileMegaMenu.jsx'));

// Componentes de fallback otimizados
const ComponentFallback = ({ height = '200px' }) => (
  <div className={`flex items-center justify-center bg-gray-50 animate-pulse`} style={{ minHeight: height }}>
    <div className="text-gray-400">
      <Loading />
    </div>
  </div>
);

const FormFallback = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="h-32 bg-gray-200 rounded"></div>
    <div className="h-10 bg-blue-200 rounded w-32"></div>
  </div>
);

const MenuFallback = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-24"></div>
  </div>
);

// HOC para lazy loading com fallbacks personalizados
export const withLazy = (Component, fallback = <ComponentFallback />) => {
  return React.forwardRef((props, ref) => (
    <Suspense fallback={fallback}>
      <Component {...props} ref={ref} />
    </Suspense>
  ));
};

// Componentes wrapeados com lazy loading
export const LazyBlogTypography = withLazy(BlogTypography);
export const LazyAdvancedSearch = withLazy(AdvancedSearch, <ComponentFallback height="120px" />);
export const LazyTableOfContents = withLazy(TableOfContents, <ComponentFallback height="300px" />);
export const LazyShareButtons = withLazy(ShareButtons, <ComponentFallback height="50px" />);
export const LazyQuickContactModal = withLazy(QuickContactModal);

export const LazyCourseCurriculum = withLazy(CourseCurriculum, <ComponentFallback height="400px" />);
export const LazyCourseTestimonials = withLazy(CourseTestimonials, <ComponentFallback height="300px" />);
export const LazyCourseWorkflowSection = withLazy(CourseWorkflowSection, <ComponentFallback height="500px" />);
export const LazyCourseToolsOverview = withLazy(CourseToolsOverview, <ComponentFallback height="600px" />);

export const LazyContactForm = withLazy(ContactForm, <FormFallback />);
export const LazyCourseContactForm = withLazy(CourseContactForm, <FormFallback />);
export const LazySmartImageUpload = withLazy(SmartImageUpload, <ComponentFallback height="150px" />);

export const LazyMegaMenu = withLazy(MegaMenu, <MenuFallback />);
export const LazyMobileMegaMenu = withLazy(MobileMegaMenu, <MenuFallback />);

// Preload functions for critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be needed
  ContactForm;
  MegaMenu;
  MobileMegaMenu;
};

export const preloadBlogComponents = () => {
  BlogTypography;
  ShareButtons;
  TableOfContents;
};

export const preloadCourseComponents = () => {
  CourseCurriculum;
  CourseTestimonials;
  CourseContactForm;
};