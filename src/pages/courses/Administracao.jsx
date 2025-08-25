import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

export default function Administracao() {
  return <CoursePage slug="administracao" />;
}

// SSG Loader for this specific course
export async function loader() {
  try {
    const foundCourse = getCourseBySlug('administracao', COURSES_DATA);
    if (!foundCourse) {
      throw new Error('Course administracao not found');
    }
    return { course: foundCourse };
  } catch (error) {
    console.error('SSG Loader error for Administracao:', error);
    return { course: null };
  }
}

export const Component = Administracao;