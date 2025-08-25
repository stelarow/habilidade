import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

export default function BusinessIntelligence() {
  return <CoursePage slug="excel-avancado-business-intelligence" />;
}

// SSG Loader for this specific course
export async function loader() {
  try {
    const foundCourse = getCourseBySlug('excel-avancado-business-intelligence', COURSES_DATA);
    if (!foundCourse) {
      throw new Error('Course excel-avancado-business-intelligence not found');
    }
    return { course: foundCourse };
  } catch (error) {
    console.error('SSG Loader error for BusinessIntelligence:', error);
    return { course: null };
  }
}

export const Component = BusinessIntelligence;