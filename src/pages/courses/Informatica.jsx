import { InformaticaHeroSection } from '../../components/course/informatica/InformaticaHeroSection';
import InformaticaWhyLearn2025 from '../../components/course/informatica/InformaticaWhyLearn2025';
import InformaticaMethodSection from '../../components/course/informatica/InformaticaMethodSection';
import { InformaticaSuccessCases } from '../../components/course/informatica/InformaticaSuccessCases';
import { InformaticaTransformationPromise } from '../../components/course/informatica/InformaticaTransformationPromise';
import { InformaticaTestimonials } from '../../components/course/informatica/InformaticaTestimonials';
import { InformaticaGuarantee } from '../../components/course/informatica/InformaticaGuarantee';
import { InformaticaInvestment } from '../../components/course/informatica/InformaticaInvestment';
import { InformaticaFAQ } from '../../components/course/informatica/InformaticaFAQ';
import InformaticaContactSection from '../../components/course/informatica/InformaticaContactSection';
import { InformaticaFloatingCTA } from '../../components/course/informatica/InformaticaFloatingCTA';
import { InformaticaCurriculum } from '../../components/course/informatica/InformaticaCurriculum';
import { InformaticaLocationSection } from '../../components/course/informatica/InformaticaLocationSection';
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
  "description": "Curso presencial de informática em São José SC. Excel avançado, Word, PowerPoint, Canva e Inteligência Artificial. Atendemos toda Grande Florianópolis - Florianópolis, Palhoça, Biguaçu. 170 horas com certificado nacional.",
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
  "educationalCredentialAwarded": "Certificado Nacional de 170h",
  "timeRequired": "PT170H",
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
        "name": "Letícia Mendes"
      },
      "reviewBody": "Estou adorando fazer o curso de Informática Fundamental na Escola Habilidade. As aulas são muito práticas e dinâmicas, e aprendi rapidamente ferramentas como Excel, Canva e até Inteligência Artificial. O professor é atencioso e esclarece todas as dúvidas!",
      "datePublished": "2024-12-15"
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
        "name": "Mateus Oliveira"
      },
      "reviewBody": "O curso presencial é excelente, o ambiente é muito acolhedor, e as aulas são bastante claras e práticas. Aprendi muito sobre Word, PowerPoint e Windows 11. O professor é dedicado e sempre traz exemplos do dia a dia.",
      "datePublished": "2024-12-20"
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
        "name": "Gabriela Costa Silva"
      },
      "reviewBody": "A Escola Habilidade é incrível! As turmas pequenas ajudam demais na hora de aprender, especialmente ferramentas digitais como Canva e Inteligência Artificial. Estou gostando muito das aulas presenciais e da didática do professor.",
      "datePublished": "2025-01-10"
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
        "name": "Lucas Felipe Ribeiro"
      },
      "reviewBody": "Estou impressionado com a qualidade das aulas presenciais do curso. O professor explica tudo muito bem e o conteúdo é super atualizado. Já estou aplicando o que aprendi no meu dia a dia.",
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
        "name": "Carolina Almeida"
      },
      "reviewBody": "As aulas são muito práticas e interessantes! Aprendi sobre ferramentas que nem sabia que existiam, e o professor sempre traz uma abordagem descontraída que facilita muito o aprendizado.",
      "datePublished": "2024-11-25"
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
        "name": "Pedro Henrique Soares"
      },
      "reviewBody": "Curso excelente, ambiente confortável e turmas pequenas. Já aprendi muito sobre ferramentas digitais, e o professor é sempre atento e dedicado.",
      "datePublished": "2024-12-22"
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
  "name": "Escola Habilidade - Curso de Informática",
  "image": "https://www.escolahabilidade.com.br/assets/informatica-nova/hero/1318912.png",
  "description": "Escola de informática em São José SC. Cursos presenciais de Excel, Word, PowerPoint, Canva e Inteligência Artificial. Atendemos Florianópolis, Palhoça e Biguaçu.",
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
  "url": "https://www.escolahabilidade.com.br/cursos/informatica",
  "priceRange": "R$ 299,90 - R$ 3.598,80",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "150"
  }
};

