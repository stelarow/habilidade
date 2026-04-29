import InteligenciaArtificialPage from '../../components/course/inteligencia-artificial/InteligenciaArtificialPage';
import { getCourseBySlug } from '../../utils/courseHelpers';
import COURSES_DATA from '../../data/coursesData';

// JSON-LD Schema para Course
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Inteligência Artificial - ChatGPT, Cursor, Flowlabs e ElevenLabs",
  "description": "Curso completo de Inteligência Artificial. Aprenda IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs e HatchCanvas. 6 módulos para dominar IA criativa e aplicada aos negócios.",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "Escola Habilidade",
    "url": "https://www.escolahabilidade.com.br"
  },
  "url": "https://www.escolahabilidade.com/cursos/inteligencia-artificial",
  "courseMode": "Blended",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "https://schema.org/BlendedEventAttendanceMode",
    "courseWorkload": "PT31H30M"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "BRL"
  }
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Escola Habilidade - Curso de Inteligência Artificial",
  "description": "Curso de Inteligência Artificial presencial em São José SC. Aprenda ChatGPT, Cursor, Flowlabs, ElevenLabs e IA aplicada aos negócios.",
  "url": "https://www.escolahabilidade.com/cursos/inteligencia-artificial",
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
      "name": "Preciso ter conhecimento técnico de programação para fazer o curso de IA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não! O curso foi desenvolvido para profissionais de diversas áreas que desejam aplicar IA em seus trabalhos. Não é necessário saber programar. Focamos em ferramentas práticas como ChatGPT, Cursor e outras que permitem usar IA sem código."
      }
    },
    {
      "@type": "Question",
      "name": "O que vou aprender no curso de Inteligência Artificial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Você aprenderá IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs e HatchCanvas. São 6 módulos completos que cobrem desde conceitos básicos de IA até aplicação prática em projetos reais."
      }
    },
    {
      "@type": "Question",
      "name": "O curso é atualizado com as últimas tendências de IA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Atualizamos constantemente nosso conteúdo para incluir as últimas ferramentas e tendências do mercado de IA. Acreditamos que a educação em IA deve acompanhar a velocidade das inovações."
      }
    },
    {
      "@type": "Question",
      "name": "Posso aplicar o que aprendeu no curso no meu trabalho atual?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutamente! O curso foi desenhado para aplicação imediata no mercado de trabalho. Você aprenderá a usar IA para aumentar produtividade, automatizar tarefas, criar conteúdo e tomar melhores decisões baseadas em dados."
      }
    },
    {
      "@type": "Question",
      "name": "O curso oferece suporte após a conclusão?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Oferecemos suporte vitalício aos nossos alunos. Após a conclusão do curso, você terá acesso a atualizações de conteúdo e canal de suporte para dúvidas sobre a aplicação de IA em projetos."
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
      "name": "Inteligência Artificial",
      "item": "https://www.escolahabilidade.com/cursos/inteligencia-artificial"
    }
  ]
};

export default function InteligenciaArtificial() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(courseSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqPageSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />
      <InteligenciaArtificialPage />
    </>
  );
}

// SSG Loader for this specific course
export async function loader() {
  try {
    const foundCourse = getCourseBySlug('inteligencia-artificial', COURSES_DATA);
    if (!foundCourse) {
      throw new Error('Course inteligencia-artificial not found');
    }
    return { course: foundCourse };
  } catch (error) {
    console.error('SSG Loader error for InteligenciaArtificial:', error);
    return { course: null };
  }
}

export const Component = InteligenciaArtificial;
