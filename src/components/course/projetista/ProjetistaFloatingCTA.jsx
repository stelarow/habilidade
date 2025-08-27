import { 
  WhatsappLogo, 
  Lightning,
  Rocket
} from '@phosphor-icons/react';

export const ProjetistaFloatingCTA = () => {
  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://wa.me/5548988559491?text=Ol%C3%A1%21%20Tenho%20interesse%20no%20Curso%20de%20Projetista%203D%20-%20SketchUp%20%2B%20Enscape"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <WhatsappLogo className="w-6 h-6" />
          <span className="hidden md:block text-sm font-medium">
            Dúvidas? Fale conosco
          </span>
        </a>
      </div>

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-400 p-4 shadow-2xl">
          <div className="text-center">
            <button className="w-full bg-white/20 backdrop-blur text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/30 flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5" />
              <span className="text-sm">QUERO DOMINAR AS FERRAMENTAS</span>
            </button>
            <div className="flex items-center justify-center gap-1 mt-2 text-white text-xs">
              <Lightning className="w-3 h-3" />
              <span>ÚLTIMAS VAGAS - 43% OFF</span>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};