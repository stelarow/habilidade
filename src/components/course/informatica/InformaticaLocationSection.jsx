import React from 'react';
import { MapPin, Car, Bus, Clock, Phone } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

export const InformaticaLocationSection = () => {
  return (
    <section id="localizacao" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24 bg-zinc-900">
      <div className="container mx-auto max-w-7xl">

        {/* Header da seção - 60% dominante (zinc) + 10% destaque (cyan) */}
        <div className="text-center mb-16">

          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-cyan-400">NOSSA ESCOLA</span>
            <br />
            <span className="text-white">EM SÃO JOSÉ</span>
          </h2>

          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            Localizada estrategicamente em São José, atendemos com excelência
            alunos de toda a <span className="text-cyan-400 font-semibold">Grande Florianópolis</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Informações de Localização */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Endereço Principal - 60% zinc + 30% blue */}
            <Card className="bg-zinc-800 border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-500" weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-white mb-3 font-bold">Escola Habilidade</CardTitle>
                    <p className="text-zinc-300 text-base leading-relaxed mb-4">
                      R. Caetano José Ferreira, 426 - Sala 5<br />
                      Kobrasol, São José - SC<br />
                      CEP 88102-280
                    </p>
                    <a
                      href="https://www.google.com/maps/place/Escola+Habilidade/@-27.5923906,-48.6175692,17z/data=!3m1!4b1!4m6!3m5!1s0x9527492f4454ef8d:0xd345f5e77312fdec!8m2!3d-27.5923906!4d-48.6149943!16s%2Fg%2F11w49mrz34"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-500 hover:text-cyan-400 transition-colors font-semibold text-sm"
                    >
                      Ver no Google Maps
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cidades Atendidas - 60% zinc + 30% blue + 10% cyan destaque */}
            <Card className="bg-zinc-800 border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-white flex items-center gap-3 font-bold">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bus className="w-5 h-5 text-blue-500" weight="duotone" />
                  </div>
                  Atendemos Toda a Região
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-base">São José</span>
                      <Badge className="bg-cyan-400 text-zinc-900 border-0 px-3 py-1 hover:bg-cyan-300 font-semibold">
                        Sede
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400">Nossa escola</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-base">Florianópolis</span>
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 border-zinc-600 px-3 py-1">
                        15 min
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400">Fácil acesso</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-base">Palhoça</span>
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 border-zinc-600 px-3 py-1">
                        10 min
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400">Bem próximo</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-base">Biguaçu</span>
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 border-zinc-600 px-3 py-1">
                        12 min
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400">Acesso rápido</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Mapa e Facilidades de Acesso */}
          <div className="space-y-6">

            {/* Google Maps - Manter original */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-2 overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.5!2d-48.6149943!3d-27.5923906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9527492f4454ef8d%3A0xd345f5e77312fdec!2sEscola%20Habilidade!5e0!3m2!1spt-BR!2sbr!4v1641234567890!5m2!1spt-BR!2sbr"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: '1rem' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da Escola Habilidade - R. Caetano José Ferreira, 426, Kobrasol, São José - SC"
                className="w-full"
              />
            </div>

            {/* Facilidades de Acesso - 60% zinc + 30% blue */}
            <Card className="bg-zinc-800 border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-white font-bold">Facilidades de Acesso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-blue-500" weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1 text-base">Estacionamento Público</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Ampla disponibilidade nas ruas próximas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bus className="w-5 h-5 text-blue-500" weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1 text-base">Transporte Público</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Próximo a linhas de ônibus de todas as cidades</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-500" weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1 text-base">Horários Flexíveis</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Manhã, tarde e noite para sua conveniência</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-500" weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1 text-base">Atendimento Local</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Suporte presencial em São José</p>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* CTA de Contato - 10% cor de destaque (cyan) */}
            <Button
              onClick={() => handleCTAClick('location-contact')}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-zinc-900 font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-[1.02] h-auto text-base"
              size="lg"
            >
              Agendar Visita
            </Button>

          </div>
          
        </div>
      </div>
    </section>
  );
};