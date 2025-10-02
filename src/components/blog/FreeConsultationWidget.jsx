import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Star, 
  Users, 
  Trophy,
  WhatsappLogo,
  Phone,
  User,
  Envelope
} from '@phosphor-icons/react';
import { generateWhatsAppMessage } from '../../utils/whatsappMessaging';
import { useContactAnalytics } from '../../hooks/useContactAnalytics';
import { getBusinessHoursStatus } from '../../utils/businessHours';
import { EMAIL_CONFIG } from '../../utils/emailConfig';

const FreeConsultationWidget = ({ 
  article = null, 
  category = null,
  className = '',
  variant = 'full', // full, compact, sidebar
  showTestimonials = true,
  customOffer = null
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  
  const { trackContactClick } = useContactAnalytics();

  // Get appropriate offer based on category
  const getOfferByCategory = (categoryName) => {
    const offers = {
      'tecnologia': {
        title: 'Consultoria Gratuita em Tecnologia',
        description: 'Descubra qual curso de tecnologia � ideal para sua carreira',
        benefits: ['An�lise do seu perfil t�cnico', 'Roadmap personalizado', 'Dicas de mercado'],
        urgent: 'Mercado aquecido - 15 vagas abertas esta semana'
      },
      'design': {
        title: 'Consultoria Gratuita em Design',
        description: 'Encontre sua especializa��o no mundo do design',
        benefits: ['Portfolio review gratuito', 'Tend�ncias do mercado', 'Networking'],
        urgent: 'Mercado criativo em alta - Aproveite!'
      },
      'programacao': {
        title: 'Consultoria Gratuita para Programadores',
        description: 'Acelere sua carreira na programa��o',
        benefits: ['Code review', 'Mentoria t�cnica', 'Oportunidades no mercado'],
        urgent: 'Programadores em alta demanda'
      },
      'marketing': {
        title: 'Consultoria Gratuita em Marketing Digital',
        description: 'Domine as estrat�gias que geram resultados',
        benefits: ['Audit gratuito do seu neg�cio', 'Estrat�gias comprovadas', 'Cases de sucesso'],
        urgent: 'Marketing digital nunca foi t�o importante'
      }
    };

    return offers[String(categoryName || '').toLowerCase()] || {
      title: 'Consultoria Gratuita Personalizada',
      description: 'Descubra qual curso � perfeito para seus objetivos',
      benefits: ['An�lise personalizada', 'Orienta��o de carreira', 'Suporte especializado'],
      urgent: 'Vagas limitadas - Garante j� a sua!'
    };
  };

  const offer = customOffer || getOfferByCategory(category?.name || category);

  const handleConsultationClick = (method = 'whatsapp') => {
    const message = `Ol�! Gostaria de agendar a consultoria gratuita de 15 minutos.

=� *Dados da solicita��o:*
${article ? `=� Artigo lido: ${article.title}` : ''}
${category ? `<� Categoria de interesse: ${category.name || category}` : ''}
${selectedTime ? `� Hor�rio preferido: ${selectedTime}` : ''}

Estou interessado(a) em ${String(offer.title || '').toLowerCase()} para entender melhor como posso me desenvolver profissionalmente.`;

    if (method === 'whatsapp') {
      const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      trackContactClick({
        channel: 'whatsapp',
        source: 'consultation-widget',
        article: article?.slug || 'unknown',
        category: category?.slug || category || 'unknown',
        position: variant,
        message: message
      });

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else if (method === 'phone') {
      trackContactClick({
        channel: 'phone',
        source: 'consultation-widget',
        article: article?.slug || 'unknown',
        category: category?.slug || category || 'unknown',
        position: variant
      });

      window.location.href = 'tel:+5548988559491';
    }
  };

  const timeSlots = [
    'Manh� (8h-12h)',
    'Tarde (12h-18h)', 
    'Flex�vel'
  ];

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl p-4 border border-green-500/20 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Consultoria Gratuita</h4>
              <p className="text-green-300 text-xs">15 minutos - Sem compromisso</p>
            </div>
          </div>
          
          <button
            onClick={() => handleConsultationClick('whatsapp')}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
          >
            Agendar
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-gradient-to-br from-green-900/10 via-emerald-900/10 to-green-900/10 border border-green-500/20 rounded-xl p-4 ${className}`}>
        <div className="text-center">
          <div className="p-3 bg-green-500 rounded-full w-fit mx-auto mb-3">
            <Calendar size={24} className="text-white" />
          </div>
          
          <h3 className="font-bold text-white mb-2 text-sm">
            {offer.title}
          </h3>
          
          <p className="text-zinc-300 text-xs mb-3">
            {offer.description}
          </p>

          <div className="bg-green-500/10 rounded-lg p-2 mb-3">
            <p className="text-green-300 text-xs font-medium">
              � 15 minutos gratuitos
            </p>
          </div>

          <button
            onClick={() => handleConsultationClick('whatsapp')}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-xs font-medium transition-colors mb-2"
          >
            Agendar Agora
          </button>

          <p className="text-zinc-400 text-xs">
            =� (48) 9 8855-9491
          </p>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-gradient-to-br from-green-900/10 via-emerald-900/10 to-green-900/10 border border-green-500/20 rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Calendar size={32} className="text-white" />
          <div className="text-center">
            <h3 className="text-xl font-bold">{offer.title}</h3>
            <p className="text-green-100 text-sm">15 minutos " 100% gratuito " Sem compromisso</p>
          </div>
        </div>

        {offer.urgent && (
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <p className="text-sm font-medium">� {offer.urgent}</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-zinc-300 text-center mb-6">
          {offer.description}
        </p>

        {/* Benefits */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3 text-center">O que voc� vai receber:</h4>
          <div className="space-y-2">
            {offer.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <span className="text-zinc-300 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Qual seu hor�rio preferido?</h4>
          <div className="grid grid-cols-1 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  selectedTime === time
                    ? 'border-green-500 bg-green-500/20 text-green-300' 
                    : 'border-zinc-600 bg-zinc-800/50 text-zinc-300 hover:border-green-500/50'
                }`}
              >
                <Clock size={16} className="inline mr-2" />
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleConsultationClick('whatsapp')}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <WhatsappLogo size={20} weight="bold" />
            Agendar via WhatsApp
          </button>

          <button
            onClick={() => handleConsultationClick('phone')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Phone size={20} weight="bold" />
            Ligar: (48) 9 8855-9491
          </button>
        </div>

        {/* Trust Elements */}
        {showTestimonials && (
          <div className="mt-6 pt-6 border-t border-zinc-700">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400" weight="fill" />
                ))}
              </div>
              <p className="text-zinc-400 text-sm">Mais de 500 consultas realizadas</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Users size={20} className="text-green-400 mx-auto mb-1" />
                <p className="text-xs text-zinc-400">500+ alunos</p>
              </div>
              <div>
                <Trophy size={20} className="text-yellow-400 mx-auto mb-1" />
                <p className="text-xs text-zinc-400">15 anos exp.</p>
              </div>
              <div>
                <CheckCircle size={20} className="text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-zinc-400">100% gratuito</p>
              </div>
            </div>
          </div>
        )}

        {/* Fine Print */}
        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-500">
            Consulta sem compromisso. Atendimento de segunda a sexta, das 8h �s 18h.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeConsultationWidget;