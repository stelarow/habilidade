const EMAIL_CONFIG = {
  // IDs do EmailJS (podem ser públicos)
  SERVICE_ID: "service_rn9v8zj",
  TEMPLATE_ID: "template_yqc7zqk",
  // Chave pública (pode ser exposta no frontend)
  PUBLIC_KEY: "2FZ-ZnMRFUaI-c8CD",
  // Email de destino
  CONTACT_EMAIL: "alessandro.ferreira@escolahabilidade.com",
  // WhatsApp para fallback
  WHATSAPP_NUMBER: "5548988559491"
};
const isEmailConfigured = () => {
  return EMAIL_CONFIG.SERVICE_ID.length > 0 && EMAIL_CONFIG.TEMPLATE_ID.length > 0 && EMAIL_CONFIG.PUBLIC_KEY.length > 0;
};
export {
  EMAIL_CONFIG as E,
  isEmailConfigured as i
};
