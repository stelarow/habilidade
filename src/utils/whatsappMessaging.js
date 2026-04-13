import { whatsappTemplates } from '../data/whatsappTemplates';

/**
 * Generate contextual WhatsApp message based on article and user context
 * @param {Object} options - Message generation options
 * @param {string} options.article - Article title
 * @param {string} options.category - Article category
 * @param {string} options.url - Current page URL
 * @param {string} options.context - Context of the message (floating-button, contact-section, etc.)
 * @param {boolean} options.isMobile - Whether user is on mobile device
 * @returns {string} Formatted WhatsApp message
 */
export const generateWhatsAppMessage = ({
  article = null,
  category = null,
  url = '',
  context = 'generic',
  isMobile = false
}) => {
  // Get user device info
  const device = isMobile ? 'mobile' : 'desktop';
  
  // Get appropriate template based on context and article
  let template;
  
  if (article && category) {
    // Try to get category-specific template
    template = whatsappTemplates.byCategory[category.toLowerCase()] || 
               whatsappTemplates.byContext[context] || 
               whatsappTemplates.generic;
  } else if (article) {
    // Use article template
    template = whatsappTemplates.byContext.article || 
               whatsappTemplates.generic;
  } else {
    // Use generic template
    template = whatsappTemplates.byContext[context] || 
               whatsappTemplates.generic;
  }

  // Add UTM parameters to URL for tracking
  const trackedUrl = addUTMParameters(url, {
    source: 'whatsapp',
    medium: 'direct-message',
    campaign: 'blog-contact',
    content: context,
    term: category || 'general'
  });

  // Replace template variables
  let message = template.message
    .replace('{article}', article || '')
    .replace('{category}', category || '')
    .replace('{url}', trackedUrl)
    .replace('{device}', device);

  // Add greeting based on time of day
  const greeting = getTimeBasedGreeting();
  if (template.includeGreeting !== false) {
    message = `${greeting} ${message}`;
  }

  // Add business hours context if outside hours
  const businessHoursNote = getBusinessHoursNote();
  if (businessHoursNote) {
    message += `\n\n${businessHoursNote}`;
  }

  return message.trim();
};

/**
 * Get time-based greeting
 * @returns {string} Appropriate greeting for current time
 */
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Bom dia!';
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde!';
  } else {
    return 'Boa noite!';
  }
};

/**
 * Get business hours note if outside business hours
 * @returns {string|null} Business hours note or null
 */
const getBusinessHoursNote = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  const isWeekend = day === 0 || day === 6;
  const isBusinessHours = hour >= 8 && hour < 18;
  
  if (isWeekend) {
    return '=� Hoje � fim de semana, mas respondo assim que poss�vel! Durante a semana atendo das 8h �s 18h.';
  } else if (!isBusinessHours) {
    return hour < 8 ? '� Ainda � cedo, mas j� estou aqui! Hor�rio de atendimento: 8h �s 18h, segunda a sexta.' : '< J� passou do hor�rio comercial, mas vou responder o mais breve poss�vel! Hor�rio normal: 8h �s 18h, segunda a sexta.';
  }
  
  return null;
};

/**
 * Add UTM parameters to URL for tracking
 * @param {string} url - Original URL
 * @param {Object} utmParams - UTM parameters
 * @returns {string} URL with UTM parameters
 */
const addUTMParameters = (url, utmParameters) => {
  if (!url) return '';
  
  try {
    const urlObject = new URL(url);
    
    for (const [key, value] of Object.entries(utmParameters)) {
      if (value) {
        urlObject.searchParams.set(`utm_${key}`, value);
      }
    }
    
    return urlObject.toString();
  } catch (error) {
    console.warn('Error adding UTM parameters:', error);
    return url;
  }
};

/**
 * Generate message for different contact contexts
 * @param {string} context - Context type
 * @param {Object} data - Additional data for message generation
 * @returns {string} Generated message
 */
export const generateContextualMessage = (context, data = {}) => {
  const contextMessages = {
    'consultation': 'Gostaria de agendar uma consulta gratuita de 15 minutos para conversar sobre os cursos.',
    'course-info': `Tenho interesse em saber mais sobre o curso de ${data.course || 'um dos cursos dispon�veis'}.`,
    'quick-question': 'Tenho uma d�vida r�pida sobre os cursos. Pode me ajudar?',
    'enrollment': `Gostaria de me matricular no curso de ${data.course || 'um dos cursos'}. Como fa�o?`,
    'pricing': 'Gostaria de saber sobre valores e formas de pagamento dos cursos.',
    'schedule': 'Quero informa��es sobre hor�rios e cronograma das aulas.'
  };

  const baseMessage = contextMessages[context] || contextMessages['quick-question'];
  
  // Add article context if available
  if (data.article) {
    return `Vi o artigo "${data.article}" e ${baseMessage.toLowerCase()}`;
  }
  
  return baseMessage;
};

/**
 * Format message for mobile optimization
 * @param {string} message - Original message
 * @returns {string} Mobile-optimized message
 */
export const formatForMobile = (message) => {
  // Mobile messages should be shorter and more direct
  return message
    .replaceAll('\n\n', '\n') // Reduce line breaks
    .replaceAll(/[=�=�=�]/g, '') // Remove some emojis for cleaner look
    .trim();
};

/**
 * Get quick action messages for different scenarios
 * @param {string} action - Action type
 * @returns {string} Quick action message
 */
export const getQuickActionMessage = (action) => {
  const quickActions = {
    'schedule-call': 'Gostaria de agendar uma liga��o para conversar sobre os cursos.',
    'send-info': 'Pode me enviar mais informa��es sobre os cursos por favor?',
    'check-availability': 'Quero verificar disponibilidade de vagas nos cursos.',
    'payment-options': 'Preciso saber sobre op��es de pagamento e valores.',
    'course-comparison': 'Gostaria de ajuda para escolher o melhor curso para meu perfil.'
  };

  return quickActions[action] || quickActions['send-info'];
};