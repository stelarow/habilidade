import React, { useState, useEffect, useCallback } from 'react';

/**
 * Controles de acessibilidade para backgrounds animados
 * Permite usuários controlarem animações e efeitos visuais
 */
const AccessibilityControls = ({ 
  onAnimationToggle,
  onReducedMotionToggle,
  onContrastChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    animationsEnabled: true,
    respectReducedMotion: true,
    highContrast: false,
    reduceTransparency: false,
    pauseOnFocus: true
  });

  // Carregar preferências do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse accessibility settings:', error);
      }
    }

    // Detectar prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setSettings(prev => ({ ...prev, animationsEnabled: false }));
    }

    // Listener para mudanças na preferência do sistema
    const handleChange = (e) => {
      setSettings(prev => ({ 
        ...prev, 
        animationsEnabled: !e.matches,
        respectReducedMotion: true
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Aplicar configurações ao documento
    applySettingsToDocument(settings);
    
    // Notificar componentes pai
    if (onAnimationToggle) onAnimationToggle(settings.animationsEnabled);
    if (onReducedMotionToggle) onReducedMotionToggle(settings.respectReducedMotion);
    if (onContrastChange) onContrastChange(settings.highContrast);
  }, [settings, onAnimationToggle, onReducedMotionToggle, onContrastChange]);

  const applySettingsToDocument = useCallback((newSettings) => {
    const root = document.documentElement;
    
    // Aplicar classes CSS baseadas nas configurações
    root.classList.toggle('accessibility-no-animations', !newSettings.animationsEnabled);
    root.classList.toggle('accessibility-high-contrast', newSettings.highContrast);
    root.classList.toggle('accessibility-reduced-transparency', newSettings.reduceTransparency);
    root.classList.toggle('accessibility-pause-on-focus', newSettings.pauseOnFocus);

    // Atualizar CSS custom properties
    root.style.setProperty('--animation-duration', newSettings.animationsEnabled ? '1s' : '0s');
    root.style.setProperty('--transition-duration', newSettings.animationsEnabled ? '0.3s' : '0s');
    root.style.setProperty('--opacity-level', newSettings.reduceTransparency ? '1' : '0.1');
  }, []);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults = {
      animationsEnabled: true,
      respectReducedMotion: true,
      highContrast: false,
      reduceTransparency: false,
      pauseOnFocus: true
    };
    setSettings(defaults);
  }, []);

  // Detectar teclas de atalho
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Shift + A para toggle de animações
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        updateSetting('animationsEnabled', !settings.animationsEnabled);
      }
      
      // Ctrl/Cmd + Shift + C para toggle de contraste
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        updateSetting('highContrast', !settings.highContrast);
      }

      // ESC para fechar o painel
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings, isOpen, updateSetting]);

  return (
    <>
      {/* Botão de acesso */}
      <button
        className={`fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir controles de acessibilidade"
        aria-expanded={isOpen}
        title="Controles de Acessibilidade (Ctrl+Shift+A)"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" 
          />
        </svg>
      </button>

      {/* Painel de controles */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-6 w-80 max-w-[calc(100vw-2rem)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Acessibilidade
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              aria-label="Fechar controles"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Controles */}
          <div className="space-y-4">
            {/* Animações */}
            <div className="flex items-center justify-between">
              <label htmlFor="animations" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Animações de fundo
              </label>
              <input
                id="animations"
                type="checkbox"
                checked={settings.animationsEnabled}
                onChange={(e) => updateSetting('animationsEnabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            {/* Respeitar prefers-reduced-motion */}
            <div className="flex items-center justify-between">
              <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Respeitar preferência do sistema
              </label>
              <input
                id="reduced-motion"
                type="checkbox"
                checked={settings.respectReducedMotion}
                onChange={(e) => updateSetting('respectReducedMotion', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            {/* Alto contraste */}
            <div className="flex items-center justify-between">
              <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Alto contraste
              </label>
              <input
                id="high-contrast"
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            {/* Reduzir transparência */}
            <div className="flex items-center justify-between">
              <label htmlFor="reduce-transparency" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reduzir transparência
              </label>
              <input
                id="reduce-transparency"
                type="checkbox"
                checked={settings.reduceTransparency}
                onChange={(e) => updateSetting('reduceTransparency', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            {/* Pausar no foco */}
            <div className="flex items-center justify-between">
              <label htmlFor="pause-on-focus" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pausar no foco
              </label>
              <input
                id="pause-on-focus"
                type="checkbox"
                checked={settings.pauseOnFocus}
                onChange={(e) => updateSetting('pauseOnFocus', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Atalhos */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Atalhos do teclado:
            </h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>Ctrl+Shift+A: Toggle animações</li>
              <li>Ctrl+Shift+C: Toggle contraste</li>
              <li>ESC: Fechar este painel</li>
            </ul>
          </div>

          {/* Botão de reset */}
          <button
            onClick={resetToDefaults}
            className="w-full mt-4 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Restaurar padrões
          </button>
        </div>
      )}

      {/* Overlay para fechar quando clicar fora */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-25"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default React.memo(AccessibilityControls);
