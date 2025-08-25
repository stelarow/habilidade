import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

export default function InteligenciaArtificial() {
  return <CoursePage slug="inteligencia-artificial" />;
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