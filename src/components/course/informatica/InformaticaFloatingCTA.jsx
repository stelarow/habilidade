import React, { useState, useEffect } from 'react';
import { ChatCircle, X, Phone, Clock, Users } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

export const InformaticaFloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Aparece após 3 segundos

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    handleCTAClick('floating');
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating CTA Card - Only on desktop/tablet */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <div className={`transition-all duration-300 ${
          isMinimized ? 'scale-75' : 'scale-100'
        }`}>
          
          {/* Card expandido */}
          {!isMinimized && (
            <div className="bg-gradient-to-br from-zinc-900/95 to-black/95 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 mb-4 max-w-sm shadow-2xl animate-in slide-in-from-right-8 duration-500">
              
              {/* Botão fechar */}
              <button
                onClick={toggleMinimize}
                className="absolute top-3 right-3 w-6 h-6 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Cabeçalho */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                  <ChatCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Fale Conosco</h3>
                  <p className="text-green-400 text-sm font-medium">Online agora!</p>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-2 text-sm text-zinc-300">
                  <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Respondemos em até 5 minutos</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-zinc-300">
                  <Users className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>150+ alunos já aprovaram nosso atendimento</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-zinc-300">
                  <Phone className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>Tire todas as dúvidas sobre o curso</span>
                </div>
              </div>

              {/* Botão WhatsApp */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25"
              >
                <ChatCircle className="w-5 h-5" />
                Falar com Consultor
              </button>

              <p className="text-xs text-zinc-500 text-center mt-3">
                Clique para iniciar conversa
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Button - Only on mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={handleWhatsAppClick}
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 rounded-full shadow-2xl shadow-green-500/25 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce"
        >
          <ChatCircle className="w-7 h-7 text-white" />
          
          {/* Indicator de nova mensagem */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        </button>
      </div>
    </>
  );
};