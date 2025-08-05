import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook to clean up URLs that contain ~and~ encoding
 * This handles cases where URLs were corrupted by GitHub Pages SPA script
 */
function useUrlCleanup() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUrl = location.pathname + location.search + location.hash;
    
    // Check if URL contains ~and~ encoding
    if (currentUrl.includes('~and~')) {
      // Clean the URL by replacing ~and~ with &
      const cleanUrl = currentUrl.replace(/~and~/g, '&');
      
      // Navigate to the clean URL, replacing the current history entry
      navigate(cleanUrl, { replace: true });
      
      console.log('Cleaned URL from:', currentUrl, 'to:', cleanUrl);
    }
  }, [location, navigate]);
}

export default useUrlCleanup;