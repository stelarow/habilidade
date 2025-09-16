import React from 'react';
import { MapPin, Car, Bus, Clock, Phone } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

export const InformaticaNovaLocationSection = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-zinc-900/50">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header da seção */}
        <div className="text-center mb-12">
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 bg-clip-text text-transparent">NOSSA ESCOLA</span>
            <br />
            <span className="text-white">EM SÃO JOSÉ</span>
          </h2>
          
          <p className="text-xl text-zinc-300 mb-8 max-w-3xl mx-auto">
            Localizada estrategicamente em São José, atendemos com excelência 
            alunos de toda a <strong className="text-cyan-400">Grande Florianópolis</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          
          {/* Informações de Localização */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Endereço Principal */}
            <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Escola Habilidade</h3>
                  <p className="text-zinc-300 mb-4">
                    R. Caetano José Ferreira, 426 - Sala 5<br />
                    Kobrasol, São José - SC<br />
                    CEP 88102-280
                  </p>
                  <button 
                    onClick={() => handleCTAClick('location')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Ver no Google Maps →
                  </button>
                </div>
              </div>
            </div>

            {/* Cidades Atendidas */}
            <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-2xl p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Bus className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                Atendemos Toda a Região
              </h3>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div className="text-zinc-300">
                  <div className="font-semibold text-white mb-1">São José</div>
                  <div className="text-sm">Sede da escola</div>
                </div>
                <div className="text-zinc-300">
                  <div className="font-semibold text-white mb-1">Florianópolis</div>
                  <div className="text-sm">15 min de distância</div>
                </div>
                <div className="text-zinc-300">
                  <div className="font-semibold text-white mb-1">Palhoça</div>
                  <div className="text-sm">10 min de distância</div>
                </div>
                <div className="text-zinc-300">
                  <div className="font-semibold text-white mb-1">Biguaçu</div>
                  <div className="text-sm">12 min de distância</div>
                </div>
              </div>
            </div>

          </div>

          {/* Facilidades de Acesso */}
          <div className="space-y-6">
            
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur border border-blue-500/30 rounded-2xl p-4 sm:p-6 lg:p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Fácil Acesso</h3>
              
              <div className="space-y-4 sm:space-y-6">
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Estacionamento Público</div>
                    <div className="text-zinc-300 text-sm">Ampla disponibilidade nas ruas próximas</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bus className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Transporte Público</div>
                    <div className="text-zinc-300 text-sm">Próximo a linhas de ônibus de todas as cidades</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Horários Flexíveis</div>
                    <div className="text-zinc-300 text-sm">Manhã, tarde e noite para sua conveniência</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Atendimento Local</div>
                    <div className="text-zinc-300 text-sm">Suporte presencial em São José</div>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA de Contato */}
            <div className="text-center">
              <button 
                onClick={() => handleCTAClick('location-contact')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1"
              >
                FALAR SOBRE LOCALIZAÇÃO
              </button>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
};