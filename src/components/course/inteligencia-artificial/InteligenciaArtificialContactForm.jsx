import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG, isEmailConfigured } from '../../../utils/emailConfig';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  message: ''
};

function trackEvent(eventName, parameters = {}) {
  if (typeof globalThis.gtag === 'function') {
    globalThis.gtag('event', eventName, parameters);
  }
}

function buildWhatsAppMessage(formData) {
  return [
    'Nova solicitacao de contato - Curso de Inteligencia Artificial',
    '',
    `Nome: ${formData.name}`,
    `Email: ${formData.email}`,
    `Telefone: ${formData.phone}`,
    'Curso de interesse: Inteligencia Artificial',
    `Mensagem: ${formData.message || 'Quero saber mais sobre conteudo, horarios e formas de pagamento do curso de IA.'}`
  ].join('\n');
}

export default function InteligenciaArtificialContactForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const openWhatsApp = () => {
    const message = buildWhatsAppMessage(formData);
    const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    trackEvent('cta_click', {
      event_category: 'CTA',
      event_label: 'inteligencia-artificial-whatsapp-fallback',
      course_name: 'Inteligencia Artificial',
      course_slug: 'inteligencia-artificial'
    });

    globalThis.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const sendEmail = async () => {
    if (!isEmailConfigured()) {
      return { success: false };
    }

    const templateParameters = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      course: 'Inteligencia Artificial',
      message: formData.message || 'Quero saber mais sobre conteudo, horarios e formas de pagamento do curso de Inteligencia Artificial.',
      to_email: EMAIL_CONFIG.CONTACT_EMAIL,
      reply_to: formData.email
    };

    try {
      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParameters,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar contato do curso de IA:', error);
      return { success: false };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const result = await sendEmail();

    if (result.success) {
      trackEvent('form_submit', {
        course_name: 'Inteligencia Artificial',
        course_slug: 'inteligencia-artificial',
        method: 'emailjs'
      });
      setSubmitStatus('success');
      setFormData(initialFormData);
    } else {
      setSubmitStatus('whatsapp');
      setTimeout(openWhatsApp, 900);
    }

    setIsSubmitting(false);
  };

  return (
    <form className="ai-contact-form" onSubmit={handleSubmit}>
      <div className="ai-form-grid">
        <label className="ai-field">
          <span>Nome completo</span>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="Seu nome"
          />
        </label>

        <label className="ai-field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="seu@email.com"
          />
        </label>

        <label className="ai-field">
          <span>WhatsApp</span>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            placeholder="(48) 9 9999-9999"
          />
        </label>

        <label className="ai-field">
          <span>Curso</span>
          <input value="Inteligencia Artificial" readOnly aria-readonly="true" />
        </label>
      </div>

      <label className="ai-field ai-field-full">
        <span>Mensagem</span>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="Conte seus objetivos com IA, melhores horarios ou duvidas."
        />
      </label>

      {submitStatus === 'success' && (
        <p className="ai-form-status">Mensagem enviada. Nossa equipe entra em contato em breve.</p>
      )}

      {submitStatus === 'whatsapp' && (
        <p className="ai-form-status">Abrindo WhatsApp com sua mensagem sobre o curso de IA.</p>
      )}

      <button className="ai-button ai-button-primary ai-form-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando' : 'Solicitar contato'}
      </button>
    </form>
  );
}
