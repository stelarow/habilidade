import useToggle from '../hooks/useToggle';
import { NAV_LINKS } from '../constants/navigation.js';
import GradientButton from './GradientButton';

function Header() {
  const [open, toggleOpen, , setClose] = useToggle(false);

  return (
    <>
      {/* Skip Links para acessibilidade */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-fuchsia-600 text-white px-4 py-2 rounded-md z-[60] transition-all"
      >
        Pular para o conteúdo principal
      </a>
      
      <header className="fixed top-0 w-full bg-zinc-900/70 backdrop-blur-md z-50" role="banner">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        <span className="text-white font-semibold">Escola Habilidade</span>

        {/* Navegação desktop */}
        <nav className="hidden md:flex gap-6 text-sm" role="navigation" aria-label="Navegação principal">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} className="text-white hover:text-cyan-300 transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-sm">
              {label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <GradientButton
          href="https://wa.me/5548988559491"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block px-4 py-2 text-sm"
        >
          Começar Agora
        </GradientButton>

        {/* Botão Hamburguer mobile */}
        <button
          onClick={toggleOpen}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden flex flex-col justify-center gap-[3px] p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-sm"
        >
          <span className={`w-6 h-0.5 bg-white transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

        {/* Menu mobile */}
        {open && (
          <div id="mobile-menu" className="md:hidden bg-zinc-900">
            <nav className="flex flex-col gap-4 px-4 py-4 text-sm" role="navigation" aria-label="Menu mobile">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-sm"
                  onClick={setClose}
                >
                  {label}
                </a>
              ))}
              <GradientButton
                href="https://wa.me/5548988559491"
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
    </>
  );
}

export default Header; 