// Schema FAQPage - 16 perguntas frequentes
const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "name": "Perguntas Frequentes - Curso de Informática",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Por que turmas pequenas fazem diferença no aprendizado?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Turmas de máximo 5 alunos garantem atenção individual para cada pessoa. O professor consegue acompanhar seu ritmo, tirar dúvidas na hora e adaptar explicações ao seu perfil. Isso acelera o aprendizado e garante que ninguém fica para trás - diferente de turmas tradicionais com 20-30 alunos onde você precisa competir pela atenção."
      }
    },
    {
      "@type": "Question",
      "name": "É adequado para pessoas sem conhecimento em informática?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Começamos do absoluto zero com Windows 11 e evoluímos gradualmente até tecnologias avançadas como IA aplicada. Nossa metodologia foi desenvolvida especialmente para iniciantes, com acompanhamento individual em turmas de no máximo 5 alunos."
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
        "text": "Sim! Material didático impresso completo dos 8 módulos incluso sem custo adicional. Você recebe apostilas detalhadas de cada módulo para consulta permanente, além de exercícios práticos para fixar o aprendizado."
      }
    },
    {
      "@type": "Question",
      "name": "Como a IA está integrada no curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ensinamos IA de forma prática: ChatGPT para produtividade, geração de imagens e vídeos, automações no trabalho, HARPA AI, D-ID e muito mais. Você aprenderá a usar IA como ferramenta de trabalho real, não apenas teoria."
      }
    },
    {
      "@type": "Question",
      "name": "Quanto tempo demora para concluir o curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O curso tem 184,5 horas de conteúdo distribuídas em 8 módulos. O ritmo é flexível e depende da sua dedicação. Com estudo regular de 10-15 horas semanais, você pode concluir em aproximadamente 3-4 meses."
      }
    },
    {
      "@type": "Question",
      "name": "Que tipo de certificado eu recebo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Você recebe um Certificado Nacional de 184,5 horas reconhecido em todo território brasileiro. O certificado comprova suas competências em informática moderna e pode ser usado para comprovação profissional."
      }
    },
    {
      "@type": "Question",
      "name": "Preciso ter computador próprio?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Para a modalidade presencial, disponibilizamos computadores na escola. Para online, você precisa ter um computador com Windows 10/11, 8GB de RAM (recomendado 16GB) e conexão estável com internet."
      }
    },
    {
      "@type": "Question",
      "name": "Como funciona o suporte durante o curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oferecemos suporte vitalício! Durante o curso, você tem acompanhamento direto dos professores, tira-dúvidas e feedback em projetos. Após a conclusão, mantemos canal de suporte para consultas pontuais."
      }
    },
    {
      "@type": "Question",
      "name": "Posso parcelar o pagamento?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Oferecemos 3 opções: Boleto bancário: 12x de R$ 299,90; Cartão de crédito: 10x de R$ 359,88 sem juros; À vista: R$ 3.382,87 (6% de desconto). Todas as formas de pagamento são 100% seguras e processadas por plataformas confiáveis."
      }
    },
    {
      "@type": "Question",
      "name": "A garantia de 7 dias é real?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutamente! Se em até 7 dias você não estiver satisfeito com o curso, devolvemos 100% do valor pago sem perguntas. É nossa forma de demonstrar total confiança na qualidade do conteúdo e metodologia."
      }
    },
    {
      "@type": "Question",
      "name": "Onde fica a escola de informática?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nossa escola está localizada na R. Caetano José Ferreira, 426 - Sala 5, Kobrasol, São José - SC, CEP 88102-280. Próximo ao Cantinho da Fama e Colégio Municipal Maria Luiza de Melo. Fácil acesso para alunos de Florianópolis, Palhoça e Biguaçu, com ampla disponibilidade de estacionamento público nas ruas próximas."
      }
    },
    {
      "@type": "Question",
      "name": "Vocês atendem alunos de outras cidades além de São José?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Atendemos alunos de toda a Grande Florianópolis. Muitos de nossos alunos vêm de Florianópolis (15 min), Palhoça (10 min) e Biguaçu (12 min). Nossa localização no Kobrasol é estratégica e há amplo estacionamento público disponível nas ruas próximas para facilitar o acesso."
      }
    },
    {
      "@type": "Question",
      "name": "Como chegar na escola de informática presencial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Estamos na R. Caetano José Ferreira, 426, Kobrasol - região central de São José com fácil acesso pela BR-101. Próximo ao Cantinho da Fama e Colégio Municipal Maria Luiza de Melo. Diversas linhas de ônibus passam pelo Kobrasol, conectando toda a Grande Florianópolis. Há estacionamento público disponível nas ruas próximas."
      }
    },
    {
      "@type": "Question",
      "name": "Tem estacionamento para quem vem de outras cidades?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Há ampla disponibilidade de estacionamento público nas proximidades da escola, na R. Caetano José Ferreira e ruas adjacentes no Kobrasol. É uma das facilidades da localização para quem vem de Florianópolis, Palhoça, Biguaçu e outras cidades da região."
      }
    },
    {
      "@type": "Question",
      "name": "Qual o horário de funcionamento da escola?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Funcionamos de segunda a sexta das 8h às 20h (sexta até 17h30) e sábados das 8h às 12h. Oferecemos horários flexíveis para atender profissionais que trabalham durante o dia, incluindo turmas vespertinas e noturnas."
      }
    }
  ]
};

