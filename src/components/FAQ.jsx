import { useState } from 'react';
import { CaretDown, Question } from '@phosphor-icons/react';
import Section from './Section';
import useInView from '../hooks/useInView';
import GradientButton from './GradientButton';

const FAQ_DATA = [
  {
    question: "A Escola Habilidade fica bem localizada em São José?",
    answer: "Sim! Estamos estrategicamente localizados no centro de São José, próximo ao Terminal Central, Shopping Pátio São José e fácil acesso pela BR-101. Nossa localização privilegiada permite chegada fácil por transporte público (várias linhas de ônibus) e oferece estacionamento gratuito para estudantes. Atendemos toda a Grande Florianópolis, especialmente São José, Palhoça e Biguaçu."
  },
  {
    question: "Vocês têm parcerias com empresas de São José e região?",
    answer: "Sim! Temos parcerias ativas com mais de 50 empresas da Grande Florianópolis, incluindo escritórios de arquitetura, agências de marketing, desenvolvedoras e empresas de tecnologia. Nossos alunos desenvolvem projetos reais durante o curso e muitos são contratados diretamente por empresas parceiras. Mantemos um programa de indicação profissional exclusivo."
  },
  {
    question: "Qual a diferença entre curso técnico e curso profissionalizante na Escola Habilidade?",
    answer: "Nossos cursos profissionalizantes são 100% focados na prática profissional. Diferente de cursos técnicos convencionais, investimos 80% do tempo em projetos reais e apenas 20% em teoria. Isso significa que você sai preparado para o mercado de trabalho desde o primeiro dia, com portfolio robusto e experiência prática que os empregadores valorizam."
  },
  {
    question: "Quais cursos a Escola Habilidade oferece?",
    answer: "Oferecemos 6 cursos principais: Projetista (SketchUp/AutoCAD), Edição de Vídeo, Design Gráfico, Programação, Marketing Digital e BI/Inteligência Artificial. Todos são cursos práticos com projetos reais, certificação reconhecida pelo mercado e suporte para colocação profissional. Cada curso é personalizado conforme demanda do mercado regional."
  },
  {
    question: "Como é a metodologia de ensino da Escola Habilidade?",
    answer: "Nossa metodologia única \"Prática Primeiro\" combina projetos reais com mentoria individualizada. Turmas pequenas (máximo 12 alunos), professores especialistas do mercado e 80% do tempo dedicado à prática. Você desenvolve portfolio profissional durante o curso e recebe orientação personalizada para sua área de interesse."
  },
  {
    question: "Por que a Escola Habilidade tem avaliação 5.0 estrelas?",
    answer: "Nossa nota máxima reflete o compromisso com resultados reais: metodologia prática, acompanhamento individualizado e foco na preparação para o mercado de trabalho. Diferente de instituições grandes, priorizamos qualidade sobre quantidade, com turmas reduzidas e atenção personalizada a cada aluno."
  },
  {
    question: "A Escola Habilidade ajuda na colocação profissional?",
    answer: "Sim! Oferecemos apoio através de nossa rede de empresas parceiras que conhecem a qualidade dos nossos alunos, programa de preparação para freelancers com projetos reais e orientação para desenvolvimento de carreira. Nosso foco é preparar você com as habilidades e portfolio que o mercado busca."
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