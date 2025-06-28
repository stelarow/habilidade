import { useState } from 'react';

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-zinc-900/70 backdrop-blur-md z-50">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        <span className="text-white font-semibold">Escola Habilidade</span>

        {/* Navegação desktop */}
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#cursos" className="text-white hover:text-cyan-300 transition">Cursos Presenciais</a>
          <a href="#estrutura" className="text-white hover:text-cyan-300 transition">Estrutura</a>
          <a href="#instrutores" className="text-white hover:text-cyan-300 transition">Instrutores</a>
          <a href="#contato" className="text-white hover:text-cyan-300 transition">Contato</a>
        </nav>

        {/* CTA desktop */}
        <a
          href="https://wa.me/5548999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white px-4 py-2 rounded-md text-sm font-semibold shadow hover:opacity-90 transition"
        >
          Começar Agora
        </a>

        {/* Botão Hamburguer mobile */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
          className="md:hidden flex flex-col justify-center gap-[3px]"
        >
          <span className="w-6 h-0.5 bg-white" />
          <span className="w-6 h-0.5 bg-white" />
          <span className="w-6 h-0.5 bg-white" />
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden bg-zinc-900">
          <nav className="flex flex-col gap-4 px-4 py-4 text-sm">
            <a href="#cursos" className="text-white" onClick={() => setOpen(false)}>Cursos Presenciais</a>
            <a href="#estrutura" className="text-white" onClick={() => setOpen(false)}>Estrutura</a>
            <a href="#instrutores" className="text-white" onClick={() => setOpen(false)}>Instrutores</a>
            <a href="#contato" className="text-white" onClick={() => setOpen(false)}>Contato</a>
            <a
              href="https://wa.me/5548999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white px-4 py-2 rounded-md font-semibold shadow"
            >
              Começar Agora
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header; 