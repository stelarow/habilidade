import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export const usePageContext = () => {
  const location = useLocation();
  const params = useParams();
  const [context, setContext] = useState({
    pageType: 'home',
    currentCourse: null,
    breadcrumbs: [],
    activeSection: null
  });

  useEffect(() => {
    const currentPath = location.pathname;
    const courseSlug = params.courseSlug || params.slug;
    
    let newContext = {
      pageType: 'home',
      currentCourse: null,
      breadcrumbs: [],
      activeSection: null
    };

    if (currentPath === '/' || currentPath === '/habilidade' || currentPath === '/habilidade/') {
      newContext.pageType = 'home';
    } else if (currentPath.startsWith('/cursos/') || currentPath.includes('/cursos/')) {
      newContext.pageType = 'coursePage';
      newContext.currentCourse = courseSlug;
    } else if (currentPath.startsWith('/blog')) {
      newContext.pageType = 'blogPage';
    } else {
      newContext.pageType = 'other';
    }

    setContext(newContext);
  }, [location.pathname, params.courseSlug, params.slug]);

  return context;
}; 