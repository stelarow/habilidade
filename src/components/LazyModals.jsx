/**
 * Lazy Modals - Progressive Loading for Modal Components
 */

import { lazy, Suspense } from 'react';
import { withIslandHydration } from './shared/IslandComponent';

// Lazy load modal components
const QuickContactModal = lazy(() => import('./QuickContactModal'));

// Modal fallback component
const ModalFallback = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Create lazy island versions of modals
export const LazyQuickContactModal = withIslandHydration(
  (props) => (
    <Suspense fallback={<ModalFallback />}>
      <QuickContactModal {...props} />
    </Suspense>
  ),
  { name: 'QuickContactModal', critical: false }
);

// Other heavy components that should be lazy loaded
const ShareButtons = lazy(() => import('./blog/ShareButtons'));
const AdvancedSearch = lazy(() => import('./blog/AdvancedSearch'));

export const LazyShareButtons = withIslandHydration(
  (props) => (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded h-10 w-40"></div>}>
      <ShareButtons {...props} />
    </Suspense>
  ),
  { name: 'ShareButtons', critical: false }
);

export const LazyAdvancedSearch = withIslandHydration(
  (props) => (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded h-12 w-full"></div>}>
      <AdvancedSearch {...props} />
    </Suspense>
  ),
  { name: 'AdvancedSearch', critical: false }
);