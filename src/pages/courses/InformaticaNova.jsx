import { InformaticaNovaHeroSection } from '../../components/course/informatica-nova/InformaticaNovaHeroSection';
import { InformaticaNovaPortfolioSection } from '../../components/course/informatica-nova/InformaticaNovaPortfolioSection';
import { InformaticaNovaSuccessCases } from '../../components/course/informatica-nova/InformaticaNovaSuccessCases';
import { InformaticaNovaTransformationPromise } from '../../components/course/informatica-nova/InformaticaNovaTransformationPromise';
import { InformaticaNovaTestimonials } from '../../components/course/informatica-nova/InformaticaNovaTestimonials';
import { InformaticaNovaGuarantee } from '../../components/course/informatica-nova/InformaticaNovaGuarantee';
import { InformaticaNovaInvestment } from '../../components/course/informatica-nova/InformaticaNovaInvestment';
import { InformaticaNovaFAQ } from '../../components/course/informatica-nova/InformaticaNovaFAQ';
import { InformaticaNovaFloatingCTA } from '../../components/course/informatica-nova/InformaticaNovaFloatingCTA';
import { InformaticaNovaCurriculum } from '../../components/course/informatica-nova/InformaticaNovaCurriculum';
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
  "name": "Curso de Informática Básica - Windows 11, Office e IA",
  "description": "Curso completo de informática básica com Windows 11, pacote Office completo, ambientes digitais, Canva e inteligência artificial aplicada. 8 módulos completos para preparação total no mercado de trabalho.",
  "provider": {
    "@type": "Organization",
    "name": "Escola Habilidade",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São José",
      "addressRegion": "SC",
      "addressCountry": "BR"
    },
    "url": "https://www.escolahabilidade.com.br"
  },
  "courseMode": "blended",
  "educationalCredentialAwarded": "Certificado Nacional de 184,5h",
  "timeRequired": "PT184.5H",
  "offers": {
    "@type": "Offer",
    "price": "597.00",
    "priceCurrency": "BRL",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "150"
  },
  "location": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São José",
      "addressRegion": "Santa Catarina",
      "addressCountry": "BR"
    }
  }
};

const InformaticaNova = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* SEO e Meta Tags */}
      <Helmet>
        <title>Curso de Informática Básica Florianópolis - Windows 11, Office e Excel - Escola Habilidade São José</title>
        <meta name="description" content="Curso completo de informática básica em Florianópolis e São José SC. Windows 11, Excel, Word, PowerPoint, Canva e IA aplicada. 184h, material incluso, aulas presenciais e online." />
        <meta name="keywords" content="curso informática básica florianópolis, windows 11 são josé sc, excel completo grande florianópolis, office santa catarina, informática iniciante SC" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Curso de Informática Básica - Windows 11, Office e IA | São José SC" />
        <meta property="og:description" content="Curso presencial completo de informática em São José SC. 184 horas práticas, Windows 11, Office, Canva e IA aplicada." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Schema.org para Curso */}
        <script type="application/ld+json">
          {JSON.stringify(courseSchema)}
        </script>
      </Helmet>

      {/* Seções obrigatórias na ordem */}
      <InformaticaNovaHeroSection />
      <InformaticaNovaPortfolioSection />
      <InformaticaNovaSuccessCases />
      <InformaticaNovaTransformationPromise />
      <InformaticaNovaCurriculum />
      <InformaticaNovaTestimonials />
      
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