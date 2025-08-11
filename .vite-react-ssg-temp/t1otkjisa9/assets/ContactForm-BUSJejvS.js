import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { User, Envelope, Phone, BookOpen, CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import emailjs from "@emailjs/browser";
import { G as GradientButton, L as Loading } from "../main.mjs";
import { A as isEmailConfigured, E as EMAIL_CONFIG } from "./utils-CtCVPYGt.js";
const ContactForm = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const courses = [
    "Projetista",
    "Edição de Vídeo",
    "Informática",
    "Design Gráfico",
    "Programação",
    "Marketing Digital",
    "Inteligência Artificial",
    "Business Intelligence"
  ];
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const sendEmail = async () => {
    try {
      if (!isEmailConfigured()) {
        console.warn("EmailJS não configurado, usando WhatsApp como fallback");
        return { success: false, error: "EmailJS não configurado" };
      }
      console.log("Tentando enviar email com EmailJS...");
      console.log("Service ID:", EMAIL_CONFIG.SERVICE_ID);
      console.log("Template ID:", EMAIL_CONFIG.TEMPLATE_ID);
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        course: formData.course || "Não especificado",
        message: formData.message || "Nenhuma mensagem adicional",
        to_email: EMAIL_CONFIG.CONTACT_EMAIL,
        reply_to: formData.email
      };
      console.log("Parâmetros do template:", templateParams);
      const result = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );
      console.log("Email enviado com sucesso!", result);
      return { success: true };
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      return { success: false, error };
    }
  };
  const sendWhatsApp = () => {
    const message = `*Nova solicitação de contato*%0A%0A*Nome:* ${formData.name}%0A*Email:* ${formData.email}%0A*Telefone:* ${formData.phone}%0A*Curso de interesse:* ${formData.course || "Não especificado"}%0A*Mensagem:* ${formData.message || "Nenhuma mensagem adicional"}`;
    window.open(`https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    console.log("Formulário submetido, dados:", formData);
    try {
      const emailResult = await sendEmail();
      if (emailResult.success) {
        console.log("Email enviado com sucesso!");
        setSubmitStatus("email_success");
        setFormData({ name: "", email: "", phone: "", course: "", message: "" });
      } else {
        console.log("Falha no email, redirecionando para WhatsApp...");
        setSubmitStatus("whatsapp_fallback");
        setTimeout(() => {
          sendWhatsApp();
        }, 1500);
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      setSubmitStatus("whatsapp_fallback");
      setTimeout(() => {
        sendWhatsApp();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "contato", className: "py-16 bg-zinc-900", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-5xl font-bold text-white mb-6", children: "Entre em Contato" }),
      /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-lg max-w-2xl mx-auto", children: "Interessado em algum curso? Preencha o formulário e entraremos em contato!" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50", children: [
      /* @__PURE__ */ jsxs("form", { ref: form, onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: "name", className: "block text-sm font-medium text-zinc-300", children: [
              /* @__PURE__ */ jsx(User, { size: 16, className: "inline mr-2" }),
              "Nome completo *"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                id: "name",
                name: "name",
                value: formData.name,
                onChange: handleChange,
                required: true,
                className: "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all",
                placeholder: "Seu nome completo"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: "email", className: "block text-sm font-medium text-zinc-300", children: [
              /* @__PURE__ */ jsx(Envelope, { size: 16, className: "inline mr-2" }),
              "Email *"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                id: "email",
                name: "email",
                value: formData.email,
                onChange: handleChange,
                required: true,
                className: "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all",
                placeholder: "seu@email.com"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: "phone", className: "block text-sm font-medium text-zinc-300", children: [
              /* @__PURE__ */ jsx(Phone, { size: 16, className: "inline mr-2" }),
              "Telefone *"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                id: "phone",
                name: "phone",
                value: formData.phone,
                onChange: handleChange,
                required: true,
                className: "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all",
                placeholder: "(48) 9 9999-9999"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: "course", className: "block text-sm font-medium text-zinc-300", children: [
              /* @__PURE__ */ jsx(BookOpen, { size: 16, className: "inline mr-2" }),
              "Curso de interesse"
            ] }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "course",
                name: "course",
                value: formData.course,
                onChange: handleChange,
                className: "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Selecione um curso" }),
                  courses.map((course) => /* @__PURE__ */ jsx("option", { value: course, children: course }, course))
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-zinc-300", children: "Mensagem (opcional)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "message",
              name: "message",
              value: formData.message,
              onChange: handleChange,
              rows: 4,
              className: "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all resize-none",
              placeholder: "Deixe uma mensagem (opcional)"
            }
          )
        ] }),
        submitStatus === "email_success" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg", children: [
          /* @__PURE__ */ jsx(CheckCircle, { size: 24, className: "text-green-400 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-green-300 font-medium", children: "Email enviado com sucesso!" }),
            /* @__PURE__ */ jsx("p", { className: "text-green-400 text-sm", children: "Entraremos em contato em breve." })
          ] })
        ] }),
        submitStatus === "whatsapp_fallback" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg", children: [
          /* @__PURE__ */ jsx(CheckCircle, { size: 24, className: "text-blue-400 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-blue-300 font-medium", children: "Redirecionando para WhatsApp..." }),
            /* @__PURE__ */ jsx("p", { className: "text-blue-400 text-sm", children: "Você será direcionado para continuar pelo WhatsApp." })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          GradientButton,
          {
            type: "submit",
            disabled: isSubmitting,
            className: "w-full flex items-center justify-center gap-3 py-4 disabled:opacity-50 disabled:cursor-not-allowed",
            children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loading, { size: "sm" }),
              "Enviando..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(PaperPlaneTilt, { size: 20 }),
              "Enviar Mensagem"
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: "Seus dados são tratados com total confidencialidade conforme nossa política de privacidade." }) })
    ] })
  ] }) });
};
export {
  ContactForm as C
};
