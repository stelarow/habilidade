import { MapPin, Phone, Heart, Clock, InstagramLogo, WhatsappLogo } from "phosphor-react";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4 gradient-text">Escola Habilidade</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Transformando vidas através da educação profissional de qualidade.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-cyan-400">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-start justify-center md:justify-start gap-3">
                <MapPin size={18} className="text-fuchsia-400 mt-0.5 flex-shrink-0" />
                <div className="text-zinc-300 text-sm leading-relaxed">
                  <div>R. Caetano José Ferreira, 426 - Sala 5</div>
                  <div>Kobrasol, São José - SC</div>
                  <div>88102-280</div>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Phone size={18} className="text-fuchsia-400" />
                <span className="text-zinc-300 text-sm">(48) 9 8855-9491</span>
              </div>
              <div className="flex items-start justify-center md:justify-start gap-3">
                <Clock size={18} className="text-fuchsia-400 mt-0.5 flex-shrink-0" />
                <div className="text-zinc-300 text-sm leading-relaxed">
                  <div>Segunda a sexta: 08h às 18h</div>
                  <div>Sábado: 08h às 12h</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-cyan-400">Contato Rápido</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a 
                href="https://wa.me/5548988559491"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:border-green-400 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_#10b981aa]"
                aria-label="WhatsApp da Escola Habilidade"
              >
                <WhatsappLogo size={20} className="text-green-400" />
              </a>
              <a 
                href="https://instagram.com/habilidade.escola" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-500/30 hover:border-fuchsia-400 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_#e879f9aa]"
                aria-label="Instagram da Escola Habilidade"
              >
                <InstagramLogo size={20} className="text-fuchsia-400" />
              </a>
            </div>
            <div className="text-zinc-300 text-xs mt-3 space-y-1">
              <p>WhatsApp: (48) 9 8855-9491</p>
              <p>Instagram: @habilidade.escola</p>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-6"></div>
        
        <div className="text-center">
          <p className="text-zinc-400 text-sm flex items-center justify-center gap-1">
            © 2024 Escola Habilidade. Feito com 
            <Heart size={16} className="text-red-400 animate-pulse" weight="fill" />
            para nossos alunos.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 