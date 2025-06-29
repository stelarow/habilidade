// Configurações do EmailJS
// Para maior segurança, use variáveis de ambiente em produção

export const EMAIL_CONFIG = {
  // IDs do EmailJS (podem ser públicos)
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_rn9v8zj',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_yqc7zqk',
  
  // Chave pública (pode ser exposta no frontend)
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '2FZ-ZnMRFUaI-c8CD',
  
  // Email de destino
  CONTACT_EMAIL: 'alessandro.ferreira@escolahabilidade.com',
  
  // WhatsApp para fallback
  WHATSAPP_NUMBER: '5548988559491'
};

// Função para validar se a configuração está completa
export const isEmailConfigured = () => {
  return (
    EMAIL_CONFIG.SERVICE_ID !== 'service_escola_habilidade' &&
    EMAIL_CONFIG.TEMPLATE_ID !== 'template_contato_escola' &&
    EMAIL_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
    EMAIL_CONFIG.SERVICE_ID.length > 0 &&
    EMAIL_CONFIG.TEMPLATE_ID.length > 0 &&
    EMAIL_CONFIG.PUBLIC_KEY.length > 0
  );
};

// Template padrão para emails
export const EMAIL_TEMPLATE = {
  subject: '📩 Nova Mensagem do Site - {{from_name}}',
  body: `
Olá Alessandro,

Você recebeu uma nova mensagem através do formulário do site da Escola Habilidade:

👤 Nome: {{from_name}}
📧 Email: {{from_email}}
📱 Telefone: {{phone}}
📚 Curso de Interesse: {{course}}

💬 Mensagem:
{{message}}

---
Para responder, use: {{reply_to}}

Atenciosamente,
Sistema Escola Habilidade
  `
}; 