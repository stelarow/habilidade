'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GradientButton } from '../ui';
import Logo from './Logo';

interface HeaderProps {
  className?: string;
}

function Header({ className = '' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navigation = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Meus Cursos', href: '/courses' },
    { label: 'Perfil', href: '/profile' },
  ];

  return (
    <>
      {/* Skip Links */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-fuchsia-600 text-white px-4 py-2 rounded-md z-[60] transition-all"
      >
        Pular para o conteúdo principal
      </a>
      
      <header className={`fixed top-0 w-full bg-zinc-900/70 backdrop-blur-md z-50 border-b border-gray-800/50 ${className}`} role="banner">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16">
            
            <Logo />

            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map(({ label, href }) => (
                <Link 
                  key={href} 
                  href={href}
                  className="text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <GradientButton 
                href="/profile"
                className="hidden sm:inline-flex px-4 py-2 text-sm"
              >
                Meu Perfil
              </GradientButton>
              
              {/* Botão Mobile */}
              <button
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileMenuOpen}
                className="md:hidden flex flex-col justify-center gap-[3px] p-2 transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm"
              >
                <span className={`w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          <div className="fixed top-16 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-b border-gray-800/50 p-4">
            <nav className="flex flex-col gap-4">
              {navigation.map(({ label, href }) => (
                <Link 
                  key={href} 
                  href={href}
                  onClick={closeMobileMenu}
                  className="text-white hover:text-fuchsia-300 transition-colors px-2 py-1 rounded-sm"
                >
                  {label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-800">
                <GradientButton 
                  href="/profile"
                  className="w-full justify-center px-4 py-2"
                  onClick={closeMobileMenu}
                >
                  Meu Perfil
                </GradientButton>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;