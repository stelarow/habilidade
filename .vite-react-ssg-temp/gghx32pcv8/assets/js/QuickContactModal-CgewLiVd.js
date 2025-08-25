import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X, WhatsappLogo, Phone, Calendar, Envelope, Clock, User, CheckCircle } from "@phosphor-icons/react";
import { u as useContactAnalytics, g as generateWhatsAppMessage } from "./useContactAnalytics-CtFSFhtO.js";
import { E as EMAIL_CONFIG } from "../../main.mjs";
import emailjs from "@emailjs/browser";
import "vite-react-ssg";
import "react-router-dom";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "prop-types";
import "@supabase/supabase-js";
const BUSINESS_HOURS = {
  // Monday = 1, Sunday = 0
  weekdays: [1, 2, 3, 4, 5],
  // Monday to Friday
  startHour: 8,
  // 8 AM
  endHour: 18,
  // 6 PM
  timezone: "America/Sao_Paulo"
  // Brazil timezone
};
const getBusinessHoursStatus = () => {
  try {
    const now = /* @__PURE__ */ new Date();
    const brTime = new Date(now.toLocaleString("en-US", { timeZone: BUSINESS_HOURS.timezone }));
    const currentDay = brTime.getDay();
    const currentHour = brTime.getHours();
    const currentMinute = brTime.getMinutes();
    const currentTime = currentHour + currentMinute / 60;
    const isWeekday = BUSINESS_HOURS.weekdays.includes(currentDay);
    const isBusinessHours = currentTime >= BUSINESS_HOURS.startHour && currentTime < BUSINESS_HOURS.endHour;
    const isOpen = isWeekday && isBusinessHours;
    let message = "";
    let nextOpenTime = "";
    let estimatedResponseTime = "";
    if (isOpen) {
      const closingTime = BUSINESS_HOURS.endHour;
      const hoursUntilClose = closingTime - currentTime;
      if (hoursUntilClose <= 1) {
        message = `=� Online agora (fecha em ${Math.round(hoursUntilClose * 60)} minutos)`;
      } else {
        message = `=� Online agora - Resposta imediata`;
      }
      estimatedResponseTime = "Imediata";
    } else {
      if (!isWeekday) {
        const nextMonday = getNextWeekday(brTime, 1);
        message = `� Fechado (fim de semana) - Reabrimos na segunda �s 8h`;
        nextOpenTime = nextMonday.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        });
        estimatedResponseTime = "At� 2 horas �teis";
      } else if (currentTime < BUSINESS_HOURS.startHour) {
        const hoursUntilOpen = BUSINESS_HOURS.startHour - currentTime;
        message = `� Abrimos �s 8h (em ${Math.round(hoursUntilOpen * 60)} minutos)`;
        estimatedResponseTime = "At� 1 hora";
      } else {
        const tomorrow = new Date(brTime);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (BUSINESS_HOURS.weekdays.includes(tomorrow.getDay())) {
          message = `� Fechado - Reabrimos amanh� �s 8h`;
          estimatedResponseTime = "At� 2 horas �teis";
        } else {
          const nextWeekday = getNextWeekday(brTime, 1);
          message = `� Fechado - Reabrimos na segunda �s 8h`;
          nextOpenTime = nextWeekday.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "short"
          });
          estimatedResponseTime = "At� 2 horas �teis";
        }
      }
    }
    return {
      isOpen,
      isWeekday,
      isBusinessHours,
      message,
      nextOpenTime,
      estimatedResponseTime,
      currentTime: brTime.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      currentDay: brTime.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
      })
    };
  } catch (error) {
    console.error("Error getting business hours status:", error);
    return {
      isOpen: false,
      message: "Hor�rio de atendimento: Segunda a sexta, 8h �s 18h",
      estimatedResponseTime: "At� 24 horas"
    };
  }
};
const getNextWeekday = (date, targetDay) => {
  const result = new Date(date);
  const currentDay = result.getDay();
  const daysUntilTarget = (targetDay + 7 - currentDay) % 7 || 7;
  result.setDate(result.getDate() + daysUntilTarget);
  result.setHours(BUSINESS_HOURS.startHour, 0, 0, 0);
  return result;
};
const QuickContactModal = ({
  isOpen,
  onClose,
  article = null,
  category = null,
  triggerSource = "unknown"
}) => {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredTime: "",
    interest: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessStatus, setBusinessStatus] = useState(null);
  const { trackContactClick, trackFormSubmission } = useContactAnalytics();
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedMethod(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredTime: "",
        interest: "",
        message: ""
      });
      setBusinessStatus(getBusinessHoursStatus());
    }
  }, [isOpen]);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method === "whatsapp-direct") {
      handleDirectWhatsApp();
    } else if (method === "phone-direct") {
      handleDirectPhone();
    } else {
      setStep(2);
    }
  };
  const handleDirectWhatsApp = () => {
    const message = generateWhatsAppMessage({
      article: (article == null ? void 0 : article.title) || null,
      category: (category == null ? void 0 : category.name) || category || null,
      url: window.location.href,
      context: "quick-contact"
    });
    const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    trackContactClick({
      channel: "whatsapp",
      source: "quick-modal-direct",
      article: (article == null ? void 0 : article.slug) || "unknown",
      category: (category == null ? void 0 : category.slug) || category || "unknown",
      position: triggerSource,
      message
    });
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  };
  const handleDirectPhone = () => {
    const phoneNumber = "tel:+5548988559491";
    trackContactClick({
      channel: "phone",
      source: "quick-modal-direct",
      article: (article == null ? void 0 : article.slug) || "unknown",
      category: (category == null ? void 0 : category.slug) || category || "unknown",
      position: triggerSource
    });
    window.location.href = phoneNumber;
    onClose();
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let success = false;
      if (selectedMethod === "email" || selectedMethod === "consultation") {
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          preferred_time: formData.preferredTime,
          interest: formData.interest,
          message: formData.message,
          article: (article == null ? void 0 : article.title) || "N�o especificado",
          category: (category == null ? void 0 : category.name) || category || "N�o especificado",
          form_type: selectedMethod === "consultation" ? "Agendamento de Consulta" : "Contato por Email",
          to_email: EMAIL_CONFIG.CONTACT_EMAIL,
          reply_to: formData.email
        };
        const result = await emailjs.send(
          EMAIL_CONFIG.SERVICE_ID,
          EMAIL_CONFIG.TEMPLATE_ID,
          templateParams,
          EMAIL_CONFIG.PUBLIC_KEY
        );
        success = result.status === 200;
      } else if (selectedMethod === "whatsapp") {
        const message = `${generateWhatsAppMessage({
          article: (article == null ? void 0 : article.title) || null,
          category: (category == null ? void 0 : category.name) || category || null,
          url: window.location.href,
          context: "quick-contact"
        })}

*Dados do formul�rio:*
Nome: ${formData.name}
Email: ${formData.email}
Telefone: ${formData.phone}
${formData.preferredTime ? `Hor�rio preferido: ${formData.preferredTime}` : ""}
${formData.interest ? `Interesse espec�fico: ${formData.interest}` : ""}
${formData.message ? `Mensagem: ${formData.message}` : ""}`;
        const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        trackContactClick({
          channel: "whatsapp",
          source: "quick-modal-form",
          article: (article == null ? void 0 : article.slug) || "unknown",
          category: (category == null ? void 0 : category.slug) || category || "unknown",
          position: triggerSource,
          message
        });
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        success = true;
      }
      trackFormSubmission({
        formType: "quick-contact",
        source: triggerSource,
        article: (article == null ? void 0 : article.slug) || "unknown",
        success
      });
      if (success) {
        setStep(3);
        setTimeout(() => {
          onClose();
        }, 3e3);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      trackFormSubmission({
        formType: "quick-contact",
        source: triggerSource,
        article: (article == null ? void 0 : article.slug) || "unknown",
        success: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors",
        "aria-label": "Fechar modal",
        children: /* @__PURE__ */ jsx(X, { size: 20 })
      }
    ),
    step === 1 && /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Como prefere entrar em contato?" }),
        article && /* @__PURE__ */ jsxs("p", { className: "text-zinc-300 text-sm", children: [
          "Sobre: ",
          /* @__PURE__ */ jsx("span", { className: "text-purple-300", children: article.title })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleMethodSelect("whatsapp-direct"),
            className: "w-full p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded-xl transition-all text-left group",
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(WhatsappLogo, { size: 20, weight: "bold", className: "text-white" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white", children: "WhatsApp Direto" }),
                /* @__PURE__ */ jsx("p", { className: "text-green-300 text-sm", children: "Conversa imediata" })
              ] }),
              (businessStatus == null ? void 0 : businessStatus.isOpen) && /* @__PURE__ */ jsx("span", { className: "text-xs bg-green-500 text-white px-2 py-1 rounded-full", children: "Online" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleMethodSelect("phone-direct"),
            className: "w-full p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all text-left group",
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Phone, { size: 20, weight: "bold", className: "text-white" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white", children: "Ligar Agora" }),
                /* @__PURE__ */ jsx("p", { className: "text-blue-300 text-sm", children: "(48) 9 8855-9491" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-zinc-700 pt-3 mt-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400 text-sm text-center mb-3", children: "Ou preencha um formul�rio r�pido:" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleMethodSelect("consultation"),
                className: "p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-lg transition-all text-center group",
                children: [
                  /* @__PURE__ */ jsx(Calendar, { size: 20, className: "text-purple-400 mx-auto mb-1 group-hover:scale-110 transition-transform" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-white font-medium", children: "Agendar" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-purple-300", children: "Consulta" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleMethodSelect("email"),
                className: "p-3 bg-zinc-500/10 hover:bg-zinc-500/20 border border-zinc-500/20 hover:border-zinc-500/40 rounded-lg transition-all text-center group",
                children: [
                  /* @__PURE__ */ jsx(Envelope, { size: 20, className: "text-zinc-400 mx-auto mb-1 group-hover:scale-110 transition-transform" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-white font-medium", children: "Email" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-zinc-300", children: "Detalhado" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      businessStatus && /* @__PURE__ */ jsx("div", { className: "mt-4 p-3 bg-zinc-800/50 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx(Clock, { size: 16, className: businessStatus.isOpen ? "text-green-400" : "text-yellow-400" }),
        /* @__PURE__ */ jsx("span", { className: businessStatus.isOpen ? "text-green-300" : "text-yellow-300", children: businessStatus.message })
      ] }) })
    ] }),
    step === 2 && /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: selectedMethod === "consultation" ? "Agendar Consulta" : "Formul�rio de Contato" }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-sm", children: "Preencha os dados para um atendimento personalizado" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleFormSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "name", className: "block text-sm font-medium text-zinc-300 mb-1", children: [
            /* @__PURE__ */ jsx(User, { size: 16, className: "inline mr-1" }),
            "Nome *"
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "name",
              name: "name",
              value: formData.name,
              onChange: handleInputChange,
              required: true,
              className: "w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm",
              placeholder: "Seu nome completo"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "email", className: "block text-sm font-medium text-zinc-300 mb-1", children: [
            /* @__PURE__ */ jsx(Envelope, { size: 16, className: "inline mr-1" }),
            "Email *"
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              id: "email",
              name: "email",
              value: formData.email,
              onChange: handleInputChange,
              required: true,
              className: "w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm",
              placeholder: "seu@email.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "phone", className: "block text-sm font-medium text-zinc-300 mb-1", children: [
            /* @__PURE__ */ jsx(Phone, { size: 16, className: "inline mr-1" }),
            "WhatsApp"
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "tel",
              id: "phone",
              name: "phone",
              value: formData.phone,
              onChange: handleInputChange,
              className: "w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm",
              placeholder: "(48) 9 9999-9999"
            }
          )
        ] }),
        selectedMethod === "consultation" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "preferredTime", className: "block text-sm font-medium text-zinc-300 mb-1", children: [
            /* @__PURE__ */ jsx(Clock, { size: 16, className: "inline mr-1" }),
            "Hor�rio preferido"
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "preferredTime",
              name: "preferredTime",
              value: formData.preferredTime,
              onChange: handleInputChange,
              className: "w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecione um hor�rio" }),
                /* @__PURE__ */ jsx("option", { value: "Manh� (8h-12h)", children: "Manh� (8h-12h)" }),
                /* @__PURE__ */ jsx("option", { value: "Tarde (12h-18h)", children: "Tarde (12h-18h)" }),
                /* @__PURE__ */ jsx("option", { value: "Flex�vel", children: "Flex�vel" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "interest", className: "block text-sm font-medium text-zinc-300 mb-1", children: "Interesse espec�fico" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "interest",
              name: "interest",
              value: formData.interest,
              onChange: handleInputChange,
              className: "w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm",
              placeholder: "Ex: Design Gr�fico, Programa��o..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-zinc-300 mb-1", children: "Mensagem (opcional)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "message",
              name: "message",
              value: formData.message,
              onChange: handleInputChange,
              rows: 3,
              className: "w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none",
              placeholder: "Conte-nos mais sobre seu interesse..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setStep(1),
              className: "flex-1 py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-sm",
              children: "Voltar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: isSubmitting || !formData.name || !formData.email,
              className: "flex-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium",
              children: isSubmitting ? "Enviando..." : selectedMethod === "consultation" ? "Agendar" : selectedMethod === "whatsapp" ? "Abrir WhatsApp" : "Enviar Email"
            }
          )
        ] })
      ] })
    ] }),
    step === 3 && /* @__PURE__ */ jsxs("div", { className: "p-6 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx(CheckCircle, { size: 48, className: "text-green-400 mx-auto mb-3" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Sucesso!" }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-300", children: selectedMethod === "consultation" ? "Sua solicita��o de consulta foi enviada. Entraremos em contato em breve para confirmar o hor�rio." : selectedMethod === "whatsapp" ? "Voc� ser� redirecionado para o WhatsApp com sua mensagem preparada." : "Sua mensagem foi enviada! Responderemos em at� 24 horas." })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors",
          children: "Fechar"
        }
      )
    ] })
  ] }) });
};
export {
  QuickContactModal as default
};
