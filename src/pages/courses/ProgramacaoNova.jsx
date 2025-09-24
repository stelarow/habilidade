import { ProgramacaoNovaHeroSection } from '../../components/course/programacao-nova/ProgramacaoNovaHeroSection';
import ProgramacaoNovaMethodSection from '../../components/course/programacao-nova/ProgramacaoNovaMethodSection';
import { ProgramacaoNovaSuccessCases } from '../../components/course/programacao-nova/ProgramacaoNovaSuccessCases';
import { ProgramacaoNovaTransformationPromise } from '../../components/course/programacao-nova/ProgramacaoNovaTransformationPromise';
import { ProgramacaoNovaTestimonials } from '../../components/course/programacao-nova/ProgramacaoNovaTestimonials';
import { ProgramacaoNovaGuarantee } from '../../components/course/programacao-nova/ProgramacaoNovaGuarantee';
import { ProgramacaoNovaInvestment } from '../../components/course/programacao-nova/ProgramacaoNovaInvestment';
import { ProgramacaoNovaFAQ } from '../../components/course/programacao-nova/ProgramacaoNovaFAQ';
import ProgramacaoNovaContactSection from '../../components/course/programacao-nova/ProgramacaoNovaContactSection';
import { ProgramacaoNovaFloatingCTA } from '../../components/course/programacao-nova/ProgramacaoNovaFloatingCTA';
import { ProgramacaoNovaCurriculum } from '../../components/course/programacao-nova/ProgramacaoNovaCurriculum';
import { ProgramacaoNovaLocationSection } from '../../components/course/programacao-nova/ProgramacaoNovaLocationSection';
import TrustedCompanies from '../../components/TrustedCompanies';
import { Head } from 'vite-react-ssg';
import {
  CheckCircle,
  Rocket
} from '@phosphor-icons/react';
import { handleCTAClick } from '../../utils/ctaUtils';

// JSON-LD Schema para SEO
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Presencial - Python, JavaScript, HTML/CSS e IA",
  "description": "Curso presencial de programação em São José SC. Python, JavaScript, HTML/CSS, Git e Inteligência Artificial. Atendemos toda Grande Florianópolis - Florianópolis, Palhoça, Biguaçu. 250 horas com certificado nacional.",
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
  "educationalCredentialAwarded": "Certificado Nacional de 250h",
  "timeRequired": "PT250H",
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
  "name": "Escola Habilidade - Curso de Programação",
  "image": "https://www.escolahabilidade.com.br/assets/programacao-nova/hero/hero-bg-new.jpg",
  "description": "Escola de programação em São José SC. Cursos presenciais de Python, JavaScript, HTML/CSS, Git e Inteligência Artificial. Atendemos Florianópolis, Palhoça e Biguaçu.",
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
  "url": "https://www.escolahabilidade.com.br/cursos/programacao-nova",
  "priceRange": "R$ 299,90 - R$ 3.598,80",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "150"
  }
};

const ProgramacaoNova = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* SEO e Meta Tags */}
      <Head>
        <title>Curso de Programação Presencial São José SC | Python, JavaScript, HTML/CSS e IA</title>
        <meta name="description" content="Curso de programação presencial em São José SC. Python, JavaScript, HTML/CSS, Git e IA. Atendemos Florianópolis, Palhoça e Biguaçu. Certificado 250h." />
        <meta name="keywords" content="curso programação presencial, curso programação são josé, curso programação florianópolis, curso programação palhoça, curso programação biguaçu, python, javascript, html css, git, inteligência artificial" />

        {/* Open Graph */}
        <meta property="og:title" content="Curso de Programação - Python, JavaScript, HTML/CSS e IA | São José SC" />
        <meta property="og:description" content="Curso presencial completo de programação em São José SC. 250 horas práticas, Python, JavaScript, HTML/CSS, Git e IA aplicada." />
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
      </Head>

      {/* Seções obrigatórias na ordem */}
      <ProgramacaoNovaHeroSection />
      <ProgramacaoNovaMethodSection />
      <ProgramacaoNovaSuccessCases />
      <ProgramacaoNovaTransformationPromise />
      <ProgramacaoNovaCurriculum />
      <ProgramacaoNovaTestimonials />
      <ProgramacaoNovaLocationSection />

      {/* Empresas Parceiras */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <TrustedCompanies
          variant="course"
          courseSlug="programacao"
          title="Empresas que confiam na Escola Habilidade"
          subtitle="Profissionais de empresas regionais já se capacitaram conosco"
          theme="dark"
        />
      </section>

      <ProgramacaoNovaGuarantee />
      <ProgramacaoNovaInvestment />

      {/* Seção de Contato Progressivo */}
      <ProgramacaoNovaContactSection />

      <ProgramacaoNovaFAQ />
      <ProgramacaoNovaFloatingCTA />

      {/* CTA Final - Estrutura padronizada */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-br from-purple-500/20 via-zinc-950 to-blue-400/20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-blue-400 bg-clip-text text-transparent">PRONTO PARA</span>
              <br />
              <span className="text-white">DOMINAR A</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-blue-400 bg-clip-text text-transparent">PROGRAMAÇÃO?</span>
            </h2>

            <p className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto">
              Junte-se a mais de 150 alunos que já mudaram de vida
              com nosso método presencial comprovado.
            </p>

            <div className="space-y-6">
              <button
                onClick={() => handleCTAClick('final')}
                className="group relative overflow-hidden rounded-xl px-12 py-6 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-blue-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <Rocket className="w-6 h-6" />
                Garantir Minha Vaga
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

export default ProgramacaoNova;

// Required for React Router v6 lazy loading
export const Component = ProgramacaoNova;