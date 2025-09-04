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

export default Hero; 