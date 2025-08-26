import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Link } from "react-router-dom";
import { House, CaretRight } from "@phosphor-icons/react";
const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) return null;
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: "mb-8", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center gap-2 text-sm", children: [
    /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "flex items-center text-zinc-400 hover:text-zinc-300 transition-colors",
        children: /* @__PURE__ */ jsx(House, { size: 16 })
      }
    ) }),
    items.map((item, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(CaretRight, { size: 12, className: "text-zinc-600" }),
      item.current ? /* @__PURE__ */ jsx("span", { className: "text-zinc-300 font-medium truncate max-w-xs md:max-w-md", children: item.label }) : /* @__PURE__ */ jsx(
        Link,
        {
          to: item.path,
          className: "text-zinc-400 hover:text-zinc-300 transition-colors truncate max-w-xs md:max-w-md",
          children: item.label
        }
      )
    ] }, index))
  ] }) });
};
export {
  Breadcrumbs as B
};
