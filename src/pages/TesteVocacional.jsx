import React, { Component as ReactComponent, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  ArrowsClockwise,
  CaretLeft,
  ChatCircle,
  DownloadSimple,
  Phone,
  ShareNetwork,
} from '@phosphor-icons/react';
import LogoH from '../components/LogoH';
import { analytics, trackEvent } from '../utils/analytics';
import { generatePDF as generatePDFWorker, onLoadProgress } from '../utils/pdfWorker';

class DOMErrorBoundary extends ReactComponent {
  constructor(properties) {
    super(properties);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    const message = error?.message || '';
    const isDOMError = ['removeChild', 'insertBefore', 'appendChild', 'Node'].some((term) =>
      message.includes(term)
    );

    if (isDOMError) {
      return { hasError: true };
    }

    throw error;
  }

  componentDidCatch(error) {
    console.warn('DOM Error Boundary caught:', error.message);
    trackEvent('teste_vocacional_dom_error', {
      event_category: 'Teste Vocacional',
      event_label: error.message,
    });
  }

  render() {
    if (this.state.hasError) {
      return <div className={this.props.className || ''}>{this.props.fallbackChildren}</div>;
    }

    return this.props.children;
  }
}

const questions = [
  {
    id: 'analise-dados',
    area: 'Análise de Dados',
    courseName: 'Excel Avançado e Business Intelligence',
    route: '/cursos/excel-avancado-business-intelligence',
    statement:
      'Gosto de olhar números, planilhas ou informações e encontrar padrões que ajudam a decidir melhor.',
    profile:
      'Você combina com uma rotina de análise, organização e leitura de cenários. Dados podem virar uma vantagem real quando você aprende a transformar informação em decisão.',
  },
  {
    id: 'informatica',
    area: 'Informática',
    courseName: 'Informática',
    route: '/cursos/informatica',
    statement:
      'Quero dominar melhor computador, internet, arquivos e ferramentas digitais para estudar ou trabalhar com mais segurança.',
    profile:
      'Você tem um perfil prático e quer ganhar autonomia digital. A base de informática abre portas para estudar melhor, trabalhar com mais confiança e se adaptar a novas ferramentas.',
  },
  {
    id: 'administracao',
    area: 'Administração',
    courseName: 'Administração',
    route: '/cursos/administracao',
    statement:
      'Me vejo organizando tarefas, acompanhando resultados e ajudando uma equipe ou empresa a funcionar melhor.',
    profile:
      'Você tende a se conectar com planejamento, rotina, atendimento e tomada de decisão. Administração é uma boa trilha para quem gosta de entender como as coisas funcionam por dentro.',
  },
  {
    id: 'projetista-3d',
    area: 'Projetista 3D',
    courseName: 'Projetista 3D',
    route: '/cursos/projetista-3d',
    statement:
      'Tenho curiosidade por projetos, ambientes, peças ou objetos em 3D e gosto de imaginar como algo fica antes de existir.',
    profile:
      'Você tem uma afinidade visual e técnica ao mesmo tempo. Projetos 3D pedem atenção a detalhe, noção espacial e vontade de tirar ideias do papel.',
  },
  {
    id: 'marketing-digital',
    area: 'Marketing Digital',
    courseName: 'Marketing Digital',
    route: '/cursos/marketing-digital',
    statement:
      'Gosto de pensar em conteúdo, redes sociais, campanhas e formas de chamar a atenção das pessoas para uma ideia.',
    profile:
      'Você se aproxima de comunicação, estratégia e comportamento online. Marketing Digital é para quem quer entender como marcas crescem e como ideias chegam nas pessoas certas.',
  },
  {
    id: 'design-grafico',
    area: 'Designer Gráfico',
    courseName: 'Design Gráfico',
    route: '/cursos/design-grafico',
    statement:
      'Gosto de criar visuais, editar imagens, escolher cores, montar layouts e deixar uma mensagem mais bonita e clara.',
    profile:
      'Você tem inclinação para expressão visual e cuidado com apresentação. Design Gráfico pode transformar esse olhar em uma habilidade profissional aplicável a marcas, posts e materiais.',
  },
  {
    id: 'programacao',
    area: 'Programação',
    courseName: 'Programação',
    route: '/cursos/programacao',
    statement:
      'Tenho vontade de entender códigos, criar sistemas, automatizar tarefas ou construir meus próprios aplicativos.',
    profile:
      'Você combina com lógica, solução de problemas e construção digital. Programação é uma trilha forte para quem gosta de descobrir como as coisas funcionam e criar algo do zero.',
  },
  {
    id: 'inteligencia-artificial',
    area: 'Inteligência Artificial',
    courseName: 'Inteligência Artificial',
    route: '/cursos/inteligencia-artificial',
    statement:
      'Tenho interesse em usar IA para criar, estudar, resolver problemas e trabalhar de um jeito mais rápido e inteligente.',
    profile:
      'Você se conecta com ferramentas novas e maneiras mais inteligentes de produzir. IA é uma boa escolha para quem quer usar tecnologia como vantagem nos estudos, trabalho e criação.',
  },
];

