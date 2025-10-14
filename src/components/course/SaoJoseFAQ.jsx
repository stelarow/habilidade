import {
  Question,
  CaretDown,
  MapPin
} from '@phosphor-icons/react';
import { useState } from 'react';

const faqData = [
  // === LOCALIZAÇÃO E ACESSO ===
  {
    id: 1,
    question: "Onde fica a Escola Habilidade em São José?",
    answer: "Fica na Rua Caetano José Ferreira, 426 - Sala 5, no bairro Kobrasol em São José SC. É fácil de chegar! Fica perto da BR-101 e da SC-281, com ônibus que param perto e estacionamento na rua."
  },
  {
    id: 2,
    question: "Qual o melhor curso em São José SC?",
    answer: "A Escola Habilidade tem os melhores cursos profissionalizantes de São José! Oferecemos Informática, SketchUp, AutoCAD, Revit e Marketing Digital com turmas pequenas (até 4 alunos), professor certificado pela Trimble e certificado nacional. Nota 5 estrelas e mais de 200 alunos formados."
  },
  {
    id: 3,
    question: "Tem curso de SketchUp em São José SC?",
    answer: "Sim! O curso de SketchUp fica aqui no Kobrasol, São José. São 56 horas de aula presencial com turmas de até 4 alunos. Inclui SketchUp e Enscape (pra fazer imagens realistas). Certificado nacional e apostila de 360 páginas."
  },
  {
    id: 4,
    question: "Como chegar na Escola Habilidade de ônibus?",
    answer: "Várias linhas de ônibus passam perto! As principais são: linhas que vão pra Kobrasol, Forquilhinhas e Centro de São José. A escola fica a poucos minutos a pé do ponto mais próximo. Se precisar, a gente te ajuda com as melhores rotas!"
  },

  // === ATENDIMENTO E HORÁRIOS ===
  {
    id: 5,
    question: "Quais os horários da Escola Habilidade?",
    answer: "Funcionamos de segunda a sábado! Segunda, terça e quinta das 8h às 20h. Quarta das 8h às 22h (pra quem trabalha o dia todo). Sexta das 8h às 17h30. Sábado das 8h às 12h. Temos turmas de manhã, tarde e noite."
  },
  {
    id: 6,
    question: "Tem estacionamento na escola?",
    answer: "Tem estacionamento gratuito na rua em frente à escola! É uma região tranquila do Kobrasol com vagas fáceis de achar. Se vier de carro, pode ficar tranquilo."
  },
  {
    id: 7,
    question: "Posso visitar a escola antes de me matricular?",
    answer: "Claro! Você pode marcar uma visita pra conhecer a escola, ver os computadores, conhecer o professor e tirar todas as dúvidas. É só chamar no WhatsApp (48) 98855-9491 que a gente agenda um horário pra você."
  },

  // === DIFERENCIAIS LOCAIS ===
  {
    id: 8,
    question: "A Escola Habilidade é boa?",
    answer: "Sim! Temos nota 5 estrelas e mais de 200 avaliações positivas. Os alunos elogiam as turmas pequenas (só 4 pessoas), professor certificado pela Trimble, projetos reais em sala e discussões sobre casos do dia a dia. Estamos há mais de 10 anos em São José formando profissionais."
  },
  {
    id: 9,
    question: "Qual a diferença da Escola Habilidade pra outras escolas?",
    answer: "Nossos diferenciais: turmas pequenas de só 4 alunos, professor certificado pela Trimble (fabricante do SketchUp), projetos reais em sala de aula e você pode discutir seus projetos do dia a dia com o professor. Além disso, temos material próprio, apostila impressa e certificado nacional reconhecido."
  },
  {
    id: 10,
    question: "Quantos alunos já estudaram na Escola Habilidade?",
    answer: "Mais de 200 alunos já se formaram aqui! Muitos trabalham em empresas da região como marcenarias, escritórios de arquitetura, lojas de móveis e até abriram o próprio negócio como freelancer."
  },

  // === CURSOS DISPONÍVEIS ===
  {
    id: 11,
    question: "Quais cursos a Escola Habilidade oferece em São José?",
    answer: "Oferecemos vários cursos profissionalizantes: Informática Completa, SketchUp com Enscape, AutoCAD 2D e 3D, Revit, Marketing Digital, Programação, Design Gráfico, Business Intelligence e Inteligência Artificial. Todos com certificado nacional."
  },
  {
    id: 12,
    question: "Tem curso de informática em São José?",
    answer: "Sim! Temos o curso de Informática Completa com Windows, Word, Excel (do básico ao avançado) e PowerPoint. É perfeito pra quem quer trabalhar em escritório, lojas ou qualquer empresa. Material incluso e certificado nacional."
  },

  // === BAIRROS ATENDIDOS ===
  {
    id: 13,
    question: "Atende alunos de Forquilhinhas?",
    answer: "Sim! Fica super perto de Forquilhinhas, dá uns 10 minutos de carro. Muitos alunos nossos são de Forquilhinhas. Tem ônibus direto e é fácil de chegar de carro ou moto."
  },
  {
    id: 14,
    question: "Atende alunos de Florianópolis?",
    answer: "Sim! Vários alunos vêm de Florianópolis. A escola fica bem perto da ponte, uns 15-20 minutos do centro de Floripa. Tem ônibus e é fácil de chegar pela BR-101 ou SC-401."
  },
  {
    id: 15,
    question: "Atende alunos de Palhoça?",
    answer: "Sim! Muitos alunos vêm de Palhoça. Fica uns 15 minutos de carro e tem várias linhas de ônibus que ligam Palhoça ao Kobrasol. É bem acessível!"
  }
];

export const SaoJoseFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-zinc-900/50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm font-medium text-purple-400">
            <MapPin className="w-4 h-4" />
            SÃO JOSÉ - KOBRASOL
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">PERGUNTAS SOBRE</span>
            <br />
            <span className="text-white">NOSSA ESCOLA</span>
          </h2>

          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            Tire suas dúvidas sobre localização, horários e nossos cursos em São José SC
          </p>
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
