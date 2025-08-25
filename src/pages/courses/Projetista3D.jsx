import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

export default function Projetista3D() {
  return <CoursePage slug="projetista-3d" />;
}

// SSG Loader for this specific course
export async function loader() {
  try {
    const foundCourse = getCourseBySlug('projetista-3d', COURSES_DATA);
    if (!foundCourse) {
      throw new Error('Course projetista-3d not found');
    }
    return { course: foundCourse };
  } catch (error) {
    console.error('SSG Loader error for Projetista3D:', error);
    return { course: null };
  }
}

export const Component = Projetista3D;