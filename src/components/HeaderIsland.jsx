/**
 * Header Island - Critical Component for Progressive Hydration
 */

import { withIslandHydration } from './shared/IslandComponent';
import Header from './Header';

// Convert Header to Island with critical hydration
const HeaderIsland = withIslandHydration(Header, {
  name: 'Header',
  critical: true, // Critical for navigation - hydrate immediately
  fallback: (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="hidden md:flex space-x-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="md:hidden w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </header>
  )
});

export default HeaderIsland;