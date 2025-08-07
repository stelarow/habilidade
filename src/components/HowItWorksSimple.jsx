import Section from './Section';
import GradientButton from './GradientButton';
import {
  BookOpen,
  Play,
  Trophy,
  Rocket,
} from '@phosphor-icons/react';
import useInView from '../hooks/useInView';

const STEPS = [
  {
    number: '01',
    title: 'Escolha seu Curso',
    description: 'Selecione a área que mais combina com seus objetivos',
    icon: BookOpen,
    color: 'text-blue-400',
    borderGradient: 'from-blue-500/60 to-cyan-400/60',
  },
  {
    number: '02',
    title: 'Experimente Grátis',
    description: 'Aula experimental sem compromisso',
    icon: Play,
    color: 'text-amber-400',
    borderGradient: 'from-amber-500/60 to-yellow-400/60',
    isSpecial: true,
  },
  {
    number: '03',
    title: 'Aprenda na Prática',
    description: 'Projetos reais desde o primeiro dia',
    icon: Trophy,
    color: 'text-green-400',
    borderGradient: 'from-green-500/60 to-emerald-400/60',
  },
  {
    number: '04',
    title: 'Acelere sua Carreira',
    description: 'Conquiste melhores oportunidades',
    icon: Rocket,
    color: 'text-purple-400',
    borderGradient: 'from-purple-500/60 to-pink-400/60',
  },
];

function SimpleCard({ step, index }) {
  const [ref, visible] = useInView();
  const { number, title, description, icon: Icon, color, borderGradient, isSpecial } = step;

  // Se for o card "Escolha seu Curso", torna clicável
  const isChooseCard = number === '01';
  const CardWrapper = isChooseCard ? 'a' : 'div';
  const cardProps = isChooseCard ? { href: '#cursos' } : {};

  return (
    <CardWrapper 
      {...cardProps}
      className={`${isChooseCard ? 'cursor-pointer' : ''} block`}
    >
      <div 
        ref={ref}
        className={`step-card ${visible ? 'in-view' : ''} flex flex-col items-center text-center max-w-xs group`}
        style={{ animationDelay: `${index * 0.2}s` }}
      >
        {/* Badge com efeitos tech */}
        <div className={`mb-4 w-12 h-12 rounded-full bg-gradient-to-r ${borderGradient} flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-110 ${isSpecial ? 'tech-badge-special' : 'tech-badge'}`}>
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="text-white font-bold text-sm relative z-10">{number}</span>
          {isSpecial && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full animate-ping"></div>
          )}
        </div>

        {/* Card com efeitos avançados */}
        <div className={`w-64 h-40 bg-gradient-to-r ${borderGradient} rounded-xl p-[2px] transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 ${isSpecial ? 'group-hover:shadow-amber-500/30' : 'group-hover:shadow-cyan-500/30'} tech-card ${isChooseCard ? 'group-hover:shadow-blue-500/40' : ''}`}>
          <div className="w-full h-full bg-zinc-900 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300 group-hover:bg-zinc-800">
            {/* Scan line effect */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
            
            {/* Ícone com animação flutuante */}
            <Icon 
              size={28} 
              weight="duotone" 
              className={`${color} mb-3 tech-icon transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_currentColor]`} 
            />
            
            <h3 className={`font-semibold text-base mb-2 ${color} transition-colors duration-300 group-hover:text-white`}>
              {title}
            </h3>
            <p className="text-zinc-300 text-xs text-center leading-relaxed transition-colors duration-300 group-hover:text-zinc-100">
              {description}
            </p>

            {/* Indicador de clique para o card "Escolha" */}
            {isChooseCard && (
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-4 h-4 border border-blue-400 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            )}

            {/* Efeitos de partículas */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-300"></div>
              <div className="absolute top-1/2 right-4 w-0.5 h-0.5 bg-pink-400 rounded-full animate-ping animation-delay-500"></div>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

function HowItWorksSimple() {
  return (
    <Section id="como-funciona" className="px-4 py-8 bg-zinc-950 text-white items-start justify-start min-h-0">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Habilidades que destacam você no mercado
          </h2>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Cursos práticos e objetivos para desenvolver suas habilidades. Aprenda fazendo e veja resultados reais na sua vida profissional.
          </p>
        </div>

        {/* Cards com Efeitos Dinâmicos */}
        <div className="w-full">
          {/* Mobile: Stack vertical */}
          <div className="flex flex-col items-center gap-8 lg:hidden">
            {STEPS.map((step, index) => (
              <SimpleCard key={step.number} step={step} index={index} />
            ))}
          </div>
          
          {/* Desktop: Timeline dinâmica sem setas */}
          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-12 timeline-dynamic">
            {STEPS.map((step, index) => (
              <div 
                key={step.number} 
                className="dynamic-step"
                style={{ 
                  animationDelay: `${index * 0.8}s`,
                  '--step-index': index 
                }}
              >
                <SimpleCard step={step} index={index} />
                
                {/* Ondas concêntricas */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="ripple-wave"></div>
                  <div className="ripple-wave ripple-wave-2"></div>
                  <div className="ripple-wave ripple-wave-3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default HowItWorksSimple; 