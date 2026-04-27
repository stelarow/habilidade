import React, { useState } from 'react';
import { CaretDown, CaretUp, Question, CheckCircle } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { ScrollReveal } from '../../../components/shared/ScrollReveal';

const faqs = [
  {
    id: 1,
    question: 'Funciona para qualquer tipo de negócio?',
    answer: 'Sim! As estratégias se aplicam a e-commerce, serviços, infoprodutos, profissionais liberais e empresas B2B. Cada módulo traz exemplos práticos para diferentes contextos.'
  },
  {
    id: 2,
    question: 'Qual a diferença entre as modalidades Presencial e Online?',
    answer: 'Presencial: aulas na escola com instrutores especializados. Online: acesso remoto com suporte. Mesmo conteúdo completo e apostilas inclusas em ambas.'
  },
  {
    id: 3,
    question: 'As apostilas estão incluídas no preço?',
    answer: 'Sim! Material didático impresso completo dos 9 módulos incluso sem custo adicional. Sua referência permanente para consultas.'
  },
  {
    id: 4,
    question: 'Preciso ter experiência prévia em marketing?',
    answer: 'Não! O curso foi desenvolvido para iniciantes e profissionais que desejam atualizar seus conhecimentos. Começamos com fundamentos e evoluímos até estratégias avançadas.'
  },
  {
    id: 5,
    question: 'O curso inclui certificação?',
    answer: 'Sim! Ao concluir o curso, você recebe certificado profissional reconhecido que pode ser usado para comprovação profissional no mercado de trabalho.'
  },
  {
    id: 6,
    question: 'Posso trabalhar como marketer digital após o curso?',
    answer: 'Sim! O mercado de marketing digital está em constante crescimento. Nossos alunos trabalham em agências, departamentos de marketing, como consultores independentes ou em cargos de Social Media, SEO e Analytics.'
  },
  {
    id: 7,
    question: 'O curso é presencial ou online?',
    answer: 'Oferecemos modalidades presencial e online para você escolher a que melhor se adapta à sua rotina. As aulas presenciais são ministradas em São José, no Kobrasol, com turmas reduzidas para maior aproveitamento.'
  },
  {
    id: 8,
    question: 'O módulo de Chat GPT está incluso?',
    answer: 'Sim! O módulo de Chat GPT para Marketing está incluso e ensina desde o básico até técnicas avançadas de prompt engineering para criar conteúdo, automatizar processos e otimizar campanhas.'
  }
];

export const MarketingDigitalFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (faqId) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  return (
    <section id="faq" className="px-6 py-20 lg:py-24 bg-[#000000]">
      <div className="container mx-auto max-w-4xl">
        {/* Header - Bugatti style */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[3px] text-white mb-6 uppercase">
              Perguntas{' '}
              <span className="text-[#c3d9f3]">Frequentes</span>
            </h2>
            <p className="text-lg text-[#cccccc] max-w-2xl mx-auto font-serif">
              Tire suas dúvidas sobre o curso de Marketing Digital
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ List */}
        <ScrollReveal animation="fade-up" delay={0.2}>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`border transition-all duration-300 ${
                  openFAQ === faq.id
                    ? 'border-[#c3d9f3]/30 bg-[#0d0d0d]'
                    : 'border-[#262626] bg-[#141414] hover:border-[#3a3a3a]'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-center gap-4"
                >
                  <Question className={`w-5 h-5 flex-shrink-0 ${
                    openFAQ === faq.id ? 'text-[#c3d9f3]' : 'text-[#999999]'
                  }`} />
                  <span className={`flex-grow text-left font-normal tracking-wider ${
                    openFAQ === faq.id ? 'text-white' : 'text-[#e6e6e6]'
                  }`}>
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openFAQ === faq.id ? (
                      <CaretUp className="w-5 h-5 text-[#999999]" />
                    ) : (
                      <CaretDown className="w-5 h-5 text-[#999999]" />
                    )}
                  </div>
                </button>

                {openFAQ === faq.id && (
                  <div className="px-6 pb-6 border-t border-[#262626] pt-4">
                    <p className="text-[#cccccc] font-serif leading-relaxed pl-9">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Still have questions CTA */}
        <ScrollReveal animation="zoom-in" delay={0.3}>
          <div className="text-center mt-12 border border-[#262626] bg-[#0d0d0d] p-8">
            <h3 className="text-xl font-normal text-white tracking-[1.5px] uppercase mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-[#cccccc] font-serif mb-6">
              Nossa equipe está pronta para esclarecer todas as suas questões
            </p>
            <button
              onClick={() => handleCTAClick('faq')}
              className="inline-flex items-center px-10 py-4 border border-white text-white font-mono text-sm tracking-[2.5px] uppercase rounded-full hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              Falar com Consultor
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};