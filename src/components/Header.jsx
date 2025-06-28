import useToggle from '../hooks/useToggle';
import { NAV_LINKS } from '../constants/navigation.js';
import GradientButton from './GradientButton';

function Header() {
  const [open, toggleOpen, , setClose] = useToggle(false);

  return (
    <header className="fixed top-0 w-full bg-zinc-900/70 backdrop-blur-md z-50">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        <span className="text-white font-semibold">Escola Habilidade</span>

        {/* Navegação desktop */}
        <nav className="hidden md:flex gap-6 text-sm">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} className="text-white hover:text-cyan-300 transition">
              {label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <GradientButton
          href="https://wa.me/5548999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block px-4 py-2 text-sm"
        >
          Começar Agora
        </GradientButton>

        {/* Botão Hamburguer mobile */}
        <button
          onClick={toggleOpen}
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
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-white"
                onClick={setClose}
              >
                {label}
              </a>
            ))}
            <GradientButton
              href="https://wa.me/5548999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2"
            >
              Começar Agora
            </GradientButton>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header; 