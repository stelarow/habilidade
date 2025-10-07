import { Helmet } from '@dr.pogodin/react-helmet';
import { HeroSection } from "./programacao/HeroSection"
import { CompanyLogos } from "./programacao/CompanyLogos"
import { PlatformSection } from "./programacao/PlatformSection"
import { AISection } from "./programacao/AISection"
import { FrameworksSection } from "./programacao/FrameworksSection"
import { InvestmentSection } from "./programacao/InvestmentSection"
import { TestimonialSection } from "./programacao/TestimonialSection"
import { FAQSection } from "./programacao/FAQSection"

// JSON-LD Schema para Course
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Completo - Lógica, Python, Java, PHP, Android e IA",
  "description": "Curso presencial de programação em São José SC. 133 horas com Lógica de Programação, Python, Java, PHP, Android Studio e Claude Code. Certificado nacional. Atendemos Grande Florianópolis - Florianópolis, Palhoça, Biguaçu.",
  "provider": {
    "@type": "Organization",
    "name": "Escola Habilidade",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol",
      "addressLocality": "São José",
      "addressRegion": "SC",
      "postalCode": "88103-265",
      "addressCountry": "BR"
    },
    "url": "https://www.escolahabilidade.com.br",
    "areaServed": [
      "São José, SC",
      "Florianópolis, SC",
      "Palhoça, SC",
      "Biguaçu, SC",
      "Grande Florianópolis"
    ]
  },
  "courseMode": "onsite",
  "educationalCredentialAwarded": "Certificado Nacional de 133h",
  "timeRequired": "PT133H",
  "offers": [
    {
      "@type": "Offer",
      "price": "4501.00",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "description": "Pagamento à vista com 6% de desconto"
    },
    {
      "@type": "Offer",
      "price": "4788.00",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "description": "Parcelamento em 12x no boleto ou 10x sem juros no cartão"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "6"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "João Silva"
      },
      "reviewBody": "O curso mudou minha vida! Consegui emprego como desenvolvedor em 6 meses.",
      "datePublished": "2024-11-15"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Maria Santos"
      },
      "reviewBody": "Metodologia incrível! Os professores são muito didáticos e experientes.",
      "datePublished": "2024-11-20"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Carlos Oliveira"
      },
      "reviewBody": "Melhor investimento que já fiz. Saí do zero e hoje trabalho em uma startup.",
      "datePublished": "2024-12-05"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Ana Costa"
      },
      "reviewBody": "Curso completo e atualizado. Aprendi muito além do que esperava.",
      "datePublished": "2024-12-10"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Pedro Lima"
      },
      "reviewBody": "Excelente estrutura e suporte. Recomendo para quem quer mudar de carreira.",
      "datePublished": "2024-12-18"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Juliana Ferreira"
      },
      "reviewBody": "Professores experientes e conteúdo sempre atualizado. Valeu muito a pena!",
      "datePublished": "2025-01-08"
    }
  ],
  "location": {
    "@type": "Place",
    "name": "Escola Habilidade",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol",
      "addressLocality": "São José",
      "addressRegion": "Santa Catarina",
      "postalCode": "88103-265",
      "addressCountry": "BR"
    }
  }
};

// Schema para LocalBusiness
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Escola Habilidade - Curso de Programação",
  "image": "https://www.escolahabilidade.com.br/logo-escola-habilidade.png",
  "description": "Escola de programação em São José SC. Cursos presenciais de Lógica, Python, Java, PHP, Android e IA. Atendemos Florianópolis, Palhoça e Biguaçu.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol",
    "addressLocality": "São José",
    "addressRegion": "SC",
    "postalCode": "88103-265",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-27.611",
    "longitude": "-48.635"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "São José",
      "containedInPlace": "SC"
    },
    {
      "@type": "City",
      "name": "Florianópolis",
      "containedInPlace": "SC"
    },
    {
      "@type": "City",
      "name": "Palhoça",
      "containedInPlace": "SC"
    },
    {
      "@type": "City",
      "name": "Biguaçu",
      "containedInPlace": "SC"
    }
  ],
  "telephone": "+55-48-98855-9491",
  "url": "https://www.escolahabilidade.com.br/cursos/programacao",
  "priceRange": "R$ 399,90 - R$ 4.788,00",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "6"
  }
};

// Schema FAQPage - 4 perguntas frequentes
const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "name": "Perguntas Frequentes - Curso de Programação",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Preciso ter conhecimento prévio em programação?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não! Começamos do absoluto zero com lógica de programação e evoluímos gradualmente até linguagens avançadas como Python, Java, PHP e Android. Nossa metodologia foi desenvolvida especialmente para iniciantes."
      }
    },
    {
      "@type": "Question",
      "name": "Qual a diferença entre as modalidades Presencial e Online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Presencial: aulas na escola com professores especializados, interação direta e ambiente dedicado ao aprendizado. Online: acesso remoto com suporte online, flexibilidade de horários. Ambas têm o mesmo conteúdo completo e apostilas inclusas."
      }
    },
    {
      "@type": "Question",
      "name": "As apostilas estão incluídas no preço?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Material didático impresso completo dos 6 módulos incluso sem custo adicional. Você recebe apostilas detalhadas de Lógica de Programação, Python, Java, PHP, Android Studio e Claude Code para consulta permanente."
      }
    },
    {
      "@type": "Question",
      "name": "O que é o Claude Code e quando estará disponível?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Claude Code é uma ferramenta de IA da Anthropic para desenvolvimento de código assistido por inteligência artificial. O módulo ensina como usar IA para acelerar seu desenvolvimento, criar projetos completos e resolver problemas complexos de programação. O conteúdo programático está sendo constantemente atualizado pela equipe."
      }
    }
  ]
};

// Schema BreadcrumbList
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://www.escolahabilidade.com.br"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Cursos",
      "item": "https://www.escolahabilidade.com.br/#cursos"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Programação",
      "item": "https://www.escolahabilidade.com.br/cursos/programacao"
    }
  ]
};

export function ProgramacaoNova2() {
  return (
    <main className="min-h-screen">
      {/* SEO e Meta Tags */}
      <Helmet>
        <title>Curso de Programação | Python, JavaScript, React | São José SC</title>
        <meta name="description" content="Curso de Programação presencial em São José SC. Python, JavaScript, React e desenvolvimento web. Do básico ao avançado." />
        <meta name="keywords" content="curso programação presencial, curso programação são josé, curso programação florianópolis, python, java, php, android, lógica programação, curso desenvolvimento web" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Escola Habilidade" />
        <meta name="theme-color" content="#14b8a6" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.escolahabilidade.com/cursos/programacao" />

        {/* Open Graph tags gerenciadas por transform-html-meta.js durante build */}
      </Helmet>

      {/* Schema.org JSON-LD - Renderizado fora do Helmet para compatibilidade com SSG */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(courseSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqPageSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />

      <HeroSection />
      <CompanyLogos />
      <PlatformSection />
      <AISection />
      <FrameworksSection />
      <InvestmentSection />
      <TestimonialSection />
      <FAQSection />
    </main>
  )
}
