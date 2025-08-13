import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes.jsx'
import { intelligentPreload } from './utils/dynamicImports.js'
import { intersectionObserverManager } from './utils/performanceOptimizer.js'
import './utils/observerMonitoring.js' // Auto-inicializa o monitoramento
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
      
      // Sistema de preload inteligente
      intelligentPreload(currentPath);
      
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

      // Otimização de performance - Intersection Observer centralizado para lazy loading
      if ('IntersectionObserver' in window) {
        // Função para inicializar lazy loading de imagens
        const initializeLazyImages = () => {
          const lazyImages = document.querySelectorAll('img[data-src], img.lazy');
          
          lazyImages.forEach(img => {
            intersectionObserverManager.observe(
              img,
              (entry) => {
                if (entry.isIntersecting) {
                  const imgElement = entry.target;
                  
                  // Suporte a data-src e srcset
                  if (imgElement.dataset.src) {
                    imgElement.src = imgElement.dataset.src;
                    
                    // Carregar srcset se disponível
                    if (imgElement.dataset.srcset) {
                      imgElement.srcset = imgElement.dataset.srcset;
                    }
                    
                    imgElement.classList.remove('lazy');
                    imgElement.classList.add('loaded');
                    
                    // Auto-unobserve após carregar
                    intersectionObserverManager.unobserve(imgElement);
                  }
                  
                  // Fallback para loading nativo
                  if (imgElement.loading === 'lazy') {
                    imgElement.loading = 'eager';
                  }
                }
              },
              {
                rootMargin: '100px 0px', // Aumentado para carregamento mais suave
                threshold: 0.1
              }
            );
          });
        };

        // Executar inicialização de lazy images
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initializeLazyImages);
        } else {
          initializeLazyImages();
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
