/**
 * WhatsAppFloat Island - Critical Component for Progressive Hydration
 */

import { withIslandHydration } from './IslandComponent';
import WhatsAppFloat from './WhatsAppFloat';

// Convert WhatsAppFloat to Island with critical hydration
const WhatsAppFloatIsland = withIslandHydration(WhatsAppFloat, {
  name: 'WhatsAppFloat',
  critical: true, // Critical for contact - hydrate immediately
  fallback: (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-14 h-14 bg-green-500 rounded-full animate-pulse shadow-lg">
        <div className="w-8 h-8 bg-white rounded-full mx-auto mt-3 opacity-60"></div>
      </div>
    </div>
  )
});

export default WhatsAppFloatIsland;