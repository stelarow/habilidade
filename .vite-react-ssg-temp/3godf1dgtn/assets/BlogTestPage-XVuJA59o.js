import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { C as usePost } from "./utils-DYyrIPL_.js";
import "prop-types";
import "@phosphor-icons/react";
import "@tanstack/react-query";
import "./blog-xsr1A1aF.js";
import "@supabase/supabase-js";
import "marked";
import "highlight.js/lib/core";
import "highlight.js/lib/languages/javascript";
import "highlight.js/lib/languages/python";
import "highlight.js/lib/languages/sql";
import "highlight.js/lib/languages/css";
import "highlight.js/lib/languages/xml";
import "node-html-parser";
const BlogTestPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState({
    slug: null,
    params: null,
    location: null,
    blogData: null,
    errors: [],
    logs: []
  });
  const addLog = (message, type = "info") => {
    console.log(`[BlogTest ${type.toUpperCase()}]`, message);
    setDebugInfo((prev) => ({
      ...prev,
      logs: [...prev.logs, {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        message,
        type
      }]
    }));
  };
  useEffect(() => {
    addLog("Component mounted");
    setDebugInfo((prev) => ({
      ...prev,
      slug,
      params: { slug },
      location: window.location.href
    }));
    addLog(`Slug from useParams: ${slug}`);
    addLog(`Current location: ${window.location.href}`);
    try {
      addLog("Testing blog API access...");
    } catch (error2) {
      addLog(`Error testing blog API: ${error2.message}`, "error");
      setDebugInfo((prev) => ({
        ...prev,
        errors: [...prev.errors, error2.message]
      }));
    }
  }, [slug]);
  const { data, isLoading, isError, error } = slug ? usePost(slug) : { data: null, isLoading: false, isError: false, error: null };
  useEffect(() => {
    if (slug) {
      addLog(`Blog API hook status - Loading: ${isLoading}, Error: ${isError}`);
      if (data) {
        addLog(`Post data received: ${JSON.stringify(data, null, 2)}`);
        setDebugInfo((prev) => ({
          ...prev,
          blogData: data
        }));
      }
      if (error) {
        addLog(`Blog API error: ${error.message}`, "error");
        setDebugInfo((prev) => ({
          ...prev,
          errors: [...prev.errors, error.message]
        }));
      }
    }
  }, [data, isLoading, isError, error, slug]);
  const testNavigation = () => {
    addLog("Testing navigation to blog post...");
    navigate("/blog/como-comecar-programacao-2024");
  };
  const testBlogIndex = () => {
    addLog("Testing navigation to blog index...");
    navigate("/blog");
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-center", children: "Blog Test & Debug Page" }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-800/50 p-6 rounded-lg", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4 text-blue-400", children: "Current State" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Slug:" }),
            " ",
            debugInfo.slug || "None"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Location:" }),
            " ",
            debugInfo.location
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Loading:" }),
            " ",
            isLoading ? "Yes" : "No"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Error:" }),
            " ",
            isError ? "Yes" : "No"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Has Data:" }),
            " ",
            data ? "Yes" : "No"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-800/50 p-6 rounded-lg", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4 text-green-400", children: "Navigation Tests" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: testBlogIndex,
              className: "w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors",
              children: "Test Blog Index"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: testNavigation,
              className: "w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors",
              children: "Test Blog Post Navigation"
            }
          )
        ] })
      ] })
    ] }),
    debugInfo.blogData && /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-zinc-800/50 p-6 rounded-lg", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4 text-green-400", children: "Blog Data" }),
      /* @__PURE__ */ jsx("pre", { className: "bg-zinc-900 p-4 rounded text-xs overflow-auto max-h-64", children: JSON.stringify(debugInfo.blogData, null, 2) })
    ] }),
    debugInfo.errors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-red-900/30 p-6 rounded-lg border border-red-500", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4 text-red-400", children: "Errors" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: debugInfo.errors.map((error2, index) => /* @__PURE__ */ jsx("li", { className: "text-red-300 text-sm", children: error2 }, index)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-zinc-800/50 p-6 rounded-lg", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4 text-yellow-400", children: "Debug Logs" }),
      /* @__PURE__ */ jsx("div", { className: "bg-zinc-900 p-4 rounded max-h-64 overflow-auto", children: debugInfo.logs.map((log, index) => /* @__PURE__ */ jsxs("div", { className: `text-xs mb-1 ${log.type === "error" ? "text-red-400" : log.type === "warn" ? "text-yellow-400" : "text-gray-300"}`, children: [
        /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
          "[",
          new Date(log.timestamp).toLocaleTimeString(),
          "]"
        ] }),
        " ",
        log.message
      ] }, index)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-4", children: "Open browser console (F12) for additional debugging information" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded transition-colors",
          children: "Reload Page"
        }
      )
    ] })
  ] }) });
};
function loader() {
  return null;
}
export {
  BlogTestPage as Component,
  BlogTestPage as default,
  loader
};
