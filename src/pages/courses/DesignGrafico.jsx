import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

export default function DesignGrafico() {
  return <CoursePage slug="design-grafico" />;
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