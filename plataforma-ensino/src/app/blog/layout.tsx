'use client';

import React from 'react';
import BlogErrorBoundary from '@/components/blog/BlogErrorBoundary';
import { useBlogErrorRecovery } from '@/hooks/useBlogErrorRecovery';

interface BlogLayoutProps {
  children: React.ReactNode;
}

// Inner component that uses the hook
function BlogLayoutInner({ children }: BlogLayoutProps) {
  const {
    attemptRecovery,
    canRetry,
    isRecovering,
    resetRecoveryState
  } = useBlogErrorRecovery({
    maxRetries: 3,
    enableAutomaticRecovery: true,
    onRecoverySuccess: (strategy, attempts) => {
      console.log(`Recovery successful with ${strategy} after ${attempts} attempts`);
    },
    onRecoveryFailure: (strategy, error) => {
      console.error(`Recovery failed with ${strategy}:`, error);
    }
  });

  const handleRetry = () => {
    resetRecoveryState();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Top-level Blog Error Boundary */}
      <BlogErrorBoundary
        fallbackType="generic"
        onError={(error, errorInfo) => {
          console.error('Blog layout error:', error, errorInfo);
          // Could trigger recovery here if needed
        }}
        showErrorDetails={process.env.NODE_ENV === 'development'}
      >
        {/* Navigation Error Boundary */}
        <BlogErrorBoundary fallbackType="generic">
          <BlogNavigation />
        </BlogErrorBoundary>

        {/* Main Content with Context-Aware Error Boundary */}
        <main className="container mx-auto px-4 py-8">
          <BlogErrorBoundary
            fallbackType="list" // Default for main content area
            onError={(error, errorInfo) => {
              // Attempt automatic recovery for main content errors
              import('@/hooks/useBlogErrorRecovery').then(({ ErrorType }) => {
                attemptRecovery(ErrorType.COMPONENT, error);
              });
            }}
          >
            {children}
          </BlogErrorBoundary>
        </main>

        {/* Footer Error Boundary */}
        <BlogErrorBoundary fallbackType="generic">
          <BlogFooter />
        </BlogErrorBoundary>
      </BlogErrorBoundary>
    </div>
  );
}

// Blog Navigation Component with its own error boundary
function BlogNavigation() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold text-purple-600">
              Habilidade
            </a>
            
            {/* Navigation items with individual error boundaries */}
            <div className="hidden md:flex space-x-6">
              <BlogErrorBoundary fallbackType="generic">
                <NavItem href="/blog" label="Blog" />
              </BlogErrorBoundary>
              
              <BlogErrorBoundary fallbackType="generic">
                <NavItem href="/blog/categories" label="Categorias" />
              </BlogErrorBoundary>
              
              <BlogErrorBoundary fallbackType="generic">
                <SearchWidget />
              </BlogErrorBoundary>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <BlogErrorBoundary fallbackType="generic">
              <NewsletterButton />
            </BlogErrorBoundary>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Individual navigation components with error protection
function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href}
      className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {label}
    </a>
  );
}

function SearchWidget() {
  return (
    <BlogErrorBoundary fallbackType="search">
      <div className="relative">
        <input
          type="search"
          placeholder="Buscar..."
          className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </BlogErrorBoundary>
  );
}

function NewsletterButton() {
  return (
    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
      Newsletter
    </button>
  );
}

// Blog Footer Component
function BlogFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Company Info */}
          <BlogErrorBoundary fallbackType="generic">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Escola Habilidade</h3>
              <p className="text-gray-600 text-sm">
                Educa��o profissional de qualidade para transformar carreiras.
              </p>
            </div>
          </BlogErrorBoundary>

          {/* Quick Links */}
          <BlogErrorBoundary fallbackType="generic">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Links R�pidos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/blog" className="text-gray-600 hover:text-purple-600">Blog</a></li>
                <li><a href="/cursos" className="text-gray-600 hover:text-purple-600">Cursos</a></li>
                <li><a href="/sobre" className="text-gray-600 hover:text-purple-600">Sobre</a></li>
                <li><a href="/contato" className="text-gray-600 hover:text-purple-600">Contato</a></li>
              </ul>
            </div>
          </BlogErrorBoundary>

          {/* Categories */}
          <BlogErrorBoundary fallbackType="generic">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/blog/category/carreira" className="text-gray-600 hover:text-purple-600">Carreira</a></li>
                <li><a href="/blog/category/educacao" className="text-gray-600 hover:text-purple-600">Educa��o</a></li>
                <li><a href="/blog/category/tecnologia" className="text-gray-600 hover:text-purple-600">Tecnologia</a></li>
                <li><a href="/blog/category/desenvolvimento" className="text-gray-600 hover:text-purple-600">Desenvolvimento</a></li>
              </ul>
            </div>
          </BlogErrorBoundary>

          {/* Newsletter */}
          <BlogErrorBoundary fallbackType="generic">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Newsletter</h4>
              <p className="text-gray-600 text-sm mb-4">
                Receba nossos melhores conte�dos.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition-colors text-sm">
                  Inscrever
                </button>
              </div>
            </div>
          </BlogErrorBoundary>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            � 2024 Escola Habilidade. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Layout Component (Server Component)
export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <BlogLayoutInner>
      {children}
    </BlogLayoutInner>
  );
}