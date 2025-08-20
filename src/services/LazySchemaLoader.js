/**
 * Lazy Schema Loader
 * Defers Schema.org structured data loading to reduce main thread blocking
 */

class LazySchemaLoader {
  constructor() {
    this.isLoaded = false;
    this.loadTimeout = 2000; // 2 seconds fallback
    this.interactionEvents = ['click', 'scroll', 'keydown', 'mousemove', 'touchstart'];
    
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  init() {
    // Load immediately if user prefers reduced motion (accessibility)
    if (this.hasReducedMotionPreference()) {
      this.loadSchema();
      return;
    }

    // Set up interaction observers
    this.setupInteractionObserver();
    
    // Use requestIdleCallback for optimal timing
    this.setupIdleCallback();
    
    // Fallback timeout to ensure schema loads eventually
    this.setupFallbackTimeout();
  }

  hasReducedMotionPreference() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  setupInteractionObserver() {
    if (typeof document === 'undefined') return;
    
    const loadOnInteraction = () => {
      this.loadSchema();
      // Remove listeners after first interaction
      this.interactionEvents.forEach(event => {
        document.removeEventListener(event, loadOnInteraction, { passive: true });
      });
    };

    this.interactionEvents.forEach(event => {
      document.addEventListener(event, loadOnInteraction, { passive: true });
    });
  }

  setupIdleCallback() {
    if (typeof window === 'undefined' || !window.requestIdleCallback) return;

    window.requestIdleCallback(() => {
      if (!this.isLoaded) {
        this.loadSchema();
      }
    }, { timeout: this.loadTimeout });
  }

  setupFallbackTimeout() {
    setTimeout(() => {
      if (!this.isLoaded) {
        this.loadSchema();
      }
    }, this.loadTimeout);
  }

  loadSchema() {
    if (this.isLoaded || typeof document === 'undefined') return;
    
    this.isLoaded = true;
    
    try {
      // Inject Organization Schema
      this.injectOrganizationSchema();
      
      // Inject FAQ Schema
      this.injectFAQSchema();
      
      console.info('[Performance] Schema.org structured data loaded lazily');
    } catch (error) {
      console.warn('[LazySchema] Failed to load structured data:', error);
    }
  }

  injectOrganizationSchema() {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Escola Habilidade",
      "description": "Escola técnica especializada em cursos profissionalizantes de qualidade em Informática, Programação, Design, Marketing Digital, Inteligência Artificial e Business Intelligence.",
      "url": "https://www.escolahabilidade.com/",
      "logo": "https://www.escolahabilidade.com/logo-escola-habilidade.png",
      "image": "https://www.escolahabilidade.com/logo-escola-habilidade.png",
      "educationalCredentialAwarded": "Certificado Técnico Profissionalizante",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "São José",
        "addressRegion": "SC",
        "addressCountry": "BR",
        "postalCode": "88102-280",
        "streetAddress": "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-27.5969",
        "longitude": "-48.6356"
      },
      "areaServed": [
        { "@type": "City", "name": "Florianópolis" },
        { "@type": "City", "name": "São José" },
        { "@type": "City", "name": "Palhoça" },
        { "@type": "City", "name": "Biguaçu" },
        { "@type": "City", "name": "Santo Amaro da Imperatriz" }
      ],
      "telephone": "+55 48 98855-9491",
      "openingHours": "Mo-Tu 08:00-20:00, We 08:00-22:00, Th 08:00-20:00, Fr 08:00-17:30, Sa 08:00-12:00",
      "priceRange": "$$",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Catálogo de Cursos Técnicos",
        "itemListElement": [
          {
            "@type": "Course",
            "name": "Curso de Informática",
            "description": "Formação completa em informática básica e avançada",
            "provider": { "@type": "EducationalOrganization", "name": "Escola Habilidade" },
            "url": "https://www.escolahabilidade.com/cursos/informatica",
            "courseMode": "Blended",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Blended",
              "courseWorkload": "PT40H"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "BRL",
              "category": "EducationalOccupationalCredential"
            }
          },
          {
            "@type": "Course",
            "name": "Curso de Programação",
            "description": "Aprenda programação do zero ao avançado",
            "provider": { "@type": "EducationalOrganization", "name": "Escola Habilidade" },
            "url": "https://www.escolahabilidade.com/cursos/programacao",
            "courseMode": "Blended",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Blended",
              "courseWorkload": "PT40H"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "BRL",
              "category": "EducationalOccupationalCredential"
            }
          },
          {
            "@type": "Course",
            "name": "Curso de Design Gráfico",
            "description": "Formação completa em design gráfico e criação visual",
            "provider": { "@type": "EducationalOrganization", "name": "Escola Habilidade" },
            "url": "https://www.escolahabilidade.com/cursos/design-grafico",
            "courseMode": "Blended",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Blended",
              "courseWorkload": "PT40H"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "BRL",
              "category": "EducationalOccupationalCredential"
            }
          },
          {
            "@type": "Course",
            "name": "Curso de Projetista 3D",
            "description": "Especialização em modelagem e projeto 3D",
            "provider": { "@type": "EducationalOrganization", "name": "Escola Habilidade" },
            "url": "https://www.escolahabilidade.com/cursos/projetista-3d",
            "courseMode": "Blended",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Blended",
              "courseWorkload": "PT40H"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "BRL",
              "category": "EducationalOccupationalCredential"
            }
          },
          {
            "@type": "Course",
            "name": "Curso de Edição de Vídeo",
            "description": "Aprenda técnicas profissionais de edição de vídeo",
            "provider": { "@type": "EducationalOrganization", "name": "Escola Habilidade" },
            "url": "https://www.escolahabilidade.com/cursos/edicao-video",
            "courseMode": "Blended",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Blended",
              "courseWorkload": "PT40H"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "BRL",
              "category": "EducationalOccupationalCredential"
            }
          },
          {
            "@type": "Course",
            "name": "Curso de Marketing Digital",
            "description": "Formação completa em estratégias de marketing digital",
            "provider": { "@type": "EducationalOrganization", "name": "Escola Habilidade" },
            "url": "https://www.escolahabilidade.com/cursos/marketing-digital",
            "courseMode": "Blended",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Blended",
              "courseWorkload": "PT40H"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "BRL",
              "category": "EducationalOccupationalCredential"
            }
          },
          {
            "@type": "Course",
            "name": "Curso de Inteligência Artificial",
            "description": "Introdução e aplicação prática de IA",
            "provider": { "@type": "EducationalOrganization", "name": "Escola Habilidade" },
            "url": "https://www.escolahabilidade.com/cursos/inteligencia-artificial",
            "courseMode": "Blended",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Blended",
              "courseWorkload": "PT40H"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "BRL",
              "category": "EducationalOccupationalCredential"
            }
          },
          {
            "@type": "Course",
            "name": "Curso de Business Intelligence",
            "description": "Análise de dados e inteligência de negócios",
            "provider": { "@type": "EducationalOrganization", "name": "Escola Habilidade" },
            "url": "https://www.escolahabilidade.com/cursos/business-intelligence",
            "courseMode": "Blended",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Blended",
              "courseWorkload": "PT40H"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "BRL",
              "category": "EducationalOccupationalCredential"
            }
          }
        ]
      }
    };

    this.injectSchemaScript(organizationSchema, 'organization-schema');
  }

  injectFAQSchema() {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Quanto tempo dura o curso de Projetista 3D?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "O curso de Projetista 3D tem duração de 6 meses, com aulas 2 vezes por semana, totalizando 240 horas de conteúdo prático."
          }
        },
        {
          "@type": "Question",
          "name": "Vocês oferecem certificado reconhecido?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim, todos os nossos cursos oferecem certificado reconhecido pelo MEC e válido em todo território nacional."
          }
        },
        {
          "@type": "Question",
          "name": "Onde ficam as unidades da Escola Habilidade?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nossa sede principal fica em São José (Kobrasol) e atendemos toda Grande Florianópolis, incluindo Florianópolis, São José e Palhoça."
          }
        }
      ]
    };

    this.injectSchemaScript(faqSchema, 'faq-schema');
  }

  injectSchemaScript(schemaData, id) {
    if (typeof document === 'undefined') return;

    // Check if schema already exists
    if (document.getElementById(id)) return;

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaData);
    
    document.head.appendChild(script);
  }

  // Public method to check if schema is ready
  isReady() {
    return typeof window !== 'undefined' && this.isLoaded;
  }

  // Force load schema (for testing or special cases)
  forceLoad() {
    this.loadSchema();
  }
}

// Create singleton instance
const lazySchemaLoader = new LazySchemaLoader();

export default lazySchemaLoader;