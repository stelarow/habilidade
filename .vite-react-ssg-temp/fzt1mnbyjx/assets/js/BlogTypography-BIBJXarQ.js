import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { u as useBlogResponsive } from "./useBlogResponsive-DotabLZl.js";
import { c as combineClasses } from "./blogTheme-Ctep9-MK.js";
const BlogTypography = ({
  children,
  variant = "article",
  className = "",
  maxWidth = "reading",
  ...props
}) => {
  const { getTypographyClasses, readingWidth } = useBlogResponsive();
  const widthMap = {
    narrow: "max-w-lg",
    // ~32rem / 512px
    reading: "max-w-2xl",
    // ~42rem / 672px - optimal for reading
    wide: "max-w-4xl",
    // ~56rem / 896px
    full: "max-w-full"
    // Full width
  };
  const variantStyles = {
    article: "prose prose-zinc prose-invert max-w-none",
    excerpt: "text-zinc-300 leading-relaxed",
    meta: "text-zinc-400 text-sm",
    caption: "text-zinc-500 text-xs italic",
    quote: "text-zinc-200 italic border-l-4 border-fuchsia-500 pl-6",
    highlight: "text-fuchsia-300 font-medium"
  };
  const responsiveClasses = getTypographyClasses("body");
  const classes = combineClasses(
    variantStyles[variant],
    widthMap[maxWidth],
    responsiveClasses,
    "mx-auto",
    // Center the content
    className
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: classes,
      style: {
        // Custom CSS properties for optimal reading
        "--reading-width": `${readingWidth}px`
      },
      ...props,
      children
    }
  );
};
const BlogTitle = ({
  children,
  level = 1,
  className = "",
  gradient = false,
  ...props
}) => {
  const { getTypographyClasses } = useBlogResponsive();
  const Tag = `h${Math.min(Math.max(level, 1), 6)}`;
  const baseClasses = combineClasses(
    "font-bold text-white leading-tight",
    gradient && "bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent",
    getTypographyClasses("title"),
    className
  );
  return /* @__PURE__ */ jsx(Tag, { className: baseClasses, ...props, children });
};
const BlogSubtitle = ({
  children,
  className = "",
  ...props
}) => {
  const { getTypographyClasses } = useBlogResponsive();
  return /* @__PURE__ */ jsx(
    "h2",
    {
      className: combineClasses(
        "font-semibold text-zinc-200 leading-relaxed",
        getTypographyClasses("subtitle"),
        className
      ),
      ...props,
      children
    }
  );
};
const BlogExcerpt = ({
  children,
  className = "",
  ...props
}) => {
  const { getTypographyClasses } = useBlogResponsive();
  return /* @__PURE__ */ jsx(
    "p",
    {
      className: combineClasses(
        "text-zinc-300 leading-relaxed",
        getTypographyClasses("body"),
        className
      ),
      ...props,
      children
    }
  );
};
const BlogMeta = ({
  children,
  className = "",
  separator = '"',
  items = [],
  ...props
}) => {
  const { getTypographyClasses } = useBlogResponsive();
  const metaClasses = combineClasses(
    "text-zinc-400 flex items-center flex-wrap gap-2",
    getTypographyClasses("caption"),
    className
  );
  if (items.length > 0) {
    return /* @__PURE__ */ jsx("div", { className: metaClasses, ...props, children: items.map((item, index) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
      index > 0 && /* @__PURE__ */ jsx("span", { className: "text-zinc-600", "aria-hidden": "true", children: separator }),
      /* @__PURE__ */ jsx("span", { children: item })
    ] }, index)) });
  }
  return /* @__PURE__ */ jsx("div", { className: metaClasses, ...props, children });
};
const BlogQuote = ({
  children,
  author,
  className = "",
  ...props
}) => {
  const { getTypographyClasses } = useBlogResponsive();
  return /* @__PURE__ */ jsxs(
    "blockquote",
    {
      className: combineClasses(
        "blog-quote my-6 p-6 bg-zinc-800/50 border-l-4 border-fuchsia-500 rounded-r-lg",
        getTypographyClasses("body"),
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("p", { className: "text-zinc-200 italic mb-2", children: [
          '"',
          children,
          '"'
        ] }),
        author && /* @__PURE__ */ jsxs("cite", { className: "text-zinc-400 text-sm not-italic", children: [
          " ",
          author
        ] })
      ]
    }
  );
};
const BlogCode = ({
  children,
  inline = false,
  language,
  className = "",
  ...props
}) => {
  const baseClasses = "blog-code font-mono";
  if (inline) {
    return /* @__PURE__ */ jsx(
      "code",
      {
        className: combineClasses(
          baseClasses,
          "px-1.5 py-0.5 text-sm bg-zinc-800 text-zinc-200 rounded",
          className
        ),
        ...props,
        children
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "pre",
    {
      className: combineClasses(
        "overflow-x-auto p-4 bg-zinc-900 rounded-lg my-6",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        "code",
        {
          className: combineClasses(
            baseClasses,
            language && `language-${language}`,
            "text-zinc-200"
          ),
          children
        }
      )
    }
  );
};
const BlogHighlight = ({
  children,
  color = "primary",
  className = "",
  ...props
}) => {
  const colorMap = {
    primary: "bg-fuchsia-500/20 text-fuchsia-300",
    secondary: "bg-blue-500/20 text-blue-300",
    success: "bg-green-500/20 text-green-300",
    warning: "bg-yellow-500/20 text-yellow-300",
    error: "bg-red-500/20 text-red-300"
  };
  return /* @__PURE__ */ jsx(
    "mark",
    {
      className: combineClasses(
        "blog-highlight px-1 py-0.5 rounded",
        colorMap[color] || colorMap.primary,
        className
      ),
      ...props,
      children
    }
  );
};
const BlogList = ({
  children,
  ordered = false,
  className = "",
  ...props
}) => {
  const Tag = ordered ? "ol" : "ul";
  const { getTypographyClasses } = useBlogResponsive();
  const listClasses = combineClasses(
    "space-y-2 text-zinc-300",
    ordered ? "list-decimal list-inside" : "list-disc list-inside",
    getTypographyClasses("body"),
    className
  );
  return /* @__PURE__ */ jsx(Tag, { className: listClasses, ...props, children });
};
const BlogListItem = ({
  children,
  className = "",
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "li",
    {
      className: combineClasses(
        "text-zinc-300 leading-relaxed",
        className
      ),
      ...props,
      children
    }
  );
};
const BlogReadingContainer = ({
  children,
  className = "",
  ...props
}) => {
  const { readingWidth, isMobile } = useBlogResponsive();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: combineClasses(
        "mx-auto px-4",
        // Optimal reading width
        isMobile ? "max-w-full" : "max-w-2xl",
        className
      ),
      style: {
        // Custom reading width based on screen size
        maxWidth: isMobile ? "100%" : `${readingWidth}px`
      },
      ...props,
      children
    }
  );
};
const BlogLink = ({
  children,
  href,
  external = false,
  className = "",
  ...props
}) => {
  const linkClasses = combineClasses(
    "text-fuchsia-400 hover:text-fuchsia-300 underline underline-offset-2",
    "transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-zinc-900",
    className
  );
  if (external) {
    return /* @__PURE__ */ jsxs(
      "a",
      {
        href,
        className: linkClasses,
        target: "_blank",
        rel: "noopener noreferrer",
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: " (abre em nova aba)" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx("a", { href, className: linkClasses, ...props, children });
};
export {
  BlogCode,
  BlogExcerpt,
  BlogHighlight,
  BlogLink,
  BlogList,
  BlogListItem,
  BlogMeta,
  BlogQuote,
  BlogReadingContainer,
  BlogSubtitle,
  BlogTitle,
  BlogTypography as default
};
