import { useLayoutEffect, useEffect } from 'react';

// Use useLayoutEffect on client-side and useEffect on server-side
// to avoid hydration mismatches
export const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;