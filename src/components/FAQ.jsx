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
    question: "Qual curso tem mais chance de conseguir emprego rápido em São José?",
    answer: "Nossos cursos de Projetista (SketchUp + Enscape), Programação, Design Gráfico e Marketing Digital são os que mais colocam profissionais no mercado na Grande Florianópolis. Com metodologia 80% prática, você desenvolve portfolio real durante o curso. Estatisticamente, cursos técnicos como Desenvolvimento de Sistemas têm 76,7% de empregabilidade, mas nosso diferencial é a preparação específica para o mercado local."
  },
  {
    question: "A Escola Habilidade oferece cursos técnicos gratuitos como o SENAI?",
    answer: "Nossos cursos são investimento acessível com resultado superior ao ensino técnico tradicional. Diferente dos cursos gratuitos que priorizam teoria, oferecemos mentoria individualizada, turmas pequenas e projetos reais. O retorno do investimento acontece rapidamente através das oportunidades de trabalho e freelances que nossos alunos conseguem."
  },
  {
    question: "Qual a diferença da Escola Habilidade para o SENAI e IFSC de São José?",
    answer: "Enquanto instituições técnicas focam em certificação, priorizamos empregabilidade real. Turmas pequenas vs. turmas de 40+ alunos, professores do mercado vs. professores acadêmicos, projetos reais vs. exercícios teóricos. Nossos alunos começam a trabalhar antes mesmo de formar, diferente do modelo tradicional."
  },
  {
    question: "Por que escolher curso profissionalizante ao invés de curso técnico em São José?",
    answer: "Cursos profissionalizantes são mais rápidos, práticos e alinhados com demandas reais das empresas. Não há burocracia de certificação técnica, permitindo atualização constante do conteúdo. Você aprende exatamente o que o mercado precisa, não grade curricular desatualizada de instituições técnicas."
  },
  {
    question: "Quais empresas de São José contratam alunos da Escola Habilidade?",
    answer: "Temos parcerias com escritórios de arquitetura do centro de São José, agências de marketing da região e empresas de tecnologia da Grande Florianópolis. Nossa localização estratégica próxima ao Terminal Central facilita o networking com empresas parceiras que conhecem a qualidade dos nossos alunos."
  },
  {
    question: "Como funciona o estacionamento para alunos no centro de Kobrasol?",
    answer: "Estamos localizados no centro de Kobrasol em uma rua estratégica paralela onde é possível estacionar tranquilamente. Temos vagas gratuitas na rua, incluindo frequentemente na frente da escola. Também somos facilmente acessíveis por transporte público, com várias linhas de ônibus que param próximo à escola."
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