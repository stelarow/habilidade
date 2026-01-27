import useTypewriter from '../hooks/useTypewriter';
import Starfield from './Starfield';
import GradientButton from './GradientButton';
import Section from './Section';
import { Lightbulb, CheckCircle, Clock, Users, Star } from '@phosphor-icons/react';
import { analytics } from '../utils/analytics';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const words = ['Inteligência Artificial', 'Design 3D', 'Programação', 'Marketing'];
  const text = useTypewriter(words, 60, 1500); // Reduzido de 120ms para 60ms (2x mais rápido) e pause de 2000ms para 1500ms
  const navigate = useNavigate();

  return (
    <Section fullHeight={false} className="hero-section flex flex-col items-center justify-center text-center bg-zinc-950 overflow-visible pt-24 lg:pt-28 min-h-[75vh]">
      <Starfield />
      {/* Conteúdo */}
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4">
        <h1 className="text-white font-bold text-3xl sm:text-5xl leading-relaxed tracking-tight mb-10">
          {/* Brand identity + SEO optimization */}
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold gradient-text animate-gradient mb-2">
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
        
        {/* Social Proof Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} weight="fill" className="text-yellow-400" />
            ))}
          </div>
          <span className="text-zinc-300">
            <strong className="text-white">4.9</strong> no Google
            <span className="mx-2 text-zinc-500">|</span>
            <strong className="text-white">127+</strong> avaliações
          </span>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-zinc-400">
          <div className="flex items-center gap-1">
            <CheckCircle size={14} className="text-green-400" aria-hidden="true" />
            <span>Certificado Incluso</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-blue-400" aria-hidden="true" />
            <span>Aulas Práticas</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} className="text-purple-400" aria-hidden="true" />
            <span>Turmas Pequenas</span>
          </div>
        </div>
        
      </div>
    </Section>
  );
}

export default Hero; 