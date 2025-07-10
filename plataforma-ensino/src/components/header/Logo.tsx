'use client';

import Link from 'next/link';
import { LogoH } from '../ui';

interface LogoProps {
  className?: string;
}

function Logo({ className = '' }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={`logo-container group flex items-center gap-3 focus:outline-none ${className}`}
    >
      {/* "H" Estilizada - Logo da Escola */}
      <div className="logo-wrapper relative">
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-lg opacity-0 group-hover:opacity-20 group-focus:opacity-20 transition-opacity duration-300 transform scale-110" />
        <LogoH 
          size="medium"
          animated={true}
          showFullText={true}
          className="relative transition-all duration-300 group-hover:scale-105 group-focus:scale-105"
        />
      </div>
      
      {/* Tagline */}
      <div className="logo-text-container hidden lg:block">
        <span className="tagline block text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          Plataforma de Ensino
        </span>
      </div>
    </Link>
  );
}

export default Logo;