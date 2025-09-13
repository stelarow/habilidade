import useTypewriter from '../hooks/useTypewriter';
import Starfield from './Starfield';
import GradientButton from './GradientButton';
import Section from './Section';
import { Lightbulb, CheckCircle, Clock, Users } from '@phosphor-icons/react';
import { analytics } from '../utils/analytics';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const words = ['Inteligência Artificial', 'Design 3D', 'Programação', 'Marketing'];
  const text = useTypewriter(words);
  const navigate = useNavigate();

  return (
    <Section fullHeight={true} className="flex flex-col items-center justify-center text-center bg-zinc-950 overflow-visible pt-20 sm:pt-0">
      <Starfield />
      {/* Conteúdo */}
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4">
        <h1 className="text-white font-bold text-3xl sm:text-5xl leading-relaxed tracking-tight mb-10">
          {/* Brand identity + SEO optimization */}
          <span className="block text-5xl sm:text-7xl font-extrabold gradient-text animate-gradient mb-2">
            Escola Habilidade
          </span>
          <span className="block text-lg sm:text-xl text-purple-400 font-medium mb-6 tracking-wide">
            Cursos Profissionalizantes em São José e Grande Florianópolis
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
            Ver Cursos
          </GradientButton>
          <GradientButton 
            href="/teste-vocacional"
            className="px-6 text-sm"
            onClick={(e) => {
              e.preventDefault();
              navigate('/teste-vocacional');
            }}
          >
            Teste Vocacional
          </GradientButton>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-zinc-400">
          <div className="flex items-center gap-1">
            <CheckCircle size={14} className="text-green-400" />
            <span>Certificado Incluso</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-blue-400" />
            <span>Aulas Práticas</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} className="text-purple-400" />
            <span>Turmas Pequenas</span>
          </div>
        </div>
        
        {/* Seta de scroll para seção de cursos */}
        <button
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById('cursos');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          aria-label="Ir para seção de cursos"
          className="hidden sm:block absolute bottom-8 left-1/2 text-purple-500 hover:text-cyan-400 transition cursor-pointer p-2"
          style={{ 
            transform: 'translateX(-50%)', 
            animation: 'bounce 2s infinite' 
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
            <path d="M12 16.5a1 1 0 0 1-.707-.293l-6-6a1 1 0 1 1 1.414-1.414L12 14.086l5.293-5.293a1 1 0 0 1 1.414 1.414l-6 6A1 1 0 0 1 12 16.5z" />
          </svg>
        </button>
      </div>
    </Section>
  );
}

export default Hero; 