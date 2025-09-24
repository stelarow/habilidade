import React, { useState } from 'react';
import { Plus, Minus } from '@phosphor-icons/react';

export const ProgramacaoNovaFAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const faqs = [
    {
      question: "Preciso ter conhecimento prévio em programação?",
      answer: "Não! Nosso curso é desenvolvido para iniciantes. Começamos do zero, ensinando lógica de programação e conceitos fundamentais de forma gradual e prática."
    },
    {
      question: "Que linguagens de programação vou aprender?",
      answer: "Você aprenderá Python (ideal para iniciantes), JavaScript (para web), HTML5 e CSS3. Também abordamos Git para controle de versão e conceitos de IA aplicada à programação."
    },
    {
      question: "Como funcionam as aulas práticas?",
      answer: "Cada aula combina teoria e prática. Você desenvolverá projetos reais desde o primeiro módulo, criando um portfólio completo ao final do curso."
    },
    {
      question: "Recebo certificado ao final?",
      answer: "Sim! Você recebe um certificado nacional de 170 horas, reconhecido em todo o território brasileiro, que comprova sua capacitação em programação."
    },
    {
      question: "Posso trabalhar como programador após o curso?",
      answer: "Sim! Nosso curso prepara você para oportunidades júnior no mercado. Muitos alunos conseguem emprego ou começam a freelance em até 6 meses após a conclusão."
    },
    {
      question: "E se eu não conseguir acompanhar o curso?",
      answer: "Oferecemos suporte individualizado e aulas de reforço quando necessário. Nosso compromisso é com seu aprendizado e sucesso na programação."
    }
  ];

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-20 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Perguntas <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Frequentes</span>
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Tire suas principais dúvidas sobre o curso de programação
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openItems.has(index);
            return (
              <div key={index} className="bg-zinc-900 rounded-xl border border-zinc-800">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  {isOpen ? (
                    <Minus className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  ) : (
                    <Plus className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-zinc-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};