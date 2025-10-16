import React from 'react';
import { MapPin, Phone, Envelope, Clock, MapTrifold } from '@phosphor-icons/react';

const LocationSection = () => {
  // Coordenadas e links do Google Maps - Escola Habilidade (Place ID correto)
  const mapEmbedUrl = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8!2d-48.6149943!3d-27.5923906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9527492f4454ef8d:0xd345f5e77312fdec!2sEscola%20Habilidade!5e0!3m2!1spt-BR!2sbr!4v1697000000000!5m2!1spt-BR!2sbr';

  const mapDirectLink = import.meta.env.VITE_GOOGLE_MAPS_LINK ||
    'https://www.google.com/maps/place/Escola+Habilidade/@-27.5923906,-48.6149943,17z/data=!3m1!4b1!4m6!3m5!1s0x9527492f4454ef8d:0xd345f5e77312fdec!8m2!3d-27.5923906!4d-48.6149943!16s%2Fg%2F11w49mrz34';

  const locationInfo = [
    {
      icon: <MapPin size={28} className="text-fuchsia-500" weight="duotone" />,
      title: 'Endereço',
      content: (
        <>
          Rua Caetano José Ferreira, 426 - Sala 5<br />
          Kobrasol, São José - SC<br />
          CEP: 88102-280
        </>
      ),
      accent: 'fuchsia'
    },
    {
      icon: <Phone size={28} className="text-blue-400" weight="duotone" />,
      title: 'Contato',
      content: (
        <>
          <a href="https://wa.me/5548988559491" target="_blank" rel="noopener noreferrer"
             className="hover:text-blue-300 transition-colors">
            WhatsApp: (48) 98855-9491
          </a><br />
          <a href="tel:+554832065246" className="hover:text-blue-300 transition-colors">
            Fixo: (48) 3206-5246
          </a>
        </>
      ),
      accent: 'blue'
    },
    {
      icon: <Envelope size={28} className="text-purple-600" weight="duotone" />,
      title: 'E-mail',
      content: (
        <a href="mailto:contato@escolahabilidade.com"
           className="hover:text-purple-400 transition-colors">
          contato@escolahabilidade.com
        </a>
      ),
      accent: 'purple'
    },
    {
      icon: <Clock size={28} className="text-orange-400" weight="duotone" />,
      title: 'Horário de Atendimento',
      content: (
        <>
          <span className="block">Segunda a Quinta: 08:00 às 20:00</span>
          <span className="block">Quarta-feira: 08:00 às 22:00</span>
          <span className="block">Sexta-feira: 08:00 às 17:30</span>
          <span className="block">Sábado: 08:00 às 12:00</span>
        </>
      ),
      accent: 'orange'
    }
  ];

  return (
    <section id="localizacao" className="py-16 bg-zinc-900">
      {/* 60% - Cor Dominante: bg-zinc-900 (fundo) */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Header da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Onde <span className="gradient-text">Estamos</span>
          </h2>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
            {/* 30% - Cor Secundária: text-zinc-300 */}
            Venha nos visitar! Estamos no coração de Kobrasol, São José,
            com fácil acesso para toda a Grande Florianópolis.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Coluna Esquerda - Informações (40%) */}
          <div className="lg:col-span-2 space-y-6">
            {locationInfo.map((item, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6
                           hover:border-zinc-600/50 transition-all duration-300
                           hover:shadow-lg hover:shadow-zinc-900/50"
              >
                {/* 60% - Fundo: bg-zinc-800/50 */}
                {/* 30% - Borda: border-zinc-700/50 */}
                <div className="flex items-start gap-4">
                  {/* 10% - Accent: ícones coloridos */}
                  <div className="flex-shrink-0 mt-1">
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {/* 30% - Texto principal: text-white */}
                      {item.title}
                    </h3>
                    <div className="text-zinc-300 text-sm leading-relaxed">
                      {/* 30% - Texto secundário: text-zinc-300 */}
                      {item.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA Button - 10% Accent */}
            <a
              href={mapDirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-fuchsia-600 to-blue-600
                         hover:from-fuchsia-500 hover:to-blue-500
                         text-white font-semibold py-4 px-6 rounded-xl
                         transition-all duration-300 text-center
                         flex items-center justify-center gap-3
                         shadow-lg hover:shadow-xl hover:shadow-fuchsia-900/30"
            >
              <MapTrifold size={24} weight="duotone" />
              Abrir no Google Maps
            </a>
          </div>

          {/* Coluna Direita - Mapa (60%) */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-4
                            shadow-xl hover:shadow-2xl transition-shadow duration-300">
              {/* 60% - Fundo: bg-zinc-800/50 */}
              {/* 30% - Borda: border-zinc-700/50 */}

              <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da Escola Habilidade em Kobrasol, São José - SC"
                  className="absolute inset-0 w-full h-full"
                  aria-label="Mapa interativo mostrando a localização da Escola Habilidade"
                ></iframe>

                {/* Loading skeleton - opcional */}
                <div className="absolute inset-0 bg-zinc-800 animate-pulse -z-10 rounded-xl">
                  <div className="flex items-center justify-center h-full">
                    <MapPin size={48} className="text-zinc-600" />
                  </div>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="mt-4 pt-4 border-t border-zinc-700/50">
                <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-fuchsia-500 rounded-full"></span>
                    Próximo ao Shopping Kobrasol
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    Fácil acesso de ônibus
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    Estacionamento na rua
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            {/* 30% - Texto terciário: text-zinc-500 */}
            Atendemos alunos de Florianópolis, São José, Palhoça, Biguaçu e toda a Grande Florianópolis
          </p>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
