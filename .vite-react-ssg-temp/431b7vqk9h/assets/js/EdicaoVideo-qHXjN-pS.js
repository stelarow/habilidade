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
function EdicaoVideo() {
  return /* @__PURE__ */ jsx(CoursePage, { slug: "edicao-video" });
}
async function loader() {
  try {
    const foundCourse = getCourseBySlug("edicao-video", COURSES_DATA);
    if (!foundCourse) {
      throw new Error("Course edicao-video not found");
    }
    return { course: foundCourse };
  } catch (error) {
    console.error("SSG Loader error for EdicaoVideo:", error);
    return { course: null };
  }
}
const Component = EdicaoVideo;
export {
  Component,
  EdicaoVideo as default,
  loader
};
