import React from 'react';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import HowItWorksSimple from '../components/HowItWorksSimple';
import Reviews from '../components/Reviews';
import TrustedCompanies from '../components/TrustedCompanies';
import LatestBlogSection from '../components/LatestBlogSection';
import LocationSection from '../components/LocationSection';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';
import SEOHead from '../components/shared/SEOHead';
import StickyWhatsApp from '../components/StickyWhatsApp';

function Home() {
  // Schema 1: EducationalOrganization (Atualizado com logo, email, sameAs)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Escola Habilidade',
    alternateName: 'Habilidade Escola de Cursos Profissionalizantes',
    description: 'Escola de cursos profissionalizantes em São José SC, especializada em Informática, SketchUp, AutoCAD, Revit, Enscape, Marketing Digital, Programação, IA e Business Intelligence. Turmas pequenas, atendimento individualizado e certificação reconhecida.',
    url: 'https://www.escolahabilidade.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.escolahabilidade.com/logo-escola-habilidade.png',
      width: 600,
      height: 600
    },
    image: [
      'https://www.escolahabilidade.com/logo-escola-habilidade.png'
    ],
    email: 'alessandrobatisp@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol',
      addressLocality: 'São José',
      addressRegion: 'SC',
      addressCountry: 'BR',
      postalCode: '88102-280'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-27.5923906',
      longitude: '-48.6149943'
    },
    telephone: '+55 48 98855-9491',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday'],
        opens: '08:00',
        closes: '20:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Wednesday',
        opens: '08:00',
        closes: '22:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Thursday',
        opens: '08:00',
        closes: '20:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '08:00',
        closes: '17:30'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '12:00'
      }
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'São José',
        containedInPlace: {
          '@type': 'State',
          name: 'Santa Catarina'
        },
        '@id': 'https://www.wikidata.org/wiki/Q986378'
      },
      {
        '@type': 'City',
        name: 'Florianópolis',
        containedInPlace: {
          '@type': 'State',
          name: 'Santa Catarina'
        },
        '@id': 'https://www.wikidata.org/wiki/Q25444'
      },
      {
        '@type': 'City',
        name: 'Palhoça',
        containedInPlace: {
          '@type': 'State',
          name: 'Santa Catarina'
        },
        '@id': 'https://www.wikidata.org/wiki/Q986369'
      },
      {
        '@type': 'City',
        name: 'Biguaçu',
        containedInPlace: {
          '@type': 'State',
          name: 'Santa Catarina'
        }
      },
      {
        '@type': 'City',
        name: 'Santo Amaro da Imperatriz',
        containedInPlace: {
          '@type': 'State',
          name: 'Santa Catarina'
        }
      }
    ],
    sameAs: [
      'https://www.instagram.com/habilidade.escola/',
      'https://www.facebook.com/p/Habilidadeescola-61561880682538/'
    ],
    hasMap: {
      '@type': 'Map',
      url: 'https://www.google.com/maps/place/Escola+Habilidade/@-27.5923906,-48.6149943,17z/data=!3m1!4b1!4m6!3m5!1s0x9527492f4454ef8d:0xd345f5e77312fdec!8m2!3d-27.5923906!4d-48.6149943!16s%2Fg%2F11w49mrz34'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 127,
      bestRating: 5,
      worstRating: 1
    }
  };

  // Schema 2: ItemList - Lista de 9 Cursos
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cursos Profissionalizantes - Escola Habilidade',
    description: 'Lista completa de cursos oferecidos pela Escola Habilidade em São José SC',
    numberOfItems: 9,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Curso de Projetista 3D',
        url: 'https://www.escolahabilidade.com/cursos/projetista-3d',
        description: 'SketchUp, Enscape, Renderização com IA, AutoCAD 2D, Revit, Projetos 3D'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Curso de Edição de Vídeo',
        url: 'https://www.escolahabilidade.com/cursos/edicao-video',
        description: 'Premiere, After Effects, DaVinci Resolve, Motion Graphics'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Curso de Informática Completo',
        url: 'https://www.escolahabilidade.com/cursos/informatica',
        description: 'Windows, Word, Excel (fundamental ao avançado), PowerPoint'
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Curso de Design Gráfico',
        url: 'https://www.escolahabilidade.com/cursos/design-grafico',
        description: 'Photoshop, Illustrator, InDesign, Canva, Social Media'
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Curso de Programação',
        url: 'https://www.escolahabilidade.com/cursos/programacao',
        description: 'Lógica, Python, Java, PHP, Android Studio, Desenvolvimento de Jogos'
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Curso de Marketing Digital',
        url: 'https://www.escolahabilidade.com/cursos/marketing-digital',
        description: 'Social Ads, SEO, Copywriting, Canva, Branding, Analytics'
      },
      {
        '@type': 'ListItem',
        position: 7,
        name: 'Curso de Inteligência Artificial',
        url: 'https://www.escolahabilidade.com/cursos/inteligencia-artificial',
        description: 'Cursor, Prompt Engineering, ChatGPT, Claude, IA aplicada'
      },
      {
        '@type': 'ListItem',
        position: 8,
        name: 'Curso de Business Intelligence',
        url: 'https://www.escolahabilidade.com/cursos/business-intelligence',
        description: 'Master Excel, Power BI, Dashboards, Storytelling de Dados'
      },
      {
        '@type': 'ListItem',
        position: 9,
        name: 'Curso de Administração',
        url: 'https://www.escolahabilidade.com/cursos/administracao',
        description: 'Office, Excel Avançado, DP, Matemática Financeira, Liderança'
      }
    ]
  };

  // Schema 3: FAQPage - 14 Perguntas Frequentes
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'Perguntas Frequentes - Escola Habilidade',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'A Escola Habilidade fica bem localizada em São José?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! Estamos estrategicamente localizados no centro de São José, próximo ao Terminal Central, Shopping Pátio São José e fácil acesso pela BR-101. Nossa localização privilegiada permite chegada fácil por transporte público (várias linhas de ônibus) e oferece estacionamento gratuito para estudantes. Atendemos toda a Grande Florianópolis, especialmente São José, Palhoça e Biguaçu.'
        }
      },
      {
        '@type': 'Question',
        name: 'Vocês têm parcerias com empresas de São José e região?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! Temos parcerias ativas com mais de 50 empresas da Grande Florianópolis, incluindo escritórios de arquitetura, agências de marketing, desenvolvedoras e empresas de tecnologia. Nossos alunos desenvolvem projetos reais durante o curso e muitos são contratados diretamente por empresas parceiras. Mantemos um programa de indicação profissional exclusivo.'
        }
      },
      {
        '@type': 'Question',
        name: 'Qual a diferença entre curso técnico e curso profissionalizante na Escola Habilidade?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nossos cursos profissionalizantes são 100% focados na prática profissional. Diferente de cursos técnicos convencionais, investimos 80% do tempo em projetos reais e apenas 20% em teoria. Isso significa que você sai preparado para o mercado de trabalho desde o primeiro dia, com portfolio robusto e experiência prática que os empregadores valorizam.'
        }
      },
      {
        '@type': 'Question',
        name: 'Quais cursos a Escola Habilidade oferece?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oferecemos 6 cursos principais: Projetista (SketchUp/AutoCAD), Edição de Vídeo, Design Gráfico, Programação, Marketing Digital e BI/Inteligência Artificial. Todos são cursos práticos com projetos reais, certificação reconhecida pelo mercado e suporte para colocação profissional. Cada curso é personalizado conforme demanda do mercado regional.'
        }
      },
      {
        '@type': 'Question',
        name: 'Como é a metodologia de ensino da Escola Habilidade?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nossa metodologia única "Prática Primeiro" combina projetos reais com mentoria individualizada. Turmas pequenas (máximo 12 alunos), professores especialistas do mercado e 80% do tempo dedicado à prática. Você desenvolve portfolio profissional durante o curso e recebe orientação personalizada para sua área de interesse.'
        }
      },
      {
        '@type': 'Question',
        name: 'Por que a Escola Habilidade tem avaliação 5.0 estrelas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nossa nota máxima reflete o compromisso com resultados reais: metodologia prática, acompanhamento individualizado e foco na preparação para o mercado de trabalho. Diferente de instituições grandes, priorizamos qualidade sobre quantidade, com turmas reduzidas e atenção personalizada a cada aluno.'
        }
      },
      {
        '@type': 'Question',
        name: 'A Escola Habilidade ajuda na colocação profissional?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! Oferecemos apoio através de nossa rede de empresas parceiras que conhecem a qualidade dos nossos alunos, programa de preparação para freelancers com projetos reais e orientação para desenvolvimento de carreira. Nosso foco é preparar você com as habilidades e portfolio que o mercado busca.'
        }
      },
      {
        '@type': 'Question',
        name: 'Qual curso tem mais chance de conseguir emprego rápido em São José?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nossos cursos de Projetista (SketchUp + Enscape), Programação, Design Gráfico e Marketing Digital são os que mais colocam profissionais no mercado na Grande Florianópolis. Com metodologia 80% prática, você desenvolve portfolio real durante o curso. Estatisticamente, cursos técnicos como Desenvolvimento de Sistemas têm 76,7% de empregabilidade, mas nosso diferencial é a preparação específica para o mercado local.'
        }
      },
      {
        '@type': 'Question',
        name: 'A Escola Habilidade oferece cursos técnicos gratuitos como o SENAI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nossos cursos são investimento acessível com resultado superior ao ensino técnico tradicional. Diferente dos cursos gratuitos que priorizam teoria, oferecemos mentoria individualizada, turmas pequenas e projetos reais. O retorno do investimento acontece rapidamente através das oportunidades de trabalho e freelances que nossos alunos conseguem.'
        }
      },
      {
        '@type': 'Question',
        name: 'Qual a diferença da Escola Habilidade para o SENAI e IFSC de São José?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Enquanto instituições técnicas focam em certificação, priorizamos empregabilidade real. Turmas pequenas vs. turmas de 40+ alunos, professores do mercado vs. professores acadêmicos, projetos reais vs. exercícios teóricos. Nossos alunos começam a trabalhar antes mesmo de formar, diferente do modelo tradicional.'
        }
      },
      {
        '@type': 'Question',
        name: 'Por que escolher curso profissionalizante ao invés de curso técnico em São José?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cursos profissionalizantes são mais rápidos, práticos e alinhados com demandas reais das empresas. Não há burocracia de certificação técnica, permitindo atualização constante do conteúdo. Você aprende exatamente o que o mercado precisa, não grade curricular desatualizada de instituições técnicas.'
        }
      },
      {
        '@type': 'Question',
        name: 'Quais empresas de São José contratam alunos da Escola Habilidade?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Temos parcerias com escritórios de arquitetura do centro de São José, agências de marketing da região e empresas de tecnologia da Grande Florianópolis. Nossa localização estratégica próxima ao Terminal Central facilita o networking com empresas parceiras que conhecem a qualidade dos nossos alunos.'
        }
      },
      {
        '@type': 'Question',
        name: 'Como funciona o estacionamento para alunos no centro de Kobrasol?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Estamos localizados no centro de Kobrasol em uma rua estratégica paralela onde é possível estacionar tranquilamente. Temos vagas gratuitas na rua, incluindo frequentemente na frente da escola. Também somos facilmente acessíveis por transporte público, com várias linhas de ônibus que param próximo à escola.'
        }
      },
      {
        '@type': 'Question',
        name: 'Como faço para me matricular?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Entre em contato conosco pelo WhatsApp (48) 98855-9491 ou preencha o formulário de contato. Nossa equipe irá esclarecer todas as dúvidas e auxiliar com a matrícula.'
        }
      }
    ]
  };

  // Schema 4: Reviews - Depoimentos de Alunos
  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Escola Habilidade',
    url: 'https://www.escolahabilidade.com',
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        },
        author: {
          '@type': 'Person',
          name: 'Karolain Roberta Régis'
        },
        datePublished: '2024-11-20',
        reviewBody: 'Estou fazendo o curso e estou adorando, professor atencioso, com atividades super dinâmicas, aprendi já bastante coisas que ainda não sabia, estão super atualizados no mercado.'
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        },
        author: {
          '@type': 'Person',
          name: 'Renan Souza'
        },
        datePublished: '2024-10-15',
        reviewBody: 'Minha experiência na Escola Habilidade está sendo ótima, estou no curso de programação. Curso presencial, atenção total do professor, atividades totalmente práticas e divertidas.'
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        },
        author: {
          '@type': 'Person',
          name: 'Emily Vitoria'
        },
        datePublished: '2024-11-20',
        reviewBody: 'Lugar ótimo e acolhedor, as turmas pequenas realmente facilitam a precisão na hora de aprender e o foco do professor para cada aluno. Recomendo!'
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        },
        author: {
          '@type': 'Person',
          name: 'Luiza Bóz Dutra'
        },
        datePublished: '2024-10-01',
        reviewBody: 'O espaço é muito acolhedor, e as aulas são bastante explicativas e práticas. Durante as aulas, conseguimos tirar todas as nossas dúvidas, e os professores são extremamente dedicados.'
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        },
        author: {
          '@type': 'Person',
          name: 'Jonatas Torres'
        },
        datePublished: '2024-11-20',
        reviewBody: 'Estou tendo uma excelente experiência com a Escola Habilidade no curso de SketchUp. O conteúdo é muito bem estruturado, o professor domina o assunto e sabe explicar de forma clara.'
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        },
        author: {
          '@type': 'Person',
          name: 'Ana Caroline Orofino'
        },
        datePublished: '2024-10-15',
        reviewBody: 'Estou adorando as aulas, professor muito atencioso, sempre traz questões do cotidiano para resolução das atividades!'
      }
    ]
  };

  // Schema 5: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: 'https://www.escolahabilidade.com'
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Cursos em São José SC | Escola Habilidade - Informática, AutoCAD, SketchUp"
        description="Escola de cursos profissionalizantes em São José SC, Kobrasol. Cursos de Informática, SketchUp, AutoCAD, Revit, Enscape, Marketing Digital, Programação e IA. Certificado reconhecido. Aulas presenciais e online na Grande Florianópolis."
        keywords="cursos são josé sc, escola técnica são josé, cursos profissionalizantes são josé, curso informática são josé, curso sketchup são josé, curso autocad são josé, curso revit são josé, marketing digital são josé, programação são josé, cursos técnicos grande florianópolis, escola habilidade kobrasol"
        path="/"
        type="website"
        schemaData={schemaData}
      />

      {/* Schemas JSON-LD adicionais */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(itemListSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(reviewsSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />

      <Hero />
      <Courses />
      <HowItWorksSimple />
      <Reviews />
      <TrustedCompanies variant="home" />
      <LatestBlogSection />
      <ContactForm />
      <LocationSection />
      <FAQ />
      <StickyWhatsApp />
    </>
  );
}

// Loader function for SSG (não requer dados externos)
export function loader() {
  return null;
}

// Export both default and Component for vite-react-ssg compatibility
export default Home;
export { Home as Component }; 