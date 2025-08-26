import { jsx } from "react/jsx-runtime";
import { forwardRef, useState, useEffect } from "react";
const motionCache = /* @__PURE__ */ new Map();
const loadingPromises = /* @__PURE__ */ new Map();
const loadFramerMotion = async () => {
  if (motionCache.has("framer-motion")) {
    return motionCache.get("framer-motion");
  }
  if (loadingPromises.has("framer-motion")) {
    return loadingPromises.get("framer-motion");
  }
  const loadPromise = import("framer-motion").then((module) => {
    motionCache.set("framer-motion", module);
    loadingPromises.delete("framer-motion");
    return module;
  }).catch((error) => {
    console.warn("Failed to load framer-motion:", error);
    loadingPromises.delete("framer-motion");
    return null;
  });
  loadingPromises.set("framer-motion", loadPromise);
  return loadPromise;
};
const FallbackDiv = forwardRef(({
  children,
  className = "",
  style = {},
  initial,
  animate,
  whileHover,
  whileInView,
  viewport,
  transition,
  ...props
}, ref) => {
  const {
    initial: _,
    animate: __,
    whileHover: ___,
    whileInView: ____,
    viewport: _____,
    transition: ______,
    ...domProps
  } = props;
  const fallbackStyle = {
    ...style,
    transition: "all 0.3s ease-in-out",
    ...whileHover && {
      cursor: "pointer"
    }
  };
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    if (whileHover) setIsHovered(true);
  };
  const handleMouseLeave = () => {
    if (whileHover) setIsHovered(false);
  };
  const hoverStyle = typeof window !== "undefined" && isHovered && whileHover ? {
    transform: whileHover.scale ? `scale(${whileHover.scale})` : whileHover.y ? `translateY(${whileHover.y}px)` : "none",
    boxShadow: whileHover.boxShadow || "none"
  } : {};
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className,
      style: { ...fallbackStyle, ...hoverStyle },
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ...domProps,
      children
    }
  );
});
FallbackDiv.displayName = "FallbackDiv";
const createLazyMotionComponent = (elementType = "div") => {
  const LazyMotionComponent = forwardRef((props, ref) => {
    const [motionModule, setMotionModule] = useState(motionCache.get("framer-motion"));
    const [isLoading, setIsLoading] = useState(!motionCache.has("framer-motion"));
    useEffect(() => {
      if (typeof window === "undefined") return;
      let mounted = true;
      const loadMotion = async () => {
        try {
          const module = await loadFramerMotion();
          if (mounted && module) {
            setMotionModule(module);
          }
        } catch (error) {
          console.warn("Error loading framer-motion:", error);
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      };
      if (!motionModule) {
        loadMotion();
      } else {
        setIsLoading(false);
      }
      return () => {
        mounted = false;
      };
    }, [motionModule]);
    if (typeof window === "undefined" || isLoading || !(motionModule == null ? void 0 : motionModule.motion)) {
      const {
        initial,
        animate,
        whileHover,
        whileInView,
        viewport,
        transition,
        variants,
        whileTap,
        whileDrag,
        whileFocus,
        exit,
        drag,
        layout,
        layoutId,
        style,
        ...fallbackProps
      } = props;
      if (elementType === "section") {
        return /* @__PURE__ */ jsx("section", { ref, ...fallbackProps });
      }
      if (elementType === "span") {
        return /* @__PURE__ */ jsx("span", { ref, ...fallbackProps });
      }
      if (elementType === "p") {
        return /* @__PURE__ */ jsx("p", { ref, ...fallbackProps });
      }
      if (elementType === "h1") {
        return /* @__PURE__ */ jsx("h1", { ref, ...fallbackProps });
      }
      if (elementType === "h2") {
        return /* @__PURE__ */ jsx("h2", { ref, ...fallbackProps });
      }
      if (elementType === "h3") {
        return /* @__PURE__ */ jsx("h3", { ref, ...fallbackProps });
      }
      if (elementType === "button") {
        return /* @__PURE__ */ jsx("button", { ref, ...fallbackProps });
      }
      if (elementType === "img") {
        return /* @__PURE__ */ jsx("img", { ref, ...fallbackProps });
      }
      if (elementType === "ul") {
        return /* @__PURE__ */ jsx("ul", { ref, ...fallbackProps });
      }
      if (elementType === "li") {
        return /* @__PURE__ */ jsx("li", { ref, ...fallbackProps });
      }
      if (elementType === "nav") {
        return /* @__PURE__ */ jsx("nav", { ref, ...fallbackProps });
      }
      if (elementType === "header") {
        return /* @__PURE__ */ jsx("header", { ref, ...fallbackProps });
      }
      if (elementType === "main") {
        return /* @__PURE__ */ jsx("main", { ref, ...fallbackProps });
      }
      if (elementType === "article") {
        return /* @__PURE__ */ jsx("article", { ref, ...fallbackProps });
      }
      if (elementType === "aside") {
        return /* @__PURE__ */ jsx("aside", { ref, ...fallbackProps });
      }
      if (elementType === "footer") {
        return /* @__PURE__ */ jsx("footer", { ref, ...fallbackProps });
      }
      if (elementType === "a") {
        return /* @__PURE__ */ jsx("a", { ref, ...fallbackProps });
      }
      if (elementType === "form") {
        return /* @__PURE__ */ jsx("form", { ref, ...fallbackProps });
      }
      if (elementType === "input") {
        return /* @__PURE__ */ jsx("input", { ref, ...fallbackProps });
      }
      if (elementType === "textarea") {
        return /* @__PURE__ */ jsx("textarea", { ref, ...fallbackProps });
      }
      if (elementType === "label") {
        return /* @__PURE__ */ jsx("label", { ref, ...fallbackProps });
      }
      if (elementType === "select") {
        return /* @__PURE__ */ jsx("select", { ref, ...fallbackProps });
      }
      if (elementType === "option") {
        return /* @__PURE__ */ jsx("option", { ref, ...fallbackProps });
      }
      if (elementType === "svg") {
        return /* @__PURE__ */ jsx("svg", { ref, ...fallbackProps });
      }
      if (elementType === "circle") {
        return /* @__PURE__ */ jsx("circle", { ref, ...fallbackProps });
      }
      if (elementType === "polygon") {
        return /* @__PURE__ */ jsx("polygon", { ref, ...fallbackProps });
      }
      if (elementType === "line") {
        return /* @__PURE__ */ jsx("line", { ref, ...fallbackProps });
      }
      if (elementType === "path") {
        return /* @__PURE__ */ jsx("path", { ref, ...fallbackProps });
      }
      if (elementType === "g") {
        return /* @__PURE__ */ jsx("g", { ref, ...fallbackProps });
      }
      if (elementType === "text") {
        return /* @__PURE__ */ jsx("text", { ref, ...fallbackProps });
      }
      if (elementType === "rect") {
        return /* @__PURE__ */ jsx("rect", { ref, ...fallbackProps });
      }
      return /* @__PURE__ */ jsx(FallbackDiv, { ref, ...props });
    }
    const MotionElement = motionModule.motion[elementType];
    return /* @__PURE__ */ jsx(MotionElement, { ref, ...props });
  });
  LazyMotionComponent.displayName = `LazyMotion${elementType.charAt(0).toUpperCase() + elementType.slice(1)}`;
  return LazyMotionComponent;
};
const motion = {
  div: createLazyMotionComponent("div"),
  section: createLazyMotionComponent("section"),
  span: createLazyMotionComponent("span"),
  p: createLazyMotionComponent("p"),
  h1: createLazyMotionComponent("h1"),
  h2: createLazyMotionComponent("h2"),
  h3: createLazyMotionComponent("h3"),
  button: createLazyMotionComponent("button"),
  img: createLazyMotionComponent("img"),
  ul: createLazyMotionComponent("ul"),
  li: createLazyMotionComponent("li"),
  nav: createLazyMotionComponent("nav"),
  header: createLazyMotionComponent("header"),
  main: createLazyMotionComponent("main"),
  article: createLazyMotionComponent("article"),
  aside: createLazyMotionComponent("aside"),
  footer: createLazyMotionComponent("footer"),
  a: createLazyMotionComponent("a"),
  form: createLazyMotionComponent("form"),
  input: createLazyMotionComponent("input"),
  textarea: createLazyMotionComponent("textarea"),
  label: createLazyMotionComponent("label"),
  select: createLazyMotionComponent("select"),
  option: createLazyMotionComponent("option"),
  // SVG elements
  svg: createLazyMotionComponent("svg"),
  circle: createLazyMotionComponent("circle"),
  polygon: createLazyMotionComponent("polygon"),
  line: createLazyMotionComponent("line"),
  path: createLazyMotionComponent("path"),
  g: createLazyMotionComponent("g"),
  text: createLazyMotionComponent("text"),
  rect: createLazyMotionComponent("rect")
};
export {
  motion as m
};
