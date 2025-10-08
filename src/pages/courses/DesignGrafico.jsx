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

export default function DesignGrafico() {
  return (
    <>
      {/* Schema.org JSON-LD - Renderizado fora do Helmet para compatibilidade com SSG */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(courseSchema)}} />
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