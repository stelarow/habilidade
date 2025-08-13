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

      // Preload crítico baseado na rota atual
      const currentPath = window.location.pathname;
      
      // Preload inteligente baseado na página
      if (currentPath.startsWith('/blog')) {
        // Preload componentes do blog
        import('./components/LazyComponents.jsx').then(module => {
          module.preloadBlogComponents();
        });
      } else if (currentPath.startsWith('/cursos/')) {
        // Preload componentes de curso
        import('./components/LazyComponents.jsx').then(module => {
          module.preloadCourseComponents();
        });
      } else if (currentPath === '/' || currentPath === '') {
        // Preload componentes críticos para home
        import('./components/LazyComponents.jsx').then(module => {
          module.preloadCriticalComponents();
        });
      }

      // Preload on hover para navegação
      const preloadOnHover = (selector, importFn) => {
        document.addEventListener('mouseover', (e) => {
          if (e.target.matches(selector)) {
            importFn();
          }
        }, { once: true });
      };

      // Preload inteligente por hover
      preloadOnHover('a[href^="/blog"]', () => {
        import('./components/LazyComponents.jsx').then(module => {
          module.preloadBlogComponents();
        });
      });

      preloadOnHover('a[href^="/cursos/"]', () => {
        import('./components/LazyComponents.jsx').then(module => {
          module.preloadCourseComponents();
        });
      });

      preloadOnHover('a[href="/contato"], button[data-contact]', () => {
        import('./components/LazyComponents.jsx').then(module => {
          module.ContactForm;
        });
      });

      // Otimização de performance - Intersection Observer para lazy loading de imagens
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
              }
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });

        // Observe lazy images
        setTimeout(() => {
          document.querySelectorAll('img.lazy, img[data-src]').forEach(img => {
            imageObserver.observe(img);
          });
        }, 100);
      }

      // Performance analytics (opcional)
      if (window.gtag) {
        // Measure bundle sizes and loading times
        const perfObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            if (entry.name.includes('chunk') && entry.transferSize) {
              window.gtag('event', 'bundle_loaded', {
                bundle_name: entry.name.split('/').pop(),
                transfer_size: entry.transferSize,
                duration: entry.duration
              });
            }
          });
        });
        
        if ('PerformanceObserver' in window) {
          perfObserver.observe({ entryTypes: ['resource'] });
        }
      }
    }
  }
)
