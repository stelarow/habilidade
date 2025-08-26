import { jsx } from "react/jsx-runtime";
import CoursePage from "./CoursePage-8TEXmaR1.js";
import { g as getCourseBySlug, C as COURSES_DATA } from "../../main.mjs";
import "react-router-dom";
import "react";
import "vite-react-ssg";
import "@phosphor-icons/react";
import "@emailjs/browser";
import "prop-types";
import "./CourseCurriculum-CyHszRRV.js";
import "./CourseTestimonials-BREMzG4U.js";
import "./TrustedCompanies-DWNAMGXJ.js";
import "./lazyMotion-Brq4XrXb.js";
import "./CourseWorkflowSection-CqDk2yhF.js";
import "./CourseToolsOverview-BKbNiKfj.js";
import "./emailConfig-DLqNakku.js";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
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
