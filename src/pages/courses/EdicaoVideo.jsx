import CoursePage, { getCourseBySlug } from '../CoursePage';
import COURSES_DATA from '../../data/coursesData';

export default function EdicaoVideo() {
  return <CoursePage slug="edicao-video" />;
}

// SSG Loader for this specific course
export async function loader() {
  try {
    const foundCourse = getCourseBySlug('edicao-video', COURSES_DATA);
    if (!foundCourse) {
      throw new Error('Course edicao-video not found');
    }
    return { course: foundCourse };
  } catch (error) {
    console.error('SSG Loader error for EdicaoVideo:', error);
    return { course: null };
  }
}

export const Component = EdicaoVideo;