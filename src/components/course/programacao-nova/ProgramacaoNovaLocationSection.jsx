import React from 'react';
import { MapPin, Phone, Clock } from '@phosphor-icons/react';

export const ProgramacaoNovaLocationSection = () => {
  return (
    <section className="py-20 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Localização</span> e Horários
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Aulas presenciais na Grande Florianópolis com horários flexíveis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Endereço</h3>
                <p className="text-zinc-300">
                  R. Caetano José Ferreira, 426 - Sala 5<br />
                  Kobrasol, São José - SC<br />
                  CEP 88102-280<br />
                  <span className="text-purple-400">Próximo ao centro de São José</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Contato</h3>
                <p className="text-zinc-300">
                  <span className="text-blue-400">(48) 98855-9491</span><br />
                  WhatsApp disponível 24h<br />
                  contato@escolahabilidade.com.br
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Horários</h3>
                <p className="text-zinc-300">
                  <span className="text-green-400">Manhã:</span> 08h às 12h<br />
                  <span className="text-green-400">Tarde:</span> 14h às 18h<br />
                  <span className="text-green-400">Noite:</span> 19h às 23h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">Cidades Atendidas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <span className="text-white font-medium">São José</span>
                <span className="text-purple-400 text-sm">Sede principal</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <span className="text-white font-medium">Florianópolis</span>
                <span className="text-blue-400 text-sm">15 min</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <span className="text-white font-medium">Palhoça</span>
                <span className="text-green-400 text-sm">10 min</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <span className="text-white font-medium">Biguaçu</span>
                <span className="text-cyan-400 text-sm">20 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};