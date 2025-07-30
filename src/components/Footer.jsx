import { MapPin, Phone, Heart, Clock, InstagramLogo, WhatsappLogo } from "phosphor-react";
import Section from "./Section";
import LogoH from "./LogoH";

const Footer = () => {
  return (
    <Section className="bg-zinc-950 text-white py-16 min-h-0">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Escola Info */}
          <div className="space-y-4">
            <div className="mb-4">
              <LogoH 
                size="small" 
                animated={false}
                showFullText={true}
                className="mb-2"
              />
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {/* Cache validation test - pipeline fix 2025-07-30 */}
              Transformando vidas através da educação tecnológica. 
              Cursos práticos e atualizados para o mercado de trabalho.
            </p>
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock size={16} />
              <span className="text-sm">Seg-Sex: 8h às 18h</span>
            </div>
          </div>

          {/* Navegação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fuchsia-400">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-zinc-300 hover:text-white transition-colors">Início</a></li>
              <li><a href="#cursos" className="text-zinc-300 hover:text-white transition-colors">Cursos</a></li>
              <li><a href="/blog" className="text-zinc-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#como-funciona" className="text-zinc-300 hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#contato" className="text-zinc-300 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Localização com Mapa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fuchsia-400">Nossa Localização</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-zinc-300">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p>R. Caetano José Ferreira, 426</p>
                  <p>Sala 5 - Kobrasol</p>
                  <p>São José - SC, 88102-280</p>
                </div>
              </div>
              
              {/* Mapa Embed */}
              <div className="mt-4">
                <div className="relative w-full h-32 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.2!2d-48.6372!3d-27.5954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952738c8f0b0b0b0%3A0x1234567890abcdef!2sR.%20Caetano%20Jos%C3%A9%20Ferreira%2C%20426%20-%20Kobrasol%2C%20S%C3%A3o%20Jos%C3%A9%20-%20SC%2C%2088102-280!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização da Escola Habilidade"
                    className="rounded-lg"
                  ></iframe>
                  
                  {/* Overlay clicável */}
                  <div 
                    className="absolute inset-0 bg-transparent cursor-pointer"
                    onClick={() => window.open('https://maps.google.com/?q=R.+Caetano+José+Ferreira,+426+-+Kobrasol,+São+José+-+SC,+88102-280', '_blank')}
                    title="Abrir no Google Maps"
                  ></div>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Clique para abrir no Google Maps
                </p>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fuchsia-400">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-300">
                <Phone size={16} />
                <a 
                  href="tel:+5548988559491" 
                  className="text-sm hover:text-white transition-colors"
                >
                  (48) 98855-9491
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin size={16} />
                <span className="text-sm">Kobrasol - São José/SC</span>
              </div>
            </div>
          </div>

          {/* Contato Rápido */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fuchsia-400">Contato Rápido</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5548988559491"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors group"
              >
                <WhatsappLogo size={20} className="text-white" />
                <div className="text-left">
                  <div className="text-white text-sm font-medium">WhatsApp</div>
                  <div className="text-green-100 text-xs">(48) 98855-9491</div>
                </div>
              </a>
              
              <a
                href="https://instagram.com/habilidade.escola"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all group"
              >
                <InstagramLogo size={20} className="text-white" />
                <div className="text-left">
                  <div className="text-white text-sm font-medium">Instagram</div>
                  <div className="text-purple-100 text-xs">@habilidade.escola</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 pt-8 text-center">
          <p className="text-zinc-400 text-sm flex items-center justify-center gap-2">
            © 2024 Escola Habilidade. Feito com <Heart size={16} className="text-red-500" /> em São José/SC.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Footer; 