import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes.jsx'
import './index.css'

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, routes, isClient, initialState }) => {
    // Setup providers and initialize performance optimizations
    if (isClient) {
      // Initialize client-side optimizations
      const preconnectLinks = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com', 
        'https://cdn.emailjs.com',
        'https://api.emailjs.com'
      ];

      preconnectLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    }
  }
)
