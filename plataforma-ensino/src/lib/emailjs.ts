/**
 * EmailJS Integration Library
 * Handles email automation for CTA lead magnets and newsletters
 */

import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  NEWSLETTER_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID || '',
};

// Initialize EmailJS
export const initializeEmailJS = () => {
  if (EMAILJS_CONFIG.PUBLIC_KEY) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }
};

// Email template parameters
export interface EmailParams {
  to_email: string;
  to_name?: string;
  subject: string;
  message: string;
  from_name?: string;
  reply_to?: string;
  template_type?: 'leadmagnet' | 'newsletter' | 'notification';
  lead_magnet_type?: string;
  lead_magnet_title?: string;
  download_url?: string;
  user_preferences?: string[];
}

// Send lead magnet email
export const sendLeadMagnetEmail = async (params: {
  email: string;
  name?: string;
  leadMagnetType: string;
  leadMagnetTitle: string;
  downloadUrl?: string;
  additionalData?: Record<string, any>;
}): Promise<boolean> => {
  try {
    const templateParams: EmailParams = {
      to_email: params.email,
      to_name: params.name || 'Caro(a) visitante',
      subject: `Seu material: ${params.leadMagnetTitle}`,
      message: `Obrigado por baixar "${params.leadMagnetTitle}". Seu material está anexado ou disponível no link abaixo.`,
      from_name: 'Stelarow Habilidade',
      reply_to: 'noreply@stelarowhabilidade.com',
      template_type: 'leadmagnet',
      lead_magnet_type: params.leadMagnetType,
      lead_magnet_title: params.leadMagnetTitle,
      download_url: params.downloadUrl,
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error sending lead magnet email:', error);
    return false;
  }
};

// Send newsletter confirmation email
export const sendNewsletterConfirmation = async (params: {
  email: string;
  name?: string;
  preferences?: string[];
  source?: string;
}): Promise<boolean> => {
  try {
    const templateParams: EmailParams = {
      to_email: params.email,
      to_name: params.name || 'Novo assinante',
      subject: 'Bem-vindo(a) à Newsletter Stelarow Habilidade!',
      message: 'Obrigado por se inscrever em nossa newsletter. Você receberá conteúdo exclusivo regularmente.',
      from_name: 'Stelarow Habilidade',
      reply_to: 'newsletter@stelarowhabilidade.com',
      template_type: 'newsletter',
      user_preferences: params.preferences,
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.NEWSLETTER_TEMPLATE_ID,
      templateParams
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error sending newsletter confirmation:', error);
    return false;
  }
};

// Send notification email (internal)
export const sendNotificationEmail = async (params: {
  type: 'new_lead' | 'new_subscriber' | 'high_demand_cta';
  data: Record<string, any>;
}): Promise<boolean> => {
  try {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@stelarowhabilidade.com';
    
    let subject = '';
    let message = '';

    switch (params.type) {
      case 'new_lead':
        subject = 'Novo Lead Magnet Download';
        message = `
          Novo download de lead magnet:
          
          Email: ${params.data.email}
          Nome: ${params.data.name || 'Não informado'}
          Material: ${params.data.leadMagnetTitle}
          Tipo: ${params.data.leadMagnetType}
          Data: ${new Date().toLocaleString('pt-BR')}
          
          CTA ID: ${params.data.ctaId}
          Página: ${params.data.pageUrl}
        `;
        break;
        
      case 'new_subscriber':
        subject = 'Nova Inscrição Newsletter';
        message = `
          Nova inscrição na newsletter:
          
          Email: ${params.data.email}
          Nome: ${params.data.name || 'Não informado'}
          Preferências: ${params.data.preferences?.join(', ') || 'Nenhuma'}
          Origem: ${params.data.source || 'Website'}
          Data: ${new Date().toLocaleString('pt-BR')}
          
          CTA ID: ${params.data.ctaId}
          Página: ${params.data.pageUrl}
        `;
        break;
        
      case 'high_demand_cta':
        subject = 'CTA com Alta Demanda';
        message = `
          CTA com alta demanda detectada:
          
          CTA ID: ${params.data.ctaId}
          Tipo: ${params.data.ctaType}
          Conversões (últimas 24h): ${params.data.conversions}
          Taxa de conversão: ${params.data.conversionRate}%
          
          Considere ampliar a promoção ou criar CTAs similares.
        `;
        break;
    }

    const templateParams: EmailParams = {
      to_email: adminEmail,
      subject,
      message,
      from_name: 'Sistema CTA Stelarow',
      template_type: 'notification',
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error sending notification email:', error);
    return false;
  }
};

// Validate email configuration
export const validateEmailConfig = (): {
  isValid: boolean;
  missingKeys: string[];
} => {
  const missingKeys: string[] = [];
  
  if (!EMAILJS_CONFIG.PUBLIC_KEY) missingKeys.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');
  if (!EMAILJS_CONFIG.SERVICE_ID) missingKeys.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
  if (!EMAILJS_CONFIG.TEMPLATE_ID) missingKeys.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  };
};

// Email validation utility
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format email for display
export const formatEmailForDisplay = (email: string): string => {
  if (email.length <= 20) return email;
  
  const [localPart, domain] = email.split('@');
  if (localPart.length > 10) {
    return `${localPart.substring(0, 8)}...@${domain}`;
  }
  
  return email;
};

// Email analytics integration
export const trackEmailEvent = async (params: {
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced';
  email: string;
  templateType: 'leadmagnet' | 'newsletter' | 'notification';
  ctaId?: string;
  additionalData?: Record<string, any>;
}): Promise<void> => {
  try {
    // Send to analytics endpoint
    await fetch('/api/analytics/email-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: params.type,
        email: params.email,
        template_type: params.templateType,
        cta_id: params.ctaId,
        timestamp: new Date().toISOString(),
        data: params.additionalData,
      }),
    });
  } catch (error) {
    console.error('Error tracking email event:', error);
  }
};

// Initialize EmailJS on module load
if (typeof window !== 'undefined') {
  initializeEmailJS();
}

// Export all functions
export default {
  sendLeadMagnetEmail,
  sendNewsletterConfirmation,
  sendNotificationEmail,
  validateEmailConfig,
  isValidEmail,
  formatEmailForDisplay,
  trackEmailEvent,
  initializeEmailJS,
};