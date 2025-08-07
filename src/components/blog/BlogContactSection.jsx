import React, { useState, useEffect } from 'react';
import { WhatsappLogo, Phone, Envelope, Clock, CheckCircle, Star } from '@phosphor-icons/react';
import { generateWhatsAppMessage, generateContextualMessage } from '../../utils/whatsappMessaging';
import { useContactAnalytics } from '../../hooks/useContactAnalytics';
import { getBusinessHoursStatus } from '../../utils/businessHours';
import { EMAIL_CONFIG } from '../../utils/emailConfig';

const BlogContactSection = ({ 
  article = null, 
  category = null,
  className = '',
  variant = 'full' // full, compact, minimal
}) => {
  const [businessStatus, setBusinessStatus] = useState(null);
  const { trackContactClick } = useContactAnalytics();

  useEffect(() => {
    setBusinessStatus(getBusinessHoursStatus());
    
    // Update status every minute
    const interval = setInterval(() => {
      setBusinessStatus(getBusinessHoursStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppClick = () => {
    const message = generateWhatsAppMessage({
      article: article?.title || null,
      category: category?.name || category || null,
      url: window.location.href,
      context: 'contact-section'
    });

    const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    trackContactClick({
      channel: 'whatsapp',
      source: 'contact-section',
      article: article?.slug || 'unknown',
      category: category?.slug || category || 'unknown',
      position: 'article-end',
      message: message
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePhoneClick = () => {
    const phoneNumber = 'tel:+5548988559491';
    
    trackContactClick({
      channel: 'phone',
      source: 'contact-section',
      article: article?.slug || 'unknown',
      category: category?.slug || category || 'unknown',
      position: 'article-end'
    });

    window.location.href = phoneNumber;
  };

  const handleEmailClick = () => {
    const subject = article 
      ? `Interesse após ler: ${article.title}`
      : 'Interesse nos cursos da Escola Habilidade';
    
    const body = generateContextualMessage('course-info', { 
      article: article?.title,
      course: category?.name || category 
    });

    const emailUrl = `mailto:${EMAIL_CONFIG.CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    trackContactClick({
      channel: 'email',
      source: 'contact-section',
      article: article?.slug || 'unknown',
      category: category?.slug || category || 'unknown',
      position: 'article-end',
      subject: subject
    });

    window.location.href = emailUrl;
  };

  if (variant === 'minimal') {
    return (
      <div className={`bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg p-6 border border-purple-500/20 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Gostou do conteúdo?
          </h3>
          <p className="text-zinc-300 text-sm mb-4">
            Fale conosco para saber mais sobre nossos cursos!
          </p>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <WhatsappLogo size={18} weight="bold" />
              WhatsApp
            </button>
            
            <button
              onClick={handlePhoneClick}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Phone size={18} weight="bold" />
              Ligar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-zinc-900 via-purple-900/10 to-zinc-900 border border-purple-500/20 rounded-2xl p-8 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="text-yellow-400" size={24} weight="fill" />
          <Star className="text-yellow-400" size={24} weight="fill" />
          <Star className="text-yellow-400" size={24} weight="fill" />
          <Star className="text-yellow-400" size={24} weight="fill" />
          <Star className="text-yellow-400" size={24} weight="fill" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">
          {article ? 'Gostou do artigo?' : 'Precisa de ajuda?'}
        </h3>
        
        <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
          {article 
            ? `Que tal dar o próximo passo? Converse conosco sobre como nossos cursos podem ajudar você a se especializar em ${category?.name || 'sua área de interesse'}.`
            : 'Nossa equipe está pronta para ajudar você a escolher o melhor curso para sua carreira!'
          }
        </p>

        {/* Consultation offer */}
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-green-300">
            <CheckCircle size={20} weight="bold" />
            <span className="font-medium">Consulta gratuita de 15 minutos</span>
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* WhatsApp */}
        <button
          onClick={handleWhatsAppClick}
          className="group p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded-xl transition-all duration-300 text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
              <WhatsappLogo size={20} weight="bold" className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white">WhatsApp</h4>
              <p className="text-green-300 text-sm">Resposta imediata</p>
            </div>
          </div>
          <p className="text-zinc-400 text-sm">
            Converse diretamente conosco pelo WhatsApp. Resposta rápida e personalizada!
          </p>
        </button>

        {/* Phone */}
        <button
          onClick={handlePhoneClick}
          className="group p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all duration-300 text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
              <Phone size={20} weight="bold" className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Telefone</h4>
              <p className="text-blue-300 text-sm">(48) 9 8855-9491</p>
            </div>
          </div>
          <p className="text-zinc-400 text-sm">
            Ligue diretamente para esclarecer dúvidas e receber orientações personalizadas.
          </p>
        </button>

        {/* Email */}
        <button
          onClick={handleEmailClick}
          className="group p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition-all duration-300 text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
              <Envelope size={20} weight="bold" className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Email</h4>
              <p className="text-purple-300 text-sm">Detalhado</p>
            </div>
          </div>
          <p className="text-zinc-400 text-sm">
            Envie um email com suas dúvidas e receba informações detalhadas sobre os cursos.
          </p>
        </button>
      </div>

      {/* Business Hours Status */}
      {businessStatus && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock size={16} className={businessStatus.isOpen ? 'text-green-400' : 'text-yellow-400'} />
          <span className={`text-sm ${businessStatus.isOpen ? 'text-green-300' : 'text-yellow-300'}`}>
            {businessStatus.message}
          </span>
        </div>
      )}

      {/* Additional Info */}
      <div className="text-center text-sm text-zinc-400 border-t border-zinc-700 pt-4">
        <p>
          =Þ Atendimento: Segunda a sexta, 8h às 18h
          <br />
          =ç Email: {EMAIL_CONFIG.CONTACT_EMAIL}
          <br />
          ( Primeira consulta sempre gratuita
        </p>
      </div>
    </div>
  );
};

export default BlogContactSection;