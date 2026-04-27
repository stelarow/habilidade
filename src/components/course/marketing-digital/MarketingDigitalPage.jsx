import React from 'react';
import { Rocket, CheckCircle } from '@phosphor-icons/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { MarketingDigitalHeroSection } from './MarketingDigitalHeroSection';
import { MarketingDigitalCurriculum } from './MarketingDigitalCurriculum';
import { MarketingDigitalTestimonials } from './MarketingDigitalTestimonials';
import { MarketingDigitalInvestment } from './MarketingDigitalInvestment';
import { MarketingDigitalGuarantee } from './MarketingDigitalGuarantee';
import { MarketingDigitalFAQ } from './MarketingDigitalFAQ';
import MarketingDigitalContactSection from './MarketingDigitalContactSection';
import { handleCTAClick } from '../../../utils/ctaUtils';
import TrustedCompanies from '../../../components/TrustedCompanies';

const MarketingDigital = () => {
  return (
    <>
      {/* SEO Head */}
      <Helmet prioritizeSeoTags>
        <title>Curso de Marketing Digital Completo | Escola Habilidade - São José SC</title>
        <meta name="description" content="Domine Marketing Digital: Canva, Facebook Business, Google Ads, Chat GPT, Mídias Sociais e Técnicas de Vendas. 82h com certificado. Turmas presenciais em São José." />
        <meta name="keywords" content="curso marketing digital, facebook business, google ads, canva, mídias sociais, marketing pessoal, técnicas de vendas, curso são josé, escolahabilidade" />
        <link rel="canonical" href="https://www.escolahabilidade.com/cursos/marketing-digital" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Curso de Marketing Digital Completo | Escola Habilidade" />
        <meta property="og:description" content="Domine Marketing Digital: Canva, Facebook Business, Google Ads, Chat GPT e mais. Turmas presenciais em São José, Florianópolis e região." />
        <meta property="og:url" content="https://www.escolahabilidade.com/cursos/marketing-digital" />
        <meta property="og:site_name" content="Escola Habilidade" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Curso de Marketing Digital Completo | Escola Habilidade" />
        <meta name="twitter:description" content="Domine Marketing Digital: Canva, Facebook Business, Google Ads, Chat GPT e mais. Turmas presenciais." />
      </Helmet>

      <main className="min-h-screen bg-[#000000] text-white">
        {/* Hero Section */}
        <MarketingDigitalHeroSection />

      {/* Curriculum Section */}
      <MarketingDigitalCurriculum />

      {/* Testimonials Section */}
      <MarketingDigitalTestimonials />

      {/* Investment Section */}
      <MarketingDigitalInvestment />

      {/* Guarantee Section */}
      <MarketingDigitalGuarantee />

      {/* Contact Section */}
      <MarketingDigitalContactSection />

      {/* FAQ Section */}
      <MarketingDigitalFAQ />

      {/* Trusted Companies */}
      <section id="empresas-parceiras" className="px-6 py-16 bg-[#000000]">
        <TrustedCompanies
          variant="course"
          courseSlug="marketing-digital"
          title="Empresas que confiam na Escola Habilidade"
          subtitle="Profissionais de empresas regionais já se capacitaram conosco"
          theme="dark"
        />
      </section>

      {/* Final CTA - Bugatti style */}
      <section id="cta-final" className="px-6 py-20 lg:py-24 bg-[#0d0d0d] relative overflow-hidden">
        {/* Background - subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#141414]/20 to-transparent" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[3px] text-white mb-6 uppercase">
              Pronto para{' '}
              <span className="text-white">aprender</span>
              <br />
              <span className="text-[#c3d9f3]">marketing digital?</span>
            </h2>

            <p className="text-lg text-[#cccccc] mb-12 max-w-2xl mx-auto font-serif leading-relaxed">
              Junte-se a mais de 500 alunos que já mudaram de vida
              com nossa forma de ensinar presencial comprovada.
            </p>

            <div className="space-y-6">
              <button
                onClick={() => handleCTAClick('final')}
                className="inline-flex items-center px-12 py-5 border border-white text-white font-mono text-base tracking-[2.5px] uppercase rounded-full hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <Rocket className="w-5 h-5 mr-3" />
                Garantir Minha Vaga
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-[#999999] font-mono tracking-wider">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Garantia de 7 dias</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Material Incluído</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Suporte Vitalício</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
};

export default MarketingDigital;
export const Component = MarketingDigital;
