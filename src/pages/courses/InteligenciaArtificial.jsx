import CoursePage, { getCourseBySlug } from '../CoursePage';
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
    "availability": "http://schema.org/InStock",
    "priceCurrency": "BRL"
  }
};

export default function InteligenciaArtificial() {
  return (
    <>
      {/* Schema.org JSON-LD - Renderizado fora do Helmet para compatibilidade com SSG */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(courseSchema)}} />
      <CoursePage slug="inteligencia-artificial" />
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