import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const MediaModal = ({ 
  isOpen, 
  onClose, 
  items = [], 
  currentIndex = 0, 
  onNavigate 
}) => {
  const currentItem = items[currentIndex];

  // Fechar modal com ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        onNavigate(currentIndex + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  // Prevenir scroll do body quando modal está aberto
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

  if (!isOpen || !currentItem) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200"
          aria-label="Fechar modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Botão Anterior */}
        {items.length > 1 && currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200"
            aria-label="Item anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Botão Próximo */}
        {items.length > 1 && currentIndex < items.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200"
            aria-label="Próximo item"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Conteúdo do Modal */}
        <div className="w-full h-full flex items-center justify-center">
          {currentItem.type === 'video' ? (
            <div className="w-full max-w-4xl">
              <video
                className="w-full h-auto max-h-[80vh] rounded-lg shadow-2xl"
                controls
                autoPlay
                muted={false}
                poster={currentItem.poster}
              >
                <source src={currentItem.src} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={currentItem.src}
                alt={currentItem.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                loading="eager"
              />
            </div>
          )}
        </div>

        {/* Indicador de Posição */}
        {items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-black/50 px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium">
                {currentIndex + 1} / {items.length}
              </span>
            </div>
          </div>
        )}

        {/* Título */}
        {currentItem.title && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 max-w-2xl text-center">
            <div className="bg-black/50 px-6 py-3 rounded-lg">
              <h3 className="text-white text-lg font-medium">
                {currentItem.title}
              </h3>
            </div>
          </div>
        )}

        {/* Navegação por dots (para mobile) */}
        {items.length > 1 && items.length <= 10 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Ir para item ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaModal;