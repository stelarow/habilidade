import React, { useState } from 'react';
import { Plus, Minus, Question } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

// FAQ baseado nos dados reais do coursesData.js
const faqData = [
  {
    id: 1,
    question: 'Por que turmas pequenas fazem diferença no aprendizado?',
    answer: 'Turmas de no máximo 5 alunos garantem atenção pessoal para cada pessoa. O professor consegue acompanhar seu ritmo, tirar dúvidas na hora e adaptar as explicações para você. Isso acelera o aprendizado e garante que ninguém fica para trás - diferente de turmas tradicionais com 20-30 alunos onde você precisa disputar a atenção do professor.'
  },
  {
    id: 2,
    question: 'É adequado para pessoas sem conhecimento em informática?',
    answer: 'Sim! Começamos do zero total com Windows 11 e vamos avançando aos poucos até tecnologias avançadas como IA aplicada. Nossa forma de ensinar foi criada especialmente para iniciantes, com acompanhamento pessoal em turmas de no máximo 5 alunos.'
  },
  {
    id: 3,
    question: 'Qual a diferença entre as modalidades Presencial e Online?',
    answer: 'Presencial: aulas na escola com professores especializados, contato direto e ambiente dedicado ao aprendizado. Online: acesso de qualquer lugar com suporte online, flexibilidade de horários. As duas têm o mesmo conteúdo completo e apostilas incluídas.'
  },
  {
    id: 4,
    question: 'As apostilas estão incluídas no preço?',
    answer: 'Sim! Material didático impresso completo dos 8 módulos incluído sem custo adicional. Você recebe apostilas detalhadas de cada módulo para consultar sempre que precisar, além de exercícios práticos para fixar o aprendizado.'
  },
  {
    id: 5,
    question: 'Como a IA está integrada no curso?',
    answer: 'Ensinamos IA de forma prática: ChatGPT para ser mais produtivo, criar imagens e vídeos, automações no trabalho, HARPA AI, D-ID e muito mais. Você vai aprender a usar IA como ferramenta de trabalho real, não só teoria.'
  },
  {
    id: 6,
    question: 'Quanto tempo demora para concluir o curso?',
    answer: 'O curso tem 184,5 horas de conteúdo divididas em 8 módulos. O ritmo é flexível e depende da sua dedicação. Estudando regularmente de 10-15 horas por semana, você pode terminar em mais ou menos 3-4 meses.'
  },
  {
    id: 7,
    question: 'Que tipo de certificado eu recebo?',
    answer: 'Você recebe um Certificado Nacional de 184,5 horas reconhecido em todo o Brasil. O certificado comprova suas habilidades em informática moderna e pode ser usado para comprovar no trabalho.'
  },
  {
    id: 8,
    question: 'Preciso ter computador próprio?',
    answer: 'Para a forma presencial, disponibilizamos computadores na escola. Para online, você precisa ter um computador com Windows 10/11, 8GB de RAM (recomendado 16GB) e internet estável.'
  },
  {
    id: 9,
    question: 'Como funciona o suporte durante o curso?',
    answer: 'Oferecemos suporte para sempre! Durante o curso, você tem acompanhamento direto dos professores, tira dúvidas e retorno nos projetos. Depois que terminar, mantemos canal de suporte para perguntas específicas.'
  },
  {
    id: 10,
    question: 'Posso parcelar o pagamento?',
    answer: 'Sim! Oferecemos 3 opções: \n• Boleto bancário: 12x de R$ 299,90\n• Cartão de crédito: 10x de R$ 359,88 sem juros\n• À vista: R$ 3.382,87 (6% de desconto)\n\nTodas as formas de pagamento são 100% seguras e processadas por plataformas confiáveis.'
  },
  {
    id: 11,
    question: 'A garantia de 7 dias é real?',
    answer: 'Com certeza! Se em até 7 dias você não estiver satisfeito com o curso, devolvemos 100% do dinheiro pago sem fazer perguntas. É nossa forma de mostrar total confiança na qualidade do conteúdo e na forma de ensinar.'
  },
  {
    id: 12,
    question: 'Onde fica a escola de informática?',
    answer: 'Nossa escola fica na R. Caetano José Ferreira, 426 - Sala 5, Kobrasol, São José - SC, CEP 88102-280. Perto do Cantinho da Fama e Colégio Municipal Maria Luiza de Melo. Fácil acesso para alunos de Florianópolis, Palhoça e Biguaçu, com bastante estacionamento público nas ruas perto.'
  },
  {
    id: 13,
    question: 'Vocês atendem alunos de outras cidades além de São José?',
    answer: 'Sim! Atendemos alunos de toda a Grande Florianópolis. Muitos dos nossos alunos vêm de Florianópolis (15 min), Palhoça (10 min) e Biguaçu (12 min). Nossa localização no Kobrasol é estratégica e há bastante estacionamento público disponível nas ruas perto para facilitar o acesso.'
  },
  {
    id: 14,
    question: 'Como chegar na escola de informática presencial?',
    answer: 'Estamos na R. Caetano José Ferreira, 426, Kobrasol - região central de São José com fácil acesso pela BR-101. Perto do Cantinho da Fama e Colégio Municipal Maria Luiza de Melo. Várias linhas de ônibus passam pelo Kobrasol, ligando toda a Grande Florianópolis. Há estacionamento público disponível nas ruas perto.'
  },
  {
    id: 15,
    question: 'Tem estacionamento para quem vem de outras cidades?',
    answer: 'Sim! Há bastante estacionamento público perto da escola, na R. Caetano José Ferreira e ruas vizinhas no Kobrasol. É uma das facilidades da localização para quem vem de Florianópolis, Palhoça, Biguaçu e outras cidades da região.'
  },
  {
    id: 16,
    question: 'Qual o horário de funcionamento da escola?',
    answer: 'Funcionamos de segunda a sexta das 8h às 20h (sexta até 17h30) e sábados das 8h às 12h. Oferecemos horários flexíveis para atender pessoas que trabalham durante o dia, incluindo turmas à tarde e à noite.'
  }
];

