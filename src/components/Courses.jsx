import Starfield from './Starfield';

function Courses() {
  return (
    <section id="cursos" className="relative flex flex-col items-center justify-center text-center min-h-screen px-4 bg-zinc-900 text-white">
      {/* Opcionalmente poderíamos reutilizar o starfield ou qualquer outro efeito de fundo */}
      <Starfield className="opacity-30" />

      <h2 className="text-3xl sm:text-5xl font-bold mb-6">Nossos Cursos</h2>
      <p className="max-w-lg text-zinc-300">
        Esta é uma seção placeholder. Aqui você poderá listar os cursos presenciais e online da Escola Habilidade.
      </p>
    </section>
  );
}

export default Courses; 