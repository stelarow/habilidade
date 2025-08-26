import { ProjetistaHeroSection } from '../../components/course/projetista/ProjetistaHeroSection';
import { ProjetistaPortfolioSection } from '../../components/course/projetista/ProjetistaPortfolioSection';
import { ProjetistaSuccessCases } from '../../components/course/projetista/ProjetistaSuccessCases';
import { ProjetistaTransformationPromise } from '../../components/course/projetista/ProjetistaTransformationPromise';
import { ProjetistaPainSolution } from '../../components/course/projetista/ProjetistaPainSolution';
import { ProjetistaTestimonials } from '../../components/course/projetista/ProjetistaTestimonials';
import { ProjetistaGuarantee } from '../../components/course/projetista/ProjetistaGuarantee';
import { ProjetistaInvestment } from '../../components/course/projetista/ProjetistaInvestment';
import { ProjetistaFAQ } from '../../components/course/projetista/ProjetistaFAQ';
import { ProjetistaFloatingCTA } from '../../components/course/projetista/ProjetistaFloatingCTA';
import TrustedCompanies from '../../components/TrustedCompanies';
import { Helmet } from '@dr.pogodin/react-helmet';
import { 
  CheckCircle, 
  MapPin, 
  DeviceMobile, 
  Envelope, 
  Palette, 
  Buildings, 
  Desktop, 
  Trophy, 
  Star, 
  Certificate,
  Heart,
  Rocket
} from '@phosphor-icons/react';

const Projetista3DNew = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* SEO and Meta Tags */}
      <Helmet>
        <title>Curso Projetista 3D - SketchUp e Enscape | São José SC | Escola Habilidade</title>
        <meta name="description" content="Curso presencial completo de SketchUp e Enscape em São José SC. 56 horas práticas, turmas pequenas de até 4 alunos, certificado nacional. Transforme sua carreira como Projetista 3D." />
        <meta name="keywords" content="curso sketchup, curso enscape, projetista 3d, são josé sc, florianópolis, curso presencial, certificado, arquitetura, design" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Curso Projetista 3D - SketchUp e Enscape | São José SC" />
        <meta property="og:description" content="Único curso presencial completo em SC. 56 horas práticas, certificado nacional, turmas de até 4 alunos." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Curso Projetista 3D - SketchUp e Enscape",
            "description": "Curso presencial completo de SketchUp e Enscape em São José SC. 56 horas práticas, turmas pequenas, certificado nacional.",
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
            "courseMode": "onsite",
            "educationalCredentialAwarded": "Certificado Nacional de 56h",
            "timeRequired": "PT56H",
            "offers": {
              "@type": "Offer",
              "price": "2793.00",
              "priceCurrency": "BRL",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "200"
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
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <ProjetistaHeroSection />

      {/* Portfolio Before/After */}
      <ProjetistaPortfolioSection />

      {/* Success Cases */}
      <ProjetistaSuccessCases />

      {/* Transformation Promise */}
      <ProjetistaTransformationPromise />

      {/* Pain & Solution */}
      <ProjetistaPainSolution />

      {/* Testimonials */}
      <ProjetistaTestimonials />

      {/* Trusted Companies */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <TrustedCompanies 
          variant="course"
          courseSlug="projetista-3d"
          title="Empresas que confiam na Escola Habilidade"
          subtitle="Profissionais de empresas regionais já se capacitaram conosco"
          theme="dark"
        />
      </section>

      {/* Guarantee */}
      <ProjetistaGuarantee />

      {/* Investment */}
      <ProjetistaInvestment />

      {/* FAQ */}
      <ProjetistaFAQ />

      {/* Floating CTAs */}
      <ProjetistaFloatingCTA />

      {/* Final CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-br from-purple-500/20 via-zinc-950 to-cyan-400/20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">PRONTO PARA</span>
              <br />
              <span className="text-white">TRANSFORMAR SUA</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">CARREIRA?</span>
            </h2>
            
            <p className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto">
              Junte-se a mais de 200 profissionais que já mudaram de vida
              com nosso método presencial comprovado.
            </p>

            <div className="space-y-6">
              <button className="group relative overflow-hidden rounded-xl px-12 py-6 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 animate-pulse flex items-center justify-center gap-3 mx-auto">
                <Rocket className="w-6 h-6" />
                QUERO ME TORNAR PROJETISTA 3D - ÚLTIMAS VAGAS
              </button>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Garantia de 7 dias</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Certificado Nacional</span>
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

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Escola Habilidade
              </h3>
              <p className="text-zinc-400">
                Transformando vidas através da educação profissionalizante
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-white mb-3">Contato</h4>
                <div className="space-y-2 text-sm text-zinc-400">
                  <p className="flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    São José, Santa Catarina
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <DeviceMobile className="w-3 h-3" />
                    WhatsApp: (48) 9999-9999
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Envelope className="w-3 h-3" />
                    contato@escolahabilidade.com.br
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Cursos</h4>
                <div className="space-y-2 text-sm text-zinc-400">
                  <p className="flex items-center justify-center gap-1">
                    <Palette className="w-3 h-3" />
                    Projetista 3D - SketchUp + Enscape
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Buildings className="w-3 h-3" />
                    AutoCAD Profissional
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Desktop className="w-3 h-3" />
                    Revit Architecture
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Certificações</h4>
                <div className="space-y-2 text-sm text-zinc-400">
                  <p className="flex items-center justify-center gap-1">
                    <Trophy className="w-3 h-3" />
                    SketchUp Pro Trimble Certified
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" />
                    Enscape Certified Professional
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Certificate className="w-3 h-3" />
                    Certificados Nacionais
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-800 text-center">
              <p className="text-sm text-zinc-500">
                © 2024 Escola Habilidade. Todos os direitos reservados. | 
                 <span className="text-purple-400 inline-flex items-center gap-1 ml-1">
                   Desenvolvido com
                   <Heart className="w-3 h-3" />
                   para transformar carreiras
                 </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Projetista3DNew;