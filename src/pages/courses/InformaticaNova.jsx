import { InformaticaNovaHeroSection } from '../../components/course/informatica-nova/InformaticaNovaHeroSection';
import InformaticaNovaMethodSection from '../../components/course/informatica-nova/InformaticaNovaMethodSection';
import { InformaticaNovaSuccessCases } from '../../components/course/informatica-nova/InformaticaNovaSuccessCases';
import { InformaticaNovaTransformationPromise } from '../../components/course/informatica-nova/InformaticaNovaTransformationPromise';
import { InformaticaNovaTestimonials } from '../../components/course/informatica-nova/InformaticaNovaTestimonials';
import { InformaticaNovaGuarantee } from '../../components/course/informatica-nova/InformaticaNovaGuarantee';
import { InformaticaNovaInvestment } from '../../components/course/informatica-nova/InformaticaNovaInvestment';
import { InformaticaNovaFAQ } from '../../components/course/informatica-nova/InformaticaNovaFAQ';
import InformaticaNovaContactSection from '../../components/course/informatica-nova/InformaticaNovaContactSection';
import { InformaticaNovaFloatingCTA } from '../../components/course/informatica-nova/InformaticaNovaFloatingCTA';
import { InformaticaNovaCurriculum } from '../../components/course/informatica-nova/InformaticaNovaCurriculum';
import { InformaticaNovaLocationSection } from '../../components/course/informatica-nova/InformaticaNovaLocationSection';
import TrustedCompanies from '../../components/TrustedCompanies';
import { Helmet } from '@dr.pogodin/react-helmet';
import { 
  CheckCircle, 
  Rocket
} from '@phosphor-icons/react';
import { handleCTAClick } from '../../utils/ctaUtils';

// JSON-LD Schema para SEO
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Informática Presencial - Excel, Word, PowerPoint e IA",
  "description": "Curso presencial de informática em São José SC. Excel avançado, Word, PowerPoint, Canva e Inteligência Artificial. Atendemos toda Grande Florianópolis - Florianópolis, Palhoça, Biguaçu. 184 horas com certificado nacional.",
  "provider": {
    "@type": "Organization",
    "name": "Escola Habilidade",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Principal, Centro",
      "addressLocality": "São José",
      "addressRegion": "SC", 
      "postalCode": "88000-000",
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
  "educationalCredentialAwarded": "Certificado Nacional de 184,5h",
  "timeRequired": "PT184.5H",
  "offers": [
    {
      "@type": "Offer",
      "price": "3382.87",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "description": "Pagamento à vista com 6% de desconto"
    },
    {
      "@type": "Offer",
      "price": "3598.80",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "description": "Parcelamento no boleto ou cartão"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "150"
  },
  "location": {
    "@type": "Place",
    "name": "Escola Habilidade",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Principal, Centro",
      "addressLocality": "São José",
      "addressRegion": "Santa Catarina",
      "postalCode": "88000-000",
      "addressCountry": "BR"
    }
  }
};

// Schema para LocalBusiness
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Escola Habilidade - Curso de Informática",
  "image": "https://www.escolahabilidade.com.br/assets/informatica-nova/hero/hero-bg-new.jpg",
  "description": "Escola de informática em São José SC. Cursos presenciais de Excel, Word, PowerPoint, Canva e Inteligência Artificial. Atendemos Florianópolis, Palhoça e Biguaçu.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Principal, Centro",
    "addressLocality": "São José",
    "addressRegion": "SC",
    "postalCode": "88000-000",
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
  "telephone": "+55-48-99999-9999",
  "url": "https://www.escolahabilidade.com.br/cursos/informatica-nova",
  "priceRange": "R$ 299,90 - R$ 3.598,80",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "150"
  }
};

const InformaticaNova = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* SEO e Meta Tags */}
      <Helmet>
        <title>Curso de Informática Presencial São José SC | Excel Básico ao Avançado, Word, Canva e IA</title>
        <meta name="description" content="Curso de informática presencial em São José SC. Excel, Word, PowerPoint, Canva e IA. Atendemos Florianópolis, Palhoça e Biguaçu. Certificado 184h." />
        <meta name="keywords" content="curso informática presencial, curso informática são josé, curso informática florianópolis, curso informática palhoça, curso informática biguaçu, excel avançado, word, powerpoint, inteligência artificial, canva" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Curso de Informática Básica - Windows 11, Office e IA | São José SC" />
        <meta property="og:description" content="Curso presencial completo de informática em São José SC. 184 horas práticas, Windows 11, Office, Canva e IA aplicada." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Schema.org para Curso */}
        <script type="application/ld+json">
          {JSON.stringify(courseSchema)}
        </script>
        
        {/* Schema.org para LocalBusiness */}
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      {/* Seções obrigatórias na ordem */}
      <InformaticaNovaHeroSection />
      <InformaticaNovaMethodSection />
      <InformaticaNovaSuccessCases />
      <InformaticaNovaTransformationPromise />
      <InformaticaNovaCurriculum />
      <InformaticaNovaTestimonials />
      <InformaticaNovaLocationSection />
      
      {/* Empresas Parceiras */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <TrustedCompanies 
          variant="course"
          courseSlug="informatica-nova"
          title="Empresas que confiam na Escola Habilidade"
          subtitle="Profissionais de empresas regionais já se capacitaram conosco"
          theme="dark"
        />
      </section>
      
      <InformaticaNovaGuarantee />
      <InformaticaNovaInvestment />

      {/* Seção de Contato Progressivo */}
      <InformaticaNovaContactSection />

      <InformaticaNovaFAQ />
      <InformaticaNovaFloatingCTA />
      
      {/* CTA Final - Estrutura padronizada */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-br from-blue-500/20 via-zinc-950 to-cyan-400/20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 bg-clip-text text-transparent">PRONTO PARA</span>
              <br />
              <span className="text-white">DOMINAR A</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 bg-clip-text text-transparent">INFORMÁTICA?</span>
            </h2>
            
            <p className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto">
              Junte-se a mais de 150 alunos que já mudaram de vida
              com nosso método presencial comprovado.
            </p>

            <div className="space-y-6">
              <button 
                onClick={() => handleCTAClick('hero')}
                className="group relative overflow-hidden rounded-xl px-12 py-6 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 animate-pulse flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <Rocket className="w-6 h-6" />
                QUERO DOMINAR INFORMÁTICA - ÚLTIMAS VAGAS
              </button>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Garantia de 7 dias</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Material Incluso</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Suporte Vitalício</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default InformaticaNova;

// Required for React Router v6 lazy loading
export const Component = InformaticaNova;