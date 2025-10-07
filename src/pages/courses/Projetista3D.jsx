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
import { ProjetistaCurriculum } from '../../components/course/projetista/ProjetistaCurriculum';
import TrustedCompanies from '../../components/TrustedCompanies';
import { Helmet } from '@dr.pogodin/react-helmet';
import { 
  CheckCircle, 
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
        <meta name="robots" content="index, follow" />

        {/* Open Graph tags gerenciadas por transform-html-meta.js durante build */}

        {/* Course Schema */}
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
              "url": "https://www.escolahabilidade.com"
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

        {/* VideoObject Schema - Casos de Sucesso */}
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "Apresentação Externa - Projeto SketchUp e Enscape por Carol Orofino",
              "description": "Render profissional de apresentação externa criado no curso Projetista 3D. Exemplo de trabalho de aluna freelancer em Design de Interiores usando SketchUp e Enscape.",
              "thumbnailUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/carol-orofino/video externo-poster.jpg",
              "uploadDate": "2024-08-27",
              "contentUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/carol-orofino/video externo.mp4",
              "embedUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/carol-orofino/video externo.mp4",
              "duration": "PT8S"
            },
            {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "Animação Sala de Estar - Projeto Móveis Planejados por Debora Chiquetti",
              "description": "Animação profissional de sala de estar com móveis planejados. Projeto desenvolvido no curso de Projetista 3D usando SketchUp e Enscape pela empresa Legnomobilli Móveis.",
              "thumbnailUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/debora-chiquetti/animacao-sala-poster.jpg",
              "uploadDate": "2024-08-27",
              "contentUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/debora-chiquetti/animacao-sala.mp4",
              "embedUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/debora-chiquetti/animacao-sala.mp4",
              "duration": "PT10S"
            },
            {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "Apresentação Profissional Casa Madeira - Santa Madeira Casas",
              "description": "Apresentação profissional de projeto residencial em casa de madeira. Trabalho desenvolvido para empresa Santa Madeira Casas usando SketchUp e Enscape no curso Projetista 3D.",
              "thumbnailUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/elton-santa-madeira/The_camera_stand_202508271725-poster.jpg",
              "uploadDate": "2024-08-27",
              "contentUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/elton-santa-madeira/The_camera_stand_202508271725.mp4",
              "embedUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/elton-santa-madeira/The_camera_stand_202508271725.mp4",
              "duration": "PT12S"
            },
            {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "Tour Virtual Salão de Beleza - Ricardo Móveis",
              "description": "Tour virtual de projeto comercial para salão de beleza com móveis planejados. Render profissional desenvolvido no curso Projetista 3D para a marcenaria Ricardo Móveis.",
              "thumbnailUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/patricia-ricardo-moveis/video-salao-beleza-poster.jpg",
              "uploadDate": "2024-09-05",
              "contentUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/patricia-ricardo-moveis/video-salao-beleza.mp4",
              "embedUrl": "https://www.escolahabilidade.com/assets/projetista-3d/cases/patricia-ricardo-moveis/video-salao-beleza.mp4",
              "duration": "PT8S"
            }
          ])}
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

      {/* Grade Curricular */}
      <ProjetistaCurriculum />

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

    </main>
  );
};

export default Projetista3DNew;

// Required for React Router v6 lazy loading
export const Component = Projetista3DNew;