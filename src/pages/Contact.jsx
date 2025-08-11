import React from 'react';
import ContactForm from '../components/ContactForm';
import SEOHead from '../components/shared/SEOHead';
import { MapPin, Phone, Envelope, Clock, Users } from '@phosphor-icons/react';

const Contact = () => {
  return (
    <>
      <SEOHead
        title="Contato - Escola Habilidade | Entre em contato conosco"
        description="Entre em contato com a Escola Habilidade. Tire suas dúvidas sobre nossos cursos profissionalizantes em Florianópolis, São José e Palhoça. Estamos aqui para ajudar!"
        keywords="contato escola habilidade, falar com escola habilidade, dúvidas cursos florianópolis, contato cursos são josé, atendimento escola técnica"
        path="/contato"
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Header */}
        <div className="pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Entre em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Contato</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Estamos aqui para esclarecer suas dúvidas e ajudar você a escolher o curso ideal para sua carreira
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div className="space-y-8">
              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Users className="text-blue-400" size={28} />
                  Informações de Contato
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-blue-400 mt-1" size={24} />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Endereço</h3>
                      <p className="text-gray-300">
                        Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol<br />
                        São José, SC - CEP: 88102-280
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="text-green-400 mt-1" size={24} />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Telefones</h3>
                      <p className="text-gray-300">
                        WhatsApp: (48) 98855-9491<br />
                        Fixo: (48) 3206-5246
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Envelope className="text-purple-400 mt-1" size={24} />
                    <div>
                      <h3 className="text-white font-semibold mb-1">E-mail</h3>
                      <p className="text-gray-300">
                        contato@escolahabilidade.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="text-orange-400 mt-1" size={24} />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Horário de Atendimento</h3>
                      <p className="text-gray-300">
                        Segunda a Sexta: 08:00 às 18:00<br />
                        Sábado: 08:00 às 12:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mapa ou informações adicionais */}
              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">
                  Como Chegar
                </h3>
                <p className="text-gray-300 mb-4">
                  Nossa escola fica no coração de Kobrasol, em São José, com fácil acesso para toda a Grande Florianópolis.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>• Próximo ao Shopping Kobrasol</p>
                  <p>• Fácil acesso de ônibus</p>
                  <p>• Estacionamento disponível na região</p>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* FAQ rápido */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Perguntas Frequentes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Como faço a matrícula?</h3>
                  <p className="text-gray-300 text-sm">
                    Entre em contato conosco pelo formulário ou WhatsApp. Nossa equipe irá orientar todo o processo.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Os cursos têm certificado?</h3>
                  <p className="text-gray-300 text-sm">
                    Sim, todos os nossos cursos oferecem certificado reconhecido e válido nacionalmente.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Posso visitar a escola?</h3>
                  <p className="text-gray-300 text-sm">
                    Claro! Agende uma visita e conheça nossa estrutura e metodologia de ensino.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Há desconto para pagamento à vista?</h3>
                  <p className="text-gray-300 text-sm">
                    Sim, oferecemos condições especiais. Entre em contato para conhecer nossas promoções.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;