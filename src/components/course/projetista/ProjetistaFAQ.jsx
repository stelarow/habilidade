import { 
  Question, 
  CaretDown
} from '@phosphor-icons/react';
import { useState } from 'react';

const faqData = [
  // === PREÇO E INVESTIMENTO ===
  {
    id: 1,
    question: "Qual o valor de um curso de SketchUp?",
    answer: "O curso de SketchUp na Escola Habilidade custa R$ 3.493,00 e pode ser parcelado em 7x de R$ 499 no boleto (tipo mensalidade). Se pagar à vista, fica R$ 3.143,70 (10% de desconto). O curso tem 56 horas de aula e inclui tudo: apostila de 360 páginas, certificado nacional, acesso aos programas e material completo."
  },
  {
    id: 2,
    question: "Quanto é a mensalidade do SketchUp?",
    answer: "Você pode parcelar em 7 mensalidades de R$ 499 no boleto (total R$ 3.493). Também pode pagar à vista com desconto de 10% por R$ 3.143,70. Tá tudo incluído: aulas, apostila, certificado e acesso aos programas."
  },
  {
    id: 3,
    question: "Quanto custa um curso de SketchUp?",
    answer: "Na Escola Habilidade o curso completo de SketchUp e Enscape custa R$ 3.493 parcelado (7x de R$ 499) ou R$ 3.143,70 à vista (com 10% OFF). São 56 horas de aula presencial com turmas pequenas de até 4 alunos. Outros cursos similares cobram entre R$ 3.500 e R$ 5.000."
  },
  {
    id: 4,
    question: "Como conseguir licença para SketchUp grátis?",
    answer: "Existe o SketchUp Free que você usa direto no navegador de graça. Mas ele é bem básico e não tem todas as ferramentas. No nosso curso, você aprende no SketchUp Pro completo e tem acesso aos programas durante todas as aulas. Depois do curso, você pode escolher qual versão usar."
  },

  // === DURAÇÃO E FORMATO ===
  {
    id: 5,
    question: "Quanto tempo dura um curso de SketchUp?",
    answer: "O curso tem 56 horas de aula presencial divididas em 28 encontros de 2 horas cada. Dá pra fazer em 2 a 3 meses dependendo da turma que você escolher. É presencial aqui em São José SC, no bairro Kobrasol."
  },
  {
    id: 6,
    question: "Qual o melhor curso de SketchUp?",
    answer: "O melhor curso é presencial com turmas pequenas, igual o nosso! Temos turmas de até 4 alunos, professor certificado pela Trimble (fabricante do SketchUp), 56 horas de prática com projetos reais e nota 5 estrelas. Mais de 200 alunos já se formaram aqui. É presencial em São José SC."
  },
  {
    id: 7,
    question: "Qual a diferença entre o SketchUp Web e o SketchUp para desktop?",
    answer: "O SketchUp Web funciona no navegador e é grátis, mas tem menos ferramentas. O SketchUp para desktop (Pro) é muito mais completo, tem plugins, funciona offline e é mais rápido. No curso você aprende no SketchUp Pro completo e também conhece o Enscape pra fazer imagens realistas."
  },

  // === DIFICULDADE E REQUISITOS ===
  {
    id: 8,
    question: "É difícil aprender SketchUp?",
    answer: "Não! O SketchUp é considerado o programa 3D mais fácil de aprender. Em poucas aulas você já consegue fazer projetos simples. Nosso curso começa do zero, não precisa saber nada antes. Com turmas de 4 alunos, o professor te ajuda sempre que precisar."
  },
  {
    id: 9,
    question: "Preciso saber outro software 3D para fazer o curso?",
    answer: "Não precisa saber nada! O curso começa do zero. Se você nunca mexeu com programa 3D, tudo bem! A gente ensina desde o básico até o avançado. O SketchUp é bem fácil de aprender, qualquer pessoa consegue."
  },
  {
    id: 10,
    question: "Precisa de internet para mexer no SketchUp?",
    answer: "Não! O SketchUp Pro (versão completa) funciona sem internet depois de instalado. Só precisa de internet pra baixar o programa e pra ativar a licença. Depois disso, você trabalha offline tranquilo."
  },

  // === REQUISITOS TÉCNICOS ===
  {
    id: 11,
    question: "Qual PC roda SketchUp?",
    answer: "Precisa de um computador com 8GB de RAM no mínimo (16GB é melhor), processador Intel i5 ou AMD Ryzen 5 (ou superior) e placa de vídeo dedicada de 2GB. Funciona no Windows ou Mac. Notebook também serve se tiver essas configurações."
  },
  {
    id: 12,
    question: "Quais tablets rodam o SketchUp?",
    answer: "O SketchUp Pro não roda em tablet. Existe uma versão mobile (SketchUp Viewer) só pra visualizar projetos, mas não dá pra criar nada. Pra fazer projetos de verdade precisa de computador ou notebook."
  },
  {
    id: 13,
    question: "Como baixar o SketchUp gratuito no notebook?",
    answer: "Entra no site oficial trimble.com/sketchup e escolhe o SketchUp Free (grátis, usa no navegador) ou baixa o SketchUp Pro (versão completa, tem teste grátis de 30 dias). No nosso curso você usa o SketchUp Pro completo durante todas as aulas."
  },

  // === MERCADO DE TRABALHO ===
  {
    id: 14,
    question: "Quanto ganha quem trabalha com SketchUp?",
    answer: "Quem tá começando como projetista 3D ganha entre R$ 2.500 e R$ 4.000 por mês. Com experiência, pode ganhar de R$ 6.000 a R$ 10.000. Trabalhando como freelancer dá pra faturar R$ 8.000 a R$ 15.000 por mês."
  },
  {
    id: 15,
    question: "Quanto devo cobrar por um desenho no SketchUp?",
    answer: "Depende do projeto! Um projeto simples de móvel planejado: R$ 300 a R$ 800. Casa completa com render: R$ 2.000 a R$ 5.000. Reforma de apartamento: R$ 1.500 a R$ 3.000. Projeto comercial: R$ 3.000 a R$ 8.000. No curso a gente ensina a calcular seus preços."
  },
  {
    id: 16,
    question: "Posso trabalhar como freelancer após o curso?",
    answer: "Sim! Muitos alunos nossos viraram freelancers. No curso você faz vários projetos que já viram seu portfólio. A gente ensina a calcular preços e a conseguir clientes. Você sai pronto pra trabalhar."
  },

  // === CERTIFICADO E RECONHECIMENTO ===
  {
    id: 17,
    question: "Existe um curso de SketchUp certificado em Florianópolis?",
    answer: "Sim! A Escola Habilidade fica em São José (do lado de Florianópolis) e dá certificado nacional de 56 horas. O certificado é reconhecido em todo Brasil e aceito por empresas da região. Já formamos mais de 200 alunos."
  },
  {
    id: 18,
    question: "Quais são as avaliações sobre a Escola Habilidade em São José?",
    answer: "Temos nota 5 estrelas com mais de 200 avaliações! Os alunos elogiam as turmas pequenas (só 4 alunos), professor certificado pela Trimble, projetos reais em sala de aula e discussões sobre casos do dia a dia. Você pode ver os depoimentos no Google e no nosso site."
  },

  // === COMPARAÇÕES ===
  {
    id: 19,
    question: "Qual é o melhor SketchUp ou AutoCAD?",
    answer: "Depende do trabalho! AutoCAD é melhor pra desenho técnico 2D (plantas baixas). SketchUp é melhor pra modelagem 3D (visualizar o projeto em três dimensões). O ideal é saber os dois. No nosso curso você aprende SketchUp completo e também uma introdução ao AutoCAD."
  },
  {
    id: 20,
    question: "O que substitui o SketchUp?",
    answer: "Outros programas parecidos: Revit (mais complexo, pra BIM), 3ds Max (mais pesado), Blender (grátis mas difícil). Mas o SketchUp continua sendo o mais fácil de aprender e usar. É o favorito de arquitetos, designers e marcenarias."
  },

  // === DETALHES DO CURSO ===
  {
    id: 21,
    question: "O que está incluído no curso de SketchUp e Enscape?",
    answer: "Tá tudo incluído! 56 horas de aula presencial, apostila impressa de 360 páginas, acesso aos programas nas aulas, certificado nacional, turmas de no máximo 4 alunos, professor certificado pela Trimble, projetos reais em sala de aula, discussões de casos do dia a dia e materiais prontos (templates e bibliotecas)."
  },
  {
    id: 22,
    question: "Qual a vantagem de aprender SketchUp e Enscape juntos?",
    answer: "SketchUp faz a modelagem 3D (cria o projeto) e Enscape deixa tudo realista (tipo foto de verdade). Juntos você cria projetos lindos que impressionam clientes. Aprende os dois no mesmo curso economizando tempo e dinheiro."
  },
  {
    id: 23,
    question: "Como funciona a renderização com Enscape?",
    answer: "O Enscape funciona junto com o SketchUp. Você modela no SketchUp e clica um botão: o Enscape transforma em imagem realista na hora! Dá pra mudar iluminação, materiais e câmera vendo o resultado ao vivo. É muito rápido e fácil."
  },

  // === QUESTÕES PRÁTICAS ===
  {
    id: 24,
    question: "Qual SketchUp é gratuito?",
    answer: "O SketchUp Free é grátis mas funciona só no navegador e tem menos ferramentas. O SketchUp Pro (completo) é pago mas tem teste grátis de 30 dias. No curso você aprende no SketchUp Pro completo com tudo liberado."
  },
  {
    id: 25,
    question: "Como posso usar o SketchUp sem uma licença?",
    answer: "Você pode usar o SketchUp Free (versão grátis no navegador). Dá pra fazer projetos básicos, mas não tem todas as ferramentas. O SketchUp Pro tem teste grátis de 30 dias. Depois precisa comprar ou usar a versão grátis."
  },
  {
    id: 26,
    question: "Qual programa um arquiteto usa?",
    answer: "Arquitetos usam vários programas: AutoCAD (pra plantas 2D), SketchUp (pra visualização 3D), Revit (pra projetos BIM), Enscape ou V-Ray (pra renders realistas), Photoshop (pra editar imagens). No nosso curso você aprende SketchUp e Enscape."
  },
  {
    id: 27,
    question: "Qual CAD é gratuito?",
    answer: "Os principais CAD grátis são: LibreCAD (2D básico), FreeCAD (3D, meio complicado), DraftSight Free (2D, parecido com AutoCAD) e SketchUp Free (3D fácil mas limitado). Pra trabalhar profissional é melhor usar as versões pagas."
  },
  {
    id: 28,
    question: "Qual é o preço do SketchUp 2025?",
    answer: "O SketchUp Pro 2025 custa cerca de US$ 349 por ano (uns R$ 1.800) se comprar direto da Trimble. Mas no nosso curso você usa o programa completo durante todas as 56 horas de aula sem precisar comprar."
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