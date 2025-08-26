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
function MarketingDigital() {
  return /* @__PURE__ */ jsx(CoursePage, { slug: "marketing-digital" });
}
async function loader() {
  try {
    const foundCourse = getCourseBySlug("marketing-digital", COURSES_DATA);
    if (!foundCourse) {
      throw new Error("Course marketing-digital not found");
    }
    return { course: foundCourse };
  } catch (error) {
    console.error("SSG Loader error for MarketingDigital:", error);
    return { course: null };
  }
}
const Component = MarketingDigital;
export {
  Component,
  MarketingDigital as default,
  loader
};
