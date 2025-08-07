import React, { useState, useEffect } from 'react';
import { 
  X, 
  WhatsappLogo, 
  Phone, 
  Envelope, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  Warning
} from '@phosphor-icons/react';
import { generateWhatsAppMessage, generateContextualMessage } from '../../utils/whatsappMessaging';
import { useContactAnalytics } from '../../hooks/useContactAnalytics';
import { getBusinessHoursStatus } from '../../utils/businessHours';
import { EMAIL_CONFIG } from '../../utils/emailConfig';
import emailjs from '@emailjs/browser';

const QuickContactModal = ({ 
  isOpen, 
  onClose, 
  article = null, 
  category = null,
  triggerSource = 'unknown'
}) => {
  const [step, setStep] = useState(1); // 1: choose method, 2: form, 3: success
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    interest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessStatus, setBusinessStatus] = useState(null);

  const { trackContactClick, trackFormSubmission } = useContactAnalytics();

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedMethod(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredTime: '',
        interest: '',
        message: ''
      });
      setBusinessStatus(getBusinessHoursStatus());
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    
    if (method === 'whatsapp-direct') {
      handleDirectWhatsApp();
    } else if (method === 'phone-direct') {
      handleDirectPhone();
    } else {
      setStep(2);
    }
  };

  const handleDirectWhatsApp = () => {
    const message = generateWhatsAppMessage({
      article: article?.title || null,
      category: category?.name || category || null,
      url: window.location.href,
      context: 'quick-contact'
    });

    const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    trackContactClick({
      channel: 'whatsapp',
      source: 'quick-modal-direct',
      article: article?.slug || 'unknown',
      category: category?.slug || category || 'unknown',
      position: triggerSource,
      message: message
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleDirectPhone = () => {
    const phoneNumber = 'tel:+5548988559491';
    
    trackContactClick({
      channel: 'phone',
      source: 'quick-modal-direct',
      article: article?.slug || 'unknown',
      category: category?.slug || category || 'unknown',
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

      if (selectedMethod === 'email' || selectedMethod === 'consultation') {
        // Send email via EmailJS
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          preferred_time: formData.preferredTime,
          interest: formData.interest,
          message: formData.message,
          article: article?.title || 'Não especificado',
          category: category?.name || category || 'Não especificado',
          form_type: selectedMethod === 'consultation' ? 'Agendamento de Consulta' : 'Contato por Email',
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
      } else if (selectedMethod === 'whatsapp') {
        // Generate WhatsApp message with form data
        const message = `${generateWhatsAppMessage({
          article: article?.title || null,
          category: category?.name || category || null,
          url: window.location.href,
          context: 'quick-contact'
        })}

*Dados do formulário:*
Nome: ${formData.name}
Email: ${formData.email}
Telefone: ${formData.phone}
${formData.preferredTime ? `Horário preferido: ${formData.preferredTime}` : ''}
${formData.interest ? `Interesse específico: ${formData.interest}` : ''}
${formData.message ? `Mensagem: ${formData.message}` : ''}`;

        const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        
        trackContactClick({
          channel: 'whatsapp',
          source: 'quick-modal-form',
          article: article?.slug || 'unknown',
          category: category?.slug || category || 'unknown',
          position: triggerSource,
          message: message
        });

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        success = true;
      }

      // Track form submission
      trackFormSubmission({
        formType: 'quick-contact',
        source: triggerSource,
        article: article?.slug || 'unknown',
        success
      });

      if (success) {
        setStep(3);
        // Auto-close after 3 seconds on success
        setTimeout(() => {
          onClose();
        }, 3000);
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      
      trackFormSubmission({
        formType: 'quick-contact',
        source: triggerSource,
        article: article?.slug || 'unknown',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        {/* Step 1: Method Selection */}
        {step === 1 && (
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Como prefere entrar em contato?
              </h3>
              {article && (
                <p className="text-zinc-300 text-sm">
                  Sobre: <span className="text-purple-300">{article.title}</span>
                </p>
              )}
            </div>

            <div className="space-y-3">
              {/* WhatsApp Direct */}
              <button
                onClick={() => handleMethodSelect('whatsapp-direct')}
                className="w-full p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded-xl transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                    <WhatsappLogo size={20} weight="bold" className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">WhatsApp Direto</h4>
                    <p className="text-green-300 text-sm">Conversa imediata</p>
                  </div>
                  {businessStatus?.isOpen && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      Online
                    </span>
                  )}
                </div>
              </button>

              {/* Phone Direct */}
              <button
                onClick={() => handleMethodSelect('phone-direct')}
                className="w-full p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Phone size={20} weight="bold" className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Ligar Agora</h4>
                    <p className="text-blue-300 text-sm">(48) 9 8855-9491</p>
                  </div>
                </div>
              </button>

              {/* Form Options */}
              <div className="border-t border-zinc-700 pt-3 mt-4">
                <p className="text-zinc-400 text-sm text-center mb-3">
                  Ou preencha um formulário rápido:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleMethodSelect('consultation')}
                    className="p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-lg transition-all text-center group"
                  >
                    <Calendar size={20} className="text-purple-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <div className="text-xs text-white font-medium">Agendar</div>
                    <div className="text-xs text-purple-300">Consulta</div>
                  </button>

                  <button
                    onClick={() => handleMethodSelect('email')}
                    className="p-3 bg-zinc-500/10 hover:bg-zinc-500/20 border border-zinc-500/20 hover:border-zinc-500/40 rounded-lg transition-all text-center group"
                  >
                    <Envelope size={20} className="text-zinc-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <div className="text-xs text-white font-medium">Email</div>
                    <div className="text-xs text-zinc-300">Detalhado</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Business Hours Status */}
            {businessStatus && (
              <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className={businessStatus.isOpen ? 'text-green-400' : 'text-yellow-400'} />
                  <span className={businessStatus.isOpen ? 'text-green-300' : 'text-yellow-300'}>
                    {businessStatus.message}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Form */}
        {step === 2 && (
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedMethod === 'consultation' ? 'Agendar Consulta' : 'Formulário de Contato'}
              </h3>
              <p className="text-zinc-300 text-sm">
                Preencha os dados para um atendimento personalizado
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
                  <User size={16} className="inline mr-1" />
                  Nome *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Seu nome completo"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                  <Envelope size={16} className="inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1">
                  <Phone size={16} className="inline mr-1" />
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="(48) 9 9999-9999"
                />
              </div>

              {/* Preferred Time (for consultation) */}
              {selectedMethod === 'consultation' && (
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-zinc-300 mb-1">
                    <Clock size={16} className="inline mr-1" />
                    Horário preferido
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="">Selecione um horário</option>
                    <option value="Manhã (8h-12h)">Manhã (8h-12h)</option>
                    <option value="Tarde (12h-18h)">Tarde (12h-18h)</option>
                    <option value="Flexível">Flexível</option>
                  </select>
                </div>
              )}

              {/* Interest */}
              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-zinc-300 mb-1">
                  Interesse específico
                </label>
                <input
                  type="text"
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Ex: Design Gráfico, Programação..."
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-1">
                  Mensagem (opcional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                  placeholder="Conte-nos mais sobre seu interesse..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-sm"
                >
                  Voltar
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email}
                  className="flex-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                >
                  {isSubmitting ? 'Enviando...' : 
                   selectedMethod === 'consultation' ? 'Agendar' : 
                   selectedMethod === 'whatsapp' ? 'Abrir WhatsApp' : 'Enviar Email'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="p-6 text-center">
            <div className="mb-4">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">
                Sucesso!
              </h3>
              <p className="text-zinc-300">
                {selectedMethod === 'consultation' 
                  ? 'Sua solicitação de consulta foi enviada. Entraremos em contato em breve para confirmar o horário.'
                  : selectedMethod === 'whatsapp'
                  ? 'Você será redirecionado para o WhatsApp com sua mensagem preparada.'
                  : 'Sua mensagem foi enviada! Responderemos em até 24 horas.'
                }
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickContactModal;