const isReducedMotionPreferred = () => {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
const getAnimationClasses = (animationType = "fade") => {
  if (isReducedMotionPreferred()) {
    return "";
  }
  switch (animationType) {
    case "fade":
      return "blog-fade-in";
    case "slide":
      return "blog-slide-in";
    case "lift":
      return "blog-hover-lift";
    default:
      return "";
  }
};
const getStaggeredDelay = (index, delayMs = 100) => {
  if (isReducedMotionPreferred()) {
    return "";
  }
  const delay = Math.min(index * delayMs, 500);
  return `blog-delay-${delay}`;
};
const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(" ").trim();
};
export {
  getStaggeredDelay as a,
  combineClasses as c,
  getAnimationClasses as g
};
