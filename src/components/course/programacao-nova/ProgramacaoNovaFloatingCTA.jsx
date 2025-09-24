import React, { useState, useEffect } from 'react';
import { WhatsappLogo, X } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

export const ProgramacaoNovaFloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Mostrar após rolar uma tela
      setIsVisible(scrollPosition > windowHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 cursor-pointer"
        >
          <WhatsappLogo className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm animate-bounce">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">
                Consultor Online
              </span>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Olá! 👋 Tem dúvidas sobre o curso de programação?
            Estou aqui para ajudar!
          </p>

          <button
            onClick={() => {
              handleCTAClick('floating-whatsapp');
              setIsMinimized(true);
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <WhatsappLogo className="w-5 h-5" />
            Conversar no WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};