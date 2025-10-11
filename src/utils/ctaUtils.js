/**
 * Utilitários para CTAs do curso Informática Nova
 */

// Número de WhatsApp da escola
const WHATSAPP_NUMBER = '5548988559491';

// Mensagens personalizadas por CTA
const CTA_MESSAGES = {
  hero: 'Olá! Tenho interesse em dominar informática e gostaria de saber mais sobre o Curso de Informática Completa. Podem me informar sobre conteúdo, horários e formas de pagamento? Obrigado!',
  investment: 'Olá! Estou interessado em garantir minha vaga no Curso de Informática Completa. Gostaria de saber mais sobre as condições de pagamento e próximas turmas. Obrigado!',
  guarantee: 'Olá! Fiquei interessado em começar sem riscos no Curso de Informática Completa através da garantia de 7 dias. Gostaria de mais informações sobre o curso. Obrigado!',
  transformation: 'Olá! Tenho interesse na transformação profissional através do Curso de Informática Completa. Gostaria de saber como posso começar minha transformação digital. Obrigado!',
  curriculum: 'Olá! Fiquei interessado no currículo completo com 8 módulos do Curso de Informática Completa. Gostaria de saber mais sobre a metodologia e como funciona o curso. Obrigado!',
  faq: 'Olá! Ainda tenho algumas dúvidas sobre o Curso de Informática Completa. Gostaria de falar com um especialista para esclarecer algumas questões. Obrigado!',
  portfolio: 'Olá! Fiquei interessado nos projetos do portfólio e gostaria de criar meus próprios projetos com o Curso de Informática Completa. Gostaria de saber mais sobre como funciona na prática. Obrigado!',
  testimonials: 'Olá! Vi os depoimentos dos alunos e fiquei muito interessado no Curso de Informática Completa. Gostaria de conversar com um especialista para saber mais sobre a experiência dos alunos e como posso começar minha transformação. Obrigado!',
  floating: 'Olá! Tenho interesse no Curso de Informática Completa. Gostaria de saber mais informações sobre conteúdo, horários e formas de pagamento. Obrigado!'
};

/**
 * Gera URL do WhatsApp com mensagem personalizada
 * @param {string} ctaType - Tipo do CTA (hero, investment, guarantee, etc.)
 * @param {string} customMessage - Mensagem customizada opcional
 * @returns {string} URL do WhatsApp
 */
export const generateWhatsAppURL = (ctaType, customMessage = null) => {
  const message = customMessage || CTA_MESSAGES[ctaType] || CTA_MESSAGES.floating;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

/**
 * Função para tracking de eventos (Google Analytics)
 * @param {string} ctaType - Tipo do CTA
 * @param {string} action - Ação (click)
 * @param {string} section - Seção da página
 */
export const trackCTAClick = (ctaType, action = 'click', section = 'informatica-nova') => {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: 'CTA',
      event_label: `${section}-${ctaType}`,
      custom_parameter: ctaType
    });
  }
  
  // Console log para debug (remover em produção)
  console.log(`CTA Clicked: ${ctaType} in ${section}`);
};

/**
 * Função para tracking de conversão do Google Ads
 * @param {string} url - URL para redirecionar após a conversão
 */
export const trackGoogleAdsConversion = (url) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'conversion', {
      'send_to': 'AW-16951445133/VUrgCKqOmaobEI2NipM_',
      'event_callback': function() {
        if (typeof(url) !== 'undefined') {
          window.open(url, '_blank');
        }
      }
    });
    return false;
  } else {
    // Fallback se gtag não estiver disponível
    if (typeof(url) !== 'undefined') {
      window.open(url, '_blank');
    }
    return false;
  }
};

/**
 * Handler principal para CTAs
 * @param {string} ctaType - Tipo do CTA
 * @param {string} customMessage - Mensagem customizada opcional
 */
export const handleCTAClick = (ctaType, customMessage = null) => {
  // Track do evento
  trackCTAClick(ctaType);
  
  // Gera URL do WhatsApp
  const whatsappUrl = generateWhatsAppURL(ctaType, customMessage);
  
  // Track de conversão do Google Ads e abre WhatsApp
  trackGoogleAdsConversion(whatsappUrl);
};

/**
 * Estilos padronizados para CTAs (classes Tailwind)
 */
export const CTA_STYLES = {
  primary: "group relative overflow-hidden rounded-xl px-8 py-4 text-lg md:text-xl font-bold text-white transition-all duration-300 shadow-2xl hover:-translate-y-1 animate-pulse flex items-center justify-center gap-3 mx-auto",
  secondary: "group relative overflow-hidden rounded-xl px-6 py-3 text-base font-bold text-white transition-all duration-300 shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto",
  
  // Gradientes por tipo
  gradients: {
    hero: "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-blue-500/30 hover:shadow-blue-500/50",
    investment: "bg-gradient-to-r from-green-500 to-emerald-400 shadow-green-500/30 hover:shadow-green-500/50",
    guarantee: "bg-gradient-to-r from-emerald-500 to-green-400 shadow-emerald-500/30 hover:shadow-emerald-500/50",
    transformation: "bg-gradient-to-r from-purple-500 to-cyan-400 shadow-purple-500/30 hover:shadow-purple-500/50",
    curriculum: "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-blue-500/30 hover:shadow-blue-500/50",
    faq: "bg-gradient-to-r from-blue-500 to-purple-500 shadow-blue-500/30 hover:shadow-blue-500/50",
    portfolio: "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-blue-500/30 hover:shadow-blue-500/50"
  }
};