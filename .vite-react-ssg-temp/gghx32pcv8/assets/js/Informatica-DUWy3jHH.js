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
function Informatica() {
  return /* @__PURE__ */ jsx(CoursePage, { slug: "informatica" });
}
async function loader() {
  try {
    const foundCourse = getCourseBySlug("informatica", COURSES_DATA);
    if (!foundCourse) {
      throw new Error("Course informatica not found");
    }
    return { course: foundCourse };
  } catch (error) {
    console.error("SSG Loader error for Informatica:", error);
    return { course: null };
  }
}
const Component = Informatica;
export {
  Component,
  Informatica as default,
  loader
};
