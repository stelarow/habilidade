import useTypewriter from '../hooks/useTypewriter';
import Starfield from './Starfield';
import GradientButton from './GradientButton';
import Section from './Section';

function Hero() {
  const words = ['Inteligência Artificial', 'Design 3D', 'Programação', 'Marketing'];
  const text = useTypewriter(words);

  return (
    <Section fullHeight={true} className="flex flex-col items-center justify-center text-center bg-zinc-950 overflow-visible">
      <Starfield />
      {/* Conteúdo */}
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4">
        <h1 className="text-white font-bold text-3xl sm:text-5xl leading-relaxed tracking-tight mb-10">
          {/* Texto fixo com efeito "lâmpada de lava" */}
          <span className="block text-6xl sm:text-8xl font-extrabold gradient-text animate-gradient mb-4">
            Habilidade em
          </span>

          {/* Texto dinâmico com máquina de escrever */}
          <span className="block gradient-text text-3xl sm:text-5xl pb-2">
            {text}
            {/* Barra piscante estilo cursor */}
            <span className="inline-block animate-blink text-white ml-0.5">|</span>
          </span>
        </h1>
        <p className="text-zinc-300 text-sm md:text-base lg:text-lg text-center max-w-2xl mx-auto leading-relaxed px-4">
          Aprenda hoje as habilidades que vão liderar o mercado de amanhã.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <GradientButton 
            href="#cursos" 
            className="px-6 py-3 text-sm"
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
        </div>
      </div>

      {/* Seta para próxima seção */}
      <a
        href="#cursos"
        aria-label="Ir para seção de cursos"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-fuchsia-500 hover:text-cyan-400 transition animate-bounce"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M12 16.5a1 1 0 0 1-.707-.293l-6-6a1 1 0 1 1 1.414-1.414L12 14.086l5.293-5.293a1 1 0 0 1 1.414 1.414l-6 6A1 1 0 0 1 12 16.5z" />
        </svg>
      </a>
    </Section>
  );
}

export default Hero; 