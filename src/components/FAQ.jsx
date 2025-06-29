import { useState } from 'react';
import { CaretDown, Question } from 'phosphor-react';
import Section from './Section';
import useInView from '../hooks/useInView';
import GradientButton from './GradientButton';

const FAQ_DATA = [
  {
    question: "Quais são os pré-requisitos para os cursos?",
    answer: "A maioria dos nossos cursos não exige conhecimento prévio. Oferecemos desde níveis básicos até avançados. Para cursos específicos como programação avançada, indicamos ter conhecimento básico de lógica."
  },
  {
    question: "Os cursos oferecem certificado?",
    answer: "Sim! Todos os nossos cursos oferecem certificação nacional reconhecida. O certificado é emitido após a conclusão do curso e aprovação nas avaliações."
  },
  {
    question: "Qual é a duração dos cursos?",
    answer: "A duração varia conforme o curso. Temos cursos de 40h (1 mês) até 120h (3 meses). Consulte a carga horária específica de cada curso em nossa grade."
  },
  {
    question: "Como funcionam as aulas?",
    answer: "Nossas aulas são presenciais com metodologia prática. Cada aluno tem acesso a um computador equipado com todos os softwares necessários. Turmas pequenas garantem atenção individualizada."
  },
  {
    question: "Vocês oferecem suporte após o curso?",
    answer: "Sim! Oferecemos suporte pós-curso por 6 meses via WhatsApp para dúvidas técnicas. Também temos um grupo exclusivo de ex-alunos para networking e oportunidades."
  },
  {
    question: "Há desconto para pagamento à vista?",
    answer: "Sim! Oferecemos 10% de desconto para pagamento à vista. Também temos parcelamento em até 12x sem juros no cartão de crédito."
  },
  {
    question: "Posso fazer mais de um curso?",
    answer: "Claro! Incentivamos nossos alunos a expandirem suas habilidades. Oferecemos 15% de desconto para o segundo curso e 20% a partir do terceiro curso."
  },
  {
    question: "Como faço para me matricular?",
    answer: "Entre em contato conosco pelo WhatsApp (48) 98855-9491 ou preencha o formulário de contato. Nossa equipe irá esclarecer todas as dúvidas e auxiliar com a matrícula."
  }
];

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  const [ref, visible] = useInView();
  
  return (
    <div 
      ref={ref}
      className={`card-enter ${visible ? 'in-view' : ''} bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700/50 overflow-hidden transition-all duration-300 hover:border-zinc-600/50`}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-700/30 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-inset"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-white pr-4">{question}</span>
        <CaretDown 
          size={20} 
          className={`text-fuchsia-400 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-4 text-zinc-300 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set([0]));

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
    <Section id="faq" className="py-16 bg-zinc-900 min-h-0">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Question size={32} className="text-fuchsia-400" />
            <h2 className="text-3xl sm:text-5xl font-bold text-white">
              Perguntas Frequentes
            </h2>
          </div>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossos cursos, metodologia e processo de matrícula
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openItems.has(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-zinc-400 mb-4">
            Não encontrou sua resposta?
          </p>
          <GradientButton
            href="https://wa.me/5548988559491?text=Olá! Ainda tenho uma dúvida a respeito dos cursos, pode me ajudar?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 hover:scale-105"
          >
            <Question size={20} />
            Fale Conosco
          </GradientButton>
        </div>
      </div>
    </Section>
  );
};

export default FAQ;