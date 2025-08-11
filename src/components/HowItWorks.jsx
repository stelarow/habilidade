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
    description: 'Aula experimental sem compromisso - prove antes de comprar',
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
    description: 'Construa portfólio e conquiste melhores oportunidades',
    icon: Rocket,
    color: 'text-purple-400',
    borderGradient: 'from-purple-500/60 to-pink-400/60',
  },
];

function StepCard({ step, index, isLast }) {
  const [ref, visible] = useInView();
  const { number, title, description, icon: Icon, color, borderGradient, isSpecial } = step;

  return (
    <div
      ref={ref}
      className={`step-card ${visible ? 'in-view' : ''} relative flex flex-col items-center text-center group`}
      style={{ animationDelay: `${index * 0.3}s` }}
    >
      {/* Badge com número - Efeito Tech */}
      <div className={`mb-4 w-14 h-14 rounded-full bg-gradient-to-r ${borderGradient} flex items-center justify-center relative overflow-hidden tech-badge ${isSpecial ? 'special-badge' : ''}`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 tech-shine"></div>
        <span className="text-white font-bold text-lg relative z-10 group-hover:scale-125 transition-transform duration-300">{number}</span>
        {isSpecial && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full animate-ping"></div>
        )}
      </div>

      {/* Card do passo - Efeito Neon */}
      <div className={`relative w-64 h-44 lg:w-72 lg:h-48 xl:w-80 xl:h-52 bg-gradient-to-r ${borderGradient} rounded-xl p-[3px] tech-card ${isSpecial ? 'special-card group-hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]' : 'group-hover:shadow-[0_0_30px_rgba(0,196,255,0.4)]'} transition-all duration-500`}>
        <div className="w-full h-full bg-zinc-900 rounded-xl p-4 md:p-5 text-center relative overflow-hidden flex flex-col justify-center">
          {/* Efeito de scan line */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse scan-line"></div>
          
          <Icon 
            size={32} 
            weight="duotone" 
            className={`${color} mx-auto mb-4 tech-icon group-hover:drop-shadow-[0_0_8px_currentColor] transition-all duration-500 flex-shrink-0`} 
          />
          <h3 className={`font-semibold text-lg mb-3 ${color} group-hover:text-white transition-all duration-300 tech-text leading-tight`}>
            {title}
          </h3>
          <p className="text-zinc-300 text-sm leading-relaxed group-hover:text-zinc-100 transition-all duration-300 px-2">
            {description}
          </p>

          {/* Efeito de partículas */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-300"></div>
            <div className="absolute top-1/2 right-4 w-0.5 h-0.5 bg-pink-400 rounded-full animate-ping animation-delay-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <Section id="como-funciona" className="px-4 py-16 bg-zinc-950 text-white items-start justify-start min-h-0">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header da seção */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Habilidades que destacam você no mercado
          </h2>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Cursos práticos e objetivos para desenvolver suas habilidades. Aprenda fazendo e veja resultados reais na sua vida profissional.
          </p>
          <GradientButton 
            href="#cursos" 
            className="px-8 py-3"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('cursos');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            VEJA COMO FUNCIONA
          </GradientButton>
        </div>

        {/* Timeline dos passos */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <StepCard
                step={step}
                index={index}
                isLast={index === STEPS.length - 1}
              />
              {index < STEPS.length - 1 && (
                <div className="hidden md:flex items-center mx-3">
                  <div className="w-8 h-0.5 bg-zinc-600"></div>
                  <div className="w-0 h-0 border-l-[6px] border-l-zinc-600 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default HowItWorks; 