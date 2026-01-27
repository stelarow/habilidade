import { WhatsappLogo } from '@phosphor-icons/react';

/**
 * StickyWhatsApp - Mobile-only fixed CTA button
 * Provides a persistent contact option on mobile devices
 */
const StickyWhatsApp = () => {
  const whatsappUrl = "https://wa.me/5548988559491?text=Olá! Gostaria de saber mais sobre os cursos.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-4 right-4 z-50
        md:hidden
        flex items-center gap-2
        bg-green-500 hover:bg-green-600
        text-white font-semibold
        px-4 py-3 rounded-full
        shadow-lg shadow-green-500/30
        hover:shadow-xl hover:shadow-green-500/40
        transition-all duration-300
        hover:scale-105
        min-h-[48px]
      "
      aria-label="Fale conosco pelo WhatsApp"
    >
      <WhatsappLogo size={24} weight="fill" aria-hidden="true" />
      <span className="text-sm">Fale Conosco</span>
    </a>
  );
};

export default StickyWhatsApp;
