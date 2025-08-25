import { jsx } from "react/jsx-runtime";
import CoursePage from "./CoursePage-DOhGLxGA.js";
import { g as getCourseBySlug, a as COURSES_DATA } from "../../main.mjs";
import "react-router-dom";
import "react";
import "vite-react-ssg";
import "@phosphor-icons/react";
import "@emailjs/browser";
import "prop-types";
import "./CourseCurriculum-CyHszRRV.js";
import "./CourseTestimonials-BREMzG4U.js";
import "./CourseWorkflowSection-CqDk2yhF.js";
import "./CourseToolsOverview-BKbNiKfj.js";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "@supabase/supabase-js";
function InteligenciaArtificial() {
  return /* @__PURE__ */ jsx(CoursePage, { slug: "inteligencia-artificial" });
}
async function loader() {
  try {
    const foundCourse = getCourseBySlug("inteligencia-artificial", COURSES_DATA);
    if (!foundCourse) {
      throw new Error("Course inteligencia-artificial not found");
    }
    return { course: foundCourse };
  } catch (error) {
    console.error("SSG Loader error for InteligenciaArtificial:", error);
    return { course: null };
  }
}
const Component = InteligenciaArtificial;
export {
  Component,
  InteligenciaArtificial as default,
  loader
};
