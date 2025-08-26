import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState } from "react";
import { Share, Check, LinkSimple, FacebookLogo, TwitterLogo, LinkedinLogo, WhatsappLogo } from "@phosphor-icons/react";
const ShareButtons = ({ url, title, compact = false, variant = "default" }) => {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  React.useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setIsWebShareSupported(true);
    }
  }, []);
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
  };
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (error) {
        console.log("Share cancelled or error:", error);
      }
    }
  };
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2e3);
      } catch (fallbackError) {
        console.error("Failed to copy: ", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };
  const handleSocialShare = (platform) => {
    if (isMobile) {
      window.open(shareUrls[platform], "_blank");
      return;
    }
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(
      shareUrls[platform],
      `share-${platform}`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };
  if (compact) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      isWebShareSupported && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleNativeShare,
          className: "p-2 text-zinc-400 hover:text-purple-300 transition-colors",
          "aria-label": "Compartilhar",
          children: /* @__PURE__ */ jsx(Share, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleCopyLink,
          className: "p-2 text-zinc-400 hover:text-purple-300 transition-colors",
          "aria-label": "Copiar link",
          children: copied ? /* @__PURE__ */ jsx(Check, { size: 20, className: "text-green-400" }) : /* @__PURE__ */ jsx(LinkSimple, { size: 20 })
        }
      )
    ] });
  }
  if (variant === "minimal") {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-zinc-400 font-medium", children: "Compartilhar" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialShare("facebook"),
            className: "group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-blue-600/20 border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-200",
            "aria-label": "Compartilhar no Facebook",
            children: /* @__PURE__ */ jsx(
              FacebookLogo,
              {
                size: 18,
                className: "text-zinc-400 group-hover:text-blue-400 transition-colors"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialShare("twitter"),
            className: "group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-sky-600/20 border border-zinc-700/50 hover:border-sky-500/30 transition-all duration-200",
            "aria-label": "Compartilhar no Twitter",
            children: /* @__PURE__ */ jsx(
              TwitterLogo,
              {
                size: 18,
                className: "text-zinc-400 group-hover:text-sky-400 transition-colors"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialShare("linkedin"),
            className: "group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-blue-700/20 border border-zinc-700/50 hover:border-blue-600/30 transition-all duration-200",
            "aria-label": "Compartilhar no LinkedIn",
            children: /* @__PURE__ */ jsx(
              LinkedinLogo,
              {
                size: 18,
                className: "text-zinc-400 group-hover:text-blue-400 transition-colors"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialShare("whatsapp"),
            className: "group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-green-600/20 border border-zinc-700/50 hover:border-green-500/30 transition-all duration-200",
            "aria-label": "Compartilhar no WhatsApp",
            children: /* @__PURE__ */ jsx(
              WhatsappLogo,
              {
                size: 18,
                className: "text-zinc-400 group-hover:text-green-400 transition-colors"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleCopyLink,
            className: `group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${copied ? "bg-green-600/20 border-green-500/30" : "bg-zinc-800/50 hover:bg-zinc-600/20 border-zinc-700/50 hover:border-zinc-500/30"}`,
            "aria-label": "Copiar link",
            children: copied ? /* @__PURE__ */ jsx(Check, { size: 18, className: "text-green-400" }) : /* @__PURE__ */ jsx(
              LinkSimple,
              {
                size: 18,
                className: "text-zinc-400 group-hover:text-zinc-300 transition-colors"
              }
            )
          }
        )
      ] }),
      isWebShareSupported && /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleNativeShare,
          className: "flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-zinc-200 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 text-sm",
          children: [
            /* @__PURE__ */ jsx(Share, { size: 16 }),
            /* @__PURE__ */ jsx("span", { children: "Compartilhar" })
          ]
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    isWebShareSupported && /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleNativeShare,
        className: "flex items-center gap-3 w-full px-4 py-3 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-200 hover:text-zinc-100 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200",
        children: [
          /* @__PURE__ */ jsx(Share, { size: 20 }),
          /* @__PURE__ */ jsx("span", { children: "Compartilhar" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSocialShare("facebook"),
          className: "flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-blue-600/10 text-zinc-200 hover:text-blue-300 rounded-lg border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx(FacebookLogo, { size: 20, className: "text-blue-400" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Facebook" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSocialShare("twitter"),
          className: "flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-sky-600/10 text-zinc-200 hover:text-sky-300 rounded-lg border border-zinc-700/50 hover:border-sky-500/30 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx(TwitterLogo, { size: 20, className: "text-sky-400" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Twitter" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSocialShare("linkedin"),
          className: "flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-blue-600/10 text-zinc-200 hover:text-blue-300 rounded-lg border border-zinc-700/50 hover:border-blue-600/30 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx(LinkedinLogo, { size: 20, className: "text-blue-500" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "LinkedIn" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSocialShare("whatsapp"),
          className: "flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-green-600/10 text-zinc-200 hover:text-green-300 rounded-lg border border-zinc-700/50 hover:border-green-500/30 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx(WhatsappLogo, { size: 20, className: "text-green-400" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "WhatsApp" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleCopyLink,
        className: `flex items-center gap-3 w-full px-4 py-3 rounded-lg border transition-all duration-200 ${copied ? "bg-green-600/20 border-green-500/30 text-green-300" : "bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-200 hover:text-zinc-100 border-zinc-700/50 hover:border-zinc-600/50"}`,
        children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Check, { size: 20 }),
          /* @__PURE__ */ jsx("span", { children: "Link copiado!" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(LinkSimple, { size: 20 }),
          /* @__PURE__ */ jsx("span", { children: "Copiar link" })
        ] })
      }
    )
  ] });
};
export {
  ShareButtons as default
};