const scale = [
  { value: 1, label: 'discordo' },
  { value: 2, label: '' },
  { value: 3, label: 'neutro' },
  { value: 4, label: '' },
  { value: 5, label: 'concordo' },
];

const CONTACT_PHONE = '5548988559491';

const getSortedResults = (answers) => {
  const ranked = questions
    .map((question) => ({
      ...question,
      score: answers[question.id] || 0,
      isStrong: (answers[question.id] || 0) >= 4,
    }))
    .sort((a, b) => b.score - a.score || questions.findIndex((q) => q.id === a.id) - questions.findIndex((q) => q.id === b.id));

  const strongMatches = ranked.filter((item) => item.isStrong);
  const topRecommendations = (strongMatches.length > 0 ? strongMatches : ranked).slice(0, 3);
  const primary = topRecommendations[0] || ranked[0];
  const maxScore = ranked[0]?.score || 0;
  const tiedAtTop = ranked.filter((item) => item.score === maxScore);

  return {
    ranked,
    topRecommendations,
    primary,
    secondary: topRecommendations[1] || ranked[1] || null,
    hasStrongMatch: strongMatches.length > 0,
    isTie: tiedAtTop.length > 1,
  };
};

const outlineButton =
  'inline-flex items-center justify-center gap-2 rounded-full border border-[#d400ff] px-7 py-3 font-mono text-xs uppercase tracking-[2.5px] text-white transition-colors hover:bg-[#d400ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-50';

const subtleButton =
  'inline-flex items-center justify-center gap-2 rounded-full border border-[#3a3a3a] px-7 py-3 font-mono text-xs uppercase tracking-[2.5px] text-white transition-colors hover:border-[#d400ff] hover:bg-[#d400ff]/10 disabled:cursor-not-allowed disabled:opacity-50';

const trackCourseClick = (course) => {
  analytics.trackCourseClicked(course.courseName, true);
};

const trackResultContact = () => {
  analytics.trackContactFromTest('whatsapp');
  analytics.trackResultShared('whatsapp');
};

const Hero = ({ onStart }) => (
  <section className="min-h-screen bg-black text-white">
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-8 md:px-10">
      <header className="flex items-center justify-between border-b border-[#262626] pb-6">
        <LogoH size="small" animated={false} showFullText textColor="text-white" />
        <span className="font-mono text-[10px] uppercase tracking-[2.5px] text-[#8a8a8a]">
          8 perguntas
        </span>
      </header>

      <div className="max-w-4xl py-20 md:py-28">
        <p className="mb-6 font-mono text-xs uppercase tracking-[3px] text-[#8a8a8a]">
          Escola Habilidade
        </p>
        <h1 className="mb-8 font-['Saira_Condensed'] text-6xl font-normal uppercase leading-[0.92] tracking-[4px] text-[#d400ff] sm:text-7xl md:text-8xl">
          Teste Vocacional
        </h1>
        <p className="max-w-2xl font-['EB_Garamond'] text-xl leading-8 text-[#cfcfcf] md:text-2xl">
          Responda afirmações simples em uma escala de 1 a 5 e veja quais cursos combinam
          melhor com o seu momento.
        </p>
        <button type="button" onClick={onStart} className={`${outlineButton} mt-10`}>
          Começar teste
        </button>
      </div>

      <div className="grid gap-4 border-t border-[#262626] pt-6 font-mono text-[10px] uppercase tracking-[2px] text-[#8a8a8a] sm:grid-cols-3">
        <span>Sem cadastro obrigatório</span>
        <span>Resultado imediato</span>
        <span>Recomendação de curso</span>
      </div>
    </div>
  </section>
);

