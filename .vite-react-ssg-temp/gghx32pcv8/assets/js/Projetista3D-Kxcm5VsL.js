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
function Projetista3D() {
  return /* @__PURE__ */ jsx(CoursePage, { slug: "projetista-3d" });
}
async function loader() {
  try {
    const foundCourse = getCourseBySlug("projetista-3d", COURSES_DATA);
    if (!foundCourse) {
      throw new Error("Course projetista-3d not found");
    }
    return { course: foundCourse };
  } catch (error) {
    console.error("SSG Loader error for Projetista3D:", error);
    return { course: null };
  }
}
const Component = Projetista3D;
export {
  Component,
  Projetista3D as default,
  loader
};