const Informatica = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* SEO e Meta Tags */}
      <Helmet>
        <title>Curso de Informática Presencial São José SC | Excel Básico ao Avançado, Word, Canva e IA</title>
        <meta name="description" content="Curso de informática presencial em São José SC. Excel, Word, PowerPoint, Canva e IA. Atendemos Florianópolis, Palhoça e Biguaçu. Certificado 170h." />
        <meta name="keywords" content="curso informática presencial, curso informática são josé, curso informática florianópolis, curso informática palhoça, curso informática biguaçu, excel avançado, word, powerpoint, inteligência artificial, canva" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Escola Habilidade" />
        <meta name="theme-color" content="#3b82f6" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.escolahabilidade.com/cursos/informatica" />

        {/* Open Graph tags gerenciadas por transform-html-meta.js durante build */}
      </Helmet>

      {/* Schema.org JSON-LD - Renderizado fora do Helmet para compatibilidade com SSG */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(courseSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqPageSchema)}} />

      {/* Seções organizadas para conversão otimizada */}
      <InformaticaHeroSection />
      <InformaticaCurriculum />
      <InformaticaTestimonials />

      {/* Investment + Guarantee - juntos para eliminar objeções */}
      <InformaticaInvestment />
      <InformaticaGuarantee />

      <InformaticaTransformationPromise />
      <InformaticaSuccessCases />
      <InformaticaMethodSection />
      <InformaticaLocationSection />

      {/* Empresas Parceiras */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <TrustedCompanies
          variant="course"
          courseSlug="informatica"
          title="Empresas que confiam na Escola Habilidade"
          subtitle="Profissionais de empresas regionais já se capacitaram conosco"
          theme="dark"
        />
      </section>

      {/* Seção de Contato Progressivo */}
      <InformaticaContactSection />

      <InformaticaFAQ />

      {/* WhyLearn2025 - movido para o final para SEO */}
      <InformaticaWhyLearn2025 />
      <InformaticaFloatingCTA />
      
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
                onClick={() => handleCTAClick('final')}
                className="group relative overflow-hidden rounded-xl px-12 py-6 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
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

export default Informatica;

// Required for React Router v6 lazy loading
export const Component = Informatica;