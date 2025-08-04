import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gaService from '../services/googleAnalyticsService';

/**
 * Hook to track page views with Google Analytics
 */
export function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page view whenever location changes
    const pagePath = location.pathname + location.search;
    const pageTitle = document.title;
    
    gaService.trackPageView(pagePath, pageTitle);
  }, [location]);
}

export default useGoogleAnalytics;