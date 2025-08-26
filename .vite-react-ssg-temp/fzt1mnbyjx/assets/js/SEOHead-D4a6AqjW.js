import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Helmet } from "@dr.pogodin/react-helmet";
const SEOHead = ({
  title = "Escola Habilidade",
  description = "Desenvolva suas habilidades com cursos de tecnologia, design e negócios. Educação de qualidade para o mercado digital.",
  keywords = "",
  path = "",
  image = null,
  author = "Escola Habilidade",
  type = "website",
  publishedDate = null,
  modifiedDate = null,
  noindex = false,
  canonical = null,
  schemaData = null,
  breadcrumbs = null,
  faqData = null,
  courseData = null,
  localBusinessData = null
}) => {
  const safeTitle = String(title || "Escola Habilidade");
  const safeDescription = String(description || "Desenvolva suas habilidades com cursos de tecnologia, design e negócios. Educação de qualidade para o mercado digital.");
  const safeKeywords = keywords ? String(keywords).trim() : "";
  const safeAuthor = String(author || "Escola Habilidade");
  const baseUrl = "https://www.escolahabilidade.com";
  const fullUrl = `${baseUrl}${path}`;
  const canonicalUrl = canonical || fullUrl;
  const defaultImage = `${baseUrl}/logo-escola-habilidade.png`;
  const ogImage = image || defaultImage;
  const generateSchemaData = () => {
    const schemas = [];
    if (schemaData) {
      schemas.push(schemaData);
    } else {
      const baseSchema = {
        "@context": "https://schema.org",
        "@type": type === "article" ? "Article" : "WebPage",
        name: safeTitle,
        description: safeDescription,
        url: fullUrl,
        image: ogImage,
        author: {
          "@type": "Organization",
          name: "Escola Habilidade",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: defaultImage
          }
        },
        publisher: {
          "@type": "Organization",
          name: "Escola Habilidade",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: defaultImage
          }
        }
      };
      if (type === "article") {
        baseSchema.headline = safeTitle;
        baseSchema.datePublished = publishedDate;
        baseSchema.dateModified = modifiedDate || publishedDate;
        baseSchema.mainEntityOfPage = {
          "@type": "WebPage",
          "@id": fullUrl
        };
      }
      schemas.push(baseSchema);
    }
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.path}`
        }))
      });
    }
    if (faqData && faqData.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      });
    }
    if (courseData) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Course",
        name: courseData.name,
        description: courseData.description,
        provider: {
          "@type": "EducationalOrganization",
          name: "Escola Habilidade"
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: courseData.mode || "https://schema.org/MixedEventAttendanceMode",
          courseWorkload: courseData.workload || "PT40H"
        },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "BRL",
          category: "EducationalOccupationalCredential"
        }
      });
    }
    if (localBusinessData) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: localBusinessData.name || "Escola Habilidade",
        description: localBusinessData.description,
        address: localBusinessData.address,
        telephone: localBusinessData.telephone,
        areaServed: localBusinessData.areaServed,
        openingHours: localBusinessData.openingHours
      });
    }
    return schemas.length === 1 ? schemas[0] : schemas;
  };
  const keywordsMeta = safeKeywords ? /* @__PURE__ */ jsx("meta", { name: "keywords", content: safeKeywords }) : null;
  const robotsMeta = noindex ? /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" }) : null;
  const articleMetas = [];
  if (type === "article" && publishedDate) {
    articleMetas.push(/* @__PURE__ */ jsx("meta", { property: "article:published_time", content: publishedDate }, "published"));
    if (modifiedDate) {
      articleMetas.push(/* @__PURE__ */ jsx("meta", { property: "article:modified_time", content: modifiedDate }, "modified"));
    }
    articleMetas.push(/* @__PURE__ */ jsx("meta", { property: "article:author", content: safeAuthor }, "author"));
    articleMetas.push(/* @__PURE__ */ jsx("meta", { property: "article:section", content: "Blog" }, "section"));
  }
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: safeTitle }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: safeDescription }),
    keywordsMeta,
    /* @__PURE__ */ jsx("meta", { name: "author", content: safeAuthor }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonicalUrl }),
    robotsMeta,
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: safeTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: safeDescription }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: fullUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: ogImage }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: "1200" }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: "630" }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Escola Habilidade" }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "pt_BR" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: safeTitle }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: safeDescription }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: ogImage }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@escolahabilidade" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:creator", content: "@escolahabilidade" }),
    articleMetas,
    /* @__PURE__ */ jsx("meta", { name: "format-detection", content: "telephone=no" }),
    /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#d400ff" }),
    /* @__PURE__ */ jsx("meta", { name: "mobile-web-app-capable", content: "yes" }),
    /* @__PURE__ */ jsx("meta", { name: "apple-mobile-web-app-capable", content: "yes" }),
    /* @__PURE__ */ jsx("meta", { name: "apple-mobile-web-app-status-bar-style", content: "default" }),
    /* @__PURE__ */ jsx("meta", { name: "msapplication-TileColor", content: "#d400ff" }),
    /* @__PURE__ */ jsx("meta", { name: "referrer", content: "strict-origin-when-cross-origin" }),
    /* @__PURE__ */ jsx("meta", { httpEquiv: "content-language", content: "pt-br" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.region", content: "BR-SC" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.placename", content: "Florianópolis, Santa Catarina, Brasil" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.position", content: "-27.5858;-48.6117" }),
    /* @__PURE__ */ jsx("meta", { name: "ICBM", content: "-27.5858, -48.6117" }),
    /* @__PURE__ */ jsx("meta", { name: "revisit-after", content: "7 days" }),
    /* @__PURE__ */ jsx("meta", { name: "rating", content: "general" }),
    /* @__PURE__ */ jsx("meta", { name: "distribution", content: "global" }),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(generateSchemaData()) }
      }
    )
  ] });
};
export {
  SEOHead as S
};
