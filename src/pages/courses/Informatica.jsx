import CoursePage, { getCourseBySlug, validateAndSanitizeCourse } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

export default function Informatica() {
  return <CoursePage slug="informatica" />;
}

// SSG Loader for this specific course
export async function loader() {
  try {
    const foundCourse = getCourseBySlug('informatica', COURSES_DATA);
    if (!foundCourse) {
      throw new Error('Course informatica not found');
    }
    return { course: foundCourse };
  } catch (error) {
    console.error('SSG Loader error for Informatica:', error);
    return { course: null };
  }
}

export const Component = Informatica;