import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes.jsx'
import { intelligentPreload } from './utils/dynamicImports.js'
import './index.css'

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, routes, isClient, initialState }) => {
    // Setup providers and initialize performance optimizations
    if (isClient) {
      console.log('🚀 MAIN.JSX: Client-side initialization started');
      console.log('📍 CURRENT PATH:', window.location.pathname);
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
      
      // Sistema de preload inteligente
      console.log('🔄 PRELOAD: Starting intelligent preload for', currentPath);
      intelligentPreload(currentPath);
      
      // Preload inteligente baseado na página
      if (currentPath.startsWith('/blog')) {
        console.log('📝 BLOG PRELOAD: Loading blog components');
        // Preload componentes do blog
        import('./components/LazyComponents.jsx').then(module => {
          console.log('✅ BLOG COMPONENTS: Loaded successfully');
          module.preloadBlogComponents();
        }).catch(err => {
          console.error('❌ BLOG COMPONENTS: Failed to load', err);
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

      // Otimização de performance - Intersection Observer aprimorado para lazy loading
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              
              // Suporte a data-src e srcset
              if (img.dataset.src) {
                img.src = img.dataset.src;
                
                // Carregar srcset se disponível
                if (img.dataset.srcset) {
                  img.srcset = img.dataset.srcset;
                }
                
                img.classList.remove('lazy');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
              }
              
              // Fallback para loading nativo
              if (img.loading === 'lazy') {
                img.loading = 'eager';
              }
            }
          });
        }, {
          rootMargin: '100px 0px', // Aumentado para carregamento mais suave
          threshold: 0.1
        });

        // Observer aprimorado para executar após DOM ready
        const observeImages = () => {
          const lazyImages = document.querySelectorAll('img.lazy, img[data-src], img[loading="lazy"]');
          lazyImages.forEach(img => {
            imageObserver.observe(img);
          });
        };

        // Observar imagens iniciais e novas
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', observeImages);
        } else {
          observeImages();
        }

        // Re-observar após mudanças no DOM (para SPAs)
        if (window.MutationObserver) {
          const domObserver = new MutationObserver(() => {
            setTimeout(observeImages, 100);
          });
          
          domObserver.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
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
