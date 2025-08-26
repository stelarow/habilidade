import React, { useEffect, useState } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { getCourseBySlug, validateAndSanitizeCourse, generateCourseMetadata } from '../../utils/courseHelpers';
import COURSES_DATA from '../../data/coursesData';
import Loading from '../../components/Loading';
import ErrorBoundary from '../../components/ErrorBoundary';

// Import custom components
import ProjetistaHeroSection from '../../components/course/ProjetistaHeroSection';
import TransformationSection from '../../components/course/projetista/TransformationSection';
import SuccessCasesSection from '../../components/course/projetista/SuccessCasesSection';
import PainSolutionSection from '../../components/course/projetista/PainSolutionSection';
import TeacherStorySection from '../../components/course/projetista/TeacherStorySection';
import BonusSection from '../../components/course/projetista/BonusSection';
import GuaranteeSection from '../../components/course/projetista/GuaranteeSection';
import InvestmentSection from '../../components/course/projetista/InvestmentSection';
import ComparisonSection from '../../components/course/projetista/ComparisonSection';

// Import existing components to reuse
import CourseTestimonials from '../../components/course/CourseTestimonials';
import TrustedCompanies from '../../components/TrustedCompanies';
import CourseCurriculum from '../../components/course/CourseCurriculum';

function Projetista3DCustom({ slug }) {
  const { courseSlug } = useParams();
  const loaderData = useLoaderData();
  const finalSlug = slug || courseSlug;
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(loaderData?.course || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      // If course is already loaded from SSG loader, skip loading
      if (loaderData?.course) {
        const validatedCourse = validateAndSanitizeCourse(loaderData.course);
        setCourse(validatedCourse);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Simula carregamento
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Busca curso pelos dados
        const foundCourse = getCourseBySlug(finalSlug, COURSES_DATA);
        
        if (!foundCourse) {
          setError('Curso não encontrado');
          setLoading(false);
          return;
        }

        const validatedCourse = validateAndSanitizeCourse(foundCourse);
        setCourse(validatedCourse);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar curso:', error);
        setError('Erro ao carregar informações do curso');
        setLoading(false);
      }
    };

    loadCourse();
  }, [finalSlug, loaderData]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Erro</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
          <p className="text-gray-400">O curso solicitado não foi encontrado.</p>
        </div>
      </div>
    );
  }

  const metadata = generateCourseMetadata(course);

  return (
    <ErrorBoundary>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.escolahabilidade.com/cursos/${course.slug}`} />
        <meta property="og:image" content="/assets/projetista-3d/hero/generation-ff879e0f-a55b-45d3-8dcd-8afb1c23630a.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="/assets/projetista-3d/hero/generation-ff879e0f-a55b-45d3-8dcd-8afb1c23630a.png" />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.basicInfo.title,
            "description": course.basicInfo.description,
            "provider": {
              "@type": "Organization",
              "name": "Escola Habilidade",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rua das Flores, 123",
                "addressLocality": "São José",
                "addressRegion": "SC",
                "postalCode": "88000-000",
                "addressCountry": "BR"
              }
            },
            "offers": {
              "@type": "Offer",
              "price": "2793",
              "priceCurrency": "BRL",
              "availability": "https://schema.org/InStock"
            },
            "courseMode": "In-person",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "In-person",
              "location": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress", 
                  "addressLocality": "São José",
                  "addressRegion": "SC"
                }
              }
            }
          })}
        </script>
      </Head>

      <div className="bg-zinc-950 text-white">
        {/* 1. Hero Section Impactante */}
        <ProjetistaHeroSection />

        {/* 2. Transformação Real - Antes/Depois */}
        <TransformationSection />

        {/* 3. Casos de Sucesso - 4 Perfis */}
        <SuccessCasesSection />

        {/* 4. Para Quem É Este Curso - Dor e Solução */}
        <PainSolutionSection />

        {/* 5. Depoimentos dos Alunos */}
        <CourseTestimonials 
          course={course}
        />

        {/* 6. Empresas Parceiras */}
        <TrustedCompanies 
          variant="course"
          courseSlug="projetista-3d"
          title="Empresas que confiam na Escola Habilidade"
          subtitle="Profissionais de empresas regionais já se capacitaram conosco"
          theme="dark"
        />

        {/* 7. Quem Irá Te Ensinar - Professor */}
        <TeacherStorySection />

        {/* 8. Conteúdo do Curso */}
        <div className="py-20 bg-gradient-to-br from-zinc-950 via-purple-950/10 to-zinc-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  CONTEÚDO COMPLETO
                </span>
              </h2>
              <p className="text-xl text-gray-300">
                56 horas de conteúdo prático e intensivo
              </p>
            </div>
            <CourseCurriculum 
              curriculum={course.curriculum}
              tools={course.tools}
            />
          </div>
        </div>

        {/* 9. Bônus Exclusivos */}
        <BonusSection />

        {/* 10. Garantia de 7 Dias */}
        <GuaranteeSection />

        {/* 11. Investimento com Urgência */}
        <InvestmentSection />

        {/* 12. Comparação - 3 Caminhos */}
        <ComparisonSection />

        {/* CTA Flutuante - WhatsApp */}
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="https://wa.me/5548999999999?text=Olá! Quero saber mais sobre o curso Projetista 3D"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2"
            aria-label="Falar via WhatsApp"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            <span className="hidden md:block text-sm font-bold">Dúvidas?</span>
          </a>
        </div>

        {/* CTA Fixo no Scroll */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-md border-t border-purple-500/20 p-4 z-40 transform translate-y-full opacity-0 transition-all duration-300" id="sticky-cta">
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-white">
              <p className="font-bold">🎯 Projetista 3D - Últimas Vagas</p>
              <p className="text-sm text-gray-300">⚡ 43% OFF - 7x R$ 399</p>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
              GARANTIR VAGA
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Animation Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('scroll', function() {
            const stickyCTA = document.getElementById('sticky-cta');
            const heroSection = document.querySelector('section');
            
            if (window.scrollY > heroSection.offsetHeight) {
              stickyCTA.style.transform = 'translateY(0)';
              stickyCTA.style.opacity = '1';
            } else {
              stickyCTA.style.transform = 'translateY(100%)';
              stickyCTA.style.opacity = '0';
            }
          });
        `
      }} />
    </ErrorBoundary>
  );
}

// SSG Loader for this specific course
export async function loader() {
  try {
    const foundCourse = getCourseBySlug('projetista-3d', COURSES_DATA);
    if (!foundCourse) {
      throw new Error('Course projetista-3d not found');
    }
    return { course: foundCourse };
  } catch (error) {
    console.error('SSG Loader error for Projetista3DCustom:', error);
    return { course: null };
  }
}

export const Component = Projetista3DCustom;
export default Projetista3DCustom;