const VocationalTest = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const question = questions[currentQuestion];
  const selectedValue = answers[question.id];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const selectAnswer = (value) => {
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);

    analytics.trackQuestionAnswered(currentQuestion + 1, question.statement, value);
    trackEvent('teste_vocacional_likert_resposta', {
      event_category: 'Teste Vocacional',
      event_label: `Pergunta ${currentQuestion + 1}`,
      question_number: currentQuestion + 1,
      score: value,
      primary_area: question.area,
      secondary_area: '',
    });
  };

  const goNext = () => {
    if (!selectedValue) {
      return;
    }

    if (currentQuestion === questions.length - 1) {
      const calculated = getSortedResults(answers);
      const timeSpent = analytics.measureTestDuration.end();

      analytics.trackTestCompleted(
        {
          primaryArea: calculated.primary?.area,
          secondaryArea: calculated.secondary?.area,
        },
        timeSpent
      );
      analytics.trackCombinedProfile(calculated.topRecommendations, calculated.isTie ? 'tie' : 'direct');
      analytics.trackCourseCompatibility(calculated.topRecommendations, {
        primaryArea: calculated.primary?.area,
        secondaryArea: calculated.secondary?.area,
      });

      onComplete({
        answers,
        timeSpent,
        ...calculated,
      });
      return;
    }

    analytics.trackTestProgress(currentQuestion + 2, questions.length);
    setCurrentQuestion((current) => current + 1);
  };

  const goBack = () => {
    setCurrentQuestion((current) => Math.max(0, current - 1));
  };

  return (
    <div className="mx-auto max-w-4xl bg-black text-white">
      <div className="mb-10 border-b border-[#262626] pb-5">
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[2.5px] text-[#8a8a8a]">
          <span>
            Pergunta {currentQuestion + 1} de {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-px w-full bg-[#262626]">
          <div className="h-px bg-[#d400ff] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={question.id} className="border border-[#262626] p-6 sm:p-10">
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[2.5px] text-[#8a8a8a]">
          Marque o quanto essa frase combina com você
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-3xl font-normal leading-tight text-[#d400ff] sm:text-4xl md:text-5xl">
          {question.statement}
        </h2>

        <div className="mt-10">
          <div className="mb-4 flex justify-between font-mono text-[10px] uppercase tracking-[2px] text-[#8a8a8a]">
            <span>Discordo</span>
            <span>Concordo</span>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {scale.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => selectAnswer(item.value)}
                aria-pressed={selectedValue === item.value}
                className={`flex aspect-square min-h-14 flex-col items-center justify-center rounded-full border font-mono transition-colors ${
                  selectedValue === item.value
                    ? 'border-[#d400ff] bg-[#d400ff] text-white'
                    : 'border-[#3a3a3a] bg-transparent text-white hover:border-[#d400ff]'
                }`}
              >
                <span className="text-lg">{item.value}</span>
                {item.label && (
                  <span className="mt-1 hidden text-[8px] uppercase tracking-[1.5px] sm:block">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={currentQuestion === 0}
          className={subtleButton}
        >
          <CaretLeft size={16} />
          Voltar
        </button>
        <button type="button" onClick={goNext} disabled={!selectedValue} className={outlineButton}>
          {currentQuestion === questions.length - 1 ? 'Ver resultado' : 'Próxima'}
        </button>
      </div>
    </div>
  );
};

const ResultsDashboard = ({ results, onRestart }) => {
  const pdfContentReference = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState({});
  const { ranked, topRecommendations, primary, secondary, hasStrongMatch, isTie } = results;

  useEffect(() => onLoadProgress(setPdfProgress), []);

  const whatsappText = useMemo(
    () =>
      encodeURIComponent(
        `Olá! Fiz o teste vocacional da Escola Habilidade e meu principal resultado foi ${primary.area}.\n\n` +
          `Curso recomendado: ${primary.courseName}\n` +
          `Top 3:\n${topRecommendations
            .map((item, index) => `${index + 1}. ${item.area} (${item.score}/5)`)
            .join('\n')}\n\n` +
          'Gostaria de saber mais sobre valores, horários e próximas turmas.'
      ),
    [primary, topRecommendations]
  );

  const contactUrl = `https://wa.me/${CONTACT_PHONE}?text=${whatsappText}`;

  const generatePDF = async () => {
    if (!pdfContentReference.current) {
      return;
    }

    setIsGeneratingPDF(true);
    analytics.trackPDFDownloaded(primary.area);

    try {
      await generatePDFWorker(
        pdfContentReference.current,
        `teste-vocacional-${primary.id}.pdf`,
        {
          canvas: {
            backgroundColor: '#000000',
          },
        }
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const shareResults = async () => {
    const text =
      `Meu resultado no teste vocacional da Escola Habilidade foi ${primary.area}.\n` +
      `Curso recomendado: ${primary.courseName}\n` +
      'Faça o teste: https://escolahabilidade.com/teste-vocacional';

    if (globalThis.navigator?.share) {
      await globalThis.navigator.share({
        title: 'Teste Vocacional Escola Habilidade',
        text,
        url: 'https://escolahabilidade.com/teste-vocacional',
      });
      analytics.trackResultShared('native_share');
      return;
    }

    await globalThis.navigator?.clipboard?.writeText(text);
    analytics.trackResultShared('clipboard');
  };

  return (
    <div className="mx-auto max-w-6xl bg-black text-white">
      <div ref={pdfContentReference} className="bg-black p-0 text-white md:p-8">
        <div className="border-b border-[#262626] pb-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <LogoH size="small" animated={false} showFullText textColor="text-white" />
            <span className="font-mono text-[10px] uppercase tracking-[2.5px] text-[#8a8a8a]">
              Resultado vocacional
            </span>
          </div>

          <p className="mb-4 font-mono text-xs uppercase tracking-[3px] text-[#8a8a8a]">
            {isTie ? 'Top 3 recomendado' : 'Curso principal'}
          </p>
          <h2 className="font-['Saira_Condensed'] text-5xl font-normal uppercase leading-none tracking-[4px] text-[#d400ff] md:text-7xl">
            {primary.area}
          </h2>
          <p className="mt-6 max-w-3xl font-['EB_Garamond'] text-xl leading-8 text-[#cfcfcf]">
            {primary.profile}
          </p>
          {!hasStrongMatch && (
            <p className="mt-5 max-w-2xl font-mono text-xs uppercase tracking-[2px] text-[#8a8a8a]">
              Como nenhuma resposta ficou em 4 ou 5, usamos suas maiores notas para sugerir caminhos
              próximos.
            </p>
          )}
        </div>

        <div className="grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="border border-[#262626] p-6 md:p-8">
            <h3 className="mb-8 font-mono text-xs uppercase tracking-[2.5px] text-[#8a8a8a]">
              Ranking
            </h3>
            <div className="space-y-5">
              {ranked.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[2rem_1fr_auto] items-center gap-4">
                  <span className="font-mono text-xs text-[#8a8a8a]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-['Saira_Condensed'] text-xl uppercase tracking-[2px] text-[#d400ff]">
                        {item.area}
                      </span>
                      <span className="font-mono text-xs text-[#cfcfcf]">{item.score}/5</span>
                    </div>
                    <div className="mt-2 h-px bg-[#262626]">
                      <div
                        className="h-px bg-[#d400ff]"
                        style={{ width: `${Math.max(6, item.score * 20)}%` }}
                      />
                    </div>
                  </div>
                  <a
                    href={item.route}
                    onClick={() => trackCourseClick(item)}
                    className="hidden rounded-full border border-[#3a3a3a] px-4 py-2 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:border-[#d400ff] hover:bg-[#d400ff] hover:text-white sm:inline-flex"
                  >
                    Curso
                  </a>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="border border-[#d400ff] p-6 md:p-8">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[2.5px] text-[#8a8a8a]">
                Recomendação principal
              </p>
              <h3 className="font-['Saira_Condensed'] text-3xl font-normal uppercase tracking-[3px] text-[#d400ff]">
                {primary.courseName}
              </h3>
              <a
                href={primary.route}
                onClick={() => trackCourseClick(primary)}
                className={`${outlineButton} mt-6 w-full`}
              >
                Ver curso
              </a>
            </div>

            {secondary && (
              <div className="border border-[#262626] p-6 md:p-8">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[2.5px] text-[#8a8a8a]">
                  Alternativas próximas
                </p>
                <div className="space-y-4">
                  {topRecommendations.slice(1, 3).map((item) => (
                    <a
                      key={item.id}
                      href={item.route}
                      onClick={() => trackCourseClick(item)}
                      className="flex items-center justify-between border-b border-[#262626] pb-4 text-white transition-colors hover:text-[#d400ff]"
                    >
                      <span className="font-['Saira_Condensed'] text-xl uppercase tracking-[2px]">
                        {item.area}
                      </span>
                      <span className="font-mono text-xs text-[#8a8a8a]">{item.score}/5</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        <div className="border-t border-[#262626] pt-8">
          <p className="mb-5 font-['EB_Garamond'] text-lg leading-7 text-[#cfcfcf]">
            Quer conversar sobre esse resultado? A equipe da Escola Habilidade pode indicar a
            melhor turma para sua idade, objetivo e disponibilidade.
          </p>
          <div className="flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[2px] text-[#8a8a8a]">
            <span>Florianópolis</span>
            <span>São José</span>
            <span>Palhoça</span>
            <span>(48) 98855-9491</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-[#262626] pt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={contactUrl} onClick={trackResultContact} className={outlineButton}>
            <ChatCircle size={18} />
            Falar no WhatsApp
          </a>
          <button type="button" onClick={onRestart} className={subtleButton}>
            <ArrowsClockwise size={18} />
            Refazer teste
          </button>
          <button
            type="button"
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className={subtleButton}
          >
            <DownloadSimple size={18} />
            {isGeneratingPDF ? pdfProgress.message || 'Gerando PDF' : 'Baixar PDF'}
          </button>
          <button type="button" onClick={shareResults} className={subtleButton}>
            <ShareNetwork size={18} />
            Compartilhar
          </button>
          <a href="tel:+5548988559491" className={subtleButton}>
            <Phone size={18} />
            Ligar
          </a>
        </div>
      </div>
    </div>
  );
};

const TesteVocacional = () => {
  const [currentStep, setCurrentStep] = useState('intro');
  const [results, setResults] = useState(null);

  useEffect(() => {
    analytics.trackTestPageView();
  }, []);

  useEffect(() => {
    const handleStartTest = () => {
      startTest();
    };

    globalThis.addEventListener('startVocationalTest', handleStartTest);
    return () => {
      globalThis.removeEventListener('startVocationalTest', handleStartTest);
    };
  }, []);

  const startTest = () => {
    setCurrentStep('test');
    analytics.trackTestStart();
    analytics.measureTestDuration.start();

    setTimeout(() => {
      globalThis.document?.querySelector('#teste-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const handleTestComplete = (testResults) => {
    setResults(testResults);
    setCurrentStep('results');
  };

  const handleRestart = () => {
    setCurrentStep('intro');
    setResults(null);
    analytics.trackTestRestart();
  };

  return (
    <>
      <Helmet>
        <title>Teste Vocacional | Escola Habilidade</title>
        <meta
          name="description"
          content="Faça o teste vocacional gratuito da Escola Habilidade e descubra qual curso combina com seus interesses em tecnologia, design, administração e criatividade."
        />
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=EB+Garamond:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Saira+Condensed:wght@400;500&display=swap');

            html {
              scroll-behavior: smooth;
            }
          `}
        </style>
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {currentStep === 'intro' && <Hero onStart={startTest} />}

        {currentStep === 'test' && (
          <main
            key="vocational-test-questions-section"
            id="teste-section"
            className="min-h-screen bg-black px-4 py-20"
          >
            <DOMErrorBoundary
              className="mx-auto max-w-4xl"
              fallbackChildren={
                <div className="mx-auto max-w-xl border border-[#262626] p-8 text-center text-white">
                  <h3 className="mb-4 font-['Saira_Condensed'] text-3xl uppercase tracking-[3px] text-[#d400ff]">
                    Teste Vocacional
                  </h3>
                  <p className="mb-6 font-['EB_Garamond'] text-lg text-[#cfcfcf]">
                    Recarregue a página para continuar.
                  </p>
                  <button
                    type="button"
                    onClick={() => globalThis.location.reload()}
                    className={outlineButton}
                  >
                    Recarregar página
                  </button>
                </div>
              }
            >
              <VocationalTest onComplete={handleTestComplete} />
            </DOMErrorBoundary>
          </main>
        )}

        {currentStep === 'results' && results && (
          <main
            key="vocational-test-results-section"
            className="min-h-screen bg-black px-4 py-20"
          >
            <DOMErrorBoundary
              className="mx-auto max-w-6xl"
              fallbackChildren={
                <div className="mx-auto max-w-xl border border-[#262626] p-8 text-center text-white">
                  <h3 className="mb-4 font-['Saira_Condensed'] text-3xl uppercase tracking-[3px] text-[#d400ff]">
                    Resultado
                  </h3>
                  <p className="mb-6 font-['EB_Garamond'] text-lg text-[#cfcfcf]">
                    Houve um problema ao exibir seus resultados.
                  </p>
                  <button type="button" onClick={handleRestart} className={outlineButton}>
                    Refazer teste
                  </button>
                </div>
              }
            >
              <ResultsDashboard results={results} onRestart={handleRestart} />
            </DOMErrorBoundary>
          </main>
        )}

        <a
          href="https://wa.me/5548988559491?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20cursos%20da%20Escola%20Habilidade."
          onClick={() => analytics.trackContactFromTest('whatsapp_float')}
          className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#d400ff] bg-black text-white transition-colors hover:bg-[#d400ff] hover:text-white"
          aria-label="Falar com a Escola Habilidade pelo WhatsApp"
        >
          <ChatCircle size={24} />
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Escola Habilidade - Teste Vocacional',
              description:
                'Teste vocacional gratuito para descobrir qual curso combina com seus interesses.',
              url: 'https://escolahabilidade.com/teste-vocacional',
              areaServed: [
                { '@type': 'City', name: 'Florianópolis' },
                { '@type': 'City', name: 'São José' },
                { '@type': 'City', name: 'Palhoça' },
              ],
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'R. Caetano José Ferreira, 426 - Sala 5',
                addressLocality: 'Kobrasol',
                addressRegion: 'SC',
                postalCode: '88102-280',
                addressCountry: 'BR',
              },
              telephone: '+55-48-98855-9491',
              offers: [
                {
                  '@type': 'Service',
                  name: 'Teste Vocacional Gratuito',
                  description: 'Descubra qual curso combina com seu perfil.',
                },
              ],
            }),
          }}
        />
      </div>
    </>
  );
};

export default TesteVocacional;
export const Component = TesteVocacional;
