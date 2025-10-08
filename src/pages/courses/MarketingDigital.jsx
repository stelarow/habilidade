import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';
import { Helmet } from '@dr.pogodin/react-helmet';

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

export default function MarketingDigital() {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(courseSchema)}
        </script>
      </Helmet>
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