import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

export default function Programacao() {
  return <CoursePage slug="programacao" />;
}

// SSG Loader for this specific course
export async function loader() {
  try {
    const foundCourse = getCourseBySlug('programacao', COURSES_DATA);
    if (!foundCourse) {
      throw new Error('Course programacao not found');
    }
    return { course: foundCourse };
  } catch (error) {
    console.error('SSG Loader error for Programacao:', error);
    return { course: null };
  }
}

export const Component = Programacao;