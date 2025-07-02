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
    if (location.pathname === '/') {
      setContext(prev => ({ ...prev, pageType: 'home' }));
    } else if (location.pathname.startsWith('/cursos/')) {
      setContext(prev => ({ 
        ...prev, 
        pageType: 'coursePage',
        currentCourse: params.slug 
      }));
    } else {
      setContext(prev => ({ ...prev, pageType: 'other' }));
    }
  }, [location, params]);

  return context;
}; 