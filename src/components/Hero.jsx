import useTypewriter from '../hooks/useTypewriter';
import Starfield from './Starfield';
import GradientButton from './GradientButton';
import Section from './Section';
import { Lightbulb } from '@phosphor-icons/react';
import { analytics } from '../utils/analytics';

function Hero() {
  const words = ['Inteligência Artificial', 'Design 3D', 'Programação', 'Marketing'];
  const text = useTypewriter(words);

  return (
    <Section fullHeight={true} className="flex flex-col items-center justify-center text-center bg-zinc-950 overflow-visible">
      <Starfield />
      {/* Conteúdo */}
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4">
        <h1 className="text-white font-bold text-3xl sm:text-5xl leading-relaxed tracking-tight mb-10">
          {/* Brand identity + SEO optimization */}
          <span className="block text-5xl sm:text-7xl font-extrabold gradient-text animate-gradient mb-2">
            Escola Habilidade
          </span>
          <span className="block text-lg sm:text-xl text-purple-400 font-medium mb-6 tracking-wide">
            Cursos Profissionalizantes em Florianópolis e Região
          </span>

          {/* Texto dinâmico em duas linhas */}
          <span className="block text-2xl sm:text-3xl text-zinc-300 pb-2">
            Especialista em
          </span>
          <span className="block text-2xl sm:text-3xl text-zinc-300 pb-2">
            <span className="typewriter-container">
              {text}
              {/* Barra piscante estilo cursor */}
              <span className="inline-block animate-blink text-white ml-0.5">|</span>
            </span>
          </span>
        </h1>
        <p className="text-zinc-300 text-sm md:text-base lg:text-lg text-center max-w-2xl mx-auto leading-relaxed px-4">
          Aprenda hoje as habilidades que vão liderar o mercado de amanhã.
        </p>
        
        {/* Mensagem contextual para o teste vocacional */}
        <p className="text-purple-400 text-xs md:text-sm text-center mt-6 mb-2 animate-pulse">
          Não sabe qual curso escolher? Descubra em 5 minutos!
        </p>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <GradientButton 
            href="#cursos" 
            className="px-6 text-sm"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('cursos');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Conheça nossos cursos
          </GradientButton>
          <GradientButton 
            href="/teste-vocacional" 
            className="px-6 text-sm bg-purple-600 border border-purple-500 shadow-purple"
          >
            Teste Vocacional
          </GradientButton>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>+500 alunos formados</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Certificados reconhecidos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>Melhor curso presencial em SC</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
          >
            Ver Cursos
          </GradientButton>
          
          <GradientButton 
            href="/teste-vocacional"
            className="px-6 text-sm border-2 border-purple-500/50 bg-transparent hover:bg-purple-500/10 transition-all group"
            onClick={() => {
              analytics.trackHeroTestClick();
            }}
          >
            <Lightbulb className="w-4 h-4 mr-2 inline-block group-hover:text-yellow-400 transition-colors" />
            Teste Vocacional Grátis
          </GradientButton>
        </div>
      </div>

      {/* Seta para próxima seção */}
      <button
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById('cursos');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        aria-label="Ir para seção de cursos"
        className="absolute bottom-4 left-1/2 text-fuchsia-500 hover:text-cyan-400 transition cursor-pointer p-2 min-w-[48px] min-h-[48px] flex items-center justify-center"
        style={{ 
          transform: 'translateX(-50%)', 
          animation: 'bounce 2s infinite' 
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10">
          <path d="M12 16.5a1 1 0 0 1-.707-.293l-6-6a1 1 0 1 1 1.414-1.414L12 14.086l5.293-5.293a1 1 0 0 1 1.414 1.414l-6 6A1 1 0 0 1 12 16.5z" />
        </svg>
      </button>
    </Section>
  );
}

export default Hero; 