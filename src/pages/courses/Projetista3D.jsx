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
              "@type": "EducationalOrganization",
              "name": "Escola Habilidade",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "R. Caetano José Ferreira, 426 - Sala 5 - Kobrasol",
                "addressLocality": "São José",
                "addressRegion": "SC",
                "postalCode": "88102-280",
                "addressCountry": "BR"
              },
              "url": "https://www.escolahabilidade.com",
              "areaServed": [
                "São José, SC",
                "Florianópolis, SC",
                "Palhoça, SC",
                "Biguaçu, SC",
                "Santo Amaro da Imperatriz, SC"
              ]
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "https://schema.org/OnSiteEventAttendanceMode",
              "courseWorkload": "PT56H"
            },
            "educationalCredentialAwarded": {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "Certificado Profissionalizante",
              "name": "Certificado Nacional de 56h"
            },
            "offers": {
              "@type": "Offer",
              "price": "3493.00",
              "priceCurrency": "BRL",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "bestRating": "5",
              "worstRating": "1",
              "ratingCount": "200",
              "reviewCount": "200"
            },
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Karolain Roberta Régis"
                },
                "datePublished": "2024-11-20",
                "reviewBody": "Estou fazendo o curso e estou adorando, professor atencioso, com atividades super dinâmicas, aprendi já bastante coisas que ainda não sabia, estão super atualizados no mercado, eles têm deles mesmo até IA ajudando o pessoal nas medições e até em render rápidos, fora a apostila bem completa.",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Jonatas Torres"
                },
                "datePublished": "2024-11-20",
                "reviewBody": "Estou tendo uma excelente experiência com a Escola Habilidade no curso de SketchUp. O conteúdo é muito bem estruturado, o professor domina o assunto e sabe explicar de forma clara, mesmo para quem está começando.",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Ana Caroline Orofino"
                },
                "datePublished": "2024-10-15",
                "reviewBody": "Estou adorando as aulas, professor muito atencioso, sempre traz questões do cotidiano para resolução das atividades!",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Camila Pereira"
                },
                "datePublished": "2024-10-20",
                "reviewBody": "Muito legal aprender a fazer projetos 3D! O SketchUp é bem intuitivo e o Enscape faz render rápido. Recomendo!",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Gabriela Freitas"
                },
                "datePublished": "2024-09-20",
                "reviewBody": "Curso incrível! Aprendi SketchUp do zero. O Enscape é mágico, transforma os projetos. Professor muito atencioso!",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Marcelo Souza"
                },
                "datePublished": "2024-08-22",
                "reviewBody": "Curso completo! SketchUp, Enscape, e ainda aprendi um pouco de AutoCAD. Material de primeira qualidade.",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Roberto Silva"
                },
                "datePublished": "2024-07-28",
                "reviewBody": "Curso excelente! Aprendi muito sobre modelagem 3D. Professor muito atencioso, explica com calma e paciência.",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Wagner Dias"
                },
                "datePublished": "2024-07-02",
                "reviewBody": "Curso completo! SketchUp é muito bom de usar. Professor dá muita atenção, explica quantas vezes precisar.",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Cleber Barbosa"
                },
                "datePublished": "2024-06-08",
                "reviewBody": "Muito legal! Já modelei várias casas. Enscape deixa tudo fotorealista. Professor muito atencioso!",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Solange Gomes"
                },
                "datePublished": "2024-05-15",
                "reviewBody": "Curso maravilhoso! SketchUp é fácil de aprender. Já modelei uma casa completa. Material muito bom!",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              }
            ],
            "teaches": "Modelagem 3D com SketchUp, Renderização com Enscape, Projeto de Interiores e Arquitetura"
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

        {/* FAQPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Qual o valor de um curso de SketchUp?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O curso de SketchUp na Escola Habilidade custa R$ 3.493,00 e pode ser parcelado em 7x de R$ 499 no boleto (tipo mensalidade). Se pagar à vista, fica R$ 3.143,70 (10% de desconto). O curso tem 56 horas de aula e inclui tudo: apostila de 360 páginas, certificado nacional, acesso aos programas e material completo."
                }
              },
              {
                "@type": "Question",
                "name": "Quanto tempo dura um curso de SketchUp?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O curso tem 56 horas de aula presencial divididas em 28 encontros de 2 horas cada. Dá pra fazer em 2 a 3 meses dependendo da turma que você escolher. É presencial aqui em São José SC, no bairro Kobrasol."
                }
              },
              {
                "@type": "Question",
                "name": "É difícil aprender SketchUp?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Não! O SketchUp é considerado o programa 3D mais fácil de aprender. Em poucas aulas você já consegue fazer projetos simples. Nosso curso começa do zero, não precisa saber nada antes. Com turmas de 4 alunos, o professor te ajuda sempre que precisar."
                }
              },
              {
                "@type": "Question",
                "name": "Qual PC roda SketchUp?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Precisa de um computador com 8GB de RAM no mínimo (16GB é melhor), processador Intel i5 ou AMD Ryzen 5 (ou superior) e placa de vídeo dedicada de 2GB. Funciona no Windows ou Mac. Notebook também serve se tiver essas configurações."
                }
              },
              {
                "@type": "Question",
                "name": "Quanto ganha quem trabalha com SketchUp?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Quem tá começando como projetista 3D ganha entre R$ 2.500 e R$ 4.000 por mês. Com experiência, pode ganhar de R$ 6.000 a R$ 10.000. Trabalhando como freelancer dá pra faturar R$ 8.000 a R$ 15.000 por mês."
                }
              },
              {
                "@type": "Question",
                "name": "Existe um curso de SketchUp certificado em Florianópolis?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim! A Escola Habilidade fica em São José (do lado de Florianópolis) e dá certificado nacional de 56 horas. O certificado é reconhecido em todo Brasil e aceito por empresas da região. Já formamos mais de 200 alunos."
                }
              },
              {
                "@type": "Question",
                "name": "Quais são as avaliações sobre a Escola Habilidade em São José?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Temos nota 5 estrelas com mais de 200 avaliações! Os alunos elogiam as turmas pequenas (só 4 alunos), professor certificado pela Trimble, projetos reais em sala de aula e discussões sobre casos do dia a dia. Você pode ver os depoimentos no Google e no nosso site."
                }
              },
              {
                "@type": "Question",
                "name": "Qual é o melhor SketchUp ou AutoCAD?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Depende do trabalho! AutoCAD é melhor pra desenho técnico 2D (plantas baixas). SketchUp é melhor pra modelagem 3D (visualizar o projeto em três dimensões). O ideal é saber os dois. No nosso curso você aprende SketchUp completo e também uma introdução ao AutoCAD."
                }
              }
            ]
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