import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

export default function MarketingDigital() {
  return <CoursePage slug="marketing-digital" />;
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