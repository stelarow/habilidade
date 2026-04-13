import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

// JSON-LD Schema para Course
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Marketing Digital - Social Ads, SEO, Copywriting e Branding",
  "description": "Torne-se um especialista em Marketing Digital. Aprenda Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal e Facebook Business. 6 módulos completos para gerar resultados reais.",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "Escola Habilidade",
    "url": "https://www.escolahabilidade.com.br"
  },
  "url": "https://www.escolahabilidade.com/cursos/marketing-digital",
  "courseMode": "Blended",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "https://schema.org/BlendedEventAttendanceMode",
    "courseWorkload": "PT68H"
  },
  "offers": {
    "@type": "Offer",
    "availability": "http://schema.org/InStock",
    "priceCurrency": "BRL"
  }
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Escola Habilidade - Curso de Marketing Digital",
  "description": "Curso de Marketing Digital presencial em São José SC. Aprenda Social Ads, SEO, Copywriting, Branding e Analytics.",
  "url": "https://www.escolahabilidade.com/cursos/marketing-digital",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol",
    "addressLocality": "São José",
    "addressRegion": "SC",
    "postalCode": "88102-280",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-27.5923906",
    "longitude": "-48.6175692"
  },
  "telephone": "+55-48-98855-9491",
  "openingHours": "Mo-Tu 08:00-20:00, We 08:00-22:00, Th 08:00-20:00, Fr 08:00-17:30, Sa 08:00-12:00",
  "areaServed": [
    { "@type": "City", "name": "São José" },
    { "@type": "City", "name": "Florianópolis" },
    { "@type": "City", "name": "Palhoça" },
    { "@type": "City", "name": "Biguaçu" }
  ]
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Preciso ter experiência prévia em marketing para fazer o curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não! O curso foi desenvolvido para iniciantes e profissionais que desejam atualizar seus conhecimentos. Começamos com os fundamentos do marketing digital e evoluímos até estratégias avançadas de Social Ads, SEO e Analytics."
      }
    },
    {
      "@type": "Question",
      "name": "O que vou aprender no curso de Marketing Digital?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Você aprenderá Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal e Facebook Business. São 6 módulos completos que cobrem desde estratégias básicas até campanhas avançadas."
      }
    },
    {
      "@type": "Question",
      "name": "O curso inclui certificação?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Ao concluir o curso, você recebe certificado reconhecido que pode ser usado para comprovação profissional. Nosso certificado é valorizado no mercado de trabalho."
      }
    },
    {
      "@type": "Question",
      "name": "Posso trabalhar como marketer digital após o curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! O mercado de marketing digital está em constante crescimento. Nossos alunos trabalham em agências, departamentos de marketing de empresas, como consultores independentes ou em cargos de Social Media, SEO e Analytics."
      }
    },
    {
      "@type": "Question",
      "name": "O curso é presencial ou online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oferecemos modalidades presencial e online para você escolher a que melhor se adapta à sua rotina. As aulas presenciais são ministradas em São José, no Kobrasol, com turmas reduzidas para maior aproveitamento."
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://www.escolahabilidade.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Cursos",
      "item": "https://www.escolahabilidade.com/#cursos"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Marketing Digital",
      "item": "https://www.escolahabilidade.com/cursos/marketing-digital"
    }
  ]
};

export default function MarketingDigital() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(courseSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqPageSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />
      <CoursePage slug="marketing-digital" />
    </>
  );
}

// SSG Loader for this specific course
export async function loader() {
  try {
    const foundCourse = getCourseBySlug('marketing-digital', COURSES_DATA);
    if (!foundCourse) {
      throw new Error('Course marketing-digital not found');
    }
    return { course: foundCourse };
  } catch (error) {
    console.error('SSG Loader error for MarketingDigital:', error);
    return { course: null };
  }
}

export const Component = MarketingDigital;