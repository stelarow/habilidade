import { useState, useEffect } from 'react';

/**
 * Hook to prevent hydration mismatches by only rendering content on client-side
 * after initial hydration is complete
 */
export function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}