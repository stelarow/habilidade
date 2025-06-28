import useTypewriter from '../hooks/useTypewriter';
import useScrollTransform from '../hooks/useScrollTransform';
import Starfield from './Starfield';

function Hero() {
  const words = ['Inteligência Artificial', 'Design 3D', 'Programação', 'Marketing'];
  const text = useTypewriter(words);
  const taglineRef = useScrollTransform();

  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-4 bg-zinc-950 overflow-visible">
      <Starfield />
      {/* Conteúdo */}
      <h1 className="text-white font-bold text-3xl sm:text-5xl leading-relaxed tracking-tight max-w-2xl mb-10">
        {/* Texto fixo com efeito "lâmpada de lava" */}
        <span className="inline-block text-6xl sm:text-8xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
          Habilidade em
        </span>

        {/* Texto dinâmico com máquina de escrever */}
        <span className="block bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent text-3xl sm:text-5xl pb-2">
          {text}
          {/* Barra piscante estilo cursor */}
          <span className="inline-block animate-blink text-white ml-0.5">|</span>
        </span>
      </h1>
      {(() => {
        const sentence = 'Aprenda hoje as habilidades que vão liderar o mercado de amanhã.';
        return (
          <p ref={taglineRef} className="mt-16 text-zinc-300 text-sm sm:text-base whitespace-nowrap">
            {sentence.split(' ').map((word, i) => (
              <span
                key={i}
                style={{ animationDelay: `${i * 0.08}s` }}
                className="inline-block mr-1 word-fade"
              >
                {word}
              </span>
            ))}
          </p>
        );
      })()}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <a
          href="#como-funciona"
          className="btn-neon bg-zinc-900/70 text-white px-6 py-3 rounded-md font-semibold hover:bg-zinc-900 transition text-sm"
        >
          Ver Como Funciona
        </a>
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
    </section>
  );
}

export default Hero; 