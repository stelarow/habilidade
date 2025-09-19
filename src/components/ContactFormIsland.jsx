/**
 * ContactForm Island - Critical Component for Progressive Hydration
 */

import { withIslandHydration } from './shared/IslandComponent';
import ContactForm from './ContactForm';

// Convert ContactForm to Island with critical hydration
const ContactFormIsland = withIslandHydration(ContactForm, {
  name: 'ContactForm',
  critical: true, // Critical component - hydrate immediately
  fallback: (
    <div className="animate-pulse bg-gray-200 rounded-lg h-96 flex items-center justify-center">
      <span className="text-gray-500">Carregando formulário...</span>
    </div>
  )
});

export default ContactFormIsland;