export const InformaticaFAQ = () => {
  const [openItems, setOpenItems] = useState(new Set([1])); // Primeira pergunta aberta por padrão

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section id="faq" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="container mx-auto max-w-7xl">
        
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">SUAS</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              DÚVIDAS
            </span>
            <br />
            <span className="text-white">RESPONDIDAS</span>
          </h2>
          
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Juntamos as principais dúvidas de nossos mais de 150 alunos.
            Se sua pergunta não estiver aqui, entre em contato conosco!
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((item) => {
              const isOpen = openItems.has(item.id);
              
              return (
                <div 
                  key={item.id}
                  className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
                >
                  {/* Pergunta */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-4 sm:p-5 md:p-6 text-left flex items-center gap-4 hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Question className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white leading-relaxed">
                        {item.question}
                      </h3>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <Minus className="w-6 h-6 text-blue-400" />
                      ) : (
                        <Plus className="w-6 h-6 text-zinc-400" />
                      )}
                    </div>
                  </button>

                  {/* Resposta */}
                  {isOpen && (
                    <div className="border-t border-zinc-700/50 bg-zinc-900/30 p-4 sm:p-5 md:p-6">
                      <div className="pl-12 sm:pl-14">
                        <p className="text-zinc-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA para mais informações */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ainda tem dúvidas?
            </h3>
            
            <p className="text-zinc-300 text-lg mb-6">
              Nossa equipe está pronta para tirar todas as suas dúvidas
              e ajudar você a tomar a melhor decisão.
            </p>
            
            <button 
              onClick={() => handleCTAClick('faq')}
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <Question className="w-5 h-5" />
              FALAR COM ESPECIALISTA
            </button>
            
            <p className="text-zinc-400 text-sm mt-4">
              📱 Resposta rápida via WhatsApp
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};