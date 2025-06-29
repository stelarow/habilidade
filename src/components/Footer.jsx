import { MapPin, Phone, Heart, Clock } from "phosphor-react";

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
              <div className="flex items-center justify-center md:justify-start gap-3">
                <MapPin size={18} className="text-fuchsia-400" />
                <span className="text-zinc-300 text-sm">Endereço da Escola</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Phone size={18} className="text-fuchsia-400" />
                <span className="text-zinc-300 text-sm">(11) 9999-9999</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Clock size={18} className="text-fuchsia-400" />
                <span className="text-zinc-300 text-sm">Seg-Sex: 8h às 18h</span>
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-cyan-400">Horário</h4>
            <p className="text-zinc-300 text-sm">
              Segunda à Sexta: 8h às 18h<br />
              Sábado: 8h às 12h
            </p>
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