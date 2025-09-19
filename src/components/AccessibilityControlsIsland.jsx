/**
 * AccessibilityControls Island - Critical Component for Progressive Hydration
 */

import { withIslandHydration } from './shared/IslandComponent';
import AccessibilityControls from './AccessibilityControls';

// Convert AccessibilityControls to Island with critical hydration
const AccessibilityControlsIsland = withIslandHydration(AccessibilityControls, {
  name: 'AccessibilityControls',
  critical: true, // Critical for accessibility - hydrate immediately
  fallback: (
    <div className="fixed bottom-4 right-4 z-50 opacity-50">
      <div className="w-12 h-12 bg-gray-800 rounded-full animate-pulse"></div>
    </div>
  )
});

export default AccessibilityControlsIsland;