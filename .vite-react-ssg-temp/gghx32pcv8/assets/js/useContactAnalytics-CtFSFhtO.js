import { useCallback } from "react";
const whatsappTemplates = {
  // Generic template for general inquiries
  generic: {
    message: "Vi o site da Escola Habilidade e gostaria de saber mais sobre os cursos disponíveis. Pode me ajudar?",
    includeGreeting: true
  },
  // Templates by context (where the contact originated)
  byContext: {
    "floating-button": {
      message: "Vi seu site e tenho interesse nos cursos da Escola Habilidade. Pode me dar mais informações?",
      includeGreeting: true
    },
    "contact-section": {
      message: 'Li o artigo "{article}" e fiquei interessado(a) em saber mais sobre os cursos relacionados. Vocês podem me ajudar?',
      includeGreeting: true
    },
    "article": {
      message: 'Acabei de ler o artigo "{article}" e gostaria de conversar sobre como posso me aprofundar nessa área através dos cursos de vocês.',
      includeGreeting: true
    },
    "quick-contact": {
      message: "Gostaria de uma consulta rápida sobre os cursos da Escola Habilidade. Podem me atender?",
      includeGreeting: true
    },
    "consultation-widget": {
      message: "Gostaria de agendar a consulta gratuita de 15 minutos para conversar sobre os cursos.",
      includeGreeting: true
    }
  },
  // Templates by article category
  byCategory: {
    "tecnologia": {
      message: 'Li sobre {category} no artigo "{article}" e quero saber mais sobre os cursos de tecnologia de vocês. Quais são as opções disponíveis?',
      includeGreeting: true
    },
    "educacao": {
      message: 'O artigo "{article}" me interessou muito! Gostaria de saber como posso me capacitar melhor na área educacional com os cursos de vocês.',
      includeGreeting: true
    },
    "carreira": {
      message: 'Depois de ler "{article}", percebi que preciso me qualificar melhor. Quais cursos vocês recomendam para desenvolvimento de carreira?',
      includeGreeting: true
    },
    "design": {
      message: 'Vi o artigo sobre {category} "{article}" e fiquei muito interessado(a) nos cursos de design! Podem me dar mais detalhes?',
      includeGreeting: true
    },
    "programacao": {
      message: 'O artigo "{article}" me motivou a aprender programação! Quais são os cursos disponíveis nessa área?',
      includeGreeting: true
    },
    "marketing": {
      message: 'Li sobre {category} no artigo "{article}" e quero me especializar em marketing digital. Que cursos vocês oferecem?',
      includeGreeting: true
    },
    "inteligencia-artificial": {
      message: 'Após ler "{article}", fiquei fascinado(a) com IA! Vocês têm cursos nessa área? Como posso começar?',
      includeGreeting: true
    },
    "business-intelligence": {
      message: 'O artigo "{article}" sobre BI me interessou muito. Gostaria de saber sobre os cursos de análise de dados de vocês.',
      includeGreeting: true
    }
  }
};
const generateWhatsAppMessage = ({
  article = null,
  category = null,
  url = "",
  context = "generic",
  isMobile = false
}) => {
  const device = isMobile ? "mobile" : "desktop";
  let template;
  if (article && category) {
    template = whatsappTemplates.byCategory[category.toLowerCase()] || whatsappTemplates.byContext[context] || whatsappTemplates.generic;
  } else if (article) {
    template = whatsappTemplates.byContext.article || whatsappTemplates.generic;
  } else {
    template = whatsappTemplates.byContext[context] || whatsappTemplates.generic;
  }
  const trackedUrl = addUTMParameters(url, {
    source: "whatsapp",
    medium: "direct-message",
    campaign: "blog-contact",
    content: context,
    term: category || "general"
  });
  let message = template.message.replace("{article}", article || "").replace("{category}", category || "").replace("{url}", trackedUrl).replace("{device}", device);
  const greeting = getTimeBasedGreeting();
  if (template.includeGreeting !== false) {
    message = `${greeting} ${message}`;
  }
  const businessHoursNote = getBusinessHoursNote();
  if (businessHoursNote) {
    message += `

${businessHoursNote}`;
  }
  return message.trim();
};
const getTimeBasedGreeting = () => {
  const hour = (/* @__PURE__ */ new Date()).getHours();
  if (hour >= 5 && hour < 12) {
    return "Bom dia!";
  } else if (hour >= 12 && hour < 18) {
    return "Boa tarde!";
  } else {
    return "Boa noite!";
  }
};
const getBusinessHoursNote = () => {
  const now = /* @__PURE__ */ new Date();
  const hour = now.getHours();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const isBusinessHours = hour >= 8 && hour < 18;
  if (isWeekend) {
    return "=� Hoje � fim de semana, mas respondo assim que poss�vel! Durante a semana atendo das 8h �s 18h.";
  } else if (!isBusinessHours) {
    if (hour < 8) {
      return "� Ainda � cedo, mas j� estou aqui! Hor�rio de atendimento: 8h �s 18h, segunda a sexta.";
    } else {
      return "< J� passou do hor�rio comercial, mas vou responder o mais breve poss�vel! Hor�rio normal: 8h �s 18h, segunda a sexta.";
    }
  }
  return null;
};
const addUTMParameters = (url, utmParams) => {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(`utm_${key}`, value);
      }
    });
    return urlObj.toString();
  } catch (error) {
    console.warn("Error adding UTM parameters:", error);
    return url;
  }
};
const useContactAnalytics = () => {
  const trackContactClick = useCallback((data) => {
    const {
      channel,
      // whatsapp, email, phone
      source,
      // floating-button, contact-section, quick-modal
      article = "unknown",
      category = "unknown",
      position = "unknown",
      message = ""
    } = data;
    if (typeof gtag !== "undefined") {
      gtag("event", "contact_click", {
        event_category: "Contact",
        event_label: `${channel}_${source}`,
        custom_parameter_1: article,
        custom_parameter_2: category,
        custom_parameter_3: position,
        value: 1
      });
    }
    const trackingData = {
      event: "contact_click",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      channel,
      source,
      article,
      category,
      position,
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      sessionId: getSessionId(),
      message: message.substring(0, 100)
      // First 100 chars for privacy
    };
    sendAnalytics(trackingData);
    storeContactInteraction(trackingData);
    console.log("Contact interaction tracked:", trackingData);
  }, []);
  const trackFormSubmission = useCallback((data) => {
    const {
      formType,
      // contact-form, quick-contact, consultation
      source,
      article = "unknown",
      success = false
    } = data;
    if (typeof gtag !== "undefined") {
      gtag("event", "form_submit", {
        event_category: "Form",
        event_label: formType,
        custom_parameter_1: source,
        custom_parameter_2: article,
        value: success ? 1 : 0
      });
    }
    const trackingData = {
      event: "form_submission",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      formType,
      source,
      article,
      success,
      url: window.location.href,
      sessionId: getSessionId()
    };
    sendAnalytics(trackingData);
    storeContactInteraction(trackingData);
  }, []);
  const trackEngagement = useCallback((data) => {
    const {
      article,
      timeOnPage,
      scrollDepth,
      interactions = []
    } = data;
    const engagementScore = calculateEngagementScore(timeOnPage, scrollDepth, interactions);
    const trackingData = {
      event: "page_engagement",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      article,
      timeOnPage,
      scrollDepth,
      interactions: interactions.length,
      engagementScore,
      url: window.location.href,
      sessionId: getSessionId()
    };
    sendAnalytics(trackingData);
    localStorage.setItem("lastEngagement", JSON.stringify(trackingData));
  }, []);
  const getConversionMetrics = useCallback(() => {
    try {
      const interactions = JSON.parse(localStorage.getItem("contactInteractions") || "[]");
      const last30Days = interactions.filter(
        (interaction) => Date.now() - new Date(interaction.timestamp).getTime() < 30 * 24 * 60 * 60 * 1e3
      );
      const metrics = {
        totalInteractions: last30Days.length,
        whatsappClicks: last30Days.filter((i) => i.channel === "whatsapp").length,
        emailClicks: last30Days.filter((i) => i.channel === "email").length,
        phoneClicks: last30Days.filter((i) => i.channel === "phone").length,
        topSources: getTopSources(last30Days),
        topArticles: getTopArticles(last30Days),
        conversionByHour: getConversionByHour(last30Days)
      };
      return metrics;
    } catch (error) {
      console.error("Error getting conversion metrics:", error);
      return null;
    }
  }, []);
  return {
    trackContactClick,
    trackFormSubmission,
    trackEngagement,
    getConversionMetrics
  };
};
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("contactSessionId");
  if (!sessionId) {
    sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("contactSessionId", sessionId);
  }
  return sessionId;
};
const sendAnalytics = async (data) => {
  try {
    console.log("Analytics data:", data);
  } catch (error) {
    console.error("Error sending analytics:", error);
  }
};
const storeContactInteraction = (data) => {
  try {
    const interactions = JSON.parse(localStorage.getItem("contactInteractions") || "[]");
    interactions.push(data);
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100);
    }
    localStorage.setItem("contactInteractions", JSON.stringify(interactions));
  } catch (error) {
    console.error("Error storing interaction:", error);
  }
};
const calculateEngagementScore = (timeOnPage, scrollDepth, interactions) => {
  let score = 0;
  score += Math.min(timeOnPage / 60 * 10, 30);
  score += scrollDepth * 30;
  score += Math.min(interactions.length * 10, 40);
  return Math.round(score);
};
const getTopSources = (interactions) => {
  const sources = {};
  interactions.forEach((interaction) => {
    const source = interaction.source || "unknown";
    sources[source] = (sources[source] || 0) + 1;
  });
  return Object.entries(sources).sort(([, a], [, b]) => b - a).slice(0, 5).map(([source, count]) => ({ source, count }));
};
const getTopArticles = (interactions) => {
  const articles = {};
  interactions.forEach((interaction) => {
    const article = interaction.article || "unknown";
    if (article !== "unknown") {
      articles[article] = (articles[article] || 0) + 1;
    }
  });
  return Object.entries(articles).sort(([, a], [, b]) => b - a).slice(0, 5).map(([article, count]) => ({ article, count }));
};
const getConversionByHour = (interactions) => {
  const hourly = {};
  interactions.forEach((interaction) => {
    const hour = new Date(interaction.timestamp).getHours();
    hourly[hour] = (hourly[hour] || 0) + 1;
  });
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourly[hour] || 0
  }));
};
export {
  generateWhatsAppMessage as g,
  useContactAnalytics as u
};
