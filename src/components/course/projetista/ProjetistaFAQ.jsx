import { 
  Question, 
  CaretDown
} from '@phosphor-icons/react';
import { useState } from 'react';

const faqData = [
  {
    id: 1,
    question: "Qual a vantagem de aprender SketchUp e Enscape juntos?",
    answer: "SketchUp é a ferramenta de modelagem 3D mais intuitiva do mercado, e o Enscape é o motor de renderização em tempo real mais utilizado por profissionais. Juntos, eles formam a combinação perfeita para criar projetos fotorrealísticos de forma rápida e eficiente."
  },
  {
    id: 2,
    question: "Como funciona a renderização com Enscape?",
    answer: "O Enscape funciona em tempo real integrado ao SketchUp. Você modela no SketchUp e vê o resultado renderizado instantaneamente no Enscape, permitindo ajustes imediatos de materiais, iluminação e câmeras. É possível criar walkthroughs, panoramas 360° e renders de alta qualidade em poucos cliques."
  },
  {
    id: 3,
    question: "Preciso saber outro software 3D para fazer o curso?",
    answer: "Não! Este curso foi desenvolvido para quem está começando do zero. Ensinaremos desde os conceitos básicos até técnicas avançadas. Se você já tem experiência com outros softwares 3D, isso será uma vantagem, mas não é obrigatório."
  },
  {
    id: 4,
    question: "Quanto ganha um projetista 3D em Santa Catarina?",
    answer: "Um projetista 3D iniciante em SC ganha entre R$ 2.500 a R$ 4.000. Com experiência, pode chegar a R$ 6.000 a R$ 10.000 mensais. Como freelancer, é possível faturar R$ 8.000 a R$ 15.000 mensais, dependendo da carteira de clientes e especialização."
  },
  {
    id: 5,
    question: "Existe um curso de SketchUp certificado em Florianópolis?",
    answer: "Sim! Somos uma escola certificada e reconhecida, oferecendo certificados nacionais de 56 horas. Nossa certificação é válida em todo território nacional e reconhecida por empresas da região metropolitana de Florianópolis."
  },
  {
    id: 6,
    question: "Posso trabalhar como freelancer após o curso?",
    answer: "Absolutamente! Muitos de nossos alunos se tornaram freelancers de sucesso. Durante o curso, você desenvolverá um portfólio completo e aprenderá sobre precificação, relacionamento com clientes e estratégias para conquistar projetos."
  },
  {
    id: 7,
    question: "O que está incluído no curso de SketchUp e Enscape?",
    answer: "56 horas de aulas práticas presenciais, apostila impressa de 360 páginas, acesso aos softwares durante as aulas, templates e bibliotecas prontas, certificado nacional, material didático completo e suporte individualizado em turmas de máximo 4 alunos."
  }
];

export const ProjetistaFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-zinc-900/50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm font-medium text-purple-400">
            <Question className="w-4 h-4" />
            DÚVIDAS FREQUENTES
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">PERGUNTAS</span>
            <br />
            <span className="text-white">MAIS COMUNS</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((faq) => (
              <div 
                key={faq.id}
                className="relative rounded-2xl bg-zinc-800/50 backdrop-blur border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </span>
                  <CaretDown 
                    className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform duration-300 ${
                      openFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-zinc-700 pt-4">
                      <p className="text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};