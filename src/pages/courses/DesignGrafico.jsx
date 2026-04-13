import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

// JSON-LD Schema para Course
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Design Gráfico - Photoshop, Illustrator, InDesign, Canva e CorelDRAW",
  "description": "Torne-se um designer gráfico completo. Aprenda Photoshop, Illustrator, InDesign, Canva e CorelDRAW com teorias fundamentais do design. 5 módulos completos para dominar o design profissional.",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "Escola Habilidade",
    "url": "https://www.escolahabilidade.com.br"
  },
  "url": "https://www.escolahabilidade.com/cursos/design-grafico",
  "courseMode": "Blended",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "https://schema.org/BlendedEventAttendanceMode",
    "courseWorkload": "PT90H"
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
  "name": "Escola Habilidade - Curso de Design Gráfico",
  "description": "Curso de Design Gráfico presencial em São José SC. Aprenda Photoshop, Illustrator, InDesign, Canva e CorelDRAW.",
  "url": "https://www.escolahabilidade.com/cursos/design-grafico",
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
      "name": "Preciso ter experiência prévia em design para fazer o curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não! O curso foi desenvolvido para iniciantes. Começamos com os fundamentos do design e evoluímos progressivamente até técnicas avançadas. Se você tem interesse em design e criatividade, já é suficiente para começar."
      }
    },
    {
      "@type": "Question",
      "name": "Quais softwares são ensinados no curso de Design Gráfico?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ensinamos Photoshop, Illustrator, InDesign, Canva e CorelDRAW. São as principais ferramentas do mercado profissional de design, cobrindo desde edição de imagem até diagramação e vetorial."
      }
    },
    {
      "@type": "Question",
      "name": "O curso inclui materiais didáticos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Todos os materiais estão inclusos no curso, incluindo apostilas, exercícios práticos e arquivos de projeto. Você terá acesso a todos os recursos necessários para acompanhar as aulas."
      }
    },
    {
      "@type": "Question",
      "name": "Posso trabalhar como designer gráfico após o curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! O mercado de design gráfico é amplo e em constante crescimento. Nossos alunos trabalham como designers em agências, departamentos de marketing, editoras, ONGs e como freelancers. Fornecemos certificado reconhecido e portfólio com projetos práticos."
      }
    },
    {
      "@type": "Question",
      "name": "A escola oferece suporte após a conclusão do curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Oferecemos suporte vitalício aos nossos alunos. Após a conclusão do curso, mantemos canal de suporte para dúvidas pontuais sobre projetos e carreira. Acreditamos no acompanhamento genuíno da jornada de cada aluno."
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
      "name": "Design Gráfico",
      "item": "https://www.escolahabilidade.com/cursos/design-grafico"
    }
  ]
};

export default function DesignGrafico() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(courseSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqPageSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />
      <CoursePage slug="design-grafico" />
    </>
  );
}

// SSG Loader for this specific course
export async function loader() {
  try {
    const foundCourse = getCourseBySlug('design-grafico', COURSES_DATA);
    if (!foundCourse) {
      throw new Error('Course design-grafico not found');
    }
    return { course: foundCourse };
  } catch (error) {
    console.error('SSG Loader error for DesignGrafico:', error);
    return { course: null };
  }
}

export const Component = DesignGrafico;