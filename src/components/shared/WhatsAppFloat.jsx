import React, { useState, useEffect, useRef } from 'react';
import { WhatsappLogo, X } from '@phosphor-icons/react';
import { generateWhatsAppMessage } from '../../utils/whatsappMessaging';
import { useContactAnalytics } from '../../hooks/useContactAnalytics';

const WhatsAppFloat = ({ 
  article = null, 
  category = null, 
  delaySeconds = 45, // Increased delay to be less intrusive
  scrollThreshold = 0.6, // Higher threshold
  className = '',
  position = 'bottom-right' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const { trackContactClick } = useContactAnalytics();

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  };

  // Check scroll progress and time
  useEffect(() => {
    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackHeight = docHeight - winHeight;
      const progress = Math.min(scrollTop / trackHeight, 1);
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show button based on time and scroll
  useEffect(() => {
    if (isDismissed) return;

    const checkVisibility = () => {
      const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
      const shouldShowByTime = timeElapsed >= delaySeconds;
      const shouldShowByScroll = scrollProgress >= scrollThreshold;
      
      if (shouldShowByTime || shouldShowByScroll) {
        setIsVisible(true);
      }
    };

    // Check immediately and then every second
    checkVisibility();
    const interval = setInterval(checkVisibility, 1000);

    return () => clearInterval(interval);
  }, [delaySeconds, scrollThreshold, scrollProgress, isDismissed]);

  // Removed auto-expand effect - now only expands on user interaction

  const handleWhatsAppClick = () => {
    const message = generateWhatsAppMessage({
      article: article?.title || null,
      category: category?.name || category || null,
      url: window.location.href,
      context: 'floating-button'
    });

    const whatsappUrl = `https://wa.me/5548988559491?text=${encodeURIComponent(message)}`;
    
    // Track the interaction
    trackContactClick({
      channel: 'whatsapp',
      source: 'floating-button',
      article: article?.slug || 'unknown',
      category: category?.slug || category || 'unknown',
      position: position,
      message: message
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
      {/* Main Button */}
      <div className="relative">
        {/* Subtle pulse animation ring - less intrusive */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-10"></div>
        
        {/* Smaller, less intrusive button */}
        <button
          onClick={handleToggleExpand}
          className={`
            relative w-12 h-12 rounded-full 
            bg-gradient-to-r from-green-500 via-green-400 to-cyan-400 
            hover:from-green-600 hover:via-green-500 hover:to-cyan-500
            flex items-center justify-center
            shadow-lg hover:shadow-xl hover:shadow-green-500/20
            transition-all duration-300 hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900
            ${isExpanded ? 'scale-105' : ''}
          `}
          title="Conversar no WhatsApp"
          aria-label="Abrir chat do WhatsApp"
        >
          <WhatsappLogo size={20} weight="bold" className="text-white" />
        </button>

        {/* Expanded Message */}
        <div className={`
          absolute bottom-14 right-0 mb-2
          bg-white rounded-lg shadow-xl border border-gray-200
          p-4 min-w-[260px] max-w-[300px]
          transform transition-all duration-300 origin-bottom-right
          ${isExpanded ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}
        `}>
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>

          {/* Avatar and content */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center flex-shrink-0">
              <WhatsappLogo size={16} weight="bold" className="text-white" />
            </div>

            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3 mb-2">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {article ? (
                    <>Olá! Vi que você está lendo sobre <strong>{article.title}</strong>. Posso ajudar com informações sobre nossos cursos relacionados?</>
                  ) : (
                    <>Olá! Precisa de ajuda ou tem dúvidas sobre nossos cursos? Estou aqui para ajudar! 😊</>
                  )}
                </p>
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <WhatsappLogo size={16} weight="bold" />
                Conversar agora
              </button>
            </div>
          </div>

          {/* Simplified status indicator - no animation */}
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Alessandro online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppFloat;