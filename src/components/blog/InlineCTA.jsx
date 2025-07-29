import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, PlayCircle, BookOpen, X } from 'phosphor-react';
import { useCTAResponsive } from '../../hooks/useCTAResponsive';

/**
 * InlineCTA Component - CTA discreto para inser��o no meio do conte�do
 * Projetado para n�o interromper excessivamente a experi�ncia de leitura
 */
const InlineCTA = ({ 
  type = 'course', // 'course' | 'leadmagnet' | 'newsletter' | 'webinar'
  title,
  description,
  actionText,
  actionLink,
  onCtaClick = null,
  onDismiss = null,
  dismissible = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { classes, styles, isMobile } = useCTAResponsive();

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle CTA click tracking
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick({
        type: 'inline',
        ctaType: type,
        timestamp: Date.now()
      });
    }
  };

  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) return null;

  // Get icon based on CTA type
  const getIcon = () => {
    switch (type) {
      case 'leadmagnet':
        return <Download size={20} className="text-blue-400" />;
      case 'webinar':
        return <PlayCircle size={20} className="text-green-400" />;
      case 'newsletter':
        return <BookOpen size={20} className="text-purple-400" />;
      default:
        return <BookOpen size={20} className="text-purple-400" />;
    }
  };

  // Get color scheme based on type
  const getColorScheme = () => {
    switch (type) {
      case 'leadmagnet':
        return {
          border: 'border-blue-500/20',
          bg: 'from-blue-900/10 to-blue-800/10',
          button: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
        };
      case 'webinar':
        return {
          border: 'border-green-500/20',
          bg: 'from-green-900/10 to-green-800/10',
          button: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
        };
      case 'newsletter':
        return {
          border: 'border-orange-500/20',
          bg: 'from-orange-900/10 to-orange-800/10',
          button: 'from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800'
        };
      default:
        return {
          border: 'border-purple-500/20',
          bg: 'from-purple-900/10 to-purple-800/10',
          button: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
        };
    }
  };

  const colorScheme = getColorScheme();

  return (
    <div className={`my-8 transform transition-all duration-500 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${className}`}>
      <div className={`relative bg-gradient-to-r ${colorScheme.bg} ${colorScheme.border} border rounded-lg p-6 overflow-hidden`}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent"></div>
        
        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 text-zinc-400 hover:text-zinc-300 transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        )}

        <div className="relative flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-zinc-200 mb-2">
                  {title}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex-shrink-0">
                {actionLink?.startsWith('http') ? (
                  <a
                    href={actionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCtaClick}
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${colorScheme.button} text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  >
                    <span>{actionText}</span>
                    <ArrowRight size={16} />
                  </a>
                ) : (
                  <Link
                    to={actionLink || '/cursos'}
                    onClick={handleCtaClick}
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${colorScheme.button} text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  >
                    <span>{actionText}</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineCTA;